'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  usePlugins,
  useActivatePlugin,
  useDeactivatePlugin,
} from '@/modules/foundation/hooks/use-plugins';
import { getSession, clinicalClient } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  Search,
  Puzzle,
  Shield,
  Server,
  Calendar,
  ChevronRight,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { PluginRegistryEntry } from '@/modules/foundation/types/plugin';

type ServiceKey = 'clinical' | 'foundation' | string;

type BackendHealthMap = Record<ServiceKey, 'online' | 'offline' | 'checking'>;

function useBackendHealth(): BackendHealthMap {
  const clinicalHealth = useQuery({
    queryKey: ['backendHealth', 'clinical'],
    queryFn: async () => {
      await clinicalClient.get('/health');
      return 'online' as const;
    },
    retry: false,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  return {
    clinical: clinicalHealth.isLoading ? 'checking' : clinicalHealth.isSuccess ? 'online' : 'offline',
  };
}

export default function PluginManagementPage() {
  const [search, setSearch] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<PluginRegistryEntry | null>(null);
  const toast = useToast();

  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const tenantId = claims?.tenantId ?? session.user?.tenantId ?? '';

  const { data: plugins, isLoading, error } = usePlugins();
  const activatePlugin = useActivatePlugin();
  const deactivatePlugin = useDeactivatePlugin();
  const backendHealth = useBackendHealth();

  const filteredPlugins = plugins?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.pluginId.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.specialtyCode?.toLowerCase().includes(search.toLowerCase())
  );

  const isActiveForTenant = (plugin: PluginRegistryEntry) =>
    plugin.activations.some((a) => a.tenantId === tenantId && a.isEnabled);

  const handleToggleActivation = async (plugin: PluginRegistryEntry) => {
    if (!tenantId) {
      toast({ title: 'No tenant context', variant: 'destructive' });
      return;
    }

    const active = isActiveForTenant(plugin);

    try {
      if (active) {
        await deactivatePlugin.mutateAsync({
          pluginId: plugin.pluginId,
          tenantId,
        });
        toast({
          title: 'Plugin deactivated',
          description: `${plugin.name} has been deactivated for this tenant.`,
        });
      } else {
        await activatePlugin.mutateAsync({
          pluginId: plugin.pluginId,
          tenantId,
        });
        toast({
          title: 'Plugin activated',
          description: `${plugin.name} has been activated for this tenant.`,
        });
      }
    } catch (err: any) {
      toast({
        title: active ? 'Deactivation failed' : 'Activation failed',
        description: err?.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plugin Management</h1>
          <p className="text-muted-foreground">
            Manage specialty modules installed in the platform
          </p>
        </div>
        <Puzzle className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {plugins?.length ?? 0} plugin{plugins?.length !== 1 ? 's' : ''} installed
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">
              Failed to load plugins: {(error as Error).message}
            </p>
          </CardContent>
        </Card>
      ) : !filteredPlugins?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Puzzle className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium">No plugins found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search
                ? 'Try adjusting your search terms'
                : 'Install plugins to extend the platform with specialty modules'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPlugins.map((plugin) => {
            const active = isActiveForTenant(plugin);
            const toggling =
              (activatePlugin.isPending &&
                activatePlugin.variables?.pluginId === plugin.pluginId) ||
              (deactivatePlugin.isPending &&
                deactivatePlugin.variables?.pluginId === plugin.pluginId);
            const serviceKey = plugin.targetService as ServiceKey;
            const backendStatus = backendHealth[serviceKey] ?? 'offline';

            return (
              <Card
                key={plugin.id}
                className={
                  active
                    ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                    : 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-950/10'
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`rounded-lg p-2 ${
                          active
                            ? 'bg-green-100 dark:bg-green-900/40'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}
                      >
                        <Puzzle
                          className={`h-5 w-5 ${
                            active ? 'text-green-600 dark:text-green-400' : 'text-red-400 dark:text-red-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {plugin.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          v{plugin.version}
                          {plugin.specialtyCode && (
                            <span className="ml-2">{plugin.specialtyCode}</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={
                          backendStatus === 'online'
                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : backendStatus === 'checking'
                            ? 'border-muted bg-muted/40 text-muted-foreground'
                            : 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        }
                        title={`Backend service (${plugin.targetService}): ${backendStatus}`}
                      >
                        {backendStatus === 'online' ? (
                          <Wifi className="mr-1 h-3 w-3" />
                        ) : backendStatus === 'checking' ? (
                          <Wifi className="mr-1 h-3 w-3 opacity-40 animate-pulse" />
                        ) : (
                          <WifiOff className="mr-1 h-3 w-3" />
                        )}
                        {backendStatus === 'online' ? 'Backend Online' : backendStatus === 'checking' ? 'Checking…' : 'Backend Offline'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          active
                            ? 'border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }
                      >
                        <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${active ? 'bg-green-500' : 'bg-red-400'}`} />
                        {active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plugin.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plugin.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Server className="h-3 w-3" />
                      {plugin.targetService}
                    </span>
                    {plugin.manifest.backend.permissions?.length ? (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {plugin.manifest.backend.permissions.length} permissions
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(plugin.installedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={active}
                        onCheckedChange={() => handleToggleActivation(plugin)}
                        disabled={toggling}
                      />
                      <span
                        className={`text-sm font-medium ${
                          toggling
                            ? 'text-muted-foreground'
                            : active
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                        }`}
                      >
                        {toggling
                          ? 'Updating...'
                          : active
                          ? 'Active for this tenant'
                          : 'Inactive'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => setSelectedPlugin(plugin)}
                    >
                      Details
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PluginDetailDialog
        plugin={selectedPlugin}
        open={!!selectedPlugin}
        onClose={() => setSelectedPlugin(null)}
        tenantId={tenantId}
        backendHealth={backendHealth}
      />
    </div>
  );
}

function PluginDetailDialog({
  plugin,
  open,
  onClose,
  tenantId,
  backendHealth,
}: {
  plugin: PluginRegistryEntry | null;
  open: boolean;
  onClose: () => void;
  tenantId: string;
  backendHealth: BackendHealthMap;
}) {
  if (!plugin) return null;

  const manifest = plugin.manifest;
  const tenantActivation = plugin.activations.find(
    (a) => a.tenantId === tenantId
  );
  const allActivations = plugin.activations.filter((a) => a.isEnabled);
  const backendStatus = backendHealth[plugin.targetService as ServiceKey] ?? 'offline';

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Puzzle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div>{plugin.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {plugin.pluginId} v{plugin.version}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {plugin.description && (
            <p className="text-sm text-muted-foreground">{plugin.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Registry Status
              </div>
              <div className="flex items-center gap-2">
                {plugin.status === 'installed' ? (
                  <Badge variant="secondary">Installed</Badge>
                ) : (
                  <Badge variant="default">{plugin.status}</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Backend Health
              </div>
              <div className="flex items-center gap-1.5">
                {backendStatus === 'online' ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Online</span>
                  </>
                ) : backendStatus === 'checking' ? (
                  <>
                    <Wifi className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
                    <span className="text-muted-foreground">Checking…</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-orange-600 dark:text-orange-400 font-medium">Offline</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Target Service
              </div>
              <div className="capitalize">{plugin.targetService}</div>
            </div>
            {manifest.specialty && (
              <div>
                <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Specialty
                </div>
                <div>{manifest.specialty.displayName}</div>
              </div>
            )}
            <div>
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Installed
              </div>
              <div>{new Date(plugin.installedAt).toLocaleString()}</div>
            </div>
            {plugin.author && (
              <div>
                <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Author
                </div>
                <div>{plugin.author}</div>
              </div>
            )}
            {plugin.license && (
              <div>
                <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  License
                </div>
                <div>{plugin.license}</div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <div className="font-medium text-sm mb-3">Tenant Activation</div>
            {tenantActivation ? (
              <Card className={tenantActivation.isEnabled ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : undefined}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        {tenantActivation.isEnabled ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tenantActivation.isEnabled
                          ? `Enabled ${new Date(tenantActivation.enabledAt).toLocaleString()}`
                          : tenantActivation.disabledAt
                          ? `Disabled ${new Date(tenantActivation.disabledAt).toLocaleString()}`
                          : 'Not activated'}
                      </div>
                    </div>
                    <Badge variant={tenantActivation.isEnabled ? 'default' : 'outline'}>
                      {tenantActivation.isEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-sm text-muted-foreground rounded-md border p-4">
                Not activated for this tenant. Use the toggle on the card to activate.
              </div>
            )}
          </div>

          {manifest.backend.permissions && manifest.backend.permissions.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Permissions ({manifest.backend.permissions.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {manifest.backend.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs font-mono">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {manifest.frontend?.navigation && manifest.frontend.navigation.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="font-medium text-sm mb-3">Navigation</div>
                {manifest.frontend.navigation.map((nav) => (
                  <div key={nav.section} className="space-y-2">
                    <div className="text-sm font-medium">{nav.labelKey}</div>
                    <div className="ml-4 space-y-1">
                      {nav.children.map((child) => (
                        <div
                          key={child.href}
                          className="text-xs text-muted-foreground flex items-center gap-2"
                        >
                          <ChevronRight className="h-3 w-3" />
                          {child.labelKey}
                          <span className="text-muted-foreground/60">
                            {child.href}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {allActivations.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="font-medium text-sm mb-3">
                  Active Tenants ({allActivations.length})
                </div>
                <div className="space-y-2">
                  {allActivations.map((activation) => (
                    <div
                      key={activation.id}
                      className="flex items-center justify-between text-xs border rounded-md p-2"
                    >
                      <span className="font-mono text-muted-foreground truncate">
                        {activation.tenantId}
                      </span>
                      <span className="text-muted-foreground shrink-0">
                        Since {new Date(activation.enabledAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
