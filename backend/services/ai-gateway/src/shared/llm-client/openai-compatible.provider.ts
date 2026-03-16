/**
 * OpenAI-Compatible Provider
 *
 * Single provider implementation for all services that expose an OpenAI-compatible
 * chat completions API: Groq, Mistral AI, xAI (Grok), Google Gemini, and Ollama.
 *
 * API keys and base URLs are resolved from the Foundation config system per tenant,
 * with env vars as fallback.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  LLMCompletionRequest,
  LLMCompletionResponse,
} from './types';
import { ConfigClientService } from './config-client.service';
import { logger } from '../../common/logger/logger.config';

export const OPENAI_COMPATIBLE_PROVIDERS = ['groq', 'mistral', 'xai', 'google', 'ollama'] as const;
export type OpenAICompatibleProviderName = (typeof OPENAI_COMPATIBLE_PROVIDERS)[number];

interface ProviderDefaults {
  baseURL: string;
  envApiKey: string;
  envModel: string;
  defaultModel: string;
}

const PROVIDER_DEFAULTS: Record<OpenAICompatibleProviderName, ProviderDefaults> = {
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    envApiKey: 'GROQ_API_KEY',
    envModel: 'GROQ_MODEL',
    defaultModel: 'llama-3.3-70b-versatile',
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    envApiKey: 'MISTRAL_API_KEY',
    envModel: 'MISTRAL_MODEL',
    defaultModel: 'mistral-large-latest',
  },
  xai: {
    baseURL: 'https://api.x.ai/v1',
    envApiKey: 'XAI_API_KEY',
    envModel: 'XAI_MODEL',
    defaultModel: 'grok-2-latest',
  },
  google: {
    // Google's OpenAI-compatible endpoint (Gemini via REST)
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    envApiKey: 'GOOGLE_API_KEY',
    envModel: 'GOOGLE_MODEL',
    defaultModel: 'gemini-2.0-flash',
  },
  ollama: {
    // Ollama local server — override via ai.ollama_base_url config key
    baseURL: 'http://localhost:11434/v1',
    envApiKey: 'OLLAMA_API_KEY',
    envModel: 'OLLAMA_MODEL',
    defaultModel: 'llama3.2',
  },
};

@Injectable()
export class OpenAICompatibleProvider {
  name = 'openai-compatible';

  // Cache clients keyed by `providerName:apiKey:baseURL`
  private readonly clientCache = new Map<string, OpenAI>();

  constructor(
    private readonly configService: ConfigService,
    private readonly configClient: ConfigClientService,
  ) {}

  private async getSettings(providerName: OpenAICompatibleProviderName): Promise<{
    client: OpenAI;
    model: string;
  }> {
    const defaults = PROVIDER_DEFAULTS[providerName];

    const apiKey = await this.configClient.resolveString(
      `ai.${providerName}_api_key`,
      this.configService.get<string>(defaults.envApiKey, ''),
    );
    const model = await this.configClient.resolveString(
      `ai.${providerName}_model`,
      this.configService.get<string>(defaults.envModel, defaults.defaultModel),
    );

    // Ollama lets users override the base URL (e.g. remote Ollama server)
    const baseURL =
      providerName === 'ollama'
        ? await this.configClient.resolveString(
            'ai.ollama_base_url',
            this.configService.get<string>('OLLAMA_BASE_URL', defaults.baseURL),
          )
        : defaults.baseURL;

    const cacheKey = `${providerName}:${apiKey}:${baseURL}`;
    let client = this.clientCache.get(cacheKey);
    if (!client) {
      if (!apiKey && providerName !== 'ollama') {
        logger.warn({ providerName }, 'API key not configured in Foundation or env vars');
      }
      client = new OpenAI({
        apiKey: apiKey || 'ollama', // Ollama accepts any non-empty string
        baseURL,
      });
      this.clientCache.set(cacheKey, client);
    }

    return { client, model };
  }

  async completion(
    request: LLMCompletionRequest,
    providerName: OpenAICompatibleProviderName,
  ): Promise<LLMCompletionResponse> {
    const startTime = Date.now();
    const { client, model } = await this.getSettings(providerName);

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
          provider: providerName,
          model,
          inputTokens: response.usage?.prompt_tokens,
          outputTokens: response.usage?.completion_tokens,
          durationMs: duration,
        },
        `${providerName} completion completed`,
      );

      return {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        stopReason: response.choices[0]?.finish_reason || 'stop',
      };
    } catch (error) {
      logger.error({ error, provider: providerName, model }, `${providerName} completion failed`);
      throw error;
    }
  }
}
