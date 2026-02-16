// Biomarker Types

export type BiomarkerCategory =
  | 'metabolic'
  | 'hormonal'
  | 'inflammatory'
  | 'cardiovascular'
  | 'genetic'
  | 'cellular'
  | 'nutrient';

export type BiomarkerAlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type BiomarkerAlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface BiomarkerDefinition {
  id: string;
  tenantId: string;
  biomarkerCode: string;
  biomarkerName: string;
  description?: string;
  category: BiomarkerCategory;
  unit: string;
  referenceRanges: ReferenceRange[];
  optimalRanges?: OptimalRange[];
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceRange {
  ageMin?: number;
  ageMax?: number;
  gender?: 'male' | 'female' | 'all';
  minValue: number;
  maxValue: number;
}

export interface OptimalRange {
  ageMin?: number;
  ageMax?: number;
  gender?: 'male' | 'female' | 'all';
  minValue: number;
  maxValue: number;
}

export interface BiomarkerResult {
  id: string;
  tenantId: string;
  patientId: string;
  biomarkerId: string;
  biomarker?: BiomarkerDefinition;
  value: number;
  unit: string;
  recordedAt: string;
  source?: string;
  labOrderId?: string;
  notes?: string;
  isWithinReference: boolean;
  isOptimal: boolean;
  trend?: 'improving' | 'stable' | 'declining';
  percentChange?: number;
  createdAt: string;
}

export interface BiomarkerAlert {
  id: string;
  tenantId: string;
  patientId: string;
  biomarkerId: string;
  biomarker?: BiomarkerDefinition;
  resultId: string;
  severity: BiomarkerAlertSeverity;
  status: BiomarkerAlertStatus;
  message: string;
  value: number;
  referenceMin?: number;
  referenceMax?: number;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface BiomarkerTrend {
  biomarkerId: string;
  biomarkerName: string;
  category: BiomarkerCategory;
  unit: string;
  results: Array<{
    value: number;
    recordedAt: string;
    isOptimal: boolean;
  }>;
  latestValue: number;
  averageValue: number;
  trend: 'improving' | 'stable' | 'declining';
  percentChange: number;
}

export interface CreateBiomarkerInput {
  biomarkerCode: string;
  biomarkerName: string;
  description?: string;
  category: BiomarkerCategory;
  unit: string;
  referenceRanges: ReferenceRange[];
  optimalRanges?: OptimalRange[];
}

export interface RecordBiomarkerResultInput {
  patientId: string;
  biomarkerId: string;
  value: number;
  unit?: string;
  recordedAt?: string;
  source?: string;
  labOrderId?: string;
  notes?: string;
}

export interface BiomarkerFilters {
  patientId?: string;
  category?: BiomarkerCategory;
  biomarkerId?: string;
  startDate?: string;
  endDate?: string;
}
