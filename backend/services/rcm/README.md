# RCM Service

The Revenue Cycle Management (RCM) Service handles all billing, insurance, and financial operations for the Zeal Healthcare Platform.

## Overview

This service manages the complete revenue cycle, including:

- **Billing**: Charges, invoices, receipts, fee schedules
- **Insurance**: Payers, policies, coverage, contracts
- **Medical Coding**: ICD/CPT coding sessions, diagnosis/procedure coding
- **Charge Posting**: Automatic charge posting rules
- **Catalog Mappings**: Clinical catalog to billing item mappings

## Port

**Default Port**: 3012

## Technology Stack

- NestJS with TypeScript
- PostgreSQL (via Prisma ORM) - `zeal_rcm` database
- Swagger/OpenAPI documentation
- Axios for cross-service communication

## Module Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── common/
│   ├── decorators/            # @TenantId decorator
│   └── interceptors/          # Request context
└── modules/
    ├── billing/               # Billing operations
    │   ├── controllers/
    │   │   ├── charge.controller.ts
    │   │   ├── invoice.controller.ts
    │   │   ├── receipt.controller.ts
    │   │   ├── billing-item.controller.ts
    │   │   ├── fee-schedule.controller.ts
    │   │   └── charge-posting-rule.controller.ts
    │   ├── services/
    │   └── dto/
    ├── insurance/             # Insurance management
    │   ├── controllers/
    │   │   ├── payer.controller.ts
    │   │   ├── policy.controller.ts
    │   │   ├── encounter-coverage.controller.ts
    │   │   └── payer-contract.controller.ts
    │   ├── services/
    │   └── dto/
    ├── medical-coding/        # Medical coding workflow
    │   ├── controllers/
    │   │   └── medical-coding.controller.ts
    │   ├── services/
    │   └── dto/
    └── catalog-mappings/      # Catalog to billing mappings
        ├── controllers/
        │   └── catalog-mapping.controller.ts
        ├── services/
        └── dto/
```

## API Endpoints

### Charges (`/charges`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/charges` | Create charge |
| POST | `/charges/bulk` | Create multiple charges |
| GET | `/charges` | List charges with filters |
| GET | `/charges/statistics` | Get charge statistics |
| GET | `/charges/encounter/:encounterId` | Get encounter charges |
| GET | `/charges/patient/:patientId` | Get patient charges |
| GET | `/charges/:id` | Get charge by ID |
| PUT | `/charges/:id` | Update charge |
| PUT | `/charges/:id/cancel` | Cancel charge |
| DELETE | `/charges/:id` | Delete charge |

### Invoices (`/invoices`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/invoices` | Create invoice |
| GET | `/invoices` | List invoices |
| GET | `/invoices/:id` | Get invoice |
| PUT | `/invoices/:id` | Update invoice |
| POST | `/invoices/:id/finalize` | Finalize invoice |
| POST | `/invoices/:id/void` | Void invoice |
| GET | `/invoices/:id/pdf` | Generate PDF |

### Receipts (`/receipts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/receipts` | Create receipt |
| GET | `/receipts` | List receipts |
| GET | `/receipts/:id` | Get receipt |
| PUT | `/receipts/:id` | Update receipt |
| POST | `/receipts/:id/void` | Void receipt |
| GET | `/receipts/:id/pdf` | Generate PDF |

### Billing Items (`/billing-items`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/billing-items` | Create billing item |
| GET | `/billing-items` | List billing items |
| GET | `/billing-items/:id` | Get billing item |
| PUT | `/billing-items/:id` | Update billing item |
| DELETE | `/billing-items/:id` | Delete billing item |

### Fee Schedules (`/fee-schedules`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/fee-schedules` | Create fee schedule |
| GET | `/fee-schedules` | List fee schedules |
| GET | `/fee-schedules/:id` | Get fee schedule |
| PUT | `/fee-schedules/:id` | Update fee schedule |
| DELETE | `/fee-schedules/:id` | Delete fee schedule |
| GET | `/fee-schedules/:id/items` | Get schedule items |
| POST | `/fee-schedules/:id/items` | Add schedule item |

### Charge Posting Rules (`/charge-posting-rules`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/charge-posting-rules` | Create rule |
| GET | `/charge-posting-rules` | List rules |
| GET | `/charge-posting-rules/:id` | Get rule |
| PUT | `/charge-posting-rules/:id` | Update rule |
| DELETE | `/charge-posting-rules/:id` | Delete rule |
| POST | `/charge-posting-rules/evaluate` | Evaluate rules for encounter |

### Payers (`/payers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payers` | Create payer |
| GET | `/payers` | List payers |
| GET | `/payers/statistics` | Get payer statistics |
| GET | `/payers/:id` | Get payer |
| PUT | `/payers/:id` | Update payer |
| DELETE | `/payers/:id` | Delete payer |

### Policies (`/policies`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/policies` | Create policy |
| GET | `/policies` | List policies |
| GET | `/policies/patient/:patientId` | Get patient policies |
| GET | `/policies/:id` | Get policy |
| PUT | `/policies/:id` | Update policy |
| DELETE | `/policies/:id` | Delete policy |
| POST | `/policies/:id/verify` | Verify coverage |

### Encounter Coverage (`/encounter-coverages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/encounter-coverages` | Assign coverage to encounter |
| GET | `/encounter-coverages/encounter/:encounterId` | Get encounter coverage |
| PUT | `/encounter-coverages/:id` | Update coverage |
| DELETE | `/encounter-coverages/:id` | Remove coverage |

### Payer Contracts (`/payer-contracts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payer-contracts` | Create contract |
| GET | `/payer-contracts` | List contracts |
| GET | `/payer-contracts/payer/:payerId` | Get payer contracts |
| GET | `/payer-contracts/:id` | Get contract |
| PUT | `/payer-contracts/:id` | Update contract |
| DELETE | `/payer-contracts/:id` | Delete contract |

### Medical Coding (`/medical-coding`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/medical-coding/sessions` | List coding sessions |
| GET | `/medical-coding/sessions/pending` | Get pending sessions |
| GET | `/medical-coding/sessions/:id` | Get session |
| GET | `/medical-coding/sessions/encounter/:encounterId` | Get by encounter |
| PUT | `/medical-coding/sessions/:id/start-review` | Start review |
| PUT | `/medical-coding/sessions/:id` | Update session |
| POST | `/medical-coding/sessions/:id/submit` | Submit for billing |
| POST | `/medical-coding/sessions/:sessionId/diagnoses` | Add diagnosis code |
| PUT | `/medical-coding/diagnoses/:id` | Update diagnosis |
| DELETE | `/medical-coding/diagnoses/:id` | Remove diagnosis |
| POST | `/medical-coding/sessions/:sessionId/procedures` | Add procedure code |
| PUT | `/medical-coding/procedures/:id` | Update procedure |
| DELETE | `/medical-coding/procedures/:id` | Remove procedure |
| GET | `/medical-coding/sessions/:sessionId/audit` | Get session audit |
| GET | `/medical-coding/audit` | Get audit log |
| GET | `/medical-coding/statistics/coder-productivity` | Coder productivity |
| GET | `/medical-coding/statistics/session-summary` | Session summary |

### Catalog Mappings (`/catalog-mappings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/catalog-mappings` | Create mapping |
| GET | `/catalog-mappings` | List mappings |
| GET | `/catalog-mappings/:id` | Get mapping |
| PUT | `/catalog-mappings/:id` | Update mapping |
| DELETE | `/catalog-mappings/:id` | Delete mapping |
| GET | `/catalog-mappings/resolve/:catalogType/:catalogId` | Resolve billing item |

## Environment Variables

Create a `.env.local` file with:

```bash
# Server
PORT=3012
NODE_ENV=development

# Database
RCM_DATABASE_URL=postgresql://zeal_user:zeal_password@localhost:5432/zeal_rcm

# Clinical Service (for encounter data)
CLINICAL_API_URL=http://localhost:3011

# Foundation Service (for authentication)
FOUNDATION_API_URL=http://localhost:3010
```

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- RCM database created and migrated
- Foundation service running (for authentication)
- Clinical service running (for encounter data)

### Running the Service

```bash
# From backend directory
npm run dev --workspace=@zeal/rcm
```

The development command regenerates the RCM Prisma client from
`shared/database-rcm/prisma/schema.prisma` before starting. This is required
because generated clients are intentionally not committed.

### API Documentation

Swagger documentation available at:

```
http://localhost:3012/docs
```

## Request Headers

All requests require:

| Header | Description |
|--------|-------------|
| `Authorization` | Bearer token (JWT from Foundation service) |
| `x-tenant-id` | Current tenant ID |
| `x-facility-id` | Current facility ID |

## Key Workflows

### Charge Posting Flow

1. Clinical service creates encounter with services
2. RCM evaluates charge posting rules
3. Charges are automatically created based on catalog mappings
4. Charges linked to encounter for billing

### Medical Coding Flow

1. Encounter completed in Clinical service
2. Coding session created automatically
3. Coder reviews and assigns ICD/CPT codes
4. Session submitted for billing
5. Charges updated with final codes

### Invoice Generation Flow

1. Charges accumulated for encounter
2. Coverage determined from patient policies
3. Invoice generated with line items
4. Payer-specific adjustments applied
5. Invoice finalized and sent

## Dependencies

### Internal Packages
- `@zeal/database-rcm` - Prisma client for RCM DB
- `@zeal/contracts` - Shared DTOs and Zod schemas
- `@zeal/shared-utils` - Shared utilities

### Key External Dependencies
- `@nestjs/axios` - HTTP client for cross-service calls
- `class-validator` - DTO validation

## Data Isolation

This service operates exclusively on the `zeal_rcm` database. All financial data is tenant-isolated. Patient PHI is accessed only via the Clinical service API.

## Related Documentation

- [Architecture Overview](../../../docs/architecture/BACKEND-ARCHITECTURE.md)
- [Catalog to Billing Mappings](../../../docs/architecture/CATALOG-TO-BILLING-MAPPINGS.md)
- [Charge Posting Rules Examples](./CHARGE-POSTING-RULES-EXAMPLES.md)
- [Medical Coding Integration](../../shared/database-rcm/prisma/MEDICAL-CODING-INTEGRATION-GUIDE.md)
- [ADR-0013: Service Decomposition](../../../docs/adr/ADR-0013-service-decomposition.md)
