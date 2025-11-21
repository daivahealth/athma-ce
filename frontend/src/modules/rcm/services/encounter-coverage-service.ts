import { rcmClient } from '@/lib/api/client';
import type { EncounterCoverage, CreateEncounterCoverageInput } from '../types/coverage';

class EncounterCoverageService {
  async listByEncounter(encounterId: string): Promise<EncounterCoverage[]> {
    const response = await rcmClient.get(`/encounter-coverages/encounter/${encounterId}`);
    return response.data;
  }

  async create(payload: CreateEncounterCoverageInput): Promise<EncounterCoverage> {
    const response = await rcmClient.post('/encounter-coverages', payload);
    return response.data;
  }
}

export const encounterCoverageService = new EncounterCoverageService();
