import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { CreatePolicyDto, UpdatePolicyDto, PolicyStatus } from '../dto/policy.dto';

@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePolicyDto) {
    // Verify payer exists
    const payer = await this.prisma.payer.findFirst({
      where: { id: dto.payerId, tenantId },
    });

    if (!payer) {
      throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
    }

    // If this is marked as primary, unset other primary policies for this patient
    if (dto.isPrimary) {
      await this.prisma.policy.updateMany({
        where: {
          tenantId,
          patientId: dto.patientId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    return this.prisma.policy.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        policyNumber: dto.policyNumber,
        groupNumber: dto.groupNumber ?? null,
        payerName: dto.payerName,
        payerId: dto.payerId,
        relationship: dto.relationship ?? null,
        effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : null,
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
        benefits: dto.benefits || {},
        isPrimary: dto.isPrimary || false,
        status: dto.status || PolicyStatus.ACTIVE,
      },
      include: {
        payer: true,
      },
    });
  }

  async findAll(tenantId: string, patientId?: string, status?: PolicyStatus) {
    const where: any = { tenantId };

    if (patientId) {
      where.patientId = patientId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.policy.findMany({
      where,
      include: {
        payer: true,
      },
      orderBy: [
        { isPrimary: 'desc' }, // Primary policies first
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(tenantId: string, id: string) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, tenantId },
      include: {
        payer: true,
      },
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return policy;
  }

  async findByPatient(tenantId: string, patientId: string) {
    return this.prisma.policy.findMany({
      where: {
        tenantId,
        patientId,
        status: PolicyStatus.ACTIVE,
      },
      include: {
        payer: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findPrimaryPolicy(tenantId: string, patientId: string) {
    const policy = await this.prisma.policy.findFirst({
      where: {
        tenantId,
        patientId,
        isPrimary: true,
        status: PolicyStatus.ACTIVE,
      },
      include: {
        payer: true,
      },
    });

    if (!policy) {
      throw new NotFoundException(`No primary policy found for patient ${patientId}`);
    }

    return policy;
  }

  async update(tenantId: string, id: string, dto: UpdatePolicyDto) {
    // Verify policy exists and belongs to tenant
    const existingPolicy = await this.findById(tenantId, id);

    // If updating payer, verify it exists
    if (dto.payerId && dto.payerId !== existingPolicy.payerId) {
      const payer = await this.prisma.payer.findFirst({
        where: { id: dto.payerId, tenantId },
      });

      if (!payer) {
        throw new NotFoundException(`Payer with ID ${dto.payerId} not found`);
      }
    }

    // If setting as primary, unset other primary policies for this patient
    if (dto.isPrimary && !existingPolicy.isPrimary) {
      await this.prisma.policy.updateMany({
        where: {
          tenantId,
          patientId: existingPolicy.patientId,
          isPrimary: true,
          id: { not: id },
        },
        data: { isPrimary: false },
      });
    }

    const data: any = {};
    if (dto.policyNumber !== undefined) data.policyNumber = dto.policyNumber;
    if (dto.groupNumber !== undefined) data.groupNumber = dto.groupNumber ?? null;
    if (dto.payerName !== undefined) data.payerName = dto.payerName;
    if (dto.payerId !== undefined) data.payerId = dto.payerId;
    if (dto.relationship !== undefined) data.relationship = dto.relationship ?? null;
    if (dto.effectiveDate !== undefined) data.effectiveDate = dto.effectiveDate ? new Date(dto.effectiveDate) : null;
    if (dto.expirationDate !== undefined) data.expirationDate = dto.expirationDate ? new Date(dto.expirationDate) : null;
    if (dto.benefits !== undefined) data.benefits = dto.benefits;
    if (dto.isPrimary !== undefined) data.isPrimary = dto.isPrimary;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.policy.update({
      where: { id },
      data,
      include: {
        payer: true,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    // Verify policy exists and belongs to tenant
    await this.findById(tenantId, id);

    // Soft delete by updating status
    await this.prisma.policy.update({
      where: { id },
      data: { status: PolicyStatus.CANCELLED },
    });

    return { message: 'Policy cancelled successfully' };
  }

  async checkExpiredPolicies(tenantId: string) {
    const now = new Date();

    const expiredPolicies = await this.prisma.policy.findMany({
      where: {
        tenantId,
        status: PolicyStatus.ACTIVE,
        expirationDate: {
          lt: now,
        },
      },
    });

    // Update expired policies
    if (expiredPolicies.length > 0) {
      await this.prisma.policy.updateMany({
        where: {
          id: { in: expiredPolicies.map((p) => p.id) },
        },
        data: { status: PolicyStatus.EXPIRED },
      });
    }

    return {
      expiredCount: expiredPolicies.length,
      expiredPolicies,
    };
  }

  async getPolicyStatistics(tenantId: string, patientId?: string) {
    const where: any = { tenantId };

    if (patientId) {
      where.patientId = patientId;
    }

    const policies = await this.prisma.policy.findMany({ where });

    return {
      total: policies.length,
      byStatus: policies.reduce((acc: Record<string, number>, policy) => {
        acc[policy.status] = (acc[policy.status] || 0) + 1;
        return acc;
      }, {}),
      primaryCount: policies.filter((p) => p.isPrimary).length,
    };
  }
}
