# Observability & SRE

## Overview

This document outlines the comprehensive observability and Site Reliability Engineering (SRE) framework for the Zeal platform, including SLOs/SLAs, monitoring, logging, tracing, runbooks, and disaster recovery procedures.

## Service Level Objectives (SLOs) and Service Level Agreements (SLAs)

### SLO Framework

```yaml
slo_framework:
  availability:
    target: "99.9%"
    measurement: "Uptime percentage over 30-day rolling window"
    error_budget: "0.1% (43.2 minutes/month)"
    monitoring: "Synthetic health checks every 30 seconds"
  
  latency:
    target: "95th percentile < 2 seconds"
    measurement: "API response time distribution"
    error_budget: "5% of requests can exceed 2 seconds"
    monitoring: "Real user monitoring (RUM) and synthetic tests"
  
  throughput:
    target: "1000 requests/second sustained"
    measurement: "Requests per second capacity"
    error_budget: "10% degradation acceptable"
    monitoring: "Load balancer metrics and application metrics"
  
  data_freshness:
    target: "Data available within 5 minutes"
    measurement: "Time from event to dashboard update"
    error_budget: "5% of data can be delayed"
    monitoring: "Event timestamp tracking"
```

### SLA Definitions

```yaml
sla_definitions:
  platform_availability:
    target: "99.9%"
    measurement_period: "Monthly"
    exclusions:
      - "Planned maintenance windows"
      - "Third-party service outages"
      - "Force majeure events"
    penalties:
      - "Service credits for downtime"
      - "Escalation procedures"
  
  api_response_time:
    target: "95% of requests < 2 seconds"
    measurement_period: "Daily"
    exclusions:
      - "Peak traffic periods"
      - "External API dependencies"
    penalties:
      - "Performance improvement plan"
      - "Capacity planning review"
  
  data_backup:
    target: "99.99% backup success rate"
    measurement_period: "Daily"
    exclusions:
      - "Hardware failures"
      - "Network outages"
    penalties:
      - "Immediate remediation"
      - "Backup system review"
```

## Monitoring Stack

### Metrics Collection

#### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "zeal_rules.yml"

scrape_configs:
  - job_name: 'zeal-api'
    static_configs:
      - targets: ['api-gateway:8080', 'pms-service:8080', 'billing-service:8080']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'zeal-database'
    static_configs:
      - targets: ['postgres:5432']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'zeal-redis'
    static_configs:
      - targets: ['redis:6379']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'zeal-kafka'
    static_configs:
      - targets: ['kafka:9092']
    metrics_path: '/metrics'
    scrape_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### Custom Metrics
```typescript
// Custom metrics implementation
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Business metrics
export const appointmentCounter = new Counter({
  name: 'zeal_appointments_total',
  help: 'Total number of appointments',
  labelNames: ['status', 'clinic_id']
});

export const claimProcessingTime = new Histogram({
  name: 'zeal_claim_processing_duration_seconds',
  help: 'Time spent processing claims',
  labelNames: ['payer_id', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
});

export const activeUsersGauge = new Gauge({
  name: 'zeal_active_users',
  help: 'Number of active users',
  labelNames: ['tenant_id']
});

// System metrics
export const databaseConnections = new Gauge({
  name: 'zeal_database_connections',
  help: 'Number of active database connections'
});

export const cacheHitRate = new Gauge({
  name: 'zeal_cache_hit_rate',
  help: 'Cache hit rate percentage',
  labelNames: ['cache_type']
});

// AI metrics
export const aiPredictionLatency = new Histogram({
  name: 'zeal_ai_prediction_duration_seconds',
  help: 'AI prediction latency',
  labelNames: ['model_type', 'prediction_type'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

export const aiPredictionAccuracy = new Gauge({
  name: 'zeal_ai_prediction_accuracy',
  help: 'AI prediction accuracy',
  labelNames: ['model_type', 'prediction_type']
});
```

### Alerting Rules

#### Critical Alerts
```yaml
# zeal_rules.yml
groups:
  - name: zeal.critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: DatabaseDown
        expr: up{job="zeal-database"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL database is not responding"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }} seconds"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk space is low"
          description: "Disk space is {{ $value }}% full"

  - name: zeal.warning
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}%"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}%"

      - alert: SlowQueries
        expr: rate(postgresql_slow_queries_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow database queries detected"
          description: "{{ $value }} slow queries per second"
```

### Dashboard Configuration

#### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "Zeal Platform Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "zeal_active_users",
            "legendFormat": "Active Users"
          }
        ]
      }
    ]
  }
}
```

## Logging Strategy

### Log Aggregation

#### ELK Stack Configuration
```yaml
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "zeal-api" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{DATA:logger} - %{GREEDYDATA:message}" }
    }
    
    if [message] =~ /PHI/ {
      mutate {
        add_tag => [ "phi_detected" ]
      }
    }
  }
  
  if [fields][service] == "zeal-database" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{DATA:logger} - %{GREEDYDATA:message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "zeal-logs-%{+YYYY.MM.dd}"
  }
}
```

#### Structured Logging
```typescript
// Structured logging implementation
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'zeal-api',
    version: process.env.SERVICE_VERSION
  },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Business event logging
export const logBusinessEvent = (event: string, data: any) => {
  logger.info('Business Event', {
    event,
    data,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    tenantId: getCurrentTenantId()
  });
};

// Security event logging
export const logSecurityEvent = (event: string, severity: string, data: any) => {
  logger.warn('Security Event', {
    event,
    severity,
    data,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    tenantId: getCurrentTenantId(),
    ipAddress: getClientIP(),
    userAgent: getUserAgent()
  });
};

// Performance logging
export const logPerformance = (operation: string, duration: number, metadata: any) => {
  logger.info('Performance Event', {
    operation,
    duration,
    metadata,
    timestamp: new Date().toISOString()
  });
};
```

### Log Retention and Archival

```yaml
log_retention:
  hot_storage:
    duration: "7 days"
    purpose: "Real-time analysis and debugging"
    storage: "SSD"
  
  warm_storage:
    duration: "30 days"
    purpose: "Historical analysis and compliance"
    storage: "HDD"
  
  cold_storage:
    duration: "7 years"
    purpose: "Long-term retention and compliance"
    storage: "Object storage"
  
  archival_policy:
    - "Automated archival after 30 days"
    - "Compression before archival"
    - "Encryption in transit and at rest"
    - "Retrieval SLA: 4 hours"
```

## Distributed Tracing

### OpenTelemetry Implementation

#### Tracing Configuration
```typescript
// OpenTelemetry setup
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'zeal-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION,
  }),
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Custom tracing
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('zeal-api');

export const traceOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  attributes?: Record<string, string>
): Promise<T> => {
  const span = tracer.startSpan(operationName, {
    attributes: {
      'operation.name': operationName,
      ...attributes
    }
  });

  try {
    const result = await operation();
    span.setStatus({ code: 1 }); // OK
    return result;
  } catch (error) {
    span.setStatus({ code: 2, message: error.message }); // ERROR
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
};
```

#### Trace Sampling
```yaml
trace_sampling:
  strategy: "probabilistic"
  rate: 0.1  # 10% of requests
  rules:
    - "100% sampling for errors"
    - "100% sampling for slow requests (>2s)"
    - "100% sampling for critical operations"
    - "10% sampling for normal requests"
  
  head_based_sampling:
    - "Consistent sampling across services"
    - "Trace context propagation"
    - "Sampling decision at entry point"
```

## Runbooks

### Incident Response Runbooks

#### High Error Rate
```markdown
# High Error Rate Runbook

## Symptoms
- Error rate > 10% for 2+ minutes
- 5xx HTTP status codes increasing
- User complaints about system errors

## Immediate Actions
1. **Check Alert Details**
   - Review error patterns in Grafana
   - Identify affected services
   - Check error message patterns

2. **Assess Impact**
   - Determine affected user base
   - Check if critical functions are impacted
   - Estimate business impact

3. **Initial Response**
   - Acknowledge the incident
   - Notify on-call team
   - Create incident ticket

## Investigation Steps
1. **Check System Health**
   ```bash
   # Check service status
   kubectl get pods -n zeal
   kubectl describe pod <pod-name>
   
   # Check logs
   kubectl logs <pod-name> --tail=100
   
   # Check metrics
   curl http://prometheus:9090/api/v1/query?query=up
   ```

2. **Database Check**
   ```bash
   # Check database connections
   kubectl exec -it postgres-pod -- psql -c "SELECT * FROM pg_stat_activity;"
   
   # Check slow queries
   kubectl exec -it postgres-pod -- psql -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
   ```

3. **External Dependencies**
   - Check DHA eClaimLink status
   - Check DOH Shafafiya status
   - Verify third-party service health

## Resolution Steps
1. **Service Restart**
   ```bash
   # Restart affected service
   kubectl rollout restart deployment/<service-name>
   
   # Check rollout status
   kubectl rollout status deployment/<service-name>
   ```

2. **Scale Up Resources**
   ```bash
   # Increase replica count
   kubectl scale deployment/<service-name> --replicas=5
   
   # Check resource usage
   kubectl top pods
   ```

3. **Database Optimization**
   ```bash
   # Kill long-running queries
   kubectl exec -it postgres-pod -- psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';"
   ```

## Post-Incident Actions
1. **Root Cause Analysis**
   - Analyze logs and metrics
   - Identify contributing factors
   - Document findings

2. **Prevention Measures**
   - Update monitoring rules
   - Implement circuit breakers
   - Add additional health checks

3. **Communication**
   - Update stakeholders
   - Document lessons learned
   - Update runbook if needed
```

#### Database Performance Issues
```markdown
# Database Performance Issues Runbook

## Symptoms
- Slow query response times
- High CPU usage on database
- Connection pool exhaustion
- Lock contention

## Immediate Actions
1. **Check Database Metrics**
   ```bash
   # Check active connections
   kubectl exec -it postgres-pod -- psql -c "SELECT count(*) FROM pg_stat_activity;"
   
   # Check slow queries
   kubectl exec -it postgres-pod -- psql -c "SELECT query, total_time, calls FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
   ```

2. **Identify Problematic Queries**
   ```bash
   # Check current running queries
   kubectl exec -it postgres-pod -- psql -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';"
   ```

## Investigation Steps
1. **Check Index Usage**
   ```bash
   # Check index usage statistics
   kubectl exec -it postgres-pod -- psql -c "SELECT schemaname, tablename, attname, n_distinct, correlation FROM pg_stats WHERE schemaname = 'public' ORDER BY n_distinct DESC;"
   ```

2. **Check Lock Contention**
   ```bash
   # Check for locks
   kubectl exec -it postgres-pod -- psql -c "SELECT blocked_locks.pid AS blocked_pid, blocked_activity.usename AS blocked_user, blocking_locks.pid AS blocking_pid, blocking_activity.usename AS blocking_user, blocked_activity.query AS blocked_statement FROM pg_catalog.pg_locks blocked_locks JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid AND blocking_locks.pid != blocked_locks.pid JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid WHERE NOT blocked_locks.granted;"
   ```

## Resolution Steps
1. **Kill Problematic Queries**
   ```bash
   # Kill long-running queries
   kubectl exec -it postgres-pod -- psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '10 minutes';"
   ```

2. **Optimize Queries**
   - Add missing indexes
   - Rewrite inefficient queries
   - Update table statistics

3. **Scale Database Resources**
   ```bash
   # Increase database resources
   kubectl patch deployment postgres -p '{"spec":{"template":{"spec":{"containers":[{"name":"postgres","resources":{"requests":{"memory":"4Gi","cpu":"2"},"limits":{"memory":"8Gi","cpu":"4"}}}]}}}}'
   ```

## Prevention Measures
1. **Query Monitoring**
   - Set up slow query alerts
   - Monitor index usage
   - Regular query performance reviews

2. **Resource Planning**
   - Monitor connection pool usage
   - Plan for peak load periods
   - Implement connection pooling
```

### Maintenance Runbooks

#### Database Backup and Restore
```markdown
# Database Backup and Restore Runbook

## Backup Procedures
1. **Full Backup**
   ```bash
   # Create full backup
   kubectl exec -it postgres-pod -- pg_dump -h localhost -U postgres -d zeal_production > backup_$(date +%Y%m%d_%H%M%S).sql
   
   # Compress backup
   gzip backup_$(date +%Y%m%d_%H%M%S).sql
   
   # Upload to S3
   aws s3 cp backup_$(date +%Y%m%d_%H%M%S).sql.gz s3://zeal-backups/database/
   ```

2. **Incremental Backup**
   ```bash
   # Create incremental backup
   kubectl exec -it postgres-pod -- pg_basebackup -h localhost -U postgres -D /backup/incremental_$(date +%Y%m%d_%H%M%S) -Ft -z -P
   ```

## Restore Procedures
1. **Full Restore**
   ```bash
   # Download backup from S3
   aws s3 cp s3://zeal-backups/database/backup_20240101_120000.sql.gz .
   
   # Decompress backup
   gunzip backup_20240101_120000.sql.gz
   
   # Restore database
   kubectl exec -i postgres-pod -- psql -h localhost -U postgres -d zeal_production < backup_20240101_120000.sql
   ```

2. **Point-in-Time Recovery**
   ```bash
   # Stop database
   kubectl scale deployment postgres --replicas=0
   
   # Restore from base backup
   kubectl exec -it postgres-pod -- pg_restore -h localhost -U postgres -d zeal_production /backup/base_backup.tar
   
   # Apply WAL files for point-in-time recovery
   kubectl exec -it postgres-pod -- pg_recovery -D /var/lib/postgresql/data -t '2024-01-01 12:00:00'
   
   # Start database
   kubectl scale deployment postgres --replicas=1
   ```

## Verification
1. **Check Data Integrity**
   ```bash
   # Verify table counts
   kubectl exec -it postgres-pod -- psql -c "SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del FROM pg_stat_user_tables;"
   
   # Check for corruption
   kubectl exec -it postgres-pod -- psql -c "SELECT datname, pg_database_size(datname) FROM pg_database;"
   ```

2. **Test Application Connectivity**
   ```bash
   # Test database connection
   kubectl exec -it api-pod -- curl http://localhost:8080/health
   
   # Verify critical functions
   kubectl exec -it api-pod -- curl http://localhost:8080/api/v1/patients/count
   ```
```

## Disaster Recovery

### DR Strategy

#### RPO and RTO Targets
```yaml
dr_targets:
  recovery_point_objective:
    target: "15 minutes"
    measurement: "Maximum data loss in case of disaster"
    implementation: "Continuous replication to DR site"
  
  recovery_time_objective:
    target: "1 hour"
    measurement: "Maximum downtime for service restoration"
    implementation: "Automated failover procedures"
  
  business_continuity:
    target: "4 hours"
    measurement: "Time to restore full business operations"
    implementation: "Comprehensive DR procedures"
```

#### DR Architecture
```mermaid
graph TB
    subgraph "Primary Region (UAE Central)"
        LB1[Load Balancer]
        APP1[Application Servers]
        DB1[Primary Database]
        CACHE1[Redis Cache]
        STORAGE1[Object Storage]
    end
    
    subgraph "DR Region (UAE North)"
        LB2[Load Balancer]
        APP2[Application Servers]
        DB2[Standby Database]
        CACHE2[Redis Cache]
        STORAGE2[Object Storage]
    end
    
    subgraph "Monitoring"
        MON[Monitoring System]
        ALERT[Alert Manager]
    end
    
    LB1 --> APP1
    APP1 --> DB1
    APP1 --> CACHE1
    APP1 --> STORAGE1
    
    LB2 --> APP2
    APP2 --> DB2
    APP2 --> CACHE2
    APP2 --> STORAGE2
    
    DB1 -.->|Replication| DB2
    STORAGE1 -.->|Sync| STORAGE2
    
    MON --> ALERT
    ALERT --> LB1
    ALERT --> LB2
```

### DR Procedures

#### Failover Procedures
```markdown
# Disaster Recovery Failover Runbook

## Pre-Failover Checklist
1. **Verify Disaster**
   - Confirm primary region is unavailable
   - Check network connectivity
   - Verify service health status

2. **Assess Impact**
   - Determine affected services
   - Estimate recovery time
   - Notify stakeholders

## Failover Steps
1. **Database Failover**
   ```bash
   # Promote standby database
   kubectl exec -it postgres-standby -- pg_ctl promote -D /var/lib/postgresql/data
   
   # Update connection strings
   kubectl set env deployment/zeal-api DATABASE_URL=postgresql://user:pass@postgres-standby:5432/zeal_production
   ```

2. **Application Failover**
   ```bash
   # Scale up DR region applications
   kubectl scale deployment zeal-api --replicas=5 -n zeal-dr
   
   # Update DNS records
   aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://dns-change.json
   ```

3. **Load Balancer Failover**
   ```bash
   # Update load balancer configuration
   kubectl apply -f dr-loadbalancer-config.yaml
   
   # Verify health checks
   kubectl get ingress -n zeal-dr
   ```

## Post-Failover Verification
1. **Service Health Checks**
   ```bash
   # Check application health
   curl https://api-dr.zeal.health/health
   
   # Check database connectivity
   kubectl exec -it api-pod -- psql -c "SELECT 1;"
   
   # Verify critical functions
   curl https://api-dr.zeal.health/api/v1/patients/count
   ```

2. **Data Integrity Checks**
   ```bash
   # Verify data replication
   kubectl exec -it postgres-standby -- psql -c "SELECT count(*) FROM patients;"
   
   # Check for data consistency
   kubectl exec -it postgres-standby -- psql -c "SELECT count(*) FROM appointments WHERE created_at > NOW() - INTERVAL '1 hour';"
   ```

## Failback Procedures
1. **Prepare Primary Region**
   ```bash
   # Restore primary region services
   kubectl scale deployment postgres --replicas=1 -n zeal-primary
   
   # Sync data from DR region
   kubectl exec -it postgres-primary -- pg_basebackup -h postgres-standby -U postgres -D /var/lib/postgresql/data -Ft -z -P
   ```

2. **Switch Traffic Back**
   ```bash
   # Update DNS records
   aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://failback-dns-change.json
   
   # Verify traffic routing
   curl https://api.zeal.health/health
   ```

3. **Cleanup DR Region**
   ```bash
   # Scale down DR region
   kubectl scale deployment zeal-api --replicas=0 -n zeal-dr
   
   # Update monitoring
   kubectl apply -f primary-monitoring-config.yaml
   ```
```

### Backup and Recovery Testing

#### DR Testing Schedule
```yaml
dr_testing:
  monthly_tests:
    - "Database failover test"
    - "Application failover test"
    - "Load balancer failover test"
    - "Data integrity verification"
  
  quarterly_tests:
    - "Full DR simulation"
    - "End-to-end failover test"
    - "Recovery time measurement"
    - "Business continuity test"
  
  annual_tests:
    - "Complete disaster simulation"
    - "Extended outage test"
    - "Recovery procedure validation"
    - "Stakeholder communication test"
```

#### Test Procedures
```markdown
# DR Testing Procedures

## Monthly Database Failover Test
1. **Preparation**
   - Schedule maintenance window
   - Notify stakeholders
   - Prepare test scripts

2. **Test Execution**
   ```bash
   # Simulate primary database failure
   kubectl scale deployment postgres --replicas=0 -n zeal-primary
   
   # Verify standby promotion
   kubectl exec -it postgres-standby -- pg_ctl promote -D /var/lib/postgresql/data
   
   # Test application connectivity
   curl https://api-dr.zeal.health/health
   ```

3. **Verification**
   - Check data consistency
   - Verify application functionality
   - Measure recovery time

4. **Restoration**
   - Restore primary database
   - Sync data from standby
   - Verify normal operations
```

## Chaos Engineering

### Chaos Testing Framework

#### Chaos Experiments
```yaml
chaos_experiments:
  network_chaos:
    - "Network latency injection"
    - "Packet loss simulation"
    - "Network partition testing"
    - "DNS resolution failures"
  
  infrastructure_chaos:
    - "Pod termination"
    - "Node failure simulation"
    - "Resource exhaustion"
    - "Storage failures"
  
  application_chaos:
    - "Service unavailability"
    - "Database connection failures"
    - "Cache failures"
    - "External API failures"
```

#### Chaos Engineering Implementation
```typescript
// Chaos engineering framework
import { ChaosMonkey } from 'chaos-monkey';

class ZealChaosMonkey {
  private chaosMonkey: ChaosMonkey;

  constructor() {
    this.chaosMonkey = new ChaosMonkey({
      enabled: process.env.CHAOS_ENABLED === 'true',
      probability: 0.1, // 10% chance of chaos
      experiments: [
        'pod-termination',
        'network-latency',
        'database-failure',
        'cache-failure'
      ]
    });
  }

  async runExperiment(experiment: string) {
    switch (experiment) {
      case 'pod-termination':
        await this.terminateRandomPod();
        break;
      case 'network-latency':
        await this.injectNetworkLatency();
        break;
      case 'database-failure':
        await this.simulateDatabaseFailure();
        break;
      case 'cache-failure':
        await this.simulateCacheFailure();
        break;
    }
  }

  private async terminateRandomPod() {
    const pods = await this.getRandomPods(1);
    await this.terminatePod(pods[0]);
  }

  private async injectNetworkLatency() {
    // Inject 100ms latency to random service
    const service = this.getRandomService();
    await this.injectLatency(service, 100);
  }
}
```

## Performance Optimization

### Performance Monitoring

#### Key Performance Indicators
```yaml
performance_kpis:
  response_time:
    target: "95th percentile < 2 seconds"
    measurement: "API response time distribution"
    alerting: "Alert if > 2 seconds for 5 minutes"
  
  throughput:
    target: "1000 requests/second"
    measurement: "Requests per second"
    alerting: "Alert if < 800 requests/second"
  
  error_rate:
    target: "< 0.1%"
    measurement: "5xx error rate"
    alerting: "Alert if > 0.1% for 2 minutes"
  
  availability:
    target: "99.9%"
    measurement: "Uptime percentage"
    alerting: "Alert if < 99.9%"
```

#### Performance Optimization Strategies
```yaml
optimization_strategies:
  caching:
    - "Redis for session storage"
    - "Application-level caching"
    - "CDN for static assets"
    - "Database query caching"
  
  database_optimization:
    - "Index optimization"
    - "Query optimization"
    - "Connection pooling"
    - "Read replicas"
  
  application_optimization:
    - "Code profiling"
    - "Memory optimization"
    - "Async processing"
    - "Load balancing"
  
  infrastructure_optimization:
    - "Auto-scaling"
    - "Resource optimization"
    - "Network optimization"
    - "Storage optimization"
```

## Capacity Planning

### Capacity Planning Framework

#### Resource Planning
```yaml
capacity_planning:
  current_capacity:
    cpu: "80% utilization"
    memory: "75% utilization"
    storage: "60% utilization"
    network: "50% utilization"
  
  growth_projections:
    users: "20% monthly growth"
    data: "30% monthly growth"
    transactions: "25% monthly growth"
  
  scaling_thresholds:
    cpu: "85% utilization"
    memory: "80% utilization"
    storage: "75% utilization"
    network: "70% utilization"
  
  scaling_actions:
    horizontal: "Add more instances"
    vertical: "Increase instance size"
    storage: "Add storage capacity"
    network: "Upgrade network bandwidth"
```

#### Capacity Monitoring
```typescript
// Capacity monitoring implementation
class CapacityMonitor {
  private metrics: Map<string, number> = new Map();

  async checkCapacity() {
    const metrics = await this.collectMetrics();
    
    for (const [resource, utilization] of metrics) {
      if (utilization > this.getThreshold(resource)) {
        await this.triggerScaling(resource);
      }
    }
  }

  private async collectMetrics() {
    return {
      'cpu': await this.getCPUUtilization(),
      'memory': await this.getMemoryUtilization(),
      'storage': await this.getStorageUtilization(),
      'network': await this.getNetworkUtilization()
    };
  }

  private async triggerScaling(resource: string) {
    // Implement auto-scaling logic
    console.log(`Triggering scaling for ${resource}`);
  }
}
```
