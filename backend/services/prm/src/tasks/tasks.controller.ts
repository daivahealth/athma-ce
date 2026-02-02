/**
 * Tasks Controller
 * CRUD endpoints for patient tasks
 */

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';

@ApiTags('Tasks')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(tenantId, userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patient tasks' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'assignedToUserId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('assignedToUserId') assignedToUserId?: string,
    @Query('status') status?: string,
  ) {
    const filters: any = {};
    if (patientId) filters.patientId = patientId;
    if (assignedToUserId) filters.assignedToUserId = assignedToUserId;
    if (status) filters.status = status;

    return this.tasksService.findAll(tenantId, filters);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@TenantId() tenantId: string, @Param('taskId') taskId: string) {
    return this.tasksService.findOne(tenantId, taskId);
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Update patient task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(tenantId, userId, taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete patient task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@TenantId() tenantId: string, @Param('taskId') taskId: string) {
    return this.tasksService.remove(tenantId, taskId);
  }
}
