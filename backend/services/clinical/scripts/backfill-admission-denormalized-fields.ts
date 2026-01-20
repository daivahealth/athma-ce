/**
 * Migration Script: Backfill Denormalized Fields in Inpatient Admissions
 *
 * This script populates the denormalized fields (currentWardName, currentBedNumber,
 * attendingPhysicianDisplayName) for existing admission records that were created
 * before this feature was added.
 *
 * Usage:
 *   ts-node scripts/backfill-admission-denormalized-fields.ts
 */

import { PrismaClient } from '@zeal/database-clinical';
import axios from 'axios';

const prisma = new PrismaClient();

const FOUNDATION_SERVICE_URL = process.env.FOUNDATION_SERVICE_URL || 'http://localhost:3010';
const foundationApi = axios.create({
  baseURL: `${FOUNDATION_SERVICE_URL}/api/v1`,
  timeout: 10000,
});

interface AdmissionToUpdate {
  id: string;
  tenantId: string;
  facilityId: string;
  attendingPhysicianId: string;
  currentWardId: string | null;
  currentBedId: string | null;
}

async function fetchPhysicianDisplayName(
  physicianId: string,
  tenantId: string,
  facilityId: string
): Promise<string | null> {
  try {
    const response = await foundationApi.get(`/staff/${physicianId}`, {
      headers: {
        'x-tenant-id': tenantId,
        'x-user-id': 'migration-script',
        'x-facility-id': facilityId,
      },
    });

    const staff = response.data;
    return staff.displayName || `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || null;
  } catch (error: any) {
    console.warn(`Failed to fetch physician ${physicianId}: ${error?.message || error}`);
    return null;
  }
}

async function fetchWardName(
  wardId: string,
  tenantId: string,
  facilityId: string
): Promise<string | null> {
  try {
    const response = await foundationApi.get(`/wards/${wardId}`, {
      headers: {
        'x-tenant-id': tenantId,
        'x-user-id': 'migration-script',
        'x-facility-id': facilityId,
      },
    });

    const ward = response.data;
    return ward.name || null;
  } catch (error: any) {
    console.warn(`Failed to fetch ward ${wardId}: ${error?.message || error}`);
    return null;
  }
}

async function fetchBedNumber(
  bedId: string,
  tenantId: string,
  facilityId: string
): Promise<string | null> {
  try {
    const response = await foundationApi.get(`/beds/${bedId}`, {
      headers: {
        'x-tenant-id': tenantId,
        'x-user-id': 'migration-script',
        'x-facility-id': facilityId,
      },
    });

    const bed = response.data;
    return bed.bedNumber || null;
  } catch (error: any) {
    console.warn(`Failed to fetch bed ${bedId}: ${error?.message || error}`);
    return null;
  }
}

async function main() {
  console.log('Starting backfill of admission denormalized fields...\n');

  // Find all admissions where denormalized fields are NULL
  const admissions = await prisma.inpatientAdmission.findMany({
    where: {
      OR: [
        { attendingPhysicianDisplayName: null },
        { currentWardName: null },
        { currentBedNumber: null },
      ],
    },
    select: {
      id: true,
      tenantId: true,
      facilityId: true,
      attendingPhysicianId: true,
      currentWardId: true,
      currentBedId: true,
    },
  });

  console.log(`Found ${admissions.length} admissions to update\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const admission of admissions) {
    try {
      console.log(`Processing admission ${admission.id}...`);

      const updateData: {
        attendingPhysicianDisplayName?: string | null;
        currentWardName?: string | null;
        currentBedNumber?: string | null;
      } = {};

      // Fetch physician display name
      const physicianName = await fetchPhysicianDisplayName(
        admission.attendingPhysicianId,
        admission.tenantId,
        admission.facilityId
      );
      if (physicianName) {
        updateData.attendingPhysicianDisplayName = physicianName;
        console.log(`  ✓ Physician: ${physicianName}`);
      }

      // Fetch ward name if ward is assigned
      if (admission.currentWardId) {
        const wardName = await fetchWardName(
          admission.currentWardId,
          admission.tenantId,
          admission.facilityId
        );
        if (wardName) {
          updateData.currentWardName = wardName;
          console.log(`  ✓ Ward: ${wardName}`);
        }
      }

      // Fetch bed number if bed is assigned
      if (admission.currentBedId) {
        const bedNumber = await fetchBedNumber(
          admission.currentBedId,
          admission.tenantId,
          admission.facilityId
        );
        if (bedNumber) {
          updateData.currentBedNumber = bedNumber;
          console.log(`  ✓ Bed: ${bedNumber}`);
        }
      }

      // Update admission if we have any data to update
      if (Object.keys(updateData).length > 0) {
        await prisma.inpatientAdmission.update({
          where: { id: admission.id },
          data: updateData,
        });
        successCount++;
        console.log(`  ✅ Updated successfully\n`);
      } else {
        console.log(`  ⚠️  No data to update\n`);
      }

      // Add a small delay to avoid overwhelming the Foundation API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      errorCount++;
      console.error(`  ❌ Error updating admission ${admission.id}: ${error?.message || error}\n`);
    }
  }

  console.log('\n=== Backfill Complete ===');
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${admissions.length}`);
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
