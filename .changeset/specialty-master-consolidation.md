---
"@zeal/foundation": minor
"@zeal/contracts": minor
"@zeal/frontend": minor
---

Consolidate specialty handling on the foundation specialty master.

**foundation** — staff-specialty endpoints (`GET/PUT/DELETE /staff/:staffId/specialties*`) and `GET /facilities/:id/specialties` now require `x-tenant-id` and return `404` for staff or facilities outside the caller's tenant; every `staff_specialties` query is tenant-filtered. Clinic create/update rejects specialty values that are not active master codes. Migration `20261104000000_specialty_master_cleanup` drops the legacy `staff.specialties` JSON column (non-empty values are archived to `staff_specialties_legacy_json`) and adds `CRIT_CARE`.

**contracts** — `StaffMember.specialties` removed; use the `staffSpecialties` relation.

**clinical DB** — `migrations/013_normalize_specialty_codes.sql` rewrites vitals-template and OT-room specialty values to master codes.

**frontend** — new shared `SpecialtySelect` / `SpecialtyMultiSelect` and `useSpecialties` / `useSpecialtyLabel`; vitals templates, note templates and OT rooms now pick from the master instead of free text or raw UUIDs, and show localized names.
