export type TemplateChannel = 'sms' | 'whatsapp' | 'email' | 'in_app' | 'push';
export type TemplateApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface CreateTemplateInput {
  code: string;
  name: string;
  description?: string;
  category: string;
  channel: TemplateChannel;
  language?: string;
  subject?: string;
  body: string;
  variables_schema: Record<string, unknown>;
  approval_status?: TemplateApprovalStatus;
  version?: number;
  is_active?: boolean;
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {}

export type Template = Record<string, unknown>;
