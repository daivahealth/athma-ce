# EMR/Clinical Data Capture & Flow Design

## Overview

This document outlines the **Electronic Medical Records (EMR)** and **Clinical Data Capture** architecture for the athma-ce Platform. It covers the complete clinical workflow from patient registration through encounter documentation, orders, results, and clinical decision support.

---

## Table of Contents

1. [Clinical Workflow Overview](#clinical-workflow-overview)
2. [Patient Registration & Demographics](#patient-registration--demographics)
3. [Encounter Management](#encounter-management)
4. [Clinical Documentation](#clinical-documentation)
5. [Order Management](#order-management)
6. [Results Management](#results-management)
7. [Clinical Decision Support](#clinical-decision-support)
8. [Care Coordination](#care-coordination)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Integration Points](#integration-points)
11. [Compliance & Security](#compliance--security)

---

## Clinical Workflow Overview

### High-Level Flow

```
Patient Registration
    ↓
Appointment Scheduling
    ↓
Patient Check-In
    ↓
Vital Signs Capture
    ↓
Encounter Start
    ↓
Clinical Documentation (SOAP)
    ├── Subjective (Chief Complaint, HPI)
    ├── Objective (Physical Exam, Vitals)
    ├── Assessment (Diagnosis, Problem List)
    └── Plan (Orders, Prescriptions, Follow-up)
    ↓
Order Entry & Execution
    ├── Lab Orders → Lab Results
    ├── Imaging Orders → Imaging Results
    ├── Medication Orders → Prescriptions
    ├── Procedure Orders → Procedure Results
    └── Referral Orders
    ↓
Encounter Sign-Off
    ↓
Charge Capture (Superbill)
    ↓
Billing & Claims
```

---

## Patient Registration & Demographics

### Core Patient Data

**Table: `patients`**

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    mrn VARCHAR(50) UNIQUE NOT NULL,      -- Medical Record Number
    emirates_id VARCHAR(50) UNIQUE,       -- UAE Emirates ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    sex VARCHAR(20),
    nationality VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    contact_info JSONB DEFAULT '{}',
    demographics JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);
```

### Extended Patient Information

#### Allergies
```sql
CREATE TABLE patient_allergies_enhanced (
    patient_id UUID,
    allergen_type VARCHAR(50),    -- medication, food, environmental
    allergen_name VARCHAR(255),
    severity VARCHAR(20),          -- mild, moderate, severe, life_threatening
    reaction_type VARCHAR(100),    -- rash, anaphylaxis, respiratory
    verified_by UUID,
    verified_at TIMESTAMPTZ
);
```

#### Problem List
```sql
CREATE TABLE patient_problems (
    patient_id UUID,
    icd10_code VARCHAR(20),
    problem_description TEXT,
    status VARCHAR(30),            -- active, resolved, chronic
    severity VARCHAR(20),
    onset_date DATE,
    is_primary_diagnosis BOOLEAN,
    is_chronic_condition BOOLEAN
);
```

#### Family History
```sql
CREATE TABLE family_history (
    patient_id UUID,
    family_member_relationship VARCHAR(50),
    condition_name VARCHAR(255),
    icd10_code VARCHAR(20),
    condition_type VARCHAR(100),
    is_genetic BOOLEAN,
    genetic_inheritance VARCHAR(50)
);
```

#### Immunizations
```sql
CREATE TABLE immunizations (
    patient_id UUID,
    vaccine_code VARCHAR(50),      -- CVX code
    vaccine_name VARCHAR(255),
    lot_number VARCHAR(100),
    administered_at TIMESTAMPTZ,
    dose_number INTEGER,
    total_series INTEGER,
    next_due_at DATE
);
```

### Shared Patient Display DTO

Clinical patient-facing worklists should prefer the shared `patientDisplay` summary DTO over rendering raw patient UUID references or reconstructing identity ad hoc in the UI.

Key fields commonly rendered in operational and charting workflows:

- `displayName`
- `mrn`
- `age`
- `gender`

This same patient summary shape is used by encounter/charting views and by the Lab Operations collection worklist so specimen collection staff can verify patient identity directly from the queue.

---

## Encounter Management

### Encounter Types & Sources

**Table: `encounters`**

```sql
CREATE TABLE encounters (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    encounter_date TIMESTAMPTZ DEFAULT NOW(),
    encounter_source VARCHAR(20),   -- appointment, walk_in, emergency, telemedicine
    encounter_type VARCHAR(50),     -- outpatient, inpatient, emergency, telemedicine
    primary_staff_id UUID,
    facility_id UUID,
    episode_id UUID,               -- link to episode of care
    visit_category_concept_id UUID, -- NEW, REVISIT, FOLLOW_UP
    status VARCHAR(30),            -- scheduled, in_progress, completed, cancelled
    walk_in_details JSONB DEFAULT '{}'
);
```

### Encounter Sources

| Source | Description | Workflow |
|--------|-------------|----------|
| **appointment** | Pre-scheduled visit | Standard workflow with appointment link |
| **walk_in** | Unscheduled visit | Immediate registration, triage, encounter creation |
| **emergency** | Emergency department | Priority triage, immediate attention |
| **telemedicine** | Virtual visit | Video/phone consultation, digital documentation |

### Episode of Care

**Table: `episodes`**

```sql
CREATE TABLE episodes (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    primary_staff_id UUID,
    specialty VARCHAR(100),
    diagnosis_snapshot JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    status VARCHAR(30)             -- active, closed, transferred
);
```

**Purpose**: Groups related encounters for chronic disease management, surgical episodes, pregnancy care, etc.

### Encounter Links

**Table: `encounter_links`**

```sql
CREATE TABLE encounter_links (
    from_encounter_id UUID,
    to_encounter_id UUID,
    relationship_type VARCHAR(40), -- follow_up_of, referred_from, related_to
    notes TEXT
);
```

**Use Cases**:
- Link follow-up visits to original encounter
- Track referrals between specialists
- Group related encounters (e.g., pre-op → surgery → post-op)

---

## Clinical Documentation

### SOAP Notes

**Table: `clinical_notes`**

```sql
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY,
    encounter_id UUID NOT NULL,
    note_type VARCHAR(50),         -- soap, progress, discharge, consult
    section VARCHAR(50),           -- subjective, objective, assessment, plan
    content TEXT NOT NULL,
    is_signed BOOLEAN DEFAULT FALSE,
    signed_by UUID,
    signed_at TIMESTAMPTZ
);
```

### SOAP Structure

#### S - Subjective
- **Chief Complaint**: Primary reason for visit
- **History of Present Illness (HPI)**: Detailed symptom history
- **Review of Systems (ROS)**: Systematic review by body system
- **Past Medical History**: Previous conditions, surgeries
- **Medications**: Current medications
- **Allergies**: Known allergies
- **Social History**: Smoking, alcohol, occupation
- **Family History**: Genetic conditions

#### O - Objective
- **Vital Signs**: BP, HR, RR, Temp, O2 sat, height, weight, BMI
- **Physical Examination**: By body system
- **Lab Results**: Recent laboratory findings
- **Imaging Results**: Radiological findings

#### A - Assessment
- **Differential Diagnosis**: Possible diagnoses
- **Primary Diagnosis**: ICD-10 code
- **Secondary Diagnoses**: Additional conditions
- **Problem List**: Active, chronic, resolved problems

#### P - Plan
- **Orders**: Labs, imaging, procedures
- **Prescriptions**: Medications
- **Referrals**: Specialist consultations
- **Follow-up**: Return visit instructions
- **Patient Education**: Instructions, handouts

### Vitals Capture

**Table: `vitals`**

```sql
CREATE TABLE vitals (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    encounter_id UUID,
    recorded_at TIMESTAMPTZ,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    temperature_c NUMERIC(4,1),
    systolic_bp INT,
    diastolic_bp INT,
    heart_rate INT,
    respiratory_rate INT,
    oxygen_saturation NUMERIC(4,1),
    bmi NUMERIC(4,1)
);
```

**Workflow**:
1. Medical assistant measures vitals at check-in
2. Vitals auto-populate in encounter
3. Abnormal values trigger alerts (e.g., BP > 140/90)
4. Historical trends available to physician

### Screening Tools

**Table: `screenings`**

```sql
CREATE TABLE screenings (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    encounter_id UUID,
    tool_code VARCHAR(50),         -- PHQ9, GAD7, PAIN, FALL
    tool_name VARCHAR(255),
    score NUMERIC(5,2),
    interpretation VARCHAR(100),   -- normal, mild, moderate, severe
    responses JSONB                -- raw questionnaire answers
);
```

**Common Screening Tools**:
- **PHQ-9**: Depression screening (0-27 score)
- **GAD-7**: Anxiety screening (0-21 score)
- **AUDIT**: Alcohol use disorder (0-40 score)
- **Pain Scale**: 0-10 numeric rating
- **Fall Risk**: Morse Fall Scale
- **MMSE**: Cognitive screening (0-30 score)

---

## Order Management

athma-ce uses a **shared order header plus specialty execution detail** model.

### Shared Runtime Order Header

**Table: `clinical_orders`**

`clinical_orders` is the shared EMR runtime record for executable lab, imaging, and procedure orders.

Representative fields:

- `tenant_id`
- `encounter_id`
- `patient_id`
- `order_type`
- `order_code`
- `code_system`
- `order_name`
- `priority`
- `status`
- `clinical_indication`
- `special_instructions`
- `ordered_by`
- `ordered_at`
- coarse result fields such as `result_status` and `resulted_at`

### Medication Orders

Medication ordering is modeled separately through `prescription_orders`, not through `clinical_orders`.

**Workflow**:
1. Physician searches medication master catalog
2. Auto-populate dosage, route, frequency from master
3. Allergy check against patient allergies
4. Drug-drug interaction check
5. Formulary check where applicable
6. eRx or dispense workflow continues through medication-specific modules

### Direct Diagnostic Orders

For direct clinician ordering:

- CBC
- Lipid Panel
- Serum Creatinine

the recommended runtime model is:

- three rows in `clinical_orders`
- each row has `order_type = 'lab'`
- each row expands into `lab_order_tests` execution-detail rows

### Package-Driven Orders

Packages are catalog definitions, not runtime patient orders.

Current catalog tables:

- `packages`
- `package_items`

Recommended runtime expansion:

1. create one `package_orders` row
2. read `package_items`
3. expand package items into executable `clinical_orders`
4. create specialty detail rows such as `lab_order_tests`

Recommended patient-chart presentation:

- show the `package_orders` row as the top-level chart item
- show expanded child `clinical_orders` only inside the package row on expand or drilldown
- do not duplicate package-generated child orders as separate top-level chart rows

### Lab Execution Details

Recommended execution-detail table:

- `lab_order_tests`

Recommended purpose:

- one row per ordered test or panel member
- linked to `clinical_orders`
- stores test code, specimen type, collection method, fasting requirements, and execution status

### Post-Order Lab Operations

Post-order operational workflow begins after ordering and lives outside `clinical_orders`.

Current operational tables:

- `lab_specimens`
- `lab_specimen_tests`
- `lab_accessions`
- `lab_specimen_events`
- `lab_processing_runs`

These tables support:

- sample collection
- one specimen satisfying one or more ordered tests
- one collected specimen spanning multiple compatible lab orders within the same patient encounter
- sample barcode and accession
- transport and receiving
- accession registration and acceptance
- analyzer/manual processing context
- rejection and operational audit

### Imaging and Procedure Execution

Imaging and procedure workflows use the same pattern:

- `clinical_orders` as the shared runtime header
- specialty-specific detail tables for execution
- report tables as the final clinical output layer

Recommended future detail tables:

- `imaging_order_details` or `imaging_order_studies`
- `procedure_order_details`

---

## Results Management

athma-ce uses report-oriented result tables linked back to `clinical_orders`.

Current result/report tables:

- `lab_reports`
- `lab_result_items`
- `pathology_reports`
- `imaging_reports`
- `procedure_reports`

### Lab Results

Recommended workflow:
1. Lab order exists in `clinical_orders`
2. Ordered tests are represented in `lab_order_tests`
3. Collection, receiving, accessioning, and processing progress through specimen tables
4. Final report is created in `lab_reports`
5. Individual analytes are written to `lab_result_items`
6. Report state transitions are tracked in `report_status_history`

Reference:

- for a current-state summary of available lab functionality and pending lab work, see [22-Lab-Module-Functionality-and-Roadmap.md](./22-Lab-Module-Functionality-and-Roadmap.md)

Narrative pathology behavior:

- the same lab order/specimen/accession/processing workflow is reused for histopathology and similar lab disciplines
- the reporting structure depends on `lab_test_master.report_style`
- `structured` lab tests continue to use `lab_reports` + `lab_result_items`
- `narrative` lab tests use `pathology_reports` with sectioned fields such as clinical history, specimen received, gross description, microscopic description, diagnosis, and comment
- `/results/lab/:orderId` resolves the appropriate editor/viewer automatically from the configured lab test style
- `/results/lab` still lists both styles together because pathology remains part of the same lab module

Current operational UI:

- `/results/lab/collection`
  - Collection
- `/results/lab/operations`
  - Receiving
  - Accessioning
  - Processing
  - Result Entry
- `/results/lab/:orderId`
  - Read-only or editable lab report page for a specific order
  - Shows an `Order & Specimen Summary` panel with ordered test context, specimen barcode/ID, accession number, and workflow timestamps
  - Groups ordered, collected, received, processing, and reported date/time values together so lab users can compare the operational timeline at a glance
  - Computes TAT status from the linked `lab_test_master.turnaround_time_hours` when configured, marking the order as within TAT, approaching TAT, met, or breached
  - Distinguishes order scope from encounter scope: the page shows how many tests belong to the current lab order, and separately how many lab orders exist across the encounter
  - For multi-test orders, lists each ordered test separately with its own specimen/accession context instead of collapsing to the first test only
  - Supports browser printing for finalized/amended reports without mutating lab workflow state

Lab results listing behavior:

- `/results/lab` is fed from aggregated `patient-results` summaries
- a lab order now becomes visible there as soon as `Start Processing` creates or reuses the active draft report
- the list also shows the linked specimen type and specimen number so staff can identify the processed tube directly from the reporting queue

Result-entry open behavior:

- opening `/results/lab/operations/result-entry/:labOrderTestId` is safe to repeat
- if the UI issues overlapping open requests for the same ordered test while the draft report is being created, the backend reuses the active draft instead of failing on the second request
- when users submit manual lab results as preliminary or final, the workflow also completes lab result entry and backfills a manual processing run if none exists yet, so reporting cannot appear ahead of processing in the operational timeline

Lab results listing behavior:

- `/results/lab` is order-oriented for laboratory reports
- if multiple draft rows exist for the same lab order because of an older concurrent-create race, the patient-results aggregation now collapses them to one visible result row per order and prefers the latest logical report

Collection queue behavior:

- collection groups are specimen-first
- grouping is normalized through `lab_test_master` collection metadata
- fasting is shown as an instruction badge rather than creating a separate collection bucket by default
- collection is exposed as a separate pre-lab workspace for nurses/phlebotomists rather than being grouped into the lab-internal operations screen
- the collection screen supports patient search/filter, narrowing the queue through the existing `patientId` worklist filter
- collection is a two-step action:
  1. prepare/print the specimen label and affix it to the vacutainer
  2. mark the prepared specimen as collected after the blood draw
- the collection screen can reprint a prepared label without creating a second specimen
- v1 printing is workstation/app-bridge driven: the backend returns `.prn` label payloads and the frontend sends them to a local printer bridge when available, falling back to downloading the label file

### Imaging Results

Recommended workflow:
1. Imaging order exists in `clinical_orders`
2. Imaging execution detail is tracked in imaging-specific detail tables
3. Final narrative output is stored in `imaging_reports`
4. Status transitions sync summary result state back to `clinical_orders`

### Procedure Results

Recommended workflow:
1. Procedure order exists in `clinical_orders`
2. Procedure execution detail is tracked in procedure-specific detail tables
3. Final structured note is stored in `procedure_reports`
4. Status transitions sync summary result state back to `clinical_orders`

---

## Clinical Documentation

### Problem List Management

**Table: `patient_problems`**

```sql
CREATE TABLE patient_problems (
    id UUID PRIMARY KEY,
    patient_id UUID,
    icd10_code VARCHAR(20),
    problem_description TEXT,
    status VARCHAR(30),            -- active, resolved, chronic
    severity VARCHAR(20),
    onset_date DATE,
    is_primary_diagnosis BOOLEAN
);
```

**Workflow**:
1. Problems added during encounter
2. Problems persist across encounters
3. Status updated (active → resolved)
4. Used for disease management, quality reporting

### Care Plans

**Table: `care_plans`**

```sql
CREATE TABLE care_plans (
    id UUID PRIMARY KEY,
    patient_id UUID,
    care_plan_type VARCHAR(100),   -- chronic_disease, post_surgical, preventive
    start_date DATE,
    end_date DATE,
    status VARCHAR(30),            -- active, completed, discontinued
    primary_goal TEXT,
    secondary_goals TEXT[]
);
```

**Table: `care_plan_interventions`**

```sql
CREATE TABLE care_plan_interventions (
    care_plan_id UUID,
    intervention_type VARCHAR(100), -- medication, therapy, education
    intervention_description TEXT,
    frequency VARCHAR(100),
    target_date DATE,
    completion_status VARCHAR(30)
);
```

**Workflow**:
1. Care plan created for chronic conditions (diabetes, hypertension)
2. Goals and interventions defined
3. Interventions tracked over time
4. Care plan reviewed at each encounter
5. Outcomes measured against goals

---

## Order Management

### Unified Order Entry

**Design Principle**: Diagnostic orders use a unified `clinical_orders` header with specialty execution-detail and reporting tables.

```
package_orders (planned runtime package assignment)
    └── clinical_orders (expanded executable orders)

clinical_orders (shared runtime header)
    ├── lab_order_tests (planned)
    ├── imaging_order_details / imaging_order_studies (planned)
    ├── procedure_order_details (planned)
    ├── lab_reports
    ├── imaging_reports
    └── procedure_reports
```

For charting reads, prefer a grouped encounter-orders projection instead of a flat executable-order list so package orders remain concise in the doctor-facing UI.

### Order Lifecycle

```
Ordered → In Progress → Completed
    ↓
Cancelled
```

### Order Approval Workflow

Approval or sign-off rules are specialty-specific:

- diagnostic orders use `clinical_orders` for shared ordered/cancelled/in-progress state
- report authorization is tracked on report tables such as `lab_reports` and `imaging_reports`
- medication approval remains medication-specific and should not be modeled through `clinical_orders`

```sql
-- Shared clinical orders awaiting operational work
SELECT 
    co.id,
    co.order_type,
    co.status,
    co.ordered_by,
    co.ordered_at
FROM clinical_orders co
WHERE co.status IN ('ordered', 'in_progress');
```

### Order Signing & Attestation

**Electronic Signature:**
```sql
-- Clinical notes signing
UPDATE clinical_notes
SET is_signed = true,
    signed_by = 'physician-uuid',
    signed_at = NOW()
WHERE encounter_id = 'encounter-uuid';

-- Order signing
UPDATE clinical_orders
SET status = 'ordered',
    ordered_by = 'physician-uuid',
    ordered_at = NOW()
WHERE id = 'order-uuid';
```

---

## Results Management

### Result Ingestion

**HL7 Integration:**

```typescript
// HL7 ORU (Lab Results) message handling
async function processHL7LabResult(hl7Message: string): Promise<void> {
  const parsed = parseHL7(hl7Message);
  
  // Extract key segments
  const patient = parsed.PID;  // Patient Identification
  const order = parsed.OBR;    // Order
  const results = parsed.OBX;  // Observations (results)
  
  // Find matching clinical order and active lab report workflow
  const clinicalOrder = await findClinicalOrder(order.placerOrderNumber);

  // Create or update lab report and result items
  for (const obx of results) {
    await db.query(`
      INSERT INTO lab_result_items (
        lab_report_id,
        test_name,
        test_code,
        code_system,
        value_string,
        unit,
        ref_range_text,
        interpretation,
        abnormal_flag
      ) VALUES ($1, $2, $3, 'LOINC', $4, $5, $6, $7, $8)
    `, [
      clinicalOrder.activeLabReportId,
      obx.observationIdentifier,
      obx.loincCode,
      obx.observationValue,
      obx.units,
      obx.referenceRangeText,
      obx.interpretation,
      obx.abnormalFlag === 'N' ? false : true
    ]);
  }
  
  // Update shared order summary status
  await db.query(`
    UPDATE clinical_orders
    SET status = 'completed', result_status = 'final', resulted_at = NOW()
    WHERE id = $1
  `, [clinicalOrder.id]);
  
  // Notify physician if abnormal
  if (hasAbnormalResults(results)) {
    await notifyPhysician(clinicalOrder.orderedBy, clinicalOrder.id);
  }
}
```

### Critical Result Alerting

```sql
-- Critical lab results requiring immediate notification
SELECT 
    lri.id,
    lri.test_name,
    COALESCE(lri.value_string, lri.value_numeric::text) as result_value,
    lri.interpretation,
    p.first_name || ' ' || p.last_name as patient_name,
    s.first_name || ' ' || s.last_name as ordering_physician
FROM lab_result_items lri
JOIN lab_reports lr ON lr.id = lri.lab_report_id
JOIN clinical_orders co ON co.id = lr.order_id
JOIN encounters e ON e.id = co.encounter_id
JOIN patients p ON p.id = e.patient_id
JOIN staff s ON s.id = co.ordered_by
WHERE lri.critical_flag = true
  AND lr.verified_by IS NULL
ORDER BY lr.reported_at DESC;
```

---

## Clinical Decision Support

### Drug-Drug Interaction Checking

```typescript
async function checkDrugInteractions(
  patientId: string,
  newMedicationCode: string
): Promise<{
  hasInteractions: boolean;
  interactions: Interaction[];
}> {
  // Get patient's current medications
  const currentMeds = await db.query(`
    SELECT DISTINCT m.ndc_code, m.medication_name
    FROM prescription_orders po
    JOIN medication_master m ON m.local_code = po.drug_code
    JOIN encounters e ON e.id = po.encounter_id
    WHERE e.patient_id = $1
      AND po.status IN ('active', 'completed')
  `, [patientId]);
  
  // Check interactions using drug interaction database
  const interactions = await checkInteractionDatabase(
    currentMeds.rows.map(m => m.ndc_code),
    newMedicationCode
  );
  
  return {
    hasInteractions: interactions.length > 0,
    interactions
  };
}
```

### Allergy Checking

```typescript
async function checkAllergies(
  patientId: string,
  medicationName: string
): Promise<{
  hasAllergy: boolean;
  allergies: Allergy[];
}> {
  const result = await db.query(`
    SELECT 
      allergen_name,
      severity,
      reaction_type
    FROM patient_allergies_enhanced
    WHERE patient_id = $1
      AND is_active = true
      AND (
        allergen_name ILIKE $2
        OR allergen_code IN (
          SELECT atc_code FROM medication_master WHERE medication_name = $2
        )
      )
  `, [patientId, medicationName]);
  
  return {
    hasAllergy: result.rows.length > 0,
    allergies: result.rows
  };
}
```

### Duplicate Order Detection

```typescript
async function checkDuplicateOrder(
  patientId: string,
  orderType: string,
  code: string,
  withinDays: number = 7
): Promise<boolean> {
  const result = await db.query(`
    SELECT COUNT(*) as count
    FROM clinical_orders co
    JOIN encounters e ON e.id = co.encounter_id
    WHERE e.patient_id = $1
      AND co.order_type = $2
      AND co.ordered_at > NOW() - INTERVAL '$3 days'
      AND co.order_code = $4
  `, [patientId, orderType, withinDays, code]);
  
  return parseInt(result.rows[0].count) > 0;
}
```

---

## Care Coordination

### Referral Management

Referral management remains a separate workflow from the shared diagnostic order design and should not be inferred from `clinical_orders` unless a dedicated referral model is introduced.

**Workflow**:
1. Primary care physician creates referral
2. Select specialist/facility
3. Attach clinical summary and relevant records
4. Send notification to specialist
5. Track referral status (sent → scheduled → completed)
6. Receive consult note back from specialist

### Transfer of Care

```sql
-- Transfer patient to another provider
INSERT INTO encounter_links (
    from_encounter_id,
    to_encounter_id,
    relationship_type,
    notes
) VALUES (
    'original-encounter-uuid',
    'new-encounter-uuid',
    'transferred_from',
    'Transfer of care from Dr. Ahmed to Dr. Sara for specialty consultation'
);

-- Update episode primary staff
UPDATE episodes
SET primary_staff_id = 'new-staff-uuid'
WHERE id = 'episode-uuid';
```

---

## Data Flow Diagrams

### Complete Clinical Encounter Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant FD as Front Desk
    participant MA as Medical Assistant
    participant PHY as Physician
    participant LAB as Lab System
    participant PACS as PACS/RIS
    participant PHARM as Pharmacy
    participant BILL as Billing
    
    P->>FD: Arrive for appointment
    FD->>FD: Check-in patient
    FD->>FD: Verify insurance eligibility
    
    MA->>MA: Take patient to exam room
    MA->>MA: Capture vitals
    MA->>MA: Update encounter (vitals)
    MA->>MA: Administer screening tools
    
    PHY->>PHY: Start encounter documentation
    PHY->>PHY: Review vitals, screening, history
    PHY->>PHY: Document SOAP note
    PHY->>PHY: Enter assessment (diagnoses)
    
    alt Lab Orders
        PHY->>LAB: Submit lab order (HL7 ORM)
        LAB->>LAB: Collect specimen
        LAB->>LAB: Process test
        LAB->>PHY: Send result (HL7 ORU)
        PHY->>PHY: Review result
    end
    
    alt Imaging Orders
        PHY->>PACS: Submit imaging order (HL7 ORM)
        PACS->>PACS: Perform study
        PACS->>PACS: Radiologist reads
        PACS->>PHY: Send report (HL7 ORU)
        PHY->>PHY: Review report
    end
    
    alt Medications
        PHY->>PHY: Check allergies
        PHY->>PHY: Check drug interactions
        PHY->>PHARM: Send eRx (NCPDP SCRIPT)
        PHARM->>PHARM: Dispense medication
        PHARM->>PHY: Confirm dispensed
    end
    
    PHY->>PHY: Document plan
    PHY->>PHY: Sign encounter
    
    PHY->>BILL: Generate superbill
    BILL->>BILL: Code encounter
    BILL->>BILL: Submit claim
    
    PHY->>P: Provide discharge instructions
    PHY->>P: Schedule follow-up if needed
```

### Order Processing Flow

```mermaid
sequenceDiagram
    participant PHY as Physician
    participant EMR as EMR System
    participant CDS as Clinical Decision Support
    participant EXT as External System
    
    PHY->>EMR: Select order from master catalog
    EMR->>EMR: Auto-populate order details
    
    EMR->>CDS: Check allergies
    CDS->>EMR: Return allergy alerts
    
    alt Medication Order
        EMR->>CDS: Check drug interactions
        CDS->>EMR: Return interaction alerts
        EMR->>CDS: Check formulary
        CDS->>EMR: Return coverage info
    end
    
    alt Lab/Imaging Order
        EMR->>CDS: Check duplicate orders
        CDS->>EMR: Return duplicate alerts
        EMR->>CDS: Check prior auth requirements
        CDS->>EMR: Return PA requirements
    end
    
    PHY->>EMR: Confirm order
    
    alt Order requires approval
        EMR->>EMR: Route to approver
        EMR->>PHY: Approval obtained
    end
    
    EMR->>EMR: Sign order
    EMR->>EXT: Transmit order (HL7/FHIR)
    EXT->>EXT: Process order
    EXT->>EMR: Send acknowledgment
    EXT->>EMR: Send results when ready
    
    EMR->>PHY: Notify result available
    PHY->>EMR: Review and acknowledge
```

### Result Review & Acknowledgment Flow

```mermaid
flowchart TD
    A[Result Received] --> B{Abnormal Flag?}
    B -->|Normal| C[Add to chart]
    B -->|Abnormal| D{Critical?}
    
    D -->|No| E[Notify physician via inbox]
    D -->|Yes| F[Page physician immediately]
    
    E --> G[Physician reviews]
    F --> H[Physician calls patient]
    
    G --> I{Action required?}
    I -->|Yes| J[Create follow-up order]
    I -->|No| K[Document review]
    
    H --> L[Document phone call]
    L --> K
    J --> K
    
    K --> M[Mark result as reviewed]
    M --> N[Close notification]
```

---

## Clinical Decision Support

### Clinical Alerts & Reminders

**Preventive Care Reminders:**
```sql
-- Patients due for annual checkup
SELECT 
    p.id,
    p.mrn,
    p.first_name || ' ' || p.last_name as patient_name,
    MAX(e.encounter_date) as last_visit,
    NOW() - MAX(e.encounter_date) as days_since_visit
FROM patients p
JOIN encounters e ON e.patient_id = p.id
WHERE e.status = 'completed'
GROUP BY p.id, p.mrn, p.first_name, p.last_name
HAVING NOW() - MAX(e.encounter_date) > INTERVAL '365 days'
ORDER BY days_since_visit DESC;

-- Patients due for screening (e.g., mammography)
SELECT 
    p.id,
    p.mrn,
    p.first_name || ' ' || p.last_name as patient_name,
    EXTRACT(YEAR FROM AGE(p.date_of_birth)) as age,
    MAX(co.ordered_at) as last_mammogram
FROM patients p
LEFT JOIN encounters e ON e.patient_id = p.id
LEFT JOIN clinical_orders co
  ON co.encounter_id = e.id
 AND co.order_type = 'imaging'
 AND co.order_code = '77067'
WHERE p.sex = 'female'
  AND EXTRACT(YEAR FROM AGE(p.date_of_birth)) >= 40
GROUP BY p.id, p.mrn, p.first_name, p.last_name, p.date_of_birth
HAVING MAX(co.ordered_at) IS NULL
    OR NOW() - MAX(co.ordered_at) > INTERVAL '2 years';
```

### Medication Adherence Tracking

```sql
-- Patients with overdue prescription refills
SELECT 
    p.id,
    p.mrn,
    p.first_name || ' ' || p.last_name as patient_name,
    po.drug_name as medication_name,
    po.prescribed_at::DATE as last_prescribed_date,
    NOW()::DATE - po.prescribed_at::DATE as days_since_prescribed
FROM patients p
JOIN encounters e ON e.patient_id = p.id
JOIN prescription_orders po ON po.encounter_id = e.id
WHERE po.refills > 0
  AND po.status = 'completed'
  AND NOT EXISTS (
    SELECT 1 FROM prescription_orders po2
    JOIN encounters e2 ON e2.id = po2.encounter_id
    WHERE e2.patient_id = p.id
      AND po2.drug_code = po.drug_code
      AND po2.prescribed_at > po.prescribed_at
  )
ORDER BY days_since_prescribed DESC;
```

---

## Integration Points

### External System Integrations

| System | Protocol | Purpose | Data Flow |
|--------|----------|---------|-----------|
| **Lab (LIS)** | HL7 v2.x | Lab orders & results | ORM (orders) → ORU (results) |
| **Imaging (PACS/RIS)** | HL7/DICOM | Imaging orders & reports | ORM (orders) → ORU (reports) |
| **Pharmacy** | NCPDP SCRIPT | ePrescribing | NewRx, RefillRequest, RxFill |
| **Health Information Exchange (HIE)** | FHIR R4 | Care coordination | Patient, Encounter, Observation |
| **DHA eClaimLink** | XML | Claims submission | Claim → Remittance |
| **DOH Shafafiya** | XML | Claims submission | Claim → Remittance |

### HL7 Message Types

| Message | Type | Purpose | Direction |
|---------|------|---------|-----------|
| **ADT^A01** | Admit | Patient registration | EMR → HIE |
| **ADT^A08** | Update | Demographics update | EMR → HIE |
| **ORM^O01** | Order | Lab/imaging order | EMR → LIS/RIS |
| **ORU^R01** | Results | Lab/imaging results | LIS/RIS → EMR |
| **MDM^T02** | Document | Clinical document | EMR → HIE |

### FHIR Resources

| Resource | Purpose | Example |
|----------|---------|---------|
| **Patient** | Demographics | Patient registration, updates |
| **Encounter** | Visit record | Outpatient visit, admission |
| **Observation** | Clinical data | Vitals, lab results |
| **MedicationRequest** | Prescription | ePrescribing |
| **DiagnosticReport** | Results | Lab report, imaging report |
| **CarePlan** | Care coordination | Chronic disease management |

---

## Compliance & Security

### UAE PDPL Compliance

**Data Subject Rights:**

| Right | Implementation | Table |
|-------|----------------|-------|
| **Access** | Patient portal, data export | All patient tables |
| **Rectification** | Update demographics, clinical data | `patients`, `encounters` |
| **Deletion** | Anonymization (retain for legal period) | All tables |
| **Restriction** | Sensitive data flags | `patient_consents` |
| **Portability** | FHIR export | All clinical tables |
| **Objection** | Opt-out of marketing, research | `patient_consents` |

### PHI Protection

**Encryption:**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Field-level encryption for SSN, Emirates ID

**Access Logging:**
```sql
-- Log every patient chart access
INSERT INTO data_access_logs (
    tenant_id,
    user_id,
    patient_id,
    accessed_table,
    access_type,
    access_reason,
    ip_address,
    accessed_at
) VALUES (
    current_setting('app.current_tenant_id')::uuid,
    'user-uuid',
    'patient-uuid',
    'encounters',
    'view',
    'clinical_care',
    '192.168.1.100',
    NOW()
);
```

### Consent Management

**Table: `patient_consents`**

```sql
CREATE TABLE patient_consents (
    patient_id UUID,
    consent_type VARCHAR(100),     -- data_sharing, research, marketing, telemedicine
    consent_status VARCHAR(20),    -- granted, denied, withdrawn
    granted_at TIMESTAMPTZ,
    withdrawn_at TIMESTAMPTZ
);
```

**Use Cases**:
- Data sharing with specialists
- Research participation
- Marketing communications
- Telemedicine consent
- Emergency contact authorization

---

## Performance Optimizations

### Indexing Strategy

```sql
-- Patient lookups
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_emirates_id ON patients(emirates_id);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

-- Encounter queries
CREATE INDEX idx_encounters_patient_date ON encounters(patient_id, encounter_date DESC);
CREATE INDEX idx_encounters_staff_date ON encounters(primary_staff_id, encounter_date DESC);
CREATE INDEX idx_encounters_status ON encounters(status, encounter_date DESC);

-- Order queries
CREATE INDEX idx_orders_encounter ON clinical_orders(encounter_id, order_type);
CREATE INDEX idx_orders_status ON clinical_orders(status, ordered_at DESC);

-- Result queries
CREATE INDEX idx_lab_reports_order ON lab_reports(order_id);
CREATE INDEX idx_lab_result_items_report ON lab_result_items(lab_report_id);
CREATE INDEX idx_imaging_reports_order ON imaging_reports(order_id);
```

### Query Optimization

**Efficient patient chart retrieval:**
```sql
-- Single query to get complete encounter summary
SELECT 
    e.id as encounter_id,
    e.encounter_date,
    e.encounter_type,
    s.first_name || ' ' || s.last_name as provider_name,
    
    -- Vitals (latest)
    (SELECT row_to_json(v.*) FROM vitals v 
     WHERE v.encounter_id = e.id 
     ORDER BY v.recorded_at DESC LIMIT 1) as vitals,
    
    -- Clinical notes
    (SELECT json_agg(cn.*) FROM clinical_notes cn 
     WHERE cn.encounter_id = e.id) as notes,
    
    -- Orders
    (SELECT json_agg(o.*) FROM clinical_orders o
     WHERE o.encounter_id = e.id) as orders,
    
    -- Diagnoses
    e.diagnosis_codes
    
FROM encounters e
JOIN staff s ON s.id = e.primary_staff_id
WHERE e.patient_id = 'patient-uuid'
ORDER BY e.encounter_date DESC
LIMIT 10;
```

---

## AI-Assisted Clinical Documentation

### Auto-Documentation from Voice

```typescript
async function transcribeAndDocument(
  encounterId: string,
  audioFile: Buffer
): Promise<{
  transcription: string;
  structuredNote: SOAPNote;
}> {
  // 1. Transcribe audio using speech-to-text
  const transcription = await speechToText(audioFile);
  
  // 2. Extract PHI and de-identify for LLM
  const deidentified = await deidentifyText(transcription);
  
  // 3. Structure into SOAP format using LLM
  const structuredNote = await llm.structureSOAPNote(deidentified);
  
  // 4. Re-identify and save
  const reidentified = await reidentifyNote(structuredNote);
  
  // 5. Save as draft (requires physician review)
  await db.query(`
    INSERT INTO clinical_notes (
      encounter_id,
      note_type,
      section,
      content,
      is_signed
    ) VALUES 
    ($1, 'soap', 'subjective', $2, false),
    ($1, 'soap', 'objective', $3, false),
    ($1, 'soap', 'assessment', $4, false),
    ($1, 'soap', 'plan', $5, false)
  `, [
    encounterId,
    reidentified.subjective,
    reidentified.objective,
    reidentified.assessment,
    reidentified.plan
  ]);
  
  return { transcription, structuredNote: reidentified };
}
```

### Auto-Coding Suggestions

```typescript
async function suggestICDCodes(
  encounterText: string
): Promise<{
  codes: Array<{
    code: string;
    description: string;
    confidence: number;
    rationale: string;
  }>;
}> {
  // Extract clinical concepts from note
  const concepts = await extractClinicalConcepts(encounterText);
  
  // Use AI model to suggest ICD-10 codes
  const suggestions = await aiCodingModel.predict({
    clinical_concepts: concepts,
    note_text: encounterText
  });
  
  // Store suggestions for review
  await db.query(`
    INSERT INTO auto_coding_suggestions (
      encounter_id,
      suggestion_type,
      suggestions,
      confidence_score
    ) VALUES ($1, 'icd10', $2, $3)
  `, [encounterId, JSON.stringify(suggestions), suggestions.avgConfidence]);
  
  return { codes: suggestions };
}
```

---

## Best Practices

### 1. **Structured Data Entry**
- Use coded values (LOINC, SNOMED, ICD-10) whenever possible
- Capture discrete data fields instead of free text
- Enable analytics and decision support

### 2. **Copy-Forward with Caution**
- Allow copying previous notes, but require review
- Timestamp copied sections
- Audit copy-forward usage

### 3. **Clinical Note Templates**
- Provide specialty-specific templates
- Include required elements (HPI, ROS, Physical Exam)
- Allow customization per provider

### 4. **Order Sets**
- Pre-defined order sets for common scenarios
- Diabetes workup, chest pain evaluation, pre-op orders
- Reduce errors, improve efficiency

### 5. **Result Review Workflow**
- All results must be reviewed and acknowledged
- Critical results require immediate action
- Automated reminders for pending results

### 6. **Clinical Documentation Integrity**
- Once signed, notes are locked
- Addendums for corrections (never delete)
- Audit trail for all changes

### 7. **Interoperability**
- Use standard vocabularies (LOINC, SNOMED, ICD-10)
- Support HL7 and FHIR
- Enable data exchange with HIE

### 8. **Mobile Access**
- Support mobile clinical documentation
- Offline mode for areas with poor connectivity
- Sync when connection restored

---

## Summary

The athma-ce Platform EMR/Clinical Data Capture system provides:

✅ **Complete Clinical Workflow** — Registration → Encounter → Documentation → Orders → Results  
✅ **SOAP Documentation** — Structured clinical notes with templates  
✅ **Order Management** — Unified order entry for meds, labs, imaging, procedures  
✅ **Result Integration** — HL7/FHIR result ingestion with auto-flagging  
✅ **Clinical Decision Support** — Allergy checks, drug interactions, duplicate detection  
✅ **Care Coordination** — Referrals, care plans, episode management  
✅ **AI-Assisted Documentation** — Voice transcription, auto-coding, note drafting  
✅ **Compliance** — UAE PDPL, HIPAA, audit trails, consent management  
✅ **Interoperability** — HL7, FHIR, DICOM, NCPDP SCRIPT  
✅ **Performance** — Optimized indexes, efficient queries  

**Clinical Data Tables**: 30+  
**Integration Protocols**: HL7, FHIR, DICOM, NCPDP  
**Decision Support Rules**: Allergies, interactions, duplicates, preventive care  
**Audit & Compliance**: Complete access logging, consent management  

The EMR system is designed for:
- **Clinics**: Outpatient visits, primary care
- **Hospitals**: Inpatient care, emergency department
- **Diagnostic Centers**: Lab and imaging workflows
- **Surgery Centers**: Surgical procedures, anesthesia records
- **Telemedicine**: Virtual consultations

All workflows support the complete spectrum of healthcare delivery in the UAE.
