"use strict";
/**
 * Schedule DTOs
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWeeklyScheduleDto = exports.RejectResourceBlockDto = exports.UpdateResourceBlockDto = exports.CreateResourceBlockDto = exports.UpdateSpaceScheduleDto = exports.CreateSpaceScheduleDto = exports.UpdateEquipmentScheduleDto = exports.CreateEquipmentScheduleDto = exports.UpdateStaffScheduleDto = exports.CreateStaffScheduleDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
// ========================================
// STAFF SCHEDULE DTOs
// ========================================
class CreateStaffScheduleDto {
    staffId;
    facilityId;
    // Denormalized fields from Foundation database (populated automatically from staffId/facilityId)
    staffDisplayName;
    employeeId;
    staffType;
    facilityCode;
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
    scheduleType;
    notes;
    effectiveFrom;
    effectiveTo;
}
exports.CreateStaffScheduleDto = CreateStaffScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff display name (denormalized from Foundation DB)', maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "staffDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employee identifier (denormalized from Foundation DB)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff type (denormalized from Foundation DB)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "staffType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility code (denormalized from Foundation DB)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "facilityCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateStaffScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time in HH:MM:SS format', example: '09:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time in HH:MM:SS format', example: '17:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is staff available during this time' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateStaffScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule type', enum: ['regular', 'on-call', 'special'], default: 'regular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['regular', 'on-call', 'special']),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "scheduleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateStaffScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date (null = indefinite)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateStaffScheduleDto.prototype, "effectiveTo", void 0);
class UpdateStaffScheduleDto {
    // Denormalized fields from Foundation database
    staffDisplayName;
    employeeId;
    staffType;
    facilityCode;
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
    scheduleType;
    notes;
    effectiveFrom;
    effectiveTo;
}
exports.UpdateStaffScheduleDto = UpdateStaffScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff display name (denormalized from Foundation DB)', maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "staffDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employee identifier (denormalized from Foundation DB)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff type (denormalized from Foundation DB)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "staffType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility code (denormalized from Foundation DB)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "facilityCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Day of week', minimum: 0, maximum: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateStaffScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start time in HH:MM:SS format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time in HH:MM:SS format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is staff available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStaffScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule type', enum: ['regular', 'on-call', 'special'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['regular', 'on-call', 'special']),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "scheduleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStaffScheduleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective from date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateStaffScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateStaffScheduleDto.prototype, "effectiveTo", void 0);
// ========================================
// EQUIPMENT SCHEDULE DTOs
// ========================================
class CreateEquipmentScheduleDto {
    equipmentId;
    facilityId;
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
    maintenanceType;
    notes;
    effectiveFrom;
    effectiveTo;
}
exports.CreateEquipmentScheduleDto = CreateEquipmentScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Equipment UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEquipmentScheduleDto.prototype, "equipmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEquipmentScheduleDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateEquipmentScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time in HH:MM:SS format', example: '08:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time in HH:MM:SS format', example: '20:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is equipment available' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEquipmentScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance type', enum: ['scheduled_maintenance', 'emergency_repair', 'calibration'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['scheduled_maintenance', 'emergency_repair', 'calibration']),
    __metadata("design:type", String)
], CreateEquipmentScheduleDto.prototype, "maintenanceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEquipmentScheduleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateEquipmentScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateEquipmentScheduleDto.prototype, "effectiveTo", void 0);
class UpdateEquipmentScheduleDto {
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
    maintenanceType;
    notes;
    effectiveFrom;
    effectiveTo;
}
exports.UpdateEquipmentScheduleDto = UpdateEquipmentScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Day of week', minimum: 0, maximum: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateEquipmentScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start time in HH:MM:SS format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEquipmentScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time in HH:MM:SS format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEquipmentScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is equipment available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateEquipmentScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['scheduled_maintenance', 'emergency_repair', 'calibration']),
    __metadata("design:type", String)
], UpdateEquipmentScheduleDto.prototype, "maintenanceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEquipmentScheduleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective from date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEquipmentScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEquipmentScheduleDto.prototype, "effectiveTo", void 0);
// ========================================
// SPACE SCHEDULE DTOs
// ========================================
class CreateSpaceScheduleDto {
    spaceId;
    facilityId;
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
    blockReason;
    notes;
    effectiveFrom;
    effectiveTo;
}
exports.CreateSpaceScheduleDto = CreateSpaceScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Space UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSpaceScheduleDto.prototype, "spaceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSpaceScheduleDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of week (0=Sunday, 6=Saturday)', minimum: 0, maximum: 6 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateSpaceScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time in HH:MM:SS format', example: '07:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpaceScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time in HH:MM:SS format', example: '21:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpaceScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is space available' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSpaceScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Block reason', enum: ['maintenance', 'cleaning', 'renovation'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['maintenance', 'cleaning', 'renovation']),
    __metadata("design:type", String)
], CreateSpaceScheduleDto.prototype, "blockReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpaceScheduleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSpaceScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSpaceScheduleDto.prototype, "effectiveTo", void 0);
class UpdateSpaceScheduleDto {
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
    blockReason;
    notes;
    effectiveFrom;
    effectiveTo;
}
exports.UpdateSpaceScheduleDto = UpdateSpaceScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Day of week', minimum: 0, maximum: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateSpaceScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start time in HH:MM:SS format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSpaceScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time in HH:MM:SS format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSpaceScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is space available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSpaceScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Block reason' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['maintenance', 'cleaning', 'renovation']),
    __metadata("design:type", String)
], UpdateSpaceScheduleDto.prototype, "blockReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSpaceScheduleDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective from date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateSpaceScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateSpaceScheduleDto.prototype, "effectiveTo", void 0);
// ========================================
// RESOURCE BLOCK DTOs
// ========================================
class CreateResourceBlockDto {
    resourceType;
    resourceId;
    facilityId;
    blockType;
    startDatetime;
    endDatetime;
    isAvailable;
    reason;
}
exports.CreateResourceBlockDto = CreateResourceBlockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], CreateResourceBlockDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateResourceBlockDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateResourceBlockDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Block type', enum: ['vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event'] }),
    (0, class_validator_1.IsIn)(['vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event']),
    __metadata("design:type", String)
], CreateResourceBlockDto.prototype, "blockType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Block start datetime' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateResourceBlockDto.prototype, "startDatetime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Block end datetime' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateResourceBlockDto.prototype, "endDatetime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is resource available during block (usually false)', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateResourceBlockDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for block' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceBlockDto.prototype, "reason", void 0);
class UpdateResourceBlockDto {
    blockType;
    startDatetime;
    endDatetime;
    isAvailable;
    reason;
}
exports.UpdateResourceBlockDto = UpdateResourceBlockDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Block type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event']),
    __metadata("design:type", String)
], UpdateResourceBlockDto.prototype, "blockType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Block start datetime' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateResourceBlockDto.prototype, "startDatetime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Block end datetime' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateResourceBlockDto.prototype, "endDatetime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is resource available during block' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateResourceBlockDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for block' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateResourceBlockDto.prototype, "reason", void 0);
class RejectResourceBlockDto {
    reason;
}
exports.RejectResourceBlockDto = RejectResourceBlockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for rejection' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectResourceBlockDto.prototype, "reason", void 0);
// ========================================
// BULK OPERATIONS DTOs
// ========================================
class CreateWeeklyScheduleDto {
    staffId;
    staffDisplayName;
    employeeId;
    staffType;
    days;
    startTime;
    endTime;
    isAvailable;
    scheduleType;
    facilityId;
    effectiveFrom;
    effectiveTo;
    notes;
}
exports.CreateWeeklyScheduleDto = CreateWeeklyScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff display name (denormalized)', maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "staffDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Employee identifier (denormalized)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff type (denormalized)', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "staffType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of days (0=Sunday, 6=Saturday)', example: [1, 2, 3, 4, 5], isArray: true }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    __metadata("design:type", Array)
], CreateWeeklyScheduleDto.prototype, "days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time in HH:MM:SS format', example: '09:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time in HH:MM:SS format', example: '17:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is staff available' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWeeklyScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule type', default: 'regular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['regular', 'on-call', 'special']),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "scheduleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective from date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateWeeklyScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateWeeklyScheduleDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeeklyScheduleDto.prototype, "notes", void 0);
//# sourceMappingURL=schedule.dto.js.map