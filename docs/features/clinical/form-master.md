# Form Master (OpenMedForm Integration)

Lets a clinician fill structured, externally-designed forms against a patient's encounter, without athma-ce needing its own form builder.

## Workflow

1. **Design** the form in [OpenMedForm](https://github.com/daivahealth/openmedform)'s own UI and publish it.
2. **Export** the published form as a JSON bundle (OpenMedForm's Download button, or `GET /api/forms/:formId/export` on the OpenMedForm side) — a self-contained document with `dataSchema` (JSON Schema 2020-12), `uiSchema`, `printSchema`, `translations`, and optional `assets`, uniquely identified by `formCode` + `version`. Published OpenMedForm versions are immutable.
3. **Upload** that JSON into athma-ce at `/forms/master/new` (Clinical → Form Master → Upload Form). An admin pastes or picks the file, sets the form's frequency (see below), and submits. This creates a `FormMaster` row storing the entire bundle. Import is manual only — athma-ce never calls OpenMedForm's API directly.
4. **Fill** the form from an encounter's Clinical Charting page — a "Forms" section lists active master forms available to start and any responses already begun for that encounter. Filling opens `@openmedform/react-form-renderer`'s `JsonFormsRenderer`, the same open-source JSON Forms engine OpenMedForm itself uses, bound to the stored `dataSchema`/`uiSchema`.
5. **Save** progress as a draft at any time, or **submit** — submission re-validates the response against `dataSchema` (client-side always; server-side via Ajv as a second check) before accepting it as `FINAL`.

## Frequency

Every master form carries `frequencyType` / `frequencyValue` / `frequencyUnit`, describing how often it's meant to be administered (e.g. "Every 4 hours", "Once daily", "Once per shift"). See [Form Master API](../../api/FORM-MASTER-API-ENDPOINTS.md#frequency) for the full enum table.

**This is metadata only** — it's stored and displayed, but nothing currently uses it to automatically create due form instances or send reminders. Automated recurring-instance creation (mirroring the inpatient checklist module's `autoCreateOn`/`autoCreateConditions`/`autoCreateDueHours` pattern) is a tracked follow-up, not yet built.

## Data model

Two tables in the clinical database (`backend/shared/database-clinical/prisma/schema.prisma`):

- `FormMaster` — one row per uploaded form version. Stores the full OpenMedForm bundle as JSON, plus the frequency spec and lifecycle status (`ACTIVE`/`ARCHIVED`).
- `FormResponse` — one row per fill instance, linked to `patientId` + `encounterId` (both required — forms are always filled in the context of a specific encounter), with its own `formCode`/`formVersion`/`engine` copied from the master at creation time (so a response always self-describes the definition it was captured against, even if the master form is later revised) and a `DRAFT` → `FINAL` → `AMENDED` status lifecycle.

Unlike the inpatient checklist module (`ChecklistTemplate`/`ChecklistTemplateItem`/`ChecklistInstance`/`ChecklistInstanceResponse`), Form Master doesn't normalize fields into per-item rows — a form's structure is an opaque JSON Schema bundle from OpenMedForm rather than an athma-ce-defined field list, so the response is stored as a single JSON payload matching OpenMedForm's own recommended stored-response shape.

## Non-goals

- No automated recurring form-instance creation or reminders (see Frequency above).
- No direct integration with OpenMedForm's export API — upload is always a manual step.
- No pixel-exact print rendering (`@openmedform/form-print-engine` is not wired in).
