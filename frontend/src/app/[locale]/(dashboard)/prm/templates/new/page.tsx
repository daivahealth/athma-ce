'use client';

import { useParams, useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { TemplateForm } from '@/modules/prm/components/template-form';
import { useCreateTemplate } from '@/modules/prm/hooks/use-templates';
import type { CreateTemplateInput } from '@/modules/prm/types/template';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function NewTemplatePage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const { toast } = useToast();
  const createTemplate = useCreateTemplate();

  const handleSubmit = async (payload: CreateTemplateInput) => {
    try {
      await createTemplate.mutateAsync(payload);
      toast({
        title: 'Template created',
        description: 'Template is ready to use.',
        variant: 'success',
      });
      router.push(`/${params.locale}/prm/templates`);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create template.');
      toast({ title: 'Creation failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Create Template"
        subtitle="A reusable message for SMS, WhatsApp, email, in-app or push"
        icon={FileText}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${params.locale}/pe-setup`, label: 'PE Setup' },
              { href: `/${params.locale}/prm/templates`, label: 'Templates' },
              { label: 'New' },
            ]}
          />
        }
      />

      <TemplateForm
        submitLabel="Create Template"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${params.locale}/prm/templates`)}
      />
    </div>
  );
}
