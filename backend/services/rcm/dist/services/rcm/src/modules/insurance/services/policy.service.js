"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
const policy_dto_1 = require("../dto/policy.dto");
let PolicyService = class PolicyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        // Verify payer exists
        const payer = await this.prisma.payer.findFirst({
            where: { id: dto.payerId, tenantId },
        });
        if (!payer) {
            throw new common_1.NotFoundException(`Payer with ID ${dto.payerId} not found`);
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
                status: dto.status || policy_dto_1.PolicyStatus.ACTIVE,
            },
            include: {
                payer: true,
            },
        });
    }
    async findAll(tenantId, patientId, status) {
        const where = { tenantId };
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
    async findById(tenantId, id) {
        const policy = await this.prisma.policy.findFirst({
            where: { id, tenantId },
            include: {
                payer: true,
            },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy with ID ${id} not found`);
        }
        return policy;
    }
    async findByPatient(tenantId, patientId) {
        return this.prisma.policy.findMany({
            where: {
                tenantId,
                patientId,
                status: policy_dto_1.PolicyStatus.ACTIVE,
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
    async findPrimaryPolicy(tenantId, patientId) {
        const policy = await this.prisma.policy.findFirst({
            where: {
                tenantId,
                patientId,
                isPrimary: true,
                status: policy_dto_1.PolicyStatus.ACTIVE,
            },
            include: {
                payer: true,
            },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`No primary policy found for patient ${patientId}`);
        }
        return policy;
    }
    async update(tenantId, id, dto) {
        // Verify policy exists and belongs to tenant
        const existingPolicy = await this.findById(tenantId, id);
        // If updating payer, verify it exists
        if (dto.payerId && dto.payerId !== existingPolicy.payerId) {
            const payer = await this.prisma.payer.findFirst({
                where: { id: dto.payerId, tenantId },
            });
            if (!payer) {
                throw new common_1.NotFoundException(`Payer with ID ${dto.payerId} not found`);
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
        const data = {};
        if (dto.policyNumber !== undefined)
            data.policyNumber = dto.policyNumber;
        if (dto.groupNumber !== undefined)
            data.groupNumber = dto.groupNumber ?? null;
        if (dto.payerName !== undefined)
            data.payerName = dto.payerName;
        if (dto.payerId !== undefined)
            data.payerId = dto.payerId;
        if (dto.relationship !== undefined)
            data.relationship = dto.relationship ?? null;
        if (dto.effectiveDate !== undefined)
            data.effectiveDate = dto.effectiveDate ? new Date(dto.effectiveDate) : null;
        if (dto.expirationDate !== undefined)
            data.expirationDate = dto.expirationDate ? new Date(dto.expirationDate) : null;
        if (dto.benefits !== undefined)
            data.benefits = dto.benefits;
        if (dto.isPrimary !== undefined)
            data.isPrimary = dto.isPrimary;
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.policy.update({
            where: { id },
            data,
            include: {
                payer: true,
            },
        });
    }
    async delete(tenantId, id) {
        // Verify policy exists and belongs to tenant
        await this.findById(tenantId, id);
        // Soft delete by updating status
        await this.prisma.policy.update({
            where: { id },
            data: { status: policy_dto_1.PolicyStatus.CANCELLED },
        });
        return { message: 'Policy cancelled successfully' };
    }
    async checkExpiredPolicies(tenantId) {
        const now = new Date();
        const expiredPolicies = await this.prisma.policy.findMany({
            where: {
                tenantId,
                status: policy_dto_1.PolicyStatus.ACTIVE,
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
                data: { status: policy_dto_1.PolicyStatus.EXPIRED },
            });
        }
        return {
            expiredCount: expiredPolicies.length,
            expiredPolicies,
        };
    }
    async getPolicyStatistics(tenantId, patientId) {
        const where = { tenantId };
        if (patientId) {
            where.patientId = patientId;
        }
        const policies = await this.prisma.policy.findMany({ where });
        return {
            total: policies.length,
            byStatus: policies.reduce((acc, policy) => {
                acc[policy.status] = (acc[policy.status] || 0) + 1;
                return acc;
            }, {}),
            primaryCount: policies.filter((p) => p.isPrimary).length,
        };
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], PolicyService);
//# sourceMappingURL=policy.service.js.map