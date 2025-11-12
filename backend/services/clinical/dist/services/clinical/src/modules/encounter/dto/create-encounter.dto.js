"use strict";
/**
 * DTO for creating a new encounter
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
exports.CreateEncounterDto = exports.EncounterSource = exports.EncounterPriority = exports.EncounterStatus = exports.EncounterClass = void 0;
const class_validator_1 = require("class-validator");
var EncounterClass;
(function (EncounterClass) {
    EncounterClass["AMB"] = "AMB";
    EncounterClass["EMER"] = "EMER";
    EncounterClass["FLD"] = "FLD";
    EncounterClass["HH"] = "HH";
    EncounterClass["IMP"] = "IMP";
    EncounterClass["ACUTE"] = "ACUTE";
    EncounterClass["NONAC"] = "NONAC";
    EncounterClass["OBSENC"] = "OBSENC";
    EncounterClass["PRENC"] = "PRENC";
    EncounterClass["SS"] = "SS";
    EncounterClass["VR"] = "VR";
})(EncounterClass || (exports.EncounterClass = EncounterClass = {}));
var EncounterStatus;
(function (EncounterStatus) {
    EncounterStatus["PLANNED"] = "planned";
    EncounterStatus["ARRIVED"] = "arrived";
    EncounterStatus["TRIAGED"] = "triaged";
    EncounterStatus["IN_PROGRESS"] = "in-progress";
    EncounterStatus["ON_LEAVE"] = "onleave";
    EncounterStatus["FINISHED"] = "finished";
    EncounterStatus["CANCELLED"] = "cancelled";
    EncounterStatus["ENTERED_IN_ERROR"] = "entered-in-error";
    EncounterStatus["UNKNOWN"] = "unknown";
})(EncounterStatus || (exports.EncounterStatus = EncounterStatus = {}));
var EncounterPriority;
(function (EncounterPriority) {
    EncounterPriority["STAT"] = "stat";
    EncounterPriority["ASAP"] = "asap";
    EncounterPriority["URGENT"] = "urgent";
    EncounterPriority["ROUTINE"] = "routine";
    EncounterPriority["ELECTIVE"] = "elective";
})(EncounterPriority || (exports.EncounterPriority = EncounterPriority = {}));
var EncounterSource;
(function (EncounterSource) {
    EncounterSource["APPOINTMENT"] = "appointment";
    EncounterSource["WALK_IN"] = "walk-in";
    EncounterSource["REFERRAL"] = "referral";
    EncounterSource["EMERGENCY"] = "emergency";
    EncounterSource["TRANSFER"] = "transfer";
})(EncounterSource || (exports.EncounterSource = EncounterSource = {}));
class CreateEncounterDto {
    patientId;
    appointmentId;
    primaryStaffId;
    encounterClass;
    status;
    priority;
    startTime;
    endTime;
    encounterSource;
    encounterNumber;
    walkInDetails;
}
exports.CreateEncounterDto = CreateEncounterDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "appointmentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "primaryStaffId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EncounterClass),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "encounterClass", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EncounterStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EncounterPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EncounterSource),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "encounterSource", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "encounterNumber", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateEncounterDto.prototype, "walkInDetails", void 0);
//# sourceMappingURL=create-encounter.dto.js.map