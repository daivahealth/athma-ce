export interface StaffSchedule {
  id: string;
  staffId: string;
  employeeId?: string | null;
  staffDisplayName?: string | null;
  facilityId?: string | null;
  facilityCode?: string | null;
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
  employeeId?: string;
  staffDisplayName?: string;
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
  employeeId?: string;
  staffDisplayName?: string | null;
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
  employeeId?: string;
  staffDisplayName?: string;
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
