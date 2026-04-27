# Order Management: Medicine & Diagnostic Orders

## Overview

The athma-ce platform supports comprehensive order management for various types of medical orders including medications, laboratory tests, imaging studies, procedures, and referrals. The system uses a flexible design that separates generic order information from order-type-specific details.

## Data Model Design

### Core Architecture

The order management system uses a **header-detail pattern**:

1. **`orders`** - Generic order header with common fields
2. **Order-specific tables** - Detailed information for each order type
3. **Result tables** - Store outcomes and findings
4. **Inventory tables** - Manage medication stock and dispensing

### Order Types Supported

| Order Type | Table | Purpose | Key Features |
|------------|-------|---------|--------------|
| **Medication** | `medication_orders` | Prescriptions | Dosage, frequency, refills, drug interactions |
| **Laboratory** | `lab_orders` | Lab tests | Specimen type, fasting requirements, reference ranges |
| **Imaging** | `imaging_orders` | Radiology studies | Modality, contrast, body part, DICOM integration |
| **Procedure** | `procedure_orders` | Surgical/diagnostic procedures | Anesthesia, facility requirements, consent |
| **Referral** | `referral_orders` | Specialist referrals | Specialty, urgency, authorization requirements |

## Order Workflow

### 1. Order Creation

```sql
-- Step 1: Create generic order header
INSERT INTO orders (
    encounter_id, patient_id, primary_staff_id,
    order_type, status, priority, description,
    clinical_notes
) VALUES (
    'encounter-uuid', 'patient-uuid', 'staff-uuid',
    'medication', 'pending', 'routine',
    'Prescription for hypertension management',
    'Patient has elevated BP, starting ACE inhibitor'
);

-- Step 2: Add order-specific details
INSERT INTO medication_orders (
    order_id, medication_name, generic_name,
    dosage_form, strength, route, frequency,
    duration, quantity, quantity_unit, refills,
    instructions, indication
) VALUES (
    'order-uuid', 'Lisinopril', 'Lisinopril',
    'tablet', '10mg', 'oral', 'once daily',
    '30 days', 30, 'tablets', 2,
    'Take with or without food', 'Hypertension'
);
```

### 2. Order Approval & Processing

```sql
-- Approve order
UPDATE orders 
SET status = 'approved', 
    approved_at = NOW(),
    approved_by = 'supervisor-uuid'
WHERE id = 'order-uuid';

-- Send to pharmacy/lab/imaging
UPDATE orders 
SET status = 'sent',
    sent_at = NOW()
WHERE id = 'order-uuid';
```

### 3. Result Entry

```sql
-- Lab results
INSERT INTO lab_results (
    lab_order_id, test_name, test_code,
    result_value, result_unit, reference_range,
    abnormal_flag, result_status, result_date,
    performed_by, verified_by
) VALUES (
    'lab-order-uuid', 'Complete Blood Count', 'CBC',
    '4.5', 'x10^9/L', '4.0-11.0', 'N',
    'final', NOW(), 'Lab Tech 1', 'Dr. Smith'
);

-- Imaging results
INSERT INTO imaging_results (
    imaging_order_id, study_name, modality,
    body_part, findings, impression,
    recommendations, report_status, report_date,
    radiologist_id
) VALUES (
    'imaging-order-uuid', 'Chest X-Ray', 'X-ray',
    'chest', 'Clear lung fields, normal heart size',
    'Normal chest X-ray', 'No follow-up needed',
    'final', NOW(), 'radiologist-uuid'
);
```

## Order Type Details

### Medication Orders

**Key Features:**
- Comprehensive drug information (generic/brand names)
- Dosage and administration details
- Drug interaction and allergy checking
- Refill management
- Patient instructions

**Example:**
```sql
INSERT INTO medication_orders (
    order_id, medication_name, generic_name, medication_code,
    dosage_form, strength, route, frequency, duration,
    quantity, quantity_unit, refills, instructions,
    indication, allergies_checked, drug_interactions_checked
) VALUES (
    'order-uuid', 'Amoxicillin', 'Amoxicillin', 'NDC-12345-678-90',
    'capsule', '500mg', 'oral', 'three times daily', '7 days',
    21, 'capsules', 0, 'Take with food to reduce stomach upset',
    'Bacterial infection', TRUE, TRUE
);
```

### Laboratory Orders

**Key Features:**
- Test categorization (hematology, chemistry, microbiology)
- Specimen collection requirements
- Fasting instructions
- Reference lab integration
- Expected result dates

**Example:**
```sql
INSERT INTO lab_orders (
    order_id, test_name, test_code, test_category,
    specimen_type, collection_method, fasting_required,
    fasting_duration_hours, special_instructions,
    reference_lab, expected_result_date
) VALUES (
    'order-uuid', 'Lipid Panel', 'LIPID', 'chemistry',
    'blood', 'venipuncture', TRUE, 12,
    'Patient should fast for 12 hours before collection',
    'Central Lab', NOW() + INTERVAL '2 days'
);
```

### Imaging Orders

**Key Features:**
- Modality specification (X-ray, CT, MRI, Ultrasound)
- Body part identification
- Contrast requirements
- Preparation instructions
- DICOM integration support

**Example:**
```sql
INSERT INTO imaging_orders (
    order_id, study_name, study_code, modality,
    body_part, contrast_required, contrast_type,
    preparation_instructions, clinical_indication,
    radiologist_id, facility_id, scheduled_at
) VALUES (
    'order-uuid', 'CT Abdomen and Pelvis', 'CT-ABD-PEL', 'CT',
    'abdomen and pelvis', TRUE, 'IV contrast',
    'NPO 4 hours prior, drink contrast 1 hour before',
    'Abdominal pain, rule out appendicitis',
    'radiologist-uuid', 'facility-uuid', '2024-01-15 14:00:00+04'
);
```

### Procedure Orders

**Key Features:**
- Procedure categorization (surgical, diagnostic, therapeutic)
- Anesthesia requirements
- Facility specifications
- Risk assessment
- Consent management

**Example:**
```sql
INSERT INTO procedure_orders (
    order_id, procedure_name, procedure_code, procedure_category,
    body_system, anesthesia_type, facility_required,
    estimated_duration_minutes, preparation_instructions,
    risks_and_complications, consent_required,
    surgeon_id, facility_id, scheduled_at
) VALUES (
    'order-uuid', 'Colonoscopy', '45378', 'diagnostic',
    'gastrointestinal', 'conscious sedation', 'hospital',
    60, 'Clear liquid diet 24 hours prior, bowel prep',
    'Bleeding, perforation, reaction to sedation',
    TRUE, 'surgeon-uuid', 'facility-uuid', '2024-01-20 09:00:00+04'
);
```

### Referral Orders

**Key Features:**
- Specialty targeting
- Urgency classification
- Insurance authorization
- Clinical summary
- Contact information

**Example:**
```sql
INSERT INTO referral_orders (
    order_id, referral_type, specialty, referred_to_name,
    referred_to_facility, referral_reason, clinical_summary,
    urgency, expected_appointment_date,
    insurance_authorization_required, authorization_number
) VALUES (
    'order-uuid', 'specialist', 'cardiology', 'Dr. Ahmed Al-Rashid',
    'Dubai Heart Center', 'Chest pain evaluation',
    '45-year-old male with chest pain, ECG shows ST changes',
    'urgent', '2024-01-16', TRUE, 'AUTH-12345'
);
```

## Medication Inventory & Dispensing

### Inventory Management

```sql
-- Add medication to inventory
INSERT INTO medication_inventory (
    tenant_id, medication_name, generic_name, medication_code,
    dosage_form, strength, manufacturer, batch_number,
    expiry_date, current_stock, minimum_stock, maximum_stock,
    unit_cost, selling_price, storage_location,
    controlled_substance, requires_prescription
) VALUES (
    'tenant-uuid', 'Lisinopril', 'Lisinopril', 'NDC-12345-678-90',
    'tablet', '10mg', 'Generic Pharma', 'BATCH-2024-001',
    '2025-12-31', 1000, 100, 2000, 0.50, 2.00,
    'Pharmacy Shelf A1', FALSE, TRUE
);
```

### Dispensing Process

```sql
-- Dispense medication
INSERT INTO medication_dispensing (
    medication_order_id, inventory_id, dispensed_quantity,
    dispensed_unit, dispensed_by, patient_instructions,
    side_effects_discussed, drug_interactions_discussed,
    patient_understood
) VALUES (
    'medication-order-uuid', 'inventory-uuid', 30,
    'tablets', 'pharmacist-uuid',
    'Take once daily with or without food. Monitor blood pressure.',
    TRUE, TRUE, TRUE
);

-- Update inventory
UPDATE medication_inventory 
SET current_stock = current_stock - 30
WHERE id = 'inventory-uuid';
```

## Business Logic & Validation

### Order Status Workflow

```sql
-- Order status transitions
CREATE OR REPLACE FUNCTION validate_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate status transitions
    IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
        RAISE EXCEPTION 'Cannot modify completed order';
    END IF;
    
    -- Set timestamps based on status
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        NEW.approved_at = NOW();
    END IF;
    
    IF NEW.status = 'sent' AND OLD.status = 'approved' THEN
        NEW.sent_at = NOW();
    END IF;
    
    IF NEW.status = 'completed' AND OLD.status = 'sent' THEN
        NEW.completed_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_status_transition
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION validate_order_status_transition();
```

### Drug Interaction Checking

```sql
-- Check for drug interactions (simplified example)
CREATE OR REPLACE FUNCTION check_drug_interactions(
    p_medication_name VARCHAR,
    p_patient_id UUID
) RETURNS TABLE(
    interaction_level VARCHAR,
    interaction_description TEXT
) AS $$
BEGIN
    -- This would integrate with a drug interaction database
    -- For now, return a placeholder
    RETURN QUERY
    SELECT 'moderate'::VARCHAR, 'Potential interaction with current medications'::TEXT
    WHERE EXISTS (
        SELECT 1 FROM medication_orders mo
        JOIN orders o ON o.id = mo.order_id
        WHERE o.patient_id = p_patient_id
          AND mo.medication_name != p_medication_name
          AND o.status IN ('approved', 'sent', 'completed')
    );
END;
$$ LANGUAGE plpgsql;
```

## Integration Points

### 1. Billing Integration

Orders automatically generate billing entries:

```sql
-- Create superbill item from order
INSERT INTO superbill_items (
    superbill_id, line_number, code_type, code,
    description, units, unit_price
) 
SELECT 
    s.id, 1, 'CPT', '99213', -- Example CPT code
    o.description, 1, 150.00
FROM orders o
JOIN encounters e ON e.id = o.encounter_id
JOIN superbills s ON s.encounter_id = e.id
WHERE o.id = 'order-uuid'
  AND o.status = 'completed';
```

### 2. Clinical Decision Support

```sql
-- Get patient's medication history for interaction checking
SELECT 
    mo.medication_name,
    mo.generic_name,
    mo.strength,
    mo.frequency,
    o.ordered_at,
    o.status
FROM medication_orders mo
JOIN orders o ON o.id = mo.order_id
WHERE o.patient_id = 'patient-uuid'
  AND o.status IN ('approved', 'sent', 'completed')
  AND o.ordered_at >= NOW() - INTERVAL '6 months'
ORDER BY o.ordered_at DESC;
```

### 3. Reporting & Analytics

```sql
-- Order volume by type and status
SELECT 
    order_type,
    status,
    COUNT(*) as order_count,
    AVG(EXTRACT(EPOCH FROM (completed_at - ordered_at))/3600) as avg_completion_hours
FROM orders
WHERE ordered_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY order_type, status
ORDER BY order_type, status;

-- Medication inventory alerts
SELECT 
    medication_name,
    current_stock,
    minimum_stock,
    (current_stock - minimum_stock) as stock_remaining
FROM medication_inventory
WHERE current_stock <= minimum_stock
  AND status = 'active'
ORDER BY (current_stock - minimum_stock);
```

## Best Practices

### 1. Order Management

- **Always check allergies** before prescribing medications
- **Verify drug interactions** for all new prescriptions
- **Include clear instructions** for patients
- **Set appropriate priorities** (routine, urgent, stat)
- **Document clinical reasoning** in order notes

### 2. Result Management

- **Enter results promptly** when available
- **Flag abnormal results** appropriately
- **Include reference ranges** for lab results
- **Provide clear impressions** for imaging
- **Document follow-up recommendations**

### 3. Inventory Management

- **Monitor stock levels** regularly
- **Set appropriate minimum/maximum** stock levels
- **Track expiration dates** and rotate stock
- **Maintain accurate pricing** information
- **Handle controlled substances** with extra care

### 4. Compliance

- **Maintain audit trails** for all order changes
- **Ensure proper authorization** for controlled substances
- **Follow regulatory requirements** for prescriptions
- **Document consent** for procedures
- **Maintain patient privacy** throughout the process

## UAE-Specific Considerations

### 1. Regulatory Compliance

- **DHA requirements** for prescription management
- **Controlled substance regulations** in UAE
- **Insurance authorization** requirements
- **Medical device regulations** for procedures

### 2. Local Integration

- **UAE pharmacy networks** for medication dispensing
- **Local laboratory services** for test processing
- **Imaging centers** and DICOM standards
- **Specialist referral networks**

### 3. Language Support

- **Arabic medication names** and instructions
- **Bilingual result reporting**
- **Local terminology** for procedures
- **Cultural considerations** in patient instructions

This comprehensive order management system provides the foundation for efficient clinical workflows while maintaining data integrity, regulatory compliance, and integration capabilities across the athma-ce platform.
