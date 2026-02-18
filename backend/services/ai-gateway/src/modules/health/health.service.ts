import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  constructor(private readonly configService: ConfigService) {
    this.startTime = Date.now();
  }

  async check(): Promise<HealthStatus> {
    const llmProvider = this.configService.get<string>('LLM_PROVIDER', 'anthropic');
    const embeddingModel = this.configService.get<string>('EMBEDDING_MODEL', 'text-embedding-3-small');

    // Check if API keys are configured
    const hasAnthropicKey = !!this.configService.get<string>('ANTHROPIC_API_KEY');
    const hasOpenAIKey = !!this.configService.get<string>('OPENAI_API_KEY');

    const llmStatus = llmProvider === 'anthropic' ? (hasAnthropicKey ? 'configured' : 'missing_key') : (hasOpenAIKey ? 'configured' : 'missing_key');
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
