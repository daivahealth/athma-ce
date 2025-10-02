import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserSearchDto, ChangePasswordDto, UserStatsDto } from './dto/user.dto';
import { ApiResponse as ApiResponseType, PaginationParams } from '@zeal/contracts';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'User with this email already exists in tenant' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseType<User>> {
    const user = await this.userService.createUser(createUserDto);
    return { 
      data: user, 
      message: 'User created successfully' 
    };
  }

  @Get('tenant/:tenantId')
  @ApiOperation({ summary: 'Get all users for a tenant with pagination and search' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(
    @Param('tenantId') tenantId: string,
    @Query() searchDto: UserSearchDto,
    @Query() pagination: PaginationParams,
  ): Promise<ApiResponseType<User[]>> {
    const { users, total } = await this.userService.searchUsers(tenantId, searchDto, pagination);
    return {
      data: users,
      pagination: {
        total,
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        totalPages: Math.ceil(total / (pagination.limit || 20)),
      },
    };
  }

  @Get('tenant/:tenantId/role/:role')
  @ApiOperation({ summary: 'Get users by role for a tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiParam({ name: 'role', description: 'User role' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getUsersByRole(
    @Param('tenantId') tenantId: string,
    @Param('role') role: string
  ): Promise<ApiResponseType<User[]>> {
    const users = await this.userService.getUsersByRole(tenantId, role);
    return { 
      data: users, 
      message: 'Users retrieved successfully' 
    };
  }

  @Get('tenant/:tenantId/stats')
  @ApiOperation({ summary: 'Get user statistics for a tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getUserStats(@Param('tenantId') tenantId: string): Promise<ApiResponseType<UserStatsDto>> {
    const stats = await this.userService.getUserStats(tenantId);
    return { 
      data: stats, 
      message: 'User statistics retrieved successfully' 
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseType<User>> {
    const user = await this.userService.getUserById(id);
    return { 
      data: user, 
      message: 'User retrieved successfully' 
    };
  }

  @Get('email/:tenantId/:email')
  @ApiOperation({ summary: 'Get user by email and tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(
    @Param('tenantId') tenantId: string,
    @Param('email') email: string
  ): Promise<ApiResponseType<User>> {
    const user = await this.userService.getUserByEmail(tenantId, email);
    return { 
      data: user, 
      message: 'User retrieved successfully' 
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ApiResponseType<User>> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return { 
      data: user, 
      message: 'User updated successfully' 
    };
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<ApiResponseType<void>> {
    await this.userService.changePassword(id, changePasswordDto);
    return { 
      data: undefined, 
      message: 'Password changed successfully' 
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }

  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if user exists' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User existence checked' })
  async checkExists(@Param('id') id: string): Promise<ApiResponseType<{ exists: boolean }>> {
    const exists = await this.userService.userExists(id);
    return { 
      data: { exists }, 
      message: 'User existence checked' 
    };
  }

  @Get('email/:tenantId/:email/exists')
  @ApiOperation({ summary: 'Check if email exists in tenant' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({ status: 200, description: 'Email existence checked' })
  async checkEmailExists(
    @Param('tenantId') tenantId: string,
    @Param('email') email: string
  ): Promise<ApiResponseType<{ exists: boolean }>> {
    const exists = await this.userService.emailExistsInTenant(tenantId, email);
    return { 
      data: { exists }, 
      message: 'Email existence checked' 
    };
  }
}
