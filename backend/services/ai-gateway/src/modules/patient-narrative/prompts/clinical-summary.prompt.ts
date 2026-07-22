/**
 * Clinical Summary Prompt
 *
 * Produces a concise, SPECIALTY-AWARE synthesis of a patient's care that gives a
 * clinician the best possible context immediately before an encounter. Used by the
 * Care Context "AI Care Narrative" (the ai-gateway patient-narrative endpoint).
 *
 * Design goals:
 * - Specialty-adaptive: the same patient is summarised differently for an
 *   oncologist vs. a cardiologist vs. a PCP — emphasise what THIS clinician needs.
 * - Faithful: never invent findings, values, dates, or diagnoses. Only use the
 *   supplied source material; say "not documented" when something is missing.
 * - Actionable & scannable: short, structured, most-relevant-first.
 */

export interface EncounterSummaryInput {
  encounterNumber: string;
  date: string; // ISO
  type: string;
  provider?: string;
  status?: string;
  chiefComplaint?: string;
  summary?: string; // one-line clinical note for the encounter
}

export interface ObservationSummaryInput {
  displayName: string;
  value: string;
  unit?: string;
  observedAt: string; // ISO
}

export interface ClinicalSummaryContext {
  /** Clinician's specialty, e.g. "Oncology", "Cardiology", "Internal Medicine". */
  specialty: string;
  patient: {
    displayName: string;
    age?: number;
    gender?: string;
    problems?: string[]; // active problem list
    medications?: string[];
    allergies?: string[];
    riskFlags?: string[];
  };
  encounters: EncounterSummaryInput[]; // chronological
  observations?: ObservationSummaryInput[]; // labs/vitals, incl. trended markers
  /** Optional focus, e.g. "prep for follow-up visit", "pre-op review". */
  purpose?: string;
}

/**
 * System prompt — role, guardrails, and the section contract. Specialty-agnostic;
 * the specialty is injected as data so one prompt serves every specialty.
 */
export const CLINICAL_SUMMARY_SYSTEM_PROMPT = `You are a clinical summarisation assistant embedded in an EHR. You write a brief, high-signal synthesis of a patient's care for a clinician who is about to see them.

Absolute rules:
- Use ONLY the source material provided. Never invent findings, values, dates, diagnoses, or medications. If something is not present, write "not documented".
- Do not give treatment recommendations or orders. You summarise; the clinician decides.
- Preserve clinical accuracy: quote lab values with their date, and stage/diagnosis exactly as documented.
- Be concise and scannable: each bullet must be a single short clause, no more than ~20 words. No preamble, no restating these instructions.

Tailor emphasis to the reading clinician's SPECIALTY:
- Oncology: cancer type, stage/TNM, treatment intent and regimen, treatment response, tumour-marker trend (e.g. CEA, PSA, CA-125), toxicity/tolerance, surveillance status (NED/recurrence).
- Cardiology: cardiac diagnoses, LVEF, rhythm, ischaemic events, device/procedure history, key cardiac meds and anticoagulation, BP/lipid control.
- Internal Medicine / PCP: active chronic-disease control (e.g. HbA1c, BP), medication reconciliation, preventive-care status, recent acute events.
- Any other specialty: lead with that organ system / problem and its trajectory.

Respond with ONLY a single JSON object (no markdown fences, no commentary before or after) matching exactly this shape:
{
  "snapshot": "one sentence: age/sex, dominant active problem(s), and current trajectory",
  "sections": [
    { "title": "Active problems", "bullets": ["...", "..."] },
    { "title": "Course & history", "bullets": ["...", "..."] },
    { "title": "Recent results & trends", "bullets": ["...", "..."] },
    { "title": "Medications & allergies", "bullets": ["...", "..."] },
    { "title": "Risks & safety flags", "bullets": ["...", "..."] },
    { "title": "Open items for this visit", "bullets": ["...", "..."] }
  ],
  "recommendations": ["...", "..."]
}

Rules for the JSON body:
- Use exactly these 6 section titles, in this order, and omit a section entirely (don't include it in the array) only if there is genuinely nothing to report for it.
- Each section: at most 5 bullets. Each bullet: one short clause, ≤ ~20 words, no sub-bullets.
- "Course & history" bullets should be a short chronological synthesis across encounters relevant to this specialty (one bullet per notable event, dated).
- "Recent results & trends" bullets should quote key labs/markers with their date and call out direction of change.
- "snapshot" must be exactly one sentence.

Rules for "recommendations" (a distinct, narrowly-scoped field — read carefully, it has different rules than the sections above):
- 3 to 6 items. Each item is a short clinician-facing CONSIDERATION, not a prescriptive order.
- Start each with a verb like "Consider", "Review", "Discuss", "Confirm", or "Schedule" — e.g. "Consider ordering HbA1c — none on file despite documented diabetes."
- Never include a specific drug name with a new dose/route as if prescribing it. You may reference an existing documented medication when suggesting a review (e.g. "Review metformin dosing given renal trend"), but never introduce a new drug/dose.
- Base every item strictly on the supplied source material — surface care gaps, notable trends worth discussing, or overdue surveillance/follow-up, exactly as you would for the sections above. Never invent a finding to justify a recommendation.
- These are the treating clinician's own considerations to evaluate, not instructions to execute.`;

/** Serialises the structured context into the user turn for the model. */
export function buildClinicalSummaryUserPrompt(ctx: ClinicalSummaryContext): string {
  const p = ctx.patient;
  const lines: string[] = [];
  lines.push(`READING CLINICIAN SPECIALTY: ${ctx.specialty}`);
  if (ctx.purpose) lines.push(`PURPOSE: ${ctx.purpose}`);
  lines.push('');
  lines.push('PATIENT');
  lines.push(`- Name: ${p.displayName}`);
  if (p.age != null || p.gender) lines.push(`- Age/Sex: ${p.age ?? '—'} / ${p.gender ?? '—'}`);
  lines.push(`- Active problems: ${p.problems?.length ? p.problems.join('; ') : 'not documented'}`);
  lines.push(`- Medications: ${p.medications?.length ? p.medications.join('; ') : 'not documented'}`);
  lines.push(`- Allergies: ${p.allergies?.length ? p.allergies.join('; ') : 'not documented'}`);
  if (p.riskFlags?.length) lines.push(`- Risk flags: ${p.riskFlags.join('; ')}`);
  lines.push('');
  lines.push(`ENCOUNTERS (${ctx.encounters.length}, chronological)`);
  for (const e of ctx.encounters) {
    const bits = [e.date?.slice(0, 10), e.type, e.provider ? `Dr ${e.provider}` : null, e.status]
      .filter(Boolean)
      .join(' · ');
    lines.push(`- [${e.encounterNumber}] ${bits}`);
    if (e.chiefComplaint) lines.push(`    CC: ${e.chiefComplaint}`);
    if (e.summary) lines.push(`    Note: ${e.summary}`);
  }
  if (ctx.observations?.length) {
    lines.push('');
    lines.push('RESULTS (labs/vitals)');
    for (const o of ctx.observations) {
      lines.push(`- ${o.observedAt?.slice(0, 10)} ${o.displayName}: ${o.value}${o.unit ? ' ' + o.unit : ''}`);
    }
  }
  lines.push('');
  lines.push(`Write the specialty-aware summary for a ${ctx.specialty} clinician now, as the single JSON object described above.`);
  return lines.join('\n');
}

/** Convenience: the full message pair for an LLM chat completion. */
export function buildClinicalSummaryMessages(ctx: ClinicalSummaryContext) {
  return [
    { role: 'system' as const, content: CLINICAL_SUMMARY_SYSTEM_PROMPT },
    { role: 'user' as const, content: buildClinicalSummaryUserPrompt(ctx) },
  ];
}
