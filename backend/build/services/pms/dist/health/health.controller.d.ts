export let HealthController: {
    new (prisma: any): {
        prisma: any;
        getHealth(): Promise<{
            status: string;
            service: string;
            timestamp: string;
            version: string;
            environment: string;
            database: {
                connected: boolean;
                info: any;
                error?: never;
            };
            uptime: number;
            memory: NodeJS.MemoryUsage;
        } | {
            status: string;
            service: string;
            timestamp: string;
            version: string;
            environment: string;
            database: {
                connected: boolean;
                error: any;
                info?: never;
            };
            uptime: number;
            memory: NodeJS.MemoryUsage;
        }>;
        getReadiness(): Promise<{
            status: string;
            service: string;
            timestamp: string;
            database: {
                connected: boolean;
                tables_ready: boolean;
                error?: never;
            };
        } | {
            status: string;
            service: string;
            timestamp: string;
            database: {
                connected: boolean;
                error: any;
                tables_ready?: never;
            };
        }>;
        getLiveness(): Promise<{
            status: string;
            service: string;
            timestamp: string;
            uptime: number;
        }>;
    };
};
//# sourceMappingURL=health.controller.d.ts.map