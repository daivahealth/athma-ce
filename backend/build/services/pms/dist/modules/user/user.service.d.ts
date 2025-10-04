export let UserService: {
    new (prisma: any): {
        prisma: any;
        /**
         * Create a new user
         */
        createUser(createUserDto: any): Promise<any>;
        /**
         * Get user by ID
         */
        getUserById(id: any): Promise<any>;
        /**
         * Get user by email and tenant
         */
        getUserByEmail(tenantId: any, email: any): Promise<any>;
        /**
         * Search users with pagination
         */
        searchUsers(tenantId: any, searchDto: any, pagination: any): Promise<{
            users: any;
            total: any;
        }>;
        /**
         * Update user
         */
        updateUser(id: any, updateUserDto: any): Promise<any>;
        /**
         * Change user password
         */
        changePassword(id: any, changePasswordDto: any): Promise<void>;
        /**
         * Delete user (soft delete by setting status to inactive)
         */
        deleteUser(id: any): Promise<void>;
        /**
         * Verify user password
         */
        verifyPassword(id: any, password: any): Promise<boolean>;
        /**
         * Update last login timestamp
         */
        updateLastLogin(id: any): Promise<void>;
        /**
         * Get users by role
         */
        getUsersByRole(tenantId: any, role: any): Promise<any>;
        /**
         * Get user statistics for tenant
         */
        getUserStats(tenantId: any): Promise<{
            totalUsers: any;
            activeUsers: any;
            inactiveUsers: any;
            usersByRole: any;
            recentLogins: any;
        }>;
        /**
         * Check if user exists
         */
        userExists(id: any): Promise<boolean>;
        /**
         * Check if email exists in tenant
         */
        emailExistsInTenant(tenantId: any, email: any): Promise<boolean>;
    };
};
//# sourceMappingURL=user.service.d.ts.map