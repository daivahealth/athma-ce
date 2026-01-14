# Transfer APIs - Frontend Implementation Reference

Complete API reference for implementing bed transfer functionality in the frontend.

**Base URL**: `http://localhost:3011/api/v1`

**Required Headers** (for all requests):
```typescript
{
  'x-tenant-id': string,      // Current tenant UUID
  'x-user-id': string,         // Logged-in user UUID
  'x-facility-id': string,     // Current facility UUID
  'Authorization': string,     // Bearer JWT token
  'Content-Type': 'application/json'
}
```

---

## API Endpoints

### 1. Transfer Patient to New Bed

**Endpoint**: `POST /v1/inpatient/admissions/:admissionId/transfer`

**Description**: Transfers a patient from their current bed to a new bed/ward. Executes atomically with complete audit trail.

**Path Parameters**:
- `admissionId` (string, required): UUID of the inpatient admission

**Request Body**:
```typescript
{
  toWardId: string;        // Required: Target ward UUID
  toBedId: string;         // Required: Target bed UUID
  transferReason: string;  // Required: Reason for transfer
  transferType: 'clinical_need' | 'bed_availability' | 'patient_request' | 'infection_control';
  notes?: string;          // Optional: Additional notes
}
```

**Transfer Types**:
- `clinical_need` - Medical/clinical requirements (e.g., needs ICU, closer monitoring)
- `bed_availability` - Bed management needs (e.g., ward consolidation)
- `patient_request` - Patient preference (e.g., room change request)
- `infection_control` - Isolation/infection control requirements

**Success Response** (200 OK):
```typescript
{
  admission: {
    id: string;
    currentWardId: string;
    currentSpaceId: string;
    currentBedId: string;
    admissionStatus: 'ADMITTED' | 'ACTIVE' | 'ON_LEAVE' | 'DISCHARGED';
    dischargeStatus: 'NONE' | 'FIT_FOR_DISCHARGE' | 'INITIATED' | 'READY' | 'CONFIRMED';
  };
  bedAssignment: {
    id: string;
    bedId: string;
    wardId: string;
    spaceId: string;
    assignedAt: string;      // ISO 8601 timestamp
    isTransfer: boolean;
    transferReason: string;
    transferType: string;
  };
  event: {
    id: string;
    eventType: 'TRANSFERRED';
    performedAt: string;     // ISO 8601 timestamp
  };
}
```

**Error Responses**:

**404 Not Found**:
```typescript
{
  statusCode: 404;
  message: 'Admission with ID {admissionId} not found';
  error: 'Not Found';
}
```

**400 Bad Request** - Invalid Status:
```typescript
{
  statusCode: 400;
  message: 'Cannot transfer patient with status: DISCHARGED. Patient must be ADMITTED, ACTIVE, or ON_LEAVE.';
  error: 'Bad Request';
}
```

**400 Bad Request** - No Current Bed:
```typescript
{
  statusCode: 400;
  message: 'Patient does not have a current bed assignment';
  error: 'Bad Request';
}
```

**400 Bad Request** - Same Bed:
```typescript
{
  statusCode: 400;
  message: 'Patient is already in this bed';
  error: 'Bad Request';
}
```

**Example**:
```typescript
// Transfer patient from current bed to ICU
const response = await clinicalApi.post(
  `/v1/inpatient/admissions/${admissionId}/transfer`,
  {
    toWardId: 'icu-ward-uuid',
    toBedId: 'icu-bed-12-uuid',
    transferReason: 'Patient requires intensive monitoring',
    transferType: 'clinical_need',
    notes: 'Vitals declining, needs continuous cardiac monitoring'
  }
);
```

---

### 2. Get Transfer History

**Endpoint**: `GET /v1/inpatient/admissions/:admissionId/transfer-history`

**Description**: Retrieves complete transfer history for an admission, ordered chronologically. Shows all bed assignments that were transfers.

**Path Parameters**:
- `admissionId` (string, required): UUID of the inpatient admission

**Query Parameters**: None

**Success Response** (200 OK):
```typescript
Array<{
  id: string;
  tenantId: string;
  admissionId: string;
  patientId: string;
  bedId: string;
  wardId: string;
  spaceId: string;
  assignedAt: string;      // ISO 8601 timestamp
  assignedBy: string;      // User UUID who assigned
  releasedAt: string | null; // ISO 8601 timestamp or null if current
  releasedBy: string | null; // User UUID who released or null
  isTransfer: boolean;     // Always true for transfer history
  transferReason: string | null;
  transferType: string | null;
  notes: string | null;
}>
```

**Response Notes**:
- Array is sorted by `assignedAt` in ascending order (oldest first)
- Initial admission bed assignment (where `isTransfer: false`) is NOT included
- Most recent transfer will have `releasedAt: null` (still active)
- Empty array `[]` returned if no transfers have occurred

**Error Responses**:

**404 Not Found**:
```typescript
{
  statusCode: 404;
  message: 'Admission {admissionId} not found';
  error: 'Not Found';
}
```

**Example**:
```typescript
// Get all transfers for an admission
const transferHistory = await clinicalApi.get(
  `/v1/inpatient/admissions/${admissionId}/transfer-history`
);

// transferHistory.data example:
[
  {
    id: 'assignment-1-uuid',
    admissionId: 'admission-uuid',
    patientId: 'patient-uuid',
    bedId: 'bed-5-uuid',
    wardId: 'general-ward-uuid',
    spaceId: 'space-5-uuid',
    assignedAt: '2026-01-10T08:30:00Z',
    assignedBy: 'nurse-uuid',
    releasedAt: '2026-01-11T14:00:00Z',
    releasedBy: 'nurse-uuid',
    isTransfer: true,
    transferReason: 'Bed availability',
    transferType: 'bed_availability',
    notes: 'Ward consolidation'
  },
  {
    id: 'assignment-2-uuid',
    admissionId: 'admission-uuid',
    patientId: 'patient-uuid',
    bedId: 'icu-bed-12-uuid',
    wardId: 'icu-ward-uuid',
    spaceId: 'icu-space-12-uuid',
    assignedAt: '2026-01-11T14:00:00Z',
    assignedBy: 'doctor-uuid',
    releasedAt: null,  // Currently assigned
    releasedBy: null,
    isTransfer: true,
    transferReason: 'Patient requires intensive monitoring',
    transferType: 'clinical_need',
    notes: 'Vitals declining'
  }
]
```

---

### 3. Get Current Bed Assignment

**Endpoint**: `GET /v1/inpatient/admissions/:admissionId/current-bed-assignment`

**Description**: Retrieves the patient's current active bed assignment (where `releasedAt` is null).

**Path Parameters**:
- `admissionId` (string, required): UUID of the inpatient admission

**Query Parameters**: None

**Success Response** (200 OK):
```typescript
{
  id: string;
  tenantId: string;
  admissionId: string;
  patientId: string;
  bedId: string;
  wardId: string;
  spaceId: string;
  assignedAt: string;      // ISO 8601 timestamp
  assignedBy: string;      // User UUID
  releasedAt: null;        // Always null for current assignment
  releasedBy: null;        // Always null for current assignment
  isTransfer: boolean;     // true if this bed was a transfer, false if initial admission
  transferReason: string | null;
  transferType: string | null;
  notes: string | null;
} | null
```

**Response Notes**:
- Returns `null` if no active bed assignment exists (patient discharged or bed not assigned)
- `isTransfer: false` indicates this is the original admission bed
- `isTransfer: true` indicates patient was transferred to this bed

**Error Responses**:

**404 Not Found**:
```typescript
{
  statusCode: 404;
  message: 'Admission {admissionId} not found';
  error: 'Not Found';
}
```

**Example**:
```typescript
// Get patient's current bed location
const currentBed = await clinicalApi.get(
  `/v1/inpatient/admissions/${admissionId}/current-bed-assignment`
);

if (currentBed.data) {
  console.log('Current bed:', currentBed.data.bedId);
  console.log('Current ward:', currentBed.data.wardId);
  console.log('Assigned at:', currentBed.data.assignedAt);

  if (currentBed.data.isTransfer) {
    console.log('This bed is a transfer from:', currentBed.data.transferReason);
  }
} else {
  console.log('Patient has no active bed assignment');
}
```

---

## TypeScript Types

```typescript
// Enums
export enum TransferType {
  CLINICAL_NEED = 'clinical_need',
  BED_AVAILABILITY = 'bed_availability',
  PATIENT_REQUEST = 'patient_request',
  INFECTION_CONTROL = 'infection_control',
}

export enum InpatientAdmissionStatus {
  PENDING = 'PENDING',
  ADMITTED = 'ADMITTED',
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  DISCHARGED = 'DISCHARGED',
  CANCELLED = 'CANCELLED',
}

export enum InpatientDischargeStatus {
  NONE = 'NONE',
  FIT_FOR_DISCHARGE = 'FIT_FOR_DISCHARGE',
  INITIATED = 'INITIATED',
  READY = 'READY',
  CONFIRMED = 'CONFIRMED',
}

// Request DTOs
export interface TransferPatientRequest {
  toWardId: string;
  toBedId: string;
  transferReason: string;
  transferType: TransferType;
  notes?: string;
}

// Response DTOs
export interface TransferPatientResponse {
  admission: {
    id: string;
    currentWardId: string;
    currentSpaceId: string;
    currentBedId: string;
    admissionStatus: InpatientAdmissionStatus;
    dischargeStatus: InpatientDischargeStatus;
  };
  bedAssignment: {
    id: string;
    bedId: string;
    wardId: string;
    spaceId: string;
    assignedAt: string;
    isTransfer: boolean;
    transferReason: string;
    transferType: string;
  };
  event: {
    id: string;
    eventType: string;
    performedAt: string;
  };
}

export interface BedAssignment {
  id: string;
  tenantId: string;
  admissionId: string;
  patientId: string;
  bedId: string;
  wardId: string;
  spaceId: string;
  assignedAt: string;
  assignedBy: string;
  releasedAt: string | null;
  releasedBy: string | null;
  isTransfer: boolean;
  transferReason: string | null;
  transferType: string | null;
  notes: string | null;
}

export type TransferHistory = BedAssignment[];
export type CurrentBedAssignment = BedAssignment | null;
```

---

## Service Implementation Example

```typescript
// src/modules/clinical/services/transfer-service.ts
import { clinicalApi } from '@/lib/api/clinical-api';
import type {
  TransferPatientRequest,
  TransferPatientResponse,
  TransferHistory,
  CurrentBedAssignment,
} from '../types/transfer';

export class TransferService {
  /**
   * Transfer patient to new bed
   */
  async transferPatient(
    admissionId: string,
    data: TransferPatientRequest
  ): Promise<TransferPatientResponse> {
    const response = await clinicalApi.post<TransferPatientResponse>(
      `/v1/inpatient/admissions/${admissionId}/transfer`,
      data
    );
    return response.data;
  }

  /**
   * Get transfer history for admission
   */
  async getTransferHistory(admissionId: string): Promise<TransferHistory> {
    const response = await clinicalApi.get<TransferHistory>(
      `/v1/inpatient/admissions/${admissionId}/transfer-history`
    );
    return response.data;
  }

  /**
   * Get current bed assignment
   */
  async getCurrentBedAssignment(
    admissionId: string
  ): Promise<CurrentBedAssignment> {
    const response = await clinicalApi.get<CurrentBedAssignment>(
      `/v1/inpatient/admissions/${admissionId}/current-bed-assignment`
    );
    return response.data;
  }
}

export const transferService = new TransferService();
```

---

## React Hook Example (TanStack Query)

```typescript
// src/modules/clinical/hooks/use-transfer.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transferService } from '../services/transfer-service';
import type { TransferPatientRequest } from '../types/transfer';

/**
 * Hook to transfer patient to new bed
 */
export function useTransferPatient(admissionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferPatientRequest) =>
      transferService.transferPatient(admissionId, data),
    onSuccess: () => {
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ['admission', admissionId]
      });
      queryClient.invalidateQueries({
        queryKey: ['transfer-history', admissionId]
      });
      queryClient.invalidateQueries({
        queryKey: ['current-bed-assignment', admissionId]
      });
      queryClient.invalidateQueries({
        queryKey: ['ward-board']
      });
      queryClient.invalidateQueries({
        queryKey: ['bed-browser']
      });
    },
  });
}

/**
 * Hook to get transfer history
 */
export function useTransferHistory(admissionId: string) {
  return useQuery({
    queryKey: ['transfer-history', admissionId],
    queryFn: () => transferService.getTransferHistory(admissionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get current bed assignment
 */
export function useCurrentBedAssignment(admissionId: string) {
  return useQuery({
    queryKey: ['current-bed-assignment', admissionId],
    queryFn: () => transferService.getCurrentBedAssignment(admissionId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

---

## Component Usage Example

```typescript
// src/modules/clinical/components/TransferPatientDialog.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransferPatient } from '../hooks/use-transfer';
import { TransferType } from '../types/transfer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const transferSchema = z.object({
  toWardId: z.string().uuid('Invalid ward ID'),
  toBedId: z.string().uuid('Invalid bed ID'),
  transferReason: z.string().min(5, 'Reason must be at least 5 characters'),
  transferType: z.nativeEnum(TransferType),
  notes: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferPatientDialogProps {
  admissionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferPatientDialog({
  admissionId,
  open,
  onOpenChange,
}: TransferPatientDialogProps) {
  const { toast } = useToast();
  const { mutate: transferPatient, isPending } = useTransferPatient(admissionId);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transferType: TransferType.CLINICAL_NEED,
    },
  });

  const onSubmit = (data: TransferFormData) => {
    transferPatient(data, {
      onSuccess: (response) => {
        toast({
          title: 'Transfer Successful',
          description: `Patient transferred to bed ${response.bedAssignment.bedId}`,
        });
        onOpenChange(false);
        form.reset();
      },
      onError: (error: any) => {
        toast({
          title: 'Transfer Failed',
          description: error.response?.data?.message || 'Failed to transfer patient',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Patient</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="toWardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Ward</FormLabel>
                  <FormControl>
                    <Input placeholder="Ward UUID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toBedId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Bed</FormLabel>
                  <FormControl>
                    <Input placeholder="Bed UUID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transferType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TransferType.CLINICAL_NEED}>
                        Clinical Need
                      </SelectItem>
                      <SelectItem value={TransferType.BED_AVAILABILITY}>
                        Bed Availability
                      </SelectItem>
                      <SelectItem value={TransferType.PATIENT_REQUEST}>
                        Patient Request
                      </SelectItem>
                      <SelectItem value={TransferType.INFECTION_CONTROL}>
                        Infection Control
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transferReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Reason for transfer"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Transferring...' : 'Transfer Patient'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Transfer History Display Example

```typescript
// src/modules/clinical/components/TransferHistoryTimeline.tsx
import { useTransferHistory } from '../hooks/use-transfer';
import { format } from 'date-fns';
import { ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface TransferHistoryTimelineProps {
  admissionId: string;
}

export function TransferHistoryTimeline({ admissionId }: TransferHistoryTimelineProps) {
  const { data: transfers, isLoading, error } = useTransferHistory(admissionId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load transfer history</p>
        </CardContent>
      </Card>
    );
  }

  if (!transfers || transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No transfers recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer History ({transfers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.map((transfer, index) => (
            <div
              key={transfer.id}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Transfer #{index + 1}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {format(new Date(transfer.assignedAt), 'PPp')}
                    </p>
                  </div>
                  <Badge variant={transfer.releasedAt ? 'secondary' : 'default'}>
                    {transfer.releasedAt ? 'Completed' : 'Current'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Bed:</span>{' '}
                    <span className="font-medium">{transfer.bedId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ward:</span>{' '}
                    <span className="font-medium">{transfer.wardId}</span>
                  </div>
                </div>

                {transfer.transferReason && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Reason:</span>{' '}
                    <span>{transfer.transferReason}</span>
                  </div>
                )}

                {transfer.transferType && (
                  <Badge variant="outline">
                    {transfer.transferType.replace(/_/g, ' ')}
                  </Badge>
                )}

                {transfer.notes && (
                  <p className="text-sm text-muted-foreground italic">
                    {transfer.notes}
                  </p>
                )}

                {transfer.releasedAt && (
                  <p className="text-xs text-muted-foreground">
                    Released: {format(new Date(transfer.releasedAt), 'PPp')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Current Bed Location Display Example

```typescript
// src/modules/clinical/components/CurrentBedLocation.tsx
import { useCurrentBedAssignment } from '../hooks/use-transfer';
import { format } from 'date-fns';
import { Bed, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentBedLocationProps {
  admissionId: string;
}

export function CurrentBedLocation({ admissionId }: CurrentBedLocationProps) {
  const { data: assignment, isLoading, error } = useCurrentBedAssignment(admissionId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load bed assignment</p>
        </CardContent>
      </Card>
    );
  }

  if (!assignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active bed assignment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Current Location</CardTitle>
        {assignment.isTransfer && (
          <Badge variant="outline">Transferred</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Bed className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Bed ID</p>
            <p className="text-lg">{assignment.bedId}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Ward ID</p>
            <p className="text-lg">{assignment.wardId}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Assigned At:</span>
            <span className="font-medium">
              {format(new Date(assignment.assignedAt), 'PPp')}
            </span>
          </div>

          {assignment.isTransfer && assignment.transferReason && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer Reason:</span>
              <span className="font-medium">{assignment.transferReason}</span>
            </div>
          )}

          {assignment.isTransfer && assignment.transferType && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer Type:</span>
              <Badge variant="outline" className="ml-2">
                {assignment.transferType.replace(/_/g, ' ')}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Error Handling

```typescript
// src/modules/clinical/utils/transfer-errors.ts
export function getTransferErrorMessage(error: any): string {
  const message = error.response?.data?.message;

  if (!message) {
    return 'An unexpected error occurred during transfer';
  }

  // Map backend errors to user-friendly messages
  if (message.includes('not found')) {
    return 'Admission not found. Please refresh and try again.';
  }

  if (message.includes('Cannot transfer patient with status')) {
    return 'Patient cannot be transferred in their current status. Only admitted, active, or on-leave patients can be transferred.';
  }

  if (message.includes('does not have a current bed')) {
    return 'Patient does not have a current bed assignment.';
  }

  if (message.includes('already in this bed')) {
    return 'Patient is already assigned to this bed.';
  }

  return message;
}
```

---

## Testing

```typescript
// src/modules/clinical/services/__tests__/transfer-service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transferService } from '../transfer-service';
import { clinicalApi } from '@/lib/api/clinical-api';
import { TransferType } from '../../types/transfer';

vi.mock('@/lib/api/clinical-api');

describe('TransferService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('transferPatient', () => {
    it('should transfer patient successfully', async () => {
      const mockResponse = {
        data: {
          admission: {
            id: 'admission-1',
            currentBedId: 'bed-2',
            currentWardId: 'ward-2',
          },
          bedAssignment: {
            id: 'assignment-1',
            bedId: 'bed-2',
            wardId: 'ward-2',
          },
        },
      };

      vi.mocked(clinicalApi.post).mockResolvedValue(mockResponse);

      const result = await transferService.transferPatient('admission-1', {
        toWardId: 'ward-2',
        toBedId: 'bed-2',
        transferReason: 'Clinical need',
        transferType: TransferType.CLINICAL_NEED,
      });

      expect(clinicalApi.post).toHaveBeenCalledWith(
        '/v1/inpatient/admissions/admission-1/transfer',
        expect.objectContaining({
          toWardId: 'ward-2',
          toBedId: 'bed-2',
        })
      );

      expect(result.admission.currentBedId).toBe('bed-2');
    });
  });

  describe('getTransferHistory', () => {
    it('should fetch transfer history', async () => {
      const mockHistory = [
        {
          id: 'assignment-1',
          admissionId: 'admission-1',
          bedId: 'bed-1',
          isTransfer: true,
        },
      ];

      vi.mocked(clinicalApi.get).mockResolvedValue({ data: mockHistory });

      const result = await transferService.getTransferHistory('admission-1');

      expect(clinicalApi.get).toHaveBeenCalledWith(
        '/v1/inpatient/admissions/admission-1/transfer-history'
      );

      expect(result).toEqual(mockHistory);
    });
  });

  describe('getCurrentBedAssignment', () => {
    it('should fetch current bed assignment', async () => {
      const mockAssignment = {
        id: 'assignment-1',
        admissionId: 'admission-1',
        bedId: 'bed-1',
        releasedAt: null,
      };

      vi.mocked(clinicalApi.get).mockResolvedValue({ data: mockAssignment });

      const result = await transferService.getCurrentBedAssignment('admission-1');

      expect(clinicalApi.get).toHaveBeenCalledWith(
        '/v1/inpatient/admissions/admission-1/current-bed-assignment'
      );

      expect(result.bedId).toBe('bed-1');
      expect(result.releasedAt).toBeNull();
    });
  });
});
```

---

## Summary

All three Transfer APIs are production-ready:

✅ **POST** `/v1/inpatient/admissions/:id/transfer` - Transfer patient
✅ **GET** `/v1/inpatient/admissions/:id/transfer-history` - Get transfer history
✅ **GET** `/v1/inpatient/admissions/:id/current-bed-assignment` - Get current bed

Complete with:
- TypeScript type definitions
- Service layer implementation
- React hooks with TanStack Query
- Component examples
- Error handling
- Unit tests

**Base URL**: `http://localhost:3011/api/v1` (Clinical service)
