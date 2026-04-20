'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Truck,
  ClipboardCheck,
  Pill,
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
import { DispensingStatus, DispensingSource } from '@/modules/pharmacy/types/dispensing';
import { DispensingPatientHeader } from '@/modules/pharmacy/components/DispensingPatientHeader';

export default function DispensingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: dispensing, isLoading } = usePharmacyDispensing(id);
  const verifyMutation = useVerifyDispensing();
  const cancelMutation = useCancelDispensing();
  const wardReceiveMutation = useWardReceive();

  if (isLoading) {
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

  return (
    <div className="space-y-4">
      {/* Patient header — matches Lab Report style */}
      <DispensingPatientHeader dispensing={dispensing} />

      {/* Dispensing Items */}
      {dispensing.items && dispensing.items.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dispensing.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    {item.drugName}
                    {item.strength && (
                      <span className="text-muted-foreground text-xs">{item.strength}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Batch: {item.batchNumber} · Expires:{' '}
                    {format(new Date(item.expiryDate), 'MMM yyyy')}
                  </div>
                  {item.dispensingInstructions && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      {item.dispensingInstructions}
                    </div>
                  )}
                  {item.isSubstituted && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Substituted
                    </Badge>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">
                    {item.quantityDispensed} {item.unit}
                  </div>
                  {item.lineAmount != null && (
                    <div className="text-muted-foreground">
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
      <div className="flex items-center gap-2">
        {canVerify && (
          <Button
            onClick={() => verifyMutation.mutate({ id, payload: {} })}
            disabled={verifyMutation.isPending}
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Verify Prescription
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
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
