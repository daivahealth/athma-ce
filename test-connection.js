const { Pool } = require('pg');
const url = require('url');

const domains = [
  {
    name: 'Foundation',
    env: 'FOUNDATION_DATABASE_URL',
    defaultUrl: 'postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public',
  },
  {
    name: 'Clinical',
    env: 'CLINICAL_DATABASE_URL',
    defaultUrl: 'postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical?schema=public',
  },
  {
    name: 'RCM',
    env: 'RCM_DATABASE_URL',
    defaultUrl: 'postgresql://zeal_user:zeal_password@localhost:5432/zeal_rcm?schema=public',
  },
  {
    name: 'Analytics',
    env: 'ANALYTICS_DATABASE_URL',
    defaultUrl: 'postgresql://zeal_user:zeal_password@localhost:5432/zeal_analytics?schema=public',
  },
];

async function testConnection(domain) {
  const connectionString = process.env[domain.env] || domain.defaultUrl;
  const pool = new Pool({ connectionString });
  const parsed = url.parse(connectionString);

  try {
    console.log(`\n🔍 Testing ${domain.name} database`);
    console.log(`   URL: ${connectionString}`);

    const client = await pool.connect();
    const meta = await client.query('SELECT current_database(), current_user, version()');
    const tableCount = await client.query(`
      SELECT COUNT(*) AS tables
      FROM pg_tables
      WHERE schemaname IN ('public', 'audit');
    `);

    console.log('✅ Connection successful');
    console.log(`   Database: ${meta.rows[0].current_database}`);
    console.log(`   User: ${meta.rows[0].current_user}`);
    console.log(`   PostgreSQL: ${meta.rows[0].version.split(' ')[0]} ${meta.rows[0].version.split(' ')[1]}`);
    console.log(`   Tables (public + audit): ${tableCount.rows[0].tables}`);

    client.release();
    return true;
  } catch (error) {
    console.log(`❌ ${domain.name} connection failed: ${error.message}`);
    return false;
  } finally {
    await pool.end();
  }
}

async function runTests() {
  console.log('🚀 Testing Zeal domain databases');

  let success = 0;
  for (const domain of domains) {
    if (await testConnection(domain)) {
      success += 1;
    }
  }

  console.log(`\n📊 Summary: ${success}/${domains.length} databases reachable`);
  if (success === domains.length) {
    console.log('✅ All domain connections look healthy!');
  } else {
    console.log('⚠️ One or more domain connections failed. Review the connection strings and container status.');
  }
}

runTests().catch((err) => {
  console.error('Unexpected error while testing connections', err);
  process.exit(1);
});



