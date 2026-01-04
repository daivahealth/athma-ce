import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksService, type TaskFilters } from '../services/tasks-service';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

const TASK_KEYS = {
  all: ['prm', 'tasks'] as const,
  list: (filters: TaskFilters | undefined) => [...TASK_KEYS.all, 'list', filters] as const,
  detail: (taskId: string) => [...TASK_KEYS.all, 'detail', taskId] as const,
};

export function useTasks(filters?: TaskFilters) {
  return useQuery<Task[]>({
    queryKey: TASK_KEYS.list(filters),
    queryFn: () => tasksService.list(filters),
  });
}

export function useTask(taskId: string) {
  return useQuery<Task>({
    queryKey: TASK_KEYS.detail(taskId),
    queryFn: () => tasksService.get(taskId),
    enabled: !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskInput) => tasksService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTaskInput) => tasksService.update(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => tasksService.remove(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}
