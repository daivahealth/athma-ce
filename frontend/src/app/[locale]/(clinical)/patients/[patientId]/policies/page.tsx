'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { usePatientPolicies, useCreatePolicy, useArchivePolicy } from '@/modules/rcm/hooks/use-policies';
import { usePayers } from '@/modules/rcm/hooks/use-payers';
import { PayerStatus } from '@/modules/rcm/types/payer';
import { PolicyStatus } from '@/modules/rcm/types/policy';

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

export default function PatientPoliciesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const patientId = params.patientId as string;
  const toast = useToast();

  const { data: patient } = usePatient(patientId);
  const { data: payers } = usePayers({ status: PayerStatus.ACTIVE });
  const { data: policies, isLoading, error } = usePatientPolicies(patientId);
  const createPolicy = useCreatePolicy(patientId);
  const archivePolicy = useArchivePolicy(patientId);

  const [form, setForm] = useState({
    payerId: '',
    policyNumber: '',
    groupNumber: '',
    relationship: '',
    effectiveDate: '',
    expirationDate: '',
    benefits: '',
    isPrimary: false,
    status: PolicyStatus.ACTIVE,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payer = payers?.find((entry) => entry.id === form.payerId);
      if (!payer) {
        toast({ variant: 'destructive', title: 'Select a payer first.' });
        return;
      }
      if (!form.policyNumber.trim()) {
        toast({ variant: 'destructive', title: 'Policy number is required.' });
        return;
      }
      const payload = {
        payerId: payer.id,
        payerName: payer.payerName,
        policyNumber: form.policyNumber.trim(),
        groupNumber: form.groupNumber.trim() || undefined,
        relationship: form.relationship.trim() || undefined,
        effectiveDate: form.effectiveDate || undefined,
        expirationDate: form.expirationDate || undefined,
        benefits: form.benefits ? JSON.parse(form.benefits) : undefined,
        isPrimary: form.isPrimary,
        status: form.status,
      };
      await createPolicy.mutateAsync(payload);
      toast({ title: 'Policy added', description: `${payload.payerName} policy stored.` });
      setForm({
        payerId: '',
        policyNumber: '',
        groupNumber: '',
        relationship: '',
        effectiveDate: '',
        expirationDate: '',
        benefits: '',
        isPrimary: false,
        status: PolicyStatus.ACTIVE,
      });
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Fix the benefits structure.' });
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Unable to save policy',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleArchive = async (policyId: string) => {
    await archivePolicy.mutateAsync(policyId);
    toast({ title: 'Policy deactivated' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/patients/${patientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to patient
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Patient Policies</h1>
        {patient && <p className="text-muted-foreground">{patient.displayName || `${patient.firstName} ${patient.lastName}`}</p>}
        <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
          Add policy
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <LoadingSpinner size="sm" text="Loading policies..." />
          ) : error ? (
            <p className="text-sm text-destructive">Failed to load policies.</p>
          ) : !policies || policies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No policies recorded.</p>
          ) : (
            policies.map((policy) => (
              <div key={policy.id} className="rounded border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{policy.payerName}</p>
                    <p className="text-xs text-muted-foreground">Policy #{policy.policyNumber}</p>
                  </div>
                  <Badge
                    variant={
                      policy.status === PolicyStatus.ACTIVE
                        ? 'default'
                        : policy.status === PolicyStatus.EXPIRED
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="capitalize"
                  >
                    {policy.status}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <p>Group: {policy.groupNumber || '—'}</p>
                  <p>Relationship: {policy.relationship || '—'}</p>
                  <p>Effective {formatDate(policy.effectiveDate)}</p>
                  <p>Expires {formatDate(policy.expirationDate)}</p>
                  <p>Primary: {policy.isPrimary ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(policy.id)}
                    disabled={archivePolicy.isPending}
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add insurance policy</DialogTitle>
            <DialogDescription>
              Capture payer and coverage information linked to this patient.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Payer *</Label>
                <Select value={form.payerId} onValueChange={(value) => handleChange('payerId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payer" />
                  </SelectTrigger>
                  <SelectContent>
                    {payers?.map((payer) => (
                      <SelectItem key={payer.id} value={payer.id}>
                        {payer.payerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Policy number *</Label>
                <Input value={form.policyNumber} onChange={(e) => handleChange('policyNumber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Group number</Label>
                <Input value={form.groupNumber} onChange={(e) => handleChange('groupNumber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input value={form.relationship} onChange={(e) => handleChange('relationship', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Effective date</Label>
                <Input type="date" value={form.effectiveDate} onChange={(e) => handleChange('effectiveDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Expiration date</Label>
                <Input type="date" value={form.expirationDate} onChange={(e) => handleChange('expirationDate', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Benefits (JSON)</Label>
              <Textarea
                rows={4}
                className="font-mono"
                value={form.benefits}
                onChange={(e) => handleChange('benefits', e.target.value)}
                placeholder='{"copay":"20%","deductible":"500"}'
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm">Primary policy</Label>
              <Switch checked={form.isPrimary} onCheckedChange={(checked) => handleChange('isPrimary', checked)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PolicyStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={PolicyStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={PolicyStatus.EXPIRED}>Expired</SelectItem>
                  <SelectItem value={PolicyStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPolicy.isPending}>
                {createPolicy.isPending ? 'Saving...' : 'Add policy'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
