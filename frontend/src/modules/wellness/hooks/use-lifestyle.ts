import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lifestyleService } from '../services/lifestyle-service';
import type {
    CreateNutritionPlanInput,
    CreateExercisePrescriptionInput,
} from '../types/lifestyle';

export function useNutritionPlans(filters?: { patientId?: string; status?: string }) {
    return useQuery({
        queryKey: ['nutrition-plans', filters],
        queryFn: () => lifestyleService.listNutritionPlans(filters),
    });
}

export function useNutritionPlan(id?: string) {
    return useQuery({
        queryKey: ['nutrition-plan', id],
        queryFn: () => lifestyleService.getNutritionPlanById(id!),
        enabled: Boolean(id),
    });
}

export function useCreateNutritionPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateNutritionPlanInput) => lifestyleService.createNutritionPlan(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
            queryClient.invalidateQueries({ queryKey: ['nutrition-plans', { patientId: data.patientId }] });
        },
    });
}

export function useExercisePrescriptions(filters?: { patientId?: string; status?: string }) {
    return useQuery({
        queryKey: ['exercise-prescriptions', filters],
        queryFn: () => lifestyleService.listExercisePrescriptions(filters),
    });
}

export function useExercisePrescription(id?: string) {
    return useQuery({
        queryKey: ['exercise-prescription', id],
        queryFn: () => lifestyleService.getExercisePrescriptionById(id!),
        enabled: Boolean(id),
    });
}

export function useCreateExercisePrescription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateExercisePrescriptionInput) => lifestyleService.createExercisePrescription(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['exercise-prescriptions'] });
            queryClient.invalidateQueries({ queryKey: ['exercise-prescriptions', { patientId: data.patientId }] });
        },
    });
}
