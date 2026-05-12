import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRM_CHANNELS } from '@/modules/prm/constants/channels';
import { PRM_TEMPLATE_CATEGORIES } from '@/modules/prm/constants/template-categories';
import type { CreateTemplateInput, TemplateChannel, TemplateApprovalStatus } from '../types/template';

const templateSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  channel: z.enum(['sms', 'whatsapp', 'email', 'in_app', 'push']),
  language: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().min(1, 'Body is required'),
  variables_schema: z.string().min(2, 'Variables schema JSON is required'),
  approval_status: z.enum(['draft', 'pending', 'approved', 'rejected']).optional(),
  version: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(1).optional()
  ),
  is_active: z.enum(['true', 'false']).optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const normalizeOptional = (value?: string) => (value?.trim() ? value.trim() : undefined);

const toTextareaJson = (value?: unknown) => {
  if (!value) return '{\n  \n}';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{\n  \n}';
  }
};

interface TemplateFormProps {
  initialValues?: Partial<CreateTemplateInput>;
  submitLabel?: string;
  onSubmit: (payload: CreateTemplateInput) => Promise<void> | void;
}

export function TemplateForm({ initialValues, submitLabel = 'Save template', onSubmit }: TemplateFormProps) {
  const defaultValues = useMemo<TemplateFormValues>(
    () => ({
      code: initialValues?.code ?? '',
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      category: initialValues?.category ?? '',
      channel: (initialValues?.channel ?? 'sms') as TemplateChannel,
      language: initialValues?.language ?? 'en',
      subject: initialValues?.subject ?? '',
      body: initialValues?.body ?? '',
      variables_schema: toTextareaJson(initialValues?.variables_schema),
      approval_status: (initialValues?.approval_status ?? 'draft') as TemplateApprovalStatus,
      version: initialValues?.version ?? undefined,
      is_active:
        initialValues?.is_active == null
          ? 'true'
          : initialValues.is_active
            ? 'true'
            : 'false',
    }),
    [initialValues]
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues,
  });

  const onSubmitForm = async (values: TemplateFormValues) => {
    let variablesSchema: Record<string, unknown>;
    try {
      variablesSchema = JSON.parse(values.variables_schema);
    } catch {
      setError('variables_schema', { type: 'manual', message: 'Variables schema must be valid JSON' });
      return;
    }

    const payload: CreateTemplateInput = {
      code: values.code.trim(),
      name: values.name.trim(),
      category: values.category.trim(),
      channel: values.channel,
      body: values.body,
      variables_schema: variablesSchema,
      description: normalizeOptional(values.description),
      language: normalizeOptional(values.language),
      subject: normalizeOptional(values.subject),
      approval_status: values.approval_status,
      version: values.version,
      is_active: values.is_active ? values.is_active === 'true' : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Code *</Label>
          <Input id="code" {...register('code')} />
          {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRM_TEMPLATE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Channel *</Label>
          <Controller
            control={control}
            name="channel"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {PRM_CHANNELS.map((channelOption) => (
                    <SelectItem key={channelOption} value={channelOption}>
                      {channelOption.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input id="language" {...register('language')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register('subject')} />
        </div>
        <div className="space-y-2">
          <Label>Approval Status</Label>
          <Controller
            control={control}
            name="approval_status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input id="version" type="number" {...register('version')} />
        </div>
        <div className="space-y-2">
          <Label>Active</Label>
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register('description')} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="body">Body *</Label>
          <Textarea id="body" rows={6} {...register('body')} />
          {errors.body && <p className="text-sm text-destructive">{errors.body.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="variables_schema">Variables Schema (JSON) *</Label>
          <Textarea id="variables_schema" rows={6} {...register('variables_schema')} />
          {errors.variables_schema && (
            <p className="text-sm text-destructive">{errors.variables_schema.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
