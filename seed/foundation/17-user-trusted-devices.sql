-- Trusted Devices Seed Data
-- File: 17-user-trusted-devices.sql
-- Description: Trusted devices for MFA bypass

-- Super Admin Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-super-admin-1-uuid'), uuid_from_text('user-super-admin-uuid'), 'fp_super_admin_laptop_1', 'Super Admin Laptop', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '23 days', TRUE, NOW()),
(uuid_from_text('device-super-admin-2-uuid'), uuid_from_text('user-super-admin-uuid'), 'fp_super_admin_mobile_1', 'Super Admin Mobile', '192.168.1.150', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '5 days', NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '25 days', TRUE, NOW());

-- Demo Admin Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-admin-1-uuid'), uuid_from_text('user-demo-admin-uuid'), 'fp_demo_admin_desktop_1', 'Demo Admin Desktop', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '20 days', TRUE, NOW()),
(uuid_from_text('device-demo-admin-2-uuid'), uuid_from_text('user-demo-admin-uuid'), 'fp_demo_admin_tablet_1', 'Demo Admin Tablet', '192.168.1.151', 'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '27 days', TRUE, NOW());

-- Demo Clinic Manager Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-clinic-manager-1-uuid'), uuid_from_text('user-demo-clinic-manager-uuid'), 'fp_demo_clinic_manager_laptop_1', 'Clinic Manager Laptop', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '14 days', NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '16 days', TRUE, NOW());

-- Demo Finance Manager Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-finance-manager-1-uuid'), uuid_from_text('user-demo-finance-manager-uuid'), 'fp_demo_finance_manager_desktop_1', 'Finance Manager Desktop', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '21 days', NOW() - INTERVAL '45 minutes', NOW() + INTERVAL '9 days', TRUE, NOW());

-- Demo Senior Physician Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-senior-physician-1-uuid'), uuid_from_text('user-demo-senior-physician-uuid'), 'fp_demo_senior_physician_laptop_1', 'Senior Physician Laptop', '192.168.1.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '28 days', NOW() - INTERVAL '15 minutes', NOW() + INTERVAL '2 days', TRUE, NOW()),
(uuid_from_text('device-demo-senior-physician-2-uuid'), uuid_from_text('user-demo-senior-physician-uuid'), 'fp_demo_senior_physician_mobile_1', 'Senior Physician Mobile', '192.168.1.154', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 minutes', NOW() + INTERVAL '23 days', TRUE, NOW());

-- Demo Regular Physician Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-physician-1-uuid'), uuid_from_text('user-demo-physician-uuid'), 'fp_demo_physician_laptop_1', 'Physician Laptop', '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '21 days', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '9 days', TRUE, NOW());

-- Demo Nurse Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-nurse-1-uuid'), uuid_from_text('user-demo-nurse-uuid'), 'fp_demo_nurse_tablet_1', 'Nurse Tablet', '192.168.1.106', 'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '14 days', NOW() - INTERVAL '20 minutes', NOW() + INTERVAL '16 days', TRUE, NOW());

-- Demo Billing Staff Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-billing-staff-1-uuid'), uuid_from_text('user-demo-billing-staff-uuid'), 'fp_demo_billing_staff_desktop_1', 'Billing Staff Desktop', '192.168.1.107', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '28 days', NOW() - INTERVAL '10 minutes', NOW() + INTERVAL '2 days', TRUE, NOW());

-- Demo Receptionist Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-demo-receptionist-1-uuid'), uuid_from_text('user-demo-receptionist-uuid'), 'fp_demo_receptionist_desktop_1', 'Receptionist Desktop', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 days', FALSE, NOW()); -- Expired device

-- API User Trusted Devices
INSERT INTO user_trusted_devices (id, user_id, device_fingerprint, device_name, ip_address, user_agent, trusted_at, last_used_at, expires_at, is_active, created_at) VALUES
(uuid_from_text('device-api-user-1-uuid'), uuid_from_text('user-api-integration-uuid'), 'fp_api_user_server_1', 'API Integration Server', '192.168.1.200', 'Zeal-API-Client/1.0', NOW() - INTERVAL '60 days', NOW() - INTERVAL '1 minute', NOW() + INTERVAL '30 days', TRUE, NOW());
