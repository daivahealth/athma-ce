import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department-service';
import { wardService } from '../services/ward-service';
import { clinicService } from '../services/clinic-service';
import { bedService } from '../services/bed-service';
import { spaceService } from '../services/space-service';
import type { Department } from '../services/department-service';
import type { Ward } from '../services/ward-service';
import type { Clinic } from '../services/clinic-service';
import type { Bed } from '../services/bed-service';
import type { Space } from '../types/space';

export interface FacilityHierarchy {
  departments: Department[];
  wardsByDepartmentId: Record<string, Ward[]>;
  clinicsByDepartmentId: Record<string, Clinic[]>;
  bedsByWardId: Record<string, Bed[]>;
  spacesByDepartmentId: Record<string, Space[]>;
  spacesByClinicId: Record<string, Space[]>;
  unassignedSpaces: Space[];
}

const groupBy = <T,>(items: T[], keyFn: (item: T) => string | null | undefined) => {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!key) {
      return acc;
    }
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

export function useFacilityHierarchy(facilityId: string | undefined, options?: { enabled?: boolean }) {
  return useQuery<FacilityHierarchy>({
    queryKey: ['facilities', facilityId, 'hierarchy'],
    queryFn: async () => {
      if (!facilityId) {
        throw new Error('Facility ID is required');
      }

      const [departments, spaces] = await Promise.all([
        departmentService.listByFacility(facilityId),
        spaceService.listByFacility(facilityId),
      ]);

      const wardLists = await Promise.all(
        departments.map((department) => wardService.listByDepartment(department.id))
      );
      const clinicLists = await Promise.all(
        departments.map((department) => clinicService.listByDepartment(department.id))
      );

      const wardsByDepartmentId = departments.reduce<Record<string, Ward[]>>((acc, department, index) => {
        acc[department.id] = wardLists[index] ?? [];
        return acc;
      }, {});

      const clinicsByDepartmentId = departments.reduce<Record<string, Clinic[]>>((acc, department, index) => {
        acc[department.id] = clinicLists[index] ?? [];
        return acc;
      }, {});

      const wards = wardLists.flat();
      const bedLists = await Promise.all(wards.map((ward) => bedService.listByWard(ward.id)));
      const bedsByWardId = wards.reduce<Record<string, Bed[]>>((acc, ward, index) => {
        acc[ward.id] = bedLists[index] ?? [];
        return acc;
      }, {});

      const spacesByClinicId = groupBy(spaces, (space) => space.clinicId ?? null);
      const spacesByDepartmentId = groupBy(spaces, (space) => space.departmentId ?? null);
      const unassignedSpaces = spaces.filter((space) => !space.departmentId && !space.clinicId);

      return {
        departments,
        wardsByDepartmentId,
        clinicsByDepartmentId,
        bedsByWardId,
        spacesByDepartmentId,
        spacesByClinicId,
        unassignedSpaces,
      };
    },
    enabled: options?.enabled ?? !!facilityId,
  });
}
