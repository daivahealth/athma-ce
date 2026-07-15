/**
 * Care Narrative Service
 * Calls the AI gateway to generate a specialty-aware AI Care Narrative for a patient.
 *
 * The endpoint returns 503 with `{ available: false, reason }` when no LLM provider is
 * configured (the common case in dev). We normalise that into a resolved result so the
 * caller can fall back to the local narrative preview instead of treating it as an error.
 */

import axios from 'axios';
import { aiGatewayClient } from '@/lib/api/client';
import type { CareNarrativeRequest, CareNarrativeResult } from '../types/care-narrative';

class CareNarrativeService {
  async generate(patientId: string, params: CareNarrativeRequest = {}): Promise<CareNarrativeResult> {
    try {
      const { data } = await aiGatewayClient.post<CareNarrativeResult>(
        `/ai/patients/${patientId}/narrative`,
        { specialty: params.specialty },
      );
      return data;
    } catch (err) {
      // 503 → structured unavailable payload; degrade to the local preview.
      if (axios.isAxiosError(err) && err.response?.status === 503) {
        const body = err.response.data as Partial<CareNarrativeResult> | undefined;
        const reason =
          (body && 'reason' in body && body.reason) ||
          (body as { message?: string } | undefined)?.message ||
          'AI narrative is currently unavailable.';
        return { available: false, reason };
      }
      throw err;
    }
  }
}

export const careNarrativeService = new CareNarrativeService();
