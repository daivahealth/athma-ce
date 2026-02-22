'use client';

import { useState, useCallback } from 'react';
import { BarChart3, BookOpen, History, Sparkles, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import {
  QueryInput,
  ResultsTable,
  ExportButtons,
  CatalogBrowser,
} from '@/modules/reporting/components';
import {
  useGenerateReport,
  useReportHistory,
  useClearHistory,
} from '@/modules/reporting/hooks';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';
import type { QueryResult } from '@/modules/reporting/types';
import type { GenerateReportResponse } from '@/modules/reporting/services/report-service';

export default function ReportsPage() {
  const { toast } = useToast();

  // State
  const [currentQuery, setCurrentQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const generateMutation = useGenerateReport();
  const { data: history = [], refetch: refetchHistory } = useReportHistory();
  const clearHistoryMutation = useClearHistory();
  const { data: currencyConfig } = useResolveConfig('billing.currency');
  const currency = (currencyConfig?.value as string) || 'INR';

  // Recent queries for autocomplete
  const recentQueries = history.filter((h) => h.success).map((h) => h.query);

  const handleGenerateReport = useCallback(
    async (query: string) => {
      setCurrentQuery(query);
      setError(null);
      setInterpretation(null);
      setSuggestions([]);

      try {
        const response: GenerateReportResponse = await generateMutation.mutateAsync({
          query,
          limit: 1000,
          currency,
        });

        if (response.success && response.result) {
          setResult(response.result);
          setInterpretation(response.interpretation || null);
          setSuggestions(response.suggestions || []);
          refetchHistory();
        } else {
          setError(response.error || 'Failed to generate report');
          setResult(null);
          refetchHistory();
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        setResult(null);
        toast({
          title: 'Query failed',
          description: errorMessage,
          variant: 'destructive',
        });
        refetchHistory();
      }
    },
    [generateMutation, refetchHistory, toast, currency]
  );

  const handleSelectMetric = (metric: any) => {
    const suggestion = `Show ${metric.displayName.toLowerCase()}`;
    setCurrentQuery((prev) => (prev ? `${prev}, ${metric.displayName.toLowerCase()}` : suggestion));
  };

  const handleSelectDimension = (dimension: any) => {
    setCurrentQuery((prev) =>
      prev ? `${prev} by ${dimension.displayName.toLowerCase()}` : `Group by ${dimension.displayName.toLowerCase()}`
    );
  };

  const handleClearHistory = async () => {
    await clearHistoryMutation.mutateAsync();
    toast({
      title: 'History cleared',
      description: 'Your report history has been cleared.',
    });
  };

  const isLoading = generateMutation.isPending;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Report Builder</h1>
            <p className="text-muted-foreground">
              Ask questions about your data in plain English
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" />
          AI-Powered
        </Badge>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Catalog & History */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="catalog" className="h-[calc(100vh-220px)]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalog">
                <BookOpen className="h-4 w-4 mr-1" />
                Catalog
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-1" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="catalog" className="h-[calc(100%-44px)] mt-2">
              <Card className="h-full">
                <CatalogBrowser
                  onSelectMetric={handleSelectMetric}
                  onSelectDimension={handleSelectDimension}
                  className="h-full"
                />
              </Card>
            </TabsContent>
            <TabsContent value="history" className="h-[calc(100%-44px)] mt-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Recent Queries</CardTitle>
                    {history.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearHistory}
                        className="h-7 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full px-4 pb-4">
                    {history.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <History className="h-8 w-8 mb-2" />
                        <p className="text-sm">No recent queries</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {history.map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => handleGenerateReport(entry.query)}
                            className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                          >
                            <p className="text-sm font-medium truncate">{entry.query}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>
                                {new Date(entry.executedAt).toLocaleTimeString()}
                              </span>
                              {entry.success ? (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {entry.rowCount} rows
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Failed
                                </Badge>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main area - Query & Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Query input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ask a Question</CardTitle>
              <CardDescription>
                Type your question in natural language and we&apos;ll generate the report for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QueryInput
                onSubmit={handleGenerateReport}
                isLoading={isLoading}
                recentQueries={recentQueries}
                placeholder="e.g., What is the total revenue by department for this month?"
              />
            </CardContent>
          </Card>

          {/* Error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Interpretation */}
          {interpretation && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Interpretation</AlertTitle>
              <AlertDescription>{interpretation}</AlertDescription>
            </Alert>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Related Questions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleGenerateReport(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Results</CardTitle>
                  {result && (
                    <CardDescription>
                      {result.totalCount.toLocaleString()} rows found
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ExportButtons result={result} title={currentQuery.slice(0, 30)} currency={currency} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResultsTable result={result} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
