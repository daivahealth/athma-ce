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
exports.ReceiptService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
let ReceiptService = class ReceiptService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        // Create receipt with allocations in a transaction
        return this.prisma.$transaction(async (tx) => {
            // Create the receipt
            const receipt = await tx.receipt.create({
                data: {
                    tenantId,
                    patientId: dto.patientId,
                    invoiceId: dto.invoiceId ?? null,
                    mrn: dto.mrn ?? null,
                    patientDisplayName: dto.patientDisplayName ?? null,
                    receiptNumber: dto.receiptNumber,
                    receiptDate: dto.receiptDate ?? new Date(),
                    amount: dto.amount,
                    currency: dto.currency ?? 'AED',
                    paymentMethod: dto.paymentMethod,
                    txnReference: dto.txnReference ?? null,
                    notes: dto.notes ?? null,
                },
            });
            // Create allocations if provided
            if (dto.allocations && dto.allocations.length > 0) {
                // Validate total allocation doesn't exceed receipt amount
                const totalAllocated = dto.allocations.reduce((sum, alloc) => sum + Number(alloc.allocatedAmount), 0);
                if (totalAllocated > Number(dto.amount)) {
                    throw new common_1.BadRequestException(`Total allocated amount (${totalAllocated}) exceeds receipt amount (${dto.amount})`);
                }
                // Create allocations
                await tx.receiptAllocation.createMany({
                    data: dto.allocations.map((alloc) => ({
                        receiptId: receipt.id,
                        invoiceId: alloc.invoiceId,
                        allocatedAmount: alloc.allocatedAmount,
                    })),
                });
                // Update invoice paid amounts for each allocation
                for (const alloc of dto.allocations) {
                    const invoice = await tx.invoice.findUnique({
                        where: { id: alloc.invoiceId },
                    });
                    if (!invoice) {
                        throw new common_1.NotFoundException(`Invoice ${alloc.invoiceId} not found`);
                    }
                    const newAmountPaid = Number(invoice.amountPaid) + Number(alloc.allocatedAmount);
                    const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;
                    let newStatus = invoice.status;
                    if (newBalanceDue <= 0) {
                        newStatus = 'paid';
                    }
                    else if (newAmountPaid > 0 && newBalanceDue > 0) {
                        newStatus = 'partial';
                    }
                    await tx.invoice.update({
                        where: { id: alloc.invoiceId },
                        data: {
                            amountPaid: newAmountPaid,
                            balanceDue: newBalanceDue,
                            status: newStatus,
                        },
                    });
                }
            }
            // Return receipt with allocations
            return tx.receipt.findUnique({
                where: { id: receipt.id },
                include: {
                    allocations: {
                        include: {
                            invoice: true,
                        },
                    },
                },
            });
        });
    }
    async findAll(tenantId, filters) {
        const where = {
            tenantId,
        };
        if (filters?.patientId) {
            where.patientId = filters.patientId;
        }
        if (filters?.invoiceId) {
            where.invoiceId = filters.invoiceId;
        }
        if (filters?.paymentMethod) {
            where.paymentMethod = filters.paymentMethod;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            where.receiptDate = {};
            if (filters.dateFrom) {
                where.receiptDate.gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                where.receiptDate.lte = filters.dateTo;
            }
        }
        return this.prisma.receipt.findMany({
            where,
            include: {
                allocations: {
                    include: {
                        invoice: true,
                    },
                },
            },
            orderBy: {
                receiptDate: 'desc',
            },
        });
    }
    async findById(tenantId, id) {
        const receipt = await this.prisma.receipt.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                allocations: {
                    include: {
                        invoice: true,
                    },
                },
            },
        });
        if (!receipt) {
            throw new common_1.NotFoundException(`Receipt with ID ${id} not found`);
        }
        return receipt;
    }
    async findByReceiptNumber(tenantId, receiptNumber) {
        const receipt = await this.prisma.receipt.findFirst({
            where: {
                tenantId,
                receiptNumber,
            },
            include: {
                allocations: {
                    include: {
                        invoice: true,
                    },
                },
            },
        });
        if (!receipt) {
            throw new common_1.NotFoundException(`Receipt ${receiptNumber} not found`);
        }
        return receipt;
    }
    async findByPatient(tenantId, patientId) {
        return this.prisma.receipt.findMany({
            where: {
                tenantId,
                patientId,
            },
            include: {
                allocations: true,
            },
            orderBy: {
                receiptDate: 'desc',
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.findById(tenantId, id);
        const data = {};
        if (dto.patientId !== undefined)
            data.patientId = dto.patientId;
        if (dto.invoiceId !== undefined)
            data.invoiceId = dto.invoiceId ?? null;
        if (dto.mrn !== undefined)
            data.mrn = dto.mrn ?? null;
        if (dto.patientDisplayName !== undefined)
            data.patientDisplayName = dto.patientDisplayName ?? null;
        if (dto.receiptNumber !== undefined)
            data.receiptNumber = dto.receiptNumber;
        if (dto.receiptDate !== undefined)
            data.receiptDate = dto.receiptDate;
        if (dto.amount !== undefined)
            data.amount = dto.amount;
        if (dto.currency !== undefined)
            data.currency = dto.currency;
        if (dto.paymentMethod !== undefined)
            data.paymentMethod = dto.paymentMethod;
        if (dto.txnReference !== undefined)
            data.txnReference = dto.txnReference ?? null;
        if (dto.notes !== undefined)
            data.notes = dto.notes ?? null;
        return this.prisma.receipt.update({
            where: { id },
            data,
            include: {
                allocations: {
                    include: {
                        invoice: true,
                    },
                },
            },
        });
    }
    async allocate(tenantId, id, dto) {
        const receipt = await this.findById(tenantId, id);
        // Calculate total existing allocations
        const existingAllocations = await this.prisma.receiptAllocation.findMany({
            where: { receiptId: id },
        });
        const existingTotal = existingAllocations.reduce((sum, alloc) => sum + Number(alloc.allocatedAmount), 0);
        // Calculate new allocation total
        const newTotal = dto.allocations.reduce((sum, alloc) => sum + Number(alloc.allocatedAmount), 0);
        // Validate total allocation doesn't exceed receipt amount
        if (existingTotal + newTotal > Number(receipt.amount)) {
            throw new common_1.BadRequestException(`Total allocated amount (${existingTotal + newTotal}) exceeds receipt amount (${receipt.amount})`);
        }
        return this.prisma.$transaction(async (tx) => {
            // Create new allocations
            await tx.receiptAllocation.createMany({
                data: dto.allocations.map((alloc) => ({
                    receiptId: id,
                    invoiceId: alloc.invoiceId,
                    allocatedAmount: alloc.allocatedAmount,
                })),
            });
            // Update invoice paid amounts for each allocation
            for (const alloc of dto.allocations) {
                const invoice = await tx.invoice.findUnique({
                    where: { id: alloc.invoiceId },
                });
                if (!invoice) {
                    throw new common_1.NotFoundException(`Invoice ${alloc.invoiceId} not found`);
                }
                const newAmountPaid = Number(invoice.amountPaid) + Number(alloc.allocatedAmount);
                const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;
                let newStatus = invoice.status;
                if (newBalanceDue <= 0) {
                    newStatus = 'paid';
                }
                else if (newAmountPaid > 0 && newBalanceDue > 0) {
                    newStatus = 'partial';
                }
                await tx.invoice.update({
                    where: { id: alloc.invoiceId },
                    data: {
                        amountPaid: newAmountPaid,
                        balanceDue: newBalanceDue,
                        status: newStatus,
                    },
                });
            }
            // Return updated receipt with allocations
            return tx.receipt.findUnique({
                where: { id },
                include: {
                    allocations: {
                        include: {
                            invoice: true,
                        },
                    },
                },
            });
        });
    }
    async delete(tenantId, id) {
        const receipt = await this.findById(tenantId, id);
        // Check if receipt has allocations
        if (receipt.allocations && receipt.allocations.length > 0) {
            throw new common_1.BadRequestException('Cannot delete receipt with allocations. Remove allocations first.');
        }
        return this.prisma.receipt.delete({
            where: { id },
        });
    }
    async getStatistics(tenantId, filters) {
        const where = {
            tenantId,
        };
        if (filters?.patientId) {
            where.patientId = filters.patientId;
        }
        const [total, byPaymentMethod, amounts] = await Promise.all([
            this.prisma.receipt.count({ where }),
            this.prisma.receipt.groupBy({
                by: ['paymentMethod'],
                where,
                _count: true,
                _sum: {
                    amount: true,
                },
            }),
            this.prisma.receipt.aggregate({
                where,
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            total,
            totalAmount: amounts._sum.amount || 0,
            byPaymentMethod: byPaymentMethod.reduce((acc, item) => {
                acc[item.paymentMethod] = {
                    count: item._count,
                    totalAmount: item._sum.amount || 0,
                };
                return acc;
            }, {}),
        };
    }
};
exports.ReceiptService = ReceiptService;
exports.ReceiptService = ReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], ReceiptService);
//# sourceMappingURL=receipt.service.js.map