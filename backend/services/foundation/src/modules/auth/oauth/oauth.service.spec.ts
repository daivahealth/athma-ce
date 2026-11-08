import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { OAuthService, readCookie, safeReturnTo, OAUTH_COOKIE } from './oauth.service';

const TENANT = '11111111-1111-1111-1111-111111111111';

/** Minimal in-memory stand-in for the Prisma calls OAuthService makes. */
function fakePrisma() {
  const db = {
    users: [] as any[],
    identities: [] as any[],
    userRoles: [] as any[],
    userFacilities: [] as any[],
    tickets: [] as any[],
    roles: [
      { id: 'r-visitor', tenantId: TENANT, code: 'demo_visitor' },
      { id: 'r-super', tenantId: TENANT, code: 'super_admin' },
      { id: 'r-tadmin', tenantId: TENANT, code: 'tenant_admin' },
    ],
    facilities: [
      { id: 'f-dt', tenantId: TENANT, code: 'DT-CLINIC' },
      { id: 'f-main', tenantId: TENANT, code: 'MAIN-HOSP' },
    ],
  };
  const matches = (row: any, where: any) =>
    Object.entries(where).every(([k, v]: [string, any]) => {
      if (v && typeof v === 'object' && 'in' in v) return v.in.includes(row[k]);
      if (v && typeof v === 'object' && 'gt' in v) return row[k] > v.gt;
      if (v && typeof v === 'object' && 'lt' in v) return row[k] < v.lt;
      return row[k] === v;
    });
  const client: any = {
    userIdentity: {
      findUnique: async ({ where }: any) => {
        const key = where.tenantId_provider_providerSubject;
        const identity = db.identities.find(
          (i) => i.tenantId === key.tenantId && i.provider === key.provider && i.providerSubject === key.providerSubject,
        );
        if (!identity) return null;
        const user = db.users.find((u) => u.id === identity.userId);
        return { ...identity, user: { id: user.id, status: user.status } };
      },
      update: async ({ where, data }: any) => Object.assign(db.identities.find((i) => i.id === where.id), data),
      create: async ({ data }: any) => {
        const row = { id: randomUUID(), ...data };
        db.identities.push(row);
        return row;
      },
    },
    user: {
      update: async ({ where, data }: any) => Object.assign(db.users.find((u) => u.id === where.id), data),
      findFirst: async ({ where }: any) => db.users.find((u) => matches(u, where)) ?? null,
      create: async ({ data }: any) => {
        const row = { id: randomUUID(), ...data };
        db.users.push(row);
        return { id: row.id };
      },
    },
    role: { findMany: async ({ where }: any) => db.roles.filter((r) => matches(r, where)) },
    facility: { findMany: async ({ where }: any) => db.facilities.filter((f) => matches(f, where)) },
    userRole: { createMany: async ({ data }: any) => db.userRoles.push(...data) },
    userFacility: { createMany: async ({ data }: any) => db.userFacilities.push(...data) },
    oAuthLoginTicket: {
      create: async ({ data }: any) => db.tickets.push({ id: randomUUID(), consumedAt: null, ...data }),
      deleteMany: async () => ({ count: 0 }),
      updateMany: async ({ where, data }: any) => {
        const rows = db.tickets.filter((t) => matches(t, where));
        rows.forEach((t) => Object.assign(t, data));
        return { count: rows.length };
      },
      findUnique: async ({ where }: any) => db.tickets.find((t) => t.ticketHash === where.ticketHash) ?? null,
    },
    $transaction: async (arg: any) => (typeof arg === 'function' ? arg(client) : Promise.all(arg)),
  };
  return { client, db };
}

const ENV = {
  PUBLIC_DEMO_TENANT_ID: TENANT,
  OAUTH_FRONTEND_URL: 'https://demo.example',
  OAUTH_CALLBACK_BASE_URL: 'https://api.demo.example/api/v1',
  OAUTH_STATE_SECRET: 'state-secret-for-tests',
  OAUTH_GOOGLE_CLIENT_ID: 'gid',
  OAUTH_GOOGLE_CLIENT_SECRET: 'gsecret',
  OAUTH_GITHUB_CLIENT_ID: 'hid',
  OAUTH_GITHUB_CLIENT_SECRET: 'hsecret',
  OAUTH_PLATFORM_ADMINS: 'google:owner@example.com',
};

function googleProfile(sub: string, email: string, verified = true) {
  return { sub, email, email_verified: verified, name: 'Asha Rao', given_name: 'Asha', family_name: 'Rao' };
}

describe('OAuthService', () => {
  const saved = { ...process.env };
  let fetchMock: jest.Mock;

  beforeEach(() => {
    Object.assign(process.env, ENV);
    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
  });
  afterEach(() => {
    process.env = { ...saved };
  });

  function build() {
    const { client, db } = fakePrisma();
    const service = new OAuthService(client, new JwtService({}));
    return { service, db };
  }

  function respondGoogle(profile: Record<string, unknown>) {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes('oauth2.googleapis.com/token')) return { ok: true, status: 200, json: async () => ({ access_token: 'at' }) };
      if (url.includes('openidconnect.googleapis.com')) return { ok: true, status: 200, json: async () => profile };
      throw new Error(`unexpected ${url}`);
    });
  }

  async function signIn(service: OAuthService, profile: Record<string, unknown>, ip = '1.1.1.1') {
    respondGoogle(profile);
    const start = await service.start('google', { acceptTerms: 'true', returnTo: '/en/patients', locale: 'en', ip });
    const state = new URL(start.redirectUrl).searchParams.get('state')!;
    const cookieValue = start.cookie.split(';')[0]!;
    return service.callback('google', { code: 'c', state, cookieHeader: cookieValue, ip });
  }

  it('lists only configured providers', () => {
    const { service } = build();
    expect(service.enabledProviders().map((p) => p.id)).toEqual(['google', 'github']);
  });

  it('requires terms acceptance before redirecting', async () => {
    const { service } = build();
    await expect(service.start('google', { ip: 'x' })).rejects.toMatchObject({ code: 'terms_required' });
  });

  it('sends PKCE and binds state to an HttpOnly cookie', async () => {
    const { service } = build();
    const result = await service.start('google', { acceptTerms: 'true', ip: 'x' });
    const url = new URL(result.redirectUrl);
    expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('redirect_uri')).toBe('https://api.demo.example/api/v1/auth/oauth/google/callback');
    expect(result.cookie).toMatch(new RegExp(`^${OAUTH_COOKIE}=.+; Path=/; HttpOnly; SameSite=Lax; Max-Age=600; Secure$`));
  });

  it('provisions a new identity as a read-only demo visitor and returns a ticket', async () => {
    const { service, db } = build();
    const target = await signIn(service, googleProfile('g-1', 'asha@example.com'));
    expect(target).toMatch(/^https:\/\/demo\.example\/en\/auth\/callback#ticket=.+&returnTo=%2Fen%2Fpatients$/);
    expect(db.users).toHaveLength(1);
    expect(db.users[0]).toMatchObject({ email: 'asha@example.com', role: 'demo_visitor', defaultFacilityId: 'f-main' });
    expect(db.userRoles.map((r) => r.roleId)).toEqual(['r-visitor']);
    expect(db.userFacilities.every((f) => f.accessLevel === 'read_only')).toBe(true);
    expect(db.identities[0]).toMatchObject({ provider: 'google', providerSubject: 'g-1', termsVersion: '2026-11' });
  });

  it('grants platform admin roles only to a listed, verified Google email', async () => {
    const { service, db } = build();
    await signIn(service, googleProfile('g-owner', 'owner@example.com'));
    expect(db.userRoles.map((r) => r.roleId).sort()).toEqual(['r-super', 'r-tadmin']);
    expect(db.userFacilities.every((f) => f.accessLevel === 'admin')).toBe(true);

    const second = build();
    await signIn(second.service, googleProfile('g-fake', 'owner@example.com', false));
    expect(second.db.userRoles.map((r) => r.roleId)).toEqual(['r-visitor']);
  });

  it('reuses the same user for the same subject and never links by email', async () => {
    const { service, db } = build();
    await signIn(service, googleProfile('g-1', 'asha@example.com'));
    await signIn(service, googleProfile('g-1', 'asha@example.com'));
    expect(db.users).toHaveLength(1);

    // A different subject claiming the same email gets its own account with a synthetic login email.
    await signIn(service, googleProfile('g-2', 'asha@example.com'));
    expect(db.users).toHaveLength(2);
    expect(db.users[1].email).toMatch(/^google-[a-z0-9_-]{16}@visitors\.athma\.invalid$/);
  });

  it('rejects a callback whose cookie does not match the state', async () => {
    const { service, db } = build();
    respondGoogle(googleProfile('g-1', 'a@example.com'));
    const start = await service.start('google', { acceptTerms: 'true', ip: 'x' });
    const state = new URL(start.redirectUrl).searchParams.get('state')!;
    const target = await service.callback('google', { code: 'c', state, cookieHeader: `${OAUTH_COOKIE}=other.verifier`, ip: 'x' });
    expect(target).toBe('https://demo.example/en/login?oauthError=invalid_state');
    expect(db.users).toHaveLength(0);
  });

  it('refuses a disabled account', async () => {
    const { service, db } = build();
    await signIn(service, googleProfile('g-1', 'asha@example.com'));
    db.users[0].status = 'inactive';
    expect(await signIn(service, googleProfile('g-1', 'asha@example.com'))).toContain('oauthError=account_disabled');
  });

  it('limits new accounts per IP', async () => {
    process.env.OAUTH_MAX_NEW_ACCOUNTS_PER_IP_PER_HOUR = '2';
    const { service, db } = build();
    await signIn(service, googleProfile('a', 'a@example.com'), '9.9.9.9');
    await signIn(service, googleProfile('b', 'b@example.com'), '9.9.9.9');
    expect(await signIn(service, googleProfile('c', 'c@example.com'), '9.9.9.9')).toContain('oauthError=rate_limited');
    expect(db.users).toHaveLength(2);
  });

  it('accepts a ticket exactly once', async () => {
    const { service, db } = build();
    const target = await signIn(service, googleProfile('g-1', 'asha@example.com'));
    const ticket = new URLSearchParams(target.split('#')[1]).get('ticket')!;
    await expect(service.consumeTicket(ticket)).resolves.toMatchObject({ userId: db.users[0].id, tenantId: TENANT });
    await expect(service.consumeTicket(ticket)).rejects.toMatchObject({ code: 'invalid_ticket' });
    await expect(service.consumeTicket('made-up')).rejects.toMatchObject({ code: 'invalid_ticket' });
  });
});

describe('safeReturnTo and readCookie', () => {
  it('keeps redirects inside the app', () => {
    expect(safeReturnTo('/en/patients?x=1', 'en')).toBe('/en/patients?x=1');
    for (const bad of ['https://evil.example', '//evil.example', '/\\evil', 'javascript:alert(1)', undefined]) {
      expect(safeReturnTo(bad as string, 'en')).toBe('/en/dashboard');
    }
  });

  it('reads one cookie from a header', () => {
    expect(readCookie('a=1; athma_oauth=n.v; b=2', 'athma_oauth')).toBe('n.v');
    expect(readCookie(undefined, 'athma_oauth')).toBeNull();
  });
});
