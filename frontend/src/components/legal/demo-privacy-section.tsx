import { DEPLOYMENT_MODE, PRIVACY_CONTACT_EMAIL } from '@/lib/config/deployment';
import { LegalSection } from './legal-shell';

/**
 * Personal data on the public demo, which Daiva Health operates itself.
 * Shown on demo builds only; self-hosted instances are covered by the generic
 * policy. DRAFT wording, pending approval by Daiva Health (see
 * docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md).
 */
export function DemoPrivacySection() {
  if (DEPLOYMENT_MODE !== 'demo') return null;
  const contact = PRIVACY_CONTACT_EMAIL ? (
    <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="font-medium underline underline-offset-2">
      {PRIVACY_CONTACT_EMAIL}
    </a>
  ) : (
    'Daiva Health through daiva.health'
  );

  return (
    <LegalSection heading="Personal data on this demo">
      <p>
        This demonstration instance is operated by Daiva Health Systems Private Limited, the data fiduciary for the
        personal data described here. We process it under the Digital Personal Data Protection Act, 2023, on the basis
        of the consent you give when you sign in or send a request.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>When you sign in with Google, Microsoft or GitHub:</strong> your name, email address, that
          account&apos;s ID, the time you accepted the demo terms and your last sign-in. We use them only to give you
          read-only access to the demo.
        </li>
        <li>
          <strong>When you request production access:</strong> your organisation&apos;s name, type, size and country,
          your name, email and phone, the modules you are interested in and your message. We use them only to contact
          you about your request.
        </li>
        <li>
          <strong>When you create a sandbox:</strong> the organisation name and type you give, the modules you choose,
          and everything you enter in it. A sandbox is for trying Athma and must not contain real patient data. Only you
          can open it; we can see the list of sandboxes and their owners to run the service.
        </li>
        <li>
          <strong>Where it is kept:</strong> on Google Cloud in Mumbai, India. New request alerts are sent to us by
          email through Google. We do not sell or share your data, and we do not use it for advertising.
        </li>
        <li>
          <strong>How long:</strong> demo accounts until you ask us to delete them, or for 12 months after your last
          sign-in; sandboxes and everything in them are deleted 30 days after creation (60 if you extend it), or
          sooner if you delete them; access requests for up to 24 months after we last contacted you.
        </li>
        <li>
          <strong>Your rights:</strong> you can ask to see, correct or delete your data, withdraw your consent, or raise
          a grievance, by contacting {contact}. Withdrawing consent ends your demo access; it does not affect anything
          done before.
        </li>
      </ul>
    </LegalSection>
  );
}
