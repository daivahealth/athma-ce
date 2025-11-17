-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "staff_id" UUID,
    "default_facility_id" UUID,
    "last_login" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(50),
    "facility_type" TEXT NOT NULL DEFAULT 'clinic',
    "license_number" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "emirate" TEXT,
    "postal_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'UAE',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "google_place_id" VARCHAR(255),
    "phone_number" TEXT,
    "email" TEXT,
    "website" TEXT,
    "building_number" VARCHAR(50),
    "floor_numbers" TEXT[],
    "total_floors" INTEGER,
    "capacity" INTEGER,
    "operating_hours" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(50),
    "department_type" TEXT NOT NULL,
    "specialty_id" UUID,
    "head_of_department" UUID,
    "floor_number" VARCHAR(10),
    "phone_extension" VARCHAR(20),
    "operating_hours" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wards" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(50),
    "ward_type" TEXT NOT NULL,
    "floor_number" VARCHAR(10),
    "total_beds" INTEGER NOT NULL DEFAULT 0,
    "available_beds" INTEGER NOT NULL DEFAULT 0,
    "nursing_station" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beds" (
    "id" UUID NOT NULL,
    "ward_id" UUID NOT NULL,
    "bed_number" VARCHAR(20) NOT NULL,
    "bed_type" TEXT NOT NULL,
    "features" JSONB,
    "status" TEXT NOT NULL DEFAULT 'available',
    "current_patient_id" UUID,
    "assigned_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "beds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(50),
    "specialty" TEXT,
    "floor_number" VARCHAR(10),
    "total_rooms" INTEGER NOT NULL DEFAULT 0,
    "operating_hours" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "department_id" UUID,
    "clinic_id" UUID,
    "name" TEXT NOT NULL,
    "space_number" TEXT,
    "space_type" TEXT NOT NULL,
    "floor_number" VARCHAR(10),
    "equipment" JSONB NOT NULL DEFAULT '[]',
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "prefix" VARCHAR(20),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "date_of_birth" DATE NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL DEFAULT 'UAE',
    "phone_number" TEXT,
    "email" TEXT,
    "employee_id" TEXT NOT NULL,
    "staff_type" TEXT NOT NULL,
    "specialties" JSONB NOT NULL DEFAULT '[]',
    "license_number" TEXT,
    "license_expiry" DATE,
    "qualification" VARCHAR(150),
    "languages" VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
    "display_name" VARCHAR(255),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialty_codes_authority" (
    "id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,
    "authority" VARCHAR(20) NOT NULL,
    "authority_code" VARCHAR(50) NOT NULL,
    "authority_name" VARCHAR(150),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "specialty_codes_authority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_specialties" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,
    "primary_flag" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "staff_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialty_translations" (
    "id" UUID NOT NULL,
    "specialty_id" UUID NOT NULL,
    "lang" CHAR(2) NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "specialty_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT,
    "action" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_by" UUID,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mfa_settings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "totp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "totp_secret" TEXT,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "sms_phone_number" TEXT,
    "email_enabled" BOOLEAN NOT NULL DEFAULT false,
    "backup_codes_count" INTEGER NOT NULL DEFAULT 0,
    "last_used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_mfa_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mfa_backup_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_mfa_backup_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mfa_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "method" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_mfa_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_trusted_devices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "device_name" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "trusted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_trusted_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_facilities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "access_level" TEXT NOT NULL DEFAULT 'standard',
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by" UUID,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instance_configs" (
    "id" UUID NOT NULL,
    "config_key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "value_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "is_overridable" BOOLEAN NOT NULL DEFAULT true,
    "is_sensitive" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "instance_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_configs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "config_key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "tenant_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_configs" (
    "id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "config_key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "facility_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_audit_log" (
    "id" UUID NOT NULL,
    "config_level" TEXT NOT NULL,
    "config_key" TEXT NOT NULL,
    "entity_id" UUID,
    "old_value" JSONB,
    "new_value" JSONB NOT NULL,
    "changed_by" UUID NOT NULL,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_reason" TEXT,

    CONSTRAINT "config_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_sets" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50),
    "version" VARCHAR(20),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_extensible" BOOLEAN NOT NULL DEFAULT true,
    "source" VARCHAR(255),
    "source_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "value_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_set_concepts" (
    "id" UUID NOT NULL,
    "value_set_id" UUID NOT NULL,
    "value_set_code" VARCHAR(100) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "display" VARCHAR(500) NOT NULL,
    "definition" TEXT,
    "system_code" VARCHAR(100),
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "effective_from" DATE,
    "effective_to" DATE,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "value_set_concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_set_concept_translations" (
    "id" UUID NOT NULL,
    "concept_id" UUID NOT NULL,
    "language_code" VARCHAR(10) NOT NULL,
    "display" VARCHAR(500) NOT NULL,
    "definition" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "value_set_concept_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_value_set_overrides" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "value_set_id" UUID NOT NULL,
    "concept_id" UUID,
    "override_type" VARCHAR(20) NOT NULL,
    "custom_display" VARCHAR(500),
    "custom_metadata" JSONB,
    "sort_order" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "tenant_value_set_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_set_history" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "changed_by" UUID,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_reason" TEXT,

    CONSTRAINT "value_set_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_master" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "medication_name" VARCHAR(255) NOT NULL,
    "generic_name" VARCHAR(255),
    "brand_name" VARCHAR(255),
    "ndc_code" VARCHAR(20),
    "atc_code" VARCHAR(20),
    "local_code" VARCHAR(100),
    "dosage_form" VARCHAR(50) NOT NULL,
    "strength" VARCHAR(100),
    "route" VARCHAR(50),
    "manufacturer" VARCHAR(255),
    "drug_class" VARCHAR(100),
    "therapeutic_class" VARCHAR(100),
    "controlled_substance" BOOLEAN NOT NULL DEFAULT false,
    "controlled_class" VARCHAR(50),
    "requires_prescription" BOOLEAN NOT NULL DEFAULT true,
    "default_frequency" VARCHAR(100),
    "default_duration" VARCHAR(100),
    "contraindications" TEXT[],
    "common_side_effects" TEXT[],
    "drug_interactions" TEXT[],
    "storage_requirements" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "medication_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_test_master" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "test_name" VARCHAR(255) NOT NULL,
    "loinc_code" VARCHAR(20) NOT NULL,
    "cpt_code" VARCHAR(10),
    "local_code" VARCHAR(100),
    "test_category" VARCHAR(100) NOT NULL,
    "test_subcategory" VARCHAR(100),
    "specimen_type" VARCHAR(100) NOT NULL,
    "collection_method" VARCHAR(100),
    "fasting_required" BOOLEAN NOT NULL DEFAULT false,
    "fasting_duration_hours" INTEGER,
    "preparation_instructions" TEXT,
    "normal_range_male" VARCHAR(100),
    "normal_range_female" VARCHAR(100),
    "normal_range_pediatric" VARCHAR(100),
    "units" VARCHAR(50),
    "methodology" VARCHAR(255),
    "turnaround_time_hours" INTEGER,
    "reference_lab" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lab_test_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imaging_study_master" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "study_name" VARCHAR(255) NOT NULL,
    "cpt_code" VARCHAR(10),
    "local_code" VARCHAR(100),
    "modality" VARCHAR(50) NOT NULL,
    "body_part" VARCHAR(100) NOT NULL,
    "study_category" VARCHAR(100),
    "contrast_required" BOOLEAN NOT NULL DEFAULT false,
    "contrast_type" VARCHAR(100),
    "preparation_instructions" TEXT,
    "positioning_instructions" TEXT,
    "contraindications" TEXT[],
    "radiation_dose" VARCHAR(100),
    "estimated_duration_minutes" INTEGER,
    "facility_requirements" VARCHAR(255),
    "equipment_requirements" VARCHAR(255),
    "radiologist_required" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "imaging_study_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure_master" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "procedure_name" VARCHAR(255) NOT NULL,
    "cpt_code" VARCHAR(10),
    "icd10_pcs_code" VARCHAR(10),
    "local_code" VARCHAR(100),
    "procedure_category" VARCHAR(100) NOT NULL,
    "body_system" VARCHAR(100) NOT NULL,
    "procedure_type" VARCHAR(100),
    "anesthesia_type" VARCHAR(50),
    "facility_required" VARCHAR(50),
    "estimated_duration_minutes" INTEGER,
    "preparation_instructions" TEXT,
    "post_procedure_instructions" TEXT,
    "risks_and_complications" TEXT[],
    "contraindications" TEXT[],
    "consent_required" BOOLEAN NOT NULL DEFAULT false,
    "consent_type" VARCHAR(100),
    "pre_procedure_requirements" TEXT[],
    "post_procedure_monitoring" TEXT,
    "recovery_time_hours" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "procedure_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis_master" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "version_id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "code_type" VARCHAR(50),
    "short_description" VARCHAR(255),
    "description" TEXT NOT NULL,
    "chapter" VARCHAR(100),
    "block" VARCHAR(100),
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "clinical_concepts" TEXT[],
    "synonyms" TEXT[],
    "search_terms" TEXT[],
    "gender_restriction" VARCHAR(20),
    "age_range" VARCHAR(50),
    "is_billable" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_from" DATE,
    "effective_to" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "diagnosis_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis_versions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "code_set" VARCHAR(50) NOT NULL,
    "version_label" VARCHAR(100) NOT NULL,
    "release_date" DATE,
    "description" TEXT,
    "import_status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "import_notes" TEXT,
    "source_url" VARCHAR(255),
    "checksum" VARCHAR(128),
    "total_codes" INTEGER NOT NULL DEFAULT 0,
    "imported_by" UUID,
    "imported_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "diagnosis_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_name_key" ON "tenants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- CreateIndex
CREATE INDEX "users_tenant_id_default_facility_id_idx" ON "users"("tenant_id", "default_facility_id");

-- CreateIndex
CREATE INDEX "users_tenant_id_staff_id_idx" ON "users"("tenant_id", "staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenant_id_email_key" ON "users"("tenant_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_staff_id_key" ON "users"("staff_id");

-- CreateIndex
CREATE INDEX "facilities_tenant_id_facility_type_idx" ON "facilities"("tenant_id", "facility_type");

-- CreateIndex
CREATE INDEX "facilities_tenant_id_city_idx" ON "facilities"("tenant_id", "city");

-- CreateIndex
CREATE INDEX "facilities_tenant_id_emirate_idx" ON "facilities"("tenant_id", "emirate");

-- CreateIndex
CREATE INDEX "facilities_latitude_longitude_idx" ON "facilities"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_tenant_id_code_key" ON "facilities"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "departments_facility_id_department_type_idx" ON "departments"("facility_id", "department_type");

-- CreateIndex
CREATE INDEX "departments_specialty_id_idx" ON "departments"("specialty_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_facility_id_code_key" ON "departments"("facility_id", "code");

-- CreateIndex
CREATE INDEX "wards_department_id_ward_type_idx" ON "wards"("department_id", "ward_type");

-- CreateIndex
CREATE UNIQUE INDEX "wards_department_id_code_key" ON "wards"("department_id", "code");

-- CreateIndex
CREATE INDEX "beds_ward_id_status_idx" ON "beds"("ward_id", "status");

-- CreateIndex
CREATE INDEX "beds_current_patient_id_idx" ON "beds"("current_patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "beds_ward_id_bed_number_key" ON "beds"("ward_id", "bed_number");

-- CreateIndex
CREATE INDEX "clinics_department_id_specialty_idx" ON "clinics"("department_id", "specialty");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_department_id_code_key" ON "clinics"("department_id", "code");

-- CreateIndex
CREATE INDEX "spaces_facility_id_department_id_idx" ON "spaces"("facility_id", "department_id");

-- CreateIndex
CREATE INDEX "spaces_clinic_id_idx" ON "spaces"("clinic_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_tenant_id_employee_id_key" ON "staff"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_code_key" ON "specialties"("code");

-- CreateIndex
CREATE INDEX "specialties_code_idx" ON "specialties"("code");

-- CreateIndex
CREATE INDEX "specialty_codes_authority_authority_authority_code_idx" ON "specialty_codes_authority"("authority", "authority_code");

-- CreateIndex
CREATE UNIQUE INDEX "ux_specialty_authority" ON "specialty_codes_authority"("specialty_id", "authority");

-- CreateIndex
CREATE INDEX "staff_specialties_staff_id_idx" ON "staff_specialties"("staff_id");

-- CreateIndex
CREATE INDEX "staff_specialties_specialty_id_idx" ON "staff_specialties"("specialty_id");

-- CreateIndex
CREATE INDEX "staff_specialties_tenant_id_idx" ON "staff_specialties"("tenant_id");

-- CreateIndex
CREATE INDEX "staff_specialties_facility_id_idx" ON "staff_specialties"("facility_id");

-- CreateIndex
CREATE INDEX "staff_specialties_facility_id_specialty_id_idx" ON "staff_specialties"("facility_id", "specialty_id");

-- CreateIndex
CREATE INDEX "staff_specialties_facility_id_staff_id_idx" ON "staff_specialties"("facility_id", "staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "ux_staff_specialty_facility" ON "staff_specialties"("staff_id", "specialty_id", "facility_id");

-- CreateIndex
CREATE INDEX "specialty_translations_specialty_id_lang_idx" ON "specialty_translations"("specialty_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "ux_specialty_lang" ON "specialty_translations"("specialty_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "roles_tenant_id_code_key" ON "roles"("tenant_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_mfa_settings_user_id_key" ON "user_mfa_settings"("user_id");

-- CreateIndex
CREATE INDEX "user_facilities_user_id_is_default_idx" ON "user_facilities"("user_id", "is_default");

-- CreateIndex
CREATE INDEX "user_facilities_facility_id_revoked_at_idx" ON "user_facilities"("facility_id", "revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_facilities_user_id_facility_id_key" ON "user_facilities"("user_id", "facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "instance_configs_config_key_key" ON "instance_configs"("config_key");

-- CreateIndex
CREATE INDEX "instance_configs_category_idx" ON "instance_configs"("category");

-- CreateIndex
CREATE INDEX "tenant_configs_tenant_id_idx" ON "tenant_configs"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_config" ON "tenant_configs"("tenant_id", "config_key");

-- CreateIndex
CREATE INDEX "facility_configs_facility_id_idx" ON "facility_configs"("facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_facility_config" ON "facility_configs"("facility_id", "config_key");

-- CreateIndex
CREATE INDEX "config_audit_log_config_level_entity_id_idx" ON "config_audit_log"("config_level", "entity_id");

-- CreateIndex
CREATE INDEX "config_audit_log_config_key_idx" ON "config_audit_log"("config_key");

-- CreateIndex
CREATE INDEX "config_audit_log_changed_by_idx" ON "config_audit_log"("changed_by");

-- CreateIndex
CREATE UNIQUE INDEX "value_sets_code_key" ON "value_sets"("code");

-- CreateIndex
CREATE INDEX "value_sets_code_idx" ON "value_sets"("code");

-- CreateIndex
CREATE INDEX "value_sets_category_idx" ON "value_sets"("category");

-- CreateIndex
CREATE INDEX "value_sets_status_idx" ON "value_sets"("status");

-- CreateIndex
CREATE INDEX "value_set_concepts_value_set_id_idx" ON "value_set_concepts"("value_set_id");

-- CreateIndex
CREATE INDEX "value_set_concepts_value_set_code_idx" ON "value_set_concepts"("value_set_code");

-- CreateIndex
CREATE INDEX "value_set_concepts_code_idx" ON "value_set_concepts"("code");

-- CreateIndex
CREATE INDEX "value_set_concepts_parent_id_idx" ON "value_set_concepts"("parent_id");

-- CreateIndex
CREATE INDEX "value_set_concepts_status_idx" ON "value_set_concepts"("status");

-- CreateIndex
CREATE INDEX "value_set_concepts_value_set_id_sort_order_idx" ON "value_set_concepts"("value_set_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "value_set_concepts_value_set_code_code_key" ON "value_set_concepts"("value_set_code", "code");

-- CreateIndex
CREATE INDEX "value_set_concept_translations_concept_id_idx" ON "value_set_concept_translations"("concept_id");

-- CreateIndex
CREATE INDEX "value_set_concept_translations_language_code_idx" ON "value_set_concept_translations"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_concept_language" ON "value_set_concept_translations"("concept_id", "language_code");

-- CreateIndex
CREATE INDEX "tenant_value_set_overrides_tenant_id_idx" ON "tenant_value_set_overrides"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_value_set_overrides_value_set_id_idx" ON "tenant_value_set_overrides"("value_set_id");

-- CreateIndex
CREATE INDEX "tenant_value_set_overrides_override_type_idx" ON "tenant_value_set_overrides"("override_type");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_valueset_concept" ON "tenant_value_set_overrides"("tenant_id", "value_set_id", "concept_id");

-- CreateIndex
CREATE INDEX "value_set_history_entity_type_entity_id_idx" ON "value_set_history"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "value_set_history_changed_by_idx" ON "value_set_history"("changed_by");

-- CreateIndex
CREATE INDEX "value_set_history_changed_at_idx" ON "value_set_history"("changed_at");

-- CreateIndex
CREATE INDEX "medication_master_tenant_id_idx" ON "medication_master"("tenant_id");

-- CreateIndex
CREATE INDEX "medication_master_ndc_code_idx" ON "medication_master"("ndc_code");

-- CreateIndex
CREATE INDEX "medication_master_atc_code_idx" ON "medication_master"("atc_code");

-- CreateIndex
CREATE INDEX "medication_master_generic_name_idx" ON "medication_master"("generic_name");

-- CreateIndex
CREATE INDEX "medication_master_is_active_idx" ON "medication_master"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_medication_local_code" ON "medication_master"("tenant_id", "local_code");

-- CreateIndex
CREATE INDEX "lab_test_master_tenant_id_idx" ON "lab_test_master"("tenant_id");

-- CreateIndex
CREATE INDEX "lab_test_master_test_category_idx" ON "lab_test_master"("test_category");

-- CreateIndex
CREATE INDEX "lab_test_master_is_active_idx" ON "lab_test_master"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_labtest_loinc" ON "lab_test_master"("tenant_id", "loinc_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_labtest_local_code" ON "lab_test_master"("tenant_id", "local_code");

-- CreateIndex
CREATE INDEX "imaging_study_master_tenant_id_idx" ON "imaging_study_master"("tenant_id");

-- CreateIndex
CREATE INDEX "imaging_study_master_modality_idx" ON "imaging_study_master"("modality");

-- CreateIndex
CREATE INDEX "imaging_study_master_body_part_idx" ON "imaging_study_master"("body_part");

-- CreateIndex
CREATE INDEX "imaging_study_master_is_active_idx" ON "imaging_study_master"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_imaging_cpt" ON "imaging_study_master"("tenant_id", "cpt_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_imaging_local_code" ON "imaging_study_master"("tenant_id", "local_code");

-- CreateIndex
CREATE INDEX "procedure_master_tenant_id_idx" ON "procedure_master"("tenant_id");

-- CreateIndex
CREATE INDEX "procedure_master_procedure_category_idx" ON "procedure_master"("procedure_category");

-- CreateIndex
CREATE INDEX "procedure_master_body_system_idx" ON "procedure_master"("body_system");

-- CreateIndex
CREATE INDEX "procedure_master_is_active_idx" ON "procedure_master"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_procedure_cpt" ON "procedure_master"("tenant_id", "cpt_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_procedure_icd10pcs" ON "procedure_master"("tenant_id", "icd10_pcs_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_procedure_local_code" ON "procedure_master"("tenant_id", "local_code");

-- CreateIndex
CREATE INDEX "diagnosis_master_tenant_id_idx" ON "diagnosis_master"("tenant_id");

-- CreateIndex
CREATE INDEX "diagnosis_master_version_id_idx" ON "diagnosis_master"("version_id");

-- CreateIndex
CREATE INDEX "diagnosis_master_code_idx" ON "diagnosis_master"("code");

-- CreateIndex
CREATE INDEX "diagnosis_master_chapter_idx" ON "diagnosis_master"("chapter");

-- CreateIndex
CREATE INDEX "diagnosis_master_is_active_idx" ON "diagnosis_master"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_version_code" ON "diagnosis_master"("tenant_id", "version_id", "code");

-- CreateIndex
CREATE INDEX "diagnosis_versions_tenant_id_idx" ON "diagnosis_versions"("tenant_id");

-- CreateIndex
CREATE INDEX "diagnosis_versions_code_set_idx" ON "diagnosis_versions"("code_set");

-- CreateIndex
CREATE INDEX "diagnosis_versions_import_status_idx" ON "diagnosis_versions"("import_status");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tenant_codeset_version" ON "diagnosis_versions"("tenant_id", "code_set", "version_label");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_default_facility_id_fkey" FOREIGN KEY ("default_facility_id") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_head_of_department_fkey" FOREIGN KEY ("head_of_department") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beds" ADD CONSTRAINT "beds_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialty_codes_authority" ADD CONSTRAINT "specialty_codes_authority_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_specialties" ADD CONSTRAINT "staff_specialties_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_specialties" ADD CONSTRAINT "staff_specialties_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_specialties" ADD CONSTRAINT "staff_specialties_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_specialties" ADD CONSTRAINT "staff_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialty_translations" ADD CONSTRAINT "specialty_translations_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mfa_settings" ADD CONSTRAINT "user_mfa_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mfa_backup_codes" ADD CONSTRAINT "user_mfa_backup_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_mfa_attempts" ADD CONSTRAINT "user_mfa_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trusted_devices" ADD CONSTRAINT "user_trusted_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_facilities" ADD CONSTRAINT "user_facilities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_facilities" ADD CONSTRAINT "user_facilities_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_facilities" ADD CONSTRAINT "user_facilities_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_configs" ADD CONSTRAINT "tenant_configs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_configs" ADD CONSTRAINT "facility_configs_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_set_concepts" ADD CONSTRAINT "value_set_concepts_value_set_id_fkey" FOREIGN KEY ("value_set_id") REFERENCES "value_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_set_concepts" ADD CONSTRAINT "value_set_concepts_value_set_code_fkey" FOREIGN KEY ("value_set_code") REFERENCES "value_sets"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_set_concepts" ADD CONSTRAINT "value_set_concepts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "value_set_concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_set_concept_translations" ADD CONSTRAINT "value_set_concept_translations_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "value_set_concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_value_set_overrides" ADD CONSTRAINT "tenant_value_set_overrides_value_set_id_fkey" FOREIGN KEY ("value_set_id") REFERENCES "value_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_value_set_overrides" ADD CONSTRAINT "tenant_value_set_overrides_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "value_set_concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_master" ADD CONSTRAINT "medication_master_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_test_master" ADD CONSTRAINT "lab_test_master_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imaging_study_master" ADD CONSTRAINT "imaging_study_master_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_master" ADD CONSTRAINT "procedure_master_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis_master" ADD CONSTRAINT "diagnosis_master_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis_master" ADD CONSTRAINT "diagnosis_master_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "diagnosis_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis_versions" ADD CONSTRAINT "diagnosis_versions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
