/**
 * LLM Client Types
 * Unified interface for interacting with different LLM providers
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface LLMCompletionResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: string;
}

export interface LLMStreamChunk {
  content: string;
  done: boolean;
}

export interface EmbeddingRequest {
  texts: string[];
  model?: string;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  dimensions: number;
  totalTokens: number;
}

export interface LLMProvider {
  name: string;
  completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse>;
  streamCompletion?(request: LLMCompletionRequest): AsyncGenerator<LLMStreamChunk>;
}

export interface EmbeddingProvider {
  name: string;
  embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}

export const LLM_MODELS = {
  CLAUDE_SONNET: 'claude-sonnet-4-20250514',
  CLAUDE_HAIKU: 'claude-3-5-haiku-latest',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
} as const;

export const EMBEDDING_MODELS = {
  TEXT_EMBEDDING_3_SMALL: 'text-embedding-3-small',
  TEXT_EMBEDDING_3_LARGE: 'text-embedding-3-large',
  TEXT_EMBEDDING_ADA_002: 'text-embedding-ada-002',
} as const;
