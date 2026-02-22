'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  FileText,
  Star,
  StarOff,
  Play,
  Trash2,
  MoreVertical,
  Globe,
  Lock,
  Loader2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  useSavedReports,
  useDeleteSavedReport,
  useToggleFavorite,
} from '../hooks/use-reports';
import type { SavedReport } from '../types/report';
import { cn } from '@/lib/utils';

interface SavedReportsListProps {
  onSelect?: (report: SavedReport) => void;
  className?: string;
}

export function SavedReportsList({ onSelect, className }: SavedReportsListProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useSavedReports({ search: search || undefined });
  const deleteMutation = useDeleteSavedReport();
  const favoriteMutation = useToggleFavorite();

  const reports = data?.data ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({
        title: 'Report deleted',
        description: 'The saved report has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: 'There was an error deleting the report.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await favoriteMutation.mutateAsync(id);
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: 'There was an error updating the favorite status.',
        variant: 'destructive',
      });
    }
  };

  const handleRun = (report: SavedReport) => {
    onSelect?.(report);
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-muted-foreground', className)}>
        Failed to load saved reports
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Reports list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <p className="text-sm">No saved reports yet</p>
            </div>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="hover:bg-accent/50 transition-colors">
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span className="truncate">{report.name}</span>
                        {report.isPublic ? (
                          <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </CardTitle>
                      {report.description && (
                        <CardDescription className="text-xs mt-1 line-clamp-1">
                          {report.description}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRun(report)}>
                          <Play className="mr-2 h-4 w-4" />
                          Run Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFavorite(report.id)}>
                          {report.isFavorite ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Remove Favorite
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Add to Favorites
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(report.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {report.isFavorite && (
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    )}
                    <span>Run {report.executionCount} times</span>
                    {report.lastExecutedAt && (
                      <>
                        <span>•</span>
                        <span>
                          Last run {new Date(report.lastExecutedAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleRun(report)}
                  >
                    <Play className="mr-2 h-3 w-3" />
                    Run
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
