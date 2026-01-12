import { foundationClient } from '@/lib/api/client';

export interface Clinic {
  id: string;
  departmentId?: string;
  name?: string;
  code?: string;
  specialty?: string | null;
  status?: string;
}

class ClinicService {
  async listByDepartment(departmentId: string, specialty?: string): Promise<Clinic[]> {
    const response = await foundationClient.get(`/departments/${departmentId}/clinics`, {
      params: { specialty },
    });
    return response.data;
  }
}

export const clinicService = new ClinicService();
