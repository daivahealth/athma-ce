import { Module } from '@nestjs/common';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { ValueSetController } from './valueset.controller';
import { ValueSetService } from './valueset.service';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [ValueSetController],
  providers: [ValueSetService],
  exports: [ValueSetService],
})
export class ValueSetModule {}
