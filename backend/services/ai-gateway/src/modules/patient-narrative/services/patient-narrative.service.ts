/**
 * Patient Narrative Service
 *
 * Assembles a patient's demographics + encounters + latest observations into a
 * ClinicalSummaryContext and calls the configured LLM (via LLMClientService) using
 * the shared clinical-summary prompt to produce a specialty-aware "AI Care Narrative".
 *
 * Data boundary: reads only from the Clinical database (patients, encounters,
 * encounter diagnoses, clinical observations). All queries are tenant-scoped.
 *
 * Graceful degradation: if no LLM provider/API key is configured (the common case
 * in dev), the LLM call throws ServiceUnavailableException; we catch it and return a
 * structured { available: false, reason } result so the caller (controller) can
 * respond 503 and the frontend can fall back to its local narrative preview.
 */

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { LLMClientService } from '../../../shared/llm-client/llm-client.service';
import { NarrativeCacheService } from './narrative-cache.service';
import {
  buildClinicalSummaryMessages,
  type ClinicalSummaryContext,
  type EncounterSummaryInput,
  type ObservationSummaryInput,
} from '../prompts/clinical-summary.prompt';
import { logger } from '../../../common/logger/logger.config';

/** How much history to feed the model. */
const MAX_ENCOUNTERS = 30;
const MAX_OBSERVATIONS = 40;

export interface GenerateNarrativeOptions {
  specialty?: string;
  dryRun?: boolean;
  /** Bypass the Redis cache and force a fresh LLM call (used by the "Refresh" button). */
  forceRefresh?: boolean;
}

export interface NarrativeSection {
  title: string;
  bullets: string[];
}

export type NarrativeResult =
  | {
      available: true;
      narrative: string;
      snapshot: string;
      sections: NarrativeSection[];
      specialty: string;
      model: string;
      sourceCount: number;
      generatedAt: string;
    }
  | { available: false; reason: string }
  | {
      dryRun: true;
      specialty: string;
      sourceCount: number;
      messages: { role: 'system' | 'user'; content: string }[];
    };

/**
 * Parses the model's JSON response into { snapshot, sections }. Strips a
 * ```json fenced block if the model wrapped it despite instructions not to.
 * Falls back to a single "Summary" section holding the raw text if the
 * response isn't valid JSON, so a malformed reply still renders.
 */
function parseNarrativeJson(raw: string): { snapshot: string; sections: NarrativeSection[] } {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : raw;
  try {
    const parsed = JSON.parse(candidate);
    const snapshot = typeof parsed.snapshot === 'string' ? parsed.snapshot : '';
    const sections: NarrativeSection[] = Array.isArray(parsed.sections)
      ? parsed.sections
          .filter((s: unknown): s is { title: unknown; bullets: unknown } => !!s && typeof s === 'object')
          .map((s: { title: unknown; bullets: unknown }) => ({
            title: typeof s.title === 'string' ? s.title : '',
            bullets: Array.isArray(s.bullets) ? s.bullets.filter((b: unknown) => typeof b === 'string') : [],
          }))
          .filter((s: NarrativeSection) => s.title && s.bullets.length > 0)
      : [];
    if (!snapshot && sections.length === 0) throw new Error('Empty narrative JSON');
    return { snapshot, sections };
  } catch {
    return { snapshot: '', sections: [{ title: 'Summary', bullets: [raw.trim()] }] };
  }
}

/** Flattens structured sections back into plain text (dry-run / raw fallback). */
function flattenNarrative(snapshot: string, sections: NarrativeSection[]): string {
  const parts: string[] = [];
  if (snapshot) parts.push(snapshot);
  for (const s of sections) {
    parts.push(`${s.title}:`);
    parts.push(...s.bullets.map((b) => `- ${b}`));
  }
  return parts.join('\n');
}

@Injectable()
export class PatientNarrativeService {
  constructor(
    private readonly clinicalPrisma: ClinicalPrismaService,
    private readonly llmClient: LLMClientService,
    private readonly narrativeCache: NarrativeCacheService,
  ) {}

  async generate(
    patientId: string,
    tenantId: string,
    options: GenerateNarrativeOptions = {},
  ): Promise<NarrativeResult> {
    let context: ClinicalSummaryContext;
    let sourceCount: number;
    let encounterCount: number;
    try {
      const assembled = await this.buildContext(patientId, tenantId, options.specialty);
      context = assembled.context;
      sourceCount = assembled.sourceCount;
      encounterCount = assembled.encounterCount;
    } catch (err) {
      // Missing patient / clinical-data read failure — degrade to the client preview.
      logger.warn(
        { tenantId, patientId, err: this.extractMessage(err) },
        'Care narrative context assembly failed — degrading',
      );
      return { available: false, reason: this.extractMessage(err) };
    }

    const messages = buildClinicalSummaryMessages(context);

    // Dry run: return the assembled prompt without calling the LLM (for testing).
    if (options.dryRun) {
      return {
        dryRun: true,
        specialty: context.specialty,
        sourceCount,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      };
    }

    // Cache: a patient with an unchanged encounter count reuses the last narrative
    // instead of spending LLM tokens again. "Refresh" (forceRefresh) bypasses this.
    if (!options.forceRefresh) {
      const cached = await this.narrativeCache.get(tenantId, patientId, context.specialty, encounterCount);
      if (cached) return cached;
    }

    try {
      const response = await this.llmClient.completion({
        messages,
        temperature: 0.2,
        maxTokens: 1500,
      });

      const { snapshot, sections } = parseNarrativeJson(response.content.trim());

      const result: NarrativeResult = {
        available: true,
        narrative: flattenNarrative(snapshot, sections),
        snapshot,
        sections,
        specialty: context.specialty,
        model: response.model,
        sourceCount,
        generatedAt: new Date().toISOString(),
      };

      await this.narrativeCache.set(tenantId, patientId, context.specialty, encounterCount, result);

      return result;
    } catch (err) {
      // No provider/API key configured, unsupported provider, or upstream LLM error.
      // Degrade gracefully so the frontend can render its local preview instead.
      const reason =
        err instanceof ServiceUnavailableException
          ? this.extractMessage(err)
          : 'AI narrative generation is temporarily unavailable.';
      logger.warn({ tenantId, patientId, err: this.extractMessage(err) }, 'Care narrative unavailable — degrading');
      return { available: false, reason };
    }
  }

  // ─── Context assembly ──────────────────────────────────────

  private async buildContext(
    patientId: string,
    tenantId: string,
    specialtyOverride?: string,
  ): Promise<{ context: ClinicalSummaryContext; sourceCount: number; encounterCount: number }> {
    const patient = await this.clinicalPrisma.patient.findFirst({
      where: { id: patientId, tenantId },
    });
    if (!patient) {
      throw new Error(`Patient clinical record is unavailable for this tenant.`);
    }

    const [encounters, diagnoses, observations] = await Promise.all([
      this.clinicalPrisma.encounter.findMany({
        where: { patientId, tenantId },
        orderBy: { startTime: 'asc' },
        take: MAX_ENCOUNTERS,
      }),
      this.clinicalPrisma.encounterDiagnosis.findMany({
        where: { patientId, tenantId },
        orderBy: { diagnosedAt: 'desc' },
      }),
      this.clinicalPrisma.clinicalObservation.findMany({
        where: { patientId, tenantId },
        orderBy: { observedAt: 'desc' },
        take: 200,
      }),
    ]);

    // Latest encounter that carries a med/allergy list is the best snapshot source.
    const encountersDesc = [...encounters].reverse();
    const medSource = encountersDesc.find((e) => this.asStringArray(e.currentMedications).length > 0);
    const allergySource = encountersDesc.find((e) => this.asStringArray(e.allergies).length > 0);

    const problems = this.distinct(diagnoses.map((d) => d.diagnosisName)).slice(0, 20);
    const medications = medSource ? this.asStringArray(medSource.currentMedications) : [];
    const allergies = allergySource ? this.asStringArray(allergySource.allergies) : [];

    const encounterInputs: EncounterSummaryInput[] = encounters.map((e) => ({
      encounterNumber: e.encounterNumber,
      date: e.startTime.toISOString(),
      type: (e.encounterType || e.encounterClass || 'encounter').replace(/_/g, ' '),
      status: e.status,
      chiefComplaint: e.chiefComplaint ?? undefined,
      summary: e.notes ?? undefined,
    }));

    // Keep only the most recent reading per observation code, cap the total.
    const observationInputs = this.latestPerCode(observations).slice(0, MAX_OBSERVATIONS);

    const specialty = specialtyOverride?.trim() || this.inferSpecialty(problems, encounters.map((e) => e.encounterType ?? ''));

    const context: ClinicalSummaryContext = {
      specialty,
      patient: {
        displayName:
          patient.displayName?.trim() ||
          [patient.firstName, patient.lastName].filter(Boolean).join(' '),
        age: this.ageFrom(patient.dateOfBirth),
        gender: patient.gender,
        problems,
        medications,
        allergies,
      },
      encounters: encounterInputs,
      observations: observationInputs,
      purpose: 'Context synthesis ahead of a clinical encounter',
    };

    return {
      context,
      sourceCount: encounterInputs.length + observationInputs.length,
      encounterCount: encounterInputs.length,
    };
  }

  // ─── Helpers ───────────────────────────────────────────────

  /** Reduce a desc-ordered observation list to the latest reading per code. */
  private latestPerCode(
    observations: Array<{
      code: string;
      displayName: string;
      unit: string | null;
      observedAt: Date;
      valueNumeric: unknown;
      valueString: string | null;
      valueCode: string | null;
    }>,
  ): ObservationSummaryInput[] {
    const seen = new Set<string>();
    const out: ObservationSummaryInput[] = [];
    for (const o of observations) {
      if (seen.has(o.code)) continue;
      const value = this.observationValue(o);
      if (value == null) continue;
      seen.add(o.code);
      out.push({
        displayName: o.displayName,
        value,
        unit: o.unit ?? undefined,
        observedAt: o.observedAt.toISOString(),
      });
    }
    return out;
  }

  private observationValue(o: {
    valueNumeric: unknown;
    valueString: string | null;
    valueCode: string | null;
  }): string | null {
    if (o.valueNumeric != null) return String(o.valueNumeric);
    if (o.valueString) return o.valueString;
    if (o.valueCode) return o.valueCode;
    return null;
  }

  /** Coerce a Prisma Json field into a list of human-readable strings. */
  private asStringArray(value: unknown): string[] {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (item == null) return '';
          if (typeof item === 'string') return item;
          if (typeof item === 'object') {
            const rec = item as Record<string, unknown>;
            const label = rec.name ?? rec.medication ?? rec.drug ?? rec.substance ?? rec.display ?? rec.label;
            return typeof label === 'string' ? label : JSON.stringify(item);
          }
          return String(item);
        })
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  private distinct(values: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of values) {
      const t = v?.trim();
      if (!t || seen.has(t.toLowerCase())) continue;
      seen.add(t.toLowerCase());
      out.push(t);
    }
    return out;
  }

  private ageFrom(dob?: Date | null): number | undefined {
    if (!dob) return undefined;
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return undefined;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : undefined;
  }

  /** Best-effort specialty inference — mirrors the frontend narrative-preview heuristic. */
  private inferSpecialty(problems: string[], encounterTypes: string[]): string {
    const t = `${problems.join(' ')} ${encounterTypes.join(' ')}`.toLowerCase();
    if (/cancer|oncolog|carcinoma|tumou?r|chemo|metasta|adenocarcinoma|neoplasm/.test(t)) return 'Oncology';
    if (/cardi|heart failure|myocard|arrhythm|coronary|ischaem|ischem/.test(t)) return 'Cardiology';
    if (/diabet|hypertension|copd|ckd|renal/.test(t)) return 'Internal Medicine';
    return 'General Medicine';
  }

  private extractMessage(err: unknown): string {
    if (err instanceof ServiceUnavailableException) {
      const res = err.getResponse();
      if (typeof res === 'string') return res;
      if (res && typeof res === 'object' && 'message' in res) {
        const msg = (res as { message: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
      return err.message;
    }
    if (err instanceof Error) return err.message;
    return 'Unknown error';
  }
}
