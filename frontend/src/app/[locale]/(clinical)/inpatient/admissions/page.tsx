'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Search } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppCalendar as CalendarPicker } from '@/components/ui/app-calendar';
import { useAdmissionsSearch } from '@/modules/clinical/hooks/use-inpatient';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { AdmissionStatus } from '@/modules/clinical/types/inpatient';
import { bedService } from '@/modules/foundation/services/bed-service';
import { wardService } from '@/modules/foundation/services/ward-service';

export default function InpatientAdmissionsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [wardId, setWardId] = useState('all');
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
    if (dateFilter === 'today') {
      return todayRange;
    }
    if (dateFilter === 'yesterday') {
      return yesterdayRange;
    }
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

  const searchParams = useMemo(() => ({
    searchTerm: debouncedQuery.trim() || undefined,
    status: statusFilter !== 'all' ? (statusFilter as AdmissionStatus) : undefined,
    admissionDateFrom: activeRange.startDate,
    admissionDateTo: activeRange.endDate,
    wardId: wardId !== 'all' ? wardId : undefined,
    limit,
    offset: (page - 1) * limit,
    sortBy: 'admissionDate',
    sortOrder: 'desc',
  }), [activeRange.endDate, activeRange.startDate, debouncedQuery, limit, page, statusFilter, wardId]);

  const { data, isLoading } = useAdmissionsSearch(searchParams);
  const admissions = data?.data ?? [];
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
    wardIds.forEach((id, index) => {
      const ward = wardQueries[index]?.data as any;
      if (ward) {
        map.set(id, ward);
      }
    });
    return map;
  }, [wardIds, wardQueries]);

  const bedsById = useMemo(() => {
    const map = new Map<string, any>();
    bedIds.forEach((id, index) => {
      const bed = bedQueries[index]?.data as any;
      if (bed) {
        map.set(id, bed);
      }
    });
    return map;
  }, [bedIds, bedQueries]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inpatient Admissions</h1>
          <p className="text-muted-foreground mt-1">Search by patient name or MRN, status, and date</p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/inpatient/admissions/new`)}>
          New Admission
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by patient name or MRN"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ward</Label>
            <Select value={wardId} onValueChange={setWardId}>
              <SelectTrigger>
                <SelectValue placeholder="All wards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All wards</SelectItem>
                {wardIds.length === 0 && <SelectItem value="none" disabled>No wards available</SelectItem>}
                {wardIds.map((id) => {
                  const ward = wardsById.get(id);
                  const label = ward?.name ?? ward?.wardName ?? id;
                  return (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="admitted">Admitted</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
                <SelectItem value="absconded">Absconded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as typeof dateFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Select date filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dateFilter === 'range' && (
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {rangeLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading admissions...</p>}
          {!isLoading && admissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No admissions found.</p>
          )}
          {!isLoading && admissions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((admission: any, index: number) => (
                  <TableRow
                    key={admission.id ?? index}
                    className="cursor-pointer"
                    onClick={() =>
                      admission.id &&
                      router.push(`/${params.locale}/inpatient/admissions/${admission.id}`)
                    }
                  >
                    <TableCell>{admission.admissionNumber ?? 'N/A'}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {admission.patient?.firstName
                            ? `${admission.patient.firstName} ${admission.patient.lastName ?? ''}`.trim()
                            : 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MRN: {admission.patient?.mrn ?? 'N/A'}
                        </p>
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
                    <TableCell>{admission.status ?? 'admitted'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {meta && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {admissions.length} of {meta.total} admissions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
