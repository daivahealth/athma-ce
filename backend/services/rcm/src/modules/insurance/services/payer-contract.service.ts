import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
  CreatePayerContractDto,
  UpdatePayerContractDto,
  ContractStatus,
  CreatePayerContractAdjustmentDto,
  UpdatePayerContractAdjustmentDto,
  PayerContractQueryDto,
  PayerContractAdjustmentQueryDto,
  BulkCreatePayerContractAdjustmentsDto,
  CalculateContractPriceDto,
  ContractPriceCalculationResponseDto,
} from '../dto/payer-contract.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PayerContractService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== PAYER CONTRACT METHODS ====================

  async createContract(tenantId: string, dto: CreatePayerContractDto, createdBy?: string) {
    // Verify payer exists
    const payer = await this.prisma.payer.findFirst({
      where: { id: dto.payerId, tenantId },
    });

    if (!payer) {
      throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
    }

    // Verify fee schedule exists if provided
    if (dto.baseFeeScheduleId) {
      const feeSchedule = await this.prisma.feeSchedule.findFirst({
        where: { id: dto.baseFeeScheduleId, tenantId },
      });

      if (!feeSchedule) {
        throw new NotFoundException(`Fee schedule with ID ${dto.baseFeeScheduleId} not found`);
      }
    }

    return this.prisma.payerContract.create({
      data: {
        tenantId,
        payerId: dto.payerId,
        contractName: dto.contractName,
        contractNumber: dto.contractNumber ?? null,
        authorityCode: dto.authorityCode ?? null,
        baseFeeScheduleId: dto.baseFeeScheduleId ?? null,
        planCode: dto.planCode ?? null,
        networkType: dto.networkType ?? null,
        lineOfBusiness: dto.lineOfBusiness ?? null,
        contractType: dto.contractType ?? 'fee_for_service',
        reimbursementMethod: dto.reimbursementMethod ?? 'percentage_of_tariff',
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
        status: dto.status ?? ContractStatus.ACTIVE,
        defaultMultiplier: dto.defaultMultiplier ?? null,
        defaultDiscountPct: dto.defaultDiscountPct ?? null,
        defaultMaxAllowedAmount: dto.defaultMaxAllowedAmount ?? null,
        terms: dto.terms || {},
        metadata: dto.metadata || {},
        createdBy: createdBy ?? null,
      },
      include: {
        payer: true,
        baseFeeSchedule: true,
      },
    });
  }

  async findAllContracts(tenantId: string, filters?: PayerContractQueryDto) {
    const where: any = { tenantId };

    if (filters?.payerId) {
      where.payerId = filters.payerId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.contractType) {
      where.contractType = filters.contractType;
    }

    if (filters?.authorityCode) {
      where.authorityCode = filters.authorityCode;
    }

    if (filters?.planCode) {
      where.planCode = filters.planCode;
    }

    if (filters?.networkType) {
      where.networkType = filters.networkType;
    }

    if (filters?.effectiveDate) {
      const effectiveDate = new Date(filters.effectiveDate);
      where.effectiveFrom = { lte: effectiveDate };
      where.OR = [{ effectiveTo: null }, { effectiveTo: { gte: effectiveDate } }];
    }

    return this.prisma.payerContract.findMany({
      where,
      include: {
        payer: true,
        baseFeeSchedule: {
          select: {
            id: true,
            scheduleName: true,
            authorityCode: true,
          },
        },
        _count: {
          select: {
            adjustments: true,
          },
        },
      },
      orderBy: [{ effectiveFrom: 'desc' }, { contractName: 'asc' }],
    });
  }

  async findContractById(tenantId: string, id: string) {
    const contract = await this.prisma.payerContract.findFirst({
      where: { id, tenantId },
      include: {
        payer: true,
        baseFeeSchedule: true,
        adjustments: {
          orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
          take: 50,
        },
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async updateContract(
    tenantId: string,
    id: string,
    dto: UpdatePayerContractDto,
    updatedBy?: string,
  ) {
    // Verify contract exists and belongs to tenant
    await this.findContractById(tenantId, id);

    // Verify payer exists if being updated
    if (dto.payerId) {
      const payer = await this.prisma.payer.findFirst({
        where: { id: dto.payerId, tenantId },
      });

      if (!payer) {
        throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
      }
    }

    // Verify fee schedule exists if being updated
    if (dto.baseFeeScheduleId) {
      const feeSchedule = await this.prisma.feeSchedule.findFirst({
        where: { id: dto.baseFeeScheduleId, tenantId },
      });

      if (!feeSchedule) {
        throw new NotFoundException(`Fee schedule with ID ${dto.baseFeeScheduleId} not found`);
      }
    }

    const data: any = { updatedBy };

    if (dto.payerId !== undefined) data.payerId = dto.payerId;
    if (dto.contractName !== undefined) data.contractName = dto.contractName;
    if (dto.contractNumber !== undefined) data.contractNumber = dto.contractNumber ?? null;
    if (dto.authorityCode !== undefined) data.authorityCode = dto.authorityCode ?? null;
    if (dto.baseFeeScheduleId !== undefined)
      data.baseFeeScheduleId = dto.baseFeeScheduleId ?? null;
    if (dto.planCode !== undefined) data.planCode = dto.planCode ?? null;
    if (dto.networkType !== undefined) data.networkType = dto.networkType ?? null;
    if (dto.lineOfBusiness !== undefined) data.lineOfBusiness = dto.lineOfBusiness ?? null;
    if (dto.contractType !== undefined) data.contractType = dto.contractType;
    if (dto.reimbursementMethod !== undefined) data.reimbursementMethod = dto.reimbursementMethod;
    if (dto.effectiveFrom !== undefined) data.effectiveFrom = new Date(dto.effectiveFrom);
    if (dto.effectiveTo !== undefined) data.effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : null;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.defaultMultiplier !== undefined) data.defaultMultiplier = dto.defaultMultiplier ?? null;
    if (dto.defaultDiscountPct !== undefined) data.defaultDiscountPct = dto.defaultDiscountPct ?? null;
    if (dto.defaultMaxAllowedAmount !== undefined)
      data.defaultMaxAllowedAmount = dto.defaultMaxAllowedAmount ?? null;
    if (dto.terms !== undefined) data.terms = dto.terms;
    if (dto.metadata !== undefined) data.metadata = dto.metadata;

    return this.prisma.payerContract.update({
      where: { id },
      data,
      include: {
        payer: true,
        baseFeeSchedule: true,
      },
    });
  }

  async deleteContract(tenantId: string, id: string) {
    // Verify contract exists and belongs to tenant
    await this.findContractById(tenantId, id);

    // Soft delete by updating status to expired
    await this.prisma.payerContract.update({
      where: { id },
      data: { status: ContractStatus.EXPIRED },
    });

    return { message: 'Contract deactivated successfully' };
  }

  // ==================== PAYER CONTRACT ADJUSTMENT METHODS ====================

  async createAdjustment(tenantId: string, dto: CreatePayerContractAdjustmentDto, createdBy?: string) {
    // Verify contract exists and belongs to tenant
    await this.findContractById(tenantId, dto.contractId);

    // Verify billing item exists if provided
    if (dto.billingItemId) {
      const billingItem = await this.prisma.billingItem.findFirst({
        where: { id: dto.billingItemId, tenantId },
      });

      if (!billingItem) {
        throw new NotFoundException(`Billing item with ID ${dto.billingItemId} not found`);
      }
    }

    // Verify fee schedule item exists if provided
    if (dto.feeScheduleItemId) {
      const feeScheduleItem = await this.prisma.feeScheduleItem.findUnique({
        where: { id: dto.feeScheduleItemId },
      });

      if (!feeScheduleItem) {
        throw new NotFoundException(`Fee schedule item with ID ${dto.feeScheduleItemId} not found`);
      }
    }

    return this.prisma.payerContractAdjustment.create({
      data: {
        contractId: dto.contractId,
        serviceGroup: dto.serviceGroup ?? null,
        billingItemId: dto.billingItemId ?? null,
        feeScheduleItemId: dto.feeScheduleItemId ?? null,
        multiplier: dto.multiplier ?? null,
        discountPct: dto.discountPct ?? null,
        maxAllowedAmount: dto.maxAllowedAmount ?? null,
        minAllowedAmount: dto.minAllowedAmount ?? null,
        priority: dto.priority ?? 100,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : null,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
        isExclusion: dto.isExclusion ?? false,
        notes: dto.notes ?? null,
        createdBy: createdBy ?? null,
      },
      include: {
        contract: true,
        billingItem: true,
        feeScheduleItem: true,
      },
    });
  }

  async bulkCreateAdjustments(
    tenantId: string,
    dto: BulkCreatePayerContractAdjustmentsDto,
    createdBy?: string,
  ) {
    // Verify contract exists
    await this.findContractById(tenantId, dto.contractId);

    const adjustments = await Promise.all(
      dto.adjustments.map((adj) =>
        this.createAdjustment(
          tenantId,
          {
            ...adj,
            contractId: dto.contractId,
          },
          createdBy,
        ),
      ),
    );

    return {
      message: `${adjustments.length} adjustments created successfully`,
      adjustments,
    };
  }

  async findAdjustments(contractId: string, filters?: PayerContractAdjustmentQueryDto) {
    const where: any = { contractId };

    if (filters?.serviceGroup) {
      where.serviceGroup = filters.serviceGroup;
    }

    if (filters?.billingItemId) {
      where.billingItemId = filters.billingItemId;
    }

    if (filters?.feeScheduleItemId) {
      where.feeScheduleItemId = filters.feeScheduleItemId;
    }

    if (filters?.effectiveDate) {
      const effectiveDate = new Date(filters.effectiveDate);
      where.OR = [
        { effectiveFrom: null },
        {
          effectiveFrom: { lte: effectiveDate },
          OR: [{ effectiveTo: null }, { effectiveTo: { gte: effectiveDate } }],
        },
      ];
    }

    if (filters?.includeExclusions === false) {
      where.isExclusion = false;
    }

    return this.prisma.payerContractAdjustment.findMany({
      where,
      include: {
        contract: {
          select: {
            id: true,
            contractName: true,
            contractNumber: true,
          },
        },
        billingItem: {
          select: {
            id: true,
            billingCode: true,
          },
        },
        feeScheduleItem: {
          select: {
            id: true,
            code: true,
            codeType: true,
          },
        },
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findAdjustmentById(id: string) {
    const adjustment = await this.prisma.payerContractAdjustment.findUnique({
      where: { id },
      include: {
        contract: true,
        billingItem: true,
        feeScheduleItem: true,
      },
    });

    if (!adjustment) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }

    return adjustment;
  }

  async updateAdjustment(id: string, dto: UpdatePayerContractAdjustmentDto, updatedBy?: string) {
    // Verify adjustment exists
    await this.findAdjustmentById(id);

    const data: any = { updatedBy };

    if (dto.serviceGroup !== undefined) data.serviceGroup = dto.serviceGroup ?? null;
    if (dto.billingItemId !== undefined) data.billingItemId = dto.billingItemId ?? null;
    if (dto.feeScheduleItemId !== undefined) data.feeScheduleItemId = dto.feeScheduleItemId ?? null;
    if (dto.multiplier !== undefined) data.multiplier = dto.multiplier ?? null;
    if (dto.discountPct !== undefined) data.discountPct = dto.discountPct ?? null;
    if (dto.maxAllowedAmount !== undefined) data.maxAllowedAmount = dto.maxAllowedAmount ?? null;
    if (dto.minAllowedAmount !== undefined) data.minAllowedAmount = dto.minAllowedAmount ?? null;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.effectiveFrom !== undefined) data.effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : null;
    if (dto.effectiveTo !== undefined) data.effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : null;
    if (dto.isExclusion !== undefined) data.isExclusion = dto.isExclusion;
    if (dto.notes !== undefined) data.notes = dto.notes ?? null;

    return this.prisma.payerContractAdjustment.update({
      where: { id },
      data,
      include: {
        contract: true,
        billingItem: true,
        feeScheduleItem: true,
      },
    });
  }

  async deleteAdjustment(id: string) {
    // Verify adjustment exists
    await this.findAdjustmentById(id);

    await this.prisma.payerContractAdjustment.delete({
      where: { id },
    });

    return { message: 'Adjustment deleted successfully' };
  }

  // ==================== PRICE CALCULATION METHODS ====================

  async calculateContractPrice(
    tenantId: string,
    dto: CalculateContractPriceDto,
  ): Promise<ContractPriceCalculationResponseDto> {
    // Get the contract
    const contract = await this.findContractById(tenantId, dto.contractId);

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestException(`Contract ${contract.contractName} is not active`);
    }

    const effectiveDate = dto.effectiveDate ? new Date(dto.effectiveDate) : new Date();

    // Check if contract is valid for the effective date
    if (effectiveDate < contract.effectiveFrom) {
      throw new BadRequestException('Contract is not yet effective for the specified date');
    }

    if (contract.effectiveTo && effectiveDate > contract.effectiveTo) {
      throw new BadRequestException('Contract has expired for the specified date');
    }

    // Get base price from fee schedule if available
    let basePrice: number | null = null;

    if (contract.baseFeeScheduleId) {
      const feeScheduleItem = await this.prisma.feeScheduleItem.findFirst({
        where: {
          feeScheduleId: contract.baseFeeScheduleId,
          code: dto.code,
          codeType: dto.codeType,
        },
      });

      if (feeScheduleItem && feeScheduleItem.baseAmount) {
        basePrice = Number(feeScheduleItem.baseAmount);
      }
    }

    // Get applicable adjustments (ordered by priority)
    const adjustments = await this.prisma.payerContractAdjustment.findMany({
      where: {
        contractId: dto.contractId,
        AND: [
          {
            OR: [
              ...(dto.serviceGroup ? [{ serviceGroup: dto.serviceGroup }] : []),
              {
                feeScheduleItem: {
                  code: dto.code,
                  codeType: dto.codeType,
                },
              },
            ],
          },
          {
            OR: [
              { effectiveFrom: null },
              {
                effectiveFrom: { lte: effectiveDate },
                OR: [{ effectiveTo: null }, { effectiveTo: { gte: effectiveDate } }],
              },
            ],
          },
        ],
      },
      include: {
        feeScheduleItem: true,
      },
      orderBy: { priority: 'asc' },
    });

    // Apply adjustments in priority order
    let adjustedPrice = basePrice ?? 0;
    const appliedAdjustments: ContractPriceCalculationResponseDto['appliedAdjustments'] = [];

    // Apply default contract-level adjustments first
    if (contract.defaultMultiplier) {
      const multiplier = Number(contract.defaultMultiplier);
      adjustedPrice *= multiplier;
      appliedAdjustments.push({
        adjustmentId: contract.id,
        type: 'multiplier',
        value: multiplier,
        description: `Contract default multiplier: ${multiplier}`,
      });
    }

    if (contract.defaultDiscountPct) {
      const discountPct = Number(contract.defaultDiscountPct);
      adjustedPrice *= 1 - discountPct / 100;
      appliedAdjustments.push({
        adjustmentId: contract.id,
        type: 'discount',
        value: discountPct,
        description: `Contract default discount: ${discountPct}%`,
      });
    }

    // Apply specific adjustments
    for (const adjustment of adjustments) {
      if (adjustment.isExclusion) {
        appliedAdjustments.push({
          adjustmentId: adjustment.id,
          type: 'exclusion',
          value: 0,
          description: adjustment.notes ?? 'Service excluded from coverage',
        });
        return {
          contractId: dto.contractId,
          code: dto.code,
          codeType: dto.codeType,
          basePrice,
          adjustedPrice: 0,
          appliedAdjustments,
          effectiveDate,
          currency: 'AED',
        };
      }

      if (adjustment.multiplier) {
        const multiplier = Number(adjustment.multiplier);
        adjustedPrice *= multiplier;
        appliedAdjustments.push({
          adjustmentId: adjustment.id,
          type: 'multiplier',
          value: multiplier,
          description: `Adjustment multiplier: ${multiplier}`,
        });
      }

      if (adjustment.discountPct) {
        const discountPct = Number(adjustment.discountPct);
        adjustedPrice *= 1 - discountPct / 100;
        appliedAdjustments.push({
          adjustmentId: adjustment.id,
          type: 'discount',
          value: discountPct,
          description: `Adjustment discount: ${discountPct}%`,
        });
      }

      if (adjustment.maxAllowedAmount) {
        const maxAmount = Number(adjustment.maxAllowedAmount);
        if (adjustedPrice > maxAmount) {
          adjustedPrice = maxAmount;
          appliedAdjustments.push({
            adjustmentId: adjustment.id,
            type: 'cap',
            value: maxAmount,
            description: `Maximum allowed: ${maxAmount}`,
          });
        }
      }

      if (adjustment.minAllowedAmount) {
        const minAmount = Number(adjustment.minAllowedAmount);
        if (adjustedPrice < minAmount) {
          adjustedPrice = minAmount;
          appliedAdjustments.push({
            adjustmentId: adjustment.id,
            type: 'floor',
            value: minAmount,
            description: `Minimum allowed: ${minAmount}`,
          });
        }
      }
    }

    // Apply contract-level max cap last
    if (contract.defaultMaxAllowedAmount) {
      const maxAmount = Number(contract.defaultMaxAllowedAmount);
      if (adjustedPrice > maxAmount) {
        adjustedPrice = maxAmount;
        appliedAdjustments.push({
          adjustmentId: contract.id,
          type: 'cap',
          value: maxAmount,
          description: `Contract maximum: ${maxAmount}`,
        });
      }
    }

    return {
      contractId: dto.contractId,
      code: dto.code,
      codeType: dto.codeType,
      basePrice,
      adjustedPrice: Math.round(adjustedPrice * 100) / 100, // Round to 2 decimal places
      appliedAdjustments,
      effectiveDate,
      currency: 'AED',
    };
  }

  // ==================== UTILITY METHODS ====================

  async getContractStatistics(tenantId: string, payerId?: string) {
    const where: any = { tenantId };
    if (payerId) {
      where.payerId = payerId;
    }

    const contracts = await this.prisma.payerContract.findMany({
      where,
      include: {
        _count: {
          select: {
            adjustments: true,
          },
        },
      },
    });

    return {
      total: contracts.length,
      byStatus: contracts.reduce((acc: Record<string, number>, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1;
        return acc;
      }, {}),
      byContractType: contracts.reduce((acc: Record<string, number>, contract) => {
        acc[contract.contractType] = (acc[contract.contractType] || 0) + 1;
        return acc;
      }, {}),
      totalAdjustments: contracts.reduce((sum, contract) => sum + contract._count.adjustments, 0),
    };
  }
}
