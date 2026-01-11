import { useQuery } from '@tanstack/react-query';
import { staffService } from '../services/staff-service';
import type { StaffMember } from '../types/staff';

const STAFF_QUERY_KEY = ['staff', 'list'] as const;

export function useStaffList() {
  return useQuery<StaffMember[]>({
    queryKey: STAFF_QUERY_KEY,
    queryFn: () => staffService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

// Add useStaff hook with filters support
export function useStaff(filters?: { status?: string }) {
  return useQuery<{ data: StaffMember[] }>({
    queryKey: ['staff', 'list', filters],
    queryFn: () => staffService.list().then(data => ({ data })),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStaffSearch(filters: {
  displayName?: string;
  staffType?: string;
  status?: string;
  specialtyId?: string;
  facilityId?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery<{ data: StaffMember[]; meta: { total: number; limit: number; offset: number; hasMore: boolean } }>({
    queryKey: ['staff', 'search', filters],
    queryFn: () => staffService.search(filters),
    enabled: Boolean(filters.displayName?.trim()),
    staleTime: 60 * 1000,
  });
}

export function useStaffMember(id: string | undefined | null) {
  return useQuery({
    queryKey: ['staff', 'detail', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Staff ID is required');
      }
      return staffService.getById(id);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
