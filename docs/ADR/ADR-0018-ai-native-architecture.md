# ADR-0018: AI-Native Architecture — Provenance, Capabilities, Agents and Review-First Workflows

**Status:** Proposed
**Date:** 2026-11-09
**Deciders:** Engineering Team, Clinical Informatics
**Related:** ADR-0006 (AI/ML architecture), ADR-0010 (data architecture), ADR-0013 (service decomposition), ADR-0015 (capabilities, domain events and outbox)

## Context

Athma has AI features, but they sit beside the product instead of running through it. Today:

- **The `ai-gateway` service** provides the patient narrative, clinical coding, the natural-language report builder, catalog population and semantic search. It calls LLM providers (Anthropic, OpenAI, OpenAI-compatible) and reads data through the other services' REST APIs. Its endpoints are separate from the domain services, and humans and agents use different paths.
- **Embeddings** exist only for clinical documents (`clinical_document_embeddings`, `vector(1536)`). Patients, catalogue items, practitioners and terminology carry none.
- **Provenance** is not recorded on clinical data. A diagnosis, order or note does not say whether a person, an AI model, a device or an integration produced it, or who verified it. `ai_note_suggestions` (with `model_version`, `status` and `reviewed_by`) exists in the clinical schema but no service writes to it. The AI chart prefill (`frontend/src/modules/clinical/utils/ai-chart-prefill.ts`) passes text through `sessionStorage`, so after insertion the chart has no record that AI wrote it.
- **Consent** is stored (`patient_consents`), but AI read paths do not check it, and AI outputs do not record which consent allowed them.
- **Feedback** is not captured. `ai_query_logs` records report and search queries, but not whether the user accepted, edited or rejected the result, or that a search returned nothing.
- **Domain events** flow through a transactional outbox (ADR-0015 §5, [DOMAIN-EVENTS.md](../architecture/DOMAIN-EVENTS.md)). The catalogue has three events, `clinical_document.finalized` has no emitter, and no AI component subscribes.
- **Interaction** follows the usual pattern: a filter screen for each module plus a separate search page.

Leadership has defined "AI native" in three layers. Each layer contrasts the target with an "AI bolt-on":

| Layer | AI native | AI bolt-on (what Athma mostly is today) |
|---|---|---|
| Core data model | Data carries relationships (a knowledge graph), embeddings, consent and provenance. Feedback is first-class data. | An LLM guesses (for example, which specialty fits a symptom). |
| Domain | Services offer capabilities, not CRUD. Humans and agents call the same capabilities. Domain events trigger agents. | A separate AI service calls REST APIs. |
| Interaction | Intent first. The UI is generated from tool output. Input can be multimodal. | Filters plus a chatbot. |

The workflow goal is that **clinicians review instead of create**: they review an AI-drafted consultation summary instead of writing it, and approve proposed orders (for example a sepsis bundle) instead of entering them.

ADR-0006 still applies to model hosting, PHI handling and human-in-the-loop. Several things it describes are not built: shadow mode, A/B testing, on-premises model serving and a document AI pipeline. This ADR does not change those decisions. It defines how AI becomes part of the data, domain and interaction layers.

## Decision

### 1. Provenance is recorded on every clinical assertion

Clinical records that can be written by more than one kind of actor get a common set of provenance columns. This covers notes, diagnoses and problems, orders, medication requests, vitals and observations, codes on encounters and charges, and clinical documents:

| Column | Meaning |
|---|---|
| `source_kind` | `human`, `ai`, `device`, `integration` or `import` |
| `source_ref` | For `ai`: a model and prompt-version identifier, such as `ai-gateway/narrative@v3:claude-…`. For `integration`: the connector and message id. |
| `ai_suggestion_id` | Link to the suggestion the record came from, if any (§4) |
| `verified_by`, `verified_at` | The clinician who accepted or signed it. Required before AI-sourced data counts as part of the legal record. |

Rules:

- Existing rows are backfilled as `source_kind = 'human'` (or `import` for seeded data). The column is `NOT NULL` with no default, so each write path must state its source.
- AI-sourced records stay drafts until verified. Clinical documents, orders and prescriptions with `source_kind = 'ai'` cannot be finalized, signed or released without `verified_by`. Each owning service enforces this in its own code, not in the UI.
- Provenance is shown in the UI as a badge ("AI draft", "AI, verified by Dr X"), and appears in exports and FHIR resources (`Provenance`, `meta.source`).

The mixin is added table by table through each service's own migrations. There are no cross-database foreign keys (ADR-0013).

### 2. Feedback is first-class data

A new `ai_feedback` table in the database of the service that owns the subject record (clinical first) records every outcome of an AI output:

- `accepted`, `edited` (with a structured diff), `rejected` (with a reason code) or `ignored` (the suggestion expired without action)
- `zero_result`, for searches and capability calls that found nothing, with the query text and the eventual resolution if the user went on to find the item

Feedback references the suggestion id and the model or prompt version. It feeds three things: evaluation dashboards (the acceptance rate for each feature and model version), regression sets for prompt changes, and knowledge-graph curation (§3). It does not train models online (see ADR-0006 non-goals).

`ai_query_logs` in the analytics database stays as the usage and audit log. `ai_feedback` is the quality signal.

### 3. A curated clinical knowledge graph replaces LLM guessing for reference facts

When a relationship can be curated, Athma stores it as data and uses it before asking a model. The graph is held in relational edge tables next to the catalogues and terminology the edges join. Postgres is enough here, so no graph database is added.

- `kg_edges(tenant_id NULL|uuid, from_type, from_id|code, relation, to_type, to_id|code, weight, provenance, status)`. Global edges have `tenant_id IS NULL`, and tenants can add their own or override them, following the existing pattern for global and tenant catalogues.
- First relations: `symptom → specialty`, `diagnosis → suggested_order_set`, `drug → interacts_with → drug`, `lab_result → critical_threshold`, `specialty → practitioner` (derived from staff records).
- **Edge provenance follows §1.** An edge is `steward` (curated by clinical informatics), `ai` (proposed by a model, inactive until a steward approves it) or `learned` (proposed from feedback patterns, for example repeated zero-result searches that end with the same booking). Only `steward` and approved edges are used at runtime.
- When the graph has no answer, an LLM may propose one. The proposal is labelled as AI, logged as a candidate edge, and shown with that label. It never becomes a fact silently.

Embeddings extend beyond documents to patients' active problem summaries, catalogue items, terminology concepts and practitioner profiles. They are kept current from outbox events (§5), not by the batch reindex alone. Each embedding row records the embedding model and version so the index can be rebuilt when the model changes.

### 4. AI output goes through one suggestion and review model

`ai_note_suggestions` is generalised into the clinical **suggestion** record that every AI-proposed change goes through: draft notes, coded diagnoses, order sets, reschedule plans and so on.

- It holds the suggestion type, subject (patient, encounter), proposed payload, explanation, evidence references (record ids the model used), confidence, model and prompt version, the consent basis (§7), status and reviewer.
- On approval, the owning service applies the payload through its normal capability (with provenance as in §1), sets `ai_suggestion_id` on the resulting records, and writes `ai_feedback`.
- A **review queue** (per clinician, per ward or unit, per encounter) is the shared UI for pending suggestions. The "doctor reviews" workflows below run on it.

Each domain service owns its own suggestions (clinical, rcm, prm), so ADR-0013's boundaries hold. `ai-gateway` produces suggestions but never stores clinical state.

### 5. Services expose capabilities that humans and agents both call

Domain services add **capability endpoints** for actions that matter clinically or operationally, alongside their CRUD endpoints. For example: `patients.find`, `appointments.reschedule-for-practitioner-leave`, `orders.propose-for-diagnosis`, `encounters.draft-consultation-summary`, `results.flag-critical`.

A capability response always has the same shape:

```json
{
  "result": { },
  "explanation": "Why this is the answer, in plain language",
  "evidence": [{ "type": "observation", "id": "…" }],
  "nextActions": [{ "capability": "appointments.confirm-reschedule", "args": { }, "label": "Confirm 6 reschedules" }]
}
```

- **One registry.** Each capability has a typed schema (input, output, required permission) registered in `backend/contracts`. The UI calls it over REST. Agents call the same capability through a **tool server** in `ai-gateway` that reads the registry, for example an MCP server. Auth, the tenant binding from ADR-0017 and RBAC are identical in both paths: an agent acts with the user's token, or with a service identity whose permissions are scoped to a single capability. It never gets a broader key.
- **Same search everywhere.** `patients.find`, `catalog.find` and `practitioners.find` are hybrid: exact match on identifiers, then the knowledge graph, then vector similarity. The command box, the module pages, the patient app and agents all use them.
- Write capabilities that change clinical state accept `mode: "propose"`, which creates a suggestion (§4) instead of applying the change. Agents may only call write capabilities in propose mode.

### 6. Domain events trigger agents, and agents only propose

The outbox event catalogue grows to cover the clinically meaningful triggers: `vitals.recorded`, `lab_result.finalized`, `lab_result.critical`, `encounter.started`, `practitioner.leave.created`, `order.placed`, `medication.administered`. The existing `clinical_document.finalized` gets its emitter. The envelope rule stays: events carry ids, and consumers fetch PHI through authorized APIs.

**Agents** are outbox subscribers hosted in `ai-gateway`. Each agent is a named, versioned unit with:

- the events it subscribes to and a deterministic **trigger rule** (for example qSOFA ≥ 2 or a SIRS criterion together with a suspected infection) that is evaluated before any model is called;
- the capabilities it may call, all reads or propose-mode writes;
- an output that is always a suggestion (§4), never a direct state change;
- a per-tenant on/off and threshold setting, held in the existing config hierarchy (ADR-0015 §2).

The first agents are the **sepsis screen** (vitals or lab event → draft sepsis bundle order set for physician approval), **practitioner leave** (leave event → draft reschedule plan with patient messages, for the front desk to confirm), and **consultation draft** (encounter closed or note requested → draft consultation summary for the physician to sign).

Clinical decision rules such as sepsis criteria are deterministic, versioned and clinically signed off. The model only drafts and explains. Agents are idempotent by event id, as the outbox's at-least-once delivery requires.

### 7. AI reads are consent-aware and record their basis

Every AI read path checks `patient_consents` for the purpose of the request (`treatment`, `operations`, `research`, `patient_engagement`) and excludes data the patient has not consented to share for that purpose. This covers capability calls made by agents, narrative generation, retrieval and embedding search. Suggestions and AI-sourced records store the consent ids they relied on. Embeddings of data from patients who have opted out of a purpose are excluded from search for that purpose. Withdrawing consent triggers the same exclusion through an event.

ADR-0006's PHI rules still decide **where** a model may run. This section decides **which** data it may see.

### 8. Interaction is intent first and rendered from tool output

- **Command box.** A global intent box (in the topbar and on the dashboard) takes free text or speech, resolves the intent to a capability, and either runs a read capability or opens the relevant screen with filters filled in. Module filter screens remain as "prebuilt filters" and as the fallback.
- **Generated UI.** Capability outputs and suggestions render through a fixed library of typed result cards (patient summary, order set draft, reschedule plan, results trend, and others), keyed by output schema. The model chooses which cards and which data to show; it never generates markup or code. Every card offers the `nextActions` from the capability response as buttons.
- **Multimodal input.** Dictation into charting and the command box (speech-to-text that keeps the original audio's provenance), and upload of outside reports (PDF or photo) with extraction into a suggestion for review. Where these models run follows ADR-0006.

### 9. Phasing

| Phase | Delivers | Layer |
|---|---|---|
| 1 | Provenance columns on notes, diagnoses and orders; `ai_feedback`; generalised suggestions and review queue; the AI chart prefill rewritten to create a suggestion instead of using `sessionStorage` | Data |
| 2 | Event catalogue expansion; agent runtime in `ai-gateway`; sepsis screen agent (propose only) | Domain |
| 3 | Consultation draft agent with "review and sign"; consent-aware retrieval | Domain, data |
| 4 | Capability registry and tool server; hybrid `find` capabilities; command box | Domain, interaction |
| 5 | Knowledge graph tables and steward tooling; symptom → specialty in booking; broader embeddings; practitioner leave agent | Data, domain |
| 6 | Typed result cards for more capabilities; dictation; outside-report extraction | Interaction |

Each phase delivers its own docs: API docs for capabilities, feature docs for the review queue and agents, security docs for the consent and agent identity rules.

## Alternatives considered

- **Keep AI in `ai-gateway` and add a chatbot.** This is the fastest route and the most familiar, but it is the bolt-on pattern itself: there is no provenance or feedback, the bot and the UI use different code paths, and there is no event-driven help.
- **Let agents write clinical state directly, with an undo.** Rejected. It breaks the human-in-the-loop requirement in ADR-0006, and in clinical practice an undo does not reverse what has already been acted on.
- **Use a dedicated graph database for the knowledge graph.** Deferred. The first relations are shallow (one or two hops) and must join tenant catalogues, which Postgres already holds. Revisit if traversal depth or volume grows.
- **Have the LLM generate UI markup.** Rejected for safety, accessibility, theming and auditability. Typed cards give most of the benefit.

## Consequences

- Every clinical write path must state its source. This touches many services and tests, so it is phased table by table, starting with the records AI can produce.
- Clinical rules (sepsis criteria, critical thresholds) need clinical owners, version control and sign-off, outside the engineering team.
- The review queue becomes a primary clinical screen and needs the same attention to performance and accessibility as charting.
- Model and prompt versions become part of the record, so prompt changes are releases, evaluated against regression sets built from `ai_feedback`.
- Agent identities are a new kind of principal. They need scoped permissions, audit and rate limits, documented in `docs/security/`.
- `ai-gateway` grows from a feature service into the AI runtime: the tool server, agents and suggestion producers. Clinical state still belongs to the domain services.
- ADR-0006 needs a refresh: it should mark shadow mode, A/B testing, on-premises serving and document AI as not yet built, and point here for how AI fits the data and domain layers.
