var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { RequestContext } from '@zeal/shared-utils';
let PrismaService = class PrismaService extends PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async runWithRequestContext(fn) {
        const store = RequestContext.getStore();
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
PrismaService = __decorate([
    Injectable()
], PrismaService);
export { PrismaService };
//# sourceMappingURL=prisma.service.js.map