---
"@zeal/frontend": minor
---

Add an "External records" panel to the Care Context view: request/grant HIE
participation consent and run a consent-gated fetch of external patient records
(lab report, discharge summary, imaging) via a region-agnostic HIE provider
(mock in development). Shows consent status (granted / expiring / renew) and
fetch status with a retry button. Backed by new clinical `/hie/*` endpoints.
See ADR-0012.
