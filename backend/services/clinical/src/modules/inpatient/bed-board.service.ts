/**
 * Bed Board Service
 *
 * Business logic for bed board view
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

@Injectable()
export class BedBoardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get bed board for a ward
   * Returns real-time bed status with patient admissions
   */
  async getWardBedBoard(
    wardId: string,
    tenantId: string,
    includeDischargedToday: boolean = false
  ) {
    // TODO: Call Foundation API to get ward details and beds
    // For now, we'll return clinical data and mock the Foundation data structure

    // Get all active admissions in this ward
    const admissions = await this.prisma.inpatientAdmission.findMany({
      where: {
        tenantId,
        currentWardId: wardId,
        status: includeDischargedToday ? { in: ['admitted', 'discharged'] } : 'admitted',
        ...(includeDischargedToday && {
          actualDischargeDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        }),
      },
      include: {
        bedAssignments: {
          where: { releasedAt: null },
          take: 1,
        },
      },
    });

    // Group admissions by bed ID
    const bedAdmissions = new Map<string, any>();
    admissions.forEach((admission) => {
      if (admission.currentBedId) {
        bedAdmissions.set(admission.currentBedId, admission);
      }
    });

    // Calculate summary statistics
    const summary = {
      totalPatients: admissions.filter((a) => a.status === 'admitted').length,
      criticalPatients: admissions.filter((a) =>
        a.clinicalAlerts.includes('critical')
      ).length,
      isolationPatients: admissions.filter((a) =>
        a.clinicalAlerts.includes('isolation')
      ).length,
      vitalsOverdue: admissions.filter((a) => {
        if (!a.nextVitalsAt) return false;
        return new Date(a.nextVitalsAt) < new Date();
      }).length,
      pendingDischarges: admissions.filter(
        (a) =>
          a.expectedDischargeDate &&
          new Date(a.expectedDischargeDate).toDateString() ===
            new Date().toDateString()
      ).length,
    };

    // TODO: Replace with actual Foundation API call
    // This is mock data structure for beds
    const wardData = {
      id: wardId,
      wardCode: 'WARD-01',
      wardName: 'General Ward',
      wardType: 'general',
      totalBeds: 20,
      occupiedBeds: bedAdmissions.size,
      availableBeds: 20 - bedAdmissions.size,
      maintenanceBeds: 0,
    };

    return {
      ward: wardData,
      beds: [], // Will be populated by Foundation API
      admissions: Array.from(bedAdmissions.values()),
      summary,
    };
  }

  /**
   * Get ward dashboard data
   * Returns census, pending orders, vitals due, etc.
   */
  async getWardDashboard(wardId: string, tenantId: string) {
    const now = new Date();

    // Get all active admissions in ward
    const admissions = await this.prisma.inpatientAdmission.findMany({
      where: {
        tenantId,
        currentWardId: wardId,
        status: 'admitted',
      },
    });

    // Vitals overdue
    const vitalsOverdue = admissions.filter((a) => {
      if (!a.nextVitalsAt) return false;
      return new Date(a.nextVitalsAt) < now;
    });

    // Expected discharges today
    const dischargesDueToday = admissions.filter((a) => {
      if (!a.expectedDischargeDate) return false;
      const expectedDate = new Date(a.expectedDischargeDate);
      return expectedDate.toDateString() === now.toDateString();
    });

    // New admissions today
    const today = new Date(now.setHours(0, 0, 0, 0));
    const newAdmissionsToday = admissions.filter((a) => {
      return new Date(a.admissionDate) >= today;
    });

    // Alerts summary
    const alertsSummary = {
      critical: admissions.filter((a) => a.clinicalAlerts.includes('critical')).length,
      isolation: admissions.filter((a) => a.clinicalAlerts.includes('isolation')).length,
      fall_risk: admissions.filter((a) => a.clinicalAlerts.includes('fall_risk')).length,
      npo: admissions.filter((a) => a.clinicalAlerts.includes('npo')).length,
    };

    return {
      wardId,
      census: {
        totalPatients: admissions.length,
        newAdmissionsToday: newAdmissionsToday.length,
        dischargesDueToday: dischargesDueToday.length,
      },
      vitals: {
        overdue: vitalsOverdue.length,
        dueWithinHour: admissions.filter((a) => {
          if (!a.nextVitalsAt) return false;
          const nextVitals = new Date(a.nextVitalsAt);
          const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
          return nextVitals <= oneHourFromNow && nextVitals >= now;
        }).length,
      },
      alerts: alertsSummary,
      patients: admissions.map((a) => ({
        admissionId: a.id,
        patientId: a.patientId,
        admissionNumber: a.admissionNumber,
        bedId: a.currentBedId,
        clinicalAlerts: a.clinicalAlerts,
        nextVitalsAt: a.nextVitalsAt,
        vitalsOverdue: a.nextVitalsAt ? new Date(a.nextVitalsAt) < now : false,
      })),
    };
  }
}
