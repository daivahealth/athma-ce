# Postman Setup

1. **Seed Demo Data**
   ```bash
   psql postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms -f docs/postman/seed-demo-user.sql
   ```
2. **Import**
   - Collection: `docs/postman/zeal-backend.postman_collection.json`
   - Environment: `docs/postman/zeal-local.postman_environment.json`
3. **Run order**
   - `Auth Service → Login` (updates tokens automatically)
   - `Foundation Service → List Tenants` with `Authorization: Bearer {{accessToken}}`
   - Remember to add `x-tenant-id: {{tenantId}}` for tenant-scoped endpoints.
