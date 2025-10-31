export interface StaffMember {
  id: string;
  tenantId: string;
  prefix?: string | null;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string | null;
  email?: string | null;
  employeeId: string;
  staffType: string;
  qualification?: string | null;
  languages: string[];
  displayName: string;
  staffSpecialties: Array<{
    facilityId: string;
    primaryFlag: boolean;
    specialty: {
      id: string;
      code: string;
      name: string;
    };
  }>;
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
