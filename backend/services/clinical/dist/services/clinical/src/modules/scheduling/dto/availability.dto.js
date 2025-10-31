"use strict";
/**
 * Availability DTOs
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
exports.SuggestAlternativeSlotsDto = exports.FindNextAvailableSlotDto = exports.GetResourceUtilizationDto = exports.FindSlotsForAppointmentTypeDto = exports.CheckSlotAvailabilityDto = exports.FindAvailableSlotsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class FindAvailableSlotsDto {
    resourceType;
    resourceId;
    startDate;
    endDate;
    durationMinutes;
    facilityId;
    slotInterval;
    includePreparationTime;
    preparationMinutes;
    cleanupMinutes;
}
exports.FindAvailableSlotsDto = FindAvailableSlotsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], FindAvailableSlotsDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FindAvailableSlotsDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search start date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], FindAvailableSlotsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search end date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], FindAvailableSlotsDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required duration in minutes', minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindAvailableSlotsDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FindAvailableSlotsDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Slot interval in minutes', default: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindAvailableSlotsDto.prototype, "slotInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include preparation time', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FindAvailableSlotsDto.prototype, "includePreparationTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preparation time in minutes', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FindAvailableSlotsDto.prototype, "preparationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cleanup time in minutes', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FindAvailableSlotsDto.prototype, "cleanupMinutes", void 0);
class CheckSlotAvailabilityDto {
    resourceType;
    resourceId;
    startTime;
    endTime;
    preparationStart;
    cleanupEnd;
}
exports.CheckSlotAvailabilityDto = CheckSlotAvailabilityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], CheckSlotAvailabilityDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckSlotAvailabilityDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Slot start time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CheckSlotAvailabilityDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Slot end time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CheckSlotAvailabilityDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preparation start time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CheckSlotAvailabilityDto.prototype, "preparationStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cleanup end time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CheckSlotAvailabilityDto.prototype, "cleanupEnd", void 0);
class FindSlotsForAppointmentTypeDto {
    appointmentType;
    startDate;
    endDate;
    facilityId;
    preferredStaffIds;
    preferredTimeOfDay;
    slotInterval;
}
exports.FindSlotsForAppointmentTypeDto = FindSlotsForAppointmentTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment type', example: 'mri_scan' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindSlotsForAppointmentTypeDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search start date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], FindSlotsForAppointmentTypeDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search end date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], FindSlotsForAppointmentTypeDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FindSlotsForAppointmentTypeDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred staff UUIDs', isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], FindSlotsForAppointmentTypeDto.prototype, "preferredStaffIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred time of day', enum: ['morning', 'afternoon', 'evening'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['morning', 'afternoon', 'evening']),
    __metadata("design:type", String)
], FindSlotsForAppointmentTypeDto.prototype, "preferredTimeOfDay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Slot interval in minutes', default: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindSlotsForAppointmentTypeDto.prototype, "slotInterval", void 0);
class GetResourceUtilizationDto {
    resourceType;
    resourceId;
    startDate;
    endDate;
}
exports.GetResourceUtilizationDto = GetResourceUtilizationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], GetResourceUtilizationDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetResourceUtilizationDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period start date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetResourceUtilizationDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period end date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetResourceUtilizationDto.prototype, "endDate", void 0);
class FindNextAvailableSlotDto {
    resourceType;
    resourceId;
    durationMinutes;
    startFrom;
    maxDaysToSearch;
}
exports.FindNextAvailableSlotDto = FindNextAvailableSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], FindNextAvailableSlotDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FindNextAvailableSlotDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required duration in minutes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindNextAvailableSlotDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start searching from this date (default: now)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], FindNextAvailableSlotDto.prototype, "startFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum days to search', default: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FindNextAvailableSlotDto.prototype, "maxDaysToSearch", void 0);
class SuggestAlternativeSlotsDto {
    resourceType;
    resourceId;
    preferredStartTime;
    durationMinutes;
    maxAlternatives;
    searchWindowDays;
}
exports.SuggestAlternativeSlotsDto = SuggestAlternativeSlotsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], SuggestAlternativeSlotsDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SuggestAlternativeSlotsDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred start time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SuggestAlternativeSlotsDto.prototype, "preferredStartTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required duration in minutes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SuggestAlternativeSlotsDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum number of alternatives', default: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SuggestAlternativeSlotsDto.prototype, "maxAlternatives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search window in days', default: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SuggestAlternativeSlotsDto.prototype, "searchWindowDays", void 0);
//# sourceMappingURL=availability.dto.js.map