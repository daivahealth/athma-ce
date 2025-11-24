import { rcmClient } from '@/lib/api/client';
import type {
  Invoice,
  InvoiceFilters,
  InvoiceStatistics,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
  RecordPaymentInput,
} from '../types/invoice';

class InvoiceService {
  async list(filters?: InvoiceFilters): Promise<Invoice[]> {
    const response = await rcmClient.get('/invoices', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Invoice> {
    const response = await rcmClient.get(`/invoices/${id}`);
    return response.data;
  }

  async getByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    const response = await rcmClient.get(`/invoices/number/${invoiceNumber}`);
    return response.data;
  }

  async getByPatient(patientId: string): Promise<Invoice[]> {
    const response = await rcmClient.get(`/invoices/patient/${patientId}`);
    return response.data;
  }

  async getByEncounter(encounterId: string): Promise<Invoice[]> {
    const response = await rcmClient.get(`/invoices/encounter/${encounterId}`);
    return response.data;
  }

  async getStatistics(filters?: { patientId?: string; encounterId?: string }): Promise<InvoiceStatistics> {
    const response = await rcmClient.get('/invoices/statistics', { params: filters });
    return response.data;
  }

  async create(payload: CreateInvoiceInput): Promise<Invoice> {
    const response = await rcmClient.post('/invoices', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateInvoiceInput): Promise<Invoice> {
    const response = await rcmClient.put(`/invoices/${id}`, payload);
    return response.data;
  }

  async updateStatus(id: string, payload: UpdateInvoiceStatusInput): Promise<Invoice> {
    const response = await rcmClient.put(`/invoices/${id}/status`, payload);
    return response.data;
  }

  async recordPayment(id: string, payload: RecordPaymentInput): Promise<Invoice> {
    const response = await rcmClient.put(`/invoices/${id}/payment`, payload);
    return response.data;
  }

  async cancel(id: string): Promise<Invoice> {
    const response = await rcmClient.put(`/invoices/${id}/cancel`);
    return response.data;
  }
}

export const invoiceService = new InvoiceService();
