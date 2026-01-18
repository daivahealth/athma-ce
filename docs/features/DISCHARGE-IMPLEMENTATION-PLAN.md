# Discharge Functionality - Implementation Plan

## Executive Summary

**Current Status**: ✅ **Backend is FULLY implemented** | ⚠️ **Frontend is PARTIALLY implemented**

The discharge workflow backend is complete with comprehensive checklist management and discharge confirmation. The frontend has a basic discharge page but needs UI/UX improvements and integration enhancements.

---

## 1. Backend Status (✅ COMPLETE)

### ✅ Implemented Components

#### Database Schema (`DischargeChecklist` model)
Located: `/backend/shared/database-clinical/prisma/schema.prisma`

**Fields include:**
- **Medical Clearance**: `medicalClearance`, `medicalClearedBy`, `medicalClearedAt`
- **Medications**: `medicationsReconciled`, `dischargePrescriptionsIssued`
- **Follow-up Care**: `followUpAppointmentScheduled`, `followUpAppointmentDate`, `followUpPhysician`
- **Patient Education**: `dischargInstructionsProvided`, `patientEducationCompleted`, `educationTopics[]`
- **Equipment**: `dmeOrdered`, `dmeDescription`, `homeHealthOrdered`, `homeHealthAgency`
- **Transportation**: `transportationArranged`, `transportationMode`
- **Administrative**: `billingCleared`, `insuranceNotified`, `medicalRecordsCompleted`
- **Overall Status**: `readyForDischarge`, `dischargeCoordinator`
- **Notes**: `notes`

#### Services (`discharge.service.ts`)

**1. `getDischargeChecklist(admissionId, tenantId)`**
- Auto-creates checklist if not exists
- Returns current checklist state
- All fields default to `false`

**2. `updateDischargeChecklist(admissionId, dto, context)`**
- Updates checklist items
- Manages discharge status workflow:
  - `NONE` → `INITIATED` (when first checklist item updated)
  - `INITIATED` → `READY` (when `readyForDischarge` = true)
  - `READY` → `INITIATED` (when `readyForDischarge` revoked)
- Emits Care Channel message when patient becomes ready
- Atomic transaction ensures data consistency

**3. `dischargePatient(admissionId, dto, context)`**
- Confirms discharge and finalizes admission
- **Atomic Transaction includes:**
  1. Release bed assignment + mark for cleaning
  2. Update admission status → `DISCHARGED`
  3. Update discharge status → `CONFIRMED`
  4. Set `actualDischargeDate`, `dischargeType`, `dischargeDestination`
  5. Calculate and store `lengthOfStayDays`
  6. Clear current location (`currentWardId`, `currentBedId`, `currentSpaceId`)
  7. Update encounter status → `finished`
  8. Log discharge confirmed event
  9. Emit Care Channel discharge confirmed message
  10. Close Care Channel

#### Controller (`discharge.controller.ts`)

**API Endpoints:**
```
GET    /api/v1/inpatient/admissions/:id/discharge-checklist
PATCH  /api/v1/inpatient/admissions/:id/discharge-checklist
POST   /api/v1/inpatient/admissions/:id/discharge
```

#### DTOs

**`DischargePatientDto`:**
```typescript
{
  actualDischargeDate: string;      // ISO datetime
  dischargeType: DischargeType;     // enum
  dischargeDestination: DischargeDestination; // enum
  dischargeNotes?: string;
}
```

**Enums:**
- **DischargeType**: `routine`, `against_medical_advice`, `transfer`, `deceased`, `absconded`
- **DischargeDestination**: `home`, `transfer_facility`, `nursing_home`, `rehabilitation`, `deceased`

**`UpdateDischargeChecklistDto`:**
```typescript
{
  clinicalSummaryCompleted?: boolean;
  dischargeMedicationsOrdered?: boolean;
  followUpAppointmentBooked?: boolean;
  patientEducationProvided?: boolean;
  billingCleared?: boolean;
  transportArranged?: boolean;
  medicalRecordsFinalized?: boolean;
  readyForDischarge?: boolean;
  notes?: string;
}
```

⚠️ **Issue Identified**: The DTO fields don't match the Prisma schema fields exactly. Schema has more detailed fields like `medicalClearance`, `medicationsReconciled`, `dischargePrescriptionsIssued`, etc.

---

## 2. Frontend Status (⚠️ PARTIAL)

### ✅ Currently Implemented

**1. Discharge Page** (`/inpatient/admissions/[id]/discharge/page.tsx`)
- Basic checklist form with 8 checkbox items
- Discharge confirmation form
- Uses React Hook Form + Zod validation
- Basic toast notifications

**2. React Query Hooks** (`use-inpatient.ts`)
- `useDischargeChecklist(admissionId)` - Fetch checklist
- `useUpdateDischargeChecklist(admissionId)` - Update checklist mutation
- `useDischargePatient(admissionId)` - Discharge patient mutation

**3. TypeScript Types** (`inpatient.ts`)
- `DischargePatientInput`
- `UpdateDischargeChecklistInput`
- Enums: `DischargeType`, `DischargeDestination`

### ❌ Missing / Needs Improvement

1. **Schema Alignment**
   - Frontend DTO doesn't match backend schema fields
   - Missing fields: `medicalClearance`, `medicationsReconciled`, `dischargePrescriptionsIssued`, etc.
   - DTO has generic names vs. detailed schema fields

2. **UI/UX Enhancements**
   - No visual progress indicator for checklist completion
   - No grouping of related checklist items
   - No conditional fields (e.g., follow-up appointment date picker when appointment scheduled)
   - No discharge coordinator assignment
   - No confirmation dialog before final discharge

3. **Navigation & Integration**
   - No link to discharge page from admission detail page
   - No link from ward board patient view
   - No discharge status badge on patient cards
   - No "Ready for Discharge" visual indicator

4. **Validation & Business Rules**
   - No warning if discharging without completed checklist
   - No validation of discharge date (cannot be before admission date)
   - No check if patient has active orders

5. **Audit & History**
   - No discharge history/timeline view
   - No display of who completed checklist items
   - No timestamps for checklist item completion

---

## 3. Implementation Plan - Frontend Improvements

### Phase 1: Fix Schema Alignment (Priority: HIGH)

**Task 1.1: Update DTO to Match Schema**
- File: `/frontend/src/modules/clinical/types/inpatient.ts`
- Add all missing fields from Prisma schema
- Create proper TypeScript interfaces

**Task 1.2: Update Discharge Checklist Form**
- File: `/frontend/src/app/[locale]/(clinical)/inpatient/admissions/[id]/discharge/page.tsx`
- Group checklist items by category:
  - Medical Clearance
  - Medications
  - Follow-up Care
  - Patient Education
  - Equipment & Supplies
  - Transportation
  - Administrative
- Add conditional fields (e.g., follow-up date picker, DME description)

**Task 1.3: Update Backend DTO (if needed)**
- File: `/backend/services/clinical/src/modules/inpatient/dto/update-discharge-checklist.dto.ts`
- Expand DTO to include all schema fields
- Ensure DTO accepts all fields from Prisma model

**Estimated Time**: 1 day

---

### Phase 2: UI/UX Improvements (Priority: HIGH)

**Task 2.1: Add Progress Indicator**
- Create a visual progress bar showing checklist completion percentage
- Highlight required vs. optional items
- Show "Ready for Discharge" status prominently

**Task 2.2: Improve Checklist Layout**
- Use Accordion component for each category
- Show completed count per category
- Add icons for each category

**Task 2.3: Add Discharge Coordinator**
- Add staff dropdown to assign discharge coordinator
- Display coordinator info on checklist

**Task 2.4: Add Confirmation Dialog**
- Confirmation dialog before final discharge with summary:
  - Patient name
  - Admission number
  - Length of stay
  - Checklist completion status
  - Discharge type and destination

**Task 2.5: Add Conditional Fields**
- Follow-up appointment date picker (when followUpAppointmentScheduled = true)
- Follow-up physician selector
- DME description textarea (when dmeOrdered = true)
- Home health agency input (when homeHealthOrdered = true)
- Transportation mode selector (when transportationArranged = true)

**Estimated Time**: 2-3 days

---

### Phase 3: Navigation & Integration (Priority: MEDIUM)

**Task 3.1: Add Discharge Actions to Admission Detail Page**
- File: `/frontend/src/app/[locale]/(clinical)/inpatient/admissions/[id]/page.tsx`
- Add "Discharge" button/tab
- Show discharge status badge
- Display discharge readiness indicator

**Task 3.2: Add Discharge Actions to Ward Board**
- File: `/frontend/src/app/[locale]/(clinical)/inpatient/ward-board/[admissionId]/page.tsx`
- Add "Discharge" action button
- Show discharge status in patient card

**Task 3.3: Add Discharge Filter to Admissions List**
- File: `/frontend/src/app/[locale]/(clinical)/inpatient/admissions/page.tsx`
- Filter by discharge status (None, Initiated, Ready, Confirmed)
- Show discharge status in table

**Estimated Time**: 1 day

---

### Phase 4: Validation & Business Rules (Priority: MEDIUM)

**Task 4.1: Add Pre-Discharge Validation**
- Check if checklist is complete (warning if not)
- Validate discharge date is not before admission date
- Check for active clinical orders
- Display validation warnings in UI

**Task 4.2: Add Discharge Warnings**
- Alert if discharging against medical advice
- Alert if billing not cleared
- Alert if follow-up appointment not scheduled

**Task 4.3: Add Date Validations**
- Discharge date cannot be in the future (beyond current time + buffer)
- Discharge date cannot be before admission date
- Follow-up appointment must be after discharge date

**Estimated Time**: 1 day

---

### Phase 5: Audit & History (Priority: LOW)

**Task 5.1: Add Discharge Timeline View**
- Show checklist item completion history
- Display who completed each item and when
- Show status changes (Initiated → Ready → Confirmed)

**Task 5.2: Add Discharge Summary View**
- Read-only summary after discharge confirmation
- Show all discharge details
- Display final checklist state
- Show length of stay calculation

**Task 5.3: Add Audit Trail**
- Track all checklist updates
- Show modification history
- Display discharge coordinator assignments

**Estimated Time**: 2 days

---

### Phase 6: Care Channel Integration (Priority: LOW - Already Done in Backend)

**Backend Already Handles:**
- ✅ Emits discharge intimation message when `readyForDischarge` = true
- ✅ Emits discharge confirmed message when patient discharged
- ✅ Closes Care Channel on discharge

**Frontend Tasks:**
- Ensure discharge messages display correctly in Care Channel timeline
- Add visual distinction for discharge-related messages
- Link from discharge message to discharge summary

**Estimated Time**: 0.5 day

---

## 4. Critical Files Reference

### Backend Files (✅ Complete - No Changes Needed)
```
/backend/services/clinical/src/modules/inpatient/
  ├── discharge.service.ts           (✅ Complete)
  ├── discharge.controller.ts        (✅ Complete)
  └── dto/
      ├── discharge-patient.dto.ts   (✅ Complete)
      └── update-discharge-checklist.dto.ts (⚠️ May need expansion)

/backend/shared/database-clinical/prisma/
  └── schema.prisma                  (✅ DischargeChecklist model complete)
```

### Frontend Files to Modify
```
/frontend/src/modules/clinical/
  ├── types/inpatient.ts             (❌ Needs schema alignment)
  ├── services/inpatient-service.ts  (✅ Already complete)
  └── hooks/use-inpatient.ts         (✅ Already complete)

/frontend/src/app/[locale]/(clinical)/inpatient/
  ├── admissions/[id]/
  │   ├── page.tsx                   (⚠️ Add discharge actions)
  │   └── discharge/
  │       └── page.tsx               (❌ Major improvements needed)
  ├── admissions/page.tsx            (⚠️ Add discharge status filter)
  └── ward-board/[admissionId]/
      └── page.tsx                   (⚠️ Add discharge action button)
```

### New Frontend Files to Create
```
/frontend/src/modules/clinical/components/
  ├── discharge-checklist-form.tsx   (New - Enhanced form component)
  ├── discharge-confirmation-dialog.tsx (New - Confirmation modal)
  ├── discharge-progress-indicator.tsx (New - Progress bar)
  └── discharge-summary-view.tsx     (New - Read-only summary)
```

---

## 5. Testing Checklist

### Backend Testing (Already Complete)
- ✅ Get checklist (auto-create if not exists)
- ✅ Update checklist items
- ✅ Discharge status workflow (NONE → INITIATED → READY)
- ✅ Discharge patient (full transaction)
- ✅ Care Channel message emission
- ✅ Bed release and cleaning flag
- ✅ Encounter status update

### Frontend Testing Needed
- [ ] Checklist CRUD operations
- [ ] All schema fields display and save correctly
- [ ] Conditional fields show/hide properly
- [ ] Progress indicator updates accurately
- [ ] Discharge confirmation dialog shows correct summary
- [ ] Validation warnings display appropriately
- [ ] Navigation from admission detail to discharge page
- [ ] Navigation from ward board to discharge page
- [ ] Discharge status filters work correctly
- [ ] Post-discharge summary view displays all data
- [ ] Care Channel messages appear correctly

---

## 6. Deployment Considerations

### Database Migrations
- ✅ No migrations needed - schema already deployed

### Backend Deployment
- ✅ No changes needed - already production-ready
- ⚠️ Consider adding API documentation (Swagger)

### Frontend Deployment
- Build and deploy after completing phases
- Test in staging environment first
- Monitor error logs for API integration issues

---

## 7. Future Enhancements (Post-MVP)

1. **Discharge Summary Document Generation**
   - Generate PDF discharge summary
   - Include medications, instructions, follow-up details
   - Patient-friendly format

2. **Email/SMS Notifications**
   - Notify patient when discharge is ready
   - Send follow-up appointment reminder
   - Discharge instructions via email

3. **Discharge Planning Workflow**
   - Multi-day discharge planning timeline
   - Assign tasks to specific staff members
   - Track task completion

4. **Analytics Dashboard**
   - Average length of stay by ward/diagnosis
   - Discharge readiness metrics
   - Discharge destination statistics
   - Re-admission tracking

5. **Integration with External Systems**
   - Home health agency integration
   - DME ordering integration
   - Pharmacy discharge prescription integration
   - Follow-up appointment auto-scheduling

---

## 8. Estimated Timeline

| Phase | Priority | Estimated Time | Dependencies |
|-------|----------|----------------|--------------|
| Phase 1: Schema Alignment | HIGH | 1 day | None |
| Phase 2: UI/UX Improvements | HIGH | 2-3 days | Phase 1 |
| Phase 3: Navigation & Integration | MEDIUM | 1 day | Phase 2 |
| Phase 4: Validation & Business Rules | MEDIUM | 1 day | Phase 1 |
| Phase 5: Audit & History | LOW | 2 days | Phase 2 |
| Phase 6: Care Channel Integration | LOW | 0.5 day | Phase 2 |

**Total Estimated Time**: 7.5 - 8.5 days (1.5 - 2 weeks)

**Recommended Sequence**:
1. **Week 1**: Phase 1 + Phase 2 (Core functionality)
2. **Week 2**: Phase 3 + Phase 4 (Integration & Validation)
3. **Future Sprint**: Phase 5 + Phase 6 (Polish & Advanced Features)

---

## 9. Next Steps

### Immediate Actions
1. ✅ Review backend implementation (Already complete)
2. 🔲 Fix schema alignment (Phase 1, Task 1.1-1.3)
3. 🔲 Improve discharge checklist form UI (Phase 2, Task 2.1-2.5)
4. 🔲 Add discharge actions to admission detail page (Phase 3, Task 3.1)

### Recommended Starting Point
**Start with Phase 1 (Schema Alignment)** to ensure frontend matches backend capabilities, then proceed to Phase 2 for immediate user-facing improvements.

---

## 10. Questions for Stakeholders

1. **Checklist Requirements**
   - Are all checklist items required or some optional?
   - Should we enforce all items completed before discharge?
   - Should different discharge types have different checklist requirements?

2. **Workflow Permissions**
   - Who can update the discharge checklist? (All care team members or specific roles?)
   - Who can confirm final discharge? (Attending physician only or also charge nurse?)
   - Should there be approval workflow before discharge?

3. **Follow-up Care**
   - Should we integrate with appointment scheduling system for follow-up?
   - Should we enforce follow-up appointment before discharge?

4. **Billing Integration**
   - Should we integrate with RCM service for billing clearance status?
   - Should we block discharge if billing not cleared?

5. **Reporting Requirements**
   - What discharge metrics/reports are needed?
   - Should we track re-admission rates?
   - Need export functionality for discharge summaries?

---

**Document Version**: 1.0
**Last Updated**: 2026-01-17
**Author**: Claude Code Assistant
**Status**: Ready for Implementation
