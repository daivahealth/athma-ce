export declare class CreateUserDto {
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    permissions?: Record<string, any>;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    role?: string;
    status?: string;
    permissions?: Record<string, any>;
}
export declare class UserSearchDto {
    query?: string;
    role?: string;
    status?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UserStatsDto {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
    recentLogins: number;
}
//# sourceMappingURL=user.dto.d.ts.map