import { WardRepository } from './ward.repository';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { PrismaService } from '@zeal/database-foundation';
export declare class WardService {
    private readonly wardRepo;
    private readonly prisma;
    constructor(wardRepo: WardRepository, prisma: PrismaService);
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
}
//# sourceMappingURL=ward.service.d.ts.map