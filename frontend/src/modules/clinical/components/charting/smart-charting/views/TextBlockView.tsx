'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { BLOCK_COLORS, type SmartChartingBlockType } from '../types';

export function TextBlockView({ node, deleteNode }: NodeViewProps) {
  const header = node.attrs.header as string | null;
  const blockType = node.attrs.blockType as SmartChartingBlockType | null;
  const blockId = node.attrs.blockId as string | null;

  // Don't render auto-created blocks (those without blockType or blockId)
  // These are created by ProseMirror to maintain cursor position
  if (!blockType || !blockId) {
    return (
      <NodeViewWrapper className="hidden">
        <div />
      </NodeViewWrapper>
    );
  }

  const borderColor = BLOCK_COLORS[blockType] || 'border-l-slate-400';

  return (
    <NodeViewWrapper className="smart-charting-block my-3">
      <div className="group">
        <div
          contentEditable={false}
          className="flex items-center gap-2 mb-1"
          data-drag-handle
        >
          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {header || 'Notes'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteNode}
            className="h-6 w-6 p-0 ml-auto text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <NodeViewContent className={`pl-6 text-sm leading-relaxed focus:outline-none [&_p]:my-0 min-h-[1.5em] border-l-2 ${borderColor}`} />
      </div>
    </NodeViewWrapper>
  );
}
