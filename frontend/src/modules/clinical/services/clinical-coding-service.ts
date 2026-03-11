/**
 * Clinical Coding Service
 * Calls the AI gateway to get coding suggestions.
 */

import { aiGatewayClient } from '@/lib/api/client';
import type {
  ClinicalCodingSuggestRequest,
  ClinicalCodingSuggestResponse,
} from '../types/clinical-coding';

class ClinicalCodingService {
  async suggest(params: ClinicalCodingSuggestRequest): Promise<ClinicalCodingSuggestResponse> {
    const { data } = await aiGatewayClient.post<ClinicalCodingSuggestResponse>(
      '/clinical-coding/suggest',
      params,
    );
    return data;
  }
}

export const clinicalCodingService = new ClinicalCodingService();
