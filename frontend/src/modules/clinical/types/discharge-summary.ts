export type DischargeSummaryStatus = 'DRAFT' | 'IN_REVIEW' | 'FINAL' | 'SIGNED' | 'VOID';

export interface DischargeSummaryVersion {
  id: string;
  dischargeSummaryId: string;
  versionNo: number;
  data: Record<string, unknown>;
  changeReason?: string | null;
  createdAt: string;
  createdBy: string;
  amendedFromVersionId?: string | null;
}

export interface DischargeSummary {
  id: string;
  admissionId: string;
  encounterId: string;
  patientId: string;
  status: DischargeSummaryStatus | string;
  currentVersionId?: string | null;
  initiatedAt?: string | null;
  initiatedBy?: string | null;
  finalizedAt?: string | null;
  finalizedBy?: string | null;
  signedAt?: string | null;
  signedBy?: string | null;
  isLocked?: boolean;
  currentVersion?: DischargeSummaryVersion | null;
}
