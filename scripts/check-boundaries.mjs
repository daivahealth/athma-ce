#!/usr/bin/env node
/**
 * Architecture boundary check (ADR-0015).
 *
 * Rule 1 — no core → plugin imports: code in backend/services and
 * backend/shared must never import from plugins/, @athma-plugins/*, or
 * backend/connectors. Plugins depend on the core (via @athma/plugin-sdk and
 * @zeal/contracts), never the reverse. The clinical plugin loader is exempt
 * only in effect: it loads entrypoints via a computed require() at runtime,
 * which this static check does not (and should not) match.
 *
 * Rule 2 — no country conditionals in core: comparisons against country
 * literals (country === 'IN' etc.) belong in capability providers, plugins,
 * country packs, or the shared validators package — never in core modules.
 *
 * Run from the repo root: node scripts/check-boundaries.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_ROOTS = ['backend/services', 'backend/shared', 'backend/contracts'];

// Directories whose code is allowed to be country-specific.
const COUNTRY_ALLOWED = [
  /\/providers\//, // capability provider implementations (e.g. national-identity providers)
  /backend\/shared\/validators\//, // per-country identity validators
  /\/(__tests__|__mocks__)\//,
  /\.(spec|test)\.ts$/,
];

// Matches package imports of plugin/connector code, or relative imports that
// climb far enough (3+ "../") to escape a service's src tree into the
// repo-root plugins/ or backend/connectors trees. A module's own local
// `connectors/` or `plugins/` folder (1–2 levels up) is not a violation.
const IMPORT_VIOLATION =
  /(?:from\s+|require\()\s*['"](?:@athma-plugins\/|@athma-connectors\/|(?:\.\.\/){3,}(?:plugins|connectors)\/)[^'"]*['"]/;
const COUNTRY_CONDITIONAL = /\bcountry(?:Code)?\s*[!=]==?\s*['"][A-Z]{2,4}['"]/;

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) {
      checkFile(full);
    }
  }
}

function checkFile(file) {
  const rel = relative(ROOT, file);
  const lines = readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, i) => {
    if (IMPORT_VIOLATION.test(line)) {
      violations.push(`${rel}:${i + 1}  core→plugin import: ${line.trim()}`);
    }
    if (COUNTRY_CONDITIONAL.test(line) && !COUNTRY_ALLOWED.some((re) => re.test(rel))) {
      violations.push(`${rel}:${i + 1}  country conditional in core: ${line.trim()}`);
    }
  });
}

for (const root of SCAN_ROOTS) {
  try {
    if (statSync(join(ROOT, root)).isDirectory()) walk(join(ROOT, root));
  } catch {
    /* missing scan root is fine */
  }
}

if (violations.length) {
  console.error(`Boundary check FAILED (${violations.length} violation${violations.length > 1 ? 's' : ''}):\n`);
  for (const v of violations) console.error(`  ${v}`);
  console.error(
    '\nCore modules must call capability SPIs, never plugins or country logic directly (ADR-0015).',
  );
  process.exit(1);
}
console.log('Boundary check passed: no core→plugin imports, no country conditionals in core.');
