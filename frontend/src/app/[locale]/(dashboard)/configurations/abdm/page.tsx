'use client';

/**
 * ABDM settings (issue #102): per-facility, WRITE-ONLY credential entry for
 * the encrypted TenantSecret store, the abdm.enabled tenant switch, and the
 * live gateway health check. Credentials can be saved and rotated but never
 * read back — the UI only ever shows "configured" metadata.
 */

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { facilityService } from '@/modules/foundation/services/facility-service';
import { useResolveConfig, useSetTenantConfig } from '@/modules/foundation/hooks/use-configs';
import { useSecrets, usePutSecret } from '@/modules/foundation/hooks/use-secrets';
import { nationalIdentityService } from '@/modules/clinical/services/national-identity-service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Activity, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';

const OWNER = 'abdm';
const CREDENTIAL_KEYS = [
  { key: 'abdm.client_id', label: 'ABDM Client ID' },
  { key: 'abdm.client_secret', label: 'ABDM Client Secret' },
] as const;

export default function AbdmSettingsPage() {
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const tenantId = claims?.tenantId ?? session.user?.tenantId ?? '';

  const [facilityId, setFacilityId] = useState<string>('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const { data: facilities } = useQuery({
    queryKey: ['facilities', tenantId],
    queryFn: () => facilityService.listByTenant(tenantId),
    enabled: Boolean(tenantId),
  });

  const { data: enabledConfig } = useResolveConfig('abdm.enabled');
  const { data: environmentConfig } = useResolveConfig('abdm.environment');
  const setTenantConfig = useSetTenantConfig();

  const { data: secrets, isLoading: secretsLoading } = useSecrets(tenantId, OWNER);
  const putSecret = usePutSecret();

  const health = useQuery({
    queryKey: ['abha-health', tenantId, facilityId],
    queryFn: () => nationalIdentityService.getAbhaHealth(),
    enabled: false,
  });

  const abdmEnabled = enabledConfig?.value === true || String(enabledConfig?.value) === 'true';
  const environment = String(environmentConfig?.value ?? 'sandbox');

  const metadataFor = useMemo(() => {
    const scope = facilityId || null;
    return (key: string) =>
      secrets?.find((s) => s.key === key && (s.facilityId ?? null) === scope);
  }, [secrets, facilityId]);

  const saveSecret = (key: string) => {
    const value = drafts[key]?.trim();
    if (!value || !tenantId) return;
    putSecret.mutate(
      { tenantId, key, value, ownerId: OWNER, ...(facilityId ? { facilityId } : {}) },
      {
        onSuccess: () => {
          setDrafts((d) => ({ ...d, [key]: '' }));
          setSavedKey(key);
          setTimeout(() => setSavedKey(null), 3000);
        },
      },
    );
  };

  const toggleEnabled = (value: boolean) => {
    if (!tenantId) return;
    setTenantConfig.mutate({ tenantId, key: 'abdm.enabled', data: { value } });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="ABDM Settings"
        subtitle="Ayushman Bharat Digital Mission — credentials, activation and gateway health"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Activation
          </CardTitle>
          <CardDescription>
            Offering ABHA to patients requires this switch AND working credentials below. Environment:{' '}
            <Badge variant="outline">{environment}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Switch checked={abdmEnabled} onCheckedChange={toggleEnabled} id="abdm-enabled" />
          <Label htmlFor="abdm-enabled">
            {abdmEnabled ? 'ABDM is enabled for this tenant' : 'ABDM is disabled for this tenant'}
          </Label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Gateway credentials
          </CardTitle>
          <CardDescription>
            Write-only: values are encrypted at rest and can never be viewed again — only replaced.
            In ABDM&apos;s model each facility is its own HIP, so credentials are usually stored per
            facility; leave the facility unset for a tenant-wide registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-1.5">
            <Label>Credential scope</Label>
            <Select value={facilityId || 'tenant'} onValueChange={(v) => setFacilityId(v === 'tenant' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Tenant-wide" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant-wide (all facilities)</SelectItem>
                {(facilities ?? []).map((f: { id: string; name: string }) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {CREDENTIAL_KEYS.map(({ key, label }) => {
            const meta = metadataFor(key);
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor={key}>{label}</Label>
                  {secretsLoading ? null : meta ? (
                    <Badge variant="secondary">
                      Configured · updated {new Date(meta.updatedAt).toLocaleDateString()}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not configured</Badge>
                  )}
                  {savedKey === key && <Badge>Saved</Badge>}
                </div>
                <div className="flex max-w-xl gap-2">
                  <Input
                    id={key}
                    type="password"
                    autoComplete="new-password"
                    placeholder={meta ? 'Enter a new value to rotate' : 'Enter value'}
                    value={drafts[key] ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                  />
                  <Button
                    onClick={() => saveSecret(key)}
                    disabled={!drafts[key]?.trim() || putSecret.isPending}
                  >
                    {meta ? 'Rotate' : 'Save'}
                  </Button>
                </div>
              </div>
            );
          })}
          {putSecret.isError && (
            <p className="text-sm text-destructive">
              Could not save the credential — check your permissions (secret.manage) and try again.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Gateway health
          </CardTitle>
          <CardDescription>
            Runs a real session handshake with the ABDM gateway using the stored credentials.
            &ldquo;Mock&rdquo; means no credentials are stored and flows run against the offline mock.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={() => health.refetch()} disabled={health.isFetching}>
            <RefreshCw className={`me-2 h-4 w-4 ${health.isFetching ? 'animate-spin' : ''}`} />
            Check now
          </Button>
          {health.data && (
            <div className="flex items-center gap-2 text-sm">
              <Badge
                variant={
                  health.data.status === 'ok'
                    ? 'default'
                    : health.data.status === 'mock'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {health.data.status.toUpperCase()}
              </Badge>
              <span>gateway: {health.data.gateway}</span>
              {health.data.detail && <span className="text-muted-foreground">— {health.data.detail}</span>}
            </div>
          )}
          {health.isError && (
            <p className="text-sm text-destructive">Health check failed — is the clinical service reachable?</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
