# RCM Claims Management Suite - API Documentation

> Complete API reference for the Revenue Cycle Management Claims Management Suite.  
> **Service**: RCM (`http://localhost:3004/api/v1`)  
> **Base Path**: All endpoints prefixed with `/api/v1`

---

## Overview

The Claims Management Suite provides APIs for the complete insurance workflow lifecycle:

| Module | Purpose |
|--------|---------|
| **Claims** | Claim generation, validation, submission |
| **Batches** | Batch claim submission management |
| **Eligibility** | Coverage verification |
| **PreAuth** | Prior authorization workflow |
| **Denials & Appeals** | Payer denial tracking and appeal workflow |
| **Remittance** | ERA/EOB processing and reconciliation |

### Common Headers

All endpoints require:
```
x-tenant-id: <uuid>  (required)
x-user-id: <uuid>    (optional, for audit)
```

---

## Claims API

### Create Claim
```http
POST /claims
```

**Request Body:**
```typescript
{
  patientId: string;       // Required - Patient UUID
  encounterId?: string;    // Optional - Encounter UUID
  payerId?: string;        // Optional - Payer UUID
  serviceDate: Date;       // Required - Date of service
  currency?: string;       // Default: "AED"
}
```

**Response:** `201 Created`
```typescript
{
  id: string;
  claimNumber: string;     // Auto-generated: "CLM202502000001"
  status: "draft";
  patientId: string;
  totalAmount: number;
  payer: Payer | null;
  claimLines: ClaimLine[];
  claimDiagnoses: ClaimDiagnosis[];
}
```

---

### Generate Claims from Charges
```http
POST /claims/generate
```

**Request Body:**
```typescript
{
  encounterIds?: string[];  // Generate for specific encounters
  patientId?: string;       // Generate for patient's unbilled charges
  dateFrom?: Date;          // Filter by charge date range
  dateTo?: Date;
  payerId?: string;         // Assign payer to generated claims
}
```

**Response:** `201 Created`
```typescript
{
  generatedCount: number;
  claimIds: string[];
}
```

---

### List Claims
```http
GET /claims
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `patientId` | uuid | Filter by patient |
| `encounterId` | uuid | Filter by encounter |
| `payerId` | uuid | Filter by payer |
| `status` | enum | Filter by status |
| `batchId` | uuid | Filter by batch |
| `dateFrom` | date | Service date from |
| `dateTo` | date | Service date to |
| `limit` | number | Page size (default: 50) |
| `offset` | number | Pagination offset |

**Claim Status Values:**
```typescript
type ClaimStatus = 
  | "draft" | "pending" | "ready" | "scrubbing"
  | "validated" | "failed_validation" | "submitted"
  | "acknowledged" | "rejected" | "pending_adjudication"
  | "adjudicated" | "paid" | "partially_paid" | "denied"
  | "appealed" | "cancelled";
```

**Response:** `200 OK`
```typescript
{
  claims: Claim[];
  total: number;
}
```

---

### Get Claim Details
```http
GET /claims/:id
```

**Response:** `200 OK` - Full claim with lines and diagnoses

---

### Validate Claim
```http
POST /claims/:id/validate
```

**Response:** `200 OK`
```typescript
{
  isValid: boolean;
  errors: Array<{
    code: string;
    field?: string;
    lineNumber?: number;
    message: string;
    severity: "error";
  }>;
  warnings: Array<{
    code: string;
    field?: string;
    message: string;
    severity: "warning";
  }>;
}
```

---

### Submit Claim
```http
POST /claims/:id/submit
```

**Response:** `200 OK`
```typescript
{
  success: boolean;
  claimId: string;
  submittedAt?: Date;
  generatedFile?: {
    format: string;
    filename: string;
    mimeType: string;
  };
  validation: ValidationResult;
  error?: string;
}
```

---

### Get Statistics
```http
GET /claims/statistics
```

**Response:** `200 OK`
```typescript
{
  total: number;
  totalAmount: number;
  byStatus: Record<string, { count: number; amount: number }>;
}
```

---

### List Available Formats
```http
GET /claims/formats
```

**Response:** `200 OK`
```typescript
Array<{
  format: string;          // e.g., "GENERIC_JSON", "X12_837P"
  displayName: string;
  supportedRegions: string[];
}>
```

---

## Batches API

### Create Batch
```http
POST /batches
```

**Request Body:**
```typescript
{
  batchType?: "professional" | "institutional" | "dental" | "pharmacy";
  claimFormat: string;     // Required - e.g., "GENERIC_JSON"
  payerId?: string;        // Optional - batch for specific payer
}
```

**Response:** `201 Created`
```typescript
{
  id: string;
  batchNumber: string;     // Auto-generated: "BAT2025020001"
  status: "open";
  claimCount: 0;
  totalAmount: 0;
  payer: Payer | null;
}
```

---

### List Batches
```http
GET /batches
```

**Query Parameters:** `payerId`, `status`, `batchType`, `dateFrom`, `dateTo`, `limit`, `offset`

**Batch Status Values:**
```typescript
type BatchStatus = 
  | "open" | "closed" | "submitting" | "submitted"
  | "acknowledged" | "rejected" | "partially_processed";
```

---

### Get Batch with Claims
```http
GET /batches/:id
```

---

### Add Claims to Batch
```http
POST /batches/:id/add-claims
```

**Request Body:**
```typescript
{
  claimIds: string[];      // Required - Array of claim UUIDs
}
```

---

### Remove Claims from Batch
```http
POST /batches/:id/remove-claims
```

**Request Body:**
```typescript
{
  claimIds: string[];
}
```

---

### Close Batch
```http
POST /batches/:id/close
```

Closes the batch - no more claims can be added.

---

### Generate Batch File
```http
POST /batches/:id/generate
```

Generates the submission file for all claims in the batch.

**Response:** `200 OK`
```typescript
{
  success: boolean;
  generatedFile?: { format, filename, mimeType };
  validationResults: Array<{ claimId, claimNumber, validation }>;
  failedClaims?: Array<{ claimId, claimNumber, validation }>;
  error?: string;
}
```

---

### Submit Batch
```http
POST /batches/:id/submit
```

Submits the batch to payer/clearinghouse.

---

## Eligibility API

### Check Eligibility
```http
POST /eligibility/check
```

**Request Body:**
```typescript
{
  patientId: string;       // Required
  payerId: string;         // Required
  policyId?: string;       // Optional - specific policy
  encounterId?: string;    // Optional - link to encounter
  requestType?: "eligibility" | "benefits";
  serviceTypes?: string[]; // e.g., ["30", "47"] for X12
  serviceDate?: Date;
}
```

**Response:** `200 OK`
```typescript
{
  requestId: string;
  status: "accepted" | "rejected" | "error";
  isEligible?: boolean;
  eligibilityStart?: Date;
  eligibilityEnd?: Date;
  benefitsSummary?: {
    copay?: number;
    coinsurance?: number;
    deductible?: number;
    deductibleMet?: number;
    outOfPocketMax?: number;
    outOfPocketMet?: number;
    coverageLevel?: string;
    planName?: string;
    networkStatus?: string;
  };
  errors?: Array<{ code: string; message: string }>;
}
```

---

### List Eligibility Requests
```http
GET /eligibility/requests
```

**Query Parameters:** `patientId`, `payerId`, `status`, `dateFrom`, `dateTo`, `limit`, `offset`

---

### Get Eligibility Request
```http
GET /eligibility/requests/:id
```

---

## Prior Authorization (PreAuth) API

### Create PreAuth Request
```http
POST /preauth
```

**Request Body:**
```typescript
{
  patientId: string;       // Required
  payerId: string;         // Required
  policyId?: string;
  encounterId?: string;
  urgency?: "routine" | "urgent" | "emergency";
  requestedServices: Array<{
    procedureCode: string;
    procedureCodeType?: string;
    description?: string;
    quantity?: number;
    estimatedCost?: number;
    diagnosisCodes?: string[];
  }>;
  clinicalNotes?: string;
}
```

**Response:** `201 Created`
```typescript
{
  id: string;
  internalRef: string;     // Auto-generated: "PA202502000001"
  status: "draft";
  ...
}
```

---

### List PreAuth Requests
```http
GET /preauth
```

**Query Parameters:** `patientId`, `payerId`, `encounterId`, `status`, `dateFrom`, `dateTo`, `limit`, `offset`

**PreAuth Status Values:**
```typescript
type PreAuthStatus = 
  | "draft" | "pending" | "submitted" | "approved"
  | "partially_approved" | "denied" | "cancelled" | "expired";
```

---

### Get PreAuth Details
```http
GET /preauth/:id
```

---

### Update PreAuth
```http
PUT /preauth/:id
```

**Request Body:**
```typescript
{
  status?: PreAuthStatus;
  authorizationNumber?: string;  // Payer-assigned
  approvedServices?: Array<{
    procedureCode: string;
    approvedQuantity: number;
    approvedAmount?: number;
  }>;
  denialReason?: string;
  validFrom?: Date;
  validTo?: Date;
}
```

---

### Submit PreAuth
```http
POST /preauth/:id/submit
```

---

### Cancel PreAuth
```http
DELETE /preauth/:id
```

---

## Denials & Appeals API

Tracks payer claim denials and the appeal workflow raised against them. Denials
are linked to a `Claim`; appeals are linked to a `Denial`. `encounterId` and
`patientId` filters resolve through the denial's related claim.

**Denial status:** `open` -> `appealing` -> `upheld` | `overturned`
**Appeal status:** `draft` -> `filed` -> `accepted` | `rejected`

### Record Denial
```http
POST /denials
```

**Request Body:**
```typescript
{
  claimId: string;         // Required - Claim UUID (must exist in tenant)
  denialCode: string;      // Required - CARC code, e.g. "CO-197"
  denialReason: string;    // Required - human-readable reason
  deniedAmount: number;    // Required
  currency?: string;       // Default: claim currency or "AED"
  remarkCodes?: string[];  // Optional - RARC codes
  deniedAt?: Date;         // Default: now
  appealDeadline?: Date;   // Optional
  status?: "open" | "appealing" | "upheld" | "overturned"; // Default: "open"
}
```

**Response:** `201 Created` — the `Denial` including `claim` and `appeals`.

---

### List Denials
```http
GET /denials
```

**Query Parameters:** `claimId`, `encounterId`, `patientId`, `status`, `limit`, `offset`

**Response:**
```typescript
{
  denials: Denial[];  // each includes claim + appeals
  total: number;
}
```

---

### Get Denial Details
```http
GET /denials/:id
```

**Response:** `200 OK` — the `Denial` with `claim` and `appeals[]`.

---

### Draft Appeal
```http
POST /denials/:id/appeals
```

Creates a `draft` appeal and moves the denial to `appealing`.

**Request Body:**
```typescript
{
  narrative: string;       // Required - appeal case narrative
  justification?: string;  // Optional
  supportingRefs?: Array<{ type: string; ref: string; description?: string }>;
}
```

**Response:** `201 Created` — the drafted `Appeal`.

---

### File Appeal
```http
POST /appeals/:id/file
```

Files a drafted appeal (must be in `draft` status). Sets status to `filed` and
stamps `filedAt`. Optional body fields override the stored narrative /
justification / supportingRefs at filing time.

**Request Body (optional):**
```typescript
{
  narrative?: string;
  justification?: string;
  supportingRefs?: Array<{ type: string; ref: string; description?: string }>;
}
```

**Response:** `200 OK` — the filed `Appeal` including its `denial`.

---

## Remittance API

### Create/Upload Remittance
```http
POST /remittance
```

**Request Body:**
```typescript
{
  remittance: {
    payerId: string;       // Required
    format: "ERA_835" | "EOB_PDF" | "MANUAL" | "JSON";
    checkNumber?: string;
    checkDate?: Date;
    paymentAmount: number; // Required
    fileContent?: string;  // Raw file content
  };
  lines?: Array<{
    claimId?: string;
    claimNumber: string;   // Required
    billedAmount: number;  // Required
    allowedAmount?: number;
    paidAmount: number;    // Required
    patientResponsibility?: number;
    adjustmentCodes?: Array<{ code, reason, amount }>;
    remarkCodes?: string[];
  }>;
}
```

---

### List Remittances
```http
GET /remittance
```

**Query Parameters:** `payerId`, `status`, `dateFrom`, `dateTo`, `limit`, `offset`

**Remittance Status Values:**
```typescript
type RemittanceStatus = 
  | "received" | "processing" | "processed" | "reconciled" | "error";
```

---

### Get Remittance with Lines
```http
GET /remittance/:id
```

---

### Reconcile Remittance
```http
POST /remittance/:id/reconcile
```

Matches remittance lines to claims and updates claim status.

**Response:** `200 OK`
```typescript
{
  remittanceId: string;
  matchedLines: number;
  unmatchedLines: number;
  totalPaid: number;
  totalAdjusted: number;
  matchedClaims: Array<{
    claimId: string;
    claimNumber: string;
    paidAmount: number;
  }>;
  unmatchedLines_details?: Array<{
    claimNumber: string;
    reason: string;
  }>;
}
```

---

## Frontend Integration Examples

### React Query - Claims List
```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useClaimsList(filters: ClaimFilterDto) {
  return useQuery({
    queryKey: ['claims', filters],
    queryFn: () => api.get('/rcm/claims', { params: filters }),
  });
}
```

### Check Eligibility
```typescript
export function useCheckEligibility() {
  return useMutation({
    mutationFn: (data: CheckEligibilityDto) =>
      api.post('/rcm/eligibility/check', data),
    onSuccess: (response) => {
      if (response.isEligible) {
        toast.success('Patient is eligible');
      } else {
        toast.warning('Patient is not eligible');
      }
    },
  });
}
```

### Submit Claim
```typescript
export function useSubmitClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (claimId: string) =>
      api.post(`/rcm/claims/${claimId}/submit`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
}
```

---

## Error Handling

All endpoints return standard error responses:

```typescript
{
  statusCode: number;
  message: string;
  error?: string;
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Invalid state transition |
| 500 | Internal Server Error |

---

## Related Documentation

- [Implementation Plan](./implementation_plan.md)
- [Database Schema](../../architecture/database-design.md)
- [Payer Configuration](./payer-configuration.md)
