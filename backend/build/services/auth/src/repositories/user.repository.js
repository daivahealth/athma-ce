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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const shared_database_1 = require("@zeal/shared-database");
const shared_utils_1 = require("@zeal/shared-utils");
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                tenantId: true,
                status: true,
            },
        });
        return user ?? null;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                tenantId: true,
                status: true,
            },
        });
        return user ?? null;
    }
    async updateLastLogin(userId) {
        const store = shared_utils_1.RequestContext.getStore();
        if (!store?.tenantId || !store?.userId) {
            throw new Error('Request context missing tenant/user for updateLastLogin');
        }
        await this.prisma.runWithRequestContext(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    lastLogin: new Date(),
                },
            });
        });
    }
    async updatePassword(userId, passwordHash) {
        const store = shared_utils_1.RequestContext.getStore();
        if (!store?.tenantId || !store?.userId) {
            throw new Error('Request context missing tenant/user for updatePassword');
        }
        await this.prisma.runWithRequestContext(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    passwordHash,
                },
            });
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shared_database_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map