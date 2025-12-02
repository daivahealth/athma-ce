import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { ValueSetController } from './valueset.controller';
import { ValueSetService } from './valueset.service';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [ValueSetController],
  providers: [ValueSetService],
  exports: [ValueSetService],
})
export class ValueSetModule {}
