import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    z.number().int().min(0).optional()
  ),
  action_type: z.enum(['SEND_MESSAGE', 'CREATE_TASK']),
  action_payload: z.string().min(2, 'Action payload JSON is required'),
  priority: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional()
  ),
  cooldown_seconds: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional()
  ),
  idempotency_window: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional()
  ),
  max_executions_per_day: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(0).optional()
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
}

export function RuleForm({ initialValues, submitLabel = 'Save rule', onSubmit }: RuleFormProps) {
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
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues,
  });

  const watchedEventType = watch('trigger_event_type');
  const watchedActionType = watch('action_type');
  const { data: templates = [] } = useTemplates({ isActive: true });

  const templateOptions = useMemo(() => {
    return (templates as any[])
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
                  {PRM_RULE_CATEGORIES.map((category) => (
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
          <Label>Trigger Event Type *</Label>
          <Controller
            control={control}
            name="trigger_event_type"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
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
          {errors.trigger_event_type && (
            <p className="text-sm text-destructive">{errors.trigger_event_type.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Trigger Event Subtype</Label>
          <Controller
            control={control}
            name="trigger_event_subtype"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!watchedEventType}
              >
                <SelectTrigger>
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
        </div>
        <div className="space-y-2">
          <Label>Schedule Mode *</Label>
          <Controller
            control={control}
            name="schedule_mode"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMMEDIATE">Immediate</SelectItem>
                  <SelectItem value="DELAYED">Delayed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="delay_seconds">Delay (seconds)</Label>
          <Input id="delay_seconds" type="number" {...register('delay_seconds')} />
        </div>
        <div className="space-y-2">
          <Label>Action Type *</Label>
          <Controller
            control={control}
            name="action_type"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEND_MESSAGE">Send Message</SelectItem>
                  <SelectItem value="CREATE_TASK">Create Task</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {watchedActionType === 'SEND_MESSAGE' && (
          <div className="space-y-2 md:col-span-2">
            <Label>Template</Label>
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
              <SelectTrigger>
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
            {selectedTemplate && (
              <p className="text-xs text-muted-foreground">
                Channel: {selectedTemplate.channel || 'unknown'}
              </p>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Input id="priority" type="number" {...register('priority')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cooldown_seconds">Cooldown (seconds)</Label>
          <Input id="cooldown_seconds" type="number" {...register('cooldown_seconds')} />
          <p className="text-xs text-muted-foreground">
            Minimum time between executing this rule again for the same patient. If an event
            triggers the rule again during the cooldown, the rule is skipped to avoid spamming.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="idempotency_window">Idempotency Window (seconds)</Label>
          <Input id="idempotency_window" type="number" {...register('idempotency_window')} />
          <p className="text-xs text-muted-foreground">
            A deduplication window for the rule to prevent repeated execution of essentially the
            same event (e.g., retries or duplicate events). If a matching event arrives within
            this window, it won’t trigger the rule again.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_executions_per_day">Max Executions Per Day</Label>
          <Input id="max_executions_per_day" type="number" {...register('max_executions_per_day')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effective_from">Effective From</Label>
          <Input id="effective_from" type="datetime-local" {...register('effective_from')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="effective_to">Effective To</Label>
          <Input id="effective_to" type="datetime-local" {...register('effective_to')} />
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
          <Label htmlFor="condition_expr">Condition Expression (JSON) *</Label>
          <Textarea id="condition_expr" rows={6} {...register('condition_expr')} />
          {errors.condition_expr && (
            <p className="text-sm text-destructive">{errors.condition_expr.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="action_payload">Action Payload (JSON) *</Label>
          <Textarea id="action_payload" rows={6} {...register('action_payload')} />
          {errors.action_payload && (
            <p className="text-sm text-destructive">{errors.action_payload.message}</p>
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
