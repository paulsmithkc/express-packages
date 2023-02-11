import { resolve as pathResolve } from 'path';
import { readdir, stat, copyFile, symlink, rm } from 'node:fs/promises';
import os from 'node:os';

const USE_SYMLINK = os.platform() !== 'win32';

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
    await copyToPackage(packagePath, 'jest.config.json', USE_SYMLINK);
    await copyToPackage(packagePath, 'LICENSE', false); // license must be an actual file
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

main();
