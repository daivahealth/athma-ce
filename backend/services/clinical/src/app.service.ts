import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'clinical',
      timestamp: new Date().toISOString(),
    };
  }
}
