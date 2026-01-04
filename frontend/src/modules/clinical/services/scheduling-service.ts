import { clinicalClient } from '@/lib/api/client';
import type {
  CreateStaffScheduleInput,
  CreateWeeklyStaffScheduleInput,
  StaffSchedule,
  StaffScheduleSummary,
  StaffScheduleFilters,
  UpdateStaffScheduleInput,
  Appointment,
  BookAppointmentInput,
  RescheduleAppointmentInput,
  CancelAppointmentInput,
  AllocateResourceInput,
  AppointmentFilters,
  AppointmentSeries,
  CreateAppointmentSeriesInput,
} from '../types/scheduling';

class SchedulingService {
  // ========================================
  // STAFF SCHEDULE METHODS
  // ========================================

  async listScheduledStaff(filters?: { facilityId?: string }): Promise<StaffScheduleSummary[]> {
    const response = await clinicalClient.get('/scheduling/staff-schedules', {
      params: filters,
    });
    return response.data;
  }

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

  // ========================================
  // APPOINTMENT BOOKING & MANAGEMENT
  // ========================================

  async bookAppointment(payload: BookAppointmentInput): Promise<Appointment> {
    const response = await clinicalClient.post('/scheduling/appointments', payload);
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await clinicalClient.get(`/scheduling/appointments/${id}`);
    return response.data;
  }

  async rescheduleAppointment(
    id: string,
    payload: RescheduleAppointmentInput
  ): Promise<Appointment> {
    const response = await clinicalClient.put(
      `/scheduling/appointments/${id}/reschedule`,
      payload
    );
    return response.data;
  }

  async cancelAppointment(id: string, payload?: CancelAppointmentInput): Promise<Appointment> {
    const response = await clinicalClient.post(`/scheduling/appointments/${id}/cancel`, payload);
    return response.data;
  }

  // ========================================
  // RESOURCE ALLOCATION
  // ========================================

  async allocateResource(payload: AllocateResourceInput): Promise<any> {
    const response = await clinicalClient.post('/scheduling/appointments/resources', payload);
    return response.data;
  }

  async confirmResource(resourceId: string): Promise<any> {
    const response = await clinicalClient.post(
      `/scheduling/appointments/resources/${resourceId}/confirm`
    );
    return response.data;
  }

  // ========================================
  // QUERY METHODS
  // ========================================

  async getPatientAppointments(
    patientId: string,
    filters?: AppointmentFilters
  ): Promise<Appointment[]> {
    const response = await clinicalClient.get(`/scheduling/appointments/patients/${patientId}`, {
      params: filters,
    });
    return response.data;
  }

  async getFacilityAppointments(
    facilityId: string,
    startDate: string,
    endDate: string,
    filters?: Omit<AppointmentFilters, 'startDate' | 'endDate'>
  ): Promise<Appointment[]> {
    const response = await clinicalClient.get(
      `/scheduling/appointments/facilities/${facilityId}`,
      {
        params: {
          startDate,
          endDate,
          ...filters,
        },
      }
    );
    return response.data;
  }

  async getCurrentFacilityAppointments(
    startDate: string,
    endDate: string,
    filters?: Omit<AppointmentFilters, 'startDate' | 'endDate'>
  ): Promise<Appointment[]> {
    const response = await clinicalClient.get('/scheduling/appointments/facility/current', {
      params: {
        startDate,
        endDate,
        ...filters,
      },
    });
    return response.data;
  }

  // ========================================
  // APPOINTMENT SERIES (RECURRING)
  // ========================================

  async createAppointmentSeries(payload: CreateAppointmentSeriesInput): Promise<AppointmentSeries> {
    const response = await clinicalClient.post('/scheduling/appointments/series', payload);
    return response.data;
  }

  async getAppointmentSeries(seriesId: string): Promise<AppointmentSeries> {
    const response = await clinicalClient.get(`/scheduling/appointments/series/${seriesId}`);
    return response.data;
  }

  async pauseAppointmentSeries(seriesId: string): Promise<AppointmentSeries> {
    const response = await clinicalClient.post(`/scheduling/appointments/series/${seriesId}/pause`);
    return response.data;
  }

  async resumeAppointmentSeries(seriesId: string): Promise<AppointmentSeries> {
    const response = await clinicalClient.post(
      `/scheduling/appointments/series/${seriesId}/resume`
    );
    return response.data;
  }

  async cancelAppointmentSeries(seriesId: string, reason: string): Promise<AppointmentSeries> {
    const response = await clinicalClient.post(
      `/scheduling/appointments/series/${seriesId}/cancel`,
      { reason }
    );
    return response.data;
  }
}

export const schedulingService = new SchedulingService();
