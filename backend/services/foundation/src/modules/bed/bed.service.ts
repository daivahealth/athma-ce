import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BedRepository } from './bed.repository';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { AssignBedDto } from './dto/assign-bed.dto';
import { ReleaseBedDto } from './dto/release-bed.dto';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { WardRepository } from '../ward/ward.repository';

@Injectable()
export class BedService {
  constructor(
    private readonly bedRepo: BedRepository,
    private readonly wardRepo: WardRepository,
    private readonly foundationPrisma: FoundationPrismaService,
    private readonly clinicalPrisma: ClinicalPrismaService,
  ) {}

  async create(wardId: string, createBedDto: CreateBedDto) {
    // Verify ward exists
    const ward = await this.foundationPrisma.ward.findUnique({
      where: { id: wardId },
      select: { 
        id: true, 
        status: true,
        department: {
          select: {
            facility: {
              select: {
                tenantId: true,
              },
            },
          },
        },
      },
    });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${wardId} not found`);
    }

    if (ward.status !== 'active') {
      throw new BadRequestException('Cannot create bed for inactive ward');
    }

    // Check if bed number already exists for this ward
    const bedNumberExists = await this.bedRepo.checkBedNumberExists(wardId, createBedDto.bedNumber);
    if (bedNumberExists) {
      throw new BadRequestException(
        `Bed number '${createBedDto.bedNumber}' already exists for this ward`,
      );
    }

    // Create bed
    const bed = await this.bedRepo.create(wardId, createBedDto);

    // Update ward bed counts
    await this.wardRepo.updateBedCounts(wardId);

    return bed;
  }

  async findAll(wardId: string, status?: string) {
    // Verify ward exists
    const ward = await this.foundationPrisma.ward.findUnique({
      where: { id: wardId },
      select: { id: true },
    });

    if (!ward) {
      throw new NotFoundException(`Ward with ID ${wardId} not found`);
    }

    const beds = await this.bedRepo.findAll(wardId, status);
    return this.hydrateBedsWithPatients(beds);
  }

  async findOne(id: string) {
    const bed = await this.bedRepo.findOne(id);

    if (!bed) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    const [hydrated] = await this.hydrateBedsWithPatients([bed]);
    return hydrated;
  }

  async update(id: string, updateBedDto: UpdateBedDto) {
    const existing = await this.bedRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    // Check if bed number is being changed and if it already exists
    if (updateBedDto.bedNumber && updateBedDto.bedNumber !== existing.bedNumber) {
      const bedNumberExists = await this.bedRepo.checkBedNumberExists(
        existing.wardId,
        updateBedDto.bedNumber,
        id,
      );
      if (bedNumberExists) {
        throw new BadRequestException(
          `Bed number '${updateBedDto.bedNumber}' already exists for this ward`,
        );
      }
    }

    return this.bedRepo.update(id, updateBedDto);
  }

  async remove(id: string) {
    const existing = await this.bedRepo.findOne(id);

    if (!existing) {
      throw new NotFoundException(`Bed with ID ${id} not found`);
    }

    // Cannot delete occupied bed
    if (existing.status === 'occupied') {
      throw new BadRequestException('Cannot delete occupied bed. Release the patient first.');
    }

    const wardId = existing.wardId;

    // Delete bed
    await this.bedRepo.remove(id);

    // Update ward bed counts
    await this.wardRepo.updateBedCounts(wardId);

    return { success: true, message: 'Bed deleted successfully' };
  }

  async assignPatient(bedId: string, assignBedDto: AssignBedDto) {
    const bed = await this.bedRepo.findOne(bedId);

    if (!bed) {
      throw new NotFoundException(`Bed with ID ${bedId} not found`);
    }

    if (bed.status === 'occupied') {
      throw new BadRequestException('Bed is already occupied');
    }

    if (bed.status === 'maintenance') {
      throw new BadRequestException('Bed is under maintenance');
    }

    // Verify patient exists and belongs to same tenant
    const patient = await this.clinicalPrisma.patient.findUnique({
      where: { id: assignBedDto.patientId },
      select: { id: true, tenantId: true, status: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${assignBedDto.patientId} not found`);
    }

    const tenantId = bed.ward.department.facility.tenantId;
    if (patient.tenantId !== tenantId) {
      throw new BadRequestException('Patient must belong to the same tenant as the facility');
    }

    if (patient.status !== 'active') {
      throw new BadRequestException('Cannot assign inactive patient to bed');
    }

    // Check if patient is already assigned to another bed
    const existingAssignment = await this.foundationPrisma.bed.findFirst({
      where: {
        currentPatientId: assignBedDto.patientId,
        status: 'occupied',
      },
      select: {
        id: true,
        bedNumber: true,
        ward: {
          select: {
            name: true,
          },
        },
      },
    });

    if (existingAssignment) {
      throw new BadRequestException(
        `Patient is already assigned to bed ${existingAssignment.bedNumber} in ${existingAssignment.ward.name}`,
      );
    }

    // Assign patient to bed
    const assignedBed = await this.bedRepo.assignPatient(bedId, assignBedDto.patientId);
    const currentPatient = await this.clinicalPrisma.patient.findUnique({
      where: { id: assignBedDto.patientId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emiratesId: true,
        dateOfBirth: true,
        gender: true,
      },
    });

    // Update ward bed counts
    await this.wardRepo.updateBedCounts(bed.wardId);

    return {
      success: true,
      message: 'Patient assigned to bed successfully',
      bed: {
        id: assignedBed.id,
        bedNumber: assignedBed.bedNumber,
        bedType: assignedBed.bedType,
        status: assignedBed.status,
        assignedAt: assignedBed.assignedAt,
        patient: currentPatient,
        ward: {
          id: assignedBed.ward.id,
          name: assignedBed.ward.name,
        },
      },
    };
  }

  async releasePatient(bedId: string, releaseBedDto: ReleaseBedDto) {
    const bed = await this.bedRepo.findOne(bedId);

    if (!bed) {
      throw new NotFoundException(`Bed with ID ${bedId} not found`);
    }

    if (bed.status !== 'occupied') {
      throw new BadRequestException('Bed is not occupied');
    }

    if (!bed.currentPatientId) {
      throw new BadRequestException('No patient assigned to this bed');
    }

    const patientId = bed.currentPatientId;
    const wardId = bed.wardId;

    // Release bed
    const releasedBed = await this.bedRepo.releasePatient(bedId);

    // Update ward bed counts
    await this.wardRepo.updateBedCounts(wardId);

    return {
      success: true,
      message: 'Patient released from bed successfully',
      bed: {
        id: releasedBed.id,
        bedNumber: releasedBed.bedNumber,
        status: releasedBed.status,
        releasedPatientId: patientId,
        ward: {
          id: releasedBed.ward.id,
          name: releasedBed.ward.name,
        },
      },
    };
  }

  async findAvailable(wardId?: string) {
    return this.bedRepo.findAvailable(wardId);
  }

  private async hydrateBedsWithPatients<T extends { currentPatientId?: string | null }>(
    beds: T[],
  ): Promise<Array<T & { currentPatient: any | null }>> {
    const patientIds = Array.from(new Set(beds.map((bed) => bed.currentPatientId).filter(Boolean))) as string[];

    if (patientIds.length === 0) {
      return beds.map((bed) => ({ ...bed, currentPatient: null }));
    }

    const patients = await this.clinicalPrisma.patient.findMany({
      where: {
        id: { in: patientIds },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emiratesId: true,
        dateOfBirth: true,
        gender: true,
      },
    });

    const patientById = new Map(patients.map((patient) => [patient.id, patient]));

    return beds.map((bed) => ({
      ...bed,
      currentPatient: bed.currentPatientId ? patientById.get(bed.currentPatientId) ?? null : null,
    }));
  }
}
