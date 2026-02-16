import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateScreeningProtocolDto,
  UpdateScreeningProtocolDto,
  ScheduleScreeningDto,
  CompleteScreeningDto,
  DeclineScreeningDto,
  ScreeningStatus,
} from '../dto/screening-protocol.dto';

@Injectable()
export class ScreeningProtocolService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Protocol Methods
  // ============================================

  async createProtocol(tenantId: string, dto: CreateScreeningProtocolDto) {
    return this.prisma.screeningProtocol.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async findProtocolById(tenantId: string, id: string) {
    const protocol = await this.prisma.screeningProtocol.findFirst({
      where: {
        id,
        OR: [{ tenantId }, { tenantId: null }], // Include global protocols
      },
    });
    if (!protocol) {
      throw new NotFoundException(`Screening protocol with ID ${id} not found`);
    }
    return protocol;
  }

  async findAllProtocols(tenantId: string, options?: { category?: string; isActive?: boolean }) {
    const where: any = {
      OR: [{ tenantId }, { tenantId: null }], // Include global protocols
    };
    if (options?.category) where.category = options.category;
    if (options?.isActive !== undefined) where.isActive = options.isActive;

    return this.prisma.screeningProtocol.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async updateProtocol(tenantId: string, id: string, dto: UpdateScreeningProtocolDto) {
    await this.findProtocolById(tenantId, id);
    return this.prisma.screeningProtocol.update({
      where: { id },
      data: dto,
    });
  }

  // ============================================
  // Schedule Methods
  // ============================================

  async scheduleScreening(tenantId: string, userId: string, dto: ScheduleScreeningDto) {
    await this.findProtocolById(tenantId, dto.protocolId);

    return this.prisma.patientScreeningSchedule.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        protocolId: dto.protocolId,
        dueDate: new Date(dto.dueDate),
        riskLevel: dto.riskLevel ?? null,
        riskScore: dto.riskScore ?? null,
        ...(dto.riskFactorsPresent !== undefined && { riskFactorsPresent: dto.riskFactorsPresent }),
        notes: dto.notes ?? null,
        status: 'DUE',
        createdBy: userId,
      },
    });
  }

  async findScheduleById(tenantId: string, id: string) {
    const schedule = await this.prisma.patientScreeningSchedule.findFirst({
      where: { id, tenantId },
      include: {
        protocol: true,
      },
    });
    if (!schedule) {
      throw new NotFoundException(`Screening schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async findSchedulesByPatient(
    tenantId: string,
    patientId: string,
    options?: { status?: ScreeningStatus; includeOverdue?: boolean },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.status) where.status = options.status;

    const schedules = await this.prisma.patientScreeningSchedule.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        protocol: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
            screeningType: true,
            frequencyMonths: true,
          },
        },
      },
    });

    // Update overdue status
    if (options?.includeOverdue) {
      const now = new Date();
      for (const schedule of schedules) {
        if (schedule.status === 'DUE' && new Date(schedule.dueDate) < now) {
          await this.prisma.patientScreeningSchedule.update({
            where: { id: schedule.id },
            data: { status: 'OVERDUE' },
          });
          schedule.status = 'OVERDUE';
        }
      }
    }

    return schedules;
  }

  async getDueScreenings(tenantId: string, options?: { facilityId?: string; daysAhead?: number }) {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (options?.daysAhead || 30));

    const where: any = {
      tenantId,
      status: { in: ['DUE', 'OVERDUE'] },
      dueDate: { lte: endDate },
    };

    return this.prisma.patientScreeningSchedule.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        protocol: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
            screeningType: true,
          },
        },
        patient: {
          select: {
            id: true,
            mrn: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async completeScreening(
    tenantId: string,
    id: string,
    userId: string,
    dto: CompleteScreeningDto,
  ) {
    const schedule = await this.findScheduleById(tenantId, id);

    if (['COMPLETED', 'DECLINED', 'NOT_APPLICABLE'].includes(schedule.status)) {
      throw new BadRequestException('Screening is already completed or declined');
    }

    // Calculate next due date if not provided
    let nextDueDate = dto.nextDueDate ? new Date(dto.nextDueDate) : null;
    if (!nextDueDate && schedule.protocol.frequencyMonths) {
      nextDueDate = new Date();
      nextDueDate.setMonth(nextDueDate.getMonth() + schedule.protocol.frequencyMonths);
    }

    // Update current schedule
    const updatedSchedule = await this.prisma.patientScreeningSchedule.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        completedBy: userId,
        ...(dto.encounterId !== undefined && { encounterId: dto.encounterId }),
        ...(dto.results !== undefined && { results: dto.results }),
        ...(dto.findings !== undefined && { findings: dto.findings }),
        ...(dto.recommendations !== undefined && { recommendations: dto.recommendations }),
        nextDueDate,
      },
    });

    // Create next screening schedule if applicable
    if (nextDueDate) {
      await this.prisma.patientScreeningSchedule.create({
        data: {
          tenantId,
          patientId: schedule.patientId,
          protocolId: schedule.protocolId,
          dueDate: nextDueDate,
          status: 'DUE',
          createdBy: userId,
        },
      });
    }

    return updatedSchedule;
  }

  async declineScreening(tenantId: string, id: string, userId: string, dto: DeclineScreeningDto) {
    const schedule = await this.findScheduleById(tenantId, id);

    if (['COMPLETED', 'DECLINED'].includes(schedule.status)) {
      throw new BadRequestException('Screening is already completed or declined');
    }

    return this.prisma.patientScreeningSchedule.update({
      where: { id },
      data: {
        status: 'DECLINED',
        declineReason: dto.declineReason,
        ...(dto.notes !== undefined && { notes: dto.notes }),
        completedAt: new Date(),
        completedBy: userId,
      },
    });
  }

  async markNotApplicable(tenantId: string, id: string, userId: string, reason?: string) {
    const schedule = await this.findScheduleById(tenantId, id);

    return this.prisma.patientScreeningSchedule.update({
      where: { id },
      data: {
        status: 'NOT_APPLICABLE',
        ...(reason !== undefined && { notes: reason }),
        completedAt: new Date(),
        completedBy: userId,
      },
    });
  }

  async sendReminder(tenantId: string, id: string) {
    const schedule = await this.findScheduleById(tenantId, id);

    // Update reminder tracking
    await this.prisma.patientScreeningSchedule.update({
      where: { id },
      data: {
        reminderSentAt: new Date(),
        reminderCount: { increment: 1 },
      },
    });

    // In a real implementation, this would trigger notification service
    return { success: true, message: 'Reminder sent' };
  }

  // ============================================
  // Risk Assessment Methods
  // ============================================

  async assessPatientRisks(tenantId: string, patientId: string) {
    // Get patient info
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, tenantId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    // Get all active screening protocols
    const protocols = await this.findAllProtocols(tenantId, { isActive: true });

    // Calculate age
    const age = this.calculateAge(patient.dateOfBirth);

    // Filter applicable protocols
    const applicableProtocols = protocols.filter((p) => {
      const ageMatch =
        (p.minAge === null || age >= p.minAge) &&
        (p.maxAge === null || age <= p.maxAge);
      const genderMatch =
        p.gender === null || p.gender === 'all' || p.gender === patient.gender;
      return ageMatch && genderMatch;
    });

    // Get existing schedules
    const existingSchedules = await this.prisma.patientScreeningSchedule.findMany({
      where: { tenantId, patientId },
    });

    const existingProtocolIds = new Set(existingSchedules.map((s) => s.protocolId));

    // Identify missing screenings
    const missingScreenings = applicableProtocols.filter(
      (p) => !existingProtocolIds.has(p.id),
    );

    return {
      patient: {
        id: patient.id,
        mrn: patient.mrn,
        age,
        gender: patient.gender,
      },
      applicableProtocols: applicableProtocols.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        frequencyMonths: p.frequencyMonths,
      })),
      existingSchedules: existingSchedules.length,
      missingScreenings: missingScreenings.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        recommendedDueDate: new Date(), // Should be scheduled now
      })),
    };
  }

  // ============================================
  // Helper Methods
  // ============================================

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
}
