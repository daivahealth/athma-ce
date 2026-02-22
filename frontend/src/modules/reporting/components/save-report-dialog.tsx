'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useCreateSavedReport } from '../hooks/use-reports';
import type { QueryPlan } from '../types/report';

interface SaveReportDialogProps {
  query: string;
  queryPlan?: QueryPlan;
  disabled?: boolean;
  onSaved?: (id: string) => void;
}

export function SaveReportDialog({
  query,
  queryPlan,
  disabled = false,
  onSaved,
}: SaveReportDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const createMutation = useCreateSavedReport();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for this report.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const saved = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        query,
        queryPlan,
        isPublic,
      });

      toast({
        title: 'Report saved',
        description: `"${saved.name}" has been saved successfully.`,
      });

      setOpen(false);
      resetForm();
      onSaved?.(saved.id);
    } catch (error) {
      toast({
        title: 'Failed to save',
        description: 'There was an error saving the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled || !query}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Report</DialogTitle>
          <DialogDescription>
            Save this report for quick access later. You can make it public to share with your team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Monthly Revenue Report"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this report..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public">Make public</Label>
              <p className="text-sm text-muted-foreground">
                Allow other users to see and run this report
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Query:</strong> {query}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
