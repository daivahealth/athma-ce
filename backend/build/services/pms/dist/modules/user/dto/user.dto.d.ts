export let CreateUserDto: {
    new (): {
        tenantId: any;
        email: any;
        firstName: any;
        lastName: any;
        password: any;
        role: any;
        permissions: any;
    };
};
export let UpdateUserDto: {
    new (): {
        firstName: any;
        lastName: any;
        role: any;
        status: any;
        permissions: any;
    };
};
export let UserSearchDto: {
    new (): {
        query: any;
        role: any;
        status: any;
    };
};
export let ChangePasswordDto: {
    new (): {
        currentPassword: any;
        newPassword: any;
    };
};
export let UserStatsDto: {
    new (): {
        totalUsers: any;
        activeUsers: any;
        inactiveUsers: any;
        usersByRole: any;
        recentLogins: any;
    };
};
//# sourceMappingURL=user.dto.d.ts.map