/**
 * Tasks Service
 * CRUD operations for patient tasks
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new patient task
   */
  async create(tenantId: string, userId: string, dto: CreateTaskDto) {
    return this.prisma.patientTask.create({
      data: {
        tenantId,
        patientId: dto.patient_id,
        taskType: dto.task_type,
        title: dto.title,
        description: dto.description,
        priority: dto.priority ?? 2,
        assignedToUserId: dto.assigned_to_user_id,
        assignedToRole: dto.assigned_to_role,
        dueAt: dto.due_at ? new Date(dto.due_at) : undefined,
        relatedEntityType: dto.related_entity_type,
        relatedEntityId: dto.related_entity_id,
        createdBy: userId,
      },
    });
  }

  /**
   * Get all tasks (with optional filters)
   */
  async findAll(
    tenantId: string,
    filters?: {
      patientId?: string;
      assignedToUserId?: string;
      status?: string;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters?.assignedToUserId) {
      where.assignedToUserId = filters.assignedToUserId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.patientTask.findMany({
      where,
      orderBy: [{ dueAt: 'asc' }, { priority: 'desc' }],
    });
  }

  /**
   * Get task by ID
   */
  async findOne(tenantId: string, taskId: string) {
    const task = await this.prisma.patientTask.findFirst({
      where: { id: taskId, tenantId },
    });

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    return task;
  }

  /**
   * Update task
   */
  async update(tenantId: string, userId: string, taskId: string, dto: UpdateTaskDto) {
    // Check task exists
    await this.findOne(tenantId, taskId);

    return this.prisma.patientTask.update({
      where: { id: taskId },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.assigned_to_user_id !== undefined && { assignedToUserId: dto.assigned_to_user_id }),
        ...(dto.outcome !== undefined && { outcome: dto.outcome }),
        ...(dto.completed_at !== undefined && { completedAt: dto.completed_at ? new Date(dto.completed_at) : null }),
        updatedBy: userId,
      },
    });
  }

  /**
   * Delete task
   */
  async remove(tenantId: string, taskId: string) {
    // Check task exists
    await this.findOne(tenantId, taskId);

    await this.prisma.patientTask.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }
}
