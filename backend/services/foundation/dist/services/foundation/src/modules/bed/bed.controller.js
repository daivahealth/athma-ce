"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedStandaloneController = exports.BedController = void 0;
const common_1 = require("@nestjs/common");
const bed_service_1 = require("./bed.service");
const create_bed_dto_1 = require("./dto/create-bed.dto");
const update_bed_dto_1 = require("./dto/update-bed.dto");
const assign_bed_dto_1 = require("./dto/assign-bed.dto");
const release_bed_dto_1 = require("./dto/release-bed.dto");
let BedController = class BedController {
    bedService;
    constructor(bedService) {
        this.bedService = bedService;
    }
    create(wardId, createBedDto) {
        return this.bedService.create(wardId, createBedDto);
    }
    findAll(wardId, status) {
        return this.bedService.findAll(wardId, status);
    }
};
exports.BedController = BedController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('wardId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_bed_dto_1.CreateBedDto]),
    __metadata("design:returntype", void 0)
], BedController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('wardId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BedController.prototype, "findAll", null);
exports.BedController = BedController = __decorate([
    (0, common_1.Controller)('wards/:wardId/beds'),
    __metadata("design:paramtypes", [bed_service_1.BedService])
], BedController);
// Standalone bed controller for direct access
let BedStandaloneController = class BedStandaloneController {
    bedService;
    constructor(bedService) {
        this.bedService = bedService;
    }
    findAvailable(wardId) {
        return this.bedService.findAvailable(wardId);
    }
    findOne(id) {
        return this.bedService.findOne(id);
    }
    assignPatient(id, assignBedDto) {
        return this.bedService.assignPatient(id, assignBedDto);
    }
    releasePatient(id, releaseBedDto) {
        return this.bedService.releasePatient(id, releaseBedDto);
    }
    update(id, updateBedDto) {
        return this.bedService.update(id, updateBedDto);
    }
    remove(id) {
        return this.bedService.remove(id);
    }
};
exports.BedStandaloneController = BedStandaloneController;
__decorate([
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Query)('wardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BedStandaloneController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BedStandaloneController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_bed_dto_1.AssignBedDto]),
    __metadata("design:returntype", void 0)
], BedStandaloneController.prototype, "assignPatient", null);
__decorate([
    (0, common_1.Post)(':id/release'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, release_bed_dto_1.ReleaseBedDto]),
    __metadata("design:returntype", void 0)
], BedStandaloneController.prototype, "releasePatient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bed_dto_1.UpdateBedDto]),
    __metadata("design:returntype", void 0)
], BedStandaloneController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BedStandaloneController.prototype, "remove", null);
exports.BedStandaloneController = BedStandaloneController = __decorate([
    (0, common_1.Controller)('beds'),
    __metadata("design:paramtypes", [bed_service_1.BedService])
], BedStandaloneController);
//# sourceMappingURL=bed.controller.js.map