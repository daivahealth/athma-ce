'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useBillingItemSearch } from '../hooks/use-billing-items';
import type { BillingItem } from '../types/billing-item';

interface BillingItemInlineSearchProps {
  selectedItem: BillingItem | null;
  onSelect: (item: BillingItem) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function BillingItemInlineSearch({
  selectedItem,
  onSelect,
  onClear,
  disabled = false,
}: BillingItemInlineSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: results = [], isLoading } = useBillingItemSearch(debouncedQuery);

  const handleSelect = (item: BillingItem) => {
    onSelect(item);
    setQuery('');
    setIsOpen(false);
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.relatedTarget as Node)
    ) {
      setIsOpen(false);
    }
  };

  if (selectedItem) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-2 py-1.5 text-sm">
        <span className="truncate">
          <span className="font-medium">{selectedItem.billingCode}</span>
          <span className="text-muted-foreground">
            {' '}&mdash; {selectedItem.billingDescription}
          </span>
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto shrink-0 rounded-sm p-0.5 hover:bg-accent"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setIsOpen(true);
        }}
        placeholder="Search billing items..."
        disabled={disabled}
        className="h-8 text-sm"
      />
      {isOpen && query.trim() && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-72 overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {isLoading && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              Searching...
            </p>
          )}
          {!isLoading && results.length === 0 && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              No billing items found.
            </p>
          )}
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(item)}
              className="flex w-full flex-col items-start gap-0.5 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
            >
              <span className="font-medium">{item.billingCode}</span>
              <span className="text-xs text-muted-foreground truncate w-full">
                {item.billingDescription}
                {item.listPrice != null && (
                  <> &middot; {Number(item.listPrice).toFixed(2)}</>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
