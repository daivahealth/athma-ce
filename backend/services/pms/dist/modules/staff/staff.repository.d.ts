import { PrismaService } from '@zeal/shared-database';
export declare class StaffRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    findByEmployeeId(tenantId: string, employeeId: string): Promise<any>;
    findMany(query: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    getAvailability(id: string, query: any): Promise<any>;
    getSchedule(id: string, query: any): Promise<any>;
}
//# sourceMappingURL=staff.repository.d.ts.map