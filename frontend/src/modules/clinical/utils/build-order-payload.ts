import type { OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import { OrderPriority, OrderType } from '@/modules/clinical/types/charting';
import type {
  CodeSystem,
  CreateClinicalOrderInput,
  CreatePackageOrderInput,
  OrderEntryMode,
} from '@/modules/clinical/types/charting';

export interface OrderContext {
  encounterId: string;
  patientId: string;
  /** Staff ID of the ordering physician (accountable prescriber). */
  orderedBy: string;
  priority?: OrderPriority;
  clinicalIndication?: string;
  /** Set when the order is entered on behalf of the physician (CPOE). */
  orderMode?: OrderEntryMode;
}

/**
 * Builds the create-package-order payload from a catalog selection.
 * Shared by the charting Orders block and the standalone CPOE page.
 */
export function buildPackageOrderPayload(
  selection: OrderSelection,
  ctx: OrderContext,
): CreatePackageOrderInput {
  return {
    packageId: selection.id,
    encounterId: ctx.encounterId,
    patientId: ctx.patientId,
    priority: ctx.priority ?? OrderPriority.ROUTINE,
    clinicalIndication: ctx.clinicalIndication || undefined,
    orderedBy: ctx.orderedBy,
    orderMode: ctx.orderMode,
  };
}

/**
 * Builds the create-clinical-order payload (lab / imaging / procedure) from a
 * catalog selection. Shared by the charting Orders block and the CPOE page.
 */
export function buildClinicalOrderPayload(
  selection: OrderSelection,
  ctx: OrderContext,
): CreateClinicalOrderInput {
  const codeSystem = selection.codeSystem as CodeSystem | string;
  const base = {
    encounterId: ctx.encounterId,
    patientId: ctx.patientId,
    orderType:
      selection.type === 'lab'
        ? OrderType.LAB
        : selection.type === 'imaging'
          ? OrderType.IMAGING
          : OrderType.PROCEDURE,
    orderCode: selection.code,
    codeSystem,
    orderName: selection.label,
    priority: ctx.priority ?? OrderPriority.ROUTINE,
    clinicalIndication: ctx.clinicalIndication || undefined,
    orderedBy: ctx.orderedBy,
    orderMode: ctx.orderMode,
  };

  if (selection.type === 'lab') {
    return {
      ...base,
      labTests: [
        {
          labTestMasterId: selection.id,
          testCode: selection.code,
          codeSystem,
          testName: selection.label,
          loincCode: selection.codeSystem === 'LOINC' ? selection.code : undefined,
          cptCode: selection.codeSystem === 'CPT' ? selection.code : undefined,
          quantity: 1,
          sortOrder: 0,
        },
      ],
    };
  }

  if (selection.type === 'imaging') {
    const meta = selection.imagingMeta;
    return {
      ...base,
      imagingDetails: [
        {
          imagingStudyMasterId: selection.id,
          studyCode: selection.code,
          codeSystem,
          studyName: selection.label,
          cptCode: meta?.cptCode ?? undefined,
          modality: meta?.modality,
          bodyPart: meta?.bodyPart,
          contrastRequired: meta?.contrastRequired,
          contrastType: meta?.contrastType ?? undefined,
          preparationInstructions: meta?.preparationInstructions ?? undefined,
          quantity: 1,
          sortOrder: 0,
        },
      ],
    };
  }

  if (selection.type === 'procedure') {
    const meta = selection.procedureMeta;
    return {
      ...base,
      procedureDetails: [
        {
          procedureMasterId: selection.id,
          procedureCode: selection.code,
          codeSystem,
          procedureName: selection.label,
          cptCode: meta?.cptCode ?? undefined,
          icd10PcsCode: meta?.icd10PcsCode ?? undefined,
          procedureCategory: meta?.procedureCategory ?? undefined,
          bodySystem: meta?.bodySystem ?? undefined,
          anesthesiaType: meta?.anesthesiaType ?? undefined,
          facilityRequired: meta?.facilityRequired ?? undefined,
          estimatedDurationMinutes: meta?.estimatedDurationMinutes ?? undefined,
          preparationInstructions: meta?.preparationInstructions ?? undefined,
          consentRequired: meta?.consentRequired,
          quantity: 1,
          sortOrder: 0,
        },
      ],
    };
  }

  return base;
}
