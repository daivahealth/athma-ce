'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Truck,
  ClipboardCheck,
  Pill,
  ClipboardList,
  Hash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import {
  usePharmacyDispensing,
  useVerifyDispensing,
  useCancelDispensing,
  useWardReceive,
} from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import { usePrescriptionHeader } from '@/modules/pharmacy/hooks/use-prescription-header';
import { DispensingStatus, DispensingSource } from '@/modules/pharmacy/types/dispensing';
import { DispensingPatientHeader } from '@/modules/pharmacy/components/DispensingPatientHeader';

export default function DispensingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: dispensing, isLoading } = usePharmacyDispensing(id);
  const { data: prescriptionHeader, isLoading: rxLoading } = usePrescriptionHeader(
    dispensing?.prescriptionId,
  );
  const verifyMutation = useVerifyDispensing();
  const cancelMutation = useCancelDispensing();
  const wardReceiveMutation = useWardReceive();

  if (isLoading || (dispensing?.prescriptionId && rxLoading)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!dispensing) return <div className="text-muted-foreground">Dispensing record not found</div>;

  const isOtcOrPaper = dispensing.dispensingSource !== DispensingSource.DIGITAL_PRESCRIPTION;

  const canVerify  = dispensing.status === DispensingStatus.QUEUED && !isOtcOrPaper;
  const canDispense =
    dispensing.status === DispensingStatus.VERIFIED ||
    (dispensing.status === DispensingStatus.QUEUED && isOtcOrPaper);
  const canCancel = [DispensingStatus.QUEUED, DispensingStatus.VERIFIED].includes(
    dispensing.status as DispensingStatus,
  );
  const canWardReceive =
    dispensing.status === DispensingStatus.DISPENSED &&
    dispensing.dispatchedToWardAt &&
    !dispensing.wardReceivedAt;

  const hasDispensedItems = dispensing.items && dispensing.items.length > 0;
  const prescribedDrugs = prescriptionHeader?.items ?? [];

  return (
    <div className="space-y-4">
      {/* Patient header */}
      <DispensingPatientHeader dispensing={dispensing} />

      {/* Prescription header info */}
      {prescriptionHeader && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Prescription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Rx number + version */}
            <div className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm font-semibold text-primary">
                {prescriptionHeader.prescriptionNumber}
              </span>
              {prescriptionHeader.version > 1 && (
                <Badge variant="secondary" className="text-xs">v{prescriptionHeader.version}</Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {prescriptionHeader.status}
              </Badge>
            </div>

            {/* Prescribed drug lines */}
            <div className="border rounded-md divide-y">
              {prescribedDrugs.map((drug) => (
                <div key={drug.id} className="flex items-start justify-between px-3 py-2.5">
                  <div className="flex items-start gap-2 min-w-0">
                    <Pill className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{drug.drugName}</div>
                      <div className="text-xs text-muted-foreground space-x-1 mt-0.5">
                        {drug.dosage && <span>{drug.dosage}</span>}
                        {drug.frequency && <span>· {drug.frequency}</span>}
                        {drug.duration && <span>· {drug.duration}</span>}
                        {drug.instructions && (
                          <span className="italic">· {drug.instructions}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {drug.quantity && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground flex-shrink-0 ml-3">
                      Qty: {drug.quantity}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {prescriptionHeader.notes && (
              <p className="text-xs text-muted-foreground italic">Note: {prescriptionHeader.notes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dispensed items (only after dispensing) */}
      {hasDispensedItems && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispensed Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 divide-y">
            {dispensing.items!.map((item) => (
              <div key={item.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <Pill className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    {item.drugName}
                    {item.strength && (
                      <span className="text-muted-foreground text-xs">{item.strength}</span>
                    )}
                    {item.dosageForm && (
                      <Badge variant="outline" className="text-xs">{item.dosageForm}</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 pl-5">
                    Batch: {item.batchNumber} · Expires:{' '}
                    {format(new Date(item.expiryDate), 'MMM yyyy')}
                  </div>
                  {item.dispensingInstructions && (
                    <div className="text-xs text-muted-foreground mt-0.5 pl-5 italic">
                      {item.dispensingInstructions}
                    </div>
                  )}
                  {item.isSubstituted && (
                    <Badge variant="outline" className="text-xs mt-1 ml-5">Substituted</Badge>
                  )}
                </div>
                <div className="text-right text-sm flex-shrink-0 ml-4">
                  <div className="font-medium">
                    {item.quantityDispensed} {item.unit}
                  </div>
                  {item.lineAmount != null && (
                    <div className="text-muted-foreground text-xs">
                      {Number(item.lineAmount).toFixed(2)} AED
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Workflow Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Queued</span>
            <span>{format(new Date(dispensing.createdAt), 'dd MMM yyyy HH:mm')}</span>
          </div>
          {dispensing.verifiedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified</span>
              <span>{format(new Date(dispensing.verifiedAt), 'dd MMM yyyy HH:mm')}</span>
            </div>
          )}
          {dispensing.dispensedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dispensed</span>
              <span>{format(new Date(dispensing.dispensedAt), 'dd MMM yyyy HH:mm')}</span>
            </div>
          )}
          {dispensing.dispatchedToWardAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dispatched to Ward</span>
              <span>{format(new Date(dispensing.dispatchedToWardAt), 'dd MMM yyyy HH:mm')}</span>
            </div>
          )}
          {dispensing.wardReceivedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ward Received</span>
              <span>{format(new Date(dispensing.wardReceivedAt), 'dd MMM yyyy HH:mm')}</span>
            </div>
          )}
          {dispensing.chargePosted && (
            <div className="flex justify-between text-green-600">
              <span>Charge Posted</span>
              <span>
                {dispensing.chargePostedAt
                  ? format(new Date(dispensing.chargePostedAt), 'dd MMM yyyy HH:mm')
                  : '✓'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {canVerify && (
          <Button
            onClick={() => verifyMutation.mutate({ id, payload: {} })}
            disabled={verifyMutation.isPending}
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            {verifyMutation.isPending ? 'Verifying…' : 'Verify Prescription'}
          </Button>
        )}

        {canDispense && (
          <Button onClick={() => router.push(`/${locale}/pharmacy/dispensings/${id}/dispense`)}>
            <Pill className="h-4 w-4 mr-2" />
            {dispensing.status === DispensingStatus.QUEUED
              ? 'Add Medicines & Dispense'
              : 'Dispense Medication'}
          </Button>
        )}

        {dispensing.status === DispensingStatus.DISPENSED &&
          dispensing.encounterType === 'inpatient' &&
          !dispensing.dispatchedToWardAt && (
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/pharmacy/dispensings/${id}/dispatch`)}
            >
              <Truck className="h-4 w-4 mr-2" />
              Dispatch to Ward
            </Button>
          )}

        {canWardReceive && (
          <Button
            variant="outline"
            onClick={() => wardReceiveMutation.mutate(id)}
            disabled={wardReceiveMutation.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Ward Receipt
          </Button>
        )}

        {canCancel && (
          <Button
            variant="destructive"
            onClick={() =>
              cancelMutation.mutate({ id, payload: { reason: 'Cancelled by pharmacist' } })
            }
            disabled={cancelMutation.isPending}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {cancelMutation.isPending ? 'Cancelling…' : 'Cancel'}
          </Button>
        )}
      </div>
    </div>
  );
}
