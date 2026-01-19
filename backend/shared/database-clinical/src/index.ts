export { PrismaClient } from '../generated';
export type { Prisma } from '../generated';
export { ZealPrismaClient, prisma } from './client';
export { PrismaService } from './prisma.service';
export { ClinicalDatabaseModule } from './database.module';

// Export Inpatient enums
export {
  InpatientAdmissionStatus,
  InpatientDischargeStatus,
  InpatientAcuity,
  InpatientEventType,
} from '../generated';

// Export Care Channel enums
export {
  ChannelStatus,
  CareTeamRole,
  MessageType,
  MessageVisibility,
  MessagePriority,
} from '../generated';

// Export Checklist enums
export {
  ChecklistCategory,
  ChecklistTemplateStatus,
  ChecklistItemType,
  ChecklistInstanceStatus,
  ChecklistContext,
} from '../generated';

// Export Discharge Transaction enums
export {
  DischargeTransactionStatus,
  DischargeType,
  DischargeDestination,
} from '../generated';
