var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsUUID, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateRoleDto {
    tenantId;
    code;
    name;
    description;
    isSystem;
}
__decorate([
    ApiProperty({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    IsUUID(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "tenantId", void 0);
__decorate([
    ApiProperty({ description: 'Role code', example: 'physician' }),
    IsString(),
    MinLength(2),
    MaxLength(50),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "code", void 0);
__decorate([
    ApiProperty({ description: 'Role name', example: 'Physician' }),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Role description' }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Is system role', default: false }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateRoleDto.prototype, "isSystem", void 0);
export class UpdateRoleDto {
    name;
    description;
}
__decorate([
    ApiPropertyOptional({ description: 'Role name', example: 'Physician' }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Role description' }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "description", void 0);
export class CreatePermissionDto {
    code;
    name;
    description;
    resource;
    action;
}
__decorate([
    ApiProperty({ description: 'Permission code', example: 'patients.read' }),
    IsString(),
    MinLength(3),
    MaxLength(100),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "code", void 0);
__decorate([
    ApiProperty({ description: 'Permission name', example: 'Read Patients' }),
    IsString(),
    MinLength(2),
    MaxLength(150),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Permission description' }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Resource', example: 'patients' }),
    IsOptional(),
    IsString(),
    MaxLength(50),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "resource", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Action', example: 'read' }),
    IsOptional(),
    IsString(),
    MaxLength(50),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "action", void 0);
export class AssignRoleDto {
    userId;
    roleId;
    assignedBy;
    expiresAt;
}
__decorate([
    ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    IsUUID(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ description: 'Role ID', example: '123e4567-e89b-12d3-a456-426614174000' }),
    IsUUID(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "roleId", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Assigned by user ID' }),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "assignedBy", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Expiration date' }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "expiresAt", void 0);
export class RbacStatsDto {
    totalRoles;
    systemRoles;
    customRoles;
    totalPermissions;
    totalRoleAssignments;
    activeRoleAssignments;
}
__decorate([
    ApiProperty({ description: 'Total number of roles' }),
    __metadata("design:type", Number)
], RbacStatsDto.prototype, "totalRoles", void 0);
__decorate([
    ApiProperty({ description: 'Number of system roles' }),
    __metadata("design:type", Number)
], RbacStatsDto.prototype, "systemRoles", void 0);
__decorate([
    ApiProperty({ description: 'Number of custom roles' }),
    __metadata("design:type", Number)
], RbacStatsDto.prototype, "customRoles", void 0);
__decorate([
    ApiProperty({ description: 'Total number of permissions' }),
    __metadata("design:type", Number)
], RbacStatsDto.prototype, "totalPermissions", void 0);
__decorate([
    ApiProperty({ description: 'Total number of role assignments' }),
    __metadata("design:type", Number)
], RbacStatsDto.prototype, "totalRoleAssignments", void 0);
__decorate([
    ApiProperty({ description: 'Number of active role assignments' }),
    __metadata("design:type", Number)
], RbacStatsDto.prototype, "activeRoleAssignments", void 0);
//# sourceMappingURL=rbac.dto.js.map