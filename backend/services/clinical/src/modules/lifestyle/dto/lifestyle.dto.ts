import {
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsNumber,
  IsObject,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================
// Nutrition Plan DTOs
// ============================================

export class CreateNutritionPlanDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Plan name' })
  @IsString()
  planName!: string;

  @ApiProperty({ description: 'Plan type (weight_loss, maintenance, muscle_gain, therapeutic, detox)' })
  @IsString()
  planType!: string;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Target daily calories' })
  @IsOptional()
  @IsInt()
  targetCalories?: number;

  @ApiPropertyOptional({ description: 'Target protein (grams)' })
  @IsOptional()
  @IsNumber()
  targetProtein?: number;

  @ApiPropertyOptional({ description: 'Target carbs (grams)' })
  @IsOptional()
  @IsNumber()
  targetCarbs?: number;

  @ApiPropertyOptional({ description: 'Target fat (grams)' })
  @IsOptional()
  @IsNumber()
  targetFat?: number;

  @ApiPropertyOptional({ description: 'Target fiber (grams)' })
  @IsOptional()
  @IsNumber()
  targetFiber?: number;

  @ApiPropertyOptional({ description: 'Meals per day' })
  @IsOptional()
  @IsInt()
  mealsPerDay?: number;

  @ApiPropertyOptional({ description: 'Snacks per day' })
  @IsOptional()
  @IsInt()
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

  @ApiPropertyOptional({ description: 'Dietitian ID' })
  @IsOptional()
  @IsUUID("all")
  createdByDietitian?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateNutritionPlanDto {
  @ApiPropertyOptional({ description: 'Plan name' })
  @IsOptional()
  @IsString()
  planName?: string;

  @ApiPropertyOptional({ description: 'Status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Target calories' })
  @IsOptional()
  @IsInt()
  targetCalories?: number;

  @ApiPropertyOptional({ description: 'Target protein' })
  @IsOptional()
  @IsNumber()
  targetProtein?: number;

  @ApiPropertyOptional({ description: 'Target carbs' })
  @IsOptional()
  @IsNumber()
  targetCarbs?: number;

  @ApiPropertyOptional({ description: 'Target fat' })
  @IsOptional()
  @IsNumber()
  targetFat?: number;

  @ApiPropertyOptional({ description: 'Meal plan structure' })
  @IsOptional()
  @IsObject()
  mealPlan?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Supplements' })
  @IsOptional()
  @IsObject()
  supplements?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class NutritionPlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  planName!: string;

  @ApiProperty()
  planType!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  startDate!: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiPropertyOptional()
  targetCalories?: number;

  @ApiPropertyOptional()
  targetProtein?: number;

  @ApiPropertyOptional()
  targetCarbs?: number;

  @ApiPropertyOptional()
  targetFat?: number;

  @ApiProperty()
  mealsPerDay!: number;

  @ApiProperty()
  snacksPerDay!: number;

  @ApiPropertyOptional()
  mealPlan?: Record<string, any>;

  @ApiPropertyOptional()
  restrictions?: Record<string, any>;

  @ApiPropertyOptional()
  supplements?: Record<string, any>;

  @ApiPropertyOptional()
  createdByDietitian?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

// ============================================
// Exercise Prescription DTOs
// ============================================

export class CreateExercisePrescriptionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID("all")
  patientId!: string;

  @ApiProperty({ description: 'Prescription name' })
  @IsString()
  prescriptionName!: string;

  @ApiProperty({ description: 'Goal (weight_loss, cardiovascular, strength, flexibility, rehabilitation)' })
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
  sessionsPerWeek!: number;

  @ApiProperty({ description: 'Minutes per session' })
  @IsInt()
  minutesPerSession!: number;

  @ApiPropertyOptional({ description: 'Target minimum heart rate' })
  @IsOptional()
  @IsInt()
  targetHeartRateMin?: number;

  @ApiPropertyOptional({ description: 'Target maximum heart rate' })
  @IsOptional()
  @IsInt()
  targetHeartRateMax?: number;

  @ApiPropertyOptional({ description: 'Target MET level' })
  @IsOptional()
  @IsNumber()
  targetMETLevel?: number;

  @ApiPropertyOptional({ description: 'Weekly calorie burn target' })
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

  @ApiPropertyOptional({ description: 'Warm-up routine' })
  @IsOptional()
  @IsObject()
  warmUp?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Cool-down routine' })
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

  @ApiPropertyOptional({ description: 'Prescribing provider ID' })
  @IsOptional()
  @IsUUID("all")
  prescribedBy?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateExercisePrescriptionDto {
  @ApiPropertyOptional({ description: 'Prescription name' })
  @IsOptional()
  @IsString()
  prescriptionName?: string;

  @ApiPropertyOptional({ description: 'Status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Sessions per week' })
  @IsOptional()
  @IsInt()
  sessionsPerWeek?: number;

  @ApiPropertyOptional({ description: 'Minutes per session' })
  @IsOptional()
  @IsInt()
  minutesPerSession?: number;

  @ApiPropertyOptional({ description: 'Exercises' })
  @IsOptional()
  @IsArray()
  exercises?: Array<Record<string, any>>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ExercisePrescriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  patientId!: string;

  @ApiProperty()
  prescriptionName!: string;

  @ApiProperty()
  goal!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  startDate!: Date;

  @ApiPropertyOptional()
  endDate?: Date;

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
  exercises!: Array<Record<string, any>>;

  @ApiPropertyOptional()
  warmUp?: Record<string, any>;

  @ApiPropertyOptional()
  coolDown?: Record<string, any>;

  @ApiPropertyOptional()
  precautions?: string;

  @ApiPropertyOptional()
  prescribedBy?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
