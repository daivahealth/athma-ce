import { useEffectiveConfigs } from './use-configs';

export type NavFeatureFlags = Record<string, boolean>;

/**
 * Returns a map of feature.nav.* flags from the effective config.
 * Keys match the featureFlag property on NavSection (e.g. 'feature.nav.wellness').
 * While configs are loading, isLoading=true and the sidebar shows all sections.
 */
export function useNavFeatureFlags(): { flags: NavFeatureFlags; isLoading: boolean } {
  const { data, isLoading } = useEffectiveConfigs();

  if (!data) return { flags: {}, isLoading: true };

  const flags: NavFeatureFlags = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('feature.nav.')) {
      flags[key] = value === true || value === 'true';
    }
  }
  return { flags, isLoading: false };
}
