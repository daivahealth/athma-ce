/**
 * HIE Service
 *
 * Orchestrates consent-driven fetch of external patient records from a
 * configurable Health Information Exchange provider and ingests the results as
 * patient documents. Region/network specifics live behind {@link HieProvider};
 * this service is region-agnostic. See ADR-0012.
 */

import {
  Inject,
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  ConsentType,
  ConsentStatus,
  CaptureMethod,
} from '@zeal/shared-types';
import { ConsentService, RequestContext } from '../consent/consent.service';
import { PatientDocumentService } from '../patient/patient-document.service';
import {
  HIE_PROVIDER,
  HieProvider,
  HieProviderError,
  ExternalHealthRecord,
  ExternalRecordType,
} from './providers/hie-provider.interface';
import { CreateHieConsentRequestDto, FetchExternalRecordsDto } from './dto/hie.dto';

/** Lifecycle of an external-record fetch job. */
export enum HieFetchStatus {
  PENDING = 'pending',
  FETCHING = 'fetching',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/** Days before a consent's expiry at which it is surfaced as "expiring". */
const CONSENT_EXPIRING_WINDOW_DAYS = 30;

@Injectable()
export class HieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly consentService: ConsentService,
    private readonly patientDocumentService: PatientDocumentService,
    @Inject(HIE_PROVIDER) private readonly provider: HieProvider,
  ) {}

  /**
   * Create a consent request authorising an external-record fetch. Delegates to
   * the existing consent service using the `hie_participation` consent type.
   */
  async createConsentRequest(
    dto: CreateHieConsentRequestDto,
    context: RequestContext,
  ) {
    const consent = await this.consentService.createConsent(
      {
        patientId: dto.patientId,
        consentType: ConsentType.HIE_PARTICIPATION,
        purpose: dto.purpose ?? 'Fetch external health records via HIE',
        captureMethod: dto.captureMethod ?? CaptureMethod.ELECTRONIC_CLICK,
        metadata: {
          ...(dto.metadata ?? {}),
          hie: {
            provider: this.provider.name,
            patientReference: dto.patientReference ?? null,
          },
        },
      },
      context,
    );

    return this.decorateConsent(consent);
  }

  /** Fetch a single HIE consent request by id, with a derived display status. */
  async getConsentRequest(consentId: string, tenantId: string) {
    const consent = await this.prisma.patientConsent.findUnique({
      where: { id: consentId },
    });

    if (!consent || consent.tenantId !== tenantId) {
      throw new NotFoundException('Consent request not found');
    }

    return this.decorateConsent(consent);
  }

  /**
   * Consent-gated fetch: validates active HIE consent, records a fetch job,
   * calls the provider, ingests returned records as patient documents and
   * returns a fetch summary. Provider failures are captured as a retryable job.
   */
  async fetchRecords(dto: FetchExternalRecordsDto, context: RequestContext) {
    const activeConsent = await this.prisma.patientConsent.findFirst({
      where: {
        tenantId: context.tenantId,
        patientId: dto.patientId,
        consentType: ConsentType.HIE_PARTICIPATION,
        isActive: true,
        consentStatus: ConsentStatus.GRANTED,
        effectiveFrom: { lte: new Date() },
        OR: [{ effectiveUntil: null }, { effectiveUntil: { gte: new Date() } }],
      },
      orderBy: { capturedAt: 'desc' },
    });

    if (!activeConsent) {
      throw new ForbiddenException(
        'No active HIE participation consent for this patient. Create and grant a consent request first.',
      );
    }

    const job = await this.prisma.hieFetchJob.create({
      data: {
        tenantId: context.tenantId,
        patientId: dto.patientId,
        consentId: activeConsent.id,
        provider: this.provider.name,
        status: HieFetchStatus.FETCHING,
        recordTypes: dto.recordTypes ?? [],
        patientReference: dto.patientReference ?? null,
        requestedBy: context.userId,
        attempts: 1,
        startedAt: new Date(),
      },
    });

    return this.runFetch(job.id, dto.simulateFailure ?? false, context);
  }

  /** Return a fetch job's status, including whether it can be retried. */
  async getFetchStatus(jobId: string, tenantId: string) {
    const job = await this.prisma.hieFetchJob.findUnique({ where: { id: jobId } });

    if (!job || job.tenantId !== tenantId) {
      throw new NotFoundException('Fetch job not found');
    }

    return this.decorateJob(job);
  }

  /**
   * Retry a previously failed fetch job. Mirrors the prototype's
   * "fetch failed — retry" affordance.
   */
  async retryFetch(jobId: string, context: RequestContext) {
    const job = await this.prisma.hieFetchJob.findUnique({ where: { id: jobId } });

    if (!job || job.tenantId !== context.tenantId) {
      throw new NotFoundException('Fetch job not found');
    }

    if (job.status !== HieFetchStatus.FAILED) {
      throw new BadRequestException('Only failed fetch jobs can be retried');
    }

    await this.prisma.hieFetchJob.update({
      where: { id: job.id },
      data: {
        status: HieFetchStatus.FETCHING,
        attempts: { increment: 1 },
        errorCode: null,
        errorMessage: null,
        startedAt: new Date(),
        completedAt: null,
      },
    });

    // A retry is a genuine attempt against the provider (no forced failure).
    return this.runFetch(job.id, false, context);
  }

  /**
   * Execute the provider call for a job and persist the outcome. Extracted so
   * both initial fetch and retry share identical ingest/error handling.
   */
  private async runFetch(
    jobId: string,
    simulateFailure: boolean,
    context: RequestContext,
  ) {
    const job = await this.prisma.hieFetchJob.findUniqueOrThrow({
      where: { id: jobId },
    });

    try {
      const recordTypes = job.recordTypes as unknown as ExternalRecordType[] | null;
      const response = await this.provider.fetchRecords({
        tenantId: job.tenantId,
        patientId: job.patientId,
        // Optional props are omitted (not set to undefined) for exactOptionalPropertyTypes.
        ...(job.patientReference ? { patientReference: job.patientReference } : {}),
        ...(Array.isArray(recordTypes) && recordTypes.length ? { recordTypes } : {}),
        ...(job.consentId ? { consentReference: job.consentId } : {}),
        simulateFailure,
      });

      const ingested = await this.ingestRecords(
        context.tenantId,
        job.patientId,
        job.id,
        response.provider,
        response.records,
      );

      const summary = {
        provider: response.provider,
        recordsReturned: response.records.length,
        documentsCreated: ingested.length,
        records: response.records.map((r) => ({
          externalId: r.externalId,
          recordType: r.recordType,
          title: r.title,
          sourceSystem: r.sourceSystem,
        })),
      };

      const updated = await this.prisma.hieFetchJob.update({
        where: { id: job.id },
        data: {
          status: HieFetchStatus.COMPLETED,
          recordsFetched: response.records.length,
          documentIds: ingested,
          summary,
          completedAt: new Date(),
        },
      });

      return this.decorateJob(updated);
    } catch (error) {
      const isProviderError = error instanceof HieProviderError;
      const updated = await this.prisma.hieFetchJob.update({
        where: { id: job.id },
        data: {
          status: HieFetchStatus.FAILED,
          errorCode: isProviderError ? error.code : 'UNKNOWN',
          errorMessage:
            error instanceof Error ? error.message : 'External record fetch failed',
          completedAt: new Date(),
        },
      });

      return this.decorateJob(updated);
    }
  }

  /**
   * Ingest external records as patient documents. Returns created document ids.
   * Records already ingested for this patient (by external id) are skipped to
   * keep repeated fetches idempotent.
   */
  private async ingestRecords(
    tenantId: string,
    patientId: string,
    jobId: string,
    provider: string,
    records: ExternalHealthRecord[],
  ): Promise<string[]> {
    const createdIds: string[] = [];

    for (const record of records) {
      const alreadyIngested = await this.prisma.patientDocument.findFirst({
        where: {
          tenantId,
          patientId,
          documentNumber: record.externalId,
          documentType: record.recordType,
        },
        select: { id: true },
      });

      if (alreadyIngested) {
        createdIds.push(alreadyIngested.id);
        continue;
      }

      const document = await this.patientDocumentService.addDocument(
        tenantId,
        patientId,
        {
          documentType: record.recordType,
          documentNumber: record.externalId,
          issuingCountry: 'XX',
          documentUrl: record.documentUrl,
          issueDate: record.issuedAt ? new Date(record.issuedAt) : undefined,
          verificationStatus: 'verified',
          metadata: {
            source: 'hie',
            provider,
            fetchJobId: jobId,
            sourceSystem: record.sourceSystem,
            externalId: record.externalId,
            title: record.title,
            issuedAt: record.issuedAt ?? null,
            ...(record.metadata ?? {}),
          },
        },
      );

      createdIds.push(document.id);
    }

    return createdIds;
  }

  /** Attach a derived, UI-friendly consent status to a raw consent row. */
  private decorateConsent(consent: {
    id: string;
    consentStatus: string;
    isActive: boolean;
    effectiveUntil: Date | null;
    [key: string]: unknown;
  }) {
    return {
      ...consent,
      derivedStatus: this.deriveConsentStatus(consent),
    };
  }

  private deriveConsentStatus(consent: {
    consentStatus: string;
    isActive: boolean;
    effectiveUntil: Date | null;
  }): 'granted' | 'expiring' | 'expired' | 'revoked' | 'inactive' {
    if (consent.consentStatus === ConsentStatus.REVOKED) return 'revoked';
    if (consent.consentStatus === ConsentStatus.EXPIRED) return 'expired';
    if (!consent.isActive || consent.consentStatus !== ConsentStatus.GRANTED) {
      return 'inactive';
    }

    if (consent.effectiveUntil) {
      const now = Date.now();
      const expiry = consent.effectiveUntil.getTime();
      if (expiry < now) return 'expired';
      const windowMs = CONSENT_EXPIRING_WINDOW_DAYS * 24 * 60 * 60 * 1000;
      if (expiry - now <= windowMs) return 'expiring';
    }

    return 'granted';
  }

  /** Attach a `canRetry` flag to a raw fetch-job row. */
  private decorateJob(job: { status: string; [key: string]: unknown }) {
    return {
      ...job,
      canRetry: job.status === HieFetchStatus.FAILED,
    };
  }
}
