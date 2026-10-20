---
title: 'Billing setup'
group: 'Billing and revenue'
order: 120
routes: ['/rcm-setup']
description: 'RCM Setup: payers, billing items (the charge master), charge posting rules, fee schedules, payer contracts, and catalog mappings that turn clinical orders into charges.'
---

**RCM Setup** (`/rcm-setup`, under **Administration** in the sidebar) is where the billing team sets
up what everything costs and who pays. It opens on six tiles:

- **Payers**: insurers, government schemes and other payers.
- **Billing items**: the charge master, every billable code and its list price.
- **Charge posting rules**: how clinical events become charges automatically.
- **Fee schedules**: base rates and payer price lists.
- **Payer contracts**: what each payer has agreed to pay.
- **Catalog mappings**: which billing item each clinical catalog item charges.

Set them up in roughly this order: billing items first, then catalog mappings so orders produce
charges, then payers, fee schedules and contracts for insured patients. The screens that use them
are described in [Billing](billing.md) and [Revenue cycle and claims](revenue-cycle.md).

Prices show in your organisation's **finance.currency** (AED when none is set).

## Payers

**Payers** (`/rcm-setup/payers`) lists every payer: **Payer** (name and electronic ID), **Type**,
**Status**, **Active policies** (how many patient policies are held with it) and **Last updated**.
Tiles count **Total payers**, **Active**, **Inactive** and **Suspended**. Search with **Search
payers...** or filter by status. Click a row or **View** to open it.

### Adding a payer

**New payer** (`/rcm-setup/payers/new`):

1. **Name** (required), such as "Gulf Cooperative Insurance".
2. **Payer ID**: the payer's electronic ID.
3. **Type**: free text, such as insurance, TPA, government, corporate or self. These values get
   matching coloured badges on the claims list.
4. **Status**: **Active**, **Inactive** or **Suspended**.
5. **Contact info (JSON)** and **Configuration (JSON)**, both optional and written as JSON.
6. Press **Create payer**. "Payer created".

The **Configuration** decides how the payer is reached. Two keys matter to other screens:

- `eligibilityConnector`: the connector used for eligibility checks. Without it a built-in test
  connector answers.
- `nhcxParticipantCode`: the payer's participant code on the national claims exchange (NHCX).
  When set, claims and pre-authorisations for this payer are submitted through the exchange.

**If instead:** "Payer name is required"; "Invalid JSON" with "Check contact info/config fields."
when either JSON box is not valid JSON; "Unable to create payer" with the server's reason.

### A payer's record

Open a payer (`/rcm-setup/payers/{id}`) to see **Identifiers** (**Payer ID**, **Type**,
**Created**, **Updated**), **Contact info** and **Configuration**. **Deactivate** moves the payer to
inactive ("Payer deactivated") and returns you to the list; it is hidden once the payer is
inactive. A refusal shows "Unable to deactivate payer".

## Billing items

**Billing items** (`/rcm-setup/billing-items`) is the charge master. The columns are **Code** (with
its code system), **Description**, **Type**, **Charge**, **List price**, **Status** and **Updated**.
Tiles count **Total items**, **Active** and **Inactive**.

Filter by status, **Item type** (lab, imaging, procedure, consult, registration, pharmacy, package,
misc), **Charge type** (registration, consultation, lab, radiology, procedure, pharmacy, package,
misc) and **Code system** (INTERNAL, CPT, DHA, DOH, HAAD, MOHAP, LOINC, CUSTOM). **Include global
catalog items** (on by default) also lists the shared global items alongside your own.

### Adding or editing a billing item

**New billing item** (`/rcm-setup/billing-items/new`):

1. **Item type**, **Charge type**, **Billing code** and **Code system** (all required).
2. **Description** (required), such as "Consultation 30 minutes".
3. **Default unit** (such as "each") and **List price**. The list price is what fills in when the
   item is picked on an invoice line.
4. **Clinical reference ID** (optional).
5. **Is active?**: inactive codes are hidden from ordering workflows.
6. Press **Create billing item**. "Billing item created".

Open an item (`/rcm-setup/billing-items/{id}`) to see **Scope & metadata** (whether it is
**Tenant-specific** or a **Global catalog item**, its code and list price), edit it under **Edit
billing item** with **Update billing item**, and manage its **Mapped Catalog Items** (see
[Catalog mappings](#catalog-mappings)).

Under **Danger zone**:

- **Deactivate**: confirm "Deactivate this billing item?". Deactivated codes stay in history but are
  hidden from ordering.
- **Delete permanently**: confirm "This will permanently delete the billing item. Continue?". This
  removes the item and its history; prefer **Deactivate**.

## Charge posting rules

**Charge posting rules** (`/rcm-setup/charge-posting-rules`) decide what charge is created when a
clinical event happens, such as a lab test ordered or a medication dispensed. The list shows
**Rule** (with its priority), **Event**, **Billing item**, **Calculation** and **Status**. Filter
by event type, event source, billing type, or **Active only**.

### Writing a rule

**New rule** (`/rcm-setup/charge-posting-rules/new`), headed **New charge posting rule**:

1. **Rule name** (required).
2. **Event type**: lab test ordered, medication dispensed, procedure performed, imaging study
   ordered, daily bed charge, consultation completed, or custom.
3. **Event source**: encounter, order, pharmacy, scheduler or custom.
4. **Billing item type** and, optionally, a **Billing item ID** to charge a specific item.
5. **Calculation method** (fixed, catalog price, custom formula, tiered pricing), **Price source**
   and **Quantity source**.
6. **Base price**, **Discount %**, **Tax %** and **Priority**.
7. **Conditions (JSON)** to limit when the rule fires, and **Configuration (JSON)**, such as tiered
   prices.
8. **Description**, **Active** (inactive rules are skipped) and **Auto approve charges** (otherwise
   charges land in draft).
9. Optionally, under **Fee schedule price lookup**, pick a code type, enter a billing code and press
   **Use price** to copy a fee schedule price into **Base price**. The line below says "Found ..."
   with the price, or why none was found.
10. Press **Save rule**. "Rule created".

If either JSON box is not valid JSON the rule is not saved, and the screen gives no message.

Open a rule (`/rcm-setup/charge-posting-rules/{id}`) to see its **Rule summary**, edit it (**Update
rule**), read the **Raw configuration**, **Activate** or **Deactivate** it for new events, or
**Delete** it (confirm "Delete this rule? This action cannot be undone.").

## Fee schedules

**Fee schedules** (`/rcm-setup/fee-schedules`) are price lists. The list shows **Schedule** (with
version), **Type**, **Status** and **Effective** dates. Filter by type, status and authority (DHA,
DOH, MOHAP, HAAD).

| Type | Meaning |
| --- | --- |
| **Authority** | A regulator's published price list. |
| **Tenant** | Your organisation's own prices. |
| **Contract** | Prices agreed with a payer. |

Statuses are **Active** (dark badge), **Draft** (outlined), **Inactive** and **Expired**.

### Creating a schedule

**New schedule** (`/rcm-setup/fee-schedules/new`):

1. **Name** and **Effective from** (both required); **Effective to** if it ends.
2. **Type**; for **Authority**, also the **Authority**.
3. **Version** (such as "v1.0"), **Status**, **Base schedule ID** if it derives from another
   schedule, and **Metadata (JSON)**.
4. Press **Save schedule**. "Fee schedule created".

The server refuses an end date that is not after the start date, a base schedule that does not
exist, and an **Authority** schedule without an authority. Authority schedules are shared across
organisations, so the server also refuses one created from within your organisation.

### Prices in a schedule

Open a schedule (`/rcm-setup/fee-schedules/{id}`). Edit its details under **Edit schedule**.

- **Items** lists each price: **Code** (with service group), **Type**, **Amount** and **Priority**.
  **Edit** opens it below; **Delete** removes it (confirm "Delete this fee schedule item?").
- **Add new item**: **Code** and **Base amount** (required), **Code type**, **Currency**, **Unit**,
  **Multiplier**, **Discount %**, **Max allowed**, **Service group** and **Priority**, then **Save
  item**.
- **Lookup price**: choose a **Code type**, enter a **Code** and press **Lookup** to see the price
  this schedule gives, or "No price found". A blank code says "Enter a code to lookup."

## Payer contracts

**Payer contracts** (`/rcm-setup/payer-contracts`) record what each payer has agreed to pay. The list
shows **Contract** (with number), **Type**, **Status** (**Active**, **Draft**, **Expired**,
**Suspended**) and **Effective** dates. Filter by status, type and authority.

### Creating a contract

**New contract** (`/rcm-setup/payer-contracts/new`):

1. **Payer** (required, picked from your payers), **Contract name** (required) and **Contract
   number**.
2. **Authority**, **Base fee schedule ID**, **Plan code**, **Network type** and **Line of
   business**.
3. **Contract type**: fee for service, capitation, bundled or value based.
4. **Reimbursement method**: percentage of tariff, fixed rate, percentage of charges, per diem or
   case rate.
5. **Effective from** (required), **Effective to** and **Status**.
6. **Multiplier**, **Discount %** and **Max allowed** for the contract as a whole.
7. **Terms (JSON)** and **Metadata (JSON)**.
8. Press **Save contract**.

Nothing is saved without a payer, contract name and start date.

### Adjustments and price checks

Open a contract (`/rcm-setup/payer-contracts/{id}`): **Contract summary**, then **Edit contract**.

- **Adjustments** vary the price for part of the contract. Each row shows its **Scope** (a service
  group, or "All services", marked **Adjustment** or **Exclusion**), **Multiplier**, **Discount %**,
  **Priority** and **Effective** dates. Under **Add adjustment** set a **Service group**, **Billing
  item ID** or **Fee schedule item ID**, the **Multiplier**, **Discount %**, **Max allowed**, **Min
  allowed**, **Priority**, dates and **Notes**, and switch on **Exclusion** to exclude matching
  services from payment. Then **Save adjustment**.
- **Calculate contract price**: enter a billing **Code**, **Code type** and **Quantity** and press
  **Calculate price**. The result reads "Final: ... (base ...)". A blank code says "Enter billing
  code to calculate price."

## Catalog mappings

A catalog mapping links a clinical catalog item (a medication, lab test, imaging study, procedure,
package or administrative service, set up under [Administration](administration.md)) to the
billing item it charges. When the item is ordered or dispensed, the mapping decides which billing
item is charged and how many. Without a mapping, an order produces no automatic charge.

**Catalog Mappings** (`/rcm-setup/catalog-mappings`) lists the mappings: **Catalog item** (type and
ID), **Billing item** (description and code), **Flags**, **Qty**, **Status** and **Effective**
dates. Tiles count **Total mappings**, **Primary mappings** and **Require approval**. Filter by
**Catalog type**, **Status**, **Primary** (**Primary only** or **Secondary only**) or a **Billing
item ID**.

| Flag | Meaning |
| --- | --- |
| **Primary** | The main billing item for this catalog item. It is chosen first. |
| **Auto** | The charge is created automatically when the item is ordered. |
| **Needs approval** | The charge is held until someone approves it. |

One catalog item can map to several billing items, for example a scan with a reading fee and a
facility fee.

### Adding a mapping

**New Mapping** (`/rcm-setup/catalog-mappings/new`):

1. **Catalog type**.
2. Search for the catalog item (type at least two letters) and pick it.
3. Search for the **Billing item**. The search is limited to billing items of the matching type, and
   items whose code matches the catalog item's code are marked **Suggested** and listed first. It
   stays greyed out until a catalog item is picked.
4. **Quantity**, **Mapping reason** and **Notes**.
5. Switch on **Automatic charge**, **Primary mapping** and **Requires approval** as needed.
6. Press **Create Mapping**. "Mapping created".

**If instead:** "Missing selection" if either item is not picked; "Failed to create mapping" with
the server's reason, for example when the same pair is already mapped.

You can also add and remove mappings from a billing item's page (**Mapped Catalog Items**, then
**Add mapping**, which opens **Add Billing Mapping**) or from a catalog item's page under Catalogs.
The bin button beside a mapping asks "Remove this mapping?" and deactivates it.

### Suggested mappings

**Suggested** (`/rcm-setup/catalog-mappings/suggestions`) finds catalog items and billing items that
share a code but are not yet mapped, such as a lab test whose LOINC code equals a billing item's
code.

1. Pick a **Catalog type**. "Finding matches…" shows while it loads.
2. Review each pair: catalog item and code on the left, billing item and price on the right.
3. Press **Accept** on a pair, or **Accept all** to take every suggestion.

Accepted mappings are created as **Primary** and **Automatic**, quantity 1. When nothing is left the
page says "All code-matched pairs are already mapped!".

### A mapping's record

Open a mapping (`/rcm-setup/catalog-mappings/{id}`) to see both sides, the quantity, reason,
notes, flags, **Effective date** ("Any" if none), **Expiration date** ("No expiry"), and any
**Facility restriction**, **Payer restriction** or **Patient type** limits ("All" when none).
**Deactivate** asks "Deactivate this mapping? It will no longer be used for charge posting." and
returns you to the list.

## Not live yet

- **Payers**: a payer cannot be edited after it is created; there is only **Deactivate**.
- **Catalog mappings**: a mapping cannot be edited. To change one, deactivate it and create a new
  one. Facility, payer, patient-type and date limits are shown but cannot be set on these screens.
  The list shows the catalog item's internal ID rather than its name, and rows do not open when
  clicked; use **View**.
- **Charge posting rules, fee schedules, payer contracts**: when the server refuses a save, the
  reason is not shown on screen.
