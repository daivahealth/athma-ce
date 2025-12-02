DROP FUNCTION IF EXISTS uuid_from_text(text);

 CREATE OR REPLACE FUNCTION uuid_from_text(input text)
     RETURNS uuid LANGUAGE sql IMMUTABLE AS $fn$
       SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, input);
     $fn$;

ALTER TABLE staff_schedules
  ADD COLUMN IF NOT EXISTS staff_type VARCHAR(50);

TRUNCATE TABLE patients RESTART IDENTITY CASCADE;
select * from patients\

select * from encounter_notes
select * from encounter_note_sections



select * from prescription_orders

select * from encounters

select * from triage

select * from appointments

only one encounter per doctor per patient per day



select * from staff_schedules

TRUNCATE TABLE staff_schedules RESTART IDENTITY CASCADE;

TRUNCATE TABLE appointments RESTART IDENTITY CASCADE;

TRUNCATE TABLE encounters RESTART IDENTITY CASCADE;

TRUNCATE TABLE patients RESTART IDENTITY CASCADE;

select * from appointments

select* from clinical_note_sections
select* from clinical_orders
select* from prescription_orders

select * from encounter_notes
select * from encounter_note_sections

BEGIN;
DELETE FROM encounter_note_sections
WHERE note_id = '9b17d9b3-1611-4c49-b88e-44266bff04a2';
DELETE FROM encounter_notes
WHERE id = '9b17d9b3-1611-4c49-b88e-44266bff04a2';
COMMIT;



select * from encounter_diagnoses

select * from encounters

select * from triage

select * from appointment_resources
select * from appointment_resource_requirements

 DELETE FROM patients WHERE tenant_id = 'uuid_from_text(''tenant-demo-0001'')';

 ALTER TABLE staff_schedules DROP COLUMN IF EXISTS staff_code;


