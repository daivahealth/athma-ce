'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, CheckCircle2, ClipboardList, Search, XCircle } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AppCalendar as CalendarPicker } from '@/components/ui/app-calendar';
import { useAdmissionsSearch, useInitiateDischarge } from '@/modules/clinical/hooks/use-inpatient';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { AdmissionStatus } from '@/modules/clinical/types/inpatient';
import { bedService } from '@/modules/foundation/services/bed-service';
import { wardService } from '@/modules/foundation/services/ward-service';
import { useToast } from '@/components/ui/use-toast';

const dischargeStatusTone = (status?: string) => {
  const normalized = status?.toUpperCase() ?? 'NONE';
  if (normalized === 'READY') {
    return { label: 'Ready', className: 'bg-emerald-500 text-white' };
  }
  if (normalized === 'INITIATED' || normalized === 'PLANNING') {
    return { label: 'Planning', className: 'bg-amber-500 text-white' };
  }
  if (normalized === 'APPROVED') {
    return { label: 'Approved', className: 'bg-sky-500 text-white' };
  }
  if (normalized === 'CONFIRMED' || normalized === 'EXECUTED') {
    return { label: 'Discharged', className: 'bg-slate-900 text-white' };
  }
  if (normalized === 'CANCELLED') {
    return { label: 'Cancelled', className: 'bg-rose-500 text-white' };
  }
  return { label: 'Not started', className: 'bg-slate-200 text-slate-700' };
};

export default function InpatientDischargesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const toast = useToast();
  const wardId = 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dischargeStatusFilter, setDischargeStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'range'>('today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return { from: now, to: now };
  });
  const [page, setPage] = useState(1);
  const limit = 20;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [targetDischargeDate, setTargetDischargeDate] = useState('');
  const [targetDischargeTime, setTargetDischargeTime] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');

  const todayRange = useMemo(() => {
    const now = new Date();
    return {
      startDate: startOfDay(now).toISOString(),
      endDate: endOfDay(now).toISOString(),
    };
  }, []);
  const yesterdayRange = useMemo(() => {
    const now = new Date();
    const yesterday = subDays(now, 1);
    return {
      startDate: startOfDay(yesterday).toISOString(),
      endDate: endOfDay(yesterday).toISOString(),
    };
  }, []);
  const activeRange = useMemo(() => {
    if (dateFilter === 'today') return todayRange;
    if (dateFilter === 'yesterday') return yesterdayRange;
    if (dateFilter === 'range' && dateRange?.from) {
      const from = startOfDay(dateRange.from).toISOString();
      const toDate = dateRange.to ?? dateRange.from;
      const to = endOfDay(toDate).toISOString();
      return { startDate: from, endDate: to };
    }
    return { startDate: undefined, endDate: undefined };
  }, [dateFilter, dateRange, todayRange, yesterdayRange]);
  const rangeLabel = useMemo(() => {
    if (!dateRange?.from) return 'Select date range';
    if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return format(dateRange.from, 'MMM d, yyyy');
  }, [dateRange]);

  const searchParams = useMemo(
    () => ({
      searchTerm: debouncedQuery.trim() || undefined,
      status: statusFilter !== 'all' ? (statusFilter as AdmissionStatus) : undefined,
      admissionDateFrom: activeRange.startDate,
      admissionDateTo: activeRange.endDate,
      wardId: wardId !== 'all' ? wardId : undefined,
      limit,
      offset: (page - 1) * limit,
      sortBy: 'admissionDate',
      sortOrder: 'desc',
    }),
    [activeRange.endDate, activeRange.startDate, debouncedQuery, limit, page, statusFilter, wardId]
  );

  const { data, isLoading } = useAdmissionsSearch(searchParams);
  const rawAdmissions = data?.data ?? [];

  const admissions = useMemo(() => {
    if (dischargeStatusFilter === 'all') return rawAdmissions;
    return rawAdmissions.filter((admission: any) => {
      const dischargeStatus = admission.dischargeStatus ?? 'NONE';
      return dischargeStatus.toLowerCase() === dischargeStatusFilter.toLowerCase();
    });
  }, [rawAdmissions, dischargeStatusFilter]);

  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) || 1 : 1;
  const wardIds = useMemo(
    () => Array.from(new Set(admissions.map((admission: any) => admission.currentWardId).filter(Boolean))),
    [admissions]
  );
  const bedIds = useMemo(
    () => Array.from(new Set(admissions.map((admission: any) => admission.currentBedId).filter(Boolean))),
    [admissions]
  );

  const wardQueries = useQueries({
    queries: wardIds.map((id) => ({
      queryKey: ['ward', id],
      queryFn: () => wardService.getById(id),
      enabled: !!id,
    })),
  });
  const bedQueries = useQueries({
    queries: bedIds.map((id) => ({
      queryKey: ['bed', id],
      queryFn: () => bedService.getById(id),
      enabled: !!id,
    })),
  });

  const wardsById = useMemo(() => {
    const map = new Map<string, any>();
    wardQueries.forEach((query) => {
      if (query.data?.id) {
        map.set(query.data.id, query.data);
      }
    });
    return map;
  }, [wardQueries]);

  const bedsById = useMemo(() => {
    const map = new Map<string, any>();
    bedQueries.forEach((query) => {
      if (query.data?.id) {
        map.set(query.data.id, query.data);
      }
    });
    return map;
  }, [bedQueries]);

  const initiateDischargeMutation = useInitiateDischarge(selectedAdmission?.id ?? '');

  const openInitiateDialog = (admission: any) => {
    setSelectedAdmission(admission);
    setTargetDischargeDate('');
    setTargetDischargeTime('');
    setApprovalRequired(Boolean(admission?.approvalRequired));
    setInternalNotes('');
    setDialogOpen(true);
  };

  const handleInitiateDischarge = async () => {
    if (!selectedAdmission?.id) return;
    try {
      await initiateDischargeMutation.mutateAsync({
        targetDischargeDate: targetDischargeDate || undefined,
        targetDischargeTime: targetDischargeTime || undefined,
        approvalRequired,
        internalNotes: internalNotes.trim() || undefined,
      });
      toast({ title: 'Discharge initiated', description: 'Discharge planning has started.', variant: 'success' });
      setDialogOpen(false);
      setSelectedAdmission(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to initiate discharge.';
      toast({ title: 'Discharge failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discharges</h1>
          <p className="mt-1 text-muted-foreground">Plan, track, and execute inpatient discharges.</p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/inpatient/discharges/new`)}>
          <ClipboardList className="mr-2 h-4 w-4" />
          New Discharge
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,200px))]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by patient name or MRN"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Admission status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DISCHARGED">Discharged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dischargeStatusFilter} onValueChange={setDischargeStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Discharge status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Discharge Statuses</SelectItem>
                <SelectItem value="NONE">Not Started</SelectItem>
                <SelectItem value="INITIATED">Planning</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="CONFIRMED">Discharged</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {rangeLabel}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={dateFilter === 'today' ? 'default' : 'outline'}
                      onClick={() => setDateFilter('today')}
                    >
                      Today
                    </Button>
                    <Button
                      size="sm"
                      variant={dateFilter === 'yesterday' ? 'default' : 'outline'}
                      onClick={() => setDateFilter('yesterday')}
                    >
                      Yesterday
                    </Button>
                    <Button
                      size="sm"
                      variant={dateFilter === 'range' ? 'default' : 'outline'}
                      onClick={() => setDateFilter('range')}
                    >
                      Range
                    </Button>
                  </div>
                  <CalendarPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateFilter('range');
                      setDateRange(range);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading discharges...</p>}
          {!isLoading && admissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No discharges found.</p>
          )}
          {!isLoading && admissions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Discharge Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((admission: any, index: number) => {
                  const dischargeStatus = admission.dischargeStatus ?? 'NONE';
                  const tone = dischargeStatusTone(dischargeStatus);
                  return (
                    <TableRow key={admission.id ?? index}>
                      <TableCell>{admission.admissionNumber ?? 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {admission.patient?.firstName
                              ? `${admission.patient.firstName} ${admission.patient.lastName ?? ''}`.trim()
                              : 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">MRN: {admission.patient?.mrn ?? 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const ward = wardsById.get(admission.currentWardId);
                          const bed = bedsById.get(admission.currentBedId);
                          if (!ward && !bed) return admission.currentBedId ?? 'N/A';
                          const wardName = ward?.name ?? ward?.wardName ?? 'Ward';
                          const bedNumber = bed?.bedNumber ?? bed?.label ?? 'Bed';
                          return `${wardName} · ${bedNumber}`;
                        })()}
                      </TableCell>
                      <TableCell>
                        <Badge className={tone.className}>{tone.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/${params.locale}/inpatient/discharges/${admission.id}`)
                            }
                          >
                            View
                          </Button>
                          {dischargeStatus === 'NONE' && (
                            <Button size="sm" onClick={() => openInitiateDialog(admission)}>
                              Initiate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {meta && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {admissions.length} of {meta.total} admissions
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Initiate Discharge</DialogTitle>
            <DialogDescription>Start discharge planning for this admission.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-discharge-date">Target discharge date</Label>
                <Input
                  id="target-discharge-date"
                  type="date"
                  value={targetDischargeDate}
                  onChange={(event) => setTargetDischargeDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-discharge-time">Target discharge time</Label>
                <Input
                  id="target-discharge-time"
                  type="time"
                  value={targetDischargeTime}
                  onChange={(event) => setTargetDischargeTime(event.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                {approvalRequired ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-slate-400" />
                )}
                Approval required
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setApprovalRequired((prev) => !prev)}
              >
                {approvalRequired ? 'Required' : 'Not required'}
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal-notes">Internal notes</Label>
              <Textarea
                id="internal-notes"
                rows={3}
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
                placeholder="Add discharge planning notes"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleInitiateDischarge}
                disabled={initiateDischargeMutation.isPending}
              >
                {initiateDischargeMutation.isPending ? 'Starting...' : 'Start Planning'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
