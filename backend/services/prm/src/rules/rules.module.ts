/**
 * Rules Module
 */

import { Module } from '@nestjs/common';
import { RulesEngineService } from './rules-engine.service';

@Module({
  providers: [RulesEngineService],
  exports: [RulesEngineService],
})
export class RulesModule {}
