'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, FilePenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  useAmendOtReport,
  useCreateOtReport,
  useOtReport,
  useOtSchedules,
} from '@/modules/ot/hooks/use-ot';
import type { CreateOtReportInput } from '@/modules/ot/types';

const DEFAULT_REPORT_JSON = JSON.stringify(
  {
    procedureSummary: '',
    findings: '',
    operativeSteps: [],
    complications: '',
    bloodLossMl: null,
    implantsUsed: [],
    disposition: '',
  },
  null,
  2
);

export default function NewOtReportPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publishToast = useToast();
  const amendId = searchParams.get('amend');

  const [scheduleId, setScheduleId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [reportJson, setReportJson] = useState(DEFAULT_REPORT_JSON);

  const { data: schedules } = useOtSchedules();
  const { data: amendTarget } = useOtReport(amendId || undefined);
  const createReport = useCreateOtReport();
  const amendReport = useAmendOtReport();

  const eligibleSchedules = useMemo(
    () =>
      (schedules ?? []).filter((schedule) =>
        ['SURGERY_STARTED', 'SURGERY_COMPLETED', 'PATIENT_SHIFTED_TO_RECOVERY', 'CONFIRMED', 'PATIENT_READY', 'PATIENT_IN_OT', 'ANAESTHESIA_STARTED'].includes(schedule.status)
      ),
    [schedules]
  );

  useEffect(() => {
    if (!amendTarget) return;
    const currentVersion = amendTarget.versions?.find((version) => version.isCurrent) ?? amendTarget.versions?.[0];
    setScheduleId(amendTarget.scheduleId);
    setRemarks(amendTarget.remarks ?? '');
    setReportJson(JSON.stringify(currentVersion?.reportData ?? {}, null, 2));
  }, [amendTarget]);

  const parseReportData = () => JSON.parse(reportJson) as Record<string, unknown>;

  const handleSubmit = async () => {
    try {
      const reportData = parseReportData();

      if (amendTarget) {
        await amendReport.mutateAsync({
          id: amendTarget.id,
          data: {
            remarks: remarks || undefined,
            reportData,
          },
        });
        publishToast({
          title: 'OT report amended',
          description: 'A new report version has been created.',
        });
      } else {
        if (!scheduleId) {
          publishToast({
            variant: 'destructive',
            title: 'Schedule required',
            description: 'Select an OT schedule before creating the report.',
          });
          return;
        }

        const payload: CreateOtReportInput = {
          scheduleId,
          remarks: remarks || undefined,
          reportData,
        };

        await createReport.mutateAsync(payload);
        publishToast({
          title: 'OT report created',
          description: 'Draft operative report saved.',
        });
      }

      router.push(`/${params.locale}/ot/reports`);
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to save OT report',
        description: error instanceof Error ? error.message : 'Invalid report JSON',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/ot/reports`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{amendTarget ? 'Amend OT Report' : 'Create OT Report'}</CardTitle>
          <CardDescription>
            {amendTarget
              ? `Updating ${amendTarget.reportNumber} with a new version.`
              : 'Draft the operative report as versioned JSON content.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>OT Schedule</Label>
            <Select value={scheduleId || undefined} onValueChange={setScheduleId} disabled={Boolean(amendTarget)}>
              <SelectTrigger>
                <SelectValue placeholder="Select OT schedule" />
              </SelectTrigger>
              <SelectContent>
                {eligibleSchedules.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.patientDisplay?.displayName || schedule.patientId} •{' '}
                    {format(new Date(schedule.scheduledStartTime), 'dd MMM yyyy, HH:mm')}
                    {schedule.patientDisplay?.mrn ? ` • MRN: ${schedule.patientDisplay.mrn}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Report Data (JSON)</Label>
            <Textarea value={reportJson} onChange={(e) => setReportJson(e.target.value)} className="min-h-[320px] font-mono text-xs" />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={createReport.isPending || amendReport.isPending}>
              <FilePenLine className="mr-2 h-4 w-4" />
              {amendTarget ? 'Save Amendment' : 'Save Draft'}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/ot/reports`)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
