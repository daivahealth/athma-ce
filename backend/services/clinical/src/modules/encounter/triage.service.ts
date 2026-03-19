/**
 * Triage Service
 *
 * Business logic for triage management
 */

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateTriageDto, UpdateTriageDto } from './dto/triage.dto';
import { ObservationWriterService } from '../observations/observation-writer.service';

@Injectable()
export class TriageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly observationWriter: ObservationWriterService,
  ) {}

  /**
   * Create a new triage record
   */
  async createTriage(dto: CreateTriageDto, context: any) {
    const { tenantId } = context;

    // Verify encounter exists
    const encounter = await this.prisma.encounter.findFirst({
      where: {
        id: dto.encounterId,
        tenantId,
      },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter with ID ${dto.encounterId} not found`);
    }

    // Check if triage already exists for this encounter
    const existingTriage = await this.prisma.triage.findUnique({
      where: { encounterId: dto.encounterId },
    });

    if (existingTriage) {
      throw new ConflictException(
        `Triage already exists for encounter ${dto.encounterId}. Use update instead.`
      );
    }

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${dto.patientId} not found`);
    }

    // Build triage data
    const triageData: any = {
      tenantId,
      encounterId: dto.encounterId,
      patientId: dto.patientId,
      triageStaffId: dto.triageStaffId,
      triageLevel: dto.triageLevel,
      chiefComplaintsAndHPI: dto.chiefComplaintsAndHPI,
      vitalSigns: dto.vitalSigns || {},
      allergies: dto.allergies || [],
      currentMedications: dto.currentMedications || [],
    };

    // Add optional fields
    if (dto.painScore !== undefined) triageData.painScore = dto.painScore;
    if (dto.triageNotes) triageData.triageNotes = dto.triageNotes;

    // Create triage
    const triage = await this.prisma.triage.create({
      data: triageData,
      include: {
        encounter: {
          include: {
            patient: {
              select: {
                id: true,
                mrn: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    // Optionally update encounter status to 'triaged' if not already
    if (encounter.status === 'arrived') {
      await this.prisma.encounter.update({
        where: { id: dto.encounterId },
        data: { status: 'triaged' },
      });
    }

    // Write structured observations from vital signs (async, non-blocking)
    if (dto.vitalSigns && Object.keys(dto.vitalSigns).length > 0) {
      this.observationWriter.writeVitals(dto.vitalSigns, {
        tenantId,
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        triageId: triage.id,
        observedAt: triage.triageTime || new Date(),
        observedBy: dto.triageStaffId,
      }).catch(() => {}); // Fire-and-forget; errors logged inside writer
    }

    return triage;
  }

  /**
   * Get triage by encounter ID
   */
  async getTriageByEncounterId(encounterId: string, tenantId: string) {
    const triage = await this.prisma.triage.findFirst({
      where: {
        encounterId,
        tenantId,
      },
      include: {
        encounter: {
          include: {
            patient: {
              select: {
                id: true,
                mrn: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    if (!triage) {
      throw new NotFoundException(
        `Triage not found for encounter ${encounterId}`
      );
    }

    return triage;
  }

  /**
   * Get triage by ID
   */
  async getTriageById(id: string, tenantId: string) {
    const triage = await this.prisma.triage.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        encounter: {
          include: {
            patient: {
              select: {
                id: true,
                mrn: true,
                firstName: true,
                middleName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
                phoneNumber: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!triage) {
      throw new NotFoundException(`Triage with ID ${id} not found`);
    }

    return triage;
  }

  /**
   * Update triage
   */
  async updateTriage(id: string, dto: UpdateTriageDto, context: any) {
    const { tenantId } = context;

    // Verify triage exists
    const existing = await this.prisma.triage.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Triage with ID ${id} not found`);
    }

    // Prepare update data
    const updateData: any = {};

    if (dto.triageStaffId) updateData.triageStaffId = dto.triageStaffId;
    if (dto.triageLevel !== undefined) updateData.triageLevel = dto.triageLevel;
    if (dto.chiefComplaintsAndHPI !== undefined) {
      updateData.chiefComplaintsAndHPI = dto.chiefComplaintsAndHPI;
    }
    if (dto.vitalSigns !== undefined) updateData.vitalSigns = dto.vitalSigns;
    if (dto.painScore !== undefined) updateData.painScore = dto.painScore;
    if (dto.allergies !== undefined) updateData.allergies = dto.allergies;
    if (dto.currentMedications !== undefined) {
      updateData.currentMedications = dto.currentMedications;
    }
    if (dto.triageNotes !== undefined) updateData.triageNotes = dto.triageNotes;

    const updated = await this.prisma.triage.update({
      where: { id },
      data: updateData,
      include: {
        encounter: {
          include: {
            patient: {
              select: {
                id: true,
                mrn: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    // Re-write structured observations if vital signs were updated
    if (dto.vitalSigns && Object.keys(dto.vitalSigns).length > 0) {
      this.observationWriter.writeVitals(dto.vitalSigns, {
        tenantId,
        patientId: existing.patientId,
        encounterId: existing.encounterId,
        triageId: id,
        observedAt: updated.triageTime || new Date(),
        observedBy: dto.triageStaffId || existing.triageStaffId,
      }).catch(() => {});
    }

    return updated;
  }

  /**
   * Delete triage
   */
  async deleteTriage(id: string, tenantId: string) {
    const triage = await this.prisma.triage.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!triage) {
      throw new NotFoundException(`Triage with ID ${id} not found`);
    }

    await this.prisma.triage.delete({
      where: { id },
    });

    return { message: 'Triage deleted successfully' };
  }

  /**
   * Get all triages by patient ID
   */
  async getPatientTriages(patientId: string, tenantId: string) {
    return this.prisma.triage.findMany({
      where: {
        patientId,
        tenantId,
      },
      orderBy: { triageTime: 'desc' },
      include: {
        encounter: {
          select: {
            id: true,
            status: true,
            startTime: true,
            encounterClass: true,
          },
        },
      },
    });
  }

  /**
   * Get triages by triage level (for prioritization)
   */
  async getTriagesByLevel(triageLevel: number, tenantId: string) {
    return this.prisma.triage.findMany({
      where: {
        triageLevel,
        tenantId,
      },
      orderBy: { triageTime: 'asc' }, // Oldest first for urgent cases
      include: {
        encounter: {
          include: {
            patient: {
              select: {
                id: true,
                mrn: true,
                firstName: true,
                lastName: true,
                dateOfBirth: true,
                gender: true,
              },
            },
          },
        },
      },
    });
  }
}
