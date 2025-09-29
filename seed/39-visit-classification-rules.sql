-- Seed Data: Visit Classification Rules
-- Execution Order: 39 (Depends on tenants, payers, concepts)

SET app.current_tenant_id = '11111111-1111-1111-1111-111111111111';

-- Default rule (applies to all payers/specialties)
INSERT INTO visit_classification_rules (
    tenant_id, payer_id, specialty, scope,
    new_lookback_days, followup_window_days,
    must_link_for_followup, apply_same_staff,
    apply_same_specialty, apply_same_facility,
    priority, is_active, notes
) VALUES
('11111111-1111-1111-1111-111111111111', NULL, NULL, 'provider',
 1095, 30, TRUE, TRUE, FALSE, FALSE,
 100, TRUE, 'Default rule: NEW if no visit in 3 years, FOLLOW_UP if linked within 30 days');

-- Specialty-specific rule: Pediatrics (shorter lookback)
INSERT INTO visit_classification_rules (
    tenant_id, payer_id, specialty, scope,
    new_lookback_days, followup_window_days,
    must_link_for_followup, apply_same_staff,
    apply_same_specialty, apply_same_facility,
    priority, is_active, notes
) VALUES
('11111111-1111-1111-1111-111111111111', NULL, 'PED', 'specialty',
 730, 14, TRUE, FALSE, TRUE, FALSE,
 200, TRUE, 'Pediatrics: NEW if no visit in 2 years, FOLLOW_UP within 14 days (any pediatrician)');

-- Payer-specific rule: Daman (requires same facility)
INSERT INTO visit_classification_rules (
    tenant_id, payer_id, specialty, scope,
    new_lookback_days, followup_window_days,
    must_link_for_followup, apply_same_staff,
    apply_same_specialty, apply_same_facility,
    priority, is_active, notes
) VALUES
('11111111-1111-1111-1111-111111111111', 'payer-daman-uuid', NULL, 'facility',
 1095, 30, TRUE, FALSE, FALSE, TRUE,
 300, TRUE, 'Daman: Requires same facility for REVISIT classification');

-- Emergency visits (always NEW unless explicitly linked)
INSERT INTO visit_classification_rules (
    tenant_id, payer_id, specialty, scope,
    new_lookback_days, followup_window_days,
    must_link_for_followup, apply_same_staff,
    apply_same_specialty, apply_same_facility,
    priority, is_active, notes
) VALUES
('11111111-1111-1111-1111-111111111111', NULL, 'EMERG', 'provider',
 0, 7, FALSE, FALSE, FALSE, FALSE,
 400, TRUE, 'Emergency: Always NEW unless linked within 7 days');

-- Verify
SELECT 
    COALESCE(p.name, 'All Payers') as payer,
    COALESCE(specialty, 'All Specialties') as specialty,
    scope, new_lookback_days, followup_window_days,
    priority, notes
FROM visit_classification_rules r
LEFT JOIN payers p ON p.id = r.payer_id
ORDER BY priority DESC;
