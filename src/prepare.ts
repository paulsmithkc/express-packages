import { resolve as pathResolve } from 'path';
import { readdir, stat, copyFile, symlink, rm } from 'node:fs/promises';

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

    await copyToPackage(packagePath, '.npmignore', false);
    await copyToPackage(packagePath, 'tsconfig.json', false);
    await copyToPackage(packagePath, 'jest.config.json', false);
    await copyToPackage(packagePath, 'LICENSE', false);
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
