/**
 * Admission Service
 *
 * Business logic for inpatient admission management
 * Updated to use new status model and event logging
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { SearchAdmissionsDto } from './dto/search-admissions.dto';
import { AdmissionNumberGeneratorService } from './admission-number-generator.service';
import { EncounterNumberGeneratorService } from '../encounter/encounter-number-generator.service';
import { BedSearchService } from '../bed-search/bed-search.service';
import { EventService } from './event.service';
import {
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientAcuity,
} from './dto/create-event.dto';
import { BoardFlagsBuilder } from './utils/board-flags.util';
import { ChannelService } from './channel.service';
import { MembershipService } from './membership.service';
import { ChannelEventEmitter } from './channel-event-emitter.service';

@Injectable()
export class AdmissionService {
  private readonly logger = new Logger(AdmissionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly admissionNumberGenerator: AdmissionNumberGeneratorService,
    private readonly encounterNumberGenerator: EncounterNumberGeneratorService,
    private readonly bedSearchService: BedSearchService,
    private readonly eventService: EventService,
    private readonly channelService: ChannelService,
    private readonly membershipService: MembershipService,
    private readonly channelEventEmitter: ChannelEventEmitter,
  ) {}

  /**
   * Create a new inpatient admission
   */
  async createAdmission(dto: CreateAdmissionDto, context: any) {
    const { tenantId, userId, facilityId } = context;

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId, tenantId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${dto.patientId} not found`);
    }

    // Check for active admission using new status model
    const activeAdmission = await this.prisma.inpatientAdmission.findFirst({
      where: {
        tenantId,
        patientId: dto.patientId,
        admissionStatus: {
          in: [
            InpatientAdmissionStatus.ADMITTED,
            InpatientAdmissionStatus.ACTIVE,
            InpatientAdmissionStatus.ON_LEAVE,
            InpatientAdmissionStatus.DISCHARGE_PLANNING,
          ],
        },
      },
    });

    if (activeAdmission) {
      throw new ConflictException(
        `Patient already has an active admission (${activeAdmission.admissionNumber})`
      );
    }

    // Validate bed availability
    if (dto.initialBedId) {
      const bedValidation = await this.bedSearchService.validateBedAvailability(
        { bedId: dto.initialBedId },
        { tenantId, userId, facilityId }
      );

      if (!bedValidation.isAvailable) {
        throw new BadRequestException(
          bedValidation.error || 'Bed is not available for assignment'
        );
      }
    }

    // Generate admission number
    const admissionNumber = await this.admissionNumberGenerator.generateAdmissionNumber({
      tenantId,
      facilityId,
    });

    // Create or link encounter
    let encounterId = dto.encounterId;
    if (!encounterId) {
      // Generate encounter number
      const encounterNumber = await this.encounterNumberGenerator.generateEncounterNumber({
        tenantId,
        facilityId,
        facilityCode: context.facilityCode,
      });

      // Create new encounter
      const encounter = await this.prisma.encounter.create({
        data: {
          tenantId,
          facilityId,
          patientId: dto.patientId,
          primaryStaffId: dto.attendingPhysicianId,
          encounterNumber,
          encounterClass: 'IMP', // Inpatient
          encounterType: 'inpatient_admission',
          status: 'in-progress',
          startTime: new Date(dto.admissionDate),
          encounterSource: this.mapAdmissionSourceToEncounterSource(dto.admissionSource),
        },
      });
      encounterId = encounter.id;
    } else {
      // Verify encounter exists
      const encounter = await this.prisma.encounter.findUnique({
        where: { id: encounterId, tenantId },
      });

      if (!encounter) {
        throw new NotFoundException(`Encounter with ID ${encounterId} not found`);
      }

      // Update encounter to inpatient class
      await this.prisma.encounter.update({
        where: { id: encounterId },
        data: {
          encounterClass: 'IMP',
          encounterType: 'inpatient_admission',
        },
      });
    }

    // Calculate next vitals time if frequency provided
    let nextVitalsAt: Date | undefined;
    if (dto.vitalsFrequency) {
      nextVitalsAt = this.calculateNextVitalsTime(
        new Date(dto.admissionDate),
        dto.vitalsFrequency
      );
    }

    // Determine initial acuity from DTO or clinical alerts
    let initialAcuity: InpatientAcuity = InpatientAcuity.STABLE;
    if (dto.acuity) {
      // Validate and cast string acuity to enum
      initialAcuity = dto.acuity as InpatientAcuity;
    } else if (dto.clinicalAlerts?.includes('critical')) {
      initialAcuity = InpatientAcuity.CRITICAL;
    }

    // Build board flags from clinical data
    const boardFlags = new BoardFlagsBuilder()
      .fromClinicalAlerts(dto.clinicalAlerts || [])
      .setFallRiskFromScore(dto.fallRiskScore)
      .setIsolation(!!dto.isolationType, dto.isolationType as any)
      .buildJSON();

    this.logger.log(`Creating admission for patient ${dto.patientId}`);

    // Create admission record with new status model
    const admission = await this.prisma.inpatientAdmission.create({
      data: {
        tenantId,
        facilityId,
        patientId: dto.patientId,
        encounterId,
        admissionNumber,
        admissionDate: new Date(dto.admissionDate),
        admissionType: dto.admissionType,
        admissionSource: dto.admissionSource,
        attendingPhysicianId: dto.attendingPhysicianId,
        primaryNurseId: dto.primaryNurseId || null,
        currentWardId: dto.initialWardId,
        currentBedId: dto.initialBedId,

        // New status model
        admissionStatus: InpatientAdmissionStatus.ADMITTED,
        dischargeStatus: InpatientDischargeStatus.NONE,
        acuity: initialAcuity,
        boardFlags,

        // Legacy fields (kept for backward compatibility)
        clinicalAlerts: dto.clinicalAlerts || [],
        isolationType: dto.isolationType || null,
        fallRiskScore: dto.fallRiskScore || null,

        vitalsFrequency: dto.vitalsFrequency || null,
        nextVitalsAt: nextVitalsAt || null,
        insuranceAuthNumber: dto.insuranceAuthNumber || null,
        estimatedCost: dto.estimatedCost || null,
        createdBy: userId,
      },
    });

    this.logger.log(`Admission created: ${admission.admissionNumber}`);

    // Create bed assignment record
    await this.prisma.bedAssignment.create({
      data: {
        tenantId,
        admissionId: admission.id,
        patientId: dto.patientId,
        bedId: dto.initialBedId,
        wardId: dto.initialWardId,
        spaceId: dto.initialBedId, // TODO: Get spaceId from Foundation API
        assignedAt: new Date(dto.admissionDate),
        isTransfer: false,
        assignedBy: userId,
      },
    });

    // Log admission created event using EventService
    await this.eventService.logAdmissionCreated(admission.id, userId, tenantId);

    // Log initial bed assignment
    if (dto.initialBedId) {
      await this.eventService.logBedAssignment(
        admission.id,
        dto.initialBedId,
        dto.initialWardId,
        dto.initialBedId, // TODO: Replace with actual spaceId
        userId,
        tenantId,
        'Initial bed assignment on admission'
      );
    }

    this.logger.log(`Events logged for admission ${admission.admissionNumber}`);

    // Create care channel for the admission
    const channel = await this.channelService.createChannel(admission.id, context);
    this.logger.log(`Care channel created: ${channel.id} for admission ${admission.admissionNumber}`);

    // Sync initial team members (attending, primary nurse, consulting physicians)
    await this.membershipService.syncAdmissionTeam(admission.id, tenantId, userId);
    this.logger.log(`Team members synced to channel ${channel.id}`);

    // Emit admission created message
    await this.channelEventEmitter.emitAdmissionCreated(admission.id, channel.id, context);

    return {
      id: admission.id,
      admissionNumber: admission.admissionNumber,
      patientId: admission.patientId,
      encounterId: admission.encounterId,
      admissionStatus: admission.admissionStatus,
      dischargeStatus: admission.dischargeStatus,
      acuity: admission.acuity,
      admissionDate: admission.admissionDate,
      currentBedId: admission.currentBedId,
      boardFlags: admission.boardFlags,
      createdAt: admission.createdAt,
    };
  }

  /**
   * Get admission by ID
   */
  async getAdmissionById(admissionId: string, tenantId: string) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
      include: {
        encounter: true,
        bedAssignments: {
          orderBy: { assignedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    return admission;
  }

  /**
   * Update admission
   */
  async updateAdmission(
    admissionId: string,
    dto: UpdateAdmissionDto,
    context: any
  ) {
    const { tenantId, userId } = context;

    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Calculate next vitals time if frequency updated
    let nextVitalsAt: Date | undefined;
    if (dto.vitalsFrequency) {
      const lastVitalsAt = admission.lastVitalsAt || new Date();
      nextVitalsAt = this.calculateNextVitalsTime(lastVitalsAt, dto.vitalsFrequency);
    }

    // Build update data
    const updateData: any = {
      updatedBy: userId,
    };

    if (dto.attendingPhysicianId) updateData.attendingPhysicianId = dto.attendingPhysicianId;
    if (dto.primaryNurseId !== undefined) updateData.primaryNurseId = dto.primaryNurseId || null;
    if (dto.clinicalAlerts) updateData.clinicalAlerts = dto.clinicalAlerts;
    if (dto.isolationType !== undefined) updateData.isolationType = dto.isolationType || null;
    if (dto.fallRiskScore !== undefined) updateData.fallRiskScore = dto.fallRiskScore || null;
    if (dto.vitalsFrequency !== undefined) {
      updateData.vitalsFrequency = dto.vitalsFrequency || null;
      if (nextVitalsAt) updateData.nextVitalsAt = nextVitalsAt;
    }
    if (dto.expectedDischargeDate !== undefined) {
      updateData.expectedDischargeDate = dto.expectedDischargeDate ? new Date(dto.expectedDischargeDate) : null;
    }
    if (dto.dischargeNotes !== undefined) updateData.dischargeNotes = dto.dischargeNotes || null;
    if (dto.insuranceAuthNumber !== undefined) updateData.insuranceAuthNumber = dto.insuranceAuthNumber || null;
    if (dto.estimatedCost !== undefined) updateData.estimatedCost = dto.estimatedCost || null;

    // Update admission
    const updated = await this.prisma.inpatientAdmission.update({
      where: { id: admissionId },
      data: updateData,
    });

    return updated;
  }

  /**
   * Get patient's active admission (updated for new status model)
   */
  async getPatientActiveAdmission(patientId: string, tenantId: string) {
    const admission = await this.prisma.inpatientAdmission.findFirst({
      where: {
        tenantId,
        patientId,
        admissionStatus: {
          in: [
            InpatientAdmissionStatus.ADMITTED,
            InpatientAdmissionStatus.ACTIVE,
            InpatientAdmissionStatus.ON_LEAVE,
            InpatientAdmissionStatus.DISCHARGE_PLANNING,
          ],
        },
      },
      include: {
        encounter: true,
        bedAssignments: {
          where: { releasedAt: null },
          take: 1,
        },
      },
    });

    return admission;
  }

  /**
   * Get ward patients (updated for new status model)
   */
  async getWardPatients(wardId: string, tenantId: string) {
    const admissions = await this.prisma.inpatientAdmission.findMany({
      where: {
        tenantId,
        currentWardId: wardId,
        admissionStatus: {
          in: [
            InpatientAdmissionStatus.ADMITTED,
            InpatientAdmissionStatus.ACTIVE,
            InpatientAdmissionStatus.ON_LEAVE,
            InpatientAdmissionStatus.DISCHARGE_PLANNING,
          ],
        },
      },
      include: {
        bedAssignments: {
          where: { releasedAt: null },
          take: 1,
        },
      },
      orderBy: {
        admissionDate: 'desc',
      },
    });

    return admissions;
  }

  /**
   * Update admission status
   */
  async updateAdmissionStatus(
    admissionId: string,
    newStatus: InpatientAdmissionStatus,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    const oldStatus = admission.admissionStatus;

    // Update status
    await this.prisma.inpatientAdmission.update({
      where: { id: admissionId },
      data: {
        admissionStatus: newStatus,
        updatedBy: userId,
      },
    });

    // Log status change
    await this.eventService.logAdmissionStatusChange(
      admissionId,
      oldStatus,
      newStatus,
      userId,
      tenantId,
      reason
    );

    this.logger.log(
      `Admission ${admission.admissionNumber} status changed: ${oldStatus} → ${newStatus}`
    );

    return { oldStatus, newStatus };
  }

  /**
   * Update patient acuity
   */
  async updateAcuity(
    admissionId: string,
    newAcuity: InpatientAcuity,
    userId: string,
    tenantId: string,
    reason?: string
  ) {
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission ${admissionId} not found`);
    }

    const oldAcuity = admission.acuity;

    // Update acuity
    await this.prisma.inpatientAdmission.update({
      where: { id: admissionId },
      data: {
        acuity: newAcuity,
        updatedBy: userId,
      },
    });

    // Log acuity change
    await this.eventService.logAcuityChange(
      admissionId,
      oldAcuity,
      newAcuity,
      userId,
      tenantId,
      reason
    );

    this.logger.log(
      `Admission ${admission.admissionNumber} acuity changed: ${oldAcuity} → ${newAcuity}`
    );

    return { oldAcuity, newAcuity };
  }

  /**
   * Search admissions with filters
   */
  async searchAdmissions(query: SearchAdmissionsDto, tenantId: string) {
    const {
      searchTerm,
      patientName,
      mrn,
      admissionNumber,
      status,
      admissionDateFrom,
      admissionDateTo,
      admissionDate,
      wardId,
      attendingPhysicianId,
      limit = 20,
      offset = 0,
      sortBy = 'admissionDate',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: any = {
      tenantId,
    };

    // Patient search - need to find patient IDs first
    let patientIds: string[] | undefined;
    if (searchTerm || patientName || mrn) {
      const patientWhere: any = { tenantId };

      if (searchTerm) {
        // Search in both name and MRN
        patientWhere.OR = [
          {
            firstName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            mrn: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ];
      } else {
        if (patientName) {
          patientWhere.OR = [
            {
              firstName: {
                contains: patientName,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: patientName,
                mode: 'insensitive',
              },
            },
          ];
        }
        if (mrn) {
          patientWhere.mrn = {
            contains: mrn,
            mode: 'insensitive',
          };
        }
      }

      // Get matching patient IDs
      const patients = await this.prisma.patient.findMany({
        where: patientWhere,
        select: { id: true },
      });

      patientIds = patients.map((p) => p.id);

      // If no patients found, return empty result
      if (patientIds.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            limit,
            offset,
          },
        };
      }

      where.patientId = { in: patientIds };
    }

    // Admission number filter
    if (admissionNumber) {
      where.admissionNumber = {
        contains: admissionNumber,
        mode: 'insensitive',
      };
    }

    // Status filter (map legacy status strings to new enums)
    if (status) {
      // Map from SearchAdmissionsDto.AdmissionStatus (legacy) to InpatientAdmissionStatus (new)
      const statusStr = status.toLowerCase();
      if (statusStr === 'admitted') {
        // Legacy "admitted" maps to both ADMITTED and ACTIVE
        where.admissionStatus = {
          in: [InpatientAdmissionStatus.ADMITTED, InpatientAdmissionStatus.ACTIVE],
        };
      } else if (statusStr === 'discharged') {
        where.admissionStatus = InpatientAdmissionStatus.DISCHARGED;
      } else if (statusStr === 'absconded') {
        where.admissionStatus = InpatientAdmissionStatus.ABSCONDED;
      } else if (statusStr === 'deceased') {
        where.admissionStatus = InpatientAdmissionStatus.EXPIRED;
      } else {
        // Fallback: use legacy status field for backward compatibility
        where.status = statusStr;
      }
    }

    // Date filters
    if (admissionDate) {
      // Specific date - search for admissions on that day
      const date = new Date(admissionDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.admissionDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    } else {
      // Date range
      if (admissionDateFrom || admissionDateTo) {
        where.admissionDate = {};
        if (admissionDateFrom) {
          where.admissionDate.gte = new Date(admissionDateFrom);
        }
        if (admissionDateTo) {
          where.admissionDate.lte = new Date(admissionDateTo);
        }
      }
    }

    // Ward filter
    if (wardId) {
      where.currentWardId = wardId;
    }

    // Physician filter
    if (attendingPhysicianId) {
      where.attendingPhysicianId = attendingPhysicianId;
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'admissionDate') {
      orderBy.admissionDate = sortOrder;
    } else if (sortBy === 'admissionNumber') {
      orderBy.admissionNumber = sortOrder;
    } else {
      orderBy.admissionDate = sortOrder; // Default
    }

    // Get total count
    const total = await this.prisma.inpatientAdmission.count({ where });

    // Get paginated results
    const admissions = await this.prisma.inpatientAdmission.findMany({
      where,
      include: {
        encounter: {
          select: {
            id: true,
            encounterNumber: true,
            status: true,
          },
        },
        bedAssignments: {
          where: { releasedAt: null },
          take: 1,
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    // Get patient details for results
    const admissionsWithPatients = await Promise.all(
      admissions.map(async (admission) => {
        const patient = await this.prisma.patient.findUnique({
          where: { id: admission.patientId },
          select: {
            id: true,
            mrn: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            nationalId: true,
          },
        });

        return {
          ...admission,
          patient,
        };
      })
    );

    return {
      data: admissionsWithPatients,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  /**
   * Helper: Map admission source to encounter source
   */
  private mapAdmissionSourceToEncounterSource(admissionSource: string): string {
    const mapping: Record<string, string> = {
      emergency_room: 'emergency',
      outpatient_dept: 'appointment',
      transfer_in: 'transfer',
      direct: 'walk-in',
      physician_referral: 'referral',
    };

    return mapping[admissionSource] || 'walk-in';
  }

  /**
   * Helper: Calculate next vitals time based on frequency
   */
  private calculateNextVitalsTime(lastTime: Date, frequency: string): Date {
    const next = new Date(lastTime);

    const frequencyMap: Record<string, number> = {
      q1h: 1,
      q2h: 2,
      q4h: 4,
      q8h: 8,
      q12h: 12,
      daily: 24,
    };

    const hours = frequencyMap[frequency] || 4;
    next.setHours(next.getHours() + hours);

    return next;
  }
}
