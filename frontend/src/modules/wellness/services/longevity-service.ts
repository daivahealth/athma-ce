import { clinicalClient } from '@/lib/api/client';
import type {
    LongevityProtocol,
    LongevityTreatment,
    LongevityTreatmentStatus,
    CreateLongevityTreatmentInput,
} from '../types/longevity';

class LongevityService {
    // Protocols
    async listProtocols(filters?: { protocolType?: string; isActive?: boolean }): Promise<LongevityProtocol[]> {
        const response = await clinicalClient.get('/wellness/longevity/protocols', { params: filters });
        return response.data;
    }

    async getProtocolById(id: string): Promise<LongevityProtocol> {
        const response = await clinicalClient.get(`/wellness/longevity/protocols/${id}`);
        return response.data;
    }

    async createProtocol(payload: Partial<LongevityProtocol>): Promise<LongevityProtocol> {
        const response = await clinicalClient.post('/wellness/longevity/protocols', payload);
        return response.data;
    }

    // Treatments
    async listTreatments(filters?: { status?: LongevityTreatmentStatus }): Promise<LongevityTreatment[]> {
        const response = await clinicalClient.get('/wellness/longevity/treatments', { params: filters });
        return response.data;
    }

    async getTreatmentById(id: string): Promise<LongevityTreatment> {
        const response = await clinicalClient.get(`/wellness/longevity/treatments/${id}`);
        return response.data;
    }

    async getPatientTreatments(patientId: string): Promise<LongevityTreatment[]> {
        const response = await clinicalClient.get(`/wellness/longevity/treatments/patient/${patientId}`);
        return response.data;
    }

    async createTreatment(payload: CreateLongevityTreatmentInput): Promise<LongevityTreatment> {
        const response = await clinicalClient.post('/wellness/longevity/treatments', payload);
        return response.data;
    }

    async updateTreatmentStatus(id: string, status: LongevityTreatmentStatus, notes?: string): Promise<LongevityTreatment> {
        const response = await clinicalClient.patch(`/wellness/longevity/treatments/${id}/status`, { status, notes });
        return response.data;
    }
}

export const longevityService = new LongevityService();
