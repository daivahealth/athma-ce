-- Seed Data: Value Sets and Members
-- Execution Order: 6 (Depends on concepts)

-- Create Value Sets
INSERT INTO value_sets (id, name, description, version, status, immutable) VALUES
(uuid_from_text('vs-visit-category'), uuid_from_text('visit-category'), 'Visit category classification', '1.0', 'active', FALSE),
(uuid_from_text('vs-encounter-source'), uuid_from_text('encounter-source'), 'Encounter source types', '1.0', 'active', FALSE),
(uuid_from_text('vs-urgency-level'), uuid_from_text('urgency-level'), 'Clinical urgency levels', '1.0', 'active', FALSE);

-- Value Set Members: Visit Category
INSERT INTO value_set_members (value_set_id, concept_id, include) VALUES
(uuid_from_text('vs-visit-category'), uuid_from_text('concept-new-visit'), TRUE),
(uuid_from_text('vs-visit-category'), uuid_from_text('concept-revisit'), TRUE),
(uuid_from_text('vs-visit-category'), uuid_from_text('concept-followup'), TRUE),
(uuid_from_text('vs-visit-category'), uuid_from_text('concept-postop'), TRUE),
(uuid_from_text('vs-visit-category'), uuid_from_text('concept-emergency'), TRUE);

-- Value Set Members: Encounter Source
INSERT INTO value_set_members (value_set_id, concept_id, include) VALUES
(uuid_from_text('vs-encounter-source'), uuid_from_text('concept-enc-appt'), TRUE),
(uuid_from_text('vs-encounter-source'), uuid_from_text('concept-enc-walkin'), TRUE),
(uuid_from_text('vs-encounter-source'), uuid_from_text('concept-enc-emerg'), TRUE),
(uuid_from_text('vs-encounter-source'), uuid_from_text('concept-enc-tele'), TRUE);

-- Value Set Members: Urgency Level
INSERT INTO value_set_members (value_set_id, concept_id, include) VALUES
(uuid_from_text('vs-urgency-level'), uuid_from_text('concept-urg-low'), TRUE),
(uuid_from_text('vs-urgency-level'), uuid_from_text('concept-urg-med'), TRUE),
(uuid_from_text('vs-urgency-level'), uuid_from_text('concept-urg-high'), TRUE),
(uuid_from_text('vs-urgency-level'), uuid_from_text('concept-urg-urgent'), TRUE);

-- Verify
SELECT vs.name, c.code, c.display_default
FROM value_sets vs
JOIN value_set_members vsm ON vsm.value_set_id = vs.id
JOIN concepts c ON c.id = vsm.concept_id
WHERE vsm.include = TRUE
ORDER BY vs.name, c.sort_order;
