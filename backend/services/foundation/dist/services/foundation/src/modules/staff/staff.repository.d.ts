import { PrismaService } from '@zeal/database-foundation';
export declare class StaffRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        tenantId: string;
        prefix?: string | null;
        firstName: string;
        lastName: string;
        middleName?: string | null;
        dateOfBirth: Date;
        gender: string;
        phoneNumber?: string | null;
        email?: string | null;
        employeeId: string;
        staffType: string;
        licenseNumber?: string | null;
        licenseExpiry?: Date | null;
        qualification?: string | null;
        languages: string[];
        displayName: string;
    }): import("@zeal/database-foundation").Prisma.Prisma__StaffClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        staffSpecialties: {
            primaryFlag: boolean;
            specialty: {
                id: string;
                name: string;
                code: string;
            };
            facilityId: string;
        }[];
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
        employeeId: string;
        staffType: string;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findMany(tenantId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        staffSpecialties: {
            primaryFlag: boolean;
            specialty: {
                id: string;
                name: string;
                code: string;
            };
            facilityId: string;
        }[];
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
        employeeId: string;
        staffType: string;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string | null;
    }[]>;
    findById(id: string): import("@zeal/database-foundation").Prisma.Prisma__StaffClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        staffSpecialties: {
            primaryFlag: boolean;
            specialty: {
                id: string;
                name: string;
                code: string;
            };
            facilityId: string;
        }[];
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
        employeeId: string;
        staffType: string;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string | null;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    findByEmployeeId(tenantId: string, employeeId: string): import("@zeal/database-foundation").Prisma.Prisma__StaffClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        staffSpecialties: {
            primaryFlag: boolean;
            specialty: {
                id: string;
                name: string;
                code: string;
            };
            facilityId: string;
        }[];
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
        employeeId: string;
        staffType: string;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string | null;
    } | null, null, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    update(id: string, data: Partial<{
        prefix: string | null;
        firstName: string;
        lastName: string;
        middleName: string | null;
        dateOfBirth: Date;
        gender: string;
        phoneNumber: string | null;
        email: string | null;
        staffType: string;
        licenseNumber: string | null;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string;
        status: string;
    }>): import("@zeal/database-foundation").Prisma.Prisma__StaffClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        staffSpecialties: {
            primaryFlag: boolean;
            specialty: {
                id: string;
                name: string;
                code: string;
            };
            facilityId: string;
        }[];
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
        employeeId: string;
        staffType: string;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    delete(id: string): import("@zeal/database-foundation").Prisma.Prisma__StaffClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        staffSpecialties: {
            primaryFlag: boolean;
            specialty: {
                id: string;
                name: string;
                code: string;
            };
            facilityId: string;
        }[];
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
        employeeId: string;
        staffType: string;
        licenseExpiry: Date | null;
        qualification: string | null;
        languages: string[];
        displayName: string | null;
    }, never, import("@zeal/database-foundation/generated/runtime/library").DefaultArgs>;
    private readonly selectFields;
}
//# sourceMappingURL=staff.repository.d.ts.map