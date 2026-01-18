export type ChannelStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export type CareTeamRole =
  | 'ATTENDING_PHYSICIAN'
  | 'RESIDENT_PHYSICIAN'
  | 'CONSULTING_PHYSICIAN'
  | 'PRIMARY_NURSE'
  | 'CHARGE_NURSE'
  | 'STAFF_NURSE'
  | 'PHARMACIST'
  | 'CASE_MANAGER'
  | 'RESPIRATORY_THERAPIST'
  | 'PHYSICAL_THERAPIST'
  | 'DIETITIAN'
  | 'OTHER';

export type MessageType = 'TEXT' | 'SYSTEM' | 'CLINICAL_EVENT' | 'CHECKLIST' | 'TASK' | 'ALERT' | 'ATTACHMENT';
export type MessageVisibility = 'CARE_TEAM' | 'NURSING_ONLY' | 'DOCTORS_ONLY';
export type MessagePriority = 'NORMAL' | 'HIGH' | 'URGENT';

export interface CareChannel {
  id: string;
  tenantId?: string;
  facilityId?: string;
  admissionId: string;
  patientId?: string;
  encounterId?: string;
  channelName?: string;
  status: ChannelStatus;
  activatedAt?: string;
  closedAt?: string | null;
  closedBy?: string | null;
  closureReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareChannelMember {
  id: string;
  channelId: string;
  staffId: string;
  memberRole: CareTeamRole;
  addedAt: string;
  removedAt?: string | null;
  addedBy?: string | null;
  removedBy?: string | null;
  removalReason?: string | null;
  notificationsEnabled?: boolean;
  staff?: {
    id: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    staffType?: string;
  } | null;
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  messageType: MessageType;
  messageSubtype?: string | null;
  bodyText?: string | null;
  payloadJson?: Record<string, unknown> | null;
  linkedEntityType?: string | null;
  linkedEntityId?: string | null;
  checklistInstanceId?: string | null;
  visibility?: MessageVisibility;
  priority?: MessagePriority;
  authorStaffId?: string | null;
  isSystemMessage?: boolean;
  createdAt?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  author?: {
    id: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

export interface ChannelTimelineResponse {
  data: ChannelMessage[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PostChannelMessageInput {
  bodyText: string;
  priority?: MessagePriority;
}
