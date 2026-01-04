export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'skipped';

export interface CreateTaskInput {
  patient_id: string;
  task_type: string;
  title: string;
  description?: string;
  priority?: number;
  assigned_to_user_id?: string;
  assigned_to_role?: string;
  due_at?: string;
  related_entity_type?: string;
  related_entity_id?: string;
}

export interface UpdateTaskInput {
  status?: TaskStatus;
  assigned_to_user_id?: string;
  outcome?: string;
  completed_at?: string;
}

export type Task = Record<string, unknown>;
