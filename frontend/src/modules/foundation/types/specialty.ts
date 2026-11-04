/**
 * Foundation specialty master (GET /specialties).
 * `code` is the stable cross-service key (e.g. CARDIO, GEN_MED, PED).
 */
export interface Specialty {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  /** Name in the requested locale, falling back to `name`. */
  localizedName: string;
}
