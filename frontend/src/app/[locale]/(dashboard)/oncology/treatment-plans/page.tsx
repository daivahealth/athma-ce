'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CalendarRange, ClipboardList, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { useTreatmentPlans } from '@/plugins/oncology/hooks/use-oncology';
import { EmptyState, LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import { formatDayMonthYear, formatShortDate } from '@/plugins/oncology/lib/treatment-day';

export default function TreatmentPlansPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const [status, setStatus] = useState('active');
  const [query, setQuery] = useState('');
  const { data, isLoading } = useTreatmentPlans(status ? { status } : undefined);

  // Opened from a care plan: go to its current schedule, or start one
  const carePlanId = useSearchParams().get('carePlanId');
  const { data: forCarePlan } = useTreatmentPlans(carePlanId ? { carePlanId } : undefined, !!carePlanId);
  useEffect(() => {
    if (!carePlanId || !forCarePlan) return;
    const current = forCarePlan.data.find((p) => ['active', 'on_hold'].includes(p.status));
    router.replace(current
      ? `/${params.locale}/oncology/treatment-plans/${current.id}`
      : `/${params.locale}/oncology/treatment-plans/new?carePlanId=${carePlanId}`);
  }, [carePlanId, forCarePlan, params.locale, router]);

  const plans = (data?.data ?? []).filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [p.patientDisplay?.displayName, p.patientDisplay?.mrn, p.protocol_code, p.protocol_name, p.cancer_type]
      .some((v) => v?.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Treatment Schedules"
        subtitle="Patient chemotherapy schedules generated from protocols — cycle by cycle, day by day"
        icon={CalendarRange}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/day-care`)}>
              <ClipboardList className="h-4 w-4 mr-2" />Day-care worklist
            </Button>
            <Button onClick={() => router.push(`/${params.locale}/oncology/treatment-plans/new`)}>
              <Plus className="h-4 w-4 mr-2" />Start schedule
            </Button>
          </div>
        }
      />

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search patient, MRN, protocol…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search treatment schedules" />
        </div>
        <Select value={status || '__all'} onValueChange={(v) => setStatus(v === '__all' ? '' : v)}>
          <SelectTrigger className="w-44" aria-label="Filter by status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingState /> : plans.length === 0 ? (
        <EmptyState message="No treatment schedules. Start one from an active care plan." />
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">Patient</th>
                <th className="text-left p-3 font-medium">Protocol</th>
                <th className="text-left p-3 font-medium">Cancer type</th>
                <th className="text-left p-3 font-medium">Start → end</th>
                <th className="text-left p-3 font-medium">Next treatment</th>
                <th className="text-left p-3 font-medium">Progress</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => router.push(`/${params.locale}/oncology/treatment-plans/${p.id}`)}
                >
                  <td className="p-3">
                    <div className="font-medium">{p.patientDisplay?.displayName ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{p.patientDisplay?.mrn}</div>
                  </td>
                  <td className="p-3"><span className="font-mono text-xs font-semibold">{p.protocol_code}</span> <span className="text-muted-foreground text-xs">{p.total_cycles} cycles</span></td>
                  <td className="p-3 text-xs text-muted-foreground">{p.cancer_type}</td>
                  <td className="p-3 text-xs">{formatDayMonthYear(p.start_date)} → {p.end_date ? formatDayMonthYear(p.end_date) : '—'}</td>
                  <td className="p-3 text-xs">{p.next_date ? formatShortDate(p.next_date) : '—'}</td>
                  <td className="p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden" aria-hidden>
                        <div className="h-full bg-primary" style={{ width: `${p.total_days ? (p.given_days / p.total_days) * 100 : 0}%` }} />
                      </div>
                      {p.given_days}/{p.total_days}
                    </div>
                  </td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
