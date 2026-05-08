# Oncology Plugin

**Plugin ID:** `oncology`  
**Schema:** `plugin_oncology`  
**Target service:** `clinical` (port 3011)  
**Phase:** Phase 2 complete — Registry / Core EMR + Chemotherapy Module  
**Data model reference:** [FHIR mCODE (Minimal Common Oncology Data Elements)](https://confluence.hl7.org/display/COD/mCODE)

---

## Clinical Workflow

The oncology plugin follows the correct clinical sequence. Each step is a prerequisite for the next:

```
CancerDiagnosis  →  TumorStaging  →  TumorBoardCase  →  OncologyCarePlan
     (anchor)         (staging)         (MDT review)       (treatment plan)
        ↓
  Phase 2: Chemotherapy (ChemoProtocol → ChemoOrder)
        ↓
  Phase 3: Radiation Therapy
```

All staging, tumor board, and care plan records link back to a `CancerDiagnosis` as the anchor record. A patient may have multiple diagnoses (e.g., a second primary or a recurrence tracked separately).

---

## Navigation

| Nav Item          | Route                         | Description                                       |
|-------------------|-------------------------------|---------------------------------------------------|
| Oncology Registry | `/oncology/registry`          | All cancer patients with diagnosis summary        |
| Tumor Staging     | `/oncology/staging`           | Staging records across patients                   |
| Tumor Board       | `/oncology/tumor-board`       | MDT case reviews and decisions                    |
| Care Plans        | `/oncology/care-plans`        | Treatment plans linked to diagnoses               |
| Chemo Protocols   | `/oncology/protocols`         | Reusable protocol templates (Phase 2)             |
| Chemo Orders      | `/oncology/orders`            | Per-patient chemotherapy orders (Phase 2)         |

---

## Data Model

All tables live in the `plugin_oncology` PostgreSQL schema within the clinical database. Tenant isolation is enforced via `tenant_id` on every table.

### `cancer_diagnoses` — Anchor Record

Every oncology patient starts here. Maps to FHIR mCODE `PrimaryCancerCondition`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `tenant_id` | UUID | Tenant isolation |
| `patient_id` | UUID | Soft FK to core `patients` |
| `encounter_id` | UUID? | Encounter where diagnosed |
| `encounter_diagnosis_id` | UUID? | Soft FK to core `encounter_diagnoses` |
| `cancer_type` | VARCHAR(200) | e.g. "Breast Cancer" |
| `primary_site` | VARCHAR(200) | ICD-O-3 topography text |
| `primary_site_code` | VARCHAR(20)? | ICD-O-3 code e.g. C50.9 |
| `laterality` | VARCHAR(20)? | left, right, bilateral, not_applicable |
| `histology_morphology` | VARCHAR(200)? | ICD-O-3 morphology text |
| `morphology_code` | VARCHAR(20)? | ICD-O-3 code e.g. 8500/3 |
| `icd_code` | VARCHAR(20)? | ICD-10 for billing |
| `snomed_code` | VARCHAR(20)? | SNOMED CT concept |
| `diagnosis_date` | DATE | |
| `clinical_status` | VARCHAR(30) | active, remission, recurrence, relapsed, resolved |
| `verification_status` | VARCHAR(30) | provisional, differential, confirmed, refuted |
| `grade` | VARCHAR(50)? | G1–G4, GX |
| `metastatic_status` | VARCHAR(20) | localized, regional, distant, unknown |
| `is_recurrence` | BOOLEAN | default false |
| `biomarkers` | JSONB | { ER, PR, HER2, Ki67, PDL1, EGFR, ALK, … } |
| `ecog_at_diagnosis` | INT? | 0–5 performance status |
| `diagnosed_by` | UUID | Provider user ID (from JWT context) |
| `notes` | TEXT? | |

**Relations:** → `tumor_stagings[]`, `tumor_board_cases[]`, `oncology_care_plans[]`, `chemo_orders[]`

### `tumor_stagings`

| Key addition | Notes |
|---|---|
| `cancer_diagnosis_id` | Required FK to `cancer_diagnoses` |
| `staging_edition` | e.g. "AJCC 8th" |
| `staging_type` | clinical, pathological, restaging, recurrence |

### `tumor_board_cases`

| Key addition | Notes |
|---|---|
| `cancer_diagnosis_id` | Required FK to `cancer_diagnoses` |
| `mdt_recommendation` | Replaces old `recommendation` field |
| `treatment_intent` | curative, adjuvant, neoadjuvant, palliative, surveillance |
| `recommended_pathway` | JSONB — ordered list of `{ modality, sequence, details }` |
| `review_outcome` | approved, deferred_for_more_info, second_opinion, clinical_trial |
| `molecular_profile` | TEXT — genomic/molecular findings |

### `oncology_care_plans`

Treatment plan originating from tumor board or direct oncologist decision.

| Column | Type | Notes |
|--------|------|-------|
| `plan_number` | VARCHAR(50) | Auto-generated: `OCP-YYYYMM-NNNNN` |
| `version` | INT | Increments on revision; default 1 |
| `parent_plan_id` | UUID? | Previous version for revised plans |
| `treatment_intent` | VARCHAR(50) | curative, adjuvant, neoadjuvant, palliative, surveillance, supportive |
| `oncology_subspecialty` | VARCHAR(50)? | medical_oncology, surgical_oncology, radiation_oncology, hemato_oncology, gynec_oncology |
| `planned_modalities` | JSONB | Array of `{ modality, sequence, status, details, startDate, endDate }` |
| `status` | VARCHAR(30) | draft, active, on_hold, completed, cancelled, revised |
| `approved_by` | UUID? | Provider who approved |
| `approved_at` | TIMESTAMPTZ? | |

### `chemo_protocols`

Reusable protocol templates. Unique per `(tenant_id, code)`.

| Column | Type | Notes |
|--------|------|-------|
| `code` | VARCHAR(50) | Unique per tenant: FOLFOX, CHOP, AC-T, etc. |
| `name` | VARCHAR(200) | Full protocol name |
| `cancer_type` | VARCHAR(200) | Target cancer type |
| `intent` | VARCHAR(50) | curative, adjuvant, neoadjuvant, palliative |
| `regimen` | JSONB | Array of `{ drug, dose, unit, route, day, doseFormula, infusionDurationMin, diluent }` |
| `total_cycles` | INT | |
| `cycle_duration_days` | INT | |
| `premedications` | JSONB | Antiemetics, steroids, H2 blockers |
| `hydration` | JSONB | Array of `{ fluid, ratePerHour, durationHours, timing }` |
| `lab_prerequisites` | JSONB | Array of `{ test, parameter, minValue, unit, timing }` — e.g. ANC ≥ 1500 |
| `emetogenic_risk` | VARCHAR(20)? | minimal, low, moderate, high |
| `dose_formula` | VARCHAR(10) | bsa (default), weight, fixed — protocol-level default |
| `supportive_care` | JSONB | G-CSF, growth factors, etc. |
| `is_active` | BOOLEAN | Soft-delete; existing orders retain reference |

### `chemo_orders`

Per-patient order instance derived from a protocol. Status workflow: `draft → pending → approved → verified → in_progress → completed | held | cancelled`.

| Column | Type | Notes |
|--------|------|-------|
| `protocol_id` | UUID | FK to `chemo_protocols` |
| `patient_id` | UUID | |
| `cancer_diagnosis_id` | UUID? | Soft FK to `cancer_diagnoses` |
| `oncology_care_plan_id` | UUID? | Soft FK to `oncology_care_plans` |
| `cycle_number` | INT | |
| `day_number` | INT | Day within cycle |
| `scheduled_date` | DATE | |
| `weight_kg` | DECIMAL? | Patient biometric at time of order |
| `height_cm` | DECIMAL? | |
| `bsa` | DECIMAL? | Body surface area (auto-calculated: √(H×W/3600)) |
| `creatinine_clearance` | DECIMAL? | mL/min |
| `hepatic_adjustment_grade` | VARCHAR(10)? | normal, child_a, child_b, child_c |
| `renal_adjustment_grade` | VARCHAR(10)? | normal, mild, moderate, severe |
| `dose_adjustments` | JSONB | Manual per-drug adjustments with reason |
| `pre_chemo_checklist` | JSONB | Consent, allergy review, lab review checkboxes + dates |
| `ordering_provider` | UUID? | Physician who ordered |
| `approved_by` | UUID? | Pharmacist / second-physician sign-off |
| `approved_at` | TIMESTAMPTZ? | |
| `verified_by` | UUID? | First nurse verification |
| `verified_at` | TIMESTAMPTZ? | |
| `second_verified_by` | UUID? | Second nurse (ASCO/ONS dual-check) |
| `administered_by` | UUID? | Nurse who administered |
| `administered_at` | TIMESTAMPTZ? | |
| `adverse_reactions` | JSONB | Array of `{ drug, ctcaeGrade, type, onsetTime, description }` |
| `administration_details` | JSONB | Per-drug: `[{ drug, startedAt, completedAt, ratePerHour, accessSite }]` |

---

## Subspecialty Design

The plugin uses a **single plugin, workflow tags** approach rather than separate plugins per subspecialty.

- `CancerDiagnosis`, `TumorStaging`, and `TumorBoard` are shared across all oncology subspecialties
- Tumor Board is inherently multi-disciplinary (medical + surgical + radiation + pathology attend the same meeting)
- The existing `Department` model allows hospitals to create departments like "Medical Oncology" and "Surgical Oncology" under the same ONCO specialty code
- Splitting into multiple plugins would cause data duplication and break MDT cross-discipline views

**How subspecialties are tagged:**
- `oncologySubspecialty` enum field on `OncologyCarePlan` tags which subspecialty owns each treatment leg
- `TumorBoardCase.attendees` JSON captures `{ staffId, role, specialty }` per attendee
- Phase 2 (Chemo) is naturally medical oncology; Phase 3 (Radiation) is naturally radiation oncology — they are sub-modules within the same plugin

**Supported subspecialties:** `medical_oncology`, `surgical_oncology`, `radiation_oncology`, `hemato_oncology`, `gynec_oncology`

---

## Permissions

All oncology permissions follow the pattern `oncology.<resource>.<action>`.

| Permission | Granted to |
|------------|-----------|
| `oncology.diagnosis.read` | Super Admin, Tenant Admin, Physician |
| `oncology.diagnosis.write` | Super Admin, Tenant Admin, Physician |
| `oncology.registry.read` | Super Admin, Tenant Admin, Physician |
| `oncology.staging.read` | Super Admin, Tenant Admin, Physician |
| `oncology.staging.write` | Super Admin, Tenant Admin, Physician |
| `oncology.tumor_board.read` | Super Admin, Tenant Admin, Physician |
| `oncology.tumor_board.manage` | Super Admin, Tenant Admin, Physician |
| `oncology.care_plan.read` | Super Admin, Tenant Admin, Physician |
| `oncology.care_plan.write` | Super Admin, Tenant Admin, Physician |
| `oncology.care_plan.approve` | Super Admin, Tenant Admin, Physician |
| `oncology.chemo_protocol.read` | Super Admin, Tenant Admin, Physician |
| `oncology.chemo_protocol.write` | Super Admin, Tenant Admin, Physician |
| `oncology.chemo_order.read` | Super Admin, Tenant Admin, Physician |
| `oncology.chemo_order.write` | Super Admin, Tenant Admin, Physician |
| `oncology.chemo_order.approve` | Super Admin, Tenant Admin, Physician (pharmacist sign-off) |
| `oncology.chemo_order.verify` | Super Admin, Tenant Admin, Physician, Nurse |
| `oncology.chemo_order.administer` | Super Admin, Tenant Admin, Nurse |

---

## Plugin Activation

### Feature Flag

The oncology plugin is gated by `feature.nav.oncology` in the `instance_configs` table (foundation DB). The `PluginGuard` checks this per request.

To enable (already done in seed; run this if starting from a fresh DB):
```sql
-- Run against zeal_foundation DB
INSERT INTO instance_configs (id, config_key, value, value_type, category, description, is_overridable, is_sensitive, created_at, updated_at)
VALUES (gen_random_uuid(), 'feature.nav.oncology', 'true', 'boolean', 'feature', 'Enable Oncology module navigation', true, false, NOW(), NOW())
ON CONFLICT (config_key) DO UPDATE SET value = 'true', updated_at = NOW();
```

### Seeding Permissions

Oncology permissions are defined in `seed/foundation/04-permissions.sql`. Role assignments are in `seed/foundation/05-role-permissions.sql` (super_admin gets all permissions via cross join).

If permissions are missing after a DB reset, re-run the seed files or use the runbook below.

### Troubleshooting Activation

If oncology API calls return **403 Forbidden**:
1. Check `feature.nav.oncology` in `instance_configs` — must be `true`
2. Log out and log back in — the JWT caches permissions at login time
3. Verify oncology permissions exist in `permissions` table and are granted to the user's role in `role_permissions`

See also: [Troubleshooting Plugin Activation](../../troubleshooting/README.md)

---

## Frontend Structure

```
frontend/src/plugins/oncology/
├── index.ts                          # Plugin registration, nav definition
├── types/index.ts                    # TypeScript interfaces (snake_case, matches raw SQL)
├── services/oncology-service.ts      # Axios API calls (BASE_URL = '/plugins/oncology')
├── hooks/use-oncology.ts             # React Query hooks
└── components/
    ├── AddDiagnosisSheet.tsx         # Slide-over form: Add to Registry
    ├── TreatmentIntentBadge.tsx      # Colored badge component
    └── shared.tsx                    # LoadingState, EmptyState, StatusBadge

frontend/src/app/[locale]/(dashboard)/oncology/
├── registry/
│   ├── page.tsx                      # Registry list with AddDiagnosisSheet
│   └── [patientId]/page.tsx          # Full patient cancer profile
├── staging/
│   ├── page.tsx                      # Tumor staging list
│   ├── new/page.tsx
│   └── [id]/edit/page.tsx
├── tumor-board/
│   ├── page.tsx                      # Tumor board cases
│   ├── new/page.tsx
│   └── [id]/edit/page.tsx
├── care-plans/
│   ├── page.tsx                      # Care plans list
│   ├── new/page.tsx
│   └── [id]/edit/page.tsx
├── protocols/                        # Phase 2 — Chemo Protocols
│   ├── page.tsx                      # Protocol list with deactivate toggle
│   ├── new/page.tsx                  # Regimen builder (drug rows, hydration, lab prerequisites)
│   └── [id]/edit/page.tsx
└── orders/                           # Phase 2 — Chemo Orders
    ├── page.tsx                      # Order list with status filter
    ├── new/page.tsx                  # BSA calculator, dose calculator, pre-chemo checklist
    └── [id]/page.tsx                 # Order detail + approval/verify/administer workflow
```

---

## Backend Structure

```
plugins/oncology/
├── athma-plugin.json                 # Plugin manifest: nav, permissions, extension points
└── backend/
    ├── prisma/schema.prisma          # Plugin-owned schema (plugin_oncology)
    ├── generated/                    # Prisma client for plugin_oncology schema
    └── src/
        ├── oncology.module.ts        # NestJS module, registers encounter types + charting panels
        ├── oncology.controller.ts    # REST endpoints via @PluginController('oncology')
        └── oncology.service.ts       # Raw SQL via $queryRawUnsafe() (no cross-schema Prisma joins)
```

---

## Developer Notes

### Raw SQL and UUID Casting

All database queries in `oncology.service.ts` use `$queryRawUnsafe()` because the plugin schema (`plugin_oncology`) has no Prisma relations to the core clinical schema. This has a critical consequence:

**`$queryRawUnsafe` sends JavaScript string values as PostgreSQL `text` OID (25).** PostgreSQL does not have an implicit `uuid = text` operator, so every UUID parameter in every clause requires an explicit `::uuid` cast:

```sql
-- WHERE — without ::uuid cast produces ERROR 42883
WHERE tenant_id = $1::uuid AND patient_id = $2::uuid

-- INSERT VALUES — without ::uuid cast produces ERROR 42804
VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, ...)

-- Validation subqueries
WHERE id = $1::uuid AND tenant_id = $2::uuid
```

This must be applied to **all** UUID parameters — filter positions, insert positions, and update conditions. One missing cast produces a 500 error with a PostgreSQL error code (42883 or 42804) in the service logs.

**Alternative approach:** `$queryRaw` with tagged template literals sends parameters as OID 0 (unknown), which PostgreSQL coerces from column context — no explicit casts needed. However, `$queryRawUnsafe` is currently used throughout the plugin for dynamic filter construction.

### TypeScript: `exactOptionalPropertyTypes`

The clinical service `tsconfig.build.json` sets `exactOptionalPropertyTypes: true`. This means service method filter parameters typed as `{ prop?: string }` are **not** compatible with `string | undefined` returned by `@Query()`. Filter types must use explicit `| undefined`:

```typescript
// Correct — compatible with @Query() return type
filters: { patientId?: string | undefined; clinicalStatus?: string | undefined }

// Wrong — TS2379 error under exactOptionalPropertyTypes
filters: { patientId?: string; clinicalStatus?: string }
```

TypeScript errors in plugin code cause the `PluginLoaderModule`'s `require()` to throw, which is silently caught — the plugin is skipped and all plugin routes return 404. Always run `npm run type-check` before starting the service.

### Request Context

The oncology service resolves tenant and user context from `RequestContext` (imported from `@zeal/shared-utils`). This is a separate `AsyncLocalStorage` singleton from the clinical service's `RequestContextService`. Both are populated by the `RequestContextModule` middleware registered in `app.module.ts`. The `tsconfig-paths` configuration ensures the plugin resolves to the same module instance as the clinical service — do not import `RequestContext` from a different path.

---

## Phase 2 Chemo Workflow (ASCO/ONS Safety Standards)

The Phase 2 chemotherapy module implements ASCO/ONS Chemotherapy Administration Safety Standards:

| ASCO/ONS Standard | Implementation |
|---|---|
| Standardised protocol naming | `ChemoProtocol.code` unique per tenant |
| Complete regimen specification | `regimen` JSON with drug, dose, route, day, formula, infusion duration |
| Dose calculation (BSA/weight) | Auto-calculated in orders/new; stored in `dose_adjustments` |
| Organ function dose adjustment | `hepatic_adjustment_grade`, `renal_adjustment_grade`; manual adjustment rows |
| Lab prerequisites before cycle | `lab_prerequisites` on protocol; checklist review on order |
| Informed consent documented | Pre-chemo checklist checkbox + consent date in `pre_chemo_checklist` JSON |
| Allergy check | Manual review captured in `pre_chemo_checklist` |
| Pharmacist/second-physician sign-off | `approveChemoOrder` → `approved_by`, `approved_at` |
| Nurse bedside verification (dual-check) | `verifyChemoOrder` → `verified_by`, optional `second_verified_by` |
| Administration time documentation | `administration_details` JSON per drug |
| Adverse event capture (CTCAE) | `adverse_reactions` JSON with CTCAE grade 1–5 |
| Feature flag for dual-sign | `oncology.chemo.requireDualSign` in `athma-plugin.json` |

**Order status workflow:**
```
draft → pending → approved → verified → in_progress → completed
                                                   ↘ held
                                                   ↘ cancelled
```

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1 | Registry, Diagnosis, Staging, Tumor Board, Care Plan | Complete |
| Phase 2 | Chemotherapy — ChemoProtocol → consent → lab check → ChemoOrder → administration | Complete |
| Phase 3 | Radiation Therapy planning and delivery tracking | Planned |
