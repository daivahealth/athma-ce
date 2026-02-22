'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { DocumentType } from '../types/search';
import { searchService } from '../services/search-service';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  documentTypes?: DocumentType[];
  className?: string;
}

export function SearchInput({
  onSearch,
  isLoading = false,
  placeholder = 'Search clinical documents...',
  documentTypes,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestedQueries = searchService.getSuggestedQueries(documentTypes);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [query]);

  const handleSubmit = useCallback(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && !isLoading) {
      onSearch(trimmedQuery);
    }
  }, [query, isLoading, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertQuery = (text: string) => {
    setQuery(text);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-h-[56px] pl-10 pr-12 resize-none"
              rows={1}
            />
            <div className="absolute right-2 top-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Example searches"
                  >
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Example Searches</h4>
                    <div className="space-y-1">
                      {suggestedQueries.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => insertQuery(suggestion)}
                          className="w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className="h-auto min-h-[56px] px-6"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Help text */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <HelpCircle className="h-3 w-3" />
        <span>
          Search clinical documents using natural language. Press Enter to search.
        </span>
      </div>
    </div>
  );
}
