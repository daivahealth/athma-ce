/**
 * Deployment mode of this Athma instance (development, demo, staging, production).
 *
 * Set with NEXT_PUBLIC_DEPLOYMENT_MODE. Like every NEXT_PUBLIC_* value it is baked in
 * at build time, so changing it means rebuilding the frontend image.
 *
 * When the variable is unset, a `next dev` server is "development" and a production
 * build is "production". Any value other than production makes the app show an
 * environment banner and badge, prefix the browser tab title, and ask search engines
 * not to index it. See docs/features/DEPLOYMENT-MODE.md.
 */

export type DeploymentMode = 'development' | 'demo' | 'staging' | 'production';

const ALIASES: Record<string, DeploymentMode> = {
  development: 'development',
  dev: 'development',
  local: 'development',
  demo: 'demo',
  sandbox: 'demo',
  staging: 'staging',
  stage: 'staging',
  uat: 'staging',
  qa: 'staging',
  test: 'staging',
  production: 'production',
  prod: 'production',
  live: 'production',
};

export function parseDeploymentMode(
  raw: string | undefined,
  nodeEnv: string | undefined,
): DeploymentMode {
  const key = raw?.trim().toLowerCase();
  if (key && ALIASES[key]) return ALIASES[key];
  return nodeEnv === 'production' ? 'production' : 'development';
}

// Literal process.env access so Next inlines the value into the client bundle.
export const DEPLOYMENT_MODE: DeploymentMode = parseDeploymentMode(
  process.env.NEXT_PUBLIC_DEPLOYMENT_MODE,
  process.env.NODE_ENV,
);

export interface DeploymentModeInfo {
  mode: DeploymentMode;
  /** Short badge text, e.g. "DEMO". */
  label: string;
  /** One-line notice shown in the environment banner. Empty for production. */
  notice: string;
  /** Whether the instance must not hold real patient data. */
  noLivePatients: boolean;
}

const INFO: Record<DeploymentMode, DeploymentModeInfo> = {
  development: {
    mode: 'development',
    label: 'DEV',
    notice: 'Development instance. Data may be reset at any time. Do not enter real patient data.',
    noLivePatients: true,
  },
  demo: {
    mode: 'demo',
    label: 'DEMO',
    notice:
      'Demonstration environment. Not for production or clinical use. Do not enter real or live patient data; all records are fictitious and may be reset at any time.',
    noLivePatients: true,
  },
  staging: {
    mode: 'staging',
    label: 'STAGING',
    notice: 'Staging / test environment. Not for clinical use. Do not enter real patient data.',
    noLivePatients: true,
  },
  production: {
    mode: 'production',
    label: 'PRODUCTION',
    notice: '',
    noLivePatients: false,
  },
};

export function getDeploymentModeInfo(mode: DeploymentMode = DEPLOYMENT_MODE): DeploymentModeInfo {
  return INFO[mode];
}

export const IS_PRODUCTION_DEPLOYMENT = DEPLOYMENT_MODE === 'production';

/**
 * How the login page shows the email + password form.
 *
 * - `visible`: shown as usual.
 * - `collapsed`: hidden behind a "Staff sign-in with email" link when external
 *   sign-in (Google, Microsoft, GitHub) is available, so visitors see one way in.
 *
 * Set with NEXT_PUBLIC_LOGIN_EMAIL (build time). Defaults to `collapsed` for the
 * demo mode and `visible` otherwise. See docs/features/DEPLOYMENT-MODE.md.
 */
export type EmailLoginMode = 'visible' | 'collapsed';

export function parseEmailLoginMode(raw: string | undefined, mode: DeploymentMode): EmailLoginMode {
  const key = raw?.trim().toLowerCase();
  if (key === 'visible' || key === 'collapsed') return key;
  return mode === 'demo' ? 'collapsed' : 'visible';
}

// Literal process.env access so Next inlines the value into the client bundle.
export const EMAIL_LOGIN_MODE: EmailLoginMode = parseEmailLoginMode(
  process.env.NEXT_PUBLIC_LOGIN_EMAIL,
  DEPLOYMENT_MODE,
);

/**
 * Whether `/{locale}` shows the public landing page (what Athma is, the demo,
 * open source, production access requests) instead of going straight to the app.
 *
 * Set with NEXT_PUBLIC_LANDING_PAGE=on|off (build time). Defaults to `on` for
 * the demo mode and `off` otherwise. See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
export function parseLandingPage(raw: string | undefined, mode: DeploymentMode): boolean {
  const key = raw?.trim().toLowerCase();
  if (key === 'on' || key === 'true') return true;
  if (key === 'off' || key === 'false') return false;
  return mode === 'demo';
}

// Literal process.env access so Next inlines the value into the client bundle.
export const LANDING_PAGE_ENABLED: boolean = parseLandingPage(
  process.env.NEXT_PUBLIC_LANDING_PAGE,
  DEPLOYMENT_MODE,
);

/** Public source repository linked from the landing page. */
export const SOURCE_REPOSITORY_URL = 'https://github.com/daivahealth/athma-ce';

/**
 * Contact for privacy requests on the demo (DPDP Act). Set with
 * NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL; empty shows a generic pointer to daiva.health.
 */
export const PRIVACY_CONTACT_EMAIL: string = (process.env.NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL ?? '').trim();

/**
 * Normalises a public address set at build time: an http(s) origin with no
 * trailing slash, or '' when unset or not a URL.
 */
export function parsePublicUrl(raw: string | undefined): string {
  const value = raw?.trim().replace(/\/+$/, '') ?? '';
  return /^https?:\/\/[^/\s]+$/i.test(value) ? value : '';
}

/**
 * Public addresses of the three Athma surfaces, set at build time. Each is an
 * origin such as https://athma.daiva.health; '' means "this same site" and
 * links stay relative. See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
// Literal process.env access so Next inlines the values into the client bundle.
/** The public site with the landing page (NEXT_PUBLIC_LANDING_URL). */
export const LANDING_URL: string = parsePublicUrl(process.env.NEXT_PUBLIC_LANDING_URL);
/** The live demo app (NEXT_PUBLIC_DEMO_APP_URL). */
export const DEMO_APP_URL: string = parsePublicUrl(process.env.NEXT_PUBLIC_DEMO_APP_URL);
/** The production app; '' until it exists (NEXT_PUBLIC_PRODUCTION_APP_URL). */
export const PRODUCTION_APP_URL: string = parsePublicUrl(process.env.NEXT_PUBLIC_PRODUCTION_APP_URL);

/** `${origin}/${locale}${path}`, relative when origin is ''. */
export function siteHref(origin: string, locale: string, path = ''): string {
  return `${origin}/${locale}${path}`;
}
