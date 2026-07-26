# Form Master API Endpoints

This document defines the v1 Form Master backend APIs implemented in the Clinical service, covering the OpenMedForm integration: uploading a master form definition and filling responses against a patient + encounter.

Base URL:

```text
http://localhost:3011/api/v1
```

Required headers:

```text
Authorization: Bearer <jwt-token>
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
```

## Scope

Forms are designed and published externally in OpenMedForm, then exported as a self-contained JSON bundle (`dataSchema`, `uiSchema`, `printSchema`, `translations`, `assets` — see [OpenMedForm's THIRD-PARTY-GUIDE](https://github.com/daivahealth/openmedform/blob/main/docs/integration/THIRD-PARTY-GUIDE.md)). An admin uploads that bundle into athma-ce as a `FormMaster`; a clinician then starts a `FormResponse` against a specific patient + encounter, fills it using the OpenMedForm React renderer, and submits it. Import is manual upload/paste only — athma-ce does not call OpenMedForm's export API.

This is a first-class module under `backend/services/clinical/src/modules/form-master/` (not a specialty plugin), since it needs typed joins against `Patient`/`Encounter` and is a generic, cross-specialty capability.

## Frequency

Each `FormMaster` carries a frequency spec describing expected administration cadence. It is **metadata only** in this phase — nothing auto-creates scheduled instances from it yet (tracked as a follow-up).

| frequencyType | frequencyValue | frequencyUnit | Meaning |
|---|---|---|---|
| `EVERY_N_HOURS` | e.g. `4` | `HOUR` | Every 4 hours |
| `EVERY_N_HOURS` | e.g. `6` | `HOUR` | Every 6 hours |
| `DAILY` | `1` | `DAY` | Once daily |
| `EVERY_N_DAYS` | e.g. `2` | `DAY` | Every 2 days |
| `WEEKLY` | `1` | `WEEK` | Weekly |
| `ONCE_PER_SHIFT` | — | — | Once per shift |
| `ONCE_PER_ADMISSION` | — | — | Once per admission |
| `ONCE_PER_EPISODE` | — | — | Once per episode |
| `ON_DEMAND` | — | — | Fill whenever needed |
| `EVENT_BASED` | — | — | Trigger after an event |

`frequencyUnit` enum: `HOUR | DAY | WEEK | MONTH`.

## Form Master

### `POST /form-master`

Uploads a new master form. Body:

```jsonc
{
  "name": "Nursing Assessment",       // optional — defaults to bundle.name
  "language": "en",                    // optional — defaults to bundle.language
  "frequencyType": "DAILY",
  "frequencyValue": 1,                 // required only for EVERY_N_HOURS / EVERY_N_DAYS
  "frequencyUnit": "DAY",
  "bundle": { "formCode": "...", "version": "1", "engine": "jsonforms", "dataSchema": {...}, "uiSchema": {...}, ... }
}
```

The `bundle` must contain `formCode`, `version`, `engine`, `dataSchema`, `uiSchema` — validated as a shape check, not full JSON-Schema-of-JSON-Schema validation. Rejects with 400 if a `FormMaster` already exists for this tenant with the same `formCode` + `formVersion` (published OpenMedForm versions are immutable; a revision must be uploaded as a new `version`).

### `GET /form-master?status=`

Lists master forms for the tenant (`status` optional: `ACTIVE | ARCHIVED`). Returns metadata only — `bundle` is omitted from list responses (it can be large: schemas + translations + assets).

### `GET /form-master/:id`

Fetches one master form including its full `bundle`.

### `PATCH /form-master/:id`

Updates metadata only (`name`, `status`, `frequencyType`, `frequencyValue`, `frequencyUnit`). The `bundle` itself is immutable — upload a new `FormMaster` with a new `formVersion` instead.

## Form Responses

### `POST /form-responses`

Starts a response instance. Body: `{ "formMasterId", "patientId", "encounterId" }`. Copies `formCode`/`formVersion`/`engine` from the referenced `FormMaster` onto the response at creation time, so a stored response always self-describes the definition it was captured against — even after the master form is later revised or archived. Created with `status: DRAFT` and empty `data`.

### `GET /form-responses/:id`

Fetches one response, including its `formMaster` (with `bundle`, for rendering).

### `GET /form-responses/encounter/:encounterId`

### `GET /form-responses/patient/:patientId`

List responses for an encounter or patient (summary `formMaster` only: id/name/formCode/formVersion).

### `PATCH /form-responses/:id`

Saves response data. Body: `{ "data": {...}, "status": "DRAFT" | "FINAL" }`.

- `status: DRAFT` — free-form save, no validation.
- `status: FINAL` — re-validates `data` against the master form's `dataSchema` using Ajv (2020-12 dialect, same as OpenMedForm's own renderer) before accepting. Returns 400 with `{ message, errors }` if invalid. Sets `completedBy`/`completedAt` on first transition into `FINAL`.
- Once a response is `FINAL`, further saves must explicitly pass `status: AMENDED` (mirrors the `DRAFT/FINAL/AMENDED` lifecycle already used for encounter notes).

## Frontend

- `frontend/src/modules/clinical/hooks/use-form-master.ts` — React Query hooks (`useFormMasters`, `useFormMaster`, `useCreateFormMaster`, `useUpdateFormMaster`, `useFormResponsesByEncounter`, `useFormResponsesByPatient`, `useFormResponse`, `useCreateFormResponse`, `useSaveFormResponse`).
- `/forms/master` — admin list + upload (`/forms/master/new`).
- Encounter charting page (`/encounters/[id]/charting`) — a "Forms" section listing active master forms available to fill and existing responses for that encounter.
- `/encounters/[id]/forms/[formResponseId]` — the fill page. Renders `@openmedform/react-form-renderer/jsonforms`'s `JsonFormsRenderer` bound to `formMaster.bundle.dataSchema`/`uiSchema`, validates client-side before allowing Submit, and calls `PATCH /form-responses/:id`.
