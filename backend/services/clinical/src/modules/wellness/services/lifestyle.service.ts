import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
    CreateNutritionPlanDto,
    CreateExercisePrescriptionDto,
} from '../dto/lifestyle.dto';

@Injectable()
export class LifestyleService {
    constructor(private readonly prisma: PrismaService) { }

    // ============================================
    // Nutrition Plan Methods
    // ============================================

    async createNutritionPlan(tenantId: string, userId: string, dto: CreateNutritionPlanDto) {
        return this.prisma.nutritionPlan.create({
            data: {
                tenantId,
                createdBy: userId,
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
            },
        });
    }

    async findAllNutritionPlans(tenantId: string, options?: { patientId?: string; status?: string }) {
        const where: any = { tenantId };
        if (options?.patientId) where.patientId = options.patientId;
        if (options?.status) where.status = options.status;

        return this.prisma.nutritionPlan.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findNutritionPlanById(tenantId: string, id: string) {
        const plan = await this.prisma.nutritionPlan.findFirst({
            where: { id, tenantId },
        });
        if (!plan) {
            throw new NotFoundException(`Nutrition plan with ID ${id} not found`);
        }
        return plan;
    }

    async updateNutritionPlanStatus(tenantId: string, id: string, status: string) {
        await this.findNutritionPlanById(tenantId, id);
        return this.prisma.nutritionPlan.update({
            where: { id },
            data: { status },
        });
    }

    // ============================================
    // Exercise Prescription Methods
    // ============================================

    async createExercisePrescription(tenantId: string, userId: string, dto: CreateExercisePrescriptionDto) {
        return this.prisma.exercisePrescription.create({
            data: {
                tenantId,
                createdBy: userId,
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
            },
        });
    }

    async findAllExercisePrescriptions(tenantId: string, options?: { patientId?: string; status?: string }) {
        const where: any = { tenantId };
        if (options?.patientId) where.patientId = options.patientId;
        if (options?.status) where.status = options.status;

        return this.prisma.exercisePrescription.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findExercisePrescriptionById(tenantId: string, id: string) {
        const prescription = await this.prisma.exercisePrescription.findFirst({
            where: { id, tenantId },
        });
        if (!prescription) {
            throw new NotFoundException(`Exercise prescription with ID ${id} not found`);
        }
        return prescription;
    }

    async updateExercisePrescriptionStatus(tenantId: string, id: string, status: string) {
        await this.findExercisePrescriptionById(tenantId, id);
        return this.prisma.exercisePrescription.update({
            where: { id },
            data: { status },
        });
    }
}
