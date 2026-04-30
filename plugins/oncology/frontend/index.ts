import { pluginRegistry } from '@/lib/plugins/plugin-registry';
import type { FrontendPluginManifest } from '@/lib/plugins/types';
import { OncologyPage } from './pages/OncologyPage';
import { StagingSummaryPanel } from './components/StagingSummaryPanel';

const oncologyPlugin: FrontendPluginManifest = {
  id: 'oncology',
  name: 'Oncology',
  featureFlag: 'feature.nav.oncology',
  navigation: [
    {
      section: 'oncology',
      labelKey: 'nav.oncology',
      icon: 'Radiation',
      children: [
        { href: '/oncology/patients', labelKey: 'nav.oncologyPatients', icon: 'Users' },
        { href: '/oncology/staging', labelKey: 'nav.tumorStaging', icon: 'Target' },
        { href: '/oncology/protocols', labelKey: 'nav.chemoProtocols', icon: 'FlaskConical' },
        { href: '/oncology/orders', labelKey: 'nav.chemoOrders', icon: 'Syringe' },
        { href: '/oncology/tumor-board', labelKey: 'nav.tumorBoard', icon: 'Users' },
      ],
    },
  ],
  encounterExtensions: {
    chartingPanels: [StagingSummaryPanel],
  },
  pageComponent: OncologyPage,
};

pluginRegistry.register(oncologyPlugin);

export { oncologyPlugin };
export * from './types';
export * from './hooks/use-oncology';
export * from './services/oncology-service';
