export type RuleScheduleMode = 'IMMEDIATE' | 'DELAYED';
export type RuleActionType = 'SEND_MESSAGE' | 'CREATE_TASK';

export interface CreateRuleInput {
  code: string;
  name: string;
  description?: string;
  category: string;
  trigger_event_type: string;
  trigger_event_subtype?: string;
  condition_expr: Record<string, unknown>;
  schedule_mode: RuleScheduleMode;
  delay_seconds?: number;
  action_type: RuleActionType;
  action_payload: Record<string, unknown>;
  priority?: number;
  cooldown_seconds?: number;
  idempotency_window?: number;
  max_executions_per_day?: number;
  effective_from?: string;
  effective_to?: string;
  is_active?: boolean;
}

export interface UpdateRuleInput extends Partial<CreateRuleInput> {}

export type Rule = Record<string, unknown>;
