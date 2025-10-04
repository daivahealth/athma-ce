import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus() {
    return {
      service: 'foundation',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
