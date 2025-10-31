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
