import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  VITAL_SIGN_MAPPINGS,
  ALL_OBSERVATION_MAPPINGS,
  interpretValue,
  convertToCelsius,
  convertToKg,
  convertToCm,
  convertToMgDl,
  type LoincMapping,
} from './loinc-mappings';

interface VitalSigns {
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  temperature?: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'in';
  bmi?: number;
  bloodGlucose?: number;
  bloodGlucoseUnit?: 'mg/dL' | 'mmol/L';
  headCircumference?: number;
}

interface TriageContext {
  tenantId: string;
  patientId: string;
  encounterId: string;
  triageId: string;
  observedAt: Date;
  observedBy?: string;
}

interface OrderResultContext {
  tenantId: string;
  patientId: string;
  encounterId?: string;
  orderId: string;
  orderType: string;
  resultData: Record<string, any>;
  resultedAt: Date;
  performedBy?: string;
}

@Injectable()
export class ObservationWriterService {
  private readonly logger = new Logger(ObservationWriterService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Extract vital signs from triage JSON and write individual observation rows.
   * Called after triage create/update.
   */
  async writeVitals(
    vitalSigns: VitalSigns,
    context: TriageContext,
  ): Promise<void> {
    const observations: any[] = [];

    for (const [key, mapping] of Object.entries(VITAL_SIGN_MAPPINGS)) {
      let value = (vitalSigns as any)[key];
      if (value == null) continue;

      let unit = mapping.defaultUnit;
      let refLow = mapping.refRangeLow;
      let refHigh = mapping.refRangeHigh;

      // Normalize units to standard before storing
      if (key === 'temperature' && vitalSigns.temperatureUnit === 'fahrenheit') {
        value = convertToCelsius(value);
      }
      if (key === 'weight' && vitalSigns.weightUnit === 'lbs') {
        value = convertToKg(value);
      }
      if (key === 'height' && vitalSigns.heightUnit === 'in') {
        value = convertToCm(value);
      }
      if (key === 'bloodGlucose' && vitalSigns.bloodGlucoseUnit === 'mmol/L') {
        value = convertToMgDl(value);
      }

      const interpretation = interpretValue(value, refLow, refHigh);

      observations.push({
        tenantId: context.tenantId,
        patientId: context.patientId,
        encounterId: context.encounterId,
        code: mapping.code,
        codeSystem: mapping.codeSystem,
        displayName: mapping.displayName,
        displayNameAr: mapping.displayNameAr,
        category: 'vital-signs',
        valueNumeric: value,
        unit,
        refRangeLow: refLow,
        refRangeHigh: refHigh,
        interpretation,
        observedAt: context.observedAt,
        observedBy: context.observedBy,
        sourceType: 'triage',
        sourceId: context.triageId,
      });
    }

    if (observations.length === 0) return;

    try {
      // Delete existing observations for this triage (for upsert on update)
      await this.prisma.clinicalObservation.deleteMany({
        where: {
          tenantId: context.tenantId,
          sourceType: 'triage',
          sourceId: context.triageId,
        },
      });

      await this.prisma.clinicalObservation.createMany({
        data: observations,
      });

      this.logger.log(
        `Wrote ${observations.length} vital observations for triage ${context.triageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to write vital observations for triage ${context.triageId}`,
        error,
      );
    }
  }

  /**
   * Parse order resultData JSON and write observation rows for recognized result keys.
   * Called after clinical order result is added.
   */
  async writeOrderResults(context: OrderResultContext): Promise<void> {
    const observations: any[] = [];
    const resultData = context.resultData;

    if (!resultData || typeof resultData !== 'object') return;

    for (const [key, rawValue] of Object.entries(resultData)) {
      const mapping = ALL_OBSERVATION_MAPPINGS[key];
      if (!mapping) continue;

      const value = typeof rawValue === 'number'
        ? rawValue
        : typeof rawValue === 'string'
          ? parseFloat(rawValue)
          : null;

      if (value == null || isNaN(value)) {
        // Store non-numeric values as string observations
        if (rawValue != null && typeof rawValue === 'string' && rawValue.trim()) {
          observations.push({
            tenantId: context.tenantId,
            patientId: context.patientId,
            encounterId: context.encounterId,
            orderId: context.orderId,
            code: mapping.code,
            codeSystem: mapping.codeSystem,
            displayName: mapping.displayName,
            displayNameAr: mapping.displayNameAr,
            category: mapping.category,
            valueString: rawValue,
            unit: mapping.defaultUnit,
            observedAt: context.resultedAt,
            observedBy: context.performedBy,
            sourceType: this.mapOrderTypeToSourceType(context.orderType),
            sourceId: context.orderId,
          });
        }
        continue;
      }

      const interpretation = interpretValue(
        value,
        mapping.refRangeLow,
        mapping.refRangeHigh,
      );

      observations.push({
        tenantId: context.tenantId,
        patientId: context.patientId,
        encounterId: context.encounterId,
        orderId: context.orderId,
        code: mapping.code,
        codeSystem: mapping.codeSystem,
        displayName: mapping.displayName,
        displayNameAr: mapping.displayNameAr,
        category: mapping.category,
        valueNumeric: value,
        unit: mapping.defaultUnit,
        refRangeLow: mapping.refRangeLow,
        refRangeHigh: mapping.refRangeHigh,
        interpretation,
        observedAt: context.resultedAt,
        observedBy: context.performedBy,
        sourceType: this.mapOrderTypeToSourceType(context.orderType),
        sourceId: context.orderId,
      });
    }

    if (observations.length === 0) return;

    try {
      // Delete existing observations for this order (for re-adding results)
      await this.prisma.clinicalObservation.deleteMany({
        where: {
          tenantId: context.tenantId,
          orderId: context.orderId,
        },
      });

      await this.prisma.clinicalObservation.createMany({
        data: observations,
      });

      this.logger.log(
        `Wrote ${observations.length} result observations for order ${context.orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to write result observations for order ${context.orderId}`,
        error,
      );
    }
  }

  private mapOrderTypeToSourceType(orderType: string): string {
    switch (orderType?.toLowerCase()) {
      case 'lab':
        return 'lab_result';
      case 'imaging':
        return 'imaging_result';
      default:
        return 'lab_result';
    }
  }
}
