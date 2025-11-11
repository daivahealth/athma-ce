'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { ResourceTable } from '@/components/tables/resource-table';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Search, X, Plus } from 'lucide-react';

interface StaffRow {
  id: string;
  employeeId: string;
  name: string;
  staffType: string;
  specialty: string;
  languages: string;
  license: string;
  status: string;
}

const columns: ColumnDef<StaffRow>[] = [
  { accessorKey: 'employeeId', header: 'Employee ID' },
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'staffType',
    header: 'Staff Type',
    cell: ({ row }) => {
      const staffType = row.original.staffType;
      return <Badge variant="outline">{staffType}</Badge>;
    },
  },
  { accessorKey: 'specialty', header: 'Specialty' },
  {
    accessorKey: 'languages',
    header: 'Languages',
    cell: ({ row }) => {
      const languages = row.original.languages;
      return <span className="text-sm text-muted-foreground">{languages}</span>;
    },
  },
  { accessorKey: 'license', header: 'License' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === 'active' ? 'default' : status === 'inactive' ? 'secondary' : 'outline';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

function transformStaffToRow(staff: StaffMember): StaffRow {
  // Get primary specialty
  const primarySpecialty = staff.staffSpecialties?.find(s => s.primaryFlag);
  const specialtyName = primarySpecialty?.specialty?.name || 'Not assigned';

  // Format languages array
  const languagesDisplay = staff.languages?.length > 0
    ? staff.languages.join(', ')
    : 'Not specified';

  return {
    id: staff.id,
    employeeId: staff.employeeId,
    name: staff.displayName || `${staff.firstName} ${staff.lastName}`,
    staffType: staff.staffType || 'Not specified',
    specialty: specialtyName,
    languages: languagesDisplay,
    license: staff.licenseNumber || 'N/A',
    status: staff.status,
  };
}

export default function StaffPage({ params }: { params: { locale: string } }) {
  const { data: staffMembers, isLoading, error } = useStaffList();
  const [selectedStaffType, setSelectedStaffType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // Extract unique staff types from the data
  const staffTypes = useMemo(() => {
    if (!staffMembers) return [];
    const types = new Set(staffMembers.map(staff => staff.staffType).filter(Boolean));
    return Array.from(types).sort();
  }, [staffMembers]);

  // Filter staff members based on search query and staff type
  const filteredStaffMembers = useMemo(() => {
    if (!staffMembers) return [];

    let filtered = staffMembers;

    // Apply staff type filter
    if (selectedStaffType !== 'all') {
      filtered = filtered.filter(staff => staff.staffType === selectedStaffType);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(staff => {
        const name = (staff.displayName || `${staff.firstName} ${staff.lastName}`).toLowerCase();
        const specialty = staff.staffSpecialties?.find(s => s.primaryFlag)?.specialty?.name?.toLowerCase() || '';
        const license = staff.licenseNumber?.toLowerCase() || '';
        const languages = staff.languages?.join(' ').toLowerCase() || '';
        const staffType = staff.staffType?.toLowerCase() || '';

        return name.includes(query) ||
               specialty.includes(query) ||
               license.includes(query) ||
               languages.includes(query) ||
               staffType.includes(query);
      });
    }

    return filtered;
  }, [staffMembers, selectedStaffType, searchQuery]);

  const tableData = filteredStaffMembers.map(transformStaffToRow);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load staff members. Please try again.</p>
          <p className="text-sm text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  // Navigation handlers
  const handleRowClick = (row: StaffRow) => {
    router.push(`/${params.locale}/staff/${row.id}`);
  };

  const handleNewStaff = () => {
    router.push(`/${params.locale}/staff/new`);
  };

  // Clear all filters
  const hasActiveFilters = selectedStaffType !== 'all' || searchQuery.trim() !== '';
  const clearAllFilters = () => {
    setSelectedStaffType('all');
    setSearchQuery('');
  };

  // Filter component
  const filterComponent = (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            {selectedStaffType === 'all' ? 'All Types' : selectedStaffType}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by Staff Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedStaffType} onValueChange={setSelectedStaffType}>
            <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            {staffTypes.map((type) => (
              <DropdownMenuRadioItem key={type} value={type}>
                {type}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, specialty, license, language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filterComponent}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
          <Button
            size="sm"
            className="h-8"
            onClick={handleNewStaff}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Staff
          </Button>
        </div>
      </div>

      <ResourceTable
        title="Clinical Staff"
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        emptyState={
          hasActiveFilters
            ? 'No staff members match your search criteria.'
            : 'No staff members found.'
        }
      />
    </div>
  );
}
