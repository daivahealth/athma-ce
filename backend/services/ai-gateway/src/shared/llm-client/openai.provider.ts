/**
 * OpenAI Provider
 * Used for embeddings (and optionally LLM completions)
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  LLMProvider,
  EmbeddingProvider,
  LLMCompletionRequest,
  LLMCompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  EMBEDDING_MODELS,
} from './types';
import { ConfigClientService } from './config-client.service';
import { logger } from '../../common/logger/logger.config';

@Injectable()
export class OpenAIProvider implements LLMProvider, EmbeddingProvider {
  name = 'openai';
  private readonly clientCache = new Map<string, OpenAI>();

  constructor(
    private configService: ConfigService,
    private configClient: ConfigClientService,
  ) {}

  async completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const startTime = Date.now();
    const { client, model } = await this.getCompletionSettings();

    try {
      const response = await client.chat.completions.create({
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
    const { client, defaultModel, dimensions } = await this.getEmbeddingSettings();
    const model = request.model || defaultModel;

    try {
      const response = await client.embeddings.create({
        model,
        input: request.texts,
        dimensions,
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
        dimensions: response.data[0]?.embedding.length || dimensions,
        totalTokens: response.usage.total_tokens,
      };
    } catch (error) {
      logger.error({ error, model }, 'OpenAI embedding failed');
      throw error;
    }
  }

  private async getCompletionSettings(): Promise<{ client: OpenAI; model: string }> {
    const apiKey = await this.resolveApiKey();
    const model = await this.configClient.resolveString(
      'ai.openai_model',
      this.configService.get<string>('OPENAI_MODEL', 'gpt-4o'),
    );
    return { client: this.getClient(apiKey), model };
  }

  private async getEmbeddingSettings(): Promise<{
    client: OpenAI;
    defaultModel: string;
    dimensions: number;
  }> {
    const apiKey = await this.resolveApiKey();
    const defaultModel = await this.configClient.resolveString(
      'ai.embedding_model',
      this.configService.get<string>(
        'EMBEDDING_MODEL',
        EMBEDDING_MODELS.TEXT_EMBEDDING_3_SMALL,
      ),
    );
    const dimensions = await this.configClient.resolveNumber(
      'ai.embedding_dimensions',
      parseInt(this.configService.get<string>('EMBEDDING_DIMENSIONS', '1536'), 10),
    );

    return {
      client: this.getClient(apiKey),
      defaultModel,
      dimensions,
    };
  }

  private async resolveApiKey(): Promise<string> {
    const apiKey = await this.configClient.resolveString(
      'ai.openai_api_key',
      this.configService.get<string>('OPENAI_API_KEY', ''),
    );
    if (!apiKey.trim()) {
      logger.error('OpenAI provider is unavailable: missing ai.openai_api_key / OPENAI_API_KEY');
      throw new ServiceUnavailableException(
        'OpenAI-backed AI features are unavailable because the AI Gateway is missing an OpenAI API key in Foundation config or OPENAI_API_KEY.',
      );
    }
    return apiKey;
  }

  private getClient(apiKey: string): OpenAI {
    let client = this.clientCache.get(apiKey);
    if (!client) {
      client = new OpenAI({ apiKey });
      this.clientCache.set(apiKey, client);
    }
    return client;
  }
}
