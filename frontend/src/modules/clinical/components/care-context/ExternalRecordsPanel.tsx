'use client';

/**
 * External Records panel for the Care Context view.
 *
 * Consent-driven fetch of a patient's external health records via the HIE
 * provider (region-agnostic; mock in dev). Shows consent status
 * (granted / expiring / renew) and fetch status with a retry button.
 * See ADR-0012.
 */

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  Download,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  useCreateHieConsentRequest,
  useFetchExternalRecords,
  useHieConsentRequest,
  useHieFetchJob,
  useRetryHieFetch,
} from '../../hooks/use-hie';
import type { HieConsentDerivedStatus } from '../../types/hie';

interface ExternalRecordsPanelProps {
  patientId: string;
  /** External patient identifier in the target HIE (ABHA / EID / MRN). */
  patientReference?: string;
}

const CONSENT_BADGE: Record<
  HieConsentDerivedStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof ShieldCheck }
> = {
  granted: { label: 'Consent granted', variant: 'default', icon: ShieldCheck },
  expiring: { label: 'Consent expiring', variant: 'secondary', icon: ShieldAlert },
  expired: { label: 'Consent expired', variant: 'destructive', icon: ShieldX },
  revoked: { label: 'Consent revoked', variant: 'destructive', icon: ShieldX },
  inactive: { label: 'No consent', variant: 'outline', icon: ShieldAlert },
};

export function ExternalRecordsPanel({
  patientId,
  patientReference,
}: ExternalRecordsPanelProps) {
  const toast = useToast();
  const [consentId, setConsentId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const { data: consent } = useHieConsentRequest(consentId);
  const { data: job } = useHieFetchJob(jobId);

  const createConsent = useCreateHieConsentRequest();
  const fetchRecords = useFetchExternalRecords();
  const retryFetch = useRetryHieFetch();

  const hasUsableConsent =
    consent?.derivedStatus === 'granted' || consent?.derivedStatus === 'expiring';

  const isBusy =
    createConsent.isPending ||
    fetchRecords.isPending ||
    retryFetch.isPending ||
    job?.status === 'pending' ||
    job?.status === 'fetching';

  const handleRequestAndFetch = async () => {
    try {
      let activeConsentId = consentId;

      // Ensure a granted HIE consent exists before fetching.
      if (!hasUsableConsent) {
        const created = await createConsent.mutateAsync({
          patientId,
          patientReference,
        });
        setConsentId(created.id);
        activeConsentId = created.id;
      }

      if (!activeConsentId) return;

      const started = await fetchRecords.mutateAsync({
        patientId,
        patientReference,
      });
      setJobId(started.id);

      if (started.status === 'completed') {
        toast({
          title: 'External records fetched',
          description: `${started.summary?.documentsCreated ?? 0} record(s) ingested from ${started.provider}.`,
        });
      } else if (started.status === 'failed') {
        toast({
          title: 'Fetch failed',
          description: started.errorMessage ?? 'Unable to fetch external records.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Request failed',
        description: 'Could not complete the external-records request.',
        variant: 'destructive',
      });
    }
  };

  const handleRetry = async () => {
    if (!jobId) return;
    try {
      const retried = await retryFetch.mutateAsync(jobId);
      if (retried.status === 'completed') {
        toast({
          title: 'Retry succeeded',
          description: `${retried.summary?.documentsCreated ?? 0} record(s) ingested.`,
        });
      }
    } catch {
      toast({
        title: 'Retry failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const consentBadge = consent
    ? CONSENT_BADGE[consent.derivedStatus]
    : CONSENT_BADGE.inactive;
  const ConsentIcon = consentBadge.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="h-4 w-4" />
          External records
        </CardTitle>
        <Badge variant={consentBadge.variant} className="flex items-center gap-1">
          <ConsentIcon className="h-3 w-3" />
          {consentBadge.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Request patient consent and pull external health records (lab reports,
          discharge summaries, imaging) from the Health Information Exchange.
          Fetched records are ingested as patient documents.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleRequestAndFetch} disabled={isBusy} size="sm">
            {isBusy ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {hasUsableConsent ? 'Fetch records' : 'Request & fetch records'}
          </Button>

          {consent?.derivedStatus === 'expiring' && (
            <span className="text-xs text-amber-600">
              Consent expires soon — renew to avoid interruption.
            </span>
          )}
        </div>

        {/* Fetch status */}
        {isBusy && !job && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {job?.status === 'fetching' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Fetching records from {job.provider}…
          </div>
        )}

        {job?.status === 'failed' && (
          <div className="flex items-start justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Fetch failed</p>
                <p className="text-muted-foreground">
                  {job.errorMessage ?? 'The external network was unavailable.'}
                </p>
              </div>
            </div>
            {job.canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={retryFetch.isPending}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${retryFetch.isPending ? 'animate-spin' : ''}`}
                />
                Retry
              </Button>
            )}
          </div>
        )}

        {job?.status === 'completed' && job.summary && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Ingested {job.summary.documentsCreated} record(s) from{' '}
              {job.summary.provider}.
            </div>
            <ul className="divide-y rounded-md border">
              {job.summary.records.map((record) => (
                <li
                  key={record.externalId}
                  className="flex items-center gap-2 p-2 text-sm"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{record.title}</span>
                  <Badge variant="outline" className="ml-auto">
                    {record.recordType}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ExternalRecordsPanel;
