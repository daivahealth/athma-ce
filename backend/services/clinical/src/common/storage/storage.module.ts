import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileController } from './file.controller';

@Global()
@Module({
  controllers: [FileController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
