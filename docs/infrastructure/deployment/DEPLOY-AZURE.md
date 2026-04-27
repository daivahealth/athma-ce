# Deploying athma-ce on Azure

## 1. Overview

Azure serves as the recommended DR/secondary cloud for athma-ce (per ADR-0008) and can also act as the primary cloud for customers who prefer or require Microsoft Azure. The UAE North (`uaenorth`) and UAE Central (`uaecentral`) regions provide data residency compliance for UAE healthcare regulations (DHA, DOH, MOHAP).

### Target Architecture

```
                         Internet
                            |
                    Azure Front Door (WAF + CDN)
                            |
                  Application Gateway (SSL termination)
                            |
                  +---------+---------+
                  |    AKS Cluster    |
                  |                   |
                  |  +-- frontend --+ |
                  |  |   (Next.js)  | |
                  |  +--------------+ |
                  |                   |
                  |  +-- backend ---+ |       +-- Azure DB for PostgreSQL --+
                  |  | foundation   |----+--->|  zeal_foundation            |
                  |  | clinical     |    |    |  zeal_clinical              |
                  |  | rcm          |    |    |  zeal_rcm                  |
                  |  | analytics    |    |    |  zeal_analytics            |
                  |  | prm          |    |    +-----------------------------+
                  |  | ai-gateway   |    |
                  |  +--------------+    |    +-- Azure Cache for Redis ---+
                  |                      +--->|  Sessions + Cache          |
                  |  +-- observ. ---+         +-----------------------------+
                  |  | otel-coll.   |
                  |  | prometheus   |         +-- Azure Blob Storage ------+
                  |  | loki / tempo |         |  Documents + Files         |
                  |  | grafana      |         +-----------------------------+
                  |  +--------------+
                  +-------------------+
                            |
                     Azure Key Vault
```

### Services and Ports

| Service       | Internal Port | Description                        |
|---------------|---------------|------------------------------------|
| frontend      | 3000          | Next.js 14 application             |
| foundation    | 3010          | Tenancy, identity, RBAC            |
| clinical      | 3020          | Patient, appointments, encounters  |
| rcm           | 3030          | Billing, claims, payments          |
| analytics     | 3040          | Audit logs, reporting              |
| prm           | 3013          | Patient Relationship Management    |
| ai-gateway    | 3015          | AI service gateway                 |

---

## 2. Prerequisites

### Required Tools

```bash
# Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az version  # >= 2.50

# Terraform
# https://developer.hashicorp.com/terraform/downloads
terraform version  # >= 1.0

# kubectl
az aks install-cli
kubectl version --client

# Helm 3
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version  # >= 3.12

# Docker
docker --version  # >= 24.0
```

### Azure Account Setup

```bash
# Login
az login

# Set subscription
az account set --subscription "<SUBSCRIPTION_ID>"

# Verify UAE region access
az account list-locations --query "[?name=='uaenorth' || name=='uaecentral']" -o table
```

### Service Principal (for CI/CD)

```bash
az ad sp create-for-rbac \
  --name "zeal-deployer" \
  --role Contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID> \
  --sdk-auth

# Save the JSON output as AZURE_CREDENTIALS in GitHub Secrets.
# For production, use a custom role with least-privilege instead of Contributor.
```

### Required Resource Providers

```bash
az provider register --namespace Microsoft.ContainerService
az provider register --namespace Microsoft.DBforPostgreSQL
az provider register --namespace Microsoft.Cache
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.ContainerRegistry
az provider register --namespace Microsoft.Network
az provider register --namespace Microsoft.Storage
az provider register --namespace Microsoft.OperationalInsights
```

---

## 3. Infrastructure Provisioning

> For detailed Terraform module code (AKS, Azure DB for PostgreSQL, Azure Cache for Redis, networking), see [`../10-Deployment-&-Ops.md`](../10-Deployment-&-Ops.md). This section provides the commands to run those modules and covers resources not in that document.

### 3.1 Terraform State Backend

Create a storage account to hold remote Terraform state before running any other Terraform commands.

```bash
RESOURCE_GROUP="zeal-terraform-state"
STORAGE_ACCOUNT="zealterraformstate"
CONTAINER="tfstate"
LOCATION="uaenorth"

az group create --name $RESOURCE_GROUP --location $LOCATION

az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --encryption-services blob \
  --min-tls-version TLS1_2

az storage container create \
  --name $CONTAINER \
  --account-name $STORAGE_ACCOUNT

# Enable versioning for state recovery
az storage account blob-service-properties update \
  --account-name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --enable-versioning true
```

The Terraform backend block referencing this storage account is documented in `../10-Deployment-&-Ops.md` (Azure Deployment Configuration section).

### 3.2 Resource Group and VNet

```bash
# Create the main resource group
ENVIRONMENT="production"
RG_NAME="zeal-${ENVIRONMENT}-rg"
LOCATION="uaenorth"

az group create --name $RG_NAME --location $LOCATION --tags \
  Project=athma-ce Environment=$ENVIRONMENT ManagedBy=terraform
```

#### VNet Terraform (terraform/modules/vnet/main.tf)

```hcl
resource "azurerm_virtual_network" "main" {
  name                = "${var.environment}-zeal-vnet"
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = ["10.1.0.0/16"]

  tags = {
    Environment = var.environment
    Project     = "athma-ce"
  }
}

resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.0.0/20"]
}

resource "azurerm_subnet" "database" {
  name                 = "database-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.16.0/24"]

  delegation {
    name = "postgresql"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_subnet" "redis" {
  name                 = "redis-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.17.0/24"]
}

resource "azurerm_subnet" "appgw" {
  name                 = "appgw-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.18.0/24"]
}

# NAT Gateway for outbound traffic from AKS
resource "azurerm_nat_gateway" "main" {
  name                = "${var.environment}-zeal-natgw"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku_name            = "Standard"
}

resource "azurerm_public_ip" "natgw" {
  name                = "${var.environment}-zeal-natgw-pip"
  resource_group_name = var.resource_group_name
  location            = var.location
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_nat_gateway_public_ip_association" "main" {
  nat_gateway_id       = azurerm_nat_gateway.main.id
  public_ip_address_id = azurerm_public_ip.natgw.id
}

resource "azurerm_subnet_nat_gateway_association" "aks" {
  subnet_id      = azurerm_subnet.aks.id
  nat_gateway_id = azurerm_nat_gateway.main.id
}
```

#### Network Security Groups

```hcl
resource "azurerm_network_security_group" "database" {
  name                = "${var.environment}-zeal-db-nsg"
  resource_group_name = var.resource_group_name
  location            = var.location

  security_rule {
    name                       = "AllowAKSToPostgreSQL"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = "10.1.0.0/20"
    destination_address_prefix = "10.1.16.0/24"
  }

  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "database" {
  subnet_id                 = azurerm_subnet.database.id
  network_security_group_id = azurerm_network_security_group.database.id
}
```

### 3.3 AKS Cluster

The full AKS Terraform module is in `../10-Deployment-&-Ops.md` (Azure AKS Cluster Configuration). Key parameters:

| Parameter                  | Dev/Staging          | Production               |
|----------------------------|----------------------|--------------------------|
| VM Size (main pool)        | Standard_D2s_v3      | Standard_D4s_v3          |
| Main pool min/max          | 2 / 4                | 3 / 10                   |
| Spot pool max              | 2                    | 6                        |
| Private cluster            | false                | true                     |
| Network plugin             | azure                | azure                    |
| Network policy             | azure                | azure                    |
| Availability zones         | none                 | [1, 2, 3]                |

```bash
# After terraform apply, get credentials
az aks get-credentials \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --name ${ENVIRONMENT}-zeal-aks

# Verify connectivity
kubectl get nodes
kubectl cluster-info
```

### 3.4 Azure DB for PostgreSQL Flexible Server

The full Terraform module is in `../10-Deployment-&-Ops.md` (Azure Database for PostgreSQL Configuration). After provisioning the server, create all four domain databases and enable pgvector.

```bash
PG_SERVER="${ENVIRONMENT}-zeal-postgres"
PG_RG="zeal-${ENVIRONMENT}-rg"

# Create the four domain databases
for DB in zeal_foundation zeal_clinical zeal_rcm zeal_analytics; do
  az postgres flexible-server db create \
    --resource-group $PG_RG \
    --server-name $PG_SERVER \
    --database-name $DB \
    --charset utf8 \
    --collation en_US.utf8
done

# Enable pgvector extension (allowlist first, then create)
az postgres flexible-server parameter set \
  --resource-group $PG_RG \
  --server-name $PG_SERVER \
  --name azure.extensions \
  --value "VECTOR,UUID-OSSP,PG_TRGM"

# Connect and create extensions in each database
for DB in zeal_foundation zeal_clinical zeal_rcm zeal_analytics; do
  psql "host=${PG_SERVER}.postgres.database.azure.com port=5432 \
    dbname=${DB} user=zeal_admin sslmode=require" \
    -c "CREATE EXTENSION IF NOT EXISTS vector;"
  psql "host=${PG_SERVER}.postgres.database.azure.com port=5432 \
    dbname=${DB} user=zeal_admin sslmode=require" \
    -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
done
```

#### Production Settings

| Setting                       | Value                  |
|-------------------------------|------------------------|
| SKU                           | GP_Standard_D4s_v3     |
| Storage                       | 256 GB (auto-grow)     |
| Backup retention              | 35 days                |
| Geo-redundant backup          | Enabled                |
| HA mode                       | ZoneRedundant          |
| TLS                           | 1.2 minimum            |
| Private networking            | VNet integrated        |

### 3.5 Azure Cache for Redis

The full Terraform module is in `../10-Deployment-&-Ops.md` (Azure Cache for Redis Configuration).

```bash
# Verify deployment
az redis show \
  --name ${ENVIRONMENT}-zeal-redis \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query "{name:name, hostName:hostName, port:sslPort, sku:sku.name}" \
  -o table

# Get connection string (access key)
az redis list-keys \
  --name ${ENVIRONMENT}-zeal-redis \
  --resource-group zeal-${ENVIRONMENT}-rg
```

| Setting           | Dev/Staging   | Production       |
|-------------------|---------------|------------------|
| SKU               | Standard C1   | Premium P1       |
| TLS-only          | Yes           | Yes              |
| Availability zones| No            | Yes              |
| VNet integration  | No            | Yes              |
| Maxmemory policy  | allkeys-lru   | allkeys-lru      |

### 3.6 ACR (Azure Container Registry)

```bash
ACR_NAME="zealacr"
ACR_RG="zeal-${ENVIRONMENT}-rg"

# Create registry
az acr create \
  --name $ACR_NAME \
  --resource-group $ACR_RG \
  --sku Premium \
  --location uaenorth \
  --admin-enabled false

# Attach ACR to AKS (allows AKS to pull images without separate credentials)
az aks update \
  --name ${ENVIRONMENT}-zeal-aks \
  --resource-group $ACR_RG \
  --attach-acr $ACR_NAME

# Enable content trust for image signing (production)
az acr config content-trust update \
  --registry $ACR_NAME \
  --status enabled

# Set up retention policy to prune untagged manifests
az acr config retention update \
  --registry $ACR_NAME \
  --type UntaggedManifests \
  --days 30 \
  --status enabled
```

### 3.7 Azure Blob Storage

```bash
STORAGE_NAME="athma-ce${ENVIRONMENT}docs"

az storage account create \
  --name $STORAGE_NAME \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --location uaenorth \
  --sku Standard_ZRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --encryption-services blob file

# Create containers for different document types
for CONTAINER in patient-documents clinical-attachments reports exports; do
  az storage container create \
    --name $CONTAINER \
    --account-name $STORAGE_NAME \
    --auth-mode login
done

# Enable soft delete for recovery
az storage blob service-properties delete-policy update \
  --account-name $STORAGE_NAME \
  --days-retained 30 \
  --enable true

# Enable versioning
az storage account blob-service-properties update \
  --account-name $STORAGE_NAME \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --enable-versioning true
```

### 3.8 Azure Front Door / Application Gateway

#### Application Gateway (L7 load balancer within the VNet)

```hcl
# terraform/modules/appgw/main.tf
resource "azurerm_application_gateway" "main" {
  name                = "${var.environment}-zeal-appgw"
  resource_group_name = var.resource_group_name
  location            = var.location

  sku {
    name     = "WAF_v2"
    tier     = "WAF_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "gateway-ip"
    subnet_id = var.appgw_subnet_id
  }

  frontend_ip_configuration {
    name                 = "frontend-ip"
    public_ip_address_id = azurerm_public_ip.appgw.id
  }

  frontend_port {
    name = "https"
    port = 443
  }

  frontend_port {
    name = "http"
    port = 80
  }

  # HTTP to HTTPS redirect
  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip"
    frontend_port_name             = "http"
    protocol                       = "Http"
  }

  redirect_configuration {
    name                 = "http-to-https"
    redirect_type        = "Permanent"
    target_listener_name = "https-listener"
  }

  request_routing_rule {
    name                        = "http-redirect"
    priority                    = 200
    rule_type                   = "Basic"
    http_listener_name          = "http-listener"
    redirect_configuration_name = "http-to-https"
  }

  # HTTPS listener
  http_listener {
    name                           = "https-listener"
    frontend_ip_configuration_name = "frontend-ip"
    frontend_port_name             = "https"
    protocol                       = "Https"
    ssl_certificate_name           = "zeal-ssl"
  }

  ssl_certificate {
    name                = "zeal-ssl"
    key_vault_secret_id = var.ssl_cert_secret_id
  }

  # WAF configuration
  waf_configuration {
    enabled          = true
    firewall_mode    = "Prevention"
    rule_set_type    = "OWASP"
    rule_set_version = "3.2"
  }

  tags = {
    Environment = var.environment
    Project     = "athma-ce"
  }
}
```

#### Azure Front Door (global CDN + WAF for multi-region)

```bash
# Create Front Door profile
az afd profile create \
  --profile-name zeal-frontdoor \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --sku Premium_AzureFrontDoor

# Add endpoint
az afd endpoint create \
  --endpoint-name zeal-app \
  --profile-name zeal-frontdoor \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --enabled-state Enabled

# Add origin group pointing to Application Gateway
az afd origin-group create \
  --origin-group-name zeal-origins \
  --profile-name zeal-frontdoor \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --probe-request-type GET \
  --probe-protocol Https \
  --probe-path "/health" \
  --probe-interval-in-seconds 30 \
  --sample-size 4 \
  --successful-samples-required 3

# Add WAF policy
az network front-door waf-policy create \
  --name zealWafPolicy \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --sku Premium_AzureFrontDoor \
  --mode Prevention
```

---

## 4. Building and Pushing Container Images

athma-ce uses a multi-stage Dockerfile pattern with `node:18-alpine` as the base image. Each service has its own Dockerfile.

### Local Build and Push

```bash
ACR_NAME="zealacr"
TAG=$(git rev-parse --short HEAD)

# Login to ACR
az acr login --name $ACR_NAME

# Build and push each service
SERVICES=("frontend" "foundation" "clinical" "rcm" "analytics" "prm" "ai-gateway")

for SVC in "${SERVICES[@]}"; do
  if [ "$SVC" == "frontend" ]; then
    CONTEXT="frontend"
  else
    CONTEXT="backend"
  fi

  docker build \
    -f ${CONTEXT}/Dockerfile.${SVC} \
    -t ${ACR_NAME}.azurecr.io/zeal/${SVC}:${TAG} \
    -t ${ACR_NAME}.azurecr.io/zeal/${SVC}:latest \
    ${CONTEXT}

  docker push ${ACR_NAME}.azurecr.io/zeal/${SVC}:${TAG}
  docker push ${ACR_NAME}.azurecr.io/zeal/${SVC}:latest
done
```

### ACR Cloud Build (no local Docker needed)

```bash
# Build directly in ACR using ACR Tasks
for SVC in "${SERVICES[@]}"; do
  if [ "$SVC" == "frontend" ]; then
    CONTEXT="frontend"
  else
    CONTEXT="backend"
  fi

  az acr build \
    --registry $ACR_NAME \
    --image zeal/${SVC}:${TAG} \
    --file ${CONTEXT}/Dockerfile.${SVC} \
    ${CONTEXT}
done
```

### Verify Images

```bash
az acr repository list --name $ACR_NAME -o table
az acr repository show-tags --name $ACR_NAME --repository zeal/frontend -o table
```

---

## 5. Kubernetes Deployment

### 5.1 Namespaces and Quotas

The namespace and resource quota manifests are documented in `../10-Deployment-&-Ops.md` (Namespace Configuration). Apply them:

```bash
kubectl apply -f k8s/namespace.yaml

# Verify
kubectl get namespace athma-ce
kubectl describe resourcequota zeal-quota -n athma-ce
```

### 5.2 ConfigMaps

The ConfigMap structure is documented in `../10-Deployment-&-Ops.md` (ConfigMap Configuration). For Azure, update the database and Redis URLs:

```yaml
# k8s/azure/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: zeal-config
  namespace: athma-ce
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  FOUNDATION_DATABASE_URL: "postgresql://zeal_admin@production-zeal-postgres.postgres.database.azure.com:5432/zeal_foundation?sslmode=require"
  CLINICAL_DATABASE_URL: "postgresql://zeal_admin@production-zeal-postgres.postgres.database.azure.com:5432/zeal_clinical?sslmode=require"
  RCM_DATABASE_URL: "postgresql://zeal_admin@production-zeal-postgres.postgres.database.azure.com:5432/zeal_rcm?sslmode=require"
  ANALYTICS_DATABASE_URL: "postgresql://zeal_admin@production-zeal-postgres.postgres.database.azure.com:5432/zeal_analytics?sslmode=require"
  REDIS_URL: "rediss://production-zeal-redis.redis.cache.windows.net:6380"
  FRONTEND_PORT: "3000"
  FOUNDATION_PORT: "3010"
  CLINICAL_PORT: "3020"
  RCM_PORT: "3030"
  ANALYTICS_PORT: "3040"
  PRM_PORT: "3013"
  AI_GATEWAY_PORT: "3015"
  MONITORING_ENABLED: "true"
  TRACING_ENABLED: "true"
```

```bash
kubectl apply -f k8s/azure/configmap.yaml
```

### 5.3 Secrets (via Azure Key Vault + Secrets Store CSI Driver)

Do not store secrets as plain Kubernetes Secrets. Use the Azure Key Vault Provider for Secrets Store CSI Driver.

```bash
# Install the CSI driver add-on
az aks enable-addons \
  --addons azure-keyvault-secrets-provider \
  --name ${ENVIRONMENT}-zeal-aks \
  --resource-group zeal-${ENVIRONMENT}-rg

# Get the user-assigned managed identity created by the add-on
IDENTITY_CLIENT_ID=$(az aks show \
  --name ${ENVIRONMENT}-zeal-aks \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv)

# Grant access to Key Vault (see Section 8 for Key Vault creation)
az keyvault set-policy \
  --name zeal-${ENVIRONMENT}-kv \
  --spn $IDENTITY_CLIENT_ID \
  --secret-permissions get list
```

#### SecretProviderClass

```yaml
# k8s/azure/secret-provider-class.yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: zeal-keyvault-secrets
  namespace: athma-ce
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: "<IDENTITY_CLIENT_ID>"
    keyvaultName: "zeal-production-kv"
    tenantId: "<AZURE_TENANT_ID>"
    objects: |
      array:
        - |
          objectName: db-password
          objectType: secret
        - |
          objectName: redis-auth-token
          objectType: secret
        - |
          objectName: jwt-secret
          objectType: secret
        - |
          objectName: encryption-key
          objectType: secret
  secretObjects:
    - secretName: zeal-secrets
      type: Opaque
      data:
        - objectName: db-password
          key: DB_PASSWORD
        - objectName: redis-auth-token
          key: REDIS_AUTH_TOKEN
        - objectName: jwt-secret
          key: JWT_SECRET
        - objectName: encryption-key
          key: ENCRYPTION_KEY
```

```bash
kubectl apply -f k8s/azure/secret-provider-class.yaml
```

### 5.4 Deployments for Each Service

Each service follows the same deployment pattern. The base template is in `../10-Deployment-&-Ops.md` (Deployment Configuration). Below is the per-service configuration:

```yaml
# k8s/azure/deployments/foundation.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zeal-foundation
  namespace: athma-ce
  labels:
    app: zeal-foundation
    domain: foundation
spec:
  replicas: 2
  selector:
    matchLabels:
      app: zeal-foundation
  template:
    metadata:
      labels:
        app: zeal-foundation
        domain: foundation
    spec:
      serviceAccountName: zeal-workload
      containers:
        - name: foundation
          image: zealacr.azurecr.io/zeal/foundation:latest
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
            - name: REDIS_AUTH_TOKEN
              valueFrom:
                secretKeyRef:
                  name: zeal-secrets
                  key: REDIS_AUTH_TOKEN
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
              path: /ready
              port: 3010
            initialDelaySeconds: 5
            periodSeconds: 5
          securityContext:
            runAsNonRoot: true
            runAsUser: 1000
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          volumeMounts:
            - name: secrets-store
              mountPath: "/mnt/secrets-store"
              readOnly: true
      volumes:
        - name: secrets-store
          csi:
            driver: secrets-store.csi.k8s.io
            readOnly: true
            volumeAttributes:
              secretProviderClass: zeal-keyvault-secrets
      nodeSelector:
        agentpool: main
```

Repeat this pattern for `clinical` (port 3020), `rcm` (port 3030), `analytics` (port 3040), `prm` (port 3013), `ai-gateway` (port 3015), and `frontend` (port 3000).

```bash
kubectl apply -f k8s/azure/deployments/
```

### 5.5 Services and Ingress

```yaml
# k8s/azure/services.yaml
apiVersion: v1
kind: Service
metadata:
  name: zeal-frontend
  namespace: athma-ce
spec:
  selector:
    app: zeal-frontend
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-foundation
  namespace: athma-ce
spec:
  selector:
    app: zeal-foundation
  ports:
    - port: 80
      targetPort: 3010
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-clinical
  namespace: athma-ce
spec:
  selector:
    app: zeal-clinical
  ports:
    - port: 80
      targetPort: 3020
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-rcm
  namespace: athma-ce
spec:
  selector:
    app: zeal-rcm
  ports:
    - port: 80
      targetPort: 3030
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-analytics
  namespace: athma-ce
spec:
  selector:
    app: zeal-analytics
  ports:
    - port: 80
      targetPort: 3040
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-prm
  namespace: athma-ce
spec:
  selector:
    app: zeal-prm
  ports:
    - port: 80
      targetPort: 3013
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-ai-gateway
  namespace: athma-ce
spec:
  selector:
    app: zeal-ai-gateway
  ports:
    - port: 80
      targetPort: 3015
  type: ClusterIP
```

#### Ingress (AGIC - Application Gateway Ingress Controller)

```yaml
# k8s/azure/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zeal-ingress
  namespace: athma-ce
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/ssl-redirect: "true"
    appgw.ingress.kubernetes.io/backend-protocol: "http"
    appgw.ingress.kubernetes.io/health-probe-path: "/health"
    appgw.ingress.kubernetes.io/waf-policy-for-path: "/subscriptions/<SUB>/resourceGroups/<RG>/providers/Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/zealWafPolicy"
spec:
  tls:
    - hosts:
        - app.zeal.health
        - api.zeal.health
      secretName: zeal-tls
  rules:
    - host: app.zeal.health
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: zeal-frontend
                port:
                  number: 80
    - host: api.zeal.health
      http:
        paths:
          - path: /api/v1/foundation
            pathType: Prefix
            backend:
              service:
                name: zeal-foundation
                port:
                  number: 80
          - path: /api/v1/clinical
            pathType: Prefix
            backend:
              service:
                name: zeal-clinical
                port:
                  number: 80
          - path: /api/v1/rcm
            pathType: Prefix
            backend:
              service:
                name: zeal-rcm
                port:
                  number: 80
          - path: /api/v1/analytics
            pathType: Prefix
            backend:
              service:
                name: zeal-analytics
                port:
                  number: 80
```

```bash
kubectl apply -f k8s/azure/services.yaml
kubectl apply -f k8s/azure/ingress.yaml
```

### 5.6 HPA and PDBs

```yaml
# k8s/azure/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: zeal-foundation-hpa
  namespace: athma-ce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: zeal-foundation
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
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: zeal-clinical-hpa
  namespace: athma-ce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: zeal-clinical
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: zeal-frontend-hpa
  namespace: athma-ce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: zeal-frontend
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

```yaml
# k8s/azure/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: zeal-foundation-pdb
  namespace: athma-ce
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: zeal-foundation
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: zeal-clinical-pdb
  namespace: athma-ce
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: zeal-clinical
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: zeal-frontend-pdb
  namespace: athma-ce
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: zeal-frontend
```

```bash
kubectl apply -f k8s/azure/hpa.yaml
kubectl apply -f k8s/azure/pdb.yaml
```

---

## 6. Helm Chart Deployment

The Helm chart structure and base values are in `../10-Deployment-&-Ops.md` (Helm Charts section). Create Azure-specific overrides:

```yaml
# helm/zeal/values-azure-prod.yaml
global:
  imageRegistry: "zealacr.azurecr.io"
  cloud: azure
  region: uaenorth

replicaCount: 3

image:
  repository: zealacr.azurecr.io/zeal/api
  pullPolicy: IfNotPresent

ingress:
  enabled: true
  className: "azure/application-gateway"
  annotations:
    appgw.ingress.kubernetes.io/ssl-redirect: "true"
    appgw.ingress.kubernetes.io/backend-protocol: "http"
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

podDisruptionBudget:
  enabled: true
  minAvailable: 2

nodeSelector:
  agentpool: main

monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
```

```bash
# Deploy all services
helm upgrade --install athma-ce ./helm/zeal \
  --namespace athma-ce \
  --create-namespace \
  --values ./helm/zeal/values-azure-prod.yaml \
  --set image.tag=$(git rev-parse --short HEAD) \
  --wait \
  --timeout 10m

# Verify
helm list -n athma-ce
kubectl get pods -n athma-ce
kubectl get svc -n athma-ce
```

---

## 7. Networking and SSL/TLS

### Application Gateway with Azure-Managed Certificates

```bash
# Option 1: Azure-managed certificate via Key Vault
az keyvault certificate create \
  --vault-name zeal-${ENVIRONMENT}-kv \
  --name zeal-ssl \
  --policy "$(az keyvault certificate get-default-policy)"

# Option 2: Import existing certificate
az keyvault certificate import \
  --vault-name zeal-${ENVIRONMENT}-kv \
  --name zeal-ssl \
  --file ./certs/zeal.pfx \
  --password "<PFX_PASSWORD>"
```

### Azure DNS Zones

```bash
# Create DNS zone
az network dns zone create \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --name zeal.health

# Add A record pointing to Application Gateway public IP
APPGW_IP=$(az network public-ip show \
  --name ${ENVIRONMENT}-zeal-appgw-pip \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query ipAddress -o tsv)

az network dns record-set a add-record \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --zone-name zeal.health \
  --record-set-name app \
  --ipv4-address $APPGW_IP

az network dns record-set a add-record \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --zone-name zeal.health \
  --record-set-name api \
  --ipv4-address $APPGW_IP
```

### Front Door CDN for Frontend Static Assets

```bash
# Add route for static assets through Front Door CDN
az afd route create \
  --route-name static-assets \
  --endpoint-name zeal-app \
  --profile-name zeal-frontdoor \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --origin-group zeal-origins \
  --supported-protocols Https \
  --patterns-to-match "/_next/static/*" "/images/*" "/fonts/*" \
  --forwarding-protocol HttpsOnly \
  --https-redirect Enabled \
  --enable-caching true
```

---

## 8. Secrets Management

### Azure Key Vault

```bash
KV_NAME="zeal-${ENVIRONMENT}-kv"

# Create Key Vault
az keyvault create \
  --name $KV_NAME \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --location uaenorth \
  --sku premium \
  --enable-rbac-authorization false \
  --enable-soft-delete true \
  --retention-days 90 \
  --enable-purge-protection true

# Store secrets
az keyvault secret set --vault-name $KV_NAME --name "db-password" --value "<DB_PASSWORD>"
az keyvault secret set --vault-name $KV_NAME --name "redis-auth-token" --value "<REDIS_TOKEN>"
az keyvault secret set --vault-name $KV_NAME --name "jwt-secret" --value "<JWT_SECRET>"
az keyvault secret set --vault-name $KV_NAME --name "encryption-key" --value "<ENCRYPTION_KEY>"
az keyvault secret set --vault-name $KV_NAME --name "dha-client-cert" --file ./certs/dha-client.pem
az keyvault secret set --vault-name $KV_NAME --name "doh-client-id" --value "<DOH_CLIENT_ID>"
az keyvault secret set --vault-name $KV_NAME --name "doh-client-secret" --value "<DOH_CLIENT_SECRET>"
```

### Managed Identity for AKS Workloads

```bash
# Create a user-assigned managed identity for workloads
IDENTITY_NAME="zeal-${ENVIRONMENT}-workload-id"

az identity create \
  --name $IDENTITY_NAME \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --location uaenorth

IDENTITY_CLIENT_ID=$(az identity show \
  --name $IDENTITY_NAME \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query clientId -o tsv)

IDENTITY_PRINCIPAL_ID=$(az identity show \
  --name $IDENTITY_NAME \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query principalId -o tsv)

# Grant Key Vault access
az keyvault set-policy \
  --name $KV_NAME \
  --object-id $IDENTITY_PRINCIPAL_ID \
  --secret-permissions get list

# Grant Blob Storage access
STORAGE_ID=$(az storage account show \
  --name athma-ce${ENVIRONMENT}docs \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query id -o tsv)

az role assignment create \
  --assignee $IDENTITY_PRINCIPAL_ID \
  --role "Storage Blob Data Contributor" \
  --scope $STORAGE_ID
```

The CSI driver integration is covered in Section 5.3 above. This approach means **no passwords are stored in Kubernetes manifests or ConfigMaps**.

---

## 9. CI/CD Pipeline

The full GitHub Actions workflows for Azure are in `../10-Deployment-&-Ops.md` (Azure GitHub Actions Workflow). Below is a summary of the required GitHub Secrets and the workflow stages.

### Required GitHub Secrets

| Secret              | Description                                      |
|---------------------|--------------------------------------------------|
| AZURE_CREDENTIALS   | Service principal JSON from `az ad sp create-for-rbac --sdk-auth` |
| ACR_USERNAME        | ACR admin or SP client ID                        |
| ACR_PASSWORD        | ACR admin or SP client secret                    |
| AZURE_SUBSCRIPTION  | Azure subscription ID                            |

### Workflow Stages

```
Push to main/develop
  |
  v
[Test] --> lint, unit tests, security scan
  |
  v
[Build] --> Docker build, push to ACR (all 7 services)
  |
  v
[Deploy Staging] --> helm upgrade to staging AKS (on develop)
  |
  v
[Deploy Production] --> helm upgrade to production AKS (on main, after approval)
  |
  v
[Smoke Test] --> health check, basic API calls
```

### Staging Pipeline Addition

```yaml
# .github/workflows/ci-cd-azure.yml (add to existing)
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Get AKS credentials
        uses: azure/aks-set-context@v3
        with:
          resource-group: zeal-staging-rg
          cluster-name: staging-zeal-aks

      - name: Deploy to Staging
        run: |
          helm upgrade --install athma-ce ./helm/zeal \
            --namespace athma-ce \
            --create-namespace \
            --values ./helm/zeal/values-azure-staging.yaml \
            --set image.tag=${{ github.sha }} \
            --wait --timeout 10m

      - name: Run integration tests
        run: |
          kubectl wait --for=condition=ready pod -l app=zeal-foundation -n athma-ce --timeout=300s
          kubectl run integration-test --image=zealacr.azurecr.io/zeal/test-runner:latest \
            --rm -i --restart=Never -n athma-ce -- npm run test:integration
```

### Production Pipeline with Manual Approval

```yaml
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://app.zeal.health

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
          cluster-name: production-zeal-aks

      - name: Deploy to Production
        run: |
          helm upgrade --install athma-ce ./helm/zeal \
            --namespace athma-ce \
            --create-namespace \
            --values ./helm/zeal/values-azure-prod.yaml \
            --set image.tag=${{ github.sha }} \
            --wait --timeout 10m

      - name: Smoke tests
        run: |
          kubectl wait --for=condition=ready pod -l app=zeal-foundation -n athma-ce --timeout=300s
          kubectl run smoke-test --image=curlimages/curl --rm -i --restart=Never -n athma-ce -- \
            curl -sf http://zeal-foundation.zeal.svc.cluster.local/health
          kubectl run smoke-test-fe --image=curlimages/curl --rm -i --restart=Never -n athma-ce -- \
            curl -sf http://zeal-frontend.zeal.svc.cluster.local:80/
```

---

## 10. Observability

### Option A: Azure-Native Monitoring (Recommended for Simplicity)

```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --workspace-name zeal-${ENVIRONMENT}-logs \
  --location uaenorth \
  --retention-time 90

WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --workspace-name zeal-${ENVIRONMENT}-logs \
  --query id -o tsv)

# Enable Container Insights on AKS
az aks enable-addons \
  --addons monitoring \
  --name ${ENVIRONMENT}-zeal-aks \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --workspace-resource-id $WORKSPACE_ID

# Enable diagnostic settings for PostgreSQL
PG_ID=$(az postgres flexible-server show \
  --name ${ENVIRONMENT}-zeal-postgres \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query id -o tsv)

az monitor diagnostic-settings create \
  --name zeal-pg-diagnostics \
  --resource $PG_ID \
  --workspace $WORKSPACE_ID \
  --logs '[{"category":"PostgreSQLLogs","enabled":true},{"category":"PostgreSQLFlexSessions","enabled":true}]' \
  --metrics '[{"category":"AllMetrics","enabled":true}]'

# Enable diagnostic settings for Redis
REDIS_ID=$(az redis show \
  --name ${ENVIRONMENT}-zeal-redis \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query id -o tsv)

az monitor diagnostic-settings create \
  --name zeal-redis-diagnostics \
  --resource $REDIS_ID \
  --workspace $WORKSPACE_ID \
  --metrics '[{"category":"AllMetrics","enabled":true}]'
```

#### Azure Alerts

```bash
# Alert: High error rate (>5% of requests returning 5xx)
az monitor metrics alert create \
  --name "zeal-high-error-rate" \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --scopes $APPGW_ID \
  --condition "avg UnhealthyHostCount > 0" \
  --description "One or more backend hosts are unhealthy" \
  --severity 2 \
  --action "/subscriptions/<SUB>/resourceGroups/<RG>/providers/Microsoft.Insights/actionGroups/zeal-ops-team"

# Alert: Pod restarts
az monitor scheduled-query-rule create \
  --name "zeal-pod-restarts" \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --scopes $WORKSPACE_ID \
  --condition "count > 3" \
  --condition-query "KubePodInventory | where Namespace == 'athma-ce' | where PodRestartCount > 3 | summarize count()" \
  --evaluation-frequency 5m \
  --window-size 15m \
  --severity 2

# Alert: Database CPU > 80%
az monitor metrics alert create \
  --name "zeal-db-high-cpu" \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --scopes $PG_ID \
  --condition "avg cpu_percent > 80" \
  --window-size 10m \
  --evaluation-frequency 5m \
  --severity 2
```

### Option B: Self-Hosted OTel Stack on AKS

Deploy the same observability stack used in development (OTel Collector, Prometheus, Loki, Tempo, Grafana) as pods in the AKS cluster.

```bash
# Create observability namespace
kubectl create namespace observability

# Install Prometheus stack via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace observability \
  --set grafana.adminPassword="<GRAFANA_PASSWORD>" \
  --set prometheus.prometheusSpec.retention=30d \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi

# Install Loki for log aggregation
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack \
  --namespace observability \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=50Gi

# Install Tempo for distributed tracing
helm install tempo grafana/tempo \
  --namespace observability \
  --set persistence.enabled=true \
  --set persistence.size=20Gi

# Install OTel Collector
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm install otel-collector open-telemetry/opentelemetry-collector \
  --namespace observability \
  --values helm/otel-collector-values.yaml
```

---

## 11. Healthcare Compliance

### UAE Data Residency

All Azure resources **must** be created in UAE North (`uaenorth`) to comply with UAE healthcare data residency requirements. No patient data or PHI may leave the UAE region.

```bash
# Verify all resources are in UAE North
az resource list \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query "[].{Name:name, Location:location, Type:type}" \
  -o table | grep -v uaenorth
# The above command should return no results.
```

### Azure Encryption Defaults

| Layer            | Encryption                                           |
|------------------|------------------------------------------------------|
| Storage at rest  | Azure SSE with platform-managed keys (AES-256)       |
| PostgreSQL       | TDE enabled by default on Flexible Server            |
| Redis            | TLS 1.2 enforced, at-rest encryption on Premium SKU  |
| Blob Storage     | SSE with platform keys, optional CMK via Key Vault   |
| In transit       | TLS 1.2 minimum on all services                      |
| AKS secrets      | etcd encryption enabled via Key Vault                |

### Azure Policy for Compliance

```bash
# Assign built-in policy: Require TLS 1.2
az policy assignment create \
  --name "require-tls-12" \
  --policy "/providers/Microsoft.Authorization/policyDefinitions/fe83a0eb-a853-422d-aff8-318e1d30e2b8" \
  --scope "/subscriptions/<SUB>/resourceGroups/zeal-${ENVIRONMENT}-rg"

# Assign: Deny public IP creation in resource group
az policy assignment create \
  --name "deny-public-ip" \
  --policy "/providers/Microsoft.Authorization/policyDefinitions/6c112d4e-5bc7-47ae-a041-ea2d9dccd749" \
  --scope "/subscriptions/<SUB>/resourceGroups/zeal-${ENVIRONMENT}-rg" \
  --params '{"effect": {"value": "Deny"}}'

# Assign: Require specific location (UAE North)
az policy assignment create \
  --name "require-uaenorth" \
  --policy "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c" \
  --scope "/subscriptions/<SUB>/resourceGroups/zeal-${ENVIRONMENT}-rg" \
  --params '{"listOfAllowedLocations": {"value": ["uaenorth"]}}'
```

### Activity Log and Audit

```bash
# Export Activity Log to Log Analytics for audit trail
az monitor diagnostic-settings create \
  --name "activity-log-export" \
  --resource "/subscriptions/<SUBSCRIPTION_ID>" \
  --workspace $WORKSPACE_ID \
  --logs '[{"category":"Administrative","enabled":true},{"category":"Security","enabled":true},{"category":"Policy","enabled":true}]'
```

### Network Isolation for PHI

The Clinical and RCM databases hold PHI. Ensure they are only accessible from the AKS subnet:

- PostgreSQL is VNet-integrated (database subnet with delegation).
- NSG rules on the database subnet restrict inbound traffic to the AKS subnet only (Section 3.2).
- Private DNS zones resolve the PostgreSQL FQDN within the VNet without public exposure.

```bash
# Create private DNS zone for PostgreSQL
az network private-dns zone create \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --name "privatelink.postgres.database.azure.com"

az network private-dns link vnet create \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --zone-name "privatelink.postgres.database.azure.com" \
  --name "zeal-pg-dns-link" \
  --virtual-network ${ENVIRONMENT}-zeal-vnet \
  --registration-enabled false
```

---

## 12. Scaling and High Availability

### AKS Cluster Autoscaler

The cluster autoscaler is enabled in the AKS Terraform module (see Section 3.3). Key settings:

```bash
# Verify autoscaler status
kubectl describe configmap cluster-autoscaler-status -n kube-system

# Manually adjust if needed
az aks nodepool update \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --cluster-name ${ENVIRONMENT}-zeal-aks \
  --name main \
  --min-count 3 \
  --max-count 15 \
  --enable-cluster-autoscaler
```

### PostgreSQL Zone-Redundant HA

For production, the Terraform module sets `high_availability.mode = "ZoneRedundant"`. This creates a standby replica in a different availability zone with automatic failover.

```bash
# Check HA status
az postgres flexible-server show \
  --name ${ENVIRONMENT}-zeal-postgres \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query "{haState:highAvailability.state, haMode:highAvailability.mode}" -o table
```

### Redis Availability

For Premium SKU, zone redundancy is built in. For multi-region scenarios:

```bash
# Create geo-replication link (Premium only)
az redis server-link create \
  --name ${ENVIRONMENT}-zeal-redis \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --linked-server-name dr-zeal-redis \
  --linked-resource-group zeal-dr-rg \
  --replication-role Secondary
```

### Application Gateway Multi-Zone

The WAF_v2 SKU supports zone-redundant deployment across all three availability zones in UAE North, providing resilience against single-zone failures. This is configured by the `capacity` or `autoscale_configuration` in Terraform.

---

## 13. Disaster Recovery

### Cross-Cloud Failover (per ADR-0008)

athma-ce uses Azure as DR when AWS is primary (or vice versa). The failover strategy:

| Component      | RPO       | RTO       | Mechanism                                    |
|----------------|-----------|-----------|----------------------------------------------|
| PostgreSQL     | < 1 hour  | < 4 hours | Geo-redundant backup + restore               |
| Redis          | < 5 min   | < 30 min  | Rebuild from PostgreSQL (cache only)          |
| Blob Storage   | < 1 hour  | < 2 hours | GRS replication                              |
| Application    | 0         | < 1 hour  | Container images in both ACR and ECR          |
| DNS            | N/A       | < 5 min   | Azure Traffic Manager / DNS failover          |

### Azure Backup for Databases

```bash
# PostgreSQL: Backups are automatic. Verify:
az postgres flexible-server show \
  --name ${ENVIRONMENT}-zeal-postgres \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query "{backupRetention:backup.backupRetentionDays, geoRedundant:backup.geoRedundantBackup}"

# Point-in-time restore
az postgres flexible-server restore \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --name ${ENVIRONMENT}-zeal-postgres-restored \
  --source-server ${ENVIRONMENT}-zeal-postgres \
  --restore-time "2026-03-20T10:00:00Z"

# Geo-restore (from geo-redundant backup to a different region)
az postgres flexible-server geo-restore \
  --resource-group zeal-dr-rg \
  --name dr-zeal-postgres \
  --source-server "/subscriptions/<SUB>/resourceGroups/zeal-${ENVIRONMENT}-rg/providers/Microsoft.DBforPostgreSQL/flexibleServers/${ENVIRONMENT}-zeal-postgres" \
  --location uaecentral
```

### Geo-Redundant Storage

```bash
# Blob Storage is created with Standard_ZRS (Section 3.7).
# For cross-region DR, upgrade to GRS:
az storage account update \
  --name athma-ce${ENVIRONMENT}docs \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --sku Standard_RAGRS

# Initiate failover (only when primary region is unavailable)
az storage account failover \
  --name athma-ce${ENVIRONMENT}docs \
  --resource-group zeal-${ENVIRONMENT}-rg
```

### DR Runbook Checklist

1. Detect outage via Azure Monitor alerts or manual verification.
2. Confirm the primary region is truly unavailable (not a transient issue).
3. Initiate PostgreSQL geo-restore to DR region.
4. Update DNS records to point to DR Application Gateway.
5. Deploy application to DR AKS cluster using the same Helm chart.
6. Verify all four databases are accessible and data is consistent.
7. Run smoke tests against DR environment.
8. Notify operations team and stakeholders.

---

## 14. Cost Estimation

Monthly cost estimates in USD for UAE North region (prices are approximate and vary):

| Resource                          | Small (Dev)     | Medium (Staging) | Large (Production) |
|-----------------------------------|-----------------|------------------|---------------------|
| **AKS** (node pools)             |                 |                  |                     |
| - Main pool (D2s_v3 x 2)         | $140            | -                | -                   |
| - Main pool (D4s_v3 x 3)         | -               | $420             | -                   |
| - Main pool (D4s_v3 x 5)         | -               | -                | $700                |
| - Spot pool (D4s_v3 x 0-3)       | -               | $50-150          | $100-300            |
| **Azure DB for PostgreSQL**       |                 |                  |                     |
| - Burstable B2s                   | $50             | -                | -                   |
| - GP D4s_v3                       | -               | $280             | -                   |
| - GP D4s_v3 + Zone-redundant HA   | -               | -                | $560                |
| - Storage (128-256 GB)            | $15             | $30              | $60                 |
| **Azure Cache for Redis**         |                 |                  |                     |
| - Standard C1 (1 GB)             | $45             | -                | -                   |
| - Standard C2 (6 GB)             | -               | $180             | -                   |
| - Premium P1 (6 GB)              | -               | -                | $380                |
| **Azure Blob Storage**           | $5              | $10              | $25                 |
| **ACR** (Premium)                | $0 (Basic $5)   | $5 (Basic)       | $50 (Premium)       |
| **Application Gateway** (WAF_v2) | $190            | $190             | $380 (2 instances)  |
| **Front Door** (Premium)         | -               | -                | $330                |
| **Key Vault**                    | $5              | $5               | $5                  |
| **Log Analytics** (50-200 GB)    | $10             | $50              | $120                |
| **Networking** (NAT GW, PIPs)    | $35             | $35              | $70                 |
| **Total (approx.)**              | **$495**        | **$1,355**       | **$2,980**          |

### Cost Optimization

- **Reserved Instances**: 1-year RI on AKS node VMs saves ~35%; 3-year saves ~55%.
- **Spot node pools**: Use for non-critical workloads (observability, batch jobs). Savings of 60-90%.
- **Burstable DB SKUs**: Use B-series for dev/staging (up to 70% savings vs GP).
- **Azure Hybrid Benefit**: Apply existing Windows Server or SQL Server licenses.
- **Auto-shutdown**: Schedule dev/staging AKS clusters to scale to zero outside business hours.

```bash
# Scale down dev cluster after hours (via scheduled script or Azure Automation)
az aks nodepool update \
  --resource-group zeal-dev-rg \
  --cluster-name dev-zeal-aks \
  --name main \
  --min-count 0 \
  --max-count 2 \
  --node-count 0
```

---

## 15. Troubleshooting

### AKS Pod Issues

```bash
# Pod not starting
kubectl describe pod <POD_NAME> -n athma-ce
kubectl logs <POD_NAME> -n athma-ce --previous

# Check events
kubectl get events -n athma-ce --sort-by='.lastTimestamp' | tail -20

# OOMKilled - increase memory limits
kubectl top pods -n athma-ce

# CrashLoopBackOff - check application logs
kubectl logs <POD_NAME> -n athma-ce -f

# Node pressure
kubectl describe node <NODE_NAME> | grep -A 5 Conditions
kubectl top nodes
```

### Azure PostgreSQL Connectivity

```bash
# Test connectivity from a pod
kubectl run pg-test --image=postgres:16-alpine --rm -it --restart=Never -n athma-ce -- \
  psql "host=${ENVIRONMENT}-zeal-postgres.postgres.database.azure.com \
  port=5432 dbname=zeal_foundation user=zeal_admin sslmode=require" \
  -c "SELECT 1;"

# Check VNet integration
az postgres flexible-server show \
  --name ${ENVIRONMENT}-zeal-postgres \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query "network" -o json

# Check firewall rules (should be minimal with VNet integration)
az postgres flexible-server firewall-rule list \
  --name ${ENVIRONMENT}-zeal-postgres \
  --resource-group zeal-${ENVIRONMENT}-rg -o table

# Private DNS resolution from within AKS
kubectl run dns-test --image=busybox --rm -it --restart=Never -n athma-ce -- \
  nslookup ${ENVIRONMENT}-zeal-postgres.postgres.database.azure.com
```

### ACR Pull Errors

```bash
# Error: ImagePullBackOff or ErrImagePull

# Check if AKS is attached to ACR
az aks check-acr \
  --name ${ENVIRONMENT}-zeal-aks \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --acr zealacr.azurecr.io

# Re-attach if needed
az aks update \
  --name ${ENVIRONMENT}-zeal-aks \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --attach-acr zealacr

# Service principal expired (if using SP-based auth)
az ad sp credential list --id <SP_APP_ID> --query "[].endDateTime" -o tsv
# If expired, reset:
az ad sp credential reset --id <SP_APP_ID>

# Verify image exists
az acr repository show-tags \
  --name zealacr \
  --repository zeal/foundation -o table
```

### NSG Rules Blocking Traffic

```bash
# Check effective NSG rules for a NIC
az network nic list-effective-nsg \
  --name <NIC_NAME> \
  --resource-group <RG_NAME> -o table

# Check NSG flow logs (if enabled)
az network watcher flow-log show \
  --nsg <NSG_NAME> \
  --resource-group zeal-${ENVIRONMENT}-rg

# Quick test: temporarily add an allow rule, then remove after debugging
az network nsg rule create \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --nsg-name ${ENVIRONMENT}-zeal-db-nsg \
  --name DebugAllow \
  --priority 110 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --source-address-prefixes "<YOUR_IP>" \
  --destination-port-ranges 5432

# Remember to delete the debug rule
az network nsg rule delete \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --nsg-name ${ENVIRONMENT}-zeal-db-nsg \
  --name DebugAllow
```

### Key Vault Access Issues

```bash
# Check if managed identity can access Key Vault
az keyvault secret list --vault-name zeal-${ENVIRONMENT}-kv -o table

# Verify access policies include the AKS managed identity
az keyvault show \
  --name zeal-${ENVIRONMENT}-kv \
  --query "properties.accessPolicies[*].{ObjectId:objectId,Permissions:permissions.secrets}" \
  -o table

# Check CSI driver pods are running
kubectl get pods -n kube-system -l app=secrets-store-csi-driver

# Check SecretProviderClass events
kubectl describe secretproviderclass zeal-keyvault-secrets -n athma-ce

# Verify secrets are synced
kubectl get secret zeal-secrets -n athma-ce -o json | jq '.data | keys'
```

### Redis Connectivity

```bash
# Test from a pod
kubectl run redis-test --image=redis:7-alpine --rm -it --restart=Never -n athma-ce -- \
  redis-cli -h ${ENVIRONMENT}-zeal-redis.redis.cache.windows.net \
  -p 6380 --tls -a "<ACCESS_KEY>" PING

# Check Redis health
az redis show \
  --name ${ENVIRONMENT}-zeal-redis \
  --resource-group zeal-${ENVIRONMENT}-rg \
  --query "{provisioningState:provisioningState, redisVersion:redisVersion, linkedServers:linkedServers}" -o json
```

### General Diagnostic Commands

```bash
# Overall cluster health
kubectl get componentstatuses
kubectl get nodes -o wide
kubectl get pods -n athma-ce -o wide

# Resource usage
kubectl top nodes
kubectl top pods -n athma-ce --sort-by=memory

# Check all services have endpoints
kubectl get endpoints -n athma-ce

# Helm release status
helm status athma-ce -n athma-ce
helm history athma-ce -n athma-ce

# Rollback if deployment failed
helm rollback athma-ce <REVISION> -n athma-ce
```
