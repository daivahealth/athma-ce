import type { Metadata } from 'next';

/**
 * Public landing site (`/{locale}` and `/{locale}/request-access`). The same
 * landing site fronts both demo and production deployments, so unlike the app it
 * carries no deployment-mode marker: no "[DEMO]" tab-title suffix and no
 * noindex (both set in the root layout for non-production builds).
 * See docs/features/DEPLOYMENT-MODE.md.
 */
export const metadata: Metadata = {
  title: {
    absolute: 'Athma | Free and open-source HIS and EMR',
    template: '%s | Athma',
  },
  description:
    'Free and open-source HIS and EMR for every hospital, clinic and doctor: patient access, clinical care, labs, theatres, wards, pharmacy, billing and oncology in one platform.',
  robots: { index: true, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
