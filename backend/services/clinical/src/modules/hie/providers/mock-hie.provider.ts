/**
 * Mock HIE Provider
 *
 * Deterministic, offline implementation of {@link HieProvider} used for local
 * development, demos and tests. It returns a small fixed set of sample external
 * records (lab report, discharge summary, imaging) and can simulate a transient
 * failure to exercise the fetch/retry path.
 *
 * A real network integration (ABDM, NABIDH, ...) implements the same interface
 * and is selected via configuration — no changes to the service/controller are
 * required to drop one in.
 */

import { Injectable } from '@nestjs/common';
import type {
  ExternalHealthRecord,
  HieFetchRequest,
  HieFetchResponse,
  HieProvider,
} from './hie-provider.interface';
import { HieProviderError } from './hie-provider.interface';

@Injectable()
export class MockHieProvider implements HieProvider {
  readonly name = 'mock';

  async fetchRecords(request: HieFetchRequest): Promise<HieFetchResponse> {
    // Simulate a transient upstream failure so the retry path can be demoed.
    if (request.simulateFailure) {
      throw new HieProviderError(
        'PROVIDER_UNAVAILABLE',
        'Mock HIE network is temporarily unavailable. Please retry.',
        true,
      );
    }

    const now = Date.now();
    const catalogue: ExternalHealthRecord[] = [
      {
        externalId: `mock-lab-${request.patientId.slice(0, 8)}`,
        recordType: 'lab_report',
        title: 'Complete Blood Count (CBC) — External Lab',
        sourceSystem: 'MockLab Diagnostics',
        documentUrl: 'mock://hie/lab-report/cbc.pdf',
        issuedAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { panel: 'CBC', status: 'final', format: 'application/pdf' },
      },
      {
        externalId: `mock-ds-${request.patientId.slice(0, 8)}`,
        recordType: 'discharge_summary',
        title: 'Inpatient Discharge Summary — External Facility',
        sourceSystem: 'MockGeneral Hospital',
        documentUrl: 'mock://hie/discharge-summary/summary.pdf',
        issuedAt: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { encounterType: 'inpatient', lengthOfStayDays: 4, format: 'application/pdf' },
      },
      {
        externalId: `mock-img-${request.patientId.slice(0, 8)}`,
        recordType: 'imaging',
        title: 'Chest X-Ray Report — External Imaging Centre',
        sourceSystem: 'MockImaging Centre',
        documentUrl: 'mock://hie/imaging/chest-xray.pdf',
        issuedAt: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { modality: 'XR', bodySite: 'chest', format: 'application/pdf' },
      },
    ];

    const requested = request.recordTypes;
    const records =
      requested && requested.length > 0
        ? catalogue.filter((r) => requested.includes(r.recordType))
        : catalogue;

    return { provider: this.name, records };
  }
}
