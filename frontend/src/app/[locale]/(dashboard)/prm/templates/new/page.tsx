'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TemplateForm } from '@/modules/prm/components/template-form';
import { useCreateTemplate } from '@/modules/prm/hooks/use-templates';
import type { CreateTemplateInput } from '@/modules/prm/types/template';

export default function NewTemplatePage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const createTemplate = useCreateTemplate();

  const handleSubmit = async (payload: CreateTemplateInput) => {
    try {
      await createTemplate.mutateAsync(payload);
      toast({ title: 'Template created', description: 'Template is ready to use.', variant: 'success' });
      router.push(`/${params.locale}/prm/templates`);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to create template.';
      toast({ title: 'Creation failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${params.locale}/prm/templates`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Template</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm submitLabel="Create Template" onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
