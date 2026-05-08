'use client';

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    held: 'bg-orange-100 text-orange-700',
    scheduled: 'bg-blue-100 text-blue-700',
    in_review: 'bg-purple-100 text-purple-700',
    deferred: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
