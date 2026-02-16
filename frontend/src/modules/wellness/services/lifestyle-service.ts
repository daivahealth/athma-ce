import { clinicalClient } from '@/lib/api/client';
import type {
    NutritionPlan,
    ExercisePrescription,
    CreateNutritionPlanInput,
    CreateExercisePrescriptionInput,
} from '../types/lifestyle';

class LifestyleService {
    // Nutrition Plans
    async listNutritionPlans(filters?: { patientId?: string; status?: string }): Promise<NutritionPlan[]> {
        const response = await clinicalClient.get('/wellness/lifestyle/nutrition-plans', { params: filters });
        return response.data;
    }

    async getNutritionPlanById(id: string): Promise<NutritionPlan> {
        const response = await clinicalClient.get(`/wellness/lifestyle/nutrition-plans/${id}`);
        return response.data;
    }

    async createNutritionPlan(payload: CreateNutritionPlanInput): Promise<NutritionPlan> {
        const response = await clinicalClient.post('/wellness/lifestyle/nutrition-plans', payload);
        return response.data;
    }

    // Exercise Prescriptions
    async listExercisePrescriptions(filters?: { patientId?: string; status?: string }): Promise<ExercisePrescription[]> {
        const response = await clinicalClient.get('/wellness/lifestyle/exercise-prescriptions', { params: filters });
        return response.data;
    }

    async getExercisePrescriptionById(id: string): Promise<ExercisePrescription> {
        const response = await clinicalClient.get(`/wellness/lifestyle/exercise-prescriptions/${id}`);
        return response.data;
    }

    async createExercisePrescription(payload: CreateExercisePrescriptionInput): Promise<ExercisePrescription> {
        const response = await clinicalClient.post('/wellness/lifestyle/exercise-prescriptions', payload);
        return response.data;
    }
}

export const lifestyleService = new LifestyleService();
