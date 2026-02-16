import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  CreateRefundDto,
  UpdateRefundDto,
  ApproveRefundDto,
  RejectRefundDto,
  ProcessRefundDto,
  VoidRefundDto,
  AllocateRefundDto,
  RefundStatus,
  RefundMethod,
} from '../dto/refund.dto';
import { PatientDisplayDto } from './invoice.service';
import { PatientLedgerService } from './patient-ledger.service';

@Injectable()
export class RefundService {
  private readonly logger = new Logger(RefundService.name);
  private readonly clinicalApiUrl =
    process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';
  private readonly foundationApiUrl =
    process.env.FOUNDATION_API_URL || 'http://localhost:3010/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => PatientLedgerService))
    private readonly ledgerService: PatientLedgerService,
  ) {}

  // ---------------------------------------------------------------------------
  // Refund number generation helpers
  // ---------------------------------------------------------------------------

  private async fetchConfig(
    tenantId: string,
    configKey: string,
    authHeader?: string,
  ): Promise<any> {
    try {
      const headers: Record<string, string> = { 'x-tenant-id': tenantId };
      if (authHeader) {
        headers['authorization'] = authHeader;
      }
      const response = await firstValueFrom(
        this.httpService.get(`${this.foundationApiUrl}/configs/resolve/${configKey}`, { headers }),
      );
      return response?.data?.value ?? null;
    } catch (error) {
      this.logger.warn(`Failed to fetch config ${configKey}: ${(error as Error).message}`);
      return null;
    }
  }

  private formatDocumentNumber(
    format: string,
    prefix: string,
    startNumber: number,
    count: number,
  ): string {
    const year = new Date().getFullYear().toString();
    const sequence = count + startNumber;

    let result = format;
    result = result.replace('{PREFIX}', prefix);
    result = result.replace('{YEAR}', year);

    const seqMatch = result.match(/\{SEQUENCE:(\d+)\}/);
    if (seqMatch && seqMatch[1]) {
      const pad = parseInt(seqMatch[1], 10);
      result = result.replace(seqMatch[0], String(sequence).padStart(pad, '0'));
    } else {
      result = result.replace('{SEQUENCE}', String(sequence));
    }

    return result;
  }

  private async generateRefundNumber(
    tenantId: string,
    authHeader?: string,
  ): Promise<string> {
    // Fetch config values from Foundation API
    const [format, prefix, startNumber] = await Promise.all([
      this.fetchConfig(tenantId, 'finance.refund_number_format', authHeader),
      this.fetchConfig(tenantId, 'finance.refund_prefix', authHeader),
      this.fetchConfig(tenantId, 'finance.refund_start_number', authHeader),
    ]);

    // Count existing refunds for this tenant
    const count = await this.prisma.refund.count({ where: { tenantId } });

    // Use defaults if config not available
    const resolvedFormat = typeof format === 'string' ? format : '{PREFIX}-{YEAR}-{SEQUENCE:6}';
    const resolvedPrefix = typeof prefix === 'string' ? prefix : 'REF';
    const resolvedStartNumber = typeof startNumber === 'number' ? startNumber : 1000;

    return this.formatDocumentNumber(resolvedFormat, resolvedPrefix, resolvedStartNumber, count);
  }

  // ---------------------------------------------------------------------------
  // Patient display helpers (mirrors Receipt service pattern)
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
      dateOfBirth:
        typeof patient.dateOfBirth === 'string'
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
      this.logger.warn(
        `Failed to fetch patient ${patientId} from Clinical API: ${(error as Error).message}`,
      );
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

  private attachPatientDisplay(refund: any, displayMap: Map<string, PatientDisplayDto>) {
    return {
      ...refund,
      patientDisplay: displayMap.get(refund.patientId) ?? null,
    };
  }

  // ---------------------------------------------------------------------------
  // Multi-currency helper
  // ---------------------------------------------------------------------------

  private resolveRefundAmounts(
    dto: CreateRefundDto | UpdateRefundDto | ProcessRefundDto,
    baseCurrencyFallback = 'AED',
  ) {
    const baseCurrency =
      ('currency' in dto && dto.currency?.trim().toUpperCase()) || baseCurrencyFallback;
    const hasFxFields =
      dto.refundedAmount !== undefined ||
      dto.refundedCurrency !== undefined ||
      dto.fxRateToBase !== undefined;

    if (hasFxFields) {
      if (
        dto.refundedAmount === undefined ||
        dto.refundedCurrency === undefined ||
        dto.fxRateToBase === undefined
      ) {
        throw new BadRequestException(
          'refundedAmount, refundedCurrency, and fxRateToBase are required together',
        );
      }
      if (dto.fxRateToBase <= 0) {
        throw new BadRequestException('fxRateToBase must be greater than 0');
      }
      const refundedAmount = Number(dto.refundedAmount);
      const fxRateToBase = Number(dto.fxRateToBase);
      const baseAmount = Number((refundedAmount * fxRateToBase).toFixed(2));
      return {
        amount: baseAmount,
        currency: baseCurrency,
        refundedAmount,
        refundedCurrency: dto.refundedCurrency.trim().toUpperCase(),
        fxRateToBase,
        hasFxFields: true,
      };
    }

    const amount = 'amount' in dto && dto.amount !== undefined ? Number(dto.amount) : 0;
    return {
      amount,
      currency: baseCurrency,
      refundedAmount: amount,
      refundedCurrency: baseCurrency,
      fxRateToBase: 1,
      hasFxFields: false,
    };
  }

  // ---------------------------------------------------------------------------
  // Audit log helper
  // ---------------------------------------------------------------------------

  private async createAuditLog(
    tx: any,
    refundId: string,
    action: string,
    performedBy: string,
    details?: any,
  ) {
    await tx.refundAuditLog.create({
      data: {
        refundId,
        action,
        performedBy,
        details: details ?? null,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // CRUD Operations
  // ---------------------------------------------------------------------------

  async create(
    tenantId: string,
    dto: CreateRefundDto,
    requestedBy?: string,
    authHeader?: string,
  ) {
    // Generate refund number if not provided
    const refundNumber = dto.refundNumber || (await this.generateRefundNumber(tenantId, authHeader));

    return this.prisma.$transaction(async (tx) => {
      const resolved = this.resolveRefundAmounts(dto);

      // If linked to a receipt, validate the receipt and check refund limits
      if (dto.receiptId) {
        const receipt = await tx.receipt.findFirst({
          where: { id: dto.receiptId, tenantId },
          include: { refunds: true },
        });

        if (!receipt) {
          throw new NotFoundException(`Receipt ${dto.receiptId} not found`);
        }

        // Calculate total already refunded for this receipt
        const totalRefunded = receipt.refunds
          .filter((r: any) => r.status !== 'voided' && r.status !== 'rejected')
          .reduce((sum: number, r: any) => sum + Number(r.amount), 0);

        const maxRefundable = Number(receipt.amount) - totalRefunded;
        if (resolved.amount > maxRefundable) {
          throw new BadRequestException(
            `Refund amount (${resolved.amount}) exceeds unrefunded receipt balance (${maxRefundable})`,
          );
        }
      }

      // Create the refund
      const refund = await tx.refund.create({
        data: {
          tenantId,
          patientId: dto.patientId,
          receiptId: dto.receiptId ?? null,
          refundNumber,
          refundDate: dto.refundDate ?? new Date(),
          amount: resolved.amount,
          currency: resolved.currency,
          refundedAmount: resolved.refundedAmount,
          refundedCurrency: resolved.refundedCurrency,
          fxRateToBase: resolved.fxRateToBase,
          refundMethod: dto.refundMethod,
          txnReference: dto.txnReference ?? null,
          reason: dto.reason ?? null,
          notes: dto.notes ?? null,
          mrn: dto.mrn ?? null,
          patientDisplayName: dto.patientDisplayName ?? null,
          status: 'pending',
          requestedBy: requestedBy ?? null,
          requestedAt: new Date(),
        },
      });

      // Create allocations if provided
      if (dto.allocations && dto.allocations.length > 0) {
        const totalAllocated = dto.allocations.reduce(
          (sum, alloc) => sum + Number(alloc.allocatedAmount),
          0,
        );

        if (totalAllocated > Number(resolved.amount)) {
          throw new BadRequestException(
            `Total allocated amount (${totalAllocated}) exceeds refund amount (${resolved.amount})`,
          );
        }

        await tx.refundAllocation.createMany({
          data: dto.allocations.map((alloc) => ({
            refundId: refund.id,
            invoiceId: alloc.invoiceId,
            allocatedAmount: alloc.allocatedAmount,
          })),
        });
      }

      // Create audit log
      await this.createAuditLog(tx, refund.id, 'created', requestedBy ?? 'system', {
        amount: resolved.amount,
        method: dto.refundMethod,
        receiptId: dto.receiptId,
      });

      return tx.refund.findUnique({
        where: { id: refund.id },
        include: {
          allocations: { include: { invoice: true } },
          receipt: true,
          auditLogs: { orderBy: { performedAt: 'desc' } },
        },
      });
    });
  }

  async findAll(
    tenantId: string,
    filters?: {
      patientId?: string;
      receiptId?: string;
      status?: RefundStatus;
      refundMethod?: RefundMethod;
      dateFrom?: Date;
      dateTo?: Date;
    },
    authHeader?: string,
    facilityId?: string,
    userId?: string,
  ) {
    const where: any = { tenantId };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.receiptId) {
      where.receiptId = filters.receiptId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.refundMethod) {
      where.refundMethod = filters.refundMethod;
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.refundDate = {};
      if (filters.dateFrom) {
        where.refundDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.refundDate.lte = filters.dateTo;
      }
    }

    const refunds = await this.prisma.refund.findMany({
      where,
      include: {
        allocations: { include: { invoice: true } },
        receipt: true,
      },
      orderBy: { refundDate: 'desc' },
    });

    // Resolve patient displays from Clinical API
    const patientIds = refunds.map((r) => r.patientId);
    const displayMap = await this.fetchPatientDisplayMap(
      patientIds,
      tenantId,
      authHeader,
      facilityId,
      userId,
    );

    return refunds.map((refund) => this.attachPatientDisplay(refund, displayMap));
  }

  async findById(
    tenantId: string,
    id: string,
    authHeader?: string,
    facilityId?: string,
    userId?: string,
  ) {
    const refund = await this.prisma.refund.findFirst({
      where: { id, tenantId },
      include: {
        allocations: { include: { invoice: true } },
        receipt: true,
        auditLogs: { orderBy: { performedAt: 'desc' } },
      },
    });

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }

    const patientDisplay = await this.fetchPatientDisplay(
      refund.patientId,
      tenantId,
      authHeader,
      facilityId,
      userId,
    );

    return { ...refund, patientDisplay };
  }

  async findByPatient(tenantId: string, patientId: string) {
    return this.prisma.refund.findMany({
      where: { tenantId, patientId },
      include: {
        allocations: true,
        receipt: true,
      },
      orderBy: { refundDate: 'desc' },
    });
  }

  async findByReceipt(tenantId: string, receiptId: string) {
    return this.prisma.refund.findMany({
      where: { tenantId, receiptId },
      include: {
        allocations: true,
      },
      orderBy: { refundDate: 'desc' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateRefundDto) {
    const existing = await this.findById(tenantId, id);

    if (existing.status !== 'pending') {
      throw new ConflictException('Only pending refunds can be updated');
    }

    const data: any = {};

    if (dto.reason !== undefined) data.reason = dto.reason ?? null;
    if (dto.notes !== undefined) data.notes = dto.notes ?? null;
    if (dto.txnReference !== undefined) data.txnReference = dto.txnReference ?? null;
    if (dto.refundMethod !== undefined) data.refundMethod = dto.refundMethod;

    const hasFxFields =
      dto.refundedAmount !== undefined ||
      dto.refundedCurrency !== undefined ||
      dto.fxRateToBase !== undefined;

    if (hasFxFields) {
      const resolved = this.resolveRefundAmounts(dto, existing.currency);
      data.amount = resolved.amount;
      data.currency = resolved.currency;
      data.refundedAmount = resolved.refundedAmount;
      data.refundedCurrency = resolved.refundedCurrency;
      data.fxRateToBase = resolved.fxRateToBase;
    } else if (dto.amount !== undefined || dto.currency !== undefined) {
      const baseAmount = dto.amount !== undefined ? Number(dto.amount) : Number(existing.amount);
      const baseCurrency = dto.currency ?? existing.currency;
      data.amount = baseAmount;
      data.currency = baseCurrency;
      data.refundedAmount = baseAmount;
      data.refundedCurrency = baseCurrency;
      data.fxRateToBase = 1;
    }

    return this.prisma.refund.update({
      where: { id },
      data,
      include: {
        allocations: { include: { invoice: true } },
        receipt: true,
        auditLogs: { orderBy: { performedAt: 'desc' } },
      },
    });
  }

  async allocate(tenantId: string, id: string, dto: AllocateRefundDto) {
    const refund = await this.findById(tenantId, id);

    if (refund.status !== 'pending' && refund.status !== 'approved') {
      throw new ConflictException('Can only allocate pending or approved refunds');
    }

    const existingAllocations = await this.prisma.refundAllocation.findMany({
      where: { refundId: id },
    });

    const existingTotal = existingAllocations.reduce(
      (sum, alloc) => sum + Number(alloc.allocatedAmount),
      0,
    );

    const newTotal = dto.allocations.reduce(
      (sum, alloc) => sum + Number(alloc.allocatedAmount),
      0,
    );

    if (existingTotal + newTotal > Number(refund.amount)) {
      throw new BadRequestException(
        `Total allocated amount (${existingTotal + newTotal}) exceeds refund amount (${refund.amount})`,
      );
    }

    await this.prisma.refundAllocation.createMany({
      data: dto.allocations.map((alloc) => ({
        refundId: id,
        invoiceId: alloc.invoiceId,
        allocatedAmount: alloc.allocatedAmount,
      })),
    });

    return this.prisma.refund.findUnique({
      where: { id },
      include: {
        allocations: { include: { invoice: true } },
        receipt: true,
        auditLogs: { orderBy: { performedAt: 'desc' } },
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Workflow Operations
  // ---------------------------------------------------------------------------

  async approve(tenantId: string, id: string, userId: string, dto: ApproveRefundDto) {
    const refund = await this.findById(tenantId, id);

    if (refund.status !== 'pending') {
      throw new ConflictException('Only pending refunds can be approved');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.refund.update({
        where: { id },
        data: {
          status: 'approved',
          approvedBy: userId,
          approvedAt: new Date(),
          notes: dto.notes ? `${refund.notes || ''}\n[Approval] ${dto.notes}`.trim() : refund.notes,
        },
        include: {
          allocations: { include: { invoice: true } },
          receipt: true,
          auditLogs: { orderBy: { performedAt: 'desc' } },
        },
      });

      await this.createAuditLog(tx, id, 'approved', userId, { notes: dto.notes });

      return updated;
    });
  }

  async reject(tenantId: string, id: string, userId: string, dto: RejectRefundDto) {
    const refund = await this.findById(tenantId, id);

    if (refund.status !== 'pending') {
      throw new ConflictException('Only pending refunds can be rejected');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.refund.update({
        where: { id },
        data: {
          status: 'rejected',
          rejectionReason: dto.rejectionReason,
        },
        include: {
          allocations: { include: { invoice: true } },
          receipt: true,
          auditLogs: { orderBy: { performedAt: 'desc' } },
        },
      });

      await this.createAuditLog(tx, id, 'rejected', userId, {
        rejectionReason: dto.rejectionReason,
      });

      return updated;
    });
  }

  async process(tenantId: string, id: string, userId: string, dto: ProcessRefundDto) {
    const refund = await this.findById(tenantId, id);

    if (refund.status !== 'approved') {
      throw new ConflictException('Only approved refunds can be processed');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Build update data
      const data: any = {
        status: 'processed',
        processedBy: userId,
        processedAt: new Date(),
      };

      if (dto.txnReference) {
        data.txnReference = dto.txnReference;
      }

      if (dto.notes) {
        data.notes = `${refund.notes || ''}\n[Processing] ${dto.notes}`.trim();
      }

      // Handle FX fields if provided
      if (dto.refundedAmount !== undefined) {
        const resolved = this.resolveRefundAmounts(dto, refund.currency);
        data.refundedAmount = resolved.refundedAmount;
        data.refundedCurrency = resolved.refundedCurrency;
        data.fxRateToBase = resolved.fxRateToBase;
      }

      // Update invoice balances for allocations
      // When a refund is processed, it reverses payments - increase balance due
      for (const allocation of refund.allocations) {
        const invoice = await tx.invoice.findUnique({
          where: { id: allocation.invoiceId },
        });

        if (invoice) {
          const newAmountPaid = Number(invoice.amountPaid) - Number(allocation.allocatedAmount);
          const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;

          let newStatus = invoice.status;
          if (newBalanceDue <= 0) {
            newStatus = 'paid';
          } else if (newAmountPaid > 0 && newBalanceDue > 0) {
            newStatus = 'partial';
          } else {
            newStatus = 'unpaid';
          }

          await tx.invoice.update({
            where: { id: allocation.invoiceId },
            data: {
              amountPaid: Math.max(0, newAmountPaid),
              balanceDue: Math.max(0, newBalanceDue),
              status: newStatus,
            },
          });
        }
      }

      const updated = await tx.refund.update({
        where: { id },
        data,
        include: {
          allocations: { include: { invoice: true } },
          receipt: true,
          auditLogs: { orderBy: { performedAt: 'desc' } },
        },
      });

      await this.createAuditLog(tx, id, 'processed', userId, {
        txnReference: dto.txnReference,
        allocationsProcessed: refund.allocations.length,
      });

      return updated;
    });

    // Post to patient ledger after transaction completes
    try {
      await this.ledgerService.postRefund(tenantId, {
        id: refund.id,
        patientId: refund.patientId,
        refundNumber: refund.refundNumber,
        amount: refund.amount,
        currency: refund.currency,
      }, userId);
    } catch (error) {
      this.logger.warn(`Failed to post refund ${id} to ledger: ${(error as Error).message}`);
    }

    return result;
  }

  async void(tenantId: string, id: string, userId: string, dto: VoidRefundDto) {
    const refund = await this.findById(tenantId, id);

    if (refund.status !== 'processed') {
      throw new ConflictException('Only processed refunds can be voided');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Reverse the invoice balance changes
      for (const allocation of refund.allocations) {
        const invoice = await tx.invoice.findUnique({
          where: { id: allocation.invoiceId },
        });

        if (invoice) {
          const newAmountPaid = Number(invoice.amountPaid) + Number(allocation.allocatedAmount);
          const newBalanceDue = Number(invoice.netAmount) - newAmountPaid;

          let newStatus = invoice.status;
          if (newBalanceDue <= 0) {
            newStatus = 'paid';
          } else if (newAmountPaid > 0 && newBalanceDue > 0) {
            newStatus = 'partial';
          } else {
            newStatus = 'unpaid';
          }

          await tx.invoice.update({
            where: { id: allocation.invoiceId },
            data: {
              amountPaid: newAmountPaid,
              balanceDue: Math.max(0, newBalanceDue),
              status: newStatus,
            },
          });
        }
      }

      const updated = await tx.refund.update({
        where: { id },
        data: {
          status: 'voided',
          notes: `${refund.notes || ''}\n[Voided] ${dto.reason}`.trim(),
        },
        include: {
          allocations: { include: { invoice: true } },
          receipt: true,
          auditLogs: { orderBy: { performedAt: 'desc' } },
        },
      });

      await this.createAuditLog(tx, id, 'voided', userId, { reason: dto.reason });

      return updated;
    });

    // Reverse the refund in the patient ledger
    try {
      await this.ledgerService.reverseRefund(
        tenantId,
        {
          id: refund.id,
          patientId: refund.patientId,
          refundNumber: refund.refundNumber,
          amount: refund.amount,
          currency: refund.currency,
        },
        userId,
        dto.reason,
      );
    } catch (error) {
      this.logger.warn(`Failed to reverse refund ${id} in ledger: ${(error as Error).message}`);
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  async delete(tenantId: string, id: string) {
    const refund = await this.findById(tenantId, id);

    if (refund.status !== 'pending') {
      throw new ConflictException('Only pending refunds can be deleted');
    }

    return this.prisma.refund.delete({ where: { id } });
  }

  // ---------------------------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------------------------

  async getStatistics(
    tenantId: string,
    filters?: { patientId?: string; dateFrom?: Date; dateTo?: Date },
  ) {
    const where: any = { tenantId };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.refundDate = {};
      if (filters.dateFrom) {
        where.refundDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.refundDate.lte = filters.dateTo;
      }
    }

    const [total, byStatus, byMethod, amounts] = await Promise.all([
      this.prisma.refund.count({ where }),
      this.prisma.refund.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.refund.groupBy({
        by: ['refundMethod'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.refund.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      totalAmount: amounts._sum.amount || 0,
      byStatus: byStatus.reduce(
        (acc: Record<string, any>, item: any) => {
          acc[item.status] = {
            count: item._count,
            totalAmount: item._sum.amount || 0,
          };
          return acc;
        },
        {} as Record<string, any>,
      ),
      byMethod: byMethod.reduce(
        (acc: Record<string, any>, item: any) => {
          acc[item.refundMethod] = {
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
