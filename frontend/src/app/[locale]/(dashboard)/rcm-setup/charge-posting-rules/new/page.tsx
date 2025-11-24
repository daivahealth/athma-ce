'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/rcm-setup/charge-posting-rules`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to rules
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New charge posting rule</CardTitle>
        </CardHeader>
        <CardContent>
          <ChargePostingRuleForm onSubmit={handleSubmit} isSubmitting={createRule.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
