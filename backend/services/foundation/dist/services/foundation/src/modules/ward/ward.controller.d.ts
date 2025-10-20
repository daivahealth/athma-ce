import { WardService } from './ward.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
export declare class WardController {
    private readonly wardService;
    constructor(wardService: WardService);
    create(departmentId: string, createWardDto: CreateWardDto): Promise<{
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
        floorNumber: string | null;
        departmentId: string;
        wardType: string;
        totalBeds: number;
        availableBeds: number;
        nursingStation: string | null;
    }>;
    findAll(departmentId: string, wardType?: string): Promise<({
        _count: {
            beds: number;
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
        floorNumber: string | null;
        departmentId: string;
        wardType: string;
        totalBeds: number;
        availableBeds: number;
        nursingStation: string | null;
    })[]>;
}
export declare class WardStandaloneController {
    private readonly wardService;
    constructor(wardService: WardService);
    findOne(id: string): Promise<{
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
        beds: {
            id: string;
            status: string;
            bedNumber: string;
            bedType: string;
            currentPatientId: string | null;
            assignedAt: Date | null;
        }[];
    } & {
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
    }>;
    getAvailability(id: string): Promise<{
        wardId: string;
        wardName: string;
        totalBeds: number;
        availableBeds: number;
        occupiedBeds: number;
        occupancyRate: number;
        availableBedsList: {
            id: string;
            bedNumber: string;
            bedType: string;
        }[];
    }>;
    update(id: string, updateWardDto: UpdateWardDto): Promise<{
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
        floorNumber: string | null;
        departmentId: string;
        wardType: string;
        totalBeds: number;
        availableBeds: number;
        nursingStation: string | null;
    }>;
    remove(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=ward.controller.d.ts.map