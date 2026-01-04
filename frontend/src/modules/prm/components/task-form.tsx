import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CreateTaskInput } from '../types/task';

const taskSchema = z.object({
  patient_id: z.string().uuid('Patient ID must be a UUID'),
  task_type: z.string().min(1, 'Task type is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(1).max(4).optional()
  ),
  assigned_to_user_id: z.string().optional(),
  assigned_to_role: z.string().optional(),
  due_at: z.string().optional(),
  related_entity_type: z.string().optional(),
  related_entity_id: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const normalizeOptional = (value?: string) => (value?.trim() ? value.trim() : undefined);

interface TaskFormProps {
  initialValues?: Partial<CreateTaskInput>;
  submitLabel?: string;
  onSubmit: (payload: CreateTaskInput) => Promise<void> | void;
}

export function TaskForm({ initialValues, submitLabel = 'Save task', onSubmit }: TaskFormProps) {
  const defaultValues = useMemo<TaskFormValues>(
    () => ({
      patient_id: initialValues?.patient_id ?? '',
      task_type: initialValues?.task_type ?? '',
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      priority: initialValues?.priority ?? undefined,
      assigned_to_user_id: initialValues?.assigned_to_user_id ?? '',
      assigned_to_role: initialValues?.assigned_to_role ?? '',
      due_at: initialValues?.due_at ?? '',
      related_entity_type: initialValues?.related_entity_type ?? '',
      related_entity_id: initialValues?.related_entity_id ?? '',
    }),
    [initialValues]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const onSubmitForm = async (values: TaskFormValues) => {
    const payload: CreateTaskInput = {
      patient_id: values.patient_id.trim(),
      task_type: values.task_type.trim(),
      title: values.title.trim(),
      description: normalizeOptional(values.description),
      priority: values.priority,
      assigned_to_user_id: normalizeOptional(values.assigned_to_user_id),
      assigned_to_role: normalizeOptional(values.assigned_to_role),
      due_at: normalizeOptional(values.due_at),
      related_entity_type: normalizeOptional(values.related_entity_type),
      related_entity_id: normalizeOptional(values.related_entity_id),
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patient_id">Patient ID *</Label>
          <Input id="patient_id" {...register('patient_id')} />
          {errors.patient_id && <p className="text-sm text-destructive">{errors.patient_id.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="task_type">Task Type *</Label>
          <Input id="task_type" {...register('task_type')} />
          {errors.task_type && <p className="text-sm text-destructive">{errors.task_type.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register('description')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">High</SelectItem>
                  <SelectItem value="4">Urgent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assigned_to_user_id">Assigned User ID</Label>
          <Input id="assigned_to_user_id" {...register('assigned_to_user_id')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assigned_to_role">Assigned Role</Label>
          <Input id="assigned_to_role" {...register('assigned_to_role')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_at">Due At</Label>
          <Input id="due_at" type="datetime-local" {...register('due_at')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="related_entity_type">Related Entity Type</Label>
          <Input id="related_entity_type" {...register('related_entity_type')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="related_entity_id">Related Entity ID</Label>
          <Input id="related_entity_id" {...register('related_entity_id')} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
