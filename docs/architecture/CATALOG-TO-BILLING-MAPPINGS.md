# Catalog-to-Billing Item Mappings

## Overview

This document describes the system that links clinical catalog items (medications, lab tests, imaging studies, procedures, administrative services, and packages) to billing items in the RCM module. These mappings drive automatic charge posting — when a clinician orders a service, the system uses the mapping to determine which billing items to charge, at what quantity, and under which context.

The mapping layer lives entirely in the **RCM database** (`zeal_rcm`), keeping billing logic independent of the clinical domain.

---

## Architecture

### Cross-Database Design

```
zeal_clinical (Clinical DB)                  zeal_rcm (RCM DB)
──────────────────────────────               ──────────────────────────────────────
MedicationMaster      (id, ndcCode, …)  ──┐
LabTestMaster         (id, loincCode, …)  │  CatalogItemMapping
ImagingStudyMaster    (id, cptCode, …)   ─┼─ (catalogType, catalogItemId, billingItemId)
ProcedureMaster       (id, cptCode, …)   │          │
AdministrativeService (id, serviceCode, …)│          ▼
Package               (id, code, …)     ──┘  BillingItem
                                             (billingCode, listPrice, itemType)
```

**Key constraint:** `catalogItemId` is a *logical foreign key* — it stores the clinical item's UUID but there is no database-level constraint across the database boundary. Integrity is enforced at the application level.

### itemType → catalogType Correspondence

| `BillingItem.itemType` | `CatalogItemMapping.catalogType` | Clinical table |
|---|---|---|
| `pharmacy` | `medication` | `MedicationMaster` |
| `lab` | `lab_test` | `LabTestMaster` |
| `imaging` | `imaging_study` | `ImagingStudyMaster` |
| `procedure` | `procedure` | `ProcedureMaster` |
| `misc` | `administrative_service` | `AdministrativeService` |
| `package` | `package` | `Package` |

### Code Correspondence (used for auto-suggest)

| Catalog type | Clinical code field(s) | Expected billing code type |
|---|---|---|
| `lab_test` | `loincCode`, `cptCode` | `LOINC`, `CPT` |
| `imaging_study` | `cptCode` | `CPT` |
| `procedure` | `cptCode`, `icd10PcsCode` | `CPT` |
| `medication` | `ndcCode`, `atcCode` | `INTERNAL`, `CUSTOM` |
| `administrative_service` | `billingCode`, `serviceCode` | `CPT`, `LOCAL`, `CUSTOM` |
| `package` | `code` | `INTERNAL`, `CUSTOM` |

---

## Database Schema

### CatalogItemMapping

```prisma
model CatalogItemMapping {
  id        String @id @default(uuid())
  tenantId  String @map("tenant_id")

  // Catalog reference — logical FK to Clinical DB
  catalogType   String   // medication | lab_test | imaging_study | procedure | package | administrative_service
  catalogItemId String   @db.Uuid  // UUID of item in Clinical DB

  // Billing item — real FK in RCM DB
  billingItemId String
  billingItem   BillingItem @relation(fields: [billingItemId], references: [id], onDelete: Cascade)

  // Mapping behaviour
  quantity         Decimal  @default(1)     // billing units per clinical item ordered
  isAutomatic      Boolean  @default(true)  // create charge automatically on order
  isPrimary        Boolean  @default(false) // primary mapping for this catalog item
  requiresApproval Boolean  @default(false) // hold charge pending approval

  // Context filters (empty array = applies to all)
  facilityIds  String[] @default([])   // restrict to specific facilities
  payerIds     String[] @default([])   // restrict to specific payers
  patientTypes String[] @default([])   // cash | insurance | vip | etc.

  // Validity window
  effectiveDate  DateTime?
  expirationDate DateTime?

  // Metadata
  mappingReason String?
  notes         String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  createdBy     String?

  @@unique([tenantId, catalogType, catalogItemId, billingItemId])
  @@index([tenantId, catalogType, catalogItemId])
}
```

### CatalogMappingAudit

Tracks every create / update / deactivate / delete on a mapping for compliance purposes.

```prisma
model CatalogMappingAudit {
  id        String   @id @default(uuid())
  tenantId  String
  mappingId String

  action        String    // create | update | delete | activate | deactivate
  oldValue      Json?
  newValue      Json?
  changedFields String[]

  changedBy    String
  changeReason String?
  changedAt    DateTime @default(now())
}
```

---

## API Reference

All endpoints require `x-tenant-id` header. Base path: `/api/v1/catalog-mappings`

| Method | Path | Description |
|---|---|---|
| `GET` | `/catalog-mappings` | List all mappings (supports filters) |
| `POST` | `/catalog-mappings` | Create a new mapping |
| `GET` | `/catalog-mappings/find-billing-items` | Resolve billing items for a catalog item with context |
| `GET` | `/catalog-mappings/:id` | Get a single mapping |
| `GET` | `/catalog-mappings/:id/audit` | Get audit trail for a mapping |
| `PUT` | `/catalog-mappings/:id` | Update a mapping |
| `DELETE` | `/catalog-mappings/:id` | Soft-delete (sets `isActive = false`) |
| `DELETE` | `/catalog-mappings/:id/permanent` | Hard delete |

### GET /find-billing-items

Used at order time to resolve which billing items to charge.

**Query parameters:**

| Param | Required | Description |
|---|---|---|
| `catalogType` | Yes | `lab_test`, `medication`, etc. |
| `catalogItemId` | Yes | UUID of the clinical item |
| `facilityId` | No | Narrows to facility-specific mappings |
| `payerId` | No | Narrows to payer-specific mappings |
| `patientType` | No | `cash`, `insurance`, `vip`, etc. |

**Resolution logic:**
1. Filter active mappings by `tenantId + catalogType + catalogItemId`
2. Apply context filters: if a mapping has `facilityIds: ["A"]` it only matches facility A; if `facilityIds: []` it matches all
3. Apply date window: respect `effectiveDate` / `expirationDate`
4. Sort: primary mappings first, then by `createdAt`

**Example response:**

```json
{
  "catalogType": "lab_test",
  "catalogItemId": "uuid-of-cbc",
  "mappings": [
    {
      "billingItemId": "uuid",
      "billingCode": "85025",
      "billingDescription": "Complete Blood Count",
      "quantity": 1,
      "isPrimary": true,
      "isAutomatic": true,
      "requiresApproval": false
    }
  ]
}
```

---

## Use Cases

### 1. Simple 1:1 mapping
A lab test maps to one CPT billing code.

```json
{
  "catalogType": "lab_test",
  "catalogItemId": "uuid-of-cbc",
  "billingItemId": "uuid-of-cpt-85025",
  "quantity": 1,
  "isPrimary": true,
  "isAutomatic": true
}
```

### 2. One-to-many mapping
A chest X-ray generates three billing charges.

```json
[
  { "catalogItemId": "uuid-of-xray", "billingItemId": "uuid-radiology-code", "isPrimary": true },
  { "catalogItemId": "uuid-of-xray", "billingItemId": "uuid-facility-fee",   "isPrimary": false },
  { "catalogItemId": "uuid-of-xray", "billingItemId": "uuid-reading-fee",    "isPrimary": false }
]
```

### 3. Payer-specific mapping
Same lab test billed with different codes depending on the insurer.

```json
[
  { "catalogItemId": "uuid-cbc", "billingItemId": "uuid-dha-code",     "payerIds": ["uuid-dha"] },
  { "catalogItemId": "uuid-cbc", "billingItemId": "uuid-private-code", "payerIds": ["uuid-axa", "uuid-nic"] }
]
```

### 4. Patient-type mapping
Different billing items for cash vs. insurance patients.

```json
[
  { "catalogItemId": "uuid-paracetamol", "billingItemId": "uuid-cash-drug",      "patientTypes": ["cash"] },
  { "catalogItemId": "uuid-paracetamol", "billingItemId": "uuid-insurance-drug", "patientTypes": ["insurance"] }
]
```

### 5. Date-windowed mapping
A mapping valid only during a contract period.

```json
{
  "catalogItemId": "uuid-mri",
  "billingItemId": "uuid-contract-mri-code",
  "effectiveDate": "2025-01-01",
  "expirationDate": "2025-12-31",
  "payerIds": ["uuid-daman"]
}
```

---

## Pharmacy Integration

When a pharmacist receives stock (`POST /pharmacy/stock`), the system automatically resolves the linked billing item:

```
PharmacyStock.medicationId (logical FK → MedicationMaster)
       │
       ▼
CatalogItemMapping (catalogType = 'medication', catalogItemId = medicationId)
       │
       ▼
BillingItem  →  stored in PharmacyStock.billingItemId
```

If `medicationId` is provided but `billingItemId` is not, `PharmacyStockService.create()` calls `CatalogMappingService.findBillingItemsForCatalogItem()` and saves the primary mapping's billing item automatically.

**Related endpoint:** `GET /pharmacy/stock/resolve-medication/:medicationId` — used by the "Receive Stock" form to preview the linked billing item before saving.

---

## Charge Posting Flow

When a clinical event occurs (medication dispensed, order completed):

```
Clinical event (e.g. medication dispensed)
       │
       ▼
ChargePostingService.processEvent()
       │
       ├─ Tries rules engine (EventType.MEDICATION_DISPENSED)
       │
       └─ Fallback: PharmacyChargeService.fallbackDirectCharge()
              │
              └─ Reads billingItemId from PharmacyStock
                 → Creates Charge record in RCM DB
```

Charge records reference `sourceType: 'pharmacy'` and `sourceId: dispensingId`.

---

## Frontend UI

### Where mappings are managed

| Screen | Path | What you can do |
|---|---|---|
| Catalog Mappings | `/rcm-setup/catalog-mappings` | Create and list all mappings; search comboboxes for all 6 catalog types |
| Suggested Mappings | `/rcm-setup/catalog-mappings/suggestions` | One-click accept for catalog items and billing items that share the same code (LOINC, CPT, NDC, serviceCode) |
| Billing Item detail | `/rcm-setup/billing-items/:id` | See which catalog items map to this billing item; add new mappings |
| Medication detail | `/catalogs/medications/:id` | See and manage billing item mappings for this medication |
| Lab Test detail | `/catalogs/lab-tests/:id` | See and manage billing item mappings for this lab test |
| Imaging Study detail | `/catalogs/imaging-studies/:id` | See and manage billing item mappings for this imaging study |
| Procedure detail | `/catalogs/procedures/:id` | See and manage billing item mappings for this procedure |
| Administrative Service detail | `/catalogs/administrative-services/:id` | See and manage billing item mappings for this service |
| Package detail | `/catalogs/packages/:id` | See and manage billing item mappings for this package |
| Receive Stock | `/pharmacy/stock/new` | Medication picker auto-populates drug fields and resolves billing item via mapping |

### Suggested Mappings (code-based auto-match)

The `/rcm-setup/catalog-mappings/suggestions` page detects unmapped pairs automatically:

1. Loads all active billing items of a given `itemType` from RCM
2. Loads all active clinical catalog items of the matching `catalogType` from Clinical
3. Loads existing mappings to exclude already-mapped pairs
4. Matches by code: a lab test with `loincCode = "85025"` is matched to a billing item with `billingCode = "85025"`, an administrative service with `billingCode = "REG001"` is matched to a `misc` billing item with `billingCode = "REG001"`, etc.
5. Shows the unlinked pairs for one-click or bulk acceptance

Supported catalog types on the suggestions page: `lab_test`, `imaging_study`, `procedure`, `medication`, `administrative_service`, `package`.

### Shared component

`CatalogBillingMappingsPanel` (`frontend/src/modules/rcm/components/catalog-billing-mappings-panel.tsx`) is used on both clinical catalog detail pages and the billing item detail page. It operates in two modes:

- **Catalog mode** — catalog item is fixed; user searches for a billing item to link
- **Billing mode** — billing item is fixed; user picks a catalog type then searches for a catalog item

---

## Role Responsibilities

```
Billing Admin
  └─ Creates/manages: Billing Items (/rcm-setup/billing-items)
  └─ Creates/manages: Catalog Mappings (/rcm-setup/catalog-mappings)
  └─ Uses: Suggested Mappings for initial setup

Clinical Admin
  └─ Manages: Medication / Lab / Imaging / Procedure catalogs
  └─ Manages: Administrative Service / Package catalogs
  └─ Can add billing mappings from any catalog item detail page

Pharmacist
  └─ Receives stock (/pharmacy/stock/new)
     → picks medication from catalog → billing item auto-resolves
```

---

## Implementation Checklist

- [x] Prisma schema — `CatalogItemMapping`, `CatalogMappingAudit`
- [x] DTOs — `CreateCatalogMappingDto`, `QueryCatalogMappingsDto`, `FindBillingItemsDto`
- [x] Service — `CatalogMappingService` with context-aware resolution, audit logging
- [x] Controller — full CRUD + `/find-billing-items`
- [x] Module registration — `CatalogMappingModule` exported, imported in `PharmacyModule`
- [x] Pharmacy integration — `medicationId` on `PharmacyStock`, auto-resolve on create
- [x] Pharmacy endpoint — `GET /pharmacy/stock/resolve-medication/:medicationId`
- [x] Frontend — search combobox form on `/rcm-setup/catalog-mappings`
- [x] Frontend — `CatalogBillingMappingsPanel` shared component
- [x] Frontend — Billing Mappings panel on all 6 catalog detail pages (medications, lab tests, imaging studies, procedures, administrative services, packages)
- [x] Frontend — Mapped Catalog Items panel on billing item detail page
- [x] Frontend — Suggested Mappings page (code-based auto-match, all 6 catalog types)
- [x] Frontend — Receive Stock form with medication picker + billing item preview
- [ ] Integration tests for context-based resolution
- [ ] Fee schedule integration (price lookup per payer contract)
- [ ] Bulk import via CSV

---

## Related Files

| File | Purpose |
|---|---|
| `backend/shared/database-rcm/prisma/schema.prisma` | `CatalogItemMapping` + `CatalogMappingAudit` models |
| `backend/services/rcm/src/modules/catalog-mappings/` | Service, controller, DTOs, module |
| `backend/services/rcm/src/modules/pharmacy/services/pharmacy-stock.service.ts` | Auto-resolve `billingItemId` on stock creation |
| `backend/services/rcm/src/modules/pharmacy/services/pharmacy-charge.service.ts` | Post charges after dispensing |
| `frontend/src/modules/rcm/components/catalog-billing-mappings-panel.tsx` | Shared inline mapping panel (all 6 catalog types) |
| `frontend/src/app/[locale]/(dashboard)/rcm-setup/catalog-mappings/page.tsx` | Main mapping management screen |
| `frontend/src/app/[locale]/(dashboard)/rcm-setup/catalog-mappings/suggestions/page.tsx` | Auto-suggest unmapped pairs |
| `frontend/src/app/[locale]/(dashboard)/catalogs/administrative-services/[id]/page.tsx` | Administrative service detail + billing mappings panel |
| `frontend/src/app/[locale]/(dashboard)/catalogs/packages/[id]/page.tsx` | Package detail + billing mappings panel |
| `frontend/src/modules/rcm/hooks/use-catalog-mappings.ts` | React Query hooks |
| `frontend/src/modules/rcm/services/catalog-mapping-service.ts` | API client |
| `frontend/src/modules/clinical/hooks/use-administrative-services.ts` | React Query hooks for administrative services |
| `frontend/src/modules/clinical/hooks/use-packages.ts` | React Query hooks for packages |

## Related Documentation

- [`docs/ADR/ADR-0013-service-decomposition.md`](../ADR/ADR-0013-service-decomposition.md) — service and database boundaries
- [`docs/architecture/BACKEND-ARCHITECTURE.md`](BACKEND-ARCHITECTURE.md) — overall backend structure
- [`docs/features/billing/14-Billing-Workflows.md`](../features/billing/14-Billing-Workflows.md) — end-to-end billing flow
