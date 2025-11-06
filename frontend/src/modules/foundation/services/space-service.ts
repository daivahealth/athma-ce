import { foundationClient } from '@/lib/api/client';
import type { Space, CreateSpaceDTO, UpdateSpaceDTO } from '../types/space';

class SpaceService {
  async listByFacility(facilityId: string): Promise<Space[]> {
    const response = await foundationClient.get('/spaces', {
      params: { facilityId },
    });
    return response.data;
  }

  async getById(id: string): Promise<Space> {
    const response = await foundationClient.get(`/spaces/${id}`);
    return response.data;
  }

  async create(data: CreateSpaceDTO): Promise<Space> {
    const response = await foundationClient.post('/spaces', data);
    return response.data;
  }

  async update(id: string, data: UpdateSpaceDTO): Promise<Space> {
    const response = await foundationClient.put(`/spaces/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await foundationClient.delete(`/spaces/${id}`);
  }
}

export const spaceService = new SpaceService();
