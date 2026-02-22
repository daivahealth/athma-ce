'use client';

import { useState, useCallback } from 'react';
import { Search as SearchIcon, Sparkles, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  SearchInput,
  SearchResults,
  SearchFiltersPanel,
  EmbeddingStats,
} from '@/modules/semantic-search/components';
import { useSemanticSearch, useSimilarDocuments } from '@/modules/semantic-search/hooks';
import type {
  SearchFilters,
  SearchResponse,
  SearchResult,
} from '@/modules/semantic-search/types';

export default function SemanticSearchPage() {
  const { toast } = useToast();

  // State
  const [currentQuery, setCurrentQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const searchMutation = useSemanticSearch();
  const similarMutation = useSimilarDocuments();

  const handleSearch = useCallback(
    async (query: string) => {
      setCurrentQuery(query);
      setError(null);

      try {
        const result = await searchMutation.mutateAsync({
          query,
          filters,
          limit: 20,
          minSimilarity: 0.7,
        });
        setResponse(result);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Search failed';
        setError(errorMessage);
        setResponse(null);
        toast({
          title: 'Search failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [searchMutation, filters, toast]
  );

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    // Re-search if there's an active query
    if (currentQuery) {
      handleSearch(currentQuery);
    }
  };

  const handleSelectDocument = (result: SearchResult) => {
    // Navigate to document detail page
    // This would typically open the clinical note in the appropriate viewer
    toast({
      title: 'Document selected',
      description: `Opening ${result.documentType}: ${result.documentId.slice(0, 8)}...`,
    });
  };

  const handleFindSimilar = async (result: SearchResult) => {
    try {
      const similar = await similarMutation.mutateAsync({
        documentId: result.documentId,
        documentType: result.documentType,
        limit: 10,
      });
      setResponse(similar);
      setCurrentQuery(`Similar to document ${result.documentId.slice(0, 8)}...`);
      toast({
        title: 'Similar documents found',
        description: `Found ${similar.totalCount} similar documents.`,
      });
    } catch (err: any) {
      toast({
        title: 'Failed to find similar documents',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const isLoading = searchMutation.isPending || similarMutation.isPending;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <SearchIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Clinical Search</h1>
            <p className="text-muted-foreground">
              Search clinical documents using natural language
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
        {/* Left sidebar - Filters & Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filters */}
          <Card className="h-[calc(100vh-400px)]">
            <SearchFiltersPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="h-full"
            />
          </Card>

          {/* Embedding Stats */}
          <EmbeddingStats />
        </div>

        {/* Main area - Search & Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Search Clinical Documents</CardTitle>
              <CardDescription>
                Enter a natural language query to search through clinical notes, discharge summaries, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchInput
                onSearch={handleSearch}
                isLoading={isLoading}
                documentTypes={filters.documentTypes}
                placeholder="e.g., Find notes mentioning diabetes with uncontrolled blood sugar"
              />
            </CardContent>
          </Card>

          {/* Info alert */}
          {!response && !error && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                Our semantic search uses AI embeddings to understand the meaning of your query and find
                relevant clinical documents, even if they don&apos;t contain the exact words you searched for.
                Results are ranked by relevance score.
              </AlertDescription>
            </Alert>
          )}

          {/* Error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Search Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Results</CardTitle>
                  {response && (
                    <CardDescription>
                      {response.totalCount} document{response.totalCount !== 1 ? 's' : ''} found
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SearchResults
                response={response}
                isLoading={isLoading}
                onSelectDocument={handleSelectDocument}
                onFindSimilar={handleFindSimilar}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
