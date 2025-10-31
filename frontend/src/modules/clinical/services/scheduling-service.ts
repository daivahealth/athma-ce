import { clinicalClient } from '@/lib/api/client';
import type {
  CreateStaffScheduleInput,
  CreateWeeklyStaffScheduleInput,
  StaffSchedule,
  StaffScheduleFilters,
  UpdateStaffScheduleInput,
} from '../types/scheduling';

class SchedulingService {
  async getStaffSchedules(
    staffId: string,
    filters?: StaffScheduleFilters
  ): Promise<StaffSchedule[]> {
    const response = await clinicalClient.get(`/scheduling/staff-schedules/${staffId}`, {
      params: filters,
    });
    return response.data;
  }

  async createStaffSchedule(payload: CreateStaffScheduleInput): Promise<StaffSchedule> {
    const response = await clinicalClient.post('/scheduling/staff-schedules', payload);
    return response.data;
  }

  async updateStaffSchedule(
    id: string,
    payload: UpdateStaffScheduleInput
  ): Promise<StaffSchedule> {
    const response = await clinicalClient.put(`/scheduling/staff-schedules/${id}`, payload);
    return response.data;
  }

  async deleteStaffSchedule(id: string): Promise<void> {
    await clinicalClient.delete(`/scheduling/staff-schedules/${id}`);
  }

  async createWeeklyStaffSchedule(
    payload: CreateWeeklyStaffScheduleInput
  ): Promise<StaffSchedule[]> {
    const response = await clinicalClient.post('/scheduling/staff-schedules/weekly', payload);
    return response.data;
  }
}

export const schedulingService = new SchedulingService();
