import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gauge, Send, Workflow, Zap } from 'lucide-react';
import {
  FIELD_CONTROL,
  FormActions,
  FormField,
  FormSection,
  invalidProps,
} from '@/components/forms/form-layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRM_EVENT_SUBTYPES, PRM_EVENT_TYPES } from '@/modules/prm/constants/event-types';
import { PRM_RULE_CATEGORIES } from '@/modules/prm/constants/rule-categories';
import { useTemplates } from '@/modules/prm/hooks/use-templates';
import type { CreateRuleInput } from '../types/rule';

const ruleSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  trigger_event_type: z.string().min(1, 'Trigger event type is required'),
  trigger_event_subtype: z.string().optional(),
  condition_expr: z.string().min(2, 'Condition JSON is required'),
  schedule_mode: z.enum(['IMMEDIATE', 'DELAYED']),
  delay_seconds: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional(),
  ),
  action_type: z.enum(['SEND_MESSAGE', 'CREATE_TASK']),
  action_payload: z.string().min(2, 'Action payload JSON is required'),
  priority: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional(),
  ),
  cooldown_seconds: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional(),
  ),
  idempotency_window: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional(),
  ),
  max_executions_per_day: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional(),
  ),
  effective_from: z.string().optional(),
  effective_to: z.string().optional(),
  is_active: z.enum(['true', 'false']).optional(),
});

type RuleFormValues = z.infer<typeof ruleSchema>;

const normalizeOptional = (value?: string) => (value?.trim() ? value.trim() : undefined);

const toTextareaJson = (value?: unknown) => {
  if (!value) return '{\n  \n}';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{\n  \n}';
  }
};

interface RuleFormProps {
  initialValues?: Partial<CreateRuleInput>;
  submitLabel?: string;
  onSubmit: (payload: CreateRuleInput) => Promise<void> | void;
  onCancel?: () => void;
}

export function RuleForm({
  initialValues,
  submitLabel = 'Save rule',
  onSubmit,
  onCancel,
}: RuleFormProps) {
  const defaultValues = useMemo<RuleFormValues>(
    () => ({
      code: initialValues?.code ?? '',
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      category: initialValues?.category ?? '',
      trigger_event_type: initialValues?.trigger_event_type ?? '',
      trigger_event_subtype: initialValues?.trigger_event_subtype ?? '',
      condition_expr: toTextareaJson(initialValues?.condition_expr),
      schedule_mode: initialValues?.schedule_mode ?? 'IMMEDIATE',
      delay_seconds: initialValues?.delay_seconds ?? undefined,
      action_type: initialValues?.action_type ?? 'SEND_MESSAGE',
      action_payload: toTextareaJson(initialValues?.action_payload),
      priority: initialValues?.priority ?? undefined,
      cooldown_seconds: initialValues?.cooldown_seconds ?? undefined,
      idempotency_window: initialValues?.idempotency_window ?? undefined,
      max_executions_per_day: initialValues?.max_executions_per_day ?? undefined,
      effective_from: initialValues?.effective_from ?? '',
      effective_to: initialValues?.effective_to ?? '',
      is_active:
        initialValues?.is_active == null ? 'true' : initialValues.is_active ? 'true' : 'false',
    }),
    [initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof ruleSchema>, unknown, RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues,
  });

  const watchedEventType = watch('trigger_event_type');
  const watchedActionType = watch('action_type');
  const { data: templates = [] } = useTemplates({ isActive: true });

  const templateOptions = useMemo(() => {
    return templates
      .map((template) => ({
        code: String(template.code ?? ''),
        name: String(template.name ?? template.code ?? ''),
        channel: String(template.channel ?? ''),
      }))
      .filter((template) => template.code);
  }, [templates]);

  const initialTemplateCode = useMemo(() => {
    const payload = initialValues?.action_payload as { template_code?: string } | undefined;
    return payload?.template_code ?? '';
  }, [initialValues]);

  const [selectedTemplateCode, setSelectedTemplateCode] = useState(initialTemplateCode);

  useEffect(() => {
    setSelectedTemplateCode(initialTemplateCode);
  }, [initialTemplateCode]);

  const selectedTemplate = useMemo(
    () => templateOptions.find((template) => template.code === selectedTemplateCode),
    [templateOptions, selectedTemplateCode],
  );

  const onSubmitForm = async (values: RuleFormValues) => {
    let conditionExpr: Record<string, unknown>;
    let actionPayload: Record<string, unknown>;

    try {
      conditionExpr = JSON.parse(values.condition_expr);
    } catch {
      setError('condition_expr', { type: 'manual', message: 'Condition must be valid JSON' });
      return;
    }

    try {
      actionPayload = JSON.parse(values.action_payload);
    } catch {
      setError('action_payload', { type: 'manual', message: 'Action payload must be valid JSON' });
      return;
    }

    const payload: CreateRuleInput = {
      code: values.code.trim(),
      name: values.name.trim(),
      category: values.category.trim(),
      trigger_event_type: values.trigger_event_type.trim(),
      condition_expr: conditionExpr,
      schedule_mode: values.schedule_mode,
      action_type: values.action_type,
      action_payload: actionPayload,
      description: normalizeOptional(values.description),
      trigger_event_subtype: normalizeOptional(values.trigger_event_subtype),
      delay_seconds: values.delay_seconds,
      priority: values.priority,
      cooldown_seconds: values.cooldown_seconds,
      idempotency_window: values.idempotency_window,
      max_executions_per_day: values.max_executions_per_day,
      effective_from: normalizeOptional(values.effective_from),
      effective_to: normalizeOptional(values.effective_to),
      is_active: values.is_active ? values.is_active === 'true' : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
      <FormSection
        icon={Workflow}
        title="Rule"
        description="How the rule is identified and grouped"
      >
        <div className="grid gap-4 md:grid-cols-3">
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
                    {PRM_RULE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
        <FormField id="description" label="Description">
          <Textarea id="description" rows={3} {...register('description')} />
        </FormField>
      </FormSection>

      <FormSection
        icon={Zap}
        title="Trigger"
        description="The event that fires the rule and the condition it must meet"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="trigger_event_type"
            label="Trigger Event Type"
            required
            error={errors.trigger_event_type?.message}
          >
            <Controller
              control={control}
              name="trigger_event_type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="trigger_event_type"
                    {...invalidProps('trigger_event_type', errors.trigger_event_type?.message)}
                  >
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRM_EVENT_TYPES.map((eventType) => (
                      <SelectItem key={eventType} value={eventType}>
                        {eventType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField id="trigger_event_subtype" label="Trigger Event Subtype">
            <Controller
              control={control}
              name="trigger_event_subtype"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!watchedEventType}
                >
                  <SelectTrigger id="trigger_event_subtype">
                    <SelectValue placeholder="Select event subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    {(PRM_EVENT_SUBTYPES[watchedEventType] || []).map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
        <FormField
          id="condition_expr"
          label="Condition Expression (JSON)"
          required
          error={errors.condition_expr?.message}
        >
          <Textarea
            id="condition_expr"
            rows={6}
            {...register('condition_expr')}
            {...invalidProps('condition_expr', errors.condition_expr?.message)}
          />
        </FormField>
      </FormSection>

      <FormSection icon={Send} title="Action" description="What the rule does, and when">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField id="schedule_mode" label="Schedule Mode" required>
            <Controller
              control={control}
              name="schedule_mode"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="schedule_mode">
                    <SelectValue placeholder="Select schedule mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMMEDIATE">Immediate</SelectItem>
                    <SelectItem value="DELAYED">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField id="delay_seconds" label="Delay (seconds)">
            <Input id="delay_seconds" type="number" {...register('delay_seconds')} />
          </FormField>
          <FormField id="action_type" label="Action Type" required>
            <Controller
              control={control}
              name="action_type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="action_type">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEND_MESSAGE">Send Message</SelectItem>
                    <SelectItem value="CREATE_TASK">Create Task</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>
        {watchedActionType === 'SEND_MESSAGE' && (
          <FormField
            id="template_code"
            label="Template"
            hint={
              selectedTemplate ? `Channel: ${selectedTemplate.channel || 'unknown'}` : undefined
            }
          >
            <Select
              value={selectedTemplateCode}
              onValueChange={(value) => {
                setSelectedTemplateCode(value);
                const template = templateOptions.find((option) => option.code === value);
                if (template) {
                  setValue(
                    'action_payload',
                    toTextareaJson({
                      channel: template.channel,
                      template_code: template.code,
                      purpose: 'care',
                    }),
                  );
                }
              }}
            >
              <SelectTrigger id="template_code">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map((template) => (
                  <SelectItem key={template.code} value={template.code}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
        <FormField
          id="action_payload"
          label="Action Payload (JSON)"
          required
          error={errors.action_payload?.message}
        >
          <Textarea
            id="action_payload"
            rows={6}
            {...register('action_payload')}
            {...invalidProps('action_payload', errors.action_payload?.message)}
          />
        </FormField>
      </FormSection>

      <FormSection
        icon={Gauge}
        title="Limits & validity"
        description="Throttling, priority and the period the rule is live"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField id="priority" label="Priority">
            <Input id="priority" type="number" {...register('priority')} />
          </FormField>
          <FormField id="cooldown_seconds" label="Cooldown (seconds)" hint={COOLDOWN_HINT}>
            <Input id="cooldown_seconds" type="number" {...register('cooldown_seconds')} />
          </FormField>
          <FormField
            id="idempotency_window"
            label="Idempotency Window (seconds)"
            hint={IDEMPOTENCY_HINT}
          >
            <Input id="idempotency_window" type="number" {...register('idempotency_window')} />
          </FormField>
          <FormField id="max_executions_per_day" label="Max Executions Per Day">
            <Input
              id="max_executions_per_day"
              type="number"
              {...register('max_executions_per_day')}
            />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField id="effective_from" label="Effective From">
            <Input
              id="effective_from"
              type="datetime-local"
              className={FIELD_CONTROL}
              {...register('effective_from')}
            />
          </FormField>
          <FormField id="effective_to" label="Effective To">
            <Input
              id="effective_to"
              type="datetime-local"
              className={FIELD_CONTROL}
              {...register('effective_to')}
            />
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

const COOLDOWN_HINT =
  'Minimum time between executing this rule again for the same patient. If an event triggers the rule again during the cooldown, the rule is skipped to avoid spamming.';

const IDEMPOTENCY_HINT =
  'A deduplication window for the rule to prevent repeated execution of essentially the same event (e.g., retries or duplicate events). If a matching event arrives within this window, it won’t trigger the rule again.';
