import { describe, expect, it } from '@jest/globals';
import { RequestContext } from '@zeal/shared-utils';
import { createTenantIsolationMiddleware } from '../prisma-tenant.middleware';

const TENANT = '11111111-1111-1111-1111-111111111111';
const middleware = createTenantIsolationMiddleware();

type Params = { model?: string; action: string; args: Record<string, any> };

/** Runs the middleware inside a tenant context and returns what reached next(). */
async function run(params: Params, store?: Record<string, unknown>): Promise<Params> {
  let forwarded: Params | undefined;
  const next = async (p: Params) => {
    forwarded = p;
    return 'result';
  };
  const invoke = () => middleware(params, next);
  if (store) {
    await RequestContext.run(store as never, invoke);
  } else {
    await invoke();
  }
  return forwarded as Params;
}

describe('tenant isolation middleware (issue #65: named highest-risk surface)', () => {
  it('injects tenantId into findMany filters on isolated models', async () => {
    const forwarded = await run(
      { model: 'Patient', action: 'findMany', args: { where: { status: 'active' } } },
      { tenantId: TENANT },
    );
    expect(forwarded.args.where.tenantId).toBe(TENANT);
    expect(forwarded.args.where.status).toBe('active');
  });

  it('injects tenantId into creates on isolated models', async () => {
    const forwarded = await run(
      { model: 'Encounter', action: 'create', args: { data: { patientId: 'p1' } } },
      { tenantId: TENANT },
    );
    expect(forwarded.args.data.tenantId).toBe(TENANT);
  });

  it('refuses to run isolated-model queries with no tenant context', async () => {
    await expect(
      run({ model: 'Patient', action: 'findMany', args: {} }, {}),
    ).rejects.toThrow(/Tenant context required/);
  });

  it('allows system operations only via the explicit bypass flag', async () => {
    const forwarded = await run(
      { model: 'Patient', action: 'findMany', args: { where: {} } },
      { bypassTenantCheck: true },
    );
    expect(forwarded.args.where?.tenantId).toBeUndefined();
  });

  it('refuses to change tenantId on an existing record', async () => {
    await expect(
      run(
        {
          model: 'Patient',
          action: 'update',
          args: { where: { id: 'p1' }, data: { tenantId: 'other-tenant' } },
        },
        { tenantId: TENANT },
      ),
    ).rejects.toThrow(/tenantId/);
  });

  it('leaves non-isolated models untouched (outbox must read cross-tenant)', async () => {
    const forwarded = await run(
      { model: 'DomainEvent', action: 'findMany', args: { where: { seq: { gt: 0 } } } },
      { tenantId: TENANT },
    );
    expect(forwarded.args.where.tenantId).toBeUndefined();
  });

  it('ignores raw queries with no model', async () => {
    const forwarded = await run({ action: 'queryRaw', args: {} }, { tenantId: TENANT });
    expect(forwarded.args).toEqual({});
  });
});
