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
exports.FacilityRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let FacilityRepository = class FacilityRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.facility.create({
            data,
            select: this.selectFields,
        });
    }
    findMany(tenantId) {
        return this.prisma.facility.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
            select: this.selectFields,
        });
    }
    findById(id) {
        return this.prisma.facility.findUnique({
            where: { id },
            select: this.selectFields,
        });
    }
    update(id, data) {
        return this.prisma.facility.update({
            where: { id },
            data,
            select: this.selectFields,
        });
    }
    delete(id) {
        return this.prisma.facility.update({
            where: { id },
            data: { status: 'inactive' },
            select: this.selectFields,
        });
    }
    selectFields = {
        id: true,
        tenantId: true,
        name: true,
        facilityType: true,
        licenseNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        emirate: true,
        postalCode: true,
        phoneNumber: true,
        email: true,
        website: true,
        status: true,
        createdAt: true,
        updatedAt: true,
    };
};
exports.FacilityRepository = FacilityRepository;
exports.FacilityRepository = FacilityRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], FacilityRepository);
//# sourceMappingURL=facility.repository.js.map