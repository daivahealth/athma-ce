// Wellness Program Types

export type WellnessProgramStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type WellnessSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'cancelled';

export interface WellnessProgramTemplate {
  id: string;
  tenantId: string;
  programName: string;
  programCode: string;
  description?: string;
  programType: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  phases: ProgramPhase[];
  goals: string[];
  eligibilityCriteria?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramPhase {
  phaseName: string;
  phaseOrder: number;
  durationWeeks: number;
  description?: string;
  milestones: PhaseMilestone[];
  activities: PhaseActivity[];
}

export interface PhaseMilestone {
  milestoneName: string;
  description?: string;
  targetMetric?: string;
  targetValue?: number;
}

export interface PhaseActivity {
  activityName: string;
  activityType: string;
  frequency?: string;
  duration?: number;
  instructions?: string;
}

export interface WellnessProgramEnrollment {
  id: string;
  tenantId: string;
  patientId: string;
  templateId: string;
  template?: WellnessProgramTemplate;
  status: WellnessProgramStatus;
  enrolledAt: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  currentPhase: number;
  completedSessions: number;
  totalSessions: number;
  progressPercent: number;
  enrolledBy?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessProgramSession {
  id: string;
  tenantId: string;
  enrollmentId: string;
  sessionNumber: number;
  sessionType: string;
  scheduledDate: string;
  actualDate?: string;
  status: WellnessSessionStatus;
  phase: number;
  appointmentId?: string;
  conductedBy?: string;
  notes?: string;
  outcomes?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessProgramMilestone {
  id: string;
  tenantId: string;
  enrollmentId: string;
  milestoneName: string;
  phase: number;
  targetDate?: string;
  achievedDate?: string;
  status: 'pending' | 'achieved' | 'missed';
  targetMetric?: string;
  targetValue?: number;
  actualValue?: number;
  notes?: string;
}

export interface EnrollPatientInput {
  patientId: string;
  templateId: string;
  startDate?: string;
  enrolledBy?: string;
  notes?: string;
}

export interface ScheduleSessionInput {
  enrollmentId: string;
  sessionNumber: number;
  sessionType: string;
  scheduledDate: string;
  appointmentId?: string;
}

export interface CompleteSessionInput {
  conductedBy?: string;
  notes?: string;
  outcomes?: Record<string, unknown>;
}

export interface ProgramFilters {
  patientId?: string;
  templateId?: string;
  status?: WellnessProgramStatus;
  programType?: string;
}

export interface ProgramProgress {
  enrollmentId: string;
  programName: string;
  status: WellnessProgramStatus;
  currentPhase: number;
  totalPhases: number;
  completedSessions: number;
  totalSessions: number;
  progressPercent: number;
  milestonesAchieved: number;
  totalMilestones: number;
  daysRemaining: number;
  upcomingSessions: WellnessProgramSession[];
}
