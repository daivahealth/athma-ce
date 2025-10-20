-- Permissions Seed Data
-- File: 13-permissions.sql
-- Description: System permissions for RBAC

-- Patient Data Permissions
INSERT INTO permissions (id, resource, action, description, is_sensitive, created_at) VALUES
(uuid_from_text('perm-patients-read-uuid'), 'patients', 'read', 'Read patient data', TRUE, NOW()),
(uuid_from_text('perm-patients-write-uuid'), 'patients', 'write', 'Create and update patient data', TRUE, NOW()),
(uuid_from_text('perm-patients-delete-uuid'), 'patients', 'delete', 'Delete patient data', TRUE, NOW()),
(uuid_from_text('perm-patients-search-uuid'), 'patients', 'search', 'Search patients', FALSE, NOW()),

-- Clinical Operations Permissions
(uuid_from_text('perm-encounters-read-uuid'), 'encounters', 'read', 'Read encounter data', TRUE, NOW()),
(uuid_from_text('perm-encounters-write-uuid'), 'encounters', 'write', 'Create and update encounters', TRUE, NOW()),
(uuid_from_text('perm-encounters-delete-uuid'), 'encounters', 'delete', 'Delete encounters', TRUE, NOW()),
(uuid_from_text('perm-clinical-notes-read-uuid'), 'clinical_notes', 'read', 'Read clinical notes', TRUE, NOW()),
(uuid_from_text('perm-clinical-notes-write-uuid'), 'clinical_notes', 'write', 'Create and update clinical notes', TRUE, NOW()),
(uuid_from_text('perm-clinical-notes-delete-uuid'), 'clinical_notes', 'delete', 'Delete clinical notes', TRUE, NOW()),

-- Appointment Permissions
(uuid_from_text('perm-appointments-read-uuid'), 'appointments', 'read', 'Read appointments', FALSE, NOW()),
(uuid_from_text('perm-appointments-write-uuid'), 'appointments', 'write', 'Create and update appointments', FALSE, NOW()),
(uuid_from_text('perm-appointments-delete-uuid'), 'appointments', 'delete', 'Delete appointments', FALSE, NOW()),
(uuid_from_text('perm-appointments-schedule-uuid'), 'appointments', 'schedule', 'Schedule appointments', FALSE, NOW()),

-- Order Permissions
(uuid_from_text('perm-orders-read-uuid'), 'orders', 'read', 'Read orders', TRUE, NOW()),
(uuid_from_text('perm-orders-write-uuid'), 'orders', 'write', 'Create and update orders', TRUE, NOW()),
(uuid_from_text('perm-orders-delete-uuid'), 'orders', 'delete', 'Delete orders', TRUE, NOW()),
(uuid_from_text('perm-orders-approve-uuid'), 'orders', 'approve', 'Approve orders', TRUE, NOW()),

-- Prescription Permissions
(uuid_from_text('perm-prescriptions-read-uuid'), 'prescriptions', 'read', 'Read prescriptions', TRUE, NOW()),
(uuid_from_text('perm-prescriptions-write-uuid'), 'prescriptions', 'write', 'Create and update prescriptions', TRUE, NOW()),
(uuid_from_text('perm-prescriptions-delete-uuid'), 'prescriptions', 'delete', 'Delete prescriptions', TRUE, NOW()),
(uuid_from_text('perm-prescriptions-dispense-uuid'), 'prescriptions', 'dispense', 'Dispense medications', TRUE, NOW()),

-- Billing & RCM Permissions
(uuid_from_text('perm-claims-read-uuid'), 'claims', 'read', 'Read claims', TRUE, NOW()),
(uuid_from_text('perm-claims-write-uuid'), 'claims', 'write', 'Create and update claims', TRUE, NOW()),
(uuid_from_text('perm-claims-submit-uuid'), 'claims', 'submit', 'Submit claims', TRUE, NOW()),
(uuid_from_text('perm-claims-approve-uuid'), 'claims', 'approve', 'Approve claims', TRUE, NOW()),
(uuid_from_text('perm-superbills-read-uuid'), 'superbills', 'read', 'Read superbills', TRUE, NOW()),
(uuid_from_text('perm-superbills-write-uuid'), 'superbills', 'write', 'Create and update superbills', TRUE, NOW()),
(uuid_from_text('perm-payments-read-uuid'), 'payments', 'read', 'Read payments', TRUE, NOW()),
(uuid_from_text('perm-payments-write-uuid'), 'payments', 'write', 'Process payments', TRUE, NOW()),

-- Administrative Permissions
(uuid_from_text('perm-users-read-uuid'), 'users', 'read', 'Read user data', TRUE, NOW()),
(uuid_from_text('perm-users-write-uuid'), 'users', 'write', 'Create and update users', TRUE, NOW()),
(uuid_from_text('perm-users-delete-uuid'), 'users', 'delete', 'Delete users', TRUE, NOW()),
(uuid_from_text('perm-roles-read-uuid'), 'roles', 'read', 'Read roles', TRUE, NOW()),
(uuid_from_text('perm-roles-write-uuid'), 'roles', 'write', 'Create and update roles', TRUE, NOW()),
(uuid_from_text('perm-roles-delete-uuid'), 'roles', 'delete', 'Delete roles', TRUE, NOW()),
(uuid_from_text('perm-permissions-read-uuid'), 'permissions', 'read', 'Read permissions', TRUE, NOW()),

-- System Administration Permissions
(uuid_from_text('perm-tenants-read-uuid'), 'tenants', 'read', 'Read tenant data', TRUE, NOW()),
(uuid_from_text('perm-tenants-write-uuid'), 'tenants', 'write', 'Create and update tenants', TRUE, NOW()),
(uuid_from_text('perm-tenants-delete-uuid'), 'tenants', 'delete', 'Delete tenants', TRUE, NOW()),
(uuid_from_text('perm-system-config-uuid'), 'system', 'configure', 'Configure system settings', TRUE, NOW()),
(uuid_from_text('perm-system-monitor-uuid'), 'system', 'monitor', 'Monitor system health', FALSE, NOW()),

-- Reports Permissions
(uuid_from_text('perm-reports-read-uuid'), 'reports', 'read', 'Read reports', FALSE, NOW()),
(uuid_from_text('perm-reports-export-uuid'), 'reports', 'export', 'Export reports', FALSE, NOW()),
(uuid_from_text('perm-analytics-read-uuid'), 'analytics', 'read', 'Read analytics data', FALSE, NOW()),

-- Integration Permissions
(uuid_from_text('perm-integrations-read-uuid'), 'integrations', 'read', 'Read integration data', TRUE, NOW()),
(uuid_from_text('perm-integrations-write-uuid'), 'integrations', 'write', 'Configure integrations', TRUE, NOW()),
(uuid_from_text('perm-integrations-manage-uuid'), 'integrations', 'manage', 'Manage integrations', TRUE, NOW());
