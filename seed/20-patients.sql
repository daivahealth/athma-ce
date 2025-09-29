-- Seed Data: Patients
-- Execution Order: 20 (Depends on tenants)

-- Set tenant context
SET app.current_tenant_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO patients (id, tenant_id, mrn, first_name, last_name, date_of_birth, gender, 
                      email, phone, status, demographics) VALUES
('patient-ahmed-uuid', '11111111-1111-1111-1111-111111111111', 'MRN001', 
 'Ahmed', 'Al Mansoori', '1985-03-15', 'male', 
 'ahmed.mansoori@example.ae', '+971501234567', 'active',
 '{"nationality":"UAE","marital_status":"married","occupation":"Engineer","emergency_contact":{"name":"Fatima Al Mansoori","phone":"+971502345678","relation":"spouse"}}'::jsonb),

('patient-fatima-uuid', '11111111-1111-1111-1111-111111111111', 'MRN002',
 'Fatima', 'Hassan', '1990-07-22', 'female',
 'fatima.hassan@example.ae', '+971509876543', 'active',
 '{"nationality":"UAE","marital_status":"single","occupation":"Teacher","emergency_contact":{"name":"Sara Hassan","phone":"+971503456789","relation":"mother"}}'::jsonb),

('patient-john-uuid', '11111111-1111-1111-1111-111111111111', 'MRN003',
 'John', 'Smith', '1978-11-08', 'male',
 'john.smith@example.ae', '+971555555555', 'active',
 '{"nationality":"UK","marital_status":"married","occupation":"Manager","emergency_contact":{"name":"Mary Smith","phone":"+971556666666","relation":"spouse"}}'::jsonb),

('patient-sara-uuid', '11111111-1111-1111-1111-111111111111', 'MRN004',
 'Sara', 'Al Zaabi', '2015-02-10', 'female',
 'sara.alzaabi@example.ae', '+971507777777', 'active',
 '{"nationality":"UAE","marital_status":"single","occupation":"Student","emergency_contact":{"name":"Maryam Al Zaabi","phone":"+971508888888","relation":"mother"}}'::jsonb);

-- Verify
SELECT mrn, first_name, last_name, gender, phone FROM patients ORDER BY mrn;
