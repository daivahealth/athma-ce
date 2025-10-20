-- Seed Data: Concepts (Coded Values)
-- Execution Order: 5 (Depends on code_systems)

-- Visit Category Concepts
INSERT INTO concepts (id, code_system_id, code, display_default, definition, sort_order, is_active) VALUES
(uuid_from_text('concept-new-visit'), uuid_from_text('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'NEW', 'New Visit', 
 'First visit with provider or after significant time gap', 10, TRUE),
(uuid_from_text('concept-revisit'), uuid_from_text('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'REVISIT', 'Revisit', 
 'Return visit within established care period', 20, TRUE),
(uuid_from_text('concept-followup'), uuid_from_text('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'FOLLOW_UP', 'Follow-up', 
 'Scheduled follow-up for ongoing condition', 30, TRUE),
(uuid_from_text('concept-postop'), uuid_from_text('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'POST_OP', 'Post-Operative Follow-up', 
 'Follow-up after surgical procedure', 40, TRUE),
(uuid_from_text('concept-emergency'), uuid_from_text('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'EMERGENCY', 'Emergency Visit', 
 'Urgent unscheduled visit', 50, TRUE);

-- Encounter Source Concepts
INSERT INTO concepts (id, code_system_id, code, display_default, definition, sort_order, is_active) VALUES
(uuid_from_text('concept-enc-appt'), uuid_from_text('dddddddd-dddd-dddd-dddd-dddddddddddd'), 'APPOINTMENT', 'Appointment-based', 
 'Scheduled appointment encounter', 10, TRUE),
(uuid_from_text('concept-enc-walkin'), uuid_from_text('dddddddd-dddd-dddd-dddd-dddddddddddd'), 'WALK_IN', 'Walk-in', 
 'Unscheduled walk-in encounter', 20, TRUE),
(uuid_from_text('concept-enc-emerg'), uuid_from_text('dddddddd-dddd-dddd-dddd-dddddddddddd'), 'EMERGENCY', 'Emergency', 
 'Emergency encounter', 30, TRUE),
(uuid_from_text('concept-enc-tele'), uuid_from_text('dddddddd-dddd-dddd-dddd-dddddddddddd'), 'TELEMEDICINE', 'Telemedicine', 
 'Remote video/phone consultation', 40, TRUE);

-- Urgency Level Concepts
INSERT INTO concepts (id, code_system_id, code, display_default, definition, sort_order, is_active) VALUES
(uuid_from_text('concept-urg-low'), uuid_from_text('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'), 'LOW', 'Low Urgency', 
 'Routine, non-urgent care', 10, TRUE),
(uuid_from_text('concept-urg-med'), uuid_from_text('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'), 'MEDIUM', 'Medium Urgency', 
 'Should be seen soon but not critical', 20, TRUE),
(uuid_from_text('concept-urg-high'), uuid_from_text('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'), 'HIGH', 'High Urgency', 
 'Needs prompt attention', 30, TRUE),
(uuid_from_text('concept-urg-urgent'), uuid_from_text('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'), 'URGENT', 'Urgent/Critical', 
 'Immediate medical attention required', 40, TRUE);

-- Concept Translations (Arabic)
INSERT INTO concept_translations (concept_id, language_code, display, definition) VALUES
(uuid_from_text('concept-new-visit'), 'ar', 'زيارة جديدة', 'أول زيارة مع المزود أو بعد فترة زمنية طويلة'),
(uuid_from_text('concept-revisit'), 'ar', 'زيارة متابعة', 'زيارة عودة ضمن فترة الرعاية المحددة'),
(uuid_from_text('concept-followup'), 'ar', 'متابعة', 'متابعة مجدولة لحالة مستمرة'),
(uuid_from_text('concept-postop'), 'ar', 'متابعة بعد العملية', 'متابعة بعد إجراء جراحي'),
(uuid_from_text('concept-emergency'), 'ar', 'زيارة طارئة', 'زيارة عاجلة غير مجدولة');

-- Verify
SELECT cs.system_uri, c.code, c.display_default, c.is_active 
FROM concepts c
JOIN code_systems cs ON cs.id = c.code_system_id
ORDER BY cs.system_uri, c.sort_order;
