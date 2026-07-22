# Patient AI+

Patient AI+ is a read-only, LLM-generated insights page for a single patient.
It opens at `/[locale]/patients-ai/[patientId]`.

## Purpose

Patient AI+ surfaces the same structured Care Narrative used on the
[Care Context workspace](care-context-workspace.md) — snapshot, titled
sections, and a short list of non-prescriptive recommendations — next to the
patient's identity/context rail (the same `PatientContextRail` component
Care Context uses for its left pane). It shares Care Narrative's Redis cache
(`care-narrative:{tenantId}:{patientId}:{specialty}:{encounterCount}`), so
opening this page after Care Context (or vice versa) does not spend another
LLM call.

## Layout

Three columns: the patient context rail, the AI Care Narrative pane (larger),
and the AI Recommendations pane (smaller, visually distinct).
Recommendations are intentionally **not** rendered on Care Context — they
only appear here.

## Start Charting from AI

If the patient has an encounter open today (status `arrived`, `triaged`,
`in-progress`, or `onleave`), a "Start Charting from AI" card appears below
the two AI panes. Clicking "Copy AI Summary to Chart":

1. Writes the narrative snapshot, sections, and recommendations into
   `sessionStorage` under `athma:ai-chart-prefill:{encounterId}`
   (`frontend/src/modules/clinical/utils/ai-chart-prefill.ts`) — nothing is
   sent to the backend at this point.
2. Navigates to that encounter's charting page
   (`/[locale]/encounters/[id]/charting`).

On the charting page, `SmartChartingEditor` checks for a pending prefill for
its `encounterId` once the existing note (if any) has loaded. If there's
AI-drafted content that doesn't collide with blocks already in the chart, it
shows a banner with **Insert AI Draft** / **Dismiss**. Insert creates
`chiefHpi`, `history`, and `notes` text blocks from the prefill content
(skipping any block type already present) — the clinician still has to
review and click **Save** for anything to be persisted. Dismiss just clears
the pending prefill. This is a client-side handoff only; there is no backend
"draft" concept and no auto-save.

Because the prefill only ever targets the three freeform text blocks, it
cannot populate `diagnosis`/`orders`/`prescription` blocks — those remain
manually entered, coded data.
