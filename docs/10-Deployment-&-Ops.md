# Deployment & Operations

## Overview

This document outlines the deployment strategy, environment management, infrastructure as code, and operational procedures for the Zeal PMS/RCM platform.

## Environment Strategy

### Environment Architecture

```mermaid
graph TB
    subgraph "Development"
        DEV[Development Environment]
        DEV-DB[Dev Database]
        DEV-CACHE[Dev Cache]
    end
    
    subgraph "Staging"
        STAGE[Staging Environment]
        STAGE-DB[Staging Database]
        STAGE-CACHE[Staging Cache]
    end
    
    subgraph "Production"
        PROD[Production Environment]
        PROD-DB[Production Database]
        PROD-CACHE[Production Cache]
    end
    
    subgraph "DR"
        DR[DR Environment]
        DR-DB[DR Database]
        DR-CACHE[DR Cache]
    end
    
    DEV --> STAGE
    STAGE --> PROD
    PROD -.->|Replication| DR
```

### Environment Configuration

```yaml
environments:
  development:
    purpose: "Feature development and testing"
    data: "Synthetic test data"
    scaling: "Single instance per service"
    monitoring: "Basic monitoring"
    security: "Relaxed security policies"
    backup: "Daily backups"
    
  staging:
    purpose: "Integration testing and UAT"
    data: "Anonymized production data"
    scaling: "Production-like scaling"
    monitoring: "Full monitoring stack"
    security: "Production-like security"
    backup: "Daily backups"
    
  production:
    purpose: "Live production environment"
    data: "Real patient data"
    scaling: "Auto-scaling enabled"
    monitoring: "Full monitoring with alerts"
    security: "Full security controls"
    backup: "Continuous backups"
    
  dr:
    purpose: "Disaster recovery"
    data: "Replicated production data"
    scaling: "Standby instances"
    monitoring: "Health checks only"
    security: "Production security"
    backup: "Continuous replication"
```

## Infrastructure as Code (IaC)

### Cloud Provider Selection

The Zeal platform supports deployment on both AWS and Azure cloud platforms, with configurations optimized for UAE data residency requirements.

#### Cloud Provider Comparison

| Feature | AWS | Azure |
|---------|-----|-------|
| UAE Regions | me-central-1, me-south-1 | UAE North, UAE Central |
| Kubernetes Service | EKS | AKS |
| Database Service | RDS PostgreSQL | Azure Database for PostgreSQL |
| Cache Service | ElastiCache Redis | Azure Cache for Redis |
| Object Storage | S3 | Blob Storage |
| Key Management | KMS | Key Vault |
| Container Registry | ECR | ACR |
| Monitoring | CloudWatch | Azure Monitor |

### AWS Deployment Configuration

#### Main Configuration
```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    bucket = "zeal-terraform-state"
    key    = "zeal/terraform.tfstate"
    region = "me-central-1"
    
    dynamodb_table = "zeal-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "zeal"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}
```

### Azure Deployment Configuration

#### Main Configuration
```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
  
  backend "azurerm" {
    resource_group_name  = "zeal-terraform-state"
    storage_account_name = "zealterraformstate"
    container_name       = "tfstate"
    key                  = "zeal/terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
  
  default_tags {
    tags = {
      Project     = "zeal"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

provider "kubernetes" {
  host                   = module.aks.kube_config.0.host
  cluster_ca_certificate = base64decode(module.aks.kube_config.0.cluster_ca_certificate)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "az"
    args        = ["aks", "get-credentials", "--resource-group", var.resource_group_name, "--name", module.aks.kube_config.0.name]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.aks.kube_config.0.host
    cluster_ca_certificate = base64decode(module.aks.kube_config.0.cluster_ca_certificate)
    
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "az"
      args        = ["aks", "get-credentials", "--resource-group", var.resource_group_name, "--name", module.aks.kube_config.0.name]
    }
  }
}
```

#### AWS EKS Cluster Configuration
```hcl
# modules/eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"
  
  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version
  
  vpc_id                         = var.vpc_id
  subnet_ids                     = var.private_subnet_ids
  cluster_endpoint_public_access = var.environment != "production"
  
  # EKS Managed Node Groups
  eks_managed_node_groups = {
    main = {
      name = "main"
      
      instance_types = var.node_instance_types
      capacity_type  = "ON_DEMAND"
      
      min_size     = var.node_min_size
      max_size     = var.node_max_size
      desired_size = var.node_desired_size
      
      disk_size = 50
      disk_type = "gp3"
      
      labels = {
        Environment = var.environment
        NodeGroup   = "main"
      }
      
      taints = []
      
      tags = {
        ExtraTag = "main"
      }
    }
    
    spot = {
      name = "spot"
      
      instance_types = var.spot_instance_types
      capacity_type  = "SPOT"
      
      min_size     = 0
      max_size     = var.spot_max_size
      desired_size = var.spot_desired_size
      
      disk_size = 50
      disk_type = "gp3"
      
      labels = {
        Environment = var.environment
        NodeGroup   = "spot"
      }
      
      taints = [
        {
          key    = "spot"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      ]
      
      tags = {
        ExtraTag = "spot"
      }
    }
  }
  
  # aws-auth configmap
  manage_aws_auth_configmap = true
  
  aws_auth_roles = [
    {
      rolearn  = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ZealAdminRole"
      username = "zeal-admin"
      groups   = ["system:masters"]
    }
  ]
  
  aws_auth_users = [
    {
      userarn  = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/zeal-admin"
      username = "zeal-admin"
      groups   = ["system:masters"]
    }
  ]
  
  tags = {
    Environment = var.environment
    Project     = "zeal"
  }
}
```

#### Azure AKS Cluster Configuration
```hcl
# modules/aks/main.tf
module "aks" {
  source  = "Azure/aks/azurerm"
  version = "~> 7.0"
  
  resource_group_name = var.resource_group_name
  location           = var.location
  cluster_name       = var.cluster_name
  kubernetes_version = var.kubernetes_version
  
  vnet_subnet_id = var.vnet_subnet_id
  
  # Node pools
  node_pools = {
    main = {
      name                = "main"
      vm_size             = var.node_vm_size
      node_count          = var.node_count
      min_count           = var.node_min_count
      max_count           = var.node_max_count
      enable_auto_scaling = true
      os_disk_size_gb     = 50
      os_disk_type        = "Premium_LRS"
      
      node_labels = {
        Environment = var.environment
        NodeGroup   = "main"
      }
      
      node_taints = []
    }
    
    spot = {
      name                = "spot"
      vm_size             = var.spot_vm_size
      node_count          = 0
      min_count           = 0
      max_count           = var.spot_max_count
      enable_auto_scaling = true
      os_disk_size_gb     = 50
      os_disk_type        = "Premium_LRS"
      priority            = "Spot"
      eviction_policy     = "Delete"
      
      node_labels = {
        Environment = var.environment
        NodeGroup   = "spot"
      }
      
      node_taints = [
        "spot=true:NoSchedule"
      ]
    }
  }
  
  # RBAC configuration
  rbac_enabled = true
  
  # Network configuration
  network_plugin    = "azure"
  network_policy    = "azure"
  load_balancer_sku = "standard"
  
  # Security configuration
  private_cluster_enabled = var.environment == "production"
  
  # Monitoring
  oms_agent_enabled = true
  log_analytics_workspace_id = var.log_analytics_workspace_id
  
  tags = {
    Environment = var.environment
    Project     = "zeal"
  }
}
```

#### AWS RDS Configuration
```hcl
# modules/rds/main.tf
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"
  
  identifier = "${var.environment}-zeal-postgres"
  
  engine               = "postgres"
  engine_version       = "16.1"
  family               = "postgres16"
  major_engine_version = "16"
  instance_class       = var.instance_class
  
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = "zeal_production"
  username = "zeal_admin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = var.backup_retention_period
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"
  
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn
  
  parameters = [
    {
      name  = "log_statement"
      value = "all"
    },
    {
      name  = "log_min_duration_statement"
      value = "1000"
    }
  ]
  
  tags = {
    Environment = var.environment
    Project     = "zeal"
  }
}
```

#### Azure Database for PostgreSQL Configuration
```hcl
# modules/azurerm-postgresql/main.tf
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "${var.environment}-zeal-postgres"
  resource_group_name    = var.resource_group_name
  location              = var.location
  
  administrator_login    = "zeal_admin"
  administrator_password = var.db_password
  
  sku_name   = var.sku_name
  version    = "16"
  
  storage_mb = var.storage_mb
  backup_retention_days = var.backup_retention_days
  
  geo_redundant_backup_enabled = var.environment == "production"
  
  high_availability {
    mode = var.environment == "production" ? "ZoneRedundant" : "Disabled"
  }
  
  maintenance_window {
    day_of_week  = 0
    start_hour   = 4
    start_minute = 0
  }
  
  tags = {
    Environment = var.environment
    Project     = "zeal"
  }
}

resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = "zeal_production"
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "main" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_statement" {
  name      = "log_statement"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "all"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_min_duration_statement" {
  name      = "log_min_duration_statement"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "1000"
}
```

#### AWS Redis Configuration
```hcl
# modules/redis/main.tf
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.environment}-zeal-redis"
  description                = "Redis cluster for Zeal ${var.environment}"
  
  node_type                  = var.node_type
  port                       = 6379
  parameter_group_name       = "default.redis7"
  
  num_cache_clusters         = var.num_cache_clusters
  automatic_failover_enabled = var.environment == "production"
  multi_az_enabled          = var.environment == "production"
  
  subnet_group_name = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token = var.redis_auth_token
  
  snapshot_retention_limit = var.snapshot_retention_limit
  snapshot_window         = "03:00-05:00"
  maintenance_window      = "sun:05:00-sun:07:00"
  
  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }
  
  tags = {
    Environment = var.environment
    Project     = "zeal"
  }
}
```

#### Azure Cache for Redis Configuration
```hcl
# modules/azurerm-redis/main.tf
resource "azurerm_redis_cache" "main" {
  name                = "${var.environment}-zeal-redis"
  location            = var.location
  resource_group_name = var.resource_group_name
  
  capacity            = var.capacity
  family              = var.family
  sku_name            = var.sku_name
  
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
  
  redis_configuration {
    maxmemory_reserved = 2
    maxmemory_delta    = 2
    maxmemory_policy   = "allkeys-lru"
    
    enable_authentication = true
  }
  
  patch_schedule {
    day_of_week        = "Sunday"
    start_hour_utc     = 5
    maintenance_window = "PT5H"
  }
  
  tags = {
    Environment = var.environment
    Project     = "zeal"
  }
}

resource "azurerm_redis_firewall_rule" "main" {
  name                = "AllowAzureServices"
  redis_cache_name    = azurerm_redis_cache.main.name
  resource_group_name = var.resource_group_name
  start_ip            = "0.0.0.0"
  end_ip              = "0.0.0.0"
}
```

### Kubernetes Manifests

#### Namespace Configuration
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zeal
  labels:
    name: zeal
    environment: production
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: zeal-quota
  namespace: zeal
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.cpu: "40"
    limits.memory: 80Gi
    persistentvolumeclaims: "10"
    services: "10"
    secrets: "20"
    configmaps: "20"
```

#### ConfigMap Configuration
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: zeal-config
  namespace: zeal
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  DATABASE_URL: "postgresql://zeal_admin:${DB_PASSWORD}@${DB_HOST}:5432/zeal_production"
  REDIS_URL: "redis://${REDIS_HOST}:6379"
  KAFKA_BROKERS: "${KAFKA_HOST}:9092"
  JWT_SECRET: "${JWT_SECRET}"
  ENCRYPTION_KEY: "${ENCRYPTION_KEY}"
  DHA_BASE_URL: "https://eclaimlink.dha.gov.ae"
  DOH_BASE_URL: "https://shafafiya.doh.gov.ae"
  AI_MODEL_ENDPOINT: "http://ai-service:8000"
  MONITORING_ENABLED: "true"
  TRACING_ENABLED: "true"
```

#### Secret Configuration
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: zeal-secrets
  namespace: zeal
type: Opaque
data:
  DB_PASSWORD: <base64-encoded-password>
  REDIS_AUTH_TOKEN: <base64-encoded-token>
  JWT_SECRET: <base64-encoded-secret>
  ENCRYPTION_KEY: <base64-encoded-key>
  DHA_CLIENT_CERT: <base64-encoded-cert>
  DHA_CLIENT_KEY: <base64-encoded-key>
  DOH_CLIENT_ID: <base64-encoded-id>
  DOH_CLIENT_SECRET: <base64-encoded-secret>
```

#### Deployment Configuration
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zeal-api
  namespace: zeal
  labels:
    app: zeal-api
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zeal-api
  template:
    metadata:
      labels:
        app: zeal-api
        version: v1
    spec:
      containers:
      - name: zeal-api
        image: zeal/api:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: zeal-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: zeal-config
              key: DATABASE_URL
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zeal-secrets
              key: DB_PASSWORD
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
      securityContext:
        fsGroup: 1000
      nodeSelector:
        nodegroup: main
      tolerations:
      - key: "spot"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
```

#### Service Configuration
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: zeal-api-service
  namespace: zeal
  labels:
    app: zeal-api
spec:
  selector:
    app: zeal-api
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-api-headless
  namespace: zeal
  labels:
    app: zeal-api
spec:
  selector:
    app: zeal-api
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
  clusterIP: None
```

#### Ingress Configuration
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zeal-ingress
  namespace: zeal
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.zeal.health
    - app.zeal.health
    secretName: zeal-tls
  rules:
  - host: api.zeal.health
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: zeal-api-service
            port:
              number: 80
  - host: app.zeal.health
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: zeal-web-service
            port:
              number: 80
```

### Helm Charts

#### Chart Structure
```
zeal/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-staging.yaml
├── values-prod.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── hpa.yaml
│   └── pdb.yaml
└── charts/
    ├── postgresql/
    ├── redis/
    └── kafka/
```

#### Chart Values
```yaml
# values.yaml
global:
  imageRegistry: "zeal.health"
  imagePullSecrets: []
  storageClass: "gp3"

replicaCount: 3

image:
  repository: zeal/api
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: api.zeal.health
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: zeal-tls
      hosts:
        - api.zeal.health

resources:
  limits:
    cpu: 500m
    memory: 1Gi
  requests:
    cpu: 250m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

nodeSelector: {}

tolerations: []

affinity: {}

podDisruptionBudget:
  enabled: true
  minAvailable: 1

monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    interval: 30s
    scrapeTimeout: 10s
```

## CI/CD Pipeline

### Cloud Provider Selection

The CI/CD pipeline supports both AWS and Azure deployments with cloud-specific configurations.

### AWS GitHub Actions Workflow

#### Main Workflow
```yaml
# .github/workflows/ci-cd-aws.yml
name: CI/CD Pipeline - AWS

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AWS_REGION: me-central-1
  EKS_CLUSTER_NAME: zeal-production
  ECR_REGISTRY: 123456789012.dkr.ecr.me-central-1.amazonaws.com
  ECR_REPOSITORY: zeal

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Run security scan
      run: npm audit --audit-level moderate
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Update kubeconfig
      run: aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name ${{ env.EKS_CLUSTER_NAME }}
    
    - name: Deploy to Kubernetes
      run: |
        helm upgrade --install zeal ./helm/zeal \
          --namespace zeal \
          --create-namespace \
          --set image.tag=${{ github.sha }} \
          --set environment=production \
          --wait
    
    - name: Run smoke tests
      run: |
        kubectl wait --for=condition=ready pod -l app=zeal-api -n zeal --timeout=300s
        kubectl run smoke-test --image=curlimages/curl --rm -i --restart=Never -- \
          curl -f http://zeal-api-service.zeal.svc.cluster.local/health
```

### Azure GitHub Actions Workflow

#### Main Workflow
```yaml
# .github/workflows/ci-cd-azure.yml
name: CI/CD Pipeline - Azure

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AZURE_REGION: uaenorth
  AKS_CLUSTER_NAME: zeal-production
  ACR_REGISTRY: zealacr.azurecr.io
  ACR_REPOSITORY: zeal

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Run security scan
      run: npm audit --audit-level moderate
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Login to Azure Container Registry
      uses: azure/docker-login@v1
      with:
        login-server: ${{ env.ACR_REGISTRY }}
        username: ${{ secrets.ACR_USERNAME }}
        password: ${{ secrets.ACR_PASSWORD }}
    
    - name: Build and push Docker image
      env:
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ACR_REGISTRY/$ACR_REPOSITORY:$IMAGE_TAG .
        docker push $ACR_REGISTRY/$ACR_REPOSITORY:$IMAGE_TAG
        docker tag $ACR_REGISTRY/$ACR_REPOSITORY:$IMAGE_TAG $ACR_REGISTRY/$ACR_REPOSITORY:latest
        docker push $ACR_REGISTRY/$ACR_REPOSITORY:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Get AKS credentials
      uses: azure/aks-set-context@v3
      with:
        resource-group: zeal-production-rg
        cluster-name: ${{ env.AKS_CLUSTER_NAME }}
    
    - name: Deploy to Kubernetes
      run: |
        helm upgrade --install zeal ./helm/zeal \
          --namespace zeal \
          --create-namespace \
          --set image.tag=${{ github.sha }} \
          --set environment=production \
          --wait
    
    - name: Run smoke tests
      run: |
        kubectl wait --for=condition=ready pod -l app=zeal-api -n zeal --timeout=300s
        kubectl run smoke-test --image=curlimages/curl --rm -i --restart=Never -- \
          curl -f http://zeal-api-service.zeal.svc.cluster.local/health
```

#### Security Scanning
```yaml
# .github/workflows/security.yml
name: Security Scanning

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM

jobs:
  container-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker image
      run: docker build -t zeal-api:latest .
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'zeal-api:latest'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  dependency-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Snyk to check for vulnerabilities
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

  infrastructure-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: 1.5.0
    
    - name: Terraform Init
      run: terraform init
    
    - name: Terraform Plan
      run: terraform plan -out=tfplan
    
    - name: Run Checkov
      uses: bridgecrewio/checkov-action@master
      with:
        directory: .
        framework: terraform
        output_format: sarif
        output_file_path: checkov-results.sarif
    
    - name: Upload Checkov scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'checkov-results.sarif'
```

## Deployment Strategies

### Blue-Green Deployment

#### Blue-Green Configuration
```yaml
# k8s/blue-green-deployment.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: zeal-api-rollout
  namespace: zeal
spec:
  replicas: 3
  strategy:
    blueGreen:
      activeService: zeal-api-active
      previewService: zeal-api-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 30
      prePromotionAnalysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: zeal-api-preview
      postPromotionAnalysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: zeal-api-active
  selector:
    matchLabels:
      app: zeal-api
  template:
    metadata:
      labels:
        app: zeal-api
    spec:
      containers:
      - name: zeal-api
        image: zeal/api:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

#### Blue-Green Promotion Script
```bash
#!/bin/bash
# scripts/promote-blue-green.sh

set -e

NAMESPACE="zeal"
ROLLOUT_NAME="zeal-api-rollout"

echo "Promoting blue-green deployment..."

# Check current status
kubectl get rollout $ROLLOUT_NAME -n $NAMESPACE

# Promote to active
kubectl argo rollouts promote $ROLLOUT_NAME -n $NAMESPACE

# Wait for promotion to complete
kubectl argo rollouts status $ROLLOUT_NAME -n $NAMESPACE --watch

# Verify promotion
kubectl get rollout $ROLLOUT_NAME -n $NAMESPACE

echo "Blue-green promotion completed successfully!"
```

### Canary Deployment

#### Canary Configuration
```yaml
# k8s/canary-deployment.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: zeal-api-canary
  namespace: zeal
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {duration: 10m}
      - setWeight: 40
      - pause: {duration: 10m}
      - setWeight: 60
      - pause: {duration: 10m}
      - setWeight: 80
      - pause: {duration: 10m}
      analysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: zeal-api-canary
        startingStep: 2
        successfulHistoryLimit: 2
        unsuccessfulHistoryLimit: 2
  selector:
    matchLabels:
      app: zeal-api
  template:
    metadata:
      labels:
        app: zeal-api
    spec:
      containers:
      - name: zeal-api
        image: zeal/api:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

## Operational Procedures

### Environment Management

#### Environment Promotion
```bash
#!/bin/bash
# scripts/promote-environment.sh

set -e

SOURCE_ENV=$1
TARGET_ENV=$2

if [ -z "$SOURCE_ENV" ] || [ -z "$TARGET_ENV" ]; then
  echo "Usage: $0 <source_env> <target_env>"
  echo "Example: $0 staging production"
  exit 1
fi

echo "Promoting from $SOURCE_ENV to $TARGET_ENV..."

# Update Terraform variables
sed -i "s/environment = \"$SOURCE_ENV\"/environment = \"$TARGET_ENV\"/g" terraform/variables.tf

# Apply Terraform changes
cd terraform
terraform plan -var-file="environments/$TARGET_ENV.tfvars"
terraform apply -var-file="environments/$TARGET_ENV.tfvars" -auto-approve
cd ..

# Update Kubernetes manifests
kubectl apply -f k8s/namespaces/$TARGET_ENV.yaml
kubectl apply -f k8s/configmaps/$TARGET_ENV.yaml
kubectl apply -f k8s/secrets/$TARGET_ENV.yaml

# Deploy application
helm upgrade --install zeal ./helm/zeal \
  --namespace zeal-$TARGET_ENV \
  --create-namespace \
  --values ./helm/zeal/values-$TARGET_ENV.yaml \
  --wait

echo "Environment promotion completed successfully!"
```

#### Environment Cleanup
```bash
#!/bin/bash
# scripts/cleanup-environment.sh

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  echo "Example: $0 development"
  exit 1
fi

echo "Cleaning up $ENVIRONMENT environment..."

# Delete Kubernetes resources
kubectl delete namespace zeal-$ENVIRONMENT --ignore-not-found=true

# Delete Terraform resources
cd terraform
terraform destroy -var-file="environments/$ENVIRONMENT.tfvars" -auto-approve
cd ..

# Clean up Docker images
docker rmi $(docker images "zeal/*" --format "table {{.Repository}}:{{.Tag}}" | grep $ENVIRONMENT) || true

echo "Environment cleanup completed successfully!"
```

### Backup and Recovery

#### Automated Backup Script
```bash
#!/bin/bash
# scripts/backup.sh

set -e

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_BUCKET="zeal-backups"
ENVIRONMENT="production"

echo "Starting backup process..."

# Database backup
echo "Backing up database..."
kubectl exec -it postgres-0 -n zeal -- pg_dump -h localhost -U zeal_admin -d zeal_production > db_backup_$BACKUP_DATE.sql
gzip db_backup_$BACKUP_DATE.sql

# Upload to S3
aws s3 cp db_backup_$BACKUP_DATE.sql.gz s3://$BACKUP_BUCKET/database/

# Redis backup
echo "Backing up Redis..."
kubectl exec -it redis-0 -n zeal -- redis-cli BGSAVE
kubectl cp zeal/redis-0:/data/dump.rdb redis_backup_$BACKUP_DATE.rdb
gzip redis_backup_$BACKUP_DATE.rdb

# Upload to S3
aws s3 cp redis_backup_$BACKUP_DATE.rdb.gz s3://$BACKUP_BUCKET/redis/

# Application data backup
echo "Backing up application data..."
kubectl exec -it zeal-api-0 -n zeal -- tar -czf /tmp/app_data_$BACKUP_DATE.tar.gz /app/data
kubectl cp zeal/zeal-api-0:/tmp/app_data_$BACKUP_DATE.tar.gz app_data_$BACKUP_DATE.tar.gz

# Upload to S3
aws s3 cp app_data_$BACKUP_DATE.tar.gz s3://$BACKUP_BUCKET/application/

# Clean up local files
rm -f db_backup_$BACKUP_DATE.sql.gz redis_backup_$BACKUP_DATE.rdb.gz app_data_$BACKUP_DATE.tar.gz

echo "Backup completed successfully!"
```

#### Recovery Script
```bash
#!/bin/bash
# scripts/restore.sh

set -e

BACKUP_DATE=$1
BACKUP_BUCKET="zeal-backups"

if [ -z "$BACKUP_DATE" ]; then
  echo "Usage: $0 <backup_date>"
  echo "Example: $0 20240101_120000"
  exit 1
fi

echo "Starting restore process for backup $BACKUP_DATE..."

# Download backups from S3
aws s3 cp s3://$BACKUP_BUCKET/database/db_backup_$BACKUP_DATE.sql.gz .
aws s3 cp s3://$BACKUP_BUCKET/redis/redis_backup_$BACKUP_DATE.rdb.gz .
aws s3 cp s3://$BACKUP_BUCKET/application/app_data_$BACKUP_DATE.tar.gz .

# Decompress backups
gunzip db_backup_$BACKUP_DATE.sql.gz
gunzip redis_backup_$BACKUP_DATE.rdb.gz

# Restore database
echo "Restoring database..."
kubectl exec -i postgres-0 -n zeal -- psql -h localhost -U zeal_admin -d zeal_production < db_backup_$BACKUP_DATE.sql

# Restore Redis
echo "Restoring Redis..."
kubectl cp redis_backup_$BACKUP_DATE.rdb zeal/redis-0:/data/dump.rdb
kubectl exec -it redis-0 -n zeal -- redis-cli FLUSHALL
kubectl exec -it redis-0 -n zeal -- redis-cli RESTORE dump.rdb 0

# Restore application data
echo "Restoring application data..."
kubectl cp app_data_$BACKUP_DATE.tar.gz zeal/zeal-api-0:/tmp/
kubectl exec -it zeal-api-0 -n zeal -- tar -xzf /tmp/app_data_$BACKUP_DATE.tar.gz -C /

# Clean up local files
rm -f db_backup_$BACKUP_DATE.sql redis_backup_$BACKUP_DATE.rdb app_data_$BACKUP_DATE.tar.gz

echo "Restore completed successfully!"
```

### Monitoring and Alerting

#### AWS CloudWatch Configuration
```yaml
# monitoring/cloudwatch-config.yaml
cloudwatch:
  namespace: "Zeal/Platform"
  metrics:
    - "RequestCount"
    - "ResponseTime"
    - "ErrorRate"
    - "ActiveUsers"
  
  alarms:
    - name: "HighErrorRate"
      metric: "ErrorRate"
      threshold: 5.0
      comparison: "GreaterThanThreshold"
      period: 300
      evaluation_periods: 2
      
    - name: "HighResponseTime"
      metric: "ResponseTime"
      threshold: 2000
      comparison: "GreaterThanThreshold"
      period: 300
      evaluation_periods: 2
```

#### Azure Monitor Configuration
```yaml
# monitoring/azure-monitor-config.yaml
azure_monitor:
  workspace_id: "zeal-monitor-workspace"
  metrics:
    - "RequestCount"
    - "ResponseTime"
    - "ErrorRate"
    - "ActiveUsers"
  
  alerts:
    - name: "HighErrorRate"
      metric: "ErrorRate"
      threshold: 5.0
      operator: "GreaterThan"
      aggregation: "Average"
      window_size: "PT5M"
      frequency: "PT1M"
      
    - name: "HighResponseTime"
      metric: "ResponseTime"
      threshold: 2000
      operator: "GreaterThan"
      aggregation: "Average"
      window_size: "PT5M"
      frequency: "PT1M"
```

#### Prometheus Configuration
```yaml
# monitoring/prometheus-config.yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "zeal-rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'zeal-api'
    kubernetes_sd_configs:
    - role: endpoints
      namespaces:
        names:
        - zeal
    relabel_configs:
    - source_labels: [__meta_kubernetes_service_name]
      action: keep
      regex: zeal-api-service
    - source_labels: [__meta_kubernetes_endpoint_port_name]
      action: keep
      regex: http

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
```

#### Grafana Dashboard
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

## Data Residency and Compliance

### UAE Data Residency

#### AWS Data Location Configuration
```yaml
aws_data_residency:
  primary_region: "me-central-1"  # UAE Central
  dr_region: "me-south-1"         # UAE North
  data_types:
    phi:
      location: "me-central-1"
      replication: "me-south-1"
      encryption: "AES-256"
    logs:
      location: "me-central-1"
      retention: "7 years"
      encryption: "AES-256"
    backups:
      location: "me-central-1"
      replication: "me-south-1"
      encryption: "AES-256"
```

#### Azure Data Location Configuration
```yaml
azure_data_residency:
  primary_region: "uaenorth"      # UAE North
  dr_region: "uaecentral"         # UAE Central
  data_types:
    phi:
      location: "uaenorth"
      replication: "uaecentral"
      encryption: "AES-256"
    logs:
      location: "uaenorth"
      retention: "7 years"
      encryption: "AES-256"
    backups:
      location: "uaenorth"
      replication: "uaecentral"
      encryption: "AES-256"
```

#### Cross-Border Transfer Controls
```yaml
cross_border_transfers:
  enabled: false
  exceptions:
    - "Emergency access for support"
    - "Regulatory compliance"
    - "Legal requirements"
  
  approval_process:
    - "Data transfer impact assessment"
    - "Legal review"
    - "Compliance officer approval"
    - "Documentation and audit trail"
  
  safeguards:
    - "Standard Contractual Clauses"
    - "Data encryption in transit"
    - "Access logging and monitoring"
    - "Regular compliance audits"
```

### Compliance Monitoring

#### Compliance Dashboard
```yaml
compliance_monitoring:
  metrics:
    - "Data residency compliance"
    - "Encryption coverage"
    - "Access control effectiveness"
    - "Audit log completeness"
  
  alerts:
    - "Unauthorized data access"
    - "Encryption failures"
    - "Compliance violations"
    - "Audit log gaps"
  
  reporting:
    - "Monthly compliance reports"
    - "Quarterly security assessments"
    - "Annual compliance audits"
    - "Regulatory submissions"
```

## Cost Optimization

### Resource Optimization

#### Cost Monitoring
```yaml
cost_optimization:
  monitoring:
    - "Resource utilization tracking"
    - "Cost per tenant analysis"
    - "Waste identification"
    - "Optimization recommendations"
  
  strategies:
    - "Right-sizing instances"
    - "Spot instance usage"
    - "Reserved capacity"
    - "Auto-scaling optimization"
  
  budgets:
    - "Monthly budget alerts"
    - "Cost anomaly detection"
    - "Forecasting and planning"
    - "Cost allocation by tenant"
```

#### Resource Right-Sizing
```bash
#!/bin/bash
# scripts/right-size-resources.sh

set -e

echo "Analyzing resource utilization..."

# Get current resource usage
kubectl top pods -n zeal --sort-by=cpu
kubectl top pods -n zeal --sort-by=memory

# Analyze metrics from Prometheus
curl -G 'http://prometheus:9090/api/v1/query' \
  --data-urlencode 'query=avg_over_time(container_cpu_usage_seconds_total[7d])' \
  --data-urlencode 'query=avg_over_time(container_memory_usage_bytes[7d])'

echo "Resource analysis completed. Review recommendations above."
```

This comprehensive deployment and operations framework provides the foundation for reliable, scalable, and compliant operations of the Zeal PMS/RCM platform in the UAE.
