'use client';

import { useState, useCallback, useEffect } from 'react';
import { BarChart3, BookOpen, History, Sparkles, Trash2, Table, PieChart, LineChart, AreaChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import {
  QueryInput,
  ResultsTable,
  ExportButtons,
  CatalogBrowser,
  ReportChart,
  isChartable,
  suggestChartType,
  type ChartType,
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
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Hooks
  const generateMutation = useGenerateReport();
  const { data: history = [], refetch: refetchHistory } = useReportHistory();
  const clearHistoryMutation = useClearHistory();
  const { data: currencyConfig } = useResolveConfig('billing.currency');
  const currency = (currencyConfig?.value as string) || 'INR';

  // Recent queries for autocomplete
  const recentQueries = history.filter((h) => h.success).map((h) => h.query);

  // Auto-suggest best chart type when results change
  const chartable = isChartable(result);
  useEffect(() => {
    if (result && chartable) {
      setChartType(suggestChartType(result));
    }
  }, [result, chartable]);

  const handleGenerateReport = useCallback(
    async (query: string) => {
      setCurrentQuery(query);
      setError(null);
      setInterpretation(null);
      setSuggestions([]);
      setCatalogOpen(false);
      setHistoryOpen(false);

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
    setCatalogOpen(false);
  };

  const handleSelectDimension = (dimension: any) => {
    setCurrentQuery((prev) =>
      prev ? `${prev} by ${dimension.displayName.toLowerCase()}` : `Group by ${dimension.displayName.toLowerCase()}`
    );
    setCatalogOpen(false);
  };

  const handleClearHistory = async () => {
    await clearHistoryMutation.mutateAsync();
    toast({
      title: 'History cleared',
      description: 'Your report history has been cleared.',
    });
  };

  const handleHistorySelect = (query: string) => {
    setHistoryOpen(false);
    handleGenerateReport(query);
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
        <div className="flex items-center gap-2">
          {/* Catalog Dialog */}
          <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Catalog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Available Metrics & Dimensions</DialogTitle>
              </DialogHeader>
              <div className="h-[60vh]">
                <CatalogBrowser
                  onSelectMetric={handleSelectMetric}
                  onSelectDimension={handleSelectDimension}
                  className="h-full"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* History Dialog */}
          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
                {history.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {history.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh]">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Recent Queries</DialogTitle>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </DialogHeader>
              <ScrollArea className="h-[50vh]">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <History className="h-8 w-8 mb-2" />
                    <p className="text-sm">No recent queries</p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-4">
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleHistorySelect(entry.query)}
                        className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors border"
                      >
                        <p className="text-sm font-medium">{entry.query}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>
                            {new Date(entry.executedAt).toLocaleString()}
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
            </DialogContent>
          </Dialog>

          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* Main content - Full width */}
      <div className="space-y-4">
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
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => value && setViewMode(value as 'table' | 'chart')}
                  className="border rounded-lg"
                >
                  <ToggleGroupItem value="table" aria-label="Table view" className="px-3">
                    <Table className="h-4 w-4 mr-2" />
                    Table
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="chart"
                    aria-label="Chart view"
                    disabled={!chartable}
                    className="px-3"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Chart
                  </ToggleGroupItem>
                </ToggleGroup>

                {/* Chart Type Selector - only shown in chart view */}
                {viewMode === 'chart' && chartable && (
                  <ToggleGroup
                    type="single"
                    value={chartType}
                    onValueChange={(value) => value && setChartType(value as ChartType)}
                    className="border rounded-lg"
                  >
                    <ToggleGroupItem value="bar" aria-label="Bar chart" className="px-2">
                      <BarChart3 className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="line" aria-label="Line chart" className="px-2">
                      <LineChart className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="pie" aria-label="Pie chart" className="px-2">
                      <PieChart className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="area" aria-label="Area chart" className="px-2">
                      <AreaChart className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                )}

                <ExportButtons result={result} title={currentQuery.slice(0, 30)} currency={currency} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <ResultsTable result={result} isLoading={isLoading} />
            ) : (
              <ReportChart result={result} chartType={chartType} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
