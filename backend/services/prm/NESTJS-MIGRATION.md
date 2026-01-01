# Express to NestJS Migration Guide

Complete mapping of Express + Joi architecture to NestJS + class-validator for Zeal PRM service.

## Migration Summary

| Component | Express | NestJS | Status |
|-----------|---------|--------|--------|
| **Framework** | Express 4.18 | NestJS 10.3 | ✅ Complete |
| **Validation** | Joi 17.11 | class-validator 0.14 | ✅ Complete |
| **Database** | Prisma 5.7 | Prisma 5.7 (unchanged) | ✅ No change |
| **Auth** | Passport OIDC (Express middleware) | @nestjs/passport + OIDC strategy | ✅ Complete |
| **API Docs** | Custom OpenAPI object | @nestjs/swagger decorators | ✅ Complete |
| **Worker** | setInterval | @nestjs/schedule @Cron | ✅ Complete |
| **Logging** | Pino | NestJS Logger | ✅ Replaced |

---

## 1. Application Bootstrap

### Express (src/index.ts)
```typescript
import express from 'express';
import { createApp } from './app';

const app = createApp();
app.listen(3013);
```

### NestJS (src/main.ts)
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const app = await NestFactory.create(AppModule);
await app.listen(3013);
```

**Key Changes:**
- `createApp()` → `NestFactory.create(AppModule)`
- Express app → NestJS application instance
- Global pipes/filters configured in `main.ts`

---

## 2. Application Structure

### Express (src/app.ts)
```typescript
export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(passport.initialize());

  // Routes
  app.use('/v1/events', eventsRouter);
  app.use('/v1/rules', rulesRouter);

  // Error handler
  app.use(errorHandler);

  return app;
}
```

### NestJS (src/app.module.ts)
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    EventsModule,
    RulesModule,
  ],
})
export class AppModule {}
```

**Key Changes:**
- Middleware → Modules and Guards
- Routes → Controllers in feature modules
- Error handler → Global exception filter in `main.ts`
- Configuration via `ConfigModule` instead of manual dotenv

---

## 3. Routes → Controllers

### Express Route (src/routes/events.routes.ts)
```typescript
router.post(
  '/',
  requireAuth,
  attachTenantContext,
  rejectTenantIdInBody,
  validate(ingestEventSchema),
  asyncHandler(async (req, res) => {
    const tenantId = req.tenantId;
    const userId = req.userId;
    const dto = req.body;

    const result = await eventService.ingestEvent(tenantId, userId, dto);
    res.status(201).json(result);
  })
);
```

### NestJS Controller (src/events/events.controller.ts)
```typescript
@Controller('v1/events')
@UseGuards(OidcAuthGuard)
export class EventsController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async ingestEvent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() dto: IngestEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.ingestEvent(tenantId, userId, dto);
  }
}
```

**Key Changes:**
- `router.post()` → `@Post()` decorator
- Middleware chain → `@UseGuards()` decorator
- `req.tenantId` → `@TenantId()` custom decorator
- Manual validation → Automatic via DTOs + ValidationPipe
- Manual response → Return value auto-serialized

---

## 4. Validation: Joi → class-validator

### Express Joi Schema
```typescript
const ingestEventSchema = Joi.object({
  patient_id: Joi.string().uuid().required(),
  patient_gender: Joi.string().valid('M', 'F', 'O', 'U').optional(),
  event_type: Joi.string().required(),
  payload: Joi.object().required(),
  dedupe_key: Joi.string().required(),
});

router.post('/', validate(ingestEventSchema), handler);
```

### NestJS class-validator DTO
```typescript
export class IngestEventDto {
  @IsUUID()
  patient_id: string;

  @IsOptional()
  @IsEnum(PatientGender)
  patient_gender?: PatientGender;

  @IsString()
  event_type: string;

  @IsObject()
  payload: Record<string, any>;

  @IsString()
  dedupe_key: string;
}

// Controller auto-validates via global ValidationPipe
@Post()
async ingestEvent(@Body() dto: IngestEventDto) {}
```

**Key Changes:**
- Joi schema function → DTO class
- `Joi.string()` → `@IsString()`
- `Joi.uuid()` → `@IsUUID()`
- `.valid()` → `@IsEnum()`
- `.optional()` → `@IsOptional()`
- Runtime validation automatic via `ValidationPipe` in `main.ts`

---

## 5. Authentication Middleware → Guards

### Express Middleware (src/middleware/auth.middleware.ts)
```typescript
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export function attachTenantContext(req: Request, res: Response, next: NextFunction) {
  req.tenantId = req.user[config.oidc.tenantClaim];
  req.userId = req.user[config.oidc.userClaim];
  next();
}

// Usage
router.post('/', requireAuth, attachTenantContext, handler);
```

### NestJS Guard + Decorators
```typescript
// Guard (src/auth/guards/oidc-auth.guard.ts)
@Injectable()
export class OidcAuthGuard extends AuthGuard('oidc') {
  canActivate(context: ExecutionContext) {
    // Dev mode: simple token parsing
    // Prod mode: OIDC validation
    return super.canActivate(context);
  }
}

// Decorators (src/common/decorators/)
export const TenantId = createParamDecorator((data, ctx) => {
  const user = ctx.switchToHttp().getRequest().user;
  return user[process.env.OIDC_TENANT_CLAIM];
});

export const UserId = createParamDecorator((data, ctx) => {
  const user = ctx.switchToHttp().getRequest().user;
  return user[process.env.OIDC_USER_CLAIM];
});

// Usage
@UseGuards(OidcAuthGuard)
@Post()
async handler(@TenantId() tenantId: string, @UserId() userId: string) {}
```

**Key Changes:**
- Middleware functions → Guard classes implementing `CanActivate`
- `req.tenantId = ...` → `@TenantId()` parameter decorator
- Middleware chain → `@UseGuards()` decorator
- Passport config → NestJS `PassportStrategy`

---

## 6. Error Handling

### Express Error Middleware
```typescript
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'ConflictError' });
    }
  }

  res.status(500).json({ error: 'InternalServerError' });
}

app.use(errorHandler);
```

### NestJS Exception Filter
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(...);
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json(...);
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(...);
  }
}

// main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

**Key Changes:**
- Middleware → Exception filter implementing `ExceptionFilter`
- `err, req, res, next` → `exception, host` (ArgumentsHost)
- `res.status().json()` → `response.status().json()`
- Manual error classes → Built-in HTTP exceptions (`BadRequestException`, etc.)

---

## 7. Services (Business Logic)

### Express Service
```typescript
export class EventService {
  constructor(private prisma: PrismaClient) {}

  async ingestEvent(tenantId: string, userId: string, dto: IngestEventDto) {
    const event = await this.prisma.patientEngagementEvent.create({
      data: { ...dto, tenantId, createdBy: userId },
    });
    return event;
  }
}

export const eventService = new EventService();
```

### NestJS Service
```typescript
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async ingestEvent(tenantId: string, userId: string, dto: IngestEventDto) {
    const event = await this.prisma.patientEngagementEvent.create({
      data: { ...dto, tenantId, createdBy: userId },
    });
    return event;
  }
}

// In module
@Module({
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
```

**Key Changes:**
- Class instance → `@Injectable()` decorator
- Manual instantiation → Automatic DI by NestJS
- Direct Prisma import → Injected `PrismaService`
- Singleton export → Provided via module

---

## 8. Database (Prisma)

### Express Prisma Client
```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Apply tenant middleware manually
prisma.$use(async (params, next) => {
  params.args.where = { ...params.args.where, tenantId };
  return next(params);
});
```

### NestJS Prisma Service
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  applyTenantMiddleware(tenantId: string) {
    this.$use(async (params, next) => {
      params.args.where = { ...params.args.where, tenantId };
      return next(params);
    });
  }
}

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

**Key Changes:**
- Direct export → Injectable service
- Manual connect → `OnModuleInit` lifecycle hook
- Global instance → Global module
- **No schema changes** - Prisma schema remains identical

---

## 9. Worker (Job Runner)

### Express Worker
```typescript
// src/worker.ts
setInterval(async () => {
  const jobs = await jobService.getReadyJobs();
  for (const job of jobs) {
    await processJob(job);
  }
}, 5000);
```

### NestJS Worker
```typescript
@Injectable()
export class JobsRunnerService {
  @Cron(CronExpression.EVERY_5_SECONDS)
  async processJobs() {
    const jobs = await this.jobsService.getReadyJobs();
    for (const job of jobs) {
      await this.processJob(job);
    }
  }
}

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [JobsRunnerService],
})
export class JobsModule {}
```

**Key Changes:**
- `setInterval()` → `@Cron()` decorator
- Standalone script → Injectable service in module
- Manual interval → Cron expression or configurable interval
- **CRITICAL:** Postgres `FOR UPDATE SKIP LOCKED` logic unchanged

---

## 10. OpenAPI Documentation

### Express Custom Spec
```typescript
export const openApiSpec = {
  openapi: '3.0.0',
  paths: {
    '/v1/events': {
      post: {
        summary: 'Ingest event',
        requestBody: { ... },
        responses: { ... },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
```

### NestJS Swagger Decorators
```typescript
@ApiTags('Events')
@Controller('v1/events')
export class EventsController {
  @Post()
  @ApiOperation({ summary: 'Ingest event' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  async ingestEvent(@Body() dto: IngestEventDto) {}
}

// DTO
export class IngestEventDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patient_id: string;
}

// main.ts
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

**Key Changes:**
- Manual JSON object → Decorators on controllers/DTOs
- Single spec file → Distributed across files
- Manual schema definitions → Auto-generated from DTOs
- Same endpoint: `/api-docs`

---

## 11. Configuration

### Express Config
```typescript
// src/config/index.ts
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const schema = Joi.object({ PORT: Joi.number().required() });
const { error, value } = schema.validate(process.env);

export const config = {
  port: value.PORT,
  database: { url: value.PRM_DATABASE_URL },
};
```

### NestJS Config
```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT || '3013', 10),
  database: { url: process.env.PRM_DATABASE_URL },
});

// src/config/validation.schema.ts
const schema = Joi.object({ PORT: Joi.number().required() });

export function validateEnvironment(config: Record<string, unknown>) {
  const { error, value } = schema.validate(config);
  if (error) throw new Error(`Config validation: ${error.message}`);
  return value;
}

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
  ],
})
```

**Key Changes:**
- Direct object export → Factory function
- Manual dotenv → `ConfigModule.forRoot()`
- Direct access → `ConfigService.get()`
- Validation still uses Joi (for env vars only)

---

## 12. File Structure Mapping

| Express | NestJS |
|---------|--------|
| `src/index.ts` | `src/main.ts` |
| `src/app.ts` | `src/app.module.ts` |
| `src/routes/events.routes.ts` | `src/events/events.controller.ts` |
| `src/services/event.service.ts` | `src/events/events.service.ts` |
| `src/middleware/auth.middleware.ts` | `src/auth/guards/oidc-auth.guard.ts` |
| `src/middleware/validation.middleware.ts` | DTOs + `ValidationPipe` |
| `src/middleware/error.middleware.ts` | `src/common/filters/http-exception.filter.ts` |
| `src/lib/database.ts` | `src/database/prisma.service.ts` |
| `src/lib/logger.ts` | Built-in `Logger` |
| `src/config/index.ts` | `src/config/configuration.ts` + `ConfigModule` |
| `src/worker.ts` | `src/jobs/jobs-runner.service.ts` |

---

## 13. Testing Migration

### Express Tests
```typescript
import supertest from 'supertest';
import { createApp } from './app';

describe('POST /v1/events', () => {
  it('should ingest event', async () => {
    const app = createApp();
    const response = await supertest(app)
      .post('/v1/events')
      .send({ ... });
    expect(response.status).toBe(201);
  });
});
```

### NestJS Tests
```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('POST /v1/events', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should ingest event', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/events')
      .send({ ... });
    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**Key Changes:**
- Direct app import → `Test.createTestingModule()`
- Supertest on app → Supertest on `app.getHttpServer()`
- Manual setup → NestJS testing utilities

---

## What Stays EXACTLY the Same

✅ **Prisma Schema** - No changes to `prisma/schema.prisma`
✅ **Database Tables** - All 9 tables unchanged
✅ **Business Logic** - Event ingestion, rules evaluation, job execution
✅ **Rules Engine DSL** - JSON condition expressions
✅ **Job Queue Logic** - `FOR UPDATE SKIP LOCKED` Postgres locking
✅ **Retry/Backoff** - Exponential backoff algorithm
✅ **Idempotency** - dedupe_key, idempotency_key logic
✅ **Multi-Tenancy** - Tenant isolation via middleware
✅ **External Clients** - Consent service, channel senders (stubs)
✅ **API Contracts** - Request/response payloads identical
✅ **Environment Variables** - Same .env structure

---

## Migration Checklist

- [ ] Install NestJS dependencies (`npm install @nestjs/...`)
- [ ] Create `nest-cli.json`
- [ ] Migrate `src/index.ts` → `src/main.ts`
- [ ] Create `AppModule` with all feature modules
- [ ] Migrate config to `ConfigModule`
- [ ] Create `PrismaService` in `DatabaseModule`
- [ ] Migrate routes to controllers (one module at a time)
- [ ] Convert Joi schemas to class-validator DTOs
- [ ] Implement OIDC strategy and guards
- [ ] Create tenant context decorators
- [ ] Migrate worker to `@Cron` job runner
- [ ] Add global exception filter
- [ ] Update Swagger to use decorators
- [ ] Update tests to use NestJS testing utilities
- [ ] Update `package.json` scripts
- [ ] Update Dockerfile build commands
- [ ] Test all endpoints for parity
- [ ] Verify job worker behavior
- [ ] Deploy to staging

---

## Running the NestJS Version

```bash
# Install dependencies
npm install

# Generate Prisma client (unchanged)
npx prisma generate

# Run migrations (unchanged)
npx prisma migrate deploy

# Start API server
npm run start:dev

# Start worker (separate process)
npm run worker:dev

# Build for production
npm run build

# Start production
npm run start:prod
```

**All endpoints remain at same paths:**
- `POST /v1/events`
- `GET /v1/rules`
- `GET /api-docs`
- etc.

**No frontend changes required** - API contracts preserved.
