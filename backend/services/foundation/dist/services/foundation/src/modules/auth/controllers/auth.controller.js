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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../services/auth.service");
const mfa_service_1 = require("../services/mfa.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const auth_dto_1 = require("../dto/auth.dto");
let AuthController = class AuthController {
    authService;
    mfaService;
    constructor(authService, mfaService) {
        this.authService = authService;
        this.mfaService = mfaService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async refresh(refreshTokenDto) {
        return this.authService.refresh(refreshTokenDto);
    }
    async logout(req, logoutDto) {
        if (!req.user) {
            throw new Error('Missing authenticated user context');
        }
        await this.authService.logout(req.user.userId, logoutDto);
    }
    async changePassword(req, changePasswordDto) {
        if (!req.user) {
            throw new Error('Missing authenticated user context');
        }
        await this.authService.changePassword(req.user.userId, changePasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        await this.authService.requestPasswordReset(resetPasswordDto);
    }
    async confirmResetPassword(confirmResetPasswordDto) {
        await this.authService.confirmPasswordReset(confirmResetPasswordDto);
    }
    async verifyMfa(mfaVerifyDto) {
        return this.mfaService.verifyMfa(mfaVerifyDto);
    }
    async getMfaStatus(req) {
        if (!req.user) {
            throw new Error('Missing authenticated user context');
        }
        return this.mfaService.getMfaStatus(req.user.userId);
    }
    async switchFacility(req, switchFacilityDto) {
        if (!req.user) {
            throw new Error('Missing authenticated user context');
        }
        return this.authService.switchFacility(req.user.userId, switchFacilityDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticates a user with email and password. Returns JWT tokens and user profile.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'user@hospital.ae',
                    tenantId: '223e4567-e89b-12d3-a456-426614174000',
                    firstName: 'Ahmed',
                    lastName: 'Hassan'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Generates a new access token using a valid refresh token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'User logout',
        description: 'Invalidates the current session and optionally all user sessions'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Change password',
        description: 'Changes the password for the authenticated user. Requires current password.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid current password' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset',
        description: 'Sends a password reset link to the user\'s email'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset email sent (if email exists)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('confirm-reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm password reset',
        description: 'Sets a new password using a valid reset token from email'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired reset token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ConfirmResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmResetPassword", null);
__decorate([
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify MFA code',
        description: 'Verifies a multi-factor authentication code (TOTP, SMS, or email)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA verification successful',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid MFA code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.MfaVerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfa", null);
__decorate([
    (0, common_1.Get)('mfa/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get MFA status',
        description: 'Retrieves the current MFA configuration for the authenticated user'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'MFA status retrieved',
        schema: {
            example: {
                enabled: true,
                methods: ['totp', 'sms']
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMfaStatus", null);
__decorate([
    (0, common_1.Post)('switch-facility'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Switch facility',
        description: 'Changes the current facility context for the user session. Returns new tokens with updated facility context.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Facility switched successfully',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User does not have access to the specified facility' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.SwitchFacilityDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchFacility", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mfa_service_1.MfaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map