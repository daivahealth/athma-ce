'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWardDashboard } from '@/modules/clinical/hooks/use-inpatient';

export default function WardDashboardPage({ params }: { params: { locale: string; wardId: string } }) {
  const { data, isLoading } = useWardDashboard(params.wardId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ward Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading dashboard...</p>}
        {!isLoading && !data && <p className="text-sm text-muted-foreground">No dashboard data.</p>}
        {data && (
          <pre className="max-h-[32rem] overflow-auto rounded-md bg-muted/40 p-4 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
