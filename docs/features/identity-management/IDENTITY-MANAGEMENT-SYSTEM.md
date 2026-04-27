# Identity Management System

## Overview

The athma-ce platform implements a flexible, country-agnostic identity management system that supports multiple identity document types across different countries. This allows the platform to be deployed globally while respecting local identity requirements.

## Table of Contents

1. [Architecture](#architecture)
2. [Database Schema](#database-schema)
3. [Identity Types](#identity-types)
4. [Tenant Configuration](#tenant-configuration)
5. [Validation Framework](#validation-framework)
6. [Frontend Integration](#frontend-integration)
7. [Implementation Examples](#implementation-examples)
8. [Adding New Countries](#adding-new-countries)

---

## Architecture

### Design Principles

1. **Country-Agnostic**: Generic schema supports any country's identity documents
2. **Multi-Document Support**: Patients can have multiple identity documents (e.g., national ID + passport)
3. **Tenant-Configurable**: Each tenant can configure identity labels, requirements, and supported types
4. **Validation Flexibility**: Pluggable validators for country-specific rules
5. **Audit Trail**: Full verification history for compliance

### Key Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Patient Identity System                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────────┐                 │
│  │   Patient    │────▶│ PatientDocument  │                 │
│  │              │     │                   │                 │
│  │ nationalId   │     │ documentType     │                 │
│  │ nationalIdType│    │ documentNumber   │                 │
│  │ issuingCountry│    │ issuingCountry   │                 │
│  └──────────────┘     │ verificationStatus│                │
│                        │ isPrimaryIdentity │                 │
│                        └──────────────────┘                 │
│                                 │                             │
│                                 ▼                             │
│                   ┌──────────────────────┐                   │
│                   │ Validation Registry   │                   │
│                   │                       │                   │
│                   │ EmiratesIdValidator  │                   │
│                   │ AadhaarValidator     │                   │
│                   │ PassportValidator    │                   │
│                   └──────────────────────┘                   │
│                                 │                             │
│                                 ▼                             │
│                   ┌──────────────────────┐                   │
│                   │  Tenant Config       │                   │
│                   │                       │                   │
│                   │  identity_config:    │                   │
│                   │   - labels           │                   │
│                   │   - formats          │                   │
│                   │   - validation_rules │                   │
│                   └──────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Patient Table (Clinical Database)

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,

  -- Primary Identity (for fast lookups)
  national_id VARCHAR(50),              -- The primary identity number
  national_id_type VARCHAR(50),         -- 'emirates_id', 'aadhaar', 'passport', etc.
  issuing_country VARCHAR(2),           -- ISO 3166-1 alpha-2 (e.g., 'AE', 'IN', 'GB')

  -- Demographics
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  marital_status VARCHAR(20),
  nationality VARCHAR(100),             -- Full country name or code
  preferred_language VARCHAR(10) DEFAULT 'en',

  -- Contact
  phone_number VARCHAR(20),
  email VARCHAR(255),

  -- Address (generic fields for any country)
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),                   -- State/Province/Emirate
  postal_code VARCHAR(20),
  country VARCHAR(2),                   -- ISO 3166-1 alpha-2

  -- Medical
  blood_group VARCHAR(10),
  emergency_contact JSONB,
  insurance_info JSONB,

  -- System
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_tenant_national_id ON patients(tenant_id, national_id);
CREATE INDEX idx_patients_tenant_id_type_country ON patients(tenant_id, national_id_type, issuing_country);
```

### Patient Documents Table (Clinical Database)

```sql
CREATE TABLE patient_documents (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  -- Document Information
  document_type VARCHAR(50) NOT NULL,     -- 'emirates_id', 'passport', 'visa', 'insurance_card'
  document_number VARCHAR(100) NOT NULL,
  issuing_country VARCHAR(2) NOT NULL,    -- ISO 3166-1 alpha-2
  issuing_authority VARCHAR(200),         -- e.g., 'Federal Authority for Identity and Citizenship'

  -- Validity
  issue_date DATE,
  expiry_date DATE,

  -- Identity Management
  is_primary_identity BOOLEAN DEFAULT false,

  -- Document Storage
  document_url TEXT,                      -- S3/storage path for scanned document

  -- Verification
  verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'expired'
  verified_by UUID,                       -- Staff ID who verified
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,

  -- Additional Data
  metadata JSONB DEFAULT '{}',            -- Country-specific metadata

  -- System
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patient_documents_tenant_patient ON patient_documents(tenant_id, patient_id);
CREATE INDEX idx_patient_documents_tenant_type_number ON patient_documents(tenant_id, document_type, document_number);
CREATE INDEX idx_patient_documents_tenant_verification ON patient_documents(tenant_id, verification_status);
CREATE INDEX idx_patient_documents_tenant_primary ON patient_documents(tenant_id, is_primary_identity);
```

---

## Identity Types

### Supported Identity Types

| Identity Type | Countries | Format | Validation | Expiry Required |
|--------------|-----------|--------|------------|-----------------|
| `emirates_id` | UAE (AE) | 784-YYYY-NNNNNNN-C | Luhn checksum | Yes |
| `aadhaar` | India (IN) | XXXX XXXX XXXX | Verhoeff algorithm | No |
| `passport` | International | Varies by country | Country-specific | Yes |
| `nric` | Singapore (SG) | SXXXXXXXA | Check letter algorithm | No |
| `ssn` | USA (US) | XXX-XX-XXXX | Format validation | No |
| `national_id` | Generic | Varies | Basic validation | Varies |

### Document Types

| Document Type | Purpose | Primary Identity |
|--------------|---------|------------------|
| `emirates_id` | UAE National ID | Yes |
| `aadhaar` | India Unique ID | Yes |
| `passport` | International travel | Can be primary for foreign patients |
| `visa` | Residence permit | No |
| `driving_license` | Additional ID | No |
| `insurance_card` | Health insurance | No |
| `birth_certificate` | Legal record | No |

---

## Tenant Configuration

### Identity Configuration Schema

Stored in `tenants.settings` JSONB field (Foundation Database):

```json
{
  "identity_config": {
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {
          "en": "Emirates ID",
          "ar": "الهوية الإماراتية"
        },
        "required": true,
        "format": "784-YYYY-NNNNNNN-C",
        "placeholder": {
          "en": "784-YYYY-NNNNNNN-C",
          "ar": "784-YYYY-NNNNNNN-C"
        },
        "validation_rules": ["checksum", "length:18", "prefix:784"],
        "display_order": 1
      },
      {
        "type": "passport",
        "label": {
          "en": "Passport Number",
          "ar": "رقم جواز السفر"
        },
        "required": false,
        "format": "Alphanumeric",
        "placeholder": {
          "en": "Enter passport number",
          "ar": "أدخل رقم جواز السفر"
        },
        "validation_rules": ["alphanumeric", "min_length:6", "max_length:15"],
        "display_order": 2
      }
    ],
    "document_verification": {
      "require_verification": true,
      "auto_verify": false,
      "require_document_upload": true,
      "allowed_roles": ["admin", "registrar", "nurse"]
    },
    "address_config": {
      "state_label": {
        "en": "Emirate",
        "ar": "الإمارة"
      },
      "state_options": ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]
    }
  }
}
```

### Configuration Examples

#### UAE Hospital

```json
{
  "identity_config": {
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {"en": "Emirates ID", "ar": "الهوية الإماراتية"},
        "required": true
      }
    ]
  }
}
```

#### Indian Hospital

```json
{
  "identity_config": {
    "primary_country": "IN",
    "identity_types": [
      {
        "type": "aadhaar",
        "label": {"en": "Aadhaar Number", "hi": "आधार संख्या"},
        "required": true
      }
    ]
  }
}
```

#### International Hospital (Dubai)

```json
{
  "identity_config": {
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {"en": "Emirates ID", "ar": "الهوية الإماراتية"},
        "required": false
      },
      {
        "type": "passport",
        "label": {"en": "Passport", "ar": "جواز السفر"},
        "required": true
      }
    ]
  }
}
```

---

## Validation Framework

### Architecture

The validation framework uses a **Registry Pattern** with pluggable validators:

```typescript
// Interface
interface IIdentityValidator {
  country: string;
  identityType: string;
  metadata: IdentityMetadata;
  validate(value: string): ValidationResult;
  format(value: string): string;
  validateChecksum?(value: string): boolean;
  extractMetadata?(value: string): Record<string, any>;
}

// Registry
class IdentityValidationRegistry {
  static register(validator: IIdentityValidator): void;
  static validate(country: string, type: string, value: string): ValidationResult;
  static format(country: string, type: string, value: string): string;
}
```

### Available Validators

#### 1. Emirates ID Validator

**Location:** `backend/shared/validators/src/identity/validators/emirates-id.validator.ts`

**Format:** `784-YYYY-NNNNNNN-C`
- `784`: UAE country code
- `YYYY`: Year (birth or registration)
- `NNNNNNN`: 7-digit sequence
- `C`: Check digit (Luhn algorithm)

**Features:**
- ✅ Luhn checksum validation
- ✅ Format normalization (adds hyphens)
- ✅ Year extraction
- ✅ Length validation

**Usage:**
```typescript
import { IdentityValidationRegistry } from '@zeal/validators';

const result = IdentityValidationRegistry.validate('AE', 'emirates_id', '784199012345678');
// { isValid: true, errors: [], normalizedValue: '784-1990-1234567-8' }
```

#### 2. Aadhaar Validator

**Location:** `backend/shared/validators/src/identity/validators/aadhaar.validator.ts`

**Format:** `XXXX XXXX XXXX` (12 digits)
- First digit cannot be 0 or 1
- Uses Verhoeff algorithm for checksum

**Features:**
- ✅ Verhoeff algorithm validation
- ✅ Format with spaces
- ✅ First digit validation
- ✅ Masked value generation (security)

**Usage:**
```typescript
const result = IdentityValidationRegistry.validate('IN', 'aadhaar', '234567890123');
// { isValid: true, errors: [], normalizedValue: '2345 6789 0123' }
```

#### 3. Passport Validator

**Location:** `backend/shared/validators/src/identity/validators/passport.validator.ts`

**Format:** Varies by country
- US: 9 digits or letter + 8 digits
- UK: 9 digits
- India: Letter + 7 digits
- Generic: 6-15 alphanumeric

**Features:**
- ✅ Country-specific format validation
- ✅ Uppercase normalization
- ✅ Alphanumeric validation
- ⚠️ Warnings for missing country

**Usage:**
```typescript
const result = IdentityValidationRegistry.validate('INTL', 'passport', 'a1234567');
// { isValid: true, errors: [], normalizedValue: 'A1234567', warnings: [...] }
```

### Validation Result Structure

```typescript
interface ValidationResult {
  isValid: boolean;              // Overall validation status
  errors: string[];              // Critical errors (blocks saving)
  warnings?: string[];           // Non-blocking warnings
  normalizedValue?: string;      // Formatted value (only if valid)
}
```

### Adding Custom Validators

**Step 1: Create Validator Class**

```typescript
// backend/shared/validators/src/identity/validators/nric.validator.ts
import { IIdentityValidator, ValidationResult, IdentityMetadata } from '../identity-validator.interface';

export class NRICValidator implements IIdentityValidator {
  readonly country = 'SG';
  readonly identityType = 'nric';
  readonly metadata: IdentityMetadata = {
    country: 'SG',
    identityType: 'nric',
    label: { en: 'NRIC', ar: 'NRIC' },
    format: 'SXXXXXXXA',
    example: 'S1234567A',
    requiresExpiry: false,
    isGovernmentIssued: true,
  };

  validate(value: string): ValidationResult {
    // Implement validation logic
    const errors: string[] = [];
    const cleanValue = value.toUpperCase().replace(/\s/g, '');

    if (!/^[STFG]\d{7}[A-Z]$/.test(cleanValue)) {
      errors.push('Invalid NRIC format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      normalizedValue: cleanValue,
    };
  }

  format(value: string): string {
    return value.toUpperCase().replace(/\s/g, '');
  }
}
```

**Step 2: Register Validator**

```typescript
// backend/shared/validators/src/identity/identity-validation.registry.ts
import { NRICValidator } from './validators/nric.validator';

// In initialize() method
static initialize(): void {
  this.register(new EmiratesIdValidator());
  this.register(new AadhaarValidator());
  this.register(new PassportValidator());
  this.register(new NRICValidator()); // Add new validator
}
```

**Step 3: Export**

```typescript
// backend/shared/validators/src/identity/index.ts
export * from './validators/nric.validator';
```

---

## Frontend Integration

### React Hook for Identity Labels

```typescript
// frontend/src/hooks/useIdentityLabel.ts
import { useTenant } from '@/hooks/useTenant';
import { useTranslation } from 'react-i18next';

export function useIdentityLabel(identityType?: string, country?: string) {
  const { tenant } = useTenant();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Get identity config from tenant settings
  const identityConfig = tenant?.settings?.identity_config;

  if (!identityConfig) {
    return t('patient.identity.label.default', 'National ID');
  }

  // Find matching identity type in config
  const identityTypeConfig = identityConfig.identity_types?.find(
    (config: any) => config.type === identityType
  );

  // Return label from tenant config
  if (identityTypeConfig?.label) {
    return identityTypeConfig.label[language] || identityTypeConfig.label.en;
  }

  // Fallback to translation keys
  const key = identityType || country || identityConfig.primary_country;
  return t(`patient.identity.label.${key}`, t('patient.identity.label.default', 'National ID'));
}
```

### Component Example

```typescript
// frontend/src/components/patient/PatientIdentityField.tsx
import { useIdentityLabel } from '@/hooks/useIdentityLabel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatientIdentityFieldProps {
  identityType: string;
  country: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PatientIdentityField({
  identityType,
  country,
  value,
  onChange,
  error
}: PatientIdentityFieldProps) {
  const label = useIdentityLabel(identityType, country);
  const placeholder = usePlaceholder(identityType, country);

  return (
    <div className="space-y-2">
      <Label htmlFor="national-id">{label}</Label>
      <Input
        id="national-id"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

### Translation Files

```typescript
// frontend/messages/en.json
{
  "patient": {
    "identity": {
      "label": {
        "AE": "Emirates ID",
        "IN": "Aadhaar Number",
        "SG": "NRIC/FIN",
        "US": "Social Security Number",
        "passport": "Passport Number",
        "default": "National ID"
      },
      "placeholder": {
        "AE": "784-YYYY-NNNNNNN-C",
        "IN": "XXXX XXXX XXXX",
        "passport": "Enter passport number",
        "default": "Enter national ID"
      }
    }
  }
}

// frontend/messages/ar.json
{
  "patient": {
    "identity": {
      "label": {
        "AE": "الهوية الإماراتية",
        "IN": "رقم آدهار",
        "passport": "رقم جواز السفر",
        "default": "الهوية الوطنية"
      },
      "placeholder": {
        "AE": "784-YYYY-NNNNNNN-C",
        "IN": "XXXX XXXX XXXX",
        "passport": "أدخل رقم جواز السفر",
        "default": "أدخل الهوية الوطنية"
      }
    }
  }
}
```

---

## Implementation Examples

### Backend: Patient Registration

```typescript
// backend/services/clinical/src/modules/patient/patient.service.ts
import { IdentityValidationRegistry } from '@zeal/validators';
import { PrismaClient } from '@zeal/database-clinical';

export class PatientService {
  async registerPatient(dto: CreatePatientDto) {
    // Validate identity document
    const validationResult = IdentityValidationRegistry.validate(
      dto.issuingCountry,
      dto.nationalIdType,
      dto.nationalId
    );

    if (!validationResult.isValid) {
      throw new BadRequestException({
        message: 'Invalid identity document',
        errors: validationResult.errors,
      });
    }

    // Use normalized value
    const normalizedNationalId = validationResult.normalizedValue;

    // Create patient
    const patient = await this.prisma.patient.create({
      data: {
        tenantId: dto.tenantId,
        nationalId: normalizedNationalId,
        nationalIdType: dto.nationalIdType,
        issuingCountry: dto.issuingCountry,
        firstName: dto.firstName,
        lastName: dto.lastName,
        // ... other fields
      },
    });

    // Create primary identity document record
    await this.prisma.patientDocument.create({
      data: {
        tenantId: dto.tenantId,
        patientId: patient.id,
        documentType: dto.nationalIdType,
        documentNumber: normalizedNationalId,
        issuingCountry: dto.issuingCountry,
        isPrimaryIdentity: true,
        verificationStatus: 'pending',
      },
    });

    return patient;
  }
}
```

### Frontend: Patient Registration Form

```typescript
// frontend/src/components/patient/PatientRegistrationForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useIdentityLabel } from '@/hooks/useIdentityLabel';

const patientSchema = z.object({
  nationalId: z.string().min(1, 'Required'),
  nationalIdType: z.enum(['emirates_id', 'aadhaar', 'passport']),
  issuingCountry: z.string().length(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  // ... other fields
});

export function PatientRegistrationForm() {
  const { control, watch, handleSubmit } = useForm({
    resolver: zodResolver(patientSchema),
  });

  const identityType = watch('nationalIdType');
  const country = watch('issuingCountry');
  const label = useIdentityLabel(identityType, country);

  const onSubmit = async (data: z.infer<typeof patientSchema>) => {
    // Call API
    const response = await fetch('/api/v1/clinical/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="nationalIdType"
        control={control}
        render={({ field }) => (
          <Select {...field}>
            <SelectItem value="emirates_id">Emirates ID</SelectItem>
            <SelectItem value="aadhaar">Aadhaar</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
          </Select>
        )}
      />

      <Controller
        name="nationalId"
        control={control}
        render={({ field, fieldState }) => (
          <PatientIdentityField
            identityType={identityType}
            country={country}
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />

      {/* Other fields */}

      <Button type="submit">Register Patient</Button>
    </form>
  );
}
```

---

## Adding New Countries

### Step-by-Step Guide

#### 1. Create Validator (if country-specific validation needed)

Create a new validator in `backend/shared/validators/src/identity/validators/`:

```typescript
// Example: Malaysia NRIC
export class MyKadValidator implements IIdentityValidator {
  readonly country = 'MY';
  readonly identityType = 'mykad';
  // ... implement interface
}
```

#### 2. Register Validator

Update `identity-validation.registry.ts`:

```typescript
static initialize(): void {
  // ... existing validators
  this.register(new MyKadValidator());
}
```

#### 3. Update Tenant Configuration

Add configuration template for the new country:

```json
{
  "identity_config": {
    "primary_country": "MY",
    "identity_types": [
      {
        "type": "mykad",
        "label": {
          "en": "MyKad Number",
          "ms": "Nombor MyKad"
        },
        "format": "XXXXXX-XX-XXXX",
        "required": true
      }
    ]
  }
}
```

#### 4. Add Translations

Update frontend translation files:

```json
// en.json
"patient.identity.label.MY": "MyKad Number"

// ms.json (Malay)
"patient.identity.label.MY": "Nombor MyKad"
```

#### 5. Update Documentation

Add entry to this document's [Identity Types](#identity-types) table.

#### 6. Create Seed Data

Add sample patients for the new country in `seed/clinical/`.

---

## Best Practices

### 1. Always Normalize Identity Values

```typescript
// ✅ Good
const normalized = IdentityValidationRegistry.format(country, type, rawValue);
await saveToDatabase(normalized);

// ❌ Bad
await saveToDatabase(rawValue); // Might have inconsistent formatting
```

### 2. Store Primary Identity in Both Tables

```typescript
// Patient table: for fast lookups
patient.nationalId = normalizedValue;
patient.nationalIdType = 'emirates_id';

// PatientDocument table: for audit and verification
patientDocument.documentNumber = normalizedValue;
patientDocument.isPrimaryIdentity = true;
```

### 3. Handle Multiple Documents Gracefully

```typescript
// Query all documents
const documents = await prisma.patientDocument.findMany({
  where: { patientId, tenantId },
  orderBy: [
    { isPrimaryIdentity: 'desc' }, // Primary first
    { createdAt: 'desc' },
  ],
});

// Get primary identity
const primaryDoc = documents.find(d => d.isPrimaryIdentity);
```

### 4. Tenant Configuration Fallbacks

```typescript
// Always provide fallbacks
const identityLabel =
  tenant.settings?.identity_config?.identity_types?.[0]?.label?.[language]
  ?? t('patient.identity.label.default');
```

### 5. Validation Warnings vs Errors

```typescript
// Use errors for blocking issues
if (!value) errors.push('Required');

// Use warnings for non-blocking concerns
if (year < 1900) warnings.push('Unusual year');
```

---

## Security Considerations

### 1. Sensitive Data Handling

- **Mask Aadhaar**: Only show last 4 digits in UI
- **Encrypt Documents**: Store scanned documents encrypted in S3
- **Audit Access**: Log all identity document views

### 2. Verification Workflow

```typescript
// Require verification before clinical use
if (patient.documents.every(d => d.verificationStatus === 'pending')) {
  throw new UnauthorizedException('Identity not verified');
}
```

### 3. Document Expiry Checks

```typescript
// Check expiry before appointment
if (document.expiryDate < new Date()) {
  throw new BadRequestException('Identity document expired');
}
```

### 4. Multi-Factor Identity Verification

For high-risk operations (e.g., prescription, surgery consent):
1. Verify primary identity document
2. Cross-check with secondary document (passport)
3. Biometric verification (future)

---

## Migration Guide

### Migrating from Emirates-Only Schema

**Step 1: Backup Data**

```sql
-- Backup existing patients
CREATE TABLE patients_backup AS SELECT * FROM patients;
```

**Step 2: Run Migration**

```sql
-- Add new columns
ALTER TABLE patients ADD COLUMN national_id VARCHAR(50);
ALTER TABLE patients ADD COLUMN national_id_type VARCHAR(50);
ALTER TABLE patients ADD COLUMN issuing_country VARCHAR(2);
ALTER TABLE patients ADD COLUMN state VARCHAR(100);
ALTER TABLE patients ADD COLUMN country VARCHAR(2);

-- Migrate data
UPDATE patients SET
  national_id = emirates_id,
  national_id_type = 'emirates_id',
  issuing_country = 'AE',
  state = emirate,
  country = 'AE',
  nationality = COALESCE(nationality, 'United Arab Emirates')
WHERE emirates_id IS NOT NULL;

-- Create indices
CREATE INDEX idx_patients_tenant_national_id ON patients(tenant_id, national_id);
CREATE INDEX idx_patients_tenant_id_type_country ON patients(tenant_id, national_id_type, issuing_country);

-- Drop old columns (after verification)
-- ALTER TABLE patients DROP COLUMN emirates_id;
-- ALTER TABLE patients DROP COLUMN emirate;
```

**Step 3: Create PatientDocument Table**

```sql
-- Create table (use schema from this document)
-- Migrate existing data
INSERT INTO patient_documents (
  id, tenant_id, patient_id,
  document_type, document_number, issuing_country,
  is_primary_identity, verification_status, verified_at
)
SELECT
  gen_random_uuid(),
  tenant_id,
  id as patient_id,
  national_id_type,
  national_id,
  issuing_country,
  true,
  'verified',
  created_at
FROM patients
WHERE national_id IS NOT NULL;
```

**Step 4: Update Application Code**

Update all references from `emiratesId` to `nationalId`.

**Step 5: Deploy Validators**

Deploy validation framework and update forms to use new validators.

---

## Troubleshooting

### Issue: Validation Fails for Valid ID

**Cause**: Validator not registered or wrong country/type

**Solution:**
```typescript
// Check if validator exists
const hasValidator = IdentityValidationRegistry.hasValidator(country, type);
console.log('Validator exists:', hasValidator);

// List available validators
const validators = IdentityValidationRegistry.getAllValidators();
console.log('Available:', validators.map(v => `${v.country}:${v.identityType}`));
```

### Issue: Label Not Showing Correctly

**Cause**: Tenant config missing or translation not found

**Solution:**
```typescript
// Check tenant config
console.log('Tenant config:', tenant.settings?.identity_config);

// Check translation
console.log('Translation:', t(`patient.identity.label.${country}`));

// Use fallback
const label = tenant.settings?.identity_config?.identity_types?.[0]?.label?.en
  ?? 'National ID';
```

### Issue: Multiple Primary Documents

**Cause**: Business logic error in document creation

**Solution:**
```typescript
// Before creating new primary document, unmark others
await prisma.patientDocument.updateMany({
  where: {
    patientId,
    isPrimaryIdentity: true,
  },
  data: {
    isPrimaryIdentity: false,
  },
});

// Then create new primary
await prisma.patientDocument.create({
  data: {
    isPrimaryIdentity: true,
    // ... other fields
  },
});
```

---

## API Reference

### Endpoints

#### POST `/api/v1/clinical/patients`
Register new patient with identity validation.

#### GET `/api/v1/clinical/patients/:id/documents`
Retrieve all identity documents for a patient.

#### POST `/api/v1/clinical/patients/:id/documents`
Add additional identity document.

#### PUT `/api/v1/clinical/patients/:id/documents/:docId/verify`
Verify an identity document (requires permissions).

#### GET `/api/v1/foundation/identity-config`
Get tenant's identity configuration.

---

## Future Enhancements

1. **Biometric Verification**: Fingerprint/face matching with identity documents
2. **Government API Integration**: Real-time verification with ICA (UAE), UIDAI (India)
3. **OCR for Document Upload**: Auto-extract data from scanned IDs
4. **Blockchain Verification**: Immutable identity verification records
5. **Multi-tenant Identity Federation**: Share verified identities across tenants (with consent)

---

## Support

For questions or issues with the identity management system:
- Backend validators: `backend/shared/validators/src/identity/`
- Database schema: `backend/shared/database-clinical/prisma/schema.prisma`
- Documentation: This file

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**Maintainer:** athma-ce Platform Team
