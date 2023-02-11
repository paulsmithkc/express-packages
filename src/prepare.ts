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

    await copyToPackage(packagePath, '.npmignore');
    await copyToPackage(packagePath, 'tsconfig.json');
    await copyToPackage(packagePath, 'jest.config.ts');
    await copyToPackage(packagePath, 'LICENSE');
  }
}

async function copyToPackage(packagePath: string, fileName: string) {
  const srcPath = pathResolve(fileName);
  const dstPath = pathResolve(packagePath, fileName);
  await copyFile(srcPath, dstPath);
  // await rm(dstPath, { force: true });
  // await symlink(srcPath, dstPath);
}

main();
