import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';

export default function ProfilePage({ params }: { params: { locale: string } }) {
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">{claims?.email ?? 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tenant</p>
            <p className="text-lg font-semibold">{claims?.tenantId ?? 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Roles</p>
            <p className="text-lg font-semibold">{claims?.roles.join(', ') || 'No roles assigned'}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p>PDPL & GDPR Notice:</p>
            <p className="mt-1">
              Access to electronic health information is recorded. Sensitive actions require MFA. Contact your
              security officer to report anomalies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
