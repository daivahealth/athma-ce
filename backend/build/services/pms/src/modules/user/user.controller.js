var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserSearchDto, ChangePasswordDto } from './dto/user.dto';
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return {
            data: user,
            message: 'User created successfully'
        };
    }
    async findAll(tenantId, searchDto, pagination) {
        const { users, total } = await this.userService.searchUsers(tenantId, searchDto, pagination);
        return {
            data: users,
            pagination: {
                total,
                page: pagination.page || 1,
                limit: pagination.limit || 20,
                totalPages: Math.ceil(total / (pagination.limit || 20)),
                hasNext: (pagination.page || 1) < Math.ceil(total / (pagination.limit || 20)),
                hasPrev: (pagination.page || 1) > 1,
            },
        };
    }
    async getUsersByRole(tenantId, role) {
        const users = await this.userService.getUsersByRole(tenantId, role);
        return {
            data: users,
            message: 'Users retrieved successfully'
        };
    }
    async getUserStats(tenantId) {
        const stats = await this.userService.getUserStats(tenantId);
        return {
            data: stats,
            message: 'User statistics retrieved successfully'
        };
    }
    async findOne(id) {
        const user = await this.userService.getUserById(id);
        return {
            data: user,
            message: 'User retrieved successfully'
        };
    }
    async findByEmail(tenantId, email) {
        const user = await this.userService.getUserByEmail(tenantId, email);
        return {
            data: user,
            message: 'User retrieved successfully'
        };
    }
    async update(id, updateUserDto) {
        const user = await this.userService.updateUser(id, updateUserDto);
        return {
            data: user,
            message: 'User updated successfully'
        };
    }
    async changePassword(id, changePasswordDto) {
        await this.userService.changePassword(id, changePasswordDto);
        return {
            data: undefined,
            message: 'Password changed successfully'
        };
    }
    async remove(id) {
        await this.userService.deleteUser(id);
    }
    async checkExists(id) {
        const exists = await this.userService.userExists(id);
        return {
            data: { exists },
            message: 'User existence checked'
        };
    }
    async checkEmailExists(tenantId, email) {
        const exists = await this.userService.emailExistsInTenant(tenantId, email);
        return {
            data: { exists },
            message: 'Email existence checked'
        };
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({ status: 201, description: 'User created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 404, description: 'Tenant not found' }),
    ApiResponse({ status: 409, description: 'User with this email already exists in tenant' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    Get('tenant/:tenantId'),
    ApiOperation({ summary: 'Get all users for a tenant with pagination and search' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'Users retrieved successfully' }),
    __param(0, Param('tenantId')),
    __param(1, Query()),
    __param(2, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserSearchDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    Get('tenant/:tenantId/role/:role'),
    ApiOperation({ summary: 'Get users by role for a tenant' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiParam({ name: 'role', description: 'User role' }),
    ApiResponse({ status: 200, description: 'Users retrieved successfully' }),
    __param(0, Param('tenantId')),
    __param(1, Param('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsersByRole", null);
__decorate([
    Get('tenant/:tenantId/stats'),
    ApiOperation({ summary: 'Get user statistics for a tenant' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiResponse({ status: 200, description: 'User statistics retrieved successfully' }),
    __param(0, Param('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserStats", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User retrieved successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    Get('email/:tenantId/:email'),
    ApiOperation({ summary: 'Get user by email and tenant' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiParam({ name: 'email', description: 'User email' }),
    ApiResponse({ status: 200, description: 'User retrieved successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    __param(0, Param('tenantId')),
    __param(1, Param('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findByEmail", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Update user' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User updated successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    Put(':id/password'),
    ApiOperation({ summary: 'Change user password' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'Password changed successfully' }),
    ApiResponse({ status: 401, description: 'Current password is incorrect' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete user (soft delete)' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 204, description: 'User deleted successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    Get(':id/exists'),
    ApiOperation({ summary: 'Check if user exists' }),
    ApiParam({ name: 'id', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User existence checked' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkExists", null);
__decorate([
    Get('email/:tenantId/:email/exists'),
    ApiOperation({ summary: 'Check if email exists in tenant' }),
    ApiParam({ name: 'tenantId', description: 'Tenant ID' }),
    ApiParam({ name: 'email', description: 'User email' }),
    ApiResponse({ status: 200, description: 'Email existence checked' }),
    __param(0, Param('tenantId')),
    __param(1, Param('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkEmailExists", null);
UserController = __decorate([
    ApiTags('Users'),
    Controller('users'),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map