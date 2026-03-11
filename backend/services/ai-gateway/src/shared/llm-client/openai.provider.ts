/**
 * OpenAI Provider
 * Used for embeddings (and optionally LLM completions)
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  LLMProvider,
  EmbeddingProvider,
  LLMCompletionRequest,
  LLMCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  EMBEDDING_MODELS,
} from './types';
import { logger } from '../../common/logger/logger.config';

@Injectable()
export class OpenAIProvider implements LLMProvider, EmbeddingProvider {
  name = 'openai';
  private client: OpenAI;
  private embeddingModel: string;
  private embeddingDimensions: number;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      logger.warn('OPENAI_API_KEY not configured');
    }
    this.client = new OpenAI({ apiKey: apiKey || '' });
    this.embeddingModel = this.configService.get<string>(
      'EMBEDDING_MODEL',
      EMBEDDING_MODELS.TEXT_EMBEDDING_3_SMALL,
    );
    const dimensionsStr = this.configService.get<string>('EMBEDDING_DIMENSIONS', '1536');
    this.embeddingDimensions = parseInt(dimensionsStr, 10);
  }

  async completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const startTime = Date.now();
    const model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: request.temperature ?? 0,
        max_tokens: request.maxTokens || 4096,
        stop: request.stopSequences,
      });

      const duration = Date.now() - startTime;
      logger.debug(
        {
          model,
          inputTokens: response.usage?.prompt_tokens,
          outputTokens: response.usage?.completion_tokens,
          durationMs: duration,
        },
        'OpenAI completion completed',
      );

      return {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        stopReason: response.choices[0]?.finish_reason || 'stop',
      };
    } catch (error) {
      logger.error({ error, model }, 'OpenAI completion failed');
      throw error;
    }
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const startTime = Date.now();
    const model = request.model || this.embeddingModel;

    try {
      const response = await this.client.embeddings.create({
        model,
        input: request.texts,
        dimensions: this.embeddingDimensions,
      });

      const duration = Date.now() - startTime;
      logger.debug(
        {
          model,
          textCount: request.texts.length,
          totalTokens: response.usage.total_tokens,
          durationMs: duration,
        },
        'OpenAI embedding completed',
      );

      return {
        embeddings: response.data.map((d) => d.embedding),
        model: response.model,
        dimensions: response.data[0]?.embedding.length || this.embeddingDimensions,
        totalTokens: response.usage.total_tokens,
      };
    } catch (error) {
      logger.error({ error, model }, 'OpenAI embedding failed');
      throw error;
    }
  }
}
