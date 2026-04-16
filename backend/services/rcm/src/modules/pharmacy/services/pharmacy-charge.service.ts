import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { ChargePostingService } from '../../billing/services/charge-posting.service';
import { ChargeService } from '../../billing/services/charge.service';
import { EventType, EventSource } from '../../billing/dto/charge-posting-rule.dto';
import { ChargeSourceType } from '../../billing/dto/charge.dto';
import { PrismaService } from '@zeal/database-rcm';

@Injectable()
export class PharmacyChargeService {
  private readonly logger = new Logger(PharmacyChargeService.name);

  constructor(
    private readonly chargePostingService: ChargePostingService,
    private readonly chargeService: ChargeService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Post pharmacy charges for a completed dispense event.
   *
   * Strategy:
   * 1. Try ChargePostingService.processEvent() — uses configured rules engine
   * 2. If no rules are configured for pharmacy, fall back to direct ChargeService.create()
   *    using the billingItemId from the first dispensing item's stock record
   *
   * Either way, the dispense is NOT blocked if charge posting fails (graceful degradation).
   */
  async postDispensingCharge(
    tenantId: string,
    dispensingId: string,
    patientId: string,
    encounterId: string,
    dispensedAt: Date,
    items: Array<{
      drugCode: string;
      drugName: string;
      quantityDispensed: Decimal;
      unitPrice: Decimal | null;
      lineAmount: Decimal | null;
      stockId: string;
    }>,
  ): Promise<string | null> {
    try {
      // Attempt charge posting via the rules engine
      const result = await this.chargePostingService.processEvent(tenantId, {
        eventType: EventType.MEDICATION_DISPENSED,
        eventSource: EventSource.PHARMACY,
        eventId: dispensingId,
        patientId,
        encounterId,
        occurredAt: dispensedAt,
        eventData: {
          dispensingId,
          items: items.map((i) => ({
            drugCode: i.drugCode,
            drugName: i.drugName,
            quantity: i.quantityDispensed.toNumber(),
            unitPrice: i.unitPrice?.toNumber() ?? null,
            lineAmount: i.lineAmount?.toNumber() ?? null,
          })),
        },
      });

      if (result && result.chargesCreated > 0) {
        this.logger.log(
          `Pharmacy charge posted via rules engine for dispensing ${dispensingId}. Charges created: ${result.chargesCreated}`,
        );
        return result.charges?.[0]?.chargeId ?? null;
      }

      // Fallback: direct charge creation using billingItemId from stock
      return await this.fallbackDirectCharge(tenantId, dispensingId, patientId, encounterId, items, dispensedAt);
    } catch (error) {
      this.logger.warn(
        `Charge posting failed for dispensing ${dispensingId} — dispense will proceed. Error: ${(error as Error).message}`,
      );
      return null;
    }
  }

  private async fallbackDirectCharge(
    tenantId: string,
    dispensingId: string,
    patientId: string,
    encounterId: string,
    items: Array<{
      drugCode: string;
      drugName: string;
      quantityDispensed: Decimal;
      unitPrice: Decimal | null;
      lineAmount: Decimal | null;
      stockId: string;
    }>,
    dispensedAt: Date,
  ): Promise<string | null> {
    // Get billingItemId from the first item's stock record
    const firstStock = await this.prisma.pharmacyStock.findFirst({
      where: { id: items[0]?.stockId },
      select: { billingItemId: true },
    });

    if (!firstStock?.billingItemId) {
      this.logger.warn(
        `No billingItemId on stock for dispensing ${dispensingId} — skipping charge creation`,
      );
      return null;
    }

    const billingItem = await this.prisma.billingItem.findFirst({
      where: { id: firstStock.billingItemId },
    });

    if (!billingItem) return null;

    const totalQty = items.reduce((sum, i) => sum.plus(i.quantityDispensed), new Decimal(0));
    const unitPrice = items[0]?.unitPrice ?? billingItem.listPrice ?? new Decimal(0);
    const gross = unitPrice.times(totalQty);

    const charge = await this.chargeService.create(tenantId, {
      patientId,
      encounterId,
      billingItemId: firstStock.billingItemId,
      quantity: totalQty.toNumber(),
      unitPrice: unitPrice.toNumber(),
      grossAmount: gross.toNumber(),
      sourceType: ChargeSourceType.PHARMACY,
      sourceId: dispensingId,
      notes: `Pharmacy dispense: ${items.map((i) => i.drugName).join(', ')}`,
    });

    this.logger.log(
      `Pharmacy charge posted via fallback for dispensing ${dispensingId}. Charge: ${charge.id}`,
    );
    return charge.id;
  }
}
