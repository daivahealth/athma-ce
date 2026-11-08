import { foundationClient, setSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { ORGANISATION_TYPES } from '@/modules/access-requests/api';

/**
 * Self-serve sandbox tenants on the public demo. See docs/features/SANDBOX-TENANTS.md
 * and docs/api/SANDBOXES-API.md.
 */

export { ORGANISATION_TYPES };
export type SandboxOrganisationType = (typeof ORGANISATION_TYPES)[number]['value'];

export const PLATFORM_SANDBOX_READ = 'platform.sandbox.read';
export const PLATFORM_SANDBOX_MANAGE = 'platform.sandbox.manage';

/** Optional modules. Outpatient and billing are always on. Mirrors SANDBOX_MODULES in foundation. */
export const SANDBOX_MODULES = [
  { value: 'inpatient', label: 'Inpatient care and beds' },
  { value: 'operating_theatre', label: 'Operating theatre' },
  { value: 'diagnostics', label: 'Lab, imaging and procedure results' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'insurance', label: 'Insurance claims, eligibility and pre-authorisation' },
  { value: 'oncology', label: 'Oncology (chemotherapy, radiotherapy, tumour board)' },
  { value: 'analytics', label: 'Analytics and reports' },
] as const;
export type SandboxModule = (typeof SANDBOX_MODULES)[number]['value'];

const ALL = SANDBOX_MODULES.map((module) => module.value);

/** Modules preselected for each organisation type. Mirrors SANDBOX_DEFAULT_MODULES in foundation. */
export const SANDBOX_DEFAULT_MODULES: Record<SandboxOrganisationType, SandboxModule[]> = {
  clinic: ['diagnostics', 'pharmacy', 'analytics'],
  hospital: ['inpatient', 'operating_theatre', 'diagnostics', 'pharmacy', 'insurance', 'analytics'],
  multi_specialty_hospital: ['inpatient', 'operating_theatre', 'diagnostics', 'pharmacy', 'insurance', 'analytics'],
  cancer_centre: ALL,
  diagnostic_centre: ['diagnostics', 'analytics'],
  day_care: ['operating_theatre', 'diagnostics', 'pharmacy', 'analytics'],
  other: ALL.filter((module) => module !== 'oncology'),
};

export type SandboxStatus = 'provisioning' | 'active' | 'failed' | 'expired' | 'deleting' | 'deleted';

export interface Sandbox {
  id: string;
  tenantId: string;
  organisationName: string;
  organisationType: string;
  modules: string[];
  status: SandboxStatus;
  createdAt: string;
  activatedAt: string | null;
  expiresAt: string | null;
  canExtend: boolean;
  failed: boolean;
}

export interface SandboxStatusResponse {
  available: boolean;
  reason?: 'disabled' | 'not_configured';
  /** Signed in with Google, Microsoft or GitHub. */
  eligible: boolean;
  /** The current session is for the caller's sandbox. */
  inSandbox: boolean;
  sandbox: Sandbox | null;
  limits: { lifetimeDays: number; extensionDays: number };
}

export interface CreateSandboxInput {
  organisationName: string;
  organisationType: SandboxOrganisationType;
  modules: SandboxModule[];
  acknowledged: boolean;
}

export interface AdminSandbox extends Sandbox {
  ownerProvider: string;
  ownerEmail: string | null;
  ownerName: string | null;
  error: string | null;
  lastSwitchAt: string | null;
  deletedAt: string | null;
}

export const MY_SANDBOX_QUERY_KEY = ['sandboxes', 'mine'] as const;

export async function getMySandbox(): Promise<SandboxStatusResponse> {
  const { data } = await foundationClient.get<SandboxStatusResponse>('/sandboxes/mine');
  return data;
}

export async function createSandbox(input: CreateSandboxInput): Promise<Sandbox> {
  const { data } = await foundationClient.post<Sandbox>('/sandboxes', input);
  return data;
}

export async function extendSandbox(): Promise<Sandbox> {
  const { data } = await foundationClient.post<Sandbox>('/sandboxes/mine/extend');
  return data;
}

export async function deleteSandbox(): Promise<Sandbox> {
  const { data } = await foundationClient.delete<Sandbox>('/sandboxes/mine');
  return data;
}

/**
 * Swaps the session for the caller's account in the sandbox or the demo
 * hospital, then reloads the app so every cached query, facility and menu
 * switch belongs to the new tenant.
 */
export async function switchWorkspace(target: 'sandbox' | 'demo', locale: string): Promise<void> {
  const { data } = await foundationClient.post<{ accessToken: string; refreshToken?: string | null }>(
    '/sandboxes/switch',
    { target },
  );
  if (!data.accessToken) throw new Error('No session returned');
  setSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    user: decodeAccessToken(data.accessToken),
  });
  window.location.assign(`/${locale}/dashboard`);
}

/** Days left until `expiresAt`, counting a part day as a day (30 right after creation), or null. */
export function daysLeft(expiresAt: string | null, now: Date = new Date()): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export async function listSandboxes() {
  const { data } = await foundationClient.get<{
    data: AdminSandbox[];
    counts: Record<SandboxStatus, number>;
    limits: { maxActive: number; lifetimeDays: number };
  }>('/sandboxes');
  return data;
}

export async function adminDeleteSandbox(id: string): Promise<Sandbox> {
  const { data } = await foundationClient.delete<Sandbox>(`/sandboxes/${id}`);
  return data;
}

export async function adminExtendSandbox(id: string): Promise<Sandbox> {
  const { data } = await foundationClient.post<Sandbox>(`/sandboxes/${id}/extend`);
  return data;
}
