-- Reset zeal_foundation tables (development only)

TRUNCATE TABLE
  user_facilities,
  user_roles,
  role_permissions,
  user_mfa_backup_codes,
  user_mfa_attempts,
  user_mfa_settings,
  user_trusted_devices,
  staff_specialties,
  spaces,
  clinics,
  beds,
  wards,
  departments,
  facilities,
  users,
  roles,
  permissions,
  specialty_translations,
  specialty_codes_authority,
  staff,
  specialties,
  tenants
CASCADE;
