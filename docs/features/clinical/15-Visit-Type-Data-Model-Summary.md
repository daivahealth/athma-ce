# Visit Type Data Model - Summary of Changes

## Overview

This document summarizes all data model changes made to support **New Visit, Revisit, and Follow-up** workflows with automatic classification and flexible pricing rules.

---

## Schema Changes

### 1. Appointments Table - Enhanced

**Added Columns:**

```sql
ALTER TABLE appointments ADD COLUMN visit_type VARCHAR(50);
-- Values: new_visit, revisit, follow_up, post_op_followup, emergency

ALTER TABLE appointments ADD COLUMN linked_encounter_id UUID REFERENCES encounters(id);
-- Links follow-up appointments to their original encounter
```

**Purpose:**
- `visit_type`: Explicitly stores the classification of visit (new, revisit, follow-up, etc.)
- `linked_encounter_id`: Creates a relationship chain for follow-up visits back to the original encounter

**Indexes Added:**
```sql
CREATE INDEX idx_appointments_visit_type ON appointments(visit_type, scheduled_at);
CREATE INDEX idx_appointments_linked_encounter ON appointments(linked_encounter_id) 
    WHERE linked_encounter_id IS NOT NULL;
```

---

### 2. Visit Type Pricing Rules Table - New

**Purpose:** Define tenant-specific pricing policies for different visit types with flexible conditions.

```sql
CREATE TABLE visit_type_pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    visit_type VARCHAR(50) NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 100,
    conditions JSONB DEFAULT '{}',
    pricing_action VARCHAR(50) NOT NULL,
    discount_percentage NUMERIC(5,2),
    discount_amount DECIMAL(10,2),
    custom_price DECIMAL(10,2),
    applies_to_cpt_codes VARCHAR(20)[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, visit_type, rule_name)
);
```

**Key Features:**
- **Multiple pricing actions**: `no_charge`, `percentage_discount`, `fixed_discount`, `custom_price`
- **Flexible conditions**: JSONB field supports complex rules (days since last visit, specialty, etc.)
- **CPT code specificity**: Can apply to specific CPT codes or all
- **Priority-based**: Higher priority rules take precedence
- **Time-bound**: Active only within effective date range

**Example Rules:**

```sql
-- Free follow-up within 14 days
INSERT INTO visit_type_pricing_rules (
    tenant_id, visit_type, rule_name, priority,
    conditions, pricing_action,
    description
) VALUES (
    :tenant_id, 'follow_up', 'Free 14-day follow-up', 100,
    '{"days_since_last_visit": {"lte": 14}}',
    'no_charge',
    'Follow-up visits within 14 days are free'
);

-- 50% discount for follow-ups within 30 days
INSERT INTO visit_type_pricing_rules (
    tenant_id, visit_type, rule_name, priority,
    conditions, pricing_action, discount_percentage,
    description
) VALUES (
    :tenant_id, 'follow_up', '50% off 30-day follow-up', 90,
    '{"days_since_last_visit": {"lte": 30, "gte": 15}}',
    'percentage_discount', 50.00,
    'Follow-up visits 15-30 days get 50% discount'
);

-- Cardiology follow-ups custom pricing
INSERT INTO visit_type_pricing_rules (
    tenant_id, visit_type, rule_name, priority,
    conditions, pricing_action, custom_price,
    applies_to_cpt_codes, description
) VALUES (
    :tenant_id, 'follow_up', 'Cardiology follow-up special', 95,
    '{"specialty": "cardiology"}',
    'custom_price', 100.00,
    ARRAY['99213', '99214'],
    'Fixed price for cardiology follow-ups'
);
```

**Indexes:**
```sql
CREATE INDEX idx_visit_type_pricing_rules_tenant 
    ON visit_type_pricing_rules(tenant_id, visit_type, is_active);
CREATE INDEX idx_visit_type_pricing_rules_priority 
    ON visit_type_pricing_rules(priority DESC) WHERE is_active = TRUE;
```

---

### 3. Visit Type History Table - New

**Purpose:** Audit trail of all visit type classifications and pricing applied.

```sql
CREATE TABLE visit_type_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE CASCADE,
    visit_type VARCHAR(50) NOT NULL,
    visit_date DATE NOT NULL,
    days_since_last_visit INTEGER,
    auto_classified BOOLEAN DEFAULT TRUE,
    override_reason TEXT,
    pricing_rule_applied_id UUID REFERENCES visit_type_pricing_rules(id),
    original_price DECIMAL(10,2),
    adjusted_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- Tracks every visit with its classification
- Records if classification was automatic or manually overridden
- Links to the pricing rule that was applied
- Stores both original and adjusted prices for audit
- Enables reporting on follow-up compliance

**Indexes:**
```sql
CREATE INDEX idx_visit_type_history_patient ON visit_type_history(patient_id, visit_date DESC);
CREATE INDEX idx_visit_type_history_staff ON visit_type_history(staff_id, visit_date DESC);
CREATE INDEX idx_visit_type_history_encounter ON visit_type_history(encounter_id) 
    WHERE encounter_id IS NOT NULL;
```

---

## Database Functions

### 1. determine_visit_type()

**Purpose:** Automatically classify visit type based on patient history.

```sql
CREATE OR REPLACE FUNCTION determine_visit_type(
    p_patient_id UUID,
    p_staff_id UUID,
    p_appointment_date DATE
) RETURNS TABLE(
    visit_type VARCHAR(50),
    days_since_last_visit INTEGER,
    last_encounter_id UUID,
    last_visit_date DATE
)
```

**Logic:**
- Never seen provider → `new_visit`
- Last visit > 3 years ago → `new_visit` (CPT definition)
- Last visit ≤ 14 days ago → `follow_up`
- Otherwise → `revisit`

**Usage:**
```sql
-- At appointment booking
SELECT * FROM determine_visit_type(
    'patient-uuid',
    'staff-uuid',
    '2025-10-15'
);
```

### 2. get_visit_pricing_rule()

**Purpose:** Find the applicable pricing rule for a visit.

```sql
CREATE OR REPLACE FUNCTION get_visit_pricing_rule(
    p_tenant_id UUID,
    p_visit_type VARCHAR(50),
    p_days_since_last INTEGER,
    p_cpt_code VARCHAR(20),
    p_specialty VARCHAR(100) DEFAULT NULL
) RETURNS UUID
```

**Logic:**
- Filters active rules for the visit type
- Checks date validity (effective_from/to)
- Validates CPT code match (if specified)
- Evaluates JSONB conditions
- Returns highest priority matching rule

**Usage:**
```sql
-- Find applicable rule
SELECT get_visit_pricing_rule(
    :tenant_id,
    'follow_up',
    10,  -- days since last visit
    '99213',
    'cardiology'
);
```

### 3. calculate_visit_price()

**Purpose:** Calculate adjusted price based on pricing rule.

```sql
CREATE OR REPLACE FUNCTION calculate_visit_price(
    p_original_price DECIMAL(10,2),
    p_pricing_rule_id UUID
) RETURNS DECIMAL(10,2)
```

**Logic:**
- `no_charge` → $0.00
- `percentage_discount` → original × (1 - discount%/100)
- `fixed_discount` → max(0, original - discount_amount)
- `custom_price` → custom_price value
- No rule → original price

**Usage:**
```sql
-- Calculate adjusted price
SELECT calculate_visit_price(
    350.00,  -- original price
    :pricing_rule_id
);
```

---

## Database Triggers

### record_visit_type_history()

**Purpose:** Automatically log visit type history when encounter is completed.

**Trigger Definition:**
```sql
CREATE TRIGGER trg_record_visit_type_history
    AFTER INSERT OR UPDATE ON encounters
    FOR EACH ROW
    EXECUTE FUNCTION record_visit_type_history();
```

**Behavior:**
- Fires when encounter status changes to `completed`
- Retrieves visit type from appointment
- Calculates days since last visit
- Inserts record into `visit_type_history`

---

## RLS Policies

All new tables have Row-Level Security enabled:

```sql
ALTER TABLE visit_type_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_type_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_visit_type_pricing_rules 
    ON visit_type_pricing_rules
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_visit_type_history 
    ON visit_type_history
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## Complete Workflow Example

### Scenario: Follow-up Visit

```sql
-- 1. Patient had initial visit 10 days ago
-- Initial encounter completed with ID: abc-123

-- 2. Schedule follow-up appointment
INSERT INTO appointments (
    tenant_id, patient_id, primary_staff_id,
    scheduled_at, visit_type, linked_encounter_id
)
SELECT
    :tenant_id, :patient_id, :staff_id,
    NOW() + INTERVAL '3 days',
    vt.visit_type,
    vt.last_encounter_id
FROM determine_visit_type(:patient_id, :staff_id, CURRENT_DATE + 3) vt
RETURNING id;

-- Result: visit_type = 'follow_up', linked_encounter_id = 'abc-123'

-- 3. Patient arrives, create encounter
INSERT INTO encounters (
    appointment_id, patient_id, primary_staff_id,
    start_time, encounter_type, status
) VALUES (
    :appointment_id, :patient_id, :staff_id,
    NOW(), 'follow_up', 'in_progress'
);

-- 4. Generate superbill
INSERT INTO superbills (
    encounter_id, patient_id, primary_staff_id,
    status, payment_status
) VALUES (
    :encounter_id, :patient_id, :staff_id,
    'draft', 'unpaid'
)
RETURNING id;

-- 5. Add line item with pricing rule
WITH pricing_context AS (
    SELECT * FROM determine_visit_type(:patient_id, :staff_id, CURRENT_DATE)
),
pricing_rule AS (
    SELECT get_visit_pricing_rule(
        :tenant_id,
        'follow_up',
        pc.days_since_last_visit,
        '99213',
        NULL
    ) as rule_id
    FROM pricing_context pc
)
INSERT INTO superbill_items (
    superbill_id, line_number, code_type, code,
    description, units, unit_price, metadata
)
SELECT
    :superbill_id, 1, 'CPT', '99213',
    'Follow-up Visit - Established Patient', 1,
    calculate_visit_price(350.00, pr.rule_id),
    jsonb_build_object(
        'pricing_rule_id', pr.rule_id,
        'original_price', 350.00,
        'days_since_last_visit', pc.days_since_last_visit
    )
FROM pricing_context pc, pricing_rule pr;

-- Result: If rule is "free within 14 days", unit_price = 0.00

-- 6. Update superbill totals
UPDATE superbills SET
    total_amount = (SELECT SUM(amount) FROM superbill_items WHERE superbill_id = :superbill_id),
    invoice_number = generate_invoice_number(),
    status = 'finalized',
    generated_at = NOW()
WHERE id = :superbill_id;

-- 7. Collect payment (if any)
INSERT INTO patient_payments (
    tenant_id, patient_id, superbill_id,
    amount, method, collected_by
) VALUES (
    :tenant_id, :patient_id, :superbill_id,
    0.00,  -- free follow-up
    'no_charge', :user_id
);

-- 8. Complete encounter (triggers history recording)
UPDATE encounters SET
    status = 'completed',
    end_time = NOW()
WHERE id = :encounter_id;

-- 9. Visit type history is automatically recorded by trigger
-- Check the history
SELECT * FROM visit_type_history
WHERE encounter_id = :encounter_id;
```

---

## Query Examples

### Find Patients Due for Follow-up

```sql
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    vth.visit_date as last_visit,
    CURRENT_DATE - vth.visit_date as days_since,
    vth.visit_type
FROM visit_type_history vth
JOIN patients p ON p.id = vth.patient_id
WHERE vth.tenant_id = :tenant_id
  AND vth.visit_type IN ('new_visit', 'revisit')
  AND CURRENT_DATE - vth.visit_date BETWEEN 7 AND 14
  AND NOT EXISTS (
      SELECT 1 FROM visit_type_history vth2
      WHERE vth2.patient_id = vth.patient_id
        AND vth2.staff_id = vth.staff_id
        AND vth2.visit_date > vth.visit_date
  )
ORDER BY days_since DESC;
```

### Visit Type Distribution Report

```sql
SELECT 
    visit_type,
    COUNT(*) as visit_count,
    COUNT(CASE WHEN pricing_rule_applied_id IS NOT NULL THEN 1 END) as discounted_count,
    AVG(original_price) as avg_original_price,
    AVG(adjusted_price) as avg_adjusted_price,
    SUM(original_price - adjusted_price) as total_discount_given
FROM visit_type_history
WHERE tenant_id = :tenant_id
  AND visit_date >= :start_date
  AND visit_date <= :end_date
GROUP BY visit_type
ORDER BY visit_count DESC;
```

### Pricing Rule Effectiveness

```sql
SELECT 
    vpr.rule_name,
    vpr.visit_type,
    vpr.pricing_action,
    COUNT(vth.id) as times_applied,
    SUM(vth.original_price - vth.adjusted_price) as total_discount_value,
    AVG(vth.original_price - vth.adjusted_price) as avg_discount_per_visit
FROM visit_type_pricing_rules vpr
LEFT JOIN visit_type_history vth ON vth.pricing_rule_applied_id = vpr.id
WHERE vpr.tenant_id = :tenant_id
  AND vpr.is_active = TRUE
GROUP BY vpr.id, vpr.rule_name, vpr.visit_type, vpr.pricing_action
ORDER BY times_applied DESC;
```

### Follow-up Compliance Rate

```sql
WITH initial_visits AS (
    SELECT 
        patient_id,
        staff_id,
        visit_date,
        encounter_id
    FROM visit_type_history
    WHERE tenant_id = :tenant_id
      AND visit_type IN ('new_visit', 'revisit')
      AND visit_date >= :start_date
      AND visit_date <= :end_date
),
followups AS (
    SELECT 
        iv.patient_id,
        iv.staff_id,
        iv.visit_date as initial_date,
        COUNT(vth.id) as followup_count
    FROM initial_visits iv
    LEFT JOIN visit_type_history vth 
        ON vth.patient_id = iv.patient_id
       AND vth.staff_id = iv.staff_id
       AND vth.visit_type = 'follow_up'
       AND vth.visit_date > iv.visit_date
       AND vth.visit_date <= iv.visit_date + 30
    GROUP BY iv.patient_id, iv.staff_id, iv.visit_date
)
SELECT 
    COUNT(*) as total_initial_visits,
    COUNT(CASE WHEN followup_count > 0 THEN 1 END) as had_followup,
    COUNT(CASE WHEN followup_count = 0 THEN 1 END) as no_followup,
    ROUND(100.0 * COUNT(CASE WHEN followup_count > 0 THEN 1 END) / COUNT(*), 2) as compliance_rate_pct
FROM followups;
```

---

## Migration Script

```sql
-- Run this to add visit type support to existing system

BEGIN;

-- 1. Add columns to appointments
ALTER TABLE appointments 
    ADD COLUMN visit_type VARCHAR(50),
    ADD COLUMN linked_encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL;

-- 2. Create new tables
-- (Copy CREATE TABLE statements from above)

-- 3. Create functions
-- (Copy function definitions from above)

-- 4. Create trigger
-- (Copy trigger definition from above)

-- 5. Create indexes
-- (Copy index creation statements from above)

-- 6. Enable RLS and create policies
-- (Copy RLS statements from above)

-- 7. Backfill existing data (optional)
UPDATE appointments SET
    visit_type = 'revisit'  -- default for existing
WHERE visit_type IS NULL;

-- 8. Create default pricing rules for all tenants
INSERT INTO visit_type_pricing_rules (
    tenant_id, visit_type, rule_name, priority,
    conditions, pricing_action, description
)
SELECT 
    t.id,
    'follow_up',
    'Free 14-day follow-up',
    100,
    '{"days_since_last_visit": {"lte": 14}}'::jsonb,
    'no_charge',
    'Default: Follow-up visits within 14 days are free'
FROM tenants t;

COMMIT;
```

---

## Summary of Benefits

### 1. Automatic Classification
- ✅ No manual selection needed at booking
- ✅ Consistent rules across all users
- ✅ Reduces booking errors

### 2. Flexible Pricing
- ✅ Tenant-specific policies
- ✅ Specialty-specific rules
- ✅ Time-bound discounts
- ✅ CPT code-specific pricing

### 3. Complete Audit Trail
- ✅ Every visit recorded in history
- ✅ Pricing decisions documented
- ✅ Manual overrides tracked
- ✅ Compliance reporting enabled

### 4. Revenue Protection
- ✅ Proper CPT codes for new vs established
- ✅ Controlled discounting with rules
- ✅ Prevent revenue leakage from mis-classification

### 5. Patient Satisfaction
- ✅ Transparent pricing
- ✅ Expected discounts applied automatically
- ✅ Consistent experience across visits

---

## Next Steps

1. **Implement in Application Layer**
   - Call `determine_visit_type()` at booking
   - Apply pricing rules at billing
   - Display visit type on appointment cards

2. **Configure Pricing Rules**
   - Set up tenant-specific policies
   - Define specialty-specific rules
   - Test with various scenarios

3. **Train Staff**
   - Explain new visit types
   - Show how to override classifications
   - Communicate pricing policies to patients

4. **Monitor & Optimize**
   - Review visit type distribution reports
   - Analyze pricing rule effectiveness
   - Adjust rules based on patient feedback

---

This completes the data model changes for visit type support!
