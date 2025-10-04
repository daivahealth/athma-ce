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
exports.TenantRepository = void 0;
const common_1 = require("@nestjs/common");
const shared_database_1 = require("@zeal/shared-database");
let TenantRepository = class TenantRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.tenant.create({
            data: {
                name: data.name,
                domain: data.domain,
                settings: (data.settings ?? {}),
            },
        });
    }
    findMany() {
        return this.prisma.tenant.findMany({
            orderBy: { name: 'asc' },
        });
    }
    findByNameOrDomain(name, domain) {
        return this.prisma.tenant.findFirst({
            where: {
                OR: [{ name }, { domain }],
            },
        });
    }
    findById(id) {
        return this.prisma.tenant.findUnique({ where: { id } });
    }
    update(id, data) {
        const updateData = {};
        if (data.name !== undefined) {
            updateData.name = data.name;
        }
        if (data.domain !== undefined) {
            updateData.domain = data.domain;
        }
        if (data.settings !== undefined) {
            updateData.settings = data.settings;
        }
        return this.prisma.tenant.update({
            where: { id },
            data: updateData,
        });
    }
    delete(id) {
        return this.prisma.tenant.delete({ where: { id } });
    }
};
exports.TenantRepository = TenantRepository;
exports.TenantRepository = TenantRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shared_database_1.PrismaService])
], TenantRepository);
//# sourceMappingURL=tenant.repository.js.map