import { register } from 'node:module';
import { createRequire } from 'node:module';

const serviceDirUrl = new URL('./', import.meta.url);
const require = createRequire(import.meta.url);

process.env.TS_NODE_PROJECT = new URL('./tsconfig.json', import.meta.url).pathname;
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'NodeNext',
  moduleResolution: 'NodeNext',
});

register('ts-node/esm', serviceDirUrl);

require('tsconfig-paths/register');
await import('./src/main.ts');
