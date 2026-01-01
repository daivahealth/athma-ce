# NestJS Folder Structure

```
backend/services/prm/
├── README.md
├── ARCHITECTURE.md
├── NESTJS-MIGRATION.md                 # This migration guide
├── package.json                         # Updated with NestJS dependencies
├── tsconfig.json
├── nest-cli.json                        # NestJS CLI config
├── Dockerfile
├── docker-compose.yml
├── .env.example
│
├── prisma/
│   ├── schema.prisma                    # UNCHANGED
│   └── migrations/
│
├── src/
│   ├── main.ts                          # NestJS bootstrap (was index.ts)
│   ├── app.module.ts                    # Root module
│   ├── worker.ts                        # Worker bootstrap (separate app)
│   │
│   ├── common/                          # Shared utilities
│   │   ├── decorators/
│   │   │   ├── tenant-id.decorator.ts   # @TenantId() param decorator
│   │   │   └── user-id.decorator.ts     # @UserId() param decorator
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global exception filter
│   │   ├── guards/
│   │   │   ├── auth.guard.ts            # OIDC auth guard
│   │   │   └── tenant.guard.ts          # Tenant context guard
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts   # Request logging
│   │   └── pipes/
│   │       └── validation.pipe.ts       # Custom validation pipe
│   │
│   ├── config/
│   │   ├── config.module.ts             # ConfigModule setup
│   │   ├── configuration.ts             # Config factory
│   │   └── validation.schema.ts         # Joi env validation
│   │
│   ├── database/
│   │   ├── database.module.ts           # Prisma module
│   │   ├── prisma.service.ts            # Prisma client service
│   │   └── tenant-middleware.ts         # Multi-tenant middleware
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   │   └── oidc.strategy.ts         # Passport OIDC strategy
│   │   ├── guards/
│   │   │   └── oidc-auth.guard.ts       # AuthGuard('oidc')
│   │   └── auth.controller.ts           # /auth/callback
│   │
│   ├── tenant/
│   │   ├── tenant.module.ts
│   │   ├── tenant.service.ts            # Tenant context management
│   │   └── tenant-context.ts            # AsyncLocalStorage for tenant
│   │
│   ├── events/
│   │   ├── events.module.ts
│   │   ├── events.controller.ts         # POST /v1/events
│   │   ├── events.service.ts            # Event ingestion logic
│   │   └── dto/
│   │       ├── ingest-event.dto.ts      # Request DTO
│   │       └── event-response.dto.ts    # Response DTO
│   │
│   ├── rules/
│   │   ├── rules.module.ts
│   │   ├── rules.controller.ts          # CRUD /v1/rules
│   │   ├── rules.service.ts
│   │   ├── rules-engine.service.ts      # JSON DSL evaluator (UNCHANGED)
│   │   └── dto/
│   │       ├── create-rule.dto.ts
│   │       ├── update-rule.dto.ts
│   │       └── rule-response.dto.ts
│   │
│   ├── templates/
│   │   ├── templates.module.ts
│   │   ├── templates.controller.ts      # CRUD /v1/templates
│   │   ├── templates.service.ts
│   │   └── dto/
│   │       ├── create-template.dto.ts
│   │       ├── update-template.dto.ts
│   │       └── template-response.dto.ts
│   │
│   ├── preferences/
│   │   ├── preferences.module.ts
│   │   ├── preferences.controller.ts    # GET/PUT /v1/patients/:patientId/preferences
│   │   ├── preferences.service.ts
│   │   └── dto/
│   │       ├── update-preferences.dto.ts
│   │       └── preferences-response.dto.ts
│   │
│   ├── timeline/
│   │   ├── timeline.module.ts
│   │   ├── timeline.controller.ts       # GET /v1/patients/:patientId/timeline
│   │   ├── timeline.service.ts
│   │   └── dto/
│   │       ├── timeline-query.dto.ts
│   │       └── timeline-response.dto.ts
│   │
│   ├── messages/
│   │   ├── messages.module.ts
│   │   ├── messages.controller.ts       # GET /v1/patients/:patientId/messages
│   │   ├── messages.service.ts
│   │   └── dto/
│   │       ├── message-query.dto.ts
│   │       └── message-response.dto.ts
│   │
│   ├── tasks/
│   │   ├── tasks.module.ts
│   │   ├── tasks.controller.ts          # GET/POST /v1/patients/:patientId/tasks, PATCH /v1/tasks/:taskId
│   │   ├── tasks.service.ts
│   │   └── dto/
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       └── task-response.dto.ts
│   │
│   ├── providers/
│   │   ├── providers.module.ts
│   │   ├── providers.controller.ts      # POST /v1/providers/:channel/callbacks
│   │   ├── providers.service.ts
│   │   └── dto/
│   │       └── provider-callback.dto.ts
│   │
│   ├── jobs/
│   │   ├── jobs.module.ts
│   │   ├── jobs.service.ts              # Job queue management (UNCHANGED logic)
│   │   ├── jobs-runner.service.ts       # @Cron scheduler
│   │   ├── jobs-executor.service.ts     # Job execution (send message, create task)
│   │   └── dto/
│   │       └── create-job.dto.ts
│   │
│   └── clients/                         # External service clients
│       ├── consent/
│       │   ├── consent.module.ts
│       │   └── consent.service.ts       # ClinicalConsentClient (UNCHANGED)
│       └── channels/
│           ├── channels.module.ts
│           ├── channel-sender.interface.ts
│           ├── sms.sender.ts            # UNCHANGED
│           ├── whatsapp.sender.ts       # UNCHANGED
│           ├── email.sender.ts          # UNCHANGED
│           └── inapp.sender.ts          # UNCHANGED
│
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

## Key Changes from Express

| Express | NestJS |
|---------|--------|
| `src/index.ts` | `src/main.ts` |
| `src/app.ts` (Express app) | `src/app.module.ts` (root module) |
| `src/routes/*.routes.ts` | `src/*/*.controller.ts` |
| `src/services/*.service.ts` | `src/*/*.service.ts` (as providers) |
| `src/middleware/auth.middleware.ts` | `src/auth/strategies/oidc.strategy.ts` + guards |
| `src/middleware/validation.middleware.ts` | `src/*/dto/*.dto.ts` + ValidationPipe |
| `src/middleware/error.middleware.ts` | `src/common/filters/http-exception.filter.ts` |
| `src/lib/database.ts` | `src/database/prisma.service.ts` |
| `src/lib/logger.ts` | Built-in Logger or custom LoggerService |
| `src/docs/openapi.ts` | NestJS Swagger decorators |
| setInterval in worker.ts | `@Cron()` decorator in jobs-runner.service.ts |

## Module Dependencies

```
AppModule
├── ConfigModule (global)
├── DatabaseModule (global)
├── AuthModule
├── TenantModule
├── EventsModule → RulesModule, JobsModule
├── RulesModule
├── TemplatesModule
├── PreferencesModule → DatabaseModule
├── TimelineModule → DatabaseModule
├── MessagesModule → DatabaseModule
├── TasksModule → DatabaseModule
├── ProvidersModule → MessagesModule
├── JobsModule → ConsentsModule, ChannelsModule, TemplatesModule, TasksModule
├── ConsentsModule
└── ChannelsModule
```
