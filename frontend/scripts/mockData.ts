import axios from 'axios';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';
const FOUNDATION_BASE_URL = process.env.NEXT_PUBLIC_FOUNDATION_BASE_URL ?? 'http://localhost:3010';

async function main() {
  console.info('Starting Zeal mock data seeding...');
  const authClient = axios.create({ baseURL: `${AUTH_BASE_URL}/api/v1/auth` });
  const foundationClient = axios.create({ baseURL: FOUNDATION_BASE_URL });

  const credentials = {
    email: process.env.ZEAL_DEMO_EMAIL ?? 'demo@example.com',
    password: process.env.ZEAL_DEMO_PASSWORD ?? 'Passw0rd!',
  };

  const loginResponse = await authClient.post('/login', credentials);
  if (!loginResponse.data?.accessToken) {
    throw new Error('Unable to obtain access token. Check credentials.');
  }

  const accessToken = loginResponse.data.accessToken as string;
  const tenantId = loginResponse.data.user?.tenantId as string | undefined;

  foundationClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  if (tenantId) {
    foundationClient.defaults.headers.common['x-tenant-id'] = tenantId;
  }

  console.info('Seeding tenants...');
  await foundationClient.post('/tenants', {
    name: 'Demo Care Group',
    domain: 'demo-care.zeal.health',
    settings: { timezone: 'Asia/Dubai' },
  }).catch(() => /* ignore duplicates */ undefined);

  console.info('Seeding facilities...');
  await foundationClient.post('/facilities', {
    name: 'Dubai Downtown Clinic',
    facilityType: 'Outpatient',
    licenseNumber: 'DHA-CL-2024-09',
    phoneNumber: '+971-4-555-0134',
    status: 'active',
  }).catch(() => undefined);

  console.info('Seeding staff...');
  await foundationClient.post('/staff', {
    firstName: 'Sara',
    lastName: 'Mahmoud',
    staffType: 'Physician',
    employeeId: 'PHY-1001',
    dateOfBirth: '1985-03-10',
    gender: 'Female',
  }).catch(() => undefined);

  console.info('Mock data ready.');
}

main().catch((error) => {
  console.error('Mock seeding failed:', error);
  process.exit(1);
});
