-- Role-Permission Mappings Seed Data
-- File: 14-role-permissions.sql
-- Description: Maps roles to permissions for RBAC

-- Super Admin Role (All Permissions)
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data
('rp-super-patients-read-uuid', 'role-super-admin-uuid', 'perm-patients-read-uuid', NOW(), NULL),
('rp-super-patients-write-uuid', 'role-super-admin-uuid', 'perm-patients-write-uuid', NOW(), NULL),
('rp-super-patients-delete-uuid', 'role-super-admin-uuid', 'perm-patients-delete-uuid', NOW(), NULL),
('rp-super-patients-search-uuid', 'role-super-admin-uuid', 'perm-patients-search-uuid', NOW(), NULL),

-- Clinical Operations
('rp-super-encounters-read-uuid', 'role-super-admin-uuid', 'perm-encounters-read-uuid', NOW(), NULL),
('rp-super-encounters-write-uuid', 'role-super-admin-uuid', 'perm-encounters-write-uuid', NOW(), NULL),
('rp-super-encounters-delete-uuid', 'role-super-admin-uuid', 'perm-encounters-delete-uuid', NOW(), NULL),
('rp-super-clinical-notes-read-uuid', 'role-super-admin-uuid', 'perm-clinical-notes-read-uuid', NOW(), NULL),
('rp-super-clinical-notes-write-uuid', 'role-super-admin-uuid', 'perm-clinical-notes-write-uuid', NOW(), NULL),
('rp-super-clinical-notes-delete-uuid', 'role-super-admin-uuid', 'perm-clinical-notes-delete-uuid', NOW(), NULL),

-- Appointments
('rp-super-appointments-read-uuid', 'role-super-admin-uuid', 'perm-appointments-read-uuid', NOW(), NULL),
('rp-super-appointments-write-uuid', 'role-super-admin-uuid', 'perm-appointments-write-uuid', NOW(), NULL),
('rp-super-appointments-delete-uuid', 'role-super-admin-uuid', 'perm-appointments-delete-uuid', NOW(), NULL),
('rp-super-appointments-schedule-uuid', 'role-super-admin-uuid', 'perm-appointments-schedule-uuid', NOW(), NULL),

-- Orders
('rp-super-orders-read-uuid', 'role-super-admin-uuid', 'perm-orders-read-uuid', NOW(), NULL),
('rp-super-orders-write-uuid', 'role-super-admin-uuid', 'perm-orders-write-uuid', NOW(), NULL),
('rp-super-orders-delete-uuid', 'role-super-admin-uuid', 'perm-orders-delete-uuid', NOW(), NULL),
('rp-super-orders-approve-uuid', 'role-super-admin-uuid', 'perm-orders-approve-uuid', NOW(), NULL),

-- Prescriptions
('rp-super-prescriptions-read-uuid', 'role-super-admin-uuid', 'perm-prescriptions-read-uuid', NOW(), NULL),
('rp-super-prescriptions-write-uuid', 'role-super-admin-uuid', 'perm-prescriptions-write-uuid', NOW(), NULL),
('rp-super-prescriptions-delete-uuid', 'role-super-admin-uuid', 'perm-prescriptions-delete-uuid', NOW(), NULL),
('rp-super-prescriptions-dispense-uuid', 'role-super-admin-uuid', 'perm-prescriptions-dispense-uuid', NOW(), NULL),

-- Billing & RCM
('rp-super-claims-read-uuid', 'role-super-admin-uuid', 'perm-claims-read-uuid', NOW(), NULL),
('rp-super-claims-write-uuid', 'role-super-admin-uuid', 'perm-claims-write-uuid', NOW(), NULL),
('rp-super-claims-submit-uuid', 'role-super-admin-uuid', 'perm-claims-submit-uuid', NOW(), NULL),
('rp-super-claims-approve-uuid', 'role-super-admin-uuid', 'perm-claims-approve-uuid', NOW(), NULL),
('rp-super-superbills-read-uuid', 'role-super-admin-uuid', 'perm-superbills-read-uuid', NOW(), NULL),
('rp-super-superbills-write-uuid', 'role-super-admin-uuid', 'perm-superbills-write-uuid', NOW(), NULL),
('rp-super-payments-read-uuid', 'role-super-admin-uuid', 'perm-payments-read-uuid', NOW(), NULL),
('rp-super-payments-write-uuid', 'role-super-admin-uuid', 'perm-payments-write-uuid', NOW(), NULL),

-- Administrative
('rp-super-users-read-uuid', 'role-super-admin-uuid', 'perm-users-read-uuid', NOW(), NULL),
('rp-super-users-write-uuid', 'role-super-admin-uuid', 'perm-users-write-uuid', NOW(), NULL),
('rp-super-users-delete-uuid', 'role-super-admin-uuid', 'perm-users-delete-uuid', NOW(), NULL),
('rp-super-roles-read-uuid', 'role-super-admin-uuid', 'perm-roles-read-uuid', NOW(), NULL),
('rp-super-roles-write-uuid', 'role-super-admin-uuid', 'perm-roles-write-uuid', NOW(), NULL),
('rp-super-roles-delete-uuid', 'role-super-admin-uuid', 'perm-roles-delete-uuid', NOW(), NULL),
('rp-super-permissions-read-uuid', 'role-super-admin-uuid', 'perm-permissions-read-uuid', NOW(), NULL),

-- System Administration
('rp-super-tenants-read-uuid', 'role-super-admin-uuid', 'perm-tenants-read-uuid', NOW(), NULL),
('rp-super-tenants-write-uuid', 'role-super-admin-uuid', 'perm-tenants-write-uuid', NOW(), NULL),
('rp-super-tenants-delete-uuid', 'role-super-admin-uuid', 'perm-tenants-delete-uuid', NOW(), NULL),
('rp-super-system-config-uuid', 'role-super-admin-uuid', 'perm-system-config-uuid', NOW(), NULL),
('rp-super-system-monitor-uuid', 'role-super-admin-uuid', 'perm-system-monitor-uuid', NOW(), NULL),

-- Reports
('rp-super-reports-read-uuid', 'role-super-admin-uuid', 'perm-reports-read-uuid', NOW(), NULL),
('rp-super-reports-export-uuid', 'role-super-admin-uuid', 'perm-reports-export-uuid', NOW(), NULL),
('rp-super-analytics-read-uuid', 'role-super-admin-uuid', 'perm-analytics-read-uuid', NOW(), NULL),

-- Integrations
('rp-super-integrations-read-uuid', 'role-super-admin-uuid', 'perm-integrations-read-uuid', NOW(), NULL),
('rp-super-integrations-write-uuid', 'role-super-admin-uuid', 'perm-integrations-write-uuid', NOW(), NULL),
('rp-super-integrations-manage-uuid', 'role-super-admin-uuid', 'perm-integrations-manage-uuid', NOW(), NULL);

-- Physician Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data
('rp-phys-patients-read-uuid', 'role-physician-uuid', 'perm-patients-read-uuid', NOW(), NULL),
('rp-phys-patients-write-uuid', 'role-physician-uuid', 'perm-patients-write-uuid', NOW(), NULL),
('rp-phys-patients-search-uuid', 'role-physician-uuid', 'perm-patients-search-uuid', NOW(), NULL),

-- Clinical Operations
('rp-phys-encounters-read-uuid', 'role-physician-uuid', 'perm-encounters-read-uuid', NOW(), NULL),
('rp-phys-encounters-write-uuid', 'role-physician-uuid', 'perm-encounters-write-uuid', NOW(), NULL),
('rp-phys-clinical-notes-read-uuid', 'role-physician-uuid', 'perm-clinical-notes-read-uuid', NOW(), NULL),
('rp-phys-clinical-notes-write-uuid', 'role-physician-uuid', 'perm-clinical-notes-write-uuid', NOW(), NULL),

-- Appointments
('rp-phys-appointments-read-uuid', 'role-physician-uuid', 'perm-appointments-read-uuid', NOW(), NULL),
('rp-phys-appointments-write-uuid', 'role-physician-uuid', 'perm-appointments-write-uuid', NOW(), NULL),
('rp-phys-appointments-schedule-uuid', 'role-physician-uuid', 'perm-appointments-schedule-uuid', NOW(), NULL),

-- Orders
('rp-phys-orders-read-uuid', 'role-physician-uuid', 'perm-orders-read-uuid', NOW(), NULL),
('rp-phys-orders-write-uuid', 'role-physician-uuid', 'perm-orders-write-uuid', NOW(), NULL),
('rp-phys-orders-approve-uuid', 'role-physician-uuid', 'perm-orders-approve-uuid', NOW(), NULL),

-- Prescriptions
('rp-phys-prescriptions-read-uuid', 'role-physician-uuid', 'perm-prescriptions-read-uuid', NOW(), NULL),
('rp-phys-prescriptions-write-uuid', 'role-physician-uuid', 'perm-prescriptions-write-uuid', NOW(), NULL),

-- Reports
('rp-phys-reports-read-uuid', 'role-physician-uuid', 'perm-reports-read-uuid', NOW(), NULL);

-- Nurse Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Limited)
('rp-nurse-patients-read-uuid', 'role-nurse-uuid', 'perm-patients-read-uuid', NOW(), NULL),
('rp-nurse-patients-search-uuid', 'role-nurse-uuid', 'perm-patients-search-uuid', NOW(), NULL),

-- Clinical Operations (Limited)
('rp-nurse-encounters-read-uuid', 'role-nurse-uuid', 'perm-encounters-read-uuid', NOW(), NULL),
('rp-nurse-clinical-notes-read-uuid', 'role-nurse-uuid', 'perm-clinical-notes-read-uuid', NOW(), NULL),

-- Appointments
('rp-nurse-appointments-read-uuid', 'role-nurse-uuid', 'perm-appointments-read-uuid', NOW(), NULL),
('rp-nurse-appointments-write-uuid', 'role-nurse-uuid', 'perm-appointments-write-uuid', NOW(), NULL),
('rp-nurse-appointments-schedule-uuid', 'role-nurse-uuid', 'perm-appointments-schedule-uuid', NOW(), NULL),

-- Orders (Limited)
('rp-nurse-orders-read-uuid', 'role-nurse-uuid', 'perm-orders-read-uuid', NOW(), NULL);

-- Billing Staff Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Limited)
('rp-bill-patients-read-uuid', 'role-billing-staff-uuid', 'perm-patients-read-uuid', NOW(), NULL),
('rp-bill-patients-search-uuid', 'role-billing-staff-uuid', 'perm-patients-search-uuid', NOW(), NULL),

-- Billing & RCM
('rp-bill-claims-read-uuid', 'role-billing-staff-uuid', 'perm-claims-read-uuid', NOW(), NULL),
('rp-bill-claims-write-uuid', 'role-billing-staff-uuid', 'perm-claims-write-uuid', NOW(), NULL),
('rp-bill-claims-submit-uuid', 'role-billing-staff-uuid', 'perm-claims-submit-uuid', NOW(), NULL),
('rp-bill-superbills-read-uuid', 'role-billing-staff-uuid', 'perm-superbills-read-uuid', NOW(), NULL),
('rp-bill-superbills-write-uuid', 'role-billing-staff-uuid', 'perm-superbills-write-uuid', NOW(), NULL),
('rp-bill-payments-read-uuid', 'role-billing-staff-uuid', 'perm-payments-read-uuid', NOW(), NULL),
('rp-bill-payments-write-uuid', 'role-billing-staff-uuid', 'perm-payments-write-uuid', NOW(), NULL),

-- Reports
('rp-bill-reports-read-uuid', 'role-billing-staff-uuid', 'perm-reports-read-uuid', NOW(), NULL),
('rp-bill-reports-export-uuid', 'role-billing-staff-uuid', 'perm-reports-export-uuid', NOW(), NULL);

-- Receptionist Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Limited)
('rp-recep-patients-read-uuid', 'role-receptionist-uuid', 'perm-patients-read-uuid', NOW(), NULL),
('rp-recep-patients-write-uuid', 'role-receptionist-uuid', 'perm-patients-write-uuid', NOW(), NULL),
('rp-recep-patients-search-uuid', 'role-receptionist-uuid', 'perm-patients-search-uuid', NOW(), NULL),

-- Appointments
('rp-recep-appointments-read-uuid', 'role-receptionist-uuid', 'perm-appointments-read-uuid', NOW(), NULL),
('rp-recep-appointments-write-uuid', 'role-receptionist-uuid', 'perm-appointments-write-uuid', NOW(), NULL),
('rp-recep-appointments-schedule-uuid', 'role-receptionist-uuid', 'perm-appointments-schedule-uuid', NOW(), NULL);

-- Auditor Role Permissions (Read-Only)
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Read-Only)
('rp-audit-patients-read-uuid', 'role-auditor-uuid', 'perm-patients-read-uuid', NOW(), NULL),
('rp-audit-patients-search-uuid', 'role-auditor-uuid', 'perm-patients-search-uuid', NOW(), NULL),

-- Clinical Operations (Read-Only)
('rp-audit-encounters-read-uuid', 'role-auditor-uuid', 'perm-encounters-read-uuid', NOW(), NULL),
('rp-audit-clinical-notes-read-uuid', 'role-auditor-uuid', 'perm-clinical-notes-read-uuid', NOW(), NULL),

-- Appointments (Read-Only)
('rp-audit-appointments-read-uuid', 'role-auditor-uuid', 'perm-appointments-read-uuid', NOW(), NULL),

-- Orders (Read-Only)
('rp-audit-orders-read-uuid', 'role-auditor-uuid', 'perm-orders-read-uuid', NOW(), NULL),

-- Prescriptions (Read-Only)
('rp-audit-prescriptions-read-uuid', 'role-auditor-uuid', 'perm-prescriptions-read-uuid', NOW(), NULL),

-- Billing & RCM (Read-Only)
('rp-audit-claims-read-uuid', 'role-auditor-uuid', 'perm-claims-read-uuid', NOW(), NULL),
('rp-audit-superbills-read-uuid', 'role-auditor-uuid', 'perm-superbills-read-uuid', NOW(), NULL),
('rp-audit-payments-read-uuid', 'role-auditor-uuid', 'perm-payments-read-uuid', NOW(), NULL),

-- Reports
('rp-audit-reports-read-uuid', 'role-auditor-uuid', 'perm-reports-read-uuid', NOW(), NULL),
('rp-audit-reports-export-uuid', 'role-auditor-uuid', 'perm-reports-export-uuid', NOW(), NULL),
('rp-audit-analytics-read-uuid', 'role-auditor-uuid', 'perm-analytics-read-uuid', NOW(), NULL);
