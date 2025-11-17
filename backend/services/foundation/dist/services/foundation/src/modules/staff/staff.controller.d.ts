import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(dto: CreateStaffDto): Promise<{
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
    }>;
    list(tenantId?: string, tenantHeader?: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
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
    get(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateStaffDto): Promise<{
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
    }>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=staff.controller.d.ts.map