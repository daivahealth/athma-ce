import { clinicalClient } from '@/lib/api/client';
import type { BedBrowserFilters, BedBrowserResponse } from '@/modules/clinical/types/bed-browser';

class BedBrowserService {
  async getBeds(filters: BedBrowserFilters = {}): Promise<BedBrowserResponse> {
    const response = await clinicalClient.get('/inpatient/wards/bed-browser', { params: filters });
    return response.data;
  }

  async markCleaningRequired(bedId: string, notes?: string) {
    const response = await clinicalClient.post(`/inpatient/wards/beds/${bedId}/cleaning/required`, {
      notes,
    });
    return response.data;
  }

  async markCleaningComplete(bedId: string, notes?: string) {
    const response = await clinicalClient.post(`/inpatient/wards/beds/${bedId}/cleaning/complete`, {
      notes,
    });
    return response.data;
  }

  async markMaintenanceStart(bedId: string, notes?: string) {
    const response = await clinicalClient.post(`/inpatient/wards/beds/${bedId}/maintenance/start`, {
      notes,
    });
    return response.data;
  }

  async markMaintenanceComplete(bedId: string, notes?: string) {
    const response = await clinicalClient.post(`/inpatient/wards/beds/${bedId}/maintenance/complete`, {
      notes,
    });
    return response.data;
  }
}

export const bedBrowserService = new BedBrowserService();
