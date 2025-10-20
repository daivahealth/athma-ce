import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '@zeal/database-foundation';
export declare class DepartmentService {
    private readonly departmentRepo;
    private readonly prisma;
    constructor(departmentRepo: DepartmentRepository, prisma: PrismaService);
    create(facilityId: string, createDepartmentDto: CreateDepartmentDto): Promise<{
        facility: {
            id: string;
            name: string;
            tenantId: string;
        };
        hod: {
            id: string;
            firstName: string;
            lastName: string;
            employeeId: string;
        } | null;
    } & {
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
    }>;
    findAll(facilityId: string, departmentType?: string): Promise<({
        _count: {
            spaces: number;
            wards: number;
            clinics: number;
        };
        facility: {
            id: string;
            name: string;
        };
        hod: {
            id: string;
            firstName: string;
            lastName: string;
            employeeId: string;
        } | null;
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        spaces: {
            id: string;
            name: string;
            isActive: boolean;
            spaceType: string;
        }[];
        facility: {
            id: string;
            name: string;
            tenantId: string;
        };
        hod: {
            id: string;
            firstName: string;
            lastName: string;
            employeeId: string;
        } | null;
        wards: {
            id: string;
            name: string;
            status: string;
            code: string | null;
            wardType: string;
            totalBeds: number;
            availableBeds: number;
        }[];
        clinics: {
            id: string;
            name: string;
            status: string;
            code: string | null;
            specialty: string | null;
            totalRooms: number;
        }[];
    } & {
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
    }>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        facility: {
            id: string;
            name: string;
        };
        hod: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=department.service.d.ts.map