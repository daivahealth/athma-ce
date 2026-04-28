'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { Search, FileText, Calendar, Stethoscope } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppCalendar } from '@/components/ui/app-calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useEncounters } from '@/modules/clinical/hooks/use-encounters';
import { EncounterStatus } from '@/modules/clinical/types/encounter';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  arrived: 'bg-primary/10 text-primary',
  triaged: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_FILTERS: { value: 'all' | EncounterStatus; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: EncounterStatus.IN_PROGRESS, label: 'In Progress' },
  { value: EncounterStatus.ARRIVED, label: 'Arrived' },
  { value: EncounterStatus.TRIAGED, label: 'Triaged' },
  { value: EncounterStatus.PLANNED, label: 'Planned' },
  { value: EncounterStatus.FINISHED, label: 'Finished' },
  { value: EncounterStatus.CANCELLED, label: 'Cancelled' },
];

export default function ChartingLandingPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EncounterStatus>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'range'>('today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return { from: now, to: now };
  });
  const [page, setPage] = useState(1);
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

  const { data: encountersResponse, isLoading, error } = useEncounters({
    search: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    startDate: activeRange.startDate,
    endDate: activeRange.endDate,
    page,
    limit: 15,
  });

  const { data: staffData } = useStaff({ status: 'active' });

  const staffMap = useMemo(() => {
    const map = new Map<string, string>();
    (staffData?.data as StaffMember[] | undefined)?.forEach((staff) => {
      const name = staff.displayName || `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim();
      if (staff.id && name) {
        map.set(staff.id, name);
      }
    });
    return map;
  }, [staffData]);

  const encounters = encountersResponse?.data ?? [];
  const pagination = encountersResponse?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleOpenCharting = (encounterId: string) => {
    router.push(`/${params.locale}/encounters/${encounterId}/charting`);
  };

  const renderStatusBadge = (status: string) => (
    <Badge variant="outline" className={STATUS_STYLES[status] || 'bg-gray-100 text-gray-800'}>
      {status.replace('-', ' ').toUpperCase()}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clinical Charting</h1>
        <p className="text-muted-foreground">
          Launch the charting workspace for an active encounter to capture notes, diagnoses, orders, and prescriptions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find an encounter</CardTitle>
          <CardDescription>Search or filter to locate the encounter you need to chart.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or MRN"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as 'all' | EncounterStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dateFilter}
              onValueChange={(value) => {
                const next = value as 'today' | 'yesterday' | 'range';
                setDateFilter(next);
                if (next === 'range' && !dateRange?.from) {
                  const now = new Date();
                  setDateRange({ from: now, to: now });
                }
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
            {dateFilter === 'range' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2 md:w-auto">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {rangeLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <AppCalendar
                    mode="range"
                    numberOfMonths={2}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      setPage(1);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Unable to load encounters</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Something went wrong while fetching encounters.'}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8 text-sm text-muted-foreground">
              Loading encounters...
            </div>
          ) : encounters.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
              <FileText className="h-10 w-10" />
              <p>No encounters match your criteria.</p>
              <p className="text-sm">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting the search or status filter.'
                  : dateFilter === 'today'
                    ? 'No encounters scheduled for today. Try selecting yesterday or a date range.'
                    : dateFilter === 'yesterday'
                      ? 'No encounters scheduled for yesterday. Try selecting today or a date range.'
                    : 'No encounters in the selected date range. Try widening your range.'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Primary Staff</TableHead>
                    <TableHead>Encounter Class</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {encounters.map((encounter) => (
                    <TableRow key={encounter.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {encounter.patientDisplay?.displayName || 'Unknown patient'}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                            <span>MRN: {encounter.patientDisplay?.mrn || '—'}</span>
                            <span>•</span>
                            <span>
                              {encounter.patientDisplay?.gender || '—'} / {encounter.patientDisplay?.age || '—'}y
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span>{staffMap.get(encounter.primaryStaffId) || 'Unassigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{encounter.encounterClass}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(encounter.startTime), 'MMM d, yyyy h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(encounter.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleOpenCharting(encounter.id)}
                          disabled={encounter.status === EncounterStatus.FINISHED}
                        >
                          Open charting
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination && totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {encounters.length} of {pagination.total} encounters
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
