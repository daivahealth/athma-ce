-- Permissions Seed Data
-- File: 13-permissions.sql
-- Description: System permissions for RBAC

-- Patient Data Permissions
INSERT INTO permissions (id, resource, action, description, is_sensitive, created_at) VALUES
('perm-patients-read-uuid', 'patients', 'read', 'Read patient data', TRUE, NOW()),
('perm-patients-write-uuid', 'patients', 'write', 'Create and update patient data', TRUE, NOW()),
('perm-patients-delete-uuid', 'patients', 'delete', 'Delete patient data', TRUE, NOW()),
('perm-patients-search-uuid', 'patients', 'search', 'Search patients', FALSE, NOW()),

-- Clinical Operations Permissions
('perm-encounters-read-uuid', 'encounters', 'read', 'Read encounter data', TRUE, NOW()),
('perm-encounters-write-uuid', 'encounters', 'write', 'Create and update encounters', TRUE, NOW()),
('perm-encounters-delete-uuid', 'encounters', 'delete', 'Delete encounters', TRUE, NOW()),
('perm-clinical-notes-read-uuid', 'clinical_notes', 'read', 'Read clinical notes', TRUE, NOW()),
('perm-clinical-notes-write-uuid', 'clinical_notes', 'write', 'Create and update clinical notes', TRUE, NOW()),
('perm-clinical-notes-delete-uuid', 'clinical_notes', 'delete', 'Delete clinical notes', TRUE, NOW()),

-- Appointment Permissions
('perm-appointments-read-uuid', 'appointments', 'read', 'Read appointments', FALSE, NOW()),
('perm-appointments-write-uuid', 'appointments', 'write', 'Create and update appointments', FALSE, NOW()),
('perm-appointments-delete-uuid', 'appointments', 'delete', 'Delete appointments', FALSE, NOW()),
('perm-appointments-schedule-uuid', 'appointments', 'schedule', 'Schedule appointments', FALSE, NOW()),

-- Order Permissions
('perm-orders-read-uuid', 'orders', 'read', 'Read orders', TRUE, NOW()),
('perm-orders-write-uuid', 'orders', 'write', 'Create and update orders', TRUE, NOW()),
('perm-orders-delete-uuid', 'orders', 'delete', 'Delete orders', TRUE, NOW()),
('perm-orders-approve-uuid', 'orders', 'approve', 'Approve orders', TRUE, NOW()),

-- Prescription Permissions
('perm-prescriptions-read-uuid', 'prescriptions', 'read', 'Read prescriptions', TRUE, NOW()),
('perm-prescriptions-write-uuid', 'prescriptions', 'write', 'Create and update prescriptions', TRUE, NOW()),
('perm-prescriptions-delete-uuid', 'prescriptions', 'delete', 'Delete prescriptions', TRUE, NOW()),
('perm-prescriptions-dispense-uuid', 'prescriptions', 'dispense', 'Dispense medications', TRUE, NOW()),

-- Billing & RCM Permissions
('perm-claims-read-uuid', 'claims', 'read', 'Read claims', TRUE, NOW()),
('perm-claims-write-uuid', 'claims', 'write', 'Create and update claims', TRUE, NOW()),
('perm-claims-submit-uuid', 'claims', 'submit', 'Submit claims', TRUE, NOW()),
('perm-claims-approve-uuid', 'claims', 'approve', 'Approve claims', TRUE, NOW()),
('perm-superbills-read-uuid', 'superbills', 'read', 'Read superbills', TRUE, NOW()),
('perm-superbills-write-uuid', 'superbills', 'write', 'Create and update superbills', TRUE, NOW()),
('perm-payments-read-uuid', 'payments', 'read', 'Read payments', TRUE, NOW()),
('perm-payments-write-uuid', 'payments', 'write', 'Process payments', TRUE, NOW()),

-- Administrative Permissions
('perm-users-read-uuid', 'users', 'read', 'Read user data', TRUE, NOW()),
('perm-users-write-uuid', 'users', 'write', 'Create and update users', TRUE, NOW()),
('perm-users-delete-uuid', 'users', 'delete', 'Delete users', TRUE, NOW()),
('perm-roles-read-uuid', 'roles', 'read', 'Read roles', TRUE, NOW()),
('perm-roles-write-uuid', 'roles', 'write', 'Create and update roles', TRUE, NOW()),
('perm-roles-delete-uuid', 'roles', 'delete', 'Delete roles', TRUE, NOW()),
('perm-permissions-read-uuid', 'permissions', 'read', 'Read permissions', TRUE, NOW()),

-- System Administration Permissions
('perm-tenants-read-uuid', 'tenants', 'read', 'Read tenant data', TRUE, NOW()),
('perm-tenants-write-uuid', 'tenants', 'write', 'Create and update tenants', TRUE, NOW()),
('perm-tenants-delete-uuid', 'tenants', 'delete', 'Delete tenants', TRUE, NOW()),
('perm-system-config-uuid', 'system', 'configure', 'Configure system settings', TRUE, NOW()),
('perm-system-monitor-uuid', 'system', 'monitor', 'Monitor system health', FALSE, NOW()),

-- Reports Permissions
('perm-reports-read-uuid', 'reports', 'read', 'Read reports', FALSE, NOW()),
('perm-reports-export-uuid', 'reports', 'export', 'Export reports', FALSE, NOW()),
('perm-analytics-read-uuid', 'analytics', 'read', 'Read analytics data', FALSE, NOW()),

-- Integration Permissions
('perm-integrations-read-uuid', 'integrations', 'read', 'Read integration data', TRUE, NOW()),
('perm-integrations-write-uuid', 'integrations', 'write', 'Configure integrations', TRUE, NOW()),
('perm-integrations-manage-uuid', 'integrations', 'manage', 'Manage integrations', TRUE, NOW());
