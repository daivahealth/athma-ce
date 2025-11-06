-- Migration: Add Name Titles ValueSet
-- Description: Add name titles/prefixes for patient names
-- Author: System
-- Date: 2025-11-06

-- ============================================================================
-- NAME TITLES/PREFIXES
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, is_system, is_extensible)
VALUES (
  'name_titles',
  'Name Titles',
  'Titles and prefixes for person names (Mr., Mrs., Dr., etc.)',
  'demographics',
  true,
  true
) ON CONFLICT (code) DO NOTHING;

INSERT INTO value_set_concepts (value_set_id, value_set_code, code, display, definition, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'name_titles'),
  'name_titles',
  code,
  display,
  definition,
  sort_order,
  'active'
FROM (VALUES
  ('mr', 'Mr.', 'Mister - male honorific', 1),
  ('mrs', 'Mrs.', 'Mistress - married female honorific', 2),
  ('ms', 'Ms.', 'Female honorific (marital status neutral)', 3),
  ('miss', 'Miss', 'Unmarried female honorific', 4),
  ('dr', 'Dr.', 'Doctor - medical or academic doctorate', 5),
  ('prof', 'Prof.', 'Professor - academic title', 6),
  ('sheikh', 'Sheikh', 'Islamic honorific title', 7),
  ('sheikha', 'Sheikha', 'Islamic honorific title (female)', 8),
  ('eng', 'Eng.', 'Engineer - professional title', 9),
  ('capt', 'Capt.', 'Captain - military or aviation rank', 10),
  ('col', 'Col.', 'Colonel - military rank', 11),
  ('gen', 'Gen.', 'General - military rank', 12),
  ('hon', 'Hon.', 'Honorable - government official title', 13),
  ('rev', 'Rev.', 'Reverend - religious title', 14),
  ('sir', 'Sir.', 'Sir - knighthood or honorific', 15),
  ('dame', 'Dame', 'Dame - female equivalent of knighthood', 16),
  ('master', 'Master', 'Young male (under 18)', 17)
) AS titles(code, display, definition, sort_order)
ON CONFLICT (value_set_code, code) DO NOTHING;

-- Arabic translations
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('mr', 'السيد'),
  ('mrs', 'السيدة'),
  ('ms', 'الآنسة'),
  ('miss', 'الآنسة'),
  ('dr', 'د.'),
  ('prof', 'أ.د.'),
  ('sheikh', 'الشيخ'),
  ('sheikha', 'الشيخة'),
  ('eng', 'م.'),
  ('capt', 'النقيب'),
  ('col', 'العقيد'),
  ('gen', 'الجنرال'),
  ('hon', 'المحترم'),
  ('rev', 'القس'),
  ('sir', 'السير'),
  ('dame', 'السيدة'),
  ('master', 'الصغير')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'name_titles'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Uncomment to verify data after migration:
-- SELECT vs.code, vs.name, COUNT(vsc.id) as concept_count
-- FROM value_sets vs
-- LEFT JOIN value_set_concepts vsc ON vs.id = vsc.value_set_id
-- WHERE vs.code = 'name_titles'
-- GROUP BY vs.id, vs.code, vs.name;
