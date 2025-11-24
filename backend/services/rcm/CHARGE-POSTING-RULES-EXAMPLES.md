# Charge Posting Rules - Configuration Examples

This document provides real-world examples of charge posting rules for automating charge creation based on clinical events.

## Table of Contents

- [Rule Structure](#rule-structure)
- [Common Scenarios](#common-scenarios)
  - [Lab Test Orders](#1-lab-test-orders)
  - [Medication Dispensing](#2-medication-dispensing)
  - [Procedure Performance](#3-procedure-performance)
  - [Imaging Study Orders](#4-imaging-study-orders)
  - [Daily Bed Charges](#5-daily-bed-charges)
  - [Consultation Fees](#6-consultation-fees)
- [Advanced Rules](#advanced-rules)
  - [Tiered Pricing](#tiered-pricing)
  - [Conditional Discounts](#conditional-discounts)
  - [Emergency Surcharges](#emergency-surcharges)

## Rule Structure

Every charge posting rule has the following key components:

```typescript
{
  ruleName: string;              // Descriptive name
  eventType: EventType;          // What clinical event triggers this
  eventSource: EventSource;      // Where the event originates
  billingItemType: BillingItemType; // Type of billing item to create
  billingItemId?: string;        // Specific item (or null for dynamic lookup)
  conditions?: object;           // JSONB conditions for matching
  chargeCalculationMethod: string; // How to calculate the charge
  priceSource: string;           // Where to get the price
  quantitySource: string;        // Where to get the quantity
  priority: number;              // Rule execution priority
  isActive: boolean;             // Whether rule is enabled
}
```

## Common Scenarios

### 1. Lab Test Orders

**Scenario**: Automatically create a charge when a lab test is ordered during an encounter.

```json
{
  "ruleName": "Lab Test - CBC with Differential",
  "eventType": "lab_test_ordered",
  "eventSource": "order",
  "billingItemType": "lab_test",
  "billingItemId": null,
  "conditions": {
    "eventData.testCode": { "$eq": "CBC001" }
  },
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "event",
  "discountPercentage": 0,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 10,
  "autoApprove": true,
  "description": "Create charge for CBC with Differential test"
}
```

**Event Payload Example**:
```json
{
  "eventType": "lab_test_ordered",
  "eventSource": "order",
  "eventId": "order-uuid-123",
  "patientId": "patient-uuid-456",
  "encounterId": "encounter-uuid-789",
  "eventData": {
    "testCode": "CBC001",
    "testName": "Complete Blood Count with Differential",
    "quantity": 1,
    "urgent": false
  }
}
```

### 2. Medication Dispensing

**Scenario**: Create charge when pharmacy dispenses medication.

```json
{
  "ruleName": "Pharmacy - Medication Dispensing",
  "eventType": "medication_dispensed",
  "eventSource": "pharmacy",
  "billingItemType": "medication",
  "billingItemId": null,
  "conditions": null,
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "event",
  "discountPercentage": 0,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 10,
  "autoApprove": true,
  "description": "Create charge for all dispensed medications"
}
```

**Event Payload Example**:
```json
{
  "eventType": "medication_dispensed",
  "eventSource": "pharmacy",
  "eventId": "dispense-uuid-123",
  "patientId": "patient-uuid-456",
  "encounterId": "encounter-uuid-789",
  "eventData": {
    "medicationCode": "MED-PARACETAMOL-500",
    "medicationName": "Paracetamol 500mg Tablet",
    "quantity": 20,
    "unitPrice": 0.50
  }
}
```

### 3. Procedure Performance

**Scenario**: Charge for minor procedures performed during encounter.

```json
{
  "ruleName": "Procedure - Minor Surgery",
  "eventType": "procedure_performed",
  "eventSource": "encounter",
  "billingItemType": "procedure",
  "billingItemId": null,
  "conditions": {
    "eventData.procedureCategory": { "$eq": "minor_surgery" }
  },
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "fixed",
  "discountPercentage": 0,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 10,
  "autoApprove": false,
  "description": "Charge for minor surgical procedures (requires approval)",
  "configuration": {
    "fixedQuantity": 1
  }
}
```

### 4. Imaging Study Orders

**Scenario**: Charge for X-ray with urgent surcharge.

```json
{
  "ruleName": "Imaging - X-Ray Urgent",
  "eventType": "imaging_study_ordered",
  "eventSource": "order",
  "billingItemType": "imaging_study",
  "billingItemId": null,
  "conditions": {
    "eventData.modality": { "$eq": "X-Ray" },
    "eventData.urgent": { "$eq": true }
  },
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "event",
  "discountPercentage": 0,
  "taxPercentage": 25,
  "isActive": true,
  "priority": 20,
  "autoApprove": true,
  "description": "X-Ray with 25% urgent surcharge"
}
```

### 5. Daily Bed Charges

**Scenario**: Automatic daily bed charge for inpatients.

```json
{
  "ruleName": "Daily Bed Charge - General Ward",
  "eventType": "daily_bed_charge",
  "eventSource": "scheduler",
  "billingItemType": "bed_charge",
  "billingItemId": "bed-general-ward-uuid",
  "conditions": {
    "eventData.wardType": { "$eq": "general" }
  },
  "chargeCalculationMethod": "fixed",
  "basePrice": 100.00,
  "priceSource": "custom",
  "quantitySource": "event",
  "discountPercentage": 0,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 5,
  "autoApprove": true,
  "description": "Daily bed charge for general ward (AED 100/day)"
}
```

### 6. Consultation Fees

**Scenario**: Charge consultation fee when encounter is completed.

```json
{
  "ruleName": "Consultation - Specialist Visit",
  "eventType": "consultation_completed",
  "eventSource": "encounter",
  "billingItemType": "consultation",
  "billingItemId": null,
  "conditions": {
    "eventData.encounterType": { "$eq": "specialist" }
  },
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "fixed",
  "discountPercentage": 0,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 10,
  "autoApprove": true,
  "description": "Charge for specialist consultation",
  "configuration": {
    "fixedQuantity": 1
  }
}
```

## Advanced Rules

### Tiered Pricing

**Scenario**: Charge different prices based on patient type (insured vs. cash).

```json
{
  "ruleName": "Lab Test - Tiered Pricing for Cash Patients",
  "eventType": "lab_test_ordered",
  "eventSource": "order",
  "billingItemType": "lab_test",
  "billingItemId": null,
  "conditions": {
    "eventData.testCategory": { "$eq": "hematology" },
    "eventData.patientType": { "$eq": "cash" }
  },
  "chargeCalculationMethod": "tiered_pricing",
  "priceSource": "custom",
  "quantitySource": "event",
  "discountPercentage": 10,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 15,
  "autoApprove": true,
  "description": "10% discount for cash-paying patients on hematology tests",
  "configuration": {
    "pricingTiers": [
      { "condition": { "patientType": "cash" }, "discountPercent": 10 },
      { "condition": { "patientType": "insured" }, "discountPercent": 0 }
    ]
  }
}
```

### Conditional Discounts

**Scenario**: Apply discount for package deals.

```json
{
  "ruleName": "Package Discount - Comprehensive Health Check",
  "eventType": "lab_test_ordered",
  "eventSource": "order",
  "billingItemType": "lab_test",
  "billingItemId": null,
  "conditions": {
    "eventData.packageCode": { "$eq": "HEALTH-CHECK-COMPREHENSIVE" }
  },
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "event",
  "discountPercentage": 20,
  "taxPercentage": 0,
  "isActive": true,
  "priority": 25,
  "autoApprove": true,
  "description": "20% discount when ordered as part of comprehensive health check package"
}
```

### Emergency Surcharges

**Scenario**: Add surcharge for emergency procedures.

```json
{
  "ruleName": "Emergency Surcharge - After Hours",
  "eventType": "procedure_performed",
  "eventSource": "encounter",
  "billingItemType": "procedure",
  "billingItemId": null,
  "conditions": {
    "eventData.emergency": { "$eq": true },
    "eventData.timeOfDay": { "$in": ["night", "weekend"] }
  },
  "chargeCalculationMethod": "catalog_price",
  "priceSource": "catalog",
  "quantitySource": "event",
  "discountPercentage": 0,
  "taxPercentage": 50,
  "isActive": true,
  "priority": 30,
  "autoApprove": true,
  "description": "50% surcharge for emergency procedures after hours"
}
```

## Condition Operators

The `conditions` field supports MongoDB-style query operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equals | `{"field": {"$eq": "value"}}` |
| `$ne` | Not equals | `{"field": {"$ne": "value"}}` |
| `$gt` | Greater than | `{"field": {"$gt": 100}}` |
| `$gte` | Greater than or equal | `{"field": {"$gte": 100}}` |
| `$lt` | Less than | `{"field": {"$lt": 100}}` |
| `$lte` | Less than or equal | `{"field": {"$lte": 100}}` |
| `$in` | In array | `{"field": {"$in": ["val1", "val2"]}}` |

## Priority Rules

- **Higher priority number = Executes first**
- Priority 30: Emergency/urgent rules
- Priority 20: Special conditions (package deals, urgent services)
- Priority 10: Standard rules
- Priority 5: Default/fallback rules

## Testing Rules

### Test Endpoint

```bash
POST /api/v1/charge-posting-rules/process-event
Content-Type: application/json
x-tenant-id: your-tenant-id

{
  "eventType": "lab_test_ordered",
  "eventSource": "order",
  "eventId": "test-order-123",
  "patientId": "patient-456",
  "encounterId": "encounter-789",
  "eventData": {
    "testCode": "CBC001",
    "testName": "Complete Blood Count",
    "quantity": 1,
    "urgent": false
  }
}
```

### Expected Response

```json
{
  "success": true,
  "rulesMatched": 1,
  "chargesCreated": 1,
  "charges": [
    {
      "chargeId": "charge-uuid-xyz",
      "billingItemId": "billing-item-uuid-abc",
      "quantity": 1,
      "unitPrice": 50.00,
      "grossAmount": 50.00,
      "ruleId": "rule-uuid-def",
      "ruleName": "Lab Test - CBC with Differential"
    }
  ]
}
```

## Best Practices

1. **Start with specific rules, then add general ones**
   - Specific rules should have higher priority
   - General fallback rules should have lower priority

2. **Use conditions wisely**
   - Keep conditions simple and testable
   - Document expected event data structure

3. **Test rules in development first**
   - Use `autoApprove: false` initially
   - Review charges before enabling auto-approval

4. **Monitor rule performance**
   - Use statistics endpoints to track:
     - Rules matched vs. charges created
     - Failed rule executions
     - Average processing time

5. **Audit trail**
   - Always check `charge_posting_audit` table
   - Verify charges were created by correct rules
   - Review condition matching for debugging

## API Endpoints Summary

- `POST /charge-posting-rules` - Create new rule
- `GET /charge-posting-rules` - List all rules
- `GET /charge-posting-rules/:id` - Get specific rule
- `PUT /charge-posting-rules/:id` - Update rule
- `DELETE /charge-posting-rules/:id` - Delete rule
- `PUT /charge-posting-rules/:id/activate` - Activate rule
- `PUT /charge-posting-rules/:id/deactivate` - Deactivate rule
- `POST /charge-posting-rules/process-event` - Process clinical event
- `GET /charge-posting-rules/events/all` - List all events
- `GET /charge-posting-rules/audit/all` - List all audit records
- `GET /charge-posting-rules/statistics/rules` - Get rule statistics
