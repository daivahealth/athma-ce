import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OtFoundationService {
  private readonly logger = new Logger(OtFoundationService.name);
  private readonly foundationApi: AxiosInstance;

  constructor() {
    const foundationUrl = process.env.FOUNDATION_SERVICE_URL || 'http://localhost:3010';
    this.foundationApi = axios.create({
      baseURL: `${foundationUrl}/api/v1`,
      timeout: 5000,
    });
  }

  async getSpace(spaceId: string, tenantId: string) {
    try {
      const response = await this.foundationApi.get(`/spaces/${spaceId}`, {
        headers: { 'x-tenant-id': tenantId },
      });
      return response.data;
    } catch (error: any) {
      this.logger.warn(`Failed to fetch space ${spaceId}: ${error?.message || 'Unknown error'}`);
      return null;
    }
  }

  async listSpaces(facilityId: string, tenantId: string) {
    try {
      const response = await this.foundationApi.get('/spaces', {
        headers: { 'x-tenant-id': tenantId },
        params: { facilityId },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      this.logger.warn(`Failed to list spaces for facility ${facilityId}: ${error?.message || 'Unknown error'}`);
      return [];
    }
  }
}
