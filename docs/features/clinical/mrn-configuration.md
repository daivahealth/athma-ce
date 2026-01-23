# MRN (Medical Record Number) Configuration

## Overview

The MRN Generator Service automatically creates unique Medical Record Numbers for patients based on configurable format templates. The format is retrieved from the hierarchical configuration system, allowing different formats per instance, tenant, or facility.

**Key Features:**
- ✅ Configurable format templates with placeholders
- ✅ Hierarchical configuration (Facility → Tenant → Instance → Code Default)
- ✅ Automatic uniqueness checking
- ✅ Support for sequential, date-based, and random components
- ✅ Redis caching for optimal performance

## Configuration Keys

### MRN Format

**Key:** `clinical.mrn_format`
**Type:** `string`
**Scope:** Instance → Tenant → Facility (hierarchical)
**Code Default:** `PAT-{YEAR}-{SEQ:6}`
**Database Default:** `{PREFIX}{YEAR}{SEQUENCE:6}`

Sets the template pattern for generating MRNs.

### MRN Prefix

**Key:** `clinical.patient_mrn_prefix`
**Type:** `string`
**Scope:** Instance → Tenant → Facility (hierarchical)
**Default:** `MRN`

Sets the prefix to use when `{PREFIX}` placeholder is included in the format.

## Format Placeholders

The MRN format supports the following placeholders:

| Placeholder | Description | Example Output | Notes |
|------------|-------------|----------------|-------|
| `{YEAR}` | 4-digit current year | 2025 | Good for annual resets |
| `{YY}` | 2-digit current year | 25 | Compact format |
| `{MONTH}` | 2-digit current month | 10 | For monthly grouping |
| `{DAY}` | 2-digit current day | 27 | For daily grouping |
| `{FACILITY}` | Facility code | FAC001 | Uses first 6 chars of facility ID if code not provided |
| `{PREFIX}` | Configurable prefix | MRN | Uses `clinical.patient_mrn_prefix` config |
| `{SEQ:n}` or `{SEQUENCE:n}` | Sequential number with n digits | 000123 | **Tenant-wide** sequence |
| `{RANDOM:n}` | Random alphanumeric with n characters | AB3D | Excludes confusing chars (I,O,0,1) |

## Format Examples

### Basic Sequential Format (Default)
```
Format: PAT-{YEAR}-{SEQ:6}
Output: PAT-2025-000001, PAT-2025-000002, PAT-2025-000003
Scope:  Tenant-wide sequential numbering
```

### Prefix-Based Format
```
Format: {PREFIX}{YEAR}{SEQUENCE:6}
Config: clinical.patient_mrn_prefix = "MRN"
Output: MRN2025000001, MRN2025000002, MRN2025000003
Scope:  Tenant-wide sequential numbering
```

### Facility-Based Format
```
Format: {FACILITY}-{YY}{MONTH}-{SEQ:5}
Output: FAC001-2510-00001, FAC002-2510-00001
Scope:  Facility-specific when {FACILITY} in format
```

### Random Component Format
```
Format: MRN{YEAR}{RANDOM:4}
Output: MRN2025AB3D, MRN2025KP7M, MRN2025DH8R
Scope:  Globally unique random strings
```

### Date-Based Sequential Format
```
Format: P{YY}{MONTH}{DAY}-{SEQ:4}
Output: P251027-0001, P251027-0002
Scope:  Daily sequence reset
```

## Setting MRN Configuration

### Using Configuration API

#### Instance-Level Configuration

Sets the default format for all tenants and facilities:

```bash
curl -X PUT http://localhost:3010/api/v1/configs/instance/clinical.mrn_format \
  -H "Content-Type: application/json" \
  -d '{
    "value": "PAT-{YEAR}-{SEQ:6}",
    "description": "Default MRN format for all facilities"
  }'
```

#### Tenant-Level Configuration

Sets the format for a specific tenant (overrides instance-level):

```bash
curl -X PUT http://localhost:3010/api/v1/configs/tenant/{tenantId}/clinical.mrn_format \
  -H "Content-Type: application/json" \
  -H "x-user-id: {userId}" \
  -d '{
    "value": "{PREFIX}-{YEAR}-{SEQ:5}",
    "changeReason": "Tenant-specific format requirement"
  }'
```

#### Facility-Level Configuration

Sets the format for a specific facility (overrides tenant and instance-level):

```bash
curl -X PUT http://localhost:3010/api/v1/configs/facility/{facilityId}/clinical.mrn_format \
  -H "Content-Type: application/json" \
  -H "x-user-id: {userId}" \
  -d '{
    "value": "{FACILITY}-{YEAR}-{SEQ:6}",
    "changeReason": "Facility-specific format requirement"
  }'
```

#### Set Custom Prefix

```bash
curl -X PUT http://localhost:3010/api/v1/configs/tenant/{tenantId}/clinical.patient_mrn_prefix \
  -H "Content-Type: application/json" \
  -H "x-user-id: {userId}" \
  -d '{
    "value": "PAT",
    "changeReason": "Use PAT prefix instead of MRN"
  }'
```

### Using Direct Database Insert

```sql
-- Set instance-level MRN format
INSERT INTO instance_configs (config_key, value, value_type, category, description)
VALUES (
  'clinical.mrn_format',
  '"{PREFIX}{YEAR}{SEQUENCE:6}"',
  'string',
  'clinical',
  'Default MRN format with configurable prefix'
) ON CONFLICT (config_key) DO UPDATE SET value = EXCLUDED.value;

-- Set instance-level MRN prefix
INSERT INTO instance_configs (config_key, value, value_type, category, description)
VALUES (
  'clinical.patient_mrn_prefix',
  '"MRN"',
  'string',
  'clinical',
  'Default MRN prefix'
) ON CONFLICT (config_key) DO UPDATE SET value = EXCLUDED.value;

-- Set tenant-specific format
INSERT INTO tenant_configs (tenant_id, config_key, value, created_by)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'clinical.mrn_format',
  '"PAT-{YEAR}-{SEQ:6}"',
  (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
);
```

## Implementation Details

### MRN Generation Flow

1. **Configuration Retrieval**
   - Fetch `clinical.mrn_format` from config system (hierarchical: Facility → Tenant → Instance → Default)
   - Fetch `clinical.patient_mrn_prefix` if format includes `{PREFIX}` placeholder
   - Configs are cached in Redis (5 min TTL) + memory (1 min TTL)

2. **Format Application**
   - Replace date/time placeholders (`{YEAR}`, `{MONTH}`, `{DAY}`)
   - Replace facility code (`{FACILITY}`)
   - Replace custom prefix (`{PREFIX}`)
   - Generate sequential number (`{SEQ:n}` or `{SEQUENCE:n}`)
   - Generate random component (`{RANDOM:n}`)

3. **Uniqueness Check**
   - Check if generated MRN already exists for the tenant
   - **Scope:** Tenant-wide (not facility-specific)

4. **Retry Logic**
   - If MRN exists, regenerate (mainly for random components)
   - Maximum 10 attempts
   - Throw error if unique MRN cannot be generated

5. **Patient Creation**
   - Store unique MRN with patient record
   - MRN is immutable once assigned

### Sequential Number Generation

**Important:** Sequences are **tenant-wide**, not facility-specific.

```typescript
// Tenant-wide sequence counter (correct implementation)
const count = await prisma.patient.count({
  where: {
    tenantId,
  },
});

const sequence = count + 1;
```

**Rationale:**
- MRN uniqueness is checked at tenant level (not facility level)
- If sequences were facility-scoped but uniqueness is tenant-scoped, conflicts would occur
- Different facilities would generate the same MRN → validation fails

**Example:**
```
Tenant: ABC Hospital
Facility 1: Main Campus    → Creates patient → MRN2025000001
Facility 2: East Campus    → Creates patient → Attempts MRN2025000001 ❌ (conflict!)

With tenant-wide sequence:
Facility 1: Main Campus    → MRN2025000001
Facility 2: East Campus    → MRN2025000002 ✅
```

### Facility-Specific MRNs (Alternative Approach)

If you need per-facility MRN sequences, include `{FACILITY}` in the format:

```
Format:  {FACILITY}-{YEAR}-{SEQ:6}
Result:
  - Facility A: FAC001-2025-000001, FAC001-2025-000002
  - Facility B: FAC002-2025-000001, FAC002-2025-000002
```

This ensures uniqueness because the facility code becomes part of the MRN.

### Random String Generation

The `{RANDOM:n}` placeholder generates alphanumeric strings excluding confusing characters:

```
Allowed:  ABCDEFGHJKLMNPQRSTUVWXYZ23456789
Excluded: I, O, 0, 1 (to avoid confusion with similar-looking characters)
```

## Database Schema

The MRN is stored in the `patients` table:

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mrn VARCHAR(50) NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at_facility UUID NOT NULL REFERENCES facilities(id),
  ...
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint: MRN must be unique within tenant
CREATE UNIQUE INDEX idx_patients_tenant_mrn ON patients(tenant_id, mrn);

-- Index for fast lookups
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_facility ON patients(created_at_facility);
```

## Format Validation

The MRN Generator Service provides a validation method:

```typescript
const result = mrnGeneratorService.validateFormat('{PREFIX}-{YEAR}-{SEQ:6}');

if (!result.valid) {
  console.error('Invalid format:', result.errors);
  // Example errors:
  // - "Invalid placeholder: {INVALID}"
  // - "Warning: Format does not include {SEQ:n}, {SEQUENCE:n}, or {RANDOM:n}"
}
```

**Validation Checks:**
- ✅ Valid placeholder syntax
- ✅ Supported placeholders only
- ⚠️ Warning if no uniqueness component ({SEQ}/{SEQUENCE}/{RANDOM})

## Best Practices

### 1. Include Uniqueness Components

Always include either `{SEQ:n}`, `{SEQUENCE:n}`, or `{RANDOM:n}`:

```
✅ Good: PAT-{YEAR}-{SEQ:6}
✅ Good: {PREFIX}{RANDOM:8}
❌ Bad:  PAT-{YEAR}         (no uniqueness component)
```

### 2. Use Sufficient Padding

Choose digit count based on expected patient volume:

| Format | Capacity | Recommended For |
|--------|----------|----------------|
| `{SEQ:4}` | 9,999 patients | Small clinics |
| `{SEQ:6}` | 999,999 patients | Medium hospitals |
| `{SEQ:8}` | 99,999,999 patients | Large hospital networks |

### 3. Consider Annual Rotation

Include `{YEAR}` or `{YY}` to allow sequence resets:

```
Format: PAT-{YEAR}-{SEQ:6}
Result: PAT-2025-000001, PAT-2026-000001 (reset each year)
```

### 4. Facility Identification

For multi-facility deployments, include `{FACILITY}`:

```
Format: {FACILITY}-{YEAR}-{SEQ:6}
Result: Identifies patient origin facility
```

### 5. Keep It Simple

Shorter MRNs are:
- ✅ Easier to communicate verbally
- ✅ Less error-prone when manually entered
- ✅ Faster to type

```
✅ Recommended: MRN2025000001 (13 chars)
⚠️ Acceptable: PAT-2025-10-27-000001 (20 chars)
❌ Avoid: PATIENT-2025-10-27-FACILITY001-000001 (38 chars)
```

## Redis Caching

MRN configuration is cached for optimal performance:

**Cache Keys:**
```
config:facility:{facilityId}:clinical.mrn_format
config:facility:{facilityId}:clinical.patient_mrn_prefix
config:tenant:{tenantId}:clinical.mrn_format
config:instance:clinical.mrn_format
```

**Cache Behavior:**
- **Redis TTL:** 5 minutes
- **Memory TTL:** 1 minute (per-service instance)
- **Invalidation:** Automatic on config updates via pub/sub events

**Check Cached Configs:**
```bash
# View all cached configs
docker exec zeal-redis redis-cli KEYS "config:*"

# Get specific config value
docker exec zeal-redis redis-cli GET "config:facility:{facilityId}:clinical.mrn_format"

# Check TTL (seconds remaining)
docker exec zeal-redis redis-cli TTL "config:facility:{facilityId}:clinical.mrn_format"
```

## Migration from Existing MRN Systems

If migrating from an existing system:

### Option 1: Preserve Existing MRNs

1. Import patients with their existing MRNs
2. Configure format to match existing pattern
3. Continue with same format for new patients

```sql
-- Example: Import with existing MRNs
INSERT INTO patients (id, mrn, tenant_id, first_name, last_name, ...)
VALUES
  (gen_random_uuid(), 'OLD-001', 'tenant-uuid', 'John', 'Doe', ...),
  (gen_random_uuid(), 'OLD-002', 'tenant-uuid', 'Jane', 'Smith', ...);

-- Configure to use same format
INSERT INTO instance_configs (config_key, value, value_type, category)
VALUES ('clinical.mrn_format', '"OLD-{SEQ:3}"', 'string', 'clinical');
```

### Option 2: Dual MRN System

1. Import with existing MRNs
2. Use new format for new patients
3. Store legacy MRN in metadata

```sql
-- Store legacy MRN in metadata
UPDATE patients
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'),
  '{legacy_mrn}',
  to_jsonb(mrn)
)
WHERE mrn LIKE 'OLD-%';

-- Assign new MRNs
UPDATE patients
SET mrn = 'MRN2025' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::TEXT, 6, '0')
WHERE mrn LIKE 'OLD-%';
```

## Example Configurations by Use Case

### Single Facility Clinic
```json
{
  "clinical.mrn_format": "P{YY}-{SEQ:5}",
  "clinical.patient_mrn_prefix": "PAT"
}
```
**Output:** `P25-00001`, `P25-00002`

### Hospital Network (Multiple Facilities)
```json
{
  "clinical.mrn_format": "{FACILITY}-{YEAR}-{SEQ:6}"
}
```
**Output:** `FAC001-2025-000001`, `FAC002-2025-000001`

### Pediatric Clinic with Annual Reset
```json
{
  "clinical.mrn_format": "PED{YEAR}-{SEQ:4}"
}
```
**Output:** `PED2025-0001`, `PED2026-0001`

### Research Facility with Random IDs
```json
{
  "clinical.mrn_format": "RES{RANDOM:8}"
}
```
**Output:** `RESAB3DKP7M`, `RESDH8RQ4WN`

### UAE Healthcare Provider
```json
{
  "clinical.mrn_format": "{PREFIX}{YEAR}{SEQUENCE:6}",
  "clinical.patient_mrn_prefix": "MRN"
}
```
**Output:** `MRN2025000001`, `MRN2025000002`

## Troubleshooting

### Issue: "Failed to generate unique MRN after 10 attempts"

**Symptom:** Patient creation fails with error after 10 retry attempts.

**Common Causes:**

1. **Sequence Scope Mismatch** (Most Common)
   ```
   Problem: Format has no {FACILITY} but sequences are facility-scoped
   Solution: Use tenant-wide sequences (default behavior after fix)
   ```

2. **Insufficient Random Length**
   ```
   Format: MRN{RANDOM:2}
   Problem: Only 1,296 possible combinations (36^2)
   Solution: Increase to {RANDOM:6} or higher
   ```

3. **Date-Only Format**
   ```
   Format: PAT-{YEAR}-{MONTH}-{DAY}
   Problem: No uniqueness component
   Solution: Add {SEQ:6} or {RANDOM:4}
   ```

4. **Manual MRN Conflicts**
   ```
   Problem: Manually inserted MRNs conflict with generated ones
   Solution: Use separate format or adjust sequence offset
   ```

**Resolution:**
```typescript
// Check patient count to understand sequence state
SELECT COUNT(*) FROM patients WHERE tenant_id = 'xxx';

// Check for duplicate MRNs
SELECT mrn, COUNT(*)
FROM patients
WHERE tenant_id = 'xxx'
GROUP BY mrn
HAVING COUNT(*) > 1;

// Verify format has uniqueness component
SELECT value
FROM instance_configs
WHERE config_key = 'clinical.mrn_format';
```

### Issue: Configuration Not Applied

**Symptom:** MRN format doesn't change despite configuration update.

**Debugging Steps:**

1. **Verify Config Exists**
   ```bash
   curl http://localhost:3010/api/v1/configs/resolve?key=clinical.mrn_format \
     -H "x-tenant-id: {tenantId}" \
     -H "x-facility-id: {facilityId}"
   ```

2. **Check Redis Cache**
   ```bash
   docker exec zeal-redis redis-cli GET "config:facility:{facilityId}:clinical.mrn_format"
   ```

3. **Clear Cache and Retry**
   ```bash
   docker exec zeal-redis redis-cli DEL "config:facility:{facilityId}:clinical.mrn_format"
   docker exec zeal-redis redis-cli DEL "config:tenant:{tenantId}:clinical.mrn_format"
   ```

4. **Restart Service**
   ```bash
   # Configuration changes are cached; restart to reload
   pkill -f "ts-node.*clinical"
   npm run dev
   ```

### Issue: Wrong Key Name (404 Errors)

**Symptom:** Logs show `404 - Configuration key 'clinical.mrn_prefix' not found`

**Problem:** Code uses `clinical.mrn_prefix` but database has `clinical.patient_mrn_prefix`

**Solution:** Ensure consistency between code and database:
```typescript
// ✅ Correct
configClient.get('clinical.patient_mrn_prefix', { ... })

// ❌ Wrong
configClient.get('clinical.mrn_prefix', { ... })
```

### Issue: Sequence Numbers Duplicate

**Symptom:** Multiple patients get same MRN like `MRN2025000005`

**Problem:** Race condition in concurrent patient creation

**Solution:** Use database transactions or dedicated sequence table:

```typescript
// Option 1: Use Prisma transaction
await prisma.$transaction(async (tx) => {
  const mrn = await generateMrn(context);
  const patient = await tx.patient.create({
    data: { mrn, ...patientData }
  });
  return patient;
});

// Option 2: Create sequence table (recommended for high volume)
CREATE TABLE mrn_sequences (
  tenant_id UUID PRIMARY KEY,
  current_value INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Atomic increment
UPDATE mrn_sequences
SET current_value = current_value + 1,
    updated_at = NOW()
WHERE tenant_id = 'xxx'
RETURNING current_value;
```

## Performance Considerations

### High-Volume Environments

For facilities with >1000 patients/day:

1. **Use Dedicated Sequence Table**
   ```sql
   CREATE TABLE mrn_sequences (
     id UUID PRIMARY KEY,
     tenant_id UUID NOT NULL,
     facility_id UUID,
     sequence_name VARCHAR(50) NOT NULL,
     current_value BIGINT DEFAULT 0,
     UNIQUE(tenant_id, facility_id, sequence_name)
   );
   ```

2. **Implement Connection Pooling**
   ```typescript
   // Configure PgBouncer for connection pooling
   // Reduces database connection overhead
   ```

3. **Pre-allocate Sequence Blocks**
   ```typescript
   // Allocate blocks of 100 sequences at a time
   // Reduces database roundtrips
   ```

### Monitoring

**Key Metrics to Track:**
- MRN generation latency (should be <50ms)
- Cache hit rate (target >95%)
- Generation failure rate (should be 0%)
- Sequence gaps (indicates failed transactions)

**Example Monitoring Query:**
```sql
-- Check for sequence gaps
WITH numbered AS (
  SELECT
    mrn,
    CAST(SUBSTRING(mrn FROM '[0-9]+$') AS INTEGER) as seq_num,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM patients
  WHERE tenant_id = 'xxx'
    AND mrn ~ '[0-9]+$'
)
SELECT * FROM numbered
WHERE seq_num != row_num;
```

## API Reference

### Generate MRN

```typescript
import { MrnGeneratorService } from '@/modules/patient/mrn-generator.service';

// Inject service
constructor(private mrnGenerator: MrnGeneratorService) {}

// Generate MRN
const mrn = await this.mrnGenerator.generateMrn({
  tenantId: 'tenant-uuid',
  facilityId: 'facility-uuid',
  facilityCode: 'FAC01', // optional, defaults to first 6 chars of facilityId
});

console.log(mrn); // Output: MRN2025000001
```

### Validate Format

```typescript
// Validate format string
const validation = this.mrnGenerator.validateFormat('{PREFIX}-{YEAR}-{SEQ:6}');

if (!validation.valid) {
  console.error('Format validation failed:', validation.errors);
  // Errors: Array of error messages
}

// Example errors:
// - "Invalid placeholder: {INVALID}"
// - "Warning: Format does not include {SEQ:n}, {SEQUENCE:n}, or {RANDOM:n}"
```

## Related Documentation

- [Configuration Management Architecture](/docs/ARCHITECTURE-CONFIG-MANAGEMENT.md)
- [Multi-Tenancy Implementation](/docs/multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md)
- [Patient Management API](/docs/features/patient-management/)
- [Clinical Service Documentation](/backend/services/clinical/README.md)

## Changelog

### 2025-12-17 - Sequence Scope Fix
- ✅ Fixed sequence scope from facility-specific to tenant-wide
- ✅ Added `{PREFIX}` placeholder support
- ✅ Added `clinical.patient_mrn_prefix` configuration
- ✅ Fixed key name inconsistency (`clinical.mrn_prefix` → `clinical.patient_mrn_prefix`)
- ✅ Updated documentation with troubleshooting for common issues

### 2025-10-27 - Initial Documentation
- ✅ Initial MRN generation documentation
- ✅ Format placeholders and examples
- ✅ Configuration API documentation
