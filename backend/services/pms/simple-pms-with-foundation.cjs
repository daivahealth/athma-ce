const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'zeal_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zeal_pms',
  password: process.env.DB_PASSWORD || 'zeal_password',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Function to initialize database tables and insert sample data
async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database tables...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create tenants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
        domain VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        permissions JSONB DEFAULT '{}',
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tenant_id, email)
      )
    `);

    // Create facilities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        facility_type VARCHAR(50) DEFAULT 'clinic',
        license_number VARCHAR(100),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        emirate VARCHAR(50),
        postal_code VARCHAR(20),
        phone_number VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        operating_hours JSONB,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create staff table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        nationality VARCHAR(100) DEFAULT 'UAE',
        phone_number VARCHAR(20),
        email VARCHAR(255),
        employee_id VARCHAR(50) NOT NULL,
        staff_type VARCHAR(50) NOT NULL,
        specialties JSONB DEFAULT '[]',
        license_number VARCHAR(100),
        license_expiry DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tenant_id, employee_id)
      )
    `);

    // Create patients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        emirates_id VARCHAR(20) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        marital_status VARCHAR(20),
        nationality VARCHAR(100) DEFAULT 'UAE',
        phone_number VARCHAR(20),
        email VARCHAR(255),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        emirate VARCHAR(50),
        postal_code VARCHAR(20),
        blood_group VARCHAR(10),
        emergency_contact_name VARCHAR(255),
        emergency_contact_number VARCHAR(20),
        preferred_language VARCHAR(10) DEFAULT 'en',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create appointments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
        staff_id UUID REFERENCES staff(id),
        facility_id UUID REFERENCES facilities(id),
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled',
        appointment_type VARCHAR(50) NOT NULL,
        reason TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create audit log table
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS audit;
      CREATE TABLE IF NOT EXISTS audit.audit_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        table_name VARCHAR(255) NOT NULL,
        record_id UUID NOT NULL,
        operation_type VARCHAR(10) NOT NULL,
        old_data JSONB,
        new_data JSONB,
        changed_by UUID,
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
      CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);
      CREATE INDEX IF NOT EXISTS idx_facilities_tenant ON facilities(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_staff_tenant_employee ON staff(tenant_id, employee_id);
      CREATE INDEX IF NOT EXISTS idx_patients_emirates_id ON patients(emirates_id);
      CREATE INDEX IF NOT EXISTS idx_patients_tenant ON patients(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);

    console.log('✅ Connected to PostgreSQL database');

    // Check if tenants table is empty and insert sample data
    const { rows: tenantCount } = await pool.query('SELECT COUNT(*) FROM tenants');
    if (parseInt(tenantCount[0].count, 10) === 0) {
      console.log('📝 Inserting sample data...');
      
      // Insert sample tenant
      const { rows: tenantRows } = await pool.query(`
        INSERT INTO tenants (name, domain, settings, created_at, updated_at)
        VALUES ('Al Rashid Medical Center', 'alrashid.zeal.com', '{"timezone": "Asia/Dubai", "language": "en"}', NOW(), NOW())
        RETURNING id
      `);
      const tenantId = tenantRows[0].id;

      // Insert sample user
      await pool.query(`
        INSERT INTO users (tenant_id, email, first_name, last_name, password_hash, role, created_at, updated_at)
        VALUES ($1, 'admin@alrashid.com', 'Admin', 'User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K8K8K8', 'admin', NOW(), NOW())
      `, [tenantId]);

      // Insert sample facility
      await pool.query(`
        INSERT INTO facilities (tenant_id, name, facility_type, city, emirate, phone_number, email, created_at, updated_at)
        VALUES ($1, 'Al Rashid Medical Center - Main', 'clinic', 'Dubai', 'Dubai', '+971412345678', 'info@alrashid.com', NOW(), NOW())
      `, [tenantId]);

      // Insert sample staff
      await pool.query(`
        INSERT INTO staff (tenant_id, first_name, last_name, date_of_birth, gender, employee_id, staff_type, specialties, created_at, updated_at)
        VALUES ($1, 'Dr. Ahmed', 'Al-Rashid', '1980-01-15', 'male', 'EMP001', 'physician', '["internal_medicine", "cardiology"]', NOW(), NOW())
      `, [tenantId]);

      // Insert sample patients
      await pool.query(`
        INSERT INTO patients (tenant_id, emirates_id, first_name, last_name, date_of_birth, gender, phone_number, email, address_line1, city, emirate, nationality, status, created_at, updated_at)
        VALUES
          ($1, '784-1234-1234567-1', 'Ahmed', 'Al-Rashid', '1990-01-15', 'male', '+971501234567', 'ahmed@example.com', '123 Sheikh Zayed Road', 'Dubai', 'Dubai', 'UAE', 'active', NOW(), NOW()),
          ($1, '784-5678-7654321-2', 'Fatima', 'Al-Zahra', '1985-03-22', 'female', '+971507654321', 'fatima@example.com', '456 Corniche Road', 'Abu Dhabi', 'Abu Dhabi', 'UAE', 'active', NOW(), NOW()),
          ($1, '784-9012-3456789-3', 'Mohammed', 'Al-Sheikh', '1988-07-10', 'male', '+971509876543', 'mohammed@example.com', '789 Al Majaz', 'Sharjah', 'Sharjah', 'UAE', 'active', NOW(), NOW())
      `, [tenantId]);

      // Insert sample appointment
      await pool.query(`
        INSERT INTO appointments (tenant_id, patient_id, staff_id, facility_id, start_time, end_time, appointment_type, notes, status, created_at, updated_at)
        SELECT
          $1,
          p.id,
          s.id,
          f.id,
          NOW() + INTERVAL '1 day',
          NOW() + INTERVAL '1 day' + INTERVAL '30 minutes',
          'consultation',
          'Regular checkup',
          'scheduled',
          NOW(),
          NOW()
        FROM patients p, staff s, facilities f
        WHERE p.emirates_id = '784-1234-1234567-1'
        AND s.employee_id = 'EMP001'
        AND f.name = 'Al Rashid Medical Center - Main'
        LIMIT 1
      `, [tenantId]);
    }
    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Helper for pagination
const getPagination = (page = 1, limit = 20) => ({
  offset: (page - 1) * limit,
  limit: limit,
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();
    res.status(200).json({
      status: 'healthy',
      service: 'PMS Service with Foundation Data',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        connected: true,
        info: result.rows[0].version,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      service: 'PMS Service with Foundation Data',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        connected: false,
        error: error.message,
      },
    });
  }
});

// Get database statistics
app.get('/api/v1/pms/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM tenants WHERE status = 'active') as total_tenants,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT COUNT(*) FROM facilities WHERE status = 'active') as total_facilities,
        (SELECT COUNT(*) FROM staff WHERE status = 'active') as total_staff,
        (SELECT COUNT(*) FROM patients WHERE status = 'active') as total_patients,
        (SELECT COUNT(*) FROM appointments) as total_appointments,
        (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') as scheduled_appointments,
        (SELECT COUNT(*) FROM appointments WHERE start_time >= NOW()) as upcoming_appointments
    `);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// ============================================================================
// TENANT ROUTES
// ============================================================================

app.get('/api/v1/pms/tenants', async (req, res) => {
  const { page, limit, query } = req.query;
  const { offset, limit: pageSize } = getPagination(parseInt(page) || 1, parseInt(limit) || 20);

  let whereClause = 'WHERE status = \'active\'';
  const queryParams = [pageSize, offset];
  let paramIndex = 3;

  if (query) {
    whereClause += ` AND (name ILIKE $${paramIndex} OR domain ILIKE $${paramIndex})`;
    queryParams.push(`%${query}%`);
    paramIndex++;
  }

  try {
    const tenantsResult = await pool.query(
      `
      SELECT
        id,
        name,
        domain,
        status,
        settings,
        created_at,
        updated_at
      FROM tenants
      ${whereClause}
      ORDER BY name
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    const totalResult = await pool.query(`SELECT COUNT(*) FROM tenants ${whereClause}`, queryParams.slice(2));
    const total = parseInt(totalResult.rows[0].count, 10);

    res.status(200).json({
      data: tenantsResult.rows,
      pagination: {
        page: parseInt(page) || 1,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: (parseInt(page) || 1) * pageSize < total,
        hasPrev: (parseInt(page) || 1) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Error fetching tenants', error: error.message });
  }
});

app.post('/api/v1/pms/tenants', async (req, res) => {
  const { name, domain, settings } = req.body;

  if (!name || !domain) {
    return res.status(400).json({ message: 'Missing required tenant fields' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO tenants (name, domain, settings)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [name, domain, JSON.stringify(settings || {})]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tenant:', error);
    if (error.code === '23505') {
      res.status(409).json({ message: 'Tenant with this name or domain already exists' });
    } else {
      res.status(500).json({ message: 'Error creating tenant', error: error.message });
    }
  }
});

// ============================================================================
// USER ROUTES
// ============================================================================

app.get('/api/v1/pms/users', async (req, res) => {
  const { page, limit, tenantId, query } = req.query;
  const { offset, limit: pageSize } = getPagination(parseInt(page) || 1, parseInt(limit) || 20);

  let whereClause = 'WHERE u.status = \'active\'';
  const queryParams = [pageSize, offset];
  let paramIndex = 3;

  if (tenantId) {
    whereClause += ` AND u.tenant_id = $${paramIndex}`;
    queryParams.push(tenantId);
    paramIndex++;
  }

  if (query) {
    whereClause += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
    queryParams.push(`%${query}%`);
    paramIndex++;
  }

  try {
    const usersResult = await pool.query(
      `
      SELECT
        u.id,
        u.tenant_id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.status,
        u.last_login,
        u.created_at,
        u.updated_at,
        t.name as tenant_name
      FROM users u
      JOIN tenants t ON u.tenant_id = t.id
      ${whereClause}
      ORDER BY u.last_name, u.first_name
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    const totalResult = await pool.query(`
      SELECT COUNT(*)
      FROM users u
      JOIN tenants t ON u.tenant_id = t.id
      ${whereClause}
    `, queryParams.slice(2));
    const total = parseInt(totalResult.rows[0].count, 10);

    res.status(200).json({
      data: usersResult.rows,
      pagination: {
        page: parseInt(page) || 1,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: (parseInt(page) || 1) * pageSize < total,
        hasPrev: (parseInt(page) || 1) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// ============================================================================
// FACILITY ROUTES
// ============================================================================

app.get('/api/v1/pms/facilities', async (req, res) => {
  const { page, limit, tenantId, query } = req.query;
  const { offset, limit: pageSize } = getPagination(parseInt(page) || 1, parseInt(limit) || 20);

  let whereClause = 'WHERE f.status = \'active\'';
  const queryParams = [pageSize, offset];
  let paramIndex = 3;

  if (tenantId) {
    whereClause += ` AND f.tenant_id = $${paramIndex}`;
    queryParams.push(tenantId);
    paramIndex++;
  }

  if (query) {
    whereClause += ` AND (f.name ILIKE $${paramIndex} OR f.city ILIKE $${paramIndex} OR f.emirate ILIKE $${paramIndex})`;
    queryParams.push(`%${query}%`);
    paramIndex++;
  }

  try {
    const facilitiesResult = await pool.query(
      `
      SELECT
        f.id,
        f.tenant_id,
        f.name,
        f.facility_type,
        f.license_number,
        f.address_line1,
        f.address_line2,
        f.city,
        f.emirate,
        f.postal_code,
        f.phone_number,
        f.email,
        f.website,
        f.operating_hours,
        f.status,
        f.created_at,
        f.updated_at,
        t.name as tenant_name
      FROM facilities f
      JOIN tenants t ON f.tenant_id = t.id
      ${whereClause}
      ORDER BY f.name
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    const totalResult = await pool.query(`
      SELECT COUNT(*)
      FROM facilities f
      JOIN tenants t ON f.tenant_id = t.id
      ${whereClause}
    `, queryParams.slice(2));
    const total = parseInt(totalResult.rows[0].count, 10);

    res.status(200).json({
      data: facilitiesResult.rows,
      pagination: {
        page: parseInt(page) || 1,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: (parseInt(page) || 1) * pageSize < total,
        hasPrev: (parseInt(page) || 1) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ message: 'Error fetching facilities', error: error.message });
  }
});

// ============================================================================
// STAFF ROUTES
// ============================================================================

app.get('/api/v1/pms/staff', async (req, res) => {
  const { page, limit, tenantId, query } = req.query;
  const { offset, limit: pageSize } = getPagination(parseInt(page) || 1, parseInt(limit) || 20);

  let whereClause = 'WHERE s.status = \'active\'';
  const queryParams = [pageSize, offset];
  let paramIndex = 3;

  if (tenantId) {
    whereClause += ` AND s.tenant_id = $${paramIndex}`;
    queryParams.push(tenantId);
    paramIndex++;
  }

  if (query) {
    whereClause += ` AND (s.first_name ILIKE $${paramIndex} OR s.last_name ILIKE $${paramIndex} OR s.employee_id ILIKE $${paramIndex})`;
    queryParams.push(`%${query}%`);
    paramIndex++;
  }

  try {
    const staffResult = await pool.query(
      `
      SELECT
        s.id,
        s.tenant_id,
        s.first_name,
        s.last_name,
        s.middle_name,
        s.date_of_birth,
        s.gender,
        s.nationality,
        s.phone_number,
        s.email,
        s.employee_id,
        s.staff_type,
        s.specialties,
        s.license_number,
        s.license_expiry,
        s.status,
        s.created_at,
        s.updated_at,
        t.name as tenant_name
      FROM staff s
      JOIN tenants t ON s.tenant_id = t.id
      ${whereClause}
      ORDER BY s.last_name, s.first_name
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    const totalResult = await pool.query(`
      SELECT COUNT(*)
      FROM staff s
      JOIN tenants t ON s.tenant_id = t.id
      ${whereClause}
    `, queryParams.slice(2));
    const total = parseInt(totalResult.rows[0].count, 10);

    res.status(200).json({
      data: staffResult.rows,
      pagination: {
        page: parseInt(page) || 1,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: (parseInt(page) || 1) * pageSize < total,
        hasPrev: (parseInt(page) || 1) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

// ============================================================================
// PATIENT ROUTES
// ============================================================================

app.get('/api/v1/pms/patients', async (req, res) => {
  const { page, limit, tenantId, query } = req.query;
  const { offset, limit: pageSize } = getPagination(parseInt(page) || 1, parseInt(limit) || 20);

  let whereClause = 'WHERE p.status = \'active\'';
  const queryParams = [pageSize, offset];
  let paramIndex = 3;

  if (tenantId) {
    whereClause += ` AND p.tenant_id = $${paramIndex}`;
    queryParams.push(tenantId);
    paramIndex++;
  }

  if (query) {
    whereClause += ` AND (p.first_name ILIKE $${paramIndex} OR p.last_name ILIKE $${paramIndex} OR p.emirates_id ILIKE $${paramIndex})`;
    queryParams.push(`%${query}%`);
    paramIndex++;
  }

  try {
    const patientsResult = await pool.query(
      `
      SELECT
        p.id,
        p.tenant_id,
        p.emirates_id,
        p.first_name,
        p.last_name,
        p.middle_name,
        p.date_of_birth,
        p.gender,
        p.marital_status,
        p.nationality,
        p.phone_number,
        p.email,
        p.address_line1,
        p.address_line2,
        p.city,
        p.emirate,
        p.postal_code,
        p.blood_group,
        p.emergency_contact,
        p.insurance_info,
        p.preferred_language,
        p.status,
        p.created_at,
        p.updated_at,
        t.name as tenant_name
      FROM patients p
      JOIN tenants t ON p.tenant_id = t.id
      ${whereClause}
      ORDER BY p.last_name, p.first_name
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    const totalResult = await pool.query(`
      SELECT COUNT(*)
      FROM patients p
      JOIN tenants t ON p.tenant_id = t.id
      ${whereClause}
    `, queryParams.slice(2));
    const total = parseInt(totalResult.rows[0].count, 10);

    res.status(200).json({
      data: patientsResult.rows,
      pagination: {
        page: parseInt(page) || 1,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: (parseInt(page) || 1) * pageSize < total,
        hasPrev: (parseInt(page) || 1) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// ============================================================================
// APPOINTMENT ROUTES
// ============================================================================

app.get('/api/v1/pms/appointments', async (req, res) => {
  const { page, limit, tenantId, patientId, staffId, status } = req.query;
  const { offset, limit: pageSize } = getPagination(parseInt(page) || 1, parseInt(limit) || 20);

  let whereClause = 'WHERE p.status = \'active\'';
  const queryParams = [pageSize, offset];
  let paramIndex = 3;

  if (tenantId) {
    whereClause += ` AND a.tenant_id = $${paramIndex}`;
    queryParams.push(tenantId);
    paramIndex++;
  }

  if (patientId) {
    whereClause += ` AND a.patient_id = $${paramIndex}`;
    queryParams.push(patientId);
    paramIndex++;
  }
  if (staffId) {
    whereClause += ` AND a.staff_id = $${paramIndex}`;
    queryParams.push(staffId);
    paramIndex++;
  }
  if (status) {
    whereClause += ` AND a.status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }

  try {
    const appointmentsResult = await pool.query(
      `
      SELECT
        a.id,
        a.tenant_id,
        a.patient_id,
        a.staff_id,
        a.facility_id,
        a.start_time,
        a.end_time,
        a.status,
        a.appointment_type,
        a.notes,
        a.created_at,
        a.updated_at,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.emirates_id as patient_emirates_id,
        p.phone_number as patient_phone_number,
        s.first_name as staff_first_name,
        s.last_name as staff_last_name,
        s.employee_id as staff_employee_id,
        f.name as facility_name,
        t.name as tenant_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.staff_id = s.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      JOIN tenants t ON a.tenant_id = t.id
      ${whereClause}
      ORDER BY a.start_time DESC
      LIMIT $1 OFFSET $2
    `,
      queryParams
    );

    const totalResult = await pool.query(`
      SELECT COUNT(*)
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.staff_id = s.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      JOIN tenants t ON a.tenant_id = t.id
      ${whereClause}
    `, queryParams.slice(2));
    const total = parseInt(totalResult.rows[0].count, 10);

    res.status(200).json({
      data: appointmentsResult.rows,
      pagination: {
        page: parseInt(page) || 1,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: (parseInt(page) || 1) * pageSize < total,
        hasPrev: (parseInt(page) || 1) > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Start the server after database initialization
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 PMS Service with Foundation Data running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`📈 Stats API: http://localhost:${port}/api/v1/pms/stats`);
    console.log(`🏢 Tenants API: http://localhost:${port}/api/v1/pms/tenants`);
    console.log(`👥 Users API: http://localhost:${port}/api/v1/pms/users`);
    console.log(`🏥 Facilities API: http://localhost:${port}/api/v1/pms/facilities`);
    console.log(`👨‍⚕️ Staff API: http://localhost:${port}/api/v1/pms/staff`);
    console.log(`👤 Patients API: http://localhost:${port}/api/v1/pms/patients`);
    console.log(`📅 Appointments API: http://localhost:${port}/api/v1/pms/appointments`);
  });
});
