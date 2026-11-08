# Access Requests API

Production access requests from the public site. Foundation service, base `/api/v1`. Feature behaviour: [PUBLIC-LANDING-AND-ACCESS-REQUESTS.md](../features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md).

## Submit a request (public)

`POST /access-requests`. No authentication. Allowed by the write-access middleware for anonymous callers and for read-only (demo visitor) tokens.

```json
{
  "organisationName": "Asha Cancer Centre",
  "organisationType": "cancer_centre",
  "contactName": "Asha Rao",
  "email": "asha@example.com",
  "phone": "+91 98765 43210",
  "country": "India",
  "facilityCount": 2,
  "bedCount": 120,
  "modules": ["oncology", "billing"],
  "message": "We run two centres.",
  "consent": true
}
```

| Field | Rules |
|---|---|
| `organisationName` | Required, 2–200 characters |
| `organisationType` | Required: `hospital`, `multi_specialty_hospital`, `cancer_centre`, `clinic`, `diagnostic_centre`, `day_care`, `other` |
| `contactName` | Required, 2–120 |
| `email` | Required, valid email, stored lower-case |
| `phone` | Optional, 6–30 of digits, spaces, `+ ( ) -` |
| `country` | Required, 2–80 |
| `facilityCount` | Optional integer 1–10000 |
| `bedCount` | Optional integer 0–100000 |
| `modules` | Optional: any of `patient_access`, `clinical`, `operating_theatre`, `lab`, `imaging`, `inpatient`, `pharmacy`, `billing`, `revenue_cycle`, `oncology`, `analytics`, `abdm` |
| `message` | Optional, up to 2000 |
| `consent` | Required, must be `true` |
| `website` | Honeypot; leave empty. If filled, the request is dropped with the same response |

Unknown fields are rejected.

| Status | Body |
|---|---|
| `202` | `{ "received": true }` |
| `400` | Validation errors |
| `429` | More than 5 requests per IP per hour or 3 per email per day |

## List requests

`GET /access-requests?status=new`. Requires `platform.access_request.read`. Returns up to 500, newest first, and counts for every status:

```json
{
  "data": [{ "id": "…", "organisationName": "…", "status": "new", "adminNotes": null, "createdAt": "…", "...": "…" }],
  "counts": { "new": 3, "contacted": 1, "approved": 0, "declined": 0 }
}
```

`status` is optional: `new`, `contacted`, `approved`, `declined`.

## Review a request

`PATCH /access-requests/{id}`. Requires `platform.access_request.manage`. Body `{ "status"?: "contacted" | "approved" | "declined" | "new", "adminNotes"?: string (≤ 4000) }`. Sets `reviewedAt` and `reviewedBy`. Returns the updated request; `404` if it does not exist.
