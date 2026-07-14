import { useQuery } from '@tanstack/react-query';
import { observationService } from '../services/observation-service';
import type { ClinicalObservation } from '../types/observation';

const OBSERVATION_KEYS = {
  latest: (patientId: string) => ['patient-observations-latest', patientId] as const,
};

/** Latest observation per code for a patient (backs the vitals panel). */
export function useLatestObservations(patientId: string) {
  return useQuery({
    queryKey: OBSERVATION_KEYS.latest(patientId),
    queryFn: () => observationService.getLatestByPatient(patientId),
    enabled: !!patientId,
    staleTime: 30_000,
    retry: false, // vitals degrade gracefully to an empty state if the endpoint errors
  });
}

/** LOINC codes for the core vitals shown in the Care Context rail. */
const VITAL_MATCHERS: Record<string, { codes: string[]; keywords: string[] }> = {
  bloodPressure: { codes: ['85354-9', '55284-4'], keywords: ['blood pressure'] },
  systolic: { codes: ['8480-6'], keywords: ['systolic'] },
  diastolic: { codes: ['8462-4'], keywords: ['diastolic'] },
  heartRate: { codes: ['8867-4'], keywords: ['heart rate', 'pulse'] },
  temperature: { codes: ['8310-5', '8331-1'], keywords: ['temperature'] },
  spo2: { codes: ['59408-5', '2708-6'], keywords: ['oxygen saturation', 'spo2', 'spo₂'] },
};

export interface VitalReading {
  label: string;
  value: string;
  unit?: string | null;
  observedAt?: string;
}

function findVital(obs: ClinicalObservation[], key: keyof typeof VITAL_MATCHERS) {
  const { codes, keywords } = VITAL_MATCHERS[key];
  return obs.find(
    (o) =>
      codes.includes(o.code) ||
      keywords.some((k) => o.displayName?.toLowerCase().includes(k)),
  );
}

function display(o?: ClinicalObservation): string | undefined {
  if (!o) return undefined;
  if (o.valueNumeric != null) return String(o.valueNumeric);
  if (o.valueString) return o.valueString;
  return undefined;
}

/**
 * Derive the core vital-sign readings (BP, HR, Temp, SpO2) from a patient's latest
 * observations. Returns the most recent capture time across the set, if any.
 */
export function deriveVitals(observations: ClinicalObservation[] = []): {
  vitals: VitalReading[];
  lastCaptured?: string;
} {
  const vitals: VitalReading[] = [];

  const bp = findVital(observations, 'bloodPressure');
  const sys = findVital(observations, 'systolic');
  const dia = findVital(observations, 'diastolic');
  if (bp && display(bp)) {
    vitals.push({ label: 'BP', value: display(bp)!, unit: bp.unit, observedAt: bp.observedAt });
  } else if (display(sys) && display(dia)) {
    vitals.push({
      label: 'BP',
      value: `${display(sys)}/${display(dia)}`,
      unit: sys?.unit,
      observedAt: sys?.observedAt,
    });
  }

  const hr = findVital(observations, 'heartRate');
  if (display(hr)) vitals.push({ label: 'HR', value: display(hr)!, unit: hr!.unit ?? 'bpm', observedAt: hr!.observedAt });

  const temp = findVital(observations, 'temperature');
  if (display(temp)) vitals.push({ label: 'TEMP', value: display(temp)!, unit: temp!.unit ?? '°C', observedAt: temp!.observedAt });

  const spo2 = findVital(observations, 'spo2');
  if (display(spo2)) vitals.push({ label: 'SPO₂', value: display(spo2)!, unit: spo2!.unit ?? '%', observedAt: spo2!.observedAt });

  const lastCaptured = [bp, sys, hr, temp, spo2]
    .map((o) => o?.observedAt)
    .filter(Boolean)
    .sort()
    .pop() as string | undefined;

  return { vitals, lastCaptured };
}
