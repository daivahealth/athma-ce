import { describe, expect, it } from '@jest/globals';
import { createHash } from 'crypto';
import {
  assertSandboxTarget,
  parseTenantSetupCopyRequest,
  sandboxRowId,
  sandboxTemplateTenantId,
  TenantSetupRequestError,
} from '../tenant-data';

const DEMO = '11111111-1111-1111-1111-111111111111';
const TARGET = '21055a31-9116-4f85-8587-23a5840aea57';
const env = { SANDBOX_ENABLED: 'true', PUBLIC_DEMO_TENANT_ID: DEMO } as NodeJS.ProcessEnv;

describe('sandboxRowId', () => {
  it("matches the SQL md5(target || ':' || old)::uuid", () => {
    const old = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665';
    const hex = createHash('md5').update(`${TARGET}:${old}`).digest('hex');
    expect(sandboxRowId(TARGET, old).replace(/-/g, '')).toBe(hex);
    expect(sandboxRowId(TARGET, old)).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('differs per target tenant', () => {
    expect(sandboxRowId(TARGET, DEMO)).not.toBe(sandboxRowId(DEMO, TARGET));
  });
});

describe('sandbox request guards', () => {
  it('uses SANDBOX_TEMPLATE_TENANT_ID, else the public demo tenant', () => {
    expect(sandboxTemplateTenantId(env)).toBe(DEMO);
    expect(sandboxTemplateTenantId({ ...env, SANDBOX_TEMPLATE_TENANT_ID: TARGET })).toBe(TARGET);
  });

  it('refuses when sandboxes are off', () => {
    expect(() => assertSandboxTarget(TARGET, { ...env, SANDBOX_ENABLED: 'false' })).toThrow(TenantSetupRequestError);
  });

  it('never targets the demo or template tenant', () => {
    expect(() => assertSandboxTarget(DEMO, env)).toThrow('demo tenant');
    expect(() => assertSandboxTarget(TARGET, { ...env, SANDBOX_TEMPLATE_TENANT_ID: TARGET })).toThrow('demo tenant');
    expect(() => assertSandboxTarget('not-a-uuid', env)).toThrow('uuid');
    expect(assertSandboxTarget(TARGET, env)).toBe(TARGET);
  });

  it('parses a copy request and drops invalid external ids', () => {
    const parsed = parseTenantSetupCopyRequest({ targetTenantId: TARGET, externalIds: [DEMO, 'x', 42] }, env);
    expect(parsed).toEqual({ sourceTenantId: DEMO, targetTenantId: TARGET, externalIds: [DEMO] });
  });
});
