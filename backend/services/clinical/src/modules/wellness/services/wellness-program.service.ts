import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateWellnessProgramTemplateDto,
  UpdateWellnessProgramTemplateDto,
  EnrollInProgramDto,
  UpdateEnrollmentDto,
  ScheduleSessionDto,
  UpdateSessionDto,
  CompleteMilestoneDto,
  WellnessProgramStatus,
  WellnessSessionStatus,
} from '../dto/wellness-program.dto';

@Injectable()
export class WellnessProgramService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Template Methods
  // ============================================

  async createTemplate(tenantId: string, userId: string, dto: CreateWellnessProgramTemplateDto) {
    return this.prisma.wellnessProgramTemplate.create({
      data: {
        tenantId,
        ...dto,
        createdBy: userId,
      },
    });
  }

  async findTemplateById(tenantId: string, id: string) {
    const template = await this.prisma.wellnessProgramTemplate.findFirst({
      where: { id, tenantId },
    });
    if (!template) {
      throw new NotFoundException(`Program template with ID ${id} not found`);
    }
    return template;
  }

  async findAllTemplates(
    tenantId: string,
    options?: { programType?: string; isActive?: boolean },
  ) {
    const where: any = { tenantId };
    if (options?.programType) where.programType = options.programType;
    if (options?.isActive !== undefined) where.isActive = options.isActive;

    return this.prisma.wellnessProgramTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async updateTemplate(tenantId: string, id: string, dto: UpdateWellnessProgramTemplateDto) {
    await this.findTemplateById(tenantId, id);
    return this.prisma.wellnessProgramTemplate.update({
      where: { id },
      data: dto,
    });
  }

  // ============================================
  // Enrollment Methods
  // ============================================

  async enrollPatient(tenantId: string, userId: string, dto: EnrollInProgramDto) {
    const template = await this.findTemplateById(tenantId, dto.programTemplateId);

    // Check for existing active enrollment
    const existingEnrollment = await this.prisma.wellnessProgramEnrollment.findFirst({
      where: {
        tenantId,
        patientId: dto.patientId,
        programTemplateId: dto.programTemplateId,
        status: { in: ['ENROLLED', 'ACTIVE', 'PAUSED'] },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Patient is already enrolled in this program');
    }

    // Generate enrollment number
    const enrollmentNumber = await this.generateEnrollmentNumber(tenantId);

    // Calculate expected end date
    const startDate = new Date(dto.startDate);
    const expectedEndDate = new Date(startDate);
    expectedEndDate.setDate(expectedEndDate.getDate() + template.durationWeeks * 7);

    // Create enrollment
    const enrollment = await this.prisma.wellnessProgramEnrollment.create({
      data: {
        tenantId,
        facilityId: dto.facilityId,
        patientId: dto.patientId,
        programTemplateId: dto.programTemplateId,
        enrollmentNumber,
        startDate,
        expectedEndDate,
        primaryCoachId: dto.primaryCoachId ?? null,
        initialAssessmentId: dto.initialAssessmentId ?? null,
        subscriptionId: dto.subscriptionId ?? null,
        notes: dto.notes ?? null,
        status: 'ENROLLED',
        createdBy: userId,
      },
    });

    // Create milestones from template
    const templateMilestones = template.milestones as any[];
    if (templateMilestones && templateMilestones.length > 0) {
      await this.prisma.wellnessProgramMilestone.createMany({
        data: templateMilestones.map((m: any) => ({
          tenantId,
          enrollmentId: enrollment.id,
          milestoneName: m.name,
          milestoneWeek: m.weekNumber,
          criteria: m.criteria,
        })),
      });
    }

    return enrollment;
  }

  async findEnrollmentById(tenantId: string, id: string) {
    const enrollment = await this.prisma.wellnessProgramEnrollment.findFirst({
      where: { id, tenantId },
      include: {
        programTemplate: true,
        sessions: {
          orderBy: { sessionNumber: 'asc' },
        },
        milestones: {
          orderBy: { milestoneWeek: 'asc' },
        },
      },
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async findEnrollmentsByPatient(
    tenantId: string,
    patientId: string,
    options?: { status?: WellnessProgramStatus },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.status) where.status = options.status;

    return this.prisma.wellnessProgramEnrollment.findMany({
      where,
      orderBy: { enrolledAt: 'desc' },
      include: {
        programTemplate: {
          select: {
            id: true,
            code: true,
            name: true,
            programType: true,
            durationWeeks: true,
            totalSessions: true,
          },
        },
      },
    });
  }

  async updateEnrollment(tenantId: string, id: string, dto: UpdateEnrollmentDto) {
    const enrollment = await this.findEnrollmentById(tenantId, id);

    // If completing, set actual end date
    const updateData: any = { ...dto };
    if (dto.status === 'COMPLETED' && !enrollment.actualEndDate) {
      updateData.actualEndDate = new Date();
    }

    // Update completion percentage
    if (dto.status === 'COMPLETED') {
      updateData.completionPercent = 100;
    }

    return this.prisma.wellnessProgramEnrollment.update({
      where: { id },
      data: updateData,
    });
  }

  async activateEnrollment(tenantId: string, id: string) {
    const enrollment = await this.findEnrollmentById(tenantId, id);
    if (enrollment.status !== 'ENROLLED') {
      throw new BadRequestException('Only enrolled programs can be activated');
    }

    return this.prisma.wellnessProgramEnrollment.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async pauseEnrollment(tenantId: string, id: string) {
    const enrollment = await this.findEnrollmentById(tenantId, id);
    if (enrollment.status !== 'ACTIVE') {
      throw new BadRequestException('Only active programs can be paused');
    }

    return this.prisma.wellnessProgramEnrollment.update({
      where: { id },
      data: { status: 'PAUSED' },
    });
  }

  async cancelEnrollment(tenantId: string, id: string, reason?: string) {
    const enrollment = await this.findEnrollmentById(tenantId, id);
    if (['COMPLETED', 'CANCELLED'].includes(enrollment.status)) {
      throw new BadRequestException('Program is already completed or cancelled');
    }

    return this.prisma.wellnessProgramEnrollment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        actualEndDate: new Date(),
        notes: reason ? `${enrollment.notes || ''}\nCancellation reason: ${reason}`.trim() : enrollment.notes,
      },
    });
  }

  // ============================================
  // Session Methods
  // ============================================

  async scheduleSession(
    tenantId: string,
    enrollmentId: string,
    dto: ScheduleSessionDto,
  ) {
    const enrollment = await this.findEnrollmentById(tenantId, enrollmentId);

    // Get next session number
    const lastSession = await this.prisma.wellnessProgramSession.findFirst({
      where: { tenantId, enrollmentId },
      orderBy: { sessionNumber: 'desc' },
    });
    const sessionNumber = (lastSession?.sessionNumber || 0) + 1;

    // Determine phase and week based on scheduled date
    const startDate = new Date(enrollment.startDate);
    const scheduledDate = new Date(dto.scheduledDate);
    const daysDiff = Math.floor((scheduledDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const week = Math.max(1, Math.ceil(daysDiff / 7));

    // Find phase from template
    const phases = enrollment.programTemplate.phases as any[];
    let phase = 1;
    for (const p of phases) {
      if (week >= p.weekStart && week <= p.weekEnd) {
        phase = phases.indexOf(p) + 1;
        break;
      }
    }

    return this.prisma.wellnessProgramSession.create({
      data: {
        tenantId,
        enrollmentId,
        sessionNumber,
        sessionType: dto.sessionType,
        phase,
        week,
        appointmentId: dto.appointmentId ?? null,
        scheduledDate: scheduledDate,
        scheduledTime: dto.scheduledTime ?? null,
        providerId: dto.providerId ?? null,
        status: 'SCHEDULED',
      },
    });
  }

  async updateSession(
    tenantId: string,
    enrollmentId: string,
    sessionId: string,
    dto: UpdateSessionDto,
  ) {
    const session = await this.prisma.wellnessProgramSession.findFirst({
      where: { id: sessionId, tenantId, enrollmentId },
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    const updatedSession = await this.prisma.wellnessProgramSession.update({
      where: { id: sessionId },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.sessionNotes !== undefined && { sessionNotes: dto.sessionNotes }),
        ...(dto.interventions !== undefined && { interventions: dto.interventions }),
        ...(dto.homework !== undefined && { homework: dto.homework }),
        ...(dto.actualDate && { actualDate: new Date(dto.actualDate) }),
      },
    });

    // If session completed, update enrollment progress
    if (dto.status === 'COMPLETED') {
      await this.updateEnrollmentProgress(tenantId, enrollmentId);
    }

    return updatedSession;
  }

  async completeSession(
    tenantId: string,
    enrollmentId: string,
    sessionId: string,
    dto: UpdateSessionDto,
  ) {
    return this.updateSession(tenantId, enrollmentId, sessionId, {
      ...dto,
      status: WellnessSessionStatus.COMPLETED,
      actualDate: dto.actualDate || new Date().toISOString(),
    });
  }

  // ============================================
  // Milestone Methods
  // ============================================

  async completeMilestone(
    tenantId: string,
    enrollmentId: string,
    milestoneId: string,
    dto: CompleteMilestoneDto,
  ) {
    const milestone = await this.prisma.wellnessProgramMilestone.findFirst({
      where: { id: milestoneId, tenantId, enrollmentId },
    });
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${milestoneId} not found`);
    }

    if (milestone.isCompleted) {
      throw new BadRequestException('Milestone is already completed');
    }

    const updatedMilestone = await this.prisma.wellnessProgramMilestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        ...(dto.assessmentId !== undefined && { assessmentId: dto.assessmentId }),
        ...(dto.outcomeData !== undefined && { outcomeData: dto.outcomeData }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    // Update enrollment progress
    await this.updateEnrollmentProgress(tenantId, enrollmentId);

    return updatedMilestone;
  }

  // ============================================
  // Helper Methods
  // ============================================

  private async generateEnrollmentNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.wellnessProgramEnrollment.count({
      where: { tenantId },
    });
    const year = new Date().getFullYear();
    return `WP-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private async updateEnrollmentProgress(tenantId: string, enrollmentId: string) {
    const enrollment = await this.prisma.wellnessProgramEnrollment.findFirst({
      where: { id: enrollmentId, tenantId },
      include: {
        programTemplate: true,
        sessions: true,
        milestones: true,
      },
    });

    if (!enrollment) return;

    const totalSessions = enrollment.programTemplate.totalSessions;
    const completedSessions = enrollment.sessions.filter(
      (s) => s.status === 'COMPLETED',
    ).length;
    const completedMilestones = enrollment.milestones.filter(
      (m) => m.isCompleted,
    ).length;

    // Calculate completion percentage (weighted: 70% sessions, 30% milestones)
    const sessionPercent = totalSessions > 0 ? (completedSessions / totalSessions) * 70 : 70;
    const milestonePercent =
      enrollment.milestones.length > 0
        ? (completedMilestones / enrollment.milestones.length) * 30
        : 30;
    const completionPercent = sessionPercent + milestonePercent;

    // Calculate current week
    const startDate = new Date(enrollment.startDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.max(1, Math.ceil(daysDiff / 7));

    // Find current phase
    const phases = enrollment.programTemplate.phases as any[];
    let currentPhase = 1;
    for (const p of phases) {
      if (currentWeek >= p.weekStart && currentWeek <= p.weekEnd) {
        currentPhase = phases.indexOf(p) + 1;
        break;
      }
    }

    await this.prisma.wellnessProgramEnrollment.update({
      where: { id: enrollmentId },
      data: {
        sessionsCompleted: completedSessions,
        milestonesCompleted: completedMilestones,
        completionPercent: Math.round(completionPercent * 100) / 100,
        currentWeek,
        currentPhase,
      },
    });
  }
}
