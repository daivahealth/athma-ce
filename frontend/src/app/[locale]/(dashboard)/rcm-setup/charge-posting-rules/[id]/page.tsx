'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChargePostingRuleForm } from '@/modules/rcm/components/charge-posting-rule-form';
import {
  useChargePostingRule,
  useUpdateChargePostingRule,
  useActivateChargePostingRule,
  useDeactivateChargePostingRule,
  useDeleteChargePostingRule,
} from '@/modules/rcm/hooks/use-charge-posting-rules';
import type { CreateChargePostingRuleInput } from '@/modules/rcm/types/charge-posting-rule';

const startCase = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function ChargePostingRuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const ruleId = params.id as string;
  const toast = useToast();

  const { data: rule, isLoading, error } = useChargePostingRule(ruleId);
  const updateRule = useUpdateChargePostingRule();
  const activateRule = useActivateChargePostingRule();
  const deactivateRule = useDeactivateChargePostingRule();
  const deleteRule = useDeleteChargePostingRule();

  const handleUpdate = async (payload: CreateChargePostingRuleInput) => {
    await updateRule.mutateAsync({ id: ruleId, payload });
    toast({ title: 'Rule updated' });
  };

  const handleActivateToggle = async () => {
    if (!rule) return;
    if (rule.isActive) {
      await deactivateRule.mutateAsync(rule.id);
      toast({ title: 'Rule deactivated' });
    } else {
      await activateRule.mutateAsync(rule.id);
      toast({ title: 'Rule activated' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this rule? This action cannot be undone.')) return;
    await deleteRule.mutateAsync(ruleId);
    toast({ title: 'Rule deleted' });
    router.push(`/${locale}/rcm-setup/charge-posting-rules`);
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !rule) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load rule: ${(error as Error).message}` : 'Rule not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/rcm-setup/charge-posting-rules`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to rules
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{rule.ruleName}</h1>
        <Badge variant={rule.isActive ? 'default' : 'secondary'} className="ml-auto">
          {rule.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rule summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Event type</p>
            <p className="font-medium">{startCase(rule.eventType)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Event source</p>
            <p className="font-medium">{startCase(rule.eventSource)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Billing item type</p>
            <p className="font-medium">{startCase(rule.billingItemType)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Priority</p>
            <p className="font-medium">{rule.priority}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{new Date(rule.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p>{new Date(rule.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit rule</CardTitle>
        </CardHeader>
        <CardContent>
          <ChargePostingRuleForm
            initialValues={rule}
            submitLabel="Update rule"
            isSubmitting={updateRule.isPending}
            onSubmit={handleUpdate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Conditions</p>
            <pre className="mt-2 rounded bg-muted/40 p-3 text-xs font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(rule.conditions ?? {}, null, 2)}
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium">Configuration</p>
            <pre className="mt-2 rounded bg-muted/40 p-3 text-xs font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(rule.configuration ?? {}, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">{rule.isActive ? 'Deactivate rule' : 'Activate rule'}</p>
            <p className="text-sm text-muted-foreground">Toggle rule availability for new events.</p>
          </div>
          <Button
            variant="outline"
            onClick={handleActivateToggle}
            disabled={activateRule.isPending || deactivateRule.isPending}
          >
            {rule.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </CardContent>
        <CardContent className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-destructive">Delete rule</p>
            <p className="text-sm text-muted-foreground">Remove this rule permanently.</p>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteRule.isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteRule.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
