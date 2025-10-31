# API Gateway with Unified Swagger Documentation

## Overview

This document describes the implementation approach for an API Gateway that consolidates all microservices (Foundation, Clinical, RCM) behind a single entry point with unified Swagger documentation.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (localhost:3000)                              │
│  - Single API base URL: http://localhost:3000/api/v1   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  API Gateway (localhost:3000)                           │
│  ┌────────────────────────────────────────────────┐    │
│  │  Unified Swagger UI (/api/docs)                │    │
│  │  - Foundation endpoints                         │    │
│  │  - Clinical endpoints                           │    │
│  │  - RCM endpoints                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Request Router & Proxy                         │    │
│  │  /api/v1/foundation/* → :3010                   │    │
│  │  /api/v1/clinical/*   → :3011                   │    │
│  │  /api/v1/rcm/*        → :3012                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Cross-Cutting Concerns                         │    │
│  │  - JWT Validation                               │    │
│  │  - Multi-tenancy header validation              │    │
│  │  - Rate limiting                                │    │
│  │  - Request logging                              │    │
│  └────────────────────────────────────────────────┘    │
└──────────┬──────────────┬──────────────┬───────────────┘
           │              │              │
           ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Foundation   │ │ Clinical     │ │ RCM          │
│ Service      │ │ Service      │ │ Service      │
│ :3010        │ │ :3011        │ │ :3012        │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Benefits

| Feature | Without Gateway | With Gateway |
|---------|----------------|--------------|
| **Swagger URLs** | 3 separate (3010/docs, 3011/docs, 3012/docs) | 1 unified (3000/api/docs) |
| **Frontend API URLs** | 3 base URLs to manage | 1 base URL |
| **Auth validation** | Duplicated in each service | Centralized |
| **Rate limiting** | Per-service or none | Platform-wide |
| **CORS config** | 3 places to update | 1 place |
| **SSL/TLS termination** | 3 certificates | 1 certificate |
| **Monitoring** | 3 endpoints to watch | 1 endpoint |

## Implementation Steps

### Step 1: Create API Gateway Service

```bash
cd backend/services
mkdir gateway
cd gateway
npm init -y
```

**Install dependencies:**
```bash
npm install @nestjs/common@^10.2.0 @nestjs/core@^10.2.0 \
  @nestjs/platform-express@^10.2.0 @nestjs/config@^3.1.1 \
  @nestjs/swagger@^7.4.2 http-proxy-middleware \
  axios pino pino-http reflect-metadata rxjs source-map-support
```

**Package.json:**
```json
{
  "name": "@zeal/gateway",
  "version": "0.1.0",
  "description": "API Gateway with unified Swagger",
  "main": "dist/main.js",
  "scripts": {
    "dev": "NODE_ENV=development ts-node src/main.ts",
    "start": "node --enable-source-maps dist/main.js",
    "build": "tsc"
  },
  "dependencies": {
    "@nestjs/common": "^10.2.0",
    "@nestjs/core": "^10.2.0",
    "@nestjs/platform-express": "^10.2.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/swagger": "^7.4.2",
    "http-proxy-middleware": "^2.0.6",
    "axios": "^1.6.0",
    "pino": "^10.1.0",
    "pino-http": "^11.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "source-map-support": "^0.5.21"
  }
}
```

### Step 2: Project Structure

```
backend/services/gateway/
├── src/
│   ├── main.ts                    # Bootstrap
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Health check
│   ├── config/
│   │   └── swagger.config.ts      # Swagger aggregation
│   ├── proxy/
│   │   ├── proxy.module.ts
│   │   └── proxy.middleware.ts    # HTTP proxy logic
│   └── common/
│       ├── guards/
│       │   └── auth.guard.ts      # JWT validation
│       ├── middleware/
│       │   ├── tenant.middleware.ts
│       │   └── rate-limit.middleware.ts
│       └── filters/
│           └── global-exception.filter.ts
├── tsconfig.json
└── package.json
```

### Step 3: Core Implementation

#### `src/main.ts`

```typescript
import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    bufferLogs: true,
  });

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-id',
      'x-user-id',
      'x-facility-id',
    ],
  });

  // Setup unified Swagger
  await setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`API Gateway running on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api/docs`);
}

bootstrap();
```

#### `src/config/swagger.config.ts`

```typescript
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import axios from 'axios';

const SERVICES = [
  { name: 'Foundation', url: 'http://localhost:3010', prefix: 'foundation' },
  { name: 'Clinical', url: 'http://localhost:3011', prefix: 'clinical' },
  { name: 'RCM', url: 'http://localhost:3012', prefix: 'rcm' },
];

export async function setupSwagger(app: INestApplication) {
  // Fetch OpenAPI specs from all services
  const specs = await Promise.all(
    SERVICES.map(async (service) => {
      try {
        const response = await axios.get(`${service.url}/api/docs-json`);
        return {
          name: service.name,
          spec: response.data,
          prefix: service.prefix,
        };
      } catch (error) {
        console.warn(`Could not fetch spec from ${service.name}:`, error.message);
        return null;
      }
    })
  );

  // Merge all specs into one
  const mergedSpec = mergeOpenAPISpecs(specs.filter(s => s !== null));

  // Create Swagger document
  SwaggerModule.setup('api/docs', app, mergedSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
}

function mergeOpenAPISpecs(specs: any[]): any {
  const baseConfig = new DocumentBuilder()
    .setTitle('Zeal Healthcare Platform API')
    .setDescription('Unified API documentation for all services')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT token',
    }, 'JWT-auth')
    .addApiKey({
      type: 'apiKey',
      name: 'x-tenant-id',
      in: 'header',
      description: 'Tenant UUID for multi-tenancy isolation'
    }, 'x-tenant-id')
    .addApiKey({
      type: 'apiKey',
      name: 'x-user-id',
      in: 'header',
      description: 'User UUID for audit logging'
    }, 'x-user-id')
    .addApiKey({
      type: 'apiKey',
      name: 'x-facility-id',
      in: 'header',
      description: 'Facility UUID for facility-scoped operations'
    }, 'x-facility-id')
    .build();

  const mergedDocument = {
    ...baseConfig,
    paths: {},
    components: {
      schemas: {},
      securitySchemes: baseConfig.components?.securitySchemes || {},
    },
    tags: [],
  };

  // Merge paths, schemas, and tags from all services
  specs.forEach(({ spec, prefix, name }) => {
    // Prefix all paths with service name
    Object.keys(spec.paths || {}).forEach((path) => {
      const prefixedPath = `/api/v1/${prefix}${path}`;
      mergedDocument.paths[prefixedPath] = spec.paths[path];
    });

    // Merge schemas with service prefix to avoid conflicts
    if (spec.components?.schemas) {
      Object.keys(spec.components.schemas).forEach((schemaName) => {
        const prefixedSchemaName = `${name}_${schemaName}`;
        mergedDocument.components.schemas[prefixedSchemaName] =
          spec.components.schemas[schemaName];
      });
    }

    // Merge tags
    if (spec.tags) {
      const prefixedTags = spec.tags.map(tag => ({
        ...tag,
        name: `${name} - ${tag.name}`,
      }));
      mergedDocument.tags.push(...prefixedTags);
    }
  });

  return mergedDocument;
}
```

#### `src/proxy/proxy.middleware.ts`

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

const SERVICE_ROUTES = {
  '/api/v1/foundation': 'http://localhost:3010',
  '/api/v1/clinical': 'http://localhost:3011',
  '/api/v1/rcm': 'http://localhost:3012',
};

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const matchedRoute = Object.keys(SERVICE_ROUTES).find(route =>
      req.path.startsWith(route)
    );

    if (matchedRoute) {
      const target = SERVICE_ROUTES[matchedRoute];
      const proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^${matchedRoute}`]: '/api/v1', // Rewrite path for backend
        },
        onProxyReq: (proxyReq, req) => {
          // Forward all headers (tenant, user, facility, auth)
          console.log(`[Gateway] Proxying ${req.method} ${req.path} → ${target}`);
        },
        onProxyRes: (proxyRes, req, res) => {
          console.log(`[Gateway] Response from ${target}: ${proxyRes.statusCode}`);
        },
        onError: (err, req, res) => {
          console.error(`[Gateway] Proxy error:`, err);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            statusCode: 502,
            message: 'Bad Gateway - Service unavailable',
            error: 'Bad Gateway',
          }));
        },
      });

      return proxy(req, res, next);
    }

    next();
  }
}
```

#### `src/app.module.ts`

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ProxyMiddleware } from './proxy/proxy.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply proxy middleware to all routes except health check and docs
    consumer
      .apply(ProxyMiddleware)
      .exclude('/health', '/api/docs', '/api/docs-json')
      .forRoutes('*');
  }
}
```

#### `src/app.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
```

### Step 4: Backend Service Changes

Each backend service needs to expose its OpenAPI spec as JSON.

**Update Foundation/Clinical/RCM `main.ts`:**

```typescript
// After creating Swagger document
const swaggerConfig = new DocumentBuilder()
  // ... your existing config
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api/docs', app, document);

// Add JSON endpoint for gateway consumption
app.use('/api/docs-json', (req, res) => {
  res.json(document);
});
```

### Step 5: Frontend Integration

Update frontend API base URL to use the gateway:

**`frontend/src/lib/api/config.ts`:**
```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// All services now route through gateway
export const foundationApi = axios.create({
  baseURL: `${API_BASE_URL}/foundation`
});

export const clinicalApi = axios.create({
  baseURL: `${API_BASE_URL}/clinical`
});

export const rcmApi = axios.create({
  baseURL: `${API_BASE_URL}/rcm`
});
```

## Advanced Features

### 1. Authentication at Gateway Level

```typescript
// src/common/guards/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### 2. Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // 100 requests per minute
    }),
  ],
})
```

### 3. Request Caching

```bash
npm install @nestjs/cache-manager cache-manager
```

```typescript
// app.module.ts
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutes
      max: 100, // Max cached items
    }),
  ],
})
```

## Production Deployment

### Docker Compose

```yaml
# docker-compose.yml
services:
  gateway:
    build: ./backend/services/gateway
    ports:
      - "3000:3000"
    environment:
      - FOUNDATION_URL=http://foundation:3010
      - CLINICAL_URL=http://clinical:3011
      - RCM_URL=http://rcm:3012
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - foundation
      - clinical
      - rcm

  foundation:
    build: ./backend/services/foundation
    expose:
      - "3010"
    # Not exposed to host, only accessible via gateway

  clinical:
    build: ./backend/services/clinical
    expose:
      - "3011"

  rcm:
    build: ./backend/services/rcm
    expose:
      - "3012"
```

### Environment Variables

```bash
# .env
PORT=3000
FOUNDATION_URL=http://localhost:3010
CLINICAL_URL=http://localhost:3011
RCM_URL=http://localhost:3012
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## Migration Strategy

### Phase 1: Build Gateway (No Breaking Changes)
- Create gateway service alongside existing services
- Gateway routes to existing services
- Test in development environment

### Phase 2: Update Frontend (Gradual Rollout)
- Update API base URLs to use gateway
- Keep direct service access as fallback
- Test all endpoints through gateway

### Phase 3: Make Backend Services Private
- Remove direct access to backend services
- Only allow gateway to communicate with services
- Update security groups/firewall rules

### Phase 4: Add Advanced Features
- Implement rate limiting
- Add request caching
- Enhanced monitoring and metrics
- API analytics

## Testing

```bash
# Start all services
cd backend/services/foundation && npm run dev  # Terminal 1
cd backend/services/clinical && npm run dev   # Terminal 2
cd backend/services/rcm && npm run dev        # Terminal 3
cd backend/services/gateway && npm run dev    # Terminal 4

# Access unified Swagger
open http://localhost:3000/api/docs

# Test endpoints through gateway
curl http://localhost:3000/api/v1/foundation/health
curl http://localhost:3000/api/v1/clinical/health
curl http://localhost:3000/api/v1/rcm/health
```

## Monitoring

```typescript
// Add metrics endpoint
@Get('metrics')
getMetrics() {
  return {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      foundation: this.healthCheckService.checkService('foundation'),
      clinical: this.healthCheckService.checkService('clinical'),
      rcm: this.healthCheckService.checkService('rcm'),
    },
  };
}
```

## Security Considerations

1. **Service-to-Service Authentication**: Use internal tokens for gateway-to-service communication
2. **Rate Limiting**: Prevent abuse at gateway level
3. **Input Validation**: Validate at gateway before forwarding
4. **SSL/TLS**: Terminate SSL at gateway
5. **CORS**: Configure only at gateway
6. **Header Injection**: Prevent header manipulation

## Performance Optimization

1. **Connection Pooling**: Reuse HTTP connections to backend services
2. **Response Caching**: Cache GET requests at gateway
3. **Load Balancing**: Add multiple instances of backend services
4. **Compression**: Enable gzip compression at gateway
5. **Circuit Breaker**: Prevent cascading failures

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
