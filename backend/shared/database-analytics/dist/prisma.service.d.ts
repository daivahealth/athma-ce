import { type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { Prisma } from '../generated';
import { ZealPrismaClient } from './client';
export declare class PrismaService extends ZealPrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    runWithRequestContext<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
//# sourceMappingURL=prisma.service.d.ts.map