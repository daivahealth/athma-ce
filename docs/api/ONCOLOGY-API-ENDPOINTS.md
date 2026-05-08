# Oncology Plugin — API Endpoints

**Base path:** `/api/v1/plugins/oncology`  
**Service:** Clinical (default port 3011)  
**Auth:** Bearer JWT required on all endpoints  
**Required headers:** `x-tenant-id`, `x-user-id`, `x-facility-id`  
**Plugin guard:** `feature.nav.oncology` must be `true` in `instance_configs`

---

## Cancer Diagnosis

### List Diagnoses
```
GET /api/v1/plugins/oncology/diagnoses
```
**Permission:** `oncology.diagnosis.read`

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `patientId` | UUID | Filter by patient |
| `clinicalStatus` | string | active, remission, recurrence, relapsed, resolved |
| `cancerType` | string | ILIKE search |
| `page` | number | Default 1 |
| `limit` | number | Default 20 |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### Get Diagnosis
```
GET /api/v1/plugins/oncology/diagnoses/:id
```
**Permission:** `oncology.diagnosis.read`

Returns the diagnosis record with latest staging and active care plan via subqueries.

---

### Create Diagnosis
```
POST /api/v1/plugins/oncology/diagnoses
```
**Permission:** `oncology.diagnosis.write`  
**HTTP status on success:** 201

**Request body:**
```json
{
  "patientId": "uuid",
  "cancerType": "Breast Cancer",
  "primarySite": "Upper outer quadrant of breast",
  "primarySiteCode": "C50.4",
  "laterality": "left",
  "histologyMorphology": "Infiltrating duct carcinoma",
  "morphologyCode": "8500/3",
  "icdCode": "C50.911",
  "diagnosisDate": "2024-01-15",
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "grade": "G2",
  "metastaticStatus": "localized",
  "isRecurrence": false,
  "ecogAtDiagnosis": 1,
  "notes": "..."
}
```

Required: `patientId`, `cancerType`, `primarySite`, `diagnosisDate`

`diagnosedBy` is resolved automatically from the JWT context (not sent by the client).

---

### Update Diagnosis
```
PUT /api/v1/plugins/oncology/diagnoses/:id
```
**Permission:** `oncology.diagnosis.write`

Partial update — only provided fields are updated (COALESCE pattern in SQL).

---

## Oncology Registry

### List Registry
```
GET /api/v1/plugins/oncology/registry
```
**Permission:** `oncology.registry.read`

Aggregated view: one row per cancer diagnosis, enriched with latest staging and active care plan status.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `cancerType` | string | ILIKE search |
| `clinicalStatus` | string | Filter by status |
| `search` | string | Name/MRN search (via patient JOIN) |
| `page` | number | Default 1 |
| `limit` | number | Default 20 |

**Response row shape:**
```json
{
  "id": "...",
  "patient_id": "...",
  "cancer_type": "Breast Cancer",
  "primary_site": "Upper outer quadrant",
  "clinical_status": "active",
  "metastatic_status": "localized",
  "diagnosis_date": "2024-01-15",
  "latest_stage": "IIA",
  "care_plan_status": "active"
}
```

---

### Get Patient Cancer Summary
```
GET /api/v1/plugins/oncology/registry/:patientId/summary
```
**Permission:** `oncology.registry.read`

Returns the full oncology history for a patient:
```json
{
  "success": true,
  "data": {
    "diagnoses": [...],
    "stagings": [...],
    "tumorBoardCases": [...],
    "carePlans": [...]
  }
}
```

---

## Tumor Staging

### List Stagings
```
GET /api/v1/plugins/oncology/staging
```
**Permission:** `oncology.staging.read`

**Query params:** `cancerDiagnosisId`, `patientId`, `status`, `page`, `limit`

---

### Get Staging
```
GET /api/v1/plugins/oncology/staging/:id
```
**Permission:** `oncology.staging.read`

---

### Create Staging
```
POST /api/v1/plugins/oncology/staging
```
**Permission:** `oncology.staging.write`

`cancerDiagnosisId` is **required** — validated against existing cancer diagnosis records.

---

### Update Staging
```
PUT /api/v1/plugins/oncology/staging/:id
```
**Permission:** `oncology.staging.write`

---

## Tumor Board

### List Cases
```
GET /api/v1/plugins/oncology/tumor-board
```
**Permission:** `oncology.tumor_board.read`

**Query params:** `cancerDiagnosisId`, `patientId`, `status`, `page`, `limit`

---

### Get Case
```
GET /api/v1/plugins/oncology/tumor-board/:id
```
**Permission:** `oncology.tumor_board.read`

---

### Create Case
```
POST /api/v1/plugins/oncology/tumor-board
```
**Permission:** `oncology.tumor_board.manage`

`cancerDiagnosisId` is **required**.

---

### Update Case
```
PUT /api/v1/plugins/oncology/tumor-board/:id
```
**Permission:** `oncology.tumor_board.manage`

---

## Oncology Care Plans

### List Care Plans
```
GET /api/v1/plugins/oncology/care-plans
```
**Permission:** `oncology.care_plan.read`

**Query params:** `patientId`, `status`, `treatmentIntent`, `page`, `limit`

---

### Get Care Plan
```
GET /api/v1/plugins/oncology/care-plans/:id
```
**Permission:** `oncology.care_plan.read`

---

### Create Care Plan
```
POST /api/v1/plugins/oncology/care-plans
```
**Permission:** `oncology.care_plan.write`

Plan number is auto-generated: `OCP-YYYYMM-NNNNN` (sequential per tenant-month).

`cancerDiagnosisId` is **required** and validated.

---

### Update Care Plan
```
PUT /api/v1/plugins/oncology/care-plans/:id
```
**Permission:** `oncology.care_plan.write`

---

### Approve Care Plan
```
POST /api/v1/plugins/oncology/care-plans/:id/approve
```
**Permission:** `oncology.care_plan.approve`

Sets `status = 'active'`, records `approved_by` (from JWT) and `approved_at`.

---

### Revise Care Plan
```
POST /api/v1/plugins/oncology/care-plans/:id/revise
```
**Permission:** `oncology.care_plan.write`

Creates a new version with incremented `version` number and sets `parent_plan_id` to the previous plan. The previous plan is set to `status = 'revised'`.

---

## Chemo Protocols (Phase 2)

### List Protocols
```
GET /api/v1/plugins/oncology/protocols?cancerType=&page=1&limit=20
```
**Permission:** `oncology.chemo_protocol.read`

---

### Get Protocol
```
GET /api/v1/plugins/oncology/protocols/:id
```
**Permission:** `oncology.chemo_protocol.read`

---

### Create Protocol
```
POST /api/v1/plugins/oncology/protocols
```
**Permission:** `oncology.chemo_protocol.write`

Required: `code`, `name`, `cancerType`, `intent`, `regimen` (≥1 drug), `totalCycles`, `cycleDurationDays`.

---

### Update Protocol
```
PUT /api/v1/plugins/oncology/protocols/:id
```
**Permission:** `oncology.chemo_protocol.write`

Partial update — only provided fields are changed.

---

### Deactivate Protocol
```
PUT /api/v1/plugins/oncology/protocols/:id/deactivate
```
**Permission:** `oncology.chemo_protocol.write`

Soft-delete: sets `is_active = false`. Existing orders retain the protocol reference.

---

## Chemo Orders (Phase 2)

### List Orders
```
GET /api/v1/plugins/oncology/orders?patientId=&status=&date=&cancerDiagnosisId=&page=1&limit=20
```
**Permission:** `oncology.chemo_order.read`

---

### Get Order
```
GET /api/v1/plugins/oncology/orders/:id
```
**Permission:** `oncology.chemo_order.read`

Returns order with joined protocol and cancer diagnosis context.

---

### Create Order
```
POST /api/v1/plugins/oncology/orders
```
**Permission:** `oncology.chemo_order.write`

Required: `protocolId`, `patientId`, `cycleNumber`, `dayNumber`, `scheduledDate`. Default status: `pending`.

---

### Update Order
```
PUT /api/v1/plugins/oncology/orders/:id
```
**Permission:** `oncology.chemo_order.write`

Only allowed when `status = pending | draft`.

---

### Approve Order
```
POST /api/v1/plugins/oncology/orders/:id/approve
```
**Permission:** `oncology.chemo_order.approve`

Transitions: `pending → approved`. Records `approved_by` (from JWT) and `approved_at`.

---

### Verify Order
```
POST /api/v1/plugins/oncology/orders/:id/verify
```
**Permission:** `oncology.chemo_order.verify`

Transitions: `approved → verified`. Body: `{ secondVerifiedBy?, nurseVerificationChecklist?, drugPreparationDetails? }`.

---

### Start Administration
```
POST /api/v1/plugins/oncology/orders/:id/start
```
**Permission:** `oncology.chemo_order.administer`

Transitions: `verified → in_progress`. Records `administered_at = NOW()`.

---

### Complete Administration
```
POST /api/v1/plugins/oncology/orders/:id/complete
```
**Permission:** `oncology.chemo_order.administer`

Transitions: `in_progress → completed`. Body: `{ administrationDetails, adverseReactions, notes? }`.

`adverseReactions`: array of `{ drug, ctcaeGrade (1-5), type, onsetTime, description }`.

---

### Hold Order
```
POST /api/v1/plugins/oncology/orders/:id/hold
```
**Permission:** `oncology.chemo_order.write`

Transitions any status → `held`. Body: `{ reason? }`.

---

### Cancel Order
```
POST /api/v1/plugins/oncology/orders/:id/cancel
```
**Permission:** `oncology.chemo_order.write`

Transitions any status → `cancelled`. Body: `{ reason? }`.

---

## Common Error Responses

| Status | Cause |
|--------|-------|
| 400 | Missing required header (`x-tenant-id`, `x-user-id`, `x-facility-id`) or invalid UUID format |
| 401 | Missing or expired JWT |
| 403 | Plugin not enabled (`feature.nav.oncology = false`) or user missing required permission |
| 404 | Record not found (Prisma P2025) |
| 409 | Unique constraint violation (Prisma P2002) |
| 500 | Unexpected server error |

---

## Notes

- All endpoints use `@PluginController('oncology')` which sets the controller path to `plugins/oncology` (no `api/v1` prefix). NestJS's global prefix `api/v1` (set in `main.ts`) is prepended automatically, resulting in the final path `/api/v1/plugins/oncology/...`. Never include `api/v1` in the controller path — it would produce a double-prefix (`/api/v1/api/v1/...`) and a 404. See [DUPLICATE-V1-PATH-FIX.md](../troubleshooting/DUPLICATE-V1-PATH-FIX.md).
- All database queries use `$queryRawUnsafe()` with the `plugin_oncology` schema prefix. There are no cross-schema Prisma relations to the core clinical schema.
- Tenant context is resolved from `AsyncLocalStorage` via `RequestContext.getStore()` — never passed explicitly in service method calls.
- `diagnosedBy` / `createdBy` fields are resolved from `RequestContext.getUserId()` — the frontend never sends these fields.
