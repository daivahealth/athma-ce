'use client';

/**
 * Patient Identity Documents panel.
 *
 * Lists every national identity held against a patient with its verification
 * state, and offers whichever providers the tenant has enabled. The ID types
 * on offer come entirely from `GET /national-identity/providers` — there is no
 * hardcoded country logic here, so enabling a new country is a backend change.
 */

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BadgeCheck, FileText, MoreVertical, Plus, ShieldCheck, ShieldAlert } from 'lucide-react';
import {
  useIdentityProviders,
  usePatientIdentities,
  useUpdatePatientIdentity,
  useDeletePatientIdentity,
} from '../../hooks/use-national-identity';
import type { IdentityProviderInfo, PatientIdentity } from '../../types/national-identity';
import { AddIdentityDialog } from './add-identity-dialog';
import { AbhaVerifyDialog } from './abha-verify-dialog';
import { getApiErrorMessage } from '@/lib/api/errors';

interface PatientIdentityPanelProps {
  patientId: string;
  /** Passport captured on the patient record itself (legacy free-text field). */
  passportNumber?: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  VERIFIED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  UNVERIFIED: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  EXPIRED: 'bg-muted text-muted-foreground',
};

export function PatientIdentityPanel({ patientId, passportNumber }: PatientIdentityPanelProps) {
  const { toast } = useToast();
  const { data: identities, isLoading } = usePatientIdentities(patientId);
  const { data: providers } = useIdentityProviders();
  const updateIdentity = useUpdatePatientIdentity();
  const deleteIdentity = useDeletePatientIdentity();

  const [addOpen, setAddOpen] = useState(false);
  const [abhaOpen, setAbhaOpen] = useState(false);

  /** Providers that can prove ownership online get their own guided flow. */
  const abhaProvider = useMemo(
    () => providers?.find((p: IdentityProviderInfo) => p.identityType === 'abha'),
    [providers],
  );

  const handleSetPrimary = async (identity: PatientIdentity) => {
    try {
      await updateIdentity.mutateAsync({
        patientId,
        id: identity.id,
        payload: { isPrimary: true },
      });
      toast({ title: 'Primary identity updated', description: labelFor(identity, providers) });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not set primary',
        description: getApiErrorMessage(error, 'Please try again.'),
      });
    }
  };

  const handleDelete = async (identity: PatientIdentity) => {
    try {
      await deleteIdentity.mutateAsync({ patientId, id: identity.id });
      toast({ title: 'Identity removed' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not remove identity',
        description: getApiErrorMessage(error, 'Please try again.'),
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Identity Documents
            </CardTitle>
            <CardDescription>National IDs held for this patient</CardDescription>
          </div>
          <div className="flex gap-2">
            {abhaProvider && (
              <Button size="sm" variant="outline" onClick={() => setAbhaOpen(true)}>
                <ShieldCheck className="mr-1 h-4 w-4" />
                ABHA
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : identities && identities.length > 0 ? (
            identities.map((identity) => (
              <div
                key={identity.id}
                className="flex items-start justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{labelFor(identity, providers)}</span>
                    {identity.isPrimary && (
                      <Badge variant="secondary" className="gap-1">
                        <BadgeCheck className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={STATUS_STYLES[identity.verificationStatus] ?? ''}
                    >
                      {identity.verificationStatus === 'VERIFIED' ? (
                        <ShieldCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <ShieldAlert className="mr-1 h-3 w-3" />
                      )}
                      {identity.verificationStatus.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm">{identity.value}</div>
                  {identity.secondaryValue && (
                    <div className="text-sm text-muted-foreground">{identity.secondaryValue}</div>
                  )}
                  {identity.verifiedAt && (
                    <div className="text-xs text-muted-foreground">
                      Verified {new Date(identity.verifiedAt).toLocaleDateString()}
                      {identity.verificationMethod ? ` via ${identity.verificationMethod}` : ''}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Identity actions">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!identity.isPrimary && (
                      <DropdownMenuItem onClick={() => handleSetPrimary(identity)}>
                        Set as primary
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(identity)}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No identity documents recorded for this patient yet.
            </p>
          )}

          {passportNumber && (
            <div className="grid grid-cols-3 gap-2 border-t pt-3 text-sm">
              <span className="text-muted-foreground">Passport:</span>
              <span className="col-span-2 font-medium">{passportNumber}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <AddIdentityDialog
        patientId={patientId}
        open={addOpen}
        onOpenChange={setAddOpen}
        providers={providers ?? []}
      />

      {abhaProvider && (
        <AbhaVerifyDialog
          patientId={patientId}
          provider={abhaProvider}
          open={abhaOpen}
          onOpenChange={setAbhaOpen}
        />
      )}
    </>
  );
}

function labelFor(identity: PatientIdentity, providers?: IdentityProviderInfo[]): string {
  const match = providers?.find(
    (p) =>
      p.country.toUpperCase() === identity.country.toUpperCase() &&
      p.identityType === identity.identityType,
  );
  return match?.label ?? `${identity.country} ${identity.identityType.replace(/_/g, ' ')}`;
}
