import { PrismaService } from '@zeal/shared-database';
export interface AuthUserRecord {
    id: string;
    email: string;
    passwordHash: string;
    tenantId: string;
    status: string;
}
declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<AuthUserRecord | null>;
    findById(id: string): Promise<AuthUserRecord | null>;
    updateLastLogin(userId: string): Promise<void>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
}
export { UserRepository };
//# sourceMappingURL=user.repository.d.ts.map