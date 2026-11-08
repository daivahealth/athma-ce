import { DEPLOYMENT_MODE, getDeploymentModeInfo } from '@/lib/config/deployment';
import { LegalSection } from './legal-shell';

/**
 * Instance-specific notice on the legal pages. Shown on every non-production
 * deployment; the demo variant spells out "no production use, no live patients".
 */
export function DeploymentNoticeSection() {
  if (DEPLOYMENT_MODE === 'production') return null;
  const info = getDeploymentModeInfo();
  const isDemo = DEPLOYMENT_MODE === 'demo';

  return (
    <LegalSection heading={isDemo ? 'Demonstration environment' : `${info.label} environment`} tone="warning">
      <p>
        This Athma instance runs in <strong>{DEPLOYMENT_MODE}</strong> mode. It is provided for
        {isDemo ? ' evaluation and demonstration' : ' development and testing'} only and is{' '}
        <strong>not for production or clinical use</strong>.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Do not enter real or live patient data, or any personally identifiable or protected health information.</li>
        <li>Patients, staff, orders and results shown here are fictitious sample data.</li>
        <li>Data may be reset, changed or deleted at any time without notice, and is not backed up for recovery.</li>
        <li>Nothing shown here is medical advice or may be relied on for diagnosis or treatment decisions.</li>
        <li>Availability, performance and security are not guaranteed to production standards.</li>
        {isDemo && (
          <>
            <li>
              If you sign in with Google, Microsoft or GitHub, we store your name, email address, that account&apos;s
              ID and when you accepted these terms, to give you read-only access to the demo. You can ask us to delete
              your demo account at any time.
            </li>
            <li>
              If you request production access, we store the details you submit (organisation, name, email, phone,
              country and message) to contact you about your request.
            </li>
          </>
        )}
      </ul>
    </LegalSection>
  );
}
