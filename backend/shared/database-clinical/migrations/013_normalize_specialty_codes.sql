-- Normalise specialty references in the clinical DB to foundation specialty
-- master codes (specialties.code, e.g. CARDIO, GEN_MED, PED). Idempotent.
-- See docs/features/specialty-management/SPECIALTIES-MASTER-TABLE.md.

-- vital_signs_templates.specialties: legacy lowercase names -> master codes
UPDATE vital_signs_templates t
SET specialties = (
  SELECT COALESCE(array_agg(DISTINCT mapped ORDER BY mapped), ARRAY[]::text[])
  FROM (
    SELECT CASE lower(s)
      WHEN 'general_medicine'   THEN 'GEN_MED'
      WHEN 'internal_medicine'  THEN 'GEN_MED'
      WHEN 'family_medicine'    THEN 'FAM_MED'
      WHEN 'cardiology'         THEN 'CARDIO'
      WHEN 'pediatrics'         THEN 'PED'
      WHEN 'paediatrics'        THEN 'PED'
      WHEN 'neonatology'        THEN 'NEONAT'
      WHEN 'emergency_medicine' THEN 'EMERG'
      WHEN 'critical_care'      THEN 'CRIT_CARE'
      WHEN 'intensive_care'     THEN 'CRIT_CARE'
      ELSE upper(s)
    END AS mapped
    FROM unnest(t.specialties) AS s
  ) m
)
WHERE EXISTS (SELECT 1 FROM unnest(t.specialties) s WHERE s <> upper(s));

-- ot_room_configs.specialty was free text. Map known names (and values that
-- are already codes in any case) to master codes; anything unrecognised is left
-- untouched and shows as "not in specialty master" in the UI for an admin to re-pick.
UPDATE ot_room_configs
SET specialty = CASE lower(trim(specialty))
    WHEN 'general_surgery'  THEN 'GEN_SURG'
    WHEN 'general surgery'  THEN 'GEN_SURG'
    WHEN 'orthopaedics'     THEN 'ORTHO'
    WHEN 'orthopedics'      THEN 'ORTHO'
    WHEN 'ortho'            THEN 'ORTHO'
    WHEN 'neurosurgery'     THEN 'NEURO_SURG'
    WHEN 'cardiac_hybrid'   THEN 'CARDIO_SURG'
    WHEN 'cardiac'          THEN 'CARDIO_SURG'
    WHEN 'cardiothoracic'   THEN 'CARDIO_SURG'
    WHEN 'plastic_surgery'  THEN 'PLASTIC'
    WHEN 'obstetrics'       THEN 'OBGYN'
    WHEN 'gynaecology'      THEN 'OBGYN'
    WHEN 'gynecology'       THEN 'OBGYN'
    ELSE upper(trim(specialty))
  END
WHERE specialty IS NOT NULL
  AND (
    lower(trim(specialty)) IN (
      'general_surgery','general surgery','orthopaedics','orthopedics','ortho','neurosurgery',
      'cardiac_hybrid','cardiac','cardiothoracic','plastic_surgery','obstetrics',
      'gynaecology','gynecology'
    )
    OR (
      upper(trim(specialty)) IN (
        'GEN_MED','FAM_MED','GEN_SURG','ORTHO','NEURO_SURG','CARDIO_SURG','PLASTIC','CARDIO',
        'PULMO','GASTRO','NEPHRO','ENDO','NEURO','ONCO','PED','NEONAT','OBGYN','RAD','PATH',
        'DERM','OPHTHAL','ENT','PSYCH','ANESTH','EMERG','CRIT_CARE'
      )
      AND specialty <> upper(trim(specialty))
    )
  );
