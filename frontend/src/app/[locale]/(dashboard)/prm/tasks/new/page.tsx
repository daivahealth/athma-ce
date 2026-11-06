'use client';

import { useParams, useRouter } from 'next/navigation';
import { ListTodo } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
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
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Create Task"
        subtitle="Assign a follow-up action for a patient"
        icon={ListTodo}
        breadcrumb={
          <Breadcrumb
            items={[{ href: `/${params.locale}/prm/tasks`, label: 'Tasks' }, { label: 'New' }]}
          />
        }
      />

      <TaskForm
        submitLabel="Create Task"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${params.locale}/prm/tasks`)}
      />
    </div>
  );
}
