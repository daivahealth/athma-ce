# Deploying Zeal on Google Cloud Platform

## 1. Overview

This guide covers deploying the Zeal healthcare platform on Google Cloud Platform (GCP). The architecture uses GKE (Google Kubernetes Engine) for container orchestration, Cloud SQL for PostgreSQL databases, Memorystore for Redis caching, and Cloud CDN with HTTPS Load Balancing for traffic management.

**Target Architecture:**

```
Internet
   |
[Cloud CDN + HTTPS Load Balancer]
   |    (Google-managed TLS certs)
   |
[Cloud Armor WAF]
   |
[GKE Standard Cluster]
   |-- frontend (Next.js 14)
   |-- foundation-service (NestJS :3010)
   |-- clinical-service   (NestJS :3020)
   |-- rcm-service         (NestJS :3030)
   |-- analytics-service   (NestJS :3040)
   |-- prm-service         (NestJS :3013)
   |-- ai-gateway          (NestJS :3015)
   |-- otel-collector / prometheus / loki / tempo / grafana
   |
[Cloud SQL Proxy sidecars]
   |
[Cloud SQL for PostgreSQL] ── 4 databases (pgvector)
[Memorystore for Redis]    ── Standard tier HA
[Secret Manager]           ── Application secrets
[Artifact Registry]        ── Container images
[Cloud Storage]            ── Documents, assets
```

> **DATA RESIDENCY WARNING:** GCP does not operate a region in the UAE. The nearest
> Middle East regions are **me-central2 (Doha, Qatar)** and **me-west1 (Tel Aviv, Israel)**.
> This deployment may **not** satisfy UAE data residency requirements (DHA/DOH/MOHAP regulations
> mandate patient data remain within UAE borders). Use this guide only for:
> - Non-UAE tenant deployments
> - Development and staging environments
> - Organisations whose compliance framework permits cross-border hosting in the GCC
>
> For UAE-compliant production deployments, use AWS me-central-1 (UAE) or Azure UAE North.

## 2. Prerequisites

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| gcloud CLI | >= 470.0.0 | GCP resource management |
| Terraform | >= 1.5 | Infrastructure as Code |
| kubectl | >= 1.28 | Kubernetes management |
| Helm | >= 3.14 | Kubernetes package management |
| Docker | >= 24.0 | Container image builds |

### Install gcloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### GCP Project Setup

```bash
# Set project variables
export GCP_PROJECT_ID="zeal-healthcare-prod"
export GCP_REGION="me-central2"
export GCP_ZONE="me-central2-a"

# Create project (or use existing)
gcloud projects create $GCP_PROJECT_ID --name="Zeal Healthcare"
gcloud config set project $GCP_PROJECT_ID

# Enable billing (link via console or existing billing account)
gcloud billing accounts list
gcloud billing projects link $GCP_PROJECT_ID --billing-account=BILLING_ACCOUNT_ID

# Enable required APIs
gcloud services enable \
  container.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudkms.googleapis.com \
  compute.googleapis.com \
  servicenetworking.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com \
  cloudbuild.googleapis.com \
  dns.googleapis.com \
  certificatemanager.googleapis.com
```

### Service Account and IAM

```bash
# Create Terraform service account
gcloud iam service-accounts create zeal-terraform \
  --display-name="Zeal Terraform" \
  --description="Service account for Terraform IaC"

SA_EMAIL="zeal-terraform@${GCP_PROJECT_ID}.iam.gserviceaccount.com"

# Grant required roles
ROLES=(
  "roles/container.admin"
  "roles/cloudsql.admin"
  "roles/redis.admin"
  "roles/artifactregistry.admin"
  "roles/secretmanager.admin"
  "roles/compute.admin"
  "roles/iam.serviceAccountAdmin"
  "roles/iam.serviceAccountUser"
  "roles/servicenetworking.networksAdmin"
  "roles/cloudkms.admin"
  "roles/storage.admin"
  "roles/dns.admin"
  "roles/logging.admin"
  "roles/monitoring.admin"
)

for ROLE in "${ROLES[@]}"; do
  gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="${ROLE}" \
    --condition=None
done

# Create and download key (store securely - use Workload Identity Federation for CI/CD)
gcloud iam service-accounts keys create terraform-sa-key.json \
  --iam-account=$SA_EMAIL
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/terraform-sa-key.json"
```

## 3. Infrastructure Provisioning (Terraform)

### 3.1 Terraform State Backend

Create the GCS bucket for remote state before running any Terraform:

```bash
gsutil mb -p $GCP_PROJECT_ID -l $GCP_REGION gs://zeal-terraform-state-${GCP_PROJECT_ID}/
gsutil versioning set on gs://zeal-terraform-state-${GCP_PROJECT_ID}/
```

**`terraform/providers.tf`**:

```hcl
terraform {
  required_version = ">= 1.5"

  backend "gcs" {
    bucket = "zeal-terraform-state-zeal-healthcare-prod"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.20"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}
```

**`terraform/variables.tf`**:

```hcl
variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "zeal-healthcare-prod"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "me-central2"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "me-central2-a"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "cluster_name" {
  description = "GKE cluster name"
  type        = string
  default     = "zeal-gke"
}

variable "db_tier" {
  description = "Cloud SQL machine tier"
  type        = string
  default     = "db-custom-4-16384"
}

variable "db_password" {
  description = "Cloud SQL root password"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Primary domain for the platform"
  type        = string
  default     = "zeal.example.com"
}
```

### 3.2 VPC and Networking

**`terraform/modules/networking/main.tf`**:

```hcl
resource "google_compute_network" "zeal_vpc" {
  name                    = "zeal-vpc-${var.environment}"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
  project                 = var.project_id
}

# GKE subnet with secondary ranges for pods and services
resource "google_compute_subnetwork" "gke_subnet" {
  name          = "zeal-gke-subnet-${var.environment}"
  ip_cidr_range = "10.10.0.0/20"
  region        = var.region
  network       = google_compute_network.zeal_vpc.id
  project       = var.project_id

  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "gke-pods"
    ip_cidr_range = "10.20.0.0/14"
  }

  secondary_ip_range {
    range_name    = "gke-services"
    ip_cidr_range = "10.24.0.0/20"
  }

  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# Database / internal services subnet
resource "google_compute_subnetwork" "db_subnet" {
  name                     = "zeal-db-subnet-${var.environment}"
  ip_cidr_range            = "10.30.0.0/24"
  region                   = var.region
  network                  = google_compute_network.zeal_vpc.id
  project                  = var.project_id
  private_ip_google_access = true
}

# Cloud Router for NAT
resource "google_compute_router" "router" {
  name    = "zeal-router-${var.environment}"
  region  = var.region
  network = google_compute_network.zeal_vpc.id
  project = var.project_id
}

# Cloud NAT for egress from private GKE nodes
resource "google_compute_router_nat" "nat" {
  name                               = "zeal-nat-${var.environment}"
  router                             = google_compute_router.router.name
  region                             = var.region
  project                            = var.project_id
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Private Service Access for Cloud SQL and Memorystore
resource "google_compute_global_address" "private_ip_range" {
  name          = "zeal-private-ip-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  network       = google_compute_network.zeal_vpc.id
  project       = var.project_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.zeal_vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

# Firewall: allow internal communication
resource "google_compute_firewall" "allow_internal" {
  name    = "zeal-allow-internal-${var.environment}"
  network = google_compute_network.zeal_vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "icmp"
  }

  source_ranges = [
    "10.10.0.0/20",  # GKE nodes
    "10.20.0.0/14",  # GKE pods
    "10.24.0.0/20",  # GKE services
    "10.30.0.0/24",  # DB subnet
  ]
}

# Firewall: allow health checks from GCP LB ranges
resource "google_compute_firewall" "allow_health_checks" {
  name    = "zeal-allow-health-checks-${var.environment}"
  network = google_compute_network.zeal_vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "3010", "3020", "3030", "3040", "3013", "3015"]
  }

  source_ranges = [
    "35.191.0.0/16",   # GCP health check probes
    "130.211.0.0/22",  # GCP health check probes
  ]

  target_tags = ["gke-node"]
}

# Firewall: deny all ingress by default (lowest priority)
resource "google_compute_firewall" "deny_all_ingress" {
  name     = "zeal-deny-all-ingress-${var.environment}"
  network  = google_compute_network.zeal_vpc.name
  project  = var.project_id
  priority = 65534

  deny {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]
}

output "vpc_id" {
  value = google_compute_network.zeal_vpc.id
}

output "vpc_name" {
  value = google_compute_network.zeal_vpc.name
}

output "gke_subnet_id" {
  value = google_compute_subnetwork.gke_subnet.id
}

output "gke_subnet_name" {
  value = google_compute_subnetwork.gke_subnet.name
}

output "private_vpc_connection" {
  value = google_service_networking_connection.private_vpc_connection.id
}
```

**`terraform/modules/networking/variables.tf`**:

```hcl
variable "project_id" { type = string }
variable "region" { type = string }
variable "environment" { type = string }
```

### 3.3 GKE Cluster

**`terraform/modules/gke/main.tf`**:

```hcl
# GKE service account
resource "google_service_account" "gke_nodes" {
  account_id   = "zeal-gke-nodes-${var.environment}"
  display_name = "Zeal GKE Node SA"
  project      = var.project_id
}

resource "google_project_iam_member" "gke_node_roles" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/stackdriver.resourceMetadata.writer",
    "roles/artifactregistry.reader",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region
  project  = var.project_id

  # Remove default node pool immediately, we manage our own
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = var.vpc_name
  subnetwork = var.gke_subnet_name

  ip_allocation_policy {
    cluster_secondary_range_name  = "gke-pods"
    services_secondary_range_name = "gke-services"
  }

  # Private cluster - nodes have no public IPs
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false  # allow kubectl from outside
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "0.0.0.0/0"
      display_name = "All (restrict in production)"
    }
  }

  # Workload Identity for pod-level GCP access
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Network policy enforcement
  network_policy {
    enabled  = true
    provider = "CALICO"
  }

  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
    network_policy_config {
      disabled = false
    }
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }
  }

  # Binary authorization for container image security
  binary_authorization {
    evaluation_mode = "PROJECT_SINGLETON_POLICY_ENFORCE"
  }

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
    managed_prometheus {
      enabled = true
    }
  }

  maintenance_policy {
    recurring_window {
      start_time = "2025-01-01T02:00:00Z"
      end_time   = "2025-01-01T06:00:00Z"
      recurrence = "FREQ=WEEKLY;BYDAY=SA"
    }
  }

  release_channel {
    channel = "STABLE"
  }

  resource_labels = {
    environment = var.environment
    platform    = "zeal"
    managed-by  = "terraform"
  }
}

# Primary node pool - standard workloads
resource "google_container_node_pool" "primary_nodes" {
  name       = "zeal-primary-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  project    = var.project_id

  initial_node_count = var.environment == "production" ? 3 : 1

  autoscaling {
    min_node_count = var.environment == "production" ? 3 : 1
    max_node_count = var.environment == "production" ? 10 : 3
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    machine_type    = "e2-standard-4"
    disk_size_gb    = 100
    disk_type       = "pd-ssd"
    service_account = google_service_account.gke_nodes.email
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]

    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    labels = {
      environment = var.environment
      node-type   = "primary"
    }

    tags = ["gke-node", "zeal-${var.environment}"]

    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

# Spot node pool - non-critical workloads (observability, batch)
resource "google_container_node_pool" "spot_nodes" {
  name     = "zeal-spot-pool"
  location = var.region
  cluster  = google_container_cluster.primary.name
  project  = var.project_id

  initial_node_count = 0

  autoscaling {
    min_node_count = 0
    max_node_count = var.environment == "production" ? 5 : 2
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    machine_type    = "e2-standard-2"
    spot            = true
    disk_size_gb    = 50
    disk_type       = "pd-standard"
    service_account = google_service_account.gke_nodes.email
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]

    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    labels = {
      environment = var.environment
      node-type   = "spot"
    }

    taint {
      key    = "cloud.google.com/gke-spot"
      value  = "true"
      effect = "NO_SCHEDULE"
    }

    tags = ["gke-node", "zeal-${var.environment}"]
  }
}

# Workload Identity SA for Zeal application pods
resource "google_service_account" "zeal_workload" {
  account_id   = "zeal-workload-${var.environment}"
  display_name = "Zeal Workload Identity SA"
  project      = var.project_id
}

resource "google_project_iam_member" "workload_roles" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor",
    "roles/storage.objectViewer",
    "roles/cloudtrace.agent",
    "roles/logging.logWriter",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.zeal_workload.email}"
}

resource "google_service_account_iam_member" "workload_identity_binding" {
  service_account_id = google_service_account.zeal_workload.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[zeal/zeal-workload]"
}

output "cluster_name" {
  value = google_container_cluster.primary.name
}

output "cluster_endpoint" {
  value     = google_container_cluster.primary.endpoint
  sensitive = true
}

output "cluster_ca_certificate" {
  value     = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
  sensitive = true
}

output "workload_sa_email" {
  value = google_service_account.zeal_workload.email
}
```

**`terraform/modules/gke/variables.tf`**:

```hcl
variable "project_id" { type = string }
variable "region" { type = string }
variable "environment" { type = string }
variable "cluster_name" { type = string }
variable "vpc_name" { type = string }
variable "gke_subnet_name" { type = string }
```

### 3.4 Cloud SQL for PostgreSQL

**`terraform/modules/cloudsql/main.tf`**:

```hcl
resource "google_sql_database_instance" "zeal_postgres" {
  name                = "zeal-postgres-${var.environment}"
  database_version    = "POSTGRES_16"
  region              = var.region
  project             = var.project_id
  deletion_protection = var.environment == "production" ? true : false

  depends_on = [var.private_vpc_connection]

  settings {
    tier              = var.db_tier
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = var.environment == "production" ? 100 : 20
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = var.vpc_id
      enable_private_path_for_google_cloud_services = true
    }

    database_flags {
      name  = "cloudsql.enable_pgvector"
      value = "on"
    }

    database_flags {
      name  = "max_connections"
      value = "200"
    }

    database_flags {
      name  = "log_min_duration_statement"
      value = "1000"
    }

    database_flags {
      name  = "shared_preload_libraries"
      value = "vector"
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "02:00"
      transaction_log_retention_days = 7

      backup_retention_settings {
        retained_backups = var.environment == "production" ? 30 : 7
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day          = 7  # Sunday
      hour         = 3
      update_track = "stable"
    }

    insights_config {
      query_insights_enabled  = true
      record_application_tags = true
      record_client_address   = true
    }

    user_labels = {
      environment = var.environment
      platform    = "zeal"
      managed-by  = "terraform"
    }
  }
}

# Create the four domain databases
resource "google_sql_database" "databases" {
  for_each = toset([
    "zeal_foundation",
    "zeal_clinical",
    "zeal_rcm",
    "zeal_analytics",
  ])

  name     = each.value
  instance = google_sql_database_instance.zeal_postgres.name
  project  = var.project_id
}

# Root user
resource "google_sql_user" "root" {
  name     = "zeal_admin"
  instance = google_sql_database_instance.zeal_postgres.name
  password = var.db_password
  project  = var.project_id
}

# Per-database application users
resource "google_sql_user" "app_users" {
  for_each = tomap({
    "zeal_foundation_app" = "foundation"
    "zeal_clinical_app"   = "clinical"
    "zeal_rcm_app"        = "rcm"
    "zeal_analytics_app"  = "analytics"
  })

  name     = each.key
  instance = google_sql_database_instance.zeal_postgres.name
  password = var.db_password  # Use distinct passwords in production via Secret Manager
  project  = var.project_id
}

# Read replica for analytics (production only)
resource "google_sql_database_instance" "read_replica" {
  count                = var.environment == "production" ? 1 : 0
  name                 = "zeal-postgres-replica-${var.environment}"
  master_instance_name = google_sql_database_instance.zeal_postgres.name
  database_version     = "POSTGRES_16"
  region               = var.region
  project              = var.project_id

  replica_configuration {
    failover_target = false
  }

  settings {
    tier            = var.db_tier
    disk_type       = "PD_SSD"
    disk_size       = 100
    disk_autoresize = true

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_id
    }

    user_labels = {
      environment = var.environment
      role        = "read-replica"
    }
  }
}

output "instance_name" {
  value = google_sql_database_instance.zeal_postgres.name
}

output "instance_connection_name" {
  value = google_sql_database_instance.zeal_postgres.connection_name
}

output "private_ip" {
  value = google_sql_database_instance.zeal_postgres.private_ip_address
}
```

**`terraform/modules/cloudsql/variables.tf`**:

```hcl
variable "project_id" { type = string }
variable "region" { type = string }
variable "environment" { type = string }
variable "db_tier" { type = string }
variable "db_password" { type = string; sensitive = true }
variable "vpc_id" { type = string }
variable "private_vpc_connection" { type = string }
```

### 3.5 Memorystore for Redis

**`terraform/modules/memorystore/main.tf`**:

```hcl
resource "google_redis_instance" "zeal_redis" {
  name               = "zeal-redis-${var.environment}"
  tier               = var.environment == "production" ? "STANDARD_HA" : "BASIC"
  memory_size_gb     = var.environment == "production" ? 4 : 1
  region             = var.region
  project            = var.project_id
  redis_version      = "REDIS_7_0"
  display_name       = "Zeal Redis ${var.environment}"
  authorized_network = var.vpc_id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"

  auth_enabled            = true
  transit_encryption_mode = "SERVER_AUTHENTICATION"

  redis_configs = {
    maxmemory-policy = "allkeys-lru"
    notify-keyspace-events = ""
  }

  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 3
        minutes = 0
      }
    }
  }

  labels = {
    environment = var.environment
    platform    = "zeal"
    managed-by  = "terraform"
  }

  depends_on = [var.private_vpc_connection]
}

output "host" {
  value = google_redis_instance.zeal_redis.host
}

output "port" {
  value = google_redis_instance.zeal_redis.port
}

output "auth_string" {
  value     = google_redis_instance.zeal_redis.auth_string
  sensitive = true
}
```

**`terraform/modules/memorystore/variables.tf`**:

```hcl
variable "project_id" { type = string }
variable "region" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_vpc_connection" { type = string }
```

### 3.6 Artifact Registry

**`terraform/modules/artifact-registry/main.tf`**:

```hcl
resource "google_artifact_registry_repository" "zeal_docker" {
  location      = var.region
  repository_id = "zeal-docker"
  description   = "Docker images for Zeal healthcare platform"
  format        = "DOCKER"
  project       = var.project_id

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10
    }
  }

  cleanup_policies {
    id     = "delete-old-untagged"
    action = "DELETE"
    condition {
      older_than = "2592000s"  # 30 days
      tag_state  = "UNTAGGED"
    }
  }

  labels = {
    environment = var.environment
    platform    = "zeal"
  }
}

# Allow GKE nodes to pull images
resource "google_artifact_registry_repository_iam_member" "gke_reader" {
  project    = var.project_id
  location   = var.region
  repository = google_artifact_registry_repository.zeal_docker.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${var.gke_node_sa_email}"
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.zeal_docker.repository_id}"
}
```

**`terraform/modules/artifact-registry/variables.tf`**:

```hcl
variable "project_id" { type = string }
variable "region" { type = string }
variable "environment" { type = string }
variable "gke_node_sa_email" { type = string }
```

### 3.7 Cloud Storage

**`terraform/modules/storage/main.tf`**:

```hcl
resource "google_storage_bucket" "documents" {
  name          = "zeal-documents-${var.project_id}-${var.environment}"
  location      = var.region
  project       = var.project_id
  storage_class = "STANDARD"
  force_destroy = var.environment != "production"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 5
    }
  }

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
    condition {
      age = 90
    }
  }

  encryption {
    default_kms_key_name = var.kms_key_id
  }

  labels = {
    environment = var.environment
    data-class  = "phi"
  }
}

resource "google_storage_bucket" "frontend_assets" {
  name          = "zeal-frontend-${var.project_id}-${var.environment}"
  location      = var.region
  project       = var.project_id
  storage_class = "STANDARD"
  force_destroy = var.environment != "production"

  uniform_bucket_level_access = true

  cors {
    origin          = ["https://${var.domain}"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type", "Cache-Control"]
    max_age_seconds = 3600
  }

  labels = {
    environment = var.environment
    data-class  = "public"
  }
}

resource "google_storage_bucket_iam_member" "workload_documents" {
  bucket = google_storage_bucket.documents.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${var.workload_sa_email}"
}

output "documents_bucket" {
  value = google_storage_bucket.documents.name
}

output "frontend_bucket" {
  value = google_storage_bucket.frontend_assets.name
}
```

### 3.8 Cloud CDN and HTTPS Load Balancer

**`terraform/modules/load-balancer/main.tf`**:

```hcl
# Global static IP
resource "google_compute_global_address" "zeal_lb_ip" {
  name    = "zeal-lb-ip-${var.environment}"
  project = var.project_id
}

# Google-managed SSL certificate
resource "google_compute_managed_ssl_certificate" "zeal_cert" {
  name    = "zeal-cert-${var.environment}"
  project = var.project_id

  managed {
    domains = [var.domain, "api.${var.domain}"]
  }
}

# SSL policy (TLS 1.2+ only)
resource "google_compute_ssl_policy" "zeal_ssl_policy" {
  name            = "zeal-ssl-policy-${var.environment}"
  profile         = "RESTRICTED"
  min_tls_version = "TLS_1_2"
  project         = var.project_id
}

# Backend service (populated by GKE Ingress / NEGs)
# GKE Ingress controller creates backend services automatically when using
# the "networking.gke.io/v1" Ingress class with NEG annotations.
# The HTTPS LB, URL map, and target proxy are managed by GKE Ingress.

# HTTPS redirect
resource "google_compute_url_map" "https_redirect" {
  name    = "zeal-http-redirect-${var.environment}"
  project = var.project_id

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  name    = "zeal-http-proxy-${var.environment}"
  url_map = google_compute_url_map.https_redirect.id
  project = var.project_id
}

resource "google_compute_global_forwarding_rule" "http_redirect" {
  name       = "zeal-http-redirect-rule-${var.environment}"
  target     = google_compute_target_http_proxy.http_redirect.id
  port_range = "80"
  ip_address = google_compute_global_address.zeal_lb_ip.address
  project    = var.project_id
}

output "lb_ip_address" {
  value = google_compute_global_address.zeal_lb_ip.address
}
```

### 3.9 Cloud Armor

**`terraform/modules/cloud-armor/main.tf`**:

```hcl
resource "google_compute_security_policy" "zeal_waf" {
  name    = "zeal-waf-${var.environment}"
  project = var.project_id

  # Default allow rule
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }

  # Block SQL injection
  rule {
    action   = "deny(403)"
    priority = "1000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-v33-stable')"
      }
    }
    description = "Block SQL injection"
  }

  # Block XSS
  rule {
    action   = "deny(403)"
    priority = "1001"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-v33-stable')"
      }
    }
    description = "Block XSS"
  }

  # Block Remote Code Execution
  rule {
    action   = "deny(403)"
    priority = "1002"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('rce-v33-stable')"
      }
    }
    description = "Block RCE"
  }

  # Block Local File Inclusion
  rule {
    action   = "deny(403)"
    priority = "1003"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('lfi-v33-stable')"
      }
    }
    description = "Block LFI"
  }

  # Rate limiting
  rule {
    action   = "throttle"
    priority = "2000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      rate_limit_threshold {
        count        = 500
        interval_sec = 60
      }
    }
    description = "Rate limit: 500 req/min per IP"
  }

  # Stricter rate limit on auth endpoints
  rule {
    action   = "throttle"
    priority = "1500"
    match {
      expr {
        expression = "request.path.matches('/api/v1/auth/.*')"
      }
    }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      rate_limit_threshold {
        count        = 20
        interval_sec = 60
      }
    }
    description = "Rate limit auth endpoints: 20 req/min per IP"
  }
}

output "security_policy_id" {
  value = google_compute_security_policy.zeal_waf.id
}
```

### 3.10 Root Module

**`terraform/main.tf`**:

```hcl
module "networking" {
  source      = "./modules/networking"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
}

module "gke" {
  source          = "./modules/gke"
  project_id      = var.project_id
  region          = var.region
  environment     = var.environment
  cluster_name    = var.cluster_name
  vpc_name        = module.networking.vpc_name
  gke_subnet_name = module.networking.gke_subnet_name
  depends_on      = [module.networking]
}

module "cloudsql" {
  source                 = "./modules/cloudsql"
  project_id             = var.project_id
  region                 = var.region
  environment            = var.environment
  db_tier                = var.db_tier
  db_password            = var.db_password
  vpc_id                 = module.networking.vpc_id
  private_vpc_connection = module.networking.private_vpc_connection
  depends_on             = [module.networking]
}

module "memorystore" {
  source                 = "./modules/memorystore"
  project_id             = var.project_id
  region                 = var.region
  environment            = var.environment
  vpc_id                 = module.networking.vpc_id
  private_vpc_connection = module.networking.private_vpc_connection
  depends_on             = [module.networking]
}

module "artifact_registry" {
  source             = "./modules/artifact-registry"
  project_id         = var.project_id
  region             = var.region
  environment        = var.environment
  gke_node_sa_email  = module.gke.workload_sa_email
  depends_on         = [module.gke]
}

module "cloud_armor" {
  source      = "./modules/cloud-armor"
  project_id  = var.project_id
  environment = var.environment
}
```

**Apply the infrastructure:**

```bash
cd terraform/
terraform init
terraform plan -var="db_password=$(openssl rand -base64 24)" -out=tfplan
terraform apply tfplan
```

## 4. Building and Pushing Container Images

### Configure Docker for Artifact Registry

```bash
gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev

REGISTRY="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/zeal-docker"
```

### Build and Push All Services

```bash
# Build and push each service
SERVICES=("frontend" "foundation" "clinical" "rcm" "analytics" "prm" "ai-gateway")

for SERVICE in "${SERVICES[@]}"; do
  echo "Building ${SERVICE}..."

  if [ "$SERVICE" = "frontend" ]; then
    docker build -t ${REGISTRY}/zeal-frontend:latest \
      -f frontend/Dockerfile \
      --target production \
      frontend/
  else
    docker build -t ${REGISTRY}/zeal-${SERVICE}:latest \
      -f backend/services/${SERVICE}/Dockerfile \
      --target production \
      backend/
  fi

  docker push ${REGISTRY}/zeal-${SERVICE}:latest
done
```

### Alternative: Cloud Build

```bash
# Submit build to Cloud Build (no local Docker required)
gcloud builds submit \
  --tag ${REGISTRY}/zeal-foundation:$(git rev-parse --short HEAD) \
  --timeout=900s \
  backend/
```

## 5. Kubernetes Deployment

### Connect to GKE

```bash
gcloud container clusters get-credentials zeal-gke \
  --region $GCP_REGION \
  --project $GCP_PROJECT_ID
```

### 5.1 Namespaces and Resource Quotas

```yaml
# k8s/namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zeal
  labels:
    app.kubernetes.io/part-of: zeal
---
apiVersion: v1
kind: Namespace
metadata:
  name: zeal-observability
  labels:
    app.kubernetes.io/part-of: zeal-observability
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: zeal-quota
  namespace: zeal
spec:
  hard:
    requests.cpu: "16"
    requests.memory: 32Gi
    limits.cpu: "32"
    limits.memory: 64Gi
    pods: "50"
```

```bash
kubectl apply -f k8s/namespaces.yaml
```

### 5.2 ConfigMaps

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: zeal-config
  namespace: zeal
data:
  NODE_ENV: "production"
  # Database URLs use Cloud SQL Proxy (localhost:5432)
  FOUNDATION_DATABASE_URL: "postgresql://zeal_foundation_app:${DB_PASS}@localhost:5432/zeal_foundation?schema=public"
  CLINICAL_DATABASE_URL: "postgresql://zeal_clinical_app:${DB_PASS}@localhost:5432/zeal_clinical?schema=public"
  RCM_DATABASE_URL: "postgresql://zeal_rcm_app:${DB_PASS}@localhost:5432/zeal_rcm?schema=public"
  ANALYTICS_DATABASE_URL: "postgresql://zeal_analytics_app:${DB_PASS}@localhost:5432/zeal_analytics?schema=public"
  # Redis (Memorystore private IP)
  REDIS_HOST: "<memorystore-private-ip>"
  REDIS_PORT: "6379"
  REDIS_TLS: "true"
  # Internal service URLs
  FOUNDATION_SERVICE_URL: "http://zeal-foundation:3010"
  CLINICAL_SERVICE_URL: "http://zeal-clinical:3020"
  RCM_SERVICE_URL: "http://zeal-rcm:3030"
  ANALYTICS_SERVICE_URL: "http://zeal-analytics:3040"
  # OTel
  OTEL_EXPORTER_OTLP_ENDPOINT: "http://otel-collector.zeal-observability:4317"
```

### 5.3 Secrets (External Secrets Operator + Secret Manager)

Store secrets in GCP Secret Manager:

```bash
# Store DB password
echo -n "your-secure-password" | gcloud secrets create zeal-db-password \
  --data-file=- --replication-policy="user-managed" \
  --locations=$GCP_REGION

# Store Redis auth string
echo -n "redis-auth-string" | gcloud secrets create zeal-redis-auth \
  --data-file=- --replication-policy="user-managed" \
  --locations=$GCP_REGION

# Store JWT secret
echo -n "your-jwt-secret" | gcloud secrets create zeal-jwt-secret \
  --data-file=- --replication-policy="user-managed" \
  --locations=$GCP_REGION
```

Install External Secrets Operator:

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets \
  -n external-secrets --create-namespace
```

```yaml
# k8s/external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: gcp-secret-manager
spec:
  provider:
    gcpsm:
      projectID: zeal-healthcare-prod
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: zeal-secrets
  namespace: zeal
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: gcp-secret-manager
    kind: ClusterSecretStore
  target:
    name: zeal-app-secrets
    creationPolicy: Owner
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: zeal-db-password
    - secretKey: REDIS_AUTH
      remoteRef:
        key: zeal-redis-auth
    - secretKey: JWT_SECRET
      remoteRef:
        key: zeal-jwt-secret
```

### 5.4 Cloud SQL Proxy Sidecar Pattern

Every service deployment includes a Cloud SQL Proxy sidecar so pods connect to Cloud SQL over a private, authenticated channel without managing SSL certificates:

```yaml
# Sidecar container added to each service deployment
- name: cloud-sql-proxy
  image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.11.0
  args:
    - "--structured-logs"
    - "--private-ip"
    - "--port=5432"
    - "zeal-healthcare-prod:me-central2:zeal-postgres-production"
  securityContext:
    runAsNonRoot: true
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 128Mi
```

### 5.5 Deployments

```yaml
# k8s/deployments/foundation.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zeal-foundation
  namespace: zeal
  labels:
    app: zeal-foundation
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: zeal-foundation
  template:
    metadata:
      labels:
        app: zeal-foundation
        tier: backend
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3010"
    spec:
      serviceAccountName: zeal-workload
      containers:
        - name: foundation
          image: me-central2-docker.pkg.dev/zeal-healthcare-prod/zeal-docker/zeal-foundation:latest
          ports:
            - containerPort: 3010
          envFrom:
            - configMapRef:
                name: zeal-config
            - secretRef:
                name: zeal-app-secrets
          env:
            - name: SERVICE_NAME
              value: foundation
            - name: PORT
              value: "3010"
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: "1"
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3010
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3010
            initialDelaySeconds: 30
            periodSeconds: 30
        - name: cloud-sql-proxy
          image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.11.0
          args:
            - "--structured-logs"
            - "--private-ip"
            - "--port=5432"
            - "zeal-healthcare-prod:me-central2:zeal-postgres-production"
          securityContext:
            runAsNonRoot: true
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
```

Repeat the same pattern for clinical (port 3020), rcm (3030), analytics (3040), prm (3013), ai-gateway (3015), and frontend (3000). Change the `SERVICE_NAME`, `PORT`, and image accordingly.

### 5.6 Services and GKE Ingress

```yaml
# k8s/services.yaml
apiVersion: v1
kind: Service
metadata:
  name: zeal-frontend
  namespace: zeal
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
spec:
  type: ClusterIP
  selector:
    app: zeal-frontend
  ports:
    - port: 3000
      targetPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-foundation
  namespace: zeal
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
spec:
  type: ClusterIP
  selector:
    app: zeal-foundation
  ports:
    - port: 3010
      targetPort: 3010
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-clinical
  namespace: zeal
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
spec:
  type: ClusterIP
  selector:
    app: zeal-clinical
  ports:
    - port: 3020
      targetPort: 3020
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-rcm
  namespace: zeal
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
spec:
  type: ClusterIP
  selector:
    app: zeal-rcm
  ports:
    - port: 3030
      targetPort: 3030
---
apiVersion: v1
kind: Service
metadata:
  name: zeal-analytics
  namespace: zeal
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
spec:
  type: ClusterIP
  selector:
    app: zeal-analytics
  ports:
    - port: 3040
      targetPort: 3040
```

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zeal-ingress
  namespace: zeal
  annotations:
    kubernetes.io/ingress.class: "gce"
    kubernetes.io/ingress.global-static-ip-name: "zeal-lb-ip-production"
    networking.gke.io/managed-certificates: "zeal-cert"
    kubernetes.io/ingress.allow-http: "false"
spec:
  rules:
    - host: zeal.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: zeal-frontend
                port:
                  number: 3000
    - host: api.zeal.example.com
      http:
        paths:
          - path: /api/v1/foundation
            pathType: Prefix
            backend:
              service:
                name: zeal-foundation
                port:
                  number: 3010
          - path: /api/v1/clinical
            pathType: Prefix
            backend:
              service:
                name: zeal-clinical
                port:
                  number: 3020
          - path: /api/v1/rcm
            pathType: Prefix
            backend:
              service:
                name: zeal-rcm
                port:
                  number: 3030
          - path: /api/v1/analytics
            pathType: Prefix
            backend:
              service:
                name: zeal-analytics
                port:
                  number: 3040
```

```yaml
# k8s/managed-cert.yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: zeal-cert
  namespace: zeal
spec:
  domains:
    - zeal.example.com
    - api.zeal.example.com
```

### 5.7 HPA and PDBs

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: zeal-foundation-hpa
  namespace: zeal
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
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: zeal-foundation-pdb
  namespace: zeal
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: zeal-foundation
```

Apply identical HPA/PDB resources for clinical, rcm, analytics, and frontend deployments.

## 6. Helm Chart Deployment

**`helm/values-gcp.yaml`**:

```yaml
global:
  environment: production
  cloudProvider: gcp
  region: me-central2
  registry: me-central2-docker.pkg.dev/zeal-healthcare-prod/zeal-docker
  imageTag: latest

frontend:
  replicaCount: 2
  image: zeal-frontend
  port: 3000
  resources:
    requests: { cpu: 250m, memory: 256Mi }
    limits: { cpu: "1", memory: 512Mi }

services:
  foundation:
    replicaCount: 2
    image: zeal-foundation
    port: 3010
  clinical:
    replicaCount: 2
    image: zeal-clinical
    port: 3020
  rcm:
    replicaCount: 2
    image: zeal-rcm
    port: 3030
  analytics:
    replicaCount: 2
    image: zeal-analytics
    port: 3040
  prm:
    replicaCount: 1
    image: zeal-prm
    port: 3013
  aiGateway:
    replicaCount: 1
    image: zeal-ai-gateway
    port: 3015

cloudSqlProxy:
  enabled: true
  image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.11.0
  instanceConnectionName: "zeal-healthcare-prod:me-central2:zeal-postgres-production"

redis:
  host: "<memorystore-private-ip>"
  port: 6379
  tls: true

ingress:
  enabled: true
  className: gce
  hosts:
    - zeal.example.com
    - api.zeal.example.com
  tls:
    managedCertificate: true
```

```bash
helm upgrade --install zeal ./helm/zeal-platform \
  --namespace zeal \
  --values helm/values-gcp.yaml \
  --set cloudSqlProxy.instanceConnectionName="$(terraform -chdir=terraform output -raw cloudsql_connection_name)" \
  --set redis.host="$(terraform -chdir=terraform output -raw redis_host)" \
  --wait --timeout 10m
```

## 7. Networking and SSL/TLS

### Google-Managed Certificates

Certificates are provisioned automatically via the `ManagedCertificate` resource (see section 5.6). Provisioning takes 15-60 minutes while Google verifies domain ownership.

### Cloud DNS

```bash
# Create managed zone
gcloud dns managed-zones create zeal-zone \
  --dns-name="zeal.example.com." \
  --description="Zeal platform DNS" \
  --visibility=public

# Point domain to LB IP
LB_IP=$(terraform -chdir=terraform output -raw lb_ip_address)

gcloud dns record-sets create zeal.example.com. \
  --zone=zeal-zone --type=A --ttl=300 --rrdatas=$LB_IP

gcloud dns record-sets create api.zeal.example.com. \
  --zone=zeal-zone --type=A --ttl=300 --rrdatas=$LB_IP
```

### SSL Policy

The Terraform module (section 3.8) creates a RESTRICTED SSL policy enforcing TLS 1.2+. To attach it to the GKE Ingress load balancer:

```bash
# Get the target HTTPS proxy name created by GKE Ingress
PROXY_NAME=$(gcloud compute target-https-proxies list --format="value(name)" \
  --filter="name~zeal")

gcloud compute target-https-proxies update $PROXY_NAME \
  --ssl-policy=zeal-ssl-policy-production
```

## 8. Secrets Management

### Secret Manager with Workload Identity

Pods authenticate to Secret Manager via Workload Identity (no service account keys):

```bash
# Annotate the Kubernetes service account
kubectl annotate serviceaccount zeal-workload \
  --namespace=zeal \
  iam.gke.io/gcp-service-account=zeal-workload-production@zeal-healthcare-prod.iam.gserviceaccount.com
```

### Rotating Secrets

```bash
# Add a new version
echo -n "new-password" | gcloud secrets versions add zeal-db-password --data-file=-

# External Secrets Operator polls every refreshInterval (1h by default)
# Force immediate refresh:
kubectl annotate externalsecret zeal-secrets \
  -n zeal force-sync=$(date +%s) --overwrite
```

## 9. CI/CD Pipeline

### GitHub Actions with Workload Identity Federation

Set up Workload Identity Federation so GitHub Actions authenticates without service account keys:

```bash
# Create Workload Identity Pool
gcloud iam workload-identity-pools create github-pool \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create Provider
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub OIDC" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Allow GitHub repo to impersonate SA
gcloud iam service-accounts add-iam-policy-binding \
  "zeal-terraform@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/your-org/zeal"
```

### Full Workflow

**`.github/workflows/deploy-gcp.yml`**:

```yaml
name: Deploy to GCP

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  GCP_PROJECT_ID: zeal-healthcare-prod
  GCP_REGION: me-central2
  GKE_CLUSTER: zeal-gke
  REGISTRY: me-central2-docker.pkg.dev/zeal-healthcare-prod/zeal-docker

permissions:
  id-token: write
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service:
          - { name: frontend, context: frontend, dockerfile: frontend/Dockerfile, port: 3000 }
          - { name: foundation, context: backend, dockerfile: backend/services/foundation/Dockerfile, port: 3010 }
          - { name: clinical, context: backend, dockerfile: backend/services/clinical/Dockerfile, port: 3020 }
          - { name: rcm, context: backend, dockerfile: backend/services/rcm/Dockerfile, port: 3030 }
          - { name: analytics, context: backend, dockerfile: backend/services/analytics/Dockerfile, port: 3040 }

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
          service_account: "zeal-terraform@zeal-healthcare-prod.iam.gserviceaccount.com"

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev --quiet

      - name: Build and push
        run: |
          IMAGE_TAG="${{ github.sha }}"
          docker build \
            -t ${REGISTRY}/zeal-${{ matrix.service.name }}:${IMAGE_TAG} \
            -t ${REGISTRY}/zeal-${{ matrix.service.name }}:latest \
            -f ${{ matrix.service.dockerfile }} \
            --target production \
            ${{ matrix.service.context }}
          docker push ${REGISTRY}/zeal-${{ matrix.service.name }}:${IMAGE_TAG}
          docker push ${REGISTRY}/zeal-${{ matrix.service.name }}:latest

      - name: Get GKE credentials
        uses: google-github-actions/get-gke-credentials@v2
        with:
          cluster_name: ${{ env.GKE_CLUSTER }}
          location: ${{ env.GCP_REGION }}

      - name: Deploy to GKE
        run: |
          kubectl set image deployment/zeal-${{ matrix.service.name }} \
            ${{ matrix.service.name }}=${REGISTRY}/zeal-${{ matrix.service.name }}:${{ github.sha }} \
            -n zeal
          kubectl rollout status deployment/zeal-${{ matrix.service.name }} -n zeal --timeout=300s

  helm-deploy:
    needs: build-and-deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
          service_account: "zeal-terraform@zeal-healthcare-prod.iam.gserviceaccount.com"

      - name: Get GKE credentials
        uses: google-github-actions/get-gke-credentials@v2
        with:
          cluster_name: ${{ env.GKE_CLUSTER }}
          location: ${{ env.GCP_REGION }}

      - name: Deploy via Helm
        run: |
          helm upgrade --install zeal ./helm/zeal-platform \
            --namespace zeal \
            --values helm/values-gcp.yaml \
            --set global.imageTag=${{ github.sha }} \
            --wait --timeout 10m
```

## 10. Observability

### Option A: GCP-Native (Cloud Operations Suite)

GKE automatically ships container logs and node metrics to Cloud Logging and Cloud Monitoring. Enable workload-level metrics:

```bash
# Verify logging and monitoring are enabled on the cluster
gcloud container clusters describe zeal-gke --region $GCP_REGION \
  --format="value(loggingConfig,monitoringConfig)"
```

Cloud Trace is enabled by configuring the OTel SDK in each service to export to Cloud Trace:

```bash
# Set environment variable in ConfigMap
OTEL_EXPORTER_OTLP_ENDPOINT: "https://cloudtrace.googleapis.com"
```

Create alerting policies:

```bash
# Alert on high error rate
gcloud alpha monitoring policies create \
  --display-name="Zeal High Error Rate" \
  --condition-display-name="5xx error rate > 1%" \
  --condition-filter='resource.type="k8s_container" AND metric.type="logging.googleapis.com/user/zeal_http_5xx"' \
  --condition-threshold-value=0.01 \
  --condition-threshold-comparison=COMPARISON_GT \
  --notification-channels="projects/${GCP_PROJECT_ID}/notificationChannels/CHANNEL_ID"
```

### Option B: Self-Hosted OTel Stack

Deploy the OTel Collector, Prometheus, Loki, Tempo, and Grafana into the `zeal-observability` namespace using the spot node pool:

```bash
# Add Helm repos
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update

# OTel Collector
helm install otel-collector open-telemetry/opentelemetry-collector \
  --namespace zeal-observability \
  --set mode=deployment \
  --set tolerations[0].key=cloud.google.com/gke-spot \
  --set tolerations[0].operator=Exists \
  --set tolerations[0].effect=NoSchedule

# Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace zeal-observability \
  --set grafana.enabled=true \
  --set prometheus.prometheusSpec.tolerations[0].key=cloud.google.com/gke-spot \
  --set prometheus.prometheusSpec.tolerations[0].operator=Exists \
  --set prometheus.prometheusSpec.tolerations[0].effect=NoSchedule

# Loki (log aggregation)
helm install loki grafana/loki-stack \
  --namespace zeal-observability \
  --set loki.persistence.enabled=true \
  --set loki.persistence.size=50Gi

# Tempo (distributed tracing)
helm install tempo grafana/tempo \
  --namespace zeal-observability \
  --set persistence.enabled=true
```

## 11. Healthcare Compliance

### Data Residency

> **CRITICAL:** GCP has no region within the UAE. For deployments subject to UAE healthcare
> regulations (DHA, DOH, MOHAP), patient health information (PHI) must remain within UAE borders.
> Using me-central2 (Doha, Qatar) does NOT satisfy UAE data residency requirements.
>
> Use this GCP deployment only where:
> - The tenant operates outside the UAE
> - Regulatory counsel has confirmed GCC-region hosting is acceptable
> - The deployment is non-production (dev/staging with synthetic data)

### Organisation Policy Constraints

Lock down resource creation to approved regions:

```bash
# Restrict compute resources to Middle East regions only
gcloud resource-manager org-policies set-policy \
  --project=$GCP_PROJECT_ID policy.yaml
```

```yaml
# policy.yaml
constraint: constraints/gcp.resourceLocations
listPolicy:
  allowedValues:
    - in:me-central2-locations
    - in:me-west1-locations
  deniedValues:
    - in:us-locations
    - in:eu-locations
```

### Customer-Managed Encryption Keys (CMEK)

```bash
# Create KMS keyring and key
gcloud kms keyrings create zeal-keyring \
  --location=$GCP_REGION

gcloud kms keys create zeal-data-key \
  --keyring=zeal-keyring \
  --location=$GCP_REGION \
  --purpose=encryption \
  --rotation-period=90d \
  --next-rotation-time=$(date -u -v+90d +%Y-%m-%dT%H:%M:%SZ)

# Grant Cloud SQL service account access to the key
SA=$(gcloud sql instances describe zeal-postgres-production \
  --format="value(serviceAccountEmailAddress)")

gcloud kms keys add-iam-policy-binding zeal-data-key \
  --keyring=zeal-keyring \
  --location=$GCP_REGION \
  --member="serviceAccount:${SA}" \
  --role="roles/cloudkms.cryptoKeyEncrypterDecrypter"
```

### VPC Service Controls

Create a service perimeter to isolate PHI-handling services:

```bash
gcloud access-context-manager perimeters create zeal-phi-perimeter \
  --title="Zeal PHI Perimeter" \
  --resources="projects/PROJECT_NUMBER" \
  --restricted-services="sqladmin.googleapis.com,storage.googleapis.com,secretmanager.googleapis.com" \
  --policy=POLICY_ID
```

### Audit Logging

```bash
# Enable Data Access audit logs for all services
gcloud projects set-iam-policy $GCP_PROJECT_ID <(
  gcloud projects get-iam-policy $GCP_PROJECT_ID --format=json | \
  jq '.auditConfigs += [{"service": "allServices", "auditLogConfigs": [{"logType": "ADMIN_READ"}, {"logType": "DATA_READ"}, {"logType": "DATA_WRITE"}]}]'
)
```

## 12. Scaling and High Availability

### GKE Autoscaling

The cluster autoscaler (configured in section 3.3) automatically provisions nodes when pods cannot be scheduled. Node auto-provisioning can create new node pools on demand:

```bash
gcloud container clusters update zeal-gke \
  --region $GCP_REGION \
  --enable-autoprovisioning \
  --min-cpu 4 --max-cpu 64 \
  --min-memory 16 --max-memory 256
```

### Cloud SQL HA

Production Cloud SQL is configured with `availability_type = "REGIONAL"` (section 3.4), which maintains a synchronous standby in a different zone. Failover is automatic with a typical duration of under 60 seconds.

### Memorystore HA

`STANDARD_HA` tier (section 3.5) maintains a replica in a different zone. Failover is automatic and transparent to clients.

## 13. Disaster Recovery

### Cloud SQL Cross-Region Replicas

```bash
gcloud sql instances create zeal-postgres-dr \
  --master-instance-name=zeal-postgres-production \
  --region=europe-west1 \
  --tier=db-custom-4-16384 \
  --no-assign-ip \
  --network=projects/${GCP_PROJECT_ID}/global/networks/zeal-vpc-production
```

### Multi-Region Storage

```bash
gsutil mb -l ME -c STANDARD gs://zeal-backups-${GCP_PROJECT_ID}/
# ME = dual-region in Middle East

# Export Cloud SQL backup to GCS
gcloud sql export sql zeal-postgres-production \
  gs://zeal-backups-${GCP_PROJECT_ID}/$(date +%Y%m%d)-export.sql \
  --database=zeal_foundation,zeal_clinical,zeal_rcm,zeal_analytics
```

### GKE Multi-Cluster (DR)

For active-passive DR, deploy a secondary GKE cluster in another region and use Multi Cluster Ingress:

```bash
# Register clusters with a fleet
gcloud container fleet memberships register zeal-gke-primary \
  --gke-cluster=${GCP_REGION}/zeal-gke \
  --enable-workload-identity

gcloud container fleet memberships register zeal-gke-dr \
  --gke-cluster=europe-west1/zeal-gke-dr \
  --enable-workload-identity

# Enable Multi Cluster Ingress
gcloud container fleet ingress enable \
  --config-membership=zeal-gke-primary
```

### Backup Schedule

| Component | RPO | RTO | Method |
|-----------|-----|-----|--------|
| Cloud SQL | 5 min | < 1 hr | PITR + automated backups |
| GCS Documents | 0 (versioned) | Minutes | Object versioning + cross-region |
| GKE Config | 0 (GitOps) | < 30 min | Redeploy from Git |
| Secrets | 0 (versioned) | Minutes | Secret Manager versioning |

## 14. Cost Estimation

Monthly estimates in USD for me-central2 (Doha):

| Resource | Small (Dev/Staging) | Medium (Production) | Large (Scale) |
|----------|--------------------|--------------------|---------------|
| GKE Control Plane | $73 | $73 | $73 |
| GKE Nodes (e2-standard-4) | $290 (2 nodes) | $870 (6 nodes) | $1,450 (10 nodes) |
| GKE Spot Nodes | $0 | $60 (2 nodes) | $150 (5 nodes) |
| Cloud SQL (db-custom-4-16384) | $180 (zonal) | $360 (regional HA) | $720 (HA + replica) |
| Cloud SQL Storage (100GB SSD) | $17 | $34 | $68 |
| Memorystore Redis (1-4GB) | $35 (Basic 1GB) | $175 (HA 4GB) | $350 (HA 8GB) |
| Artifact Registry | $5 | $10 | $20 |
| Cloud Storage (50-500GB) | $1 | $10 | $50 |
| Cloud Load Balancer | $20 | $20 | $20 |
| Cloud NAT | $32 | $45 | $65 |
| Cloud Armor | $0 (basic) | $5 | $5 |
| Networking (egress) | $10 | $50 | $200 |
| Secret Manager | $1 | $1 | $2 |
| **Monthly Total** | **~$664** | **~$1,713** | **~$3,173** |

### Cost Optimization

- **Committed Use Discounts (CUDs):** 1-year CUDs save ~37%, 3-year CUDs save ~55% on compute and Cloud SQL.
- **Spot VMs:** Use for observability stack, batch jobs, and non-critical workloads (60-91% savings).
- **Right-sizing:** Use GKE cost optimization recommendations in the Cloud Console.
- **Preemptible node pools:** Already configured for the spot pool in section 3.3.

## 15. Troubleshooting

### GKE Pod Scheduling Issues

```bash
# Check pending pods
kubectl get pods -n zeal --field-selector=status.phase=Pending

# Describe pod for scheduling failure reason
kubectl describe pod <pod-name> -n zeal | grep -A 10 Events

# Check node resources
kubectl top nodes
kubectl describe nodes | grep -A 5 "Allocated resources"

# If nodes are not scaling up
gcloud container clusters describe zeal-gke --region $GCP_REGION \
  --format="value(autoscaling)"
```

### Cloud SQL Connectivity

```bash
# Verify Cloud SQL Proxy sidecar is running
kubectl get pods -n zeal -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .spec.containers[*]}{.name}{" "}{end}{"\n"}{end}'

# Check Cloud SQL Proxy logs
kubectl logs <pod-name> -n zeal -c cloud-sql-proxy

# Verify the instance is reachable from within the pod
kubectl exec -it <pod-name> -n zeal -c foundation -- \
  pg_isready -h localhost -p 5432

# Common error: "connection refused" - check instance connection name
gcloud sql instances describe zeal-postgres-production \
  --format="value(connectionName)"
```

### Workload Identity Misconfiguration

```bash
# Verify KSA annotation
kubectl get serviceaccount zeal-workload -n zeal -o yaml | grep iam.gke.io

# Verify GSA IAM binding
gcloud iam service-accounts get-iam-policy \
  zeal-workload-production@${GCP_PROJECT_ID}.iam.gserviceaccount.com

# Test from inside a pod
kubectl run test-wi --rm -it --image=google/cloud-sdk:slim \
  --serviceaccount=zeal-workload -n zeal -- \
  gcloud auth list
```

### Cloud NAT Port Exhaustion

```bash
# Check NAT gateway status
gcloud compute routers nats describe zeal-nat-production \
  --router=zeal-router-production --region=$GCP_REGION

# If seeing "OUT_OF_RESOURCES" errors, increase min ports per VM:
gcloud compute routers nats update zeal-nat-production \
  --router=zeal-router-production \
  --region=$GCP_REGION \
  --min-ports-per-vm=4096
```

### Artifact Registry Pull Failures

```bash
# Verify GKE node SA has artifactregistry.reader role
gcloud artifacts repositories get-iam-policy zeal-docker \
  --location=$GCP_REGION

# Check for image pull errors
kubectl get events -n zeal --field-selector reason=Failed | grep -i pull

# Manual pull test from a node
gcloud compute ssh <node-name> --zone=$GCP_ZONE -- \
  "docker pull ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/zeal-docker/zeal-foundation:latest"
```

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `googleapi: Error 403: Required 'compute.networks.create'` | Missing IAM role | Grant `roles/compute.admin` to SA |
| `Error: Cloud SQL instance already exists` | Name conflict | Cloud SQL instance names are globally reserved for 7 days after deletion. Use a different name |
| `connection refused` on port 5432 | Cloud SQL Proxy not running or wrong instance name | Check sidecar logs, verify `instanceConnectionName` |
| `Workload Identity Pool does not exist` | WI not set up or wrong project number | Verify pool exists: `gcloud iam workload-identity-pools list --location=global` |
| `PERMISSION_DENIED: Request had insufficient scopes` | Node SA missing OAuth scopes | Recreate node pool with `--scopes=cloud-platform` |
| `OUT_OF_RESOURCES` from Cloud NAT | Port exhaustion | Increase `min-ports-per-vm` on the NAT gateway |
| `ManagedCertificate not provisioning` | DNS not pointing to LB IP | Verify A record resolves to the LB static IP |
| `ImagePullBackOff` | AR auth failure or image not found | Run `gcloud auth configure-docker`, verify image tag exists |
