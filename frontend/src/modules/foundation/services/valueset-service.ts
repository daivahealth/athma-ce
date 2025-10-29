import { foundationClient } from '@/lib/api/client';
import type {
  ValueSet,
  ValueSetConceptsResponse,
  GetConceptsOptions,
  SearchConceptsOptions,
} from '../types/valueset';

/**
 * ValueSet Service
 * Handles all API operations for ValueSet management
 */
class ValueSetService {
  private basePath = '/valuesets';

  /**
   * Get all valuesets with optional filtering
   */
  async findAll(params?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<ValueSet[]> {
    const response = await foundationClient.get(this.basePath, { params });
    return response.data;
  }

  /**
   * Get a specific valueset by code
   */
  async findOne(code: string): Promise<ValueSet> {
    const response = await foundationClient.get(`${this.basePath}/${code}`);
    return response.data;
  }

  /**
   * Get concepts for a valueset
   */
  async getConcepts(
    code: string,
    options?: GetConceptsOptions
  ): Promise<ValueSetConceptsResponse> {
    const response = await foundationClient.get(
      `${this.basePath}/${code}/concepts`,
      { params: options }
    );
    return response.data;
  }

  /**
   * Search concepts across valuesets
   */
  async searchConcepts(
    searchTerm: string,
    options?: SearchConceptsOptions
  ): Promise<Array<{
    id: string;
    code: string;
    display: string;
    valueSet: string;
    valueSetName: string;
  }>> {
    const response = await foundationClient.get(`${this.basePath}/search`, {
      params: {
        q: searchTerm,
        ...options,
      },
    });
    return response.data;
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const response = await foundationClient.get(`${this.basePath}/categories`);
    return response.data;
  }

  /**
   * Get concepts for a specific valueset with language support
   * This is a convenience method for commonly used valuesets
   */
  async getCountries(language: string = 'en'): Promise<ValueSetConceptsResponse> {
    return this.getConcepts('iso_3166_countries', { language });
  }

  async getGenders(language: string = 'en'): Promise<ValueSetConceptsResponse> {
    return this.getConcepts('administrative_gender', { language });
  }

  async getBloodGroups(language: string = 'en'): Promise<ValueSetConceptsResponse> {
    return this.getConcepts('blood_groups', { language });
  }

  async getMaritalStatuses(language: string = 'en'): Promise<ValueSetConceptsResponse> {
    return this.getConcepts('marital_status', { language });
  }

  async getLanguages(language: string = 'en'): Promise<ValueSetConceptsResponse> {
    return this.getConcepts('iso_639_languages', { language });
  }

  async getCurrencies(language: string = 'en'): Promise<ValueSetConceptsResponse> {
    return this.getConcepts('iso_4217_currencies', { language });
  }
}

// Export singleton instance
export const valueSetService = new ValueSetService();
