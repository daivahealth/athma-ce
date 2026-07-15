import { parseISO } from 'date-fns';
import type { Patient } from '@/modules/clinical/types/patient';
import type { Encounter } from '@/modules/clinical/types/encounter';

export interface NarrativePreview {
  specialty: string;
  snapshot: string;
  paragraphs: string[];
}

function ageFrom(dob?: string | null): number | null {
  if (!dob) return null;
  try {
    const b = parseISO(dob);
    const now = new Date();
    let a = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
    return a;
  } catch {
    return null;
  }
}

/** Best-effort specialty inference from the problem list + encounter types. */
export function detectSpecialty(text: string): string {
  const t = text.toLowerCase();
  if (/cancer|oncolog|carcinoma|tumou?r|chemo|metasta|adenocarcinoma/.test(t)) return 'Oncology';
  if (/cardi|heart failure|myocard|arrhythm|coronary|ischaem/.test(t)) return 'Cardiology';
  if (/diabet|hypertension|copd|ckd|renal/.test(t)) return 'Internal Medicine';
  return 'General Medicine';
}

/**
 * A deterministic, client-side preview of the specialty-aware care narrative,
 * synthesised from the structured encounter data. This is a transparent stand-in
 * for the AI narrative endpoint (which will use the clinical summary prompt);
 * it never fabricates values — it only re-states what the encounters record.
 */
export function buildNarrativePreview(patient: Patient, encounters: Encounter[]): NarrativePreview | null {
  if (!encounters?.length) return null;

  const asc = [...encounters].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const desc = [...encounters].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const clinical = desc.find(
    (e) => (e.allergies?.length ?? 0) > 0 || (e.currentMedications?.length ?? 0) > 0 || !!e.medicalHistory,
  );
  const conditions = clinical?.medicalHistory ?? '';
  const typesText = asc.map((e) => e.encounterType ?? e.encounterClass ?? '').join(' ');
  const specialty = detectSpecialty(`${conditions} ${typesText}`);

  const age = ageFrom(patient.dateOfBirth);
  const primaryProblem = conditions.split(/[,;]/)[0]?.trim() || 'active conditions on file';
  const snapshot = `${age != null ? `${age}y ` : ''}${patient.gender} — ${primaryProblem}.`;

  const paragraphs: string[] = [];

  // Course / relevant history (chronological synthesis from encounter notes)
  const course: string[] = [];
  const dx = asc.find((e) => /consult|colonoscopy|biopsy|diagnos|staging/i.test(e.encounterType ?? '') && e.notes);
  if (dx?.notes) course.push(dx.notes);
  const surgery = asc.find((e) => /surg|colectomy|resect/i.test(e.encounterType ?? '') && e.notes);
  if (surgery?.notes) course.push(surgery.notes);
  const chemoCount = asc.filter((e) => /chemo/i.test(e.encounterType ?? '')).length;
  if (chemoCount > 0) course.push(`Completed ${chemoCount} chemotherapy encounter${chemoCount > 1 ? 's' : ''} on record.`);
  const latestFinished = desc.find((e) => (e.status ?? '').toLowerCase() === 'finished' && e.notes);
  if (latestFinished?.notes) {
    course.push(`Most recent completed visit (${latestFinished.startTime.slice(0, 10)}): ${latestFinished.notes}`);
  }
  if (course.length) paragraphs.push(course.join(' '));

  // Medications & safety
  const meds = clinical?.currentMedications ?? [];
  const allergies = clinical?.allergies ?? [];
  const medSafety: string[] = [];
  if (meds.length) medSafety.push(`Active medications: ${meds.join(', ')}.`);
  if (allergies.length) medSafety.push(`Allergies / safety flags: ${allergies.join(', ')}.`);
  if (medSafety.length) paragraphs.push(medSafety.join(' '));

  // Open items — next planned encounter
  const nextPlanned = asc.find(
    (e) => (e.status ?? '').toLowerCase() === 'planned' && new Date(e.startTime).getTime() >= Date.now(),
  );
  if (nextPlanned) {
    paragraphs.push(
      `Upcoming: ${nextPlanned.encounterType ?? nextPlanned.encounterClass} scheduled ${nextPlanned.startTime.slice(0, 10)}${nextPlanned.notes ? ` — ${nextPlanned.notes}` : ''}.`,
    );
  }

  return { specialty, snapshot, paragraphs };
}
