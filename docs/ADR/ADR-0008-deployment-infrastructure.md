# ADR-0008: Deployment & Infrastructure Strategy — Multi-Cloud with UAE Data Residency

- **Status**: Accepted
- **Date**: 2025-10-01
- **Owners**: Architecture Team, DevOps Team, Compliance Team
- **Related**: ADR-0003 (Multi-Tenancy), ADR-0007 (Security & Compliance)
- **Context**: Healthcare systems require high availability, data residency compliance, and disaster recovery

## 1) Decision

Implement a **multi-cloud deployment strategy** with:

- **Primary Cloud**: AWS (UAE regions) for production workloads
- **Secondary Cloud**: Azure (UAE regions) for disaster recovery and redundancy
- **Container Orchestration**: Kubernetes for application deployment
- **Infrastructure as Code**: Terraform for infrastructure management
- **CI/CD Pipeline**: GitLab CI/CD with automated testing and deployment
- **Data Residency**: All PHI stored in UAE regions only

## 2) Drivers

- **UAE Data Residency**: Regulatory requirement for PHI storage in UAE
- **High Availability**: 99.9% uptime requirement for healthcare systems
- **Disaster Recovery**: RPO ≤ 15 min, RTO ≤ 1 hr requirements
- **Scalability**: Support for 500+ clinics with varying workloads
- **Cost Optimization**: Multi-cloud strategy for cost efficiency and vendor lock-in avoidance

## 3) Scope

Applies to all infrastructure components including:
- **Compute**: Kubernetes clusters, auto-scaling groups
- **Storage**: Databases, object storage, backup systems
- **Networking**: VPCs, load balancers, CDN, DNS
- **Security**: Secrets management, encryption, access controls
- **Monitoring**: Logging, metrics, alerting, observability

## 4) Non-Goals

- Not implementing on-premises data centers initially
- Not supporting edge computing deployments
- Not covering legacy system migrations (future ADR)

## 5) Cloud Strategy

### Primary Cloud: AWS
- **Regions**: UAE (Dubai, Abu Dhabi) for data residency
- **Services**: EKS, RDS, S3, CloudFront, Route53, KMS
- **Use Cases**: Production workloads, primary data storage
- **Compliance**: SOC 2, ISO 27001, HIPAA BAA

### Secondary Cloud: Azure
- **Regions**: UAE (Dubai, Abu Dhabi) for disaster recovery
- **Services**: AKS, Azure SQL, Blob Storage, CDN, DNS
- **Use Cases**: Disaster recovery, backup systems, development
- **Compliance**: SOC 2, ISO 27001, HIPAA BAA

### Multi-Cloud Benefits
- **Vendor Independence**: Avoid lock-in to single cloud provider
- **Cost Optimization**: Competitive pricing and service selection
- **Disaster Recovery**: Cross-cloud backup and failover
- **Compliance**: Multiple compliance certifications and audit trails

## 6) Infrastructure Architecture

### Kubernetes Cluster Design
```yaml
# Cluster Configuration
clusters:
  production:
    cloud: aws
    region: uae-dubai
    nodes: 3
    instance_type: m5.xlarge
    auto_scaling: true
    
  disaster-recovery:
    cloud: azure
    region: uae-dubai
    nodes: 2
    instance_type: Standard_D4s_v3
    auto_scaling: false
    
  development:
    cloud: aws
    region: uae-dubai
    nodes: 2
    instance_type: m5.large
    auto_scaling: true
```

### Namespace Strategy
- **Production**: `prod` namespace for production workloads
- **Staging**: `staging` namespace for pre-production testing
- **Development**: `dev` namespace for development environments
- **System**: `kube-system`, `monitoring`, `security` for system components

### Resource Management
- **Resource Quotas**: Per-namespace resource limits
- **Priority Classes**: Different priority levels for workloads
- **Node Affinity**: Workload placement based on requirements
- **Pod Disruption Budgets**: Ensure availability during updates

## 7) Data Architecture

### Database Strategy
- **Primary**: AWS RDS PostgreSQL (Multi-AZ) for production
- **Read Replicas**: Cross-region read replicas for performance
- **Backup**: Automated daily backups with 30-day retention
- **Disaster Recovery**: Azure SQL Database for cross-cloud backup

### Storage Strategy
- **Object Storage**: AWS S3 (primary), Azure Blob (backup)
- **Block Storage**: EBS volumes for persistent data
- **File Storage**: EFS for shared file systems
- **Backup Storage**: Cross-cloud backup with encryption

### Data Residency Compliance
- **PHI Data**: Stored only in UAE regions
- **Metadata**: Can be stored in other regions for analytics
- **Backups**: Encrypted backups in UAE regions
- **Cross-Border**: No PHI data transfer outside UAE

## 8) Networking Architecture

### VPC Design
```yaml
# VPC Configuration
vpcs:
  production:
    cidr: 10.0.0.0/16
    subnets:
      - public: 10.0.1.0/24
      - private: 10.0.2.0/24
      - database: 10.0.3.0/24
      
  disaster-recovery:
    cidr: 10.1.0.0/16
    subnets:
      - public: 10.1.1.0/24
      - private: 10.1.2.0/24
      - database: 10.1.3.0/24
```

### Load Balancing
- **Application Load Balancer**: AWS ALB for HTTP/HTTPS traffic
- **Network Load Balancer**: AWS NLB for TCP/UDP traffic
- **CDN**: CloudFront for static content and API acceleration
- **DNS**: Route53 for domain management and health checks

### Network Security
- **Security Groups**: Restrictive inbound/outbound rules
- **NACLs**: Network-level access control lists
- **WAF**: Web Application Firewall for HTTP protection
- **DDoS Protection**: Cloud-based DDoS mitigation

## 9) CI/CD Pipeline

### GitLab CI/CD Configuration
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy-staging
  - deploy-production

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

test:
  stage: test
  script:
    - npm test
    - npm run test:integration

security:
  stage: security
  script:
    - npm audit
    - docker scan $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy-staging:
  stage: deploy-staging
  script:
    - kubectl apply -f k8s/staging/
  environment:
    name: staging
    url: https://staging.zeal.healthcare

deploy-production:
  stage: deploy-production
  script:
    - kubectl apply -f k8s/production/
  environment:
    name: production
    url: https://zeal.healthcare
  when: manual
```

### Deployment Strategies
- **Blue-Green**: Zero-downtime deployments for critical services
- **Canary**: Gradual rollout for new features
- **Rolling**: Standard rolling updates for non-critical services
- **Feature Flags**: Toggle features without deployment

## 10) Infrastructure as Code

### Terraform Configuration
```hcl
# main.tf
provider "aws" {
  region = "me-south-1" # UAE Dubai
}

provider "azurerm" {
  features {}
}

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "zeal-production"
  role_arn = aws_iam_role.eks_cluster.arn
  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}

# AKS Cluster (DR)
resource "azurerm_kubernetes_cluster" "dr" {
  name                = "zeal-dr"
  location            = "UAE North"
  resource_group_name = azurerm_resource_group.dr.name
  dns_prefix          = "zeal-dr"
  
  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_D4s_v3"
  }
}
```

### Configuration Management
- **Terraform**: Infrastructure provisioning and management
- **Helm**: Kubernetes application deployment
- **Kustomize**: Configuration customization
- **GitOps**: Git-based configuration management

## 11) Disaster Recovery

### RPO/RTO Requirements
- **RPO (Recovery Point Objective)**: ≤ 15 minutes
- **RTO (Recovery Time Objective)**: ≤ 1 hour
- **Availability**: 99.9% uptime (8.76 hours downtime/year)

### Backup Strategy
- **Database**: Continuous backup with point-in-time recovery
- **Application Data**: Daily automated backups
- **Configuration**: Git-based configuration backup
- **Cross-Cloud**: Backup data replicated to secondary cloud

### Failover Procedures
- **Automated**: Health check-based automatic failover
- **Manual**: Manual failover for planned maintenance
- **Testing**: Monthly disaster recovery testing
- **Documentation**: Detailed runbooks for failover procedures

## 12) Security Integration

### Secrets Management
- **AWS Secrets Manager**: Production secrets storage
- **Azure Key Vault**: DR secrets storage
- **HashiCorp Vault**: Application secrets management
- **Kubernetes Secrets**: Container secrets management

### Network Security
- **Private Subnets**: All application workloads in private subnets
- **NAT Gateway**: Outbound internet access through NAT
- **VPN**: Secure access to private resources
- **mTLS**: Mutual TLS for service-to-service communication

### Compliance Integration
- **Encryption**: All data encrypted at rest and in transit
- **Access Logging**: Comprehensive access logging
- **Audit Trails**: Complete audit trails for compliance
- **Data Residency**: PHI data residency compliance

## 13) Monitoring and Observability

### Infrastructure Monitoring
- **CloudWatch**: AWS infrastructure monitoring
- **Azure Monitor**: Azure infrastructure monitoring
- **Prometheus**: Application metrics collection
- **Grafana**: Metrics visualization and alerting

### Log Management
- **CloudWatch Logs**: AWS log aggregation
- **Azure Log Analytics**: Azure log aggregation
- **ELK Stack**: Centralized log analysis
- **Fluentd**: Log forwarding and processing

### Alerting
- **PagerDuty**: Incident management and alerting
- **Slack**: Team notifications and alerts
- **Email**: Critical alert notifications
- **SMS**: Emergency alert notifications

## 14) Cost Management

### Cost Optimization Strategies
- **Reserved Instances**: Long-term cost savings for predictable workloads
- **Spot Instances**: Cost savings for non-critical workloads
- **Auto-scaling**: Right-size resources based on demand
- **Resource Tagging**: Cost allocation and tracking

### Budget Management
- **Cost Alerts**: Budget threshold alerts
- **Cost Reports**: Detailed cost analysis and reporting
- **Resource Optimization**: Regular resource optimization reviews
- **Vendor Negotiation**: Regular vendor contract reviews

## 15) Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Single Cloud (AWS)** | Simple, integrated services | Vendor lock-in, single point of failure | ❌ |
| **Single Cloud (Azure)** | Microsoft ecosystem integration | Vendor lock-in, limited UAE services | ❌ |
| **On-Premises** | Full control, data sovereignty | High cost, complex maintenance, scalability limits | ❌ |
| **Multi-Cloud Strategy** | Vendor independence, disaster recovery, cost optimization | Complex architecture, dual maintenance | ✅ **Chosen** |

## 16) Implementation Phases

### Phase 1: Foundation (Week 1-4)
- [ ] Set up AWS and Azure accounts
- [ ] Deploy Kubernetes clusters
- [ ] Implement basic networking and security
- [ ] Set up CI/CD pipeline

### Phase 2: Production Setup (Week 5-8)
- [ ] Deploy production workloads
- [ ] Implement monitoring and logging
- [ ] Set up backup and disaster recovery
- [ ] Configure security controls

### Phase 3: Optimization (Week 9-12)
- [ ] Implement auto-scaling
- [ ] Optimize costs and performance
- [ ] Set up advanced monitoring
- [ ] Implement disaster recovery testing

### Phase 4: Advanced Features (Week 13-16)
- [ ] Implement advanced security controls
- [ ] Set up compliance monitoring
- [ ] Implement advanced backup strategies
- [ ] Set up performance optimization

### Phase 5: Validation (Week 17-20)
- [ ] Conduct disaster recovery testing
- [ ] Perform security assessments
- [ ] Validate compliance requirements
- [ ] Complete performance testing

## 17) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Cloud Outage** | High | Multi-cloud strategy, disaster recovery |
| **Data Residency Violation** | High | Strict data residency controls, monitoring |
| **Cost Overrun** | Medium | Budget monitoring, cost optimization |
| **Security Breach** | High | Comprehensive security controls, monitoring |

## 18) Monitoring & Observability

### Infrastructure Metrics
- **Availability**: System uptime and availability metrics
- **Performance**: Response time, throughput, resource utilization
- **Cost**: Cloud spending and cost optimization metrics
- **Security**: Security events and compliance metrics

### Alerts
- **Availability**: Service downtime and availability alerts
- **Performance**: Performance degradation alerts
- **Cost**: Budget threshold and cost spike alerts
- **Security**: Security incident and compliance alerts

## 19) Compliance Features

### UAE Data Residency
- **PHI Storage**: All PHI stored in UAE regions only
- **Data Processing**: All data processing in UAE regions
- **Backup**: Encrypted backups in UAE regions
- **Monitoring**: Continuous monitoring of data residency compliance

### Healthcare Compliance
- **HIPAA**: Healthcare data protection compliance
- **SOC 2**: Security and availability compliance
- **ISO 27001**: Information security management
- **UAE PDPL**: Personal data protection compliance

## 20) Cost Considerations

- **Infrastructure**: Cloud compute, storage, networking costs
- **Licensing**: Software licenses and cloud service costs
- **Personnel**: DevOps engineers, cloud architects
- **Compliance**: Audit and compliance costs

## 21) Triggers to Revisit

- **New Cloud Services**: New cloud services or features
- **Cost Optimization**: Significant cost increases or budget constraints
- **Compliance Changes**: New regulatory requirements
- **Performance Issues**: Infrastructure performance problems

## 22) Acceptance Criteria

- [ ] Multi-cloud infrastructure deployed and operational
- [ ] Kubernetes clusters running in both AWS and Azure
- [ ] CI/CD pipeline implemented and tested
- [ ] Disaster recovery procedures tested and validated
- [ ] Data residency compliance verified
- [ ] Security controls implemented and tested
- [ ] Monitoring and alerting configured
- [ ] Cost optimization strategies implemented
- [ ] Compliance requirements satisfied

## 23) Related Documentation

- [Deployment & Operations](../10-Deployment-&-Ops.md) - Detailed deployment guide
- [Security & Compliance ADR](./ADR-0007-security-compliance.md) - Security framework
- [Multi-Tenancy ADR](./ADR-0003-multitenancy.md) - Tenant isolation
- [Observability ADR](./ADR-0009-observability-monitoring.md) - Monitoring strategy
