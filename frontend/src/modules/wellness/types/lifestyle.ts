export interface NutritionPlan {
    id: string;
    tenantId: string;
    patientId: string;
    planName: string;
    planType: string;
    status: string;
    startDate: string;
    endDate?: string;
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFat?: number;
    targetFiber?: number;
    mealsPerDay: number;
    snacksPerDay: number;
    mealPlan?: Record<string, any>;
    restrictions?: Record<string, any>;
    supplements?: Record<string, any>;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface ExercisePrescription {
    id: string;
    tenantId: string;
    patientId: string;
    prescriptionName: string;
    goal: string;
    status: string;
    startDate: string;
    endDate?: string;
    sessionsPerWeek: number;
    minutesPerSession: number;
    targetHeartRateMin?: number;
    targetHeartRateMax?: number;
    targetMETLevel?: number;
    weeklyCalorieBurn?: number;
    exercises: Array<{
        type: string;
        name: string;
        sets?: number;
        reps?: number;
        duration?: number;
        intensity?: string;
        notes?: string;
    }>;
    warmUp?: Record<string, any>;
    coolDown?: Record<string, any>;
    precautions?: string;
    contraindications?: Record<string, any>;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CreateNutritionPlanInput {
    patientId: string;
    planName: string;
    planType: string;
    startDate: string;
    endDate?: string;
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFat?: number;
    targetFiber?: number;
    mealsPerDay?: number;
    snacksPerDay?: number;
    mealPlan?: Record<string, any>;
    restrictions?: Record<string, any>;
    supplements?: Record<string, any>;
    notes?: string;
}

export interface CreateExercisePrescriptionInput {
    patientId: string;
    prescriptionName: string;
    goal: string;
    startDate: string;
    endDate?: string;
    sessionsPerWeek: number;
    minutesPerSession: number;
    exercises: Array<any>;
    notes?: string;
}
