'use client';

import { useMemo } from 'react';
import { useNavFeatureFlags } from '@/modules/foundation/hooks/use-nav-feature-flags';
import { pluginRegistry } from './plugin-registry';
import type { PluginNavSection } from './types';

export interface PluginNavResult {
  sections: Array<{
    featureFlag: string;
    pluginId: string;
    navigation: PluginNavSection[];
  }>;
  isLoading: boolean;
}

export function usePluginNavSections(): PluginNavResult {
  const { flags, isLoading } = useNavFeatureFlags();

  const sections = useMemo(() => {
    const allPlugins = pluginRegistry.getAll();
    return allPlugins
      .filter((plugin) => {
        if (isLoading) return true;
        return flags[plugin.featureFlag] === true;
      })
      .map((plugin) => ({
        featureFlag: plugin.featureFlag,
        pluginId: plugin.id,
        navigation: plugin.navigation,
      }));
  }, [flags, isLoading]);

  return { sections, isLoading };
}
