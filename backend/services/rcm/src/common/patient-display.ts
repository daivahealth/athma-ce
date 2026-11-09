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
  authHeader?: string;
  facilityId?: string;
  userId?: string;
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
