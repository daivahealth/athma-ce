#!/usr/bin/env node
/**
 * One-off backfill (issue #84): patients created before the M1
 * national-identity work carry their identity only in the flat
 * patients.national_id / national_id_type / issuing_country columns, so they
 * are invisible to the multi-identity UI/API. This inserts the matching
 * patient_identity row for each of them.
 *
 * Rules (per the issue):
 *  - country      ← patients.issuing_country, falling back to the tenant's
 *                   clinical.default_country_iso config, then 'INTL'
 *  - identityType ← patients.national_id_type (lowercased), fallback 'other'
 *  - value        ← patients.national_id, normalised via the matching
 *                   validator's format() where one exists
 *  - isPrimary true, verificationStatus UNVERIFIED (never registry-verified)
 *  - Idempotent: a patient already holding that (type, value) is skipped.
 *  - Cross-patient duplicates (same tenant+country+type+value on ANOTHER
 *    patient) violate the unique constraint by design — they are skipped and
 *    REPORTED for triage as potential duplicate patient records.
 *  - Values failing validation are backfilled anyway (UNVERIFIED) and listed.
 *
 * Usage (from backend/, with CLINICAL_DATABASE_URL + FOUNDATION_DATABASE_URL):
 *   node scripts/backfill-patient-identities.mjs            # dry run (default)
 *   node scripts/backfill-patient-identities.mjs --apply    # write rows
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { PrismaClient: ClinicalClient } = require('../shared/database-clinical/generated');
const { PrismaClient: FoundationClient } = require('../shared/database-foundation/generated');
const { IdentityValidationRegistry } = require('../shared/validators/dist');

const APPLY = process.argv.includes('--apply');

const clinical = new ClinicalClient();
const foundation = new FoundationClient();

async function tenantDefaultCountry(cache, tenantId) {
  if (cache.has(tenantId)) return cache.get(tenantId);
  const key = 'clinical.default_country_iso';
  const tenantRow = await foundation.tenantConfig.findUnique({
    where: { tenantId_configKey: { tenantId, configKey: key } },
  });
  let value = tenantRow?.value;
  if (value == null) {
    const instanceRow = await foundation.instanceConfig.findUnique({
      where: { configKey: key },
    });
    value = instanceRow?.value;
  }
  const country = typeof value === 'string' && value.trim() ? value.trim().toUpperCase() : 'INTL';
  cache.set(tenantId, country);
  return country;
}

async function main() {
  IdentityValidationRegistry.initialize();
  const countryCache = new Map();

  const patients = await clinical.patient.findMany({
    where: { nationalId: { not: null } },
    select: {
      id: true,
      tenantId: true,
      mrn: true,
      nationalId: true,
      nationalIdType: true,
      issuingCountry: true,
    },
    orderBy: { createdAt: 'asc' }, // deterministic winner on duplicates
  });

  const report = {
    mode: APPLY ? 'apply' : 'dry-run',
    scanned: patients.length,
    created: 0,
    skippedExisting: 0,
    duplicatesAcrossPatients: [],
    invalidButBackfilled: [],
  };

  for (const patient of patients) {
    const rawValue = String(patient.nationalId).trim();
    if (!rawValue) continue;

    const country = (
      patient.issuingCountry?.trim() || (await tenantDefaultCountry(countryCache, patient.tenantId))
    ).toUpperCase();
    const identityType = (patient.nationalIdType?.trim() || 'other').toLowerCase();

    // Normalise through the matching validator (country-specific, then the
    // INTL-registered ones like passports); record invalids but keep them.
    const validator =
      IdentityValidationRegistry.getValidator(country, identityType) ??
      IdentityValidationRegistry.getValidator('INTL', identityType);
    let value = rawValue;
    if (validator) {
      try {
        value = validator.format(rawValue) || rawValue;
        const result = validator.validate(rawValue);
        if (!result.isValid) {
          report.invalidButBackfilled.push({
            patientId: patient.id,
            mrn: patient.mrn,
            country,
            identityType,
            errors: result.errors ?? [],
          });
        }
      } catch {
        /* formatting must never block the backfill */
      }
    }

    // Idempotency: this patient already holds this identity.
    const existingForPatient = await clinical.patientIdentity.findFirst({
      where: { tenantId: patient.tenantId, patientId: patient.id, country, identityType, value },
      select: { id: true },
    });
    if (existingForPatient) {
      report.skippedExisting++;
      continue;
    }

    // Cross-patient duplicate: same identity value on a different patient —
    // the unique constraint forbids it; report for triage, never drop silently.
    const existingElsewhere = await clinical.patientIdentity.findFirst({
      where: { tenantId: patient.tenantId, country, identityType, value },
      select: { patientId: true },
    });
    if (existingElsewhere) {
      report.duplicatesAcrossPatients.push({
        value,
        country,
        identityType,
        losingPatientId: patient.id,
        losingMrn: patient.mrn,
        winningPatientId: existingElsewhere.patientId,
      });
      continue;
    }

    if (APPLY) {
      await clinical.patientIdentity.create({
        data: {
          tenantId: patient.tenantId,
          patient: { connect: { id: patient.id } },
          country,
          identityType,
          value,
          isPrimary: true,
          verificationStatus: 'UNVERIFIED',
          // System actor for this one-off migration (createdBy is required).
          createdBy: '00000000-0000-0000-0000-000000000000',
        },
      });
    }
    report.created++;
  }

  console.log(JSON.stringify(report, null, 2));
  if (!APPLY) {
    console.error('\nDry run only — re-run with --apply to write the rows.');
  }
  if (report.duplicatesAcrossPatients.length > 0) {
    console.error(
      `\n${report.duplicatesAcrossPatients.length} cross-patient duplicate identit${report.duplicatesAcrossPatients.length === 1 ? 'y' : 'ies'} were SKIPPED — triage these as potential duplicate patient records.`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await clinical.$disconnect();
    await foundation.$disconnect();
  });
