import { foundationClient, publicFoundationClient } from '@/lib/api/client';

/**
 * Production access requests. Submitting is public (landing page form);
 * listing and reviewing need platform permissions (super_admin).
 * See docs/api/ACCESS-REQUESTS-API.md.
 */

export const ORGANISATION_TYPES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'multi_specialty_hospital', label: 'Multi-speciality hospital or network' },
  { value: 'cancer_centre', label: 'Cancer centre' },
  { value: 'clinic', label: 'Clinic or polyclinic' },
  { value: 'diagnostic_centre', label: 'Diagnostic or lab centre' },
  { value: 'day_care', label: 'Day-care centre' },
  { value: 'other', label: 'Other' },
] as const;

export const ACCESS_REQUEST_MODULES = [
  { value: 'patient_access', label: 'Patient access & scheduling' },
  { value: 'clinical', label: 'Clinical records & orders' },
  { value: 'operating_theatre', label: 'Operating theatre' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'imaging', label: 'Imaging & results' },
  { value: 'inpatient', label: 'Inpatient & beds' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'billing', label: 'Billing' },
  { value: 'revenue_cycle', label: 'Insurance & claims' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'abdm', label: 'ABDM / ABHA (India)' },
] as const;

export const ACCESS_REQUEST_STATUSES = ['new', 'contacted', 'approved', 'declined'] as const;
export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

export interface AccessRequestInput {
  organisationName: string;
  organisationType: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  facilityCount?: number;
  bedCount?: number;
  modules: string[];
  message?: string;
  consent: boolean;
  /** Honeypot; always empty for people. */
  website?: string;
}

export interface AccessRequest extends Omit<AccessRequestInput, 'consent' | 'website'> {
  id: string;
  status: AccessRequestStatus;
  adminNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export async function submitAccessRequest(input: AccessRequestInput): Promise<void> {
  await publicFoundationClient.post('/access-requests', input);
}

export async function listAccessRequests(status?: AccessRequestStatus) {
  const { data } = await foundationClient.get<{
    data: AccessRequest[];
    counts: Record<AccessRequestStatus, number>;
  }>('/access-requests', { params: status ? { status } : {} });
  return data;
}

export async function updateAccessRequest(
  id: string,
  update: { status?: AccessRequestStatus; adminNotes?: string },
) {
  const { data } = await foundationClient.patch<AccessRequest>(`/access-requests/${id}`, update);
  return data;
}

export const PLATFORM_ACCESS_REQUEST_READ = 'platform.access_request.read';
