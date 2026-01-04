'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  useInstanceConfigs,
  useTenantConfigs,
  useFacilityConfigs,
} from '@/modules/foundation/hooks/use-configs';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Settings2, Building2, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ConfigurationsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');
  const { session } = useAuthStore();

  const tenantId = session.user?.tenantId;
  const facilityId = session.user?.defaultFacilityId;

  // Debug: Log the user session
  console.log('Session user:', session.user);
  console.log('Tenant ID:', tenantId);
  console.log('Facility ID:', facilityId);

  const { data: instanceConfigs, isLoading: instanceLoading, error: instanceError } = useInstanceConfigs();
  const { data: tenantConfigs, isLoading: tenantLoading } = useTenantConfigs(tenantId || '');
  const { data: facilityConfigs, isLoading: facilityLoading } = useFacilityConfigs(facilityId || '');

  // Group configurations by category
  type ConfigList = NonNullable<typeof instanceConfigs>;

  const groupConfigsByCategory = (configs: typeof instanceConfigs) => {
    if (!configs) return {};

    return configs.reduce(
      (acc, config) => {
        const category = config.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(config);
        return acc;
      },
      {} as Record<string, ConfigList>
    );
  };

  const groupedInstanceConfigs = groupConfigsByCategory(instanceConfigs);

  // Filter configs based on search
  const filterGroupedConfigs = (groupedConfigs: ReturnType<typeof groupConfigsByCategory>) => {
    if (!search) return groupedConfigs;

    return Object.entries(groupedConfigs).reduce(
      (acc, [category, categoryConfigs]) => {
        const filtered = categoryConfigs.filter(
          (config) =>
            config.configKey.toLowerCase().includes(search.toLowerCase()) ||
            config.description?.toLowerCase().includes(search.toLowerCase()) ||
            category.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      },
      {} as Record<string, ConfigList>
    );
  };

  const filteredGroupedConfigs = filterGroupedConfigs(groupedInstanceConfigs);

  // Create a map of tenant overrides
  const tenantOverridesMap = new Map(
    tenantConfigs?.map((config) => [config.configKey, config.value]) || []
  );

  // Create a map of facility overrides
  const facilityOverridesMap = new Map(
    facilityConfigs?.map((config) => [config.configKey, config.value]) || []
  );

  // Format value for display
  const formatValue = (value: any, valueType: string, isSensitive: boolean) => {
    if (isSensitive) {
      return '••••••••';
    }

    if (valueType === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (valueType === 'json') {
      return (
        <pre className="text-xs bg-muted p-2 rounded max-w-md overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  // Render configuration row
  const renderConfigRow = (config: NonNullable<typeof instanceConfigs>[0], index: number, showOverrides = false) => {
    const hasTenantOverride = tenantOverridesMap.has(config.configKey);
    const hasFacilityOverride = facilityOverridesMap.has(config.configKey);
    const effectiveValue = hasFacilityOverride
      ? facilityOverridesMap.get(config.configKey)
      : hasTenantOverride
      ? tenantOverridesMap.get(config.configKey)
      : config.value;
    const valueSource = hasFacilityOverride ? 'facility' : hasTenantOverride ? 'tenant' : 'instance';

    return (
      <div key={config.id}>
        {index > 0 && <Separator className="my-4" />}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="font-medium text-sm">{config.configKey}</div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {config.valueType}
                  </Badge>
                  {config.isOverridable && (
                    <Badge variant="secondary" className="text-xs">
                      Overridable
                    </Badge>
                  )}
                  {config.isSensitive && (
                    <Badge variant="destructive" className="text-xs">
                      Sensitive
                    </Badge>
                  )}
                  {showOverrides && valueSource !== 'instance' && (
                    <Badge
                      variant={valueSource === 'facility' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {valueSource === 'facility' ? (
                        <>
                          <Building2 className="h-3 w-3 mr-1" />
                          Facility Override
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3 mr-1" />
                          Tenant Override
                        </>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {config.description && (
              <p className="text-xs text-muted-foreground mt-2">{config.description}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {showOverrides && valueSource !== 'instance' ? 'Effective Value (Overridden)' : 'Current Value'}
            </div>
            <div className="text-sm">
              {formatValue(effectiveValue, config.valueType, config.isSensitive)}
            </div>
            {showOverrides && valueSource !== 'instance' && (
              <div className="mt-2 p-2 bg-muted rounded text-xs">
                <div className="text-muted-foreground">Instance Default:</div>
                <div className="mt-1">
                  {formatValue(config.value, config.valueType, config.isSensitive)}
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>Updated: {new Date(config.updatedAt).toLocaleString()}</span>
              {config.updatedBy && <span>By: {config.updatedBy.slice(0, 8)}...</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configurations</h1>
          <p className="text-muted-foreground">
            View configuration settings at instance, tenant, and facility levels
          </p>
        </div>
        <Settings2 className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search configurations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="effective" className="space-y-4">
        <TabsList>
          <TabsTrigger value="effective" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Effective Configuration
          </TabsTrigger>
          <TabsTrigger value="instance" className="gap-2">
            <Globe className="h-4 w-4" />
            Instance Level
          </TabsTrigger>
          <TabsTrigger value="tenant" className="gap-2" disabled={!tenantId}>
            <Globe className="h-4 w-4" />
            Tenant Overrides
          </TabsTrigger>
          <TabsTrigger value="facility" className="gap-2" disabled={!facilityId}>
            <Building2 className="h-4 w-4" />
            Facility Overrides
          </TabsTrigger>
        </TabsList>

        {/* Effective Configuration Tab */}
        <TabsContent value="effective" className="space-y-6">
          {instanceLoading ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Loading configurations...
            </div>
          ) : instanceError ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load configurations: {(instanceError as Error).message}
            </div>
          ) : Object.keys(filteredGroupedConfigs).length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground text-center">
              No configurations found
            </div>
          ) : (
            <>
              <div className="rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950 p-4 text-sm">
                <div className="font-medium mb-1">Effective Configuration View</div>
                <p className="text-muted-foreground">
                  This shows the actual values being used, with facility overrides taking precedence
                  over tenant overrides, which take precedence over instance defaults.
                </p>
              </div>

              {Object.entries(filteredGroupedConfigs)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, categoryConfigs]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="capitalize">{category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {categoryConfigs.length}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Configuration settings for {category.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryConfigs.map((config, index) => renderConfigRow(config, index, true))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </>
          )}
        </TabsContent>

        {/* Instance Level Tab */}
        <TabsContent value="instance" className="space-y-6">
          {instanceLoading ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Loading instance configurations...
            </div>
          ) : (
            Object.entries(filteredGroupedConfigs)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, categoryConfigs]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="capitalize">{category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryConfigs.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Instance-level defaults for {category.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryConfigs.map((config, index) => renderConfigRow(config, index, false))}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Tenant Overrides Tab */}
        <TabsContent value="tenant" className="space-y-6">
          {tenantLoading ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Loading tenant configurations...
            </div>
          ) : !tenantConfigs || tenantConfigs.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground text-center">
              No tenant-specific overrides configured
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tenant Configuration Overrides</CardTitle>
                <CardDescription>
                  Configurations that override instance defaults for your tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenantConfigs.map((config, index) => {
                    const instanceConfig = instanceConfigs?.find((ic) => ic.configKey === config.configKey);
                    return (
                      <div key={config.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-2">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {config.configKey}
                            <Badge variant="secondary" className="text-xs">
                              <Globe className="h-3 w-3 mr-1" />
                              Tenant Override
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Override Value:</div>
                            <div className="text-sm">
                              {formatValue(
                                config.value,
                                instanceConfig?.valueType || 'string',
                                instanceConfig?.isSensitive || false
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(config.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Facility Overrides Tab */}
        <TabsContent value="facility" className="space-y-6">
          {facilityLoading ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Loading facility configurations...
            </div>
          ) : !facilityConfigs || facilityConfigs.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground text-center">
              No facility-specific overrides configured
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Facility Configuration Overrides</CardTitle>
                <CardDescription>
                  Configurations that override tenant/instance defaults for your facility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilityConfigs.map((config, index) => {
                    const instanceConfig = instanceConfigs?.find((ic) => ic.configKey === config.configKey);
                    return (
                      <div key={config.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-2">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {config.configKey}
                            <Badge variant="default" className="text-xs">
                              <Building2 className="h-3 w-3 mr-1" />
                              Facility Override
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Override Value:</div>
                            <div className="text-sm">
                              {formatValue(
                                config.value,
                                instanceConfig?.valueType || 'string',
                                instanceConfig?.isSensitive || false
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(config.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {instanceConfigs && (
        <div className="rounded-md border p-4 text-xs text-muted-foreground">
          <p>
            Total configurations: <span className="font-medium">{instanceConfigs.length}</span>
          </p>
          <p className="mt-1">
            Tenant overrides: <span className="font-medium">{tenantConfigs?.length || 0}</span> ·
            Facility overrides: <span className="font-medium ml-1">{facilityConfigs?.length || 0}</span>
          </p>
        </div>
      )}
    </div>
  );
}
