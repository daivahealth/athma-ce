import type { Metadata } from 'next';
import { LegalDocument, LegalSection } from '@/components/legal/legal-shell';
import { DeploymentNoticeSection } from '@/components/legal/deployment-notice-section';
import { DemoPrivacySection } from '@/components/legal/demo-privacy-section';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      lead="Your data belongs to you. This policy explains how data is handled in Athma, an open-source, self-hosted product from Daiva Health."
    >
      <DeploymentNoticeSection />
      <DemoPrivacySection />

      <LegalSection heading="1. Daiva Health does not collect clinical data">
        <p>
          Athma is open-source and self-hosted. Daiva Health has no access to the clinical or patient
          data managed in the software; it stays in the environment controlled by the organisation
          that operates this instance. That organisation is responsible for how the data is
          collected, used, retained and protected.
        </p>
      </LegalSection>

      <LegalSection heading="2. Analytics">
        <p>
          The Daiva Health website may collect minimal, non-identifying analytics (such as page views
          or browser type) to improve the user experience. This information is not sold or shared
          with third parties. Athma itself sends no usage data to Daiva Health.
        </p>
      </LegalSection>

      <LegalSection heading="3. Local compliance">
        <p>
          The software is designed to help you comply with regulations such as HIPAA and GDPR, but
          the responsibility for configuration and data management lies with the entity deploying
          the software.
        </p>
      </LegalSection>

      <LegalSection heading="4. Contact">
        <p>
          For questions about how your data is handled in this instance, contact the organisation
          that operates it. For questions about this policy, reach Daiva Health through its GitHub or
          social media channels.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
