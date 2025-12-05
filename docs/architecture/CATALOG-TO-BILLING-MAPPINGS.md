# Catalog-to-Billing Item Mappings

## Overview

This document describes the many-to-many mapping system between clinical catalog items and billing items. This allows flexible integration between the Clinical EHR system and the RCM (Revenue Cycle Management) billing system, supporting multi-EHR deployments.

## Architecture Decision

**Location**: RCM Database
**Rationale**: Keeping mappings in RCM enables:
- Integration with multiple EHR systems
- Centralized billing configuration
- Independent pricing and billing logic
- Easier contract management and payer negotiations

## Database Schema

### CatalogItemMapping Table

**Purpose**: Many-to-many join table linking clinical catalog items to billing items

```prisma
model CatalogItemMapping {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")

  // Clinical catalog item reference (logical FK to Clinical DB)
  catalogType   String  // medication, lab_test, imaging_study, procedure, package, administrative_service
  catalogItemId String  // UUID of the catalog item

  // Billing item reference (FK to RCM DB billing_items)
  billingItemId String

  // Mapping configuration
  quantity          Decimal  @default(1)      // How many billing items per catalog item
  isAutomatic       Boolean  @default(true)   // Auto-create charge when ordered
  isPrimary         Boolean  @default(false)  // Primary billing item
  requiresApproval  Boolean  @default(false)  // Requires approval before charging

  // Context-based mapping (optional filters)
  facilityIds       String[] // Empty = all facilities
  payerIds          String[] // Empty = all payers
  patientTypes      String[] // cash, insurance, vip, etc. Empty = all

  // Pricing rules
  overridePrice     Decimal?  // Override billing item price
  discountPercent   Decimal?  // Discount percentage

  // Metadata
  mappingReason     String?   // Why this mapping exists
  notes             String?
  effectiveDate     DateTime? // When mapping becomes active
  expirationDate    DateTime? // When mapping expires

  // Status
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  createdBy String?
}
```

### CatalogMappingAudit Table

**Purpose**: Track all changes to catalog mappings for compliance and debugging

```prisma
model CatalogMappingAudit {
  id        String   @id @default(uuid())
  tenantId  String
  mappingId String

  action        String    // create, update, delete, activate, deactivate
  oldValue      Json?
  newValue      Json?
  changedFields String[]

  changedBy    String
  changeReason String?
  changedAt    DateTime @default(now())
}
```

## Catalog Types

The system supports mappings for all clinical catalog types:

| Catalog Type | Source Database | Example |
|--------------|-----------------|---------|
| `medication` | Clinical DB | Paracetamol 500mg → Drug code + Dispensing fee |
| `lab_test` | Clinical DB | CBC Test → CPT code + Lab facility fee |
| `imaging_study` | Clinical DB | Chest X-Ray → Radiology code + Facility fee |
| `procedure` | Clinical DB | Wound Dressing → Procedure code + Supplies |
| `package` | Clinical DB | Annual Checkup → Multiple billing items |
| `administrative_service` | Clinical DB | Registration → Registration fee |

## Use Cases

### 1. Simple 1:1 Mapping
One clinical item maps to one billing item.

**Example**: CBC Lab Test → Lab Test CPT Code

```json
{
  "catalogType": "lab_test",
  "catalogItemId": "uuid-of-cbc-test",
  "billingItemId": "uuid-of-cpt-85025",
  "quantity": 1,
  "isPrimary": true,
  "isAutomatic": true
}
```

### 2. One-to-Many Mapping
One clinical item maps to multiple billing items.

**Example**: Chest X-Ray → Radiology code + Facility fee + Reading fee

```json
[
  {
    "catalogType": "imaging_study",
    "catalogItemId": "uuid-of-chest-xray",
    "billingItemId": "uuid-of-xray-code",
    "quantity": 1,
    "isPrimary": true
  },
  {
    "catalogType": "imaging_study",
    "catalogItemId": "uuid-of-chest-xray",
    "billingItemId": "uuid-of-facility-fee",
    "quantity": 1,
    "isPrimary": false
  },
  {
    "catalogType": "imaging_study",
    "catalogItemId": "uuid-of-chest-xray",
    "billingItemId": "uuid-of-reading-fee",
    "quantity": 1,
    "isPrimary": false
  }
]
```

### 3. Package Mapping
Package maps to bundle of services.

**Example**: Annual Health Checkup Package → Multiple tests, consultation, vitals

```json
[
  {
    "catalogType": "package",
    "catalogItemId": "uuid-of-health-checkup-package",
    "billingItemId": "uuid-of-consultation-fee",
    "quantity": 1
  },
  {
    "catalogType": "package",
    "catalogItemId": "uuid-of-health-checkup-package",
    "billingItemId": "uuid-of-cbc-test",
    "quantity": 1
  },
  {
    "catalogType": "package",
    "catalogItemId": "uuid-of-health-checkup-package",
    "billingItemId": "uuid-of-lipid-panel",
    "quantity": 1
  }
]
```

### 4. Context-Based Mapping
Different billing items based on payer, facility, or patient type.

**Example**: Same medication → Different codes for insurance vs cash patients

```json
[
  {
    "catalogType": "medication",
    "catalogItemId": "uuid-of-paracetamol",
    "billingItemId": "uuid-of-insurance-drug-code",
    "patientTypes": ["insurance"]
  },
  {
    "catalogType": "medication",
    "catalogItemId": "uuid-of-paracetamol",
    "billingItemId": "uuid-of-cash-drug-code",
    "patientTypes": ["cash"]
  }
]
```

**Note**: Prices are determined by fee schedules, not by the mapping. Insurance patients will use payer-specific fee schedules, while cash patients will use the tenant's cash fee schedule.

### 5. Payer-Specific Mapping
Different billing codes based on insurance payer.

**Example**: Lab test → Different CPT codes for DHA vs Private Insurance

```json
[
  {
    "catalogType": "lab_test",
    "catalogItemId": "uuid-of-cbc-test",
    "billingItemId": "uuid-of-dha-lab-code",
    "payerIds": ["uuid-of-dha-payer"],
    "isPrimary": true
  },
  {
    "catalogType": "lab_test",
    "catalogItemId": "uuid-of-cbc-test",
    "billingItemId": "uuid-of-private-insurance-code",
    "payerIds": ["uuid-of-axa-payer", "uuid-of-nic-payer"],
    "isPrimary": true
  }
]
```

## Workflow

### When a Clinical Item is Ordered

1. **Order Created** (Clinical Service)
   - User orders a lab test/medication/procedure from clinical catalog
   - Clinical service creates order in Clinical DB
   - Publishes event or calls RCM API

2. **Lookup Mappings** (RCM Service)
   - RCM service queries `CatalogItemMapping` table
   - Filters by: `catalogType`, `catalogItemId`, `tenantId`
   - Additional filtering by `facilityId`, `payerId`, `patientType` if applicable
   - Considers `effectiveDate` and `expirationDate`
   - Returns active mappings where `isActive = true`

3. **Price Lookup** (RCM Service)
   - For each billing item from mapping:
     - Determine patient's payer/insurance
     - Look up applicable `FeeSchedule`:
       - Check for payer contract-specific fee schedule
       - Fall back to authority fee schedule (DHA/DOH/MOHAP)
       - Fall back to tenant default fee schedule
     - Find `FeeScheduleItem` matching `billingItem.billingCode`
     - Calculate price:
       - Base amount from fee schedule
       - Apply payer contract adjustments (multiplier, discount)
       - Apply co-pay/deductible rules
       - Calculate patient vs payer responsibility

4. **Create Charges** (RCM Service)
   - For each mapping with `isAutomatic = true`:
     - Create `Charge` record in RCM DB
     - Set `unitPrice` from fee schedule lookup
     - Store `feeScheduleId`, `feeScheduleItemId`, `payerContractId` for audit trail
     - Calculate `grossAmount = quantity * unitPrice`
     - Set `patientResponsibility` and `payerResponsibility`
   - For mappings with `requiresApproval = true`:
     - Create charge with status `pending_approval`

5. **Invoice Generation** (RCM Service)
   - Charges are aggregated into invoices
   - Submitted to payers or billed to patients
   - Tracked through RCM workflow

## API Endpoints

### GET /api/v1/rcm/catalog-mappings
Get all mappings with optional filtering

**Query Parameters**:
- `catalogType` - Filter by catalog type
- `catalogItemId` - Filter by catalog item
- `billingItemId` - Filter by billing item
- `isActive` - Filter by active status
- `facilityId` - Filter by facility
- `payerId` - Filter by payer

**Response**:
```json
[
  {
    "id": "uuid",
    "tenantId": "uuid",
    "catalogType": "lab_test",
    "catalogItemId": "uuid",
    "billingItemId": "uuid",
    "quantity": 1,
    "isAutomatic": true,
    "isPrimary": true,
    "facilityIds": [],
    "payerIds": [],
    "patientTypes": [],
    "overridePrice": null,
    "discountPercent": null,
    "isActive": true,
    "createdAt": "2025-12-05T10:00:00Z",
    "billingItem": {
      "billingCode": "85025",
      "billingDescription": "Complete Blood Count (CBC)",
      "listPrice": 150.00
    }
  }
]
```

### POST /api/v1/rcm/catalog-mappings
Create a new mapping

**Request Body**:
```json
{
  "catalogType": "medication",
  "catalogItemId": "uuid",
  "billingItemId": "uuid",
  "quantity": 1,
  "isAutomatic": true,
  "isPrimary": true,
  "requiresApproval": false,
  "facilityIds": [],
  "payerIds": [],
  "patientTypes": ["cash"],
  "overridePrice": 50.00,
  "discountPercent": 10,
  "mappingReason": "Standard cash price with 10% discount",
  "effectiveDate": "2025-01-01"
}
```

### GET /api/v1/rcm/catalog-mappings/find-billing-items
Find billing items for a catalog item with context

**Query Parameters**:
- `catalogType` (required)
- `catalogItemId` (required)
- `facilityId` (optional)
- `payerId` (optional)
- `patientType` (optional)

**Response**:
```json
{
  "catalogType": "lab_test",
  "catalogItemId": "uuid",
  "mappings": [
    {
      "billingItemId": "uuid",
      "billingCode": "85025",
      "billingDescription": "CBC Test",
      "quantity": 1,
      "unitPrice": 150.00,
      "isPrimary": true,
      "isAutomatic": true
    },
    {
      "billingItemId": "uuid",
      "billingCode": "FAC001",
      "billingDescription": "Lab Facility Fee",
      "quantity": 1,
      "unitPrice": 25.00,
      "isPrimary": false,
      "isAutomatic": true
    }
  ],
  "totalEstimate": 175.00
}
```

### PUT /api/v1/rcm/catalog-mappings/:id
Update a mapping

### DELETE /api/v1/rcm/catalog-mappings/:id
Delete a mapping (soft delete by setting `isActive = false`)

### GET /api/v1/rcm/catalog-mappings/:id/audit
Get audit trail for a mapping

## Benefits

### 1. Flexibility
- One clinical item → multiple billing items
- One billing item → used by multiple clinical items
- Context-based pricing (payer, facility, patient type)

### 2. Multi-EHR Support
- Mappings in RCM database
- Can integrate with external EHR systems
- Same billing logic across all EHRs

### 3. Pricing Control
- Override prices per mapping
- Apply discounts per mapping
- Different prices for different contexts

### 4. Compliance
- Full audit trail
- Effective/expiration dates
- Approval workflows

### 5. Revenue Optimization
- Automatic charge creation
- Package bundling
- Payer-specific coding

## Implementation Checklist

- [x] Prisma schema models created
- [x] Database tables created
- [x] DTOs for mapping management
- [x] Service layer implementation
- [x] REST API endpoints
- [x] Seed data with examples
- [x] Module registration in app.module.ts
- [ ] Integration with order workflow
- [ ] Audit logging implementation
- [ ] Unit and integration testing
- [ ] Frontend UI for mapping management

## Next Steps

1. Create DTOs for catalog mapping management
2. Implement `CatalogMappingService` in RCM service
3. Create REST API endpoints
4. Add seed data with sample mappings
5. Integrate with Clinical service order workflow
6. Add frontend UI for mapping management
7. Write documentation for mapping configuration

## Related Documentation

- `/docs/architecture/ADR-0013-service-decomposition.md` - Service boundaries
- `/docs/architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md` - Frontend integration
- `/backend/shared/database-rcm/prisma/schema.prisma` - Complete schema
