'use client';

import { useParams, useRouter } from 'next/navigation';
import { Puzzle } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { ChargePostingRuleForm } from '@/modules/rcm/components/charge-posting-rule-form';
import { useCreateChargePostingRule } from '@/modules/rcm/hooks/use-charge-posting-rules';
import type { CreateChargePostingRuleInput } from '@/modules/rcm/types/charge-posting-rule';

export default function NewChargePostingRulePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createRule = useCreateChargePostingRule();

  const handleSubmit = async (payload: CreateChargePostingRuleInput) => {
    await createRule.mutateAsync(payload);
    toast({ title: 'Rule created' });
    router.push(`/${locale}/rcm-setup/charge-posting-rules`);
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="New charge posting rule"
        subtitle="Turn a clinical event into a charge automatically"
        icon={Puzzle}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${locale}/rcm-setup`, label: 'RCM Setup' },
              { href: `/${locale}/rcm-setup/charge-posting-rules`, label: 'Charge posting rules' },
              { label: 'New' },
            ]}
          />
        }
      />

      <ChargePostingRuleForm
        onSubmit={handleSubmit}
        isSubmitting={createRule.isPending}
        onCancel={() => router.push(`/${locale}/rcm-setup/charge-posting-rules`)}
      />
    </div>
  );
}
