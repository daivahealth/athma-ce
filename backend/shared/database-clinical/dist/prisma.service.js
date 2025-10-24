"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("./client");
const shared_utils_1 = require("@zeal/shared-utils");
const prisma_tenant_middleware_1 = require("./prisma-tenant.middleware");
let PrismaService = class PrismaService extends client_1.ZealPrismaClient {
    async onModuleInit() {
        await this.$connect();
        // Register tenant isolation middleware
        this.$use((0, prisma_tenant_middleware_1.createTenantIsolationMiddleware)());
        console.log('✅ Prisma tenant isolation middleware registered');
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async runWithRequestContext(fn) {
        const store = shared_utils_1.RequestContext.getStore();
        const tenantId = store?.tenantId;
        const userId = store?.userId;
        const userAgent = store?.userAgent ?? '';
        if (!tenantId || !userId) {
            throw new Error('Unable to resolve tenant/user context for database transaction');
        }
        return this.$transaction(async (tx) => {
            await tx.$queryRaw `
        SELECT
          set_config('app.current_tenant_id', ${tenantId}, true),
          set_config('app.current_user_id',   ${userId}, true),
          set_config('app.user_agent',        ${userAgent}, true)
      `;
            return fn(tx);
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map