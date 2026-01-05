/**
 * Admission Number Generator Service
 *
 * Generates unique admission numbers in format: ADM-YYYY-NNNNN
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

@Injectable()
export class AdmissionNumberGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate unique admission number
   * Format: ADM-YYYY-NNNNN (e.g., ADM-2026-00123)
   */
  async generateAdmissionNumber(params: {
    tenantId: string;
    facilityId: string;
  }): Promise<string> {
    const { tenantId, facilityId } = params;

    const currentYear = new Date().getFullYear();
    const prefix = `ADM-${currentYear}-`;

    // Get the latest admission number for this year and facility
    const latestAdmission = await this.prisma.inpatientAdmission.findFirst({
      where: {
        tenantId,
        facilityId,
        admissionNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        admissionNumber: 'desc',
      },
    });

    let sequenceNumber = 1;

    if (latestAdmission) {
      // Extract sequence number from last admission number
      const lastNumber = latestAdmission.admissionNumber;
      const parts = lastNumber.split('-');
      if (parts.length >= 3 && parts[2]) {
        const lastSequence = parseInt(parts[2], 10);
        if (!isNaN(lastSequence)) {
          sequenceNumber = lastSequence + 1;
        }
      }
    }

    // Pad with zeros to 5 digits
    const paddedSequence = sequenceNumber.toString().padStart(5, '0');

    return `${prefix}${paddedSequence}`;
  }
}
