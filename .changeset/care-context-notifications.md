---
"@zeal/frontend": minor
---

Add a notification center to the topbar. The bell now shows a live unread-count
badge and opens a dropdown listing notifications with severity styling and
mark-as-read. Notifications stream in real time over SSE from the PRM service
(`/v1/notifications/stream`), with a dev-only "Simulate event" affordance.
