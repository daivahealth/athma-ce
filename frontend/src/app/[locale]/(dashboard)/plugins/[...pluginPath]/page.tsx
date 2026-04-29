'use client';

import { useParams } from 'next/navigation';
import { pluginRegistry } from '@/lib/plugins/plugin-registry';
import { useNavFeatureFlags } from '@/modules/foundation/hooks/use-nav-feature-flags';

export default function PluginPage() {
  const params = useParams();
  const pluginPath = (params.pluginPath as string[]) || [];
  const pluginId = pluginPath[0];
  const subPath = pluginPath.slice(1);
  const { flags, isLoading } = useNavFeatureFlags();

  if (!pluginId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No plugin specified</p>
      </div>
    );
  }

  const plugin = pluginRegistry.get(pluginId);

  if (!plugin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Plugin &quot;{pluginId}&quot; is not installed
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (flags[plugin.featureFlag] !== true) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Plugin &quot;{plugin.name}&quot; is not enabled for this tenant
        </p>
      </div>
    );
  }

  if (!plugin.pageComponent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Plugin &quot;{plugin.name}&quot; does not provide a page component
        </p>
      </div>
    );
  }

  const PageComponent = plugin.pageComponent;

  return <PageComponent pluginId={pluginId} subPath={subPath} />;
}
