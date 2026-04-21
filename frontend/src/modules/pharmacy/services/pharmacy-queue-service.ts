import { rcmClient } from '@/lib/api/client';
import type { PharmacyQueueItem, PharmacyQueueFilters } from '../types/queue';
import type { PharmacyDispensing } from '../types/dispensing';

class PharmacyQueueService {
  async getQueue(filters?: PharmacyQueueFilters): Promise<PharmacyQueueItem[]> {
    const response = await rcmClient.get('/pharmacy/queue', { params: filters });
    return response.data;
  }

  async getQueueItem(prescriptionId: string): Promise<{
    prescription: Record<string, unknown> | null;
    dispensing: PharmacyDispensing | null;
  }> {
    const response = await rcmClient.get(`/pharmacy/queue/${prescriptionId}`);
    return response.data;
  }
}

export const pharmacyQueueService = new PharmacyQueueService();
