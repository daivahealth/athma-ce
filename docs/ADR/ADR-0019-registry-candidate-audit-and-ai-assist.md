# ADR-0019: Registry Candidate Queue — Decision Audit Metadata and AI Review Assist

**Status:** Proposed
**Date:** 2026-11-09
**Deciders:** Engineering Team, Clinical Informatics, Oncology clinical lead
**Related:** ADR-0006 (AI/ML architecture, PHI and human-in-the-loop), ADR-0014 (specialty plugins), ADR-0018 (provenance, suggestions, feedback, agents)

## Context

The oncology registry candidate queue (`GET /plugins/oncology/registry/candidates`, see
[ONCOLOGY-PLUGIN.md](../features/oncology/ONCOLOGY-PLUGIN.md#registry-candidate-queue--how-patients-enter-the-registry))
lists unregistered patients whose finalised results in the last 180 days suggest cancer. Deterministic rules in
`plugins/oncology/backend/src/registry-candidates.ts` decide what counts and how strong it is. A clinician adds the
patient to the registry or dismisses the finding.

What exists today:

- **Matches are computed on read and not stored.** Each evidence item has `matchedTerms`, `excerpt` and `strength`,
  but `registry_candidate_decisions` stores only `decision`, a free-text `reason`, `decided_by/at` and the new
  diagnosis id. If the rules change, nobody can tell why a past result was listed. The rules have no version.
- **Dismissal reasons are free text.** The dialog offers three presets ("Not a cancer case on review", "Already
  registered at another centre", "Result entered in error"), but they are stored as text. They can't be counted
  reliably.
- **Known blind spots of the text rules.** A pathology comment saying "known case of carcinoma breast,
  post-mastectomy" is flagged as new malignancy. Hedged wording ("atypical cells, malignancy cannot be excluded") and
  outside reports pasted into a local report are not told apart from a new primary.
- **The registry form prefill is thin.** *Add to Registry* fills the patient, the diagnosis date and, from a coded C/D0
  diagnosis, the ICD-10 code. The clinician types primary site, histology, laterality, grade and biomarkers from the
  pathology text.
- **AI infrastructure.** `ai-gateway` calls hosted LLM providers and has a `PhiSanitizerService`. ADR-0006 says PHI
  should stay in secure environments, and on-premises/VPC serving is not built. ADR-0018 defines provenance,
  a suggestion record, `ai_feedback` and event-triggered agents, but these are not built either. Only
  `ai_note_suggestions` exists in the clinical schema: it is scoped to an encounter and nothing writes to it. No
  `pathology_report.finalized` or `imaging_report.finalized` event is emitted.

## Decision

**The rules stay the only gate.** Whether a patient appears in the queue, and at what strength, is decided only by
the versioned, deterministic rules. AI never adds or removes a candidate and never changes a strength. It explains,
labels and drafts, and its output is stored as a suggestion that a clinician accepts, edits or ignores (ADR-0018 §4
and §6).

Delivery is in two steps. Step 1 has no AI and is useful by itself. It also produces the labelled data that Step 2
is evaluated against.

### Step 1 — Decision audit metadata (no AI)

**1.1 Versioned rules with ids.** `registry-candidates.ts` exports `RULESET_VERSION` (for example `2026.11.1`,
bumped on any change to a term list, a regex, a negation or a strength). Each evidence item gains:

| Field | Example |
|---|---|
| `ruleId` | `pathology.malignancy_terms`, `imaging.birads_4_6`, `imaging.lung_rads_4`, `imaging.suspicious_wording`, `diagnosis.icd_c00_c97_d00_d09`, `tumor_marker.abnormal_oncology_test` |
| `rulesetVersion` | `2026.11.1` |

When several patterns match in one result, `ruleId` is the first in rule order and `matchedTerms` keeps all of them.
The API change is additive.

**1.2 Snapshot on every decision.** Nullable columns are added to `plugin_oncology.registry_candidate_decisions`:

| Column | Type | Content |
|---|---|---|
| `reason_code` | varchar(40) | From the fixed list in 1.3. Required for `dismissed`, null for `added` |
| `rule_id` | varchar(60) | Rule that matched this source |
| `ruleset_version` | varchar(20) | Rules version at decision time |
| `strength` | varchar(10) | `high` / `medium` / `low` |
| `matched_terms` | jsonb | As shown to the clinician |
| `excerpt` | text | The triggering clause(s) |
| `result_at` | timestamptz | Result time of the source |

The server builds the snapshot itself: it re-runs the candidate query for that patient and copies the matching
evidence items. It does not trust snapshot fields sent by the client. A dismissal or add that names a source which
is not current evidence for that patient is rejected with `409 Conflict`, so the queue has to be refreshed first.

**1.3 Reason codes.** The dismiss request takes `reasonCode` plus an optional `reason` (free text, required when the
code is `other`):

| Code | Label | Meaning for rule quality |
|---|---|---|
| `not_cancer_on_review` | Not a cancer case on review | Rule false positive |
| `history_of_known_cancer` | Mentions a past or known cancer, not a new one | False positive: history mention |
| `indeterminate_needs_workup` | Indeterminate; await further results | Correct signal, too early |
| `registered_elsewhere` | Already registered at another centre | Correct signal, out of scope |
| `entered_in_error` | Result entered in error | Data quality |
| `other` | Other (free text) | Needs reading |

The labels are clinical wording and need sign-off from the oncology lead before release. Existing rows are backfilled:
the three current presets map to `not_cancer_on_review`, `registered_elsewhere` and `entered_in_error`; anything else
becomes `other` with the text kept.

**1.4 Rule outcome view.** A view, `plugin_oncology.v_registry_candidate_rule_outcomes`, gives counts per `rule_id`,
`ruleset_version`, `strength` and outcome (`added` or each `reason_code`). It shows each rule's precision and the
dismissal reasons, and it is the baseline Step 2 has to beat. No UI is required in Step 1. The view is for clinical
informatics and the evaluation set.

**1.5 Schema delivery.** The columns are nullable and additive, so `npm run db:push` for the plugin schema is safe on
existing tenants. The demo seed (`30-demo-cohort.sql`) already deletes the candidates' decisions on every run.

### Step 2 — AI review assist (advisory only)

**2.1 What the model produces.** Two suggestion types, for **pathology and imaging evidence only** (coded diagnoses
and tumour markers are already structured):

- **`registry_triage`**: one label per evidence item with an explanation and the cited sentence(s), as character
  offsets into the source text:
  `new_primary_likely`, `history_mention`, `hedged_or_indeterminate`, `outside_report`, `not_malignant`.
  The labels match the Step 1 reason codes, so they can be compared directly.
- **`registry_prefill`** (pathology only): a proposed registry entry: primary site with ICD-O-3 topography,
  histology with ICD-O-3 morphology and behaviour, grade, laterality, biomarkers (ER, PR, HER2, Ki-67, p16, PD-L1,
  MMR and so on, as written) and specimen date. Each field cites its source sentence and has a confidence. The output
  must validate against a JSON schema and against the existing oncology catalogues (`00-catalogs.sql`); codes that
  are not in a catalogue are dropped, not passed through.

**2.2 Where it runs, and what triggers it.** The model call lives in `ai-gateway` (a new `oncology-registry-assist`
module, beside `clinical-coding`). The oncology plugin in `clinical` owns the stored suggestions, as ADR-0018 §4
requires.

- **Trigger rule.** Only sources that the Step 1 rules currently match are sent. Nothing else in the result stream
  is.
- **First version (no domain events yet).** When the candidate queue or a candidate's registry form is loaded, the
  plugin enqueues an assist job for every listed source without a current suggestion, and returns at once. A worker
  calls `ai-gateway` and stores the result. The queue never waits for the model: an assist that is not ready, or that
  failed, simply isn't shown.
- **Later.** When `pathology_report.finalized` and `imaging_report.finalized` are emitted (ADR-0018 §6), this becomes
  an agent subscribed to those events, with the same trigger rule, idempotent by event id.
- **Cache.** A suggestion is unique per tenant, source, suggestion type, prompt version and source version (the
  report's `version` and `updated_at`). An amended report or a new prompt version produces a new suggestion and marks
  the old one `superseded`.

**2.3 Storage, until ADR-0018's suggestion table exists.** A plugin table
`plugin_oncology.registry_candidate_assists` with the same fields as the ADR-0018 §4 suggestion record, so it can be
moved there later without reshaping:

`id, tenant_id, patient_id, source_type, source_id, source_version, suggestion_type, payload (jsonb), explanation,
evidence_spans (jsonb), confidence, model, prompt_version, ruleset_version, consent_basis (jsonb), status
(pending | ready | failed | superseded | accepted | edited | rejected | ignored), reviewed_by, reviewed_at,
outcome_diff (jsonb), created_at, updated_at`

Feedback is recorded on the same row until `ai_feedback` exists:

- **Prefill.** When the clinician saves the registry form, the server compares the saved fields with the prefill
  payload and sets `accepted` (no changes), `edited` (with the field-level diff in `outcome_diff`) or `rejected`
  (all AI fields cleared). `registry_candidate_decisions` gains a nullable `assist_id`.
- **Triage.** At dismissal or add, the label is compared with the clinician's outcome or reason code. Prefill
  suggestions left untouched for 30 days become `ignored`.

**2.4 Privacy, consent and configuration.**

- **Off by default.** A per-tenant config key `oncology.registry.ai_assist.enabled` (ADR-0015 config hierarchy), with
  separate switches for triage and prefill.
- **Minimum text.** Only the report fields the rules read (pathology diagnosis, comment, clinical history,
  microscopic description; imaging impression and findings) are sent. Name, MRN, date of birth, contact details and
  ids are not sent. The text goes through `PhiSanitizerService` before it leaves `ai-gateway`, and the redaction
  count is logged.
- **Consent.** Before enqueueing, the patient's consents are checked for the registry purpose (ADR-0018 §7), and the
  consent ids relied on are stored in `consent_basis`. Without a basis, no assist runs.
- **Provider.** Which provider and region a tenant may use for clinical text follows ADR-0006. For Indian tenants,
  this needs a decision under the DPDP Act before the switch is turned on (see open questions).
- **Audit.** Each call is logged in `ai_query_logs` (model, prompt version, latency, tokens, tenant, no PHI).

**2.5 User interface.**

- **Candidate card.** A chip such as *AI: likely history mention* with the explanation and the cited sentence
  highlighted in the excerpt. The chip is clearly marked as AI, does not change sorting or strength, and never hides a
  candidate. A per-user filter "hide AI history mentions" is out of scope until the evaluation in 2.6 supports it.
- **Registry form.** Fields filled from `registry_prefill` carry an *AI draft* badge until the clinician changes or
  confirms them. Each shows its cited sentence on hover. The verification status still defaults as today
  (*Provisional* without a confirming result).
- **Provenance.** The saved diagnosis records which assist it came from (`assist_id` on the decision; ADR-0018 §1
  provenance columns when they exist).

**2.6 Evaluation gate.** Before a tenant can turn an assist type on:

- An offline set built from Step 1 data: dismissed sources with reason codes and added sources with the final
  registry fields (de-identified, with a clinical owner).
- Release criteria, set with the oncology lead. Proposed: on at least 200 pathology reports, ICD-O site and
  morphology exact match of 90% or more, and laterality and grade of 95% or more. For triage, `history_mention`
  precision of 90% or more.
- A prompt or model change is a release: it is re-run against the set and its results recorded with the
  `prompt_version`. The acceptance and edit rates from 2.3 are watched per tenant after go-live.

## Alternatives considered

- **Let the LLM decide who is listed.** Rejected. Results would not be reproducible or auditable, a missed cancer
  would be silent, and ADR-0018 §6 requires a deterministic trigger rule with the model only drafting and explaining.
- **Let the AI label hide candidates (for example history mentions).** Rejected for now. Hiding is a clinical
  decision. It can be reconsidered per tenant once 2.6 shows high precision on local data.
- **Wait for ADR-0018's suggestion and feedback tables.** Rejected as blocking. The plugin table copies their shape
  so moving later is mechanical.
- **Call the model synchronously when the queue loads.** Rejected: latency, cost and failures would land on the
  worklist.
- **Store snapshots sent by the client.** Rejected: they can be stale or forged. The server recomputes them.
- **Reason codes without free text.** Rejected: `other` with text is needed to find categories the list misses.

## Consequences

- The rules become a versioned clinical artefact. Changes need the oncology lead's sign-off and a
  `RULESET_VERSION` bump, and Step 1's view shows their effect.
- Step 1 slightly changes the dismiss API (adds `reasonCode`; `reason` becomes optional except for `other`). The
  frontend dialog and `docs/api` change with it.
- Step 2 adds a worker and a new `ai-gateway` module, a per-tenant cost, and a dependency on consent data being
  recorded for the registry purpose.
- When ADR-0018 phase 1 lands, `registry_candidate_assists` moves into the generic suggestion and feedback tables.

## Open questions

1. Which consent purpose covers cancer registry work: `operations`, or a new `registry` purpose (public-health
   reporting may have a statutory basis that doesn't need consent)?
2. Which provider and region are acceptable for pathology text from Indian tenants under the DPDP Act, and does it
   need on-premises/VPC serving (ADR-0006) first?
3. Who owns the reason-code labels and the triage labels clinically, and who signs off rule changes?
4. Should plugins call `ai-gateway` directly, or through a capability exposed by `clinical` (ADR-0014 / ADR-0015)?

## Phasing

| Phase | Delivers |
|---|---|
| 1a | `RULESET_VERSION`, `ruleId` on evidence, decision snapshot columns, server-side snapshot, 409 on stale sources |
| 1b | Reason codes (API, dialog, backfill), rule outcome view, feature and API docs |
| 2a | `registry_candidate_assists`, `ai-gateway` module, lazy enqueue and worker, triage chip, tenant switch off by default |
| 2b | Prefill with *AI draft* badges and feedback diff, evaluation set and release gate |
| 2c | Event-triggered agent once `pathology_report.finalized` / `imaging_report.finalized` exist; move to ADR-0018 tables |
