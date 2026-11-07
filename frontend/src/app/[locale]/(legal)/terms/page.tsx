import type { Metadata } from 'next';
import { LegalDocument, LegalSection, LEGAL_ENTITY } from '@/components/legal/legal-shell';
import { DeploymentNoticeSection } from '@/components/legal/deployment-notice-section';

export const metadata: Metadata = { title: 'Terms & Conditions' };

const GITHUB_URL = 'https://github.com/daivahealth/athma-ce';

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      lead='Athma CE is open-source software provided "as is".'
    >
      <DeploymentNoticeSection />

      <LegalSection heading="Open-source disclaimer">
        <p>
          As an open-source project, the software is provided &quot;as is&quot;, without warranty of
          any kind. {LEGAL_ENTITY} (&quot;Daiva Health&quot;) and its contributors are not responsible
          or liable for any issues, data loss or failures arising from your specific deployment or use
          of the software.
        </p>
      </LegalSection>

      <LegalSection heading="1. Deployment & testing">
        <p>
          You are solely responsible for the installation, configuration and security of your
          deployment. Test the software thoroughly in a controlled environment before using it for
          live clinical or operational purposes.
        </p>
      </LegalSection>

      <LegalSection heading="2. Data responsibility">
        <p>
          You are responsible for ensuring that your use of the software complies with applicable
          healthcare data regulations (such as HIPAA, GDPR and local equivalents). Daiva Health does
          not host your data and cannot be held accountable for data breaches or non-compliance within
          your infrastructure.
        </p>
      </LegalSection>

      <LegalSection heading="3. Licences">
        <p>
          Athma CE is licensed under the Apache License 2.0. The licence text and any third-party
          notices are in the{' '}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            project repository
          </a>
          . Review it for your detailed rights and restrictions.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
