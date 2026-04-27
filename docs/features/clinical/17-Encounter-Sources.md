# Encounter Sources: Appointment-Based vs Walk-In

## Overview

The athma-ce platform supports multiple encounter sources to handle different patient visit scenarios:

- **Appointment-based encounters**: Scheduled visits with pre-booked appointments
- **Walk-in encounters**: Unscheduled visits where patients arrive without appointments
- **Emergency encounters**: Urgent unscheduled visits requiring immediate attention
- **Telemedicine encounters**: Remote consultations (can be scheduled or walk-in)

## Data Model Design

### Core Table Structure

The `encounters` table uses the following design pattern:

```sql
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    encounter_source VARCHAR(20) NOT NULL DEFAULT 'appointment',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    encounter_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'in_progress',
    chief_complaint TEXT,
    assessment TEXT,
    plan TEXT,
    vital_signs JSONB DEFAULT '{}',
    walk_in_details JSONB DEFAULT '{}',
    -- ... other fields
    CONSTRAINT check_encounter_source CHECK (encounter_source IN ('appointment', 'walk_in', 'emergency', 'telemedicine')),
    CONSTRAINT check_appointment_or_walkin CHECK (
        (encounter_source = 'appointment' AND appointment_id IS NOT NULL) OR
        (encounter_source IN ('walk_in', 'emergency', 'telemedicine') AND appointment_id IS NULL)
    )
);
```

### Key Design Principles

1. **Single Table Approach**: All encounters use the same table regardless of source
2. **Nullable Appointment Reference**: `appointment_id` is NULL for walk-ins
3. **Source Classification**: `encounter_source` field distinguishes encounter types
4. **Data Integrity**: Constraints ensure logical consistency
5. **Flexible Metadata**: `walk_in_details` JSONB stores source-specific information

## Encounter Source Types

### 1. Appointment-Based Encounters (`encounter_source = 'appointment'`)

**Characteristics:**
- Must have a valid `appointment_id`
- Pre-scheduled with specific time slots
- Patient and staff availability confirmed in advance
- Resource allocation planned (room, equipment)

**Workflow:**
1. Patient books appointment through portal/phone
2. Appointment created in `appointments` table
3. Encounter created with `appointment_id` reference
4. Visit type classification applies (NEW/REVISIT/FOLLOW_UP)

**Example:**
```sql
-- Create appointment-based encounter
INSERT INTO encounters (
    appointment_id,
    patient_id,
    primary_staff_id,
    encounter_source,
    start_time,
    encounter_type,
    chief_complaint
) VALUES (
    'appointment-uuid-123',
    'patient-uuid-456',
    'staff-uuid-789',
    'appointment',
    '2024-01-15 10:00:00+04',
    'consultation',
    'Annual checkup'
);
```

### 2. Walk-In Encounters (`encounter_source = 'walk_in'`)

**Characteristics:**
- No `appointment_id` (NULL)
- Unscheduled arrival
- May require immediate resource allocation
- Different billing/pricing considerations

**Workflow:**
1. Patient arrives without appointment
2. Reception registers walk-in
3. Encounter created with `encounter_source = 'walk_in'`
4. `walk_in_details` populated with arrival information
5. Staff availability checked in real-time

**Example:**
```sql
-- Create walk-in encounter
INSERT INTO encounters (
    patient_id,
    primary_staff_id,
    encounter_source,
    start_time,
    encounter_type,
    chief_complaint,
    walk_in_details
) VALUES (
    'patient-uuid-456',
    'staff-uuid-789',
    'walk_in',
    '2024-01-15 14:30:00+04',
    'consultation',
    'Chest pain',
    '{
        "arrival_time": "2024-01-15T14:15:00+04:00",
        "wait_time_minutes": 15,
        "urgency_level": "high",
        "reason_for_walkin": "Sudden onset of symptoms",
        "insurance_verified": true,
        "estimated_duration_minutes": 30
    }'::jsonb
);
```

### 3. Emergency Encounters (`encounter_source = 'emergency'`)

**Characteristics:**
- Highest priority walk-in encounters
- May bypass normal scheduling
- Requires immediate attention
- Different documentation requirements

**Example:**
```sql
-- Create emergency encounter
INSERT INTO encounters (
    patient_id,
    primary_staff_id,
    encounter_source,
    start_time,
    encounter_type,
    chief_complaint,
    walk_in_details
) VALUES (
    'patient-uuid-456',
    'staff-uuid-789',
    'emergency',
    '2024-01-15 16:45:00+04',
    'emergency_consultation',
    'Severe chest pain with shortness of breath',
    '{
        "arrival_time": "2024-01-15T16:40:00+04:00",
        "wait_time_minutes": 5,
        "urgency_level": "urgent",
        "reason_for_walkin": "Emergency situation",
        "insurance_verified": false,
        "estimated_duration_minutes": 60
    }'::jsonb
);
```

### 4. Telemedicine Encounters (`encounter_source = 'telemedicine'`)

**Characteristics:**
- Can be scheduled or walk-in
- Remote consultation via video/phone
- Different resource requirements
- May have different billing codes

**Example:**
```sql
-- Create telemedicine encounter (walk-in)
INSERT INTO encounters (
    patient_id,
    primary_staff_id,
    encounter_source,
    start_time,
    encounter_type,
    chief_complaint,
    walk_in_details
) VALUES (
    'patient-uuid-456',
    'staff-uuid-789',
    'telemedicine',
    '2024-01-15 20:00:00+04',
    'teleconsultation',
    'Follow-up on medication',
    '{
        "arrival_time": "2024-01-15T20:00:00+04:00",
        "wait_time_minutes": 0,
        "urgency_level": "low",
        "reason_for_walkin": "Patient requested evening consultation",
        "insurance_verified": true,
        "estimated_duration_minutes": 20
    }'::jsonb
);
```

## Walk-In Details Schema

The `walk_in_details` JSONB field stores encounter-source-specific information:

```json
{
  "arrival_time": "2024-01-15T14:15:00+04:00",
  "wait_time_minutes": 15,
  "urgency_level": "high",
  "referred_by": "Dr. Smith",
  "reason_for_walkin": "Sudden onset of symptoms",
  "previous_appointment_cancelled": false,
  "cancelled_appointment_id": null,
  "insurance_verified": true,
  "estimated_duration_minutes": 30,
  "notes": "Patient appeared distressed"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `arrival_time` | string (ISO 8601) | When patient arrived |
| `wait_time_minutes` | integer | Time waited before being seen |
| `urgency_level` | enum | low, medium, high, urgent |
| `referred_by` | string | Who referred the patient |
| `reason_for_walkin` | string | Why walk-in vs appointment |
| `previous_appointment_cancelled` | boolean | Had cancelled appointment |
| `cancelled_appointment_id` | UUID | ID of cancelled appointment |
| `insurance_verified` | boolean | Insurance status at arrival |
| `estimated_duration_minutes` | integer | Expected encounter length |
| `notes` | string | Additional notes |

## Business Logic Considerations

### 1. Visit Type Classification

Walk-in encounters may have different visit type classification rules:

```sql
-- Walk-in encounters are typically NEW visits
-- unless they're explicitly linked to previous encounters
UPDATE encounters 
SET visit_type = 'new_visit'
WHERE encounter_source IN ('walk_in', 'emergency')
  AND visit_type IS NULL;
```

### 2. Billing Implications

Different encounter sources may have different billing rules:

```sql
-- Walk-in encounters might have different pricing
SELECT 
    encounter_source,
    COUNT(*) as encounter_count,
    AVG(superbill_items.amount) as avg_amount
FROM encounters e
JOIN superbills s ON s.encounter_id = e.id
JOIN superbill_items si ON si.superbill_id = s.id
GROUP BY encounter_source;
```

### 3. Resource Allocation

Walk-in encounters require real-time resource management:

```sql
-- Check available staff for walk-in
SELECT s.id, s.first_name, s.last_name
FROM staff s
WHERE s.id NOT IN (
    SELECT DISTINCT primary_staff_id 
    FROM encounters 
    WHERE start_time <= NOW() 
      AND end_time >= NOW()
      AND status = 'in_progress'
)
AND s.status = 'active';
```

### 4. Reporting and Analytics

Track encounter patterns by source:

```sql
-- Daily encounter breakdown by source
SELECT 
    DATE(start_time) as encounter_date,
    encounter_source,
    COUNT(*) as encounter_count,
    AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60) as avg_duration_minutes
FROM encounters
WHERE start_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(start_time), encounter_source
ORDER BY encounter_date DESC, encounter_source;
```

## Integration Points

### 1. Scheduling System

- **Appointment-based**: Pre-allocated resources
- **Walk-in**: Real-time availability checking
- **Emergency**: Priority resource allocation

### 2. Billing System

- **Appointment-based**: Standard pricing rules
- **Walk-in**: May have walk-in surcharges
- **Emergency**: Emergency billing codes
- **Telemedicine**: Remote consultation codes

### 3. Clinical Workflow

- **Appointment-based**: Pre-populated patient data
- **Walk-in**: Real-time patient registration
- **Emergency**: Expedited workflow
- **Telemedicine**: Remote examination tools

### 4. Reporting

- **Operational**: Wait times, resource utilization
- **Clinical**: Encounter patterns, outcomes
- **Financial**: Revenue by encounter source

## Best Practices

### 1. Data Integrity

- Always validate encounter source constraints
- Ensure appointment_id is NULL for walk-ins
- Populate walk_in_details for non-appointment encounters

### 2. Performance

- Use appropriate indexes for encounter source queries
- Consider partitioning by encounter_source for large datasets
- Optimize queries for real-time walk-in processing

### 3. User Experience

- Clear UI indicators for encounter source
- Different workflows for different sources
- Appropriate default values based on source

### 4. Compliance

- Maintain audit trails for all encounter sources
- Ensure proper documentation for emergency encounters
- Follow regulatory requirements for telemedicine

## Migration Considerations

When migrating from existing systems:

1. **Identify encounter sources** in legacy data
2. **Map appointment relationships** correctly
3. **Populate walk_in_details** for historical walk-ins
4. **Update application logic** to handle new constraints
5. **Train staff** on new encounter source workflows

This design provides a flexible, scalable approach to handling multiple encounter sources while maintaining data integrity and supporting various business requirements.
