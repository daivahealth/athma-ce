import { foundationClient } from '@/lib/api/client';
import type { Facility, CreateFacilityDTO, UpdateFacilityDTO } from '../types/facility';

class FacilityService {
  async listByTenant(tenantId: string): Promise<Facility[]> {
    const response = await foundationClient.get('/facilities', {
      params: { tenantId },
    });
    return response.data;
  }

  async getById(id: string): Promise<Facility> {
    const response = await foundationClient.get(`/facilities/${id}`);
    return response.data;
  }

  async create(data: CreateFacilityDTO): Promise<Facility> {
    const response = await foundationClient.post('/facilities', data);
    return response.data;
  }

  async update(id: string, data: UpdateFacilityDTO): Promise<Facility> {
    const response = await foundationClient.put(`/facilities/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await foundationClient.delete(`/facilities/${id}`);
  }
}

export const facilityService = new FacilityService();
