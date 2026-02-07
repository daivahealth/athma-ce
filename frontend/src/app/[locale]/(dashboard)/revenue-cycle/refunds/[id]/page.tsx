'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  PlayCircle,
  Ban,
  Trash2,
  User,
  Clock,
  FileText,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import {
  useRefund,
  useApproveRefund,
  useRejectRefund,
  useProcessRefund,
  useVoidRefund,
  useDeleteRefund,
} from '@/modules/rcm/hooks/use-refunds';
import { RefundStatus, RefundMethod } from '@/modules/rcm/types/refund';

const statusLabels: Record<string, string> = {
  [RefundStatus.PENDING]: 'Pending',
  [RefundStatus.APPROVED]: 'Approved',
  [RefundStatus.REJECTED]: 'Rejected',
  [RefundStatus.PROCESSED]: 'Processed',
  [RefundStatus.VOIDED]: 'Voided',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [RefundStatus.PENDING]: 'secondary',
  [RefundStatus.APPROVED]: 'default',
  [RefundStatus.REJECTED]: 'destructive',
  [RefundStatus.PROCESSED]: 'default',
  [RefundStatus.VOIDED]: 'outline',
};

const methodLabels: Record<string, string> = {
  [RefundMethod.CASH]: 'Cash',
  [RefundMethod.CARD_REVERSAL]: 'Card reversal',
  [RefundMethod.BANK_TRANSFER]: 'Bank transfer',
  [RefundMethod.CHEQUE]: 'Cheque',
  [RefundMethod.WALLET]: 'Wallet',
  [RefundMethod.OTHER]: 'Other',
};

export default function RefundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const refundId = params.id as string;
  const toast = useToast();

  const { data: refund, isLoading, error } = useRefund(refundId);
  const approveMutation = useApproveRefund();
  const rejectMutation = useRejectRefund();
  const processMutation = useProcessRefund();
  const voidMutation = useVoidRefund();
  const deleteMutation = useDeleteRefund();

  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processNotes, setProcessNotes] = useState('');
  const [processTxnRef, setProcessTxnRef] = useState('');
  const [voidReason, setVoidReason] = useState('');

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

  const formatMoney = (value: number, currency: string) => `${Number(value).toFixed(2)} ${currency}`;

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        id: refundId,
        payload: { notes: approvalNotes || undefined },
      });
      toast({ title: 'Refund approved' });
      setApproveDialogOpen(false);
      setApprovalNotes('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to approve', description: (err as Error).message });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({ variant: 'destructive', title: 'Rejection reason is required' });
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        id: refundId,
        payload: { rejectionReason },
      });
      toast({ title: 'Refund rejected' });
      setRejectDialogOpen(false);
      setRejectionReason('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to reject', description: (err as Error).message });
    }
  };

  const handleProcess = async () => {
    try {
      await processMutation.mutateAsync({
        id: refundId,
        payload: {
          txnReference: processTxnRef || undefined,
          notes: processNotes || undefined,
        },
      });
      toast({ title: 'Refund processed' });
      setProcessDialogOpen(false);
      setProcessNotes('');
      setProcessTxnRef('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to process', description: (err as Error).message });
    }
  };

  const handleVoid = async () => {
    if (!voidReason.trim()) {
      toast({ variant: 'destructive', title: 'Void reason is required' });
      return;
    }
    try {
      await voidMutation.mutateAsync({
        id: refundId,
        payload: { reason: voidReason },
      });
      toast({ title: 'Refund voided' });
      setVoidDialogOpen(false);
      setVoidReason('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to void', description: (err as Error).message });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this refund?')) return;
    try {
      await deleteMutation.mutateAsync(refundId);
      toast({ title: 'Refund deleted' });
      router.push(`/${locale}/revenue-cycle/refunds`);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to delete', description: (err as Error).message });
    }
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !refund) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load refund: ${(error as Error).message}` : 'Refund not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/refunds`} aria-label="Back to refunds">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Refund #{refund.refundNumber}</p>
          <h1 className="text-3xl font-bold">{formatMoney(refund.amount, refund.currency)}</h1>
          {refund.refundedCurrency &&
            refund.refundedAmount != null &&
            refund.refundedCurrency !== refund.currency && (
              <p className="text-sm text-muted-foreground">
                Refunded {formatMoney(refund.refundedAmount, refund.refundedCurrency)} · FX{' '}
                {Number(refund.fxRateToBase ?? 1).toFixed(4)}
              </p>
            )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={statusVariants[refund.status]}>{statusLabels[refund.status]}</Badge>
          <Badge variant="secondary">{methodLabels[refund.refundMethod]}</Badge>
        </div>
      </div>

      {/* Workflow Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {refund.status === RefundStatus.PENDING && (
            <>
              <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Refund</DialogTitle>
                    <DialogDescription>
                      Approve refund {refund.refundNumber} for {formatMoney(refund.amount, refund.currency)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="approvalNotes">Notes (optional)</Label>
                      <Textarea
                        id="approvalNotes"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="Add approval notes..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={approveMutation.isPending}>
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Refund</DialogTitle>
                    <DialogDescription>
                      Reject refund {refund.refundNumber}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason">Reason *</Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending}>
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {refund.status === RefundStatus.APPROVED && (
            <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <PlayCircle className="mr-2 h-4 w-4" /> Process
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Process Refund</DialogTitle>
                  <DialogDescription>
                    Process refund {refund.refundNumber} for {formatMoney(refund.amount, refund.currency)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="processTxnRef">Transaction Reference</Label>
                    <Input
                      id="processTxnRef"
                      value={processTxnRef}
                      onChange={(e) => setProcessTxnRef(e.target.value)}
                      placeholder="Transaction reference..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processNotes">Notes</Label>
                    <Textarea
                      id="processNotes"
                      value={processNotes}
                      onChange={(e) => setProcessNotes(e.target.value)}
                      placeholder="Processing notes..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setProcessDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleProcess} disabled={processMutation.isPending}>
                    {processMutation.isPending ? 'Processing...' : 'Process'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {refund.status === RefundStatus.PROCESSED && (
            <Dialog open={voidDialogOpen} onOpenChange={setVoidDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Ban className="mr-2 h-4 w-4" /> Void
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Void Refund</DialogTitle>
                  <DialogDescription>
                    Void processed refund {refund.refundNumber}. This will reverse invoice balance changes.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="voidReason">Reason *</Label>
                    <Textarea
                      id="voidReason"
                      value={voidReason}
                      onChange={(e) => setVoidReason(e.target.value)}
                      placeholder="Enter void reason..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setVoidDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleVoid} disabled={voidMutation.isPending}>
                    {voidMutation.isPending ? 'Voiding...' : 'Void'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Patient</CardTitle>
          </CardHeader>
          <CardContent>
            {refund.patientDisplay ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">
                    {refund.patientDisplay.displayName || 'Unknown patient'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>MRN: {refund.patientDisplay.mrn || '—'}</span>
                    <span>&bull;</span>
                    <span>
                      {refund.patientDisplay.gender || '—'} /{' '}
                      {refund.patientDisplay.age != null ? `${refund.patientDisplay.age}y` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-mono text-sm" title={refund.patientId}>
                {refund.patientId.slice(0, 8)}...
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Refund date</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{format(new Date(refund.refundDate), 'PPP')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{refund.txnReference || '—'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Reason & Notes */}
      {(refund.reason || refund.notes || refund.rejectionReason) && (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {refund.reason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                <p>{refund.reason}</p>
              </div>
            )}
            {refund.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="whitespace-pre-wrap">{refund.notes}</p>
              </div>
            )}
            {refund.rejectionReason && (
              <div>
                <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                <p>{refund.rejectionReason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Receipt Link */}
      {refund.receipt && (
        <Card>
          <CardHeader>
            <CardTitle>Linked Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Receipt #{refund.receipt.receiptNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatMoney(refund.receipt.amount, refund.receipt.currency)} ·{' '}
                  {format(new Date(refund.receipt.receiptDate), 'PP')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocations */}
      <Card>
        <CardHeader>
          <CardTitle>Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          {refund.allocations?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Allocated at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refund.allocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell>
                      {allocation.invoice ? (
                        <span className="font-medium">{allocation.invoice.invoiceNumber}</span>
                      ) : (
                        <span className="font-mono text-xs" title={allocation.invoiceId}>
                          {allocation.invoiceId}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatMoney(allocation.allocatedAmount, refund.currency)}</TableCell>
                    <TableCell>
                      {allocation.createdAt ? format(new Date(allocation.createdAt), 'PPP p') : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No allocations recorded.</p>
          )}
        </CardContent>
      </Card>

      {/* Audit Trail */}
      {refund.auditLogs?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {refund.auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium capitalize">{log.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(log.performedAt), 'PPP p')}
                    </p>
                    {log.details && (
                      <pre className="mt-1 text-xs text-muted-foreground bg-muted rounded p-2 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Danger Zone */}
      {refund.status === RefundStatus.PENDING && (
        <Card>
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-destructive">Delete refund</p>
              <p className="text-sm text-muted-foreground">
                Deletes this refund permanently. Only pending refunds can be deleted.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete refund'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
