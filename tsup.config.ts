import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  const esm: boolean = !!(options.format === 'esm' || options.format?.includes('esm'));

  return {
    entry: [esm ? 'src/index.mts' : 'src/index.ts'],
    target: ['node16', 'es2020'],
    clean: false,
    sourcemap: false,
    splitting: false,
    dts: esm,
  };
});
