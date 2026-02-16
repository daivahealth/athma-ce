import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

interface ScoreResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  biologicalAge?: number;
  chronologicalAge?: number;
}

@Injectable()
export class WellnessScoreService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate wellness scores based on template configuration and responses
   */
  async calculateScores(
    template: any,
    responses: Record<string, any>,
  ): Promise<ScoreResult> {
    const scoringAlgorithm = template.scoringAlgorithm || 'weighted_average';
    const scoringConfig = template.scoringConfig || {};
    const maxScore = Number(template.maxScore) || 100;

    let overallScore = 0;
    const categoryScores: Record<string, number> = {};

    const sections = template.sections as any[];

    switch (scoringAlgorithm) {
      case 'weighted_average':
        const result = this.calculateWeightedAverage(sections, responses, scoringConfig, maxScore);
        overallScore = result.overallScore;
        Object.assign(categoryScores, result.categoryScores);
        break;

      case 'sum':
        const sumResult = this.calculateSum(sections, responses, scoringConfig, maxScore);
        overallScore = sumResult.overallScore;
        Object.assign(categoryScores, sumResult.categoryScores);
        break;

      case 'custom':
        // Custom scoring would require evaluating a formula
        // For now, fall back to weighted average
        const customResult = this.calculateWeightedAverage(sections, responses, scoringConfig, maxScore);
        overallScore = customResult.overallScore;
        Object.assign(categoryScores, customResult.categoryScores);
        break;

      default:
        const defaultResult = this.calculateWeightedAverage(sections, responses, scoringConfig, maxScore);
        overallScore = defaultResult.overallScore;
        Object.assign(categoryScores, defaultResult.categoryScores);
    }

    // Calculate biological age if template supports it
    let biologicalAge: number | undefined;
    let chronologicalAge: number | undefined;

    if (template.includesBioAge && template.bioAgeFormula) {
      const bioAgeResult = this.calculateBiologicalAge(
        template.bioAgeFormula,
        responses,
        categoryScores,
      );
      biologicalAge = bioAgeResult.biologicalAge;
      chronologicalAge = bioAgeResult.chronologicalAge;
    }

    const result: ScoreResult = {
      overallScore: Math.round(overallScore * 100) / 100,
      categoryScores,
    };
    if (biologicalAge !== undefined) result.biologicalAge = biologicalAge;
    if (chronologicalAge !== undefined) result.chronologicalAge = chronologicalAge;
    return result;
  }

  private calculateWeightedAverage(
    sections: any[],
    responses: Record<string, any>,
    scoringConfig: Record<string, any>,
    maxScore: number,
  ): { overallScore: number; categoryScores: Record<string, number> } {
    const categoryScores: Record<string, number> = {};
    let totalWeight = 0;
    let weightedSum = 0;

    for (const section of sections) {
      const sectionName = section.name;
      const sectionWeight = scoringConfig.weights?.[sectionName] || 1;
      let sectionScore = 0;
      let questionCount = 0;

      const questions = section.questions || [];
      for (const question of questions) {
        const responseValue = responses[question.key];
        if (responseValue !== undefined && responseValue !== null) {
          const questionScore = this.getQuestionScore(question, responseValue);
          sectionScore += questionScore;
          questionCount++;
        }
      }

      if (questionCount > 0) {
        const avgSectionScore = sectionScore / questionCount;
        categoryScores[sectionName] = Math.round(avgSectionScore * 100) / 100;
        weightedSum += avgSectionScore * sectionWeight;
        totalWeight += sectionWeight;
      }
    }

    const overallScore = totalWeight > 0 ? (weightedSum / totalWeight) * (maxScore / 100) : 0;

    return { overallScore, categoryScores };
  }

  private calculateSum(
    sections: any[],
    responses: Record<string, any>,
    scoringConfig: Record<string, any>,
    maxScore: number,
  ): { overallScore: number; categoryScores: Record<string, number> } {
    const categoryScores: Record<string, number> = {};
    let totalScore = 0;

    for (const section of sections) {
      const sectionName = section.name;
      let sectionScore = 0;

      const questions = section.questions || [];
      for (const question of questions) {
        const responseValue = responses[question.key];
        if (responseValue !== undefined && responseValue !== null) {
          const questionScore = this.getQuestionScore(question, responseValue);
          sectionScore += questionScore;
        }
      }

      categoryScores[sectionName] = sectionScore;
      totalScore += sectionScore;
    }

    // Normalize to maxScore
    const overallScore = Math.min(totalScore, maxScore);

    return { overallScore, categoryScores };
  }

  private getQuestionScore(question: any, responseValue: any): number {
    // Check if question has scoring defined
    if (question.scoring) {
      // Direct value mapping
      if (question.scoring.valueMap && question.scoring.valueMap[responseValue] !== undefined) {
        return question.scoring.valueMap[responseValue];
      }

      // Range-based scoring
      if (question.scoring.ranges && typeof responseValue === 'number') {
        for (const range of question.scoring.ranges) {
          if (responseValue >= range.min && responseValue <= range.max) {
            return range.score;
          }
        }
      }

      // Boolean scoring
      if (question.scoring.trueScore !== undefined && typeof responseValue === 'boolean') {
        return responseValue ? question.scoring.trueScore : (question.scoring.falseScore || 0);
      }
    }

    // Default scoring for common question types
    if (question.type === 'boolean') {
      return responseValue ? 100 : 0;
    }

    if (question.type === 'select' && question.options) {
      const option = question.options.find((opt: any) => opt.value === responseValue);
      return option?.score || 0;
    }

    if (question.type === 'number' && question.maxValue) {
      return Math.min(100, (responseValue / question.maxValue) * 100);
    }

    return 0;
  }

  private calculateBiologicalAge(
    formula: any,
    responses: Record<string, any>,
    categoryScores: Record<string, number>,
  ): { biologicalAge?: number; chronologicalAge?: number } {
    // Get chronological age from responses
    const chronologicalAge = responses.chronological_age || responses.age;

    if (!chronologicalAge) {
      return {};
    }

    // Simple biological age calculation based on wellness scores
    // This is a simplified model; real implementations would use more sophisticated algorithms
    const baselineAdjustment = formula.baselineAdjustment || 0;
    const scoreWeight = formula.scoreWeight || 0.1;

    // Calculate average wellness score (0-100)
    const avgScore = Object.values(categoryScores).reduce((a: number, b: number) => a + b, 0) /
      Math.max(1, Object.values(categoryScores).length);

    // Higher scores = younger biological age
    // 50 is the baseline (no adjustment)
    const scoreAdjustment = (avgScore - 50) * scoreWeight;
    const biologicalAge = Math.round(chronologicalAge - scoreAdjustment + baselineAdjustment);

    return {
      biologicalAge: Math.max(0, biologicalAge),
      chronologicalAge: Math.round(chronologicalAge),
    };
  }

  /**
   * Record score history for trend tracking
   */
  async recordScoreHistory(
    tenantId: string,
    patientId: string,
    assessmentId: string,
    scores: ScoreResult,
  ): Promise<void> {
    const records: any[] = [];

    // Record overall score
    records.push({
      tenantId,
      patientId,
      assessmentId,
      scoreType: 'overall',
      scoreValue: scores.overallScore,
      source: 'assessment',
    });

    // Record category scores
    for (const [category, score] of Object.entries(scores.categoryScores)) {
      records.push({
        tenantId,
        patientId,
        assessmentId,
        scoreType: category,
        scoreValue: score,
        source: 'assessment',
      });
    }

    // Record biological age if present
    if (scores.biologicalAge !== undefined) {
      records.push({
        tenantId,
        patientId,
        assessmentId,
        scoreType: 'biological_age',
        scoreValue: scores.biologicalAge,
        source: 'assessment',
        metadata: { chronologicalAge: scores.chronologicalAge },
      });
    }

    await this.prisma.wellnessScoreHistory.createMany({
      data: records,
    });
  }

  /**
   * Get score trends for a patient
   */
  async getScoreTrends(
    tenantId: string,
    patientId: string,
    scoreType: string,
    options?: { startDate?: Date; endDate?: Date; limit?: number },
  ) {
    const where: any = { tenantId, patientId, scoreType };

    if (options?.startDate || options?.endDate) {
      where.recordedAt = {};
      if (options.startDate) where.recordedAt.gte = options.startDate;
      if (options.endDate) where.recordedAt.lte = options.endDate;
    }

    const history = await this.prisma.wellnessScoreHistory.findMany({
      where,
      orderBy: { recordedAt: 'asc' },
      ...(options?.limit && { take: options.limit }),
    });

    // Calculate trend analysis
    if (history.length < 2) {
      return {
        data: history,
        trend: 'insufficient_data',
        changePercent: null,
      };
    }

    const firstScore = Number(history[0]!.scoreValue);
    const lastScore = Number(history[history.length - 1]!.scoreValue);
    const changePercent = ((lastScore - firstScore) / firstScore) * 100;

    let trend: string;
    if (changePercent > 5) {
      trend = 'improving';
    } else if (changePercent < -5) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    return {
      data: history,
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  }
}
