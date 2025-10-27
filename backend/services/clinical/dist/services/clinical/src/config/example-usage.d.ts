/**
 * Example: How to use the Config Client in Clinical service
 *
 * This file demonstrates various ways to access configuration values
 * in the Clinical service.
 */
/**
 * Example 1: Get a single config value
 */
export declare function exampleSingleConfig(req: any): Promise<string>;
/**
 * Example 2: Get multiple configs at once
 */
export declare function exampleMultipleConfigs(req: any): Promise<Record<"locale.timezone" | "clinical.appointment_duration" | "clinical.working_hours_start" | "clinical.working_hours_end", string | number>>;
/**
 * Example 3: Use configs in business logic
 */
export declare function createAppointment(patientId: string, req: any): Promise<{
    patientId: string;
    duration: number;
    startTime: Date;
    endTime: Date;
}>;
/**
 * Example 4: Middleware to inject configs into request
 */
export declare function configMiddleware(req: any, res: any, next: any): Promise<void>;
/**
 * Example 5: Get all effective configs
 */
export declare function exampleAllConfigs(req: any): Promise<Partial<import("@zeal/config-client").ConfigValues>>;
/**
 * Example 6: Manual cache invalidation
 */
export declare function invalidateConfigCache(key: string, tenantId?: string, facilityId?: string): Promise<void>;
//# sourceMappingURL=example-usage.d.ts.map