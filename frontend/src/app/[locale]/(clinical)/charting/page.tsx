'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Search, FileText, Calendar, Stethoscope } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  arrived: 'bg-purple-100 text-purple-800',
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
  const [statusFilter, setStatusFilter] = useState<'all' | EncounterStatus>(EncounterStatus.IN_PROGRESS);
  const [page, setPage] = useState(1);

  const { data: encountersResponse, isLoading, error } = useEncounters({
    search: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
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
  const meta = encountersResponse?.meta;

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
                  : 'Create or update an encounter to begin charting.'}
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
                        {encounter.patient?.displayName ||
                          `${encounter.patient?.title ? `${encounter.patient.title}. ` : ''}${encounter.patient?.firstName ?? ''} ${encounter.patient?.lastName ?? ''}`.trim() ||
                            'Unknown patient'}
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

              {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {encounters.length} of {meta.total} encounters
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
                      onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
                      disabled={page === meta.totalPages}
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
