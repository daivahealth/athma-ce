# Terminology Management & Concept-Based Visit Classification

## Overview

This document describes the terminology management system for athma-ce PMS+RCM, with a focus on concept-based visit classification (New, Revisit, Follow-up). This approach provides:

- **Standardized terminology** via code systems and value sets
- **Configurable business rules** for classification
- **AI-assisted suggestions** with human oversight
- **Audit trails** for compliance and quality
- **Flexible billing mappings** per payer/specialty

---

## Table of Contents

1. [Terminology Foundation](#1-terminology-foundation)
2. [Visit Category Concepts](#2-visit-category-concepts)
3. [Episodes of Care](#3-episodes-of-care)
4. [Encounter Links](#4-encounter-links)
5. [Classification Rules](#5-classification-rules)
6. [Billing Mappings](#6-billing-mappings)
7. [Follow-up Waiver Rules](#7-follow-up-waiver-rules)
8. [Classification Algorithm](#8-classification-algorithm)
9. [AI Integration](#9-ai-integration)
10. [Complete Implementation](#10-complete-implementation)

---

## 1. Terminology Foundation

### Code Systems & Concepts

**Purpose:** Replace hard-coded strings with standardized, versioned concepts.

```sql
-- Code systems (terminology registries)
CREATE TABLE code_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_uri VARCHAR(255) UNIQUE NOT NULL, -- e.g., 'athma-ce:visit-category'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active', -- active, retired
    publisher VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concepts (individual coded values)
CREATE TABLE concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_system_id UUID NOT NULL REFERENCES code_systems(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL, -- e.g., 'NEW', 'REVISIT'
    display_default VARCHAR(255) NOT NULL, -- 'New Visit'
    definition TEXT,
    sort_order INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (code_system_id, code)
);

-- Concept translations (for multi-language support)
CREATE TABLE concept_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- 'en', 'ar'
    display TEXT NOT NULL,
    definition TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (concept_id, language_code)
);

-- Value sets (curated collections of concepts)
CREATE TABLE value_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL, -- 'visit-category'
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active',
    immutable BOOLEAN DEFAULT FALSE, -- true = no runtime changes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Value set members (concepts included in each value set)
CREATE TABLE value_set_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value_set_id UUID NOT NULL REFERENCES value_sets(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    include BOOLEAN DEFAULT TRUE, -- true = include, false = exclude
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (value_set_id, concept_id)
);

-- Indexes
CREATE INDEX idx_code_systems_uri ON code_systems(system_uri);
CREATE INDEX idx_concepts_code_system ON concepts(code_system_id, code);
CREATE INDEX idx_concepts_active ON concepts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_value_set_members_vs ON value_set_members(value_set_id);
CREATE INDEX idx_value_set_members_concept ON value_set_members(concept_id);
```

---

## 2. Visit Category Concepts

### Setup Visit Category Value Set

```sql
-- 1. Create code system
INSERT INTO code_systems (system_uri, name, description, publisher)
VALUES (
    'athma-ce:visit-category',
    'athma-ce Visit Category',
    'Classification of visits as new, revisit, or follow-up',
    'athma-ce Healthcare Technologies'
);

-- 2. Create concepts
WITH cs AS (
    SELECT id FROM code_systems WHERE system_uri = 'athma-ce:visit-category'
)
INSERT INTO concepts (code_system_id, code, display_default, definition, sort_order)
VALUES
    ((SELECT id FROM cs), 'NEW', 'New Visit', 
     'First visit with provider or > 3 years since last visit', 10),
    ((SELECT id FROM cs), 'REVISIT', 'Revisit', 
     'Return visit for new or different complaint', 20),
    ((SELECT id FROM cs), 'FOLLOW_UP', 'Follow-up', 
     'Planned return for ongoing treatment or monitoring', 30),
    ((SELECT id FROM cs), 'POST_OP', 'Post-Operative Follow-up', 
     'Follow-up within global surgical period', 40),
    ((SELECT id FROM cs), 'EMERGENCY', 'Emergency Visit', 
     'Urgent unscheduled visit', 50);

-- 3. Create value set
INSERT INTO value_sets (name, description)
VALUES (
    'visit-category',
    'Visit classification categories for appointment and encounter context'
);

-- 4. Add concepts to value set
INSERT INTO value_set_members (value_set_id, concept_id)
SELECT 
    vs.id, 
    c.id
FROM value_sets vs
CROSS JOIN concepts c
JOIN code_systems cs ON cs.id = c.code_system_id
WHERE vs.name = 'visit-category'
  AND cs.system_uri = 'athma-ce:visit-category';

-- 5. Add Arabic translations
WITH visit_concepts AS (
    SELECT c.id, c.code
    FROM concepts c
    JOIN code_systems cs ON cs.id = c.code_system_id
    WHERE cs.system_uri = 'athma-ce:visit-category'
)
INSERT INTO concept_translations (concept_id, language_code, display)
VALUES
    ((SELECT id FROM visit_concepts WHERE code = 'NEW'), 'ar', 'زيارة جديدة'),
    ((SELECT id FROM visit_concepts WHERE code = 'REVISIT'), 'ar', 'زيارة متكررة'),
    ((SELECT id FROM visit_concepts WHERE code = 'FOLLOW_UP'), 'ar', 'زيارة متابعة'),
    ((SELECT id FROM visit_concepts WHERE code = 'POST_OP'), 'ar', 'متابعة ما بعد الجراحة'),
    ((SELECT id FROM visit_concepts WHERE code = 'EMERGENCY'), 'ar', 'زيارة طوارئ');
```

### Extend Appointments & Encounters

```sql
-- Add concept reference to appointments
ALTER TABLE appointments 
    ADD COLUMN visit_category_concept_id UUID REFERENCES concepts(id) ON DELETE RESTRICT,
    ADD COLUMN visit_category_source VARCHAR(20) CHECK (visit_category_source IN ('ai', 'rule', 'manual')),
    ADD COLUMN visit_category_confidence NUMERIC(5,2), -- 0.00 to 100.00
    ADD COLUMN visit_category_reason TEXT;

-- Add concept reference to encounters
ALTER TABLE encounters
    ADD COLUMN visit_category_concept_id UUID REFERENCES concepts(id) ON DELETE RESTRICT,
    ADD COLUMN visit_category_source VARCHAR(20) CHECK (visit_category_source IN ('ai', 'rule', 'manual')),
    ADD COLUMN visit_category_reason TEXT;

-- Indexes
CREATE INDEX idx_appointments_visit_category_concept ON appointments(visit_category_concept_id);
CREATE INDEX idx_encounters_visit_category_concept ON encounters(visit_category_concept_id);
CREATE INDEX idx_appointments_visit_category_source ON appointments(visit_category_source);

-- Validation trigger to enforce value set membership
CREATE OR REPLACE FUNCTION enforce_vs_visit_category()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.visit_category_concept_id IS NULL THEN
        RETURN NEW; -- allow NULL during migration / AI suggestion phase
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM value_sets vs
        JOIN value_set_members vsm ON vsm.value_set_id = vs.id
        WHERE vs.name = 'visit-category'
          AND vsm.concept_id = NEW.visit_category_concept_id
          AND vsm.include = TRUE
    ) THEN
        RAISE EXCEPTION 'visit_category_concept_id must belong to value set visit-category';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_appt_visit_category_vs ON appointments;
CREATE TRIGGER trg_appt_visit_category_vs
    BEFORE INSERT OR UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION enforce_vs_visit_category();

DROP TRIGGER IF EXISTS trg_enc_visit_category_vs ON encounters;
CREATE TRIGGER trg_enc_visit_category_vs
    BEFORE INSERT OR UPDATE ON encounters
    FOR EACH ROW
    EXECUTE FUNCTION enforce_vs_visit_category();
```

---

## 3. Episodes of Care

**Purpose:** Group related encounters into clinical episodes for continuity tracking.

```sql
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    specialty VARCHAR(100),
    diagnosis_snapshot JSONB DEFAULT '{}', -- primary diagnoses at episode start
    started_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'active', -- active, closed, cancelled
    closure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link encounters to episodes
ALTER TABLE encounters 
    ADD COLUMN episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX idx_episodes_tenant ON episodes(tenant_id, status);
CREATE INDEX idx_episodes_patient ON episodes(patient_id, status);
CREATE INDEX idx_episodes_staff ON episodes(primary_staff_id);
CREATE INDEX idx_encounters_episode ON encounters(episode_id) WHERE episode_id IS NOT NULL;

-- RLS
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_episodes ON episodes
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## 4. Encounter Links

**Purpose:** Explicit relationships between encounters (follow-up chains, referrals, related visits).

```sql
CREATE TABLE encounter_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    from_encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    to_encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    relationship_type VARCHAR(40) NOT NULL, -- follow_up_of, referred_from, related_to, continued_from
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (from_encounter_id, to_encounter_id, relationship_type)
);

-- Indexes
CREATE INDEX idx_encounter_links_from ON encounter_links(from_encounter_id, relationship_type);
CREATE INDEX idx_encounter_links_to ON encounter_links(to_encounter_id, relationship_type);
CREATE INDEX idx_encounter_links_tenant ON encounter_links(tenant_id);

-- RLS
ALTER TABLE encounter_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_encounter_links ON encounter_links
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Prevent circular references
CREATE OR REPLACE FUNCTION prevent_circular_encounter_links()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.from_encounter_id = NEW.to_encounter_id THEN
        RAISE EXCEPTION 'Cannot link encounter to itself';
    END IF;
    
    -- Prevent cycles (simple check - could be more sophisticated)
    IF EXISTS (
        SELECT 1 FROM encounter_links
        WHERE from_encounter_id = NEW.to_encounter_id
          AND to_encounter_id = NEW.from_encounter_id
    ) THEN
        RAISE EXCEPTION 'Circular encounter link detected';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_circular_encounter_links
    BEFORE INSERT OR UPDATE ON encounter_links
    FOR EACH ROW
    EXECUTE FUNCTION prevent_circular_encounter_links();
```

---

## 5. Classification Rules

**Purpose:** Configurable, tenant-specific rules for auto-classifying visits.

```sql
CREATE TABLE visit_classification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES payers(id) ON DELETE CASCADE, -- NULL = default across payers
    specialty VARCHAR(100), -- NULL = any specialty
    scope VARCHAR(30) NOT NULL DEFAULT 'provider', -- provider, specialty, facility
    new_lookback_days INTEGER NOT NULL DEFAULT 1095, -- 3 years (CPT definition)
    followup_window_days INTEGER NOT NULL DEFAULT 30,
    must_link_for_followup BOOLEAN DEFAULT TRUE, -- require explicit encounter_links
    apply_same_staff BOOLEAN DEFAULT TRUE,
    apply_same_specialty BOOLEAN DEFAULT FALSE,
    apply_same_facility BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 100, -- higher = more specific
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_visit_class_rules_tenant ON visit_classification_rules(tenant_id, is_active, priority DESC);
CREATE INDEX idx_visit_class_rules_payer ON visit_classification_rules(payer_id) WHERE payer_id IS NOT NULL;
CREATE INDEX idx_visit_class_rules_specialty ON visit_classification_rules(specialty) WHERE specialty IS NOT NULL;

-- RLS
ALTER TABLE visit_classification_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_visit_class_rules ON visit_classification_rules
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Default rules per tenant
CREATE OR REPLACE FUNCTION create_default_visit_classification_rules(p_tenant_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Default rule: same provider scope
    INSERT INTO visit_classification_rules (
        tenant_id, scope, new_lookback_days, followup_window_days,
        must_link_for_followup, apply_same_staff, priority, notes
    ) VALUES (
        p_tenant_id, 'provider', 1095, 30,
        TRUE, TRUE, 100,
        'Default: Provider-level classification with 3-year lookback and 30-day follow-up window'
    );
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Billing Mappings

**Purpose:** Map visit categories to billable codes per payer/specialty context.

```sql
CREATE TABLE visit_billing_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES payers(id) ON DELETE CASCADE, -- NULL = default
    in_network BOOLEAN DEFAULT TRUE,
    specialty VARCHAR(100), -- NULL = any
    place_of_service VARCHAR(20), -- clinic, telehealth, home, etc.
    visit_category_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE RESTRICT,
    min_duration_minutes INTEGER, -- for time-based level selection
    max_duration_minutes INTEGER,
    code_type VARCHAR(20) NOT NULL DEFAULT 'CPT',
    code VARCHAR(50) NOT NULL,
    description TEXT,
    requires_preauth BOOLEAN DEFAULT FALSE,
    copay_policy VARCHAR(50) DEFAULT 'standard', -- standard, waive_followup, reduced_followup
    expected_allowed DECIMAL(10,2),
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint (complex)
CREATE UNIQUE INDEX idx_visit_billing_map_unique ON visit_billing_map(
    tenant_id,
    COALESCE(payer_id, '00000000-0000-0000-0000-000000000000'::UUID),
    COALESCE(specialty, '*'),
    COALESCE(place_of_service, '*'),
    visit_category_concept_id,
    COALESCE(min_duration_minutes, -1),
    COALESCE(max_duration_minutes, -1)
) WHERE is_active = TRUE;

-- Indexes
CREATE INDEX idx_visit_billing_map_tenant ON visit_billing_map(tenant_id, is_active);
CREATE INDEX idx_visit_billing_map_payer ON visit_billing_map(payer_id) WHERE payer_id IS NOT NULL;
CREATE INDEX idx_visit_billing_map_concept ON visit_billing_map(visit_category_concept_id);

-- RLS
ALTER TABLE visit_billing_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_visit_billing_map ON visit_billing_map
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### Example Billing Mappings

```sql
-- Get NEW concept ID
WITH new_concept AS (
    SELECT c.id
    FROM concepts c
    JOIN code_systems cs ON cs.id = c.code_system_id
    WHERE cs.system_uri = 'athma-ce:visit-category'
      AND c.code = 'NEW'
)
-- Map NEW visits to new patient CPT codes
INSERT INTO visit_billing_map (
    tenant_id, visit_category_concept_id, place_of_service,
    min_duration_minutes, max_duration_minutes,
    code_type, code, description, expected_allowed
)
SELECT
    :tenant_id, nc.id, 'clinic',
    NULL, 15, 'CPT', '99201', 'Office Visit - New Patient - Problem Focused', 250.00
FROM new_concept nc
UNION ALL
SELECT
    :tenant_id, nc.id, 'clinic',
    16, 30, 'CPT', '99202', 'Office Visit - New Patient - Expanded', 350.00
FROM new_concept nc
UNION ALL
SELECT
    :tenant_id, nc.id, 'clinic',
    31, 45, 'CPT', '99203', 'Office Visit - New Patient - Detailed', 450.00
FROM new_concept nc;

-- Map FOLLOW_UP to established patient codes
WITH followup_concept AS (
    SELECT c.id
    FROM concepts c
    JOIN code_systems cs ON cs.id = c.code_system_id
    WHERE cs.system_uri = 'athma-ce:visit-category'
      AND c.code = 'FOLLOW_UP'
)
INSERT INTO visit_billing_map (
    tenant_id, visit_category_concept_id, place_of_service,
    code_type, code, description, copay_policy, expected_allowed
) VALUES (
    :tenant_id, (SELECT id FROM followup_concept), 'clinic',
    'CPT', '99024', 'Postoperative Follow-up Visit', 'waive_followup', 0.00
);
```

---

## 7. Follow-up Waiver Rules

**Purpose:** Fine-grained copay/fee waivers for follow-ups.

```sql
CREATE TABLE followup_waiver_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES payers(id) ON DELETE CASCADE, -- NULL = default
    specialty VARCHAR(100), -- NULL = any
    within_days INTEGER NOT NULL DEFAULT 14,
    waive_copay BOOLEAN DEFAULT TRUE,
    waive_professional_fee_pct NUMERIC(5,2), -- 0.00 to 100.00
    apply_when_same_diagnosis BOOLEAN DEFAULT TRUE,
    apply_when_same_procedure BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_followup_waiver_rules_tenant ON followup_waiver_rules(tenant_id, is_active, priority DESC);
CREATE INDEX idx_followup_waiver_rules_payer ON followup_waiver_rules(payer_id) WHERE payer_id IS NOT NULL;

-- RLS
ALTER TABLE followup_waiver_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_followup_waiver_rules ON followup_waiver_rules
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### Example Waiver Rules

```sql
-- Free follow-up within 14 days (default)
INSERT INTO followup_waiver_rules (
    tenant_id, within_days, waive_copay, waive_professional_fee_pct,
    priority, notes
) VALUES (
    :tenant_id, 14, TRUE, 100.00,
    100, 'Default: Complete waiver for follow-ups within 14 days'
);

-- 50% fee reduction for follow-ups 15-30 days
INSERT INTO followup_waiver_rules (
    tenant_id, within_days, waive_copay, waive_professional_fee_pct,
    priority, notes
) VALUES (
    :tenant_id, 30, FALSE, 50.00,
    90, 'Partial waiver: 50% off for follow-ups 15-30 days'
);
```

---

## 8. Classification Algorithm

### SQL Function: Classify Visit

```sql
CREATE OR REPLACE FUNCTION classify_visit(
    p_tenant_id UUID,
    p_patient_id UUID,
    p_staff_id UUID,
    p_specialty VARCHAR(100),
    p_payer_id UUID,
    p_facility_id UUID,
    p_scheduled_at TIMESTAMPTZ,
    p_linked_encounter_id UUID DEFAULT NULL
) RETURNS TABLE(
    visit_category_concept_id UUID,
    visit_category_code VARCHAR(100),
    visit_category_display VARCHAR(255),
    source VARCHAR(20),
    reason TEXT,
    confidence NUMERIC(5,2),
    rule_id UUID,
    days_since_last INTEGER,
    last_encounter_id UUID
) AS $$
DECLARE
    v_rule RECORD;
    v_last_encounter RECORD;
    v_days_since INTEGER;
    v_result_concept_id UUID;
    v_result_code VARCHAR(100);
    v_result_display VARCHAR(255);
    v_result_source VARCHAR(20) := 'rule';
    v_result_reason TEXT;
    v_result_confidence NUMERIC(5,2) := 95.00;
BEGIN
    -- 1. Select best matching rule (most specific)
    SELECT * INTO v_rule
    FROM visit_classification_rules
    WHERE tenant_id = p_tenant_id
      AND is_active = TRUE
      AND (effective_from IS NULL OR effective_from <= CURRENT_DATE)
      AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
      AND (payer_id IS NULL OR payer_id = p_payer_id)
      AND (specialty IS NULL OR specialty = p_specialty)
    ORDER BY 
        CASE WHEN payer_id IS NOT NULL THEN 2 ELSE 0 END +
        CASE WHEN specialty IS NOT NULL THEN 1 ELSE 0 END DESC,
        priority DESC
    LIMIT 1;

    IF v_rule IS NULL THEN
        -- Fallback to default rule
        v_rule := ROW(
            NULL, p_tenant_id, NULL, NULL, 'provider', 1095, 30,
            TRUE, TRUE, FALSE, FALSE, 100, TRUE, NULL, NULL, 'Default rule', NOW(), NOW()
        )::visit_classification_rules;
    END IF;

    -- 2. Check if explicit follow-up link exists
    IF p_linked_encounter_id IS NOT NULL AND v_rule.must_link_for_followup THEN
        SELECT e.start_time, e.id INTO v_last_encounter
        FROM encounters e
        WHERE e.id = p_linked_encounter_id;

        IF v_last_encounter IS NOT NULL THEN
            v_days_since := EXTRACT(DAY FROM (p_scheduled_at - v_last_encounter.start_time));
            
            IF v_days_since <= v_rule.followup_window_days THEN
                -- It's a FOLLOW_UP
                SELECT c.id, c.code, c.display_default
                INTO v_result_concept_id, v_result_code, v_result_display
                FROM concepts c
                JOIN code_systems cs ON cs.id = c.code_system_id
                WHERE cs.system_uri = 'athma-ce:visit-category'
                  AND c.code = 'FOLLOW_UP';
                
                v_result_reason := format(
                    'Linked follow-up from encounter %s (%s days ago)',
                    p_linked_encounter_id, v_days_since
                );
                
                RETURN QUERY SELECT
                    v_result_concept_id, v_result_code, v_result_display,
                    v_result_source, v_result_reason, v_result_confidence,
                    v_rule.id, v_days_since, p_linked_encounter_id;
                RETURN;
            END IF;
        END IF;
    END IF;

    -- 3. Find last qualifying encounter based on rule scope
    IF v_rule.scope = 'provider' THEN
        SELECT e.start_time, e.id INTO v_last_encounter
        FROM encounters e
        WHERE e.patient_id = p_patient_id
          AND e.primary_staff_id = p_staff_id
          AND e.status = 'completed'
          AND (NOT v_rule.apply_same_facility OR 
               EXISTS (SELECT 1 FROM appointments a WHERE a.id = e.appointment_id AND a.primary_space_id IN 
                       (SELECT id FROM spaces WHERE facility_id = p_facility_id)))
        ORDER BY e.start_time DESC
        LIMIT 1;
        
    ELSIF v_rule.scope = 'specialty' THEN
        SELECT e.start_time, e.id INTO v_last_encounter
        FROM encounters e
        JOIN staff s ON s.id = e.primary_staff_id
        WHERE e.patient_id = p_patient_id
          AND s.specialty = p_specialty
          AND e.status = 'completed'
        ORDER BY e.start_time DESC
        LIMIT 1;
        
    ELSIF v_rule.scope = 'facility' THEN
        SELECT e.start_time, e.id INTO v_last_encounter
        FROM encounters e
        JOIN appointments a ON a.id = e.appointment_id
        JOIN spaces sp ON sp.id = a.primary_space_id
        WHERE e.patient_id = p_patient_id
          AND sp.facility_id = p_facility_id
          AND e.status = 'completed'
        ORDER BY e.start_time DESC
        LIMIT 1;
    END IF;

    -- 4. Calculate days since last encounter
    IF v_last_encounter IS NOT NULL THEN
        v_days_since := EXTRACT(DAY FROM (p_scheduled_at - v_last_encounter.start_time));
    END IF;

    -- 5. Apply classification logic
    IF v_last_encounter IS NULL OR v_days_since > v_rule.new_lookback_days THEN
        -- NEW VISIT
        SELECT c.id, c.code, c.display_default
        INTO v_result_concept_id, v_result_code, v_result_display
        FROM concepts c
        JOIN code_systems cs ON cs.id = c.code_system_id
        WHERE cs.system_uri = 'athma-ce:visit-category'
          AND c.code = 'NEW';
        
        v_result_reason := CASE
            WHEN v_last_encounter IS NULL THEN 'No prior encounter with this provider'
            ELSE format('Last encounter %s days ago (> %s day threshold)', v_days_since, v_rule.new_lookback_days)
        END;
        
    ELSIF v_days_since <= v_rule.followup_window_days THEN
        -- FOLLOW_UP (implicit, based on timing)
        SELECT c.id, c.code, c.display_default
        INTO v_result_concept_id, v_result_code, v_result_display
        FROM concepts c
        JOIN code_systems cs ON cs.id = c.code_system_id
        WHERE cs.system_uri = 'athma-ce:visit-category'
          AND c.code = 'FOLLOW_UP';
        
        v_result_reason := format(
            'Within %s-day follow-up window (last visit %s days ago)',
            v_rule.followup_window_days, v_days_since
        );
        v_result_confidence := 85.00; -- Lower confidence without explicit link
        
    ELSE
        -- REVISIT
        SELECT c.id, c.code, c.display_default
        INTO v_result_concept_id, v_result_code, v_result_display
        FROM concepts c
        JOIN code_systems cs ON cs.id = c.code_system_id
        WHERE cs.system_uri = 'athma-ce:visit-category'
          AND c.code = 'REVISIT';
        
        v_result_reason := format(
            'Established patient, last visit %s days ago', v_days_since
        );
    END IF;

    -- 6. Return result
    RETURN QUERY SELECT
        v_result_concept_id,
        v_result_code,
        v_result_display,
        v_result_source,
        v_result_reason,
        v_result_confidence,
        v_rule.id,
        v_days_since,
        v_last_encounter.id;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## 9. AI Integration

### AI Suggestion Table

```sql
CREATE TABLE visit_classification_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    suggested_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE RESTRICT,
    confidence NUMERIC(5,2), -- 0.00 to 100.00
    explanation TEXT,
    model_version VARCHAR(50),
    features_used JSONB DEFAULT '{}', -- input features for explainability
    accepted BOOLEAN,
    accepted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    accepted_at TIMESTAMPTZ,
    override_concept_id UUID REFERENCES concepts(id) ON DELETE RESTRICT,
    override_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_visit_class_suggestions_appt ON visit_classification_suggestions(appointment_id);
CREATE INDEX idx_visit_class_suggestions_patient ON visit_classification_suggestions(patient_id);
CREATE INDEX idx_visit_class_suggestions_accepted ON visit_classification_suggestions(accepted);

-- RLS
ALTER TABLE visit_classification_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_visit_class_suggestions ON visit_classification_suggestions
    FOR ALL TO application_role
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### AI Workflow

1. **AI Prediction**: Model analyzes patient history, appointment context, chief complaint
2. **Store Suggestion**: Save to `visit_classification_suggestions` with confidence and explanation
3. **User Review**: Display suggestion in booking UI with confidence indicator
4. **Accept/Override**: User can accept AI suggestion or manually override
5. **Feedback Loop**: Track acceptance rate by confidence level to improve model

```sql
-- Example: Record AI suggestion
INSERT INTO visit_classification_suggestions (
    tenant_id, appointment_id, patient_id,
    suggested_concept_id, confidence, explanation,
    model_version, features_used
) VALUES (
    :tenant_id, :appointment_id, :patient_id,
    :suggested_concept_id, 92.5,
    'Patient last seen 22 days ago with same provider for related condition (otitis media). High likelihood of follow-up.',
    'visit-classifier-v2.3',
    jsonb_build_object(
        'days_since_last_visit', 22,
        'same_provider', true,
        'same_specialty', true,
        'related_diagnosis', true,
        'chief_complaint_similarity', 0.87
    )
);
```

---

## 10. Complete Implementation

### Migration Script

```sql
BEGIN;

-- 1. Create terminology tables
-- (Execute all CREATE TABLE statements from sections 1-7)

-- 2. Create visit category code system and concepts
-- (Execute INSERT statements from section 2)

-- 3. Extend appointments and encounters
-- (Execute ALTER TABLE statements from section 2)

-- 4. Create default rules for existing tenants
INSERT INTO visit_classification_rules (
    tenant_id, scope, new_lookback_days, followup_window_days,
    must_link_for_followup, apply_same_staff, priority
)
SELECT 
    id, 'provider', 1095, 30,
    TRUE, TRUE, 100
FROM tenants
WHERE NOT EXISTS (
    SELECT 1 FROM visit_classification_rules WHERE tenant_id = tenants.id
);

-- 5. Create default waiver rules
INSERT INTO followup_waiver_rules (
    tenant_id, within_days, waive_copay, waive_professional_fee_pct
)
SELECT 
    id, 14, TRUE, 100.00
FROM tenants
WHERE NOT EXISTS (
    SELECT 1 FROM followup_waiver_rules WHERE tenant_id = tenants.id
);

COMMIT;
```

### Usage Example

```sql
-- At appointment booking
WITH classification AS (
    SELECT * FROM classify_visit(
        :tenant_id,
        :patient_id,
        :staff_id,
        'cardiology',
        :payer_id,
        :facility_id,
        '2025-10-15 09:00:00'::TIMESTAMPTZ,
        NULL -- no linked encounter yet
    )
)
INSERT INTO appointments (
    tenant_id, patient_id, primary_staff_id,
    scheduled_at, visit_category_concept_id,
    visit_category_source, visit_category_confidence,
    visit_category_reason
)
SELECT
    :tenant_id, :patient_id, :staff_id,
    '2025-10-15 09:00:00'::TIMESTAMPTZ,
    c.visit_category_concept_id,
    c.source,
    c.confidence,
    c.reason
FROM classification c;

-- Get visit category display (with translation)
SELECT 
    c.code,
    COALESCE(ct.display, c.display_default) as display
FROM appointments a
JOIN concepts c ON c.id = a.visit_category_concept_id
LEFT JOIN concept_translations ct ON ct.concept_id = c.id 
    AND ct.language_code = 'ar' -- or 'en'
WHERE a.id = :appointment_id;
```

---

This completes the concept-based visit classification system with terminology management!
