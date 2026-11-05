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
  /** Linked login (users.staff_id); null when the staff member has no account. */
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    status: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
