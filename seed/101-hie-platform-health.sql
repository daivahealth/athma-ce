-- HIE Platform Health Monitoring Seed Data
-- This file populates the hie_platform_health table with sample health monitoring data

INSERT INTO hie_platform_health (id, platform_id, check_type, status, response_time_ms, error_rate, last_successful_sync, last_failed_sync, consecutive_failures, health_score, details) VALUES
-- NABIDH Health Status
('hie-health-nabidh-connectivity-uuid', 'hie-nabidh-uuid', 'connectivity', 'healthy', 150, 0.5, '2024-03-15 10:00:00+04', '2024-03-14 15:30:00+04', 0, 95,
 '{"endpoint": "https://api.nabidh.ae/fhir/R4/metadata", "ssl_valid": true, "certificate_expiry": "2025-12-31T23:59:59Z"}'),

('hie-health-nabidh-auth-uuid', 'hie-nabidh-uuid', 'auth', 'healthy', 200, 0.0, '2024-03-15 10:00:00+04', NULL, 0, 100,
 '{"token_valid": true, "token_expires": "2024-03-15T12:00:00Z", "scope_valid": true}'),

('hie-health-nabidh-api-uuid', 'hie-nabidh-uuid', 'api_response', 'healthy', 300, 1.2, '2024-03-15 10:00:00+04', '2024-03-15 09:45:00+04', 0, 92,
 '{"avg_response_time": 280, "success_rate": 98.8, "rate_limit_remaining": 950, "rate_limit_reset": "2024-03-15T11:00:00Z"}'),

-- Malaffi Health Status
('hie-health-malaffi-connectivity-uuid', 'hie-malaffi-uuid', 'connectivity', 'healthy', 180, 0.8, '2024-03-15 10:00:00+04', '2024-03-14 18:20:00+04', 0, 93,
 '{"endpoint": "https://api.malaffi.ae/fhir/R4/metadata", "ssl_valid": true, "certificate_expiry": "2025-08-15T23:59:59Z"}'),

('hie-health-malaffi-auth-uuid', 'hie-malaffi-uuid', 'auth', 'healthy', 250, 0.0, '2024-03-15 10:00:00+04', NULL, 0, 100,
 '{"certificate_valid": true, "certificate_expiry": "2025-08-15T23:59:59Z", "mutual_tls": true}'),

('hie-health-malaffi-api-uuid', 'hie-malaffi-uuid', 'api_response', 'degraded', 450, 3.5, '2024-03-15 10:00:00+04', '2024-03-15 09:30:00+04', 1, 78,
 '{"avg_response_time": 420, "success_rate": 96.5, "rate_limit_remaining": 800, "rate_limit_reset": "2024-03-15T11:00:00Z", "degraded_reason": "High load"}'),

-- Riayati Health Status
('hie-health-riayati-connectivity-uuid', 'hie-riayati-uuid', 'connectivity', 'healthy', 220, 1.0, '2024-03-15 10:00:00+04', '2024-03-14 20:15:00+04', 0, 91,
 '{"endpoint": "https://api.riayati.ae/fhir/R4/metadata", "ssl_valid": true, "certificate_expiry": "2025-06-30T23:59:59Z"}'),

('hie-health-riayati-auth-uuid', 'hie-riayati-uuid', 'auth', 'healthy', 280, 0.0, '2024-03-15 10:00:00+04', NULL, 0, 100,
 '{"token_valid": true, "token_expires": "2024-03-15T11:30:00Z", "scope_valid": true, "pkce_valid": true}'),

('hie-health-riayati-api-uuid', 'hie-riayati-uuid', 'api_response', 'healthy', 350, 2.1, '2024-03-15 10:00:00+04', '2024-03-15 09:15:00+04', 0, 88,
 '{"avg_response_time": 320, "success_rate": 97.9, "rate_limit_remaining": 1200, "rate_limit_reset": "2024-03-15T11:00:00Z"}'),

-- Historical health data (for trending)
('hie-health-nabidh-historical-1-uuid', 'hie-nabidh-uuid', 'api_response', 'healthy', 280, 0.8, '2024-03-14 10:00:00+04', '2024-03-14 09:45:00+04', 0, 94,
 '{"avg_response_time": 260, "success_rate": 99.2, "rate_limit_remaining": 980}'),

('hie-health-nabidh-historical-2-uuid', 'hie-nabidh-uuid', 'api_response', 'healthy', 320, 1.5, '2024-03-13 10:00:00+04', '2024-03-13 09:30:00+04', 0, 90,
 '{"avg_response_time": 300, "success_rate": 98.5, "rate_limit_remaining": 920}'),

('hie-health-malaffi-historical-1-uuid', 'hie-malaffi-uuid', 'api_response', 'healthy', 380, 2.0, '2024-03-14 10:00:00+04', '2024-03-14 09:20:00+04', 0, 85,
 '{"avg_response_time": 350, "success_rate": 98.0, "rate_limit_remaining": 850}'),

('hie-health-riayati-historical-1-uuid', 'hie-riayati-uuid', 'api_response', 'healthy', 400, 1.8, '2024-03-14 10:00:00+04', '2024-03-14 09:10:00+04', 0, 87,
 '{"avg_response_time": 380, "success_rate": 98.2, "rate_limit_remaining": 1100}'),

-- Down status example (for alerting testing)
('hie-health-nabidh-down-uuid', 'hie-nabidh-uuid', 'connectivity', 'down', NULL, 100.0, '2024-03-14 15:00:00+04', '2024-03-15 10:00:00+04', 5, 0,
 '{"endpoint": "https://api.nabidh.ae/fhir/R4/metadata", "ssl_valid": false, "error": "Connection timeout", "last_check": "2024-03-15T10:00:00Z"}');
