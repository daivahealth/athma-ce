'use client';

import { ChevronRight, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HierarchyNode {
  id: string;
  label: string;
  meta?: string;
  badge?: string;
  children?: HierarchyNode[];
  defaultOpen?: boolean;
}

interface HierarchyTreeProps {
  nodes: HierarchyNode[];
  emptyMessage?: string;
}

function TreeRow({ node, depth }: { node: HierarchyNode; depth: number }) {
  const hasChildren = Boolean(node.children?.length);
  const paddingLeft = `${depth * 18}px`;

  if (!hasChildren) {
    return (
      <div className="flex items-start gap-2 py-1 text-sm" style={{ paddingLeft }}>
        <Dot className="mt-1 h-4 w-4 text-slate-400" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-100">{node.label}</span>
            {node.badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {node.badge}
              </span>
            )}
          </div>
          {node.meta && <span className="text-xs text-slate-500 dark:text-slate-400">{node.meta}</span>}
        </div>
      </div>
    );
  }

  return (
    <details className="group" open={node.defaultOpen}>
      <summary
        className="flex cursor-pointer list-none items-start gap-2 py-1 text-sm"
        style={{ paddingLeft }}
      >
        <ChevronRight className="mt-1 h-4 w-4 text-slate-400 transition group-open:rotate-90" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{node.label}</span>
            {node.badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {node.badge}
              </span>
            )}
          </div>
          {node.meta && <span className="text-xs text-slate-500 dark:text-slate-400">{node.meta}</span>}
        </div>
      </summary>
      <div className="mt-1 space-y-1">
        {node.children?.map((child) => (
          <TreeRow key={child.id} node={child} depth={depth + 1} />
        ))}
      </div>
    </details>
  );
}

export function HierarchyTree({ nodes, emptyMessage = 'No hierarchy data available.' }: HierarchyTreeProps) {
  if (!nodes.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>;
  }

  return (
    <div className={cn('space-y-2')}>
      {nodes.map((node) => (
        <TreeRow key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
}
