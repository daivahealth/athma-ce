export type SmartChartingBlockType =
  | 'chiefHpi'
  | 'history'
  | 'notes'
  | 'diagnosis'
  | 'orders'
  | 'prescription';

export interface SmartChartingBlock {
  id: string;
  type: SmartChartingBlockType;
  header: string;
  content?: string;
}

export interface SmartChartingStorageFormat {
  version: string;
  editorType: 'smart-charting';
  noteType: 'smart-charting';
  tiptapJson: Record<string, unknown>;
  blocks: SmartChartingBlock[];
}

export interface SlashCommandItem {
  id: SmartChartingBlockType;
  title: string;
  description: string;
  icon: string;
}

export interface SmartChartingEditorProps {
  encounterId: string;
  patientId: string;
  authorStaffId: string;
}

export const BLOCK_HEADERS: Record<SmartChartingBlockType, string> = {
  chiefHpi: 'Chief Complaints and HPI',
  history: 'History',
  notes: 'Notes',
  diagnosis: 'Diagnosis',
  orders: 'Orders',
  prescription: 'Prescription',
};

export const TEXT_BLOCK_TYPES: SmartChartingBlockType[] = ['chiefHpi', 'history', 'notes'];
export const TRANSACTION_BLOCK_TYPES: SmartChartingBlockType[] = ['diagnosis', 'orders', 'prescription'];

export const isTextBlockType = (type: SmartChartingBlockType): boolean =>
  TEXT_BLOCK_TYPES.includes(type);

export const isTransactionBlockType = (type: SmartChartingBlockType): boolean =>
  TRANSACTION_BLOCK_TYPES.includes(type);

// Different colors for each block type's left border
export const BLOCK_COLORS: Record<SmartChartingBlockType, string> = {
  chiefHpi: 'border-l-blue-500',
  history: 'border-l-amber-500',
  notes: 'border-l-slate-400',
  diagnosis: 'border-l-rose-500',
  orders: 'border-l-primary',
  prescription: 'border-l-emerald-500',
};
