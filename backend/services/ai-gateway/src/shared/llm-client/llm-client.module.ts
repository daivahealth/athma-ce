import { Global, Module } from '@nestjs/common';
import { LLMClientService } from './llm-client.service';
import { AnthropicProvider } from './anthropic.provider';
import { OpenAIProvider } from './openai.provider';
import { OpenAICompatibleProvider } from './openai-compatible.provider';
import { ConfigClientService } from './config-client.service';

@Global()
@Module({
  providers: [
    LLMClientService,
    AnthropicProvider,
    OpenAIProvider,
    OpenAICompatibleProvider,
    ConfigClientService,
  ],
  exports: [LLMClientService],
})
export class LLMClientModule {}
