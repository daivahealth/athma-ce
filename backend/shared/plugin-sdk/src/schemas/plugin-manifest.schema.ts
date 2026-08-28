/**
 * JSON Schema (2020-12 keywords used conservatively for AJV v8 compatibility)
 * for athma-plugin.json. This is the install-time contract: the Foundation
 * plugin installer validates every manifest against it before anything is
 * persisted. Keep in sync with the PluginManifest interface.
 *
 * `additionalProperties` is left open at the top level so newer plugins with
 * forward-compatible fields still install on older platforms; the typed fields
 * that ARE declared must be well-formed.
 */
export const PLUGIN_MANIFEST_SCHEMA = {
  $id: 'https://athma.dev/schemas/athma-plugin.json',
  type: 'object',
  required: ['id', 'name', 'version', 'backend'],
  additionalProperties: true,
  properties: {
    manifestVersion: { enum: [1, 2] },
    countries: {
      type: 'array',
      items: { type: 'string', pattern: '^[A-Z]{2}$' },
    },
    capabilities: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'provider'],
        properties: {
          key: { type: 'string', pattern: '^[a-z][a-z0-9_.]*$' },
          provider: { type: 'string', pattern: '^[a-z][a-z0-9-]*$' },
        },
      },
    },
    secrets: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'scope'],
        properties: {
          key: { type: 'string', pattern: '^[a-z][a-z0-9_.]*$' },
          scope: { enum: ['tenant', 'facility'] },
        },
      },
    },
    callbacks: {
      type: 'array',
      items: {
        type: 'object',
        required: ['path'],
        properties: {
          path: { type: 'string', minLength: 1 },
          verification: { type: 'string' },
        },
      },
    },
    id: {
      type: 'string',
      // kebab-case identifier; also used for the plugin_{id} PG schema and
      // feature.nav.{id} config key, so keep it conservative.
      pattern: '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
      maxLength: 50,
    },
    name: { type: 'string', minLength: 1, maxLength: 200 },
    version: {
      type: 'string',
      // semver (no build metadata requirement)
      pattern: '^\\d+\\.\\d+\\.\\d+(-[0-9A-Za-z.-]+)?$',
    },
    description: { type: 'string' },
    author: { type: 'string' },
    license: { type: 'string' },
    athmaVersion: { type: 'string' },
    specialty: {
      type: 'object',
      required: ['code', 'displayName'],
      properties: {
        code: { type: 'string' },
        snomed: { type: 'string' },
        displayName: { type: 'string' },
      },
    },
    backend: {
      type: 'object',
      required: ['targetService', 'moduleEntrypoint'],
      properties: {
        targetService: { enum: ['clinical', 'foundation', 'rcm', 'prm'] },
        moduleEntrypoint: {
          type: 'string',
          minLength: 1,
          // Relative path inside the plugin package — no traversal, no absolute paths.
          not: { pattern: '(^/|\\.\\.)' },
        },
        prismaSchema: { type: 'string' },
        migrationDir: { type: 'string' },
        permissions: {
          type: 'array',
          items: { type: 'string', pattern: '^[a-z][a-z0-9_]*\\.[a-z][a-z0-9_.]*$' },
        },
        extensionPoints: { type: 'object' },
      },
    },
    frontend: { type: 'object' },
    configKeys: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'defaultValue', 'valueType', 'category', 'description', 'isOverridable'],
        properties: {
          key: { type: 'string', pattern: '^[a-z][a-z0-9_.]*$' },
          defaultValue: { type: ['string', 'boolean', 'number'] },
          valueType: { enum: ['string', 'boolean', 'number', 'json'] },
          category: { type: 'string' },
          description: { type: 'string' },
          isOverridable: { type: 'boolean' },
        },
      },
    },
    dependencies: { type: 'array', items: { type: 'string' } },
    i18n: { type: 'object' },
  },
} as const;
