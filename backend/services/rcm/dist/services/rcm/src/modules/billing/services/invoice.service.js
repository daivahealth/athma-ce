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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const database_rcm_1 = require("@zeal/database-rcm");
const invoice_dto_1 = require("../dto/invoice.dto");
let InvoiceService = class InvoiceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        // Create invoice with lines in a transaction
        return this.prisma.$transaction(async (tx) => {
            // Create the invoice
            const invoice = await tx.invoice.create({
                data: {
                    tenantId,
                    patientId: dto.patientId,
                    encounterId: dto.encounterId ?? null,
                    mrn: dto.mrn ?? null,
                    patientDisplayName: dto.patientDisplayName ?? null,
                    invoiceNumber: dto.invoiceNumber,
                    invoiceDate: dto.invoiceDate ?? new Date(),
                    dueDate: dto.dueDate ?? null,
                    grossAmount: dto.grossAmount,
                    totalDiscounts: dto.totalDiscounts ?? 0,
                    netAmount: dto.netAmount,
                    amountPaid: dto.amountPaid ?? 0,
                    balanceDue: dto.balanceDue,
                    status: dto.status ?? invoice_dto_1.InvoiceStatus.UNPAID,
                    currency: dto.currency ?? 'AED',
                },
            });
            // Create invoice lines
            if (dto.invoiceLines && dto.invoiceLines.length > 0) {
                await tx.invoiceLine.createMany({
                    data: dto.invoiceLines.map((line) => ({
                        invoiceId: invoice.id,
                        chargeId: line.chargeId,
                        lineNumber: line.lineNumber,
                        description: line.description ?? null,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice,
                        lineAmount: line.lineAmount,
                        lineDiscount: line.lineDiscount ?? 0,
                    })),
                });
                // Update charge status to 'invoiced'
                const chargeIds = dto.invoiceLines.map((line) => line.chargeId);
                await tx.charge.updateMany({
                    where: {
                        id: { in: chargeIds },
                        tenantId,
                    },
                    data: {
                        status: 'invoiced',
                    },
                });
            }
            // Return invoice with lines
            return tx.invoice.findUnique({
                where: { id: invoice.id },
                include: {
                    invoiceLines: {
                        include: {
                            charge: {
                                include: {
                                    billingItem: true,
                                },
                            },
                        },
                        orderBy: {
                            lineNumber: 'asc',
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
        if (filters?.encounterId) {
            where.encounterId = filters.encounterId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.dateFrom || filters?.dateTo) {
            where.invoiceDate = {};
            if (filters.dateFrom) {
                where.invoiceDate.gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                where.invoiceDate.lte = filters.dateTo;
            }
        }
        return this.prisma.invoice.findMany({
            where,
            include: {
                invoiceLines: {
                    include: {
                        charge: true,
                    },
                    orderBy: {
                        lineNumber: 'asc',
                    },
                },
            },
            orderBy: {
                invoiceDate: 'desc',
            },
        });
    }
    async findById(tenantId, id) {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                invoiceLines: {
                    include: {
                        charge: {
                            include: {
                                billingItem: true,
                            },
                        },
                    },
                    orderBy: {
                        lineNumber: 'asc',
                    },
                },
            },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async findByInvoiceNumber(tenantId, invoiceNumber) {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                tenantId,
                invoiceNumber,
            },
            include: {
                invoiceLines: {
                    include: {
                        charge: true,
                    },
                    orderBy: {
                        lineNumber: 'asc',
                    },
                },
            },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice ${invoiceNumber} not found`);
        }
        return invoice;
    }
    async findByPatient(tenantId, patientId) {
        return this.prisma.invoice.findMany({
            where: {
                tenantId,
                patientId,
            },
            include: {
                invoiceLines: true,
            },
            orderBy: {
                invoiceDate: 'desc',
            },
        });
    }
    async findByEncounter(tenantId, encounterId) {
        return this.prisma.invoice.findMany({
            where: {
                tenantId,
                encounterId,
            },
            include: {
                invoiceLines: true,
            },
            orderBy: {
                invoiceDate: 'desc',
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.findById(tenantId, id);
        return this.prisma.$transaction(async (tx) => {
            const data = {};
            if (dto.patientId !== undefined)
                data.patientId = dto.patientId;
            if (dto.encounterId !== undefined)
                data.encounterId = dto.encounterId ?? null;
            if (dto.mrn !== undefined)
                data.mrn = dto.mrn ?? null;
            if (dto.patientDisplayName !== undefined)
                data.patientDisplayName = dto.patientDisplayName ?? null;
            if (dto.invoiceNumber !== undefined)
                data.invoiceNumber = dto.invoiceNumber;
            if (dto.invoiceDate !== undefined)
                data.invoiceDate = dto.invoiceDate;
            if (dto.dueDate !== undefined)
                data.dueDate = dto.dueDate ?? null;
            if (dto.grossAmount !== undefined)
                data.grossAmount = dto.grossAmount;
            if (dto.totalDiscounts !== undefined)
                data.totalDiscounts = dto.totalDiscounts;
            if (dto.netAmount !== undefined)
                data.netAmount = dto.netAmount;
            if (dto.amountPaid !== undefined)
                data.amountPaid = dto.amountPaid;
            if (dto.balanceDue !== undefined)
                data.balanceDue = dto.balanceDue;
            if (dto.status !== undefined)
                data.status = dto.status;
            if (dto.currency !== undefined)
                data.currency = dto.currency;
            const updatedInvoice = await tx.invoice.update({
                where: { id },
                data,
            });
            // If invoice lines are being updated, delete old ones and create new ones
            if (dto.invoiceLines && dto.invoiceLines.length > 0) {
                await tx.invoiceLine.deleteMany({
                    where: { invoiceId: id },
                });
                await tx.invoiceLine.createMany({
                    data: dto.invoiceLines.map((line) => ({
                        invoiceId: id,
                        chargeId: line.chargeId,
                        lineNumber: line.lineNumber,
                        description: line.description ?? null,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice,
                        lineAmount: line.lineAmount,
                        lineDiscount: line.lineDiscount ?? 0,
                    })),
                });
            }
            return tx.invoice.findUnique({
                where: { id },
                include: {
                    invoiceLines: {
                        include: {
                            charge: true,
                        },
                        orderBy: {
                            lineNumber: 'asc',
                        },
                    },
                },
            });
        });
    }
    async updateStatus(tenantId, id, dto) {
        await this.findById(tenantId, id);
        return this.prisma.invoice.update({
            where: { id },
            data: { status: dto.status },
            include: {
                invoiceLines: true,
            },
        });
    }
    async recordPayment(tenantId, id, dto) {
        const invoice = await this.findById(tenantId, id);
        if (invoice.status === invoice_dto_1.InvoiceStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot record payment for cancelled invoice');
        }
        const newAmountPaid = Number(invoice.amountPaid) + Number(dto.amount);
        const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;
        let newStatus = invoice.status;
        if (newBalanceDue <= 0) {
            newStatus = invoice_dto_1.InvoiceStatus.PAID;
        }
        else if (newAmountPaid > 0 && newBalanceDue > 0) {
            newStatus = invoice_dto_1.InvoiceStatus.PARTIAL;
        }
        return this.prisma.invoice.update({
            where: { id },
            data: {
                amountPaid: newAmountPaid,
                balanceDue: newBalanceDue,
                status: newStatus,
            },
            include: {
                invoiceLines: true,
            },
        });
    }
    async cancel(tenantId, id) {
        const invoice = await this.findById(tenantId, id);
        if (Number(invoice.amountPaid) > 0) {
            throw new common_1.BadRequestException('Cannot cancel invoice with payments');
        }
        return this.prisma.$transaction(async (tx) => {
            // Update invoice status
            const cancelled = await tx.invoice.update({
                where: { id },
                data: { status: invoice_dto_1.InvoiceStatus.CANCELLED },
                include: {
                    invoiceLines: true,
                },
            });
            // Revert charges back to 'unbilled'
            const chargeIds = cancelled.invoiceLines.map((line) => line.chargeId);
            await tx.charge.updateMany({
                where: {
                    id: { in: chargeIds },
                },
                data: {
                    status: 'unbilled',
                },
            });
            return cancelled;
        });
    }
    async delete(tenantId, id) {
        await this.findById(tenantId, id);
        return this.prisma.invoice.delete({
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
        if (filters?.encounterId) {
            where.encounterId = filters.encounterId;
        }
        const [total, byStatus, amounts] = await Promise.all([
            this.prisma.invoice.count({ where }),
            this.prisma.invoice.groupBy({
                by: ['status'],
                where,
                _count: true,
                _sum: {
                    netAmount: true,
                    amountPaid: true,
                    balanceDue: true,
                },
            }),
            this.prisma.invoice.aggregate({
                where,
                _sum: {
                    grossAmount: true,
                    totalDiscounts: true,
                    netAmount: true,
                    amountPaid: true,
                    balanceDue: true,
                },
            }),
        ]);
        return {
            total,
            totalGrossAmount: amounts._sum.grossAmount || 0,
            totalDiscounts: amounts._sum.totalDiscounts || 0,
            totalNetAmount: amounts._sum.netAmount || 0,
            totalAmountPaid: amounts._sum.amountPaid || 0,
            totalBalanceDue: amounts._sum.balanceDue || 0,
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = {
                    count: item._count,
                    netAmount: item._sum.netAmount || 0,
                    amountPaid: item._sum.amountPaid || 0,
                    balanceDue: item._sum.balanceDue || 0,
                };
                return acc;
            }, {}),
        };
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_rcm_1.PrismaService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map