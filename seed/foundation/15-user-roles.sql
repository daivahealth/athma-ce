-- User-Role Assignments Seed Data
-- File: 15-user-roles.sql
-- Description: Assigns roles to users for RBAC

-- Super Admin User Assignment
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
(uuid_from_text('ur-super-admin-uuid'), uuid_from_text('user-super-admin-uuid'), uuid_from_text('role-super-admin-uuid'), NOW(), NULL, NULL, TRUE);

-- Demo Tenant Admin Assignment
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
(uuid_from_text('ur-demo-admin-uuid'), uuid_from_text('user-demo-admin-uuid'), uuid_from_text('role-tenant-admin-uuid'), NOW(), uuid_from_text('user-super-admin-uuid'), NULL, TRUE);

-- Demo Clinic Staff Assignments
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
-- Senior Physician
(uuid_from_text('ur-demo-senior-physician-uuid'), uuid_from_text('user-demo-senior-physician-uuid'), uuid_from_text('role-physician-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),
(uuid_from_text('ur-demo-senior-physician-custom-uuid'), uuid_from_text('user-demo-senior-physician-uuid'), uuid_from_text('role-demo-senior-physician-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Regular Physician
(uuid_from_text('ur-demo-physician-uuid'), uuid_from_text('user-demo-physician-uuid'), uuid_from_text('role-physician-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Nurse
(uuid_from_text('ur-demo-nurse-uuid'), uuid_from_text('user-demo-nurse-uuid'), uuid_from_text('role-nurse-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Billing Staff
(uuid_from_text('ur-demo-billing-staff-uuid'), uuid_from_text('user-demo-billing-staff-uuid'), uuid_from_text('role-billing-staff-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Receptionist
(uuid_from_text('ur-demo-receptionist-uuid'), uuid_from_text('user-demo-receptionist-uuid'), uuid_from_text('role-receptionist-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Lab Technician
(uuid_from_text('ur-demo-lab-tech-uuid'), uuid_from_text('user-demo-lab-tech-uuid'), uuid_from_text('role-lab-technician-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Pharmacist
(uuid_from_text('ur-demo-pharmacist-uuid'), uuid_from_text('user-demo-pharmacist-uuid'), uuid_from_text('role-pharmacist-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Clinic Manager
(uuid_from_text('ur-demo-clinic-manager-uuid'), uuid_from_text('user-demo-clinic-manager-uuid'), uuid_from_text('role-demo-clinic-manager-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE),

-- Finance Manager
(uuid_from_text('ur-demo-finance-manager-uuid'), uuid_from_text('user-demo-finance-manager-uuid'), uuid_from_text('role-demo-finance-manager-uuid'), NOW(), uuid_from_text('user-demo-admin-uuid'), NULL, TRUE);

-- API User Assignment
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
(uuid_from_text('ur-api-user-uuid'), uuid_from_text('user-api-integration-uuid'), uuid_from_text('role-api-user-uuid'), NOW(), uuid_from_text('user-super-admin-uuid'), NULL, TRUE);
