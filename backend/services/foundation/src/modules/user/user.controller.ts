import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiSecurity('x-tenant-id')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Creates a new user account in the system'
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        email: 'user@hospital.ae',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        status: 'active'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or email already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Retrieves all users for a tenant'
  })
  @ApiQuery({
    name: 'tenantId',
    required: true,
    description: 'Tenant UUID',
    example: '223e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@hospital.ae',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          status: 'active'
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: 'tenantId query parameter is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  listUsers(@Query('tenantId') tenantId?: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId query parameter is required');
    }
    return this.userService.listUsers(tenantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a single user by their UUID'
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        email: 'user@hospital.ae',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        status: 'active',
        facilities: []
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates an existing user\'s information'
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Soft deletes a user account. The user will be deactivated but data is retained.'
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
