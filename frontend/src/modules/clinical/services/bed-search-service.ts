import { clinicalClient } from '@/lib/api/client';
import type {
  BedAvailabilityValidationResponse,
  BedSearchFilters,
  BedSearchResponse,
} from '@/modules/clinical/types/bed-search';

class BedSearchService {
  async searchAvailable(filters: BedSearchFilters): Promise<BedSearchResponse> {
    const response = await clinicalClient.get('/beds/search-available', { params: filters });
    return response.data;
  }

  async validateAvailability(bedId: string): Promise<BedAvailabilityValidationResponse> {
    const response = await clinicalClient.post('/beds/validate-availability', { bedId });
    return response.data;
  }
}

export const bedSearchService = new BedSearchService();
