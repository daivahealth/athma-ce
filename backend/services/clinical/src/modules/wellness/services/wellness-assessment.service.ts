import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateWellnessAssessmentTemplateDto,
  UpdateWellnessAssessmentTemplateDto,
  CreateWellnessAssessmentDto,
  UpdateWellnessAssessmentDto,
  CompleteWellnessAssessmentDto,
  WellnessAssessmentStatus,
} from '../dto/wellness-assessment.dto';
import { WellnessScoreService } from './wellness-score.service';

@Injectable()
export class WellnessAssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoreService: WellnessScoreService,
  ) {}

  // ============================================
  // Template Methods
  // ============================================

  async createTemplate(tenantId: string, userId: string, dto: CreateWellnessAssessmentTemplateDto) {
    return this.prisma.wellnessAssessmentTemplate.create({
      data: {
        tenantId,
        ...dto,
        createdBy: userId,
      },
    });
  }

  async findTemplateById(tenantId: string, id: string) {
    const template = await this.prisma.wellnessAssessmentTemplate.findFirst({
      where: { id, tenantId },
    });
    if (!template) {
      throw new NotFoundException(`Wellness assessment template with ID ${id} not found`);
    }
    return template;
  }

  async findAllTemplates(tenantId: string, options?: { category?: string; isActive?: boolean }) {
    const where: any = { tenantId };
    if (options?.category) where.category = options.category;
    if (options?.isActive !== undefined) where.isActive = options.isActive;

    return this.prisma.wellnessAssessmentTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async updateTemplate(tenantId: string, id: string, dto: UpdateWellnessAssessmentTemplateDto) {
    await this.findTemplateById(tenantId, id);
    return this.prisma.wellnessAssessmentTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async publishTemplate(tenantId: string, id: string) {
    await this.findTemplateById(tenantId, id);
    return this.prisma.wellnessAssessmentTemplate.update({
      where: { id },
      data: {
        isActive: true,
        publishedAt: new Date(),
      },
    });
  }

  async archiveTemplate(tenantId: string, id: string) {
    await this.findTemplateById(tenantId, id);
    return this.prisma.wellnessAssessmentTemplate.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ============================================
  // Assessment Methods
  // ============================================

  async createAssessment(tenantId: string, userId: string, dto: CreateWellnessAssessmentDto) {
    // Verify template exists
    const template = await this.findTemplateById(tenantId, dto.templateId);

    return this.prisma.wellnessAssessment.create({
      data: {
        tenantId,
        facilityId: dto.facilityId,
        patientId: dto.patientId,
        encounterId: dto.encounterId ?? null,
        templateId: dto.templateId,
        templateVersion: dto.templateVersion || template.version,
        responses: dto.responses || {},
        status: 'DRAFT',
        createdBy: userId,
      },
    });
  }

  async findAssessmentById(tenantId: string, id: string) {
    const assessment = await this.prisma.wellnessAssessment.findFirst({
      where: { id, tenantId },
      include: {
        template: true,
      },
    });
    if (!assessment) {
      throw new NotFoundException(`Wellness assessment with ID ${id} not found`);
    }
    return assessment;
  }

  async findAssessmentsByPatient(
    tenantId: string,
    patientId: string,
    options?: { status?: WellnessAssessmentStatus; limit?: number },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.status) where.status = options.status;

    return this.prisma.wellnessAssessment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(options?.limit && { take: options.limit }),
      include: {
        template: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
          },
        },
      },
    });
  }

  async updateAssessment(tenantId: string, id: string, dto: UpdateWellnessAssessmentDto) {
    const assessment = await this.findAssessmentById(tenantId, id);

    if (assessment.status === 'COMPLETED' || assessment.status === 'REVIEWED') {
      throw new BadRequestException('Cannot update a completed or reviewed assessment');
    }

    return this.prisma.wellnessAssessment.update({
      where: { id },
      data: {
        ...dto,
        status: dto.status || 'IN_PROGRESS',
        startedAt: assessment.startedAt || new Date(),
      },
    });
  }

  async completeAssessment(
    tenantId: string,
    id: string,
    userId: string,
    dto: CompleteWellnessAssessmentDto,
  ) {
    const assessment = await this.findAssessmentById(tenantId, id);

    if (assessment.status === 'COMPLETED' || assessment.status === 'REVIEWED') {
      throw new BadRequestException('Assessment is already completed');
    }

    // Calculate scores
    const scores = await this.scoreService.calculateScores(
      assessment.template,
      dto.responses,
    );

    // Update assessment
    const updatedAssessment = await this.prisma.wellnessAssessment.update({
      where: { id },
      data: {
        responses: dto.responses,
        overallScore: scores.overallScore,
        categoryScores: scores.categoryScores,
        ...(scores.biologicalAge !== undefined && { biologicalAge: scores.biologicalAge }),
        ...(scores.chronologicalAge !== undefined && { chronologicalAge: scores.chronologicalAge }),
        ...(dto.recommendations !== undefined && { recommendations: dto.recommendations }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Record score history
    await this.scoreService.recordScoreHistory(
      tenantId,
      assessment.patientId,
      id,
      scores,
    );

    return updatedAssessment;
  }

  async reviewAssessment(tenantId: string, id: string, userId: string, notes?: string) {
    const assessment = await this.findAssessmentById(tenantId, id);

    if (assessment.status !== 'COMPLETED') {
      throw new BadRequestException('Only completed assessments can be reviewed');
    }

    return this.prisma.wellnessAssessment.update({
      where: { id },
      data: {
        status: 'REVIEWED',
        reviewedAt: new Date(),
        reviewedBy: userId,
        notes: notes || assessment.notes,
      },
    });
  }

  async getPatientScoreHistory(
    tenantId: string,
    patientId: string,
    options?: { scoreType?: string; startDate?: Date; endDate?: Date },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.scoreType) where.scoreType = options.scoreType;
    if (options?.startDate || options?.endDate) {
      where.recordedAt = {};
      if (options.startDate) where.recordedAt.gte = options.startDate;
      if (options.endDate) where.recordedAt.lte = options.endDate;
    }

    return this.prisma.wellnessScoreHistory.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
    });
  }
}
