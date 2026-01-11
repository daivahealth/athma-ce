export type BedBrowserStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

export interface BedBrowserOccupant {
  patientId: string;
  admissionId: string;
  patientName: string;
}

export interface BedBrowserBed {
  bedId: string;
  bedNumber: string;
  wardId: string;
  wardName: string;
  status: BedBrowserStatus;
  occupant?: BedBrowserOccupant | null;
}

export interface BedBrowserSummary {
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
}

export interface BedBrowserResponse {
  beds: BedBrowserBed[];
  summary: BedBrowserSummary;
}

export interface BedBrowserFilters {
  wardId?: string;
  status?: BedBrowserStatus;
}
