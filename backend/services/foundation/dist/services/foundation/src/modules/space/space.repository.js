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
exports.SpaceRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let SpaceRepository = class SpaceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.space.create({
            data: {
                facilityId: data.facilityId,
                name: data.name,
                spaceNumber: data.spaceNumber ?? null,
                spaceType: data.spaceType ?? 'general',
                capacity: data.capacity ?? 1,
                isActive: data.isActive ?? true,
            },
            select: this.selectFields,
        });
    }
    findMany(facilityId) {
        return this.prisma.space.findMany({
            where: { facilityId },
            orderBy: { name: 'asc' },
            select: this.selectFields,
        });
    }
    findById(id) {
        return this.prisma.space.findUnique({
            where: { id },
            select: this.selectFields,
        });
    }
    update(id, data) {
        return this.prisma.space.update({
            where: { id },
            data,
            select: this.selectFields,
        });
    }
    delete(id) {
        return this.prisma.space.update({
            where: { id },
            data: { isActive: false },
            select: this.selectFields,
        });
    }
    selectFields = {
        id: true,
        facilityId: true,
        name: true,
        spaceNumber: true,
        spaceType: true,
        capacity: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
    };
};
exports.SpaceRepository = SpaceRepository;
exports.SpaceRepository = SpaceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], SpaceRepository);
//# sourceMappingURL=space.repository.js.map