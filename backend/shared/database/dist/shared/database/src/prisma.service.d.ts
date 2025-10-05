import { type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    runWithRequestContext<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
//# sourceMappingURL=prisma.service.d.ts.map