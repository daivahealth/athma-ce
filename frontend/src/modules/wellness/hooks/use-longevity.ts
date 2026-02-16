import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { longevityService } from '../services/longevity-service';
import type {
    LongevityTreatmentStatus,
    CreateLongevityTreatmentInput,
} from '../types/longevity';

export function useLongevityProtocols(filters?: { protocolType?: string; isActive?: boolean }) {
    return useQuery({
        queryKey: ['longevity-protocols', filters],
        queryFn: () => longevityService.listProtocols(filters),
    });
}

export function useLongevityProtocol(id?: string) {
    return useQuery({
        queryKey: ['longevity-protocol', id],
        queryFn: () => longevityService.getProtocolById(id!),
        enabled: Boolean(id),
    });
}

export function useLongevityTreatments(filters?: { status?: LongevityTreatmentStatus }) {
    return useQuery({
        queryKey: ['longevity-treatments', filters],
        queryFn: () => longevityService.listTreatments(filters),
    });
}

export function usePatientLongevityTreatments(patientId?: string) {
    return useQuery({
        queryKey: ['patient-longevity-treatments', patientId],
        queryFn: () => longevityService.getPatientTreatments(patientId!),
        enabled: Boolean(patientId),
    });
}

export function useCreateLongevityTreatment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateLongevityTreatmentInput) => longevityService.createTreatment(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['longevity-treatments'] });
            queryClient.invalidateQueries({ queryKey: ['patient-longevity-treatments', data.patientId] });
        },
    });
}

export function useUpdateLongevityTreatmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, notes }: { id: string; status: LongevityTreatmentStatus; notes?: string }) =>
            longevityService.updateTreatmentStatus(id, status, notes),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['longevity-treatments'] });
            queryClient.invalidateQueries({ queryKey: ['patient-longevity-treatments', data.patientId] });
            queryClient.invalidateQueries({ queryKey: ['longevity-treatment', data.id] });
        },
    });
}
