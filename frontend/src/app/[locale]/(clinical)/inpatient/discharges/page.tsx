'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, CheckCircle2, ClipboardList, Search, XCircle } from 'lucide-react';
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
import { useDischargesSearch } from '@/modules/clinical/hooks/use-discharge';
import { useInitiateDischarge } from '@/modules/clinical/hooks/use-inpatient';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useToast } from '@/components/ui/use-toast';

const dischargeStatusTone = (status?: string) => {
  const normalized = status?.toUpperCase() ?? '';
  if (normalized === 'READY') {
    return { label: 'Ready', className: 'bg-emerald-500 text-white' };
  }
  if (normalized === 'PLANNING') {
    return { label: 'Planning', className: 'bg-amber-500 text-white' };
  }
  if (normalized === 'APPROVED') {
    return { label: 'Approved', className: 'bg-sky-500 text-white' };
  }
  if (normalized === 'EXECUTED') {
    return { label: 'Discharged', className: 'bg-slate-900 text-white' };
  }
  if (normalized === 'CANCELLED') {
    return { label: 'Cancelled', className: 'bg-rose-500 text-white' };
  }
  return { label: 'Unknown', className: 'bg-slate-200 text-slate-700' };
};

export default function InpatientDischargesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const toast = useToast();
  const wardId = 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
      status: statusFilter !== 'all' ? statusFilter : undefined,
      dischargeDateFrom: activeRange.startDate,
      dischargeDateTo: activeRange.endDate,
      wardId: wardId !== 'all' ? wardId : undefined,
      limit,
      offset: (page - 1) * limit,
      sortBy: 'actualDischargeDate',
      sortOrder: 'desc' as const,
    }),
    [activeRange.endDate, activeRange.startDate, debouncedQuery, limit, page, statusFilter, wardId]
  );

  const { data, isLoading } = useDischargesSearch(searchParams);
  const discharges = data?.data ?? [];

  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) || 1 : 1;

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
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,200px))]">
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
                <SelectValue placeholder="Discharge status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PLANNING">Planning</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="EXECUTED">Discharged</SelectItem>
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
          {!isLoading && discharges.length === 0 && (
            <p className="text-sm text-muted-foreground">No discharges found.</p>
          )}
          {!isLoading && discharges.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Discharge Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discharges.map((discharge: any, index: number) => {
                  const tone = dischargeStatusTone(discharge.status);
                  const admission = discharge.admission;
                  return (
                    <TableRow key={discharge.id ?? index}>
                      <TableCell>{admission?.admissionNumber ?? 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {discharge.patientDisplay?.displayName || 'Unknown patient'}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                            <span>MRN: {discharge.patientDisplay?.mrn || '—'}</span>
                            <span>•</span>
                            <span>
                              {discharge.patientDisplay?.gender || '—'} / {discharge.patientDisplay?.age || '—'}y
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {discharge.admissionDate
                          ? format(new Date(discharge.admissionDate), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          // Use denormalized fields from admission if available
                          const wardName = admission?.currentWardName;
                          const bedNumber = admission?.currentBedNumber;

                          if (!wardName && !bedNumber) return 'N/A';
                          if (!wardName) return bedNumber;
                          if (!bedNumber) return wardName;
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
                              router.push(`/${params.locale}/inpatient/discharges/${admission?.id}`)
                            }
                          >
                            View
                          </Button>
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
                Showing {discharges.length} of {meta.total} discharges
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
