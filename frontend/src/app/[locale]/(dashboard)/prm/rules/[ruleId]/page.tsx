'use client';

import { useParams, useRouter } from 'next/navigation';
import { Braces, ClipboardList, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/forms/form-layout';
import { useToast } from '@/components/ui/use-toast';
import { RuleForm } from '@/modules/prm/components/rule-form';
import { useDeleteRule, useRule, useUpdateRule } from '@/modules/prm/hooks/use-rules';
import type { CreateRuleInput, Rule } from '@/modules/prm/types/rule';
import { getApiErrorMessage } from '@/lib/api/errors';

const toFormInitial = (raw?: Rule): Partial<CreateRuleInput> => {
  const data = raw as Partial<CreateRuleInput> | undefined;
  return {
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
  };
};

export default function RuleDetailPage() {
  const params = useParams() as { locale: string; ruleId: string };
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useRule(params.ruleId);
  const updateRule = useUpdateRule(params.ruleId);
  const deleteRule = useDeleteRule();

  const handleSubmit = async (payload: CreateRuleInput) => {
    try {
      await updateRule.mutateAsync(payload);
      toast({
        title: 'Rule updated',
        description: 'Changes saved successfully.',
        variant: 'success',
      });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update rule.');
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this rule? This action cannot be undone.')) return;
    try {
      await deleteRule.mutateAsync(params.ruleId);
      toast({
        title: 'Rule deleted',
        description: 'The rule has been removed.',
        variant: 'success',
      });
      router.push(`/${params.locale}/prm/rules`);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to delete rule.');
      toast({ title: 'Delete failed', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading rule...</p>;
  }

  const initialValues = toFormInitial(data);

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title={initialValues.name || 'Rule Details'}
        subtitle={initialValues.code ? `Code ${initialValues.code}` : undefined}
        icon={ClipboardList}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${params.locale}/pe-setup`, label: 'PE Setup' },
              { href: `/${params.locale}/prm/rules`, label: 'Rules' },
              { label: initialValues.name || 'Rule' },
            ]}
          />
        }
        actions={
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        }
      />

      <RuleForm
        initialValues={initialValues}
        submitLabel="Update Rule"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${params.locale}/pe-setup`)}
      />

      {data && (
        <FormSection
          icon={Braces}
          title="Raw Payload"
          description="The rule as stored by the server"
        >
          <pre className="max-h-96 overflow-auto rounded-md bg-muted/40 p-4 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </FormSection>
      )}
    </div>
  );
}
