/**
 * Board Flags Utility
 *
 * Helper functions for managing boardFlags JSONB field
 * Provides type-safe access and mutation of board flags
 */

/**
 * Standard board flags structure
 */
export interface BoardFlags {
  // NPO (Nil Per Os - Nothing by mouth)
  npo?: boolean;

  // Fall risk assessment
  fallRisk?: 'low' | 'medium' | 'high';

  // Telemetry monitoring
  telemetry?: boolean;

  // Isolation precautions
  isolation?: boolean;
  isolationType?: 'contact' | 'droplet' | 'airborne' | 'protective';

  // Allergies
  allergies?: boolean;
  allergyTypes?: string[]; // e.g., ['penicillin', 'latex']

  // DNR/DNI status
  dnr?: boolean; // Do Not Resuscitate
  dni?: boolean; // Do Not Intubate

  // COVID-19 status
  covid?: boolean;
  covidStatus?: 'positive' | 'suspected' | 'recovered';

  // Oxygen therapy
  oxygen?: boolean;
  oxygenType?: 'nasal' | 'mask' | 'high-flow' | 'ventilator';

  // IV access
  ivAccess?: boolean;
  ivType?: 'peripheral' | 'picc' | 'central';

  // Surgical status
  postOp?: boolean;
  postOpDay?: number;

  // Pressure ulcer risk
  pressureUlcerRisk?: boolean;
  braden?: number; // Braden Scale score (6-23)

  // Other custom flags
  [key: string]: any;
}

/**
 * Build board flags from admission clinical data
 */
export class BoardFlagsBuilder {
  private flags: BoardFlags = {};

  /**
   * Set NPO status
   */
  setNPO(isNPO: boolean): this {
    this.flags.npo = isNPO;
    return this;
  }

  /**
   * Set fall risk from score (1-5 scale)
   */
  setFallRiskFromScore(score?: number | null): this {
    if (!score) {
      this.flags.fallRisk = 'low';
    } else if (score >= 4) {
      this.flags.fallRisk = 'high';
    } else if (score >= 2) {
      this.flags.fallRisk = 'medium';
    } else {
      this.flags.fallRisk = 'low';
    }
    return this;
  }

  /**
   * Set fall risk directly
   */
  setFallRisk(risk: 'low' | 'medium' | 'high'): this {
    this.flags.fallRisk = risk;
    return this;
  }

  /**
   * Set telemetry status
   */
  setTelemetry(hasTelemetry: boolean): this {
    this.flags.telemetry = hasTelemetry;
    return this;
  }

  /**
   * Set isolation status
   */
  setIsolation(
    hasIsolation: boolean,
    type?: 'contact' | 'droplet' | 'airborne' | 'protective'
  ): this {
    this.flags.isolation = hasIsolation;
    if (hasIsolation && type) {
      this.flags.isolationType = type;
    }
    return this;
  }

  /**
   * Set allergies
   */
  setAllergies(hasAllergies: boolean, types?: string[]): this {
    this.flags.allergies = hasAllergies;
    if (hasAllergies && types && types.length > 0) {
      this.flags.allergyTypes = types;
    }
    return this;
  }

  /**
   * Set DNR/DNI status
   */
  setAdvanceDirectives(dnr?: boolean, dni?: boolean): this {
    if (dnr !== undefined) this.flags.dnr = dnr;
    if (dni !== undefined) this.flags.dni = dni;
    return this;
  }

  /**
   * Set COVID status
   */
  setCOVID(
    hasCovid: boolean,
    status?: 'positive' | 'suspected' | 'recovered'
  ): this {
    this.flags.covid = hasCovid;
    if (hasCovid && status) {
      this.flags.covidStatus = status;
    }
    return this;
  }

  /**
   * Set oxygen therapy
   */
  setOxygen(
    hasOxygen: boolean,
    type?: 'nasal' | 'mask' | 'high-flow' | 'ventilator'
  ): this {
    this.flags.oxygen = hasOxygen;
    if (hasOxygen && type) {
      this.flags.oxygenType = type;
    }
    return this;
  }

  /**
   * Set IV access
   */
  setIVAccess(hasIV: boolean, type?: 'peripheral' | 'picc' | 'central'): this {
    this.flags.ivAccess = hasIV;
    if (hasIV && type) {
      this.flags.ivType = type;
    }
    return this;
  }

  /**
   * Set post-operative status
   */
  setPostOp(isPostOp: boolean, dayNumber?: number): this {
    this.flags.postOp = isPostOp;
    if (isPostOp && dayNumber !== undefined) {
      this.flags.postOpDay = dayNumber;
    }
    return this;
  }

  /**
   * Set pressure ulcer risk from Braden scale
   */
  setPressureUlcerRisk(bradenScore?: number): this {
    if (bradenScore !== undefined) {
      this.flags.braden = bradenScore;
      this.flags.pressureUlcerRisk = bradenScore <= 18; // Risk if ≤18
    }
    return this;
  }

  /**
   * Set custom flag
   */
  setCustomFlag(key: string, value: any): this {
    this.flags[key] = value;
    return this;
  }

  /**
   * Build flags from legacy clinicalAlerts array
   */
  fromClinicalAlerts(alerts: string[]): this {
    if (!alerts || alerts.length === 0) return this;

    if (alerts.includes('critical')) {
      // Critical is now handled by acuity field
    }
    if (alerts.includes('isolation')) {
      this.setIsolation(true);
    }
    if (alerts.includes('fall_risk')) {
      this.setFallRisk('high');
    }
    if (alerts.includes('npo')) {
      this.setNPO(true);
    }
    if (alerts.includes('allergies')) {
      this.setAllergies(true);
    }
    if (alerts.includes('dnr')) {
      this.setAdvanceDirectives(true);
    }
    if (alerts.includes('covid')) {
      this.setCOVID(true, 'positive');
    }
    if (alerts.includes('telemetry')) {
      this.setTelemetry(true);
    }

    return this;
  }

  /**
   * Merge with existing flags
   */
  merge(existingFlags: BoardFlags | null | undefined): this {
    if (existingFlags) {
      this.flags = { ...existingFlags, ...this.flags };
    }
    return this;
  }

  /**
   * Build and return flags object
   */
  build(): BoardFlags {
    return this.flags;
  }

  /**
   * Build and return as JSONB-compatible object
   */
  buildJSON(): any {
    // Remove undefined values for cleaner JSONB
    return Object.fromEntries(
      Object.entries(this.flags).filter(([_, v]) => v !== undefined)
    );
  }
}

/**
 * Helper function to create board flags from admission data
 */
export function buildBoardFlags(admission: {
  clinicalAlerts?: string[];
  fallRiskScore?: number | null;
  isolationType?: string | null;
}): BoardFlags {
  const builder = new BoardFlagsBuilder();

  // Build from legacy clinicalAlerts if present
  if (admission.clinicalAlerts && admission.clinicalAlerts.length > 0) {
    builder.fromClinicalAlerts(admission.clinicalAlerts);
  }

  // Override with specific fields
  if (admission.fallRiskScore !== undefined && admission.fallRiskScore !== null) {
    builder.setFallRiskFromScore(admission.fallRiskScore);
  }

  if (admission.isolationType) {
    builder.setIsolation(
      true,
      admission.isolationType as 'contact' | 'droplet' | 'airborne' | 'protective'
    );
  }

  return builder.buildJSON();
}

/**
 * Helper to update specific board flags without losing others
 */
export function updateBoardFlags(
  currentFlags: BoardFlags | null | undefined,
  updates: Partial<BoardFlags>
): BoardFlags {
  return {
    ...(currentFlags || {}),
    ...updates,
  };
}

/**
 * Helper to check if a patient has critical flags
 */
export function hasCriticalFlags(flags: BoardFlags | null | undefined): boolean {
  if (!flags) return false;

  return !!(
    flags.fallRisk === 'high' ||
    flags.pressureUlcerRisk ||
    flags.covid ||
    flags.isolation ||
    flags.dnr
  );
}

/**
 * Helper to get display badges from flags
 */
export function getFlagBadges(flags: BoardFlags | null | undefined): string[] {
  if (!flags) return [];

  const badges: string[] = [];

  if (flags.npo) badges.push('NPO');
  if (flags.fallRisk === 'high') badges.push('FALL RISK');
  if (flags.isolation) badges.push('ISOLATION');
  if (flags.allergies) badges.push('ALLERGIES');
  if (flags.telemetry) badges.push('TELEMETRY');
  if (flags.dnr) badges.push('DNR');
  if (flags.covid) badges.push('COVID+');
  if (flags.oxygen) badges.push('O2');
  if (flags.postOp) badges.push(`POD ${flags.postOpDay || '?'}`);

  return badges;
}
