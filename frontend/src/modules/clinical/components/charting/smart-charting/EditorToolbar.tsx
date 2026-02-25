'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface EditorToolbarProps {
  blockCount: number;
  isSaving: boolean;
  lastSaved?: Date | null;
  onSave: () => void;
}

function formatLastSaved(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffSeconds < 60) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  // Use 24-hour format to avoid locale differences
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function EditorToolbar({ blockCount, isSaving, lastSaved, onSave }: EditorToolbarProps) {
  const [savedText, setSavedText] = useState<string | null>(null);

  // Update the saved text only on client to avoid hydration mismatch
  useEffect(() => {
    if (lastSaved) {
      setSavedText(formatLastSaved(lastSaved));
      // Update every minute for relative time display
      const interval = setInterval(() => {
        setSavedText(formatLastSaved(lastSaved));
      }, 60000);
      return () => clearInterval(interval);
    } else {
      setSavedText(null);
    }
  }, [lastSaved]);

  return (
    <div className="flex items-center justify-between gap-3 border-b pb-4">
      <div>
        <h2 className="text-xl font-semibold">Smart Charting</h2>
        <p className="text-sm text-muted-foreground">
          Add blocks to document your clinical encounter
        </p>
      </div>
      <div className="flex items-center gap-3">
        {blockCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {blockCount} block{blockCount !== 1 ? 's' : ''}
          </Badge>
        )}
        {savedText && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Saved {savedText}</span>
          </div>
        )}
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
