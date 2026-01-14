import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { SearchBedsDto } from './dto/search-beds.dto';
import { ValidateBedDto } from './dto/validate-bed.dto';
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface BedMasterData {
  id: string;
  bedNumber: string;
  bedType: string;
  features: any;
  requiresIsolation: boolean;
  isolationType: string | null;
  genderRestriction: string | null;
  status: string;
  wardId: string;
  ward: {
    id: string;
    name: string;
    wardType: string;
    genderRestriction: string | null;
    floorNumber: string | null;
    specialty: {
      id: string;
      code: string;
      name: string;
    } | null;
    department: {
      id: string;
      name: string;
      facility: {
        id: string;
        name: string;
        tenantId: string;
      };
    };
  };
}

export interface BedAvailabilityResult {
  bedId: string;
  bedNumber: string;
  bedType: string;
  features: any;
  requiresIsolation: boolean;
  isolationType: string | null;
  ward: {
    id: string;
    name: string;
    wardType: string;
    genderRestriction: string | null;
    floorNumber: string | null;
    specialtyName: string | null;
  };
  facility: {
    id: string;
    name: string;
  };
  isOccupied: boolean;
  isAvailable: boolean;
  occupancyStatus: 'available' | 'occupied' | 'maintenance' | 'inactive';
  occupiedSince: Date | null;
}

@Injectable()
export class BedSearchService {
  private readonly logger = new Logger(BedSearchService.name);
  private readonly foundationApi: AxiosInstance;

  constructor(private readonly prisma: PrismaService) {
    // Initialize Foundation API client
    const foundationUrl = process.env.FOUNDATION_SERVICE_URL || 'http://localhost:3010';
    this.foundationApi = axios.create({
      baseURL: `${foundationUrl}/api/v1`,
      timeout: 10000,
    });

    this.logger.log(`Foundation API client initialized: ${foundationUrl}`);
  }

  /**
   * Search for available beds with filters
   */
  async searchAvailableBeds(
    dto: SearchBedsDto,
    context: { tenantId: string; userId: string; facilityId: string }
  ): Promise<{ data: BedAvailabilityResult[]; meta: any }> {
    this.logger.log(`Searching beds with filters: ${JSON.stringify(dto)}`);

    try {
      // 1. Fetch beds from Foundation API (master data)
      const params: any = {
        status: 'active',
      };

      if (dto.wardId) params.wardId = dto.wardId;
      if (dto.bedType) params.bedType = dto.bedType;
      if (dto.requiresIsolation !== undefined) params.requiresIsolation = dto.requiresIsolation;

      // Gender restriction filter
      if (dto.genderRestriction) {
        params.genderRestriction = dto.genderRestriction;
      } else if (dto.patientGender) {
        // Auto-match based on patient gender
        if (dto.patientGender === 'male') {
          params.genderRestriction = 'male_only,mixed';
        } else if (dto.patientGender === 'female') {
          params.genderRestriction = 'female_only,mixed';
        }
      }

      const response = await this.foundationApi.get<BedMasterData[]>('/beds/available', { params });
      const beds = response.data;

      this.logger.log(`Found ${beds.length} beds from Foundation`);

      // 2. Filter beds by facility (client-side filter since Foundation returns all)
      const facilityBeds = beds.filter(
        (bed) => bed.ward.department.facility.id === dto.facilityId
      );

      this.logger.log(`Filtered to ${facilityBeds.length} beds for facility ${dto.facilityId}`);

      // 3. Apply specialty filter if provided
      let filteredBeds = facilityBeds;
      if (dto.specialtyId) {
        filteredBeds = facilityBeds.filter(
          (bed) => bed.ward.specialty?.id === dto.specialtyId
        );
      }

      // 4. Apply required features filter
      if (dto.requiredFeatures && dto.requiredFeatures.length > 0) {
        filteredBeds = filteredBeds.filter((bed) => {
          if (!bed.features) return false;
          return dto.requiredFeatures!.every((feature) => bed.features[feature] === true);
        });
      }

      this.logger.log(`After filtering: ${filteredBeds.length} beds`);

      // 5. Get current bed assignments from Clinical DB (occupancy data)
      const bedIds = filteredBeds.map((bed) => bed.id);
      const occupiedBeds = await this.prisma.bedAssignment.findMany({
        where: {
          tenantId: context.tenantId,
          bedId: { in: bedIds },
          releasedAt: null, // Currently occupied
        },
        select: {
          bedId: true,
          patientId: true,
          assignedAt: true,
        },
      });

      // 6. Build occupancy map
      const occupancyMap = new Map(
        occupiedBeds.map((assignment) => [
          assignment.bedId,
          {
            isOccupied: true,
            occupiedSince: assignment.assignedAt,
          },
        ])
      );

      this.logger.log(`Found ${occupiedBeds.length} occupied beds`);

      // 7. Enrich beds with occupancy status
      const enrichedBeds: BedAvailabilityResult[] = filteredBeds.map((bed) => {
        const isOccupied = occupancyMap.has(bed.id);
        const isAvailable = !isOccupied && bed.status === 'active';

        let occupancyStatus: 'available' | 'occupied' | 'maintenance' | 'inactive';
        if (bed.status === 'maintenance') {
          occupancyStatus = 'maintenance';
        } else if (bed.status === 'inactive' || bed.status === 'decommissioned') {
          occupancyStatus = 'inactive';
        } else if (isOccupied) {
          occupancyStatus = 'occupied';
        } else {
          occupancyStatus = 'available';
        }

        return {
          bedId: bed.id,
          bedNumber: bed.bedNumber,
          bedType: bed.bedType,
          features: bed.features || {},
          requiresIsolation: bed.requiresIsolation,
          isolationType: bed.isolationType,
          ward: {
            id: bed.ward.id,
            name: bed.ward.name,
            wardType: bed.ward.wardType,
            genderRestriction: bed.ward.genderRestriction,
            floorNumber: bed.ward.floorNumber,
            specialtyName: bed.ward.specialty?.name || null,
          },
          facility: {
            id: bed.ward.department.facility.id,
            name: bed.ward.department.facility.name,
          },
          isOccupied,
          isAvailable,
          occupancyStatus,
          occupiedSince: occupancyMap.get(bed.id)?.occupiedSince || null,
        };
      });

      // 8. Filter to only available beds
      const availableBeds = enrichedBeds.filter((bed) => bed.isAvailable);

      this.logger.log(`Returning ${availableBeds.length} available beds`);

      return {
        data: availableBeds,
        meta: {
          total: filteredBeds.length,
          available: availableBeds.length,
          occupied: enrichedBeds.filter((b) => b.isOccupied).length,
          maintenance: enrichedBeds.filter((b) => b.occupancyStatus === 'maintenance').length,
        },
      };
    } catch (error: unknown) {
      this.logger.error(`Error searching beds: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw error;
    }
  }

  /**
   * Validate bed availability before assignment
   */
  async validateBedAvailability(
    dto: ValidateBedDto,
    context: { tenantId: string; userId: string; facilityId: string }
  ): Promise<{
    isAvailable: boolean;
    bedId: string;
    bedNumber?: string;
    ward?: any;
    error?: string;
    occupiedSince?: Date;
  }> {
    this.logger.log(`Validating bed availability for bed ${dto.bedId}`);

    try {
      // 1. Check if bed exists in Foundation (master data)
      const response = await this.foundationApi.get<BedMasterData>(`/beds/${dto.bedId}`);
      const bed = response.data;

      if (!bed) {
        return {
          isAvailable: false,
          bedId: dto.bedId,
          error: 'Bed not found',
        };
      }

      // 2. Check master data status
      if (bed.status !== 'active') {
        return {
          isAvailable: false,
          bedId: dto.bedId,
          bedNumber: bed.bedNumber,
          error: `Bed is ${bed.status}`,
        };
      }

      // 3. Verify bed belongs to the same facility
      if (bed.ward.department.facility.id !== context.facilityId) {
        return {
          isAvailable: false,
          bedId: dto.bedId,
          bedNumber: bed.bedNumber,
          error: 'Bed does not belong to the current facility',
        };
      }

      // 4. Check current occupancy in Clinical DB
      const currentAssignment = await this.prisma.bedAssignment.findFirst({
        where: {
          tenantId: context.tenantId,
          bedId: dto.bedId,
          releasedAt: null, // Currently occupied
        },
      });

      if (currentAssignment) {
        return {
          isAvailable: false,
          bedId: dto.bedId,
          bedNumber: bed.bedNumber,
          ward: {
            id: bed.ward.id,
            name: bed.ward.name,
          },
          error: 'Bed is currently occupied by another patient',
          occupiedSince: currentAssignment.assignedAt,
        };
      }

      // 5. Bed is available
      return {
        isAvailable: true,
        bedId: dto.bedId,
        bedNumber: bed.bedNumber,
        ward: {
          id: bed.ward.id,
          name: bed.ward.name,
          wardType: bed.ward.wardType,
          floorNumber: bed.ward.floorNumber,
        },
      };
    } catch (error: unknown) {
      this.logger.error(`Error validating bed: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status === 404) {
          return {
            isAvailable: false,
            bedId: dto.bedId,
            error: 'Bed not found',
          };
        }
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw error;
    }
  }
}
