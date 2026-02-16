import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateExercisePrescriptionDto, UpdateExercisePrescriptionDto } from '../dto/lifestyle.dto';

@Injectable()
export class ExercisePrescriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateExercisePrescriptionDto) {
    return this.prisma.exercisePrescription.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        prescriptionName: dto.prescriptionName,
        goal: dto.goal,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        sessionsPerWeek: dto.sessionsPerWeek,
        minutesPerSession: dto.minutesPerSession,
        targetHeartRateMin: dto.targetHeartRateMin ?? null,
        targetHeartRateMax: dto.targetHeartRateMax ?? null,
        targetMETLevel: dto.targetMETLevel ?? null,
        weeklyCalorieBurn: dto.weeklyCalorieBurn ?? null,
        exercises: dto.exercises || [],
        ...(dto.warmUp !== undefined && { warmUp: dto.warmUp }),
        ...(dto.coolDown !== undefined && { coolDown: dto.coolDown }),
        precautions: dto.precautions ?? null,
        ...(dto.contraindications !== undefined && { contraindications: dto.contraindications }),
        prescribedBy: dto.prescribedBy ?? null,
        notes: dto.notes ?? null,
        status: 'active',
        createdBy: userId,
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const prescription = await this.prisma.exercisePrescription.findFirst({
      where: { id, tenantId },
    });
    if (!prescription) {
      throw new NotFoundException(`Exercise prescription with ID ${id} not found`);
    }
    return prescription;
  }

  async findByPatient(tenantId: string, patientId: string, options?: { status?: string; goal?: string }) {
    const where: any = { tenantId, patientId };
    if (options?.status) where.status = options.status;
    if (options?.goal) where.goal = options.goal;

    return this.prisma.exercisePrescription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateExercisePrescriptionDto) {
    await this.findById(tenantId, id);
    const data: Record<string, any> = {};
    if (dto.prescriptionName !== undefined) data.prescriptionName = dto.prescriptionName;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sessionsPerWeek !== undefined) data.sessionsPerWeek = dto.sessionsPerWeek;
    if (dto.minutesPerSession !== undefined) data.minutesPerSession = dto.minutesPerSession;
    if (dto.exercises !== undefined) data.exercises = dto.exercises;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    return this.prisma.exercisePrescription.update({
      where: { id },
      data,
    });
  }

  async complete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.exercisePrescription.update({
      where: { id },
      data: {
        status: 'completed',
        endDate: new Date(),
      },
    });
  }

  async pause(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.exercisePrescription.update({
      where: { id },
      data: { status: 'paused' },
    });
  }

  async resume(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.exercisePrescription.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  async getActiveForPatient(tenantId: string, patientId: string) {
    return this.prisma.exercisePrescription.findFirst({
      where: { tenantId, patientId, status: 'active' },
    });
  }

  async logSession(
    tenantId: string,
    prescriptionId: string,
    sessionData: {
      completedAt: Date;
      actualDuration: number;
      exercisesCompleted: any[];
      heartRateAvg?: number;
      caloriesBurned?: number;
      notes?: string;
    },
  ) {
    const prescription = await this.findById(tenantId, prescriptionId);

    // Store session log in the prescription's metadata
    const existingLogs = (prescription as any).sessionLogs || [];
    const newLog = {
      id: crypto.randomUUID(),
      ...sessionData,
      loggedAt: new Date(),
    };

    return this.prisma.exercisePrescription.update({
      where: { id: prescriptionId },
      data: {
        // Update notes with session log info (simplified - could use separate table)
        notes: prescription.notes
          ? `${prescription.notes}\n\nSession ${existingLogs.length + 1}: ${sessionData.actualDuration}min, ${sessionData.caloriesBurned || 0} cal burned`
          : `Session ${existingLogs.length + 1}: ${sessionData.actualDuration}min, ${sessionData.caloriesBurned || 0} cal burned`,
      },
    });
  }

  async getPatientExerciseSummary(tenantId: string, patientId: string) {
    const prescriptions = await this.prisma.exercisePrescription.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    });

    const active = prescriptions.filter((p) => p.status === 'active');
    const completed = prescriptions.filter((p) => p.status === 'completed');

    return {
      totalPrescriptions: prescriptions.length,
      activePrescriptions: active.length,
      completedPrescriptions: completed.length,
      currentGoals: active.map((p) => p.goal),
      weeklyTargetMinutes: active.reduce((sum, p) => sum + p.sessionsPerWeek * p.minutesPerSession, 0),
    };
  }
}
