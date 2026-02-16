import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateNutritionPlanDto, UpdateNutritionPlanDto } from '../dto/lifestyle.dto';

@Injectable()
export class NutritionPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateNutritionPlanDto) {
    return this.prisma.nutritionPlan.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        planName: dto.planName,
        planType: dto.planType,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        targetCalories: dto.targetCalories ?? null,
        targetProtein: dto.targetProtein ?? null,
        targetCarbs: dto.targetCarbs ?? null,
        targetFat: dto.targetFat ?? null,
        targetFiber: dto.targetFiber ?? null,
        mealsPerDay: dto.mealsPerDay || 3,
        snacksPerDay: dto.snacksPerDay || 2,
        ...(dto.mealPlan !== undefined && { mealPlan: dto.mealPlan }),
        ...(dto.restrictions !== undefined && { restrictions: dto.restrictions }),
        ...(dto.supplements !== undefined && { supplements: dto.supplements }),
        createdByDietitian: dto.createdByDietitian ?? null,
        notes: dto.notes ?? null,
        status: 'active',
        createdBy: userId,
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const plan = await this.prisma.nutritionPlan.findFirst({
      where: { id, tenantId },
    });
    if (!plan) {
      throw new NotFoundException(`Nutrition plan with ID ${id} not found`);
    }
    return plan;
  }

  async findByPatient(tenantId: string, patientId: string, options?: { status?: string }) {
    const where: any = { tenantId, patientId };
    if (options?.status) where.status = options.status;

    return this.prisma.nutritionPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateNutritionPlanDto) {
    await this.findById(tenantId, id);
    const data: Record<string, any> = {};
    if (dto.planName !== undefined) data.planName = dto.planName;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.targetCalories !== undefined) data.targetCalories = dto.targetCalories;
    if (dto.targetProtein !== undefined) data.targetProtein = dto.targetProtein;
    if (dto.targetCarbs !== undefined) data.targetCarbs = dto.targetCarbs;
    if (dto.targetFat !== undefined) data.targetFat = dto.targetFat;
    if (dto.mealPlan !== undefined) data.mealPlan = dto.mealPlan;
    if (dto.supplements !== undefined) data.supplements = dto.supplements;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    return this.prisma.nutritionPlan.update({
      where: { id },
      data,
    });
  }

  async complete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.nutritionPlan.update({
      where: { id },
      data: {
        status: 'completed',
        endDate: new Date(),
      },
    });
  }

  async pause(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.nutritionPlan.update({
      where: { id },
      data: { status: 'paused' },
    });
  }

  async getActiveForPatient(tenantId: string, patientId: string) {
    return this.prisma.nutritionPlan.findFirst({
      where: { tenantId, patientId, status: 'active' },
    });
  }
}
