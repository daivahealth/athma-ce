import { Controller, Get, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  @Get()
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('routes')
  getRoutes() {
    const server = this.adapterHost.httpAdapter.getInstance();
    const routes: { method: string; path: string }[] = [];
    server._router?.stack?.forEach((layer: any) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
        routes.push({ method: methods.join(','), path: layer.route.path });
      } else if (layer.name === 'router' && layer.handle?.stack) {
        layer.handle.stack.forEach((r: any) => {
          if (r.route) {
            const methods = Object.keys(r.route.methods).map((m) => m.toUpperCase());
            routes.push({ method: methods.join(','), path: r.route.path });
          }
        });
      }
    });
    const oncologyRoutes = routes.filter((r) => r.path.includes('oncology'));
    return { total: routes.length, oncologyRoutes, oncologyCount: oncologyRoutes.length };
  }
}
