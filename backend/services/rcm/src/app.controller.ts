import { Controller, Get } from '@nestjs/common';
import { Public } from '@zeal/shared-utils';
import { AppService } from './app.service';

@Public()
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth() {
    return this.appService.getHealth();
  }
}
