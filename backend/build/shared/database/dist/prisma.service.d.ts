export let PrismaService: {
    new (optionsArg?: Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions> | undefined): {
        [K: symbol]: {
            types: {
                payload: any;
                operations: {
                    $executeRaw: {
                        args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
                        result: any;
                    };
                    $executeRawUnsafe: {
                        args: [query: string, ...values: any[]];
                        result: any;
                    };
                    $queryRaw: {
                        args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
                        result: any;
                    };
                    $queryRawUnsafe: {
                        args: [query: string, ...values: any[]];
                        result: any;
                    };
                };
            };
        };
        onModuleInit(): Promise<void>;
        onModuleDestroy(): Promise<void>;
        runWithRequestContext(fn: any): Promise<any>;
        $on<V extends never>(eventType: V, callback: (event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;
        $connect(): import("@prisma/client/runtime/library").JsPromise<void>;
        $disconnect(): import("@prisma/client/runtime/library").JsPromise<void>;
        $use(cb: Prisma.Middleware): void;
        $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
        $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
        $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
        $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
        $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
            isolationLevel?: Prisma.TransactionIsolationLevel;
        }): import("@prisma/client/runtime/library").JsPromise<import("@prisma/client/runtime/library").UnwrapTuple<P>>;
        $transaction<R>(fn: (prisma: Omit<PrismaClient, import("@prisma/client/runtime/library").ITXClientDenyList>) => import("@prisma/client/runtime/library").JsPromise<R>, options?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: Prisma.TransactionIsolationLevel;
        }): import("@prisma/client/runtime/library").JsPromise<R>;
        $extends: import("@prisma/client/runtime/library").ExtendsHook<"extends", Prisma.TypeMapCb, import("@prisma/client/runtime/library").DefaultArgs, Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>, {}>;
        get tenant(): Prisma.TenantDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get user(): Prisma.UserDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get facility(): Prisma.FacilityDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get space(): Prisma.SpaceDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get staff(): Prisma.StaffDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get role(): Prisma.RoleDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get permission(): Prisma.PermissionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get rolePermission(): Prisma.RolePermissionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get userRole(): Prisma.UserRoleDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get userMfaSettings(): Prisma.UserMfaSettingsDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get userMfaBackupCode(): Prisma.UserMfaBackupCodeDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get userMfaAttempt(): Prisma.UserMfaAttemptDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get userTrustedDevice(): Prisma.UserTrustedDeviceDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get patient(): Prisma.PatientDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get appointment(): Prisma.AppointmentDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
        get encounter(): Prisma.EncounterDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    };
};
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
//# sourceMappingURL=prisma.service.d.ts.map