export let TenantService: {
    new (prisma: any): {
        prisma: any;
        /**
         * Create a new tenant
         */
        createTenant(createTenantDto: any): Promise<any>;
        /**
         * Get tenant by ID
         */
        getTenantById(id: any): Promise<any>;
        /**
         * Get tenant by domain
         */
        getTenantByDomain(domain: any): Promise<any>;
        /**
         * Search tenants with pagination
         */
        searchTenants(searchDto: any, pagination: any): Promise<{
            tenants: any;
            total: any;
        }>;
        /**
         * Update tenant
         */
        updateTenant(id: any, updateTenantDto: any): Promise<any>;
        /**
         * Delete tenant (soft delete by setting status to inactive)
         */
        deleteTenant(id: any): Promise<void>;
        /**
         * Get tenant statistics
         */
        getTenantStats(id: any): Promise<{
            totalUsers: any;
            totalPatients: any;
            totalFacilities: any;
            totalStaff: any;
            totalAppointments: any;
            activeAppointments: any;
        }>;
        /**
         * Validate domain format
         */
        isValidDomain(domain: any): boolean;
        /**
         * Get all active tenants
         */
        getActiveTenants(): Promise<any>;
        /**
         * Check if tenant exists
         */
        tenantExists(id: any): Promise<boolean>;
    };
};
//# sourceMappingURL=tenant.service.d.ts.map