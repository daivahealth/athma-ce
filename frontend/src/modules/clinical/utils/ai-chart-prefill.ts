/**
 * Session-scoped handoff of AI-generated narrative content from the
 * Patient AI+ page to the encounter charting page. The clinician must
 * explicitly opt in on both ends (copy on one page, insert on the other) —
 * nothing here writes to the chart automatically.
 */

export interface AiChartPrefillPayload {
  chiefHpi?: string;
  history?: string;
  notes?: string;
  generatedAt: string;
}

const KEY_PREFIX = 'athma:ai-chart-prefill:';

export function storeAiChartPrefill(encounterId: string, payload: AiChartPrefillPayload): void {
  try {
    sessionStorage.setItem(`${KEY_PREFIX}${encounterId}`, JSON.stringify(payload));
  } catch {
    // sessionStorage unavailable (private mode, SSR) — best-effort feature, skip silently
  }
}

export function readAiChartPrefill(encounterId: string): AiChartPrefillPayload | null {
  try {
    const raw = sessionStorage.getItem(`${KEY_PREFIX}${encounterId}`);
    return raw ? (JSON.parse(raw) as AiChartPrefillPayload) : null;
  } catch {
    return null;
  }
}

export function clearAiChartPrefill(encounterId: string): void {
  try {
    sessionStorage.removeItem(`${KEY_PREFIX}${encounterId}`);
  } catch {
    // ignore
  }
}
