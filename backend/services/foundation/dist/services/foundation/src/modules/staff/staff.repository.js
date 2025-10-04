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
exports.StaffRepository = void 0;
const common_1 = require("@nestjs/common");
const shared_database_1 = require("@zeal/shared-database");
let StaffRepository = class StaffRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.staff.create({
            data,
            select: this.selectFields,
        });
    }
    findMany(tenantId) {
        return this.prisma.staff.findMany({
            where: { tenantId },
            orderBy: { lastName: 'asc' },
            select: this.selectFields,
        });
    }
    findById(id) {
        return this.prisma.staff.findUnique({
            where: { id },
            select: this.selectFields,
        });
    }
    findByEmployeeId(tenantId, employeeId) {
        return this.prisma.staff.findFirst({
            where: {
                tenantId,
                employeeId,
            },
            select: this.selectFields,
        });
    }
    update(id, data) {
        return this.prisma.staff.update({
            where: { id },
            data,
            select: this.selectFields,
        });
    }
    delete(id) {
        return this.prisma.staff.update({
            where: { id },
            data: { status: 'inactive' },
            select: this.selectFields,
        });
    }
    selectFields = {
        id: true,
        tenantId: true,
        firstName: true,
        lastName: true,
        middleName: true,
        dateOfBirth: true,
        gender: true,
        phoneNumber: true,
        email: true,
        employeeId: true,
        staffType: true,
        licenseNumber: true,
        licenseExpiry: true,
        status: true,
        createdAt: true,
        updatedAt: true,
    };
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shared_database_1.PrismaService])
], StaffRepository);
//# sourceMappingURL=staff.repository.js.map