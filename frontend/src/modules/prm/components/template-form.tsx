import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheck, FileText, MessageSquareText } from 'lucide-react';
import { FormActions, FormField, FormSection, invalidProps } from '@/components/forms/form-layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRM_CHANNELS } from '@/modules/prm/constants/channels';
import { PRM_TEMPLATE_CATEGORIES } from '@/modules/prm/constants/template-categories';
import type {
  CreateTemplateInput,
  TemplateChannel,
  TemplateApprovalStatus,
} from '../types/template';

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
    z.number().int().min(1).optional(),
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
  onCancel?: () => void;
}

export function TemplateForm({
  initialValues,
  submitLabel = 'Save template',
  onSubmit,
  onCancel,
}: TemplateFormProps) {
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
        initialValues?.is_active == null ? 'true' : initialValues.is_active ? 'true' : 'false',
    }),
    [initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof templateSchema>, unknown, TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues,
  });

  const onSubmitForm = async (values: TemplateFormValues) => {
    let variablesSchema: Record<string, unknown>;
    try {
      variablesSchema = JSON.parse(values.variables_schema);
    } catch {
      setError('variables_schema', {
        type: 'manual',
        message: 'Variables schema must be valid JSON',
      });
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
      <FormSection
        icon={FileText}
        title="Template"
        description="How the template is identified and where it is sent"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField id="code" label="Code" required error={errors.code?.message}>
            <Input
              id="code"
              {...register('code')}
              {...invalidProps('code', errors.code?.message)}
            />
          </FormField>
          <FormField id="name" label="Name" required error={errors.name?.message}>
            <Input
              id="name"
              {...register('name')}
              {...invalidProps('name', errors.name?.message)}
            />
          </FormField>
          <FormField id="category" label="Category" required error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="category"
                    {...invalidProps('category', errors.category?.message)}
                  >
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
          </FormField>
          <FormField id="channel" label="Channel" required>
            <Controller
              control={control}
              name="channel"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRM_CHANNELS.map((channelOption) => (
                      <SelectItem key={channelOption} value={channelOption}>
                        {channelOption
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField id="language" label="Language">
            <Input id="language" {...register('language')} />
          </FormField>
        </div>
        <FormField id="description" label="Description">
          <Textarea id="description" rows={3} {...register('description')} />
        </FormField>
      </FormSection>

      <FormSection
        icon={MessageSquareText}
        title="Message content"
        description="Subject, body and the variables the body can use"
      >
        <FormField id="subject" label="Subject">
          <Input id="subject" {...register('subject')} />
        </FormField>
        <FormField id="body" label="Body" required error={errors.body?.message}>
          <Textarea
            id="body"
            rows={6}
            {...register('body')}
            {...invalidProps('body', errors.body?.message)}
          />
        </FormField>
        <FormField
          id="variables_schema"
          label="Variables Schema (JSON)"
          required
          error={errors.variables_schema?.message}
        >
          <Textarea
            id="variables_schema"
            rows={6}
            {...register('variables_schema')}
            {...invalidProps('variables_schema', errors.variables_schema?.message)}
          />
        </FormField>
      </FormSection>

      <FormSection
        icon={BadgeCheck}
        title="Publishing"
        description="Approval state, version and availability"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <FormField id="approval_status" label="Approval Status">
            <Controller
              control={control}
              name="approval_status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="approval_status">
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
          </FormField>
          <FormField id="version" label="Version">
            <Input id="version" type="number" {...register('version')} />
          </FormField>
          <FormField id="is_active" label="Active">
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="is_active">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
      </FormSection>

      <FormActions submitLabel={submitLabel} busy={isSubmitting} onCancel={onCancel} />
    </form>
  );
}
