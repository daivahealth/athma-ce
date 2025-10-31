"use strict";
/**
 * Appointment DTOs
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
exports.GetFacilityAppointmentsDto = exports.GetPatientAppointmentsDto = exports.CancelAppointmentSeriesDto = exports.CreateAppointmentSeriesDto = exports.CancelAppointmentDto = exports.RescheduleAppointmentDto = exports.AllocateResourceDto = exports.BookAppointmentDto = exports.PreferredTimeDto = exports.PreferredResourceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
// ========================================
// NESTED DTOs
// ========================================
class PreferredResourceDto {
    type;
    id;
    role;
}
exports.PreferredResourceDto = PreferredResourceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], PreferredResourceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PreferredResourceDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resource role', example: 'primary_physician' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PreferredResourceDto.prototype, "role", void 0);
class PreferredTimeDto {
    hour;
    minute;
}
exports.PreferredTimeDto = PreferredTimeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hour (0-23)', minimum: 0, maximum: 23 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PreferredTimeDto.prototype, "hour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minute (0-59)', minimum: 0, maximum: 59 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PreferredTimeDto.prototype, "minute", void 0);
// ========================================
// APPOINTMENT BOOKING DTOs
// ========================================
class BookAppointmentDto {
    patientId;
    appointmentType;
    startTime;
    endTime;
    facilityId;
    spaceId;
    staffId;
    preferredResources;
    notes;
    visitType;
    autoAllocateResources;
}
exports.BookAppointmentDto = BookAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment type', example: 'general_checkup' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment start time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BookAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment end time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BookAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Space UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "spaceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Staff UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred resources', type: [PreferredResourceDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PreferredResourceDto),
    __metadata("design:type", Array)
], BookAppointmentDto.prototype, "preferredResources", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Visit type', example: 'in-person' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "visitType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-allocate resources based on requirements', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BookAppointmentDto.prototype, "autoAllocateResources", void 0);
class AllocateResourceDto {
    appointmentId;
    resourceType;
    resourceId;
    resourceRole;
    startTime;
    endTime;
    preparationStart;
    cleanupEnd;
}
exports.AllocateResourceDto = AllocateResourceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AllocateResourceDto.prototype, "appointmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type', enum: ['staff', 'equipment', 'space'] }),
    (0, class_validator_1.IsIn)(['staff', 'equipment', 'space']),
    __metadata("design:type", String)
], AllocateResourceDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AllocateResourceDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resource role', example: 'primary_physician' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllocateResourceDto.prototype, "resourceRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource start time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AllocateResourceDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource end time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AllocateResourceDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preparation start time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AllocateResourceDto.prototype, "preparationStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cleanup end time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AllocateResourceDto.prototype, "cleanupEnd", void 0);
class RescheduleAppointmentDto {
    newStartTime;
    newEndTime;
    reason;
}
exports.RescheduleAppointmentDto = RescheduleAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New appointment start time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], RescheduleAppointmentDto.prototype, "newStartTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New appointment end time' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], RescheduleAppointmentDto.prototype, "newEndTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for rescheduling' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RescheduleAppointmentDto.prototype, "reason", void 0);
class CancelAppointmentDto {
    reason;
}
exports.CancelAppointmentDto = CancelAppointmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for cancellation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelAppointmentDto.prototype, "reason", void 0);
// ========================================
// APPOINTMENT SERIES DTOs
// ========================================
class CreateAppointmentSeriesDto {
    patientId;
    seriesName;
    appointmentType;
    recurrencePattern;
    recurrenceRule;
    startDate;
    endDate;
    totalOccurrences;
    preferredTime;
    durationMinutes;
    facilityId;
    preferredResources;
    notes;
}
exports.CreateAppointmentSeriesDto = CreateAppointmentSeriesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series name', example: 'Physical Therapy - 8 weeks' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "seriesName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment type', example: 'dialysis' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recurrence pattern', enum: ['daily', 'weekly', 'monthly', 'custom'] }),
    (0, class_validator_1.IsIn)(['daily', 'weekly', 'monthly', 'custom']),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "recurrencePattern", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recurrence rule in RRULE format', example: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=24' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "recurrenceRule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Series start date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateAppointmentSeriesDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Series end date (optional if totalOccurrences specified)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateAppointmentSeriesDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total number of occurrences' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAppointmentSeriesDto.prototype, "totalOccurrences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred time for appointments', type: PreferredTimeDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PreferredTimeDto),
    __metadata("design:type", PreferredTimeDto)
], CreateAppointmentSeriesDto.prototype, "preferredTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration of each appointment in minutes', minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAppointmentSeriesDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred resources', type: [PreferredResourceDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PreferredResourceDto),
    __metadata("design:type", Array)
], CreateAppointmentSeriesDto.prototype, "preferredResources", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentSeriesDto.prototype, "notes", void 0);
class CancelAppointmentSeriesDto {
    reason;
}
exports.CancelAppointmentSeriesDto = CancelAppointmentSeriesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for cancelling series' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelAppointmentSeriesDto.prototype, "reason", void 0);
// ========================================
// QUERY DTOs
// ========================================
class GetPatientAppointmentsDto {
    startDate;
    endDate;
    status;
    includeResources;
}
exports.GetPatientAppointmentsDto = GetPatientAppointmentsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetPatientAppointmentsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetPatientAppointmentsDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status filter', example: 'scheduled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPatientAppointmentsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include resources', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetPatientAppointmentsDto.prototype, "includeResources", void 0);
class GetFacilityAppointmentsDto {
    startDate;
    endDate;
    facilityId;
    status;
    includeResources;
}
exports.GetFacilityAppointmentsDto = GetFacilityAppointmentsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetFacilityAppointmentsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetFacilityAppointmentsDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Facility UUID (defaults to user facility)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetFacilityAppointmentsDto.prototype, "facilityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status filter', example: 'scheduled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetFacilityAppointmentsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include resources', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetFacilityAppointmentsDto.prototype, "includeResources", void 0);
//# sourceMappingURL=appointment.dto.js.map