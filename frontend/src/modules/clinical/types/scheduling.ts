export interface StaffSchedule {
  id: string;
  staffId: string;
  facilityId?: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType: string;
  notes?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffScheduleInput {
  staffId: string;
  facilityId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType?: string;
  notes?: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface UpdateStaffScheduleInput {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
  scheduleType?: string;
  notes?: string | null;
  effectiveFrom?: string;
  effectiveTo?: string | null;
}

export interface CreateWeeklyStaffScheduleInput {
  staffId: string;
  days: number[];
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  scheduleType?: string;
  facilityId?: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  notes?: string;
}

export interface StaffScheduleFilters {
  effectiveDate?: string;
  includeExpired?: boolean;
  facilityId?: string;
}
