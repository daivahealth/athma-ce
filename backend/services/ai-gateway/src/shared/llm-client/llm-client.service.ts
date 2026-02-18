/**
 * LLM Client Service
 * Unified service for LLM completions and embeddings
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnthropicProvider } from './anthropic.provider';
import { OpenAIProvider } from './openai.provider';
import {
  LLMCompletionRequest,
  LLMCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
} from './types';
import { logger } from '../../common/logger/logger.config';

@Injectable()
export class LLMClientService {
  private readonly llmProvider: string;

  constructor(
    private configService: ConfigService,
    private anthropicProvider: AnthropicProvider,
    private openaiProvider: OpenAIProvider,
  ) {
    this.llmProvider = this.configService.get<string>('LLM_PROVIDER', 'anthropic');
    logger.info({ llmProvider: this.llmProvider }, 'LLM Client initialized');
  }

  /**
   * Generate a completion using the configured LLM provider
   */
  async completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    if (this.llmProvider === 'anthropic') {
      return this.anthropicProvider.completion(request);
    } else {
      return this.openaiProvider.completion(request);
    }
  }

  /**
   * Generate embeddings (always uses OpenAI)
   */
  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.openaiProvider.embed(request);
  }

  /**
   * Generate a single embedding for a text
   */
  async embedText(text: string): Promise<number[]> {
    const response = await this.embed({ texts: [text] });
    return response.embeddings[0];
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    // Batch in groups of 20 to stay within API limits
    const batchSize = 20;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = await this.embed({ texts: batch });
      allEmbeddings.push(...response.embeddings);
    }

    return allEmbeddings;
  }

  /**
   * Get the current LLM provider name
   */
  getProviderName(): string {
    return this.llmProvider;
  }
}
