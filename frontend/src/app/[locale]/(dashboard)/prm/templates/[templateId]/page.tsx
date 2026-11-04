'use client';

import { useParams, useRouter } from 'next/navigation';
import { Braces, FileText, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/forms/form-layout';
import { useToast } from '@/components/ui/use-toast';
import { TemplateForm } from '@/modules/prm/components/template-form';
import {
  useDeleteTemplate,
  useTemplate,
  useUpdateTemplate,
} from '@/modules/prm/hooks/use-templates';
import type { CreateTemplateInput, Template } from '@/modules/prm/types/template';
import { getApiErrorMessage } from '@/lib/api/errors';

const toFormInitial = (raw?: Template): Partial<CreateTemplateInput> => {
  const data = raw as Partial<CreateTemplateInput> | undefined;
  return {
    code: data?.code,
    name: data?.name,
    description: data?.description,
    category: data?.category,
    channel: data?.channel,
    language: data?.language,
    subject: data?.subject,
    body: data?.body,
    variables_schema: data?.variables_schema,
    approval_status: data?.approval_status,
    version: data?.version,
    is_active: data?.is_active,
  };
};

export default function TemplateDetailPage() {
  const params = useParams() as { locale: string; templateId: string };
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useTemplate(params.templateId);
  const updateTemplate = useUpdateTemplate(params.templateId);
  const deleteTemplate = useDeleteTemplate();

  const handleSubmit = async (payload: CreateTemplateInput) => {
    try {
      await updateTemplate.mutateAsync(payload);
      toast({
        title: 'Template updated',
        description: 'Changes saved successfully.',
        variant: 'success',
      });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update template.');
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this template? This action cannot be undone.')) return;
    try {
      await deleteTemplate.mutateAsync(params.templateId);
      toast({
        title: 'Template deleted',
        description: 'The template has been removed.',
        variant: 'success',
      });
      router.push(`/${params.locale}/prm/templates`);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to delete template.');
      toast({ title: 'Delete failed', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading template...</p>;
  }

  const initialValues = toFormInitial(data);

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title={initialValues.name || 'Template Details'}
        subtitle={initialValues.code ? `Code ${initialValues.code}` : undefined}
        icon={FileText}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${params.locale}/pe-setup`, label: 'PE Setup' },
              { href: `/${params.locale}/prm/templates`, label: 'Templates' },
              { label: initialValues.name || 'Template' },
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

      <TemplateForm
        initialValues={initialValues}
        submitLabel="Update Template"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${params.locale}/pe-setup`)}
      />

      {data && (
        <FormSection
          icon={Braces}
          title="Raw Payload"
          description="The template as stored by the server"
        >
          <pre className="max-h-96 overflow-auto rounded-md bg-muted/40 p-4 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </FormSection>
      )}
    </div>
  );
}
