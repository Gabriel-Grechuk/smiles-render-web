import type { BuildConfig } from 'bun';

const output = await Bun.build({
  entrypoints: ['./src/frontend/index.tsx'],
  outdir: './src/static/build',
  minify: true,
  target: 'browser',
  format: 'esm',
  env: 'inline',
  drop: ['console'],
} as BuildConfig);

if (!output.success) {
  console.log('[ ERR ] - Seems that we have some problems at the build...');
  for (const log of output.logs) console.log('Error: ', log);
  process.exit(1);
} else {
  console.log('[ OK ] - Success!');
  for (const log of output.outputs) console.log('Error: ', log);
}
