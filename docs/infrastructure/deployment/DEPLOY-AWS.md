# Deploying Zeal on AWS

## 1. Overview

Amazon Web Services is the recommended primary cloud provider for the Zeal healthcare platform, offering UAE-local regions that satisfy data residency requirements mandated by DHA, DOH, and MOHAP.

**Target regions:**

| Region | Code | Use Case |
|--------|------|----------|
| UAE (Central) | `me-central-1` | Primary production deployment |
| Bahrain | `me-south-1` | Disaster recovery / secondary |

**High-level architecture:**

```
                         Route 53
                            |
                      +-----+-----+
                      |           |
               app.zeal.health  api.zeal.health
                      |           |
                  CloudFront      ALB (HTTPS)
                      |           |
                   S3 Bucket    EKS Cluster
                              /   |   |   \
                       Foundation Clinical RCM  Frontend
                             \    |    /
                              RDS PostgreSQL 16 (Multi-AZ)
                                    |
                              4 databases:
                              zeal_foundation
                              zeal_clinical
                              zeal_rcm
                              zeal_analytics
                                    +
                           ElastiCache Redis 7
```

**Services deployed to EKS:**

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Next.js 14) | 3000 | Web application |
| Foundation | 3010 | Tenants, users, facilities, RBAC |
| Clinical | 3020 | Patients, appointments, encounters |
| RCM | 3030 | Billing, claims, payments |
| Analytics | 3040 | Audit logs, reporting |
| PRM | 3013 | Patient Relationship Management |
| AI Gateway | 3015 | AI-assisted coding, suggestions |

> **Reference:** The companion document [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md) contains the full Terraform modules, Kubernetes manifests, Helm chart structure, and CI/CD workflows referenced throughout this guide. This document focuses on step-by-step execution.

---

## 2. Prerequisites

### 2.1 Local Tooling

Install the following before proceeding:

```bash
# AWS CLI v2
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
aws --version  # >= 2.x

# Terraform
brew install hashicorp/tap/terraform
terraform version  # >= 1.0

# kubectl
brew install kubectl
kubectl version --client

# Helm 3
brew install helm
helm version  # >= 3.x

# Docker
# Install Docker Desktop or colima
docker --version

# eksctl (optional but helpful)
brew install eksctl
```

### 2.2 AWS Account Requirements

- An AWS account with access to **me-central-1** (UAE Central). Request activation via AWS Support if the region is not visible in the console.
- An IAM user or role with sufficient permissions. At minimum, attach the following managed policies:
  - `AmazonEKSClusterPolicy`
  - `AmazonEKSWorkerNodePolicy`
  - `AmazonEKS_CNI_Policy`
  - `AmazonEC2ContainerRegistryFullAccess`
  - `AmazonRDSFullAccess`
  - `AmazonElastiCacheFullAccess`
  - `AmazonS3FullAccess`
  - `AmazonRoute53FullAccess`
  - `AmazonVPCFullAccess`
  - `SecretsManagerReadWrite`
  - `CloudWatchFullAccess`
  - `IAMFullAccess` (for creating service roles)
  - `AWSCertificateManagerFullAccess`

For production, replace broad policies with scoped custom policies.

### 2.3 Configure AWS CLI

```bash
aws configure --profile zeal-prod
# AWS Access Key ID: <YOUR_KEY>
# AWS Secret Access Key: <YOUR_SECRET>
# Default region name: me-central-1
# Default output format: json

export AWS_PROFILE=zeal-prod
export AWS_REGION=me-central-1
```

Verify access:

```bash
aws sts get-caller-identity
aws ec2 describe-availability-zones --region me-central-1
```

---

## 3. Infrastructure Provisioning

### 3.1 Terraform State Backend

Before running any Terraform, set up remote state with locking.

```bash
# Create S3 bucket for state
aws s3api create-bucket \
  --bucket zeal-terraform-state \
  --region me-central-1 \
  --create-bucket-configuration LocationConstraint=me-central-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket zeal-terraform-state \
  --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket zeal-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket zeal-terraform-state \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name zeal-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region me-central-1
```

### 3.2 VPC and Networking

The Zeal VPC uses three subnet tiers across two or more availability zones:

| Tier | Subnet Type | Purpose |
|------|-------------|---------|
| Public | Internet-facing | ALB, NAT Gateway |
| Private | Application | EKS worker nodes |
| Database | Isolated | RDS, ElastiCache |

The complete VPC Terraform module is defined in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md) under the AWS Deployment Configuration section.

Create the directory structure:

```bash
mkdir -p infra/terraform/environments
cd infra/terraform
```

Create `environments/production.tfvars`:

```hcl
environment        = "production"
aws_region         = "me-central-1"
vpc_cidr           = "10.0.0.0/16"
public_subnets     = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets    = ["10.0.10.0/24", "10.0.11.0/24"]
database_subnets   = ["10.0.20.0/24", "10.0.21.0/24"]
```

Initialize and apply:

```bash
terraform init \
  -backend-config="bucket=zeal-terraform-state" \
  -backend-config="key=zeal/production/vpc/terraform.tfstate" \
  -backend-config="region=me-central-1" \
  -backend-config="dynamodb_table=zeal-terraform-locks"

terraform plan -var-file="environments/production.tfvars" -out=vpc.plan
terraform apply vpc.plan
```

### 3.3 EKS Cluster

The EKS module from [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md) provisions:

- **Main node group:** `m5.xlarge` (4 vCPU, 16 GB), on-demand, min 2 / max 6 / desired 3
- **Spot node group:** `m5.xlarge` + `m5.2xlarge`, spot instances, min 0 / max 4, tainted with `spot=true:NoSchedule`
- Kubernetes version 1.29+
- Cluster endpoint public access disabled in production (private only)
- IRSA (IAM Roles for Service Accounts) enabled

After applying the EKS Terraform:

```bash
# Update kubeconfig
aws eks update-kubeconfig \
  --region me-central-1 \
  --name production-zeal-eks \
  --alias zeal-production

# Verify cluster access
kubectl get nodes
kubectl get ns
kubectl cluster-info
```

Expected output should show 2-3 nodes in `Ready` state.

### 3.4 RDS PostgreSQL

Zeal uses a **single Multi-AZ RDS instance** running PostgreSQL 16, with four logical databases created inside it. The full RDS Terraform module is in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md).

Key configuration values for production:

| Parameter | Value |
|-----------|-------|
| Instance class | `db.r6g.xlarge` (4 vCPU, 32 GB) |
| Storage | 100 GB gp3, auto-scaling to 500 GB |
| Multi-AZ | Enabled |
| Encryption | KMS (aws/rds key) |
| Backup retention | 30 days |
| Performance Insights | Enabled (7-day retention) |
| Deletion protection | Enabled |

**Install pgvector extension:**

After RDS is provisioned, connect and install pgvector:

```bash
# Get the RDS endpoint
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

# Connect via a bastion host or kubectl port-forward
kubectl run pg-client --rm -it --restart=Never \
  --image=postgres:16-alpine \
  --env="PGPASSWORD=${DB_PASSWORD}" \
  -- psql -h ${RDS_ENDPOINT} -U zeal_admin -d postgres
```

Run the database initialization script:

```sql
-- Create the four domain databases
CREATE DATABASE zeal_foundation;
CREATE DATABASE zeal_clinical;
CREATE DATABASE zeal_rcm;
CREATE DATABASE zeal_analytics;

-- Install pgvector in each database
\c zeal_foundation
CREATE EXTENSION IF NOT EXISTS vector;

\c zeal_clinical
CREATE EXTENSION IF NOT EXISTS vector;

\c zeal_rcm
CREATE EXTENSION IF NOT EXISTS vector;

\c zeal_analytics
CREATE EXTENSION IF NOT EXISTS vector;

-- Install uuid-ossp for UUID generation
\c zeal_foundation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c zeal_clinical
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c zeal_rcm
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c zeal_analytics
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Run Prisma migrations:**

```bash
# From your local machine or a CI runner with RDS connectivity
export FOUNDATION_DATABASE_URL="postgresql://zeal_admin:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/zeal_foundation?schema=public"
export CLINICAL_DATABASE_URL="postgresql://zeal_admin:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/zeal_clinical?schema=public"
export RCM_DATABASE_URL="postgresql://zeal_admin:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/zeal_rcm?schema=public"
export ANALYTICS_DATABASE_URL="postgresql://zeal_admin:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/zeal_analytics?schema=public"

cd backend/shared/database-foundation && npx prisma db push
cd ../database-clinical && npx prisma db push
cd ../database-rcm && npx prisma db push
cd ../database-analytics && npx prisma db push
```

### 3.5 ElastiCache Redis

The ElastiCache replication group Terraform is in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md). Key settings for production:

| Parameter | Value |
|-----------|-------|
| Node type | `cache.r6g.large` (2 vCPU, 13 GB) |
| Replicas | 2 (1 primary + 2 read replicas) |
| Multi-AZ | Enabled |
| Auto-failover | Enabled |
| Encryption at rest | Enabled |
| Encryption in transit | Enabled (TLS) |
| AUTH token | Required |
| Engine version | 7.x |

After provisioning, verify connectivity from EKS:

```bash
REDIS_ENDPOINT=$(terraform output -raw redis_primary_endpoint)

kubectl run redis-test --rm -it --restart=Never \
  --image=redis:7-alpine \
  -- redis-cli -h ${REDIS_ENDPOINT} --tls --askpass ping
```

### 3.6 ECR Container Registry

Create a repository for each service:

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=me-central-1

for SERVICE in frontend foundation clinical rcm analytics prm ai-gateway; do
  aws ecr create-repository \
    --repository-name zeal/${SERVICE} \
    --region ${REGION} \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=KMS
done

# Set lifecycle policy to keep only last 20 images
for SERVICE in frontend foundation clinical rcm analytics prm ai-gateway; do
  aws ecr put-lifecycle-policy \
    --repository-name zeal/${SERVICE} \
    --lifecycle-policy-text '{
      "rules": [
        {
          "rulePriority": 1,
          "description": "Keep last 20 images",
          "selection": {
            "tagStatus": "any",
            "countType": "imageCountMoreThan",
            "countNumber": 20
          },
          "action": { "type": "expire" }
        }
      ]
    }'
done
```

### 3.7 S3 and CloudFront

**S3 bucket for documents and static assets:**

```bash
# Document storage bucket (PHI -- restrict access tightly)
aws s3api create-bucket \
  --bucket zeal-documents-production \
  --region me-central-1 \
  --create-bucket-configuration LocationConstraint=me-central-1

aws s3api put-bucket-encryption \
  --bucket zeal-documents-production \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]
  }'

aws s3api put-public-access-block \
  --bucket zeal-documents-production \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Static assets bucket (for frontend if using S3+CloudFront instead of EKS)
aws s3api create-bucket \
  --bucket zeal-static-production \
  --region me-central-1 \
  --create-bucket-configuration LocationConstraint=me-central-1
```

**CloudFront distribution for the frontend:**

If serving the Next.js frontend from S3+CloudFront instead of EKS (suitable for static export):

```bash
aws cloudfront create-distribution \
  --origin-domain-name zeal-static-production.s3.me-central-1.amazonaws.com \
  --default-root-object index.html \
  --query 'Distribution.DomainName' \
  --output text
```

For most deployments, the frontend runs as a container in EKS behind the ALB, so CloudFront is optional and primarily used for caching static assets.

---

## 4. Building and Pushing Container Images

### 4.1 Multi-Stage Dockerfile

Each service uses a multi-stage build pattern with `node:18-alpine`:

```dockerfile
# Example: backend/services/foundation/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY backend/shared ./backend/shared
COPY backend/services/foundation ./backend/services/foundation
RUN npm ci --workspace=@zeal/foundation
RUN npm run build --workspace=@zeal/foundation

FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S zeal && adduser -S zeal -u 1001
COPY --from=builder /app/backend/services/foundation/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER zeal
EXPOSE 3010
CMD ["node", "dist/main.js"]
```

### 4.2 Build and Push All Services

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=me-central-1
REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
TAG=$(git rev-parse --short HEAD)

# Authenticate Docker with ECR
aws ecr get-login-password --region ${REGION} | \
  docker login --username AWS --password-stdin ${REGISTRY}

# Build and push each service
SERVICES=("frontend" "foundation" "clinical" "rcm" "analytics" "prm" "ai-gateway")

for SERVICE in "${SERVICES[@]}"; do
  echo "Building zeal/${SERVICE}:${TAG}..."

  if [ "$SERVICE" = "frontend" ]; then
    docker build -t ${REGISTRY}/zeal/${SERVICE}:${TAG} \
      -f frontend/Dockerfile .
  else
    docker build -t ${REGISTRY}/zeal/${SERVICE}:${TAG} \
      -f backend/services/${SERVICE}/Dockerfile .
  fi

  docker tag ${REGISTRY}/zeal/${SERVICE}:${TAG} ${REGISTRY}/zeal/${SERVICE}:latest
  docker push ${REGISTRY}/zeal/${SERVICE}:${TAG}
  docker push ${REGISTRY}/zeal/${SERVICE}:latest
done
```

### 4.3 Tagging Strategy

| Tag | Purpose |
|-----|---------|
| `<git-sha-short>` | Immutable, tied to a commit |
| `latest` | Rolling tag for most recent build |
| `v1.2.3` | Semantic version for releases |
| `staging` | Latest image deployed to staging |
| `production` | Latest image deployed to production |

---

## 5. Kubernetes Deployment

### 5.1 Namespaces and Resource Quotas

The namespace and quota manifests are in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md).

```bash
kubectl apply -f k8s/namespace.yaml

# Verify
kubectl get namespace zeal
kubectl describe resourcequota zeal-quota -n zeal
```

### 5.2 ConfigMaps

Create environment-specific ConfigMaps. The template is in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md).

```bash
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
REDIS_ENDPOINT=$(terraform output -raw redis_primary_endpoint)

kubectl create configmap zeal-config -n zeal \
  --from-literal=NODE_ENV=production \
  --from-literal=LOG_LEVEL=info \
  --from-literal=FOUNDATION_DATABASE_URL="postgresql://zeal_admin@${RDS_ENDPOINT}:5432/zeal_foundation" \
  --from-literal=CLINICAL_DATABASE_URL="postgresql://zeal_admin@${RDS_ENDPOINT}:5432/zeal_clinical" \
  --from-literal=RCM_DATABASE_URL="postgresql://zeal_admin@${RDS_ENDPOINT}:5432/zeal_rcm" \
  --from-literal=ANALYTICS_DATABASE_URL="postgresql://zeal_admin@${RDS_ENDPOINT}:5432/zeal_analytics" \
  --from-literal=REDIS_URL="rediss://${REDIS_ENDPOINT}:6379" \
  --from-literal=FOUNDATION_SERVICE_URL="http://foundation-service.zeal.svc.cluster.local:3010" \
  --from-literal=CLINICAL_SERVICE_URL="http://clinical-service.zeal.svc.cluster.local:3020" \
  --from-literal=RCM_SERVICE_URL="http://rcm-service.zeal.svc.cluster.local:3030" \
  --from-literal=MONITORING_ENABLED=true \
  --from-literal=TRACING_ENABLED=true \
  --dry-run=client -o yaml | kubectl apply -f -
```

> **Note:** Database passwords are NOT stored in ConfigMaps. They are injected via Secrets (see Section 5.3).

### 5.3 Secrets (External Secrets Operator + AWS Secrets Manager)

Store sensitive values in AWS Secrets Manager:

```bash
# Create secrets in Secrets Manager
aws secretsmanager create-secret \
  --name zeal/production/db-password \
  --secret-string "${DB_PASSWORD}" \
  --region me-central-1

aws secretsmanager create-secret \
  --name zeal/production/redis-auth-token \
  --secret-string "${REDIS_AUTH_TOKEN}" \
  --region me-central-1

aws secretsmanager create-secret \
  --name zeal/production/jwt-secret \
  --secret-string "${JWT_SECRET}" \
  --region me-central-1

aws secretsmanager create-secret \
  --name zeal/production/encryption-key \
  --secret-string "${ENCRYPTION_KEY}" \
  --region me-central-1
```

Install External Secrets Operator:

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm repo update

helm install external-secrets external-secrets/external-secrets \
  --namespace external-secrets \
  --create-namespace \
  --set installCRDs=true \
  --wait
```

Create a `SecretStore` and `ExternalSecret`:

```yaml
# k8s/external-secret-store.yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: zeal
spec:
  provider:
    aws:
      service: SecretsManager
      region: me-central-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
---
# k8s/external-secrets.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: zeal-secrets
  namespace: zeal
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: zeal-secrets
    creationPolicy: Owner
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: zeal/production/db-password
    - secretKey: REDIS_AUTH_TOKEN
      remoteRef:
        key: zeal/production/redis-auth-token
    - secretKey: JWT_SECRET
      remoteRef:
        key: zeal/production/jwt-secret
    - secretKey: ENCRYPTION_KEY
      remoteRef:
        key: zeal/production/encryption-key
```

```bash
kubectl apply -f k8s/external-secret-store.yaml
kubectl apply -f k8s/external-secrets.yaml

# Verify secrets synced
kubectl get externalsecret zeal-secrets -n zeal
kubectl get secret zeal-secrets -n zeal
```

### 5.4 Deployments for Each Service

Below is the deployment pattern for each backend service. Repeat for all services, adjusting name, image, port, and resource limits. The generic deployment template is in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md).

```yaml
# k8s/deployments/foundation.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: foundation
  namespace: zeal
  labels:
    app: foundation
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: foundation
  template:
    metadata:
      labels:
        app: foundation
        tier: backend
    spec:
      serviceAccountName: zeal-backend
      containers:
        - name: foundation
          image: <ACCOUNT_ID>.dkr.ecr.me-central-1.amazonaws.com/zeal/foundation:<TAG>
          ports:
            - containerPort: 3010
          envFrom:
            - configMapRef:
                name: zeal-config
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: zeal-secrets
                  key: DB_PASSWORD
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: zeal-secrets
                  key: JWT_SECRET
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: 500m
              memory: 1Gi
          livenessProbe:
            httpGet:
              path: /health
              port: 3010
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3010
            initialDelaySeconds: 5
            periodSeconds: 5
          securityContext:
            runAsNonRoot: true
            runAsUser: 1001
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
      nodeSelector:
        nodegroup: main
```

Deploy all services:

```bash
kubectl apply -f k8s/deployments/foundation.yaml
kubectl apply -f k8s/deployments/clinical.yaml
kubectl apply -f k8s/deployments/rcm.yaml
kubectl apply -f k8s/deployments/analytics.yaml
kubectl apply -f k8s/deployments/prm.yaml
kubectl apply -f k8s/deployments/ai-gateway.yaml
kubectl apply -f k8s/deployments/frontend.yaml

# Verify all pods are running
kubectl get pods -n zeal -o wide
```

### 5.5 Services and Ingress (ALB Ingress Controller)

Install the AWS Load Balancer Controller:

```bash
# Install via Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  --namespace kube-system \
  --set clusterName=production-zeal-eks \
  --set serviceAccount.create=true \
  --set serviceAccount.name=aws-load-balancer-controller
```

Create ClusterIP services for each backend:

```bash
for svc_name in foundation:3010 clinical:3020 rcm:3030 analytics:3040 prm:3013 ai-gateway:3015 frontend:3000; do
  NAME=$(echo $svc_name | cut -d: -f1)
  PORT=$(echo $svc_name | cut -d: -f2)

  kubectl create service clusterip ${NAME}-service -n zeal \
    --tcp=80:${PORT} \
    --dry-run=client -o yaml | \
    kubectl label --local -f - app=${NAME} -o yaml | \
    kubectl apply -f -
done
```

Create the ALB Ingress:

```yaml
# k8s/ingress-alb.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zeal-alb-ingress
  namespace: zeal
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: <ACM_CERTIFICATE_ARN>
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/ssl-redirect: "443"
    alb.ingress.kubernetes.io/healthcheck-path: /health
    alb.ingress.kubernetes.io/group.name: zeal
spec:
  rules:
    - host: api.zeal.health
      http:
        paths:
          - path: /api/v1/foundation
            pathType: Prefix
            backend:
              service:
                name: foundation-service
                port:
                  number: 80
          - path: /api/v1/clinical
            pathType: Prefix
            backend:
              service:
                name: clinical-service
                port:
                  number: 80
          - path: /api/v1/rcm
            pathType: Prefix
            backend:
              service:
                name: rcm-service
                port:
                  number: 80
          - path: /api/v1/analytics
            pathType: Prefix
            backend:
              service:
                name: analytics-service
                port:
                  number: 80
    - host: app.zeal.health
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
```

```bash
kubectl apply -f k8s/ingress-alb.yaml

# Verify ALB is provisioned
kubectl get ingress zeal-alb-ingress -n zeal
```

### 5.6 HPA and Pod Disruption Budgets

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: foundation-hpa
  namespace: zeal
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: foundation
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
---
# k8s/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: foundation-pdb
  namespace: zeal
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: foundation
```

Repeat the HPA and PDB for each service (clinical, rcm, analytics, frontend). Apply:

```bash
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/pdb.yaml
```

---

## 6. Helm Chart Deployment

The Helm chart structure is defined in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md). This section covers using it for environment-specific deployments.

### 6.1 Environment-Specific Values

Create `values-production.yaml`:

```yaml
# helm/zeal/values-production.yaml
global:
  imageRegistry: "<ACCOUNT_ID>.dkr.ecr.me-central-1.amazonaws.com"
  environment: production

replicaCount: 3

image:
  tag: "<RELEASE_TAG>"
  pullPolicy: IfNotPresent

ingress:
  enabled: true
  className: alb
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/certificate-arn: "<ACM_CERT_ARN>"
  hosts:
    - host: api.zeal.health
      paths:
        - path: /
          pathType: Prefix

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

podDisruptionBudget:
  enabled: true
  minAvailable: 2

resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 2Gi
```

### 6.2 Deploy with Helm

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
TAG=$(git rev-parse --short HEAD)

helm upgrade --install zeal ./helm/zeal \
  --namespace zeal \
  --create-namespace \
  --values ./helm/zeal/values-production.yaml \
  --set image.tag=${TAG} \
  --set global.imageRegistry="${ACCOUNT_ID}.dkr.ecr.me-central-1.amazonaws.com" \
  --wait \
  --timeout 10m

# Verify
helm list -n zeal
helm status zeal -n zeal
kubectl get pods -n zeal
```

### 6.3 Rollback

```bash
# List release history
helm history zeal -n zeal

# Rollback to previous release
helm rollback zeal 1 -n zeal --wait
```

---

## 7. Networking and SSL/TLS

### 7.1 ACM Certificates

```bash
# Request a public certificate
aws acm request-certificate \
  --domain-name "*.zeal.health" \
  --subject-alternative-names "zeal.health" \
  --validation-method DNS \
  --region me-central-1

# Get the certificate ARN
ACM_ARN=$(aws acm list-certificates --region me-central-1 \
  --query "CertificateSummaryList[?DomainName=='*.zeal.health'].CertificateArn" \
  --output text)

echo "Certificate ARN: ${ACM_ARN}"
```

Complete DNS validation by adding the CNAME records provided by ACM to your Route 53 hosted zone.

### 7.2 Route 53 DNS

```bash
# Create a hosted zone (if not already present)
aws route53 create-hosted-zone \
  --name zeal.health \
  --caller-reference "zeal-$(date +%s)"

# Get the ALB DNS name
ALB_DNS=$(kubectl get ingress zeal-alb-ingress -n zeal \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Create alias records for api.zeal.health and app.zeal.health
# Use the Route 53 console or the following CLI approach:
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name zeal.health \
  --query "HostedZones[0].Id" --output text | sed 's|/hostedzone/||')

ALB_HOSTED_ZONE_ID=$(aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?DNSName=='${ALB_DNS}'].CanonicalHostedZoneId" \
  --output text)

aws route53 change-resource-record-sets \
  --hosted-zone-id ${HOSTED_ZONE_ID} \
  --change-batch '{
    "Changes": [
      {
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "api.zeal.health",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "'"${ALB_HOSTED_ZONE_ID}"'",
            "DNSName": "'"${ALB_DNS}"'",
            "EvaluateTargetHealth": true
          }
        }
      },
      {
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "app.zeal.health",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "'"${ALB_HOSTED_ZONE_ID}"'",
            "DNSName": "'"${ALB_DNS}"'",
            "EvaluateTargetHealth": true
          }
        }
      }
    ]
  }'
```

### 7.3 Internal TLS with cert-manager

For service-to-service mTLS within the cluster:

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true \
  --wait
```

---

## 8. Secrets Management

### 8.1 AWS Secrets Manager

All sensitive values are stored in AWS Secrets Manager under the `zeal/production/` prefix:

| Secret Path | Contents |
|-------------|----------|
| `zeal/production/db-password` | RDS master password |
| `zeal/production/redis-auth-token` | ElastiCache AUTH token |
| `zeal/production/jwt-secret` | JWT signing secret |
| `zeal/production/encryption-key` | Field-level encryption key |
| `zeal/production/dha-client-cert` | DHA integration certificate |
| `zeal/production/doh-client-credentials` | DOH client ID and secret |

### 8.2 KMS Envelope Encryption

Create a customer-managed KMS key for encrypting secrets:

```bash
KMS_KEY_ID=$(aws kms create-key \
  --description "Zeal production encryption key" \
  --key-usage ENCRYPT_DECRYPT \
  --region me-central-1 \
  --query 'KeyMetadata.KeyId' --output text)

aws kms create-alias \
  --alias-name alias/zeal-production \
  --target-key-id ${KMS_KEY_ID}

echo "KMS Key ID: ${KMS_KEY_ID}"
```

Reference this key in RDS, S3, and Secrets Manager configurations.

### 8.3 Secret Rotation

Enable automatic rotation for the database password:

```bash
aws secretsmanager rotate-secret \
  --secret-id zeal/production/db-password \
  --rotation-lambda-arn <ROTATION_LAMBDA_ARN> \
  --rotation-rules AutomaticallyAfterDays=90
```

---

## 9. CI/CD Pipeline

The full GitHub Actions workflow for AWS is defined in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md). Below is a summary of the pipeline stages and required GitHub Secrets.

### 9.1 Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key for CI/CD |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `AWS_REGION` | `me-central-1` |
| `EKS_CLUSTER_NAME` | `production-zeal-eks` |
| `ECR_REGISTRY` | `<ACCOUNT_ID>.dkr.ecr.me-central-1.amazonaws.com` |

### 9.2 Pipeline Stages

```
push to main
  |
  v
[Test] --> lint, unit tests, security audit
  |
  v
[Build] --> Docker build for each service, push to ECR
  |
  v
[Deploy Staging] --> helm upgrade --install to staging namespace
  |
  v
[Smoke Tests] --> health checks, basic API validation
  |
  v
[Deploy Production] --> manual approval gate, then helm upgrade
  |
  v
[Post-Deploy Verification] --> readiness checks, smoke tests
```

### 9.3 Staging Pipeline

Add a staging job that deploys to a `zeal-staging` namespace:

```yaml
deploy-staging:
  needs: build
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/develop'
  environment: staging
  steps:
    - uses: actions/checkout@v4
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: me-central-1
    - name: Update kubeconfig
      run: aws eks update-kubeconfig --region me-central-1 --name production-zeal-eks
    - name: Deploy to staging
      run: |
        helm upgrade --install zeal-staging ./helm/zeal \
          --namespace zeal-staging \
          --create-namespace \
          --values ./helm/zeal/values-staging.yaml \
          --set image.tag=${{ github.sha }} \
          --wait --timeout 10m
    - name: Smoke test
      run: |
        kubectl wait --for=condition=ready pod -l app=foundation -n zeal-staging --timeout=300s
        kubectl run smoke-test --rm -i --restart=Never -n zeal-staging \
          --image=curlimages/curl -- \
          curl -sf http://foundation-service.zeal-staging.svc.cluster.local:3010/health
```

### 9.4 Production Pipeline

The production deploy job in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md) uses `github.ref == 'refs/heads/main'` as the trigger and includes smoke tests post-deploy.

---

## 10. Observability

### 10.1 Option A: CloudWatch Container Insights

The simplest approach -- uses AWS-managed services only.

```bash
# Enable Container Insights on the EKS cluster
aws eks update-cluster-config \
  --name production-zeal-eks \
  --region me-central-1 \
  --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}'

# Install CloudWatch agent as DaemonSet
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonSet/container-insights-monitoring/quickstart/cwagent-fluentd-quickstart.yaml
```

### 10.2 Option B: Self-Hosted OTel Stack on EKS

For teams that prefer the full OTel + Prometheus + Grafana + Loki + Tempo stack (matching the local docker-compose observability setup):

```bash
# Install Prometheus + Grafana via kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword="<GRAFANA_PASSWORD>" \
  --set prometheus.prometheusSpec.retention=30d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi

# Install Loki for log aggregation
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=50Gi

# Install Tempo for distributed tracing
helm install tempo grafana/tempo \
  --namespace monitoring \
  --set tempo.persistence.enabled=true

# Install OpenTelemetry Collector
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm install otel-collector open-telemetry/opentelemetry-collector \
  --namespace monitoring \
  --set mode=deployment
```

### 10.3 CloudWatch Alarms

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "zeal-high-error-rate" \
  --namespace "Zeal/Platform" \
  --metric-name "ErrorRate" \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions "<SNS_TOPIC_ARN>" \
  --region me-central-1

# High response time alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "zeal-high-latency" \
  --namespace "Zeal/Platform" \
  --metric-name "ResponseTime" \
  --statistic p99 \
  --period 300 \
  --threshold 2000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions "<SNS_TOPIC_ARN>" \
  --region me-central-1

# RDS CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "zeal-rds-cpu" \
  --namespace "AWS/RDS" \
  --metric-name "CPUUtilization" \
  --dimensions Name=DBInstanceIdentifier,Value=production-zeal-postgres \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 3 \
  --alarm-actions "<SNS_TOPIC_ARN>" \
  --region me-central-1
```

### 10.4 Log Retention

```bash
# Set CloudWatch log group retention to 90 days
for LOG_GROUP in /aws/eks/production-zeal-eks/cluster zeal/production/application; do
  aws logs put-retention-policy \
    --log-group-name "${LOG_GROUP}" \
    --retention-in-days 90 \
    --region me-central-1
done
```

---

## 11. Healthcare Compliance

### 11.1 UAE Data Residency

All AWS resources must be created in **me-central-1** (UAE Central). Verify no resources exist in other regions:

```bash
# Check that RDS is in me-central-1
aws rds describe-db-instances --region me-central-1 \
  --query "DBInstances[?DBInstanceIdentifier=='production-zeal-postgres'].AvailabilityZone"

# Verify S3 bucket location
aws s3api get-bucket-location --bucket zeal-documents-production
```

### 11.2 Encryption at Rest

| Resource | Encryption Method |
|----------|-------------------|
| RDS PostgreSQL | KMS (customer-managed key) |
| ElastiCache Redis | KMS (at-rest encryption enabled) |
| S3 buckets | SSE-KMS |
| EBS volumes (EKS nodes) | KMS (gp3 encrypted) |
| Secrets Manager | KMS (automatic) |
| Terraform state (S3) | SSE-KMS |

### 11.3 Encryption in Transit

| Path | Encryption |
|------|-----------|
| Client to ALB | TLS 1.2+ (ACM certificate) |
| ALB to EKS pods | TLS (cert-manager) |
| EKS to RDS | TLS (rds-ca-2019 certificate) |
| EKS to ElastiCache | TLS (transit encryption enabled) |
| Cross-service (in-cluster) | Optional mTLS via cert-manager |

### 11.4 Audit Trail

```bash
# Enable CloudTrail for API auditing
aws cloudtrail create-trail \
  --name zeal-audit-trail \
  --s3-bucket-name zeal-cloudtrail-logs \
  --is-multi-region-trail \
  --enable-log-file-validation \
  --region me-central-1

aws cloudtrail start-logging --name zeal-audit-trail

# Enable VPC Flow Logs
VPC_ID=$(terraform output -raw vpc_id)
aws ec2 create-flow-logs \
  --resource-ids ${VPC_ID} \
  --resource-type VPC \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name "/aws/vpc/flowlogs/zeal-production" \
  --deliver-logs-permission-arn "<FLOW_LOG_ROLE_ARN>" \
  --region me-central-1
```

### 11.5 PHI Isolation

- Clinical and RCM databases contain PHI. Access is restricted to the private subnet security group.
- The Foundation database does not contain PHI but is still encrypted.
- S3 document buckets with PHI have bucket policies denying access from outside the VPC.

---

## 12. Scaling and High Availability

### 12.1 Cluster Autoscaler

```bash
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm install cluster-autoscaler autoscaler/cluster-autoscaler \
  --namespace kube-system \
  --set autoDiscovery.clusterName=production-zeal-eks \
  --set awsRegion=me-central-1 \
  --set extraArgs.balance-similar-node-groups=true \
  --set extraArgs.skip-nodes-with-system-pods=true
```

Alternatively, use **Karpenter** for faster, more cost-effective scaling:

```bash
helm repo add karpenter https://charts.karpenter.sh
helm install karpenter karpenter/karpenter \
  --namespace karpenter \
  --create-namespace \
  --set clusterName=production-zeal-eks \
  --set clusterEndpoint=$(aws eks describe-cluster --name production-zeal-eks --query "cluster.endpoint" --output text) \
  --wait
```

### 12.2 HPA Targets

| Service | Min Replicas | Max Replicas | CPU Target | Memory Target |
|---------|-------------|-------------|-----------|--------------|
| Foundation | 2 | 8 | 70% | 80% |
| Clinical | 2 | 10 | 70% | 80% |
| RCM | 2 | 6 | 70% | 80% |
| Analytics | 1 | 4 | 70% | 80% |
| Frontend | 2 | 8 | 70% | 80% |
| AI Gateway | 1 | 4 | 60% | 70% |

### 12.3 Database and Cache HA

- **RDS Multi-AZ:** Automatic failover to standby in a different AZ. Failover typically completes in 60-120 seconds.
- **ElastiCache Multi-AZ:** Automatic failover to a read replica. Failover takes 30-60 seconds.
- **ALB:** Distributes traffic across multiple AZs by default.

---

## 13. Disaster Recovery

### 13.1 Recovery Objectives

| Metric | Target |
|--------|--------|
| RPO (Recovery Point Objective) | <= 15 minutes |
| RTO (Recovery Time Objective) | <= 1 hour |

### 13.2 Cross-Region RDS Read Replica

```bash
# Create a cross-region read replica in me-south-1 (Bahrain)
aws rds create-db-instance-read-replica \
  --db-instance-identifier zeal-dr-replica \
  --source-db-instance-identifier production-zeal-postgres \
  --source-region me-central-1 \
  --region me-south-1 \
  --db-instance-class db.r6g.large \
  --storage-encrypted \
  --kms-key-id alias/zeal-dr
```

### 13.3 S3 Cross-Region Replication

```bash
# Enable replication from me-central-1 to me-south-1
aws s3api put-bucket-replication \
  --bucket zeal-documents-production \
  --replication-configuration '{
    "Role": "<REPLICATION_ROLE_ARN>",
    "Rules": [{
      "ID": "DR-replication",
      "Status": "Enabled",
      "Destination": {
        "Bucket": "arn:aws:s3:::zeal-documents-dr",
        "StorageClass": "STANDARD_IA",
        "EncryptionConfiguration": {
          "ReplicaKmsKeyID": "alias/zeal-dr"
        }
      }
    }]
  }'
```

### 13.4 Backup Scripts

The automated backup and restore scripts are defined in [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md) under the Backup and Recovery section. Key schedule:

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| RDS automated snapshots | Continuous (point-in-time) | 30 days |
| RDS manual snapshots | Weekly | 90 days |
| Redis snapshots | Daily | 7 days |
| S3 versioning | On every write | 90 days |
| EKS etcd backup | Managed by AWS | N/A |

### 13.5 DR Failover Procedure

1. Promote the RDS read replica in me-south-1 to a standalone instance.
2. Deploy EKS cluster in me-south-1 using Terraform with DR tfvars.
3. Update Route 53 records to point to the DR ALB.
4. Deploy application via Helm using the DR values file.
5. Verify all health checks pass.

```bash
# Step 1: Promote DR replica
aws rds promote-read-replica \
  --db-instance-identifier zeal-dr-replica \
  --region me-south-1

# Step 3: Update DNS (failover routing)
aws route53 change-resource-record-sets \
  --hosted-zone-id ${HOSTED_ZONE_ID} \
  --change-batch file://dr-dns-failover.json
```

---

## 14. Cost Estimation

Monthly cost estimates in USD (as of 2026, me-central-1 pricing includes regional premium):

| Component | Small Clinic (1-5 providers) | Medium Practice (5-20 providers) | Large Hospital (20+ providers) |
|-----------|------------------------------|----------------------------------|-------------------------------|
| **EKS Cluster** | $73 | $73 | $73 |
| **EKS Nodes** (m5.xlarge) | $280 (2 nodes) | $560 (4 nodes) | $1,120 (8 nodes) |
| **RDS** (db.r6g.large/xlarge/2xlarge) | $350 | $700 | $1,400 |
| **ElastiCache** (cache.r6g.large) | $230 | $230 | $460 |
| **S3** (storage + requests) | $10 | $30 | $100 |
| **CloudFront** | $10 | $25 | $80 |
| **ALB** | $25 | $25 | $50 |
| **Data Transfer** | $20 | $60 | $200 |
| **Secrets Manager** | $5 | $5 | $10 |
| **CloudWatch** | $30 | $60 | $120 |
| **Route 53** | $2 | $2 | $2 |
| **Total (On-Demand)** | **~$1,035/mo** | **~$1,770/mo** | **~$3,615/mo** |

### Cost Optimization Strategies

**Reserved Instances / Savings Plans:**
- 1-year RI for RDS: ~30% savings
- 3-year RI for RDS: ~50% savings
- Compute Savings Plans for EKS nodes: ~30% savings on 1-year commitment
- Expected production savings: 25-40% off on-demand pricing

**Spot Instances:**
- Use the spot node group for non-critical workloads (analytics, AI gateway, batch jobs)
- Spot pricing is typically 60-70% below on-demand
- Only schedule workloads tolerant of interruption on spot nodes

**Right-sizing:**
- Start with smaller instance types and scale up based on actual usage
- Use CloudWatch metrics to identify over-provisioned resources
- Review monthly with AWS Cost Explorer

---

## 15. Troubleshooting

### 15.1 EKS Pod Issues

**ImagePullBackOff:**

```bash
# Check events
kubectl describe pod <POD_NAME> -n zeal | grep -A5 Events

# Common causes:
# 1. ECR authentication expired
aws ecr get-login-password --region me-central-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.me-central-1.amazonaws.com

# 2. Image does not exist
aws ecr describe-images --repository-name zeal/foundation --region me-central-1

# 3. Missing imagePullSecret -- create one
kubectl create secret docker-registry ecr-secret -n zeal \
  --docker-server=<ACCOUNT_ID>.dkr.ecr.me-central-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region me-central-1)
```

**CrashLoopBackOff:**

```bash
# Check logs for the crashing container
kubectl logs <POD_NAME> -n zeal --previous

# Common causes:
# 1. Missing environment variables -- check ConfigMap and Secrets
kubectl get configmap zeal-config -n zeal -o yaml
kubectl get secret zeal-secrets -n zeal -o yaml

# 2. Database not reachable -- test from a debug pod
kubectl run debug --rm -it --restart=Never -n zeal \
  --image=postgres:16-alpine \
  --env="PGPASSWORD=${DB_PASSWORD}" \
  -- psql -h <RDS_ENDPOINT> -U zeal_admin -d zeal_foundation -c "SELECT 1;"

# 3. Prisma client not generated -- rebuild the image
```

**OOMKilled:**

```bash
# Check which container was killed
kubectl describe pod <POD_NAME> -n zeal | grep -A2 "Last State"

# Increase memory limits
kubectl patch deployment foundation -n zeal -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"foundation","resources":{"limits":{"memory":"2Gi"}}}]}}}}'
```

### 15.2 RDS Connectivity from EKS

```bash
# Verify security group allows traffic from EKS nodes
EKS_SG=$(aws eks describe-cluster --name production-zeal-eks \
  --query "cluster.resourcesVpcConfig.clusterSecurityGroupId" --output text)

RDS_SG=$(aws rds describe-db-instances \
  --db-instance-identifier production-zeal-postgres \
  --query "DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId" --output text)

# Check that EKS SG is allowed in RDS SG inbound rules
aws ec2 describe-security-groups --group-ids ${RDS_SG} \
  --query "SecurityGroups[0].IpPermissions"

# If missing, add the rule
aws ec2 authorize-security-group-ingress \
  --group-id ${RDS_SG} \
  --protocol tcp \
  --port 5432 \
  --source-group ${EKS_SG}
```

### 15.3 ElastiCache AUTH Failures

```bash
# Verify AUTH token matches
kubectl exec -it debug-pod -n zeal -- \
  redis-cli -h <REDIS_ENDPOINT> -p 6379 --tls -a <AUTH_TOKEN> PING

# Common issues:
# 1. AUTH token mismatch -- check Secrets Manager value matches the token set on the replication group
# 2. TLS not enabled in client -- ensure REDIS_URL uses rediss:// (double s)
# 3. Security group blocking port 6379
```

### 15.4 ALB Health Check Failures

```bash
# Check target group health
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?contains(LoadBalancerName, 'zeal')].LoadBalancerArn" --output text)

TG_ARNS=$(aws elbv2 describe-target-groups \
  --load-balancer-arn ${ALB_ARN} \
  --query "TargetGroups[*].TargetGroupArn" --output text)

for TG in ${TG_ARNS}; do
  echo "Target group: ${TG}"
  aws elbv2 describe-target-health --target-group-arn ${TG}
done

# Common causes:
# 1. Health check path mismatch -- ensure /health endpoint returns 200
# 2. Container port mismatch -- verify targetPort in Service matches container port
# 3. Security group not allowing ALB to reach pods
```

### 15.5 Prisma Migration Issues

```bash
# If Prisma db push fails, check the connection from a temporary pod
kubectl run prisma-debug --rm -it --restart=Never -n zeal \
  --image=node:18-alpine -- sh

# Inside the pod:
npx prisma db push --schema=/path/to/schema.prisma

# Common errors:
# "P1001: Can't reach database server" -- security group or DNS issue
# "P3009: migrate found failed migrations" -- reset with caution:
#   npx prisma migrate resolve --rolled-back <migration_name>
```

### 15.6 Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `error: You must be logged in to the server` | kubeconfig expired | `aws eks update-kubeconfig --name production-zeal-eks` |
| `Error: INSTALLATION FAILED: timed out` | Pods not reaching Ready | Check pod logs and events |
| `CreateContainerConfigError` | Missing ConfigMap or Secret | Verify all referenced ConfigMaps/Secrets exist |
| `Insufficient cpu/memory` | Node group at capacity | Scale up nodes or add node group |
| `connection refused` to RDS | Security group misconfigured | Add EKS SG to RDS inbound rules |
| `ECONNREFUSED 127.0.0.1:6379` | Redis URL not set or wrong | Check `REDIS_URL` in ConfigMap uses the ElastiCache endpoint |
| `TLS handshake error` to Redis | Missing `rediss://` scheme | Use `rediss://` (with double s) for TLS connections |
