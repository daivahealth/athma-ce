import { PrismaService } from '@zeal/database-foundation';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
export declare class BedRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(wardId: string, data: CreateBedDto): Promise<{
        ward: {
            id: string;
            name: string;
            departmentId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    }>;
    findAll(wardId: string, status?: string): Promise<({
        ward: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<({
        ward: {
            id: string;
            name: string;
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
            departmentId: string;
            wardType: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    }) | null>;
    update(id: string, data: UpdateBedDto): Promise<{
        ward: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    }>;
    assignPatient(bedId: string, patientId: string): Promise<{
        ward: {
            id: string;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            floorNumber: string | null;
            departmentId: string;
            wardType: string;
            totalBeds: number;
            availableBeds: number;
            nursingStation: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    }>;
    releasePatient(bedId: string): Promise<{
        ward: {
            id: string;
            name: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            floorNumber: string | null;
            departmentId: string;
            wardType: string;
            totalBeds: number;
            availableBeds: number;
            nursingStation: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    }>;
    checkBedNumberExists(wardId: string, bedNumber: string, excludeId?: string): Promise<boolean>;
    findAvailable(wardId?: string): Promise<({
        ward: {
            id: string;
            name: string;
            department: {
                id: string;
                name: string;
                facility: {
                    id: string;
                    name: string;
                };
            };
            wardType: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        wardId: string;
        bedNumber: string;
        bedType: string;
        features: import("@zeal/database-foundation/generated/runtime/library").JsonValue | null;
        currentPatientId: string | null;
        assignedAt: Date | null;
    })[]>;
}
//# sourceMappingURL=bed.repository.d.ts.map