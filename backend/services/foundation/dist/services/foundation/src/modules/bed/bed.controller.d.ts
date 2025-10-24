import { BedService } from './bed.service';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { AssignBedDto } from './dto/assign-bed.dto';
import { ReleaseBedDto } from './dto/release-bed.dto';
export declare class BedController {
    private readonly bedService;
    constructor(bedService: BedService);
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
}
export declare class BedStandaloneController {
    private readonly bedService;
    constructor(bedService: BedService);
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
    assignPatient(id: string, assignBedDto: AssignBedDto): Promise<{
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
                nationalId: string | null;
            } | null;
            ward: {
                id: string;
                name: string;
            };
        };
    }>;
    releasePatient(id: string, releaseBedDto: ReleaseBedDto): Promise<{
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
}
//# sourceMappingURL=bed.controller.d.ts.map