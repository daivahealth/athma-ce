import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department-service';
import { wardService } from '../services/ward-service';
import type { Ward } from '../services/ward-service';

export function useFacilityWards(facilityId: string | undefined) {
  return useQuery<Ward[]>({
    queryKey: ['wards', 'facility', facilityId],
    queryFn: async () => {
      if (!facilityId) {
        return [];
      }
      let departments = await departmentService.listByFacility(facilityId, 'ipd');
      if (departments.length === 0) {
        departments = await departmentService.listByFacility(facilityId);
      }
      const wardLists = await Promise.all(
        departments.map((department) => wardService.listByDepartment(department.id))
      );
      return wardLists.flat();
    },
    enabled: !!facilityId,
  });
}
