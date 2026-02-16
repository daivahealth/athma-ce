import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { NutritionPlanService } from './services/nutrition-plan.service';
import { ExercisePrescriptionService } from './services/exercise-prescription.service';

// Controllers
import { NutritionPlanController } from './controllers/nutrition-plan.controller';
import { ExercisePrescriptionController } from './controllers/exercise-prescription.controller';

@Module({
  imports: [],
  controllers: [
    NutritionPlanController,
    ExercisePrescriptionController,
  ],
  providers: [
    PrismaService,
    NutritionPlanService,
    ExercisePrescriptionService,
  ],
  exports: [
    NutritionPlanService,
    ExercisePrescriptionService,
  ],
})
export class LifestyleModule {}
