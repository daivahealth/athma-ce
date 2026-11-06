'use client';

import { useParams, useRouter } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { RuleForm } from '@/modules/prm/components/rule-form';
import { useCreateRule } from '@/modules/prm/hooks/use-rules';
import type { CreateRuleInput } from '@/modules/prm/types/rule';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function NewRulePage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const { toast } = useToast();
  const createRule = useCreateRule();

  const handleSubmit = async (payload: CreateRuleInput) => {
    try {
      await createRule.mutateAsync(payload);
      toast({
        title: 'Rule created',
        description: 'The rule is now active in PRM.',
        variant: 'success',
      });
      router.push(`/${params.locale}/prm/rules`);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create rule.');
      toast({ title: 'Creation failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Create Rule"
        subtitle="Automate a message or task when a patient event happens"
        icon={ClipboardList}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${params.locale}/pe-setup`, label: 'PE Setup' },
              { href: `/${params.locale}/prm/rules`, label: 'Rules' },
              { label: 'New' },
            ]}
          />
        }
      />

      <RuleForm
        submitLabel="Create Rule"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${params.locale}/prm/rules`)}
      />
    </div>
  );
}
