---
"@zeal/frontend": minor
---

Add RCM Denials & Appeals data layer: `use-denials` React Query hooks
(`useDenials`, `useDenial`, `useCreateDenial`, `useDraftAppeal`, `useFileAppeal`),
`denial-service` client, and denial/appeal types. Wires the frontend to the new
RCM denials endpoints (`/denials`, `/denials/:id/appeals`, `/appeals/:id/file`)
for the Care Context Denials section.
