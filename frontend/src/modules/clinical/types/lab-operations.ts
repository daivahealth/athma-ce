import type { LabReport } from './reporting';
import type { PatientDisplay } from './encounter';

export type LabWorklistStage =
  | 'collection'
  | 'receiving'
  | 'accessioning'
  | 'processing'
  | 'result-entry';

export interface LabOrderSummary {
  id: string;
  encounterId: string;
  patientId: string;
  orderName: string;
  orderCode: string;
  priority: string;
  status?: string;
}

export interface LabOrderTestSummary {
  id: string;
  orderId: string;
  testCode: string;
  testName: string;
  specimenType?: string | null;
  status: string;
}

export interface LabCollectionWorklistItem {
  orderId: string;
  encounterId: string;
  patientId: string;
  patientDisplay?: PatientDisplay | null;
  orderName: string;
  orderCode: string;
  priority: string;
  orderedAt: string;
  specimenType: string;
  collectionMethod: string;
  fastingRequired: boolean;
  fastingDurationHours?: number | null;
  pendingLabOrderTestIds: string[];
  testCount: number;
  orderCount: number;
  orderIds: string[];
  sourceOrders: Array<{
    id: string;
    orderName: string;
    orderCode: string;
    priority: string;
    orderedAt: string;
  }>;
  tests: Array<{
    id: string;
    testCode: string;
    testName: string;
    status: string;
  }>;
  workflowState: 'ready' | 'prepared';
  preparedSpecimenId?: string | null;
  preparedBarcode?: string | null;
  preparedAt?: string | null;
}

export interface LabSpecimenAccession {
  id: string;
  accessionNumber: string;
  receivedAt?: string | null;
  receivedBy?: string | null;
  receivingLocation?: string | null;
  accessionedAt?: string | null;
  accessionedBy?: string | null;
  status: string;
}

export interface LabSpecimenEvent {
  id: string;
  eventType: string;
  eventTime: string;
  performedBy?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
}

export interface LabProcessingRun {
  id: string;
  specimenId: string;
  labOrderTestId: string;
  runType: string;
  instrumentCode?: string | null;
  instrumentRunId?: string | null;
  status: string;
  processedAt?: string | null;
  processedBy?: string | null;
}

export interface LabSpecimenTest {
  id: string;
  specimenId: string;
  labOrderTestId: string;
  status: string;
  labOrderTest: LabOrderTestSummary;
}

export interface LabSpecimen {
  id: string;
  tenantId: string;
  orderId: string;
  specimenType?: string | null;
  containerType?: string | null;
  collectionSite?: string | null;
  barcode?: string | null;
  collectedAt?: string | null;
  collectedBy?: string | null;
  status: string;
  rejectionReason?: string | null;
  order: LabOrderSummary;
  specimenTests: LabSpecimenTest[];
  accessions: LabSpecimenAccession[];
  events: LabSpecimenEvent[];
  processingRuns: LabProcessingRun[];
}

export interface LabProcessingWorklistItem {
  id: string;
  status: string;
  specimen: {
    id: string;
    specimenType?: string | null;
    barcode?: string | null;
    order: LabOrderSummary;
    accessions: LabSpecimenAccession[];
  };
  labOrderTest: LabOrderTestSummary;
}

export interface StartLabResultEntryContext {
  order: LabOrderSummary;
  labOrderTest: LabOrderTestSummary;
  specimen: LabSpecimen;
  accession?: LabSpecimenAccession | null;
  report: LabReport;
}

export interface CollectLabSpecimenInput {
  specimenId?: string;
  orderId?: string;
  labOrderTestIds?: string[];
  specimenType?: string;
  containerType?: string;
  collectionSite?: string;
  barcode?: string;
  collectedAt?: string;
  collectedBy?: string;
  notes?: string;
}

export interface PrepareLabSpecimenInput {
  orderId: string;
  labOrderTestIds: string[];
  specimenType?: string;
  containerType?: string;
  collectionSite?: string;
  barcode?: string;
  notes?: string;
}

export interface LabSpecimenLabelPayload {
  specimenId: string;
  barcode: string;
  template: string;
  mimeType: string;
  fileName: string;
  patientDisplay?: PatientDisplay | null;
  specimenType: string;
  tests: Array<{
    id: string;
    testCode: string;
    testName: string;
  }>;
  prn: string;
}

export interface PrepareLabSpecimenResult {
  specimen: LabSpecimen;
  label: LabSpecimenLabelPayload;
}

export interface ReceiveLabSpecimenInput {
  receivedAt?: string;
  receivedBy?: string;
  receivingLocation?: string;
  notes?: string;
}

export interface AccessionLabSpecimenInput {
  accessionNumber?: string;
  accessionedAt?: string;
  accessionedBy?: string;
  notes?: string;
}

export interface RejectLabSpecimenInput {
  rejectionReason: string;
  notes?: string;
}

export interface CreateLabProcessingRunInput {
  specimenId: string;
  labOrderTestId: string;
  runType?: 'manual' | 'analyzer';
  instrumentCode?: string;
  instrumentRunId?: string;
  status?: 'processing' | 'completed' | 'failed';
  rawPayload?: Record<string, any>;
  processedAt?: string;
  processedBy?: string;
}

export interface StartLabResultEntryInput {
  labOrderTestId: string;
  specimenId?: string;
}

export interface CompleteLabResultEntryInput {
  labOrderTestId: string;
  specimenId?: string;
  notes?: string;
}
