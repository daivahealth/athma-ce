import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { logger } from './logger.config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    logger.info({ context: context || this.context }, message);
  }

  error(message: any, trace?: string, context?: string) {
    logger.error({ context: context || this.context, trace }, message);
  }

  warn(message: any, context?: string) {
    logger.warn({ context: context || this.context }, message);
  }

  debug(message: any, context?: string) {
    logger.debug({ context: context || this.context }, message);
  }

  verbose(message: any, context?: string) {
    logger.trace({ context: context || this.context }, message);
  }
}
