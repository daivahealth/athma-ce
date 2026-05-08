/**
 * Anthropic LLM Provider
 * Uses Claude models for natural language processing
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  LLMProvider,
  LLMCompletionRequest,
  LLMCompletionResponse,
  LLM_MODELS,
} from './types';
import { ConfigClientService } from './config-client.service';
import { logger } from '../../common/logger/logger.config';

@Injectable()
export class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private readonly clientCache = new Map<string, Anthropic>();

  constructor(
    private configService: ConfigService,
    private configClient: ConfigClientService,
  ) {}

  async completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const startTime = Date.now();
    const { client, model } = await this.getSettings();

    // Extract system message if present
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const userMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    try {
      const response = await client.messages.create({
        model,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0,
        system: systemMessage?.content,
        messages: userMessages,
        stop_sequences: request.stopSequences,
      });

      const duration = Date.now() - startTime;
      logger.debug(
        {
          model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          durationMs: duration,
        },
        'Anthropic completion completed',
      );

      // Extract text from content blocks
      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('');

      return {
        content: textContent,
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        stopReason: response.stop_reason || 'end_turn',
      };
    } catch (error) {
      logger.error({ error, model }, 'Anthropic completion failed');
      throw error;
    }
  }

  private async getSettings(): Promise<{ client: Anthropic; model: string }> {
    const apiKey = await this.configClient.resolveString(
      'ai.anthropic_api_key',
      this.configService.get<string>('ANTHROPIC_API_KEY', ''),
    );
    const model = await this.configClient.resolveString(
      'ai.anthropic_model',
      this.configService.get<string>('LLM_MODEL', LLM_MODELS.CLAUDE_SONNET),
    );

    if (!apiKey.trim()) {
      logger.error('Anthropic provider is unavailable: missing ai.anthropic_api_key / ANTHROPIC_API_KEY');
      throw new ServiceUnavailableException(
        'Report generation is unavailable because the AI Gateway is missing an Anthropic API key in Foundation config or ANTHROPIC_API_KEY.',
      );
    }

    let client = this.clientCache.get(apiKey);
    if (!client) {
      client = new Anthropic({ apiKey });
      this.clientCache.set(apiKey, client);
    }

    return { client, model };
  }
}
