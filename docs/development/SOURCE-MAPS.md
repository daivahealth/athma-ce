# TypeScript Source Maps for Better Stack Traces

## Overview

This document describes the implementation of source map support in TypeScript Node.js applications to get accurate stack traces that point to your original TypeScript code instead of compiled JavaScript.

## The Problem

### Without Source Maps

When TypeScript code is compiled to JavaScript, stack traces show the **compiled JavaScript line numbers**, making debugging nearly impossible.

**TypeScript code (`src/services/patient.service.ts`):**
```typescript
// Line 45
export class PatientService {
  async findOne(id: string) {
    const patient = await this.repository.findUnique({ where: { id } });
    if (!patient) {
      throw new Error('Patient not found'); // Line 49
    }
    return patient;
  }
}
```

**Compiled JavaScript (`dist/services/patient.service.js`):**
```javascript
// After compilation, actual error is on line 127
class PatientService {
    async findOne(id) {
        const patient = await this.repository.findUnique({ where: { id } });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    }
}
```

**Error Stack Trace (WITHOUT source maps):**
```
Error: Patient not found
    at PatientService.findOne (/app/dist/services/patient.service.js:127:19)
    at async /app/dist/controllers/patient.controller.js:87:24
```

❌ **Line 127 in compiled JS** - Completely useless for debugging!

### With Source Maps

**Error Stack Trace (WITH source maps):**
```
Error: Patient not found
    at PatientService.findOne (/app/src/services/patient.service.ts:49:13)
    at async PatientController.findOne (/app/src/controllers/patient.controller.ts:32:24)
```

✅ **Line 49 in original TypeScript** - Exactly where you wrote the code!

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  TypeScript Source Files (src/)                     │
│  - patient.service.ts                               │
│  - patient.controller.ts                            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼ (tsc compilation)
┌─────────────────────────────────────────────────────┐
│  Compiled JavaScript (dist/)                        │
│  - patient.service.js                               │
│  - patient.service.js.map ← Source Map              │
│  - patient.controller.js                            │
│  - patient.controller.js.map ← Source Map           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼ (node --enable-source-maps)
┌─────────────────────────────────────────────────────┐
│  Runtime (Node.js)                                  │
│  1. Error occurs in JS                              │
│  2. Node reads .js.map file                         │
│  3. Maps JS line → TS line                          │
│  4. Shows original TypeScript stack trace           │
└─────────────────────────────────────────────────────┘
```

## Implementation

### Step 1: Install source-map-support

```bash
npm install source-map-support
npm install --save-dev @types/source-map-support
```

### Step 2: Configure TypeScript to Generate Source Maps

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,              // ← Generate .js.map files
    "inlineSources": true,          // ← Embed original TS in source maps
    "declaration": true,
    "declarationMap": true,         // ← Generate .d.ts.map files
    "removeComments": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

**Key Options:**
- `"sourceMap": true` - Generates `.js.map` files alongside `.js` files
- `"inlineSources": true` - Embeds original TypeScript source in map (useful for production debugging)
- `"declarationMap": true` - Maps `.d.ts` files back to source (useful for libraries)

### Step 3: Enable Source Maps in Application

**`src/main.ts` (First line!):**

```typescript
// MUST be the very first import
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { logger } from './common/logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    bufferLogs: true,
  });

  // ... rest of your bootstrap code

  const port = process.env.PORT ?? 3010;
  await app.listen(port);

  logger.info(
    { port, environment: process.env.NODE_ENV || 'development' },
    `Service started successfully on http://localhost:${port}`,
  );
}

bootstrap().catch((error) => {
  logger.fatal({ error }, 'Service failed to bootstrap');
  process.exit(1);
});
```

### Step 4: Update Package.json Scripts

**`package.json`:**

```json
{
  "name": "@zeal/clinical",
  "scripts": {
    "build": "tsc -p tsconfig.build.json",

    "start": "node --enable-source-maps dist/main.js",

    "dev": "NODE_ENV=development ts-node --project tsconfig.build.json src/main.ts",

    "dev:debug": "NODE_ENV=development LOG_LEVEL=debug ts-node --project tsconfig.build.json src/main.ts",

    "type-check": "tsc --noEmit -p tsconfig.build.json",

    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@nestjs/common": "^10.2.0",
    "@nestjs/core": "^10.2.0",
    "source-map-support": "^0.5.21"
  },
  "devDependencies": {
    "@types/source-map-support": "^0.5.10",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.0"
  }
}
```

**Key Script Updates:**
- `start`: Added `--enable-source-maps` flag for production
- `dev`: Uses `ts-node` which has built-in source map support
- `build`: TypeScript compiler generates source maps automatically

## Verification

### Step 1: Build the Application

```bash
npm run build
```

**Check that .map files are generated:**
```bash
ls -la dist/

# You should see:
# main.js
# main.js.map          ← Source map file
# app.module.js
# app.module.js.map
# services/patient.service.js
# services/patient.service.js.map
```

### Step 2: Inspect a Source Map File

```bash
cat dist/services/patient.service.js.map
```

**Example .map file:**
```json
{
  "version": 3,
  "file": "patient.service.js",
  "sourceRoot": "",
  "sources": ["../../src/services/patient.service.ts"],
  "names": [],
  "mappings": ";;;AAAA,2CAA0C;AAE1C,MAAa,cAAc;...",
  "sourcesContent": ["import { Injectable } from '@nestjs/common';\n\n..."]
}
```

### Step 3: Test Stack Traces

**Create a test error in your code:**

```typescript
// src/test/error-test.ts
export function testError() {
  throw new Error('Testing source maps!');
}

// src/main.ts
import { testError } from './test/error-test';

async function bootstrap() {
  testError(); // This will throw an error
  // ...
}
```

**Run in development:**
```bash
npm run dev
```

**Output (with source maps):**
```
Error: Testing source maps!
    at testError (/Users/you/zeal/backend/services/clinical/src/test/error-test.ts:2:9)
    at bootstrap (/Users/you/zeal/backend/services/clinical/src/main.ts:14:3)
```

✅ **Points to TypeScript files with correct line numbers!**

**Run in production:**
```bash
npm run build
npm run start
```

**Output (with --enable-source-maps):**
```
Error: Testing source maps!
    at testError (/app/src/test/error-test.ts:2:9)
    at bootstrap (/app/src/main.ts:14:3)
```

✅ **Still shows TypeScript files even in production!**

## Development vs Production

### Development (ts-node)

```bash
npm run dev
# Uses ts-node which has built-in source map support
# No compilation step needed
# Slower startup, but instant feedback
```

**Pros:**
- Automatic source maps
- No build step
- Fast iteration

**Cons:**
- Slower startup
- Higher memory usage

### Production (compiled)

```bash
npm run build
npm run start
# Uses compiled JavaScript with --enable-source-maps
# Reads .js.map files at runtime
```

**Pros:**
- Faster startup
- Lower memory usage
- Still get TypeScript stack traces

**Cons:**
- Requires build step
- Must include .map files in deployment

## Best Practices

### 1. Always Import source-map-support First

```typescript
// ✅ Correct
import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';

// ❌ Wrong
import { NestFactory } from '@nestjs/core';
import 'source-map-support/register'; // Too late!
```

### 2. Include Source Maps in Production Deployments

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy both .js and .js.map files
COPY dist/ ./dist/
COPY node_modules/ ./node_modules/
COPY package.json ./

# Run with source maps enabled
CMD ["node", "--enable-source-maps", "dist/main.js"]
```

### 3. Use inlineSources for Better Debugging

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true  // ← Embeds original TS in .map
  }
}
```

This allows debugging even if source files aren't deployed.

### 4. Enable in CI/CD

```yaml
# .github/workflows/deploy.yml
jobs:
  build:
    steps:
      - run: npm run build
      - run: |
          # Test that source maps work
          node --enable-source-maps dist/main.js --check-source-maps
```

### 5. Monitor Source Map Size

Large source maps can slow down error handling:

```bash
# Check map file sizes
du -sh dist/**/*.map

# If too large, disable inlineSources in production
```

## Debugging with Source Maps

### 1. Node.js Debugger

**VS Code `launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Clinical Service",
      "program": "${workspaceFolder}/backend/services/clinical/src/main.ts",
      "preLaunchTask": "tsc: build - tsconfig.build.json",
      "outFiles": ["${workspaceFolder}/backend/services/clinical/dist/**/*.js"],
      "sourceMaps": true,
      "smartStep": true,
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

Set breakpoints in `.ts` files, debugger will work correctly.

### 2. Chrome DevTools

```bash
node --inspect --enable-source-maps dist/main.js
```

Open `chrome://inspect` and you'll see TypeScript sources.

### 3. Production Debugging

```bash
# Enable detailed stack traces
NODE_OPTIONS='--enable-source-maps --stack-trace-limit=100' npm start
```

## Troubleshooting

### Issue 1: Stack Traces Still Show .js Files

**Cause:** Source maps not enabled or not found

**Solution:**
```bash
# Check that --enable-source-maps is in start script
node --enable-source-maps dist/main.js

# Verify .map files exist
ls dist/**/*.map

# Check sourceMap is true in tsconfig.json
```

### Issue 2: Source Maps Not Generated

**Cause:** `sourceMap: false` or compilation error

**Solution:**
```bash
# Clean and rebuild
npm run clean
npm run build

# Check for TypeScript errors
npm run type-check
```

### Issue 3: Wrong Line Numbers

**Cause:** Stale source maps (code changed but not rebuilt)

**Solution:**
```bash
# Always rebuild after code changes
npm run build

# Or use watch mode
npm run build -- --watch
```

### Issue 4: Large Memory Usage

**Cause:** Large source maps with `inlineSources`

**Solution:**
```json
// For production, disable inlineSources
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": false  // ← Smaller maps
  }
}
```

## Performance Impact

| Configuration | Build Time | Runtime Overhead | File Size |
|--------------|------------|------------------|-----------|
| No source maps | Fast | None | Smallest |
| sourceMap: true | +10% | <1ms per error | +50% |
| + inlineSources | +15% | <1ms per error | +100% |

**Recommendation:**
- Development: Use `inlineSources: true`
- Production: Use `inlineSources: false` (deploy source separately if needed)

## Security Considerations

### Should You Deploy Source Maps to Production?

**Pros:**
- Better debugging in production
- Faster incident resolution
- More helpful error reports

**Cons:**
- Exposes original source code
- Larger deployment size
- Potential IP concerns

**Best Practice:**
1. **Deploy .map files** to production servers
2. **Don't serve .map files** to clients (configure nginx/CDN to block `*.map`)
3. **Use private source map services** (Sentry, Datadog) for analysis

### Nginx Configuration (Block .map files)

```nginx
location ~ \.map$ {
  deny all;
  return 404;
}
```

## Integration with Error Tracking

### Sentry

```typescript
import * as Sentry from '@sentry/node';
import 'source-map-support/register';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.RewriteFrames({
      root: global.__dirname,
    }),
  ],
});
```

Sentry will automatically use source maps for error reporting.

### Datadog

```typescript
import tracer from 'dd-trace';

tracer.init({
  logInjection: true,
  runtimeMetrics: true,
  sourceMaps: true,  // ← Enable source map support
});
```

## Advanced: Source Maps for Libraries

If you're building a shared library:

**`tsconfig.json` for library:**
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,     // ← Maps .d.ts to .ts
    "sourceMap": true,
    "inlineSources": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**`package.json` for library:**
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/**/*.js",
    "dist/**/*.d.ts",
    "dist/**/*.map"     // ← Include maps in npm package
  ]
}
```

## Testing Source Maps

**Create a test script:**

```typescript
// src/test/source-map-test.ts
export function testSourceMaps() {
  const stack = new Error().stack;
  console.log('Stack trace:', stack);

  if (stack?.includes('.ts:')) {
    console.log('✅ Source maps working!');
  } else {
    console.log('❌ Source maps not working');
  }
}

// In main.ts
testSourceMaps();
```

## Comparison with Alternatives

| Approach | Accuracy | Performance | Setup |
|----------|----------|-------------|-------|
| No source maps | ❌ Wrong lines | ⚡ Fastest | None |
| source-map-support | ✅ Correct | ⚡ Fast (<1ms) | Simple |
| ts-node (dev) | ✅ Correct | 🐌 Slower startup | Simple |
| Babel source maps | ✅ Correct | ⚡ Fast | Complex |

**Winner: source-map-support** - Best balance of accuracy, performance, and simplicity.

## References

- [source-map-support](https://github.com/evanw/node-source-map-support)
- [Node.js Source Maps](https://nodejs.org/api/cli.html#--enable-source-maps)
- [TypeScript Source Maps](https://www.typescriptlang.org/tsconfig#sourceMap)
- [Source Map Specification](https://sourcemaps.info/spec.html)

## Summary

✅ **Always enable source maps** for better debugging
✅ **Import 'source-map-support/register' first** in main.ts
✅ **Use --enable-source-maps** in production start script
✅ **Include .map files** in deployments
✅ **Block .map files** from public access
✅ **Test stack traces** to verify it works

With source maps, you'll never waste time debugging cryptic compiled JavaScript again!
