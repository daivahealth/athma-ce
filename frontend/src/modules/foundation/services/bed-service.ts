import { foundationClient } from '@/lib/api/client';

export type Bed = Record<string, unknown>;

class BedService {
  async getById(id: string): Promise<Bed> {
    const response = await foundationClient.get(`/beds/${id}`);
    return response.data;
  }
}

export const bedService = new BedService();
