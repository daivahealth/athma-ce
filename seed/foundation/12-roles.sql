-- RBAC System Seed Data
-- File: 12-roles.sql
-- Description: System and tenant roles for RBAC

-- System Roles (Global)
INSERT INTO roles (id, tenant_id, name, description, is_system_role, requires_mfa, created_at, updated_at) VALUES
(uuid_from_text('role-super-admin-uuid'), NULL, 'super_admin', 'System administrator with full access', TRUE, TRUE, NOW(), NOW()),
(uuid_from_text('role-tenant-admin-uuid'), NULL, 'tenant_admin', 'Tenant administrator with tenant-scoped admin access', TRUE, TRUE, NOW(), NOW()),
(uuid_from_text('role-physician-uuid'), NULL, 'physician', 'Medical doctor with clinical access', TRUE, FALSE, NOW(), NOW()),
(uuid_from_text('role-nurse-uuid'), NULL, 'nurse', 'Nursing staff with limited clinical access', TRUE, FALSE, NOW(), NOW()),
(uuid_from_text('role-billing-staff-uuid'), NULL, 'billing_staff', 'Billing specialist with financial access', TRUE, FALSE, NOW(), NOW()),
(uuid_from_text('role-receptionist-uuid'), NULL, 'receptionist', 'Front desk staff with appointment access', TRUE, FALSE, NOW(), NOW()),
(uuid_from_text('role-lab-technician-uuid'), NULL, 'lab_technician', 'Lab staff with lab order access', TRUE, FALSE, NOW(), NOW()),
(uuid_from_text('role-pharmacist-uuid'), NULL, 'pharmacist', 'Pharmacy staff with prescription access', TRUE, FALSE, NOW(), NOW()),
(uuid_from_text('role-auditor-uuid'), NULL, 'auditor', 'Compliance auditor with read-only access', TRUE, TRUE, NOW(), NOW()),
(uuid_from_text('role-api-user-uuid'), NULL, 'api_user', 'System integration user', TRUE, TRUE, NOW(), NOW());

-- Tenant-specific roles (example for demo tenant)
INSERT INTO roles (id, tenant_id, name, description, is_system_role, requires_mfa, created_at, updated_at) VALUES
(uuid_from_text('role-demo-senior-physician-uuid'), uuid_from_text('tenant-demo-clinic-uuid'), 'senior_physician', 'Senior physician with additional privileges', FALSE, FALSE, NOW(), NOW()),
(uuid_from_text('role-demo-clinic-manager-uuid'), uuid_from_text('tenant-demo-clinic-uuid'), 'clinic_manager', 'Clinic manager with operational access', FALSE, TRUE, NOW(), NOW()),
(uuid_from_text('role-demo-finance-manager-uuid'), uuid_from_text('tenant-demo-clinic-uuid'), 'finance_manager', 'Finance manager with billing access', FALSE, TRUE, NOW(), NOW());
