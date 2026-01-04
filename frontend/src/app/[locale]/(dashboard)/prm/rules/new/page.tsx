'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { RuleForm } from '@/modules/prm/components/rule-form';
import { useCreateRule } from '@/modules/prm/hooks/use-rules';
import type { CreateRuleInput } from '@/modules/prm/types/rule';

export default function NewRulePage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const createRule = useCreateRule();

  const handleSubmit = async (payload: CreateRuleInput) => {
    try {
      await createRule.mutateAsync(payload);
      toast({ title: 'Rule created', description: 'The rule is now active in PRM.', variant: 'success' });
      router.push(`/${params.locale}/prm/rules`);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to create rule.';
      toast({ title: 'Creation failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Rule</CardTitle>
      </CardHeader>
      <CardContent>
        <RuleForm submitLabel="Create Rule" onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
