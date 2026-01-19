'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdmissionsSearch, useInitiateDischarge } from '@/modules/clinical/hooks/use-inpatient';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useToast } from '@/components/ui/use-toast';
import { AdmissionStatus } from '@/modules/clinical/types/inpatient';

export default function NewDischargePage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const [page, setPage] = useState(1);
  const limit = 10;

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
  const admissions = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) || 1 : 1;

  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
  const initiateMutation = useInitiateDischarge(selectedAdmissionId);

  const handleStartDischarge = async () => {
    if (!selectedAdmissionId) return;
    try {
      await initiateMutation.mutateAsync({});
      toast({ title: 'Discharge initiated', description: 'Discharge planning has started.', variant: 'success' });
      router.push(`/${params.locale}/inpatient/discharges/${selectedAdmissionId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to initiate discharge.';
      toast({ title: 'Discharge failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Discharge</h1>
          <p className="mt-1 text-muted-foreground">Search by patient name or MRN to start discharge planning.</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/${params.locale}/inpatient/discharges`)}>
          Back to Discharges
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
          {isLoading && <p className="text-sm text-muted-foreground">Loading admissions...</p>}
          {!isLoading && admissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No active admissions found.</p>
          )}
          {!isLoading && admissions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Select</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((admission: any) => (
                  <TableRow key={admission.id}>
                    <TableCell>{admission.admissionNumber ?? 'N/A'}</TableCell>
                    <TableCell>
                      {admission.patient?.firstName
                        ? `${admission.patient.firstName} ${admission.patient.lastName ?? ''}`.trim()
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>{admission.patient?.mrn ?? 'N/A'}</TableCell>
                    <TableCell>{admission.status ?? 'active'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={selectedAdmissionId === admission.id ? 'default' : 'outline'}
                        onClick={() => setSelectedAdmissionId(admission.id)}
                      >
                        {selectedAdmissionId === admission.id ? 'Selected' : 'Select'}
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

      <div className="flex items-center justify-end">
        <Button onClick={handleStartDischarge} disabled={!selectedAdmissionId || initiateMutation.isPending}>
          <ClipboardList className="mr-2 h-4 w-4" />
          {initiateMutation.isPending ? 'Starting...' : 'Start Discharge'}
        </Button>
      </div>
    </div>
  );
}
