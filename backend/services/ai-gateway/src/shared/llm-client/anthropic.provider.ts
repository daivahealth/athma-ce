/**
 * Anthropic LLM Provider
 * Uses Claude models for natural language processing
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  LLMProvider,
  LLMCompletionRequest,
  LLMCompletionResponse,
  LLM_MODELS,
} from './types';
import { logger } from '../../common/logger/logger.config';

@Injectable()
export class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private client: Anthropic;
  private model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      logger.warn('ANTHROPIC_API_KEY not configured');
    }
    this.client = new Anthropic({ apiKey: apiKey || '' });
    this.model = this.configService.get<string>('LLM_MODEL', LLM_MODELS.CLAUDE_SONNET);
  }

  async completion(request: LLMCompletionRequest): Promise<LLMCompletionResponse> {
    const startTime = Date.now();

    // Extract system message if present
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const userMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0,
        system: systemMessage?.content,
        messages: userMessages,
        stop_sequences: request.stopSequences,
      });

      const duration = Date.now() - startTime;
      logger.debug(
        {
          model: this.model,
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
      logger.error({ error, model: this.model }, 'Anthropic completion failed');
      throw error;
    }
  }
}
