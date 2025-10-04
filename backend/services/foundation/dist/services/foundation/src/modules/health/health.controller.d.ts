import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getStatus(): {
        service: string;
        status: string;
        timestamp: string;
    };
}
//# sourceMappingURL=health.controller.d.ts.map