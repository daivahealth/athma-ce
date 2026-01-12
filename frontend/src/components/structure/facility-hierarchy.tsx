'use client';

import { useMemo, useState } from 'react';
import { Building2, ChevronRight, MapPin } from 'lucide-react';
import { HierarchyTree, type HierarchyNode } from '@/components/structure/hierarchy-tree';
import { useFacilityHierarchy } from '@/modules/foundation/hooks/use-facility-hierarchy';
import type { Facility } from '@/modules/foundation/types/facility';
import type { Bed } from '@/modules/foundation/services/bed-service';
import type { Space } from '@/modules/foundation/types/space';

interface FacilityHierarchyProps {
  facility: Facility;
  defaultOpen?: boolean;
}

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const extractRoomKey = (value?: string | null) => {
  if (!value) return null;
  const primary = value.split('-')[0]?.trim();
  const digits = value.match(/\d+/g)?.join('') ?? '';
  const keySource = primary || digits;
  return keySource ? normalizeKey(keySource) : null;
};

const mapBedsToSpaces = (beds: Bed[], spaces: Space[]) => {
  const bedsByKey = beds.reduce<Record<string, Bed[]>>((acc, bed) => {
    const key = extractRoomKey(bed.bedNumber ?? '');
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(bed);
    return acc;
  }, {});

  const assignedBedIds = new Set<string>();

  const spaceNodes = spaces.map((space) => {
    const key = extractRoomKey(space.spaceNumber ?? space.name);
    const matchedBeds = key ? bedsByKey[key] ?? [] : [];
    matchedBeds.forEach((bed) => assignedBedIds.add(bed.id));
    const bedChildren: HierarchyNode[] = matchedBeds.map((bed) => ({
      id: `bed-${bed.id}`,
      label: bed.bedNumber ? `Bed ${bed.bedNumber}` : 'Bed',
      meta: bed.bedType ? bed.bedType : undefined,
    }));

    return {
      id: `space-${space.id}`,
      label: space.name || (space.spaceNumber ? `Room ${space.spaceNumber}` : 'Space'),
      meta: space.spaceType ? space.spaceType : undefined,
      children: bedChildren,
    };
  });

  const unassignedBeds = beds.filter((bed) => !assignedBedIds.has(bed.id));

  return { spaceNodes, unassignedBeds };
};

export function FacilityHierarchyTree({ facility, defaultOpen }: FacilityHierarchyProps) {
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
  const { data, isLoading } = useFacilityHierarchy(facility.id, { enabled: isOpen });

  const facilityMeta = useMemo(() => {
    const parts = [
      [facility.city, facility.emirate].filter(Boolean).join(', '),
      facility.latitude != null && facility.longitude != null
        ? `${facility.latitude.toFixed(4)}, ${facility.longitude.toFixed(4)}`
        : null,
    ].filter(Boolean);
    return parts.join(' • ');
  }, [facility.city, facility.emirate, facility.latitude, facility.longitude]);

  const nodes = useMemo<HierarchyNode[]>(() => {
    if (!data) return [];

    return data.departments.map((department) => {
      const wardNodes: HierarchyNode[] = (data.wardsByDepartmentId[department.id] ?? []).map((ward) => {
        const beds = data.bedsByWardId[ward.id] ?? [];
        const wardSpaces = data.spacesByDepartmentId[department.id] ?? [];
        const { spaceNodes, unassignedBeds } = mapBedsToSpaces(beds, wardSpaces);

        const children: HierarchyNode[] = [];
        if (spaceNodes.length) {
          children.push({
            id: `${ward.id}-spaces`,
            label: 'Spaces (patient rooms)',
            children: spaceNodes,
          });
        }
        if (unassignedBeds.length) {
          children.push({
            id: `${ward.id}-beds`,
            label: 'Beds',
            children: unassignedBeds.map((bed) => ({
              id: `bed-${bed.id}`,
              label: bed.bedNumber ? `Bed ${bed.bedNumber}` : 'Bed',
              meta: bed.bedType ? bed.bedType : undefined,
            })),
          });
        }

        return {
          id: ward.id,
          label: ward.name ?? ward.code ?? 'Ward',
          badge: 'IPD',
          children,
        };
      });

      const clinicNodes: HierarchyNode[] = (data.clinicsByDepartmentId[department.id] ?? []).map((clinic) => {
        const spaces = data.spacesByClinicId[clinic.id] ?? [];
        const spaceNodes = spaces.map((space) => ({
          id: `space-${space.id}`,
          label: space.name || (space.spaceNumber ? `Room ${space.spaceNumber}` : 'Space'),
          meta: space.spaceType ? space.spaceType : undefined,
        }));

        return {
          id: clinic.id,
          label: clinic.name ?? clinic.code ?? 'Clinic',
          badge: 'OPD',
          children: spaceNodes.length
            ? [
                {
                  id: `${clinic.id}-spaces`,
                  label: 'Spaces (exam rooms)',
                  children: spaceNodes,
                },
              ]
            : [],
        };
      });

      const children: HierarchyNode[] = [];
      if (wardNodes.length) {
        children.push({
          id: `${department.id}-wards`,
          label: 'Wards',
          children: wardNodes,
        });
      }
      if (clinicNodes.length) {
        children.push({
          id: `${department.id}-clinics`,
          label: 'Clinics',
          children: clinicNodes,
        });
      }

      if (!wardNodes.length && !clinicNodes.length) {
        children.push({
          id: `${department.id}-empty`,
          label: 'No wards or clinics',
        });
      }

      return {
        id: department.id,
        label: department.name ?? 'Department',
        meta: department.departmentType ? `Type: ${department.departmentType}` : undefined,
        children,
        defaultOpen: true,
      };
    });
  }, [data]);

  return (
    <details
      className="group rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 text-sm">
        <ChevronRight className="mt-1 h-4 w-4 text-slate-400 transition group-open:rotate-90" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-base font-semibold text-slate-900 dark:text-white">{facility.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {facilityMeta && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {facilityMeta}
              </span>
            )}
            {facility.facilityType && <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">{facility.facilityType}</span>}
          </div>
        </div>
      </summary>
      <div className="mt-3 space-y-3">
        {isLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading hierarchy...</p>}
        {!isLoading && (
          <HierarchyTree nodes={nodes} emptyMessage="No departments found for this facility." />
        )}
      </div>
    </details>
  );
}
