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

`plannedModalities` is an array of per-modality entries, each with its own schedule:
`{ modality, sequence, status, details?, startDate?, endDate?, plannedCycles?, cycleDurationDays?, plannedFractions?, protocolId?, protocolCode?, protocolName? }`.
The `protocol*` fields apply to the `chemotherapy` modality only and snapshot the chemo
protocol chosen at planning time; the frontend pre-populates this protocol when a chemo
order is created against the plan. Top-level `plannedCycles`/`cycleDurationDays` are
derived from the chemotherapy modality (kept for list views / backward compatibility).

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

Every protocol in the response carries `phases` (see below) and `supportive_care`.

---

### Get Protocol
```
GET /api/v1/plugins/oncology/protocols/:id
```
**Permission:** `oncology.chemo_protocol.read`

Protocols saved before the phase model (stored `phases = []`) are returned with a
single synthesised phase named `Main` built from `regimen`, `total_cycles` and
`cycle_duration_days`. Synthesised phase/drug ids change per request until the
protocol is saved.

---

### Create Protocol
```
POST /api/v1/plugins/oncology/protocols
```
**Permission:** `oncology.chemo_protocol.write`

Required: `code`, `name`, `cancerType`, `intent`, and `phases` (preferred) — or the legacy
`regimen` (≥1 drug) + `totalCycles` + `cycleDurationDays`.

#### Phase-based regimen (`phases`)

`phases` is an ordered array; cycles run phase after phase (phase 2 starts at the cycle after
phase 1's last cycle).

```jsonc
[
  {
    "id": "uuid",                 // optional on write; generated if missing
    "name": "AC",
    "cycles": 4,                  // integer ≥ 1
    "cycleDurationDays": 14,      // integer ≥ 1
    "notes": "optional",
    "drugs": [
      {
        "id": "uuid",
        "drug": "Doxorubicin",
        "dose": 60, "unit": "mg/m²", "route": "IV",
        "days": [1],              // cycle days, each ≤ cycleDurationDays
        "doseFormula": "bsa",     // bsa | weight | fixed | auc
        "infusionDurationMin": 15, "diluent": "NS 100 mL",
        "maxDose": 2,             // optional cap per administration, mg
        "doseLevels": [{ "level": -1, "dose": 50 }],
        "overrides": [            // optional cycle-specific changes
          { "cycles": [1], "dose": 8, "days": [1, 8], "infusionDurationMin": 90, "omit": false, "note": "loading dose" }
        ]
      }
    ]
  }
]
```

- `overrides[].cycles` are **phase-relative** (1 = first cycle of that phase) and must be within
  `1..cycles`. Later overrides win field-by-field; `omit: true` drops the drug for those cycles.
- When `phases` is sent, the server **derives** `regimen` (one entry per phase drug line, base
  dose, with a `phase` name), `total_cycles` (sum of phase cycles) and `cycle_duration_days`
  (first phase); any `regimen` / `totalCycles` / `cycleDurationDays` in the body are ignored.
- Validation failures return `400` with `{ message: "Invalid protocol phases", errors: string[] }`.

---

### Update Protocol
```
PUT /api/v1/plugins/oncology/protocols/:id
```
**Permission:** `oncology.chemo_protocol.write`

Partial update — only provided fields are changed. Sending `phases` replaces the whole regimen
and re-derives `regimen` / `total_cycles` / `cycle_duration_days`.

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

For phased protocols, `protocol_regimen` holds only the drugs given in the order's
`cycle_number`, with that cycle's overrides applied (dose, days; omitted drugs removed), plus
`phase` / `phaseCycle` / `note` on each entry. `protocol_phases` carries the full phase list.
Legacy (unphased) protocols return the flat `regimen` unchanged.

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

## Treatment Schedules

Patient schedules generated from a phased protocol. Read endpoints need
`oncology.chemo_order.read`; write endpoints need `oncology.chemo_order.write`. Shapes and
behaviour: [ONCOLOGY-PLUGIN — Patient treatment schedule](../features/oncology/ONCOLOGY-PLUGIN.md#patient-treatment-schedule--treatment_plans-treatment_cycles-treatment_days).

### List Treatment Plans
```
GET /api/v1/plugins/oncology/treatment-plans?patientId=&carePlanId=&cancerDiagnosisId=&status=
```
Summaries (max 200): protocol code/name, `start_date`, `end_date`, `next_date`, `total_cycles`,
`total_days`, `given_days`, `status`, `patientDisplay`.

### Get Treatment Plan
```
GET /api/v1/plugins/oncology/treatment-plans/:id
```
Plan with `protocol_snapshot`, measurements, `patientDisplay`, `cycles[]` and `days[]` (each day
with `items[]`, `chemo_order_id`, `order_status`).

### Create Treatment Plan
```
POST /api/v1/plugins/oncology/treatment-plans
```
Body: `oncologyCarePlanId` (or `patientId` + `cancerDiagnosisId`), `protocolId`, `startDate`
(C1D1, `YYYY-MM-DD`), `heightCm` + `weightKg` (or `bsa`), optional `creatinineClearance`
(required in practice for `auc` drugs — otherwise those items carry a warning and no dose),
`notes`. Returns the full plan (201).

### Update Treatment Plan
```
PUT /api/v1/plugins/oncology/treatment-plans/:id
```
`status` (active | on_hold | completed | cancelled), `notes`, and/or `heightCm`, `weightKg`,
`bsa`, `creatinineClearance` — changed measurements re-dose open (`planned`/`held`) days.

### Delay Cycle
```
POST /api/v1/plugins/oncology/treatment-plans/:id/cycles/:cycleNumber/delay
```
Body `{ days: 1–90, reason? }`. Moves the cycle and all later cycles. `400` if any of those days
is already ordered or given.

### Set Cycle Dose Level
```
PUT /api/v1/plugins/oncology/treatment-plans/:id/cycles/:cycleNumber/dose-level
```
Body `{ doseLevel: 0 | -1 | -2 | -3, applyToLaterCycles?: boolean }`. Re-doses open days.

### List Treatment Days (worklist)
```
GET /api/v1/plugins/oncology/treatment-days?date=YYYY-MM-DD
GET /api/v1/plugins/oncology/treatment-days?from=YYYY-MM-DD&to=YYYY-MM-DD&status=
```
Days across patients (range ≤ 62 days; skipped/cancelled excluded unless `status` is given), with
patient, protocol, phase, dose level and order status. Only active / on-hold plans.

### Update Treatment Day
```
PUT /api/v1/plugins/oncology/treatment-days/:id
```
`status` (planned | held | skipped | cancelled), `notes`. Refused while the day has an
ordered/given chemo order — change the order instead.

### Create Order for Day
```
POST /api/v1/plugins/oncology/treatment-days/:id/order
```
Creates the chemo order from the plan (cycle, day, date, BSA/weight/height/CrCl, dose-level
`doseAdjustments`) and marks the day `ordered`. Returns `{ order, plan }` (201). Order
completion / hold / cancel update the day (`given` / `held` / back to `planned`).

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
