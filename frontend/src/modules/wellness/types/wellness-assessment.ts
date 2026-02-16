// Wellness Assessment Types

export type WellnessAssessmentStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface WellnessAssessmentTemplate {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  category: string;
  sections: AssessmentSection[];
  scoringAlgorithm?: Record<string, unknown>;
  maxScore?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSection {
  sectionName: string;
  sectionOrder: number;
  questions: AssessmentQuestion[];
  weight?: number;
}

export interface AssessmentQuestion {
  questionId: string;
  questionText: string;
  questionType: 'text' | 'number' | 'select' | 'multiselect' | 'scale' | 'boolean';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  required: boolean;
  weight?: number;
}

export interface WellnessAssessment {
  id: string;
  tenantId: string;
  patientId: string;
  templateId: string;
  template?: WellnessAssessmentTemplate;
  assessmentDate: string;
  status: WellnessAssessmentStatus;
  responses: Record<string, unknown>;
  overallScore?: number;
  categoryScores?: Record<string, number>;
  recommendations?: string[];
  conductedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessScoreHistory {
  id: string;
  patientId: string;
  assessmentId: string;
  scoreDate: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  biologicalAge?: number;
  chronologicalAge?: number;
}

export interface CreateAssessmentTemplateInput {
  name: string;
  code: string;
  description?: string;
  category: string;
  sections: AssessmentSection[];
  scoringAlgorithm?: Record<string, unknown>;
  maxScore?: number;
}

export interface CreateAssessmentInput {
  patientId: string;
  templateId: string;
  assessmentDate?: string;
  conductedBy?: string;
}

export interface SubmitAssessmentInput {
  responses: Record<string, unknown>;
  notes?: string;
}

export interface AssessmentFilters {
  patientId?: string;
  templateId?: string;
  status?: WellnessAssessmentStatus;
  startDate?: string;
  endDate?: string;
}
