import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { Decimal } from '@prisma/client/runtime/library';
import {
  CreatePharmacyStockDto,
  UpdatePharmacyStockDto,
  AdjustPharmacyStockDto,
  PharmacyStockFiltersDto,
  PharmacyStockStatus,
} from '../dto/pharmacy-stock.dto';
import { StockMovementType } from '../dto/pharmacy-stock-movement.dto';
import { CatalogMappingService } from '../../catalog-mappings/services/catalog-mapping.service';

@Injectable()
export class PharmacyStockService {
  private readonly logger = new Logger(PharmacyStockService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogMappingService: CatalogMappingService,
  ) {}

  async create(tenantId: string, dto: CreatePharmacyStockDto, userId: string) {
    this.logger.log(`Receiving stock: ${dto.drugName} batch ${dto.batchNumber} for tenant ${tenantId}`);

    const quantity = new Decimal(dto.quantityReceived);

    // Auto-resolve billingItemId from CatalogItemMapping when medicationId is provided
    let resolvedBillingItemId = dto.billingItemId ?? null;
    if (dto.medicationId && !resolvedBillingItemId) {
      try {
        const result = await this.catalogMappingService.findBillingItemsForCatalogItem(tenantId, {
          catalogType: CatalogType.MEDICATION,
          catalogItemId: dto.medicationId,
          ...(dto.facilityId !== undefined && { facilityId: dto.facilityId }),
        });
        const primary = result.mappings?.find((m: any) => m.isPrimary) ?? result.mappings?.[0];
        if (primary?.billingItemId) {
          resolvedBillingItemId = primary.billingItemId;
          this.logger.log(`Auto-resolved billingItemId ${resolvedBillingItemId} for medication ${dto.medicationId}`);
        }
      } catch (err) {
        this.logger.warn(`Could not auto-resolve billingItemId for medication ${dto.medicationId}: ${(err as Error).message}`);
      }
    }

    const stock = await this.prisma.$transaction(async (tx) => {
      const newStock = await tx.pharmacyStock.create({
        data: {
          tenantId,
          medicationId: dto.medicationId ?? null,
          drugCode: dto.drugCode,
          codeSystem: dto.codeSystem ?? 'NDC',
          drugName: dto.drugName,
          drugNameAr: dto.drugNameAr ?? null,
          genericName: dto.genericName ?? null,
          dosageForm: dto.dosageForm,
          strength: dto.strength ?? null,
          unit: dto.unit,
          batchNumber: dto.batchNumber,
          manufacturer: dto.manufacturer ?? null,
          expiryDate: new Date(dto.expiryDate),
          quantityReceived: quantity,
          quantityOnHand: quantity,
          quantityReserved: new Decimal(0),
          quantityReturned: new Decimal(0),
          reorderLevel: dto.reorderLevel != null ? new Decimal(dto.reorderLevel) : null,
          reorderQuantity: dto.reorderQuantity != null ? new Decimal(dto.reorderQuantity) : null,
          facilityId: dto.facilityId ?? null,
          storageLocation: dto.storageLocation ?? null,
          unitCostPrice: dto.unitCostPrice != null ? new Decimal(dto.unitCostPrice) : null,
          currency: dto.currency ?? 'INR',
          billingItemId: resolvedBillingItemId,
          status: PharmacyStockStatus.ACTIVE,
          isControlled: dto.isControlled ?? false,
          controlledClass: dto.controlledClass ?? null,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      await tx.pharmacyStockMovement.create({
        data: {
          tenantId,
          stockId: newStock.id,
          movementType: StockMovementType.RECEIVE,
          quantity,
          quantityBefore: new Decimal(0),
          quantityAfter: quantity,
          referenceType: 'stock_receipt',
          referenceId: newStock.id,
          reason: 'Initial stock receipt',
          performedBy: userId,
        },
      });

      return newStock;
    });

    this.logger.log(`Stock received: ${stock.id}`);
    return stock;
  }

  async findAll(tenantId: string, filters: PharmacyStockFiltersDto) {
    const where: any = { tenantId };

    if (filters.drugCode) where.drugCode = filters.drugCode;
    if (filters.medicationId) where.medicationId = filters.medicationId;
    if (filters.status) where.status = filters.status;
    if (filters.facilityId) where.facilityId = filters.facilityId;

    if (filters.expiringBefore) {
      where.expiryDate = { lte: new Date(filters.expiringBefore) };
    }

    if (filters.lowStock === 'true') {
      where.AND = [
        { reorderLevel: { not: null } },
        { status: PharmacyStockStatus.ACTIVE },
      ];
    }

    const stocks = await this.prisma.pharmacyStock.findMany({
      where,
      orderBy: [{ expiryDate: 'asc' }, { createdAt: 'desc' }],
    });

    if (filters.lowStock === 'true') {
      return stocks.filter(
        (s) => s.reorderLevel != null && s.quantityOnHand.lte(s.reorderLevel),
      );
    }

    return stocks;
  }

  async findById(tenantId: string, id: string) {
    const stock = await this.prisma.pharmacyStock.findFirst({
      where: { id, tenantId },
      include: {
        movements: {
          orderBy: { performedAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(`Pharmacy stock ${id} not found`);
    }

    return stock;
  }

  async update(tenantId: string, id: string, dto: UpdatePharmacyStockDto, userId: string) {
    const stock = await this.prisma.pharmacyStock.findFirst({ where: { id, tenantId } });
    if (!stock) throw new NotFoundException(`Pharmacy stock ${id} not found`);

    return this.prisma.pharmacyStock.update({
      where: { id },
      data: {
        ...(dto.storageLocation !== undefined && { storageLocation: dto.storageLocation }),
        ...(dto.reorderLevel != null && { reorderLevel: new Decimal(dto.reorderLevel) }),
        ...(dto.reorderQuantity != null && { reorderQuantity: new Decimal(dto.reorderQuantity) }),
        ...(dto.billingItemId !== undefined && { billingItemId: dto.billingItemId }),
        ...(dto.facilityId !== undefined && { facilityId: dto.facilityId }),
        updatedBy: userId,
      },
    });
  }

  async adjust(tenantId: string, id: string, dto: AdjustPharmacyStockDto, userId: string) {
    const stock = await this.prisma.pharmacyStock.findFirst({ where: { id, tenantId } });
    if (!stock) throw new NotFoundException(`Pharmacy stock ${id} not found`);

    const newQty = new Decimal(dto.newQuantityOnHand);
    const diff = newQty.minus(stock.quantityOnHand);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.pharmacyStock.update({
        where: { id },
        data: {
          quantityOnHand: newQty,
          status: newQty.isZero() ? PharmacyStockStatus.DEPLETED : stock.status,
          updatedBy: userId,
        },
      });

      await tx.pharmacyStockMovement.create({
        data: {
          tenantId,
          stockId: id,
          movementType: StockMovementType.ADJUSTMENT,
          quantity: diff,
          quantityBefore: stock.quantityOnHand,
          quantityAfter: newQty,
          reason: dto.reason,
          notes: dto.notes ?? null,
          performedBy: userId,
        },
      });

      return updated;
    });
  }

  async quarantine(tenantId: string, id: string, userId: string) {
    const stock = await this.prisma.pharmacyStock.findFirst({ where: { id, tenantId } });
    if (!stock) throw new NotFoundException(`Pharmacy stock ${id} not found`);

    if (stock.status === PharmacyStockStatus.QUARANTINED) {
      throw new BadRequestException('Stock is already quarantined');
    }

    return this.prisma.pharmacyStock.update({
      where: { id },
      data: { status: PharmacyStockStatus.QUARANTINED, updatedBy: userId },
    });
  }

  async getExpiringAlerts(tenantId: string, days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return this.prisma.pharmacyStock.findMany({
      where: {
        tenantId,
        status: PharmacyStockStatus.ACTIVE,
        expiryDate: { lte: cutoff },
        quantityOnHand: { gt: 0 },
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async getLowStockAlerts(tenantId: string) {
    const stocks = await this.prisma.pharmacyStock.findMany({
      where: {
        tenantId,
        status: PharmacyStockStatus.ACTIVE,
        reorderLevel: { not: null },
      },
    });

    return stocks.filter(
      (s) => s.reorderLevel != null && s.quantityOnHand.lte(s.reorderLevel),
    );
  }

  /**
   * Resolve billing item for a medication catalog entry via CatalogItemMapping.
   * Used by the frontend form to preview the linked billing item before saving.
   */
  async resolveMedication(tenantId: string, medicationId: string, facilityId?: string) {
    const result = await this.catalogMappingService.findBillingItemsForCatalogItem(tenantId, {
      catalogType: CatalogType.MEDICATION,
      catalogItemId: medicationId,
      ...(facilityId !== undefined && { facilityId }),
    });

    const primary = result.mappings?.find((m: any) => m.isPrimary) ?? result.mappings?.[0];

    return {
      medicationId,
      billingItemId: primary?.billingItemId ?? null,
      billingCode: primary?.billingCode ?? null,
      billingDescription: primary?.billingDescription ?? null,
    };
  }

  /**
   * Suggest available stock batches for a drug using FEFO (First Expiry First Out).
   * Returns batches sorted by expiry date with available quantity > 0.
   */
  async suggestStockForDrug(tenantId: string, drugCode: string, requiredQty: number) {
    const batches = await this.prisma.pharmacyStock.findMany({
      where: {
        tenantId,
        drugCode,
        status: PharmacyStockStatus.ACTIVE,
      },
      orderBy: { expiryDate: 'asc' },
    });

    const required = new Decimal(requiredQty);
    let remaining = required;
    const suggestion: Array<{ stock: typeof batches[0]; suggestedQty: Decimal }> = [];

    for (const batch of batches) {
      const available = batch.quantityOnHand.minus(batch.quantityReserved);
      if (available.lte(0)) continue;

      const take = remaining.lte(available) ? remaining : available;
      suggestion.push({ stock: batch, suggestedQty: take });
      remaining = remaining.minus(take);

      if (remaining.lte(0)) break;
    }

    return {
      suggestion,
      canFulfill: remaining.lte(0),
      shortfall: remaining.gt(0) ? remaining : null,
    };
  }

  /**
   * Deduct stock quantity inside a transaction. Called by PharmacyDispensingService.
   */
  async deductStock(
    tx: Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
    tenantId: string,
    stockId: string,
    quantity: Decimal,
    dispensingId: string,
    userId: string,
  ) {
    const stock = await tx.pharmacyStock.findFirst({ where: { id: stockId, tenantId } });
    if (!stock) throw new NotFoundException(`Stock ${stockId} not found`);

    const available = stock.quantityOnHand.minus(stock.quantityReserved);
    if (available.lt(quantity)) {
      throw new ConflictException(
        `Insufficient stock for ${stock.drugName} (batch ${stock.batchNumber}). Available: ${available}`,
      );
    }

    const newQty = stock.quantityOnHand.minus(quantity);

    await tx.pharmacyStock.update({
      where: { id: stockId },
      data: {
        quantityOnHand: newQty,
        status: newQty.isZero() ? PharmacyStockStatus.DEPLETED : stock.status,
        updatedBy: userId,
      },
    });

    await tx.pharmacyStockMovement.create({
      data: {
        tenantId,
        stockId,
        movementType: StockMovementType.DISPENSE,
        quantity: quantity.negated(),
        quantityBefore: stock.quantityOnHand,
        quantityAfter: newQty,
        referenceType: 'dispensing',
        referenceId: dispensingId,
        performedBy: userId,
      },
    });
  }

  /**
   * Return stock quantity inside a transaction. Called by PharmacyDispensingService.
   */
  async returnStock(
    tx: Omit<PrismaService, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
    tenantId: string,
    stockId: string,
    quantity: Decimal,
    dispensingId: string,
    reason: string,
    userId: string,
  ) {
    const stock = await tx.pharmacyStock.findFirst({ where: { id: stockId, tenantId } });
    if (!stock) throw new NotFoundException(`Stock ${stockId} not found`);

    const newQty = stock.quantityOnHand.plus(quantity);

    await tx.pharmacyStock.update({
      where: { id: stockId },
      data: {
        quantityOnHand: newQty,
        quantityReturned: stock.quantityReturned.plus(quantity),
        status:
          stock.status === PharmacyStockStatus.DEPLETED
            ? PharmacyStockStatus.ACTIVE
            : stock.status,
        updatedBy: userId,
      },
    });

    await tx.pharmacyStockMovement.create({
      data: {
        tenantId,
        stockId,
        movementType: StockMovementType.RETURN,
        quantity,
        quantityBefore: stock.quantityOnHand,
        quantityAfter: newQty,
        referenceType: 'dispensing',
        referenceId: dispensingId,
        reason,
        performedBy: userId,
      },
    });
  }
}
