import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { Prisma } from '@zeal/database-rcm/generated';
import {
  CreateLedgerEntryDto,
  LedgerFiltersDto,
  ReverseEntryDto,
  CreateAdjustmentDto,
  CreateOpeningBalanceDto,
  LedgerEntryType,
  LedgerEntryStatus,
  AdjustmentType,
  PatientLedgerEntryResponseDto,
  PatientBalanceSummaryDto,
  PatientLedgerListResponseDto,
} from '../dto/patient-ledger.dto';

@Injectable()
export class PatientLedgerService {
  private readonly logger = new Logger(PatientLedgerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Core Ledger Operations
  // ---------------------------------------------------------------------------

  /**
   * Create a ledger entry and update the patient balance.
   */
  async createEntry(
    tenantId: string,
    dto: CreateLedgerEntryDto,
    userId?: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.patientLedgerEntry.create({
        data: {
          tenantId,
          patientId: dto.patientId,
          postingDate: dto.postingDate ?? new Date(),
          currency: dto.currency ?? 'AED',
          debitAmount: dto.debitAmount ?? 0,
          creditAmount: dto.creditAmount ?? 0,
          entryType: dto.entryType,
          sourceType: dto.sourceType,
          sourceId: dto.sourceId,
          sourceNumber: dto.sourceNumber,
          encounterId: dto.encounterId ?? null,
          invoiceId: dto.invoiceId ?? null,
          receiptId: dto.receiptId ?? null,
          refundId: dto.refundId ?? null,
          description: dto.description ?? null,
          notes: dto.notes ?? null,
          status: dto.status ?? LedgerEntryStatus.POSTED,
          reversalOfEntryId: dto.reversalOfEntryId ?? null,
          createdBy: userId ?? null,
          postedAt: dto.status === LedgerEntryStatus.POSTED ? new Date() : null,
          postedBy: dto.status === LedgerEntryStatus.POSTED ? userId ?? null : null,
        },
      });

      // Update patient balance if entry is posted
      if (entry.status === LedgerEntryStatus.POSTED) {
        await this.updatePatientBalance(
          tx,
          tenantId,
          dto.patientId,
          dto.currency ?? 'AED',
          Number(dto.debitAmount ?? 0),
          Number(dto.creditAmount ?? 0),
          entry.id,
          entry.entryTime,
        );
      }

      return this.mapEntryToResponse(entry);
    });
  }

  /**
   * Post a draft entry.
   */
  async postEntry(
    tenantId: string,
    id: string,
    userId: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    const entry = await this.findEntryById(tenantId, id);

    if (entry.status !== LedgerEntryStatus.DRAFT) {
      throw new ConflictException('Only draft entries can be posted');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.patientLedgerEntry.update({
        where: { id },
        data: {
          status: LedgerEntryStatus.POSTED,
          postedAt: new Date(),
          postedBy: userId,
        },
      });

      await this.updatePatientBalance(
        tx,
        tenantId,
        updated.patientId,
        updated.currency,
        Number(updated.debitAmount),
        Number(updated.creditAmount),
        updated.id,
        updated.entryTime,
      );

      return this.mapEntryToResponse(updated);
    });
  }

  /**
   * Reverse a posted entry by creating an opposite entry.
   */
  async reverseEntry(
    tenantId: string,
    id: string,
    userId: string,
    dto: ReverseEntryDto,
  ): Promise<PatientLedgerEntryResponseDto> {
    const entry = await this.findEntryById(tenantId, id);

    if (entry.status !== LedgerEntryStatus.POSTED) {
      throw new ConflictException('Only posted entries can be reversed');
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark original entry as reversed
      await tx.patientLedgerEntry.update({
        where: { id },
        data: { status: LedgerEntryStatus.REVERSED },
      });

      // Create reversal entry (swap debit/credit)
      const reversalEntry = await tx.patientLedgerEntry.create({
        data: {
          tenantId,
          patientId: entry.patientId,
          postingDate: new Date(),
          currency: entry.currency,
          debitAmount: entry.creditAmount, // Swap
          creditAmount: entry.debitAmount, // Swap
          entryType: entry.entryType,
          sourceType: entry.sourceType,
          sourceId: entry.sourceId,
          sourceNumber: entry.sourceNumber,
          encounterId: entry.encounterId,
          invoiceId: entry.invoiceId,
          receiptId: entry.receiptId,
          refundId: entry.refundId,
          description: `Reversal: ${dto.reason}`,
          notes: `Reversal of entry ${id}`,
          status: LedgerEntryStatus.POSTED,
          reversalOfEntryId: id,
          createdBy: userId,
          postedAt: new Date(),
          postedBy: userId,
        },
      });

      // Update patient balance (reversal = opposite amounts)
      await this.updatePatientBalance(
        tx,
        tenantId,
        entry.patientId,
        entry.currency,
        Number(entry.creditAmount), // Swapped
        Number(entry.debitAmount), // Swapped
        reversalEntry.id,
        reversalEntry.entryTime,
      );

      return this.mapEntryToResponse(reversalEntry);
    });
  }

  /**
   * Get patient ledger with running balance.
   */
  async getPatientLedger(
    tenantId: string,
    patientId: string,
    filters?: LedgerFiltersDto,
  ): Promise<PatientLedgerListResponseDto> {
    const where: Prisma.PatientLedgerEntryWhereInput = {
      tenantId,
      patientId,
    };

    if (filters?.dateFrom || filters?.dateTo) {
      where.postingDate = {};
      if (filters.dateFrom) {
        where.postingDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.postingDate.lte = filters.dateTo;
      }
    }

    if (filters?.entryType) {
      where.entryType = filters.entryType;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const entries = await this.prisma.patientLedgerEntry.findMany({
      where,
      orderBy: [{ entryTime: 'asc' }],
    });

    // Calculate running balance
    let runningBalance = 0;
    const entriesWithBalance = entries.map((entry) => {
      runningBalance += Number(entry.debitAmount) - Number(entry.creditAmount);
      return {
        ...this.mapEntryToResponse(entry),
        runningBalance,
      };
    });

    // Get summary
    const summary = await this.getPatientBalanceSummary(tenantId, patientId);

    return {
      entries: entriesWithBalance,
      summary,
    };
  }

  /**
   * Get patient balance summary.
   * If currency is not specified, returns the first available balance (or aggregates all).
   */
  async getPatientBalanceSummary(
    tenantId: string,
    patientId: string,
    currency?: string,
  ): Promise<PatientBalanceSummaryDto | null> {
    if (currency) {
      // Query specific currency
      const balance = await this.prisma.patientBalance.findUnique({
        where: {
          tenantId_patientId_currency: {
            tenantId,
            patientId,
            currency,
          },
        },
      });

      if (!balance) {
        return null;
      }

      return {
        patientId: balance.patientId,
        currency: balance.currency,
        balance: Number(balance.balance),
        totalDebits: Number(balance.totalDebits),
        totalCredits: Number(balance.totalCredits),
        lastLedgerEntryId: balance.lastLedgerEntryId,
        lastLedgerEntryTime: balance.lastLedgerEntryTime,
        updatedAt: balance.updatedAt,
      };
    }

    // No currency specified - get the most recently updated balance
    const primary = await this.prisma.patientBalance.findFirst({
      where: {
        tenantId,
        patientId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!primary) {
      return null;
    }

    return {
      patientId: primary.patientId,
      currency: primary.currency,
      balance: Number(primary.balance),
      totalDebits: Number(primary.totalDebits),
      totalCredits: Number(primary.totalCredits),
      lastLedgerEntryId: primary.lastLedgerEntryId,
      lastLedgerEntryTime: primary.lastLedgerEntryTime,
      updatedAt: primary.updatedAt,
    };
  }

  /**
   * Get a single ledger entry by ID.
   */
  async findEntryById(tenantId: string, id: string) {
    const entry = await this.prisma.patientLedgerEntry.findFirst({
      where: { id, tenantId },
    });

    if (!entry) {
      throw new NotFoundException(`Ledger entry with ID ${id} not found`);
    }

    return entry;
  }

  // ---------------------------------------------------------------------------
  // Adjustment Operations
  // ---------------------------------------------------------------------------

  /**
   * Create an adjustment entry (credit or debit).
   */
  async createAdjustment(
    tenantId: string,
    dto: CreateAdjustmentDto,
    userId: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    const adjustmentNumber = await this.generateAdjustmentNumber(tenantId);

    const debitAmount = dto.adjustmentType === AdjustmentType.DEBIT ? dto.amount : 0;
    const creditAmount = dto.adjustmentType === AdjustmentType.CREDIT ? dto.amount : 0;

    const entryDto: CreateLedgerEntryDto = {
      patientId: dto.patientId,
      currency: dto.currency ?? 'AED',
      debitAmount,
      creditAmount,
      entryType: LedgerEntryType.ADJUSTMENT,
      sourceType: 'adjustment',
      sourceId: crypto.randomUUID(),
      sourceNumber: adjustmentNumber,
      description: dto.reason,
      status: LedgerEntryStatus.POSTED,
    };
    if (dto.postingDate) entryDto.postingDate = dto.postingDate;
    if (dto.notes) entryDto.notes = dto.notes;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Create an opening balance entry.
   */
  async createOpeningBalance(
    tenantId: string,
    dto: CreateOpeningBalanceDto,
    userId: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    // Check if opening balance already exists
    const existing = await this.prisma.patientLedgerEntry.findFirst({
      where: {
        tenantId,
        patientId: dto.patientId,
        entryType: LedgerEntryType.OPENING_BALANCE,
        status: LedgerEntryStatus.POSTED,
      },
    });

    if (existing) {
      throw new ConflictException('Opening balance already exists for this patient');
    }

    const openingNumber = `OB-${Date.now()}`;
    const debitAmount = dto.amount > 0 ? dto.amount : 0;
    const creditAmount = dto.amount < 0 ? Math.abs(dto.amount) : 0;

    const entryDto: CreateLedgerEntryDto = {
      patientId: dto.patientId,
      currency: dto.currency ?? 'AED',
      debitAmount,
      creditAmount,
      entryType: LedgerEntryType.OPENING_BALANCE,
      sourceType: 'opening_balance',
      sourceId: crypto.randomUUID(),
      sourceNumber: openingNumber,
      description: dto.description ?? 'Opening balance',
      status: LedgerEntryStatus.POSTED,
    };
    if (dto.postingDate) entryDto.postingDate = dto.postingDate;

    return this.createEntry(tenantId, entryDto, userId);
  }

  // ---------------------------------------------------------------------------
  // Integration Methods (called by other services)
  // ---------------------------------------------------------------------------

  /**
   * Post an invoice to the ledger (debit entry).
   */
  async postInvoice(
    tenantId: string,
    invoice: {
      id: string;
      patientId: string;
      invoiceNumber: string;
      netAmount: number | Prisma.Decimal;
      currency: string;
      encounterId?: string | null;
    },
    userId?: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    const entryDto: CreateLedgerEntryDto = {
      patientId: invoice.patientId,
      debitAmount: Number(invoice.netAmount),
      creditAmount: 0,
      entryType: LedgerEntryType.INVOICE,
      sourceType: 'invoice',
      sourceId: invoice.id,
      sourceNumber: invoice.invoiceNumber,
      invoiceId: invoice.id,
      currency: invoice.currency,
      description: `Invoice ${invoice.invoiceNumber}`,
      status: LedgerEntryStatus.POSTED,
    };
    if (invoice.encounterId) entryDto.encounterId = invoice.encounterId;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Reverse an invoice in the ledger (credit reversal).
   */
  async reverseInvoice(
    tenantId: string,
    invoice: {
      id: string;
      patientId: string;
      invoiceNumber: string;
      netAmount: number | Prisma.Decimal;
      currency: string;
      encounterId?: string | null;
    },
    userId?: string,
    reason: string = 'Invoice cancelled',
  ): Promise<PatientLedgerEntryResponseDto> {
    const entryDto: CreateLedgerEntryDto = {
      patientId: invoice.patientId,
      debitAmount: 0,
      creditAmount: Number(invoice.netAmount),
      entryType: LedgerEntryType.INVOICE,
      sourceType: 'invoice',
      sourceId: invoice.id,
      sourceNumber: invoice.invoiceNumber,
      invoiceId: invoice.id,
      currency: invoice.currency,
      description: `Invoice cancelled: ${reason}`,
      status: LedgerEntryStatus.POSTED,
    };
    if (invoice.encounterId) entryDto.encounterId = invoice.encounterId;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Post a receipt to the ledger (credit entry).
   */
  async postReceipt(
    tenantId: string,
    receipt: {
      id: string;
      patientId: string;
      receiptNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
    },
    userId?: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    return this.createEntry(
      tenantId,
      {
        patientId: receipt.patientId,
        debitAmount: 0,
        creditAmount: Number(receipt.amount),
        entryType: LedgerEntryType.RECEIPT,
        sourceType: 'receipt',
        sourceId: receipt.id,
        sourceNumber: receipt.receiptNumber,
        receiptId: receipt.id,
        currency: receipt.currency,
        description: `Receipt ${receipt.receiptNumber}`,
        status: LedgerEntryStatus.POSTED,
      },
      userId,
    );
  }

  /**
   * Reverse a receipt in the ledger (debit reversal).
   */
  async reverseReceipt(
    tenantId: string,
    receipt: {
      id: string;
      patientId: string;
      receiptNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
    },
    userId?: string,
    reason: string = 'Receipt voided',
  ): Promise<PatientLedgerEntryResponseDto> {
    return this.createEntry(
      tenantId,
      {
        patientId: receipt.patientId,
        debitAmount: Number(receipt.amount),
        creditAmount: 0,
        entryType: LedgerEntryType.RECEIPT,
        sourceType: 'receipt',
        sourceId: receipt.id,
        sourceNumber: receipt.receiptNumber,
        receiptId: receipt.id,
        currency: receipt.currency,
        description: `Receipt voided: ${reason}`,
        status: LedgerEntryStatus.POSTED,
      },
      userId,
    );
  }

  /**
   * Post a refund to the ledger (debit entry - money returned).
   */
  async postRefund(
    tenantId: string,
    refund: {
      id: string;
      patientId: string;
      refundNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
    },
    userId?: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    return this.createEntry(
      tenantId,
      {
        patientId: refund.patientId,
        debitAmount: Number(refund.amount),
        creditAmount: 0,
        entryType: LedgerEntryType.REFUND,
        sourceType: 'refund',
        sourceId: refund.id,
        sourceNumber: refund.refundNumber,
        refundId: refund.id,
        currency: refund.currency,
        description: `Refund ${refund.refundNumber}`,
        status: LedgerEntryStatus.POSTED,
      },
      userId,
    );
  }

  /**
   * Post a credit note to the ledger (credit entry).
   */
  async postCreditNote(
    tenantId: string,
    creditNote: {
      id: string;
      patientId: string;
      creditNoteNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
      invoiceId?: string | null;
    },
    userId?: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    const entryDto: CreateLedgerEntryDto = {
      patientId: creditNote.patientId,
      debitAmount: 0,
      creditAmount: Number(creditNote.amount),
      entryType: LedgerEntryType.CREDIT_NOTE,
      sourceType: 'credit_note',
      sourceId: creditNote.id,
      sourceNumber: creditNote.creditNoteNumber,
      creditNoteId: creditNote.id,
      currency: creditNote.currency,
      description: `Credit note ${creditNote.creditNoteNumber}`,
      status: LedgerEntryStatus.POSTED,
    };
    if (creditNote.invoiceId) entryDto.invoiceId = creditNote.invoiceId;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Reverse a credit note in the ledger (debit reversal).
   */
  async reverseCreditNote(
    tenantId: string,
    creditNote: {
      id: string;
      patientId: string;
      creditNoteNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
      invoiceId?: string | null;
    },
    userId?: string,
    reason: string = 'Credit note voided',
  ): Promise<PatientLedgerEntryResponseDto> {
    const entryDto: CreateLedgerEntryDto = {
      patientId: creditNote.patientId,
      debitAmount: Number(creditNote.amount),
      creditAmount: 0,
      entryType: LedgerEntryType.CREDIT_NOTE,
      sourceType: 'credit_note',
      sourceId: creditNote.id,
      sourceNumber: creditNote.creditNoteNumber,
      creditNoteId: creditNote.id,
      currency: creditNote.currency,
      description: `Credit note voided: ${reason}`,
      status: LedgerEntryStatus.POSTED,
    };
    if (creditNote.invoiceId) entryDto.invoiceId = creditNote.invoiceId;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Post a debit note to the ledger (debit entry).
   */
  async postDebitNote(
    tenantId: string,
    debitNote: {
      id: string;
      patientId: string;
      debitNoteNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
      invoiceId?: string | null;
    },
    userId?: string,
  ): Promise<PatientLedgerEntryResponseDto> {
    const entryDto: CreateLedgerEntryDto = {
      patientId: debitNote.patientId,
      debitAmount: Number(debitNote.amount),
      creditAmount: 0,
      entryType: LedgerEntryType.DEBIT_NOTE,
      sourceType: 'debit_note',
      sourceId: debitNote.id,
      sourceNumber: debitNote.debitNoteNumber,
      debitNoteId: debitNote.id,
      currency: debitNote.currency,
      description: `Debit note ${debitNote.debitNoteNumber}`,
      status: LedgerEntryStatus.POSTED,
    };
    if (debitNote.invoiceId) entryDto.invoiceId = debitNote.invoiceId;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Reverse a debit note in the ledger (credit reversal).
   */
  async reverseDebitNote(
    tenantId: string,
    debitNote: {
      id: string;
      patientId: string;
      debitNoteNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
      invoiceId?: string | null;
    },
    userId?: string,
    reason: string = 'Debit note voided',
  ): Promise<PatientLedgerEntryResponseDto> {
    const entryDto: CreateLedgerEntryDto = {
      patientId: debitNote.patientId,
      debitAmount: 0,
      creditAmount: Number(debitNote.amount),
      entryType: LedgerEntryType.DEBIT_NOTE,
      sourceType: 'debit_note',
      sourceId: debitNote.id,
      sourceNumber: debitNote.debitNoteNumber,
      debitNoteId: debitNote.id,
      currency: debitNote.currency,
      description: `Debit note voided: ${reason}`,
      status: LedgerEntryStatus.POSTED,
    };
    if (debitNote.invoiceId) entryDto.invoiceId = debitNote.invoiceId;

    return this.createEntry(tenantId, entryDto, userId);
  }

  /**
   * Reverse a refund in the ledger (credit reversal).
   */
  async reverseRefund(
    tenantId: string,
    refund: {
      id: string;
      patientId: string;
      refundNumber: string;
      amount: number | Prisma.Decimal;
      currency: string;
    },
    userId?: string,
    reason: string = 'Refund voided',
  ): Promise<PatientLedgerEntryResponseDto> {
    return this.createEntry(
      tenantId,
      {
        patientId: refund.patientId,
        debitAmount: 0,
        creditAmount: Number(refund.amount),
        entryType: LedgerEntryType.REFUND,
        sourceType: 'refund',
        sourceId: refund.id,
        sourceNumber: refund.refundNumber,
        refundId: refund.id,
        currency: refund.currency,
        description: `Refund voided: ${reason}`,
        status: LedgerEntryStatus.POSTED,
      },
      userId,
    );
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  /**
   * Update or create patient balance.
   */
  private async updatePatientBalance(
    tx: Prisma.TransactionClient,
    tenantId: string,
    patientId: string,
    currency: string,
    debitAmount: number,
    creditAmount: number,
    entryId: string,
    entryTime: Date,
  ): Promise<void> {
    const netChange = debitAmount - creditAmount;

    await tx.patientBalance.upsert({
      where: {
        tenantId_patientId_currency: {
          tenantId,
          patientId,
          currency,
        },
      },
      create: {
        tenantId,
        patientId,
        currency,
        balance: netChange,
        totalDebits: debitAmount,
        totalCredits: creditAmount,
        lastLedgerEntryId: entryId,
        lastLedgerEntryTime: entryTime,
      },
      update: {
        balance: { increment: netChange },
        totalDebits: { increment: debitAmount },
        totalCredits: { increment: creditAmount },
        lastLedgerEntryId: entryId,
        lastLedgerEntryTime: entryTime,
      },
    });
  }

  private async generateAdjustmentNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.patientLedgerEntry.count({
      where: {
        tenantId,
        entryType: LedgerEntryType.ADJUSTMENT,
      },
    });
    const year = new Date().getFullYear();
    const sequence = (count + 1).toString().padStart(6, '0');
    return `ADJ-${year}-${sequence}`;
  }

  private mapEntryToResponse(entry: any): PatientLedgerEntryResponseDto {
    return {
      id: entry.id,
      tenantId: entry.tenantId,
      patientId: entry.patientId,
      entryTime: entry.entryTime,
      postingDate: entry.postingDate,
      currency: entry.currency,
      debitAmount: Number(entry.debitAmount),
      creditAmount: Number(entry.creditAmount),
      entryType: entry.entryType as LedgerEntryType,
      sourceType: entry.sourceType,
      sourceId: entry.sourceId,
      sourceNumber: entry.sourceNumber,
      encounterId: entry.encounterId,
      invoiceId: entry.invoiceId,
      receiptId: entry.receiptId,
      refundId: entry.refundId,
      creditNoteId: entry.creditNoteId,
      debitNoteId: entry.debitNoteId,
      description: entry.description,
      notes: entry.notes,
      status: entry.status as LedgerEntryStatus,
      reversalOfEntryId: entry.reversalOfEntryId,
      createdAt: entry.createdAt,
      createdBy: entry.createdBy,
      postedAt: entry.postedAt,
      postedBy: entry.postedBy,
    };
  }
}
