/**
 * Registry candidate detection — pure rules, no I/O.
 *
 * The registry candidate queue lists patients who are not yet in the cancer
 * registry but have a recent result that points to cancer. The service pulls
 * finalised results (pathology, imaging, coded diagnoses, tumour markers) and
 * these rules decide which ones count as evidence and how strong it is.
 *
 * This is a worklist aid for a clinician, not a diagnosis: every candidate is
 * reviewed by a person who either adds the patient to the registry or dismisses
 * the finding.
 */

export type CandidateSourceType = 'pathology' | 'imaging' | 'diagnosis' | 'tumor_marker';
export type CandidateStrength = 'high' | 'medium' | 'low';

export interface CandidateEvidence {
  sourceType: CandidateSourceType;
  sourceId: string;
  strength: CandidateStrength;
  /** Test or order name, e.g. "Core biopsy, breast" or "CT Chest". */
  title: string;
  /** The sentence(s) or value that triggered the match. */
  excerpt: string;
  /** The terms that matched, for display as chips. */
  matchedTerms: string[];
  resultAt: string | null;
  icdCode?: string | null;
}

export interface CandidatePatientGroup {
  patientId: string;
  strength: CandidateStrength;
  latestResultAt: string | null;
  evidence: CandidateEvidence[];
}

// Malignancy vocabulary. Matched case-insensitively against one clause at a time.
const MALIGNANCY_TERMS: Array<[string, RegExp]> = [
  ['carcinoma', /\b(adeno|squamous cell |urothelial |hepatocellular |renal cell |small cell |ductal |lobular )?carcinoma(s)?\b/i],
  ['malignancy', /\bmalignan(t|cy|cies)\b/i],
  ['metastasis', /\bmetasta(sis|ses|tic|sised|sized)\b/i],
  ['sarcoma', /\b\w*sarcoma(s)?\b/i],
  ['lymphoma', /\blymphoma(s)?\b/i],
  ['leukaemia', /\bleuka?emia(s)?\b/i],
  ['myeloma', /\bmyeloma\b/i],
  ['melanoma', /\bmelanoma\b/i],
  ['blastoma', /\b\w+blastoma\b/i],
  ['glioma', /\b(glioma|glioblastoma|astrocytoma|oligodendroglioma)\b/i],
  ['mesothelioma', /\bmesothelioma\b/i],
  ['germ cell tumour', /\b(seminoma|germ cell tumou?r|dysgerminoma|teratocarcinoma)\b/i],
  ['neuroendocrine tumour', /\bneuroendocrine (tumou?r|neoplasm|carcinoma)\b/i],
  ['carcinoma in situ', /\b(carcinoma in situ|DCIS|CIN ?3|high[- ]grade dysplasia)\b/i],
];

// Imaging phrasing and structured scores that flag a suspicious lesion.
const IMAGING_SUSPICION_TERMS: Array<[string, RegExp]> = [
  ['suspicious for malignancy', /\b(suspicious|suggestive|concerning|worrisome) (for|of) (\w+ ){0,3}(malignan\w*|neoplas\w*|carcinoma|metasta\w*|lymphoma)/i],
  ['BI-RADS 4/5/6', /\bBI-?RADS[\s:-]*(category\s*)?([456][ABC]?)\b/i],
  ['LI-RADS 5/M', /\bLI-?RADS[\s:-]*(category\s*)?(LR-?)?(5|M|TIV)\b/i],
  ['PI-RADS 4/5', /\bPI-?RADS[\s:-]*(category\s*)?[45]\b/i],
  ['Lung-RADS 4', /\bLung-?RADS[\s:-]*(category\s*)?4[ABX]?\b/i],
  ['O-RADS 4/5', /\bO-?RADS[\s:-]*(category\s*)?[45]\b/i],
  ['TI-RADS 5', /\bTI-?RADS[\s:-]*(category\s*)?(TR)?5\b/i],
];

// A clause containing one of these before the matched term is a negative finding.
const NEGATION = /\b(no|not|negative for|without|free of|absence of|absent|ruled? out|rule-out|resolved|no evidence of|no residual|no recurren\w*|benign)\b/i;

/** Clause boundaries: sentence ends, semicolons, line breaks, bullet separators. */
function clauses(text: string): string[] {
  return text
    .split(/(?<=[.;!?])\s+|[\n\r]+|\s+[-•]\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

function matchClause(clause: string, terms: Array<[string, RegExp]>): string[] {
  const hits: string[] = [];
  for (const [label, re] of terms) {
    const m = re.exec(clause);
    if (!m) continue;
    // Negated when a negation word appears earlier in the same clause than the match.
    const before = clause.slice(0, m.index);
    if (NEGATION.test(before)) continue;
    // A RADS score of 4/5 is itself the finding; "benign" etc. after it does not negate.
    hits.push(label);
  }
  return hits;
}

export interface TextMatch {
  matchedTerms: string[];
  excerpt: string;
}

/** Scans free text clause by clause; returns null when nothing positive matched. */
export function scanText(text: string | null | undefined, terms: Array<[string, RegExp]>): TextMatch | null {
  if (!text) return null;
  const matched = new Set<string>();
  const excerpts: string[] = [];
  for (const clause of clauses(text)) {
    const hits = matchClause(clause, terms);
    if (hits.length === 0) continue;
    hits.forEach((h) => matched.add(h));
    if (excerpts.length < 2) excerpts.push(clause);
  }
  if (matched.size === 0) return null;
  const excerpt = excerpts.join(' … ');
  return { matchedTerms: [...matched], excerpt: excerpt.length > 280 ? `${excerpt.slice(0, 277)}...` : excerpt };
}

/** Pathology: a positive malignancy statement in the diagnosis (or comment) is high-strength evidence. */
export function classifyPathology(report: { diagnosis?: string | null; comment?: string | null }): TextMatch | null {
  return scanText(report.diagnosis, MALIGNANCY_TERMS) ?? scanText(report.comment, MALIGNANCY_TERMS);
}

/** Imaging: suspicious impression/findings are medium-strength evidence (tissue diagnosis still needed). */
export function classifyImaging(report: { impression?: string | null; findings?: string | null }): TextMatch | null {
  const terms = [...IMAGING_SUSPICION_TERMS, ...MALIGNANCY_TERMS];
  return scanText(report.impression, terms) ?? scanText(report.findings, terms);
}

/**
 * ICD-10 codes that mean cancer: C00–C97 (malignant neoplasms) and D00–D09
 * (in situ neoplasms). Benign (D10–D36) and uncertain-behaviour (D37–D48) codes do not.
 */
export function isCancerIcdCode(code: string | null | undefined): boolean {
  if (!code) return false;
  const c = code.trim().toUpperCase();
  return /^C\d{2}/.test(c) || /^D0\d/.test(c);
}

const STRENGTH_RANK: Record<CandidateStrength, number> = { high: 3, medium: 2, low: 1 };

export function strongest(a: CandidateStrength, b: CandidateStrength): CandidateStrength {
  return STRENGTH_RANK[a] >= STRENGTH_RANK[b] ? a : b;
}

/**
 * Groups evidence by patient. A patient's strength is their strongest piece of
 * evidence; groups are ordered strongest first, then most recent result first.
 */
export function groupByPatient(evidence: Array<CandidateEvidence & { patientId: string }>): CandidatePatientGroup[] {
  const groups = new Map<string, CandidatePatientGroup>();
  for (const { patientId, ...e } of evidence) {
    const g = groups.get(patientId) ?? { patientId, strength: 'low' as CandidateStrength, latestResultAt: null, evidence: [] };
    g.evidence.push(e);
    g.strength = strongest(g.strength, e.strength);
    if (e.resultAt && (!g.latestResultAt || e.resultAt > g.latestResultAt)) g.latestResultAt = e.resultAt;
    groups.set(patientId, g);
  }
  for (const g of groups.values()) {
    g.evidence.sort((x, y) => STRENGTH_RANK[y.strength] - STRENGTH_RANK[x.strength] || (y.resultAt ?? '').localeCompare(x.resultAt ?? ''));
  }
  return [...groups.values()].sort(
    (x, y) => STRENGTH_RANK[y.strength] - STRENGTH_RANK[x.strength] || (y.latestResultAt ?? '').localeCompare(x.latestResultAt ?? ''),
  );
}

export const CANDIDATE_SOURCE_TYPES: readonly CandidateSourceType[] = ['pathology', 'imaging', 'diagnosis', 'tumor_marker'];

export function isCandidateSourceType(v: unknown): v is CandidateSourceType {
  return typeof v === 'string' && (CANDIDATE_SOURCE_TYPES as readonly string[]).includes(v);
}
