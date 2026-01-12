import { foundationClient } from '@/lib/api/client';

export interface Department {
  id: string;
  facilityId?: string;
  name?: string;
  code?: string;
  departmentType?: string;
  status?: string;
}

class DepartmentService {
  async listByFacility(facilityId: string, type?: string): Promise<Department[]> {
    const response = await foundationClient.get(`/facilities/${facilityId}/departments`, {
      params: { type },
    });
    return response.data;
  }
}

export const departmentService = new DepartmentService();
