'use client';

import React, { Suspense } from 'react';
import { pluginRegistry } from './plugin-registry';
import { useNavFeatureFlags } from '@/modules/foundation/hooks/use-nav-feature-flags';
import type { ChartingPanelProps, EncounterWidgetProps } from './types';

function PluginErrorBoundaryFallback({ pluginId }: { pluginId: string }) {
  return (
    <div className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
      Plugin &quot;{pluginId}&quot; failed to load
    </div>
  );
}

export function PluginChartingSlot({
  encounterId,
  patientId,
  encounterType,
}: ChartingPanelProps) {
  const { flags, isLoading } = useNavFeatureFlags();

  if (isLoading) return null;

  const plugins = pluginRegistry.getAll().filter((p) => {
    if (flags[p.featureFlag] !== true) return false;
    return p.encounterExtensions?.chartingPanels?.length;
  });

  if (plugins.length === 0) return null;

  return (
    <>
      {plugins.map((plugin) =>
        plugin.encounterExtensions?.chartingPanels?.map((Panel, idx) => (
          <Suspense key={`${plugin.id}-panel-${idx}`} fallback={null}>
            <ErrorBoundary
              fallback={<PluginErrorBoundaryFallback pluginId={plugin.id} />}
            >
              <Panel
                encounterId={encounterId}
                patientId={patientId}
                encounterType={encounterType}
              />
            </ErrorBoundary>
          </Suspense>
        )),
      )}
    </>
  );
}

export function PluginEncounterWidgetSlot({
  encounterId,
  patientId,
}: EncounterWidgetProps) {
  const { flags, isLoading } = useNavFeatureFlags();

  if (isLoading) return null;

  const plugins = pluginRegistry.getAll().filter((p) => {
    if (flags[p.featureFlag] !== true) return false;
    return p.encounterExtensions?.encounterSidebarWidgets?.length;
  });

  if (plugins.length === 0) return null;

  return (
    <>
      {plugins.map((plugin) =>
        plugin.encounterExtensions?.encounterSidebarWidgets?.map(
          (Widget, idx) => (
            <Suspense key={`${plugin.id}-widget-${idx}`} fallback={null}>
              <ErrorBoundary
                fallback={
                  <PluginErrorBoundaryFallback pluginId={plugin.id} />
                }
              >
                <Widget encounterId={encounterId} patientId={patientId} />
              </ErrorBoundary>
            </Suspense>
          ),
        ),
      )}
    </>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
