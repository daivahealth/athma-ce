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
