/**
 * Root Application Module
 * Replaces Express app.ts
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Observability
import { ObservabilityModule } from '@zeal/observability';
import { SharedAuthModule } from '@zeal/shared-utils';

import configuration from './config/configuration';
import { validateEnvironment } from './config/validation.schema';

// Core modules
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './tenant/tenant.module';

// Feature modules
import { EventsModule } from './events/events.module';
import { RulesModule } from './rules/rules.module';
import { JobsModule } from './jobs/jobs.module';
import { TemplatesModule } from './templates/templates.module';
import { TasksModule } from './tasks/tasks.module';
import { MessagesModule } from './messages/messages.module';
import { PreferencesModule } from './preferences/preferences.module';
import { ProvidersModule } from './providers/providers.module';
import { NotificationsModule } from './notifications/notifications.module';

// Client modules
import { ConsentModule } from './clients/consent/consent.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),

    // Observability (request logging middleware with trace context)
    ObservabilityModule.forRoot({
      excludePaths: ['/health', '/ready', '/api-docs'],
    }),

    // Schedule for cron jobs (worker)
    ScheduleModule.forRoot(),

    // Database (global)
    DatabaseModule,

    // Auth & tenant context
    SharedAuthModule,
    TenantModule,

    // Feature modules
    EventsModule,
    RulesModule,
    TemplatesModule,
    TasksModule,
    MessagesModule,
    PreferencesModule,
    ProvidersModule,
    JobsModule,
    NotificationsModule,

    // External clients
    ConsentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
