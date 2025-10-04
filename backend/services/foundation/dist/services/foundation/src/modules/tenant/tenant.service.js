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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const tenant_repository_1 = require("./tenant.repository");
let TenantService = class TenantService {
    tenantRepository;
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    async createTenant(dto) {
        const collision = await this.tenantRepository.findByNameOrDomain(dto.name, dto.domain);
        if (collision) {
            throw new common_1.ConflictException('Tenant with this name or domain already exists');
        }
        return this.tenantRepository.create(dto);
    }
    getTenants() {
        return this.tenantRepository.findMany();
    }
    async getTenant(id) {
        const tenant = await this.tenantRepository.findById(id);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async updateTenant(id, dto) {
        const current = await this.getTenant(id);
        if (dto.name || dto.domain) {
            const targetName = dto.name ?? current.name;
            const targetDomain = dto.domain ?? current.domain;
            const collision = await this.tenantRepository.findByNameOrDomain(targetName, targetDomain);
            if (collision && collision.id !== id) {
                throw new common_1.ConflictException('Tenant with this name or domain already exists');
            }
        }
        return this.tenantRepository.update(id, dto);
    }
    async deleteTenant(id) {
        await this.getTenant(id);
        await this.tenantRepository.delete(id);
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_repository_1.TenantRepository])
], TenantService);
//# sourceMappingURL=tenant.service.js.map