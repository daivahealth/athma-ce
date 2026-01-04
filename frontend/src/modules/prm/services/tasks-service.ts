import { prmClient } from '@/lib/api/client';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

export interface TaskFilters {
  patientId?: string;
  assignedToUserId?: string;
  status?: string;
}

class TasksService {
  async list(filters?: TaskFilters): Promise<Task[]> {
    const response = await prmClient.get('/v1/tasks', { params: filters });
    return response.data;
  }

  async get(taskId: string): Promise<Task> {
    const response = await prmClient.get(`/v1/tasks/${taskId}`);
    return response.data;
  }

  async create(payload: CreateTaskInput): Promise<Task> {
    const response = await prmClient.post('/v1/tasks', payload);
    return response.data;
  }

  async update(taskId: string, payload: UpdateTaskInput): Promise<Task> {
    const response = await prmClient.patch(`/v1/tasks/${taskId}`, payload);
    return response.data;
  }

  async remove(taskId: string): Promise<void> {
    await prmClient.delete(`/v1/tasks/${taskId}`);
  }
}

export const tasksService = new TasksService();
