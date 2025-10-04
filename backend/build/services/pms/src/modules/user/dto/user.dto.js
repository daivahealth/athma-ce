var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsObject, IsEnum, IsEmail, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUserDto {
    tenantId;
    email;
    firstName;
    lastName;
    password;
    role;
    permissions;
}
__decorate([
    ApiProperty({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    IsUUID(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "tenantId", void 0);
__decorate([
    ApiProperty({ description: 'User email', example: 'john.doe@example.com' }),
    IsEmail(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ description: 'First name', example: 'John' }),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty({ description: 'Last name', example: 'Doe' }),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty({ description: 'Password', example: 'SecurePassword123!' }),
    IsString(),
    MinLength(8),
    MaxLength(128),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    ApiProperty({ description: 'User role', example: 'physician' }),
    IsString(),
    IsEnum(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist']),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    ApiPropertyOptional({ description: 'User permissions', example: { patients: ['read', 'write'], appointments: ['read'] } }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "permissions", void 0);
export class UpdateUserDto {
    firstName;
    lastName;
    role;
    status;
    permissions;
}
__decorate([
    ApiPropertyOptional({ description: 'First name', example: 'John' }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Last name', example: 'Doe' }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    ApiPropertyOptional({ description: 'User role', example: 'physician' }),
    IsOptional(),
    IsString(),
    IsEnum(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist']),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    ApiPropertyOptional({ description: 'User status', enum: ['active', 'inactive', 'suspended'] }),
    IsOptional(),
    IsEnum(['active', 'inactive', 'suspended']),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({ description: 'User permissions', example: { patients: ['read', 'write'], appointments: ['read'] } }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "permissions", void 0);
export class UserSearchDto {
    query;
    role;
    status;
}
__decorate([
    ApiPropertyOptional({ description: 'Search query for name or email' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UserSearchDto.prototype, "query", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Filter by role', enum: ['admin', 'physician', 'nurse', 'billing_staff', 'receptionist'] }),
    IsOptional(),
    IsString(),
    IsEnum(['admin', 'physician', 'nurse', 'billing_staff', 'receptionist']),
    __metadata("design:type", String)
], UserSearchDto.prototype, "role", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Filter by status', enum: ['active', 'inactive', 'suspended'] }),
    IsOptional(),
    IsEnum(['active', 'inactive', 'suspended']),
    __metadata("design:type", String)
], UserSearchDto.prototype, "status", void 0);
export class ChangePasswordDto {
    currentPassword;
    newPassword;
}
__decorate([
    ApiProperty({ description: 'Current password' }),
    IsString(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    ApiProperty({ description: 'New password' }),
    IsString(),
    MinLength(8),
    MaxLength(128),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
export class UserStatsDto {
    totalUsers;
    activeUsers;
    inactiveUsers;
    usersByRole;
    recentLogins;
}
__decorate([
    ApiProperty({ description: 'Total number of users' }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "totalUsers", void 0);
__decorate([
    ApiProperty({ description: 'Number of active users' }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "activeUsers", void 0);
__decorate([
    ApiProperty({ description: 'Number of inactive users' }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "inactiveUsers", void 0);
__decorate([
    ApiProperty({ description: 'Users by role' }),
    __metadata("design:type", Object)
], UserStatsDto.prototype, "usersByRole", void 0);
__decorate([
    ApiProperty({ description: 'Number of recent logins (last 7 days)' }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "recentLogins", void 0);
//# sourceMappingURL=user.dto.js.map