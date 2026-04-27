# Observability Quick Reference

Developer cheat sheet for athma-ce Healthcare Platform observability.

---

## Enable/Disable Observability

```bash
# Master toggle (add to service .env)
OBSERVABILITY_ENABLED=true   # Enable all observability
OBSERVABILITY_ENABLED=false  # Disable all observability
```

## Individual Toggles

```bash
# Metrics
METRICS_ENABLED=true

# Logging
LOGGING_ENABLED=true
LOG_LEVEL=debug|info|warn|error

# Tracing
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=0.1  # 10% of requests (0.0 to 1.0)
```

## Collector Endpoint

```bash
# Local development (if running observability stack)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318

# Docker network
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
```

## Service Configuration

```bash
# Service identity
OTEL_SERVICE_NAME=clinical-service
OTEL_SERVICE_VERSION=1.0.0
```

---

## Environment Presets

### Local Development (Recommended)

```bash
OBSERVABILITY_ENABLED=false
LOGGING_ENABLED=true
LOG_LEVEL=debug
```

### Development Server

```bash
OBSERVABILITY_ENABLED=true
METRICS_ENABLED=true
LOGGING_ENABLED=true
LOG_LEVEL=debug
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=1.0
```

### Production

```bash
OBSERVABILITY_ENABLED=true
METRICS_ENABLED=true
LOGGING_ENABLED=true
LOG_LEVEL=warn
TRACING_ENABLED=true
TRACE_SAMPLE_RATE=0.1
```

---

## Quick Start Commands

### Start Observability Stack

```bash
docker-compose -f docker-compose.observability.yml up -d
```

### Stop Observability Stack

```bash
docker-compose -f docker-compose.observability.yml down
```

### View Logs

```bash
# Grafana logs
docker logs zeal-grafana

# Collector logs
docker logs zeal-otel-collector
```

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Grafana | 3003 | http://localhost:3003 |
| Prometheus | 9090 | http://localhost:9090 |
| Loki | 3100 | http://localhost:3100 |
| Tempo | 3200 | http://localhost:3200 |
| Collector (HTTP) | 4318 | http://localhost:4318 |
| Collector (gRPC) | 4317 | http://localhost:4317 |

---

## Grafana Credentials

```
Username: admin
Password: admin
```

---

## Common Queries

### Find Slow Requests (Grafana Explore)

1. Select data source: **Tempo**
2. Query type: **Search**
3. Filter: `service.name = clinical-service`
4. Sort by: **Duration (desc)**

### Find Errors (Grafana Explore)

1. Select data source: **Loki**
2. Query: `{service="clinical-service"} |= "error"`

### Check Metrics (Prometheus)

```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status_code=~"5.."}[5m])

# Latency P95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

---

## Troubleshooting

### No Traces Appearing

1. Check `OBSERVABILITY_ENABLED=true`
2. Check `TRACING_ENABLED=true`
3. Verify collector is running: `docker ps | grep otel-collector`
4. Check collector logs: `docker logs zeal-otel-collector`

### No Metrics

1. Check `METRICS_ENABLED=true`
2. Verify Prometheus is scraping: http://localhost:9090/targets

### Connection Refused

1. Check `OTEL_EXPORTER_OTLP_ENDPOINT` is correct
2. For Docker: use `http://otel-collector:4318`
3. For local: use `http://localhost:4318`

---

See [OBSERVABILITY.md](./OBSERVABILITY.md) for full documentation.
