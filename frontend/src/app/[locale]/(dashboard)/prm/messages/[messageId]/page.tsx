'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMessage } from '@/modules/prm/hooks/use-messages';

export default function MessageDetailPage({
  params,
}: {
  params: { locale: string; messageId: string };
}) {
  const { data, isLoading } = useMessage(params.messageId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading message...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Details</CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <pre className="max-h-[32rem] overflow-auto rounded-md bg-muted/40 p-4 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">Message not found.</p>
        )}
      </CardContent>
    </Card>
  );
}
