'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Radiation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useRadiationPrescriptions } from '@/plugins/oncology/hooks/use-oncology';
import { PageHeader } from '@/components/ui/page-header';
import type { RadiationPrescription } from '@/plugins/oncology/types';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  APPROVED: 'bg-info/10 text-info',
  ACTIVE: 'bg-success/10 text-success',
  COMPLETED: 'bg-primary/10 text-primary',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

export default function RadiationListPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useRadiationPrescriptions(
    statusFilter ? { status: statusFilter } : undefined,
  );
  const prescriptions: RadiationPrescription[] = data?.data ?? [];

  const filtered = prescriptions.filter((rx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = rx.patientDisplay?.displayName?.toLowerCase() ?? '';
    const mrn = rx.patientDisplay?.mrn?.toLowerCase() ?? '';
    const num = rx.prescription_number?.toLowerCase() ?? '';
    return name.includes(q) || mrn.includes(q) || num.includes(q);
  });

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
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter || '__all'} onValueChange={(v) => setStatusFilter(v === '__all' ? '' : v)}>
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
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No radiation prescriptions found.</td></tr>
            ) : (
              filtered.map((rx) => (
                <tr
                  key={rx.id}
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => router.push(`/${params.locale}/oncology/radiation/${rx.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{rx.patientDisplay?.displayName ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">
                      {rx.patientDisplay?.mrn && `MRN: ${rx.patientDisplay.mrn}`}
                      {rx.patientDisplay?.age != null && ` · ${rx.patientDisplay.age}y`}
                      {rx.patientDisplay?.gender && ` · ${rx.patientDisplay.gender}`}
                    </div>
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
      </div>

      {data?.pagination && (
        <p className="text-xs text-muted-foreground text-right">
          {data.pagination.total} prescription{data.pagination.total !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  );
}
