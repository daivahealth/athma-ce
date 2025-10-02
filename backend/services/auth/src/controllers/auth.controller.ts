import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { MfaService } from '../services/mfa.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { MfaGuard } from '../guards/mfa.guard';
import { Roles } from '../decorators/roles.decorator';
import { Permissions } from '../decorators/permissions.decorator';
import { RequireMfa } from '../decorators/require-mfa.decorator';
import {
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
  ChangePasswordDto,
  ResetPasswordDto,
  ConfirmResetPasswordDto,
  MfaSetupDto,
  MfaVerifyDto,
  CreateUserDto,
  UpdateUserDto,
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
  RevokeRoleDto,
} from '../dto/auth.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly mfaService: MfaService,
  ) {}

  // Authentication endpoints
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Body() logoutDto: LogoutDto) {
    return this.authService.logout(req.user, logoutDto);
  }

  // Password management
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.requestPasswordReset(resetPasswordDto);
  }

  @Post('confirm-reset-password')
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() confirmResetPasswordDto: ConfirmResetPasswordDto,
  ) {
    return this.authService.confirmPasswordReset(confirmResetPasswordDto);
  }

  // MFA endpoints
  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setupMfa(@Request() req, @Body() mfaSetupDto: MfaSetupDto) {
    return this.mfaService.setupMfa(req.user.id, mfaSetupDto);
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(@Body() mfaVerifyDto: MfaVerifyDto) {
    return this.mfaService.verifyMfa(mfaVerifyDto);
  }

  @Get('mfa/status')
  @UseGuards(JwtAuthGuard)
  async getMfaStatus(@Request() req) {
    return this.mfaService.getMfaStatus(req.user.id);
  }

  @Delete('mfa/:method')
  @UseGuards(JwtAuthGuard, MfaGuard)
  async disableMfa(@Request() req, @Param('method') method: string) {
    return this.mfaService.disableMfa(req.user.id, method);
  }

  // User management
  @Get('users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.read')
  async getUsers(@Query() query: any) {
    return this.userService.getUsers(query);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.read')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.update')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.delete')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // Role management
  @Get('roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role.read')
  async getRoles(@Query() query: any) {
    return this.roleService.getRoles(query);
  }

  @Get('roles/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role.read')
  async getRole(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @Post('roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role.create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Put('roles/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role.update')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete('roles/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('role.delete')
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  // Role assignments
  @Post('users/:userId/roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.role.assign')
  async assignRole(
    @Param('userId') userId: string,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.userService.assignRole(userId, assignRoleDto);
  }

  @Delete('users/:userId/roles/:roleId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.role.revoke')
  async revokeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.userService.revokeRole(userId, roleId);
  }

  // Permissions
  @Get('permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('permission.read')
  async getPermissions() {
    return this.roleService.getPermissions();
  }

  @Get('users/:id/permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.permission.read')
  async getUserPermissions(@Param('id') id: string) {
    return this.userService.getUserPermissions(id);
  }

  // Sessions
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Request() req) {
    return this.authService.getUserSessions(req.user.id);
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @Request() req,
    @Param('sessionId') sessionId: string,
  ) {
    return this.authService.revokeSession(req.user.id, sessionId);
  }

  // Trusted devices
  @Get('devices')
  @UseGuards(JwtAuthGuard)
  async getTrustedDevices(@Request() req) {
    return this.authService.getTrustedDevices(req.user.id);
  }

  @Delete('devices/:deviceId')
  @UseGuards(JwtAuthGuard)
  async removeTrustedDevice(
    @Request() req,
    @Param('deviceId') deviceId: string,
  ) {
    return this.authService.removeTrustedDevice(req.user.id, deviceId);
  }

  // Profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }
}
