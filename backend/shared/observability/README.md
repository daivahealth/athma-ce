# @zeal/observability

Observability package for Zeal Healthcare Platform providing OpenTelemetry instrumentation, structured logging, and metrics collection.

## Features

- **OpenTelemetry Instrumentation**: Auto-instrumentation for HTTP, database, and more
- **Structured Logging**: Pino-based logging with trace context
- **Custom Metrics**: Pre-built metrics for HTTP, database, and business operations
- **NestJS Integration**: Module and middleware for easy integration
- **Configuration-Driven**: Enable/disable features via environment variables

## Installation

The package is included in the monorepo. Add it as a dependency:

```json
{
  "dependencies": {
    "@zeal/observability": "file:../../shared/observability"
  }
}
```

Then run:

```bash
npm install
```

## Quick Start

### 1. Initialize Observability (IMPORTANT: Do this first!)

```typescript
// main.ts - MUST be at the very top
import { initializeObservability } from '@zeal/observability';
initializeObservability();

// Then import everything else
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
```

### 2. Configure Environment Variables

```bash
# Enable observability
OBSERVABILITY_ENABLED=true

# Configure exporter
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=clinical-service
OTEL_SERVICE_VERSION=1.0.0

# Optional: Fine-tune individual pillars
METRICS_ENABLED=true
LOGGING_ENABLED=true
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=0.1
LOG_LEVEL=info
```

### 3. Add NestJS Module

```typescript
// app.module.ts
import { ObservabilityModule } from '@zeal/observability';

@Module({
  imports: [
    ObservabilityModule.forRoot({
      excludePaths: ['/custom-health'],
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### 4. Use Structured Logger

```typescript
// Use as NestJS logger
import { NestFactory } from '@nestjs/core';
import { PinoLoggerService } from '@zeal/observability';

const app = await NestFactory.create(AppModule, {
  logger: new PinoLoggerService(),
});
```

## API Reference

### Configuration

```typescript
import { getObservabilityConfig } from '@zeal/observability';

const config = getObservabilityConfig();
// { enabled: true, metrics: {...}, logging: {...}, tracing: {...}, exporter: {...} }
```

### Tracing

```typescript
import { withSpan, Trace, getTraceContext } from '@zeal/observability';

// Option 1: Function wrapper
const result = await withSpan({ name: 'processOrder' }, async (span) => {
  span.setAttribute('orderId', orderId);
  return await processOrder(orderId);
});

// Option 2: Decorator
class OrderService {
  @Trace('OrderService.process')
  async processOrder(orderId: string) {
    // Automatically traced
  }
}

// Get trace context
const { traceId, spanId } = getTraceContext();
```

### Metrics

```typescript
import {
  httpMetrics,
  businessMetrics,
  createCounter,
  MetricsTimer,
} from '@zeal/observability';

// Use pre-built metrics
businessMetrics.appointmentsCreated.add(1, { facility: 'main' });

// Create custom metrics
const customCounter = createCounter('custom_events_total', {
  description: 'Custom events',
});
customCounter.add(1, { type: 'signup' });

// Measure duration
const timer = new MetricsTimer();
await someOperation();
timer.recordTo(httpMetrics.requestDuration, { path: '/api/orders' });
```

### Logging

```typescript
import { logger, createLogger } from '@zeal/observability';

// Direct logging
logger.info('Application started');
logger.error({ err: error }, 'Failed to process');

// Create contextual logger
const serviceLogger = createLogger({ service: 'OrderService' });
serviceLogger.info('Processing order');
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OBSERVABILITY_ENABLED` | `false` | Master toggle |
| `METRICS_ENABLED` | `true` (if master on) | Enable metrics |
| `LOGGING_ENABLED` | `true` | Enable structured logging |
| `TRACING_ENABLED` | `true` (if master on) | Enable tracing |
| `LOG_LEVEL` | `debug`/`info` | Log level |
| `LOG_PRETTY` | auto | Pretty print logs |
| `TRACE_SAMPLE_RATE` | `1.0`/`0.1` | Trace sampling rate |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` | Collector endpoint |
| `OTEL_SERVICE_NAME` | `unknown-service` | Service name |
| `OTEL_SERVICE_VERSION` | `0.0.0` | Service version |
| `OTEL_SERVICE_NAMESPACE` | `zeal` | Service namespace |

## Development

```bash
# Build the package
npm run build

# Clean build artifacts
npm run clean
```

## Related Documentation

- [Observability Architecture](/docs/observability/OBSERVABILITY.md)
- [Quick Reference](/docs/observability/OBSERVABILITY-QUICK-REFERENCE.md)
