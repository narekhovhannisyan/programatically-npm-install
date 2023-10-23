import {spawn} from 'node:child_process';
import {IImpactModelInterface} from '../lib';

/**
 * Spawns child process using promise.
 */
const spawnPromise = (cmd: string, args: readonly string[]) =>
  new Promise((resolve, reject) => {
    const process = spawn(cmd, args);
    process.on('close', resolve);
    process.on('error', reject);
  });

/**
 * Installs package using `npm`.
 */
const npmInstallPackage = (modulus: string) => {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  return spawnPromise(npm, ['install', modulus, '--s']).then(() => {
    if (modulus.includes('github')) {
      const parts = modulus.split('/');
      const moduleName = parts[parts.length - 1];

      return moduleName;
    }

    return modulus;
  });
};

npmInstallPackage('https://github.com/narekhovhannisyan/boavizta-cpu-model')
  .then(async moduleName => {
    const model: IImpactModelInterface = await import(moduleName);

    console.log(model);
  })
  .catch(console.error);
