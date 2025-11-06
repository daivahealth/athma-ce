# MRN (Medical Record Number) Configuration

## Overview

The MRN Generator Service automatically creates unique Medical Record Numbers for patients based on configurable format templates. The format is retrieved from the configuration system, allowing different formats per tenant or facility.

## Configuration Key

**Key:** `clinical.mrn_format`
**Type:** `string`
**Scope:** Instance → Tenant → Facility (hierarchical)
**Default:** `PAT-{YEAR}-{SEQ:6}`

## Format Placeholders

The MRN format supports the following placeholders:

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `{YEAR}` | 4-digit current year | 2025 |
| `{YY}` | 2-digit current year | 25 |
| `{MONTH}` | 2-digit current month | 10 |
| `{DAY}` | 2-digit current day | 27 |
| `{FACILITY}` | Facility code (6 chars) | FAC001 |
| `{SEQ:n}` | Sequential number with n digits (padded with zeros) | 000123 |
| `{RANDOM:n}` | Random alphanumeric string with n characters | AB3D |

## Format Examples

### Basic Sequential Format
```
Format: PAT-{YEAR}-{SEQ:6}
Output: PAT-2025-000001, PAT-2025-000002, ...
```

### Facility-Based Format
```
Format: {FACILITY}-{YY}{MONTH}-{SEQ:5}
Output: FAC001-2510-00001, FAC001-2510-00002, ...
```

### Random Component Format
```
Format: MRN{YEAR}{RANDOM:4}
Output: MRN2025AB3D, MRN2025KP7M, ...
```

### Date-Based Sequential Format
```
Format: P{YY}{MONTH}{DAY}-{SEQ:4}
Output: P251027-0001, P251027-0002, ...
```

## Setting MRN Format via Configuration API

### Instance-Level Configuration

Sets the default format for all tenants and facilities:

```bash
PUT /api/v1/configs/instance/clinical.mrn_format
Content-Type: application/json

{
  "value": "PAT-{YEAR}-{SEQ:6}",
  "description": "Default MRN format for all facilities"
}
```

### Tenant-Level Configuration

Sets the format for a specific tenant (overrides instance-level):

```bash
PUT /api/v1/configs/tenant/{tenantId}/clinical.mrn_format
Content-Type: application/json

{
  "value": "TEN1-{YY}{MONTH}-{SEQ:5}",
  "description": "Tenant-specific MRN format"
}
```

### Facility-Level Configuration

Sets the format for a specific facility (overrides tenant and instance-level):

```bash
PUT /api/v1/configs/facility/{facilityId}/clinical.mrn_format
Content-Type: application/json

{
  "value": "{FACILITY}-{YEAR}-{SEQ:6}",
  "description": "Facility-specific MRN format"
}
```

## Implementation Details

### MRN Generation Flow

1. **Configuration Retrieval**: When a patient is registered, the system fetches the MRN format from the configuration system using hierarchical resolution (Facility → Tenant → Instance)

2. **Format Application**: The retrieved format template is processed:
   - Date/time placeholders are replaced with current values
   - Sequential numbers are generated based on existing patient count
   - Random components are generated using alphanumeric characters
   - Facility codes are substituted

3. **Uniqueness Check**: The generated MRN is checked against existing patient records within the tenant

4. **Retry Logic**: If the MRN already exists (possible with random components), up to 10 generation attempts are made

5. **Patient Creation**: The unique MRN is stored with the patient record

### Sequential Number Generation

The `{SEQ:n}` placeholder uses the count of existing patients for the facility as the base:

```typescript
const count = await prisma.patient.count({
  where: {
    tenantId,
    createdAtFacility: facilityId,
  },
});

const sequence = count + 1;
```

**Note:** For high-volume environments, consider implementing a dedicated sequence table for better performance and concurrency handling.

### Random String Generation

The `{RANDOM:n}` placeholder generates alphanumeric strings excluding similar-looking characters:

```
Allowed characters: ABCDEFGHJKLMNPQRSTUVWXYZ23456789
Excluded: I, O, 0, 1 (to avoid confusion)
```

## Database Schema

The MRN is stored in the `patients` table:

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  mrn VARCHAR(50) UNIQUE NOT NULL,
  tenant_id UUID NOT NULL,
  ...
);

CREATE INDEX idx_patients_tenant_mrn ON patients(tenant_id, mrn);
```

## Format Validation

The MRN Generator Service provides a validation method to check format strings:

```typescript
const result = mrnGeneratorService.validateFormat('PAT-{YEAR}-{SEQ:6}');

if (!result.valid) {
  console.error('Invalid format:', result.errors);
}
```

Validation checks for:
- Valid placeholder syntax
- Supported placeholders only
- Presence of uniqueness components ({SEQ} or {RANDOM})

## Best Practices

1. **Include Uniqueness Components**: Always include either `{SEQ:n}` or `{RANDOM:n}` to ensure unique MRNs

2. **Use Sufficient Padding**: For sequential numbers, use enough digits to accommodate expected patient volume:
   - `{SEQ:4}`: Up to 9,999 patients
   - `{SEQ:6}`: Up to 999,999 patients
   - `{SEQ:8}`: Up to 99,999,999 patients

3. **Consider Year Rotation**: Including `{YEAR}` or `{YY}` allows sequence resets annually if desired

4. **Facility Identification**: Include `{FACILITY}` for multi-facility deployments to identify origin

5. **Keep It Simple**: Shorter MRNs are easier to communicate and less error-prone when manually entered

## Migration from Existing MRN Systems

If migrating from an existing system with MRNs:

1. Import patients with their existing MRNs
2. Set the configuration format to match the existing pattern
3. Adjust the sequence counter if needed by creating dummy records or modifying the sequence logic

## Example Configurations by Use Case

### Single Facility Clinic
```json
{
  "clinical.mrn_format": "P{YY}-{SEQ:5}"
}
```

### Hospital Network (Multiple Facilities)
```json
{
  "clinical.mrn_format": "{FACILITY}-{YEAR}-{SEQ:6}"
}
```

### Pediatric Clinic with Annual Reset
```json
{
  "clinical.mrn_format": "PED{YEAR}-{SEQ:4}"
}
```

### Research Facility with Random IDs
```json
{
  "clinical.mrn_format": "RES{RANDOM:8}"
}
```

## Troubleshooting

### MRN Generation Failures

If MRN generation fails after 10 attempts:

1. Check if the format includes `{SEQ}` or `{RANDOM}`
2. For random-only formats, increase the random string length
3. Verify database connectivity
4. Check for unique constraint violations in the database

### Configuration Not Applied

If the MRN format isn't being used:

1. Verify the configuration is set at the correct level (Instance/Tenant/Facility)
2. Check that the configuration key is exactly `clinical.mrn_format`
3. Restart the Clinical service to reload configurations
4. Check service logs for configuration fetch errors

### MRN Uniqueness Issues

If duplicate MRNs are created:

1. Ensure unique constraint is present on the `mrn` column
2. Consider using database transactions for patient creation
3. Implement a dedicated sequence table for high-concurrency environments

## API Reference

See `mrn-generator.service.ts` for the complete implementation:

```typescript
// Generate MRN
const mrn = await mrnGeneratorService.generateMrn({
  tenantId: 'tenant-uuid',
  facilityId: 'facility-uuid',
  facilityCode: 'FAC01', // optional
});

// Validate format
const validation = mrnGeneratorService.validateFormat('PAT-{YEAR}-{SEQ:6}');
```
