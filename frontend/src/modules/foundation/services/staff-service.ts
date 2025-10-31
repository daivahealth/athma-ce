import { foundationClient } from '@/lib/api/client';
import type { StaffMember } from '../types/staff';

class StaffService {
  async list(): Promise<StaffMember[]> {
    const response = await foundationClient.get('/staff');
    return response.data;
  }
}

export const staffService = new StaffService();
