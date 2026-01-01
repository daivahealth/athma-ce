/**
 * Consent Service
 * Clinical consent client (UNCHANGED stub from Express)
 */

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  async isAllowed(tenantId: string, patientId: string, channel: string, purpose: string): Promise<boolean> {
    // STUB: In production, call actual consent service
    this.logger.debug(`Consent check (stub): tenant=${tenantId}, patient=${patientId}, channel=${channel}, purpose=${purpose}`);
    return true; // Always allow for stub
  }
}
