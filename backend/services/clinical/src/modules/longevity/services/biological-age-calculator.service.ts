import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

export interface BiologicalAgeResult {
  chronologicalAge: number;
  biologicalAge: number;
  ageGap: number; // positive = older than chronological age
  healthScore: number; // 0-100
  categoryBreakdown: Record<string, {
    score: number;
    impact: number; // years added/subtracted
    status: 'optimal' | 'good' | 'fair' | 'poor';
  }>;
  recommendations: string[];
}

@Injectable()
export class BiologicalAgeCalculatorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate biological age based on biomarkers, assessments, and lifestyle factors
   */
  async calculateBiologicalAge(
    tenantId: string,
    patientId: string,
  ): Promise<BiologicalAgeResult> {
    // Get patient info
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, tenantId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const chronologicalAge = this.calculateChronologicalAge(patient.dateOfBirth);

    // Get latest biomarker results
    const biomarkers = await this.prisma.biomarkerResult.findMany({
      where: { tenantId, patientId },
      orderBy: { collectedAt: 'desc' },
      distinct: ['biomarkerId'],
      include: {
        biomarker: true,
      },
    });

    // Get latest wellness assessment
    const latestAssessment = await this.prisma.wellnessAssessment.findFirst({
      where: { tenantId, patientId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
    });

    // Calculate category scores
    const categoryBreakdown: BiologicalAgeResult['categoryBreakdown'] = {};
    const recommendations: string[] = [];

    // Cardiovascular health
    const cardioScore = this.calculateCardiovascularScore(biomarkers);
    categoryBreakdown['cardiovascular'] = {
      score: cardioScore.score,
      impact: cardioScore.impact,
      status: this.getStatus(cardioScore.score),
    };
    recommendations.push(...cardioScore.recommendations);

    // Metabolic health
    const metabolicScore = this.calculateMetabolicScore(biomarkers);
    categoryBreakdown['metabolic'] = {
      score: metabolicScore.score,
      impact: metabolicScore.impact,
      status: this.getStatus(metabolicScore.score),
    };
    recommendations.push(...metabolicScore.recommendations);

    // Inflammatory markers
    const inflammatoryScore = this.calculateInflammatoryScore(biomarkers);
    categoryBreakdown['inflammatory'] = {
      score: inflammatoryScore.score,
      impact: inflammatoryScore.impact,
      status: this.getStatus(inflammatoryScore.score),
    };
    recommendations.push(...inflammatoryScore.recommendations);

    // Hormonal balance
    const hormonalScore = this.calculateHormonalScore(biomarkers, patient.gender);
    categoryBreakdown['hormonal'] = {
      score: hormonalScore.score,
      impact: hormonalScore.impact,
      status: this.getStatus(hormonalScore.score),
    };
    recommendations.push(...hormonalScore.recommendations);

    // Lifestyle factors (from assessment)
    const lifestyleScore = this.calculateLifestyleScore(latestAssessment);
    categoryBreakdown['lifestyle'] = {
      score: lifestyleScore.score,
      impact: lifestyleScore.impact,
      status: this.getStatus(lifestyleScore.score),
    };
    recommendations.push(...lifestyleScore.recommendations);

    // Calculate overall biological age
    const totalImpact = Object.values(categoryBreakdown).reduce(
      (sum, cat) => sum + cat.impact,
      0,
    );
    const biologicalAge = Math.round(chronologicalAge + totalImpact);
    const ageGap = biologicalAge - chronologicalAge;

    // Calculate overall health score
    const avgScore =
      Object.values(categoryBreakdown).reduce((sum, cat) => sum + cat.score, 0) /
      Object.keys(categoryBreakdown).length;
    const healthScore = Math.round(avgScore);

    return {
      chronologicalAge,
      biologicalAge: Math.max(0, biologicalAge),
      ageGap,
      healthScore,
      categoryBreakdown,
      recommendations: [...new Set(recommendations)].slice(0, 5), // Dedupe and limit
    };
  }

  private calculateChronologicalAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private calculateCardiovascularScore(biomarkers: any[]): {
    score: number;
    impact: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let totalScore = 0;
    let count = 0;

    // Check key cardiovascular biomarkers
    const hdl = this.findBiomarkerByCode(biomarkers, ['HDL', 'hdl_cholesterol']);
    const ldl = this.findBiomarkerByCode(biomarkers, ['LDL', 'ldl_cholesterol']);
    const triglycerides = this.findBiomarkerByCode(biomarkers, ['TG', 'triglycerides']);
    const bp = this.findBiomarkerByCode(biomarkers, ['BP_SYSTOLIC', 'systolic_bp']);

    if (hdl) {
      const hdlScore = this.scoreHDL(Number(hdl.value));
      totalScore += hdlScore;
      count++;
      if (hdlScore < 60) recommendations.push('Increase HDL through exercise and omega-3 fatty acids');
    }

    if (ldl) {
      const ldlScore = this.scoreLDL(Number(ldl.value));
      totalScore += ldlScore;
      count++;
      if (ldlScore < 60) recommendations.push('Lower LDL through diet modifications and exercise');
    }

    if (triglycerides) {
      const tgScore = this.scoreTriglycerides(Number(triglycerides.value));
      totalScore += tgScore;
      count++;
      if (tgScore < 60) recommendations.push('Reduce triglycerides by limiting sugar and refined carbs');
    }

    if (bp) {
      const bpScore = this.scoreBloodPressure(Number(bp.value));
      totalScore += bpScore;
      count++;
      if (bpScore < 60) recommendations.push('Manage blood pressure through stress reduction and sodium intake');
    }

    const score = count > 0 ? totalScore / count : 70; // Default to 70 if no data
    const impact = this.scoreToImpact(score);

    return { score: Math.round(score), impact, recommendations };
  }

  private calculateMetabolicScore(biomarkers: any[]): {
    score: number;
    impact: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let totalScore = 0;
    let count = 0;

    const glucose = this.findBiomarkerByCode(biomarkers, ['GLUCOSE', 'fasting_glucose']);
    const hba1c = this.findBiomarkerByCode(biomarkers, ['HBA1C', 'hba1c']);
    const insulin = this.findBiomarkerByCode(biomarkers, ['INSULIN', 'fasting_insulin']);

    if (glucose) {
      const glucoseScore = this.scoreGlucose(Number(glucose.value));
      totalScore += glucoseScore;
      count++;
      if (glucoseScore < 60) recommendations.push('Optimize glucose through intermittent fasting and exercise');
    }

    if (hba1c) {
      const hba1cScore = this.scoreHbA1c(Number(hba1c.value));
      totalScore += hba1cScore;
      count++;
      if (hba1cScore < 60) recommendations.push('Lower HbA1c through dietary changes and regular monitoring');
    }

    if (insulin) {
      const insulinScore = this.scoreInsulin(Number(insulin.value));
      totalScore += insulinScore;
      count++;
      if (insulinScore < 60) recommendations.push('Improve insulin sensitivity through strength training');
    }

    const score = count > 0 ? totalScore / count : 70;
    const impact = this.scoreToImpact(score);

    return { score: Math.round(score), impact, recommendations };
  }

  private calculateInflammatoryScore(biomarkers: any[]): {
    score: number;
    impact: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let totalScore = 0;
    let count = 0;

    const crp = this.findBiomarkerByCode(biomarkers, ['CRP', 'hs_crp']);
    const homocysteine = this.findBiomarkerByCode(biomarkers, ['HOMOCYSTEINE']);
    const esr = this.findBiomarkerByCode(biomarkers, ['ESR']);

    if (crp) {
      const crpScore = this.scoreCRP(Number(crp.value));
      totalScore += crpScore;
      count++;
      if (crpScore < 60) recommendations.push('Reduce inflammation through anti-inflammatory diet');
    }

    if (homocysteine) {
      const hcyScore = this.scoreHomocysteine(Number(homocysteine.value));
      totalScore += hcyScore;
      count++;
      if (hcyScore < 60) recommendations.push('Lower homocysteine with B vitamins (B12, B6, folate)');
    }

    const score = count > 0 ? totalScore / count : 70;
    const impact = this.scoreToImpact(score);

    return { score: Math.round(score), impact, recommendations };
  }

  private calculateHormonalScore(biomarkers: any[], gender: string): {
    score: number;
    impact: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let totalScore = 0;
    let count = 0;

    const dhea = this.findBiomarkerByCode(biomarkers, ['DHEA', 'dhea_s']);
    const cortisol = this.findBiomarkerByCode(biomarkers, ['CORTISOL']);
    const thyroid = this.findBiomarkerByCode(biomarkers, ['TSH', 'tsh']);

    if (dhea) {
      const dheaScore = this.scoreDHEA(Number(dhea.value));
      totalScore += dheaScore;
      count++;
      if (dheaScore < 60) recommendations.push('Optimize DHEA levels with stress management and sleep');
    }

    if (cortisol) {
      const cortisolScore = this.scoreCortisol(Number(cortisol.value));
      totalScore += cortisolScore;
      count++;
      if (cortisolScore < 60) recommendations.push('Balance cortisol through stress reduction techniques');
    }

    if (thyroid) {
      const thyroidScore = this.scoreThyroid(Number(thyroid.value));
      totalScore += thyroidScore;
      count++;
      if (thyroidScore < 60) recommendations.push('Discuss thyroid optimization with your healthcare provider');
    }

    const score = count > 0 ? totalScore / count : 70;
    const impact = this.scoreToImpact(score);

    return { score: Math.round(score), impact, recommendations };
  }

  private calculateLifestyleScore(assessment: any): {
    score: number;
    impact: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    if (!assessment || !assessment.categoryScores) {
      return {
        score: 70,
        impact: 0,
        recommendations: ['Complete a wellness assessment for personalized recommendations'],
      };
    }

    const categoryScores = assessment.categoryScores as Record<string, number>;
    const avgScore =
      Object.values(categoryScores).reduce((a, b) => a + b, 0) /
      Math.max(1, Object.values(categoryScores).length);

    if (avgScore < 60) {
      recommendations.push('Focus on improving overall lifestyle factors');
    }

    const impact = this.scoreToImpact(avgScore);

    return { score: Math.round(avgScore), impact, recommendations };
  }

  // Helper methods for scoring individual biomarkers
  private findBiomarkerByCode(biomarkers: any[], codes: string[]): any | null {
    return biomarkers.find((b) =>
      codes.some((code) => b.biomarker.code.toUpperCase() === code.toUpperCase()),
    );
  }

  private scoreToImpact(score: number): number {
    // Convert score (0-100) to age impact (-5 to +5 years)
    // Score 50 = neutral, higher = younger, lower = older
    return Math.round(((50 - score) / 10) * 10) / 10;
  }

  private getStatus(score: number): 'optimal' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'optimal';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  // Scoring functions for specific biomarkers (simplified examples)
  private scoreHDL(value: number): number {
    if (value >= 60) return 100;
    if (value >= 50) return 80;
    if (value >= 40) return 60;
    return 40;
  }

  private scoreLDL(value: number): number {
    if (value < 70) return 100;
    if (value < 100) return 80;
    if (value < 130) return 60;
    return 40;
  }

  private scoreTriglycerides(value: number): number {
    if (value < 100) return 100;
    if (value < 150) return 80;
    if (value < 200) return 60;
    return 40;
  }

  private scoreBloodPressure(value: number): number {
    if (value < 120) return 100;
    if (value < 130) return 80;
    if (value < 140) return 60;
    return 40;
  }

  private scoreGlucose(value: number): number {
    if (value >= 70 && value <= 90) return 100;
    if (value >= 65 && value <= 99) return 80;
    if (value >= 100 && value <= 125) return 60;
    return 40;
  }

  private scoreHbA1c(value: number): number {
    if (value < 5.4) return 100;
    if (value < 5.7) return 80;
    if (value < 6.4) return 60;
    return 40;
  }

  private scoreInsulin(value: number): number {
    if (value >= 2 && value <= 5) return 100;
    if (value <= 10) return 80;
    if (value <= 15) return 60;
    return 40;
  }

  private scoreCRP(value: number): number {
    if (value < 0.5) return 100;
    if (value < 1.0) return 80;
    if (value < 3.0) return 60;
    return 40;
  }

  private scoreHomocysteine(value: number): number {
    if (value < 7) return 100;
    if (value < 10) return 80;
    if (value < 15) return 60;
    return 40;
  }

  private scoreDHEA(value: number): number {
    // Scoring depends on age, simplified here
    if (value >= 300) return 100;
    if (value >= 200) return 80;
    if (value >= 100) return 60;
    return 40;
  }

  private scoreCortisol(value: number): number {
    // Morning cortisol (10-20 mcg/dL is optimal)
    if (value >= 10 && value <= 20) return 100;
    if (value >= 6 && value <= 25) return 80;
    return 60;
  }

  private scoreThyroid(value: number): number {
    // TSH (0.5-2.0 is optimal for longevity)
    if (value >= 0.5 && value <= 2.0) return 100;
    if (value >= 0.4 && value <= 4.0) return 80;
    return 60;
  }
}
