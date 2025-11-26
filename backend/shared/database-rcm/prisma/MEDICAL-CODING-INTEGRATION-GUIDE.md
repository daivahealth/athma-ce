# Medical Coding Layer - Integration Guide

## Overview

This medical coding layer provides a **non-blocking review workflow** between clinical documentation and claim submission. Key principles:

1. **Clinical truth** stays in Clinical DB (`encounter_diagnosis`, `clinical_orders`)
2. **Financial truth** stays in RCM DB (`charges`, `invoices`)
3. **Coding layer** bridges the two for accurate claim generation
4. **Auto-seeded** from posting rules - coders enhance, don't block
5. **Claims never wait** - can be generated with or without coder review

## Step 1: Add New Models to schema.prisma

Copy the following models from `medical-coding-addition.prisma` into your `schema.prisma`:

1. `CodingSession` - Workflow management for coding review
2. `CodingDiagnosis` - Billing view of diagnoses (sourced from Clinical DB)
3. `CodingProcedure` - Billing view of procedures/services (sourced from charges + clinical orders)
4. `ClaimLine` - Individual procedure lines on claims
5. `ClaimDiagnosis` - Diagnosis codes attached to claims
6. `CodingAuditLog` - Change tracking for compliance

## Step 2: Modify Existing Models

### 2.1 Enhance the `Charge` model

Add these fields to track coding modifications:

```prisma
model Charge {
  // ... existing fields ...

  // NEW FIELDS FOR CODING:
  codingProcedureId       String?   @map("coding_procedure_id") @db.Uuid
  originalBillingItemId   String?   @map("original_billing_item_id") @db.Uuid // What posting rules chose
  isCoderModified         Boolean   @default(false) @map("is_coder_modified")
  codedBy                 String?   @map("coded_by") @db.Uuid
  codedAt                 DateTime? @map("coded_at") @db.Timestamptz(6)
  claimLineSequence       Int?      @map("claim_line_sequence")

  // NEW RELATIONS:
  codingProcedure         CodingProcedure? @relation(fields: [codingProcedureId], references: [id], onDelete: SetNull)

  // NEW INDEX:
  @@index([codingProcedureId], map: "idx_charges_coding_procedure")
}
```

### 2.2 Enhance the `Claim` model

Add this relation:

```prisma
model Claim {
  // ... existing fields ...

  // NEW RELATIONS:
  codingSessions          CodingSession[]
  claimLines              ClaimLine[]
  claimDiagnoses          ClaimDiagnosis[]
}
```

### 2.3 Enhance the `BillingItem` model

Add this relation:

```prisma
model BillingItem {
  // ... existing fields ...

  // NEW RELATION:
  codingProcedures        CodingProcedure[]
}
```

## Step 3: Run Prisma Migration

```bash
cd backend/shared/database-rcm
npx prisma format
npx prisma migrate dev --name add_medical_coding_layer
npx prisma generate
```

## Step 4: Integration Points in Your Application

### 4.1 When Posting Rules Create Charges (Auto-Seeding)

**Location:** `ChargePostingRule` processing logic

When your posting rules engine creates charges after an encounter event:

```typescript
// Example pseudo-code
async function processChargePostingEvent(event: ChargePostingEvent) {
  // 1. Create charges as you currently do
  const charges = await createChargesFromPostingRules(event);

  // 2. AUTO-CREATE CODING SESSION
  const codingSession = await prisma.codingSession.create({
    data: {
      tenantId: event.tenantId,
      encounterId: event.encounterId,
      status: 'auto_generated', // Not yet reviewed by coder
      createdBy: 'SYSTEM',
    },
  });

  // 3. AUTO-SEED DIAGNOSES from Clinical DB
  const clinicalDiagnoses = await fetchEncounterDiagnosesFromClinicalDB(event.encounterId);
  for (const [index, clinicalDx] of clinicalDiagnoses.entries()) {
    await prisma.codingDiagnosis.create({
      data: {
        tenantId: event.tenantId,
        codingSessionId: codingSession.id,
        sourceEncounterDiagnosisId: clinicalDx.id,
        diagnosisCode: clinicalDx.icdCode,
        diagnosisCodeType: clinicalDx.icdVersion,
        diagnosisDisplay: clinicalDx.diagnosisName,
        diagnosisDisplayAr: clinicalDx.diagnosisNameAr,
        diagnosisType: clinicalDx.diagnosisType, // 'primary' or 'secondary'
        sequence: index + 1,
        usedForBilling: true,
        createdBy: 'SYSTEM',
      },
    });
  }

  // 4. AUTO-SEED PROCEDURES from charges + clinical orders
  const clinicalOrders = await fetchClinicalOrdersFromClinicalDB(event.encounterId);
  for (const [index, charge] of charges.entries()) {
    const billingItem = await prisma.billingItem.findUnique({
      where: { id: charge.billingItemId },
    });

    // Find matching clinical order if exists
    const matchingOrder = findMatchingClinicalOrder(charge, clinicalOrders);

    await prisma.codingProcedure.create({
      data: {
        tenantId: event.tenantId,
        codingSessionId: codingSession.id,
        sourceClinicalOrderId: matchingOrder?.id,
        billingItemId: charge.billingItemId,
        procedureCode: billingItem.billingCode,
        procedureCodeType: billingItem.billingCodeType,
        procedureDisplay: billingItem.billingDescription,
        serviceDate: charge.chargeDate,
        sequence: index + 1,
        units: charge.quantity,
        createdBy: 'SYSTEM',
      },
    });

    // Link charge to coding procedure
    await prisma.charge.update({
      where: { id: charge.id },
      data: {
        codingProcedureId: codingProcedure.id,
        originalBillingItemId: charge.billingItemId,
      },
    });
  }
}
```

### 4.2 Coder Workflow (Frontend Integration)

**Coder Inbox - Retrieve Sessions:**

```typescript
// Get coding sessions needing review
const pendingSessions = await prisma.codingSession.findMany({
  where: {
    tenantId: currentTenantId,
    status: { in: ['auto_generated', 'in_progress'] },
  },
  include: {
    diagnoses: true,
    procedures: {
      include: {
        billingItem: true,
      },
    },
  },
  orderBy: { createdAt: 'asc' },
});
```

**Coder Actions:**

```typescript
// Mark principal diagnosis
await prisma.codingDiagnosis.update({
  where: { id: diagnosisId },
  data: {
    diagnosisType: 'principal',
    sequence: 1,
    updatedBy: coderId,
  },
});

// Add procedure modifier
await prisma.codingProcedure.update({
  where: { id: procedureId },
  data: {
    modifier1: '50', // Bilateral procedure
    updatedBy: coderId,
  },
});

// Change billing item (upcoding/downcoding)
await prisma.codingProcedure.update({
  where: { id: procedureId },
  data: {
    billingItemId: newBillingItemId,
    procedureCode: newProcedureCode,
    isCoderModified: true,
    updatedBy: coderId,
  },
});

// Mark charge as modified
await prisma.charge.update({
  where: { id: chargeId },
  data: {
    isCoderModified: true,
    codedBy: coderId,
    codedAt: new Date(),
  },
});

// Complete coding session
await prisma.codingSession.update({
  where: { id: sessionId },
  data: {
    status: 'completed',
    completedAt: new Date(),
    updatedBy: coderId,
  },
});
```

### 4.3 Claim Generation

**Location:** Claim generation service

```typescript
async function generateClaim(encounterId: string, tenantId: string) {
  // 1. Create claim header
  const claim = await prisma.claim.create({
    data: {
      tenantId,
      claimNumber: generateClaimNumber(),
      status: 'draft',
      encounterId,
      // ... other claim fields
    },
  });

  // 2. Get coding session (may or may not have been reviewed)
  const codingSession = await prisma.codingSession.findFirst({
    where: { tenantId, encounterId },
    include: {
      diagnoses: {
        where: { usedForBilling: true },
        orderBy: { sequence: 'asc' },
      },
      procedures: {
        orderBy: { sequence: 'asc' },
        include: {
          billingItem: true,
          charges: true,
        },
      },
    },
  });

  if (!codingSession) {
    throw new Error('No coding session found for encounter');
  }

  // 3. Create claim diagnoses
  for (const codingDx of codingSession.diagnoses) {
    await prisma.claimDiagnosis.create({
      data: {
        claimId: claim.id,
        codingDiagnosisId: codingDx.id,
        sequence: codingDx.sequence,
        diagnosisCode: codingDx.diagnosisCode,
        diagnosisCodeType: codingDx.diagnosisCodeType,
        diagnosisDisplay: codingDx.diagnosisDisplay,
        diagnosisType: codingDx.diagnosisType,
        poaFlag: codingDx.poaFlag,
      },
    });
  }

  // 4. Create claim lines
  for (const codingProc of codingSession.procedures) {
    const charge = codingProc.charges[0]; // Assuming 1:1 for now

    await prisma.claimLine.create({
      data: {
        claimId: claim.id,
        codingProcedureId: codingProc.id,
        chargeId: charge?.id,
        lineNumber: codingProc.sequence,
        procedureCode: codingProc.procedureCode,
        procedureCodeType: codingProc.procedureCodeType,
        procedureDescription: codingProc.procedureDisplay,
        modifier1: codingProc.modifier1,
        modifier2: codingProc.modifier2,
        modifier3: codingProc.modifier3,
        modifier4: codingProc.modifier4,
        serviceDate: codingProc.serviceDate,
        units: codingProc.units,
        chargedAmount: charge?.grossAmount || 0,
        providerId: codingProc.providerId,
        placeOfService: codingProc.placeOfService,
      },
    });
  }

  return claim;
}
```

### 4.4 Claim Submission to Payer

When generating the actual EDI 837 or FHIR Claim resource:

```typescript
// Use ClaimDiagnosis and ClaimLine tables (not the coding tables directly)
const claim = await prisma.claim.findUnique({
  where: { id: claimId },
  include: {
    claimDiagnoses: {
      orderBy: { sequence: 'asc' },
    },
    claimLines: {
      orderBy: { lineNumber: 'asc' },
    },
  },
});

// Map to EDI 837 or FHIR
const edi837 = {
  claimNumber: claim.claimNumber,
  diagnoses: claim.claimDiagnoses.map(dx => ({
    code: dx.diagnosisCode,
    type: dx.diagnosisType,
    sequence: dx.sequence,
  })),
  serviceLines: claim.claimLines.map(line => ({
    lineNumber: line.lineNumber,
    procedureCode: line.procedureCode,
    modifiers: [line.modifier1, line.modifier2, line.modifier3, line.modifier4].filter(Boolean),
    units: line.units,
    chargedAmount: line.chargedAmount,
  })),
};
```

## Step 5: Workflow States

### Coding Session Status Flow

```
new
  ↓ (auto-created by posting rules)
auto_generated
  ↓ (assigned to coder)
in_progress
  ↓ (coder completes review)
completed
  ↓ (supervisor approves)
approved
  ↓ (claim can be generated)
```

**Important:** Claims can be generated from sessions in `auto_generated`, `completed`, or `approved` status. This ensures coders never block the revenue cycle.

## Step 6: Reporting & Analytics

### Coding Productivity

```sql
-- Coding sessions per coder per day
SELECT
  assigned_to,
  DATE(completed_at) as coding_date,
  COUNT(*) as sessions_completed
FROM coding_sessions
WHERE status = 'completed'
GROUP BY assigned_to, DATE(completed_at);
```

### Code Changes Tracking

```sql
-- Procedures where coders changed billing item
SELECT
  cp.id,
  cp.billing_item_id as coder_choice,
  c.original_billing_item_id as posting_rule_choice,
  cp.procedure_code,
  cp.updated_by as coder_id
FROM coding_procedures cp
JOIN charges c ON c.coding_procedure_id = cp.id
WHERE c.is_coder_modified = true;
```

### Claim Denial Analysis by Code

```sql
-- Denial rates by procedure code
SELECT
  cl.procedure_code,
  COUNT(*) as total_lines,
  SUM(CASE WHEN cl.adjudication_status = 'denied' THEN 1 ELSE 0 END) as denied_lines,
  ROUND(SUM(CASE WHEN cl.adjudication_status = 'denied' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as denial_rate_pct
FROM claim_lines cl
GROUP BY cl.procedure_code
ORDER BY denial_rate_pct DESC;
```

## Benefits of This Design

1. **Non-blocking:** Auto-seeding means claims can be generated immediately without waiting for coders
2. **Clean separation:** Clinical, financial, and coding data live in appropriate domains
3. **Audit trail:** Every change is tracked in `CodingAuditLog`
4. **Flexible:** Coders can add codes not in source data (e.g., missed comorbidities)
5. **Backwards compatible:** Existing charges and claims continue to work
6. **Compliance-ready:** Supports modifiers, POA flags, diagnosis sequencing required by UAE payers

## Next Steps

1. Add models to `schema.prisma`
2. Run migration
3. Update charge posting logic to auto-seed coding sessions
4. Build coder UI for reviewing/editing coding sessions
5. Update claim generation to read from coding layer
6. Train coders on new workflow
