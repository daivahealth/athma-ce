# Observability Infrastructure

This directory contains the Docker Compose configuration and related files for the Zeal Healthcare Platform observability stack.

## Quick Start

```bash
# Start the observability stack
docker-compose -f docker-compose.observability.yml up -d

# Check status
docker-compose -f docker-compose.observability.yml ps

# View logs
docker-compose -f docker-compose.observability.yml logs -f

# Stop the stack
docker-compose -f docker-compose.observability.yml down

# Stop and remove volumes
docker-compose -f docker-compose.observability.yml down -v
```

## Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Grafana | 3003 | http://localhost:3003 | Visualization (admin/admin) |
| Prometheus | 9090 | http://localhost:9090 | Metrics storage |
| Loki | 3100 | http://localhost:3100 | Log aggregation |
| Tempo | 3200 | http://localhost:3200 | Distributed tracing |
| OTel Collector | 4317/4318 | - | Telemetry pipeline |

## Directory Structure

```
observability/
├── docker-compose.observability.yml  # Main compose file
├── otel-collector-config.yaml        # Collector pipeline config
├── prometheus.yml                    # Prometheus scrape config
├── loki-config.yaml                  # Loki storage config
├── tempo-config.yaml                 # Tempo trace config
├── promtail-config.yaml              # Log shipping agent config
└── grafana/
    └── provisioning/
        ├── datasources/
        │   └── datasources.yaml      # Auto-configured data sources
        └── dashboards/
            ├── dashboards.yaml       # Dashboard provisioning
            └── json/
                └── *.json            # Dashboard definitions
```

## Configuration Files

### OpenTelemetry Collector (`otel-collector-config.yaml`)
- Receives OTLP data on ports 4317 (gRPC) and 4318 (HTTP)
- Routes traces to Tempo
- Routes metrics to Prometheus
- Routes logs to Loki

### Prometheus (`prometheus.yml`)
- Scrapes metrics from services
- Receives remote write from OTel Collector
- 15-day retention

### Loki (`loki-config.yaml`)
- Single-node configuration
- 30-day log retention
- Filesystem storage

### Tempo (`tempo-config.yaml`)
- Single-node configuration
- 48-hour trace retention
- Generates service graphs and span metrics

## Backend Service Configuration

Add these environment variables to your backend services:

```bash
OBSERVABILITY_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=your-service-name
```

## Health Checks

Verify all services are healthy:

```bash
# OTel Collector
curl http://localhost:13133/

# Prometheus
curl http://localhost:9090/-/healthy

# Loki
curl http://localhost:3100/ready

# Tempo
curl http://localhost:3200/ready

# Grafana
curl http://localhost:3003/api/health
```

## Troubleshooting

### Services not starting

```bash
# Check logs for specific service
docker logs zeal-otel-collector
docker logs zeal-prometheus
docker logs zeal-loki
docker logs zeal-tempo
docker logs zeal-grafana
```

### No data in Grafana

1. Verify OTel Collector is receiving data:
   ```bash
   curl http://localhost:8888/metrics | grep otelcol_receiver
   ```

2. Check that services have `OBSERVABILITY_ENABLED=true`

3. Verify collector endpoint is reachable from services

### Port conflicts

If ports are already in use, modify `docker-compose.observability.yml`:
- Grafana: Change `3003:3000` to another port
- Prometheus: Change `9090:9090`
- etc.

## Documentation

See [/docs/observability/OBSERVABILITY.md](/docs/observability/OBSERVABILITY.md) for full documentation.
