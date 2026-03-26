'use client';

import { FileText, Clock, AlertCircle, CheckCircle, RefreshCw, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useEmbeddingStats, useReindexProgress, useStartReindex, useCancelReindex } from '../hooks/use-search';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import type { ReindexMode } from '../types/search';
import { REINDEX_MODE_LABELS, REINDEX_MODE_DESCRIPTIONS } from '../types/search';

interface EmbeddingStatsProps {
  className?: string;
}

export function EmbeddingStats({ className }: EmbeddingStatsProps) {
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading } = useEmbeddingStats();
  const { data: reindexProgress } = useReindexProgress();
  const startReindexMutation = useStartReindex();
  const cancelReindexMutation = useCancelReindex();

  const handleStartReindex = async (mode: ReindexMode = 'full') => {
    try {
      const result = await startReindexMutation.mutateAsync({ mode });
      toast({
        title: 'Reindex started',
        description: result.message,
      });
    } catch {
      toast({
        title: 'Failed to start reindex',
        description: 'There was an error starting the reindex job.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelReindex = async () => {
    try {
      await cancelReindexMutation.mutateAsync();
      toast({
        title: 'Reindex cancelled',
        description: 'The reindex job has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Failed to cancel reindex',
        description: 'There was an error cancelling the reindex job.',
        variant: 'destructive',
      });
    }
  };

  const isReindexing = reindexProgress?.status === 'running' || reindexProgress?.status === 'pending';

  if (statsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Embedding Status
        </CardTitle>
        <CardDescription>
          Clinical document indexing for semantic search
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Documents</p>
            <p className="text-2xl font-bold">{stats?.totalDocuments.toLocaleString() || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Chunks</p>
            <p className="text-2xl font-bold">{stats?.totalChunks.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Job status */}
        <div className="flex items-center gap-4 text-sm">
          {stats?.pendingJobs ? (
            <div className="flex items-center gap-1.5 text-amber-600">
              <Clock className="h-4 w-4" />
              <span>{stats.pendingJobs} pending</span>
            </div>
          ) : null}
          {stats?.failedJobs ? (
            <div className="flex items-center gap-1.5 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{stats.failedJobs} failed</span>
            </div>
          ) : null}
          {!stats?.pendingJobs && !stats?.failedJobs && (
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>All synced</span>
            </div>
          )}
        </div>

        {/* Last sync */}
        {stats?.lastSyncAt && (
          <p className="text-xs text-muted-foreground">
            Last sync: {new Date(stats.lastSyncAt).toLocaleString()}
          </p>
        )}

        {/* Reindex progress */}
        {isReindexing && reindexProgress && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reindexing...
              </span>
              <span>
                {reindexProgress.processedDocuments} / {reindexProgress.totalDocuments}
              </span>
            </div>
            <Progress
              value={
                reindexProgress.totalDocuments > 0
                  ? (reindexProgress.processedDocuments / reindexProgress.totalDocuments) * 100
                  : 0
              }
            />
            {reindexProgress.estimatedCompletionAt && (
              <p className="text-xs text-muted-foreground">
                ETA: {new Date(reindexProgress.estimatedCompletionAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isReindexing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelReindex}
              disabled={cancelReindexMutation.isPending}
            >
              Cancel Reindex
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={startReindexMutation.isPending}
                  type="button"
                >
                  <RefreshCw className={cn(
                    'h-4 w-4 mr-2',
                    startReindexMutation.isPending && 'animate-spin'
                  )} />
                  Reindex
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(['full', 'new_only', 'metadata_only'] as ReindexMode[]).map((mode) => (
                  <DropdownMenuItem
                    key={mode}
                    onClick={() => handleStartReindex(mode)}
                    className="flex flex-col items-start"
                  >
                    <span className="font-medium">{REINDEX_MODE_LABELS[mode]}</span>
                    <span className="text-xs text-muted-foreground">
                      {REINDEX_MODE_DESCRIPTIONS[mode]}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
