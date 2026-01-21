'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdmissionsSearch } from '@/modules/clinical/hooks/use-inpatient';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { AdmissionStatus } from '@/modules/clinical/types/inpatient';

export default function DischargeSummariesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [page, setPage] = useState(1);
  const limit = 20;

  const searchParams = useMemo(
    () => ({
      searchTerm: debouncedQuery.trim() || undefined,
      status: AdmissionStatus.ACTIVE,
      limit,
      offset: (page - 1) * limit,
      sortBy: 'admissionDate',
      sortOrder: 'desc',
    }),
    [debouncedQuery, limit, page]
  );

  const { data, isLoading } = useAdmissionsSearch(searchParams);
  const rawAdmissions = data?.data ?? [];
  const admissions = useMemo(
    () => rawAdmissions.filter((admission: any) => (admission.dischargeStatus ?? 'NONE') !== 'NONE'),
    [rawAdmissions]
  );
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) || 1 : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discharge Summaries</h1>
          <p className="mt-1 text-muted-foreground">Review and edit discharge summary documents.</p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/inpatient/discharges/new`)}>
          New Discharge
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by patient name or MRN"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading discharge summaries...</p>}
          {!isLoading && admissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No discharge summaries found.</p>
          )}
          {!isLoading && admissions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((admission: any) => (
                  <TableRow key={admission.id}>
                    <TableCell>{admission.admissionNumber ?? 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                          {admission.patientDisplay?.displayName || 'Unknown patient'}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                          <span>MRN: {admission.patientDisplay?.mrn || '—'}</span>
                          <span>•</span>
                          <span>
                            {admission.patientDisplay?.gender || '—'} / {admission.patientDisplay?.age || '—'}y
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{admission.dischargeStatus ?? 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/${params.locale}/inpatient/discharge-summaries/${admission.id}`)}
                      >
                        Open Summary
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  );
}
