'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Sparkles, History, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  recentQueries?: string[];
  className?: string;
}

const EXAMPLE_QUERIES = [
  "What is today's total revenue?",
  'Show me patient count by department',
  'List all unpaid invoices from last month',
  'What are the top 10 diagnoses this week?',
  'Show appointment statistics by status',
  'Revenue breakdown by facility for Q1',
];

export function QueryInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask a question about your data...',
  suggestions = [],
  recentQueries = [],
  className,
}: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [query]);

  const handleSubmit = useCallback(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && !isLoading) {
      onSubmit(trimmedQuery);
    }
  }, [query, isLoading, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertQuery = (text: string) => {
    setQuery(text);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-h-[60px] pr-24 resize-none"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* Examples popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Example queries"
                  >
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Example Queries</h4>
                    <div className="space-y-1">
                      {EXAMPLE_QUERIES.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => insertQuery(example)}
                          className="w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Recent queries popover */}
              {recentQueries.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Recent queries"
                    >
                      <History className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recent Queries</h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {recentQueries.slice(0, 5).map((recent, idx) => (
                          <button
                            key={idx}
                            onClick={() => insertQuery(recent)}
                            className="w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors truncate"
                          >
                            {recent}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className="h-auto min-h-[60px] px-6"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => insertQuery(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Help text */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <HelpCircle className="h-3 w-3" />
        <span>
          Ask questions in plain English. Press Enter to submit, Shift+Enter for new line.
        </span>
      </div>
    </div>
  );
}
