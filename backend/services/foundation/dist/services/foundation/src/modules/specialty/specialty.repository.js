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
exports.SpecialtyRepository = void 0;
const common_1 = require("@nestjs/common");
const database_foundation_1 = require("@zeal/database-foundation");
let SpecialtyRepository = class SpecialtyRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.prisma.specialty.findMany({
            where,
            include: {
                translations: true,
                authorityCodes: true,
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findByCode(code) {
        return this.prisma.specialty.findUnique({
            where: { code },
            include: {
                translations: true,
                authorityCodes: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.specialty.findUnique({
            where: { id },
            include: {
                translations: true,
                authorityCodes: true,
            },
        });
    }
    async findByAuthorityCode(authority, authorityCode) {
        return this.prisma.specialty.findFirst({
            where: {
                authorityCodes: {
                    some: {
                        authority,
                        authorityCode,
                        isActive: true,
                    },
                },
            },
            include: {
                translations: true,
                authorityCodes: true,
            },
        });
    }
    async getWithTranslation(id, locale) {
        return this.prisma.specialty.findUnique({
            where: { id },
            include: {
                translations: {
                    where: { lang: locale },
                },
                authorityCodes: true,
            },
        });
    }
};
exports.SpecialtyRepository = SpecialtyRepository;
exports.SpecialtyRepository = SpecialtyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_foundation_1.PrismaService])
], SpecialtyRepository);
//# sourceMappingURL=specialty.repository.js.map