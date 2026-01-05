# Inpatient Admission - UI Flow & Frontend Integration

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Implementation Guide

---

## Overview

This document describes the frontend UI flow for creating inpatient admissions with two options:
1. **Create New Encounter** (Default) - Automatically creates a new inpatient encounter
2. **Link to Existing Encounter** - Links to an active ER/OPD encounter

---

## UI Components Required

### 1. Admission Form

Main admission form with encounter selection option.

**Location:** `/frontend/src/app/[locale]/(clinical)/inpatient/admissions/new/page.tsx`

**Form Fields:**

```typescript
interface AdmissionFormData {
  // Patient Selection
  patientId: string;

  // Encounter Option (Radio Button Group)
  encounterOption: 'create_new' | 'link_existing'; // Default: 'create_new'
  encounterId?: string; // Only required if encounterOption = 'link_existing'

  // Admission Details
  admissionDate: Date;
  admissionType: 'elective' | 'emergency' | 'maternity' | 'day_case' | 'transfer';
  admissionSource: 'emergency_room' | 'outpatient_dept' | 'transfer_in' | 'direct' | 'physician_referral';

  // Clinical Team
  attendingPhysicianId: string;
  primaryNurseId?: string;

  // Initial Location
  initialWardId: string;
  initialBedId: string;

  // Optional Fields
  clinicalAlerts?: string[];
  isolationType?: 'contact' | 'droplet' | 'airborne' | 'protective';
  fallRiskScore?: number; // 1-5
  vitalsFrequency?: 'q1h' | 'q2h' | 'q4h' | 'q8h' | 'q12h' | 'daily';
  insuranceAuthNumber?: string;
  estimatedCost?: number;
}
```

---

## UI Flow

### Step 1: Patient Selection

```tsx
// Select patient first (required)
<PatientSearchSelect
  name="patientId"
  label="Patient"
  required
  onChange={(patientId) => {
    setSelectedPatient(patientId);
    // Enable encounter options once patient is selected
  }}
/>
```

### Step 2: Encounter Selection (Radio Button Group)

**Default:** "Create New Encounter"

```tsx
<RadioGroup
  name="encounterOption"
  defaultValue="create_new"
  onChange={(value) => setEncounterOption(value)}
>
  <RadioItem value="create_new">
    <div>
      <strong>Create New Encounter</strong>
      <p className="text-sm text-muted-foreground">
        Start a new inpatient encounter for this admission
      </p>
    </div>
  </RadioItem>

  <RadioItem value="link_existing">
    <div>
      <strong>Link to Existing Encounter</strong>
      <p className="text-sm text-muted-foreground">
        Link to an active ER/OPD encounter (e.g., patient transferred from ER)
      </p>
    </div>
  </RadioItem>
</RadioGroup>

{/* Show encounter selector if "link_existing" is selected */}
{encounterOption === 'link_existing' && (
  <Button
    type="button"
    variant="outline"
    onClick={() => setShowEncounterModal(true)}
    disabled={!selectedPatient}
  >
    {selectedEncounter
      ? `Selected: ${selectedEncounter.encounterNumber}`
      : 'Select Encounter'
    }
  </Button>
)}
```

---

## Encounter Selection Modal

### Modal Component

**Location:** `/frontend/src/modules/clinical/components/EncounterSelectionModal.tsx`

**Purpose:** Display active encounters for the selected patient

### API Call

```typescript
// GET /encounters/patient/:patientId/active
const fetchActiveEncounters = async (patientId: string) => {
  const response = await clinicalApi.get(
    `/encounters/patient/${patientId}/active`
  );
  return response.data;
};
```

### API Response

```json
[
  {
    "id": "uuid",
    "encounterNumber": "ENC-2026-001234",
    "encounterClass": "EMER",
    "encounterType": "emergency",
    "status": "in-progress",
    "startTime": "2026-01-05T08:30:00Z",
    "encounterSource": "emergency",
    "chiefComplaint": "Chest pain",
    "primaryStaffId": "uuid",
    "appointment": {
      "id": "uuid",
      "appointmentType": "emergency",
      "status": "checked-in"
    }
  },
  {
    "id": "uuid",
    "encounterNumber": "ENC-2026-001235",
    "encounterClass": "AMB",
    "encounterType": "outpatient",
    "status": "arrived",
    "startTime": "2026-01-05T10:00:00Z",
    "encounterSource": "appointment",
    "chiefComplaint": "Follow-up consultation",
    "primaryStaffId": "uuid",
    "appointment": {
      "id": "uuid",
      "appointmentType": "follow_up",
      "status": "checked-in"
    }
  }
]
```

### Modal UI

```tsx
<Dialog open={showEncounterModal} onOpenChange={setShowEncounterModal}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Select Active Encounter</DialogTitle>
      <DialogDescription>
        Choose an active encounter to link to this admission
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-2">
      {activeEncounters.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Encounters</AlertTitle>
          <AlertDescription>
            This patient has no active encounters. Please create a new encounter.
          </AlertDescription>
        </Alert>
      ) : (
        activeEncounters.map((encounter) => (
          <Card
            key={encounter.id}
            className="cursor-pointer hover:bg-accent"
            onClick={() => {
              setSelectedEncounter(encounter);
              setShowEncounterModal(false);
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {encounter.encounterNumber}
                  </CardTitle>
                  <CardDescription>
                    {formatEncounterClass(encounter.encounterClass)} - {encounter.encounterType}
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(encounter.status)}>
                  {encounter.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <span className="ml-2">
                    {formatDateTime(encounter.startTime)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <span className="ml-2">
                    {formatEncounterSource(encounter.encounterSource)}
                  </span>
                </div>
                {encounter.chiefComplaint && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Chief Complaint:</span>
                    <span className="ml-2">{encounter.chiefComplaint}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setShowEncounterModal(false)}>
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Form Submission

### Scenario 1: Create New Encounter (Default)

**API Call:**
```typescript
const admissionData = {
  patientId: formData.patientId,
  // encounterId NOT included - backend creates new encounter
  admissionDate: formData.admissionDate,
  admissionType: formData.admissionType,
  admissionSource: formData.admissionSource,
  attendingPhysicianId: formData.attendingPhysicianId,
  primaryNurseId: formData.primaryNurseId,
  initialWardId: formData.initialWardId,
  initialBedId: formData.initialBedId,
  // ... other fields
};

const response = await clinicalApi.post('/v1/inpatient/admissions', admissionData);
```

**Backend Behavior:**
- Creates new Encounter with `encounterClass: 'IMP'` and `encounterType: 'inpatient_admission'`
- Auto-generates encounter number (e.g., ENC-2026-001234)
- Links admission to new encounter

### Scenario 2: Link to Existing Encounter

**API Call:**
```typescript
const admissionData = {
  patientId: formData.patientId,
  encounterId: selectedEncounter.id, // ✅ Include encounter ID
  admissionDate: formData.admissionDate,
  admissionType: formData.admissionType,
  admissionSource: formData.admissionSource,
  attendingPhysicianId: formData.attendingPhysicianId,
  primaryNurseId: formData.primaryNurseId,
  initialWardId: formData.initialWardId,
  initialBedId: formData.initialBedId,
  // ... other fields
};

const response = await clinicalApi.post('/v1/inpatient/admissions', admissionData);
```

**Backend Behavior:**
- Updates existing encounter to `encounterClass: 'IMP'` and `encounterType: 'inpatient_admission'`
- Links admission to existing encounter
- Preserves encounter history (ER visit becomes inpatient admission)

---

## Validation Rules

### Frontend Validation

```typescript
const validationSchema = z.object({
  patientId: z.string().uuid('Please select a patient'),
  encounterOption: z.enum(['create_new', 'link_existing']),
  encounterId: z.string().uuid().optional(),
  admissionDate: z.date(),
  admissionType: z.enum(['elective', 'emergency', 'maternity', 'day_case', 'transfer']),
  admissionSource: z.enum(['emergency_room', 'outpatient_dept', 'transfer_in', 'direct', 'physician_referral']),
  attendingPhysicianId: z.string().uuid('Please select attending physician'),
  initialWardId: z.string().uuid('Please select ward'),
  initialBedId: z.string().uuid('Please select bed'),
  // ... other fields
}).refine((data) => {
  // If link_existing is selected, encounterId is required
  if (data.encounterOption === 'link_existing' && !data.encounterId) {
    return false;
  }
  return true;
}, {
  message: 'Please select an encounter to link',
  path: ['encounterId'],
});
```

### Backend Validation

- Patient must exist
- If `encounterId` provided, encounter must exist and belong to the patient
- Patient cannot have another active admission (409 Conflict)
- Bed must be available (validation via Foundation API - TODO)

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/encounters/patient/:patientId/active` | GET | Fetch active encounters for modal |
| `/v1/inpatient/admissions` | POST | Create admission (with or without encounterId) |

---

## Success Response

```json
{
  "id": "uuid",
  "admissionNumber": "ADM-2026-00123",
  "patientId": "uuid",
  "encounterId": "uuid",  // Created or linked encounter ID
  "status": "admitted",
  "admissionDate": "2026-01-05T10:30:00Z",
  "currentBedId": "uuid",
  "createdAt": "2026-01-05T10:30:05Z"
}
```

**Success Actions:**
1. Show success toast: "Admission created successfully"
2. Redirect to admission details page: `/inpatient/admissions/${response.id}`

---

## Error Handling

### No Active Encounters

```tsx
{activeEncounters.length === 0 && (
  <Alert variant="warning">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>No Active Encounters Found</AlertTitle>
    <AlertDescription>
      This patient has no active encounters. Please select "Create New Encounter" option.
    </AlertDescription>
  </Alert>
)}
```

### Patient Already Has Active Admission (409 Conflict)

```typescript
try {
  await createAdmission(data);
} catch (error) {
  if (error.response?.status === 409) {
    toast.error('This patient already has an active admission');
  } else {
    toast.error('Failed to create admission');
  }
}
```

---

## Helper Functions

```typescript
// Format encounter class
const formatEncounterClass = (encounterClass: string) => {
  const mapping = {
    'EMER': 'Emergency',
    'AMB': 'Outpatient',
    'IMP': 'Inpatient',
    'OBSENC': 'Observation',
  };
  return mapping[encounterClass] || encounterClass;
};

// Format encounter source
const formatEncounterSource = (source: string) => {
  const mapping = {
    'emergency': 'Emergency Room',
    'appointment': 'Scheduled Appointment',
    'walk-in': 'Walk-in',
    'transfer': 'Transfer',
    'referral': 'Referral',
  };
  return mapping[source] || source;
};

// Get status badge variant
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'default';
    case 'arrived':
      return 'secondary';
    case 'triaged':
      return 'outline';
    default:
      return 'secondary';
  }
};
```

---

## Example Complete Form Component

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function NewAdmissionPage() {
  const router = useRouter();
  const [encounterOption, setEncounterOption] = useState('create_new');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [showEncounterModal, setShowEncounterModal] = useState(false);

  const form = useForm({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      encounterOption: 'create_new',
    },
  });

  // Fetch active encounters when modal opens
  const { data: activeEncounters = [] } = useQuery({
    queryKey: ['activeEncounters', selectedPatient],
    queryFn: () => fetchActiveEncounters(selectedPatient!),
    enabled: showEncounterModal && !!selectedPatient,
  });

  // Create admission mutation
  const createAdmissionMutation = useMutation({
    mutationFn: (data) => clinicalApi.post('/v1/inpatient/admissions', data),
    onSuccess: (response) => {
      toast.success('Admission created successfully');
      router.push(`/inpatient/admissions/${response.data.id}`);
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error('This patient already has an active admission');
      } else {
        toast.error('Failed to create admission');
      }
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      // Only include encounterId if linking to existing
      ...(encounterOption === 'link_existing' && { encounterId: selectedEncounter?.id }),
    };

    createAdmissionMutation.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Patient Selection */}
        <PatientSearchSelect
          name="patientId"
          onChange={setSelectedPatient}
        />

        {/* Encounter Option */}
        <RadioGroup
          value={encounterOption}
          onValueChange={setEncounterOption}
        >
          <RadioItem value="create_new">Create New Encounter</RadioItem>
          <RadioItem value="link_existing">Link to Existing Encounter</RadioItem>
        </RadioGroup>

        {encounterOption === 'link_existing' && (
          <Button onClick={() => setShowEncounterModal(true)}>
            {selectedEncounter
              ? selectedEncounter.encounterNumber
              : 'Select Encounter'
            }
          </Button>
        )}

        {/* Rest of admission form fields */}
        {/* ... */}

        <Button type="submit" disabled={createAdmissionMutation.isLoading}>
          Create Admission
        </Button>
      </form>

      {/* Encounter Selection Modal */}
      <EncounterSelectionModal
        open={showEncounterModal}
        onClose={() => setShowEncounterModal(false)}
        encounters={activeEncounters}
        onSelect={setSelectedEncounter}
      />
    </Form>
  );
}
```

---

## Summary

✅ **Backend API Ready:**
- `GET /encounters/patient/:patientId/active` - Fetch active encounters for popup
- `POST /v1/inpatient/admissions` - Create admission (handles both scenarios)

✅ **Default Behavior:** Create new encounter automatically (encounterId not provided)

✅ **Alternative Flow:** Link to existing encounter (encounterId provided)

✅ **Smart Filtering:** Only shows encounters that:
- Are not finished/cancelled
- Don't already have an inpatient admission
- Belong to the selected patient

✅ **UI Components Needed:**
1. Radio button group for encounter option
2. Encounter selection modal/popup
3. Encounter card display in modal
4. Form validation for encounterId when linking

---

**Version:** 1.0
**Last Updated:** January 2026
