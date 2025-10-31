import { PrismaService } from '@zeal/database-foundation';
export declare class StaffSpecialtyRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assignSpecialty(data: {
        tenantId: string;
        staffId: string;
        facilityId: string;
        specialtyId: string;
        primaryFlag: boolean;
    }): Promise<{
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
                displayName: string;
                specialtyId: string;
                lang: string;
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
    }>;
    removeSpecialty(staffId: string, facilityId: string, specialtyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        primaryFlag: boolean;
        staffId: string;
        facilityId: string;
        specialtyId: string;
    }>;
    getStaffSpecialties(staffId: string, facilityId?: string, locale?: string): Promise<({
        facility: {
            id: string;
            name: string;
            code: string | null;
        };
        specialty: {
            translations: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                displayName: string;
                specialtyId: string;
                lang: string;
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
    })[]>;
    getPrimarySpecialty(staffId: string, facilityId: string): Promise<({
        specialty: {
            translations: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                displayName: string;
                specialtyId: string;
                lang: string;
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
    }) | null>;
    findStaffBySpecialty(params: {
        tenantId: string;
        specialtyId?: string;
        specialtyCode?: string;
        staffType?: string;
        primaryOnly?: boolean;
        activeOnly?: boolean;
        facilityId?: string;
        locale?: string;
    }): Promise<({
        staff: {
            departments: {
                id: string;
                name: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
                facilityId: string;
                specialtyId: string | null;
                departmentType: string;
                headOfDepartment: string | null;
                floorNumber: string | null;
                phoneExtension: string | null;
            }[];
            user: {
                id: string;
                status: string;
                email: string;
            } | null;
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            licenseNumber: string | null;
            phoneNumber: string | null;
            email: string | null;
            tenantId: string;
            prefix: string | null;
            firstName: string;
            lastName: string;
            middleName: string | null;
            dateOfBirth: Date;
            gender: string;
            nationality: string;
            employeeId: string;
            staffType: string;
            specialties: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
            licenseExpiry: Date | null;
            qualification: string | null;
            languages: string[];
            displayName: string;
        };
        specialty: {
            translations: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                displayName: string;
                specialtyId: string;
                lang: string;
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
    })[]>;
    bulkAssignSpecialties(data: {
        tenantId: string;
        staffId: string;
        facilityId: string;
        primarySpecialtyId: string;
        secondarySpecialtyIds?: string[];
    }): Promise<{
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
                    displayName: string;
                    specialtyId: string;
                    lang: string;
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
                    displayName: string;
                    specialtyId: string;
                    lang: string;
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
    }>;
    changePrimarySpecialty(staffId: string, facilityId: string, newPrimarySpecialtyId: string): Promise<{
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
                displayName: string;
                specialtyId: string;
                lang: string;
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
    }>;
    getSpecialtyStats(tenantId: string): Promise<{
        specialty: ({
            translations: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                displayName: string;
                specialtyId: string;
                lang: string;
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
        }) | null;
        count: number;
    }[]>;
    getFacilitySpecialties(facilityId: string, locale?: string): Promise<{
        specialty: ({
            translations: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                displayName: string;
                specialtyId: string;
                lang: string;
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
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
            isActive: boolean;
            sortOrder: number;
        }) | null;
        staffCount: number;
        staff: {
            id: string;
            licenseNumber: string | null;
            phoneNumber: string | null;
            email: string | null;
            firstName: string;
            lastName: string;
            employeeId: string;
        }[];
    }[]>;
}
//# sourceMappingURL=staff-specialty.repository.d.ts.map