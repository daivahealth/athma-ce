-- Role-Permission Mappings Seed Data
-- File: 14-role-permissions.sql
-- Description: Maps roles to permissions for RBAC

-- Super Admin Role (All Permissions)
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data
(uuid_from_text('rp-super-patients-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-patients-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-patients-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-patients-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-patients-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-patients-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-patients-search-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-patients-search-uuid'), NOW(), NULL),

-- Clinical Operations
(uuid_from_text('rp-super-encounters-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-encounters-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-encounters-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-encounters-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-encounters-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-encounters-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-clinical-notes-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-clinical-notes-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-clinical-notes-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-clinical-notes-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-clinical-notes-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-clinical-notes-delete-uuid'), NOW(), NULL),

-- Appointments
(uuid_from_text('rp-super-appointments-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-appointments-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-appointments-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-appointments-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-appointments-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-appointments-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-appointments-schedule-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-appointments-schedule-uuid'), NOW(), NULL),

-- Orders
(uuid_from_text('rp-super-orders-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-orders-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-orders-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-orders-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-orders-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-orders-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-orders-approve-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-orders-approve-uuid'), NOW(), NULL),

-- Prescriptions
(uuid_from_text('rp-super-prescriptions-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-prescriptions-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-prescriptions-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-prescriptions-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-prescriptions-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-prescriptions-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-prescriptions-dispense-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-prescriptions-dispense-uuid'), NOW(), NULL),

-- Billing & RCM
(uuid_from_text('rp-super-claims-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-claims-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-claims-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-claims-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-claims-submit-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-claims-submit-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-claims-approve-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-claims-approve-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-superbills-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-superbills-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-superbills-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-superbills-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-payments-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-payments-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-payments-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-payments-write-uuid'), NOW(), NULL),

-- Administrative
(uuid_from_text('rp-super-users-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-users-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-users-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-users-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-users-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-users-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-roles-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-roles-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-roles-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-roles-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-roles-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-roles-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-permissions-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-permissions-read-uuid'), NOW(), NULL),

-- System Administration
(uuid_from_text('rp-super-tenants-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-tenants-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-tenants-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-tenants-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-tenants-delete-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-tenants-delete-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-system-config-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-system-config-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-system-monitor-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-system-monitor-uuid'), NOW(), NULL),

-- Reports
(uuid_from_text('rp-super-reports-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-reports-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-reports-export-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-reports-export-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-analytics-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-analytics-read-uuid'), NOW(), NULL),

-- Integrations
(uuid_from_text('rp-super-integrations-read-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-integrations-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-integrations-write-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-integrations-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-super-integrations-manage-uuid'), uuid_from_text('role-super-admin-uuid'), uuid_from_text('perm-integrations-manage-uuid'), NOW(), NULL);

-- Physician Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data
(uuid_from_text('rp-phys-patients-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-patients-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-patients-write-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-patients-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-patients-search-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-patients-search-uuid'), NOW(), NULL),

-- Clinical Operations
(uuid_from_text('rp-phys-encounters-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-encounters-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-encounters-write-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-encounters-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-clinical-notes-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-clinical-notes-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-clinical-notes-write-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-clinical-notes-write-uuid'), NOW(), NULL),

-- Appointments
(uuid_from_text('rp-phys-appointments-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-appointments-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-appointments-write-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-appointments-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-appointments-schedule-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-appointments-schedule-uuid'), NOW(), NULL),

-- Orders
(uuid_from_text('rp-phys-orders-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-orders-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-orders-write-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-orders-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-orders-approve-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-orders-approve-uuid'), NOW(), NULL),

-- Prescriptions
(uuid_from_text('rp-phys-prescriptions-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-prescriptions-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-phys-prescriptions-write-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-prescriptions-write-uuid'), NOW(), NULL),

-- Reports
(uuid_from_text('rp-phys-reports-read-uuid'), uuid_from_text('role-physician-uuid'), uuid_from_text('perm-reports-read-uuid'), NOW(), NULL);

-- Nurse Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Limited)
(uuid_from_text('rp-nurse-patients-read-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-patients-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-nurse-patients-search-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-patients-search-uuid'), NOW(), NULL),

-- Clinical Operations (Limited)
(uuid_from_text('rp-nurse-encounters-read-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-encounters-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-nurse-clinical-notes-read-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-clinical-notes-read-uuid'), NOW(), NULL),

-- Appointments
(uuid_from_text('rp-nurse-appointments-read-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-appointments-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-nurse-appointments-write-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-appointments-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-nurse-appointments-schedule-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-appointments-schedule-uuid'), NOW(), NULL),

-- Orders (Limited)
(uuid_from_text('rp-nurse-orders-read-uuid'), uuid_from_text('role-nurse-uuid'), uuid_from_text('perm-orders-read-uuid'), NOW(), NULL);

-- Billing Staff Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Limited)
(uuid_from_text('rp-bill-patients-read-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-patients-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-patients-search-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-patients-search-uuid'), NOW(), NULL),

-- Billing & RCM
(uuid_from_text('rp-bill-claims-read-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-claims-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-claims-write-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-claims-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-claims-submit-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-claims-submit-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-superbills-read-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-superbills-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-superbills-write-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-superbills-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-payments-read-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-payments-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-payments-write-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-payments-write-uuid'), NOW(), NULL),

-- Reports
(uuid_from_text('rp-bill-reports-read-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-reports-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-bill-reports-export-uuid'), uuid_from_text('role-billing-staff-uuid'), uuid_from_text('perm-reports-export-uuid'), NOW(), NULL);

-- Receptionist Role Permissions
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Limited)
(uuid_from_text('rp-recep-patients-read-uuid'), uuid_from_text('role-receptionist-uuid'), uuid_from_text('perm-patients-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-recep-patients-write-uuid'), uuid_from_text('role-receptionist-uuid'), uuid_from_text('perm-patients-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-recep-patients-search-uuid'), uuid_from_text('role-receptionist-uuid'), uuid_from_text('perm-patients-search-uuid'), NOW(), NULL),

-- Appointments
(uuid_from_text('rp-recep-appointments-read-uuid'), uuid_from_text('role-receptionist-uuid'), uuid_from_text('perm-appointments-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-recep-appointments-write-uuid'), uuid_from_text('role-receptionist-uuid'), uuid_from_text('perm-appointments-write-uuid'), NOW(), NULL),
(uuid_from_text('rp-recep-appointments-schedule-uuid'), uuid_from_text('role-receptionist-uuid'), uuid_from_text('perm-appointments-schedule-uuid'), NOW(), NULL);

-- Auditor Role Permissions (Read-Only)
INSERT INTO role_permissions (id, role_id, permission_id, granted_at, granted_by) VALUES
-- Patient Data (Read-Only)
(uuid_from_text('rp-audit-patients-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-patients-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-audit-patients-search-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-patients-search-uuid'), NOW(), NULL),

-- Clinical Operations (Read-Only)
(uuid_from_text('rp-audit-encounters-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-encounters-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-audit-clinical-notes-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-clinical-notes-read-uuid'), NOW(), NULL),

-- Appointments (Read-Only)
(uuid_from_text('rp-audit-appointments-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-appointments-read-uuid'), NOW(), NULL),

-- Orders (Read-Only)
(uuid_from_text('rp-audit-orders-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-orders-read-uuid'), NOW(), NULL),

-- Prescriptions (Read-Only)
(uuid_from_text('rp-audit-prescriptions-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-prescriptions-read-uuid'), NOW(), NULL),

-- Billing & RCM (Read-Only)
(uuid_from_text('rp-audit-claims-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-claims-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-audit-superbills-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-superbills-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-audit-payments-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-payments-read-uuid'), NOW(), NULL),

-- Reports
(uuid_from_text('rp-audit-reports-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-reports-read-uuid'), NOW(), NULL),
(uuid_from_text('rp-audit-reports-export-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-reports-export-uuid'), NOW(), NULL),
(uuid_from_text('rp-audit-analytics-read-uuid'), uuid_from_text('role-auditor-uuid'), uuid_from_text('perm-analytics-read-uuid'), NOW(), NULL);
