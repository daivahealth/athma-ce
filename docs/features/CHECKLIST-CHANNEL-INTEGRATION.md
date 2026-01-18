# Checklist Integration with Care Channel Messages

## Overview

Transform checklists into **interactive messages** in the Care Channel, allowing staff to view, fill, submit, and verify checklists directly within the message timeline without navigating away.

---

## User Experience Flow

### 1. Checklist Created → Interactive Message Appears

**Scenario**: Discharge planning initiated

**Care Channel Timeline**:
```
┌────────────────────────────────────────────────────────────┐
│ [SYSTEM] · 2 hours ago                                     │
├────────────────────────────────────────────────────────────┤
│ 📋 Discharge Checklist Created                            │
│                                                            │
│ Status: Not Started (0% complete)                         │
│ Due: Jan 20, 2:00 PM                                      │
│ Assigned to: Nursing Team                                 │
│                                                            │
│ [Open Checklist]  [View Details]                          │
└────────────────────────────────────────────────────────────┘
```

### 2. Nurse Opens Checklist → Inline Form Appears

**Expanded Message**:
```
┌────────────────────────────────────────────────────────────┐
│ [SYSTEM] · 2 hours ago                                     │
├────────────────────────────────────────────────────────────┤
│ 📋 Discharge Checklist                     🟡 In Progress  │
│                                                            │
│ Progress: ████████████░░░░░░░░ 65%                        │
│ Due: Jan 20, 2:00 PM                                      │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ▼ Medical Clearance                                  │ │
│ │   ☑ Medical clearance obtained         [Nurse Sarah] │ │
│ │   👤 Cleared by: Dr. Ahmed              [Select...]  │ │
│ │   📅 Cleared at: Jan 19, 2:30 PM        [DateTime]   │ │
│ │                                                       │ │
│ │ ▼ Medications                                        │ │
│ │   ☑ Medications reconciled              [Nurse Sarah]│ │
│ │   ☑ Discharge prescriptions issued      [Pending]    │ │
│ │                                                       │ │
│ │ ▼ Follow-up Care                                     │ │
│ │   ☐ Follow-up appointment scheduled     [Pending]    │ │
│ │   📅 Appointment date:                  [Select...]  │ │
│ │                                                       │ │
│ │ ... [+3 more sections]                               │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                            │
│ [Save Draft] [Complete & Submit for Approval]             │
└────────────────────────────────────────────────────────────┘
```

### 3. Checklist Submitted → Status Update Message

**Timeline Updates**:
```
┌────────────────────────────────────────────────────────────┐
│ [SYSTEM] · 2 hours ago                                     │
├────────────────────────────────────────────────────────────┤
│ 📋 Discharge Checklist                      ✓ Completed   │
│                                                            │
│ Progress: ████████████████████ 100%                       │
│ Completed by: Nurse Sarah at Jan 19, 3:45 PM             │
│                                                            │
│ ⏳ Awaiting verification from:                            │
│    • Dr. Ahmed (Physician)                                │
│    • Nurse Manager (Charge Nurse)                         │
│                                                            │
│ [View Checklist] [Verify] (if authorized)                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Nurse Sarah · Just now                                     │
├────────────────────────────────────────────────────────────┤
│ ✓ Discharge checklist completed and submitted for review  │
│ All required items have been addressed.                    │
└────────────────────────────────────────────────────────────┘
```

### 4. Doctor Opens Checklist → Read-Only View with Verify Button

**Expanded Message (Read-Only)**:
```
┌────────────────────────────────────────────────────────────┐
│ [SYSTEM] · 2 hours ago                                     │
├────────────────────────────────────────────────────────────┤
│ 📋 Discharge Checklist                      ✓ Completed   │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ▼ Medical Clearance                                  │ │
│ │   ✓ Medical clearance obtained                       │ │
│ │      Completed by: Nurse Sarah at Jan 19, 2:30 PM    │ │
│ │   ✓ Cleared by: Dr. Ahmed                            │ │
│ │   ✓ Cleared at: Jan 19, 2:30 PM                      │ │
│ │                                                       │ │
│ │ ▼ Medications                                        │ │
│ │   ✓ Medications reconciled                           │ │
│ │      Completed by: Nurse Sarah at Jan 19, 2:35 PM    │ │
│ │   ✓ Discharge prescriptions issued                   │ │
│ │      Completed by: Pharmacist John at Jan 19, 3:00 PM│ │
│ │                                                       │ │
│ │ ... [View all sections]                              │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                            │
│ ⚠️ Review all items before verifying this checklist       │
│                                                            │
│ [Download PDF] [Verify Checklist]                         │
└────────────────────────────────────────────────────────────┘
```

### 5. Doctor Verifies → Final Status Update

**Timeline Updates**:
```
┌────────────────────────────────────────────────────────────┐
│ [SYSTEM] · 2 hours ago                                     │
├────────────────────────────────────────────────────────────┤
│ 📋 Discharge Checklist                     ✓✓ Verified    │
│                                                            │
│ Progress: ████████████████████ 100%                       │
│ Completed by: Nurse Sarah at Jan 19, 3:45 PM             │
│ Verified by: Dr. Ahmed at Jan 19, 4:30 PM                 │
│                                                            │
│ ✅ Patient ready for discharge                            │
│                                                            │
│ [View Checklist] [Download PDF]                           │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Dr. Ahmed · Just now                                       │
├────────────────────────────────────────────────────────────┤
│ ✓ Discharge checklist verified                            │
│ Patient meets all discharge criteria. Cleared for discharge│
└────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### 1. Database Schema Updates

#### Add Checklist Linking to Channel Messages

```prisma
model ChannelMessage {
  id                  String   @id @default(uuid()) @db.Uuid
  tenantId            String   @db.Uuid
  facilityId          String   @db.Uuid
  channelId           String   @db.Uuid

  messageType         MessageType  // Add: CHECKLIST
  messageSubtype      String?  @db.VarChar(100)  // checklist_created, checklist_completed, checklist_verified

  bodyText            String?  @db.Text
  payloadJson         Json?    @db.JsonB

  linkedEntityType    String?  @db.VarChar(50)
  linkedEntityId      String?  @db.Uuid

  // NEW: Direct link to checklist instance
  checklistInstanceId String?  @db.Uuid
  checklistInstance   ChecklistInstance? @relation(fields: [checklistInstanceId], references: [id])

  // ... other fields

  @@index([tenantId, channelId, messageType])
  @@index([tenantId, checklistInstanceId])
}
```

#### Update ChecklistInstance to Track Channel Message

```prisma
model ChecklistInstance {
  id                  String                    @id @default(uuid()) @db.Uuid
  tenantId            String                    @db.Uuid

  // ... existing fields ...

  // NEW: Link to channel message
  channelMessageId    String?                   @db.Uuid  // The message that displays this checklist
  channelMessage      ChannelMessage?

  // Relationships
  messages            ChannelMessage[]          // All messages related to this checklist

  // ... rest of schema
}
```

#### New Message Type Enum Value

```prisma
enum MessageType {
  TEXT              // Human chat
  SYSTEM            // System notifications
  CLINICAL_EVENT    // Orders, meds, procedures
  CHECKLIST         // NEW: Interactive checklist message
  TASK              // Future
  ALERT             // Future
  ATTACHMENT        // Future
}
```

---

### 2. Backend Services

#### ChannelEventEmitter Updates

**New Methods**:

```typescript
/**
 * Emit checklist created message
 * Creates an interactive message in the channel
 */
async emitChecklistCreated(
  checklistInstanceId: string,
  channelId: string,
  checklistData: {
    templateName: string;
    category: string;
    dueAt?: string;
    assignedRoles: string[];
  },
  tx: PrismaTransaction,
  context: any
) {
  const idempotencyKey = `checklist_created:${checklistInstanceId}`;

  // Check if message already exists
  const existing = await tx.channelMessage.findUnique({
    where: { idempotencyKey }
  });
  if (existing) {
    return existing;
  }

  // Create interactive message
  const message = await tx.channelMessage.create({
    data: {
      tenantId: context.tenantId,
      facilityId: context.facilityId,
      channelId,
      messageType: MessageType.CHECKLIST,
      messageSubtype: 'checklist_created',
      bodyText: `📋 ${checklistData.templateName} created`,
      payloadJson: {
        checklistInstanceId,
        templateName: checklistData.templateName,
        category: checklistData.category,
        dueAt: checklistData.dueAt,
        assignedRoles: checklistData.assignedRoles,
        status: 'NOT_STARTED',
        completionPercent: 0,
      },
      linkedEntityType: 'checklist_instance',
      linkedEntityId: checklistInstanceId,
      checklistInstanceId, // Direct link
      isSystemMessage: true,
      idempotencyKey,
      visibility: MessageVisibility.CARE_TEAM,
      priority: MessagePriority.NORMAL,
    }
  });

  // Update checklist instance with message link
  await tx.checklistInstance.update({
    where: { id: checklistInstanceId },
    data: { channelMessageId: message.id }
  });

  return message;
}

/**
 * Update checklist message when progress changes
 */
async updateChecklistMessage(
  checklistInstanceId: string,
  updates: {
    status?: string;
    completionPercent?: number;
    completedBy?: string;
    completedAt?: string;
    verifiedBy?: string;
    verifiedAt?: string;
  },
  tx: PrismaTransaction,
  context: any
) {
  // Find the original checklist message
  const originalMessage = await tx.channelMessage.findFirst({
    where: {
      checklistInstanceId,
      messageSubtype: 'checklist_created'
    }
  });

  if (!originalMessage) {
    this.logger.warn(`No message found for checklist ${checklistInstanceId}`);
    return;
  }

  // Update the payload JSON
  const updatedPayload = {
    ...(originalMessage.payloadJson as any),
    ...updates,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: context.userId,
  };

  await tx.channelMessage.update({
    where: { id: originalMessage.id },
    data: {
      payloadJson: updatedPayload,
      updatedAt: new Date(),
    }
  });

  this.logger.log(`Updated checklist message ${originalMessage.id}`);
}

/**
 * Post status change message (completed/verified)
 */
async emitChecklistStatusChange(
  checklistInstanceId: string,
  channelId: string,
  statusChange: {
    from: string;
    to: string;
    changedBy: string;
    changedByName: string;
    timestamp: string;
  },
  tx: PrismaTransaction,
  context: any
) {
  const idempotencyKey = `checklist_status:${checklistInstanceId}:${statusChange.to}`;

  // Create status change message
  await tx.channelMessage.create({
    data: {
      tenantId: context.tenantId,
      facilityId: context.facilityId,
      channelId,
      messageType: MessageType.SYSTEM,
      messageSubtype: `checklist_${statusChange.to.toLowerCase()}`,
      bodyText: this.getStatusChangeMessage(statusChange),
      payloadJson: {
        checklistInstanceId,
        statusChange,
      },
      linkedEntityType: 'checklist_instance',
      linkedEntityId: checklistInstanceId,
      checklistInstanceId,
      authorStaffId: statusChange.changedBy,
      isSystemMessage: true,
      idempotencyKey,
      visibility: MessageVisibility.CARE_TEAM,
      priority: MessagePriority.NORMAL,
    }
  });
}

private getStatusChangeMessage(statusChange: any): string {
  const { to, changedByName } = statusChange;

  switch (to) {
    case 'COMPLETED':
      return `✓ Discharge checklist completed by ${changedByName}. Awaiting verification.`;
    case 'VERIFIED':
      return `✓✓ Discharge checklist verified by ${changedByName}. Patient ready for discharge.`;
    default:
      return `Checklist status updated by ${changedByName}`;
  }
}
```

#### ChecklistResponseService Updates

**Save Response with Message Update**:

```typescript
async saveResponse(
  instanceId: string,
  itemId: string,
  responseData: any,
  context: any
) {
  const result = await this.prisma.$transaction(async (tx) => {
    // Save the response
    const response = await tx.checklistInstanceResponse.upsert({
      where: {
        instanceId_templateItemId: {
          instanceId,
          templateItemId: itemId
        }
      },
      create: {
        tenantId: context.tenantId,
        instanceId,
        templateItemId: itemId,
        ...this.mapResponseData(responseData),
        respondedBy: context.userId,
        respondedAt: new Date(),
      },
      update: {
        ...this.mapResponseData(responseData),
        respondedBy: context.userId,
        respondedAt: new Date(),
      }
    });

    // Recalculate completion percentage
    const completionPercent = await this.calculateCompletion(instanceId, tx);

    // Update instance
    await tx.checklistInstance.update({
      where: { id: instanceId },
      data: {
        status: completionPercent > 0 ? ChecklistInstanceStatus.IN_PROGRESS : ChecklistInstanceStatus.NOT_STARTED,
        completionPercent,
        updatedBy: context.userId,
      }
    });

    // Update the channel message in real-time
    await this.channelEventEmitter.updateChecklistMessage(
      instanceId,
      {
        status: completionPercent === 100 ? 'IN_PROGRESS' : 'IN_PROGRESS',
        completionPercent,
      },
      tx,
      context
    );

    return response;
  });

  return result;
}
```

#### ChecklistIntegrationService Updates

**Complete Instance with Message Update**:

```typescript
async completeInstance(instanceId: string, context: any) {
  const result = await this.prisma.$transaction(async (tx) => {
    const instance = await tx.checklistInstance.findUnique({
      where: { id: instanceId },
      include: { template: true }
    });

    // Update instance status
    const updated = await tx.checklistInstance.update({
      where: { id: instanceId },
      data: {
        status: ChecklistInstanceStatus.COMPLETED,
        completedAt: new Date(),
        completedBy: context.userId,
      }
    });

    // Update the interactive message
    await this.channelEventEmitter.updateChecklistMessage(
      instanceId,
      {
        status: 'COMPLETED',
        completionPercent: 100,
        completedBy: context.userId,
        completedAt: new Date().toISOString(),
      },
      tx,
      context
    );

    // Post status change message
    if (instance.careChannelId) {
      await this.channelEventEmitter.emitChecklistStatusChange(
        instanceId,
        instance.careChannelId,
        {
          from: 'IN_PROGRESS',
          to: 'COMPLETED',
          changedBy: context.userId,
          changedByName: context.userName || 'Staff',
          timestamp: new Date().toISOString(),
        },
        tx,
        context
      );
    }

    // Notify verifiers
    if (instance.template.requiresVerification) {
      await this.notifyVerifiers(instance, instance.template, context);
    }

    return updated;
  });

  return result;
}

/**
 * Verify instance with message update
 */
async verifyInstance(instanceId: string, context: any) {
  // ... validation code ...

  const result = await this.prisma.$transaction(async (tx) => {
    const instance = await tx.checklistInstance.findUnique({
      where: { id: instanceId },
      include: { template: true }
    });

    // Update instance
    const updated = await tx.checklistInstance.update({
      where: { id: instanceId },
      data: {
        status: ChecklistInstanceStatus.VERIFIED,
        verifiedAt: new Date(),
        verifiedBy: context.userId,
      }
    });

    // Update the interactive message
    await this.channelEventEmitter.updateChecklistMessage(
      instanceId,
      {
        status: 'VERIFIED',
        verifiedBy: context.userId,
        verifiedAt: new Date().toISOString(),
      },
      tx,
      context
    );

    // Post verification status message
    if (instance.careChannelId) {
      await this.channelEventEmitter.emitChecklistStatusChange(
        instanceId,
        instance.careChannelId,
        {
          from: 'COMPLETED',
          to: 'VERIFIED',
          changedBy: context.userId,
          changedByName: context.userName || 'Staff',
          timestamp: new Date().toISOString(),
        },
        tx,
        context
      );
    }

    // Update admission status if discharge checklist
    if (instance.admissionId && instance.template.category === ChecklistCategory.DISCHARGE) {
      await tx.inpatientAdmission.update({
        where: { id: instance.admissionId },
        data: {
          dischargeStatus: InpatientDischargeStatus.READY,
          updatedBy: context.userId
        }
      });
    }

    return updated;
  });

  return result;
}
```

---

### 3. Frontend Components

#### ChecklistMessage Component

**File**: `/frontend/src/modules/clinical/components/checklist/ChecklistMessage.tsx`

```tsx
interface ChecklistMessageProps {
  message: ChannelMessage;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ChecklistMessage({ message, isExpanded, onToggle }: ChecklistMessageProps) {
  const payload = message.payloadJson as ChecklistMessagePayload;
  const checklistId = message.checklistInstanceId;

  const { data: checklist } = useChecklistInstance(checklistId);
  const { data: responses } = useChecklistResponses(checklistId);
  const canVerify = useCanVerifyChecklist(checklist);
  const canEdit = useCanEditChecklist(checklist);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">{payload.templateName}</span>
          <ChecklistStatusBadge status={payload.status} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{payload.completionPercent}%</span>
        </div>
        <Progress value={payload.completionPercent} />
      </div>

      {/* Meta Info */}
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {payload.dueAt && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Due: {formatDateTime(payload.dueAt)}</span>
          </div>
        )}
        {payload.completedBy && (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed by: {getStaffName(payload.completedBy)}</span>
          </div>
        )}
        {payload.verifiedBy && (
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified by: {getStaffName(payload.verifiedBy)}</span>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          {canEdit ? (
            <ChecklistForm
              checklistId={checklistId}
              responses={responses}
              onSave={handleSaveResponse}
              onComplete={handleComplete}
            />
          ) : (
            <ChecklistReadOnlyView
              checklist={checklist}
              responses={responses}
            />
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            {payload.status === 'NOT_STARTED' && canEdit && (
              <Button onClick={onToggle}>
                Start Checklist
              </Button>
            )}

            {payload.status === 'IN_PROGRESS' && canEdit && (
              <>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button onClick={handleComplete}>
                  Complete & Submit for Approval
                </Button>
              </>
            )}

            {payload.status === 'COMPLETED' && canVerify && (
              <>
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button onClick={handleVerify}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify Checklist
                </Button>
              </>
            )}

            {payload.status === 'VERIFIED' && (
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Message Timeline Integration

**File**: `/frontend/src/app/[locale]/(clinical)/inpatient/ward-board/[admissionId]/page.tsx`

```tsx
// Inside message rendering loop
{timelineQuery.data?.data?.map((message) => {
  // Handle checklist messages differently
  if (message.messageType === 'CHECKLIST') {
    return (
      <ChecklistMessage
        key={message.id}
        message={message}
        isExpanded={expandedMessages.includes(message.id)}
        onToggle={() => toggleMessage(message.id)}
      />
    );
  }

  // Regular message rendering
  return (
    <RegularMessage key={message.id} message={message} />
  );
})}
```

#### Auto-Expanding on Creation

```tsx
const [expandedMessages, setExpandedMessages] = useState<string[]>([]);

useEffect(() => {
  // Auto-expand newly created checklist messages
  const newChecklistMessages = timelineQuery.data?.data?.filter(
    (msg) => msg.messageType === 'CHECKLIST' &&
            msg.payloadJson?.status === 'NOT_STARTED' &&
            !expandedMessages.includes(msg.id)
  );

  if (newChecklistMessages?.length > 0) {
    setExpandedMessages((prev) => [
      ...prev,
      ...newChecklistMessages.map((msg) => msg.id)
    ]);
  }
}, [timelineQuery.data]);
```

---

### 4. Real-Time Updates

#### WebSocket/Polling for Live Updates

```tsx
// Poll for checklist updates every 5 seconds when expanded
const { data: liveChecklist } = useQuery({
  queryKey: ['checklist-live', checklistId],
  queryFn: () => checklistService.getInstance(checklistId),
  refetchInterval: isExpanded ? 5000 : false,
  enabled: isExpanded && !!checklistId,
});

// Update message payload when checklist changes
useEffect(() => {
  if (liveChecklist && message.payloadJson) {
    const updatedPayload = {
      ...message.payloadJson,
      status: liveChecklist.status,
      completionPercent: liveChecklist.completionPercent,
      completedBy: liveChecklist.completedBy,
      verifiedBy: liveChecklist.verifiedBy,
    };

    // Update local message state
    updateMessagePayload(message.id, updatedPayload);
  }
}, [liveChecklist]);
```

---

### 5. API Endpoints

**New Endpoints**:

```
GET    /api/v1/inpatient/channels/:channelId/messages/:messageId/checklist
       → Get checklist instance from message

POST   /api/v1/inpatient/channels/:channelId/messages/:messageId/checklist/responses
       → Save responses directly from message

POST   /api/v1/inpatient/channels/:channelId/messages/:messageId/checklist/complete
       → Complete checklist from message

POST   /api/v1/inpatient/channels/:channelId/messages/:messageId/checklist/verify
       → Verify checklist from message

GET    /api/v1/inpatient/channels/:channelId/messages/:messageId/checklist/pdf
       → Download checklist as PDF
```

---

## Benefits

| Feature | Before | After (Integrated) |
|---------|--------|-------------------|
| **Navigation** | Navigate to separate page | Fill within channel |
| **Context** | Lost channel conversation | Keep conversation context |
| **Collaboration** | Manual updates | Real-time progress visible |
| **Notifications** | Separate notification system | Channel messages notify team |
| **Audit Trail** | Separate log | Unified timeline |
| **User Experience** | 3-5 clicks | 1-2 clicks |
| **Mobile** | Difficult on mobile | Easy inline editing |

---

## Implementation Priority

### Phase 1 (MVP)
- ✅ Checklist message type
- ✅ Interactive message rendering
- ✅ Inline form for editing
- ✅ Complete/Verify actions
- ✅ Real-time progress updates

### Phase 2 (Enhanced)
- ⏳ PDF download from message
- ⏳ Collaborative editing (multiple users)
- ⏳ @ mentions to assign items
- ⏳ Due date reminders in channel
- ⏳ Smart suggestions based on responses

### Phase 3 (Advanced)
- ⏳ Voice-to-text for responses
- ⏳ Attach images to checklist items
- ⏳ Conditional branching in-message
- ⏳ Mobile app push notifications

---

**This integration makes checklists a first-class citizen in the Care Channel, dramatically improving UX and reducing context switching!**
