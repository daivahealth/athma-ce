'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RuleForm } from '@/modules/prm/components/rule-form';
import { useDeleteRule, useRule, useUpdateRule } from '@/modules/prm/hooks/use-rules';
import type { CreateRuleInput } from '@/modules/prm/types/rule';

const toFormInitial = (data: any): Partial<CreateRuleInput> => ({
  code: data?.code,
  name: data?.name,
  description: data?.description,
  category: data?.category,
  trigger_event_type: data?.trigger_event_type,
  trigger_event_subtype: data?.trigger_event_subtype,
  condition_expr: data?.condition_expr,
  schedule_mode: data?.schedule_mode,
  delay_seconds: data?.delay_seconds,
  action_type: data?.action_type,
  action_payload: data?.action_payload,
  priority: data?.priority,
  cooldown_seconds: data?.cooldown_seconds,
  idempotency_window: data?.idempotency_window,
  max_executions_per_day: data?.max_executions_per_day,
  effective_from: data?.effective_from,
  effective_to: data?.effective_to,
  is_active: data?.is_active,
});

export default function RuleDetailPage({
  params,
}: {
  params: { locale: string; ruleId: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useRule(params.ruleId);
  const updateRule = useUpdateRule(params.ruleId);
  const deleteRule = useDeleteRule();

  const handleSubmit = async (payload: CreateRuleInput) => {
    try {
      await updateRule.mutateAsync(payload);
      toast({ title: 'Rule updated', description: 'Changes saved successfully.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to update rule.';
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this rule? This action cannot be undone.')) return;
    try {
      await deleteRule.mutateAsync(params.ruleId);
      toast({ title: 'Rule deleted', description: 'The rule has been removed.', variant: 'success' });
      router.push(`/${params.locale}/prm/rules`);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to delete rule.';
      toast({ title: 'Delete failed', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading rule...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${params.locale}/pe-setup`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rule Details</CardTitle>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </CardHeader>
        <CardContent>
          <RuleForm initialValues={toFormInitial(data)} submitLabel="Update Rule" onSubmit={handleSubmit} />
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
