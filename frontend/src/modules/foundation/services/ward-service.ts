import { foundationClient } from '@/lib/api/client';

export type Ward = Record<string, unknown>;

class WardService {
  async getById(id: string): Promise<Ward> {
    const response = await foundationClient.get(`/wards/${id}`);
    return response.data;
  }
}

export const wardService = new WardService();
