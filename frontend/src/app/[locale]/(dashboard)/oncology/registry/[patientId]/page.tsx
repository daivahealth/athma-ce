'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePatientCancerSummary } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, EmptyState, StatusBadge } from '@/plugins/oncology/components/shared';
import { TreatmentIntentBadge } from '@/plugins/oncology/components/TreatmentIntentBadge';

export default function PatientCancerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const patientId = params.patientId as string;
  const { data, isLoading } = usePatientCancerSummary(patientId);

  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState message="Patient not found in oncology registry" />;

  const { diagnoses = [], stagings = [], tumorBoardCases = [], carePlans = [] } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patient Cancer Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete oncology history for this patient
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/${locale}/oncology/timeline/${patientId}`)}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          View Timeline
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cancer Diagnoses</h2>
        {diagnoses.length === 0 ? (
          <EmptyState message="No cancer diagnoses found" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {diagnoses.map((d: Record<string, unknown>) => (
              <div key={d.id as string} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{d.cancer_type as string}</h3>
                  <StatusBadge status={d.clinical_status as string} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{d.primary_site as string}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {Boolean(d.grade) && <span className="px-2 py-0.5 rounded bg-muted">Grade: {String(d.grade)}</span>}
                  {Boolean(d.laterality) && <span className="px-2 py-0.5 rounded bg-muted capitalize">{String(d.laterality)}</span>}
                  <span className="px-2 py-0.5 rounded bg-muted capitalize">{d.metastatic_status as string}</span>
                  {Boolean(d.is_recurrence) && <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">Recurrence</span>}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Diagnosed: {new Date(d.diagnosis_date as string).toLocaleDateString()}
                  {d.ecog_at_diagnosis != null && ` | ECOG: ${String(d.ecog_at_diagnosis)}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Staging History</h2>
        {stagings.length === 0 ? (
          <EmptyState message="No staging records found" />
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">System</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Stage</th>
                  <th className="text-left p-3 font-medium">TNM</th>
                  <th className="text-left p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stagings.map((s: Record<string, unknown>) => (
                  <tr key={s.id as string} className="hover:bg-muted/30">
                    <td className="p-3">
                      {s.staging_system as string}
                      {Boolean(s.staging_edition) && <span className="text-muted-foreground"> ({String(s.staging_edition)})</span>}
                    </td>
                    <td className="p-3 capitalize">{(s.staging_type as string || 'clinical').replace(/_/g, ' ')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {(s.stage_group as string) || '-'}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      T{(s.t_category as string) || '?'} N{(s.n_category as string) || '?'} M{(s.m_category as string) || '?'}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(s.staging_date as string).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tumor Board Decisions</h2>
        {tumorBoardCases.length === 0 ? (
          <EmptyState message="No tumor board cases found" />
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Meeting Date</th>
                  <th className="text-left p-3 font-medium">Treatment Intent</th>
                  <th className="text-left p-3 font-medium">MDT Recommendation</th>
                  <th className="text-left p-3 font-medium">Outcome</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tumorBoardCases.map((c: Record<string, unknown>) => (
                  <tr key={c.id as string} className="hover:bg-muted/30">
                    <td className="p-3">{new Date(c.meeting_date as string).toLocaleDateString()}</td>
                    <td className="p-3">
                      {c.treatment_intent ? <TreatmentIntentBadge intent={c.treatment_intent as string} /> : '-'}
                    </td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate">
                      {(c.mdt_recommendation as string) || '-'}
                    </td>
                    <td className="p-3 capitalize">{((c.review_outcome as string) || '-').replace(/_/g, ' ')}</td>
                    <td className="p-3"><StatusBadge status={c.status as string} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Care Plans</h2>
        {carePlans.length === 0 ? (
          <EmptyState message="No care plans found" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {carePlans.map((cp: Record<string, unknown>) => (
              <div key={cp.id as string} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{cp.plan_number as string}</h3>
                    <p className="text-xs text-muted-foreground">Version {String(cp.version)}</p>
                  </div>
                  <StatusBadge status={cp.status as string} />
                </div>
                <div className="mt-2 flex gap-2">
                  <TreatmentIntentBadge intent={cp.treatment_intent as string} />
                  {Boolean(cp.oncology_subspecialty) && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
                      {String(cp.oncology_subspecialty).replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                {Boolean(cp.approved_at) && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Approved: {new Date(cp.approved_at as string).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
