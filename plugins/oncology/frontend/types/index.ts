export interface TumorStaging {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId?: string;
  providerId?: string;
  cancerType: string;
  icdCode?: string;
  snomedCode?: string;
  bodySite?: string;
  stagingSystem: string;
  stageGroup?: string;
  tCategory?: string;
  nCategory?: string;
  mCategory?: string;
  grade?: string;
  histology?: string;
  biomarkers: Record<string, unknown>;
  stagingDate: string;
  diagnosisDate?: string;
  isRecurrence: boolean;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChemoProtocol {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  cancerType: string;
  intent: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant';
  regimen: RegimenItem[];
  totalCycles: number;
  cycleDurationDays: number;
  premedications: string[];
  supportiveCare: string[];
  emetogenicRisk?: string;
  isActive: boolean;
  createdAt: string;
}

export interface RegimenItem {
  drug: string;
  dose: string;
  unit: string;
  route: string;
  day: number;
  cycle: string;
}

export interface ChemoOrder {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId?: string;
  protocolId: string;
  protocolName?: string;
  protocolCode?: string;
  orderingProvider: string;
  cycleNumber: number;
  dayNumber: number;
  scheduledDate: string;
  administeredAt?: string;
  bsa?: number;
  weight?: number;
  height?: number;
  creatinineClearance?: number;
  doseAdjustments: unknown[];
  preChemoChecklist: Record<string, unknown>;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'held';
  verifiedBy?: string;
  verifiedAt?: string;
  administeredBy?: string;
  notes?: string;
  createdAt: string;
}

export interface TumorBoardCase {
  id: string;
  tenantId: string;
  patientId: string;
  stagingId?: string;
  meetingDate: string;
  presentedBy: string;
  attendees: TumorBoardAttendee[];
  clinicalSummary?: string;
  imagingFindings?: string;
  pathologyReport?: string;
  recommendation?: string;
  treatmentPlan: Record<string, unknown>;
  decision?: string;
  followUpActions: unknown[];
  status: 'scheduled' | 'in_review' | 'completed' | 'deferred';
  createdAt: string;
}

export interface TumorBoardAttendee {
  staffId: string;
  role: string;
  specialty: string;
}
