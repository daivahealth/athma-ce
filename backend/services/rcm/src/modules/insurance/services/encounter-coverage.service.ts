import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
  CreateEncounterCoverageDto,
  UpdateEncounterCoverageDto,
  FinancialClass,
  CoverageLevel,
} from '../dto/encounter-coverage.dto';

@Injectable()
export class EncounterCoverageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateEncounterCoverageDto) {
    // Verify policy exists if provided
    if (dto.policyId) {
      const policy = await this.prisma.policy.findFirst({
        where: { id: dto.policyId, tenantId },
      });

      if (!policy) {
        throw new NotFoundException(`Policy with ID ${dto.policyId} not found`);
      }
    }

    // Verify payer exists if provided
    if (dto.payerId) {
      const payer = await this.prisma.payer.findFirst({
        where: { id: dto.payerId, tenantId },
      });

      if (!payer) {
        throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
      }
    }

    const data: any = {
      tenantId,
      encounterId: dto.encounterId,
      patientId: dto.patientId,
      policyId: dto.policyId ?? null,
      payerId: dto.payerId ?? null,
      financialClass: dto.financialClass,
      coverageLevel: dto.coverageLevel || CoverageLevel.PRIMARY,
      planName: dto.planName ?? null,
      memberId: dto.memberId ?? null,
      memberName: dto.memberName ?? null,
      networkName: dto.networkName ?? null,
      copayAmount: dto.copayAmount ?? null,
      coinsurancePct: dto.coinsurancePct ?? null,
      eligibilityRequestId: dto.eligibilityRequestId ?? null,
      preauthRequestId: dto.preauthRequestId ?? null,
      costEstimateId: dto.costEstimateId ?? null,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    };

    // Only add JSON fields if they have a value
    if (dto.deductibleSnapshot) {
      data.deductibleSnapshot = dto.deductibleSnapshot;
    }
    if (dto.benefitsSnapshot) {
      data.benefitsSnapshot = dto.benefitsSnapshot;
    }

    return this.prisma.encounterCoverage.create({
      data,
      include: {
        policy: true,
        payer: true,
      },
    });
  }

  async findAll(
    tenantId: string,
    filters?: {
      encounterId?: string;
      patientId?: string;
      policyId?: string;
      payerId?: string;
      financialClass?: FinancialClass;
      coverageLevel?: CoverageLevel;
      isActive?: boolean;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.encounterId) {
      where.encounterId = filters.encounterId;
    }
    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.policyId) {
      where.policyId = filters.policyId;
    }
    if (filters?.payerId) {
      where.payerId = filters.payerId;
    }
    if (filters?.financialClass) {
      where.financialClass = filters.financialClass;
    }
    if (filters?.coverageLevel) {
      where.coverageLevel = filters.coverageLevel;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.encounterCoverage.findMany({
      where,
      include: {
        policy: true,
        payer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const coverage = await this.prisma.encounterCoverage.findFirst({
      where: { id, tenantId },
      include: {
        policy: true,
        payer: true,
      },
    });

    if (!coverage) {
      throw new NotFoundException(`Encounter coverage with ID ${id} not found`);
    }

    return coverage;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.encounterCoverage.findMany({
      where: {
        tenantId,
        encounterId,
      },
      include: {
        policy: true,
        payer: true,
      },
      orderBy: [
        { coverageLevel: 'asc' }, // primary first, then secondary, etc.
        { createdAt: 'desc' },
      ],
    });
  }

  async findByPatient(tenantId: string, patientId: string, isActive?: boolean) {
    const where: any = {
      tenantId,
      patientId,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.encounterCoverage.findMany({
      where,
      include: {
        policy: true,
        payer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateEncounterCoverageDto) {
    await this.findById(tenantId, id);

    // Verify policy exists if provided
    if (dto.policyId) {
      const policy = await this.prisma.policy.findFirst({
        where: { id: dto.policyId, tenantId },
      });

      if (!policy) {
        throw new NotFoundException(`Policy with ID ${dto.policyId} not found`);
      }
    }

    // Verify payer exists if provided
    if (dto.payerId) {
      const payer = await this.prisma.payer.findFirst({
        where: { id: dto.payerId, tenantId },
      });

      if (!payer) {
        throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
      }
    }

    const data: any = {};
    if (dto.encounterId !== undefined) data.encounterId = dto.encounterId;
    if (dto.patientId !== undefined) data.patientId = dto.patientId;
    if (dto.policyId !== undefined) data.policyId = dto.policyId ?? null;
    if (dto.payerId !== undefined) data.payerId = dto.payerId ?? null;
    if (dto.financialClass !== undefined) data.financialClass = dto.financialClass;
    if (dto.coverageLevel !== undefined) data.coverageLevel = dto.coverageLevel;
    if (dto.planName !== undefined) data.planName = dto.planName ?? null;
    if (dto.memberId !== undefined) data.memberId = dto.memberId ?? null;
    if (dto.memberName !== undefined) data.memberName = dto.memberName ?? null;
    if (dto.networkName !== undefined) data.networkName = dto.networkName ?? null;
    if (dto.copayAmount !== undefined) data.copayAmount = dto.copayAmount ?? null;
    if (dto.coinsurancePct !== undefined) data.coinsurancePct = dto.coinsurancePct ?? null;
    if (dto.deductibleSnapshot !== undefined) data.deductibleSnapshot = dto.deductibleSnapshot;
    if (dto.benefitsSnapshot !== undefined) data.benefitsSnapshot = dto.benefitsSnapshot;
    if (dto.eligibilityRequestId !== undefined) data.eligibilityRequestId = dto.eligibilityRequestId ?? null;
    if (dto.preauthRequestId !== undefined) data.preauthRequestId = dto.preauthRequestId ?? null;
    if (dto.costEstimateId !== undefined) data.costEstimateId = dto.costEstimateId ?? null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.encounterCoverage.update({
      where: { id },
      data,
      include: {
        policy: true,
        payer: true,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findById(tenantId, id);

    // Soft delete by setting isActive to false
    return this.prisma.encounterCoverage.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCoverageStatistics(tenantId: string, filters?: { patientId?: string; encounterId?: string }) {
    const where: any = { tenantId };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.encounterId) {
      where.encounterId = filters.encounterId;
    }

    const [total, byFinancialClass, byCoverageLevel, active, inactive] = await Promise.all([
      this.prisma.encounterCoverage.count({ where }),
      this.prisma.encounterCoverage.groupBy({
        by: ['financialClass'],
        where,
        _count: true,
      }),
      this.prisma.encounterCoverage.groupBy({
        by: ['coverageLevel'],
        where,
        _count: true,
      }),
      this.prisma.encounterCoverage.count({ where: { ...where, isActive: true } }),
      this.prisma.encounterCoverage.count({ where: { ...where, isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
      byFinancialClass: byFinancialClass.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.financialClass] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byCoverageLevel: byCoverageLevel.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.coverageLevel] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
