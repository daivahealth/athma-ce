'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Plus, Search, FileText, Calendar, User, Stethoscope } from 'lucide-react';

import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useEncounters } from '@/modules/clinical/hooks/use-encounters';
import { EncounterStatus } from '@/modules/clinical/types/encounter';
import { useStaff } from '@/modules/foundation/hooks/use-staff';

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
  const [page, setPage] = useState(1);

  const { data: encountersData, isLoading } = useEncounters({
    search: searchQuery,
    status: statusFilter !== 'all' ? (statusFilter as EncounterStatus) : undefined,
    page,
    limit: 20,
  });

  // Fetch all staff for name mapping
  const { data: staffData } = useStaff({ status: 'active' });

  const encounters = encountersData?.data || [];
  const meta = encountersData?.meta;

  // Create a map of staff ID to staff name for quick lookup
  const staffMap = useMemo(() => {
    const map = new Map<string, string>();
    staffData?.data?.forEach((staff: any) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { label: 'Encounters' },
          ]}
        />
        <Button onClick={() => router.push(`/${params.locale}/encounters/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New Encounter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Encounters</CardTitle>
          <CardDescription>Manage patient clinical encounters and visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search encounters by chief complaint, symptoms..."
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
                  : 'Get started by creating a new encounter'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
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
                    <TableHead>MRN</TableHead>
                    <TableHead>Primary Staff</TableHead>
                    <TableHead>Chief Complaint</TableHead>
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
                          <div>
                            {encounter.patient?.displayName ||
                              `${encounter.patient?.title ? encounter.patient.title + '. ' : ''}${encounter.patient?.firstName} ${encounter.patient?.lastName}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {encounter.patient?.mrn}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span>{staffMap.get(encounter.primaryStaffId) || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{encounter.chiefComplaint || '-'}</TableCell>
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

              {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {encounters.length} of {meta.total} encounters
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
                      onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
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
