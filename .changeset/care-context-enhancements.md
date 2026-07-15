---
"@zeal/frontend": minor
---

Extend the **Care Context** workspace with several clinician-facing enhancements:

- **Cancer Timeline tab** in the middle panel, gated to oncology patients with more than 10 recorded cancer-timeline events. It reuses the oncology plugin's grouped timeline rendering (diagnosis, staging, tumor board, care plan, grouped chemotherapy course, surgery, response, follow-up).
- **Care Team** section in the left rail — every clinician the patient has seen, doctors first, each with role and visit context. Clicking a member filters the encounter list to that practitioner (with a clear-filter control) and selects their most recent encounter.
- **Biomarkers** section in the left rail — results recorded within the past three months, with value, interpretation status, and collection date. The section is hidden when there are no recent results.
- **Documents** section in the encounter detail panel is wired to `GET /patient-results/encounter/:encounterId`, listing the encounter's lab, imaging, and procedure reports with type, status, and a summary (replacing the previous placeholder).
- UI polish: separators and a clearer active state on the view tabs; inline label/value rows in the left rail.

Also fixes plugin nav registration so plugin sections (for example Oncology) appear on every route group, not only under `(dashboard)`.
