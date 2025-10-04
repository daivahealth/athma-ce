import { PrismaService } from '@zeal/shared-database';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(): Promise<any>;
    getReadiness(): Promise<any>;
    getLiveness(): Promise<any>;
}
//# sourceMappingURL=health.controller.d.ts.map