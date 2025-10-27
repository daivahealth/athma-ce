'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, User, Eye } from 'lucide-react';
import type { Patient } from '@/modules/clinical/types/patient';

export default function PatientsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const t = useTranslations('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const timer = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const { data, isLoading, error } = usePatients({
    search: debouncedQuery,
    page: 1,
    limit: 20
  });

  // Debug: Log error details
  if (error) {
    console.error('Patient fetch error:', error);
    console.error('Error response:', (error as any)?.response?.data);
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground mt-1">
            Manage patient records and information
          </p>
        </div>
        <Button
          onClick={() => router.push(`/${params.locale}/patients/new`)}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          New Patient
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, MRN, or phone number..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Patient List */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Loading patients..." />
        </div>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-destructive font-semibold mb-2">
            Error loading patients
          </p>
          <p className="text-sm text-muted-foreground">
            {(error as any)?.response?.data?.message || 'Please try again or contact support.'}
          </p>
          {(error as any)?.response?.status === 400 && (
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Make sure you're logged in with a valid account.
            </p>
          )}
        </Card>
      )}

      {!isLoading && !error && data?.data && (
        <div className="space-y-4">
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Found {data.pagination.total} patient{data.pagination.total !== 1 ? 's' : ''}
          </div>

          {/* Patient Table */}
          {data.data.length === 0 ? (
            <Card className="p-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No patients found</p>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Get started by adding your first patient'}
              </p>
              <Button
                onClick={() => router.push(`/${params.locale}/patients/new`)}
                variant="outline"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MRN</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((patient: Patient) => (
                    <TableRow
                      key={patient.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/${params.locale}/patients/${patient.id}`)}
                    >
                      <TableCell className="font-medium font-mono text-sm">
                        {patient.mrn}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {patient.firstName} {patient.middleName && `${patient.middleName} `}{patient.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        {calculateAge(patient.dateOfBirth)} years
                      </TableCell>
                      <TableCell className="capitalize">
                        {patient.gender}
                      </TableCell>
                      <TableCell>
                        {patient.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={patient.status === 'active' ? 'default' : 'secondary'}
                          className={
                            patient.status === 'active'
                              ? 'bg-green-500 hover:bg-green-600'
                              : patient.status === 'inactive'
                              ? 'bg-yellow-500 hover:bg-yellow-600'
                              : 'bg-gray-500 hover:bg-gray-600'
                          }
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${params.locale}/patients/${patient.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Pagination Info */}
          {data.data.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {data.data.length} of {data.pagination.total} patients
            </div>
          )}
        </div>
      )}
    </div>
  );
}
