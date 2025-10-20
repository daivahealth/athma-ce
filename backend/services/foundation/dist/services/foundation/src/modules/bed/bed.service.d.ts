import { BedRepository } from './bed.repository';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { AssignBedDto } from './dto/assign-bed.dto';
import { ReleaseBedDto } from './dto/release-bed.dto';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { WardRepository } from '../ward/ward.repository';
export declare class BedService {
    private readonly bedRepo;
    private readonly wardRepo;
    private readonly foundationPrisma;
    private readonly clinicalPrisma;
    constructor(bedRepo: BedRepository, wardRepo: WardRepository, foundationPrisma: FoundationPrismaService, clinicalPrisma: ClinicalPrismaService);
    create(wardId: string, createBedDto: CreateBedDto): Promise<{
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
    } & {
        currentPatient: any | null;
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
    } & {
        currentPatient: any | null;
    }) | undefined>;
    update(id: string, updateBedDto: UpdateBedDto): Promise<{
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
        success: boolean;
        message: string;
    }>;
    assignPatient(bedId: string, assignBedDto: AssignBedDto): Promise<{
        success: boolean;
        message: string;
        bed: {
            id: string;
            bedNumber: string;
            bedType: string;
            status: string;
            assignedAt: Date | null;
            patient: {
                id: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
                emiratesId: string | null;
            } | null;
            ward: {
                id: string;
                name: string;
            };
        };
    }>;
    releasePatient(bedId: string, releaseBedDto: ReleaseBedDto): Promise<{
        success: boolean;
        message: string;
        bed: {
            id: string;
            bedNumber: string;
            status: string;
            releasedPatientId: string;
            ward: {
                id: string;
                name: string;
            };
        };
    }>;
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
    private hydrateBedsWithPatients;
}
//# sourceMappingURL=bed.service.d.ts.map