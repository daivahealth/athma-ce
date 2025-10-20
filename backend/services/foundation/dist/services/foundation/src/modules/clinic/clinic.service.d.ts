import { ClinicRepository } from './clinic.repository';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PrismaService } from '@zeal/database-foundation';
export declare class ClinicService {
    private readonly clinicRepo;
    private readonly prisma;
    constructor(clinicRepo: ClinicRepository, prisma: PrismaService);
    create(departmentId: string, createClinicDto: CreateClinicDto): Promise<{
        department: {
            id: string;
            name: string;
            facilityId: string;
        };
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        specialty: string | null;
        floorNumber: string | null;
        departmentId: string;
        totalRooms: number;
    }>;
    findAll(departmentId: string, specialty?: string): Promise<({
        _count: {
            spaces: number;
        };
        department: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        specialty: string | null;
        floorNumber: string | null;
        departmentId: string;
        totalRooms: number;
    })[]>;
    findOne(id: string): Promise<{
        spaces: {
            id: string;
            name: string;
            capacity: number;
            isActive: boolean;
            floorNumber: string | null;
            spaceNumber: string | null;
            spaceType: string;
        }[];
        department: {
            id: string;
            name: string;
            facility: {
                id: string;
                name: string;
                tenantId: string;
            };
            facilityId: string;
        };
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        specialty: string | null;
        floorNumber: string | null;
        departmentId: string;
        totalRooms: number;
    }>;
    update(id: string, updateClinicDto: UpdateClinicDto): Promise<{
        department: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        specialty: string | null;
        floorNumber: string | null;
        departmentId: string;
        totalRooms: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        operatingHours: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        specialty: string | null;
        floorNumber: string | null;
        departmentId: string;
        totalRooms: number;
    }>;
}
//# sourceMappingURL=clinic.service.d.ts.map