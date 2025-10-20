-- Enhanced Facility Hierarchy Migration
-- Adds Department, Ward, Bed, Clinic models and enhances Facility with geocodes

-- =====================================================
-- PHASE 1: Add new fields to existing Facility table
-- =====================================================

-- Add location and geocode fields to facilities
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'UAE';
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS building_number VARCHAR(50);
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS floor_numbers TEXT[];
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS total_floors INTEGER;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS capacity INTEGER;

-- Add indexes for geocode queries
CREATE INDEX IF NOT EXISTS idx_facilities_geocode ON facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_city ON facilities(tenant_id, city);
CREATE INDEX IF NOT EXISTS idx_facilities_emirate ON facilities(tenant_id, emirate);
CREATE UNIQUE INDEX IF NOT EXISTS idx_facilities_code ON facilities(tenant_id, code) WHERE code IS NOT NULL;

-- =====================================================
-- PHASE 2: Create new Department table
-- =====================================================

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  department_type VARCHAR(50) NOT NULL,
  head_of_department UUID REFERENCES staff(id),
  floor_number VARCHAR(10),
  phone_extension VARCHAR(20),
  operating_hours JSONB,
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  
  CONSTRAINT departments_facility_code_unique UNIQUE (facility_id, code)
);

CREATE INDEX IF NOT EXISTS idx_departments_facility ON departments(facility_id, department_type);

-- =====================================================
-- PHASE 3: Create new Ward table (IPD)
-- =====================================================

CREATE TABLE IF NOT EXISTS wards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  ward_type VARCHAR(50) NOT NULL,
  floor_number VARCHAR(10),
  total_beds INTEGER DEFAULT 0 NOT NULL,
  available_beds INTEGER DEFAULT 0 NOT NULL,
  nursing_station VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  
  CONSTRAINT wards_department_code_unique UNIQUE (department_id, code)
);

CREATE INDEX IF NOT EXISTS idx_wards_department ON wards(department_id, ward_type);

-- =====================================================
-- PHASE 4: Create new Bed table (IPD)
-- =====================================================

CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
  bed_number VARCHAR(20) NOT NULL,
  bed_type VARCHAR(50) NOT NULL,
  features JSONB,
  status VARCHAR(50) DEFAULT 'available' NOT NULL,
  current_patient_id UUID REFERENCES patients(id),
  assigned_at TIMESTAMPTZ(6),
  created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  
  CONSTRAINT beds_ward_number_unique UNIQUE (ward_id, bed_number)
);

CREATE INDEX IF NOT EXISTS idx_beds_ward_status ON beds(ward_id, status);
CREATE INDEX IF NOT EXISTS idx_beds_patient ON beds(current_patient_id);

-- =====================================================
-- PHASE 5: Create new Clinic table (OPD)
-- =====================================================

CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  specialty VARCHAR(100),
  floor_number VARCHAR(10),
  total_rooms INTEGER DEFAULT 0 NOT NULL,
  operating_hours JSONB,
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ(6) DEFAULT NOW() NOT NULL,
  
  CONSTRAINT clinics_department_code_unique UNIQUE (department_id, code)
);

CREATE INDEX IF NOT EXISTS idx_clinics_department ON clinics(department_id, specialty);

-- =====================================================
-- PHASE 6: Update existing Space table
-- =====================================================

-- Add new fields to spaces
ALTER TABLE spaces ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);
ALTER TABLE spaces ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);
ALTER TABLE spaces ADD COLUMN IF NOT EXISTS floor_number VARCHAR(10);

-- Add indexes for new relationships
CREATE INDEX IF NOT EXISTS idx_spaces_department ON spaces(facility_id, department_id);
CREATE INDEX IF NOT EXISTS idx_spaces_clinic ON spaces(clinic_id);

-- =====================================================
-- PHASE 7: Data Migration (Optional - run separately)
-- =====================================================

-- Generate facility codes for existing facilities
-- UPDATE facilities
-- SET code = CONCAT(
--   UPPER(SUBSTRING(COALESCE(city, 'UAE') FROM 1 FOR 3)),
--   '-',
--   UPPER(SUBSTRING(facility_type FROM 1 FOR 4)),
--   '-',
--   LPAD(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at)::TEXT, 2, '0')
-- )
-- WHERE code IS NULL;

-- Create default OPD department for each facility
-- INSERT INTO departments (id, facility_id, name, code, department_type, status)
-- SELECT 
--   uuid_generate_v4(),
--   id,
--   'Outpatient Department',
--   'OPD',
--   'opd',
--   'active'
-- FROM facilities
-- WHERE NOT EXISTS (
--   SELECT 1 FROM departments d 
--   WHERE d.facility_id = facilities.id 
--   AND d.department_type = 'opd'
-- );

-- Create default clinic for each OPD department
-- INSERT INTO clinics (id, department_id, name, code, status)
-- SELECT 
--   uuid_generate_v4(),
--   id,
--   'General Clinic',
--   'GEN-CLINIC',
--   'active'
-- FROM departments 
-- WHERE department_type = 'opd'
-- AND NOT EXISTS (
--   SELECT 1 FROM clinics c 
--   WHERE c.department_id = departments.id
-- );

-- Link existing spaces to departments/clinics
-- UPDATE spaces s
-- SET 
--   department_id = d.id,
--   clinic_id = c.id
-- FROM departments d
-- JOIN clinics c ON c.department_id = d.id
-- WHERE s.facility_id = d.facility_id
--   AND d.department_type = 'opd'
--   AND s.department_id IS NULL;

-- =====================================================
-- PHASE 8: Add triggers for updated_at timestamps
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for new tables
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wards_updated_at BEFORE UPDATE ON wards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON beds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PHASE 9: Add comments for documentation
-- =====================================================

COMMENT ON TABLE departments IS 'Functional units within facilities (OPD, IPD, Radiology, etc.)';
COMMENT ON TABLE wards IS 'IPD-specific groupings of beds for inpatient care';
COMMENT ON TABLE beds IS 'Individual beds for patient admission in wards';
COMMENT ON TABLE clinics IS 'OPD-specific groupings of consultation rooms';

COMMENT ON COLUMN facilities.latitude IS 'Latitude coordinate (Decimal 10,8 for ~1.1mm precision)';
COMMENT ON COLUMN facilities.longitude IS 'Longitude coordinate (Decimal 11,8 for ~1.1mm precision)';
COMMENT ON COLUMN facilities.google_place_id IS 'Google Maps Place ID for integration';

-- =====================================================
-- Migration Complete
-- =====================================================
