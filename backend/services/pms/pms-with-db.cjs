// PMS Service with PostgreSQL Database Connection
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3002;

// Database configuration
const pool = new Pool({
  user: 'zeal_user',
  host: 'localhost',
  database: 'zeal_pms',
  password: 'zeal_password',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Database helper functions
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database tables...');
    
    // Create patients table
    await query(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        emirates_id VARCHAR(20) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        phone_number VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        emirate VARCHAR(50),
        nationality VARCHAR(100),
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
    await query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
        staff_id UUID,
        facility_id UUID,
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

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_patients_emirates_id ON patients(emirates_id);
      CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(first_name, last_name);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);

    // Insert sample data if tables are empty
    const patientCount = await query('SELECT COUNT(*) FROM patients');
    if (parseInt(patientCount.rows[0].count) === 0) {
      console.log('📝 Inserting sample data...');
      
      // Insert sample patients
      await query(`
        INSERT INTO patients (emirates_id, first_name, last_name, date_of_birth, gender, phone_number, email, city, emirate, nationality)
        VALUES 
          ('784-1234-1234567-1', 'Ahmed', 'Al-Rashid', '1990-01-15', 'male', '+971501234567', 'ahmed@example.com', 'Dubai', 'Dubai', 'UAE'),
          ('784-5678-7654321-2', 'Fatima', 'Al-Zahra', '1985-03-22', 'female', '+971507654321', 'fatima@example.com', 'Abu Dhabi', 'Abu Dhabi', 'UAE'),
          ('784-9012-3456789-3', 'Mohammed', 'Al-Sheikh', '1988-07-10', 'male', '+971509876543', 'mohammed@example.com', 'Sharjah', 'Sharjah', 'UAE')
      `);

      // Insert sample appointments
      await query(`
        INSERT INTO appointments (patient_id, staff_id, facility_id, start_time, end_time, appointment_type, reason, status)
        SELECT 
          p.id,
          uuid_generate_v4(),
          uuid_generate_v4(),
          NOW() + INTERVAL '1 day',
          NOW() + INTERVAL '1 day' + INTERVAL '30 minutes',
          'consultation',
          'Regular checkup',
          'scheduled'
        FROM patients p
        WHERE p.emirates_id = '784-1234-1234567-1'
        LIMIT 1
      `);
    }

    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Routes
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const dbInfo = await query('SELECT get_database_info()');
    const dbResult = dbInfo.rows[0].get_database_info;
    
    res.json({ 
      status: 'healthy', 
      service: 'PMS Service with Database',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        connected: true,
        info: dbResult
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      service: 'PMS Service with Database',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Patient routes
app.get('/api/v1/pms/patients', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT 
        id,
        emirates_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone_number,
        email,
        address,
        city,
        emirate,
        nationality,
        blood_group,
        emergency_contact_name,
        emergency_contact_number,
        preferred_language,
        is_active,
        created_at,
        updated_at
      FROM patients
      WHERE is_active = true
    `;
    
    const queryParams = [];
    
    if (search) {
      queryText += ` AND (
        first_name ILIKE $${queryParams.length + 1} OR
        last_name ILIKE $${queryParams.length + 1} OR
        emirates_id ILIKE $${queryParams.length + 1} OR
        phone_number ILIKE $${queryParams.length + 1} OR
        email ILIKE $${queryParams.length + 1}
      )`;
      queryParams.push(`%${search}%`);
    }
    
    queryText += ` ORDER BY last_name, first_name LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const result = await query(queryText, queryParams);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM patients WHERE is_active = true';
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (
        first_name ILIKE $1 OR
        last_name ILIKE $1 OR
        emirates_id ILIKE $1 OR
        phone_number ILIKE $1 OR
        email ILIKE $1
      )`;
      countParams.push(`%${search}%`);
    }
    
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/v1/pms/patients/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM patients WHERE id = $1 AND is_active = true',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/v1/pms/patients', async (req, res) => {
  try {
    const {
      emirates_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone_number,
      email,
      address,
      city,
      emirate,
      nationality,
      blood_group,
      emergency_contact_name,
      emergency_contact_number,
      preferred_language = 'en'
    } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if Emirates ID already exists
    if (emirates_id) {
      const existingPatient = await query(
        'SELECT id FROM patients WHERE emirates_id = $1',
        [emirates_id]
      );
      
      if (existingPatient.rows.length > 0) {
        return res.status(409).json({ error: 'Patient with this Emirates ID already exists' });
      }
    }
    
    const result = await query(`
      INSERT INTO patients (
        emirates_id, first_name, last_name, date_of_birth, gender,
        phone_number, email, address, city, emirate, nationality,
        blood_group, emergency_contact_name, emergency_contact_number,
        preferred_language
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      emirates_id, first_name, last_name, date_of_birth, gender,
      phone_number, email, address, city, emirate, nationality,
      blood_group, emergency_contact_name, emergency_contact_number,
      preferred_language
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Appointment routes
app.get('/api/v1/pms/appointments', async (req, res) => {
  try {
    const { page = 1, limit = 20, patient_id, status } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT 
        a.id,
        a.patient_id,
        a.staff_id,
        a.facility_id,
        a.start_time,
        a.end_time,
        a.status,
        a.appointment_type,
        a.reason,
        a.notes,
        a.created_at,
        a.updated_at,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.emirates_id as patient_emirates_id,
        p.phone_number as patient_phone_number
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE p.is_active = true
    `;
    
    const queryParams = [];
    
    if (patient_id) {
      queryText += ` AND a.patient_id = $${queryParams.length + 1}`;
      queryParams.push(patient_id);
    }
    
    if (status) {
      queryText += ` AND a.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }
    
    queryText += ` ORDER BY a.start_time DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const result = await query(queryText, queryParams);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) 
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE p.is_active = true
    `;
    const countParams = [];
    
    if (patient_id) {
      countQuery += ` AND a.patient_id = $1`;
      countParams.push(patient_id);
    }
    
    if (status) {
      countQuery += ` AND a.status = $${countParams.length + 1}`;
      countParams.push(status);
    }
    
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/v1/pms/appointments', async (req, res) => {
  try {
    const {
      patient_id,
      staff_id,
      facility_id,
      start_time,
      end_time,
      appointment_type,
      reason,
      notes
    } = req.body;
    
    // Validate required fields
    if (!patient_id || !start_time || !end_time || !appointment_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if patient exists
    const patientCheck = await query(
      'SELECT id FROM patients WHERE id = $1 AND is_active = true',
      [patient_id]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(`
      INSERT INTO appointments (
        patient_id, staff_id, facility_id, start_time, end_time,
        appointment_type, reason, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      patient_id, staff_id, facility_id, start_time, end_time,
      appointment_type, reason, notes
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Database statistics endpoint
app.get('/api/v1/pms/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM patients WHERE is_active = true) as total_patients,
        (SELECT COUNT(*) FROM appointments) as total_appointments,
        (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') as scheduled_appointments,
        (SELECT COUNT(*) FROM appointments WHERE start_time >= NOW()) as upcoming_appointments
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 PMS Service with Database running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`👥 Patients API: http://localhost:${PORT}/api/v1/pms/patients`);
      console.log(`📅 Appointments API: http://localhost:${PORT}/api/v1/pms/appointments`);
      console.log(`📈 Stats API: http://localhost:${PORT}/api/v1/pms/stats`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
