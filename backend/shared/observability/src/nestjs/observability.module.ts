/**
 * NestJS Observability Module
 *
 * Provides observability integration for NestJS applications.
 * Includes request logging middleware and metrics collection.
 */

import { Module, DynamicModule, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RequestLoggingMiddleware } from './request-logging.middleware';
import { getObservabilityConfig, ObservabilityConfig } from '../config';

export interface ObservabilityModuleOptions {
  /** Override configuration (optional - defaults to environment variables) */
  config?: Partial<ObservabilityConfig>;
  /** Paths to exclude from request logging */
  excludePaths?: string[];
}

const OBSERVABILITY_CONFIG = 'OBSERVABILITY_CONFIG';

@Global()
@Module({})
export class ObservabilityModule implements NestModule {
  private static excludePaths: string[] = ['/health', '/ready', '/metrics'];

  /**
   * Register the observability module
   */
  static forRoot(options?: ObservabilityModuleOptions): DynamicModule {
    const config = {
      ...getObservabilityConfig(),
      ...options?.config,
    };

    if (options?.excludePaths) {
      this.excludePaths = [...this.excludePaths, ...options.excludePaths];
    }

    return {
      module: ObservabilityModule,
      providers: [
        {
          provide: OBSERVABILITY_CONFIG,
          useValue: config,
        },
      ],
      exports: [OBSERVABILITY_CONFIG],
    };
  }

  /**
   * Configure middleware
   */
  configure(consumer: MiddlewareConsumer): void {
    const config = getObservabilityConfig();

    if (config.enabled || config.logging.enabled) {
      consumer
        .apply(RequestLoggingMiddleware)
        .exclude(...ObservabilityModule.excludePaths)
        .forRoutes('*');
    }
  }
}
