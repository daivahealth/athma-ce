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
  Phase 2: Chemotherapy (ChemoProtocol → TreatmentPlan schedule → ChemoOrder per treatment day)
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
| Treatment Schedules | `/oncology/treatment-plans` | Patient schedules generated from a protocol — cycles, dates, doses |
| Day-care Worklist | `/oncology/day-care`          | All patients due on a date: administration sheets + pharmacy prep |

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
| `planned_modalities` | JSONB | Array of `{ modality, sequence, status, details, startDate, endDate, plannedCycles?, cycleDurationDays?, plannedFractions?, protocolId?, protocolCode?, protocolName? }` — each modality carries its own schedule; `protocol*` fields (chemotherapy only) snapshot the chemo protocol chosen at planning time and pre-populate the protocol on new chemo orders linked to the plan. Plan-level `planned_cycles`/`cycle_duration_days` are derived from the chemotherapy modality for list views. |
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
| `phases` | JSONB | **Source of truth (schema v2).** Ordered phases `{ id, name, cycles, cycleDurationDays, drugs[] }`; each drug line `{ id, drug, dose, unit, route, days[], doseFormula, infusionDurationMin?, diluent?, maxDose?, doseLevels?[], overrides?[] }`. `[]` on rows saved before v2 — the API reads those as one `Main` phase. Shape and rules: [API — Phase-based regimen](../../api/ONCOLOGY-API-ENDPOINTS.md#phase-based-regimen-phases) |
| `regimen` | JSONB | Derived from `phases` on save (one entry per phase drug line, base dose, `phase` name) — kept for legacy readers. Array of `{ drug, dose, unit, route, day, doseFormula, infusionDurationMin, diluent, phase? }` |
| `total_cycles` | INT | Derived: sum of phase cycles |
| `cycle_duration_days` | INT | Derived: first phase's cycle length |
| `premedications` | JSONB | Antiemetics, steroids, H2 blockers |
| `hydration` | JSONB | Array of `{ fluid, ratePerHour, durationHours, timing }` |
| `lab_prerequisites` | JSONB | Array of `{ test, parameter, minValue, unit, timing }` — e.g. ANC ≥ 1500 |
| `emetogenic_risk` | VARCHAR(20)? | minimal, low, moderate, high |
| `dose_formula` | VARCHAR(10) | bsa (default), weight, fixed — protocol-level default |
| `supportiveCare` | JSONB | G-CSF, growth factors, etc. Column is camel-cased (no `@map`); the API exposes it as `supportive_care` |
| `is_active` | BOOLEAN | Soft-delete; existing orders retain reference |

#### Phase-based regimens

A protocol is an ordered list of **phases**: blocks of identical cycles, each with its own cycle
count, cycle length and drugs. Cycles are numbered continuously across phases. Examples:
AC-T = `AC` × 4 (q14d) → `Paclitaxel` × 4 (q14d); TCH = `TCH` × 6 (q21d) → `Trastuzumab
maintenance` × 11.

- **Cycle-specific changes** are sparse overrides on a drug line (dose, days, infusion time, omit, note), keyed by
  the cycle number *within the phase*, so changing an earlier phase's cycle count doesn't move them.
  Example: trastuzumab 6 mg/kg with a cycle-1 override of 8 mg/kg (loading).
- **Dose levels** (DL−1, DL−2) are stored per drug line for later use at order time.
- **Builder UI** (new/edit protocol): phase cards, a drug × cycle **matrix** (click a cell to change
  that one cycle; changed cells are highlighted) and a **day-by-day schedule preview** (treatment
  day, week, `C{n} D{d}`, optional sample start date that flags weekends). The preview is not a
  patient schedule; patient treatment plans are not built yet.
- **Orders:** the new-order form calculates doses only for the drugs of the entered cycle (with
  overrides and `maxDose` applied), and `GET /orders/:id` returns that cycle's drugs as
  `protocol_regimen`.
- **Schema change:** `phases JSONB NOT NULL DEFAULT '[]'` — apply with the plugin `prisma db push`
  (see [PLUGIN-DEVELOPMENT](../../development/PLUGIN-DEVELOPMENT.md)). Existing rows need no data
  migration; they are read as one phase and written as v2 on the next save.

### `chemo_orders`

Per-patient order instance derived from a protocol. Status workflow and the safety rules on each transition are described in [Phase 2 Chemo Workflow](#phase-2-chemo-workflow-ascoons-safety-standards).

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
| `ordering_provider` | UUID | Signed-in user who created the order (never client-supplied) |
| `approved_by` | UUID? | Pharmacist / second-physician sign-off |
| `approved_at` | TIMESTAMPTZ? | |
| `verified_by` | UUID? | First nurse verification |
| `verified_at` | TIMESTAMPTZ? | |
| `second_verified_by` | UUID? | Independent second verifier (user id); required under dual sign-off |
| `administered_by` | UUID? | Nurse who administered |
| `administered_at` | TIMESTAMPTZ? | |
| `adverse_reactions` | JSONB | Array of `{ drug, ctcaeGrade, type, onsetTime, description }` |
| `administration_details` | JSONB | Per-drug: `[{ drug, startedAt, completedAt, ratePerHour, accessSite }]` |

### Patient treatment schedule — `treatment_plans`, `treatment_cycles`, `treatment_days`

A **treatment plan** is the dated schedule for one patient, generated from a phased protocol
when treatment starts (`POST /treatment-plans`, usually from a care plan's chemotherapy
modality). The protocol is snapshotted, so later protocol edits do not change running plans.

| Table | Key columns | Notes |
|-------|-------------|-------|
| `treatment_plans` | `patient_id`, `cancer_diagnosis_id`, `oncology_care_plan_id?`, `protocol_id`, `protocol_snapshot`, `start_date`, `height_cm`, `weight_kg`, `bsa`, `creatinine_clearance`, `status` | `status`: active, on_hold, completed, cancelled |
| `treatment_cycles` | `cycle_number`, `phase_index`, `phase_name`, `phase_cycle`, `planned_start_date`, `dose_level`, `delay_days`, `delay_reason` | One row per cycle; unique `(treatment_plan_id, cycle_number)` |
| `treatment_days` | `cycle_number`, `cycle_day`, `scheduled_date`, `status`, `items`, `chemo_order_id?` | One row per day that has a drug. `status`: planned, ordered, given, held, skipped, cancelled |

**Day items** (`items` JSONB, a snapshot rebuilt only while the day is open) list everything for
that day in order: `lab` checks (first treatment day of each cycle, from `lab_prerequisites`),
`premed` and `hydration` (from the protocol), `chemo` (drug, protocol dose, dose level, calculated
patient dose, route, infusion, diluent, warnings) and `supportive` care (first day of cycle).

**Dosing:** BSA by Mosteller; `bsa` × m², `weight` × kg, `fixed` as written, `auc` by Calvert
(AUC × (CrCl + 25), CrCl capped at 125 mL/min — needs CrCl). `maxDose` caps the mg dose. A cycle
dose level (−1, −2) uses the drug line's predefined `doseLevels`. A drug with no dose levels at
all is not reduced (e.g. trastuzumab); one that defines other levels but not the requested one
keeps the full dose and the item carries a warning.

**Behaviour:**
- **Delay a cycle** moves that cycle and every later one by N days (refused once any of those days
  is ordered or given). **Dose level** changes and **updated measurements** re-dose open days only
  (`planned`, `held`).
- **Create order** on a day creates the `chemo_order` (cycle, day, date, BSA, weight, height, CrCl,
  dose-level `dose_adjustments`) and marks the day `ordered`. Completing the order marks the day
  `given`, holding it marks it `held`, cancelling it frees the day (`planned`, link removed).
- Hold / skip / restore a day directly while it has no order.
- Premedications and supportive care are still free text on the protocol, so they appear on every
  treatment day / first day of each cycle rather than against specific drugs or days.

**Screens:** `/oncology/treatment-plans` (list; `?carePlanId=` opens that care plan's current
schedule or starts one), `/oncology/treatment-plans/new` (care plan, protocol, C1D1 date, height,
weight, CrCl → preview → generate), `/oncology/treatment-plans/[id]` (cycle cards with delay and
dose level, day rows with day sheet and order actions), `/oncology/day-care` (date worklist:
per-patient administration sheets with timed sequence, and a pharmacy prep table with drug totals).

**Colour:** statuses (care plan, order, plan, day, radiation) render as tone badges from one
vocabulary in `frontend/src/plugins/oncology/lib/oncology-tone.ts`; care-plan modalities and
treatment intents each have their own tone; a protocol phase is coloured by its index (sky,
violet, emerald, orange, fuchsia — the same order as the builder's phase accents), on both the
cycle cards and the day-care worklist.

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

### Demo cohort

`seed/plugins/oncology/10-14-*.sql` hand-build five reference patients.
`seed/plugins/oncology/30-demo-cohort.sql` is an **opt-in** seed (not in
`run-seeds.sh`). It gives every other patient of the demo tenant a
deterministic cancer journey, usually the 900 `MRN-DEMO-*` patients from
`clinical/27-demo-activity.sql`. Run it after that file, on the same day.

- **Case mix**: 29 templates weighted toward the case mix of an Indian
  tertiary cancer centre, by sex and age band. Examples: oral cavity and
  laryngeal HNSCC, breast (HR+, HER2+ and triple negative), cervix,
  oesophagus, stomach, colorectal and rectum, gallbladder, liver, pancreas,
  NSCLC and SCLC, ovary, endometrium, thyroid, prostate, bladder, DLBCL,
  Hodgkin, myeloma, ALL, AML, CML, GBM and testis. Each template carries
  coded site, morphology, ICD-10, SNOMED, grade, biomarker profiles, a
  tumour marker and a stage-specific pathway (for example surgery then
  chemoradiation, neoadjuvant chemotherapy then surgery, definitive CRT,
  palliative chemotherapy, or a TKI for EGFR/ALK-positive lung).
- **Records per patient**: a diagnosis, clinical staging (plus pathological
  staging after surgery), a Wednesday tumour-board case, and a care plan with
  modalities and milestones. Systemic therapy gets a treatment plan with
  cycles and days. Doses are computed as in `treatment-schedule.ts`,
  including dose levels and delays. It also writes chemo orders,
  radiotherapy (prescription → simulation → plan → fractions → weekly reviews
  → completion summary), and timeline events. Surgery is booked in the OT
  module (request, schedule and signed report). Tumour markers are written as
  FINAL lab reports with the oncology lab catalogue's LOINC codes, so the
  registry's "Recent Oncology Labs" panel shows them, and mirrored into
  `clinical_observations`. The patient's existing encounters also get
  oncology chief complaints and ICD-10 diagnoses.
- **Stored formats** follow the app: TNM categories without the letter
  (`4a`, `2b`, `0`, because the UI adds T/N/M), and clock times in Asia/Kolkata.
  Radiotherapy and chemo schedules are only written once they would exist in
  practice: a radiotherapy prescription about 2 weeks before the first
  fraction, a schedule a few days before cycle 1. Later ones appear only as
  planned modalities in the care plan.
- **Relative to today**: patients registered in the last ~12 days are still
  in work-up (provisional diagnosis, tumour board scheduled). Today has a
  day-care list of pending, approved and verified orders, with the next few
  days partly ordered, and patients mid-radiotherapy. Older patients are in
  surveillance, remission, palliative care or progression.
- **Extra protocols**: the seed adds five protocols if they are missing:
  `CisRT-Weekly`, `CROSS`, `Metronomic-HN` (oral metronomic methotrexate +
  celecoxib), `AML-7+3` and `Stupp-TMZ`.
- **Re-running** is safe. Ids derive from `onco-demo:<key>`, and a re-run
  first deletes the earlier run's rows and rows of patients that no longer
  exist. Patients with a hand-built diagnosis are not touched.

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
    ├── protocol-builder/             # Phase builder, regimen matrix, schedule preview
    ├── treatment-schedule/DaySheet.tsx # Timed day sheet (checks, sequence, supportive care)
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
│   ├── new/page.tsx                  # Phase-based regimen builder, hydration, lab prerequisites
│   └── [id]/edit/page.tsx            # Same builder (plugins/oncology/components/protocol-builder/)
├── orders/                           # Phase 2 — Chemo Orders
│   ├── page.tsx                      # Order list with status filter
│   ├── new/page.tsx                  # BSA calculator, dose calculator, pre-chemo checklist
│   └── [id]/page.tsx                 # Order detail + approval/verify/administer workflow
├── treatment-plans/                  # Patient treatment schedules
│   ├── page.tsx                      # Schedule list (?carePlanId= redirects)
│   ├── new/page.tsx                  # Start schedule from a care plan
│   └── [id]/page.tsx                 # Cycle/day schedule, delay, dose level, day sheet, orders
└── day-care/page.tsx                 # Date worklist: administration + pharmacy prep
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
        ├── oncology.service.ts       # Raw SQL via $queryRawUnsafe() (no cross-schema Prisma joins)
        ├── protocol-phases.ts        # Phase regimen parse/derive/resolve
        ├── treatment-schedule.ts     # Pure schedule generation + dosing (BSA, weight, AUC)
        ├── treatment-schedule.service.ts    # Treatment plans, cycles, days, worklist
        └── treatment-schedule.controller.ts # /treatment-plans, /treatment-days
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
| Complete regimen specification | `phases` JSON: per-phase cycles and drugs (dose, route, days, formula, infusion), cycle-specific overrides, dose levels |
| Dose calculation (BSA/weight) | Auto-calculated in orders/new; stored in `dose_adjustments` |
| Organ function dose adjustment | `hepatic_adjustment_grade`, `renal_adjustment_grade`; manual adjustment rows |
| Lab prerequisites before cycle | `lab_prerequisites` on protocol; checklist review on order |
| Informed consent documented | Pre-chemo checklist checkbox + consent date in `pre_chemo_checklist` JSON; **required before approval** |
| Allergy check | Manual review captured in `pre_chemo_checklist`; **required before approval** (not yet linked to the patient allergy list) |
| Pharmacist/second-physician sign-off | `approveChemoOrder` → `approved_by`, `approved_at`; approver must differ from the ordering provider |
| Nurse bedside verification (dual-check) | `verifyChemoOrder` → `verified_by` (must differ from approver), `second_verified_by` (independent user; required under dual sign-off) |
| Administration time documentation | `administration_details` JSON per drug |
| Adverse event capture (CTCAE) | `adverse_reactions` JSON with CTCAE grade 1–5 |
| Dual sign-off switch | `oncology.chemo.require_dual_sign` config key (declared in `athma-plugin.json`, default `true`) |

**Order status workflow:**
```
draft → pending → approved → verified → in_progress → completed
pending | approved | verified | in_progress → held → (resume) pending
draft | pending | approved | verified | held → cancelled
```

**Server-side enforcement.** The rules live in `backend/src/chemo-order-rules.ts` (pure functions, unit-tested
with `npm test` in `plugins/oncology`) and are applied by `OncologyService` before every write. Each
`UPDATE` also re-checks the expected status in its `WHERE` clause so concurrent transitions cannot both win.

- New orders can only be created as `pending` (default) or `draft`; `ordering_provider` is always the
  signed-in user. The protocol must be active.
- Approval requires a different user from the ordering provider and a complete pre-chemo checklist:
  `consentDocumented`, `allergiesReviewed`, `labsReviewed`, `labsWithinRange`, `bsaVerified`, `doseVerified`
  (`premedicationsOrdered` is optional). Orders created from a treatment day start with an empty
  checklist, which is completed on the order screen before approval.
- Verification cannot be done by the approver. `second_verified_by` must be a user id different from the
  verifier; under dual sign-off it is required and must also differ from the approver and orderer.
- With dual sign-off on, administration starts only from `verified` with a second verifier recorded; with
  it off, `approved` orders may also start.
- `held` orders are resumed to `pending` with all sign-offs cleared, so they are approved and verified again.
- Completed and cancelled orders cannot be held or cancelled; an `in_progress` order must be held before
  it can be cancelled.

**Dual sign-off resolution.** `OncologySettingsService` reads `oncology.chemo.require_dual_sign` from
foundation's public `GET /api/v1/configs/resolve` (tenant-level, cached 60 s per tenant) using `fetch`,
because the plugin cannot resolve `@zeal/config-client` at runtime. Any failure, missing key or
non-`false` value means dual sign-off is required (fail closed).

Care plan approval (`approved_by`) and radiation prescription approval (`approved_by` / `approved_at`,
leaving `prescribed_by` intact) are likewise attributed to the signed-in user only.

**Schema impact.** `radiation_prescriptions` gained nullable `approved_by` and `approved_at` columns.
Existing databases need a schema push (additive, no data loss; the push is scoped to the
`plugin_oncology` schema) before approving radiation prescriptions. `db:push` needs
`CLINICAL_DATABASE_URL`, which is not set in the plugin directory; locally, take it from the clinical
service's env file:

```bash
cd plugins/oncology
CLINICAL_DATABASE_URL="$(grep -E '^CLINICAL_DATABASE_URL=' ../../backend/services/clinical/.env.local | cut -d= -f2-)" npm run db:push
```

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1 | Registry, Diagnosis, Staging, Tumor Board, Care Plan | Complete |
| Phase 2 | Chemotherapy — ChemoProtocol → consent → lab check → ChemoOrder → administration | Complete |
| Phase 3 | Radiation Therapy — prescription, simulation, planning, fractions, on-treatment review, completion | Implemented (see [API](../../api/ONCOLOGY-API-ENDPOINTS.md); endpoint reference for radiation still to be written) |
