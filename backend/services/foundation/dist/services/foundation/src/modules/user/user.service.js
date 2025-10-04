"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const user_repository_1 = require("./user.repository");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(dto) {
        const existing = await this.userRepository.findByEmail(dto.tenantId, dto.email);
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists in tenant');
        }
        const passwordHash = await argon2.hash(dto.password);
        const record = await this.userRepository.create({
            tenantId: dto.tenantId,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            passwordHash,
            role: dto.role ?? 'user',
        });
        return record;
    }
    listUsers(tenantId) {
        return this.userRepository.findMany(tenantId);
    }
    async getUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(id, dto) {
        const current = await this.getUser(id);
        const updates = {};
        if (dto.firstName !== undefined) {
            updates.firstName = dto.firstName;
        }
        if (dto.lastName !== undefined) {
            updates.lastName = dto.lastName;
        }
        if (dto.role !== undefined) {
            updates.role = dto.role;
        }
        if (dto.email !== undefined) {
            updates.email = dto.email;
        }
        if (dto.password) {
            updates.passwordHash = await argon2.hash(dto.password);
        }
        if (dto.tenantId || dto.email) {
            const targetTenant = dto.tenantId ?? current.tenantId;
            const targetEmail = dto.email ?? current.email;
            const conflict = await this.userRepository.findByEmail(targetTenant, targetEmail);
            if (conflict && conflict.id !== id) {
                throw new common_1.ConflictException('User with this email already exists in tenant');
            }
            if (dto.tenantId && dto.tenantId !== current.tenantId) {
                throw new common_1.ConflictException('Transferring users between tenants is not supported');
            }
        }
        return this.userRepository.update(id, updates);
    }
    async deleteUser(id) {
        await this.getUser(id);
        await this.userRepository.delete(id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map