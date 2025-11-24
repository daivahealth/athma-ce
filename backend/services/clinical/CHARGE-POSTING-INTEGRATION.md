# Charge Posting Integration Guide

This document explains how to integrate automated charge posting from the Clinical service to the RCM service.

## Overview

The **ChargePostingEmitter** provides a simple HTTP-based mechanism to emit clinical events that trigger automated charge creation in the RCM service based on configured rules.

## Architecture

```
Clinical Service                       RCM Service
┌─────────────────────┐               ┌──────────────────────────┐
│ OrdersService       │               │ ChargePostingController  │
│  └─ createOrder()   │               │   └─ process-event       │
│      │              │   HTTP POST   │         │                │
│      └─ emitEvent() ├──────────────►│  ChargePostingService    │
│                     │               │   └─ processEvent()      │
│ ChargePostingEmitter│               │   └─ findMatchingRules() │
│  (fire & forget)    │               │   └─ createCharges()     │
└─────────────────────┘               └──────────────────────────┘
```

## Setup

### 1. Environment Variables

Add to your `.env` file:

```bash
# RCM Service URL
RCM_SERVICE_URL=http://localhost:3012

# Enable/disable charge posting (default: enabled)
CHARGE_POSTING_ENABLED=true
```

### 2. Import the Emitter

In any Clinical service where you need to trigger charge posting:

```typescript
import { ChargePostingEmitter } from '../../common/billing/charge-posting-emitter';

@Injectable()
export class YourService {
  private readonly chargeEmitter = new ChargePostingEmitter();

  // ... your service methods
}
```

## Usage Examples

### Example 1: Lab Test Order

```typescript
// clinical/src/modules/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { ChargePostingEmitter } from '../../common/billing/charge-posting-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  private readonly chargeEmitter = new ChargePostingEmitter();

  constructor(private readonly prisma: PrismaService) {}

  async createLabTestOrder(tenantId: string, dto: CreateLabOrderDto) {
    // 1. Create the lab test order in Clinical DB
    const order = await this.prisma.order.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        orderType: 'lab_test',
        status: 'pending',
        details: dto,
      },
    });

    // 2. Emit event to RCM service for charge posting (fire and forget)
    this.chargeEmitter.emitLabTestOrder(
      tenantId,
      order.id,
      dto.patientId,
      dto.encounterId,
      {
        testCode: dto.testCode,
        testName: dto.testName,
        quantity: 1,
        urgent: dto.urgent || false,
        category: dto.category,
      }
    ).catch(err => {
      // Event emission failed, but order was created successfully
      // Charges can be posted manually or retried later
      console.error('Charge posting event failed:', err);
    });

    return order;
  }
}
```

### Example 2: Medication Dispensing

```typescript
// clinical/src/modules/pharmacy/pharmacy.service.ts
import { Injectable } from '@nestjs/common';
import { ChargePostingEmitter } from '../../common/billing/charge-posting-emitter';

@Injectable()
export class PharmacyService {
  private readonly chargeEmitter = new ChargePostingEmitter();

  constructor(private readonly prisma: PrismaService) {}

  async dispenseMedication(tenantId: string, dto: DispenseMedicationDto) {
    // 1. Record medication dispense
    const dispense = await this.prisma.medicationDispense.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        medicationId: dto.medicationId,
        quantity: dto.quantity,
        status: 'completed',
      },
    });

    // 2. Emit event for charge posting
    await this.chargeEmitter.emitMedicationDispensed(
      tenantId,
      dispense.id,
      dto.patientId,
      dto.encounterId,
      {
        medicationCode: dto.medicationCode,
        medicationName: dto.medicationName,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        batchNumber: dto.batchNumber,
      }
    );

    return dispense;
  }
}
```

### Example 3: Procedure Performed

```typescript
// clinical/src/modules/encounters/procedures.service.ts
import { Injectable } from '@nestjs/common';
import { ChargePostingEmitter } from '../../common/billing/charge-posting-emitter';

@Injectable()
export class ProceduresService {
  private readonly chargeEmitter = new ChargePostingEmitter();

  async recordProcedure(tenantId: string, dto: RecordProcedureDto) {
    // 1. Record procedure in clinical notes
    const procedure = await this.prisma.procedure.create({
      data: {
        tenantId,
        encounterId: dto.encounterId,
        patientId: dto.patientId,
        procedureCode: dto.procedureCode,
        procedureName: dto.procedureName,
        performedBy: dto.performedBy,
        performedAt: new Date(),
      },
    });

    // 2. Emit event for charge posting
    await this.chargeEmitter.emitProcedurePerformed(
      tenantId,
      procedure.id,
      dto.patientId,
      dto.encounterId,
      {
        procedureCode: dto.procedureCode,
        procedureName: dto.procedureName,
        procedureCategory: dto.category,
        performedBy: dto.performedBy,
        duration: dto.durationMinutes,
      }
    );

    return procedure;
  }
}
```

### Example 4: Imaging Study Order

```typescript
// clinical/src/modules/orders/imaging-orders.service.ts
import { Injectable } from '@nestjs/common';
import { ChargePostingEmitter } from '../../common/billing/charge-posting-emitter';

@Injectable()
export class ImagingOrdersService {
  private readonly chargeEmitter = new ChargePostingEmitter();

  async createImagingOrder(tenantId: string, dto: CreateImagingOrderDto) {
    // 1. Create imaging order
    const order = await this.prisma.order.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        orderType: 'imaging',
        details: dto,
      },
    });

    // 2. Emit event
    await this.chargeEmitter.emitImagingStudyOrder(
      tenantId,
      order.id,
      dto.patientId,
      dto.encounterId,
      {
        studyCode: dto.studyCode,
        studyName: dto.studyName,
        modality: dto.modality,
        bodyPart: dto.bodyPart,
        urgent: dto.urgent,
        contrastRequired: dto.contrastRequired,
      }
    );

    return order;
  }
}
```

### Example 5: Consultation Completion

```typescript
// clinical/src/modules/encounters/encounters.service.ts
import { Injectable } from '@nestjs/common';
import { ChargePostingEmitter } from '../../common/billing/charge-posting-emitter';

@Injectable()
export class EncountersService {
  private readonly chargeEmitter = new ChargePostingEmitter();

  async completeEncounter(tenantId: string, encounterId: string) {
    // 1. Update encounter status
    const encounter = await this.prisma.encounter.update({
      where: { id: encounterId },
      data: { status: 'completed', endTime: new Date() },
    });

    // 2. Emit consultation completion event
    await this.chargeEmitter.emitConsultationCompleted(
      tenantId,
      encounterId,
      encounter.patientId,
      {
        encounterType: encounter.type,
        specialty: encounter.specialty,
        duration: encounter.durationMinutes,
        consultantId: encounter.providerId,
      }
    );

    return encounter;
  }
}
```

### Example 6: Multiple Events (Batch)

```typescript
// When a single action creates multiple charges
async processClinicalAction(tenantId: string, dto: any) {
  const result = await this.prisma.clinicalAction.create({ data: dto });

  // Emit multiple events in parallel
  await this.chargeEmitter.emitEvents(tenantId, [
    {
      eventType: 'lab_test_ordered',
      eventSource: 'order',
      eventId: 'lab-order-123',
      patientId: dto.patientId,
      encounterId: dto.encounterId,
      eventData: { testCode: 'CBC001', testName: 'CBC' },
    },
    {
      eventType: 'imaging_study_ordered',
      eventSource: 'order',
      eventId: 'imaging-order-456',
      patientId: dto.patientId,
      encounterId: dto.encounterId,
      eventData: { studyCode: 'XRAY001', modality: 'X-Ray' },
    },
  ]);

  return result;
}
```

## Helper Methods

The `ChargePostingEmitter` provides convenient helper methods for common scenarios:

| Method | Description |
|--------|-------------|
| `emitLabTestOrder()` | Lab test ordered |
| `emitMedicationDispensed()` | Medication dispensed from pharmacy |
| `emitProcedurePerformed()` | Procedure performed during encounter |
| `emitImagingStudyOrder()` | Imaging study ordered |
| `emitConsultationCompleted()` | Consultation/encounter completed |
| `emitEvent()` | Generic event emitter for custom scenarios |
| `emitEvents()` | Emit multiple events in parallel |

## Error Handling

The emitter is designed as **fire-and-forget** - clinical operations will not fail if charge posting fails.

```typescript
// Option 1: Don't wait for result (fire and forget)
this.chargeEmitter.emitLabTestOrder(/* ... */).catch(err => {
  console.error('Charge posting failed, but clinical operation succeeded', err);
});

// Option 2: Check result (non-blocking)
const success = await this.chargeEmitter.emitLabTestOrder(/* ... */);
if (!success) {
  console.warn('Charge posting failed, manual review may be needed');
}

// Option 3: For critical billing, use try-catch
try {
  await this.chargeEmitter.emitMedicationDispensed(/* ... */);
} catch (error) {
  // Log for manual review/retry
  await this.logFailedChargePosting(error);
}
```

## Logging

The emitter logs important events:

```
[ChargePostingEmitter] Charge posting event emitted: lab_test_ordered for patient abc-123. Matched 1 rules, created 1 charges
[ChargePostingEmitter] RCM service is not available at http://localhost:3012. Event lab_test_ordered for patient abc-123 was not processed. Clinical operations continue normally.
[ChargePostingEmitter] RCM service request timeout for event medication_dispensed. Patient xyz-456. Clinical operations continue normally.
```

## Configuration

### Disable Charge Posting (for testing)

```bash
# In .env
CHARGE_POSTING_ENABLED=false
```

### Change RCM Service URL

```bash
# In .env
RCM_SERVICE_URL=http://rcm-service:3012  # For Docker
RCM_SERVICE_URL=https://rcm.example.com  # For production
```

## Testing

### Unit Tests

```typescript
describe('OrdersService', () => {
  let service: OrdersService;
  let chargeEmitter: ChargePostingEmitter;

  beforeEach(() => {
    chargeEmitter = new ChargePostingEmitter();
    jest.spyOn(chargeEmitter, 'emitLabTestOrder').mockResolvedValue(true);
    service = new OrdersService(chargeEmitter);
  });

  it('should emit charge posting event when order created', async () => {
    const dto = { /* ... */ };
    await service.createLabTestOrder('tenant-123', dto);

    expect(chargeEmitter.emitLabTestOrder).toHaveBeenCalledWith(
      'tenant-123',
      expect.any(String),
      dto.patientId,
      dto.encounterId,
      expect.objectContaining({
        testCode: dto.testCode,
        testName: dto.testName,
      })
    );
  });
});
```

### Integration Tests

```bash
# Start both services
npm run dev --workspace=@zeal/clinical
npm run dev --workspace=@zeal/rcm

# Make a request to Clinical service
curl -X POST http://localhost:3011/api/v1/orders \
  -H "x-tenant-id: test-tenant" \
  -H "Content-Type: application/json" \
  -d '{"patientId":"patient-123","testCode":"CBC001"}'

# Check RCM service logs for charge creation
# Check RCM database for created charges
```

## Troubleshooting

### Issue: Events not creating charges

**Check:**
1. RCM service is running on correct port
2. `RCM_SERVICE_URL` environment variable is correct
3. Charge posting rules exist in RCM database
4. Rules are active (`is_active = true`)
5. Rule conditions match event data

```sql
-- Check active rules
SELECT * FROM charge_posting_rules WHERE tenant_id = 'your-tenant-id' AND is_active = true;

-- Check recent events
SELECT * FROM charge_posting_events ORDER BY created_at DESC LIMIT 10;

-- Check if rules matched
SELECT * FROM charge_posting_audit ORDER BY created_at DESC LIMIT 10;
```

### Issue: Timeout errors

**Solution:** Increase timeout or make truly async:

```typescript
// Increase timeout in emitter constructor
this.timeout = 10000; // 10 seconds
```

### Issue: Too many requests

**Solution:** Implement rate limiting or queue:

```typescript
// Use a queue for high-volume scenarios
import Queue from 'bull';

const queue = new Queue('charge-posting', process.env.REDIS_URL);
await queue.add({ tenantId, event });
```

## Best Practices

1. **Always use try-catch or .catch()** - Don't let billing failures break clinical workflows
2. **Log all emissions** - Makes debugging easier
3. **Include relevant context** - More eventData = more flexible rules
4. **Test with rules disabled** - Verify clinical functionality works independently
5. **Monitor failed events** - Set up alerts for repeated failures
6. **Use helper methods** - They provide consistent event structure

## Next Steps

1. Set up charge posting rules in RCM service (see `CHARGE-POSTING-RULES-EXAMPLES.md`)
2. Test integration with sample orders
3. Monitor logs for successful charge creation
4. Adjust rules based on business requirements
5. Consider adding a retry queue for failed events (Phase 2)

## Support

For issues or questions:
- Check RCM service logs: `/Users/sajithchandran/aira/zeal/backend/services/rcm`
- Review charge posting rules: `GET /api/v1/charge-posting-rules`
- Check event processing: `GET /api/v1/charge-posting-rules/events/all`
- Review audit trail: `GET /api/v1/charge-posting-rules/audit/all`
