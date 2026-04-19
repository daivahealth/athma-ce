export enum PharmacyStockStatus {
  ACTIVE = 'active',
  QUARANTINED = 'quarantined',
  EXPIRED = 'expired',
  DEPLETED = 'depleted',
  RECALLED = 'recalled',
}

export enum StockMovementType {
  RECEIVE = 'receive',
  DISPENSE = 'dispense',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  EXPIRE = 'expire',
  RECALL = 'recall',
  WRITE_OFF = 'write_off',
}

export interface ResolvedMedication {
  medicationId: string;
  billingItemId: string | null;
  billingCode: string | null;
  billingDescription: string | null;
  listPrice: number | null;
}

export interface PharmacyStock {
  id: string;
  tenantId: string;
  medicationId?: string | null;
  drugCode: string;
  codeSystem: string;
  drugName: string;
  drugNameAr?: string | null;
  genericName?: string | null;
  dosageForm: string;
  strength?: string | null;
  unit: string;
  batchNumber: string;
  manufacturer?: string | null;
  expiryDate: string;
  receivedDate: string;
  quantityReceived: number;
  quantityOnHand: number;
  quantityReserved: number;
  quantityReturned: number;
  reorderLevel?: number | null;
  reorderQuantity?: number | null;
  facilityId?: string | null;
  storageLocation?: string | null;
  unitCostPrice?: number | null;
  currency: string;
  billingItemId?: string | null;
  status: PharmacyStockStatus;
  isControlled: boolean;
  controlledClass?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  movements?: PharmacyStockMovement[];
}

export interface PharmacyStockMovement {
  id: string;
  tenantId: string;
  stockId: string;
  movementType: StockMovementType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  notes?: string | null;
  performedBy: string;
  performedAt: string;
  createdAt: string;
  stock?: { drugName: string; batchNumber: string; drugCode: string };
}

export interface CreateStockInput {
  medicationId?: string;
  drugCode: string;
  codeSystem?: string;
  drugName: string;
  drugNameAr?: string;
  genericName?: string;
  dosageForm: string;
  strength?: string;
  unit: string;
  batchNumber: string;
  manufacturer?: string;
  expiryDate: string;
  quantityReceived: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  facilityId?: string;
  storageLocation?: string;
  unitCostPrice?: number;
  currency?: string;
  billingItemId?: string;
  isControlled?: boolean;
  controlledClass?: string;
}

export interface UpdateStockInput {
  storageLocation?: string;
  reorderLevel?: number;
  reorderQuantity?: number;
  billingItemId?: string;
  facilityId?: string;
}

export interface AdjustStockInput {
  newQuantityOnHand: number;
  reason: string;
  notes?: string;
}

export interface StockFilters {
  search?: string;
  drugCode?: string;
  status?: string;
  facilityId?: string;
  expiringBefore?: string;
  lowStock?: string;
}
