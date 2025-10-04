var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsObject, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateTenantDto {
    name;
    domain;
    settings;
}
__decorate([
    ApiProperty({ description: 'Tenant name', example: 'Al Rashid Medical Center' }),
    IsString(),
    MinLength(2),
    MaxLength(255),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ description: 'Tenant domain', example: 'alrashid.zeal.com' }),
    IsString(),
    MinLength(3),
    MaxLength(253),
    Matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/, {
        message: 'Invalid domain format'
    }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "domain", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Tenant settings', example: { timezone: 'Asia/Dubai', language: 'en' } }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "settings", void 0);
export class UpdateTenantDto {
    name;
    domain;
    status;
    settings;
}
__decorate([
    ApiPropertyOptional({ description: 'Tenant name', example: 'Al Rashid Medical Center' }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(255),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Tenant domain', example: 'alrashid.zeal.com' }),
    IsOptional(),
    IsString(),
    MinLength(3),
    MaxLength(253),
    Matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/, {
        message: 'Invalid domain format'
    }),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "domain", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Tenant status', enum: ['active', 'inactive', 'suspended'] }),
    IsOptional(),
    IsEnum(['active', 'inactive', 'suspended']),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Tenant settings', example: { timezone: 'Asia/Dubai', language: 'en' } }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], UpdateTenantDto.prototype, "settings", void 0);
export class TenantSearchDto {
    query;
    status;
}
__decorate([
    ApiPropertyOptional({ description: 'Search query for name or domain' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], TenantSearchDto.prototype, "query", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Filter by status', enum: ['active', 'inactive', 'suspended'] }),
    IsOptional(),
    IsEnum(['active', 'inactive', 'suspended']),
    __metadata("design:type", String)
], TenantSearchDto.prototype, "status", void 0);
export class TenantStatsDto {
    totalUsers;
    totalPatients;
    totalFacilities;
    totalStaff;
    totalAppointments;
    activeAppointments;
}
__decorate([
    ApiProperty({ description: 'Total number of users' }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalUsers", void 0);
__decorate([
    ApiProperty({ description: 'Total number of patients' }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalPatients", void 0);
__decorate([
    ApiProperty({ description: 'Total number of facilities' }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalFacilities", void 0);
__decorate([
    ApiProperty({ description: 'Total number of staff' }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalStaff", void 0);
__decorate([
    ApiProperty({ description: 'Total number of appointments' }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalAppointments", void 0);
__decorate([
    ApiProperty({ description: 'Number of active appointments' }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "activeAppointments", void 0);
//# sourceMappingURL=tenant.dto.js.map