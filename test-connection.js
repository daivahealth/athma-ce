const { Pool } = require('pg');

// Test different connection configurations
const configs = [
  {
    name: 'localhost',
    config: {
      host: 'localhost',
      port: 5432,
      database: 'zeal_pms',
      user: 'zeal_user',
      password: 'zeal_password',
    }
  },
  {
    name: '127.0.0.1',
    config: {
      host: '127.0.0.1',
      port: 5432,
      database: 'zeal_pms',
      user: 'zeal_user',
      password: 'zeal_password',
    }
  },
  {
    name: 'Docker bridge gateway',
    config: {
      host: '172.21.0.1',
      port: 5432,
      database: 'zeal_pms',
      user: 'zeal_user',
      password: 'zeal_password',
    }
  }
];

async function testConnection(config) {
  const pool = new Pool(config.config);
  
  try {
    console.log(`\n🔍 Testing connection: ${config.name}`);
    console.log(`   Host: ${config.config.host}:${config.config.port}`);
    
    const client = await pool.connect();
    const result = await client.query('SELECT current_database(), current_user, version()');
    
    console.log(`✅ Connection successful!`);
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User: ${result.rows[0].current_user}`);
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    // Test a simple query
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM patients WHERE is_active = true) as total_patients,
        (SELECT COUNT(*) FROM appointments) as total_appointments
    `);
    
    console.log(`   Patients: ${stats.rows[0].total_patients}`);
    console.log(`   Appointments: ${stats.rows[0].total_appointments}`);
    
    client.release();
    return true;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return false;
  } finally {
    await pool.end();
  }
}

async function runTests() {
  console.log('🚀 Testing PostgreSQL connections for pgAdmin...\n');
  
  let successCount = 0;
  
  for (const config of configs) {
    const success = await testConnection(config);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Test Results: ${successCount}/${configs.length} connections successful`);
  
  if (successCount > 0) {
    console.log('\n✅ Use any successful connection details in pgAdmin!');
  } else {
    console.log('\n❌ No connections successful. Check Docker container status.');
  }
}

runTests().catch(console.error);
