export declare class CreateTenantDto {
    name: string;
    domain: string;
    settings?: Record<string, any>;
}
export declare class UpdateTenantDto {
    name?: string;
    domain?: string;
    status?: string;
    settings?: Record<string, any>;
}
export declare class TenantSearchDto {
    query?: string;
    status?: string;
}
export declare class TenantStatsDto {
    totalUsers: number;
    totalPatients: number;
    totalFacilities: number;
    totalStaff: number;
    totalAppointments: number;
    activeAppointments: number;
}
//# sourceMappingURL=tenant.dto.d.ts.map