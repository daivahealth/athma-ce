import { foundationClient } from '@/lib/api/client';

export interface Ward {
  id: string;
  name?: string;
  code?: string;
  wardType?: string;
  departmentId?: string;
}

class WardService {
  async getById(id: string): Promise<Ward> {
    const response = await foundationClient.get(`/wards/${id}`);
    return response.data;
  }

  async getAll(): Promise<Ward[]> {
    const response = await foundationClient.get('/wards');
    return response.data;
  }

  async listByDepartment(
    departmentId: string,
    filters?: { wardType?: string; genderRestriction?: string; specialtyId?: string }
  ): Promise<Ward[]> {
    const response = await foundationClient.get(`/departments/${departmentId}/wards`, {
      params: filters,
    });
    return response.data;
  }
}

export const wardService = new WardService();
