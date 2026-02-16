import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateBiomarkerDefinitionDto,
  UpdateBiomarkerDefinitionDto,
  CreateBiomarkerResultDto,
  BiomarkerAlertStatus,
  BiomarkerAlertSeverity,
} from '../dto/biomarker.dto';

@Injectable()
export class BiomarkerService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Definition Methods
  // ============================================

  async createDefinition(tenantId: string, dto: CreateBiomarkerDefinitionDto) {
    return this.prisma.biomarkerDefinition.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async findDefinitionById(tenantId: string, id: string) {
    const definition = await this.prisma.biomarkerDefinition.findFirst({
      where: {
        id,
        OR: [{ tenantId }, { tenantId: null }], // Include global definitions
      },
    });
    if (!definition) {
      throw new NotFoundException(`Biomarker definition with ID ${id} not found`);
    }
    return definition;
  }

  async findAllDefinitions(tenantId: string, options?: { category?: string; isActive?: boolean }) {
    const where: any = {
      OR: [{ tenantId }, { tenantId: null }], // Include global definitions
    };
    if (options?.category) where.category = options.category;
    if (options?.isActive !== undefined) where.isActive = options.isActive;

    return this.prisma.biomarkerDefinition.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async updateDefinition(tenantId: string, id: string, dto: UpdateBiomarkerDefinitionDto) {
    await this.findDefinitionById(tenantId, id);
    return this.prisma.biomarkerDefinition.update({
      where: { id },
      data: dto,
    });
  }

  // ============================================
  // Result Methods
  // ============================================

  async createResult(tenantId: string, userId: string, dto: CreateBiomarkerResultDto) {
    const definition = await this.findDefinitionById(tenantId, dto.biomarkerId);

    // Get patient info for age/gender-specific ranges
    const patient = await this.prisma.patient.findFirst({
      where: { id: dto.patientId, tenantId },
      select: { dateOfBirth: true, gender: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${dto.patientId} not found`);
    }

    // Calculate age
    const age = this.calculateAge(patient.dateOfBirth);
    const gender = patient.gender;

    // Find appropriate reference range
    const referenceRange = this.findReferenceRange(
      definition.referenceRanges as any[],
      age,
      gender,
    );

    // Get previous result for trend calculation
    const previousResult = await this.prisma.biomarkerResult.findFirst({
      where: { tenantId, patientId: dto.patientId, biomarkerId: dto.biomarkerId },
      orderBy: { collectedAt: 'desc' },
    });

    // Calculate interpretation
    const interpretation = this.interpretValue(dto.value, referenceRange, definition);

    // Calculate trend
    let changePercent: number | null = null;
    let trendDirection: string | null = null;
    if (previousResult) {
      const prevValue = Number(previousResult.value);
      changePercent = ((dto.value - prevValue) / prevValue) * 100;
      trendDirection = this.calculateTrendDirection(dto.value, prevValue, interpretation);
    }

    // Create result
    const result = await this.prisma.biomarkerResult.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        biomarkerId: dto.biomarkerId,
        value: dto.value,
        unit: dto.unit,
        referenceMin: referenceRange?.min ?? null,
        referenceMax: referenceRange?.max ?? null,
        optimalMin: referenceRange?.optimalMin ?? null,
        optimalMax: referenceRange?.optimalMax ?? null,
        interpretation,
        source: dto.source,
        sourceId: dto.sourceId ?? null,
        collectedAt: new Date(dto.collectedAt),
        previousValue: previousResult ? Number(previousResult.value) : null,
        changePercent,
        trendDirection,
        notes: dto.notes ?? null,
        createdBy: userId,
      },
    });

    // Create alert if value is out of range
    if (interpretation === 'critical_low' || interpretation === 'critical_high') {
      await this.createAlert(tenantId, result, definition, 'CRITICAL');
    } else if (interpretation === 'low' || interpretation === 'high') {
      await this.createAlert(tenantId, result, definition, 'MEDIUM');
    }

    return result;
  }

  async findResultById(tenantId: string, id: string) {
    const result = await this.prisma.biomarkerResult.findFirst({
      where: { id, tenantId },
      include: {
        biomarker: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`Biomarker result with ID ${id} not found`);
    }
    return result;
  }

  async findResultsByPatient(
    tenantId: string,
    patientId: string,
    options?: { biomarkerId?: string; startDate?: Date; endDate?: Date; limit?: number },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.biomarkerId) where.biomarkerId = options.biomarkerId;
    if (options?.startDate || options?.endDate) {
      where.collectedAt = {};
      if (options.startDate) where.collectedAt.gte = options.startDate;
      if (options.endDate) where.collectedAt.lte = options.endDate;
    }

    return this.prisma.biomarkerResult.findMany({
      where,
      orderBy: { collectedAt: 'desc' },
      ...(options?.limit && { take: options.limit }),
      include: {
        biomarker: {
          select: {
            id: true,
            code: true,
            name: true,
            category: true,
            unit: true,
          },
        },
      },
    });
  }

  async getBiomarkerTrend(
    tenantId: string,
    patientId: string,
    biomarkerId: string,
    options?: { startDate?: Date; endDate?: Date; limit?: number },
  ) {
    const where: any = { tenantId, patientId, biomarkerId };
    if (options?.startDate || options?.endDate) {
      where.collectedAt = {};
      if (options.startDate) where.collectedAt.gte = options.startDate;
      if (options.endDate) where.collectedAt.lte = options.endDate;
    }

    const results = await this.prisma.biomarkerResult.findMany({
      where,
      orderBy: { collectedAt: 'asc' },
      ...(options?.limit && { take: options.limit }),
    });

    if (results.length < 2) {
      return {
        data: results,
        trend: 'insufficient_data',
        averageChangePercent: null,
      };
    }

    // Calculate trend analysis
    const changes: number[] = [];
    for (let i = 1; i < results.length; i++) {
      const prev = Number(results[i - 1]!.value);
      const curr = Number(results[i]!.value);
      changes.push(((curr - prev) / prev) * 100);
    }

    const averageChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    let trend: string;
    if (averageChange > 5) {
      trend = 'increasing';
    } else if (averageChange < -5) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    return {
      data: results,
      trend,
      averageChangePercent: Math.round(averageChange * 100) / 100,
    };
  }

  // ============================================
  // Alert Methods
  // ============================================

  private async createAlert(
    tenantId: string,
    result: any,
    definition: any,
    severity: string,
  ) {
    const alertType = result.interpretation?.includes('critical') ? 'critical' : 'out_of_range';
    const message = this.generateAlertMessage(result, definition);

    return this.prisma.biomarkerAlert.create({
      data: {
        tenantId,
        patientId: result.patientId,
        biomarkerId: result.biomarkerId,
        resultId: result.id,
        severity: severity as any,
        alertType,
        message,
        triggeredValue: result.value,
        thresholdValue: result.interpretation?.includes('low')
          ? (result.referenceMin || definition.criticalLow)
          : (result.referenceMax || definition.criticalHigh),
        status: 'ACTIVE',
      },
    });
  }

  async findAlertsByPatient(
    tenantId: string,
    patientId: string,
    options?: { status?: BiomarkerAlertStatus; severity?: BiomarkerAlertSeverity },
  ) {
    const where: any = { tenantId, patientId };
    if (options?.status) where.status = options.status;
    if (options?.severity) where.severity = options.severity;

    return this.prisma.biomarkerAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        biomarker: {
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

  async acknowledgeAlert(tenantId: string, alertId: string, userId: string, notes?: string) {
    const alert = await this.prisma.biomarkerAlert.findFirst({
      where: { id: alertId, tenantId },
    });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    return this.prisma.biomarkerAlert.update({
      where: { id: alertId },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date(),
        acknowledgedBy: userId,
      },
    });
  }

  async resolveAlert(tenantId: string, alertId: string, userId: string, resolutionNotes: string) {
    const alert = await this.prisma.biomarkerAlert.findFirst({
      where: { id: alertId, tenantId },
    });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    return this.prisma.biomarkerAlert.update({
      where: { id: alertId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedBy: userId,
        resolutionNotes,
      },
    });
  }

  async dismissAlert(tenantId: string, alertId: string, userId: string) {
    const alert = await this.prisma.biomarkerAlert.findFirst({
      where: { id: alertId, tenantId },
    });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    return this.prisma.biomarkerAlert.update({
      where: { id: alertId },
      data: {
        status: 'DISMISSED',
        resolvedAt: new Date(),
        resolvedBy: userId,
      },
    });
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

  private findReferenceRange(
    ranges: any[],
    age: number,
    gender: string,
  ): { min?: number; max?: number; optimalMin?: number; optimalMax?: number } | null {
    if (!ranges || ranges.length === 0) return null;

    // Find the best matching range
    const matchingRanges = ranges.filter((range) => {
      const ageMatch =
        (range.ageMin === undefined || age >= range.ageMin) &&
        (range.ageMax === undefined || age <= range.ageMax);
      const genderMatch =
        range.gender === undefined || range.gender === 'all' || range.gender === gender;
      return ageMatch && genderMatch;
    });

    if (matchingRanges.length === 0) {
      // Return first range as fallback
      return ranges[0];
    }

    // Return the most specific match
    return matchingRanges.sort((a, b) => {
      // Prefer ranges with gender specified
      const aScore = (a.gender ? 1 : 0) + (a.ageMin !== undefined ? 1 : 0) + (a.ageMax !== undefined ? 1 : 0);
      const bScore = (b.gender ? 1 : 0) + (b.ageMin !== undefined ? 1 : 0) + (b.ageMax !== undefined ? 1 : 0);
      return bScore - aScore;
    })[0];
  }

  private interpretValue(
    value: number,
    range: { min?: number; max?: number; optimalMin?: number; optimalMax?: number } | null,
    definition: any,
  ): string {
    const criticalLow = definition.criticalLow ? Number(definition.criticalLow) : null;
    const criticalHigh = definition.criticalHigh ? Number(definition.criticalHigh) : null;

    if (criticalLow !== null && value < criticalLow) {
      return 'critical_low';
    }
    if (criticalHigh !== null && value > criticalHigh) {
      return 'critical_high';
    }

    if (range) {
      if (range.optimalMin !== undefined && range.optimalMax !== undefined) {
        if (value >= range.optimalMin && value <= range.optimalMax) {
          return 'optimal';
        }
      }

      if (range.min !== undefined && value < range.min) {
        return 'low';
      }
      if (range.max !== undefined && value > range.max) {
        return 'high';
      }

      return 'normal';
    }

    return 'normal';
  }

  private calculateTrendDirection(
    currentValue: number,
    previousValue: number,
    interpretation: string,
  ): string {
    const change = currentValue - previousValue;
    const threshold = Math.abs(previousValue * 0.05); // 5% threshold

    // For optimal biomarkers, staying in range is good
    if (interpretation === 'optimal' || interpretation === 'normal') {
      if (Math.abs(change) < threshold) {
        return 'stable';
      }
      return 'stable'; // Even with change, being in optimal range is good
    }

    // For out-of-range values, moving toward normal is improving
    if (interpretation === 'low' || interpretation === 'critical_low') {
      return change > threshold ? 'improving' : change < -threshold ? 'worsening' : 'stable';
    }

    if (interpretation === 'high' || interpretation === 'critical_high') {
      return change < -threshold ? 'improving' : change > threshold ? 'worsening' : 'stable';
    }

    return 'stable';
  }

  private generateAlertMessage(result: any, definition: any): string {
    const biomarkerName = definition.name;
    const value = result.value;
    const unit = result.unit;
    const interpretation = result.interpretation;

    switch (interpretation) {
      case 'critical_low':
        return `${biomarkerName} is critically low at ${value} ${unit}. Immediate attention required.`;
      case 'critical_high':
        return `${biomarkerName} is critically high at ${value} ${unit}. Immediate attention required.`;
      case 'low':
        return `${biomarkerName} is below normal range at ${value} ${unit}.`;
      case 'high':
        return `${biomarkerName} is above normal range at ${value} ${unit}.`;
      default:
        return `${biomarkerName} result: ${value} ${unit}.`;
    }
  }
}
