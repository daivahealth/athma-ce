import { PrismaService } from '@zeal/shared-database';
import { CreateUserDto, UpdateUserDto, UserSearchDto, ChangePasswordDto } from './dto/user.dto';
import type { User } from '@prisma/client';
import type { PaginationParams } from '@zeal/contracts';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new user
     */
    createUser(createUserDto: CreateUserDto): Promise<User>;
    /**
     * Get user by ID
     */
    getUserById(id: string): Promise<User>;
    /**
     * Get user by email and tenant
     */
    getUserByEmail(tenantId: string, email: string): Promise<User>;
    /**
     * Search users with pagination
     */
    searchUsers(tenantId: string, searchDto: UserSearchDto, pagination: PaginationParams): Promise<{
        users: User[];
        total: number;
    }>;
    /**
     * Update user
     */
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    /**
     * Change user password
     */
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    /**
     * Delete user (soft delete by setting status to inactive)
     */
    deleteUser(id: string): Promise<void>;
    /**
     * Verify user password
     */
    verifyPassword(id: string, password: string): Promise<boolean>;
    /**
     * Update last login timestamp
     */
    updateLastLogin(id: string): Promise<void>;
    /**
     * Get users by role
     */
    getUsersByRole(tenantId: string, role: string): Promise<User[]>;
    /**
     * Get user statistics for tenant
     */
    getUserStats(tenantId: string): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        usersByRole: Record<string, number>;
        recentLogins: number;
    }>;
    /**
     * Check if user exists
     */
    userExists(id: string): Promise<boolean>;
    /**
     * Check if email exists in tenant
     */
    emailExistsInTenant(tenantId: string, email: string): Promise<boolean>;
}
//# sourceMappingURL=user.service.d.ts.map