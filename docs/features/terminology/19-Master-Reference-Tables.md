# Master Reference Tables for Orders

## Overview

The master reference tables provide standardized, searchable catalogs for medications, lab tests, imaging studies, and procedures. These tables ensure consistency in order entry, reduce errors, and provide comprehensive metadata for clinical decision support.

## Master Tables

### 1. Medication Master (`medication_master`)

**Purpose**: Centralized medication catalog with drug information, codes, and clinical data.

**Key Features**:
- **Multi-code support**: NDC, ATC, and local facility codes
- **Clinical metadata**: Drug class, therapeutic class, contraindications
- **Safety information**: Controlled substance classification, side effects, interactions
- **Default parameters**: Standard frequency, duration, and storage requirements

**Code Systems**:
- **NDC**: National Drug Code (US FDA)
- **ATC**: Anatomical Therapeutic Chemical Classification (WHO)
- **Local Code**: Facility-specific medication codes

**Example Usage**:
```sql
-- Search for medications by name or code
SELECT * FROM medication_master 
WHERE medication_name ILIKE '%amoxicillin%' 
   OR ndc_code = '12345-678-90'
   OR local_code = 'AMOX-500';

-- Get medication details for order entry
SELECT * FROM populate_medication_order_from_master(
  'medication-uuid', 
  'tenant-uuid'
);
```

### 2. Lab Test Master (`lab_test_master`)

**Purpose**: Comprehensive laboratory test catalog with specimen requirements and reference ranges.

**Key Features**:
- **LOINC integration**: Standardized laboratory test codes for orders and results
- **CPT integration**: Current Procedural Terminology codes for billing
- **Specimen management**: Collection methods, preparation requirements
- **Reference ranges**: Gender and age-specific normal values
- **Turnaround times**: Expected result delivery times

**Code Systems**:
- **LOINC**: Logical Observation Identifiers Names and Codes (primary for orders and results)
- **CPT**: Current Procedural Terminology (for billing purposes)
- **Local Code**: Facility-specific lab test codes

**Example Usage**:
```sql
-- Search for lab tests by LOINC code
SELECT * FROM lab_test_master 
WHERE loinc_code = '33747-0'  -- Hemoglobin
   AND is_active = TRUE;

-- Search for lab tests by category
SELECT * FROM lab_test_master 
WHERE test_category = 'hematology' 
   AND specimen_type = 'blood'
   AND is_active = TRUE;

-- Get test details for order entry
SELECT * FROM populate_lab_order_from_master(
  'lab-test-uuid', 
  'tenant-uuid'
);
```

### 3. Imaging Study Master (`imaging_study_master`)

**Purpose**: Radiology and imaging study catalog with modality and preparation requirements.

**Key Features**:
- **CPT integration**: Current Procedural Terminology codes for billing
- **Local code support**: Facility-specific radiology codes
- **Modality support**: X-ray, CT, MRI, Ultrasound, etc.
- **Contrast management**: IV, oral, rectal contrast requirements
- **Facility requirements**: Equipment and location specifications

**Code Systems**:
- **CPT**: Current Procedural Terminology (for billing)
- **Local Code**: Facility-specific radiology codes

**Example Usage**:
```sql
-- Search for imaging studies by CPT code
SELECT * FROM imaging_study_master 
WHERE cpt_code = '71260'  -- CT chest without contrast
   AND is_active = TRUE;

-- Search for imaging studies by body part
SELECT * FROM imaging_study_master 
WHERE body_part = 'chest' 
   AND modality = 'CT'
   AND contrast_required = FALSE;

-- Get study details for order entry
SELECT * FROM populate_imaging_order_from_master(
  'imaging-study-uuid', 
  'tenant-uuid'
);
```

### 4. Procedure Master (`procedure_master`)

**Purpose**: Surgical and medical procedure catalog with anesthesia and facility requirements.

**Key Features**:
- **CPT support**: Current Procedural Terminology codes for billing
- **ICD-10-PCS support**: International Classification of Diseases, 10th Revision, Procedure Coding System
- **Local code support**: Facility-specific procedure codes
- **Anesthesia classification**: Local, regional, general requirements
- **Facility requirements**: Clinic, hospital, surgery center needs
- **Risk assessment**: Complications, contraindications, monitoring

**Code Systems**:
- **CPT**: Current Procedural Terminology (for billing)
- **ICD-10-PCS**: International Classification of Diseases, 10th Revision, Procedure Coding System
- **Local Code**: Facility-specific procedure codes

**Example Usage**:
```sql
-- Search for procedures by CPT code
SELECT * FROM procedure_master 
WHERE cpt_code = '33405'  -- Mitral valve repair
   AND is_active = TRUE;

-- Search for procedures by category
SELECT * FROM procedure_master 
WHERE procedure_category = 'surgical' 
   AND body_system = 'cardiovascular'
   AND anesthesia_type = 'general';

-- Get procedure details for order entry
SELECT * FROM populate_procedure_order_from_master(
  'procedure-uuid', 
  'tenant-uuid'
);
```

**OT Usage**:
- OT request creation should source procedure selection from `procedure_master`.
- OT request procedure pickers should limit results to surgical procedure catalog rows, with category matching handled case-insensitively.
- When a procedure is selected, the client can safely derive display and helper defaults such as billing/procedure code, anesthesia type, and estimated duration from the catalog row.

## Order Integration

### Master Table References

Each order table now includes a reference to its corresponding master table:

```sql
-- Medication orders reference medication master
ALTER TABLE medication_orders 
ADD COLUMN medication_master_id UUID REFERENCES medication_master(id);

-- Lab orders reference lab test master
ALTER TABLE lab_orders 
ADD COLUMN lab_test_master_id UUID REFERENCES lab_test_master(id);

-- Imaging orders reference imaging study master
ALTER TABLE imaging_orders 
ADD COLUMN imaging_study_master_id UUID REFERENCES imaging_study_master(id);

-- Procedure orders reference procedure master
ALTER TABLE procedure_orders 
ADD COLUMN procedure_master_id UUID REFERENCES procedure_master(id);
```

### Helper Functions

Four helper functions automatically populate order details from master tables:

1. **`populate_medication_order_from_master()`**: Fetches medication details
2. **`populate_lab_order_from_master()`**: Fetches lab test details
3. **`populate_imaging_order_from_master()`**: Fetches imaging study details
4. **`populate_procedure_order_from_master()`**: Fetches procedure details

### Order Entry Workflow

1. **Search Master Tables**: User searches for medication/test/study/procedure
2. **Select Master Record**: User selects from master table results
3. **Auto-populate Order**: System populates order details from master
4. **Customize Parameters**: User can override any master-derived values
5. **Save Order**: Order is saved with both master reference and custom values

## Multi-Tenant Support

### Global vs Tenant-Specific Data

- **Global Data**: `tenant_id = NULL` (shared across all tenants)
- **Tenant-Specific Data**: `tenant_id = specific-tenant-uuid` (customized for specific tenant)

### RLS Policies

```sql
-- Master tables allow both global and tenant-specific access
CREATE POLICY tenant_isolation_medication_master ON medication_master
  FOR ALL TO application_role
  USING (
    tenant_id IS NULL OR tenant_id = current_setting('app.current_tenant_id')::uuid
  );
```

## Data Management

### Master Data Maintenance

1. **Global Updates**: System administrators maintain global master data
2. **Tenant Customization**: Tenants can add custom entries or override global data
3. **Version Control**: Master data changes are tracked with timestamps
4. **Active/Inactive Status**: Entries can be deactivated without deletion

### Data Import/Export

- **Bulk Import**: CSV/Excel import for master data
- **API Integration**: Real-time updates from external systems
- **Export Capabilities**: Master data export for backup and migration

## Clinical Decision Support

### Drug Interactions

```sql
-- Check for drug interactions
SELECT mm1.medication_name, mm2.medication_name, mm1.drug_interactions
FROM medication_master mm1, medication_master mm2
WHERE mm1.id = 'medication-1-uuid'
  AND mm2.id = 'medication-2-uuid'
  AND mm1.drug_interactions && mm2.drug_interactions;
```

### Contraindications

```sql
-- Check contraindications
SELECT contraindications
FROM medication_master
WHERE id = 'medication-uuid'
  AND contraindications IS NOT NULL;
```

### Reference Ranges

```sql
-- Get appropriate reference range
SELECT 
  CASE 
    WHEN patient_age < 18 THEN normal_range_pediatric
    WHEN patient_gender = 'M' THEN normal_range_male
    ELSE normal_range_female
  END as reference_range
FROM lab_test_master
WHERE id = 'lab-test-uuid';
```

## UAE-Specific Considerations

### Laboratory Coding Standards

**UAE Healthcare Standards**:
- **Lab Orders**: LOINC codes for test identification and ordering
- **Lab Results**: LOINC codes for result identification and reporting
- **Billing**: CPT codes for insurance claims and reimbursement
- **Local Codes**: Facility-specific codes for internal use

**Code System Hierarchy**:
1. **LOINC** (Primary): Universal standard for lab test identification
2. **CPT** (Billing): Required for insurance claims and reimbursement
3. **Local Codes** (Internal): Facility-specific codes for workflow

### Local Code Systems

- **DHA Codes**: Dubai Health Authority specific codes
- **DOH Codes**: Department of Health specific codes
- **MOHAP Codes**: Ministry of Health and Prevention codes
- **Facility Codes**: Individual healthcare facility codes

### Arabic Support

- **Bilingual Names**: English and Arabic medication/test names
- **Local Terminology**: UAE-specific medical terminology
- **Cultural Considerations**: Local preferences and practices

### Regulatory Compliance

- **Drug Registration**: UAE FDA approved medications only
- **Licensing Requirements**: Licensed facilities and procedures
- **Insurance Coverage**: Payer-specific coverage rules

## Performance Optimization

### Indexing Strategy

```sql
-- Composite indexes for common search patterns
CREATE INDEX idx_medication_master_search ON medication_master(
  tenant_id, is_active, medication_name, drug_class
);

CREATE INDEX idx_lab_test_master_search ON lab_test_master(
  tenant_id, is_active, test_category, specimen_type
);

CREATE INDEX idx_imaging_study_master_search ON imaging_study_master(
  tenant_id, is_active, modality, body_part
);

CREATE INDEX idx_procedure_master_search ON procedure_master(
  tenant_id, is_active, procedure_category, body_system
);
```

### Caching Strategy

- **Master Data Caching**: Frequently accessed master data cached in application
- **Search Results Caching**: Common search results cached for performance
- **Reference Data Caching**: Static reference data cached at startup

## Integration Points

### External Systems

1. **Pharmacy Systems**: Medication master sync with pharmacy databases
2. **Lab Information Systems**: Lab test master sync with LIS
3. **Radiology Information Systems**: Imaging study master sync with RIS
4. **Procedure Databases**: Procedure master sync with surgical databases

### API Endpoints

- **Search APIs**: RESTful endpoints for master data search
- **Lookup APIs**: Fast lookup endpoints for order entry
- **Sync APIs**: Real-time synchronization with external systems

## Best Practices

### Data Quality

1. **Standardized Naming**: Consistent naming conventions across master tables
2. **Code Validation**: Regular validation of external code systems
3. **Duplicate Prevention**: Unique constraints to prevent duplicate entries
4. **Data Auditing**: Regular audits of master data accuracy

### User Experience

1. **Intelligent Search**: Fuzzy search with typo tolerance
2. **Auto-complete**: Real-time suggestions during order entry
3. **Recent Items**: Quick access to recently used items
4. **Favorites**: User-specific favorite medications/tests/procedures

### Maintenance

1. **Regular Updates**: Scheduled updates from authoritative sources
2. **Change Management**: Controlled changes with approval workflows
3. **Backup Strategy**: Regular backups of master data
4. **Disaster Recovery**: Master data recovery procedures

## Future Enhancements

### AI Integration

- **Smart Suggestions**: AI-powered order suggestions based on patient history
- **Drug Interaction Alerts**: Real-time interaction checking
- **Dosing Recommendations**: AI-suggested dosing based on patient factors
- **Cost Optimization**: AI-suggested cost-effective alternatives

### Advanced Features

- **Formulary Management**: Payer-specific formularies
- **Prior Authorization**: Automated PA requirement checking
- **Cost Estimation**: Real-time cost estimates for orders
- **Quality Metrics**: Order accuracy and outcome tracking

## UAE Laboratory Coding Standards

### Corrected Implementation

Based on UAE healthcare standards, the system now correctly implements:

**Lab Orders**: 
- **LOINC codes** for test identification and ordering
- **CPT codes** for billing and insurance claims
- **Local codes** for facility-specific workflows

**Lab Results**:
- **LOINC codes** for result identification and reporting
- **Standardized result values** with units and reference ranges
- **Abnormal flags** for clinical decision support

### Example Implementation

```sql
-- Lab Test Master with correct coding
INSERT INTO lab_test_master (
  test_name, 
  loinc_code, 
  cpt_code, 
  test_category, 
  specimen_type
) VALUES (
  'Hemoglobin',
  '33747-0',  -- LOINC code
  '85018',    -- CPT code for billing
  'hematology',
  'blood'
);

-- Lab Order with LOINC
INSERT INTO lab_orders (
  order_id, 
  lab_test_master_id, 
  test_name, 
  loinc_code, 
  cpt_code
) VALUES (
  'order-uuid',
  'lab-test-master-uuid',
  'Hemoglobin',
  '33747-0',  -- LOINC for ordering
  '85018'     -- CPT for billing
);

-- Lab Result with LOINC
INSERT INTO lab_results (
  lab_order_id, 
  loinc_code, 
  test_name, 
  result_value, 
  result_unit, 
  reference_range
) VALUES (
  'lab-order-uuid',
  '33747-0',  -- LOINC for result identification
  'Hemoglobin',
  '14.2',
  'g/dL',
  '12.0-15.5'
);

-- Imaging Order with CPT and Local Code
INSERT INTO imaging_orders (
  order_id, 
  imaging_study_master_id, 
  study_name, 
  cpt_code, 
  local_code, 
  modality, 
  body_part
) VALUES (
  'order-uuid',
  'imaging-study-master-uuid',
  'CT Chest without Contrast',
  '71260',    -- CPT for billing
  'CT-CHEST-001', -- Local facility code
  'CT',
  'chest'
);

-- Procedure Order with CPT and ICD-10-PCS
INSERT INTO procedure_orders (
  order_id, 
  procedure_master_id, 
  procedure_name, 
  cpt_code, 
  icd10_pcs_code, 
  local_code, 
  procedure_category
) VALUES (
  'order-uuid',
  'procedure-master-uuid',
  'Appendectomy',
  '44970',    -- CPT for billing
  '0DT70ZZ',  -- ICD-10-PCS code
  'APP-001',  -- Local facility code
  'surgical'
);
```

This master reference table system provides a robust foundation for standardized, efficient, and safe order entry across the entire healthcare system, with correct UAE coding standards implementation.
