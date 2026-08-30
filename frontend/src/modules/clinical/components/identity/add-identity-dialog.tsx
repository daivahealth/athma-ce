'use client';

/**
 * Manual entry of an identity document. Validated offline (format + checksum)
 * before it is saved, so a mistyped ID is caught at the point of entry rather
 * than surfacing later during a claim or a health-network lookup.
 */

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { useCreatePatientIdentity, useValidateIdentity } from '../../hooks/use-national-identity';
import type { IdentityProviderInfo } from '../../types/national-identity';

interface AddIdentityDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: IdentityProviderInfo[];
}

export function AddIdentityDialog({
  patientId,
  open,
  onOpenChange,
  providers,
}: AddIdentityDialogProps) {
  const { toast } = useToast();
  const createIdentity = useCreatePatientIdentity();
  const validateIdentity = useValidateIdentity();

  const [providerKey, setProviderKey] = useState('');
  const [value, setValue] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setProviderKey(providers[0] ? keyOf(providers[0]) : '');
      setValue('');
      setIsPrimary(false);
      setErrors([]);
    }
  }, [open, providers]);

  const selected = providers.find((p) => keyOf(p) === providerKey);

  const handleSubmit = async () => {
    if (!selected || !value.trim()) return;
    setErrors([]);

    const payload = {
      country: selected.country,
      identityType: selected.identityType,
      value: value.trim(),
    };

    // Validate first so the user sees a field-level reason, not a save failure.
    const result = await validateIdentity.mutateAsync(payload);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    try {
      await createIdentity.mutateAsync({ patientId, payload: { ...payload, isPrimary } });
      toast({ title: 'Identity added', description: `${selected.label} recorded.` });
      onOpenChange(false);
    } catch (error: any) {
      setErrors([error?.response?.data?.message ?? 'Could not save this identity.']);
    }
  };

  const isBusy = validateIdentity.isPending || createIdentity.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add identity document</DialogTitle>
          <DialogDescription>
            The number is checked for a valid format and checksum before it is saved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identity-type">Document type</Label>
            <Select value={providerKey} onValueChange={setProviderKey}>
              <SelectTrigger id="identity-type">
                <SelectValue placeholder="Select a document type" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={keyOf(provider)} value={keyOf(provider)}>
                    {provider.label} ({provider.country})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity-value">Number</Label>
            <Input
              id="identity-value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setErrors([]);
              }}
              placeholder={selected?.identityType === 'abha' ? '91-1234-5678-9010' : ''}
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="identity-primary"
              checked={isPrimary}
              onChange={(event) => setIsPrimary(event.target.checked)}
            />
            <Label htmlFor="identity-primary" className="font-normal">
              Set as the patient&apos;s primary identity
            </Label>
          </div>

          {errors.length > 0 && (
            <div className="flex gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <ul className="space-y-1">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isBusy}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isBusy || !selected || !value.trim()}>
            {isBusy ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function keyOf(provider: IdentityProviderInfo): string {
  return `${provider.country}:${provider.identityType}`;
}
