'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { PayerContractForm } from '@/modules/rcm/components/payer-contract-form';
import { PayerContractAdjustmentForm } from '@/modules/rcm/components/payer-contract-adjustment-form';
import {
  usePayerContract,
  useContractAdjustments,
  useUpdatePayerContract,
  useCreateContractAdjustment,
  useUpdateContractAdjustment,
  useDeleteContractAdjustment,
  useContractPriceCalculator,
} from '@/modules/rcm/hooks/use-payer-contracts';
import type {
  CreatePayerContractInput,
  CreatePayerContractAdjustmentInput,
  ContractPriceCalculationInput,
} from '@/modules/rcm/types/payer-contract';
import { ContractStatus } from '@/modules/rcm/types/payer-contract';
import { useState } from 'react';

const toLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function PayerContractDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const contractId = params.id as string;
  const toast = useToast();

  const { data: contract, isLoading, error } = usePayerContract(contractId);
  const { data: adjustments, isLoading: isAdjustmentsLoading } = useContractAdjustments(contractId);
  const updateContract = useUpdatePayerContract();
  const createAdjustment = useCreateContractAdjustment(contractId);
  const updateAdjustment = useUpdateContractAdjustment(contractId);
  const deleteAdjustment = useDeleteContractAdjustment(contractId);
  const calculatePrice = useContractPriceCalculator();

  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState({ code: '', codeType: 'CPT', quantity: '1' });
  const [priceResult, setPriceResult] = useState('');

  const handleUpdate = async (payload: CreatePayerContractInput) => {
    await updateContract.mutateAsync({ id: contractId, payload });
    toast({ title: 'Contract updated' });
  };

  const handleCreateAdjustment = async (payload: CreatePayerContractAdjustmentInput) => {
    await createAdjustment.mutateAsync(payload);
    toast({ title: 'Adjustment added' });
  };

  const handleUpdateAdjustment = async (id: string, payload: CreatePayerContractAdjustmentInput) => {
    await updateAdjustment.mutateAsync({ id, payload });
    toast({ title: 'Adjustment updated' });
    setSelectedAdjustmentId(null);
  };

  const handleDeleteAdjustment = async (id: string) => {
    if (!window.confirm('Delete this adjustment?')) return;
    await deleteAdjustment.mutateAsync(id);
    toast({ title: 'Adjustment deleted' });
  };

  const handleCalculatePrice = async () => {
    if (!priceInput.code.trim()) {
      toast({ variant: 'destructive', title: 'Enter billing code to calculate price.' });
      return;
    }

    const payload: ContractPriceCalculationInput = {
      contractId,
      billingCode: priceInput.code.trim(),
      codeType: priceInput.codeType,
      quantity: Number(priceInput.quantity) || 1,
    };
    const result = await calculatePrice.mutateAsync(payload);
    if (result.finalAmount != null) {
      setPriceResult(`Final: ${result.finalAmount.toFixed(2)} (base ${result.baseAmount?.toFixed(2) ?? 'n/a'})`);
    } else {
      setPriceResult(result.message ?? 'No price calculated');
    }
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !contract) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load contract: ${(error as Error).message}` : 'Contract not found.'}
      </div>
    );
  }

  const selectedAdjustment = adjustments?.find((adj) => adj.id === selectedAdjustmentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/rcm-setup/payer-contracts`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to contracts
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{contract.contractName}</h1>
        <Badge className="ml-auto" variant={contract.status === ContractStatus.ACTIVE ? 'default' : 'secondary'}>
          {toLabel(contract.status)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Contract type</p>
            <p className="font-medium">{toLabel(contract.contractType)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reimbursement</p>
            <p className="font-medium">{toLabel(contract.reimbursementMethod)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Effective</p>
            <p>
              {format(new Date(contract.effectiveFrom), 'PPP')} →{' '}
              {contract.effectiveTo ? format(new Date(contract.effectiveTo), 'PPP') : 'Open'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payer</p>
            <p className="font-mono text-xs" title={contract.payerId}>
              {contract.payerId}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit contract</CardTitle>
        </CardHeader>
        <CardContent>
          <PayerContractForm initialValues={contract} onSubmit={handleUpdate} isSubmitting={updateContract.isPending} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adjustments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdjustmentsLoading ? (
            <div className="h-32 animate-pulse rounded bg-muted" />
          ) : adjustments && adjustments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scope</TableHead>
                  <TableHead>Multiplier</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Effective</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell>
                      <div className="font-medium">{adjustment.serviceGroup || 'All services'}</div>
                      <p className="text-xs text-muted-foreground">{adjustment.isExclusion ? 'Exclusion' : 'Adjustment'}</p>
                    </TableCell>
                    <TableCell>{adjustment.multiplier ?? '—'}</TableCell>
                    <TableCell>{adjustment.discountPct ?? '—'}</TableCell>
                    <TableCell>{adjustment.priority}</TableCell>
                    <TableCell>
                      {adjustment.effectiveFrom ? format(new Date(adjustment.effectiveFrom), 'PP') : '—'} →
                      {adjustment.effectiveTo ? format(new Date(adjustment.effectiveTo), 'PP') : '—'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedAdjustmentId(adjustment.id)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAdjustment(adjustment.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No adjustments defined.</p>
          )}

          <div className="rounded-md border p-4">
            <h3 className="font-medium">Add adjustment</h3>
            <PayerContractAdjustmentForm
              contractId={contract.id}
              onSubmit={handleCreateAdjustment}
              isSubmitting={createAdjustment.isPending}
            />
          </div>

          {selectedAdjustment && (
            <div className="rounded-md border p-4">
              <h3 className="font-medium">Edit adjustment</h3>
              <PayerContractAdjustmentForm
                contractId={contract.id}
                initialValues={selectedAdjustment}
                submitLabel="Update adjustment"
                isSubmitting={updateAdjustment.isPending}
                onSubmit={(payload) => handleUpdateAdjustment(selectedAdjustment.id, payload)}
                onCancel={() => setSelectedAdjustmentId(null)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calculate contract price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={priceInput.code} onChange={(event) => setPriceInput((prev) => ({ ...prev, code: event.target.value }))} placeholder="Billing code" />
            </div>
            <div className="space-y-2">
              <Label>Code type</Label>
              <Input value={priceInput.codeType} onChange={(event) => setPriceInput((prev) => ({ ...prev, codeType: event.target.value }))} placeholder="CPT" />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={priceInput.quantity}
                onChange={(event) => setPriceInput((prev) => ({ ...prev, quantity: event.target.value }))}
              />
            </div>
          </div>
          <Button onClick={handleCalculatePrice} disabled={calculatePrice.isPending}>
            {calculatePrice.isPending ? 'Calculating…' : 'Calculate price'}
          </Button>
          {priceResult && <p className="text-sm text-muted-foreground">{priceResult}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
