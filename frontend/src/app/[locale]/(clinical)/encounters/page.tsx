'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { Plus, Search, FileText, Calendar, User, Stethoscope } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppCalendar as CalendarPicker } from '@/components/ui/app-calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useEncounters } from '@/modules/clinical/hooks/use-encounters';
import type { EncounterStatus } from '@/modules/clinical/types/encounter';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  arrived: 'bg-purple-100 text-purple-800',
  triaged: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function EncountersPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const { data: encountersData, isLoading } = useEncounters({
    search: searchQuery,
    status: statusFilter !== 'all' ? (statusFilter as EncounterStatus) : undefined,
    startDate: activeRange.startDate,
    endDate: activeRange.endDate,
    page,
    limit: 20,
  });

  // Fetch all staff for name mapping
  const { data: staffData } = useStaff({ status: 'active' });

  const encounters = encountersData?.data || [];
  const pagination = encountersData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  // Create a map of staff ID to staff name for quick lookup
  const staffMap = useMemo(() => {
    const map = new Map<string, string>();
    (staffData?.data as StaffMember[] | undefined)?.forEach((staff) => {
      const name = staff.displayName || `${staff.firstName} ${staff.lastName}`;
      map.set(staff.id, name);
    });
    return map;
  }, [staffData]);

  const getStatusBadge = (status: string) => {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="outline" className={colorClass}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Encounters</h1>
          <p className="text-muted-foreground">Manage patient clinical encounters and visits</p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/encounters/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New Encounter
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search encounters by patient or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="arrived">Arrived</SelectItem>
                <SelectItem value="triaged">Triaged</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <SelectTrigger className="w-[200px]">
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
                  <Button variant="outline" className="justify-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {rangeLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarPicker
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

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading encounters...</div>
            </div>
          ) : encounters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No encounters found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : dateFilter === 'today'
                    ? 'No encounters scheduled for today. Try selecting yesterday or a date range.'
                    : dateFilter === 'yesterday'
                      ? 'No encounters scheduled for yesterday. Try selecting today or a date range.'
                      : 'No encounters in the selected date range. Try widening your range.'}
              </p>
              {!searchQuery && statusFilter === 'all' && dateFilter !== 'today' && (
                <Button onClick={() => router.push(`/${params.locale}/encounters/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Encounter
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Primary Staff</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {encounters.map((encounter) => (
                    <TableRow key={encounter.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">
                              {encounter.patientDisplay?.displayName || 'Unknown patient'}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>MRN: {encounter.patientDisplay?.mrn || '—'}</span>
                              <span>•</span>
                              <span>
                                {encounter.patientDisplay?.gender || '—'} / {encounter.patientDisplay?.age || '—'}y
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span>{staffMap.get(encounter.primaryStaffId) || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {encounter.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(encounter.startTime), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(encounter.status)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{encounter.encounterClass}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/${params.locale}/encounters/${encounter.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination && totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {encounters.length} of {pagination.total} encounters
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
