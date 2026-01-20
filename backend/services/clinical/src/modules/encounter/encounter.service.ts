/**
 * Encounter Service
 *
 * Business logic for encounter management
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { SearchEncounterDto } from './dto/search-encounter.dto';
import { EncounterNumberGeneratorService } from './encounter-number-generator.service';
import { STANDARD_PATIENT_SELECT } from '../common/constants/patient-select.constant';
import { PatientDisplayDto } from '@zeal/contracts';

@Injectable()
export class EncounterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encounterNumberGenerator: EncounterNumberGeneratorService
  ) { }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Build patient display info from patient record
   */
  private buildPatientDisplay(patient: any): PatientDisplayDto {
    return {
      patientId: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
      age: this.calculateAge(patient.dateOfBirth),
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
      gender: patient.gender,
      nationalId: patient.nationalId || undefined,
      nationalIdType: patient.nationalIdType || undefined,
      phoneNumber: patient.phoneNumber || undefined,
      email: patient.email || undefined,
      nationality: patient.nationality || undefined,
      preferredLanguage: patient.preferredLanguage || undefined,
    };
  }

  /**
   * Create a new encounter
   */
  async createEncounter(dto: CreateEncounterDto, context: any) {
    const { tenantId, userId, facilityId } = context;

    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${dto.patientId} not found`);
    }

    // If appointment ID provided, verify it exists
    if (dto.appointmentId) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: dto.appointmentId },
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${dto.appointmentId} not found`);
      }
    }

    // Check if encounter already exists for this patient-staff combination on the same day
    const startDate = new Date(dto.startTime);
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEncounter = await this.prisma.encounter.findFirst({
      where: {
        tenantId,
        patientId: dto.patientId,
        primaryStaffId: dto.primaryStaffId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ['cancelled'], // Exclude cancelled encounters from the check
        },
      },
    });

    if (existingEncounter) {
      throw new BadRequestException(
        `An encounter already exists for this patient with this staff member on ${startDate.toLocaleDateString()}. Only one encounter per patient-staff combination per day is allowed.`
      );
    }

    // Build encounter data
    const encounterNumber = await this.encounterNumberGenerator.generateEncounterNumber({
      tenantId,
      facilityId,
      facilityCode: context.facilityCode,
    });

    const encounterData: any = {
      tenantId,
      patientId: dto.patientId,
      facilityId,
      appointmentId: dto.appointmentId || null,
      primaryStaffId: dto.primaryStaffId,
      encounterClass: dto.encounterClass || 'AMB',
      status: dto.status || 'planned',
      priority: dto.priority || 'routine',
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : null,
      encounterSource: dto.encounterSource || 'appointment',
      encounterNumber,
    };

    // Add optional fields only if provided
    if (dto.walkInDetails) encounterData.walkInDetails = dto.walkInDetails;

    // Create encounter
    const encounter = await this.prisma.encounter.create({
      data: encounterData,
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
        appointment: true,
      },
    });

    return encounter;
  }

  /**
   * Search encounters with filters
   */
  async searchEncounters(tenantId: string, query: SearchEncounterDto) {
    const { page = 1, limit = 20, search, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
    };

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.primaryStaffId) {
      where.primaryStaffId = filters.primaryStaffId;
    }

    if (filters.facilityId) {
      where.facilityId = filters.facilityId;
    }

    if (filters.encounterNumber) {
      where.encounterNumber = filters.encounterNumber;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.encounterClass) {
      where.encounterClass = filters.encounterClass;
    }

    if (filters.startDate || filters.endDate) {
      where.startTime = {};
      if (filters.startDate) {
        where.startTime.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.startTime.lte = new Date(filters.endDate);
      }
    }

    if (search) {
      where.OR = [
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [encounters, total] = await Promise.all([
      this.prisma.encounter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
        include: {
          patient: {
            select: STANDARD_PATIENT_SELECT,
          },
          appointment: {
            select: {
              id: true,
              appointmentType: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.encounter.count({ where }),
    ]);

    // Transform encounters to include patientDisplay
    const encountersWithPatientDisplay = encounters.map((encounter) => ({
      ...encounter,
      patientDisplay: encounter.patient ? this.buildPatientDisplay(encounter.patient) : null,
      patient: undefined, // Remove raw patient data
    }));

    return {
      data: encountersWithPatientDisplay,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get encounter by ID
   */
  async getEncounterById(id: string, tenantId: string) {
    const encounter = await this.prisma.encounter.findFirst({
      where: {
        id,
        tenantId,
      },
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
        appointment: {
          select: {
            id: true,
            appointmentType: true,
            status: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    return encounter;
  }

  /**
   * Update encounter
   */
  async updateEncounter(
    id: string,
    dto: UpdateEncounterDto,
    context: any
  ) {
    const { tenantId } = context;

    // Verify encounter exists
    const existing = await this.prisma.encounter.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    // Prepare update data
    const updateData: any = {};

    if (dto.status) updateData.status = dto.status;
    if (dto.endTime) updateData.endTime = new Date(dto.endTime);
    if (dto.dischargeDisposition !== undefined) updateData.dischargeDisposition = dto.dischargeDisposition;
    if (dto.followUpInstructions !== undefined) updateData.followUpInstructions = dto.followUpInstructions;

    const updated = await this.prisma.encounter.update({
      where: { id },
      data: updateData,
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
        appointment: true,
      },
    });

    return updated;
  }

  /**
   * Update encounter status
   */
  async updateEncounterStatus(
    id: string,
    status: string,
    tenantId: string
  ) {
    const encounter = await this.prisma.encounter.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    return this.prisma.encounter.update({
      where: { id },
      data: {
        status,
        // If finishing encounter, set end time
        ...(status === 'finished' && !encounter.endTime
          ? { endTime: new Date() }
          : {}),
      },
    });
  }

  /**
   * Get patient encounters
   */
  async getPatientEncounters(patientId: string, tenantId: string) {
    return this.prisma.encounter.findMany({
      where: {
        patientId,
        tenantId,
      },
      orderBy: { startTime: 'desc' },
      include: {
        appointment: {
          select: {
            id: true,
            appointmentType: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * Get patient's active encounters (for linking to inpatient admission)
   * Returns encounters that are not finished/cancelled and don't have an inpatient admission
   */
  async getPatientActiveEncounters(patientId: string, tenantId: string) {
    return this.prisma.encounter.findMany({
      where: {
        patientId,
        tenantId,
        status: {
          notIn: ['finished', 'cancelled', 'entered-in-error'],
        },
        // Only show encounters without existing inpatient admission
        inpatientAdmission: null,
      },
      orderBy: { startTime: 'desc' },
      select: {
        id: true,
        encounterNumber: true,
        encounterClass: true,
        encounterType: true,
        status: true,
        startTime: true,
        encounterSource: true,
        chiefComplaint: true,
        primaryStaffId: true,
        appointment: {
          select: {
            id: true,
            appointmentType: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * Get today's encounters for a facility
   */
  async getTodayEncounters(facilityId: string, tenantId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.encounter.findMany({
      where: {
        facilityId,
        tenantId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: 'asc' },
      include: {
        patient: {
          select: {
            id: true,
            mrn: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

}
