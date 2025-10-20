import { SpecialtyRepository } from './specialty.repository';
import { StaffSpecialtyRepository } from './staff-specialty.repository';
import { AssignSpecialtyDto, BulkAssignSpecialtiesDto } from './dto/assign-specialty.dto';
import { SearchStaffBySpecialtyDto } from './dto/search-staff.dto';
export declare class SpecialtyService {
    private readonly specialtyRepo;
    private readonly staffSpecialtyRepo;
    constructor(specialtyRepo: SpecialtyRepository, staffSpecialtyRepo: StaffSpecialtyRepository);
    getAllSpecialties(includeInactive?: boolean, locale?: string): Promise<{
        localizedName: string;
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            specialtyId: string;
            lang: string;
            displayName: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    getSpecialtyByCode(code: string, locale?: string): Promise<{
        localizedName: string;
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            specialtyId: string;
            lang: string;
            displayName: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    getSpecialtyById(id: string, locale?: string): Promise<{
        localizedName: string;
        translations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            specialtyId: string;
            lang: string;
            displayName: string;
        }[];
        authorityCodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specialtyId: string;
            isActive: boolean;
            authority: string;
            authorityCode: string;
            authorityName: string | null;
        }[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        description: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    assignSpecialtyToStaff(tenantId: string, staffId: string, dto: AssignSpecialtyDto): Promise<{
        success: boolean;
        staffSpecialty: {
            facility: {
                id: string;
                name: string;
            };
            specialty: {
                translations: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    specialtyId: string;
                    lang: string;
                    displayName: string;
                }[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
                isActive: boolean;
                sortOrder: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            primaryFlag: boolean;
            staffId: string;
            facilityId: string;
            specialtyId: string;
        };
        message: string;
    }>;
    removeSpecialtyFromStaff(staffId: string, facilityId: string, specialtyId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePrimarySpecialty(staffId: string, facilityId: string, newPrimarySpecialtyId: string): Promise<{
        success: boolean;
        primarySpecialty: {
            facility: {
                id: string;
                name: string;
            };
            specialty: {
                translations: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    specialtyId: string;
                    lang: string;
                    displayName: string;
                }[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
                isActive: boolean;
                sortOrder: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            primaryFlag: boolean;
            staffId: string;
            facilityId: string;
            specialtyId: string;
        };
        message: string;
    }>;
    bulkAssignSpecialties(tenantId: string, staffId: string, dto: BulkAssignSpecialtiesDto): Promise<{
        message: string;
        primary: {
            facility: {
                id: string;
                name: string;
            };
            specialty: {
                translations: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    specialtyId: string;
                    lang: string;
                    displayName: string;
                }[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
                isActive: boolean;
                sortOrder: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            primaryFlag: boolean;
            staffId: string;
            facilityId: string;
            specialtyId: string;
        };
        secondaries: ({
            facility: {
                id: string;
                name: string;
            };
            specialty: {
                translations: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    specialtyId: string;
                    lang: string;
                    displayName: string;
                }[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                description: string | null;
                isActive: boolean;
                sortOrder: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            primaryFlag: boolean;
            staffId: string;
            facilityId: string;
            specialtyId: string;
        })[];
        success: boolean;
    }>;
    getStaffSpecialties(staffId: string, facilityId?: string, locale?: string): Promise<{
        id: any;
        facilityId: any;
        facilityName: any;
        specialtyId: any;
        specialtyCode: any;
        specialtyName: string;
        isPrimary: any;
        assignedAt: any;
        specialty: any;
    }[]>;
    searchStaffBySpecialty(tenantId: string, dto: SearchStaffBySpecialtyDto): Promise<{
        staffId: any;
        employee: {
            employeeId: any;
            firstName: any;
            lastName: any;
            fullName: string;
            staffType: any;
            phoneNumber: any;
            email: any;
            licenseNumber: any;
            licenseExpiry: any;
            status: any;
        };
        specialty: {
            id: any;
            code: any;
            name: string;
            isPrimary: any;
        };
        hasSystemAccess: boolean;
        userEmail: any;
        departments: any;
        assignedAt: any;
    }[]>;
    getSpecialtyStats(tenantId: string, locale?: string): Promise<{
        specialty: {
            id: string | undefined;
            code: string | undefined;
            name: string;
        };
        activeStaffCount: number;
    }[]>;
    getFacilitySpecialties(facilityId: string, locale?: string): Promise<{
        specialty: {
            id: any;
            code: any;
            name: any;
            localizedName: string;
            authorityCodes: any;
        };
        staffCount: any;
        staff: any;
    }[]>;
    private getLocalizedName;
}
//# sourceMappingURL=specialty.service.d.ts.map