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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const user_service_1 = require("./user.service");
const mfa_service_1 = require("./mfa.service");
const user_repository_1 = require("../repositories/user.repository");
const shared_utils_1 = require("@zeal/shared-utils");
const database_foundation_1 = require("@zeal/database-foundation");
const jwt_expiry_util_1 = require("../utils/jwt-expiry.util");
let AuthService = class AuthService {
    userService;
    mfaService;
    userRepository;
    jwtService;
    prisma;
    constructor(userService, mfaService, userRepository, jwtService, prisma) {
        this.userService = userService;
        this.mfaService = mfaService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    getAccessTokenSecret() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable must be set');
        }
        return secret;
    }
    getRefreshTokenSecret() {
        const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET or JWT_SECRET must be set');
        }
        return secret;
    }
    getResetTokenSecret() {
        const secret = process.env.JWT_RESET_SECRET ?? process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_RESET_SECRET or JWT_SECRET must be set');
        }
        return secret;
    }
    async login(loginDto) {
        const { email, password, mfaCode, deviceId, rememberMe } = loginDto;
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = await argon2.verify(user.passwordHash, password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Check if MFA is required
        const mfaStatus = await this.mfaService.getMfaStatus(user.id);
        if (mfaStatus.enabled && !mfaCode) {
            return {
                requiresMfa: true,
                accessToken: null,
                refreshToken: null,
                user: null,
                expiresIn: 0,
            };
        }
        // Verify MFA if provided
        if (mfaCode) {
            const mfaValid = await this.mfaService.verifyMfa({
                userId: user.id,
                method: mfaStatus.methods[0]?.type || 'totp',
                code: mfaCode,
                deviceId,
            });
            if (!mfaValid.success) {
                throw new common_1.UnauthorizedException('Invalid MFA code');
            }
        }
        const userAgent = shared_utils_1.RequestContext.getUserAgent() ?? 'auth-service';
        const contextStore = {
            tenantId: user.tenantId,
            userId: user.id,
            userAgent,
        };
        return shared_utils_1.RequestContext.run(contextStore, async () => {
            await this.userRepository.updateLastLogin(user.id);
            const userWithRoles = await this.userService.getUserWithRoles(user.id);
            const userPermissions = await this.userService.getUserPermissions(user.id, user.tenantId);
            // Fetch user's facility context
            const facilityData = await this.fetchUserFacilities(user.id);
            const accessToken = await this.generateAccessToken(userWithRoles, userPermissions);
            const refreshToken = await this.generateRefreshToken(user.id);
            await this.storeSession(user.id, {
                deviceId,
                userAgent,
                ipAddress: '', // Will be set by middleware
            });
            return {
                accessToken,
                refreshToken,
                user: {
                    ...userWithRoles,
                    defaultFacility: facilityData?.defaultFacility,
                    facilities: facilityData?.facilities,
                },
                expiresIn: this.getTokenExpiry(),
                requiresMfa: false,
            };
        });
    }
    async refresh(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.getRefreshTokenSecret(),
            });
            const user = await this.userRepository.findById(payload.sub);
            if (!user || user.status !== 'active') {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const userAgent = shared_utils_1.RequestContext.getUserAgent() ?? 'foundation-api';
            const contextStore = {
                tenantId: user.tenantId,
                userId: user.id,
                userAgent,
            };
            return shared_utils_1.RequestContext.run(contextStore, async () => {
                const userWithRoles = await this.userService.getUserWithRoles(user.id);
                const userPermissions = await this.userService.getUserPermissions(user.id, user.tenantId);
                const newAccessToken = await this.generateAccessToken(userWithRoles, userPermissions);
                const newRefreshToken = await this.generateRefreshToken(user.id);
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    expiresIn: this.getTokenExpiry(),
                };
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, logoutDto) {
        const { refreshToken, allDevices } = logoutDto;
        if (allDevices) {
            await this.revokeAllSessions(userId);
        }
        else if (refreshToken) {
            await this.revokeSession(userId, refreshToken);
        }
        if (refreshToken) {
            await this.blacklistToken(refreshToken);
        }
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        // Verify current password
        const isCurrentPasswordValid = await argon2.verify(user.passwordHash, currentPassword);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const userAgent = shared_utils_1.RequestContext.getUserAgent() ?? 'foundation-api';
        await shared_utils_1.RequestContext.run({
            tenantId: user.tenantId,
            userId,
            userAgent,
        }, async () => {
            const newPasswordHash = await argon2.hash(newPassword);
            await this.userRepository.updatePassword(userId, newPasswordHash);
            await this.revokeAllSessions(userId);
        });
    }
    async requestPasswordReset(resetPasswordDto) {
        const { email } = resetPasswordDto;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            // Don't reveal if user exists or not
            return;
        }
        // Generate reset token
        const resetToken = await this.generatePasswordResetToken(user.id);
        // Send reset email (implementation would depend on email service)
        await this.sendPasswordResetEmail(user.email, resetToken);
    }
    async confirmPasswordReset(confirmResetPasswordDto) {
        const { token, newPassword } = confirmResetPasswordDto;
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.getResetTokenSecret(),
            });
            if (payload.type !== 'password_reset') {
                throw new common_1.BadRequestException('Invalid reset token');
            }
            const user = await this.userRepository.findById(payload.sub);
            if (!user) {
                throw new common_1.BadRequestException('User not found');
            }
            const userAgent = shared_utils_1.RequestContext.getUserAgent() ?? 'foundation-api';
            await shared_utils_1.RequestContext.run({
                tenantId: user.tenantId,
                userId: user.id,
                userAgent,
            }, async () => {
                const newPasswordHash = await argon2.hash(newPassword);
                await this.userRepository.updatePassword(user.id, newPasswordHash);
                await this.revokeAllSessions(user.id);
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
    }
    async getProfile(userId) {
        return this.userService.getUserWithRoles(userId);
    }
    async switchFacility(userId, switchFacilityDto) {
        const { facilityId } = switchFacilityDto;
        // Fetch user's facility data to validate access
        const facilityData = await this.fetchUserFacilities(userId);
        if (!facilityData?.facilityIds?.includes(facilityId)) {
            throw new common_1.BadRequestException('User does not have access to this facility');
        }
        // Get user data
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const userWithRoles = await this.userService.getUserWithRoles(userId);
        const userPermissions = await this.userService.getUserPermissions(userId, user.tenantId);
        // Generate new access token with updated facilityId
        const accessToken = await this.generateAccessToken(userWithRoles, userPermissions, facilityId);
        // Find the facility details
        const currentFacility = facilityData.facilities?.find((f) => f.id === facilityId);
        return {
            accessToken,
            currentFacility: currentFacility || null,
        };
    }
    async getUserSessions(userId) {
        // Implementation would depend on session storage
        return [];
    }
    async revokeSession(userId, sessionId) {
        // Implementation would depend on session storage
    }
    async revokeAllSessions(userId) {
        // Implementation would depend on session storage
    }
    async getTrustedDevices(userId) {
        // Implementation would depend on device storage
        return [];
    }
    async removeTrustedDevice(userId, deviceId) {
        // Implementation would depend on device storage
    }
    async fetchUserFacilities(userId) {
        const store = shared_utils_1.RequestContext.getStore();
        if (!store?.tenantId) {
            throw new Error('Request context missing tenant information');
        }
        const records = await this.prisma.runWithRequestContext(async (tx) => tx.userFacility.findMany({
            where: {
                userId,
                revokedAt: null,
            },
            select: {
                isDefault: true,
                accessLevel: true,
                facility: {
                    select: {
                        id: true,
                        name: true,
                        facilityType: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        }));
        const facilities = records.map((record) => ({
            id: record.facility.id,
            name: record.facility.name,
            facilityType: record.facility.facilityType,
            accessLevel: record.accessLevel,
            isDefault: record.isDefault,
        }));
        const defaultFacility = facilities.find((facility) => facility.isDefault) ?? null;
        return {
            facilities,
            defaultFacility,
            facilityIds: facilities.map((facility) => facility.id),
        };
    }
    async generateAccessToken(user, permissions, facilityId) {
        // Fetch user's facility context
        const facilityData = await this.fetchUserFacilities(user.id);
        const defaultFacilityId = facilityData?.defaultFacility?.id || null;
        const facilityIds = facilityData?.facilities?.map((f) => f.id) || [];
        const activeFacilityId = facilityId || defaultFacilityId;
        const payload = {
            sub: user.id,
            email: user.email,
            tenantId: user.tenantId,
            roles: permissions.roles,
            permissions: permissions.permissions,
            defaultFacilityId,
            facilityId: activeFacilityId,
            facilityIds,
            iat: Math.floor(Date.now() / 1000),
        };
        return this.jwtService.signAsync(payload, {
            secret: this.getAccessTokenSecret(),
        });
    }
    async generateRefreshToken(userId) {
        const payload = {
            sub: userId,
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
        };
        return this.jwtService.signAsync(payload, {
            secret: this.getRefreshTokenSecret(),
            expiresIn: (0, jwt_expiry_util_1.resolveExpiresIn)(process.env.JWT_REFRESH_EXPIRY, jwt_expiry_util_1.DEFAULT_REFRESH_TOKEN_EXPIRY),
        });
    }
    async generatePasswordResetToken(userId) {
        const payload = {
            sub: userId,
            type: 'password_reset',
            iat: Math.floor(Date.now() / 1000),
        };
        return this.jwtService.signAsync(payload, {
            secret: this.getResetTokenSecret(),
            expiresIn: jwt_expiry_util_1.DEFAULT_RESET_TOKEN_EXPIRY,
        });
    }
    getTokenExpiry() {
        const expiry = process.env.JWT_EXPIRY || '1h';
        const match = expiry.match(/(\d+)([smhd])/);
        if (!match)
            return 3600;
        const [, amount, unit] = match;
        const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
        return parseInt(amount || '1') * (multipliers[unit] || 1);
    }
    async storeSession(userId, sessionData) {
        // Implementation would store session in Redis or database
    }
    async blacklistToken(token) {
        // Implementation would add token to blacklist in Redis
    }
    async sendPasswordResetEmail(email, resetToken) {
        // Implementation would send email via email service
        console.log(`Password reset email sent to ${email} with token ${resetToken}`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mfa_service_1.MfaService,
        user_repository_1.UserRepository,
        jwt_1.JwtService,
        database_foundation_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map