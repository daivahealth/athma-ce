/**
 * Bed Board Service (Ward Board)
 *
 * Business logic for ward board view with real-time bed status
 * Uses new orthogonal status model for accurate patient state
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientAcuity,
} from './dto/create-event.dto';
import {
  WardBoardResponse,
  WardBoardBed,
  WardBoardAdmission,
  WardBoardSummary,
  PatientDisplay,
} from './dto/ward-board.dto';

interface BedMasterData {
  id: string;
  bedNumber: string;
  bedType: string;
  status: string;
  features: any;
  ward: {
    id: string;
    name: string;
    wardType: string;
  };
}

interface WardMasterData {
  id: string;
  code: string;
  name: string;
  wardType: string;
  totalBeds: number;
  floorNumber: string;
  beds: BedMasterData[];
}

@Injectable()
export class BedBoardService {
  private readonly logger = new Logger(BedBoardService.name);
  private readonly foundationApi: AxiosInstance;

  constructor(private readonly prisma: PrismaService) {
    const foundationServiceUrl = process.env.FOUNDATION_SERVICE_URL || 'http://localhost:3010';

    this.foundationApi = axios.create({
      baseURL: `${foundationServiceUrl}/api/v1`,
      timeout: 10000,
    });

    this.logger.log(`Foundation API client initialized: ${foundationServiceUrl}`);
  }

  /**
   * Get ward board for a ward (production-ready with new status model)
   * Returns real-time bed status with patient admissions
   */
  async getWardBedBoard(
    facilityId: string,
    wardId: string,
    tenantId: string,
    options?: {
      includeDischargedToday?: boolean;
      statusFilter?: InpatientAdmissionStatus[];
      acuityFilter?: InpatientAcuity[];
    }
  ): Promise<WardBoardResponse> {
    try {
      // 1. Fetch ward and beds from Foundation API
      const wardResponse = await this.foundationApi.get<WardMasterData>(
        `/wards/${wardId}`,
        {
          headers: {
            'x-tenant-id': tenantId,
            'x-facility-id': facilityId,
          },
        }
      );
      const wardData = wardResponse.data;

      // 2. Build admission query criteria
      const activeStatuses: InpatientAdmissionStatus[] = [
        InpatientAdmissionStatus.ADMITTED,
        InpatientAdmissionStatus.ACTIVE,
        InpatientAdmissionStatus.ON_LEAVE,
        InpatientAdmissionStatus.DISCHARGE_PLANNING,
      ];

      const statusFilter = options?.statusFilter || activeStatuses;

      // 3. Get all active admissions in this ward
      const admissions = await this.prisma.inpatientAdmission.findMany({
        where: {
          tenantId,
          facilityId,
          currentWardId: wardId,
          admissionStatus: {
            in: statusFilter,
          },
          ...(options?.acuityFilter && {
            acuity: { in: options.acuityFilter },
          }),
          ...(options?.includeDischargedToday && {
            OR: [
              { admissionStatus: { in: statusFilter } },
              {
                admissionStatus: InpatientAdmissionStatus.DISCHARGED,
                actualDischargeDate: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
            ],
          }),
        },
      });

      // 4. Get bed IDs for efficient querying
      const bedIds = wardData.beds.map((b) => b.id);

      // 5. Get recent bed assignments for cleaning status
      const recentAssignments = await this.prisma.bedAssignment.findMany({
        where: {
          tenantId,
          wardId,
          bedId: { in: bedIds },
        },
        orderBy: {
          assignedAt: 'desc',
        },
        take: bedIds.length * 2, // Get latest 2 per bed
      });

      // Group assignments by bedId (most recent first)
      const assignmentsByBed = new Map<string, any>();
      recentAssignments.forEach((assignment) => {
        if (!assignmentsByBed.has(assignment.bedId)) {
          assignmentsByBed.set(assignment.bedId, assignment);
        }
      });

      // 6. Group admissions by bed ID
      const bedAdmissions = new Map<string, any>();
      admissions.forEach((admission) => {
        if (admission.currentBedId) {
          bedAdmissions.set(admission.currentBedId, admission);
        }
      });

      // 7. TODO: Fetch patient details from Patient service (when available)
      // For now, we'll use placeholder logic
      const getPatientDisplay = (admission: any): PatientDisplay => {
        // In production, fetch from Patient service via API
        return {
          name: `Patient ${admission.patientId.substring(0, 8)}`,
          age: 0, // TODO: Calculate from DOB
          sex: 'U', // TODO: Get from patient data
        };
      };

      // 8. Build WardBoardBed array
      const beds: WardBoardBed[] = wardData.beds.map((bed) => {
        const admission = bedAdmissions.get(bed.id);
        const latestAssignment = assignmentsByBed.get(bed.id);

        // Determine occupancy status
        let occupancy: 'occupied' | 'empty' | 'cleaning' | 'reserved' = 'empty';

        if (bed.status === 'maintenance') {
          // Bed is under maintenance (from Foundation)
          occupancy = 'reserved'; // Or could be 'maintenance'
        } else if (admission) {
          occupancy = 'occupied';
        } else if (
          latestAssignment &&
          latestAssignment.cleaningRequired &&
          !latestAssignment.cleaningCompletedAt
        ) {
          occupancy = 'cleaning';
        }

        // Build bed object
        const bedObj: WardBoardBed = {
          bed: {
            id: bed.id,
            code: bed.bedNumber,
            spaceName: bed.ward?.name, // TODO: Get space/room name from Foundation
          },
          occupancy,
          actions: admission ? ['TRANSFER', 'MEDS', 'DETAILS'] : ['ADMIT_PATIENT'],
        };

        // Add admission details if occupied
        if (admission && occupancy === 'occupied') {
          const wardBoardAdmission: WardBoardAdmission = {
            admissionId: admission.id,
            encounterId: admission.encounterId,
            patientId: admission.patientId,
            patientDisplay: getPatientDisplay(admission),
            attendingPhysicianId: admission.attendingPhysicianId,
            admissionStatus: admission.admissionStatus,
            dischargeStatus: admission.dischargeStatus,
            acuity: admission.acuity,
            boardFlags: admission.boardFlags || undefined,
            admittedAt: admission.admissionDate,
            expectedDischargeDate: admission.expectedDischargeDate || undefined,
          };

          bedObj.admission = wardBoardAdmission;
        }

        return bedObj;
      });

      // 9. Calculate summary statistics using new status model
      const summary: WardBoardSummary = {
        totalBeds: wardData.beds.length,
        occupied: beds.filter((b) => b.occupancy === 'occupied').length,
        empty: beds.filter((b) => b.occupancy === 'empty').length,
        cleaning: beds.filter((b) => b.occupancy === 'cleaning').length,
        reserved: beds.filter((b) => b.occupancy === 'reserved').length,
        critical: admissions.filter((a) => a.acuity === InpatientAcuity.CRITICAL).length,
        pendingDischarge: admissions.filter((a) =>
          [
            InpatientDischargeStatus.FIT_FOR_DISCHARGE,
            InpatientDischargeStatus.INITIATED,
            InpatientDischargeStatus.READY,
          ].includes(a.dischargeStatus)
        ).length,
      };

      // 10. Build final response
      const response: WardBoardResponse = {
        ward: {
          id: wardData.id,
          name: wardData.name,
          code: wardData.code,
        },
        summary,
        beds,
      };

      this.logger.log(
        `Ward board loaded: ${wardData.name}, ${summary.occupied}/${summary.totalBeds} beds occupied`
      );

      return response;
    } catch (error: unknown) {
      this.logger.error(`Error getting bed board: ${error}`);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(`Foundation API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      }
      throw error;
    }
  }

  /**
   * Get ward dashboard data (updated for new status model)
   * Returns census, pending orders, vitals due, etc.
   */
  async getWardDashboard(wardId: string, facilityId: string, tenantId: string) {
    const now = new Date();

    // Get all active admissions in ward
    const admissions = await this.prisma.inpatientAdmission.findMany({
      where: {
        tenantId,
        facilityId,
        currentWardId: wardId,
        admissionStatus: {
          in: [
            InpatientAdmissionStatus.ADMITTED,
            InpatientAdmissionStatus.ACTIVE,
            InpatientAdmissionStatus.ON_LEAVE,
            InpatientAdmissionStatus.DISCHARGE_PLANNING,
          ],
        },
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

    // Alerts summary using new acuity and boardFlags
    const alertsSummary = {
      critical: admissions.filter((a) => a.acuity === InpatientAcuity.CRITICAL).length,
      watch: admissions.filter((a) => a.acuity === InpatientAcuity.WATCH).length,
      isolation: admissions.filter((a) => {
        const flags = a.boardFlags as any;
        return flags?.isolation === true;
      }).length,
      fallRisk: admissions.filter((a) => {
        const flags = a.boardFlags as any;
        return flags?.fallRisk === 'high' || flags?.fallRisk === 'medium';
      }).length,
      npo: admissions.filter((a) => {
        const flags = a.boardFlags as any;
        return flags?.npo === true;
      }).length,
    };

    // Discharge workflow summary
    const dischargeWorkflow = {
      fitForDischarge: admissions.filter(
        (a) => a.dischargeStatus === InpatientDischargeStatus.FIT_FOR_DISCHARGE
      ).length,
      initiated: admissions.filter(
        (a) => a.dischargeStatus === InpatientDischargeStatus.INITIATED
      ).length,
      ready: admissions.filter(
        (a) => a.dischargeStatus === InpatientDischargeStatus.READY
      ).length,
    };

    return {
      wardId,
      facilityId,
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
      discharge: dischargeWorkflow,
      patients: admissions.map((a) => ({
        admissionId: a.id,
        patientId: a.patientId,
        admissionNumber: a.admissionNumber,
        bedId: a.currentBedId,
        admissionStatus: a.admissionStatus,
        dischargeStatus: a.dischargeStatus,
        acuity: a.acuity,
        boardFlags: a.boardFlags,
        nextVitalsAt: a.nextVitalsAt,
        vitalsOverdue: a.nextVitalsAt ? new Date(a.nextVitalsAt) < now : false,
      })),
    };
  }
}
