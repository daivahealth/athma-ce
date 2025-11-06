export interface Space {
  id: string;
  facilityId: string;
  departmentId?: string | null;
  clinicId?: string | null;
  name: string;
  spaceNumber?: string | null;
  spaceType: string;
  floorNumber?: string | null;
  equipment: any[];
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  facility?: {
    id: string;
    name: string;
  };
}

export interface CreateSpaceDTO {
  facilityId: string;
  departmentId?: string;
  clinicId?: string;
  name: string;
  spaceNumber?: string;
  spaceType: string;
  floorNumber?: string;
  equipment?: any[];
  capacity?: number;
}

export interface UpdateSpaceDTO {
  name?: string;
  spaceNumber?: string;
  spaceType?: string;
  floorNumber?: string;
  equipment?: any[];
  capacity?: number;
  isActive?: boolean;
}
