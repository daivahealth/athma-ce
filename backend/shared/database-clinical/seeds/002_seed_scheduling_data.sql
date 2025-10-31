-- Scheduling System Seed Data
-- This file contains sample data for testing the multi-resource scheduling system

-- Variables (replace with actual UUIDs from your system)
-- You may need to adjust these UUIDs to match your actual tenant, facility, staff, patient, and equipment IDs

-- For this seed, we'll use some example UUIDs
-- In production, you would replace these with actual UUIDs from your system

-- ============================================
-- STAFF SCHEDULES (Recurring Weekly Schedules)
-- ============================================

-- Dr. Sarah Johnson - General Physician (Full-time: Mon-Fri 9am-5pm)
INSERT INTO staff_schedules (
    id, tenant_id, staff_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 1, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 2, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 3, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 4, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 5, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- Dr. Michael Chen - Cardiologist (Part-time: Mon, Wed, Fri 10am-6pm)
INSERT INTO staff_schedules (
    id, tenant_id, staff_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 1, '10:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 3, '10:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 5, '10:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- Dr. Emily Rodriguez - Surgeon (Tue-Thu 8am-4pm, Fri 8am-12pm)
INSERT INTO staff_schedules (
    id, tenant_id, staff_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 2, '08:00:00', '16:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 3, '08:00:00', '16:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 4, '08:00:00', '16:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 5, '08:00:00', '12:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- Nurse Practitioner - Lisa Brown (Mon-Fri 7am-3pm)
INSERT INTO staff_schedules (
    id, tenant_id, staff_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 1, '07:00:00', '15:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 2, '07:00:00', '15:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 3, '07:00:00', '15:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 4, '07:00:00', '15:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 5, '07:00:00', '15:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- ============================================
-- EQUIPMENT SCHEDULES
-- ============================================

-- MRI Machine - Available Mon-Sat 8am-8pm
INSERT INTO equipment_schedules (
    id, tenant_id, equipment_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 1, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 2, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 3, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 4, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 5, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'aaaa1111-1111-1111-1111-111111111111'::uuid, 6, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- X-Ray Machine - Available Mon-Fri 7am-7pm
INSERT INTO equipment_schedules (
    id, tenant_id, equipment_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'bbbb2222-2222-2222-2222-222222222222'::uuid, 1, '07:00:00', '19:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'bbbb2222-2222-2222-2222-222222222222'::uuid, 2, '07:00:00', '19:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'bbbb2222-2222-2222-2222-222222222222'::uuid, 3, '07:00:00', '19:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'bbbb2222-2222-2222-2222-222222222222'::uuid, 4, '07:00:00', '19:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'bbbb2222-2222-2222-2222-222222222222'::uuid, 5, '07:00:00', '19:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- Ultrasound Machine - Available Mon-Fri 8am-6pm
INSERT INTO equipment_schedules (
    id, tenant_id, equipment_id, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'cccc3333-3333-3333-3333-333333333333'::uuid, 1, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'cccc3333-3333-3333-3333-333333333333'::uuid, 2, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'cccc3333-3333-3333-3333-333333333333'::uuid, 3, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'cccc3333-3333-3333-3333-333333333333'::uuid, 4, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'cccc3333-3333-3333-3333-333333333333'::uuid, 5, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- ============================================
-- SPACE SCHEDULES (Exam/Procedure Rooms)
-- ============================================

-- Exam Room 1 - Available Mon-Fri 7am-9pm
INSERT INTO space_schedules (
    id, tenant_id, space_id, space_name, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'dddd1111-1111-1111-1111-111111111111'::uuid, 'Exam Room 1', 1, '07:00:00', '21:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'dddd1111-1111-1111-1111-111111111111'::uuid, 'Exam Room 1', 2, '07:00:00', '21:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'dddd1111-1111-1111-1111-111111111111'::uuid, 'Exam Room 1', 3, '07:00:00', '21:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'dddd1111-1111-1111-1111-111111111111'::uuid, 'Exam Room 1', 4, '07:00:00', '21:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'dddd1111-1111-1111-1111-111111111111'::uuid, 'Exam Room 1', 5, '07:00:00', '21:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- Exam Room 2 - Available Mon-Sat 8am-8pm
INSERT INTO space_schedules (
    id, tenant_id, space_id, space_name, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'eeee2222-2222-2222-2222-222222222222'::uuid, 'Exam Room 2', 1, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'eeee2222-2222-2222-2222-222222222222'::uuid, 'Exam Room 2', 2, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'eeee2222-2222-2222-2222-222222222222'::uuid, 'Exam Room 2', 3, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'eeee2222-2222-2222-2222-222222222222'::uuid, 'Exam Room 2', 4, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'eeee2222-2222-2222-2222-222222222222'::uuid, 'Exam Room 2', 5, '08:00:00', '20:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'eeee2222-2222-2222-2222-222222222222'::uuid, 'Exam Room 2', 6, '09:00:00', '17:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- Procedure Room 1 - Available Mon-Fri 8am-6pm
INSERT INTO space_schedules (
    id, tenant_id, space_id, space_name, day_of_week, start_time, end_time,
    is_available, schedule_type, effective_from, effective_to,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'ffff3333-3333-3333-3333-333333333333'::uuid, 'Procedure Room 1', 1, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'ffff3333-3333-3333-3333-333333333333'::uuid, 'Procedure Room 1', 2, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'ffff3333-3333-3333-3333-333333333333'::uuid, 'Procedure Room 1', 3, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'ffff3333-3333-3333-3333-333333333333'::uuid, 'Procedure Room 1', 4, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'ffff3333-3333-3333-3333-333333333333'::uuid, 'Procedure Room 1', 5, '08:00:00', '18:00:00', true, 'regular', '2025-01-01', NULL, 'system', 'system', NOW(), NOW());

-- ============================================
-- RESOURCE BLOCKS (Vacations, Maintenance, etc.)
-- ============================================

-- Dr. Sarah Johnson vacation request (pending approval) - Dec 23-27, 2025
INSERT INTO resource_blocks (
    id, tenant_id, facility_id, resource_type, resource_id, block_type,
    start_datetime, end_datetime, reason, approval_status, recurring_pattern,
    created_by, updated_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'staff',
    '11111111-1111-1111-1111-111111111111'::uuid,
    'vacation',
    '2025-12-23 00:00:00+00'::timestamptz,
    '2025-12-27 23:59:59+00'::timestamptz,
    'Christmas vacation',
    'pending',
    NULL,
    'system',
    'system',
    NOW(),
    NOW()
);

-- MRI Machine scheduled maintenance (approved) - Nov 15, 2025 2pm-6pm
INSERT INTO resource_blocks (
    id, tenant_id, facility_id, resource_type, resource_id, block_type,
    start_datetime, end_datetime, reason, approval_status, recurring_pattern,
    approved_by, approved_at, created_by, updated_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'equipment',
    'aaaa1111-1111-1111-1111-111111111111'::uuid,
    'maintenance',
    '2025-11-15 14:00:00+00'::timestamptz,
    '2025-11-15 18:00:00+00'::timestamptz,
    'Quarterly preventive maintenance',
    'approved',
    NULL,
    'system',
    NOW(),
    'system',
    'system',
    NOW(),
    NOW()
);

-- Dr. Michael Chen - Conference (approved) - Nov 5-6, 2025
INSERT INTO resource_blocks (
    id, tenant_id, facility_id, resource_type, resource_id, block_type,
    start_datetime, end_datetime, reason, approval_status, recurring_pattern,
    approved_by, approved_at, created_by, updated_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'staff',
    '22222222-2222-2222-2222-222222222222'::uuid,
    'special_event',
    '2025-11-05 00:00:00+00'::timestamptz,
    '2025-11-06 23:59:59+00'::timestamptz,
    'Attending cardiology conference',
    'approved',
    NULL,
    'system',
    NOW(),
    'system',
    'system',
    NOW(),
    NOW()
);

-- Exam Room 2 - Emergency closure (approved) - Oct 30, 2025
INSERT INTO resource_blocks (
    id, tenant_id, facility_id, resource_type, resource_id, block_type,
    start_datetime, end_datetime, reason, approval_status, recurring_pattern,
    approved_by, approved_at, created_by, updated_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'space',
    'eeee2222-2222-2222-2222-222222222222'::uuid,
    'emergency',
    '2025-10-30 08:00:00+00'::timestamptz,
    '2025-10-30 17:00:00+00'::timestamptz,
    'Emergency plumbing repair',
    'approved',
    NULL,
    'system',
    NOW(),
    'system',
    'system',
    NOW(),
    NOW()
);

-- ============================================
-- APPOINTMENT RESOURCE REQUIREMENTS (Templates)
-- ============================================

-- General Checkup: Requires 1 physician + 1 exam room, 30 minutes
INSERT INTO appointment_resource_requirements (
    id, tenant_id, facility_id, appointment_type, resource_type, resource_role,
    quantity, duration_minutes, is_required, preparation_minutes, cleanup_minutes,
    created_by, updated_by, created_at, updated_at
) VALUES
    -- Physician requirement
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'general_checkup', 'staff', 'physician', 1, 30, true, 5, 5, 'system', 'system', NOW(), NOW()),
    -- Exam room requirement
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'general_checkup', 'space', 'exam_room', 1, 30, true, 5, 10, 'system', 'system', NOW(), NOW());

-- Specialist Consultation: Requires 1 specialist + 1 exam room, 45 minutes
INSERT INTO appointment_resource_requirements (
    id, tenant_id, facility_id, appointment_type, resource_type, resource_role,
    quantity, duration_minutes, is_required, preparation_minutes, cleanup_minutes,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'specialist_consultation', 'staff', 'specialist', 1, 45, true, 5, 5, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'specialist_consultation', 'space', 'exam_room', 1, 45, true, 5, 10, 'system', 'system', NOW(), NOW());

-- MRI Scan: Requires 1 radiologist + 1 MRI machine + 1 technician, 60 minutes
INSERT INTO appointment_resource_requirements (
    id, tenant_id, facility_id, appointment_type, resource_type, resource_role,
    quantity, duration_minutes, is_required, preparation_minutes, cleanup_minutes,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'mri_scan', 'staff', 'radiologist', 1, 60, true, 10, 5, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'mri_scan', 'equipment', 'mri_machine', 1, 60, true, 15, 15, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'mri_scan', 'staff', 'technician', 1, 60, true, 10, 5, 'system', 'system', NOW(), NOW());

-- X-Ray: Requires 1 technician + 1 x-ray machine, 15 minutes
INSERT INTO appointment_resource_requirements (
    id, tenant_id, facility_id, appointment_type, resource_type, resource_role,
    quantity, duration_minutes, is_required, preparation_minutes, cleanup_minutes,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'x_ray', 'staff', 'technician', 1, 15, true, 5, 5, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'x_ray', 'equipment', 'xray_machine', 1, 15, true, 5, 5, 'system', 'system', NOW(), NOW());

-- Minor Procedure: Requires 1 surgeon + 1 nurse + 1 procedure room, 90 minutes
INSERT INTO appointment_resource_requirements (
    id, tenant_id, facility_id, appointment_type, resource_type, resource_role,
    quantity, duration_minutes, is_required, preparation_minutes, cleanup_minutes,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'minor_procedure', 'staff', 'surgeon', 1, 90, true, 15, 10, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'minor_procedure', 'staff', 'nurse', 1, 90, true, 15, 10, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'minor_procedure', 'space', 'procedure_room', 1, 90, true, 20, 30, 'system', 'system', NOW(), NOW());

-- Follow-up Visit: Requires 1 physician + 1 exam room, 15 minutes
INSERT INTO appointment_resource_requirements (
    id, tenant_id, facility_id, appointment_type, resource_type, resource_role,
    quantity, duration_minutes, is_required, preparation_minutes, cleanup_minutes,
    created_by, updated_by, created_at, updated_at
) VALUES
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'follow_up', 'staff', 'physician', 1, 15, true, 5, 5, 'system', 'system', NOW(), NOW()),
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'follow_up', 'space', 'exam_room', 1, 15, true, 5, 5, 'system', 'system', NOW(), NOW());

-- ============================================
-- SAMPLE APPOINTMENTS
-- ============================================

-- Note: These appointments reference patients. You'll need to ensure patient records exist
-- or adjust the patient_id values to match your actual patient records

-- Appointment 1: General checkup - Tomorrow at 10am (confirmed)
INSERT INTO appointments (
    id, tenant_id, facility_id, patient_id, appointment_type, appointment_status,
    scheduled_start_time, scheduled_end_time, notes,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'appt-1111-1111-1111-1111-111111111111'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-001'::uuid,  -- Replace with actual patient ID
    'general_checkup',
    'confirmed',
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours')::timestamptz,
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 30 minutes')::timestamptz,
    'Annual physical examination',
    'system',
    'system',
    NOW(),
    NOW()
);

-- Appointment Resources for Appointment 1
INSERT INTO appointment_resources (
    id, tenant_id, facility_id, appointment_id, resource_type, resource_id,
    resource_role, start_time, end_time, preparation_start, cleanup_end, status,
    created_by, updated_by, created_at, updated_at
) VALUES
    -- Dr. Sarah Johnson
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-1111-1111-1111-1111-111111111111'::uuid, 'staff', '11111111-1111-1111-1111-111111111111'::uuid, 'physician',
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 30 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '9 hours 55 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 35 minutes')::timestamptz,
     'confirmed', 'system', 'system', NOW(), NOW()),
    -- Exam Room 1
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-1111-1111-1111-1111-111111111111'::uuid, 'space', 'dddd1111-1111-1111-1111-111111111111'::uuid, 'exam_room',
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 30 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '9 hours 55 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 40 minutes')::timestamptz,
     'confirmed', 'system', 'system', NOW(), NOW());

-- Appointment 2: Specialist consultation - 3 days from now at 2pm (scheduled)
INSERT INTO appointments (
    id, tenant_id, facility_id, patient_id, appointment_type, appointment_status,
    scheduled_start_time, scheduled_end_time, notes,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'appt-2222-2222-2222-2222-222222222222'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-002'::uuid,  -- Replace with actual patient ID
    'specialist_consultation',
    'scheduled',
    (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours')::timestamptz,
    (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours 45 minutes')::timestamptz,
    'Cardiology consultation for chest pain',
    'system',
    'system',
    NOW(),
    NOW()
);

-- Appointment Resources for Appointment 2
INSERT INTO appointment_resources (
    id, tenant_id, facility_id, appointment_id, resource_type, resource_id,
    resource_role, start_time, end_time, preparation_start, cleanup_end, status,
    created_by, updated_by, created_at, updated_at
) VALUES
    -- Dr. Michael Chen (Cardiologist)
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-2222-2222-2222-2222-222222222222'::uuid, 'staff', '22222222-2222-2222-2222-222222222222'::uuid, 'specialist',
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours')::timestamptz,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours 45 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '13 hours 55 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours 50 minutes')::timestamptz,
     'allocated', 'system', 'system', NOW(), NOW()),
    -- Exam Room 2
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-2222-2222-2222-2222-222222222222'::uuid, 'space', 'eeee2222-2222-2222-2222-222222222222'::uuid, 'exam_room',
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours')::timestamptz,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours 45 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '13 hours 55 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '14 hours 55 minutes')::timestamptz,
     'allocated', 'system', 'system', NOW(), NOW());

-- Appointment 3: X-Ray - Tomorrow at 3pm (confirmed)
INSERT INTO appointments (
    id, tenant_id, facility_id, patient_id, appointment_type, appointment_status,
    scheduled_start_time, scheduled_end_time, notes,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'appt-3333-3333-3333-3333-333333333333'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-003'::uuid,  -- Replace with actual patient ID
    'x_ray',
    'confirmed',
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours 15 minutes')::timestamptz,
    'X-ray for suspected fracture - right wrist',
    'system',
    'system',
    NOW(),
    NOW()
);

-- Appointment Resources for Appointment 3
INSERT INTO appointment_resources (
    id, tenant_id, facility_id, appointment_id, resource_type, resource_id,
    resource_role, start_time, end_time, preparation_start, cleanup_end, status,
    created_by, updated_by, created_at, updated_at
) VALUES
    -- Nurse Practitioner (as technician)
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-3333-3333-3333-3333-333333333333'::uuid, 'staff', '44444444-4444-4444-4444-444444444444'::uuid, 'technician',
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours 15 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours 55 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours 20 minutes')::timestamptz,
     'confirmed', 'system', 'system', NOW(), NOW()),
    -- X-Ray Machine
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-3333-3333-3333-3333-333333333333'::uuid, 'equipment', 'bbbb2222-2222-2222-2222-222222222222'::uuid, 'xray_machine',
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours 15 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours 55 minutes')::timestamptz,
     (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours 20 minutes')::timestamptz,
     'confirmed', 'system', 'system', NOW(), NOW());

-- Appointment 4: Follow-up - Yesterday (completed)
INSERT INTO appointments (
    id, tenant_id, facility_id, patient_id, appointment_type, appointment_status,
    scheduled_start_time, scheduled_end_time, actual_start_time, actual_end_time, notes,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'appt-4444-4444-4444-4444-444444444444'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-004'::uuid,  -- Replace with actual patient ID
    'follow_up',
    'completed',
    (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours')::timestamptz,
    (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes')::timestamptz,
    (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 5 minutes')::timestamptz,
    (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 18 minutes')::timestamptz,
    'Follow-up after lab results. Patient progressing well.',
    'system',
    'system',
    NOW(),
    NOW()
);

-- Appointment Resources for Appointment 4
INSERT INTO appointment_resources (
    id, tenant_id, facility_id, appointment_id, resource_type, resource_id,
    resource_role, start_time, end_time, preparation_start, cleanup_end, status,
    created_by, updated_by, created_at, updated_at
) VALUES
    -- Dr. Sarah Johnson
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-4444-4444-4444-4444-444444444444'::uuid, 'staff', '11111111-1111-1111-1111-111111111111'::uuid, 'physician',
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours')::timestamptz,
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes')::timestamptz,
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '10 hours 55 minutes')::timestamptz,
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 20 minutes')::timestamptz,
     'completed', 'system', 'system', NOW(), NOW()),
    -- Exam Room 1
    (gen_random_uuid(), 'default-tenant'::uuid, 'default-facility'::uuid, 'appt-4444-4444-4444-4444-444444444444'::uuid, 'space', 'dddd1111-1111-1111-1111-111111111111'::uuid, 'exam_room',
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours')::timestamptz,
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 15 minutes')::timestamptz,
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '10 hours 55 minutes')::timestamptz,
     (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '11 hours 20 minutes')::timestamptz,
     'completed', 'system', 'system', NOW(), NOW());

-- Appointment 5: Cancelled appointment example
INSERT INTO appointments (
    id, tenant_id, facility_id, patient_id, appointment_type, appointment_status,
    scheduled_start_time, scheduled_end_time, cancellation_reason, notes,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'appt-5555-5555-5555-5555-555555555555'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-005'::uuid,  -- Replace with actual patient ID
    'general_checkup',
    'cancelled',
    (CURRENT_DATE + INTERVAL '2 days' + INTERVAL '9 hours')::timestamptz,
    (CURRENT_DATE + INTERVAL '2 days' + INTERVAL '9 hours 30 minutes')::timestamptz,
    'Patient called to reschedule due to work conflict',
    'Will reschedule for next week',
    'system',
    'system',
    NOW(),
    NOW()
);

-- ============================================
-- APPOINTMENT SERIES (Recurring Appointments)
-- ============================================

-- Physical Therapy Series: Every Tuesday for 8 weeks
INSERT INTO appointment_series (
    id, tenant_id, facility_id, patient_id, series_name, appointment_type,
    recurrence_rule, start_date, end_date, duration_minutes, series_status,
    total_appointments_planned, appointments_completed, appointments_cancelled,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'series-1111-1111-1111-1111-111111111111'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-006'::uuid,  -- Replace with actual patient ID
    'Physical Therapy - Post Surgery',
    'physical_therapy',
    'FREQ=WEEKLY;BYDAY=TU;COUNT=8',
    '2025-11-01'::date,
    '2025-12-20'::date,
    45,
    'active',
    8,
    0,
    0,
    'system',
    'system',
    NOW(),
    NOW()
);

-- Weekly Dialysis Series: Every Monday, Wednesday, Friday for 12 weeks
INSERT INTO appointment_series (
    id, tenant_id, facility_id, patient_id, series_name, appointment_type,
    recurrence_rule, start_date, end_date, duration_minutes, series_status,
    total_appointments_planned, appointments_completed, appointments_cancelled,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'series-2222-2222-2222-2222-222222222222'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-007'::uuid,  -- Replace with actual patient ID
    'Dialysis Treatment',
    'dialysis',
    'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=36',
    '2025-11-01'::date,
    '2026-01-30'::date,
    180,
    'active',
    36,
    0,
    0,
    'system',
    'system',
    NOW(),
    NOW()
);

-- Monthly Checkup Series: First Monday of each month for 6 months
INSERT INTO appointment_series (
    id, tenant_id, facility_id, patient_id, series_name, appointment_type,
    recurrence_rule, start_date, end_date, duration_minutes, series_status,
    total_appointments_planned, appointments_completed, appointments_cancelled,
    created_by, updated_by, created_at, updated_at
) VALUES (
    'series-3333-3333-3333-3333-333333333333'::uuid,
    'default-tenant'::uuid,
    'default-facility'::uuid,
    'patient-008'::uuid,  -- Replace with actual patient ID
    'Monthly Diabetes Checkup',
    'follow_up',
    'FREQ=MONTHLY;BYDAY=1MO;COUNT=6',
    '2025-11-04'::date,
    '2026-04-06'::date,
    30,
    'active',
    6,
    0,
    0,
    'system',
    'system',
    NOW(),
    NOW()
);

-- ============================================
-- SUMMARY
-- ============================================

-- This seed file creates:
-- - 18 staff schedules for 4 different staff members
-- - 21 equipment schedules for 3 pieces of equipment
-- - 18 space schedules for 3 rooms
-- - 4 resource blocks (vacations, maintenance, etc.)
-- - 13 appointment resource requirement templates for 6 appointment types
-- - 5 sample appointments (completed, confirmed, scheduled, cancelled)
-- - 8 appointment resource allocations
-- - 3 appointment series (recurring appointments)

-- Note: You may need to adjust UUIDs for tenant_id, facility_id, staff_id,
-- patient_id, equipment_id, and space_id to match your actual data.

-- To run this seed file:
-- psql -h localhost -U postgres -d zeal_clinical -f 002_seed_scheduling_data.sql
