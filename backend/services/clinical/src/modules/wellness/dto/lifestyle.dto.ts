import {
    IsString,
    IsUUID,
    IsOptional,
    IsInt,
    IsNumber,
    IsObject,
    IsDateString,
    IsArray,
    Min,
    Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNutritionPlanDto {
    @ApiProperty({ description: 'Plan name' })
    @IsString()
    planName!: string;

    @ApiProperty({ description: 'Plan type (weight_loss, maintenance, muscle_gain, etc.)' })
    @IsString()
    planType!: string;

    @ApiProperty({ description: 'Patient ID' })
    @IsUUID("all")
    patientId!: string;

    @ApiProperty({ description: 'Start date' })
    @IsDateString()
    startDate!: string;

    @ApiPropertyOptional({ description: 'End date' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'Target calories per day' })
    @IsOptional()
    @IsInt()
    @Min(0)
    targetCalories?: number;

    @ApiPropertyOptional({ description: 'Target protein (grams)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    targetProtein?: number;

    @ApiPropertyOptional({ description: 'Target carbs (grams)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    targetCarbs?: number;

    @ApiPropertyOptional({ description: 'Target fat (grams)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    targetFat?: number;

    @ApiPropertyOptional({ description: 'Target fiber (grams)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    targetFiber?: number;

    @ApiPropertyOptional({ description: 'Meals per day' })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    mealsPerDay?: number;

    @ApiPropertyOptional({ description: 'Snacks per day' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10)
    snacksPerDay?: number;

    @ApiPropertyOptional({ description: 'Meal plan structure' })
    @IsOptional()
    @IsObject()
    mealPlan?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Dietary restrictions' })
    @IsOptional()
    @IsObject()
    restrictions?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Recommended supplements' })
    @IsOptional()
    @IsObject()
    supplements?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Notes' })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class CreateExercisePrescriptionDto {
    @ApiProperty({ description: 'Prescription name' })
    @IsString()
    prescriptionName!: string;

    @ApiProperty({ description: 'Patient ID' })
    @IsUUID("all")
    patientId!: string;

    @ApiProperty({ description: 'Goal (weight_loss, cardiovascular, etc.)' })
    @IsString()
    goal!: string;

    @ApiProperty({ description: 'Start date' })
    @IsDateString()
    startDate!: string;

    @ApiPropertyOptional({ description: 'End date' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ description: 'Sessions per week' })
    @IsInt()
    @Min(1)
    sessionsPerWeek!: number;

    @ApiProperty({ description: 'Minutes per session' })
    @IsInt()
    @Min(1)
    minutesPerSession!: number;

    @ApiPropertyOptional({ description: 'Target heart rate min' })
    @IsOptional()
    @IsInt()
    targetHeartRateMin?: number;

    @ApiPropertyOptional({ description: 'Target heart rate max' })
    @IsOptional()
    @IsInt()
    targetHeartRateMax?: number;

    @ApiPropertyOptional({ description: 'Target MET level' })
    @IsOptional()
    @IsNumber()
    targetMETLevel?: number;

    @ApiPropertyOptional({ description: 'Weekly calorie burn goal' })
    @IsOptional()
    @IsInt()
    weeklyCalorieBurn?: number;

    @ApiProperty({ description: 'Exercise list' })
    @IsArray()
    exercises!: Array<{
        type: string;
        name: string;
        sets?: number;
        reps?: number;
        duration?: number;
        intensity?: string;
        notes?: string;
    }>;

    @ApiPropertyOptional({ description: 'Warm up exercises' })
    @IsOptional()
    @IsObject()
    warmUp?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Cool down exercises' })
    @IsOptional()
    @IsObject()
    coolDown?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Precautions' })
    @IsOptional()
    @IsString()
    precautions?: string;

    @ApiPropertyOptional({ description: 'Contraindications' })
    @IsOptional()
    @IsObject()
    contraindications?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Notes' })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class LifestyleResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    tenantId!: string;

    @ApiProperty()
    patientId!: string;

    @ApiProperty()
    status!: string;

    @ApiProperty()
    startDate!: Date;

    @ApiPropertyOptional()
    endDate?: Date;

    @ApiPropertyOptional()
    notes?: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty()
    createdBy!: string;
}

export class NutritionPlanResponseDto extends LifestyleResponseDto {
    @ApiProperty()
    planName!: string;

    @ApiProperty()
    planType!: string;

    @ApiPropertyOptional()
    targetCalories?: number;

    @ApiPropertyOptional()
    targetProtein?: number;

    @ApiPropertyOptional()
    targetCarbs?: number;

    @ApiPropertyOptional()
    targetFat?: number;

    @ApiPropertyOptional()
    targetFiber?: number;

    @ApiProperty()
    mealsPerDay!: number;

    @ApiProperty()
    snacksPerDay!: number;

    @ApiPropertyOptional()
    mealPlan?: any;

    @ApiPropertyOptional()
    restrictions?: any;

    @ApiPropertyOptional()
    supplements?: any;
}

export class ExercisePrescriptionResponseDto extends LifestyleResponseDto {
    @ApiProperty()
    prescriptionName!: string;

    @ApiProperty()
    goal!: string;

    @ApiProperty()
    sessionsPerWeek!: number;

    @ApiProperty()
    minutesPerSession!: number;

    @ApiPropertyOptional()
    targetHeartRateMin?: number;

    @ApiPropertyOptional()
    targetHeartRateMax?: number;

    @ApiPropertyOptional()
    targetMETLevel?: number;

    @ApiPropertyOptional()
    weeklyCalorieBurn?: number;

    @ApiProperty()
    exercises!: any;

    @ApiPropertyOptional()
    warmUp?: any;

    @ApiPropertyOptional()
    coolDown?: any;

    @ApiPropertyOptional()
    precautions?: string;

    @ApiPropertyOptional()
    contraindications?: any;
}
