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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceService = void 0;
const common_1 = require("@nestjs/common");
const space_repository_1 = require("./space.repository");
let SpaceService = class SpaceService {
    spaceRepository;
    constructor(spaceRepository) {
        this.spaceRepository = spaceRepository;
    }
    create(dto) {
        return this.spaceRepository.create(dto);
    }
    list(facilityId) {
        return this.spaceRepository.findMany(facilityId);
    }
    async get(id) {
        const space = await this.spaceRepository.findById(id);
        if (!space) {
            throw new common_1.NotFoundException('Space not found');
        }
        return space;
    }
    async update(id, dto) {
        await this.get(id);
        return this.spaceRepository.update(id, dto);
    }
    async archive(id) {
        await this.get(id);
        await this.spaceRepository.delete(id);
    }
};
exports.SpaceService = SpaceService;
exports.SpaceService = SpaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [space_repository_1.SpaceRepository])
], SpaceService);
//# sourceMappingURL=space.service.js.map