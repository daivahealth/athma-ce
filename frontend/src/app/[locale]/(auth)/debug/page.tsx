'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  const loadSessionInfo = () => {
    const session = getSession();
    const claims = decodeAccessToken(session.accessToken);

    setSessionInfo({
      hasAccessToken: !!session.accessToken,
      hasRefreshToken: !!session.refreshToken,
      claims: claims,
      tokenPreview: session.accessToken ? session.accessToken.substring(0, 50) + '...' : null,
    });
  };

  useEffect(() => {
    loadSessionInfo();
  }, []);

  const isAuthenticated = sessionInfo?.hasAccessToken;
  const hasRequiredClaims = sessionInfo?.claims?.tenantId &&
                           (sessionInfo?.claims?.userId || sessionInfo?.claims?.sub) &&
                           sessionInfo?.claims?.facilityId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🔍 Debug Information</h1>
            <p className="text-muted-foreground mt-1">
              Authentication and session diagnostics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSessionInfo}>
              🔄 Refresh
            </Button>
            {isAuthenticated ? (
              <Button onClick={() => router.push(`/${params.locale}/patients`)}>
                Go to Patients
              </Button>
            ) : (
              <Button onClick={() => router.push(`/${params.locale}/login`)}>
                Go to Login
              </Button>
            )}
          </div>
        </div>

        {/* Authentication Status */}
        <Card className={isAuthenticated ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAuthenticated ? '✅' : '❌'} Authentication Status
            </CardTitle>
            <CardDescription>
              {isAuthenticated
                ? 'You are logged in with a valid session'
                : 'You are NOT logged in - no access token found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium w-40">Access Token:</span>
                <span className={sessionInfo?.hasAccessToken ? 'text-green-600' : 'text-red-600'}>
                  {sessionInfo?.hasAccessToken ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-40">Refresh Token:</span>
                <span className={sessionInfo?.hasRefreshToken ? 'text-green-600' : 'text-red-600'}>
                  {sessionInfo?.hasRefreshToken ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
              {sessionInfo?.tokenPreview && (
                <div className="mt-4">
                  <span className="font-medium">Token Preview:</span>
                  <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-auto">
                    {sessionInfo.tokenPreview}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Required Claims Check */}
        <Card className={hasRequiredClaims ? 'border-green-500' : 'border-yellow-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {hasRequiredClaims ? '✅' : '⚠️'} Required Claims for Patient API
            </CardTitle>
            <CardDescription>
              Backend requires these three UUIDs in the JWT token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">tenantId:</span>
                <span className={sessionInfo?.claims?.tenantId ? 'text-green-600 font-mono text-sm' : 'text-red-600'}>
                  {sessionInfo?.claims?.tenantId || '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">userId (or sub):</span>
                <span className={(sessionInfo?.claims?.userId || sessionInfo?.claims?.sub) ? 'text-green-600 font-mono text-sm' : 'text-red-600'}>
                  {sessionInfo?.claims?.userId || sessionInfo?.claims?.sub || '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">facilityId:</span>
                <span className={sessionInfo?.claims?.facilityId ? 'text-green-600 font-mono text-sm' : 'text-red-600'}>
                  {sessionInfo?.claims?.facilityId || '❌ Missing'}
                </span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  ⚠️ Not logged in
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Please login first to see JWT token claims.
                </p>
              </div>
            )}

            {isAuthenticated && !hasRequiredClaims && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  ❌ Missing Required Claims
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Your JWT token is missing required fields. The backend auth service needs to include tenantId, userId, and facilityId when generating the token.
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-2 font-mono">
                  Fix: Update backend/services/foundation/src/modules/auth/auth.service.ts
                </p>
              </div>
            )}

            {hasRequiredClaims && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ All Required Claims Present
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Your session has all required fields to access the Patient API!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All JWT Claims */}
        <Card>
          <CardHeader>
            <CardTitle>Complete JWT Claims</CardTitle>
            <CardDescription>Full token payload decoded</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionInfo?.claims ? (
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
{JSON.stringify(sessionInfo.claims, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm">No token claims available (not logged in)</p>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <>
                <div>
                  <h4 className="font-semibold mb-2">1. Login First</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You need to login to see your session details.
                  </p>
                  <Button onClick={() => router.push(`/${params.locale}/login`)}>
                    Go to Login Page
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Login Credentials</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <div>Email: admin@zeal.local</div>
                    <div>Password: yourpassword</div>
                  </div>
                </div>
              </>
            ) : !hasRequiredClaims ? (
              <>
                <div>
                  <h4 className="font-semibold mb-2">2. Backend Fix Required</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your JWT token is missing required claims. Update the backend auth service:
                  </p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto">
{`// backend/services/foundation/src/modules/auth/auth.service.ts

const payload = {
  sub: user.id,
  email: user.email,
  tenantId: user.tenantId,           // ← ADD THIS
  facilityId: user.defaultFacilityId, // ← ADD THIS
  roles: user.roles,
};`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Re-login After Backend Update</h4>
                  <p className="text-sm text-muted-foreground">
                    After updating the backend, logout and login again to get a new token with the required claims.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">✅ Ready to Use Patients API</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your session is properly configured. You can now access the patients page!
                  </p>
                  <Button onClick={() => router.push(`/${params.locale}/patients`)}>
                    Go to Patients Page
                  </Button>
                </div>
              </>
            )}

            <div>
              <h4 className="font-semibold mb-2">🔧 Backend Services Check</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Make sure these services are running:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Foundation: <code className="bg-muted px-1 rounded">http://localhost:3010</code></li>
                <li>Clinical: <code className="bg-muted px-1 rounded">http://localhost:3011</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
