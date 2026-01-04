/**
 * Root Application Module
 * Replaces Express app.ts
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { validateEnvironment } from './config/validation.schema';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
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

    // Schedule for cron jobs (worker)
    ScheduleModule.forRoot(),

    // Database (global)
    DatabaseModule,

    // Auth & tenant context
    AuthModule,
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

    // External clients
    ConsentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
