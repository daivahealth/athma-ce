var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import * as bcrypt from 'bcryptjs';
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new user
     */
    async createUser(createUserDto) {
        const { tenantId, email, firstName, lastName, password, role, permissions } = createUserDto;
        // Check if tenant exists
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId }
        });
        if (!tenant) {
            throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        // Check for existing user with same email in tenant
        const existingUser = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email
                }
            }
        });
        if (existingUser) {
            throw new ConflictException('User with this email already exists in this tenant');
        }
        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);
        return this.prisma.user.create({
            data: {
                tenantId,
                email,
                firstName,
                lastName,
                passwordHash,
                role,
                permissions: permissions || {},
                status: 'active'
            }
        });
    }
    /**
     * Get user by ID
     */
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        domain: true
                    }
                },
                userRoles: {
                    include: {
                        role: true
                    }
                },
                mfaSettings: true
            }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    /**
     * Get user by email and tenant
     */
    async getUserByEmail(tenantId, email) {
        const user = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email
                }
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        domain: true
                    }
                },
                userRoles: {
                    include: {
                        role: true
                    }
                },
                mfaSettings: true
            }
        });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found in tenant ${tenantId}`);
        }
        return user;
    }
    /**
     * Search users with pagination
     */
    async searchUsers(tenantId, searchDto, pagination) {
        const { query, role, status } = searchDto;
        const { page = 1, limit = 20 } = pagination;
        const where = {
            tenantId,
            AND: [
                ...(query
                    ? [
                        {
                            OR: [
                                { firstName: { contains: query, mode: 'insensitive' } },
                                { lastName: { contains: query, mode: 'insensitive' } },
                                { email: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    ]
                    : []),
                ...(role ? [{ role }] : []),
                ...(status ? [{ status }] : [])
            ]
        };
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { lastName: 'asc' },
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            domain: true
                        }
                    },
                    userRoles: {
                        include: {
                            role: true
                        }
                    }
                }
            }),
            this.prisma.user.count({ where })
        ]);
        return { users, total };
    }
    /**
     * Update user
     */
    async updateUser(id, updateUserDto) {
        const { firstName, lastName, role, status, permissions } = updateUserDto;
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(role && { role }),
                ...(status && { status }),
                ...(permissions && { permissions })
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        domain: true
                    }
                },
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
    }
    /**
     * Change user password
     */
    async changePassword(id, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }
        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash: newPasswordHash }
        });
    }
    /**
     * Delete user (soft delete by setting status to inactive)
     */
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        // Soft delete by setting status to inactive
        await this.prisma.user.update({
            where: { id },
            data: { status: 'inactive' }
        });
    }
    /**
     * Verify user password
     */
    async verifyPassword(id, password) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { passwordHash: true }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return bcrypt.compare(password, user.passwordHash);
    }
    /**
     * Update last login timestamp
     */
    async updateLastLogin(id) {
        await this.prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() }
        });
    }
    /**
     * Get users by role
     */
    async getUsersByRole(tenantId, role) {
        return this.prisma.user.findMany({
            where: {
                tenantId,
                role,
                status: 'active'
            },
            orderBy: { lastName: 'asc' },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                status: true,
                email: true,
                tenantId: true,
                firstName: true,
                lastName: true,
                permissions: true,
                passwordHash: true,
                lastLogin: true
            }
        });
    }
    /**
     * Get user statistics for tenant
     */
    async getUserStats(tenantId) {
        const [totalUsers, activeUsers, inactiveUsers, usersByRole, recentLogins] = await Promise.all([
            this.prisma.user.count({ where: { tenantId } }),
            this.prisma.user.count({ where: { tenantId, status: 'active' } }),
            this.prisma.user.count({ where: { tenantId, status: 'inactive' } }),
            this.prisma.user.groupBy({
                by: ['role'],
                where: { tenantId, status: 'active' },
                _count: { role: true }
            }),
            this.prisma.user.count({
                where: {
                    tenantId,
                    lastLogin: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            })
        ]);
        const usersByRoleMap = usersByRole.reduce((acc, item) => {
            acc[item.role] = item._count.role;
            return acc;
        }, {});
        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            usersByRole: usersByRoleMap,
            recentLogins
        };
    }
    /**
     * Check if user exists
     */
    async userExists(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!user;
    }
    /**
     * Check if email exists in tenant
     */
    async emailExistsInTenant(tenantId, email) {
        const user = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email
                }
            },
            select: { id: true }
        });
        return !!user;
    }
};
UserService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map