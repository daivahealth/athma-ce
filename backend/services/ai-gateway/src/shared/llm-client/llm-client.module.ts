import { Global, Module } from '@nestjs/common';
import { LLMClientService } from './llm-client.service';
import { AnthropicProvider } from './anthropic.provider';
import { OpenAIProvider } from './openai.provider';

@Global()
@Module({
  providers: [LLMClientService, AnthropicProvider, OpenAIProvider],
  exports: [LLMClientService],
})
export class LLMClientModule {}
