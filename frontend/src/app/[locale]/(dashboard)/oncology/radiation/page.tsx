'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Radiation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useRadiationPrescriptions } from '@/plugins/oncology/hooks/use-oncology';
import { PageHeader } from '@/components/ui/page-header';
import { ListPagination } from '@/components/ui/list-pagination';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { RadiationPrescription } from '@/plugins/oncology/types';
import { PatientCell } from '@/plugins/oncology/components/shared';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  APPROVED: 'bg-info/10 text-info',
  ACTIVE: 'bg-success/10 text-success',
  COMPLETED: 'bg-primary/10 text-primary',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

const PAGE_SIZE = 20;

export default function RadiationListPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  // Search (patient, MRN, Rx #) runs server-side so it covers every page.
  const { data, isLoading } = useRadiationPrescriptions({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const prescriptions: RadiationPrescription[] = data?.data ?? [];

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Radiation Oncology"
        subtitle="Manage radiation prescriptions, simulations, plans, and fractions"
        icon={Radiation}
        actions={
          <Button onClick={() => router.push(`/${params.locale}/oncology/radiation/new`)}>
            <Plus className="h-4 w-4 mr-2" />New Prescription
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search patient or Rx #..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <Select value={statusFilter || '__all'} onValueChange={(v) => { setStatusFilter(v === '__all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Patient</th>
              <th className="text-left px-4 py-3 font-medium">Rx #</th>
              <th className="text-left px-4 py-3 font-medium">Intent</th>
              <th className="text-left px-4 py-3 font-medium">Modality / Technique</th>
              <th className="text-left px-4 py-3 font-medium">Dose</th>
              <th className="text-left px-4 py-3 font-medium">Fractions</th>
              <th className="text-left px-4 py-3 font-medium">Start Date</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">Loading...</td></tr>
            ) : prescriptions.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No radiation prescriptions found.</td></tr>
            ) : (
              prescriptions.map((rx) => (
                <tr
                  key={rx.id}
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/${params.locale}/oncology/radiation/${rx.id}`)}
                >
                  <td className="px-4 py-3">
                    <PatientCell patientDisplay={rx.patientDisplay} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{rx.prescription_number ?? '—'}</td>
                  <td className="px-4 py-3 capitalize">{rx.treatment_intent ?? '—'}</td>
                  <td className="px-4 py-3">
                    {[rx.modality, rx.technique].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {rx.total_dose_gy != null ? (
                      <span>{rx.total_dose_gy} Gy
                        {rx.dose_per_fraction_gy != null && (
                          <span className="text-muted-foreground"> ({rx.dose_per_fraction_gy} Gy/fx)</span>
                        )}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">{rx.planned_fractions ?? '—'}</td>
                  <td className="px-4 py-3">
                    {rx.planned_start_date
                      ? new Date(rx.planned_start_date).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLORS[rx.status] ?? ''} variant="secondary">
                      {rx.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && prescriptions.length > 0 && (
          <ListPagination
            className="bg-muted/20 border-t"
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.pagination?.total ?? prescriptions.length}
            onPageChange={setPage}
            itemLabel="prescriptions"
          />
        )}
      </div>
    </div>
  );
}
