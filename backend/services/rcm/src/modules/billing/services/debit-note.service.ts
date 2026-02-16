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
  CreateDebitNoteDto,
  UpdateDebitNoteDto,
  VoidDebitNoteDto,
  DebitNoteStatus,
} from '../dto/debit-note.dto';
import { PatientLedgerService } from './patient-ledger.service';

interface PatientDisplayDto {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
}

@Injectable()
export class DebitNoteService {
  private readonly logger = new Logger(DebitNoteService.name);
  private readonly foundationApiUrl =
    process.env.FOUNDATION_API_URL || 'http://localhost:3010/api/v1';
  private readonly clinicalApiUrl =
    process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => PatientLedgerService))
    private readonly ledgerService: PatientLedgerService,
  ) {}

  // ---------------------------------------------------------------------------
  // Patient Display Helpers
  // ---------------------------------------------------------------------------

  private buildPatientDisplay(patient: any): PatientDisplayDto {
    return {
      patientId: patient.id,
      mrn: patient.mrn || '',
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      displayName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
      phoneNumber: patient.phoneNumber || undefined,
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
      if (authHeader) headers['authorization'] = authHeader;
      if (facilityId) headers['x-facility-id'] = facilityId;
      if (userId) headers['x-user-id'] = userId;

      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalApiUrl}/patients/${patientId}`, { headers }),
      );
      return response?.data ? this.buildPatientDisplay(response.data) : null;
    } catch (error) {
      this.logger.warn(`Failed to fetch patient ${patientId}: ${(error as Error).message}`);
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

  private attachPatientDisplay(debitNote: any, displayMap: Map<string, PatientDisplayDto>) {
    return {
      ...debitNote,
      patientDisplay: displayMap.get(debitNote.patientId) ?? null,
    };
  }

  // ---------------------------------------------------------------------------
  // Config Helpers
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

  private async generateDebitNoteNumber(
    tenantId: string,
    authHeader?: string,
  ): Promise<string> {
    const [format, prefix, startNumber] = await Promise.all([
      this.fetchConfig(tenantId, 'finance.debit_note_number_format', authHeader),
      this.fetchConfig(tenantId, 'finance.debit_note_prefix', authHeader),
      this.fetchConfig(tenantId, 'finance.debit_note_start_number', authHeader),
    ]);

    const count = await this.prisma.debitNote.count({ where: { tenantId } });
    const resolvedFormat = typeof format === 'string' ? format : '{PREFIX}-{YEAR}-{SEQUENCE:6}';
    const resolvedPrefix = typeof prefix === 'string' ? prefix : 'DN';
    const resolvedStartNumber = typeof startNumber === 'number' ? startNumber : 1000;

    return this.formatDocumentNumber(resolvedFormat, resolvedPrefix, resolvedStartNumber, count);
  }

  async create(
    tenantId: string,
    dto: CreateDebitNoteDto,
    userId?: string,
    authHeader?: string,
    facilityId?: string,
  ) {
    if (dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const debitNoteNumber = await this.generateDebitNoteNumber(tenantId, authHeader);

    // Fetch patient info for denormalization
    const patientDisplay = await this.fetchPatientDisplay(
      dto.patientId,
      tenantId,
      authHeader,
      facilityId,
      userId,
    );

    return this.prisma.$transaction(async (tx) => {
      const debitNote = await tx.debitNote.create({
        data: {
          tenantId,
          patientId: dto.patientId,
          invoiceId: dto.invoiceId ?? null,
          debitNoteNumber,
          debitNoteDate: dto.debitNoteDate ?? new Date(),
          amount: dto.amount,
          currency: dto.currency ?? 'AED',
          reason: dto.reason ?? null,
          notes: dto.notes ?? null,
          status: DebitNoteStatus.DRAFT,
          createdBy: userId ?? null,
          mrn: patientDisplay?.mrn ?? null,
          patientDisplayName: patientDisplay?.displayName ?? null,
        },
      });

      if (dto.lines?.length) {
        await tx.debitNoteLine.createMany({
          data: dto.lines.map((line) => ({
            debitNoteId: debitNote.id,
            lineNumber: line.lineNumber,
            description: line.description ?? null,
            quantity: line.quantity ?? null,
            unitPrice: line.unitPrice ?? null,
            lineAmount: line.lineAmount,
          })),
        });
      }

      return tx.debitNote.findUnique({
        where: { id: debitNote.id },
        include: { lines: true, invoice: true },
      });
    });
  }

  async findAll(
    tenantId: string,
    filters?: { patientId?: string; invoiceId?: string; status?: DebitNoteStatus },
    authHeader?: string,
    facilityId?: string,
    userId?: string,
  ) {
    const where: any = { tenantId };
    if (filters?.patientId) where.patientId = filters.patientId;
    if (filters?.invoiceId) where.invoiceId = filters.invoiceId;
    if (filters?.status) where.status = filters.status;

    const debitNotes = await this.prisma.debitNote.findMany({
      where,
      include: { lines: true, invoice: true },
      orderBy: { debitNoteDate: 'desc' },
    });

    // Fetch patient display info for all debit notes
    const patientIds = debitNotes.map((dn) => dn.patientId);
    const displayMap = await this.fetchPatientDisplayMap(
      patientIds,
      tenantId,
      authHeader,
      facilityId,
      userId,
    );

    return debitNotes.map((dn) => this.attachPatientDisplay(dn, displayMap));
  }

  async findById(tenantId: string, id: string) {
    const debitNote = await this.prisma.debitNote.findFirst({
      where: { id, tenantId },
      include: { lines: true, invoice: true },
    });

    if (!debitNote) {
      throw new NotFoundException(`Debit note ${id} not found`);
    }

    return debitNote;
  }

  async update(tenantId: string, id: string, dto: UpdateDebitNoteDto) {
    const debitNote = await this.findById(tenantId, id);

    if (debitNote.status !== DebitNoteStatus.DRAFT) {
      throw new ConflictException('Only draft debit notes can be updated');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.debitNote.update({
        where: { id },
        data: {
          patientId: dto.patientId ?? debitNote.patientId,
          invoiceId: dto.invoiceId ?? debitNote.invoiceId,
          debitNoteDate: dto.debitNoteDate ?? debitNote.debitNoteDate,
          amount: dto.amount ?? debitNote.amount,
          currency: dto.currency ?? debitNote.currency,
          reason: dto.reason ?? debitNote.reason,
          notes: dto.notes ?? debitNote.notes,
        },
      });

      if (dto.lines) {
        await tx.debitNoteLine.deleteMany({ where: { debitNoteId: id } });
        if (dto.lines.length) {
          await tx.debitNoteLine.createMany({
            data: dto.lines.map((line) => ({
              debitNoteId: id,
              lineNumber: line.lineNumber,
              description: line.description ?? null,
              quantity: line.quantity ?? null,
              unitPrice: line.unitPrice ?? null,
              lineAmount: line.lineAmount,
            })),
          });
        }
      }

      return tx.debitNote.findUnique({
        where: { id: updated.id },
        include: { lines: true, invoice: true },
      });
    });
  }

  async post(tenantId: string, id: string, userId?: string) {
    const debitNote = await this.findById(tenantId, id);

    if (debitNote.status !== DebitNoteStatus.DRAFT) {
      throw new ConflictException('Only draft debit notes can be posted');
    }

    const updated = await this.prisma.debitNote.update({
      where: { id },
      data: {
        status: DebitNoteStatus.POSTED,
        postedBy: userId ?? null,
        postedAt: new Date(),
      },
      include: { lines: true, invoice: true },
    });

    try {
      await this.ledgerService.postDebitNote(
        tenantId,
        {
          id: updated.id,
          patientId: updated.patientId,
          debitNoteNumber: updated.debitNoteNumber,
          amount: updated.amount,
          currency: updated.currency,
          invoiceId: updated.invoiceId,
        },
        userId,
      );
    } catch (error) {
      this.logger.warn(`Failed to post debit note ${id} to ledger: ${(error as Error).message}`);
    }

    return updated;
  }

  async void(tenantId: string, id: string, userId: string, dto: VoidDebitNoteDto) {
    const debitNote = await this.findById(tenantId, id);

    if (debitNote.status !== DebitNoteStatus.POSTED) {
      throw new ConflictException('Only posted debit notes can be voided');
    }

    const updated = await this.prisma.debitNote.update({
      where: { id },
      data: {
        status: DebitNoteStatus.VOIDED,
        voidedBy: userId,
        voidedAt: new Date(),
        voidReason: dto.reason,
      },
      include: { lines: true, invoice: true },
    });

    try {
      await this.ledgerService.reverseDebitNote(
        tenantId,
        {
          id: updated.id,
          patientId: updated.patientId,
          debitNoteNumber: updated.debitNoteNumber,
          amount: updated.amount,
          currency: updated.currency,
          invoiceId: updated.invoiceId,
        },
        userId,
        dto.reason,
      );
    } catch (error) {
      this.logger.warn(`Failed to reverse debit note ${id} in ledger: ${(error as Error).message}`);
    }

    return updated;
  }

  async delete(tenantId: string, id: string) {
    const debitNote = await this.findById(tenantId, id);

    if (debitNote.status !== DebitNoteStatus.DRAFT) {
      throw new ConflictException('Only draft debit notes can be deleted');
    }

    await this.prisma.debitNoteLine.deleteMany({ where: { debitNoteId: id } });
    return this.prisma.debitNote.delete({ where: { id } });
  }
}
