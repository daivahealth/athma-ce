import { foundationClient } from '@/lib/api/client';
import type { Specialty } from '../types/specialty';

class SpecialtyService {
  async list(params: { locale?: string; includeInactive?: boolean } = {}): Promise<Specialty[]> {
    const response = await foundationClient.get('/specialties', {
      params: {
        locale: params.locale,
        includeInactive: params.includeInactive ? 'true' : undefined,
      },
    });
    return response.data;
  }
}

export const specialtyService = new SpecialtyService();
