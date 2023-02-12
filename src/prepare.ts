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

    await copyToPackage(packagePath, '.npmignore', USE_SYMLINK);
    await copyToPackage(packagePath, 'tsconfig.json', USE_SYMLINK);
    await copyToPackage(packagePath, 'jest.config.json', false); // jest config doesn't work with symlinks
    await copyToPackage(packagePath, 'LICENSE', false); // license must be an actual file

    await fixMetadata(packagePath, packageName);
  }
}

async function copyToPackage(packagePath: string, fileName: string, link: boolean) {
  const srcPath = pathResolve(fileName);
  const dstPath = pathResolve(packagePath, fileName);
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
