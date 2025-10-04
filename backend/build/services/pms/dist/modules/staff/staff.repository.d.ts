export let StaffRepository: {
    new (prisma: any): {
        prisma: any;
        create(data: any): Promise<any>;
        findById(id: any): Promise<any>;
        findByEmployeeId(tenantId: any, employeeId: any): Promise<any>;
        findMany(query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        update(id: any, data: any): Promise<any>;
        delete(id: any): Promise<any>;
        getAvailability(id: any, query: any): Promise<{
            staffId: any;
            available: boolean;
            schedule: never[];
        }>;
        getSchedule(id: any, query: any): Promise<{
            staffId: any;
            appointments: any;
        }>;
    };
};
//# sourceMappingURL=staff.repository.d.ts.map