import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@zeal/database-foundation';
import { createHash, randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import {
  configuredProviders,
  OAUTH_PROVIDER_IDS,
  type HttpGetJson,
  type OAuthProfile,
  type OAuthProviderConfig,
  type OAuthProviderId,
  type OAuthTokenResponse,
} from './oauth-providers';
import { FixedWindowLimiter } from '../../../common/rate-limit/fixed-window-limiter';

/**
 * External sign-in (Google, Microsoft, GitHub) for the public demo.
 *
 * Flow: GET start → provider → GET callback → frontend /auth/callback#ticket=… →
 * POST exchange → normal access/refresh tokens. Identities are matched by the
 * provider's subject id, never by email. New identities become read-only
 * demo visitors in PUBLIC_DEMO_TENANT_ID, except identities listed in
 * OAUTH_PLATFORM_ADMINS. See docs/ADR/ADR-0016-external-identity-providers.md.
 */

export const OAUTH_COOKIE = 'athma_oauth';
const STATE_TTL_SECONDS = 600;
const TICKET_TTL_MS = 2 * 60 * 1000;
const SAFE_LOCALE = /^[a-z]{2}(-[A-Z]{2})?$/;

export class OAuthFlowError extends Error {
  constructor(
    public readonly code:
      | 'provider_disabled'
      | 'not_configured'
      | 'terms_required'
      | 'invalid_state'
      | 'provider_denied'
      | 'provider_error'
      | 'account_disabled'
      | 'rate_limited'
      | 'invalid_ticket',
    message?: string,
  ) {
    super(message ?? code);
  }
}

export interface OAuthSettings {
  demoTenantId: string | null;
  frontendUrl: string | null;
  callbackBaseUrl: string | null;
  stateSecret: string | null;
  termsVersion: string;
  visitorRole: string;
  platformAdmins: Array<{ provider: OAuthProviderId; email: string }>;
  platformAdminRoles: string[];
  maxNewAccountsPerIpPerHour: number;
}

export function readOAuthSettings(env: NodeJS.ProcessEnv = process.env): OAuthSettings {
  const trimSlash = (value: string | undefined) => value?.trim().replace(/\/+$/, '') || null;
  const platformAdmins = (env.OAUTH_PLATFORM_ADMINS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .map((entry) => {
      const [provider, email] = entry.split(':');
      return { provider: provider as OAuthProviderId, email: email ?? '' };
    })
    // Only Google asserts email verification reliably enough to grant admin by email.
    .filter((entry) => entry.provider === 'google' && entry.email.includes('@'));
  return {
    demoTenantId: env.PUBLIC_DEMO_TENANT_ID?.trim() || null,
    frontendUrl: trimSlash(env.OAUTH_FRONTEND_URL),
    callbackBaseUrl: trimSlash(env.OAUTH_CALLBACK_BASE_URL),
    stateSecret: env.OAUTH_STATE_SECRET?.trim() || env.JWT_SECRET?.trim() || null,
    termsVersion: env.DEMO_TERMS_VERSION?.trim() || '2026-11',
    visitorRole: env.PUBLIC_DEMO_VISITOR_ROLE?.trim() || 'demo_visitor',
    platformAdmins,
    platformAdminRoles: (env.OAUTH_PLATFORM_ADMIN_ROLES ?? 'super_admin,tenant_admin')
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean),
    maxNewAccountsPerIpPerHour: Number(env.OAUTH_MAX_NEW_ACCOUNTS_PER_IP_PER_HOUR ?? 5) || 5,
  };
}

/** Accepts only same-site relative paths, so the redirect cannot leave the app. */
export function safeReturnTo(value: string | undefined | null, locale: string): string {
  const fallback = `/${locale}/dashboard`;
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || /[\r\n]/.test(value)) return fallback;
  if (value.length > 512) return fallback;
  return value;
}

export function safeLocale(value: string | undefined | null): string {
  return value && SAFE_LOCALE.test(value) ? value : 'en';
}

const sha256 = (value: string) => createHash('sha256').update(value).digest('base64url');

interface StatePayload {
  p: OAuthProviderId;
  n: string; // sha256 of the cookie nonce
  r: string; // returnTo
  l: string; // locale
  t: string; // accepted terms version
}

export interface StartResult {
  redirectUrl: string;
  cookie: string;
}

export interface CallbackInput {
  code?: string | undefined;
  state?: string | undefined;
  error?: string | undefined;
  cookieHeader?: string | undefined;
  ip: string;
}

export interface ProvisionedUser {
  userId: string;
  tenantId: string;
  created: boolean;
}

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);
  private readonly settings: OAuthSettings;
  private readonly providers: Map<OAuthProviderId, OAuthProviderConfig>;
  private readonly startLimiter = new FixedWindowLimiter(30, 60_000);
  private readonly newAccountLimiter: FixedWindowLimiter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {
    this.settings = readOAuthSettings();
    this.providers = configuredProviders();
    this.newAccountLimiter = new FixedWindowLimiter(this.settings.maxNewAccountsPerIpPerHour, 60 * 60_000);
  }

  /** Whether external sign-in is usable at all on this instance. */
  isConfigured(): boolean {
    const s = this.settings;
    return !!(s.demoTenantId && s.frontendUrl && s.callbackBaseUrl && s.stateSecret);
  }

  enabledProviders(): Array<{ id: OAuthProviderId; label: string }> {
    if (!this.isConfigured()) return [];
    return OAUTH_PROVIDER_IDS.filter((id) => this.providers.has(id)).map((id) => ({
      id,
      label: this.providers.get(id)!.definition.label,
    }));
  }

  termsVersion(): string {
    return this.settings.termsVersion;
  }

  frontendErrorUrl(code: string, locale = 'en'): string {
    const base = this.settings.frontendUrl ?? '';
    return `${base}/${safeLocale(locale)}/login?oauthError=${encodeURIComponent(code)}`;
  }

  private provider(id: string): OAuthProviderConfig {
    if (!this.isConfigured()) throw new OAuthFlowError('not_configured');
    const config = this.providers.get(id as OAuthProviderId);
    if (!config) throw new OAuthFlowError('provider_disabled');
    return config;
  }

  private callbackUrl(id: OAuthProviderId): string {
    return `${this.settings.callbackBaseUrl}/auth/oauth/${id}/callback`;
  }

  private cookie(value: string, maxAge: number): string {
    const secure = this.settings.callbackBaseUrl?.startsWith('https://') ? '; Secure' : '';
    return `${OAUTH_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
  }

  clearCookie(): string {
    return this.cookie('', 0);
  }

  async start(
    providerId: string,
    input: { returnTo?: string | undefined; locale?: string | undefined; acceptTerms?: string | undefined; ip: string },
  ): Promise<StartResult> {
    const config = this.provider(providerId);
    if (input.acceptTerms !== 'true' && input.acceptTerms !== '1') throw new OAuthFlowError('terms_required');
    if (!this.startLimiter.take(input.ip)) throw new OAuthFlowError('rate_limited');

    const locale = safeLocale(input.locale);
    const nonce = randomBytes(24).toString('base64url');
    const verifier = randomBytes(48).toString('base64url');
    const payload: StatePayload = {
      p: config.definition.id,
      n: sha256(nonce),
      r: safeReturnTo(input.returnTo, locale),
      l: locale,
      t: this.settings.termsVersion,
    };
    const state = await this.jwt.signAsync(payload, {
      secret: this.settings.stateSecret!,
      expiresIn: STATE_TTL_SECONDS,
      audience: 'athma-oauth-state',
    });

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: this.callbackUrl(config.definition.id),
      response_type: 'code',
      scope: config.definition.scopes.join(' '),
      state,
      code_challenge: sha256(verifier),
      code_challenge_method: 'S256',
      ...(config.definition.authorizeParams ?? {}),
    });

    return {
      redirectUrl: `${config.definition.authorizeUrl}?${params.toString()}`,
      cookie: this.cookie(`${nonce}.${verifier}`, STATE_TTL_SECONDS),
    };
  }

  /** Returns the frontend URL to redirect the browser to (ticket in the fragment, or an error code). */
  async callback(providerId: string, input: CallbackInput): Promise<string> {
    let locale = 'en';
    try {
      const config = this.provider(providerId);
      const state = await this.verifyState(input.state, config.definition.id);
      locale = state.l;
      const [nonce, verifier] = readCookie(input.cookieHeader, OAUTH_COOKIE)?.split('.') ?? [];
      if (!nonce || !verifier || sha256(nonce) !== state.n) throw new OAuthFlowError('invalid_state');
      if (input.error) throw new OAuthFlowError('provider_denied');
      if (!input.code) throw new OAuthFlowError('provider_error', 'Missing authorization code');

      const tokens = await this.exchangeCode(config, input.code, verifier);
      const profile = await config.definition.fetchProfile(tokens, httpGetJson);
      const provisioned = await this.findOrProvision(config.definition.id, profile, state.t, input.ip);
      const ticket = await this.issueTicket(provisioned.userId, provisioned.tenantId);

      const fragment = new URLSearchParams({ ticket, returnTo: state.r });
      return `${this.settings.frontendUrl}/${locale}/auth/callback#${fragment.toString()}`;
    } catch (error) {
      const code = error instanceof OAuthFlowError ? error.code : 'provider_error';
      this.logger.warn(`External sign-in failed (${providerId}): ${code} ${error instanceof Error ? error.message : ''}`);
      return this.frontendErrorUrl(code, locale);
    }
  }

  private async verifyState(state: string | undefined, provider: OAuthProviderId): Promise<StatePayload> {
    if (!state) throw new OAuthFlowError('invalid_state');
    try {
      const payload = await this.jwt.verifyAsync<StatePayload>(state, {
        secret: this.settings.stateSecret!,
        audience: 'athma-oauth-state',
      });
      if (payload.p !== provider) throw new OAuthFlowError('invalid_state');
      return payload;
    } catch {
      throw new OAuthFlowError('invalid_state');
    }
  }

  private async exchangeCode(config: OAuthProviderConfig, code: string, verifier: string): Promise<OAuthTokenResponse> {
    const response = await fetch(config.definition.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.callbackUrl(config.definition.id),
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code_verifier: verifier,
      }),
    });
    const body = (await response.json().catch(() => ({}))) as OAuthTokenResponse & { error?: string };
    if (!response.ok || !body.access_token) {
      throw new OAuthFlowError('provider_error', `Token exchange failed: ${response.status} ${body.error ?? ''}`);
    }
    return body;
  }

  private isPlatformAdmin(provider: OAuthProviderId, profile: OAuthProfile): boolean {
    if (!profile.email || !profile.emailVerified) return false;
    return this.settings.platformAdmins.some((admin) => admin.provider === provider && admin.email === profile.email);
  }

  /**
   * Finds the user linked to this provider identity in the demo tenant, or
   * creates one. Never links to an existing user by email.
   */
  async findOrProvision(
    provider: OAuthProviderId,
    profile: OAuthProfile,
    termsVersion: string,
    ip: string,
  ): Promise<ProvisionedUser> {
    const tenantId = this.settings.demoTenantId!;
    const now = new Date();

    const existing = await this.prisma.userIdentity.findUnique({
      where: { tenantId_provider_providerSubject: { tenantId, provider, providerSubject: profile.subject } },
      include: { user: { select: { id: true, status: true } } },
    });

    if (existing) {
      if (existing.user.status !== 'active') throw new OAuthFlowError('account_disabled');
      await this.prisma.$transaction([
        this.prisma.userIdentity.update({
          where: { id: existing.id },
          data: {
            email: profile.email,
            emailVerified: profile.emailVerified,
            displayName: profile.displayName,
            termsVersion,
            termsAcceptedAt: existing.termsVersion === termsVersion ? existing.termsAcceptedAt : now,
            lastLoginAt: now,
          },
        }),
        this.prisma.user.update({ where: { id: existing.userId }, data: { lastLogin: now } }),
      ]);
      return { userId: existing.userId, tenantId, created: false };
    }

    if (!this.newAccountLimiter.take(ip)) throw new OAuthFlowError('rate_limited');

    const admin = this.isPlatformAdmin(provider, profile);
    const roleCodes = admin ? this.settings.platformAdminRoles : [this.settings.visitorRole];
    const roles = await this.prisma.role.findMany({ where: { tenantId, code: { in: roleCodes } }, select: { id: true, code: true } });
    if (roles.length === 0) throw new OAuthFlowError('not_configured', `No ${roleCodes.join('/')} role in tenant ${tenantId}`);

    const facilities = await this.prisma.facility.findMany({
      where: { tenantId },
      select: { id: true, code: true },
      orderBy: { code: 'asc' },
    });
    const defaultFacility = facilities.find((f) => /^MAIN/i.test(f.code ?? '')) ?? facilities[0];

    const loginEmail = await this.loginEmail(tenantId, provider, profile);
    // Unusable password: external users sign in only through their provider.
    const passwordHash = await argon2.hash(randomBytes(32).toString('base64url'));

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          tenantId,
          email: loginEmail,
          firstName: profile.firstName.slice(0, 100),
          lastName: profile.lastName.slice(0, 100),
          passwordHash,
          role: roles[0]!.code,
          status: 'active',
          lastLogin: now,
          defaultFacilityId: defaultFacility?.id ?? null,
        },
        select: { id: true },
      });
      await tx.userRole.createMany({
        data: roles.map((role) => ({ userId: created.id, roleId: role.id, isActive: true })),
      });
      if (facilities.length > 0) {
        await tx.userFacility.createMany({
          data: facilities.map((facility) => ({
            userId: created.id,
            facilityId: facility.id,
            isDefault: facility.id === defaultFacility?.id,
            accessLevel: admin ? 'admin' : 'read_only',
          })),
        });
      }
      await tx.userIdentity.create({
        data: {
          tenantId,
          userId: created.id,
          provider,
          providerSubject: profile.subject,
          email: profile.email,
          emailVerified: profile.emailVerified,
          displayName: profile.displayName,
          termsVersion,
          termsAcceptedAt: now,
          lastLoginAt: now,
        },
      });
      return created;
    });

    this.logger.log(`Provisioned ${admin ? 'platform admin' : 'demo visitor'} ${user.id} via ${provider}`);
    return { userId: user.id, tenantId, created: true };
  }

  /** The provider email when verified and unused in the tenant; otherwise a synthetic, non-deliverable address. */
  private async loginEmail(tenantId: string, provider: OAuthProviderId, profile: OAuthProfile): Promise<string> {
    if (profile.email && profile.emailVerified) {
      const taken = await this.prisma.user.findFirst({ where: { tenantId, email: profile.email }, select: { id: true } });
      if (!taken) return profile.email;
    }
    return `${provider}-${sha256(profile.subject).slice(0, 16).toLowerCase()}@visitors.athma.invalid`;
  }

  private async issueTicket(userId: string, tenantId: string): Promise<string> {
    const ticket = randomBytes(32).toString('base64url');
    await this.prisma.oAuthLoginTicket.create({
      data: { userId, tenantId, ticketHash: sha256(ticket), expiresAt: new Date(Date.now() + TICKET_TTL_MS) },
    });
    // Opportunistic cleanup of expired tickets.
    await this.prisma.oAuthLoginTicket
      .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - TICKET_TTL_MS) } } })
      .catch(() => undefined);
    return ticket;
  }

  /** Consumes a ticket exactly once; returns the user it was issued for. */
  async consumeTicket(ticket: string | undefined): Promise<{ userId: string; tenantId: string }> {
    if (!ticket || ticket.length > 200) throw new OAuthFlowError('invalid_ticket');
    const ticketHash = sha256(ticket);
    const now = new Date();
    const result = await this.prisma.oAuthLoginTicket.updateMany({
      where: { ticketHash, consumedAt: null, expiresAt: { gt: now } },
      data: { consumedAt: now },
    });
    if (result.count !== 1) throw new OAuthFlowError('invalid_ticket');
    const record = await this.prisma.oAuthLoginTicket.findUnique({ where: { ticketHash }, select: { userId: true, tenantId: true } });
    if (!record) throw new OAuthFlowError('invalid_ticket');
    return record;
  }
}

export function readCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

const httpGetJson: HttpGetJson = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'User-Agent': 'athma-ce',
    },
  });
  if (!response.ok) throw new OAuthFlowError('provider_error', `Profile request failed: ${response.status}`);
  return response.json();
};
