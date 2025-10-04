export let TenantController: {
    new (tenantService: any): {
        tenantService: any;
        create(createTenantDto: any): Promise<{
            data: any;
            message: string;
        }>;
        findAll(searchDto: any, pagination: any): Promise<{
            data: any;
            pagination: {
                total: any;
                page: any;
                limit: any;
                totalPages: number;
            };
        }>;
        getActiveTenants(): Promise<{
            data: any;
            message: string;
        }>;
        findOne(id: any): Promise<{
            data: any;
            message: string;
        }>;
        getTenantStats(id: any): Promise<{
            data: any;
            message: string;
        }>;
        findByDomain(domain: any): Promise<{
            data: any;
            message: string;
        }>;
        update(id: any, updateTenantDto: any): Promise<{
            data: any;
            message: string;
        }>;
        remove(id: any): Promise<void>;
        checkExists(id: any): Promise<{
            data: {
                exists: any;
            };
            message: string;
        }>;
    };
};
//# sourceMappingURL=tenant.controller.d.ts.map