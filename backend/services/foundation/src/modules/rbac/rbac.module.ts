import { Module } from '@nestjs/common';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { RbacRepository } from './rbac.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RbacController],
  providers: [RbacService, RbacRepository],
  exports: [RbacService],
})
export class RbacModule {}
