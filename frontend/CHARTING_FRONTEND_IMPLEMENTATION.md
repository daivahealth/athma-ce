# Charting Frontend Implementation Guide

This document provides a complete guide to implementing the clinical charting frontend for capturing clinical notes, diagnoses, clinical orders, and prescriptions on a single page.

## Files Created

1. **Types**: `/frontend/src/modules/clinical/types/charting.ts` ✅
2. **Service**: `/frontend/src/modules/clinical/services/charting-service.ts` ✅

## Architecture Overview

The charting page will use a tab-based interface with 4 sections:
- **Clinical Notes**: SOAP/H&P/Progress notes with sections
- **Diagnoses**: ICD-10 coded diagnoses (primary/secondary)
- **Clinical Orders**: Lab/Imaging/Procedure orders
- **Prescriptions**: Medication prescriptions

### Technology Stack
- **React Query (TanStack Query)**: Server state management & caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **shadcn/ui**: UI components (Tabs, Forms, Tables, Dialogs)
- **Tailwind CSS**: Styling

## Step 1: Create Custom Hooks

### File: `frontend/src/modules/clinical/hooks/use-charting.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chartingService } from '../services/charting-service';
import type {
  CreateClinicalNoteInput,
  CreateDiagnosisInput,
  CreateClinicalOrderInput,
  CreatePrescriptionInput,
} from '../types/charting';

// Clinical Notes Hooks
export function useClinicalNotesByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['clinical-notes', 'encounter', encounterId],
    queryFn: () => chartingService.getClinicalNotesByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreateClinicalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClinicalNoteInput) =>
      chartingService.createClinicalNote(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-notes', 'encounter', variables.encounterId],
      });
    },
  });
}

// Diagnoses Hooks
export function useDiagnosesByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['diagnoses', 'encounter', encounterId],
    queryFn: () => chartingService.getDiagnosesByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreateDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDiagnosisInput) =>
      chartingService.createDiagnosis(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['diagnoses', 'encounter', variables.encounterId],
      });
    },
  });
}

// Clinical Orders Hooks
export function useClinicalOrdersByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['clinical-orders', 'encounter', encounterId],
    queryFn: () => chartingService.getClinicalOrdersByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreateClinicalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClinicalOrderInput) =>
      chartingService.createClinicalOrder(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-orders', 'encounter', variables.encounterId],
      });
    },
  });
}

// Prescriptions Hooks
export function usePrescriptionsByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['prescriptions', 'encounter', encounterId],
    queryFn: () => chartingService.getPrescriptionsByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePrescriptionInput) =>
      chartingService.createPrescription(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['prescriptions', 'encounter', variables.encounterId],
      });
    },
  });
}
```

## Step 2: Create Form Components

### A. Clinical Notes Form Component

**File**: `frontend/src/modules/clinical/components/charting/clinical-notes-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NoteType } from '../../types/charting';
import { useCreateClinicalNote } from '../../hooks/use-charting';

const clinicalNoteSchema = z.object({
  noteType: z.nativeEnum(NoteType),
  title: z.string().optional(),
  subjectiveText: z.string().optional(),
  objectiveText: z.string().optional(),
  assessmentText: z.string().optional(),
  planText: z.string().optional(),
});

type ClinicalNoteFormValues = z.infer<typeof clinicalNoteSchema>;

interface ClinicalNotesFormProps {
  encounterId: string;
  patientId: string;
  authorStaffId: string;
  onSuccess?: () => void;
}

export function ClinicalNotesForm({
  encounterId,
  patientId,
  authorStaffId,
  onSuccess
}: ClinicalNotesFormProps) {
  const createNoteMutation = useCreateClinicalNote();

  const form = useForm<ClinicalNoteFormValues>({
    resolver: zodResolver(clinicalNoteSchema),
    defaultValues: {
      noteType: NoteType.SOAP,
    },
  });

  const onSubmit = async (values: ClinicalNoteFormValues) => {
    const sections = [];

    if (values.subjectiveText) {
      sections.push({
        sectionCode: 'subjective',
        sectionName: 'Subjective',
        content: { text: values.subjectiveText },
        sortOrder: 1,
      });
    }

    if (values.objectiveText) {
      sections.push({
        sectionCode: 'objective',
        sectionName: 'Objective',
        content: { text: values.objectiveText },
        sortOrder: 2,
      });
    }

    if (values.assessmentText) {
      sections.push({
        sectionCode: 'assessment',
        sectionName: 'Assessment',
        content: { text: values.assessmentText },
        sortOrder: 3,
      });
    }

    if (values.planText) {
      sections.push({
        sectionCode: 'plan',
        sectionName: 'Plan',
        content: { text: values.planText },
        sortOrder: 4,
      });
    }

    await createNoteMutation.mutateAsync({
      encounterId,
      patientId,
      noteType: values.noteType,
      title: values.title,
      authorStaffId,
      sections,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="noteType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select note type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NoteType.SOAP}>SOAP Note</SelectItem>
                    <SelectItem value={NoteType.PROGRESS}>Progress Note</SelectItem>
                    <SelectItem value={NoteType.H_AND_P}>H&P</SelectItem>
                    <SelectItem value={NoteType.DISCHARGE}>Discharge Summary</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Note title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subjectiveText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjective</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Patient complaints, history..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectiveText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Physical exam findings, vitals..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessmentText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Clinical assessment, diagnoses..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Treatment plan, follow-up..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createNoteMutation.isPending}>
          {createNoteMutation.isPending ? 'Saving...' : 'Save Clinical Note'}
        </Button>
      </form>
    </Form>
  );
}
```

### B. Diagnosis Form Component

**File**: `frontend/src/modules/clinical/components/charting/diagnosis-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DiagnosisType } from '../../types/charting';
import { useCreateDiagnosis } from '../../hooks/use-charting';

const diagnosisSchema = z.object({
  icdCode: z.string().min(1, 'ICD code is required'),
  diagnosisName: z.string().min(1, 'Diagnosis name is required'),
  diagnosisType: z.nativeEnum(DiagnosisType),
  chronicCondition: z.boolean().optional(),
  notes: z.string().optional(),
});

type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;

interface DiagnosisFormProps {
  encounterId: string;
  patientId: string;
  addedBy: string;
  onSuccess?: () => void;
}

export function DiagnosisForm({ encounterId, patientId, addedBy, onSuccess }: DiagnosisFormProps) {
  const createDiagnosisMutation = useCreateDiagnosis();

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: {
      diagnosisType: DiagnosisType.PRIMARY,
      chronicCondition: false,
    },
  });

  const onSubmit = async (values: DiagnosisFormValues) => {
    await createDiagnosisMutation.mutateAsync({
      encounterId,
      patientId,
      addedBy,
      ...values,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icdCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ICD-10 Code*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., E11.9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diagnosisType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnosis Type*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={DiagnosisType.PRIMARY}>Primary</SelectItem>
                    <SelectItem value={DiagnosisType.SECONDARY}>Secondary</SelectItem>
                    <SelectItem value={DiagnosisType.RULE_OUT}>Rule Out</SelectItem>
                    <SelectItem value={DiagnosisType.DIFFERENTIAL}>Differential</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diagnosisName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis Name*</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Type 2 Diabetes Mellitus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chronicCondition"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Chronic Condition</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createDiagnosisMutation.isPending}>
          {createDiagnosisMutation.isPending ? 'Adding...' : 'Add Diagnosis'}
        </Button>
      </form>
    </Form>
  );
}
```

### C. Clinical Orders & Prescriptions Forms

Follow the same pattern as above for:
- `clinical-orders-form.tsx`
- `prescriptions-form.tsx`

## Step 3: Create Main Charting Page

**File**: `frontend/src/app/[locale]/(clinical)/encounters/[id]/charting/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ClinicalNotesForm } from '@/modules/clinical/components/charting/clinical-notes-form';
import { DiagnosisForm } from '@/modules/clinical/components/charting/diagnosis-form';
// Import other forms...

export default function ChartingPage() {
  const params = useParams();
  const encounterId = params.id as string;

  // You'll need to get these from context/props
  const patientId = 'patient-id'; // Get from encounter or context
  const currentStaffId = 'staff-id'; // Get from auth context

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Clinical Charting</h1>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <Card className="p-6">
            <ClinicalNotesForm
              encounterId={encounterId}
              patientId={patientId}
              authorStaffId={currentStaffId}
            />
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses">
          <Card className="p-6">
            <DiagnosisForm
              encounterId={encounterId}
              patientId={patientId}
              addedBy={currentStaffId}
            />
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="p-6">
            {/* Clinical Orders Form */}
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card className="p-6">
            {/* Prescriptions Form */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Step 4: Add Display Components

Create list/table components to display existing items in each tab:
- `clinical-notes-list.tsx`
- `diagnoses-list.tsx`
- `clinical-orders-list.tsx`
- `prescriptions-list.tsx`

Each should use the respective hooks and display data in a table with actions (edit, delete).

## Step 5: Navigation

Add a link to the charting page from your encounters page or sidebar.

## Next Steps

1. Complete the remaining form components (orders & prescriptions)
2. Add list/display components for each entity
3. Implement edit/delete functionality
4. Add note signing functionality
5. Add bilingual support (English/Arabic)
6. Add validation and error handling
7. Add loading states and optimistic updates

## Testing

Test with the backend running on `localhost:3011` and ensure:
1. All forms submit correctly
2. Data displays after creation
3. Edit/delete operations work
4. Multi-tenant headers are sent correctly
