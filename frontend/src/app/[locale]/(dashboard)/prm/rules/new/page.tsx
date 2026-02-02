'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${params.locale}/prm/rules`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleForm submitLabel="Create Rule" onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
