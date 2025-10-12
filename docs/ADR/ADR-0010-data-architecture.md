# ADR-0010: Data Architecture & Analytics — Multi-Tier Healthcare Data Platform

- **Status**: Accepted
- **Date**: 2025-10-01
- **Owners**: Architecture Team, Data Team, Analytics Team
- **Related**: ADR-0003 (Multi-Tenancy), ADR-0006 (AI/ML), ADR-0008 (Deployment)
- **Context**: Healthcare systems require comprehensive data architecture for operational, clinical, and analytical workloads

## 1) Decision

Implement a **multi-tier data architecture** with:

- **Operational Databases**: PostgreSQL clusters per domain service (Patients, Scheduling, Encounters/EHR, Billing) plus the shared Foundation master data store (see ADR-0013)
- **Analytics Database**: ClickHouse for analytical workloads
- **Search Engine**: OpenSearch for full-text search and analytics
- **Cache Layer**: Redis for performance optimization
- **Data Lake**: S3-compatible storage for raw data and ML pipelines
- **ETL/ELT Pipelines**: Apache Airflow for data processing workflows

## 2) Drivers

- **Performance Requirements**: Separate operational and analytical workloads
- **Scalability**: Support for 500+ clinics with varying data volumes
- **Compliance**: Data residency and retention requirements
- **Analytics**: Advanced analytics and reporting capabilities
- **AI/ML**: Data pipelines for machine learning and AI workloads

## 3) Scope

Applies to all data components including:
- **Transactional Data**: Patient records, appointments, encounters, billing sourced from per-domain operational databases and the foundation store
- **Analytical Data**: Aggregated metrics, reports, business intelligence
- **Search Data**: Full-text search, document indexing, content discovery
- **ML Data**: Training datasets, feature stores, model artifacts
- **Audit Data**: Compliance logs, audit trails, security events

## 4) Non-Goals

- Not implementing real-time streaming analytics initially
- Not covering data warehouse migration from legacy systems
- Not supporting edge computing data processing

## 5) Data Architecture Overview

### Multi-Tier Architecture

| Tier | Technology | Purpose | Data Types | Healthcare Focus |
|------|------------|---------|------------|-----------------|
| **Operational** | PostgreSQL | Transactional workloads | Patient data, clinical records | Real-time patient care |
| **Analytical** | ClickHouse | OLAP workloads | Aggregated metrics, reports | Business intelligence |
| **Search** | OpenSearch | Full-text search | Documents, logs, content | Clinical documentation |
| **Cache** | Redis | Performance optimization | Session data, frequently accessed | Real-time performance |
| **Data Lake** | S3 | Raw data storage | Unstructured data, ML datasets | AI/ML pipelines |

### Data Flow Architecture
```yaml
# Data Flow Configuration
data_flow:
  ingestion:
    - real_time: [postgresql_foundation, postgresql_patients, postgresql_scheduling, postgresql_encounters, postgresql_billing, redis]
    - batch: [airflow, etl_pipelines]
    - streaming: [kafka, kinesis]
    
  processing:
    - etl: [airflow, dbt]
    - elt: [postgresql, clickhouse]
    - ml: [python, spark]
    
  storage:
    - operational: [postgresql]
    - analytical: [clickhouse]
    - search: [opensearch]
    - cache: [redis]
    - lake: [s3]
```

## 6) Operational Database (PostgreSQL)

### Design Principles
- **ACID Compliance**: Strong consistency for healthcare data within each bounded context
- **Multi-Tenancy**: Row-level security for tenant isolation (applied in every domain database per ADR-0003/ADR-0013)
- **Performance**: Operational databases tuned to their domain workloads (e.g., scheduling vs. billing)
- **Compliance**: Audit trails and retention policies enforced consistently across all services

### Schema Design
```sql
-- Partitioning Strategy
CREATE TABLE encounters (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    encounter_date DATE NOT NULL,
    -- ... other columns
) PARTITION BY RANGE (encounter_date);

-- Create monthly partitions
CREATE TABLE encounters_2024_01 PARTITION OF encounters
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Performance Optimizations
- **Indexing**: Composite indexes for common query patterns
- **Partitioning**: Time-based partitioning for large tables
- **Connection Pooling**: PgBouncer for connection management
- **Read Replicas**: Cross-region read replicas for performance

## 7) Analytics Database (ClickHouse)

### Design Principles
- **OLAP Optimization**: Columnar storage for analytical queries
- **High Performance**: Sub-second query performance for large datasets
- **Scalability**: Horizontal scaling for growing data volumes
- **Cost Efficiency**: Compression and efficient storage

### Schema Design
```sql
-- ClickHouse Table Design
CREATE TABLE clinical_metrics (
    tenant_id UUID,
    metric_date Date,
    metric_type String,
    metric_value Float64,
    patient_count UInt32,
    created_at DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(metric_date)
ORDER BY (tenant_id, metric_date, metric_type);
```

### Analytics Use Cases
- **Clinical Analytics**: Patient outcomes, treatment effectiveness
- **Operational Analytics**: Resource utilization, efficiency metrics
- **Financial Analytics**: Revenue cycle management, cost analysis
- **Compliance Analytics**: Audit reports, regulatory compliance

## 8) Search Engine (OpenSearch)

### Design Principles
- **Full-Text Search**: Advanced search capabilities for clinical data
- **Real-Time**: Near real-time indexing and search
- **Scalability**: Distributed search across multiple nodes
- **Healthcare-Specific**: Medical terminology and Arabic language support

### Index Design
```json
{
  "mappings": {
    "properties": {
      "patient_name": {
        "type": "text",
        "analyzer": "arabic_analyzer"
      },
      "clinical_notes": {
        "type": "text",
        "analyzer": "medical_analyzer"
      },
      "encounter_date": {
        "type": "date"
      },
      "tenant_id": {
        "type": "keyword"
      }
    }
  }
}
```

### Search Use Cases
- **Patient Search**: Find patients by name, ID, or medical record number
- **Clinical Documentation**: Search clinical notes, reports, and documents
- **Medication Search**: Find medications by name, dosage, or indication
- **Provider Search**: Search providers by specialty, location, or availability

## 9) Cache Layer (Redis)

### Design Principles
- **Performance**: Sub-millisecond response times
- **Scalability**: Distributed caching across multiple nodes
- **Persistence**: Optional persistence for critical data
- **High Availability**: Redis Cluster for fault tolerance

### Cache Strategies
```yaml
# Cache Configuration
cache_strategies:
  session_cache:
    ttl: 3600  # 1 hour
    pattern: "session:*"
    
  user_permissions:
    ttl: 300   # 5 minutes
    pattern: "permissions:*"
    
  clinical_data:
    ttl: 1800  # 30 minutes
    pattern: "patient:*"
    
  reference_data:
    ttl: 86400 # 24 hours
    pattern: "ref:*"
```

### Cache Use Cases
- **Session Management**: User sessions and authentication tokens
- **Permission Caching**: User permissions and role assignments
- **Clinical Data**: Frequently accessed patient data
- **Reference Data**: Master data and lookup tables

## 10) Data Lake (S3)

### Design Principles
- **Scalability**: Unlimited storage capacity
- **Cost Efficiency**: Lifecycle policies for cost optimization
- **Durability**: 99.999999999% durability for critical data
- **Compliance**: Data residency and retention policies

### Data Organization
```
s3://zeal-data-lake/
├── raw/
│   ├── clinical/
│   ├── billing/
│   ├── audit/
│   └── ml/
├── processed/
│   ├── etl/
│   ├── analytics/
│   └── ml/
└── archived/
    ├── compliance/
    └── retention/
```

### Data Lake Use Cases
- **Raw Data Storage**: Unprocessed data from various sources
- **ML Datasets**: Training data for machine learning models
- **Data Archival**: Long-term storage for compliance
- **Data Sharing**: Secure data sharing between systems

## 11) ETL/ELT Pipelines

### Apache Airflow Configuration
```python
# ETL Pipeline Example
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'clinical_metrics_etl',
    default_args=default_args,
    description='ETL pipeline for clinical metrics',
    schedule_interval='@daily',
    catchup=False
)

def extract_clinical_data():
    # Extract data from PostgreSQL
    pass

def transform_clinical_data():
    # Transform data for analytics
    pass

def load_analytics_data():
    # Load data into ClickHouse
    pass

extract_task = PythonOperator(
    task_id='extract_clinical_data',
    python_callable=extract_clinical_data,
    dag=dag
)

transform_task = PythonOperator(
    task_id='transform_clinical_data',
    python_callable=transform_clinical_data,
    dag=dag
)

load_task = PythonOperator(
    task_id='load_analytics_data',
    python_callable=load_analytics_data,
    dag=dag
)

extract_task >> transform_task >> load_task
```

### Pipeline Types
- **Real-Time**: Stream processing for immediate data updates
- **Batch**: Daily/hourly processing for analytical workloads
- **ML Pipelines**: Feature engineering and model training
- **Compliance Pipelines**: Audit data processing and reporting

## 12) Data Governance

### Data Classification
- **Public**: Non-sensitive information (system status, public APIs)
- **Internal**: Business information (reports, analytics)
- **Confidential**: Business-sensitive data (financial, operational)
- **Restricted**: PHI and highly sensitive data (medical records, personal data)

### Data Quality Management
- **Validation**: Data quality checks and validation rules
- **Monitoring**: Continuous data quality monitoring
- **Remediation**: Automated data quality issue resolution
- **Reporting**: Data quality metrics and reporting

### Data Lineage
- **Tracking**: End-to-end data lineage tracking
- **Documentation**: Data source and transformation documentation
- **Impact Analysis**: Change impact analysis for data modifications
- **Compliance**: Data lineage for regulatory compliance

## 13) Security and Compliance

### Data Encryption
- **At Rest**: AES-256 encryption for all data storage
- **In Transit**: TLS 1.3 for all data transmission
- **Application Level**: Field-level encryption for sensitive data
- **Key Management**: Centralized key management and rotation

### Access Control
- **RBAC**: Role-based access control for data access
- **Data Masking**: Automatic masking of sensitive data
- **Audit Logging**: Comprehensive audit trails for data access
- **Compliance**: Data access controls for regulatory compliance

### Data Residency
- **UAE Regions**: All PHI data stored in UAE regions
- **Cross-Border**: No PHI data transfer outside UAE
- **Backup**: Encrypted backups in UAE regions
- **Monitoring**: Continuous monitoring of data residency compliance

## 14) Performance Optimization

### Query Optimization
- **Indexing**: Optimized indexes for common query patterns
- **Partitioning**: Time-based partitioning for large tables
- **Caching**: Intelligent caching for frequently accessed data
- **Compression**: Data compression for storage efficiency

### Scalability
- **Horizontal Scaling**: Distributed processing across multiple nodes
- **Auto-Scaling**: Automatic scaling based on workload demand
- **Load Balancing**: Intelligent load balancing for data access
- **Resource Management**: Efficient resource utilization and management

## 15) Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Single Database** | Simple, integrated | Performance limitations, scalability issues | ❌ |
| **Data Warehouse Only** | Optimized for analytics | Poor transactional performance | ❌ |
| **NoSQL Only** | Scalable, flexible | ACID compliance issues, healthcare complexity | ❌ |
| **Multi-Tier Architecture** | Optimized for each workload, scalable | Complex architecture, requires expertise | ✅ **Chosen** |

## 16) Implementation Phases

### Phase 1: Foundation (Week 1-4)
- [ ] Deploy PostgreSQL with RLS and partitioning
- [ ] Set up Redis cluster for caching
- [ ] Implement basic data governance
- [ ] Configure data encryption and security

### Phase 2: Analytics (Week 5-8)
- [ ] Deploy ClickHouse for analytical workloads
- [ ] Set up OpenSearch for full-text search
- [ ] Implement basic ETL pipelines
- [ ] Configure data quality monitoring

### Phase 3: Data Lake (Week 9-12)
- [ ] Set up S3-compatible data lake
- [ ] Implement ML data pipelines
- [ ] Configure data lifecycle management
- [ ] Set up data archival and retention

### Phase 4: Advanced Features (Week 13-16)
- [ ] Implement advanced analytics capabilities
- [ ] Set up real-time data processing
- [ ] Configure advanced data governance
- [ ] Implement data lineage tracking

### Phase 5: Optimization (Week 17-20)
- [ ] Optimize performance and scalability
- [ ] Implement advanced security controls
- [ ] Configure compliance monitoring
- [ ] Complete data architecture validation

## 17) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Data Consistency** | High | ACID compliance, data validation, monitoring |
| **Performance Issues** | Medium | Optimization, caching, scaling strategies |
| **Compliance Violations** | High | Automated compliance monitoring, audit trails |
| **Cost Overrun** | Medium | Cost monitoring, optimization, lifecycle management |

## 18) Monitoring & Observability

### Data Metrics
- **Performance**: Query performance, data processing times
- **Quality**: Data quality metrics, validation results
- **Usage**: Data access patterns, user behavior
- **Cost**: Storage costs, processing costs, optimization opportunities

### Alerts
- **Performance**: Slow queries, processing delays
- **Quality**: Data quality issues, validation failures
- **Compliance**: Data residency violations, access violations
- **Cost**: Cost threshold alerts, optimization opportunities

## 19) Cost Considerations

- **Infrastructure**: Database, storage, compute costs
- **Licensing**: Commercial database and tool licenses
- **Personnel**: Data engineers, database administrators
- **Storage**: Data storage and archival costs

## 20) Triggers to Revisit

- **New Technologies**: New database or analytics technologies
- **Performance Issues**: Data performance problems or bottlenecks
- **Compliance Changes**: New regulatory requirements
- **Cost Optimization**: Significant cost increases or budget constraints

## 21) Acceptance Criteria

- [ ] Multi-tier data architecture deployed and operational
- [ ] PostgreSQL operational database configured and optimized
- [ ] ClickHouse analytics database deployed and tested
- [ ] OpenSearch search engine configured and operational
- [ ] Redis cache layer deployed and optimized
- [ ] S3 data lake configured with lifecycle policies
- [ ] ETL/ELT pipelines implemented and tested
- [ ] Data governance and security controls implemented
- [ ] Performance and compliance requirements satisfied

## 22) Related Documentation

- [Data Model](../05-Data-Model.md) - Database schema design
- [AI/ML Architecture ADR](./ADR-0006-ai-ml-architecture.md) - ML data pipelines
- [Multi-Tenancy ADR](./ADR-0003-multitenancy.md) - Tenant data isolation
- [Deployment & Infrastructure ADR](./ADR-0008-deployment-infrastructure.md) - Infrastructure deployment
