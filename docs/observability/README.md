# Observability Documentation

This folder contains documentation for the Zeal Healthcare Platform observability stack.

## Documents

| Document | Description |
|----------|-------------|
| [OBSERVABILITY.md](./OBSERVABILITY.md) | Comprehensive observability architecture guide |
| [OBSERVABILITY-QUICK-REFERENCE.md](./OBSERVABILITY-QUICK-REFERENCE.md) | Developer cheat sheet |

## Technology Stack

- **OpenTelemetry** - Vendor-neutral instrumentation
- **Prometheus** - Metrics storage and alerting
- **Loki** - Log aggregation
- **Tempo** - Distributed tracing
- **Grafana** - Unified visualization

## Quick Start

```bash
# Enable observability in any service
OBSERVABILITY_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=service-name
```

## Service Ports

| Service | Port |
|---------|------|
| Grafana | 3003 |
| Prometheus | 9090 |
| Loki | 3100 |
| Tempo | 3200 |
| OTel Collector | 4317/4318 |

## Related Documentation

- [Infrastructure Setup](../infrastructure/README.md)
- [ADR-0013: Service Decomposition](../adr/ADR-0013-service-decomposition.md)
- [Troubleshooting](../troubleshooting/README.md)
