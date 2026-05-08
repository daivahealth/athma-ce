/**
 * LLM Client Service
 * Unified service for LLM completions and embeddings
 */

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnthropicProvider } from './anthropic.provider';
import { OpenAIProvider } from './openai.provider';
import {
  OPENAI_COMPATIBLE_PROVIDERS,
  OpenAICompatibleProvider,
  type OpenAICompatibleProviderName,
} from './openai-compatible.provider';
import { ConfigClientService } from './config-client.service';
import {
  LLMCompletionRequest,
  LLMCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
} from './types';
import { logger } from '../../common/logger/logger.config';

@Injectable()
export class LLMClientService {
  private readonly defaultProvider: string;

  constructor(
    private configService: ConfigService,
    private configClient: ConfigClientService,
    private anthropicProvider: AnthropicProvider,
    private openaiProvider: OpenAIProvider,
    private openaiCompatibleProvider: OpenAICompatibleProvider,
  ) {
    this.defaultProvider = this.configService.get<string>('LLM_PROVIDER', 'anthropic');
    logger.info({ llmProvider: this.defaultProvider }, 'LLM Client initialized');
  }

  /**
   * Generate a completion using the configured LLM provider
   */
  async completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const llmProvider = await this.resolveProviderName();

    if (llmProvider === 'anthropic') {
      return this.anthropicProvider.completion(request);
    }

    if (llmProvider === 'openai') {
      return this.openaiProvider.completion(request);
    }

    if (OPENAI_COMPATIBLE_PROVIDERS.includes(llmProvider as OpenAICompatibleProviderName)) {
      return this.openaiCompatibleProvider.completion(
        request,
        llmProvider as OpenAICompatibleProviderName,
      );
    }

    logger.error({ llmProvider }, 'Unsupported LLM provider configured');
    throw new ServiceUnavailableException(
      `Report generation is unavailable because the AI Gateway does not support LLM provider "${llmProvider}".`,
    );
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
  async getProviderName(): Promise<string> {
    return this.resolveProviderName();
  }

  private async resolveProviderName(): Promise<string> {
    const provider = await this.configClient.resolveString('ai.provider', this.defaultProvider);
    return provider.trim().toLowerCase();
  }
}
