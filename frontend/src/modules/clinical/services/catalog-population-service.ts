/**
 * Catalog Population Service
 * API client for the AI-powered catalog population feature.
 */

import { aiGatewayClient } from '@/lib/api/client';
import type {
  StartCatalogPopulationRequest,
  StartCatalogPopulationResponse,
  CatalogPopulationStatus,
  CountryInfo,
} from '../types/catalog-population';

class CatalogPopulationService {
  async start(params: StartCatalogPopulationRequest): Promise<StartCatalogPopulationResponse> {
    const { data } = await aiGatewayClient.post<StartCatalogPopulationResponse>(
      '/catalog-population/start',
      params,
    );
    return data;
  }

  async getStatus(jobId: string): Promise<CatalogPopulationStatus> {
    const { data } = await aiGatewayClient.get<CatalogPopulationStatus>(
      `/catalog-population/status/${jobId}`,
    );
    return data;
  }

  async cancel(jobId: string): Promise<{ cancelled: boolean }> {
    const { data } = await aiGatewayClient.post<{ cancelled: boolean }>(
      `/catalog-population/cancel/${jobId}`,
    );
    return data;
  }

  async getHistory(): Promise<CatalogPopulationStatus[]> {
    const { data } = await aiGatewayClient.get<CatalogPopulationStatus[]>(
      '/catalog-population/history',
    );
    return data;
  }

  async getCountries(): Promise<CountryInfo[]> {
    const { data } = await aiGatewayClient.get<CountryInfo[]>(
      '/catalog-population/countries',
    );
    return data;
  }
}

export const catalogPopulationService = new CatalogPopulationService();
