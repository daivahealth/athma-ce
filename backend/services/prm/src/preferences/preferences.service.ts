/**
 * Preferences Service
 * Patient communication preferences
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PreferencesService {

  constructor(private prisma: PrismaService) {}

  /**
   * Get or create patient preferences
   */
  async findOrCreate(tenantId: string, patientId: string) {
    let prefs = await this.prisma.patientPreference.findUnique({
      where: {
        idx_prefs_tenant_patient: {
          tenantId,
          patientId,
        },
      },
    });

    if (!prefs) {
      prefs = await this.prisma.patientPreference.create({
        data: {
          tenantId,
          patientId,
          preferredLanguage: 'en',
          channelOrder: ['sms', 'email', 'whatsapp', 'in_app'],
          timezone: 'UTC',
        },
      });
    }

    return prefs;
  }

  /**
   * Update patient preferences
   */
  async update(tenantId: string, patientId: string, data: any) {
    return this.prisma.patientPreference.upsert({
      where: {
        idx_prefs_tenant_patient: {
          tenantId,
          patientId,
        },
      },
      update: data,
      create: {
        tenantId,
        patientId,
        ...data,
      },
    });
  }
}
