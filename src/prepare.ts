import { resolve as pathResolve } from 'path';
import { readdir, stat, copyFile, symlink, rm, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { isEqual } from 'lodash';

const USE_SYMLINK = os.platform() !== 'win32' || process.argv.includes('--link', 2);

async function main() {
  const packagesPath = pathResolve('./packages');
  const packagesList = await readdir(packagesPath);
  for (const packageName of packagesList) {
    if (packageName.startsWith('.')) {
      continue;
    }

    const packagePath = pathResolve(packagesPath, packageName);
    const packageStat = await stat(packagePath);
    if (!packageStat.isDirectory()) {
      continue;
    }

    await copyToPackage(USE_SYMLINK, packagePath, '.npmignore', '.npmignore'); // needed for pack & publish
    await copyToPackage(USE_SYMLINK, packagePath, 'tsconfig.package.json', 'tsconfig.json'); // needed for local build
    await copyToPackage(false, packagePath, 'jest.config.json'); // jest config doesn't work with symlinks
    await copyToPackage(false, packagePath, 'LICENSE'); // license must be an actual file

    await fixMetadata(packagePath, packageName);
  }
}

async function copyToPackage(link: boolean, packagePath: string, srcFile: string, dstFile?: string) {
  const srcPath = pathResolve(srcFile);
  const dstPath = pathResolve(packagePath, dstFile || srcFile);
  await rm(dstPath, { force: true });
  if (!link) {
    await copyFile(srcPath, dstPath);
  } else {
    await symlink(srcPath, dstPath);
  }
}

async function fixMetadata(packagePath: string, packageName: string) {
  const metadataPath = pathResolve(packagePath, 'package.json');
  const metadataStat = await stat(metadataPath);
  if (!metadataStat.isFile()) {
    console.error(`${metadataPath} missing`);
    return;
  }

  const metadataBuffer: Buffer = await readFile(metadataPath);
  const metadata: any = JSON.parse(metadataBuffer.toString('utf8'));
  let modified = false;

  const fix = (key: string, expected: any) => {
    if (!isEqual(metadata[key], expected)) {
      metadata[key] = expected;
      modified = true;
    }
  };

  fix('name', packageName);
  fix('author', 'Paul Smith');
  fix('license', 'MIT');
  fix('private', false);
  fix('repository', {
    type: 'git',
    url: 'git+https://github.com/paulsmithkc/express-packages',
  });
  fix('bugs', {
    url: 'https://github.com/paulsmithkc/express-packages/issues',
  });
  fix('homepage', `https://github.com/paulsmithkc/express-packages/tree/main/packages/${packageName}#readme`);
  fix('scripts', {
    build: 'npx tsc',
    test: 'npx jest --collectCoverage',
    example: 'npx nodemon ./examples/server.js',
    pretest: 'npm run build',
    prepack: 'npm run build',
    prepublish: 'npm run build',
    preexample: 'npm run build',
  });

  if (modified) {
    console.log('modified', metadataPath);
    const output = Buffer.from(JSON.stringify(metadata, null, 2));
    await writeFile(metadataPath, output);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
