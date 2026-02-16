import { Injectable, Logger, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  CreateReceiptDto,
  UpdateReceiptDto,
  AllocateReceiptDto,
  PaymentMethod,
} from '../dto/receipt.dto';
import { PatientDisplayDto } from './invoice.service';
import { PatientLedgerService } from './patient-ledger.service';

@Injectable()
export class ReceiptService {
  private readonly logger = new Logger(ReceiptService.name);
  private readonly clinicalApiUrl = process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => PatientLedgerService))
    private readonly ledgerService: PatientLedgerService,
  ) {}

  // ---------------------------------------------------------------------------
  // Patient display helpers (mirrors Invoice service pattern)
  // ---------------------------------------------------------------------------

  private calculateAge(dateOfBirth: Date | string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private buildPatientDisplay(patient: any): PatientDisplayDto {
    return {
      patientId: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
      age: this.calculateAge(patient.dateOfBirth),
      dateOfBirth: typeof patient.dateOfBirth === 'string'
        ? patient.dateOfBirth.split('T')[0]
        : new Date(patient.dateOfBirth).toISOString().split('T')[0],
      gender: patient.gender,
      nationalId: patient.nationalId || undefined,
      nationalIdType: patient.nationalIdType || undefined,
      phoneNumber: patient.phoneNumber || undefined,
      email: patient.email || undefined,
      nationality: patient.nationality || undefined,
      preferredLanguage: patient.preferredLanguage || undefined,
    };
  }

  private async fetchPatientDisplay(
    patientId: string,
    tenantId: string,
    authHeader?: string,
    facilityId?: string,
    userId?: string,
  ): Promise<PatientDisplayDto | null> {
    try {
      const headers: Record<string, string> = { 'x-tenant-id': tenantId };
      if (authHeader) {
        headers['authorization'] = authHeader;
      }
      if (facilityId) {
        headers['x-facility-id'] = facilityId;
      }
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalApiUrl}/patients/${patientId}`, { headers }),
      );
      return response?.data ? this.buildPatientDisplay(response.data) : null;
    } catch (error) {
      this.logger.warn(`Failed to fetch patient ${patientId} from Clinical API: ${(error as Error).message}`);
      return null;
    }
  }

  private async fetchPatientDisplayMap(
    patientIds: string[],
    tenantId: string,
    authHeader?: string,
    facilityId?: string,
    userId?: string,
  ): Promise<Map<string, PatientDisplayDto>> {
    const unique = [...new Set(patientIds)];
    const results = await Promise.all(
      unique.map((id) => this.fetchPatientDisplay(id, tenantId, authHeader, facilityId, userId)),
    );
    const map = new Map<string, PatientDisplayDto>();
    unique.forEach((id, index) => {
      if (results[index]) {
        map.set(id, results[index]!);
      }
    });
    return map;
  }

  private attachPatientDisplay(receipt: any, displayMap: Map<string, PatientDisplayDto>) {
    return {
      ...receipt,
      patientDisplay: displayMap.get(receipt.patientId) ?? null,
    };
  }

  private resolveReceiptAmounts(dto: CreateReceiptDto | UpdateReceiptDto, baseCurrencyFallback = 'AED') {
    const baseCurrency = (dto.currency ?? baseCurrencyFallback).trim().toUpperCase();
    const hasPaidFields =
      dto.paidAmount !== undefined || dto.paidCurrency !== undefined || dto.fxRateToBase !== undefined;

    if (hasPaidFields) {
      if (
        dto.paidAmount === undefined ||
        dto.paidCurrency === undefined ||
        dto.fxRateToBase === undefined
      ) {
        throw new BadRequestException('paidAmount, paidCurrency, and fxRateToBase are required together');
      }
      if (dto.fxRateToBase <= 0) {
        throw new BadRequestException('fxRateToBase must be greater than 0');
      }
      const paidAmount = Number(dto.paidAmount);
      const fxRateToBase = Number(dto.fxRateToBase);
      const baseAmount = Number((paidAmount * fxRateToBase).toFixed(2));
      return {
        amount: baseAmount,
        currency: baseCurrency,
        paidAmount,
        paidCurrency: dto.paidCurrency.trim().toUpperCase(),
        fxRateToBase,
        hasPaidFields: true,
      };
    }

    return {
      amount: dto.amount !== undefined ? Number(dto.amount) : 0,
      currency: baseCurrency,
      paidAmount: dto.amount !== undefined ? Number(dto.amount) : 0,
      paidCurrency: baseCurrency,
      fxRateToBase: 1,
      hasPaidFields: false,
    };
  }

  async create(tenantId: string, dto: CreateReceiptDto) {
    // Create receipt with allocations in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const resolved = this.resolveReceiptAmounts(dto);

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
          amount: resolved.amount,
          currency: resolved.currency,
          paidAmount: resolved.paidAmount,
          paidCurrency: resolved.paidCurrency,
          fxRateToBase: resolved.fxRateToBase,
          paymentMethod: dto.paymentMethod,
          txnReference: dto.txnReference ?? null,
          notes: dto.notes ?? null,
        },
      });

      // Create allocations if provided
      if (dto.allocations && dto.allocations.length > 0) {
        // Validate total allocation doesn't exceed receipt amount
        const totalAllocated = dto.allocations.reduce(
          (sum, alloc) => sum + Number(alloc.allocatedAmount),
          0,
        );

        if (totalAllocated > Number(resolved.amount)) {
          throw new BadRequestException(
            `Total allocated amount (${totalAllocated}) exceeds receipt amount (${resolved.amount})`,
          );
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
            throw new NotFoundException(`Invoice ${alloc.invoiceId} not found`);
          }

          const newAmountPaid = Number(invoice.amountPaid) + Number(alloc.allocatedAmount);
          const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;

          let newStatus = invoice.status;
          if (newBalanceDue <= 0) {
            newStatus = 'paid';
          } else if (newAmountPaid > 0 && newBalanceDue > 0) {
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
      const createdReceipt = await tx.receipt.findUnique({
        where: { id: receipt.id },
        include: {
          allocations: {
            include: {
              invoice: true,
            },
          },
        },
      });

      return createdReceipt;
    });

    // Post to patient ledger (outside transaction for now)
    if (result) {
      try {
        await this.ledgerService.postReceipt(tenantId, {
          id: result.id,
          patientId: result.patientId,
          receiptNumber: result.receiptNumber,
          amount: result.amount,
          currency: result.currency,
        });
      } catch (error) {
        this.logger.warn(`Failed to post receipt ${result.id} to ledger: ${(error as Error).message}`);
      }
    }

    return result;
  }

  async findAll(
    tenantId: string,
    filters?: {
      patientId?: string;
      invoiceId?: string;
      paymentMethod?: PaymentMethod;
      dateFrom?: Date;
      dateTo?: Date;
    },
    authHeader?: string,
    facilityId?: string,
    userId?: string,
  ) {
    const where: any = {
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

    const receipts = await this.prisma.receipt.findMany({
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

    // Resolve patient displays from Clinical API
    const patientIds = receipts.map((r) => r.patientId);
    const displayMap = await this.fetchPatientDisplayMap(patientIds, tenantId, authHeader, facilityId, userId);

    return receipts.map((receipt) => this.attachPatientDisplay(receipt, displayMap));
  }

  async findById(tenantId: string, id: string, authHeader?: string, facilityId?: string, userId?: string) {
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
      throw new NotFoundException(`Receipt with ID ${id} not found`);
    }

    // Resolve patient display from Clinical API
    const patientDisplay = await this.fetchPatientDisplay(receipt.patientId, tenantId, authHeader, facilityId, userId);

    return {
      ...receipt,
      patientDisplay,
    };
  }

  async findByReceiptNumber(tenantId: string, receiptNumber: string) {
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
      throw new NotFoundException(`Receipt ${receiptNumber} not found`);
    }

    return receipt;
  }

  async findByPatient(tenantId: string, patientId: string) {
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

  async update(tenantId: string, id: string, dto: UpdateReceiptDto) {
    const existing = await this.findById(tenantId, id);

    const data: any = {};
    if (dto.patientId !== undefined) data.patientId = dto.patientId;
    if (dto.invoiceId !== undefined) data.invoiceId = dto.invoiceId ?? null;
    if (dto.mrn !== undefined) data.mrn = dto.mrn ?? null;
    if (dto.patientDisplayName !== undefined) data.patientDisplayName = dto.patientDisplayName ?? null;
    if (dto.receiptNumber !== undefined) data.receiptNumber = dto.receiptNumber;
    if (dto.receiptDate !== undefined) data.receiptDate = dto.receiptDate;
    if (dto.paymentMethod !== undefined) data.paymentMethod = dto.paymentMethod;
    if (dto.txnReference !== undefined) data.txnReference = dto.txnReference ?? null;
    if (dto.notes !== undefined) data.notes = dto.notes ?? null;

    const hasPaidFields =
      dto.paidAmount !== undefined || dto.paidCurrency !== undefined || dto.fxRateToBase !== undefined;

    if (hasPaidFields) {
      const resolved = this.resolveReceiptAmounts(dto, existing.currency);
      data.amount = resolved.amount;
      data.currency = resolved.currency;
      data.paidAmount = resolved.paidAmount;
      data.paidCurrency = resolved.paidCurrency;
      data.fxRateToBase = resolved.fxRateToBase;
    } else if (dto.amount !== undefined || dto.currency !== undefined) {
      const baseAmount = dto.amount !== undefined ? Number(dto.amount) : Number(existing.amount);
      const baseCurrency = dto.currency ?? existing.currency;
      data.amount = baseAmount;
      data.currency = baseCurrency;
      data.paidAmount = baseAmount;
      data.paidCurrency = baseCurrency;
      data.fxRateToBase = 1;
    }

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

  async allocate(tenantId: string, id: string, dto: AllocateReceiptDto) {
    const receipt = await this.findById(tenantId, id);

    // Calculate total existing allocations
    const existingAllocations = await this.prisma.receiptAllocation.findMany({
      where: { receiptId: id },
    });

    const existingTotal = existingAllocations.reduce(
      (sum, alloc) => sum + Number(alloc.allocatedAmount),
      0,
    );

    // Calculate new allocation total
    const newTotal = dto.allocations.reduce(
      (sum, alloc) => sum + Number(alloc.allocatedAmount),
      0,
    );

    // Validate total allocation doesn't exceed receipt amount
    if (existingTotal + newTotal > Number(receipt.amount)) {
      throw new BadRequestException(
        `Total allocated amount (${existingTotal + newTotal}) exceeds receipt amount (${receipt.amount})`,
      );
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
          throw new NotFoundException(`Invoice ${alloc.invoiceId} not found`);
        }

        const newAmountPaid = Number(invoice.amountPaid) + Number(alloc.allocatedAmount);
        const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;

        let newStatus = invoice.status;
        if (newBalanceDue <= 0) {
          newStatus = 'paid';
        } else if (newAmountPaid > 0 && newBalanceDue > 0) {
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

  async delete(tenantId: string, id: string) {
    const receipt = await this.findById(tenantId, id);

    // Check if receipt has allocations
    if (receipt.allocations && receipt.allocations.length > 0) {
      throw new BadRequestException('Cannot delete receipt with allocations. Remove allocations first.');
    }

    return this.prisma.receipt.delete({
      where: { id },
    });
  }

  async getStatistics(tenantId: string, filters?: { patientId?: string }) {
    const where: any = {
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
      byPaymentMethod: byPaymentMethod.reduce(
        (acc: Record<string, any>, item: any) => {
          acc[item.paymentMethod] = {
            count: item._count,
            totalAmount: item._sum.amount || 0,
          };
          return acc;
        },
        {} as Record<string, any>,
      ),
    };
  }
}
