import { PrismaService } from '@zeal/database-foundation';
export interface AuthUserRecord {
    id: string;
    email: string;
    passwordHash: string;
    tenantId: string;
    status: string;
}
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<AuthUserRecord | null>;
    findById(id: string): Promise<AuthUserRecord | null>;
    updateLastLogin(userId: string): Promise<void>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map