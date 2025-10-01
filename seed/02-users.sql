-- Users Seed Data
-- File: 02-users.sql
-- Description: System and tenant users

-- Super Admin User (System Level)
INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, last_login, created_at, updated_at) VALUES
('user-super-admin-uuid', NULL, 'admin@zeal-platform.ae', 'Super', 'Admin', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'super_admin', 'active', NOW() - INTERVAL '1 hour', NOW(), NOW());

-- Demo Tenant Admin User
INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, last_login, created_at, updated_at) VALUES
('user-demo-admin-uuid', 'tenant-demo-clinic-uuid', 'admin@demo-clinic.ae', 'Demo', 'Administrator', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'tenant_admin', 'active', NOW() - INTERVAL '2 hours', NOW(), NOW());

-- Demo Clinic Staff Users
INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, last_login, created_at, updated_at) VALUES
-- Senior Physician
('user-demo-senior-physician-uuid', 'tenant-demo-clinic-uuid', 'senior.physician@demo-clinic.ae', 'Dr. Mohammed', 'Al-Ahmad', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'physician', 'active', NOW() - INTERVAL '30 minutes', NOW(), NOW()),

-- Regular Physician
('user-demo-physician-uuid', 'tenant-demo-clinic-uuid', 'physician@demo-clinic.ae', 'Dr. Ahmed', 'Al-Mohammed', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'physician', 'active', NOW() - INTERVAL '1 hour', NOW(), NOW()),

-- Nurse
('user-demo-nurse-uuid', 'tenant-demo-clinic-uuid', 'nurse@demo-clinic.ae', 'Fatima', 'Al-Ali', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'nurse', 'active', NOW() - INTERVAL '45 minutes', NOW(), NOW()),

-- Billing Staff
('user-demo-billing-staff-uuid', 'tenant-demo-clinic-uuid', 'billing@demo-clinic.ae', 'Sara', 'Al-Rashid', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'billing_staff', 'active', NOW() - INTERVAL '15 minutes', NOW(), NOW()),

-- Receptionist
('user-demo-receptionist-uuid', 'tenant-demo-clinic-uuid', 'reception@demo-clinic.ae', 'Aisha', 'Al-Zahra', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'receptionist', 'active', NOW() - INTERVAL '20 minutes', NOW(), NOW()),

-- Lab Technician
('user-demo-lab-tech-uuid', 'tenant-demo-clinic-uuid', 'lab@demo-clinic.ae', 'Omar', 'Al-Hassan', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'lab_technician', 'active', NOW() - INTERVAL '10 minutes', NOW(), NOW()),

-- Pharmacist
('user-demo-pharmacist-uuid', 'tenant-demo-clinic-uuid', 'pharmacy@demo-clinic.ae', 'Khalid', 'Al-Saeed', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'pharmacist', 'active', NOW() - INTERVAL '5 minutes', NOW(), NOW()),

-- Clinic Manager
('user-demo-clinic-manager-uuid', 'tenant-demo-clinic-uuid', 'manager@demo-clinic.ae', 'Nasser', 'Al-Mansouri', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'clinic_manager', 'active', NOW() - INTERVAL '1 hour', NOW(), NOW()),

-- Finance Manager
('user-demo-finance-manager-uuid', 'tenant-demo-clinic-uuid', 'finance@demo-clinic.ae', 'Layla', 'Al-Qasimi', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'finance_manager', 'active', NOW() - INTERVAL '30 minutes', NOW(), NOW());

-- API Integration User
INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, last_login, created_at, updated_at) VALUES
('user-api-integration-uuid', NULL, 'api@zeal-platform.ae', 'API', 'Integration', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'api_user', 'active', NOW() - INTERVAL '1 minute', NOW(), NOW());

-- Inactive User (for testing)
INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, last_login, created_at, updated_at) VALUES
('user-demo-inactive-uuid', 'tenant-demo-clinic-uuid', 'inactive@demo-clinic.ae', 'Inactive', 'User', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'receptionist', 'inactive', NOW() - INTERVAL '30 days', NOW(), NOW());
