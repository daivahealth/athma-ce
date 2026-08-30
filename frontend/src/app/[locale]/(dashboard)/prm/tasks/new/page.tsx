'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { TaskForm } from '@/modules/prm/components/task-form';
import { useCreateTask } from '@/modules/prm/hooks/use-tasks';
import type { CreateTaskInput } from '@/modules/prm/types/task';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function NewTaskPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const { toast } = useToast();
  const createTask = useCreateTask();

  const handleSubmit = async (payload: CreateTaskInput) => {
    try {
      await createTask.mutateAsync(payload);
      toast({ title: 'Task created', description: 'Task is ready in PRM.', variant: 'success' });
      router.push(`/${params.locale}/prm/tasks`);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create task.');
      toast({ title: 'Creation failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskForm submitLabel="Create Task" onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
