'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useBedBrowser } from '@/modules/clinical/hooks/use-bed-browser';
import type { BedBrowserBed, BedBrowserStatus } from '@/modules/clinical/types/bed-browser';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { useAdmission } from '@/modules/clinical/hooks/use-inpatient';
import { bedBrowserService } from '@/modules/clinical/services/bed-browser-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const bedStatusMeta: Record<
  BedBrowserStatus,
  { label: string; cardClass: string; badgeClass: string; dotClass: string }
> = {
  available: {
    label: 'Available',
    cardClass:
      'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-950/30',
    badgeClass:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-200',
    dotClass: 'bg-emerald-500 dark:bg-emerald-400',
  },
  occupied: {
    label: 'Occupied',
    cardClass: 'border-rose-200 bg-rose-50/50 dark:border-rose-500/40 dark:bg-rose-950/30',
    badgeClass:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-200',
    dotClass: 'bg-rose-500 dark:bg-rose-400',
  },
  cleaning: {
    label: 'Cleaning',
    cardClass: 'border-blue-200 bg-blue-50/50 dark:border-blue-500/40 dark:bg-blue-950/30',
    badgeClass:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/40 dark:text-blue-200',
    dotClass: 'bg-blue-500 dark:bg-blue-400',
  },
  maintenance: {
    label: 'Maintenance',
    cardClass:
      'border-amber-200 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-950/30',
    badgeClass:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
  },
};

export default function BedBrowserPage({ params }: { params: { locale: string } }) {
  const [wardFilter, setWardFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<BedBrowserStatus | 'all'>('all');
  const [selectedBed, setSelectedBed] = useState<BedBrowserBed | null>(null);
  const selectedPatientId = selectedBed?.occupant?.patientId ?? '';
  const selectedAdmissionId = selectedBed?.occupant?.admissionId ?? '';
  const patientQuery = usePatient(selectedPatientId);
  const admissionQuery = useAdmission(selectedAdmissionId);
  const queryClient = useQueryClient();
  const bedFilters = useMemo(
    () => ({
      wardId: wardFilter !== 'all' ? wardFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }),
    [wardFilter, statusFilter]
  );
  const wardOptionsFilters = useMemo(() => ({}), []);
  const bedsQuery = useBedBrowser(bedFilters);
  const wardOptionsQuery = useBedBrowser(wardOptionsFilters);
  const patientAge = useMemo(() => {
    const dob = (patientQuery.data as any)?.dateOfBirth;
    if (!dob) return null;
    const date = new Date(dob);
    if (Number.isNaN(date.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age -= 1;
    }
    return age;
  }, [patientQuery.data]);

  const refreshBeds = () => queryClient.invalidateQueries({ queryKey: ['inpatient', 'bed-browser'] });
  const cleaningRequiredMutation = useMutation({
    mutationFn: (bedId: string) => bedBrowserService.markCleaningRequired(bedId),
    onSuccess: refreshBeds,
  });
  const cleaningCompleteMutation = useMutation({
    mutationFn: (bedId: string) => bedBrowserService.markCleaningComplete(bedId),
    onSuccess: refreshBeds,
  });
  const maintenanceStartMutation = useMutation({
    mutationFn: (bedId: string) => bedBrowserService.markMaintenanceStart(bedId),
    onSuccess: refreshBeds,
  });
  const maintenanceCompleteMutation = useMutation({
    mutationFn: (bedId: string) => bedBrowserService.markMaintenanceComplete(bedId),
    onSuccess: refreshBeds,
  });

  const summary = useMemo(() => {
    return bedsQuery.data?.summary ?? {
      total: 0,
      available: 0,
      occupied: 0,
      cleaning: 0,
      maintenance: 0,
    };
  }, [bedsQuery.data]);

  const wardOptions = useMemo(() => {
    const beds = wardOptionsQuery.data?.beds ?? [];
    const unique = new Map<string, string>();
    beds.forEach((bed) => {
      if (bed.wardId && bed.wardName) {
        unique.set(bed.wardId, bed.wardName);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [wardOptionsQuery.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Central Bed Management</h1>
          <p className="text-sm text-muted-foreground">Real-time occupancy tracking & assignment</p>
        </div>
        <Button asChild>
          <Link href={`/${params.locale}/inpatient/admissions/new`}>+ Admit Patient</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-slate-200/70 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
          <CardContent className="space-y-2 pt-6">
            <p className="text-xs uppercase text-muted-foreground">Total Beds</p>
            <p className="text-3xl font-semibold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card className={bedStatusMeta.available.cardClass}>
          <CardContent className="space-y-2 pt-6">
            <p className="text-xs uppercase text-emerald-700 dark:text-emerald-200">Available</p>
            <p className="text-3xl font-semibold text-emerald-700 dark:text-emerald-200">
              {summary.available}
            </p>
          </CardContent>
        </Card>
        <Card className={bedStatusMeta.occupied.cardClass}>
          <CardContent className="space-y-2 pt-6">
            <p className="text-xs uppercase text-rose-700 dark:text-rose-200">Occupied</p>
            <p className="text-3xl font-semibold text-rose-700 dark:text-rose-200">
              {summary.occupied}
            </p>
          </CardContent>
        </Card>
        <Card className={bedStatusMeta.cleaning.cardClass}>
          <CardContent className="space-y-2 pt-6">
            <p className="text-xs uppercase text-blue-700 dark:text-blue-200">Cleaning</p>
            <p className="text-3xl font-semibold text-blue-700 dark:text-blue-200">
              {summary.cleaning}
            </p>
          </CardContent>
        </Card>
        <Card className={bedStatusMeta.maintenance.cardClass}>
          <CardContent className="space-y-2 pt-6">
            <p className="text-xs uppercase text-amber-700 dark:text-amber-200">Maintenance</p>
            <p className="text-3xl font-semibold text-amber-700 dark:text-amber-200">
              {summary.maintenance}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All wards</SelectItem>
              {wardOptions.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BedBrowserStatus | 'all')}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Bed Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {bedsQuery.isLoading && <p className="text-sm text-muted-foreground">Loading beds...</p>}
      {!bedsQuery.isLoading && (bedsQuery.data?.beds.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">No beds match the selected filters.</p>
      )}
      {(bedsQuery.data?.beds.length ?? 0) > 0 && (
        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10">
          {bedsQuery.data?.beds.map((bed) => {
            const meta = bedStatusMeta[bed.status];
            const occupantName = bed.occupant?.patientName;
            return (
              <button
                key={bed.bedId}
                type="button"
                onClick={() => setSelectedBed(bed)}
                className="text-left"
              >
                <Card className={cn('border-2 transition hover:shadow-sm', meta.cardClass)}>
                  <CardContent className="space-y-3 px-3 pb-3 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{bed.bedNumber}</p>
                      <span className={cn('h-2 w-2 rounded-full', meta.dotClass)} />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('w-full justify-center px-2 text-[10px]', meta.badgeClass)}
                    >
                      {meta.label.toUpperCase()}
                    </Badge>
                    {occupantName && (
                      <p className="text-[10px] text-muted-foreground">{occupantName}</p>
                    )}
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedBed} onOpenChange={(open) => (!open ? setSelectedBed(null) : null)}>
        <DialogContent>
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>{selectedBed?.bedNumber ?? 'Bed Details'}</DialogTitle>
            <DialogDescription>{selectedBed?.wardName ?? 'Ward'}</DialogDescription>
          </DialogHeader>
          {selectedBed && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={cn('font-medium', bedStatusMeta[selectedBed.status].badgeClass)}>
                  {bedStatusMeta[selectedBed.status].label}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedBed.status !== 'cleaning' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cleaningRequiredMutation.mutate(selectedBed.bedId)}
                    disabled={cleaningRequiredMutation.isPending}
                  >
                    Mark Cleaning Required
                  </Button>
                )}
                {selectedBed.status === 'cleaning' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cleaningCompleteMutation.mutate(selectedBed.bedId)}
                    disabled={cleaningCompleteMutation.isPending}
                  >
                    Mark Cleaning Complete
                  </Button>
                )}
                {selectedBed.status !== 'maintenance' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => maintenanceStartMutation.mutate(selectedBed.bedId)}
                    disabled={maintenanceStartMutation.isPending}
                  >
                    Mark Maintenance
                  </Button>
                )}
                {selectedBed.status === 'maintenance' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => maintenanceCompleteMutation.mutate(selectedBed.bedId)}
                    disabled={maintenanceCompleteMutation.isPending}
                  >
                    Clear Maintenance
                  </Button>
                )}
              </div>
              {selectedBed.status === 'available' && (
                <Button asChild className="w-full">
                  <Link
                    href={`/${params.locale}/inpatient/admissions/new?bedId=${selectedBed.bedId}&wardId=${selectedBed.wardId}`}
                  >
                    Admit Patient To This Bed
                  </Link>
                </Button>
              )}
              {selectedBed.occupant && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Patient</span>
                    <span>
                      {(() => {
                        const patient = patientQuery.data as any;
                        const name =
                          patient?.fullName ||
                          `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim();
                        return name || selectedBed.occupant?.patientName || 'Unknown';
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Age / Gender</span>
                    <span>{`${patientAge ?? 'N/A'} yrs · ${(patientQuery.data as any)?.gender ?? 'N/A'}`}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">MRN</span>
                    <span>{(patientQuery.data as any)?.mrn ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Admission</span>
                    <span>{(admissionQuery.data as any)?.admissionNumber ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Admission Status</span>
                    <span>{(admissionQuery.data as any)?.status ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Admission Date</span>
                    <span>
                      {(admissionQuery.data as any)?.admissionDate
                        ? format(new Date((admissionQuery.data as any)?.admissionDate), 'MMM d, yyyy')
                        : 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
