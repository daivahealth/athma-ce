#!/usr/bin/env node
/**
 * Removes stray build artefacts (*.js, *.d.ts, maps) from package src trees.
 * Only deletes files that have a sibling TypeScript source (same base name).
 */

const fs = require('fs/promises');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const targetDirs = [
  'contracts/src',
  'shared/utils/src',
  'shared/database/src',
  'services/auth/src',
  'services/foundation/src',
  'services/pms/src',
].map((rel) => path.join(projectRoot, rel));

const removableExtensions = new Set(['.js', '.d.ts', '.js.map', '.d.ts.map']);

const stats = { scanned: 0, deleted: 0 };

async function hasTsSibling(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);

  const candidates = [];
  if (base.endsWith('.d.ts.map')) {
    const stem = base.slice(0, -8); // remove `.d.ts.map`
    candidates.push(stem + '.ts', stem + '.tsx');
  } else if (base.endsWith('.d.ts')) {
    const stem = base.slice(0, -4); // remove `.d.ts`
    candidates.push(stem + '.ts', stem + '.tsx');
  } else if (base.endsWith('.js.map')) {
    const stem = base.slice(0, -4); // remove `.map`
    const withoutJs = stem.endsWith('.js') ? stem.slice(0, -3) : stem;
    candidates.push(withoutJs + '.ts', withoutJs + '.tsx');
  } else if (base.endsWith('.js')) {
    const stem = base.slice(0, -3);
    candidates.push(stem + '.ts', stem + '.tsx');
  }

  for (const candidate of candidates) {
    try {
      await fs.access(path.join(dir, candidate));
      return true;
    } catch {
      // ignore
    }
  }
  return false;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (removableExtensions.has(path.extname(entry.name))) {
      stats.scanned += 1;
      if (await hasTsSibling(fullPath)) {
        await fs.unlink(fullPath);
        stats.deleted += 1;
      }
    }
  }
}

(async function main() {
  for (const dir of targetDirs) {
    try {
      await walk(dir);
    } catch (err) {
      if (err.code === 'ENOENT') continue;
      throw err;
    }
  }
  console.log(`Scanned ${stats.scanned} artefacts; removed ${stats.deleted}.`);
})().catch((err) => {
  console.error('Failed to clean src artefacts:', err);
  process.exitCode = 1;
});
