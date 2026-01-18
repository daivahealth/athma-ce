# Discharge Workflow with Generic Checklist System

## Complete Discharge Flow

### Current State (Hardcoded Checklist)
```
1. Patient admitted → dischargeStatus: NONE
2. Staff accesses discharge page → Old checklist auto-created
3. Nurse fills checklist
4. Nurse marks "Ready for Discharge"
5. Discharge status → READY
6. Doctor discharges patient → Admission discharged
```

### New State (Generic Checklist System)
```
1. Patient admitted → dischargeStatus: NONE
   - No checklist created yet

2. Staff clicks "Start Discharge Planning" button
   - Calls: PATCH /admissions/:id/discharge-checklist with empty body
   - Backend: dischargeStatus: NONE → INITIATED
   - Trigger: "discharge_planning_initiated"
   - Checklist auto-created from template
   - Care Channel message: "Discharge Checklist created - Due: Jan 20, 2:00 PM"

3. Nurse accesses Checklists tab
   - Shows discharge checklist (status: NOT_STARTED or IN_PROGRESS)
   - Opens checklist form

4. Nurse completes checklist items
   - Auto-saves responses
   - Progress: 0% → 100%
   - Click "Complete Checklist" button

5. Checklist completed
   - Instance status: IN_PROGRESS → COMPLETED
   - Care Channel message: "Discharge Checklist completed by Nurse Sarah (100%)"
   - Notification sent to verifiers (Doctor, Charge Nurse)

6. Doctor/Charge Nurse verifies checklist
   - Opens checklist in read-only mode
   - Reviews all items
   - Clicks "Verify Checklist" button
   - Instance status: COMPLETED → VERIFIED
   - Admission dischargeStatus: INITIATED → READY
   - Care Channel message: "Discharge Checklist verified by Dr. Ahmed - Patient ready for discharge"

7. Doctor clicks "Complete Discharge"
   - Discharge form appears (date, type, destination)
   - Confirms discharge
   - Admission dischargeStatus: READY → CONFIRMED
   - admissionStatus: ADMITTED → DISCHARGED
   - Care Channel closed
```

---

## UI Changes

### Admission Detail Page - Discharge Planning Section

#### Before Discharge Planning (dischargeStatus: NONE)
```
┌─────────────────────────────────────────────────┐
│ Discharge Planning                              │
├─────────────────────────────────────────────────┤
│ No discharge planning initiated                 │
│                                                 │
│ [Start Discharge Planning] button               │
└─────────────────────────────────────────────────┘
```

#### After Discharge Planning Started (dischargeStatus: INITIATED)
```
┌─────────────────────────────────────────────────┐
│ Discharge Planning                    🟡 Planning│
├─────────────────────────────────────────────────┤
│ Discharge Checklist                             │
│ Status: In Progress (65% complete)              │
│ Due: Jan 20, 2:00 PM                           │
│                                                 │
│ [Continue Checklist] button                     │
└─────────────────────────────────────────────────┘
```

#### Checklist Completed, Awaiting Verification
```
┌─────────────────────────────────────────────────┐
│ Discharge Planning              🟡 Planning     │
├─────────────────────────────────────────────────┤
│ Discharge Checklist                             │
│ Status: ✓ Completed (100%) - Awaiting Verification│
│ Completed by: Nurse Sarah at Jan 19, 3:45 PM   │
│                                                 │
│ [Review Checklist] [Verify Checklist] (Doctor) │
└─────────────────────────────────────────────────┘
```

#### Checklist Verified (dischargeStatus: READY)
```
┌─────────────────────────────────────────────────┐
│ Discharge Planning                 🟢 Ready     │
├─────────────────────────────────────────────────┤
│ Discharge Checklist                             │
│ Status: ✓✓ Verified                            │
│ Completed: Nurse Sarah at Jan 19, 3:45 PM      │
│ Verified: Dr. Ahmed at Jan 19, 4:30 PM         │
│                                                 │
│ [View Checklist] [Complete Discharge] (Primary)│
└─────────────────────────────────────────────────┘
```

---

## Backend Integration Points

### 1. Discharge Service (`discharge.service.ts`)

**Current Code** (line 146-152):
```typescript
// If first update to checklist (moving from NONE to INITIATED)
else if (
  !checklist.readyForDischarge &&
  admission.dischargeStatus === InpatientDischargeStatus.NONE
) {
  newDischargeStatus = InpatientDischargeStatus.INITIATED;
  statusChangeReason = 'Discharge planning initiated';
}
```

**Enhanced Code** (with checklist auto-creation):
```typescript
// If first update to checklist (moving from NONE to INITIATED)
else if (
  !checklist.readyForDischarge &&
  admission.dischargeStatus === InpatientDischargeStatus.NONE
) {
  newDischargeStatus = InpatientDischargeStatus.INITIATED;
  statusChangeReason = 'Discharge planning initiated';

  // NEW: Auto-create discharge checklist from template
  await this.checklistIntegrationService.autoCreateChecklists(
    admissionId,
    'discharge_planning_initiated',
    context
  );

  this.logger.log(`Discharge checklist auto-created for admission ${admissionId}`);
}
```

### 2. Checklist Integration Service

**New Method**:
```typescript
async autoCreateChecklists(
  admissionId: string,
  trigger: string,
  context: any
) {
  const { tenantId } = context;

  // Find templates with this trigger
  const templates = await this.prisma.checklistTemplate.findMany({
    where: {
      tenantId,
      status: ChecklistTemplateStatus.ACTIVE,
      autoCreateEnabled: true,
      autoCreateOn: {
        has: trigger // Array contains trigger
      }
    }
  });

  for (const template of templates) {
    // Get admission details for condition evaluation
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId }
    });

    // Check if conditions match (if specified)
    if (template.autoCreateConditions) {
      const conditionsMet = this.evaluateConditions(
        admission,
        template.autoCreateConditions
      );
      if (!conditionsMet) continue;
    }

    // Calculate due date
    const dueAt = template.autoCreateDueHours
      ? addHours(new Date(), template.autoCreateDueHours)
      : null;

    // Create checklist instance
    const instance = await this.checklistInstanceService.createInstance({
      templateId: template.id,
      patientId: admission.patientId,
      admissionId: admission.id,
      encounterId: admission.encounterId,
      context: ChecklistContext.INPATIENT_ADMISSION,
      dueAt,
    }, context);

    // Post to Care Channel
    const channel = await this.prisma.careChannel.findUnique({
      where: { admissionId, tenantId }
    });

    if (channel) {
      await this.channelEventEmitter.emitChecklistCreated(
        instance.id,
        channel.id,
        {
          checklistName: template.name,
          category: template.category,
          dueAt: dueAt?.toISOString()
        },
        null, // No transaction
        context
      );
    }

    this.logger.log(
      `Created checklist instance ${instance.id} from template ${template.code} for admission ${admissionId}`
    );
  }
}
```

### 3. Checklist Completion Integration

**In `ChecklistIntegrationService.completeInstance()`**:
```typescript
async completeInstance(instanceId: string, context: any) {
  const instance = await this.checklistInstanceService.getInstanceById(
    instanceId,
    context.tenantId
  );
  const template = await this.checklistTemplateService.getTemplate(
    instance.templateId,
    context.tenantId
  );

  // Update instance status
  await this.checklistInstanceService.updateInstanceStatus(
    instanceId,
    ChecklistInstanceStatus.COMPLETED,
    context
  );

  // Post to Care Channel
  if (instance.careChannelId) {
    await this.postCompletionToChannel(instanceId, context);
  }

  // If requires verification, send notifications
  if (template.requiresVerification) {
    await this.notifyVerifiers(instance, template, context);
  }

  this.logger.log(`Checklist instance ${instanceId} marked as completed`);
}
```

### 4. Checklist Verification Integration

**In `ChecklistIntegrationService.verifyInstance()`**:
```typescript
async verifyInstance(instanceId: string, context: any) {
  const instance = await this.checklistInstanceService.getInstanceById(
    instanceId,
    context.tenantId
  );
  const template = await this.checklistTemplateService.getTemplate(
    instance.templateId,
    context.tenantId
  );

  // Validate user has verification role
  const userHasRole = this.checkUserRole(
    context.userRoles,
    template.verificationRoles
  );
  if (!userHasRole) {
    throw new ForbiddenException('You do not have permission to verify this checklist');
  }

  // Check self-verification rule
  if (!template.allowSelfVerification && instance.completedBy === context.userId) {
    throw new BadRequestException('You cannot verify your own checklist');
  }

  // Update instance status
  await this.checklistInstanceService.updateInstanceStatus(
    instanceId,
    ChecklistInstanceStatus.VERIFIED,
    context
  );

  // Post verification to Care Channel
  if (instance.careChannelId) {
    await this.postVerificationToChannel(instanceId, context);
  }

  // FOR DISCHARGE CHECKLIST: Update admission discharge status
  if (instance.admissionId && template.category === ChecklistCategory.DISCHARGE) {
    await this.prisma.inpatientAdmission.update({
      where: { id: instance.admissionId },
      data: {
        dischargeStatus: InpatientDischargeStatus.READY,
        updatedBy: context.userId
      }
    });

    this.logger.log(
      `Admission ${instance.admissionId} marked as READY for discharge after checklist verification`
    );
  }

  this.logger.log(`Checklist instance ${instanceId} verified by ${context.userId}`);
}
```

---

## Frontend Implementation

### 1. New Checklist List Component

**File**: `/frontend/src/modules/clinical/components/checklist/ChecklistList.tsx`

```tsx
interface ChecklistListProps {
  admissionId: string;
}

export function ChecklistList({ admissionId }: ChecklistListProps) {
  const { data: checklists, isLoading } = useAdmissionChecklists(admissionId);

  return (
    <div className="space-y-4">
      {checklists?.map((checklist) => (
        <ChecklistCard key={checklist.id} checklist={checklist} />
      ))}
    </div>
  );
}
```

### 2. Checklist Card Component

```tsx
function ChecklistCard({ checklist }) {
  const status = getChecklistStatusBadge(checklist.status);
  const progress = checklist.completionPercent;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{checklist.templateName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {checklist.category}
            </p>
          </div>
          {status}
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={progress} />
        <p className="text-sm mt-2">{progress}% complete</p>

        {checklist.dueAt && (
          <p className="text-sm text-muted-foreground mt-2">
            Due: {formatDateTime(checklist.dueAt)}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          {checklist.status === 'NOT_STARTED' && (
            <Button onClick={() => openChecklist(checklist.id)}>
              Start Checklist
            </Button>
          )}
          {checklist.status === 'IN_PROGRESS' && (
            <Button onClick={() => openChecklist(checklist.id)}>
              Continue Checklist
            </Button>
          )}
          {checklist.status === 'COMPLETED' && (
            <>
              <Button variant="outline" onClick={() => reviewChecklist(checklist.id)}>
                Review
              </Button>
              <Button onClick={() => verifyChecklist(checklist.id)}>
                Verify
              </Button>
            </>
          )}
          {checklist.status === 'VERIFIED' && (
            <Button variant="outline" onClick={() => viewChecklist(checklist.id)}>
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. Start Discharge Planning Button

**In Admission Detail Page**:
```tsx
const handleStartDischargePlanning = async () => {
  try {
    // This will change status NONE → INITIATED and auto-create checklist
    await updateDischargeChecklistMutation.mutateAsync({
      admissionId,
      data: {} // Empty update triggers status change
    });

    toast.success('Discharge planning started');

    // Redirect to checklists tab
    router.push(`/admissions/${admissionId}?tab=checklists`);
  } catch (error) {
    toast.error('Failed to start discharge planning');
  }
};
```

---

## Benefits of This Approach

1. **Intentional Start**: Discharge planning only starts when staff explicitly initiates it
2. **No Waste**: Checklists not created for patients who never get discharged
3. **Clear Timeline**: Checklist due date calculated from planning start, not admission
4. **Better Workflow**: Staff knows exactly when discharge planning began
5. **Audit Trail**: Clear record of who initiated discharge planning and when
6. **Scalable**: Same pattern works for other workflows (pre-op, post-op, etc.)

---

## Testing Checklist

- [ ] Start discharge planning creates checklist
- [ ] Checklist appears in Checklists tab
- [ ] Nurse can fill checklist
- [ ] Auto-save works
- [ ] Progress indicator updates
- [ ] Complete checklist button works
- [ ] Care Channel message posted on completion
- [ ] Verification button only shows for allowed roles
- [ ] Self-verification blocked (if configured)
- [ ] Verification updates discharge status to READY
- [ ] Care Channel message posted on verification
- [ ] Complete Discharge button only enabled when READY
- [ ] Old discharge checklist migrated correctly
