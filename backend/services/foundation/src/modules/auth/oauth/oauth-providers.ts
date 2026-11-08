/**
 * External sign-in providers (OAuth 2.0 authorization code flow with PKCE).
 *
 * Each provider is enabled only when its client id and secret are set.
 * See docs/ADR/ADR-0016-external-identity-providers.md and
 * docs/runbooks/demo-environment-gcp.md (Social sign-in) for app registration.
 */

export type OAuthProviderId = 'google' | 'microsoft' | 'github';

export const OAUTH_PROVIDER_IDS: readonly OAuthProviderId[] = ['google', 'microsoft', 'github'];

export interface OAuthProfile {
  /** Stable, provider-scoped user id. The only value used to match an identity. */
  subject: string;
  email: string | null;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  displayName: string | null;
}

export interface OAuthProviderDefinition {
  id: OAuthProviderId;
  label: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  /** Extra authorize parameters. */
  authorizeParams?: Record<string, string>;
  fetchProfile(tokens: OAuthTokenResponse, http: HttpGetJson): Promise<OAuthProfile>;
}

export interface OAuthTokenResponse {
  access_token: string;
  id_token?: string;
  token_type?: string;
  [key: string]: unknown;
}

export type HttpGetJson = (url: string, accessToken: string) => Promise<unknown>;

function splitName(full: string | null | undefined): { firstName: string; lastName: string } {
  const parts = (full ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Demo', lastName: 'Visitor' };
  if (parts.length === 1) return { firstName: parts[0] as string, lastName: '-' };
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] as string };
}

/** Decodes a JWT payload without verifying it. Only for tokens received directly from the provider's token endpoint over TLS. */
export function decodeJwtPayload(token: string | undefined): Record<string, unknown> {
  if (!token) return {};
  const part = token.split('.')[1];
  if (!part) return {};
  try {
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

const str = (value: unknown): string | null => (typeof value === 'string' && value.trim() ? value.trim() : null);

const google: OAuthProviderDefinition = {
  id: 'google',
  label: 'Google',
  authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  scopes: ['openid', 'email', 'profile'],
  authorizeParams: { prompt: 'select_account' },
  async fetchProfile(tokens, http) {
    const info = (await http('https://openidconnect.googleapis.com/v1/userinfo', tokens.access_token)) as Record<string, unknown>;
    const subject = str(info.sub);
    if (!subject) throw new Error('Google profile has no subject');
    const names = splitName(str(info.name));
    return {
      subject,
      email: str(info.email)?.toLowerCase() ?? null,
      emailVerified: info.email_verified === true,
      firstName: str(info.given_name) ?? names.firstName,
      lastName: str(info.family_name) ?? names.lastName,
      displayName: str(info.name),
    };
  },
};

const microsoft = (tenant: string): OAuthProviderDefinition => ({
  id: 'microsoft',
  label: 'Microsoft',
  authorizeUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
  tokenUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
  scopes: ['openid', 'email', 'profile', 'User.Read'],
  authorizeParams: { prompt: 'select_account' },
  async fetchProfile(tokens, http) {
    // id_token claims are trustworthy here: it came straight from the token endpoint.
    const claims = decodeJwtPayload(tokens.id_token);
    const me = (await http('https://graph.microsoft.com/v1.0/me?$select=id,displayName,givenName,surname,mail,userPrincipalName', tokens.access_token)) as Record<string, unknown>;
    // oid + tid identify the account across apps; sub is pairwise per app and also stable.
    const subject = str(claims.oid) && str(claims.tid) ? `${claims.tid}:${claims.oid}` : str(claims.sub) ?? str(me.id);
    if (!subject) throw new Error('Microsoft profile has no subject');
    const email = str(me.mail) ?? str(claims.email) ?? null;
    const names = splitName(str(me.displayName) ?? str(claims.name));
    return {
      subject,
      email: email?.toLowerCase() ?? null,
      // Microsoft does not assert email verification for organisational accounts.
      emailVerified: false,
      firstName: str(me.givenName) ?? names.firstName,
      lastName: str(me.surname) ?? names.lastName,
      displayName: str(me.displayName) ?? str(claims.name),
    };
  },
});

const github: OAuthProviderDefinition = {
  id: 'github',
  label: 'GitHub',
  authorizeUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  scopes: ['read:user', 'user:email'],
  authorizeParams: { allow_signup: 'true' },
  async fetchProfile(tokens, http) {
    const user = (await http('https://api.github.com/user', tokens.access_token)) as Record<string, unknown>;
    const id = user.id;
    if (typeof id !== 'number' && typeof id !== 'string') throw new Error('GitHub profile has no id');
    let email: string | null = null;
    let verified = false;
    try {
      const emails = (await http('https://api.github.com/user/emails', tokens.access_token)) as Array<Record<string, unknown>>;
      const primary = Array.isArray(emails) ? emails.find((e) => e.primary === true) ?? emails[0] : undefined;
      email = str(primary?.email);
      verified = primary?.verified === true;
    } catch {
      email = str(user.email);
    }
    const names = splitName(str(user.name) ?? str(user.login));
    return {
      subject: String(id),
      email: email?.toLowerCase() ?? null,
      emailVerified: verified,
      firstName: names.firstName,
      lastName: names.lastName,
      displayName: str(user.name) ?? str(user.login),
    };
  },
};

export interface OAuthProviderConfig {
  definition: OAuthProviderDefinition;
  clientId: string;
  clientSecret: string;
}

/** Providers configured through the environment. */
export function configuredProviders(env: NodeJS.ProcessEnv = process.env): Map<OAuthProviderId, OAuthProviderConfig> {
  const result = new Map<OAuthProviderId, OAuthProviderConfig>();
  const add = (definition: OAuthProviderDefinition, prefix: string) => {
    const clientId = env[`${prefix}_CLIENT_ID`]?.trim();
    const clientSecret = env[`${prefix}_CLIENT_SECRET`]?.trim();
    if (clientId && clientSecret) result.set(definition.id, { definition, clientId, clientSecret });
  };
  add(google, 'OAUTH_GOOGLE');
  add(microsoft(env.OAUTH_MICROSOFT_TENANT?.trim() || 'common'), 'OAUTH_MICROSOFT');
  add(github, 'OAUTH_GITHUB');
  return result;
}
