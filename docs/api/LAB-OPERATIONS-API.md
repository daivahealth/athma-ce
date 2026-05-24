# Lab Operations API

Clinical service base URL: `http://localhost:3011/api/v1`

This document covers the laboratory operational workflow APIs that sit between lab ordering and final report authorization.

UI ownership note:

- specimen collection is exposed as a separate frontend workspace from the in-lab operations queue
- the backend stage model remains unchanged

## Purpose

These endpoints manage:

- pre-collection label preparation
- sample collection confirmation
- specimen receiving
- accessioning
- processing
- result-entry handoff into the existing `lab_reports` / `lab_result_items` reporting layer

## Authentication and Tenant Context

Required headers:

- `Authorization: Bearer <jwt-token>`
- `x-tenant-id: <tenant-uuid>`

Operational mutations also rely on:

- `x-user-id: <staff-or-user-uuid>`

## Endpoints

### Worklists

`GET /lab-operations/worklists/:stage`

Supported stages:

- `collection`
- `receiving`
- `accessioning`
- `processing`
- `result-entry`

Optional query parameters:

- `encounterId`
- `patientId`

Collection worklist response notes:

- each collection group includes `patientDisplay`, matching the shared Clinical `PatientDisplayDto`
- use `patientDisplay.displayName`, `mrn`, `age`, and `gender` for patient identity rendering instead of showing only UUID-linked context
- the collection frontend route uses the existing `patientId` query parameter to filter the queue to a single patient
- each collection group also exposes a workflow state:
  - `ready`: no specimen label has been prepared yet
  - `prepared`: a pending specimen exists with barcode/label content ready for printing or reprinting

### Specimen Detail

`GET /lab-operations/specimens/:id`

Returns:

- specimen header
- linked `lab_specimen_tests`
- accessions
- operational events
- processing runs

### Collection

`POST /lab-operations/collection/prepare`

Request body:

```json
{
  "orderId": "clinical-order-uuid",
  "labOrderTestIds": ["lab-order-test-uuid", "lab-order-test-uuid-2"],
  "specimenType": "Serum"
}
```

Behavior:

- accepts one anchor lab order plus one or more compatible ordered lab tests
- compatible grouping is validated by:
  - same patient
  - same encounter
  - same canonical specimen type
  - same canonical collection method
- canonical collection metadata is derived from `lab_test_master`, with order-row values only used as fallback
- reuses the same prepared specimen if all selected tests are already linked to one `pending_collection` specimen
- creates `lab_specimens` in `pending_collection` state when no prepared specimen exists yet
- creates `lab_specimen_tests` in `pending_collection` state
- reserves or accepts a specimen barcode before blood draw
- records `label_prepared` and `label_print_requested` specimen events
- returns printable label metadata, including raw `.prn` payload content for workstation/mobile printing

Printing note:

- the backend does not directly talk to Wi-Fi or Bluetooth printers in v1
- the frontend collection screen sends the returned `.prn` payload to a local print bridge when available
- if no bridge is detected, the frontend falls back to downloading the `.prn` file for manual printing

`POST /lab-operations/collection`

Request body:

```json
{
  "specimenId": "prepared-specimen-uuid"
}
```

Behavior:

- marks an already prepared specimen as physically collected after the labeled tube is used
- updates the prepared `lab_specimen` from `pending_collection` to `collected`
- updates linked `lab_specimen_tests` to `collected`
- updates linked `lab_order_tests` to `collected`
- updates every linked parent `clinical_order` to `in_progress`
- records a `collected` specimen event
- supports a manual fallback path where the request can still include `orderId` and `labOrderTestIds`; the service internally prepares the specimen first and then finalizes collection

### Label Reprint

`POST /lab-operations/specimens/:id/print-label`

Behavior:

- requires a specimen that is still in `pending_collection`
- records another `label_print_requested` specimen event
- regenerates the printable label payload for reprint scenarios without creating a second specimen
- returns the same barcode and `.prn` metadata used by the prepare step

Collection worklist behavior:

- the `collection` worklist groups pending tests into specimen-first collection groups
- fasting is shown as a collection instruction, not a primary group splitter
- missing order-row specimen metadata should not create separate `Unspecified` groups when catalog metadata is available
- each collection group carries patient summary context via `patientDisplay` so phlebotomy/lab users can verify patient identity directly in the queue
- the collection UI is a two-step workflow:
  - `Prepare Label`
  - `Mark Collected`

### Receiving

`POST /lab-operations/specimens/:id/receive`

Behavior:

- marks specimen as physically received by the lab
- creates or updates a `lab_accessions` row in `received` state
- updates linked test state to `received`
- records a `received` specimen event

### Accessioning

`POST /lab-operations/specimens/:id/accession`

Behavior:

- assigns or confirms accession number
- updates `lab_accessions` to `accessioned`
- updates specimen and linked test state to `accessioned`
- records an `accessioned` specimen event

### Rejection

`POST /lab-operations/specimens/:id/reject`

Behavior:

- marks specimen as rejected
- updates linked specimen-test and lab-order-test state to `rejected`
- marks any accession rows as rejected
- records a `rejected` specimen event

### Processing

`POST /lab-operations/processing`

Request body:

```json
{
  "specimenId": "specimen-uuid",
  "labOrderTestId": "lab-order-test-uuid",
  "runType": "manual"
}
```

Behavior:

- creates `lab_processing_runs`
- updates specimen, specimen-test, and ordered-test state to `processing`
- records a `processing_started` specimen event

### Result Entry Start

`POST /lab-operations/result-entry/start`

Behavior:

- resolves the requested ordered test and specimen context
- finds or creates an active draft report in `lab_reports`
- hydrates specimen metadata into that draft when available
- records a `result_entry_started` specimen event

### Result Entry Complete

`POST /lab-operations/result-entry/complete`

Behavior:

- requires saved `lab_result_items`
- marks the ordered test and specimen-test link as `result_entered`
- updates specimen state when all linked tests are entered
- records a `result_entered` specimen event

## Frontend Routes

- `/results/lab/collection`
- `/results/lab/operations`
- `/results/lab/operations/result-entry/:labOrderTestId`

Route intent:

- `/results/lab/collection`: nurse/phlebotomy-facing specimen collection queue that prepares labels before blood draw, then confirms collection before lab handoff
- `/results/lab/operations`: lab-internal queue starting from receiving

## Related Docs

- [Clinical Order Design](../features/order-management/18-Order-Management.md)
- [EMR/Clinical Data Capture](../features/clinical/21-EMR-Clinical-Data-Capture.md)
