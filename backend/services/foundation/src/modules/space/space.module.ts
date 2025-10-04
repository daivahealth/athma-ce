import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { SpaceRepository } from './space.repository';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, SpaceRepository],
})
export class SpaceModule {}
