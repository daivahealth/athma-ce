export let FacilityRepository: {
    new (prisma: any): {
        prisma: any;
        create(data: any): Promise<any>;
        findById(id: any): Promise<any>;
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
        getSpaces(facilityId: any, query: any): Promise<{
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
        getStaff(facilityId: any, query: any): Promise<{
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
        getSchedule(facilityId: any, query: any): Promise<{
            facilityId: any;
            appointments: any;
        }>;
    };
};
//# sourceMappingURL=facility.repository.d.ts.map