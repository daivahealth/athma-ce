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
exports.WardStandaloneController = exports.WardController = void 0;
const common_1 = require("@nestjs/common");
const ward_service_1 = require("./ward.service");
const create_ward_dto_1 = require("./dto/create-ward.dto");
const update_ward_dto_1 = require("./dto/update-ward.dto");
let WardController = class WardController {
    wardService;
    constructor(wardService) {
        this.wardService = wardService;
    }
    create(departmentId, createWardDto) {
        return this.wardService.create(departmentId, createWardDto);
    }
    findAll(departmentId, wardType) {
        return this.wardService.findAll(departmentId, wardType);
    }
};
exports.WardController = WardController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ward_dto_1.CreateWardDto]),
    __metadata("design:returntype", void 0)
], WardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WardController.prototype, "findAll", null);
exports.WardController = WardController = __decorate([
    (0, common_1.Controller)('departments/:departmentId/wards'),
    __metadata("design:paramtypes", [ward_service_1.WardService])
], WardController);
// Standalone ward controller for direct access
let WardStandaloneController = class WardStandaloneController {
    wardService;
    constructor(wardService) {
        this.wardService = wardService;
    }
    findOne(id) {
        return this.wardService.findOne(id);
    }
    getAvailability(id) {
        return this.wardService.getAvailability(id);
    }
    update(id, updateWardDto) {
        return this.wardService.update(id, updateWardDto);
    }
    remove(id) {
        return this.wardService.remove(id);
    }
};
exports.WardStandaloneController = WardStandaloneController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WardStandaloneController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WardStandaloneController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ward_dto_1.UpdateWardDto]),
    __metadata("design:returntype", void 0)
], WardStandaloneController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WardStandaloneController.prototype, "remove", null);
exports.WardStandaloneController = WardStandaloneController = __decorate([
    (0, common_1.Controller)('wards'),
    __metadata("design:paramtypes", [ward_service_1.WardService])
], WardStandaloneController);
//# sourceMappingURL=ward.controller.js.map