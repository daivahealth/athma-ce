-- MFA Settings Seed Data
-- File: 16-user-mfa-settings.sql
-- Description: Multi-factor authentication settings for users

-- Super Admin MFA Settings (TOTP + Backup Codes)
INSERT INTO user_mfa_settings (id, user_id, mfa_enabled, mfa_method, mfa_secret, is_verified, enrolled_at, last_used_at, backup_codes_generated_at, require_mfa_for_sensitive_actions, created_at, updated_at) VALUES
('mfa-super-admin-totp-uuid', 'user-super-admin-uuid', TRUE, 'totp', '$argon2id$v=19$m=65536,t=3,p=4$encrypted_secret_here', TRUE, NOW(), NOW(), NOW(), TRUE, NOW(), NOW());

-- Demo Admin MFA Settings (TOTP)
INSERT INTO user_mfa_settings (id, user_id, mfa_enabled, mfa_method, mfa_secret, is_verified, enrolled_at, last_used_at, backup_codes_generated_at, require_mfa_for_sensitive_actions, created_at, updated_at) VALUES
('mfa-demo-admin-totp-uuid', 'user-demo-admin-uuid', TRUE, 'totp', '$argon2id$v=19$m=65536,t=3,p=4$encrypted_secret_here', TRUE, NOW(), NOW(), NOW(), TRUE, NOW(), NOW());

-- Demo Clinic Manager MFA Settings (SMS)
INSERT INTO user_mfa_settings (id, user_id, mfa_enabled, mfa_method, phone_number, is_verified, enrolled_at, last_used_at, backup_codes_generated_at, require_mfa_for_sensitive_actions, created_at, updated_at) VALUES
('mfa-demo-clinic-manager-sms-uuid', 'user-demo-clinic-manager-uuid', TRUE, 'sms', '+971501234567', TRUE, NOW(), NOW(), NOW(), TRUE, NOW(), NOW());

-- Demo Finance Manager MFA Settings (Email)
INSERT INTO user_mfa_settings (id, user_id, mfa_enabled, mfa_method, email_address, is_verified, enrolled_at, last_used_at, backup_codes_generated_at, require_mfa_for_sensitive_actions, created_at, updated_at) VALUES
('mfa-demo-finance-manager-email-uuid', 'user-demo-finance-manager-uuid', TRUE, 'email', 'finance.manager@demo-clinic.ae', TRUE, NOW(), NOW(), NOW(), TRUE, NOW(), NOW());

-- API User MFA Settings (TOTP)
INSERT INTO user_mfa_settings (id, user_id, mfa_enabled, mfa_method, mfa_secret, is_verified, enrolled_at, last_used_at, backup_codes_generated_at, require_mfa_for_sensitive_actions, created_at, updated_at) VALUES
('mfa-api-user-totp-uuid', 'user-api-integration-uuid', TRUE, 'totp', '$argon2id$v=19$m=65536,t=3,p=4$encrypted_secret_here', TRUE, NOW(), NOW(), NOW(), TRUE, NOW(), NOW());

-- Backup Codes for Super Admin
INSERT INTO user_mfa_backup_codes (id, user_id, code_hash, used_at, is_used, created_at) VALUES
('backup-super-admin-1-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_1', NULL, FALSE, NOW()),
('backup-super-admin-2-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_2', NULL, FALSE, NOW()),
('backup-super-admin-3-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_3', NULL, FALSE, NOW()),
('backup-super-admin-4-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_4', NULL, FALSE, NOW()),
('backup-super-admin-5-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_5', NULL, FALSE, NOW()),
('backup-super-admin-6-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_6', NULL, FALSE, NOW()),
('backup-super-admin-7-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_7', NULL, FALSE, NOW()),
('backup-super-admin-8-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_8', NULL, FALSE, NOW()),
('backup-super-admin-9-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_9', NULL, FALSE, NOW()),
('backup-super-admin-10-uuid', 'user-super-admin-uuid', '$2b$12$hashed_backup_code_10', NULL, FALSE, NOW());

-- MFA Attempts (Sample successful and failed attempts)
INSERT INTO user_mfa_attempts (id, user_id, mfa_method, code_entered, success, ip_address, user_agent, attempted_at, failure_reason) VALUES
('mfa-attempt-success-1-uuid', 'user-super-admin-uuid', 'totp', '123456', TRUE, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '1 hour', NULL),
('mfa-attempt-failed-1-uuid', 'user-super-admin-uuid', 'totp', '654321', FALSE, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '30 minutes', 'Invalid code'),
('mfa-attempt-success-2-uuid', 'user-demo-admin-uuid', 'totp', '789012', TRUE, '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL '2 hours', NULL);
