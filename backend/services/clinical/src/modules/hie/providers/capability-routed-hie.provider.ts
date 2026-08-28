/**
 * Per-tenant HIE provider routing via the capability registry (ADR-0015):
 * the tenant's `capability.national.exchange.provider` binding decides which
 * concrete network serves a fetch — 'abdm' → AbdmHieProvider, anything else
 * (or unbound) → MockHieProvider. HieService and HieController are untouched:
 * this is still one HIE_PROVIDER behind the ADR-0012 seam, but the binding is
 * data, not a deploy.
 */

import { Injectable, Logger } from '@nestjs/common';
import { configClient } from '../../../config';
import {
  HieFetchRequest,
  HieFetchResponse,
  HieProvider,
} from './hie-provider.interface';
import { AbdmHieProvider } from './abdm-hie.provider';
import { MockHieProvider } from './mock-hie.provider';

@Injectable()
export class CapabilityRoutedHieProvider implements HieProvider {
  readonly name = 'capability-routed';
  private readonly logger = new Logger(CapabilityRoutedHieProvider.name);

  constructor(
    private readonly abdm: AbdmHieProvider,
    private readonly mock: MockHieProvider,
  ) {}

  async fetchRecords(request: HieFetchRequest): Promise<HieFetchResponse> {
    const delegate = await this.resolve(request.tenantId);
    return delegate.fetchRecords(request);
  }

  private async resolve(tenantId: string): Promise<HieProvider> {
    try {
      const binding = await configClient.get('capability.national.exchange.provider', { tenantId });
      if (String(binding ?? '').trim() === 'abdm') return this.abdm;
    } catch (error) {
      this.logger.warn(`Exchange capability binding lookup failed: ${error} — using mock`);
    }
    return this.mock;
  }
}
