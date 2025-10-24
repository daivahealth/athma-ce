# Tenant Identity Configuration Reference

Quick reference guide for configuring identity types in tenant settings.

## Configuration Location

**Database:** `zeal_foundation`
**Table:** `tenants`
**Field:** `settings` (JSONB)
**Path:** `settings.identity_config`

---

## Basic Configuration

### Minimal Configuration (Single Country)

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
        "required": true
      }
    ]
  }
}
```

### Full Configuration (All Options)

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
        "example": "784-1990-1234567-8",
        "validation_rules": ["checksum", "length:18", "prefix:784"],
        "help_text": {
          "en": "Enter your 15-digit Emirates ID number",
          "ar": "أدخل رقم هويتك الإماراتية المكون من 15 رقمًا"
        },
        "display_order": 1
      }
    ],
    "document_verification": {
      "require_verification": true,
      "auto_verify": false,
      "require_document_upload": true,
      "allowed_roles": ["admin", "registrar", "nurse"],
      "verification_expires_days": 365
    },
    "address_config": {
      "state_label": {
        "en": "Emirate",
        "ar": "الإمارة"
      },
      "state_options": [
        "Abu Dhabi",
        "Dubai",
        "Sharjah",
        "Ajman",
        "Umm Al Quwain",
        "Ras Al Khaimah",
        "Fujairah"
      ]
    }
  }
}
```

---

## Configuration by Country

### United Arab Emirates

```json
{
  "identity_config": {
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {"en": "Emirates ID", "ar": "الهوية الإماراتية"},
        "required": true,
        "format": "784-YYYY-NNNNNNN-C"
      },
      {
        "type": "passport",
        "label": {"en": "Passport Number", "ar": "رقم جواز السفر"},
        "required": false
      }
    ],
    "address_config": {
      "state_label": {"en": "Emirate", "ar": "الإمارة"},
      "state_options": ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]
    }
  }
}
```

### India

```json
{
  "identity_config": {
    "primary_country": "IN",
    "identity_types": [
      {
        "type": "aadhaar",
        "label": {"en": "Aadhaar Number", "hi": "आधार संख्या", "ar": "رقم آدهار"},
        "required": true,
        "format": "XXXX XXXX XXXX",
        "placeholder": {"en": "XXXX XXXX XXXX", "hi": "XXXX XXXX XXXX"}
      },
      {
        "type": "passport",
        "label": {"en": "Passport Number", "hi": "पासपोर्ट नंबर"},
        "required": false
      }
    ],
    "address_config": {
      "state_label": {"en": "State", "hi": "राज्य"},
      "state_options": [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
      ]
    }
  }
}
```

### Singapore

```json
{
  "identity_config": {
    "primary_country": "SG",
    "identity_types": [
      {
        "type": "nric",
        "label": {"en": "NRIC/FIN", "ar": "NRIC/FIN"},
        "required": true,
        "format": "SXXXXXXXA",
        "placeholder": {"en": "S1234567A"}
      },
      {
        "type": "passport",
        "label": {"en": "Passport Number", "ar": "رقم جواز السفر"},
        "required": false
      }
    ],
    "address_config": {
      "state_label": {"en": "District", "ar": "المنطقة"}
    }
  }
}
```

### International Hospital (Multi-Country)

```json
{
  "identity_config": {
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {"en": "Emirates ID", "ar": "الهوية الإماراتية"},
        "required": false,
        "display_order": 1
      },
      {
        "type": "aadhaar",
        "label": {"en": "Aadhaar Number", "ar": "رقم آدهار"},
        "required": false,
        "display_order": 2
      },
      {
        "type": "passport",
        "label": {"en": "Passport Number", "ar": "رقم جواز السفر"},
        "required": true,
        "display_order": 3
      }
    ],
    "document_verification": {
      "require_verification": true,
      "require_document_upload": true
    }
  }
}
```

---

## Field Reference

### identity_config Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primary_country` | string | Yes | ISO 3166-1 alpha-2 code (AE, IN, SG, etc.) |
| `identity_types` | array | Yes | List of supported identity types |
| `document_verification` | object | No | Document verification settings |
| `address_config` | object | No | Address field customization |

### identity_types[] Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Identity type code ('emirates_id', 'aadhaar', 'passport', etc.) |
| `label` | object | Yes | Display labels per language (`{en: '...', ar: '...'}`) |
| `required` | boolean | No | Whether this identity type is required (default: false) |
| `format` | string | No | Format description/pattern |
| `placeholder` | object | No | Input placeholder per language |
| `example` | string | No | Example value for help text |
| `validation_rules` | array | No | Custom validation rule names |
| `help_text` | object | No | Help text per language |
| `display_order` | number | No | Display order in forms (default: by array order) |

### document_verification Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `require_verification` | boolean | No | Require staff verification (default: false) |
| `auto_verify` | boolean | No | Auto-verify based on rules (default: false) |
| `require_document_upload` | boolean | No | Require scanned document upload (default: false) |
| `allowed_roles` | array | No | Roles allowed to verify documents |
| `verification_expires_days` | number | No | Days until verification expires |

### address_config Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `state_label` | object | No | Label for state/province/emirate field |
| `state_options` | array | No | Predefined list of states/provinces |
| `require_state` | boolean | No | Whether state is required |
| `postal_code_format` | string | No | Expected postal code format |

---

## Supported Identity Types

| Type | Country | Format | Validator Available |
|------|---------|--------|---------------------|
| `emirates_id` | AE (UAE) | 784-YYYY-NNNNNNN-C | ✅ Yes |
| `aadhaar` | IN (India) | XXXX XXXX XXXX | ✅ Yes |
| `passport` | International | Varies | ✅ Yes (generic) |
| `nric` | SG (Singapore) | SXXXXXXXA | ⏳ Planned |
| `ssn` | US (USA) | XXX-XX-XXXX | ⏳ Planned |
| `national_id` | Generic | Varies | ⚠️ Basic validation only |

---

## Usage Examples

### Backend: Get Tenant Config

```typescript
import { PrismaClient } from '@zeal/database-foundation';

const prisma = new PrismaClient();

async function getTenantIdentityConfig(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { settings: true },
  });

  return tenant?.settings?.identity_config || null;
}

// Usage
const config = await getTenantIdentityConfig(tenantId);
const primaryCountry = config.primary_country; // 'AE'
const identityTypes = config.identity_types; // [...]
```

### Backend: Update Tenant Config

```typescript
async function updateTenantIdentityConfig(
  tenantId: string,
  identityConfig: any
) {
  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      settings: {
        ...existingSettings,
        identity_config: identityConfig,
      },
    },
  });
}

// Usage
await updateTenantIdentityConfig(tenantId, {
  primary_country: 'IN',
  identity_types: [
    {
      type: 'aadhaar',
      label: { en: 'Aadhaar Number', hi: 'आधार संख्या' },
      required: true,
    },
  ],
});
```

### Frontend: Get Identity Label

```typescript
import { useTenant } from '@/hooks/useTenant';
import { useTranslation } from 'react-i18next';

function useIdentityLabel(identityType: string) {
  const { tenant } = useTenant();
  const { t, i18n } = useTranslation();

  const config = tenant?.settings?.identity_config;
  if (!config) return 'National ID';

  // Find matching identity type
  const typeConfig = config.identity_types?.find(
    (it: any) => it.type === identityType
  );

  // Return label in current language
  if (typeConfig?.label) {
    return typeConfig.label[i18n.language] || typeConfig.label.en;
  }

  // Fallback to translation
  return t(`patient.identity.label.${identityType}`, 'National ID');
}

// Usage in component
const label = useIdentityLabel('emirates_id'); // "Emirates ID" or "الهوية الإماراتية"
```

---

## Migration Scripts

### Add Identity Config to Existing Tenant (UAE)

```sql
UPDATE tenants
SET settings = jsonb_set(
  COALESCE(settings, '{}'::jsonb),
  '{identity_config}',
  '{
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {"en": "Emirates ID", "ar": "الهوية الإماراتية"},
        "required": true,
        "format": "784-YYYY-NNNNNNN-C"
      },
      {
        "type": "passport",
        "label": {"en": "Passport Number", "ar": "رقم جواز السفر"},
        "required": false
      }
    ],
    "address_config": {
      "state_label": {"en": "Emirate", "ar": "الإمارة"}
    }
  }'::jsonb
)
WHERE id = 'YOUR_TENANT_ID';
```

### Bulk Update All Tenants with Default Config

```sql
UPDATE tenants
SET settings = jsonb_set(
  COALESCE(settings, '{}'::jsonb),
  '{identity_config}',
  '{
    "primary_country": "AE",
    "identity_types": [
      {
        "type": "emirates_id",
        "label": {"en": "Emirates ID", "ar": "الهوية الإماراتية"},
        "required": true
      }
    ]
  }'::jsonb
)
WHERE settings->>'identity_config' IS NULL;
```

---

## Validation

### Check Configuration Validity

```typescript
import { z } from 'zod';

const identityConfigSchema = z.object({
  primary_country: z.string().length(2),
  identity_types: z.array(
    z.object({
      type: z.string(),
      label: z.record(z.string()),
      required: z.boolean().optional(),
      format: z.string().optional(),
      placeholder: z.record(z.string()).optional(),
      display_order: z.number().optional(),
    })
  ),
  document_verification: z
    .object({
      require_verification: z.boolean().optional(),
      auto_verify: z.boolean().optional(),
      require_document_upload: z.boolean().optional(),
      allowed_roles: z.array(z.string()).optional(),
    })
    .optional(),
  address_config: z
    .object({
      state_label: z.record(z.string()).optional(),
      state_options: z.array(z.string()).optional(),
    })
    .optional(),
});

// Usage
try {
  identityConfigSchema.parse(config);
  console.log('Valid configuration');
} catch (error) {
  console.error('Invalid configuration:', error);
}
```

---

## Best Practices

### 1. Always Provide English Labels
Even if your primary language is Arabic, always provide English labels as fallback.

### 2. Keep Labels Short
Labels should be 2-4 words maximum for UI clarity.

### 3. Use Standard Country Codes
Always use ISO 3166-1 alpha-2 codes (AE, IN, GB, etc.), not full country names.

### 4. Order Identity Types by Priority
Use `display_order` to show most common identity types first.

### 5. Document Verification for High-Risk Operations
Enable `require_verification` for hospitals dealing with controlled substances or surgery.

### 6. Update Config, Not Code
When expanding to new countries, update tenant config instead of modifying code.

---

## Troubleshooting

### Issue: Labels Not Showing in UI

**Check:**
1. Tenant config exists: `SELECT settings->'identity_config' FROM tenants WHERE id = '...'`
2. Language key matches: `label.en` for English, `label.ar` for Arabic
3. Frontend hook correctly reads config

**Fix:**
```typescript
// Add null checks
const label = config?.identity_types?.[0]?.label?.[language] ?? 'National ID';
```

### Issue: Validation Rules Not Applied

**Check:**
1. Validator registered in `IdentityValidationRegistry`
2. Country code matches exactly (case-sensitive: 'AE' not 'ae')
3. Identity type matches exactly ('emirates_id' not 'emiratesId')

**Fix:**
```typescript
// Debug
console.log('Has validator:', IdentityValidationRegistry.hasValidator('AE', 'emirates_id'));
```

---

## API Endpoints (Future)

These endpoints will be added to manage tenant identity configuration:

- `GET /api/v1/foundation/tenants/:id/identity-config` - Get current config
- `PUT /api/v1/foundation/tenants/:id/identity-config` - Update config
- `GET /api/v1/foundation/identity-types` - List all available identity types
- `GET /api/v1/foundation/countries` - List supported countries

---

**Last Updated:** 2025-10-23
**Version:** 1.0.0
