/**
 * Rules Module
 */

import { Module } from '@nestjs/common';
import { RulesEngineService } from './rules-engine.service';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';

@Module({
  controllers: [RulesController],
  providers: [RulesEngineService, RulesService],
  exports: [RulesEngineService, RulesService],
})
export class RulesModule {}
