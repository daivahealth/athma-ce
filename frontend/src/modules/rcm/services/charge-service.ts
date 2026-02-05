import { rcmClient } from '@/lib/api/client';
import type { Charge, CreateChargeInput } from '../types/charge';

class ChargeService {
  async getByEncounter(encounterId: string): Promise<Charge[]> {
    const response = await rcmClient.get(`/charges/encounter/${encounterId}`);
    return response.data;
  }

  async createBulk(charges: CreateChargeInput[]): Promise<Charge[]> {
    const response = await rcmClient.post('/charges/bulk', charges);
    return response.data;
  }
}

export const chargeService = new ChargeService();
