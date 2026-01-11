/**
 * Bed Browser Service
 *
 * Service for the Central Bed Management UI
 * Shows all beds with real-time status: Available, Occupied, Cleaning, Maintenance
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { BedBrowserQueryDto, BedBrowserStatus } from './dto/bed-browser-query.dto';

interface BedMasterData {
  id: string;
  bedNumber: string;
  bedType: string;
  status: string; // 'active', 'inactive', 'maintenance', 'decommissioned'
  ward: {
    id: string;
    name: string;
    wardType: string;
    department: {
      facility: {
        id: string;
        name: string;
      };
    };
  };
}

interface BedWithStatus {
  bedId: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  status: BedBrowserStatus;
  occupant?: {
    patientId: string;
    admissionId: string;
    patientName: string; // Will be fetched separately
  };
}

@Injectable()
export class BedBrowserService {
  private readonly logger = new Logger(BedBrowserService.name);
  private readonly foundationApi: AxiosInstance;

  constructor(private readonly prisma: PrismaService) {
    const foundationServiceUrl = process.env.FOUNDATION_SERVICE_URL || 'http://localhost:3010';

    this.foundationApi = axios.create({
      baseURL: `${foundationServiceUrl}/api/v1`,
      timeout: 10000,
    });

    this.logger.log(`Foundation API client initialized: ${foundationServiceUrl}`);
  }

  /**
   * Get bed browser data
   * Returns all beds with status and occupant info
   */
  async getBedBrowser(
    query: BedBrowserQueryDto,
    context: { tenantId: string; userId: string; facilityId: string }
  ) {
    const { wardId, status } = query;
    const { tenantId, facilityId } = context;

    this.logger.log(`Getting bed browser data - facilityId: ${facilityId}, wardId: ${wardId || 'all'}, status: ${status || 'all'}`);

    try {
      // 1. Fetch ALL beds from Foundation API (including maintenance beds)
      let beds: BedMasterData[];

      if (wardId) {
        // Get all beds for specific ward (including maintenance)
        const response = await this.foundationApi.get<BedMasterData[]>(`/beds/all`, {
          params: { wardId },
        });
        beds = response.data;
      } else {
        // Get all beds across facility (including maintenance)
        const response = await this.foundationApi.get<BedMasterData[]>('/beds/all', {
          params: { facilityId },
        });
        beds = response.data;
      }

      // Filter by facility
      const facilityBeds = beds.filter((bed) => bed.ward.department.facility.id === facilityId);

      // 2. Get bed IDs
      const bedIds = facilityBeds.map((b) => b.id);

      if (bedIds.length === 0) {
        return {
          beds: [],
          summary: { total: 0, available: 0, occupied: 0, cleaning: 0, maintenance: 0 },
        };
      }

      // 3. Get all bed assignments (both active and recently released for cleaning tracking)
      const bedAssignments = await this.prisma.bedAssignment.findMany({
        where: {
          tenantId,
          bedId: { in: bedIds },
        },
        orderBy: {
          assignedAt: 'desc',
        },
        include: {
          admission: {
            select: {
              id: true,
              patientId: true,
              admissionNumber: true,
            },
          },
        },
      });

      // 4. Build bed status map
      // For each bed, we need to determine its current status
      const bedStatusMap = new Map<string, {
        status: BedBrowserStatus;
        assignment?: any;
      }>();

      // Group assignments by bedId
      const assignmentsByBed = new Map<string, any[]>();
      bedAssignments.forEach((assignment) => {
        if (!assignmentsByBed.has(assignment.bedId)) {
          assignmentsByBed.set(assignment.bedId, []);
        }
        assignmentsByBed.get(assignment.bedId)!.push(assignment);
      });

      // Determine status for each bed
      facilityBeds.forEach((bed) => {
        const assignments = assignmentsByBed.get(bed.id) || [];
        const latestAssignment = assignments[0]; // Already sorted by assignedAt desc

        // Priority order: Maintenance > Occupied > Cleaning > Available

        // 1. Check master data maintenance status
        if (bed.status === 'maintenance') {
          bedStatusMap.set(bed.id, { status: BedBrowserStatus.MAINTENANCE });
          return;
        }

        // 2. Check if currently occupied
        const activeAssignment = assignments.find((a) => a.releasedAt === null);
        if (activeAssignment) {
          bedStatusMap.set(bed.id, {
            status: BedBrowserStatus.OCCUPIED,
            assignment: activeAssignment,
          });
          return;
        }

        // 3. Check if cleaning required
        if (
          latestAssignment &&
          latestAssignment.cleaningRequired &&
          latestAssignment.cleaningCompletedAt === null
        ) {
          bedStatusMap.set(bed.id, { status: BedBrowserStatus.CLEANING });
          return;
        }

        // 4. Otherwise available
        bedStatusMap.set(bed.id, { status: BedBrowserStatus.AVAILABLE });
      });

      // 5. Build response
      const bedsWithStatus: BedWithStatus[] = facilityBeds.map((bed) => {
        const statusInfo = bedStatusMap.get(bed.id)!;

        const bedData: BedWithStatus = {
          bedId: bed.id,
          bedNumber: bed.bedNumber,
          wardId: bed.ward.id,
          wardName: bed.ward.name,
          status: statusInfo.status,
        };

        // Add occupant info if occupied
        if (statusInfo.assignment) {
          bedData.occupant = {
            patientId: statusInfo.assignment.admission.patientId,
            admissionId: statusInfo.assignment.admission.id,
            patientName: '', // TODO: Fetch from Patient table if needed
          };
        }

        return bedData;
      });

      // 6. Filter by status if requested
      const filteredBeds = status
        ? bedsWithStatus.filter((b) => b.status === status)
        : bedsWithStatus;

      // 7. Calculate summary
      const summary = {
        total: bedsWithStatus.length,
        available: bedsWithStatus.filter((b) => b.status === BedBrowserStatus.AVAILABLE).length,
        occupied: bedsWithStatus.filter((b) => b.status === BedBrowserStatus.OCCUPIED).length,
        cleaning: bedsWithStatus.filter((b) => b.status === BedBrowserStatus.CLEANING).length,
        maintenance: bedsWithStatus.filter((b) => b.status === BedBrowserStatus.MAINTENANCE).length,
      };

      return {
        beds: filteredBeds,
        summary,
      };
    } catch (error: unknown) {
      this.logger.error(`Error getting bed browser data: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw error;
    }
  }

  /**
   * Mark bed cleaning as complete
   */
  async markCleaningComplete(
    bedId: string,
    context: { tenantId: string; userId: string }
  ) {
    const { tenantId, userId } = context;

    // Find the latest assignment that needs cleaning
    const assignment = await this.prisma.bedAssignment.findFirst({
      where: {
        tenantId,
        bedId,
        cleaningRequired: true,
        cleaningCompletedAt: null,
      },
      orderBy: {
        releasedAt: 'desc',
      },
    });

    if (!assignment) {
      throw new Error('No cleaning required for this bed');
    }

    // Mark cleaning as complete
    await this.prisma.bedAssignment.update({
      where: { id: assignment.id },
      data: {
        cleaningCompletedAt: new Date(),
        cleaningCompletedBy: userId,
      },
    });

    return { success: true, bedId, message: 'Bed cleaning marked as complete' };
  }

  /**
   * Mark bed cleaning as required
   */
  async markCleaningRequired(
    bedId: string,
    context: { tenantId: string; userId: string; facilityId: string }
  ) {
    const { tenantId, userId, facilityId } = context;

    // Check if there's an existing assignment (occupied or released)
    const latestAssignment = await this.prisma.bedAssignment.findFirst({
      where: {
        tenantId,
        bedId,
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    // If bed is currently occupied, cannot mark cleaning required
    if (latestAssignment && latestAssignment.releasedAt === null) {
      throw new Error('Cannot mark cleaning required for an occupied bed');
    }

    // If there's a previous assignment, update it
    if (latestAssignment) {
      await this.prisma.bedAssignment.update({
        where: { id: latestAssignment.id },
        data: {
          cleaningRequired: true,
          cleaningCompletedAt: null,
          cleaningCompletedBy: null,
        },
      });

      return { success: true, bedId, message: 'Bed cleaning marked as required' };
    }

    // No prior assignment - create a cleaning-only assignment
    // Fetch bed details from Foundation API to get ward and space info
    try {
      const bedResponse = await this.foundationApi.get<BedMasterData>(`/beds/${bedId}`);
      const bed = bedResponse.data;

      // Create a new assignment for cleaning tracking only (no patient/admission)
      await this.prisma.bedAssignment.create({
        data: {
          tenantId,
          bedId,
          wardId: bed.ward.id,
          spaceId: bed.ward.id, // Using wardId as spaceId temporarily - update if you have actual space info
          assignedAt: new Date(),
          releasedAt: new Date(), // Immediately released since no patient
          assignedBy: userId,
          releasedBy: userId,
          cleaningRequired: true,
          notes: 'Cleaning-only assignment (no patient)',
        },
      });

      return { success: true, bedId, message: 'Bed cleaning marked as required' };
    } catch (error: unknown) {
      this.logger.error(`Error fetching bed details: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw new Error('Failed to mark cleaning required: Unable to fetch bed details');
    }
  }

  /**
   * Start bed maintenance (proxy to Foundation API)
   */
  async startMaintenance(
    bedId: string,
    notes: string | undefined,
    context: { tenantId: string; userId: string }
  ) {
    try {
      const response = await this.foundationApi.post(`/beds/${bedId}/maintenance/start`, {
        notes: notes || 'Maintenance started',
      });

      return response.data;
    } catch (error: unknown) {
      this.logger.error(`Error starting bed maintenance: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw error;
    }
  }

  /**
   * Complete bed maintenance (proxy to Foundation API)
   */
  async completeMaintenance(
    bedId: string,
    context: { tenantId: string; userId: string }
  ) {
    try {
      const response = await this.foundationApi.post(`/beds/${bedId}/maintenance/complete`);

      return response.data;
    } catch (error: unknown) {
      this.logger.error(`Error completing bed maintenance: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw error;
    }
  }
}
