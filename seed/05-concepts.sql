-- Seed Data: Concepts (Coded Values)
-- Execution Order: 5 (Depends on code_systems)

-- Visit Category Concepts
INSERT INTO concepts (id, code_system_id, code, display_default, definition, sort_order, is_active) VALUES
('concept-new-visit', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'NEW', 'New Visit', 
 'First visit with provider or after significant time gap', 10, TRUE),
('concept-revisit', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'REVISIT', 'Revisit', 
 'Return visit within established care period', 20, TRUE),
('concept-followup', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'FOLLOW_UP', 'Follow-up', 
 'Scheduled follow-up for ongoing condition', 30, TRUE),
('concept-postop', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'POST_OP', 'Post-Operative Follow-up', 
 'Follow-up after surgical procedure', 40, TRUE),
('concept-emergency', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EMERGENCY', 'Emergency Visit', 
 'Urgent unscheduled visit', 50, TRUE);

-- Encounter Source Concepts
INSERT INTO concepts (id, code_system_id, code, display_default, definition, sort_order, is_active) VALUES
('concept-enc-appt', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'APPOINTMENT', 'Appointment-based', 
 'Scheduled appointment encounter', 10, TRUE),
('concept-enc-walkin', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'WALK_IN', 'Walk-in', 
 'Unscheduled walk-in encounter', 20, TRUE),
('concept-enc-emerg', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'EMERGENCY', 'Emergency', 
 'Emergency encounter', 30, TRUE),
('concept-enc-tele', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'TELEMEDICINE', 'Telemedicine', 
 'Remote video/phone consultation', 40, TRUE);

-- Urgency Level Concepts
INSERT INTO concepts (id, code_system_id, code, display_default, definition, sort_order, is_active) VALUES
('concept-urg-low', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'LOW', 'Low Urgency', 
 'Routine, non-urgent care', 10, TRUE),
('concept-urg-med', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'MEDIUM', 'Medium Urgency', 
 'Should be seen soon but not critical', 20, TRUE),
('concept-urg-high', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'HIGH', 'High Urgency', 
 'Needs prompt attention', 30, TRUE),
('concept-urg-urgent', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'URGENT', 'Urgent/Critical', 
 'Immediate medical attention required', 40, TRUE);

-- Concept Translations (Arabic)
INSERT INTO concept_translations (concept_id, language_code, display, definition) VALUES
('concept-new-visit', 'ar', 'زيارة جديدة', 'أول زيارة مع المزود أو بعد فترة زمنية طويلة'),
('concept-revisit', 'ar', 'زيارة متابعة', 'زيارة عودة ضمن فترة الرعاية المحددة'),
('concept-followup', 'ar', 'متابعة', 'متابعة مجدولة لحالة مستمرة'),
('concept-postop', 'ar', 'متابعة بعد العملية', 'متابعة بعد إجراء جراحي'),
('concept-emergency', 'ar', 'زيارة طارئة', 'زيارة عاجلة غير مجدولة');

-- Verify
SELECT cs.system_uri, c.code, c.display_default, c.is_active 
FROM concepts c
JOIN code_systems cs ON cs.id = c.code_system_id
ORDER BY cs.system_uri, c.sort_order;
