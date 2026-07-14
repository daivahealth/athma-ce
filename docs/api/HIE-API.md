# HIE (External Records) API

Clinical service base URL: `http://localhost:3011/api/v1`

Consent-driven fetch of external patient records from a Health Information
Exchange (HIE). The concrete network is **region-agnostic** and selected behind
a provider interface (mock in development). See
[ADR-0012](../ADR/ADR-0012-hie-integration-architecture.md).

## Purpose

These endpoints let a clinician:

- create/grant a consent request authorising an external-record fetch
- run a consent-gated fetch that pulls external records via the configured HIE
  provider and ingests them as patient documents
- poll fetch status and retry a failed fetch

External records are ingested through the existing patient-documents layer
(`documentType` = the external record type, `metadata.source = "hie"`).

## Authentication and Tenant Context

Required headers:

- `Authorization: Bearer <jwt-token>`
- Tenant/facility context is resolved by `TenantContextMiddleware` (as with all
  clinical endpoints).

Permissions (reusing existing clinical permissions):

- `consent.create` — create consent request
- `consent.read` — read consent request
- `patient.update` — run/retry a fetch (ingests documents)
- `patient.read` — read fetch status

## Consent model

Fetches are gated on the existing consent module using the `hie_participation`
consent type (validity 365 days; supports grant / expiry / renew via the
existing `/patients/:patientId/consents` endpoints). A consent's UI status is
returned as `derivedStatus`: `granted | expiring | expired | revoked | inactive`.

## Endpoints

### POST /hie/consent-requests

Create (grant) a consent request for external fetch.

Request body:

```json
{
  "patientId": "uuid",
  "purpose": "Fetch external health records via HIE",
  "patientReference": "ABHA/EID/MRN (optional)",
  "metadata": { "any": "audit fields (optional)" }
}
```

Response `201`: the consent row plus `derivedStatus`.

### GET /hie/consent-requests/:id

Fetch a single consent request by id (tenant-scoped). Returns the consent row
plus `derivedStatus`.

### POST /hie/fetch

Consent-gated fetch. Validates an active granted `hie_participation` consent for
the patient, records a fetch job, calls the provider, ingests returned records as
patient documents, and returns the job with a summary.

Request body:

```json
{
  "patientId": "uuid",
  "recordTypes": ["lab_report", "discharge_summary", "imaging"],
  "patientReference": "ABHA/EID/MRN (optional)",
  "simulateFailure": false
}
```

- `recordTypes` — optional filter; omit for all available records.
- `simulateFailure` — demo/sandbox only; forces the mock provider to fail so the
  retry path can be exercised. Ignored by real providers.

Returns `403` if there is no active HIE consent for the patient.

Response `201` (success):

```json
{
  "id": "job-uuid",
  "patientId": "uuid",
  "provider": "mock",
  "status": "completed",
  "attempts": 1,
  "recordsFetched": 3,
  "documentIds": ["doc-uuid", "..."],
  "summary": {
    "provider": "mock",
    "recordsReturned": 3,
    "documentsCreated": 3,
    "records": [
      { "externalId": "mock-lab-...", "recordType": "lab_report", "title": "...", "sourceSystem": "..." }
    ]
  },
  "canRetry": false
}
```

On provider failure the job is persisted with `status: "failed"`,
`errorCode`, `errorMessage`, and `canRetry: true`.

### GET /hie/fetch-status/:id

Return a fetch job's current status (tenant-scoped), including `canRetry`.
Statuses: `pending | fetching | completed | failed`.

### POST /hie/fetch/:id/retry

Retry a previously **failed** fetch job. Increments `attempts`, re-runs the
provider call, and ingests any records. Returns `400` if the job is not in a
failed state. Mirrors the prototype's "fetch failed — retry" affordance.

## Ingestion notes

- Each external record becomes a `patient_documents` row: `documentType` = record
  type, `documentNumber` = external id, `metadata.source = "hie"` with provider,
  `fetchJobId`, `sourceSystem`, and original record metadata.
- Ingestion is idempotent per patient: a record already ingested (same external
  id + type) is reused rather than duplicated on repeat fetches.

## Provider abstraction

The active network is bound to the `HIE_PROVIDER` DI token in `HieModule`. The
default is `MockHieProvider`. A real network (ABDM, NABIDH, ...) implements the
same `HieProvider` interface and is swapped in via config with no change to the
controller, service, or data model. See ADR-0012.

## Data model / migration

State is tracked in `hie_fetch_jobs` (clinical schema). Migration
`backend/shared/database-clinical/migrations/009_add_hie_fetch_jobs.sql` is
provided but **not auto-applied** to the shared database.
