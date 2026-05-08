import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigClientService } from '../../shared/llm-client/config-client.service';
import { OPENAI_COMPATIBLE_PROVIDERS } from '../../shared/llm-client/openai-compatible.provider';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    llm: { status: string; provider: string };
    embedding: { status: string; model: string };
  };
}

@Injectable()
export class HealthService {
  private readonly startTime: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly configClient: ConfigClientService,
  ) {
    this.startTime = Date.now();
  }

  async check(): Promise<HealthStatus> {
    const llmProvider = (
      await this.configClient.resolveString(
        'ai.provider',
        this.configService.get<string>('LLM_PROVIDER', 'anthropic'),
      )
    )
      .trim()
      .toLowerCase();
    const embeddingModel = await this.configClient.resolveString(
      'ai.embedding_model',
      this.configService.get<string>('EMBEDDING_MODEL', 'text-embedding-3-small'),
    );

    // Check if API keys are configured
    const hasAnthropicKey = !!(
      await this.configClient.resolveString(
        'ai.anthropic_api_key',
        this.configService.get<string>('ANTHROPIC_API_KEY', ''),
      )
    ).trim();
    const hasOpenAIKey = !!(
      await this.configClient.resolveString(
        'ai.openai_api_key',
        this.configService.get<string>('OPENAI_API_KEY', ''),
      )
    ).trim();

    const llmStatus =
      llmProvider === 'anthropic'
        ? hasAnthropicKey
          ? 'configured'
          : 'missing_key'
        : llmProvider === 'openai' || OPENAI_COMPATIBLE_PROVIDERS.includes(llmProvider as any)
          ? hasOpenAIKey
            ? 'configured'
            : 'missing_key'
          : 'unsupported_provider';
    const embeddingStatus = hasOpenAIKey ? 'configured' : 'missing_key';

    return {
      status: llmStatus === 'configured' && embeddingStatus === 'configured' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        llm: { status: llmStatus, provider: llmProvider },
        embedding: { status: embeddingStatus, model: embeddingModel },
      },
    };
  }

  async readinessCheck(): Promise<HealthStatus> {
    return this.check();
  }
}
