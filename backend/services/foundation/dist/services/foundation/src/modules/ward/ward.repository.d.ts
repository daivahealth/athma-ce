import { PrismaService } from '@zeal/database-foundation';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
export declare class WardRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(departmentId: string, data: CreateWardDto): Promise<{
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
    findOne(id: string): Promise<({
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
    }) | null>;
    update(id: string, data: UpdateWardDto): Promise<{
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
    checkCodeExists(departmentId: string, code: string, excludeId?: string): Promise<boolean>;
    getAvailability(id: string): Promise<{
        id: string;
        name: string;
        totalBeds: number;
        availableBeds: number;
        beds: {
            id: string;
            bedNumber: string;
            bedType: string;
        }[];
    } | null>;
    updateBedCounts(wardId: string): Promise<{
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
    } | null>;
}
//# sourceMappingURL=ward.repository.d.ts.map