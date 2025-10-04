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
exports.SpaceController = void 0;
const common_1 = require("@nestjs/common");
const space_service_1 = require("./space.service");
const create_space_dto_1 = require("./dto/create-space.dto");
const update_space_dto_1 = require("./dto/update-space.dto");
let SpaceController = class SpaceController {
    spaceService;
    constructor(spaceService) {
        this.spaceService = spaceService;
    }
    create(dto) {
        return this.spaceService.create(dto);
    }
    list(facilityId) {
        if (!facilityId) {
            throw new common_1.BadRequestException('facilityId query parameter is required');
        }
        return this.spaceService.list(facilityId);
    }
    get(id) {
        return this.spaceService.get(id);
    }
    update(id, dto) {
        return this.spaceService.update(id, dto);
    }
    remove(id) {
        return this.spaceService.archive(id);
    }
};
exports.SpaceController = SpaceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_space_dto_1.CreateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('facilityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_space_dto_1.UpdateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpaceController.prototype, "remove", null);
exports.SpaceController = SpaceController = __decorate([
    (0, common_1.Controller)('spaces'),
    __metadata("design:paramtypes", [space_service_1.SpaceService])
], SpaceController);
//# sourceMappingURL=space.controller.js.map