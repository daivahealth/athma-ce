import { rcmClient } from '@/lib/api/client';
import type { PharmacyQueueItem, PharmacyQueueFilters } from '../types/queue';
import type { PharmacyDispensing } from '../types/dispensing';

class PharmacyQueueService {
  async getQueue(filters?: PharmacyQueueFilters): Promise<PharmacyQueueItem[]> {
    const response = await rcmClient.get('/pharmacy/queue', { params: filters });
    return response.data;
  }

  async getQueueItem(prescriptionOrderId: string): Promise<{
    prescription: Record<string, unknown> | null;
    dispensing: PharmacyDispensing | null;
  }> {
    const response = await rcmClient.get(`/pharmacy/queue/${prescriptionOrderId}`);
    return response.data;
  }
}

export const pharmacyQueueService = new PharmacyQueueService();
