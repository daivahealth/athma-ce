# Domain Events (Transactional Outbox)

How asynchronous integrations react to clinical changes (ADR-0015 §5,
issue #112). No broker: a Postgres outbox plus a polling dispatcher — the
envelope is deliberately broker-shaped so Kafka could replace the transport
later without touching producers or consumers.

## Producing

Events are written by `OutboxService.write(tx, event)` **inside the same
`$transaction` as the domain change** — the event exists iff the change
committed. Payloads carry ids and minimal denormalization only; consumers
fetch PHI through authorized APIs, never from the event stream.

Catalog v1 (`DOMAIN_EVENTS`, clinical `common/events/`):

| Type | Emitted when | Payload |
|---|---|---|
| `patient.identity.linked` | A national identity is attached/verified on a patient | `{patientId, identityId, country, identityType, verificationStatus, isPrimary}` — never the identity value |
| `encounter.closed` | An encounter transitions to `finished` | `{encounterId, patientId, encounterType?, endedAt?}` |
| `clinical_document.finalized` | Reserved — emitter lands with the M2 FHIR work (#116) | |

Envelope on the wire: `{id, seq, type, version, tenantId, facilityId?,
aggregateType, aggregateId, occurredAt, payload}`.

## Delivery

`OutboxDispatcherService` (clinical) polls every 5s per subscriber:

- Strict ordering via the `seq` BIGSERIAL; per-subscriber cursor in
  `outbox_cursors`.
- **At-least-once** over internal HTTP (`X-Internal-Api-Key`); consumers must
  be idempotent by event `id`.
- Retries with exponential backoff (10s base, 15min cap); after 10 attempts
  the event is recorded in `outbox_dead_letters` for that subscriber and the
  cursor advances — one poison event never blocks the stream. Operators
  triage dead letters and can re-send manually.
- Subscribers: `OUTBOX_SUBSCRIBERS` env (JSON `[{id, url}]`); by default the
  abdm-connector subscribes at `$ABDM_CONNECTOR_URL/api/v1/internal/events`
  when `INTERNAL_API_KEY` is configured.

## Consuming (connector side)

The abdm-connector persists deliveries into its `event_inbox` (idempotent by
event id; duplicates ack `200 {duplicate: true}`). A 5s inbox processor
consumes `received` rows with bounded retries (5 attempts → `failed` for
operator triage): `encounter.closed` for an ABHA-linked patient becomes a
care context (HIP linking, #114 — mock links immediately, live is async via
the correlation store); other types are marked `processed`/`ignored`.
Handlers are idempotent — replaying a processed event creates nothing twice.

## Adding an event type

1. Add the constant + payload shape to `DOMAIN_EVENTS` (ids only!).
2. Write it via `OutboxService.write` inside the producing transaction.
3. Consumers pick it up by `type`; unknown types are ignored, so producers
   can ship first.
