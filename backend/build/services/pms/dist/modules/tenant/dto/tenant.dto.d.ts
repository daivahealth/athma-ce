export let CreateTenantDto: {
    new (): {
        name: any;
        domain: any;
        settings: any;
    };
};
export let UpdateTenantDto: {
    new (): {
        name: any;
        domain: any;
        status: any;
        settings: any;
    };
};
export let TenantSearchDto: {
    new (): {
        query: any;
        status: any;
    };
};
export let TenantStatsDto: {
    new (): {
        totalUsers: any;
        totalPatients: any;
        totalFacilities: any;
        totalStaff: any;
        totalAppointments: any;
        activeAppointments: any;
    };
};
//# sourceMappingURL=tenant.dto.d.ts.map