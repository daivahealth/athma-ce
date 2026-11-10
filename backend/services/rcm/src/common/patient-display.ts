import { Logger } from '@nestjs/common';
import type { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { resolveClinicalApiUrl } from './service-urls';

/**
 * Patient identity shown next to RCM records (name, MRN, gender, age).
 * RCM has no patient table, so this is read from the Clinical API
 * (GET /patients/:id) and never persisted.
 */
export interface PatientDisplay {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number | null;
  dateOfBirth: string | null;
  gender: string;
}

export interface PatientDisplayContext {
  tenantId: string;
  authHeader?: string | undefined;
  facilityId?: string | undefined;
  userId?: string | undefined;
}

const logger = new Logger('PatientDisplay');

function calculateAge(dateOfBirth: Date | string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function buildPatientDisplay(patient: any): PatientDisplay {
  const age = calculateAge(patient.dateOfBirth);
  return {
    patientId: patient.id,
    mrn: patient.mrn,
    firstName: patient.firstName,
    lastName: patient.lastName,
    displayName: patient.displayName || `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim(),
    age,
    dateOfBirth: age == null ? null : (new Date(patient.dateOfBirth).toISOString().split('T')[0] ?? null),
    gender: patient.gender,
  };
}

function clinicalHeaders(ctx: PatientDisplayContext): Record<string, string> {
  const headers: Record<string, string> = { 'x-tenant-id': ctx.tenantId };
  if (process.env.INTERNAL_API_KEY) headers['x-internal-api-key'] = process.env.INTERNAL_API_KEY;
  if (ctx.authHeader) headers['authorization'] = ctx.authHeader;
  if (ctx.facilityId) headers['x-facility-id'] = ctx.facilityId;
  if (ctx.userId) headers['x-user-id'] = ctx.userId;
  return headers;
}

/**
 * Resolve display data for each unique patient id. Lookups that fail are
 * logged and left out of the map, so callers fall back to whatever they hold.
 */
export async function fetchPatientDisplayMap(
  httpService: HttpService,
  patientIds: Array<string | null | undefined>,
  ctx: PatientDisplayContext,
): Promise<Map<string, PatientDisplay>> {
  const clinicalApiUrl = resolveClinicalApiUrl();
  const headers = clinicalHeaders(ctx);
  const unique = [...new Set(patientIds.filter((id): id is string => !!id))];
  const map = new Map<string, PatientDisplay>();
  await Promise.all(
    unique.map(async (id) => {
      try {
        const response = await firstValueFrom(httpService.get(`${clinicalApiUrl}/patients/${id}`, { headers }));
        if (response?.data) map.set(id, buildPatientDisplay(response.data));
      } catch (error) {
        logger.warn(`Failed to fetch patient ${id} from Clinical API: ${(error as Error).message}`);
      }
    }),
  );
  return map;
}

export interface EncounterPatient {
  patientId: string;
  patientDisplay: PatientDisplay | null;
}

/**
 * For records that only hold an encounter id (e.g. coding sessions): read
 * each encounter from Clinical, which returns its patientId and a built
 * patientDisplay. Failed lookups are logged and left out of the map.
 */
export async function fetchEncounterPatientMap(
  httpService: HttpService,
  encounterIds: Array<string | null | undefined>,
  ctx: PatientDisplayContext,
): Promise<Map<string, EncounterPatient>> {
  const clinicalApiUrl = resolveClinicalApiUrl();
  const headers = clinicalHeaders(ctx);
  const unique = [...new Set(encounterIds.filter((id): id is string => !!id))];
  const map = new Map<string, EncounterPatient>();
  await Promise.all(
    unique.map(async (id) => {
      try {
        const response = await firstValueFrom(httpService.get(`${clinicalApiUrl}/encounters/${id}`, { headers }));
        const encounter = response?.data;
        if (!encounter?.patientId) return;
        map.set(id, {
          patientId: encounter.patientId,
          patientDisplay: encounter.patientDisplay
            ? { ...encounter.patientDisplay, patientId: encounter.patientId }
            : encounter.patient
              ? buildPatientDisplay(encounter.patient)
              : null,
        });
      } catch (error) {
        logger.warn(`Failed to fetch encounter ${id} from Clinical API: ${(error as Error).message}`);
      }
    }),
  );
  return map;
}

/** Most ids a free-text search resolves from Clinical before filtering RCM rows. */
export const PATIENT_SEARCH_MATCH_CAP = 200;

/**
 * Ids of patients whose name / national id / phone / email match `term`,
 * read from Clinical (GET /patients?search=). RCM has no patient table, so
 * list endpoints use this to turn a patient-name search into a
 * `patientId IN (...)` filter. Capped at PATIENT_SEARCH_MATCH_CAP; a failed
 * lookup is logged and yields no ids (the list then matches only on its own
 * columns).
 */
export async function searchPatientIds(
  httpService: HttpService,
  term: string,
  ctx: PatientDisplayContext,
): Promise<string[]> {
  const search = term.trim();
  if (!search) return [];
  try {
    const response = await firstValueFrom(
      httpService.get(`${resolveClinicalApiUrl()}/patients`, {
        headers: clinicalHeaders(ctx),
        params: { search, page: 1, limit: PATIENT_SEARCH_MATCH_CAP },
      }),
    );
    const rows: Array<{ id?: string }> = response?.data?.data ?? [];
    return rows.map((row) => row.id).filter((id): id is string => !!id);
  } catch (error) {
    logger.warn(`Patient search against Clinical API failed: ${(error as Error).message}`);
    return [];
  }
}

/**
 * Ids of encounters whose patient's name matches `term`, read from Clinical
 * (GET /encounters?search=, newest first). For records that hold only an
 * encounter id (coding sessions). Same cap and failure behaviour as
 * searchPatientIds.
 */
export async function searchEncounterIds(
  httpService: HttpService,
  term: string,
  ctx: PatientDisplayContext,
): Promise<string[]> {
  const search = term.trim();
  if (!search) return [];
  try {
    const response = await firstValueFrom(
      httpService.get(`${resolveClinicalApiUrl()}/encounters`, {
        headers: clinicalHeaders(ctx),
        params: { search, page: 1, limit: PATIENT_SEARCH_MATCH_CAP },
      }),
    );
    const rows: Array<{ id?: string }> = response?.data?.data ?? [];
    return rows.map((row) => row.id).filter((id): id is string => !!id);
  } catch (error) {
    logger.warn(`Encounter search against Clinical API failed: ${(error as Error).message}`);
    return [];
  }
}
