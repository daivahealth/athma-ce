import { foundationClient } from '@/lib/api/client';

export interface Bed {
  id: string;
  wardId?: string;
  bedNumber?: string;
  bedType?: string;
  status?: string;
}

class BedService {
  async getById(id: string): Promise<Bed> {
    const response = await foundationClient.get(`/beds/${id}`);
    return response.data;
  }

  async listByWard(wardId: string, status?: string): Promise<Bed[]> {
    const response = await foundationClient.get(`/wards/${wardId}/beds`, {
      params: { status },
    });
    return response.data;
  }
}

export const bedService = new BedService();
