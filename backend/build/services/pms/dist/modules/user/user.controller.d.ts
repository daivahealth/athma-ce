export let UserController: {
    new (userService: any): {
        userService: any;
        create(createUserDto: any): Promise<{
            data: any;
            message: string;
        }>;
        findAll(tenantId: any, searchDto: any, pagination: any): Promise<{
            data: any;
            pagination: {
                total: any;
                page: any;
                limit: any;
                totalPages: number;
            };
        }>;
        getUsersByRole(tenantId: any, role: any): Promise<{
            data: any;
            message: string;
        }>;
        getUserStats(tenantId: any): Promise<{
            data: any;
            message: string;
        }>;
        findOne(id: any): Promise<{
            data: any;
            message: string;
        }>;
        findByEmail(tenantId: any, email: any): Promise<{
            data: any;
            message: string;
        }>;
        update(id: any, updateUserDto: any): Promise<{
            data: any;
            message: string;
        }>;
        changePassword(id: any, changePasswordDto: any): Promise<{
            data: undefined;
            message: string;
        }>;
        remove(id: any): Promise<void>;
        checkExists(id: any): Promise<{
            data: {
                exists: any;
            };
            message: string;
        }>;
        checkEmailExists(tenantId: any, email: any): Promise<{
            data: {
                exists: any;
            };
            message: string;
        }>;
    };
};
//# sourceMappingURL=user.controller.d.ts.map