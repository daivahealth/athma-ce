import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Link2, UserCog } from 'lucide-react';
import {
  FIELD_CONTROL,
  FormActions,
  FormField,
  FormSection,
  invalidProps,
} from '@/components/forms/form-layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PatientSearchSelect } from '@/components/patient-search-select';
import type { Patient } from '@/modules/clinical/types/patient';
import { PRM_TASK_TYPES } from '@/modules/prm/constants/task-types';
import type { CreateTaskInput } from '../types/task';

const taskSchema = z.object({
  patient_id: z.guid('Patient ID must be a UUID'),
  task_type: z.string().min(1, 'Task type is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(1).max(4).optional(),
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
  onCancel?: () => void;
}

export function TaskForm({
  initialValues,
  submitLabel = 'Save task',
  onSubmit,
  onCancel,
}: TaskFormProps) {
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
    [initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof taskSchema>, unknown, TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
      <FormSection
        icon={ClipboardList}
        title="Task"
        description="The patient and what needs to be done"
      >
        <div>
          <PatientSearchSelect
            required
            selectedPatient={selectedPatient}
            onSelect={(patient) => {
              setSelectedPatient(patient);
              setValue('patient_id', patient.id, { shouldValidate: true });
            }}
            onClear={() => {
              setSelectedPatient(null);
              setValue('patient_id', '');
            }}
            error={errors.patient_id?.message}
          />
          <input type="hidden" {...register('patient_id')} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="task_type" label="Task Type" required error={errors.task_type?.message}>
            <Controller
              control={control}
              name="task_type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="task_type"
                    {...invalidProps('task_type', errors.task_type?.message)}
                  >
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRM_TASK_TYPES.map((taskType) => (
                      <SelectItem key={taskType} value={taskType}>
                        {taskType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField id="title" label="Title" required error={errors.title?.message}>
            <Input
              id="title"
              {...register('title')}
              {...invalidProps('title', errors.title?.message)}
            />
          </FormField>
        </div>
        <FormField id="description" label="Description">
          <Textarea id="description" rows={3} {...register('description')} />
        </FormField>
      </FormSection>

      <FormSection
        icon={UserCog}
        title="Assignment & schedule"
        description="Who owns the task, how urgent it is and when it is due"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField id="priority" label="Priority">
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <SelectTrigger id="priority">
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
          </FormField>
          <FormField id="assigned_to_user_id" label="Assigned User ID">
            <Input id="assigned_to_user_id" {...register('assigned_to_user_id')} />
          </FormField>
          <FormField id="assigned_to_role" label="Assigned Role">
            <Input id="assigned_to_role" {...register('assigned_to_role')} />
          </FormField>
          <FormField id="due_at" label="Due At">
            <Input
              id="due_at"
              type="datetime-local"
              className={FIELD_CONTROL}
              {...register('due_at')}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        icon={Link2}
        title="Related record"
        description="Optional: the record this task follows up on"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="related_entity_type" label="Related Entity Type">
            <Input id="related_entity_type" {...register('related_entity_type')} />
          </FormField>
          <FormField id="related_entity_id" label="Related Entity ID">
            <Input id="related_entity_id" {...register('related_entity_id')} />
          </FormField>
        </div>
      </FormSection>

      <FormActions submitLabel={submitLabel} busy={isSubmitting} onCancel={onCancel} />
    </form>
  );
}
