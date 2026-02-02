'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TemplateForm } from '@/modules/prm/components/template-form';
import { useDeleteTemplate, useTemplate, useUpdateTemplate } from '@/modules/prm/hooks/use-templates';
import type { CreateTemplateInput } from '@/modules/prm/types/template';

const toFormInitial = (data: any): Partial<CreateTemplateInput> => ({
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
});

export default function TemplateDetailPage({
  params,
}: {
  params: { locale: string; templateId: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useTemplate(params.templateId);
  const updateTemplate = useUpdateTemplate(params.templateId);
  const deleteTemplate = useDeleteTemplate();

  const handleSubmit = async (payload: CreateTemplateInput) => {
    try {
      await updateTemplate.mutateAsync(payload);
      toast({ title: 'Template updated', description: 'Changes saved successfully.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to update template.';
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this template? This action cannot be undone.')) return;
    try {
      await deleteTemplate.mutateAsync(params.templateId);
      toast({ title: 'Template deleted', description: 'The template has been removed.', variant: 'success' });
      router.push(`/${params.locale}/prm/templates`);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to delete template.';
      toast({ title: 'Delete failed', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading template...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${params.locale}/pe-setup`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Template Details</CardTitle>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </CardHeader>
        <CardContent>
          <TemplateForm initialValues={toFormInitial(data)} submitLabel="Update Template" onSubmit={handleSubmit} />
        </CardContent>
      </Card>
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-md bg-muted/40 p-4 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
