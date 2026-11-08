import { parseReadTokenMode, sandboxTemplateTenantId, type CopyTableSpec } from '@zeal/shared-utils';

/**
 * Sandbox tenants (ADR-0017): settings, organisation types and modules.
 * See docs/features/SANDBOX-TENANTS.md.
 */

export const SANDBOX_ORGANISATION_TYPES = [
  'clinic',
  'hospital',
  'multi_specialty_hospital',
  'cancer_centre',
  'diagnostic_centre',
  'day_care',
  'other',
] as const;
export type SandboxOrganisationType = (typeof SANDBOX_ORGANISATION_TYPES)[number];

/**
 * Optional modules. Outpatient (registration, appointments, encounters,
 * orders) and billing are always on. Each module maps to the existing
 * per-tenant navigation switches (tenant_configs feature.nav.*).
 */
export const SANDBOX_MODULES = [
  'inpatient',
  'operating_theatre',
  'diagnostics',
  'pharmacy',
  'insurance',
  'oncology',
  'analytics',
] as const;
export type SandboxModule = (typeof SANDBOX_MODULES)[number];

export const SANDBOX_MODULE_FLAGS: Record<SandboxModule, string> = {
  inpatient: 'feature.nav.inpatientCare',
  operating_theatre: 'feature.nav.operatingTheatre',
  diagnostics: 'feature.nav.resultsReporting',
  pharmacy: 'feature.nav.pharmacy',
  insurance: 'feature.nav.revenueCycle',
  oncology: 'feature.nav.oncology',
  analytics: 'feature.nav.analytics',
};

const ALL: SandboxModule[] = [...SANDBOX_MODULES];

export const SANDBOX_DEFAULT_MODULES: Record<SandboxOrganisationType, SandboxModule[]> = {
  clinic: ['diagnostics', 'pharmacy', 'analytics'],
  hospital: ['inpatient', 'operating_theatre', 'diagnostics', 'pharmacy', 'insurance', 'analytics'],
  multi_specialty_hospital: ['inpatient', 'operating_theatre', 'diagnostics', 'pharmacy', 'insurance', 'analytics'],
  cancer_centre: ALL,
  diagnostic_centre: ['diagnostics', 'analytics'],
  day_care: ['operating_theatre', 'diagnostics', 'pharmacy', 'analytics'],
  other: ALL.filter((module) => module !== 'oncology'),
};

/** Foundation setup copied into a sandbox, in dependency order. Users, secrets and identities are not copied. */
export const FOUNDATION_SETUP_TABLES: readonly CopyTableSpec[] = [
  { table: 'facilities' },
  { table: 'roles' },
  { table: 'role_permissions', parentColumn: 'role_id' },
  { table: 'staff' },
  { table: 'staff_specialties' },
  { table: 'departments', parentColumn: 'facility_id' },
  { table: 'wards', parentColumn: 'department_id' },
  { table: 'beds', parentColumn: 'ward_id' },
  { table: 'clinics', parentColumn: 'department_id' },
  { table: 'spaces', parentColumn: 'facility_id' },
  { table: 'facility_configs', parentColumn: 'facility_id' },
  { table: 'tenant_configs' },
  { table: 'plugin_activations' },
];

/** Roles removed from a sandbox after the copy: nobody there may hold them. */
export const SANDBOX_REMOVED_ROLES = ['super_admin'];
/** Role the owner gets in their sandbox. */
export const SANDBOX_OWNER_ROLE = 'tenant_admin';

export interface SandboxSettings {
  enabled: boolean;
  /** Both access switches are on, so tenants are isolated (ADR-0017 §1). */
  isolationReady: boolean;
  templateTenantId: string | null;
  maxActive: number;
  lifetimeDays: number;
  extensionDays: number;
  maxCreatesPerOwnerPerDay: number;
  clinicalUrl: string;
  rcmUrl: string;
  prmUrl: string;
  internalApiKey: string | null;
}

function positive(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function trimSlash(value: string | undefined, fallback: string): string {
  return (value?.trim() || fallback).replace(/\/+$/, '');
}

export function readSandboxSettings(env: NodeJS.ProcessEnv = process.env): SandboxSettings {
  return {
    enabled: env.SANDBOX_ENABLED === 'true',
    isolationReady:
      env.AUTH_REQUIRE_TOKEN_FOR_WRITES === 'true' &&
      parseReadTokenMode(env.AUTH_REQUIRE_TOKEN_FOR_READS) === 'enforce',
    templateTenantId: sandboxTemplateTenantId(env),
    maxActive: positive(env.SANDBOX_MAX_ACTIVE, 50),
    lifetimeDays: positive(env.SANDBOX_LIFETIME_DAYS, 30),
    extensionDays: positive(env.SANDBOX_EXTENSION_DAYS, 30),
    maxCreatesPerOwnerPerDay: positive(env.SANDBOX_MAX_CREATES_PER_DAY, 3),
    clinicalUrl: trimSlash(env.CLINICAL_BASE_URL ?? env.CLINICAL_SERVICE_URL, 'http://localhost:3011'),
    rcmUrl: trimSlash(env.RCM_SERVICE_URL, 'http://localhost:3012'),
    prmUrl: trimSlash(env.PRM_SERVICE_URL, 'http://localhost:3013'),
    internalApiKey: env.INTERNAL_API_KEY?.trim() || null,
  };
}

/** Modules to enable: the requested ones (de-duplicated, known only), else the type's defaults. */
export function resolveModules(type: SandboxOrganisationType, requested?: readonly string[] | null): SandboxModule[] {
  if (!requested) return [...SANDBOX_DEFAULT_MODULES[type]];
  return SANDBOX_MODULES.filter((module) => requested.includes(module));
}
