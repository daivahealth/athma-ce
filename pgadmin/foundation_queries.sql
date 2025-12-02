select * from staff



node -e "const argon2 = require('argon2'); (async () => { console.log(await argon2.hash('Passw0rd!')); process.exit(); })();"

select * from users
UPDATE users
SET password_hash = '$argon2id$v=19$m=65536,t=3,p=4$ysZ9w89w0Rzm830wl+vfYA$lX+oQh/4sTLjrtOc2ZJZYSxXucGcBO6rcFWO2jdn1nY', updated_at = NOW()
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

select * from lab_test_master

select * from beds



select * from roles

select * from tenants

select * from diagnosis_master
select * from diagnosis_versions

SELECT * 
FROM instance_configs 
WHERE config_key LIKE '%encounter%';


select * from note_templates
select * from note_template_versions

BEGIN;

-- 1. Delete all versions for this template
DELETE FROM note_template_versions
WHERE template_id = '04eac1b0-e9e9-4e88-b791-2976a64cf08c';

-- 2. Delete the template itself
DELETE FROM note_templates
WHERE id = '04eac1b0-e9e9-4e88-b791-2976a64cf08c';

COMMIT;


SELECT * 
FROM tenant_configs 
WHERE config_key LIKE '%encounter%';


INSERT INTO instance_configs (config_key, value, value_type, category, description, is_overridable, is_sensitive)
VALUES
('clinical.encounter_number_format', '"ENC-{YEAR}-{SEQ:6}"', 'string', 'clinical', 'Encounter number format pattern (e.g., ENC-{YEAR}-{SEQ:6})', true, false)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();

	ALTER TABLE instance_configs
ALTER COLUMN id SET DEFAULT gen_random_uuid();

INSERT INTO instance_configs
  (config_key, value, value_type, category, description, is_overridable, is_sensitive, updated_at)
VALUES
  ('clinical.encounter_number_format',
   '"ENC-{YEAR}-{SEQ:6}"',
   'string',
   'clinical',
   'Encounter number format pattern (e.g., ENC-{YEAR}-{SEQ:6})',
   TRUE,
   FALSE,
   NOW())
ON CONFLICT (config_key) DO UPDATE SET
    value           = EXCLUDED.value,
    value_type      = EXCLUDED.value_type,
    category        = EXCLUDED.category,
    description     = EXCLUDED.description,
    is_overridable  = EXCLUDED.is_overridable,
    is_sensitive    = EXCLUDED.is_sensitive,
    updated_at      = NOW();


