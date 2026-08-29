import { describe, expect, it } from '@jest/globals';
import Ajv from 'ajv';
import {
  CAPABILITY_KEYS,
  CapabilityProvider,
  CapabilityRegistryService,
} from '../capability-registry';
import { PLUGIN_MANIFEST_SCHEMA } from '../../schemas/plugin-manifest.schema';

function makeProvider(capabilityKey: string, providerId: string): CapabilityProvider {
  return { capabilityKey, providerId, operations: new Set(['search']) };
}

function registryWithConfig(values: Record<string, unknown>) {
  return new CapabilityRegistryService({
    get: async (key) => values[key],
  });
}

describe('CapabilityRegistryService (ADR-0015)', () => {
  it('resolves the provider named by the tenant binding', async () => {
    const registry = registryWithConfig({ 'capability.registry.facility.provider': 'hfr' });
    registry.register(makeProvider(CAPABILITY_KEYS.REGISTRY_FACILITY, 'hfr'));
    const resolution = await registry.resolve(CAPABILITY_KEYS.REGISTRY_FACILITY, { tenantId: 't1' });
    expect(resolution.bound).toBe(true);
    if (resolution.bound) expect(resolution.provider.providerId).toBe('hfr');
  });

  it('treats an empty binding as the normal unbound outcome, never an error', async () => {
    const registry = registryWithConfig({ 'capability.registry.facility.provider': '' });
    registry.register(makeProvider(CAPABILITY_KEYS.REGISTRY_FACILITY, 'hfr'));
    const resolution = await registry.resolve(CAPABILITY_KEYS.REGISTRY_FACILITY, { tenantId: 't1' });
    expect(resolution).toEqual({ bound: false, reason: 'no_binding' });
  });

  it('reports a binding whose provider is not deployed', async () => {
    const registry = registryWithConfig({ 'capability.national.exchange.provider': 'nhs' });
    const resolution = await registry.resolve(CAPABILITY_KEYS.NATIONAL_EXCHANGE, { tenantId: 't1' });
    expect(resolution).toEqual({ bound: false, reason: 'provider_not_registered', requested: 'nhs' });
  });

  it('degrades to unbound when config lookup fails (request path must not crash)', async () => {
    const registry = new CapabilityRegistryService({
      get: async () => {
        throw new Error('foundation down');
      },
    });
    registry.register(makeProvider(CAPABILITY_KEYS.REGISTRY_FACILITY, 'hfr'));
    const resolution = await registry.resolve(CAPABILITY_KEYS.REGISTRY_FACILITY, { tenantId: 't1' });
    expect(resolution.bound).toBe(false);
  });

  it('scopes resolution per tenant — the same deployment serves different bindings', async () => {
    const registry = new CapabilityRegistryService({
      get: async (_key, ctx) => (ctx.tenantId === 'india' ? 'hfr' : ''),
    });
    registry.register(makeProvider(CAPABILITY_KEYS.REGISTRY_FACILITY, 'hfr'));
    expect((await registry.resolve(CAPABILITY_KEYS.REGISTRY_FACILITY, { tenantId: 'india' })).bound).toBe(true);
    expect((await registry.resolve(CAPABILITY_KEYS.REGISTRY_FACILITY, { tenantId: 'generic' })).bound).toBe(false);
  });
});

describe('PLUGIN_MANIFEST_SCHEMA', () => {
  const validate = new Ajv({ allErrors: true, allowUnionTypes: true }).compile(
    PLUGIN_MANIFEST_SCHEMA as unknown as Record<string, unknown>,
  );
  const base = {
    id: 'abdm',
    name: 'ABDM',
    version: '1.2.0',
    backend: { targetService: 'clinical', moduleEntrypoint: 'backend/dist/module.js' },
  };

  it('accepts a minimal v1 manifest', () => {
    expect(validate(base)).toBe(true);
  });

  it('accepts a full v2 manifest', () => {
    expect(
      validate({
        ...base,
        manifestVersion: 2,
        countries: ['IN'],
        capabilities: [{ key: 'registry.facility', provider: 'hfr' }],
        secrets: [{ key: 'abdm.client_secret', scope: 'facility' }],
        callbacks: [{ path: '/callbacks/abdm/v3', verification: 'abdm-jwt' }],
      }),
    ).toBe(true);
  });

  it('rejects path traversal in the module entrypoint', () => {
    expect(
      validate({ ...base, backend: { targetService: 'clinical', moduleEntrypoint: '../../etc/passwd' } }),
    ).toBe(false);
  });

  it('rejects a non-kebab plugin id and a non-semver version', () => {
    expect(validate({ ...base, id: 'Bad Id!' })).toBe(false);
    expect(validate({ ...base, version: 'latest' })).toBe(false);
  });

  it('rejects malformed capability declarations', () => {
    expect(validate({ ...base, capabilities: [{ key: 'Registry Facility', provider: 'HFR!' }] })).toBe(false);
  });

  it('rejects an unknown targetService', () => {
    expect(validate({ ...base, backend: { targetService: 'billing', moduleEntrypoint: 'x.js' } })).toBe(false);
  });
});
