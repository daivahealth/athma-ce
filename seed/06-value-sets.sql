-- Seed Data: Value Sets and Members
-- Execution Order: 6 (Depends on concepts)

-- Create Value Sets
INSERT INTO value_sets (id, name, description, version, status, immutable) VALUES
('vs-visit-category', 'visit-category', 'Visit category classification', '1.0', 'active', FALSE),
('vs-encounter-source', 'encounter-source', 'Encounter source types', '1.0', 'active', FALSE),
('vs-urgency-level', 'urgency-level', 'Clinical urgency levels', '1.0', 'active', FALSE);

-- Value Set Members: Visit Category
INSERT INTO value_set_members (value_set_id, concept_id, include) VALUES
('vs-visit-category', 'concept-new-visit', TRUE),
('vs-visit-category', 'concept-revisit', TRUE),
('vs-visit-category', 'concept-followup', TRUE),
('vs-visit-category', 'concept-postop', TRUE),
('vs-visit-category', 'concept-emergency', TRUE);

-- Value Set Members: Encounter Source
INSERT INTO value_set_members (value_set_id, concept_id, include) VALUES
('vs-encounter-source', 'concept-enc-appt', TRUE),
('vs-encounter-source', 'concept-enc-walkin', TRUE),
('vs-encounter-source', 'concept-enc-emerg', TRUE),
('vs-encounter-source', 'concept-enc-tele', TRUE);

-- Value Set Members: Urgency Level
INSERT INTO value_set_members (value_set_id, concept_id, include) VALUES
('vs-urgency-level', 'concept-urg-low', TRUE),
('vs-urgency-level', 'concept-urg-med', TRUE),
('vs-urgency-level', 'concept-urg-high', TRUE),
('vs-urgency-level', 'concept-urg-urgent', TRUE);

-- Verify
SELECT vs.name, c.code, c.display_default
FROM value_sets vs
JOIN value_set_members vsm ON vsm.value_set_id = vs.id
JOIN concepts c ON c.id = vsm.concept_id
WHERE vsm.include = TRUE
ORDER BY vs.name, c.sort_order;
