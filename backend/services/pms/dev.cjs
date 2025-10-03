// services/pms/dev.cjs

// Point dotenv to the repo root .env
const path = require('path');
process.env.DOTENV_CONFIG_PATH = path.resolve(__dirname, '../../.env');

// Load env + reflect metadata BEFORE Nest bootstraps
require('dotenv/config');
require('reflect-metadata');

// Ensure ts-node compiles as CommonJS at runtime and generates decorator metadata
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ 
  module: 'CommonJS',
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  strict: false
});

// Register ts-node and path aliases
require('ts-node/register');
require('tsconfig-paths/register');

// Start your TS entry
require('./src/index.ts');
