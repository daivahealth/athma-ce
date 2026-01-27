-- Seed: Permissions
-- Comprehensive RBAC permissions for Zeal healthcare platform

-- Patient Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0001-000000000001', 'patient.read', 'Read Patients', 'View patient records', 'patient', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0001-000000000002', 'patient.create', 'Create Patients', 'Register new patients', 'patient', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0001-000000000003', 'patient.update', 'Update Patients', 'Modify patient information', 'patient', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0001-000000000004', 'patient.delete', 'Delete Patients', 'Delete patient records', 'patient', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0001-000000000005', 'patient.merge', 'Merge Patients', 'Merge duplicate patient records', 'patient', 'merge', NOW(), NOW()),
  ('00000000-0000-0000-0001-000000000006', 'patient.export', 'Export Patients', 'Export patient data', 'patient', 'export', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Appointment Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0002-000000000001', 'appointment.read', 'Read Appointments', 'View appointments', 'appointment', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0002-000000000002', 'appointment.create', 'Create Appointments', 'Book new appointments', 'appointment', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0002-000000000003', 'appointment.update', 'Update Appointments', 'Modify appointments', 'appointment', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0002-000000000004', 'appointment.delete', 'Delete Appointments', 'Delete appointments', 'appointment', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0002-000000000005', 'appointment.cancel', 'Cancel Appointments', 'Cancel appointments', 'appointment', 'cancel', NOW(), NOW()),
  ('00000000-0000-0000-0002-000000000006', 'appointment.reschedule', 'Reschedule Appointments', 'Reschedule appointments', 'appointment', 'reschedule', NOW(), NOW()),
  ('00000000-0000-0000-0002-000000000007', 'appointment.checkin', 'Check-in Appointments', 'Check-in patients for appointments', 'appointment', 'checkin', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Encounter Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0003-000000000001', 'encounter.read', 'Read Encounters', 'View encounters', 'encounter', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0003-000000000002', 'encounter.create', 'Create Encounters', 'Start new encounters', 'encounter', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0003-000000000003', 'encounter.update', 'Update Encounters', 'Modify encounters', 'encounter', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0003-000000000004', 'encounter.delete', 'Delete Encounters', 'Delete encounters', 'encounter', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0003-000000000005', 'encounter.close', 'Close Encounters', 'Close/complete encounters', 'encounter', 'close', NOW(), NOW()),
  ('00000000-0000-0000-0003-000000000006', 'encounter.reopen', 'Reopen Encounters', 'Reopen closed encounters', 'encounter', 'reopen', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Clinical Notes Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0004-000000000001', 'clinical_note.read', 'Read Clinical Notes', 'View clinical notes', 'clinical_note', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0004-000000000002', 'clinical_note.create', 'Create Clinical Notes', 'Write clinical notes', 'clinical_note', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0004-000000000003', 'clinical_note.update', 'Update Clinical Notes', 'Modify clinical notes', 'clinical_note', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0004-000000000004', 'clinical_note.delete', 'Delete Clinical Notes', 'Delete clinical notes', 'clinical_note', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0004-000000000005', 'clinical_note.sign', 'Sign Clinical Notes', 'Sign clinical notes', 'clinical_note', 'sign', NOW(), NOW()),
  ('00000000-0000-0000-0004-000000000006', 'clinical_note.cosign', 'Co-sign Clinical Notes', 'Co-sign clinical notes', 'clinical_note', 'cosign', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Diagnosis Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0005-000000000001', 'diagnosis.read', 'Read Diagnoses', 'View diagnoses', 'diagnosis', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0005-000000000002', 'diagnosis.create', 'Create Diagnoses', 'Add diagnoses', 'diagnosis', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0005-000000000003', 'diagnosis.update', 'Update Diagnoses', 'Modify diagnoses', 'diagnosis', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0005-000000000004', 'diagnosis.delete', 'Delete Diagnoses', 'Delete diagnoses', 'diagnosis', 'delete', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Vital Signs Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0006-000000000001', 'vitals.read', 'Read Vital Signs', 'View vital signs', 'vitals', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0006-000000000002', 'vitals.create', 'Create Vital Signs', 'Record vital signs', 'vitals', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0006-000000000003', 'vitals.update', 'Update Vital Signs', 'Modify vital signs', 'vitals', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0006-000000000004', 'vitals.delete', 'Delete Vital Signs', 'Delete vital signs', 'vitals', 'delete', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Prescription Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0007-000000000001', 'prescription.read', 'Read Prescriptions', 'View prescriptions', 'prescription', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0007-000000000002', 'prescription.create', 'Create Prescriptions', 'Write prescriptions', 'prescription', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0007-000000000003', 'prescription.update', 'Update Prescriptions', 'Modify prescriptions', 'prescription', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0007-000000000004', 'prescription.delete', 'Delete Prescriptions', 'Delete prescriptions', 'prescription', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0007-000000000005', 'prescription.dispense', 'Dispense Prescriptions', 'Dispense medications', 'prescription', 'dispense', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Lab Order Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0008-000000000001', 'lab_order.read', 'Read Lab Orders', 'View lab orders', 'lab_order', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0008-000000000002', 'lab_order.create', 'Create Lab Orders', 'Order lab tests', 'lab_order', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0008-000000000003', 'lab_order.update', 'Update Lab Orders', 'Modify lab orders', 'lab_order', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0008-000000000004', 'lab_order.delete', 'Delete Lab Orders', 'Delete lab orders', 'lab_order', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0008-000000000005', 'lab_order.cancel', 'Cancel Lab Orders', 'Cancel lab orders', 'lab_order', 'cancel', NOW(), NOW()),
  ('00000000-0000-0000-0008-000000000006', 'lab_result.read', 'Read Lab Results', 'View lab results', 'lab_result', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0008-000000000007', 'lab_result.enter', 'Enter Lab Results', 'Enter lab results', 'lab_result', 'enter', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Imaging Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0009-000000000001', 'imaging_order.read', 'Read Imaging Orders', 'View imaging orders', 'imaging_order', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0009-000000000002', 'imaging_order.create', 'Create Imaging Orders', 'Order imaging studies', 'imaging_order', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0009-000000000003', 'imaging_order.update', 'Update Imaging Orders', 'Modify imaging orders', 'imaging_order', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0009-000000000004', 'imaging_order.delete', 'Delete Imaging Orders', 'Delete imaging orders', 'imaging_order', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0009-000000000005', 'imaging_result.read', 'Read Imaging Results', 'View imaging results', 'imaging_result', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0009-000000000006', 'imaging_result.enter', 'Enter Imaging Results', 'Enter imaging results', 'imaging_result', 'enter', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Scheduling Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0010-000000000001', 'schedule.read', 'Read Schedules', 'View staff schedules', 'schedule', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0010-000000000002', 'schedule.create', 'Create Schedules', 'Create staff schedules', 'schedule', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0010-000000000003', 'schedule.update', 'Update Schedules', 'Modify staff schedules', 'schedule', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0010-000000000004', 'schedule.delete', 'Delete Schedules', 'Delete staff schedules', 'schedule', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0010-000000000005', 'calendar.read', 'Read Calendar', 'View calendar events', 'calendar', 'read', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Inpatient Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0011-000000000001', 'admission.read', 'Read Admissions', 'View admissions', 'admission', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000002', 'admission.create', 'Create Admissions', 'Admit patients', 'admission', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000003', 'admission.update', 'Update Admissions', 'Modify admissions', 'admission', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000004', 'discharge.create', 'Create Discharges', 'Discharge patients', 'discharge', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000005', 'discharge.update', 'Update Discharges', 'Modify discharge records', 'discharge', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000006', 'bed.manage', 'Manage Beds', 'Manage bed assignments', 'bed', 'manage', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000007', 'ward.read', 'Read Wards', 'View ward information', 'ward', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0011-000000000008', 'ward.manage', 'Manage Wards', 'Manage ward configuration', 'ward', 'manage', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Triage Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0012-000000000001', 'triage.read', 'Read Triage', 'View triage information', 'triage', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0012-000000000002', 'triage.create', 'Create Triage', 'Perform triage assessment', 'triage', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0012-000000000003', 'triage.update', 'Update Triage', 'Modify triage assessment', 'triage', 'update', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Billing Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0013-000000000001', 'invoice.read', 'Read Invoices', 'View invoices', 'invoice', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000002', 'invoice.create', 'Create Invoices', 'Create invoices', 'invoice', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000003', 'invoice.update', 'Update Invoices', 'Modify invoices', 'invoice', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000004', 'invoice.delete', 'Delete Invoices', 'Delete invoices', 'invoice', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000005', 'invoice.void', 'Void Invoices', 'Void invoices', 'invoice', 'void', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000006', 'payment.read', 'Read Payments', 'View payments', 'payment', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000007', 'payment.create', 'Create Payments', 'Record payments', 'payment', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000008', 'payment.refund', 'Refund Payments', 'Process refunds', 'payment', 'refund', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000009', 'claim.read', 'Read Claims', 'View insurance claims', 'claim', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000010', 'claim.create', 'Create Claims', 'Create insurance claims', 'claim', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000011', 'claim.submit', 'Submit Claims', 'Submit insurance claims', 'claim', 'submit', NOW(), NOW()),
  ('00000000-0000-0000-0013-000000000012', 'claim.update', 'Update Claims', 'Modify insurance claims', 'claim', 'update', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Catalog Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0014-000000000001', 'catalog.read', 'Read Catalogs', 'View catalog items', 'catalog', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0014-000000000002', 'catalog.create', 'Create Catalogs', 'Create catalog items', 'catalog', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0014-000000000003', 'catalog.update', 'Update Catalogs', 'Modify catalog items', 'catalog', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0014-000000000004', 'catalog.delete', 'Delete Catalogs', 'Delete catalog items', 'catalog', 'delete', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- User Management Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0015-000000000001', 'user.read', 'Read Users', 'View user accounts', 'user', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0015-000000000002', 'user.create', 'Create Users', 'Create user accounts', 'user', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0015-000000000003', 'user.update', 'Update Users', 'Modify user accounts', 'user', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0015-000000000004', 'user.delete', 'Delete Users', 'Delete user accounts', 'user', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0015-000000000005', 'user.activate', 'Activate Users', 'Activate user accounts', 'user', 'activate', NOW(), NOW()),
  ('00000000-0000-0000-0015-000000000006', 'user.deactivate', 'Deactivate Users', 'Deactivate user accounts', 'user', 'deactivate', NOW(), NOW()),
  ('00000000-0000-0000-0015-000000000007', 'user.reset_password', 'Reset User Passwords', 'Reset user passwords', 'user', 'reset_password', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Staff Management Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0016-000000000001', 'staff.read', 'Read Staff', 'View staff members', 'staff', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0016-000000000002', 'staff.create', 'Create Staff', 'Create staff records', 'staff', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0016-000000000003', 'staff.update', 'Update Staff', 'Modify staff records', 'staff', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0016-000000000004', 'staff.delete', 'Delete Staff', 'Delete staff records', 'staff', 'delete', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Facility Management Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0017-000000000001', 'facility.read', 'Read Facilities', 'View facilities', 'facility', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0017-000000000002', 'facility.create', 'Create Facilities', 'Create facilities', 'facility', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0017-000000000003', 'facility.update', 'Update Facilities', 'Modify facilities', 'facility', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0017-000000000004', 'facility.delete', 'Delete Facilities', 'Delete facilities', 'facility', 'delete', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- RBAC Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0018-000000000001', 'rbac.read', 'Read RBAC', 'View roles and permissions', 'rbac', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0018-000000000002', 'rbac.manage', 'Manage RBAC', 'Full RBAC management', 'rbac', 'manage', NOW(), NOW()),
  ('00000000-0000-0000-0018-000000000003', 'role.create', 'Create Roles', 'Create new roles', 'role', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0018-000000000004', 'role.update', 'Update Roles', 'Modify roles', 'role', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0018-000000000005', 'role.delete', 'Delete Roles', 'Delete roles', 'role', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0018-000000000006', 'role.assign', 'Assign Roles', 'Assign roles to users', 'role', 'assign', NOW(), NOW()),
  ('00000000-0000-0000-0018-000000000007', 'permission.read', 'Read Permissions', 'View available permissions', 'permission', 'read', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Tenant Management Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0019-000000000001', 'tenant.read', 'Read Tenants', 'View tenant information', 'tenant', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0019-000000000002', 'tenant.create', 'Create Tenants', 'Create new tenants', 'tenant', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0019-000000000003', 'tenant.update', 'Update Tenants', 'Modify tenant settings', 'tenant', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0019-000000000004', 'tenant.delete', 'Delete Tenants', 'Delete tenants', 'tenant', 'delete', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Audit Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0020-000000000001', 'audit.read', 'Read Audit Logs', 'View audit logs', 'audit', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0020-000000000002', 'audit.export', 'Export Audit Logs', 'Export audit logs', 'audit', 'export', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Report Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0021-000000000001', 'report.read', 'Read Reports', 'View reports', 'report', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0021-000000000002', 'report.create', 'Create Reports', 'Generate reports', 'report', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0021-000000000003', 'report.export', 'Export Reports', 'Export reports', 'report', 'export', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Configuration Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0022-000000000001', 'config.read', 'Read Configuration', 'View system configuration', 'config', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0022-000000000002', 'config.update', 'Update Configuration', 'Modify system configuration', 'config', 'update', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Notification Permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0023-000000000001', 'notification.read', 'Read Notifications', 'View notifications', 'notification', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0023-000000000002', 'notification.create', 'Create Notifications', 'Send notifications', 'notification', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0023-000000000003', 'notification_template.manage', 'Manage Notification Templates', 'Manage notification templates', 'notification_template', 'manage', NOW(), NOW()),
  ('00000000-0000-0000-0023-000000000004', 'notification_rule.manage', 'Manage Notification Rules', 'Manage notification rules', 'notification_rule', 'manage', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
