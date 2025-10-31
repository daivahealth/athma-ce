import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ConfigService } from '../config/config.service';
export declare class StaffService {
    private readonly staffRepository;
    private readonly configService;
    constructor(staffRepository: StaffRepository, configService: ConfigService);
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
        displayName: string;
    }>;
    list(tenantId: string): import("@zeal/database-foundation").Prisma.PrismaPromise<{
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
        displayName: string;
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
        displayName: string;
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
        displayName: string;
    }>;
    archive(id: string): Promise<void>;
    private buildDisplayName;
}
//# sourceMappingURL=staff.service.d.ts.map