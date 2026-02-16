export type LongevityTreatmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ADVERSE_EVENT';

export interface LongevityProtocol {
    id: string;
    tenantId: string;
    code: string;
    name: string;
    description?: string;
    protocolType: string;
    administrationRoute: string;
    typicalDuration?: number;
    frequencyRecommendation?: string;
    components: Array<{
        name: string;
        dose: string;
        unit: string;
        optional?: boolean;
    }>;
    contraindications?: Record<string, any>;
    preRequirements?: Record<string, any>;
    monitoringProtocol?: Record<string, any>;
    consentRequired: boolean;
    consentTemplateId?: string;
    estimatedCost?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LongevityTreatment {
    id: string;
    tenantId: string;
    facilityId: string;
    patientId: string;
    protocolId: string;
    protocol?: LongevityProtocol;
    encounterId?: string;
    treatmentNumber: string;
    sessionInSeries: number;
    status: LongevityTreatmentStatus;
    scheduledAt?: string;
    startedAt?: string;
    completedAt?: string;
    providerId?: string;
    nurseId?: string;
    preVitals?: Record<string, any>;
    preTreatmentNotes?: string;
    actualComponents?: Array<any>;
    treatmentNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLongevityTreatmentInput {
    facilityId: string;
    patientId: string;
    protocolId: string;
    encounterId?: string;
    scheduledAt?: string;
    providerId?: string;
    preTreatmentNotes?: string;
}
