import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';
import { Decimal } from '@prisma/client/runtime/library';
import { firstValueFrom } from 'rxjs';
import {
  CreateDispensingDto,
  VerifyDispensingDto,
  ExecuteDispenseDto,
  DispatchToWardDto,
  CancelDispensingDto,
  ReturnDispensingDto,
  DispensingFiltersDto,
  DispensingStatus,
  DispensingChannel,
  DispensingSource,
} from '../dto/pharmacy-dispensing.dto';
import { PharmacyStockService } from './pharmacy-stock.service';
import { PharmacyChargeService } from './pharmacy-charge.service';

@Injectable()
export class PharmacyDispensingService {
  private readonly logger = new Logger(PharmacyDispensingService.name);
  private readonly clinicalServiceUrl = process.env.CLINICAL_SERVICE_URL ?? 'http://localhost:3011/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly stockService: PharmacyStockService,
    private readonly chargeService: PharmacyChargeService,
  ) {}

  async create(tenantId: string, dto: CreateDispensingDto, userId: string, authHeader: string) {
    const useHeader = !!dto.prescriptionId;
    const isDigital = useHeader || !!dto.prescriptionOrderId;

    // ── Digital prescription path ──────────────────────────────────────────────
    if (isDigital) {
      // Guard against duplicate dispensing for the same prescription
      const existing = await this.prisma.pharmacyDispensing.findFirst({
        where: {
          tenantId,
          ...(useHeader && dto.prescriptionId
            ? { prescriptionId: dto.prescriptionId }
            : dto.prescriptionOrderId
              ? { prescriptionOrderId: dto.prescriptionOrderId }
              : {}),
          status: { notIn: [DispensingStatus.CANCELLED, DispensingStatus.RETURNED] },
        },
      });
      if (existing) {
        throw new ConflictException(
          `A dispensing record already exists for this prescription (${existing.dispensingNumber})`,
        );
      }

      // Fetch prescription data from Clinical API
      const prescription = useHeader
        ? await this.fetchPrescriptionHeader(tenantId, dto.prescriptionId!, authHeader)
        : await this.fetchPrescription(tenantId, dto.prescriptionOrderId!, authHeader);

      if (!prescription || prescription.status !== 'active') {
        throw new BadRequestException(
          `Prescription is not active (status: ${prescription?.status ?? 'unknown'})`,
        );
      }

      // Resolve encounter ID (from DTO or from prescription header)
      const encounterId = dto.encounterId ?? prescription.encounterId ?? null;

      // Fetch encounter for inpatient ward routing (patient data already in prescription header)
      const encounter = encounterId
        ? await this.fetchEncounter(tenantId, encounterId, authHeader)
        : null;

      const encounterType = prescription.encounterType ?? encounter?.encounterType ?? 'outpatient';

      let dispensingChannel = dto.dispensingChannel ?? DispensingChannel.OUTPATIENT_COUNTER;
      if (encounterType === 'inpatient' && !dto.dispensingChannel) {
        dispensingChannel = DispensingChannel.INPATIENT_WARD;
      }

      let wardId: string | null = null;
      let wardName: string | null = null;
      let bedNumber: string | null = null;
      if (encounterType === 'inpatient' && encounterId) {
        const admission = await this.fetchInpatientAdmission(tenantId, encounterId, authHeader);
        wardId = admission?.currentWardId ?? null;
        wardName = admission?.currentWardName ?? null;
        bedNumber = admission?.currentBedNumber ?? null;
      }

      // Stock availability check (for header: check first drug; for single order: check its drug)
      const firstDrugCode = useHeader
        ? (prescription.items?.[0]?.drugCode ?? null)
        : prescription.drugCode ?? null;
      if (firstDrugCode) {
        const availability = await this.stockService.suggestStockForDrug(tenantId, firstDrugCode, 1);
        if (!availability.canFulfill) {
          this.logger.warn(`Insufficient stock for ${firstDrugCode}. Creating queued record anyway.`);
        }
      }

      const dispensingNumber = await this.generateDispensingNumber(tenantId);
      const dispensing = await this.prisma.pharmacyDispensing.create({
        data: {
          tenantId,
          dispensingNumber,
          patientId: dto.patientId,
          encounterId,
          prescriptionId: useHeader ? dto.prescriptionId! : null,
          prescriptionOrderId: useHeader ? null : (dto.prescriptionOrderId ?? null),
          dispensingSource: dto.dispensingSource ?? DispensingSource.DIGITAL_PRESCRIPTION,
          patientDisplayName: prescription.patientDisplayName ?? null,
          mrn: prescription.mrn ?? null,
          patientDateOfBirth: prescription.dateOfBirth ? new Date(prescription.dateOfBirth) : null,
          patientGender: prescription.gender ?? null,
          encounterType,
          encounterNumber: prescription.encounterNumber ?? encounter?.encounterNumber ?? null,
          prescribedByName: prescription.prescribedByName ?? null,
          status: DispensingStatus.QUEUED,
          dispensingChannel,
          wardId,
          wardName,
          bedNumber,
          createdBy: userId,
        },
      });
      return this.findById(tenantId, dispensing.id);
    }

    // ── OTC / Paper prescription path ─────────────────────────────────────────
    const source = dto.dispensingSource ?? DispensingSource.OTC;
    const dispensingChannel =
      dto.dispensingChannel ??
      (source === DispensingSource.PAPER_WARD
        ? DispensingChannel.INPATIENT_WARD
        : DispensingChannel.OUTPATIENT_COUNTER);

    const dispensingNumber = await this.generateDispensingNumber(tenantId);
    const dispensing = await this.prisma.pharmacyDispensing.create({
      data: {
        tenantId,
        dispensingNumber,
        patientId: dto.patientId,
        encounterId: null,
        prescriptionOrderId: null,
        dispensingSource: source,
        paperPrescriptionRef: dto.paperPrescriptionRef ?? null,
        patientDisplayName: dto.patientDisplayName ?? null,
        mrn: dto.mrn ?? null,
        encounterType: source === DispensingSource.PAPER_WARD ? 'inpatient' : 'outpatient',
        encounterNumber: null,
        prescribedByName: null,
        status: DispensingStatus.QUEUED,
        dispensingChannel,
        createdBy: userId,
      },
    });
    return this.findById(tenantId, dispensing.id);
  }

  async findAll(tenantId: string, filters: DispensingFiltersDto) {
    const where: any = { tenantId };

    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.encounterId) where.encounterId = filters.encounterId;
    if (filters.status) where.status = filters.status;
    if (filters.dispensingChannel) where.dispensingChannel = filters.dispensingChannel;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    return this.prisma.pharmacyDispensing.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    const dispensing = await this.prisma.pharmacyDispensing.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });

    if (!dispensing) {
      throw new NotFoundException(`Dispensing record ${id} not found`);
    }

    return dispensing;
  }

  async verify(tenantId: string, id: string, dto: VerifyDispensingDto, userId: string, authHeader: string) {
    const dispensing = await this.findById(tenantId, id);

    if (dispensing.status !== DispensingStatus.QUEUED) {
      throw new BadRequestException(`Cannot verify dispensing in status: ${dispensing.status}`);
    }

    // Confirm prescription is still active
    const prescription = dispensing.prescriptionOrderId
      ? await this.fetchPrescription(tenantId, dispensing.prescriptionOrderId, authHeader)
      : null;
    if (prescription && prescription.status !== 'active') {
      throw new BadRequestException(`Prescription is no longer active (status: ${prescription.status})`);
    }

    return this.prisma.pharmacyDispensing.update({
      where: { id },
      data: {
        status: DispensingStatus.VERIFIED,
        verifiedBy: userId,
        verifiedAt: new Date(),
        verificationNotes: dto.verificationNotes ?? null,
      },
      include: { items: true },
    });
  }

  async dispense(tenantId: string, id: string, dto: ExecuteDispenseDto, userId: string) {
    const dispensing = await this.findById(tenantId, id);

    if (dispensing.status !== DispensingStatus.VERIFIED) {
      throw new BadRequestException(`Cannot dispense in status: ${dispensing.status}. Verify first.`);
    }

    if (!dto.items.length) {
      throw new BadRequestException('At least one item must be dispensed');
    }

    const dispensedAt = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      // Create dispensing items and deduct stock
      const createdItems = [];
      for (const item of dto.items) {
        const stock = await tx.pharmacyStock.findFirst({
          where: { id: item.stockId, tenantId },
        });

        if (!stock) {
          throw new NotFoundException(`Stock ${item.stockId} not found`);
        }

        const qtyDispensed = new Decimal(item.quantityDispensed);

        // Deduct stock (also creates movement record)
        await this.stockService.deductStock(tx as any, tenantId, item.stockId, qtyDispensed, id, userId);

        // Get unit price from stock's billing item
        let unitPrice: Decimal | null = null;
        if (stock.billingItemId) {
          const billingItem = await tx.billingItem.findFirst({
            where: { id: stock.billingItemId },
            select: { listPrice: true },
          });
          unitPrice = billingItem?.listPrice ?? null;
        }

        const lineAmount = unitPrice ? unitPrice.times(qtyDispensed) : null;

        const dispensingItem = await tx.pharmacyDispensingItem.create({
          data: {
            tenantId,
            dispensingId: id,
            stockId: item.stockId,
            prescriptionOrderId: item.prescriptionOrderId ?? null,
            drugCode: stock.drugCode,
            drugName: stock.drugName,
            dosageForm: stock.dosageForm,
            strength: stock.strength ?? '',
            batchNumber: stock.batchNumber,
            expiryDate: stock.expiryDate,
            quantityPrescribed: qtyDispensed, // Will be updated if we had prescription qty
            quantityDispensed: qtyDispensed,
            unit: stock.unit,
            dispensingInstructions: item.dispensingInstructions ?? null,
            unitPrice,
            lineAmount,
            isSubstituted: item.isSubstituted ?? false,
            substitutionReason: item.substitutionReason ?? null,
            originalDrugCode: item.originalDrugCode ?? null,
          },
        });

        createdItems.push({ ...dispensingItem, stock });
      }

      // Update dispensing status
      const updated = await tx.pharmacyDispensing.update({
        where: { id },
        data: {
          status: DispensingStatus.DISPENSED,
          dispensedBy: userId,
          dispensedAt,
          counsellingProvided: dto.counsellingProvided ?? false,
          counsellingNotes: dto.counsellingNotes ?? null,
        },
        include: { items: true },
      });

      return { updated, items: createdItems };
    });

    // Post charge after successful dispense (outside transaction so dispense is not rolled back on charge failure)
    const chargeItems = result.items.map((i) => ({
      drugCode: i.drugCode,
      drugName: i.drugName,
      quantityDispensed: i.quantityDispensed,
      unitPrice: i.unitPrice,
      lineAmount: i.lineAmount,
      stockId: i.stockId,
    }));

    const chargeId = await this.chargeService.postDispensingCharge(
      tenantId,
      id,
      dispensing.patientId,
      dispensing.encounterId ?? dispensing.patientId,
      dispensedAt,
      chargeItems,
    );

    if (chargeId) {
      await this.prisma.pharmacyDispensing.update({
        where: { id },
        data: { chargeId, chargePosted: true, chargePostedAt: new Date() },
      });
    }

    return this.findById(tenantId, id);
  }

  async dispatchToWard(tenantId: string, id: string, dto: DispatchToWardDto, userId: string) {
    const dispensing = await this.findById(tenantId, id);

    if (dispensing.status !== DispensingStatus.DISPENSED) {
      throw new BadRequestException('Only dispensed records can be dispatched to ward');
    }

    if (dispensing.encounterType !== 'inpatient') {
      throw new BadRequestException('Ward dispatch is only for inpatient dispensings');
    }

    if (dispensing.dispatchedToWardAt) {
      throw new BadRequestException('This dispensing has already been dispatched to the ward');
    }

    return this.prisma.pharmacyDispensing.update({
      where: { id },
      data: {
        dispensingChannel: DispensingChannel.INPATIENT_WARD,
        wardId: dto.wardId,
        wardName: dto.wardName,
        bedNumber: dto.bedNumber ?? null,
        dispatchedToWardAt: new Date(),
      },
      include: { items: true },
    });
  }

  async wardReceive(tenantId: string, id: string, userId: string) {
    const dispensing = await this.findById(tenantId, id);

    if (dispensing.status !== DispensingStatus.DISPENSED) {
      throw new BadRequestException('Only dispensed records can be confirmed as received on ward');
    }

    if (!dispensing.dispatchedToWardAt) {
      throw new BadRequestException('Dispensing has not been dispatched to ward yet');
    }

    if (dispensing.wardReceivedAt) {
      throw new BadRequestException('Ward receipt already confirmed');
    }

    return this.prisma.pharmacyDispensing.update({
      where: { id },
      data: { wardReceivedBy: userId, wardReceivedAt: new Date() },
      include: { items: true },
    });
  }

  async cancel(tenantId: string, id: string, dto: CancelDispensingDto, userId: string) {
    const dispensing = await this.findById(tenantId, id);

    const cancellableStatuses = [DispensingStatus.QUEUED, DispensingStatus.VERIFIED];
    if (!cancellableStatuses.includes(dispensing.status as DispensingStatus)) {
      throw new BadRequestException(
        `Cannot cancel dispensing in status: ${dispensing.status}. Only queued or verified records can be cancelled.`,
      );
    }

    return this.prisma.pharmacyDispensing.update({
      where: { id },
      data: {
        status: DispensingStatus.CANCELLED,
        cancelledBy: userId,
        cancelledAt: new Date(),
        cancellationReason: dto.reason,
      },
      include: { items: true },
    });
  }

  async processReturn(tenantId: string, id: string, dto: ReturnDispensingDto, userId: string) {
    const dispensing = await this.findById(tenantId, id);

    if (dispensing.status !== DispensingStatus.DISPENSED) {
      throw new BadRequestException('Only dispensed records can be returned');
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        await this.stockService.returnStock(
          tx as any,
          tenantId,
          item.stockId,
          new Decimal(item.quantityReturned),
          id,
          item.reason,
          userId,
        );
      }

      await tx.pharmacyDispensing.update({
        where: { id },
        data: { status: DispensingStatus.RETURNED },
      });
    });

    return this.findById(tenantId, id);
  }

  private async generateDispensingNumber(tenantId: string): Promise<string> {
    const today = new Date();
    const prefix = `DISP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;

    const last = await this.prisma.pharmacyDispensing.findFirst({
      where: { tenantId, dispensingNumber: { startsWith: prefix } },
      orderBy: { dispensingNumber: 'desc' },
      select: { dispensingNumber: true },
    });

    let seq = 1;
    if (last?.dispensingNumber) {
      const parts = last.dispensingNumber.split('-');
      seq = (parseInt(parts[parts.length - 1] ?? '0', 10) || 0) + 1;
    }

    return `${prefix}-${String(seq).padStart(5, '0')}`;
  }

  private async fetchEncounter(tenantId: string, encounterId: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/encounters/${encounterId}`, {
          headers: { 'x-tenant-id': tenantId, authorization: authHeader },
        }),
      );
      return response.data;
    } catch {
      return null;
    }
  }

  private async fetchPrescription(tenantId: string, prescriptionId: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/prescriptions/${prescriptionId}`, {
          headers: { 'x-tenant-id': tenantId, authorization: authHeader },
        }),
      );
      return response.data;
    } catch {
      return null;
    }
  }

  private async fetchPrescriptionHeader(tenantId: string, prescriptionId: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/prescription-headers/${prescriptionId}`, {
          headers: { 'x-tenant-id': tenantId, authorization: authHeader },
        }),
      );
      return response.data;
    } catch {
      return null;
    }
  }

  private async fetchInpatientAdmission(tenantId: string, encounterId: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/inpatient/admissions/encounter/${encounterId}`, {
          headers: { 'x-tenant-id': tenantId, authorization: authHeader },
        }),
      );
      return response.data;
    } catch {
      return null;
    }
  }
}
