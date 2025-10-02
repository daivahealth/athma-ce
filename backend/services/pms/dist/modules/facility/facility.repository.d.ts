import { PrismaService } from '@zeal/shared-database';
export declare class FacilityRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(query: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    getSpaces(facilityId: string, query: any): Promise<any>;
    getStaff(facilityId: string, query: any): Promise<any>;
    getSchedule(facilityId: string, query: any): Promise<any>;
}
//# sourceMappingURL=facility.repository.d.ts.map