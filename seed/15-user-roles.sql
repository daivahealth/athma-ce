-- User-Role Assignments Seed Data
-- File: 15-user-roles.sql
-- Description: Assigns roles to users for RBAC

-- Super Admin User Assignment
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
('ur-super-admin-uuid', 'user-super-admin-uuid', 'role-super-admin-uuid', NOW(), NULL, NULL, TRUE);

-- Demo Tenant Admin Assignment
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
('ur-demo-admin-uuid', 'user-demo-admin-uuid', 'role-tenant-admin-uuid', NOW(), 'user-super-admin-uuid', NULL, TRUE);

-- Demo Clinic Staff Assignments
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
-- Senior Physician
('ur-demo-senior-physician-uuid', 'user-demo-senior-physician-uuid', 'role-physician-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),
('ur-demo-senior-physician-custom-uuid', 'user-demo-senior-physician-uuid', 'role-demo-senior-physician-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Regular Physician
('ur-demo-physician-uuid', 'user-demo-physician-uuid', 'role-physician-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Nurse
('ur-demo-nurse-uuid', 'user-demo-nurse-uuid', 'role-nurse-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Billing Staff
('ur-demo-billing-staff-uuid', 'user-demo-billing-staff-uuid', 'role-billing-staff-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Receptionist
('ur-demo-receptionist-uuid', 'user-demo-receptionist-uuid', 'role-receptionist-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Lab Technician
('ur-demo-lab-tech-uuid', 'user-demo-lab-tech-uuid', 'role-lab-technician-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Pharmacist
('ur-demo-pharmacist-uuid', 'user-demo-pharmacist-uuid', 'role-pharmacist-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Clinic Manager
('ur-demo-clinic-manager-uuid', 'user-demo-clinic-manager-uuid', 'role-demo-clinic-manager-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE),

-- Finance Manager
('ur-demo-finance-manager-uuid', 'user-demo-finance-manager-uuid', 'role-demo-finance-manager-uuid', NOW(), 'user-demo-admin-uuid', NULL, TRUE);

-- API User Assignment
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by, expires_at, is_active) VALUES
('ur-api-user-uuid', 'user-api-integration-uuid', 'role-api-user-uuid', NOW(), 'user-super-admin-uuid', NULL, TRUE);
