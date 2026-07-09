# Multi-Resource Scheduling

## Overview

The athma-ce platform now includes comprehensive multi-resource scheduling capabilities to support complex healthcare scenarios across clinics, hospitals, diagnostic centers, and surgery centers. This document details the enhancements made to support concurrent resource scheduling, conflict detection, and resolution.

## Enhanced Data Model

### New Tables

#### 1. **Equipment**
Tracks all medical equipment and devices that can be scheduled:
- MRI scanners, CT scanners, ultrasound machines
- Surgical tables, anesthesia machines
- Ventilators, monitors, specialized medical devices
- Lab equipment, imaging devices

```sql
CREATE TABLE equipment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    facility_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    specifications JSONB DEFAULT '{}',
    maintenance_schedule JSONB DEFAULT '{}'
);
```

#### 2. **Staff Schedules**
Manages staff availability and working hours:
- Day-of-week based schedules
- Effective date ranges for schedule changes
- Availability flags for planned time off
- Notes for special conditions
- In the scheduling UI, new staff schedule forms default the facility scope from the active session facility context (`x-facility-id`) and display the resolved facility name

```sql
CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    staff_id UUID NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE
);
```

#### 3. **Equipment Schedules**
Tracks equipment availability and maintenance windows:
- Regular availability schedules
- Planned maintenance downtime
- Emergency repair periods
- Calibration windows

```sql
CREATE TABLE equipment_schedules (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    equipment_id UUID NOT NULL,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    maintenance_type VARCHAR(50)
);
```

#### 4. **Appointment Resources**
Links multiple resources to a single appointment:
- Supports concurrent resource usage
- Tracks resource roles (surgeon, anesthesiologist, technician)
- Per-resource timing (start/end times)
- Confirmation status

```sql
CREATE TABLE appointment_resources (
    id UUID PRIMARY KEY,
    appointment_id UUID NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- staff, equipment, space
    resource_id UUID NOT NULL,
    resource_role VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_confirmed BOOLEAN DEFAULT false
);
```

#### 5. **Appointment Resource Requirements**
Template-based resource requirements by appointment type:
- Defines standard resource needs
- Min/max duration constraints
- Preparation and cleanup times
- Required vs. optional resources

```sql
CREATE TABLE appointment_resource_requirements (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    appointment_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_role VARCHAR(100),
    is_required BOOLEAN DEFAULT true,
    min_duration_minutes INTEGER DEFAULT 30,
    preparation_time_minutes INTEGER DEFAULT 0,
    cleanup_time_minutes INTEGER DEFAULT 0
);
```

#### 6. **Resource Conflicts**
Detects and tracks scheduling conflicts:
- Double-booking detection
- Maintenance overlap identification
- Staff unavailability tracking
- Severity levels and resolution workflow

```sql
CREATE TABLE resource_conflicts (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    conflict_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    conflicting_appointment_id UUID,
    conflict_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    conflict_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending'
);
```

### Enhanced Existing Tables

#### Appointments Table
- Changed `staff_id` → `primary_staff_id` (main provider)
- Changed `space_id` → `primary_space_id` (primary location)
- Added `preparation_time_minutes` for setup time
- Added `cleanup_time_minutes` for cleanup time

#### Encounters, Orders, Superbills
- Updated to use `primary_staff_id` for consistency
- Supports multi-staff scenarios through appointment_resources

## Use Cases

### 1. **Simple Clinic Consultation**
**Resources Required:**
- 1 × Physician (primary staff)
- 1 × Consultation Room (primary space)

**Implementation:**
```sql
-- Create appointment
INSERT INTO appointments (patient_id, primary_staff_id, primary_space_id, duration_minutes)
VALUES (patient_uuid, physician_uuid, room_uuid, 30);
```

### 2. **Surgical Procedure**
**Resources Required:**
- 1 × Surgeon (primary staff)
- 1 × Anesthesiologist
- 2 × Surgical Nurses
- 1 × Operating Room (primary space)
- 1 × Surgical Table
- 1 × Anesthesia Machine

**Implementation:**
```sql
-- Create appointment
INSERT INTO appointments (patient_id, primary_staff_id, primary_space_id, 
    duration_minutes, preparation_time_minutes, cleanup_time_minutes)
VALUES (patient_uuid, surgeon_uuid, or_suite_uuid, 180, 30, 45);

-- Add surgical team
INSERT INTO appointment_resources (appointment_id, resource_type, resource_id, resource_role)
VALUES 
    (appt_uuid, 'staff', anesthesiologist_uuid, 'anesthesiologist'),
    (appt_uuid, 'staff', nurse1_uuid, 'scrub_nurse'),
    (appt_uuid, 'staff', nurse2_uuid, 'circulating_nurse'),
    (appt_uuid, 'equipment', surgical_table_uuid, 'surgical_table'),
    (appt_uuid, 'equipment', anesthesia_machine_uuid, 'anesthesia');
```

### 3. **MRI Scan**
**Resources Required:**
- 1 × MRI Technician (primary staff)
- 1 × Radiologist (for interpretation)
- 1 × MRI Scanner (equipment)
- 1 × MRI Suite (primary space)

**Implementation:**
```sql
-- Create appointment
INSERT INTO appointments (patient_id, primary_staff_id, primary_space_id,
    duration_minutes, preparation_time_minutes, cleanup_time_minutes)
VALUES (patient_uuid, technician_uuid, mri_suite_uuid, 60, 10, 10);

-- Add additional resources
INSERT INTO appointment_resources (appointment_id, resource_type, resource_id, resource_role)
VALUES 
    (appt_uuid, 'staff', radiologist_uuid, 'radiologist'),
    (appt_uuid, 'equipment', mri_scanner_uuid, 'mri_scanner');
```

### 4. **Hospital Bed Assignment**
**Resources Required:**
- 1 × Attending Physician (primary staff)
- 1 × ICU Bed (primary space)
- 1 × Ventilator (if needed)
- Nursing Staff (continuous coverage)

**Implementation:**
```sql
-- Create admission appointment (multi-day)
INSERT INTO appointments (patient_id, primary_staff_id, primary_space_id,
    duration_minutes, appointment_type)
VALUES (patient_uuid, physician_uuid, icu_bed_uuid, 2880, 'INPATIENT_ADMISSION'); -- 2 days

-- Add critical equipment
INSERT INTO appointment_resources (appointment_id, resource_type, resource_id, resource_role)
VALUES 
    (appt_uuid, 'equipment', ventilator_uuid, 'ventilator'),
    (appt_uuid, 'staff', nurse_uuid, 'icu_nurse');
```

## Resource Scheduling Algorithms

### Availability Checking

```sql
-- Check staff availability for a specific time slot
SELECT s.id, s.first_name, s.last_name
FROM staff s
JOIN staff_schedules ss ON ss.staff_id = s.id
WHERE s.status = 'active'
  AND ss.day_of_week = EXTRACT(DOW FROM :requested_date)
  AND ss.start_time <= :requested_time
  AND ss.end_time >= (:requested_time + :duration_minutes * INTERVAL '1 minute')
  AND ss.is_available = true
  AND NOT EXISTS (
    SELECT 1 FROM appointment_resources ar
    JOIN appointments a ON a.id = ar.appointment_id
    WHERE ar.resource_type = 'staff'
      AND ar.resource_id = s.id
      AND ar.start_time < (:requested_datetime + :duration_minutes * INTERVAL '1 minute')
      AND ar.end_time > :requested_datetime
  );
```

### Conflict Detection

```sql
-- Detect resource conflicts
WITH potential_conflicts AS (
  SELECT ar.resource_type, ar.resource_id, ar.start_time, ar.end_time, a.id as appointment_id
  FROM appointment_resources ar
  JOIN appointments a ON a.id = ar.appointment_id
  WHERE ar.start_time < :new_end_time
    AND ar.end_time > :new_start_time
    AND ar.resource_type = :resource_type
    AND ar.resource_id = :resource_id
)
INSERT INTO resource_conflicts (
  tenant_id, conflict_type, resource_type, resource_id,
  conflicting_appointment_id, conflict_start_time, conflict_end_time, severity
)
SELECT 
  :tenant_id,
  'double_booking',
  resource_type,
  resource_id,
  appointment_id,
  GREATEST(start_time, :new_start_time),
  LEAST(end_time, :new_end_time),
  'high'
FROM potential_conflicts;
```

### Resource Optimization

```sql
-- Find optimal time slot with all required resources available
WITH required_resources AS (
  SELECT resource_type, resource_role, is_required
  FROM appointment_resource_requirements
  WHERE appointment_type = :appointment_type
),
available_slots AS (
  SELECT DISTINCT time_slot
  FROM generate_series(:start_date, :end_date, INTERVAL '30 minutes') AS time_slot
  WHERE time_slot::time >= '08:00' AND time_slot::time <= '18:00'
)
SELECT as_time_slot
FROM available_slots
WHERE NOT EXISTS (
  SELECT 1 FROM required_resources rr
  WHERE NOT EXISTS (
    SELECT 1 FROM staff s
    WHERE s.staff_type = rr.resource_role
      AND is_staff_available(s.id, as_time_slot, :duration)
  )
);
```

## Conflict Resolution Workflow

### 1. **Detection**
- Automatic detection on appointment creation/modification
- Scheduled batch checks for upcoming appointments
- Real-time validation during booking

### 2. **Classification**
- **Critical**: Double-booking of critical resources (OR, ICU bed)
- **High**: Staff unavailability, equipment maintenance overlap
- **Medium**: Optional resource conflicts
- **Low**: Preference mismatches

### 3. **Resolution Options**
- **Reschedule**: Move appointment to available slot
- **Resource Substitution**: Use alternative staff/equipment
- **Override**: Manual approval by administrator
- **Cancel**: Cancel conflicting appointment

### 4. **Notification**
- Alert scheduling staff of conflicts
- Notify affected patients and staff
- Escalate unresolved conflicts
- Audit trail of all resolution actions

## Performance Considerations

### Indexes
- Composite indexes on resource availability queries
- Time-based indexes for conflict detection
- Resource-type indexes for multi-resource queries

```sql
CREATE INDEX idx_appointment_resources_time 
  ON appointment_resources(start_time, end_time);
CREATE INDEX idx_appointment_resources_resource 
  ON appointment_resources(resource_type, resource_id);
CREATE INDEX idx_staff_schedules_time 
  ON staff_schedules(day_of_week, start_time, end_time);
```

### Caching Strategy
- Cache staff schedules (updated weekly)
- Cache equipment maintenance windows (updated daily)
- Cache appointment resource requirements (updated rarely)
- Invalidate on updates

### Query Optimization
- Use materialized views for complex availability queries
- Partition appointments by date for performance
- Use connection pooling for concurrent requests

## Integration Points

### 1. **Scheduling UI**
- Visual calendar with multi-resource view
- Drag-and-drop scheduling
- Real-time conflict indicators
- Resource availability heatmaps

### 2. **AI Optimization**
- Suggest optimal time slots based on all resource availability
- Predict no-show probability and suggest overbooking
- Recommend resource substitutions for conflicts
- Optimize OR scheduling for maximum utilization

### 3. **Mobile Apps**
- Staff view their schedules and availability
- Receive conflict notifications
- Confirm/decline appointment resource assignments
- Report equipment issues

### 4. **External Systems**
- Sync with PACS for imaging equipment
- Integrate with building management for room availability
- Connect to equipment maintenance systems
- Link to staff HR systems for leave management

## Reporting & Analytics

### Resource Utilization
- Staff utilization by day/week/month
- Equipment usage patterns
- Space occupancy rates
- Peak demand identification

### Scheduling Efficiency
- Average time to schedule by appointment type
- Conflict resolution time
- Patient wait times
- Resource idle time

### Financial Impact
- Revenue per resource hour
- Cost of unused capacity
- Overtime costs from scheduling conflicts
- Equipment ROI analysis

## Best Practices

### 1. **Template-Based Scheduling**
- Define resource requirements for common appointment types
- Standardize preparation and cleanup times
- Use templates to speed up scheduling

### 2. **Buffer Times**
- Include adequate preparation time
- Add cleanup time for infection control
- Build in buffer for delays

### 3. **Conflict Prevention**
- Check availability before offering time slots
- Validate resources during booking
- Send reminders to confirm resource availability

### 4. **Resource Pools**
- Create pools of equivalent resources (e.g., "any available OR nurse")
- Allow automatic assignment within pools
- Enable resource substitution rules

### 5. **Capacity Planning**
- Monitor utilization trends
- Forecast demand by season/day
- Plan equipment purchases based on utilization
- Optimize staff scheduling based on demand

## Conclusion

The multi-resource scheduling enhancements enable the athma-ce platform to support complex healthcare scenarios across all provider types. The flexible data model, comprehensive conflict detection, and optimization capabilities ensure efficient resource utilization while maintaining high-quality patient care.

The system scales from simple clinic consultations to complex surgical procedures, diagnostic imaging, and hospital admissions—all with the same underlying architecture and consistent user experience.
