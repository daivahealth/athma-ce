'use client';

import { useState, useMemo } from 'react';
import { Search, BarChart3, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSemanticCatalog } from '../hooks/use-reports';
import type { SemanticMetric, SemanticDimension } from '../types/report';
import { cn } from '@/lib/utils';

interface CatalogBrowserProps {
  onSelectMetric?: (metric: SemanticMetric) => void;
  onSelectDimension?: (dimension: SemanticDimension) => void;
  className?: string;
}

export function CatalogBrowser({
  onSelectMetric,
  onSelectDimension,
  className,
}: CatalogBrowserProps) {
  const [search, setSearch] = useState('');
  const { data: catalog, isLoading, error } = useSemanticCatalog();

  // Group items by category
  const groupedMetrics = useMemo(() => {
    if (!catalog?.metrics) return {};

    const filtered = catalog.metrics.filter(
      (m) =>
        m.displayName.toLowerCase().includes(search.toLowerCase()) ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description?.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.reduce<Record<string, SemanticMetric[]>>((acc, metric) => {
      const category = metric.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(metric);
      return acc;
    }, {});
  }, [catalog?.metrics, search]);

  const groupedDimensions = useMemo(() => {
    if (!catalog?.dimensions) return {};

    const filtered = catalog.dimensions.filter(
      (d) =>
        d.displayName.toLowerCase().includes(search.toLowerCase()) ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.reduce<Record<string, SemanticDimension[]>>((acc, dim) => {
      const category = dim.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(dim);
      return acc;
    }, {});
  }, [catalog?.dimensions, search]);

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-48', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-muted-foreground', className)}>
        Failed to load catalog
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
            placeholder="Search metrics & dimensions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Catalog items */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <Accordion type="multiple" defaultValue={['metrics', 'dimensions']}>
            {/* Metrics Section */}
            <AccordionItem value="metrics">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Metrics</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Object.values(groupedMetrics).flat().length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 space-y-2">
                  {Object.entries(groupedMetrics).map(([category, metrics]) => (
                    <div key={category}>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        {category}
                      </div>
                      <div className="space-y-0.5">
                        {metrics.map((metric) => (
                          <TooltipProvider key={metric.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => onSelectMetric?.(metric)}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors text-left"
                                >
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                  <span>{metric.displayName}</span>
                                  {metric.format && (
                                    <Badge variant="outline" className="ml-auto text-xs">
                                      {metric.format}
                                    </Badge>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p className="font-medium">{metric.displayName}</p>
                                {metric.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {metric.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  Field: <code>{metric.name}</code>
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groupedMetrics).length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">No metrics found</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Dimensions Section */}
            <AccordionItem value="dimensions">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Dimensions</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Object.values(groupedDimensions).flat().length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 space-y-2">
                  {Object.entries(groupedDimensions).map(([category, dimensions]) => (
                    <div key={category}>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        {category}
                      </div>
                      <div className="space-y-0.5">
                        {dimensions.map((dim) => (
                          <TooltipProvider key={dim.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => onSelectDimension?.(dim)}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors text-left"
                                >
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                  <span>{dim.displayName}</span>
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    {dim.dataType}
                                  </Badge>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p className="font-medium">{dim.displayName}</p>
                                {dim.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {dim.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  Field: <code>{dim.name}</code>
                                </p>
                                {dim.isLookup && dim.lookupValues && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Values: {dim.lookupValues.join(', ')}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groupedDimensions).length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">No dimensions found</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
