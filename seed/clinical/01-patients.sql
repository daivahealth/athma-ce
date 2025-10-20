TRUNCATE patients CASCADE;

INSERT INTO patients (
  id, tenant_id, emirates_id, first_name, last_name, date_of_birth, gender,
  phone_number, email, status, created_at, updated_at
) VALUES
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '784-1980-1234567-1', 'Hassan', 'Al-Najjar', '1980-02-15', 'male',
   '+971-50-222-3333', 'hassan.najjar@example.ae', 'active', NOW(), NOW()),
  ('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', '784-1988-7654321-2', 'Maryam', 'Al-Khalidi', '1988-07-04', 'female',
   '+971-50-444-5555', 'maryam.khalidi@example.ae', 'active', NOW(), NOW());
