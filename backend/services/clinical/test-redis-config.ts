/**
 * Test script to verify ConfigClient Redis connection
 */

// Load environment variables from .env.local first
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '.env.local') });

import { createConfigClient } from '@zeal/config-client';

async function testRedisConfig() {
  console.log('🧪 Testing ConfigClient with Redis...');
  console.log('Environment:');
  console.log('  REDIS_URL:', process.env.REDIS_URL || 'NOT SET');
  console.log('  FOUNDATION_BASE_URL:', process.env.FOUNDATION_BASE_URL || 'NOT SET');
  console.log('');

  // Create a new config client instance with verbose logging
  const configClient = createConfigClient({
    foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
    enableCache: true,
    cacheConfig: {
      redisUrl: process.env.REDIS_URL,
      memoryTtlMs: 60000,
      redisTtlMs: 300000,
    },
  });

  console.log('ConfigClient created with cache enabled');
  console.log('');

  try {
    // Test fetching a config
    console.log('📡 Fetching config: clinical.mrn_format');
    const mrnFormat = await configClient.get('clinical.mrn_format', {
      tenantId: '11111111-1111-1111-1111-111111111111',
      facilityId: '22222222-2222-2222-2222-222222222222',
    });
    console.log('✅ Config fetched:', mrnFormat);
    console.log('');

    // Wait a moment for Redis write to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('✅ Test complete! Check Redis for keys with: docker exec zeal-redis redis-cli KEYS "config:*"');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await configClient.close();
    process.exit(0);
  }
}

testRedisConfig();
