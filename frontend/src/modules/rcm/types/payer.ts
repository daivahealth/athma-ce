export enum PayerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface PayerContactInfo {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  [key: string]: any;
}

export interface PayerConfiguration {
  clearinghouse?: string;
  electronicId?: string;
  requiresAuthorization?: boolean;
  [key: string]: any;
}

export interface Payer {
  id: string;
  tenantId: string;
  payerName: string;
  payerId?: string;
  payerType?: string;
  contactInfo?: PayerContactInfo | null;
  configuration?: PayerConfiguration | null;
  status: PayerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayerInput {
  payerName: string;
  payerId?: string;
  payerType?: string;
  contactInfo?: PayerContactInfo;
  configuration?: PayerConfiguration;
  status?: PayerStatus;
}

export interface UpdatePayerInput extends CreatePayerInput {}

export interface PayerFilters {
  status?: PayerStatus;
}

export interface PayerStatistics {
  total: number;
  byStatus: Record<string, number>;
  policyCounts: Record<string, number>;
}
