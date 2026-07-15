---
"@zeal/ai-gateway": minor
"@zeal/frontend": minor
---

Add the **AI Care Narrative** for the Care Context workspace.

**ai-gateway** exposes `POST /api/v1/ai/patients/:patientId/narrative` (optional body `{ specialty? }`). It gathers the patient's demographics, encounters, and latest observations from the Clinical database, assembles a `ClinicalSummaryContext`, and calls the configured LLM via the shared clinical-summary prompt to produce a specialty-aware synthesis. The response is `{ narrative, specialty, model, sourceCount, generatedAt }`.

It degrades gracefully: when no LLM provider/API key is configured (the common dev case), it responds `503` with a structured `{ available: false, reason }` instead of crashing. A `?dryRun=true` query returns the assembled prompt without calling the LLM, for testing.

**frontend** wires the Care Context "Care Narrative" card to the endpoint via a new `careNarrativeService` + `useCareNarrative(patientId, specialty)` hook. When the LLM narrative is available it renders live; on `503`/unavailable it keeps the existing local `buildNarrativePreview()` output as a clearly-labelled fallback. The "Refresh" button now refetches the narrative.
