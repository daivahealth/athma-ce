'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteTask, useTask, useUpdateTask } from '@/modules/prm/hooks/use-tasks';
import type { UpdateTaskInput } from '@/modules/prm/types/task';

type UpdateFormValues = {
  status?: string;
  assigned_to_user_id?: string;
  outcome?: string;
  completed_at?: string;
};

const normalizeOptional = (value?: string) => (value?.trim() ? value.trim() : undefined);

export default function TaskDetailPage({ params }: { params: { locale: string; taskId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useTask(params.taskId);
  const updateTask = useUpdateTask(params.taskId);
  const deleteTask = useDeleteTask();

  const { register, handleSubmit, control, reset } = useForm<UpdateFormValues>({
    defaultValues: {
      status: (data as any)?.status ?? '',
      assigned_to_user_id: (data as any)?.assigned_to_user_id ?? '',
      outcome: (data as any)?.outcome ?? '',
      completed_at: (data as any)?.completed_at ?? '',
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      status: (data as any)?.status ?? '',
      assigned_to_user_id: (data as any)?.assigned_to_user_id ?? '',
      outcome: (data as any)?.outcome ?? '',
      completed_at: (data as any)?.completed_at ?? '',
    });
  }, [data, reset]);

  const onSubmit = async (values: UpdateFormValues) => {
    const payload: UpdateTaskInput = {
      status: values.status as UpdateTaskInput['status'],
      assigned_to_user_id: normalizeOptional(values.assigned_to_user_id),
      outcome: normalizeOptional(values.outcome),
      completed_at: normalizeOptional(values.completed_at),
    };

    try {
      await updateTask.mutateAsync(payload);
      toast({ title: 'Task updated', description: 'Changes saved successfully.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to update task.';
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return;
    try {
      await deleteTask.mutateAsync(params.taskId);
      toast({ title: 'Task deleted', description: 'The task has been removed.', variant: 'success' });
      router.push(`/${params.locale}/prm/tasks`);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to delete task.';
      toast({ title: 'Delete failed', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading task...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Details</CardTitle>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned_to_user_id">Assigned User ID</Label>
                <Input id="assigned_to_user_id" {...register('assigned_to_user_id')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea id="outcome" rows={3} {...register('outcome')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="completed_at">Completed At</Label>
                <Input id="completed_at" type="datetime-local" {...register('completed_at')} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Update Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-md bg-muted/40 p-4 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
