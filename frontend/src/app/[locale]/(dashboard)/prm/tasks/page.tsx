'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/modules/prm/hooks/use-tasks';
import { PatientSearchSelect } from '@/components/patient-search-select';

export default function PrmTasksPage({ params }: { params: { locale: string } }) {
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [assignedToUserId, setAssignedToUserId] = useState('');
  const [status, setStatus] = useState('all');

  const filters = useMemo(() => {
    const next: { patientId?: string; assignedToUserId?: string; status?: string } = {};
    if (patientId.trim()) next.patientId = patientId.trim();
    if (assignedToUserId.trim()) next.assignedToUserId = assignedToUserId.trim();
    if (status !== 'all' && status.trim()) next.status = status.trim();
    return next;
  }, [patientId, assignedToUserId, status]);

  const { data, isLoading } = useTasks(filters);
  const tasks = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <Button asChild>
            <Link href={`/${params.locale}/prm/tasks/new`}>Create Task</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <PatientSearchSelect
              selectedPatient={selectedPatient}
              onSelect={(patient) => {
                setSelectedPatient(patient);
                setPatientId(patient.id);
              }}
              onClear={() => {
                setSelectedPatient(null);
                setPatientId('');
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedToUserId">Assigned User ID</Label>
            <Input
              id="assignedToUserId"
              value={assignedToUserId}
              onChange={(event) => setAssignedToUserId(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading tasks...</p>}
          {!isLoading && tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks found.</p>
          )}
          {!isLoading && tasks.length > 0 && (
            <div className="divide-y rounded-md border">
              {tasks.map((task: any, index: number) => {
                const id = task.id || task.task_id || String(index);
                return (
                  <div key={id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{task.task_type ?? 'Task'}</p>
                      <p className="text-base font-semibold">{task.title ?? 'Untitled task'}</p>
                      <p className="text-xs text-muted-foreground">
                        Patient: {task.patient_id ?? 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {task.status ?? 'pending'}
                      </span>
                      {task.id && (
                        <Button variant="outline" asChild>
                          <Link href={`/${params.locale}/prm/tasks/${task.id}`}>View</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
