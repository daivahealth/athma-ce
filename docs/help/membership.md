---
title: 'Membership'
group: 'Engagement and wellness'
order: 140
routes: ['/membership']
description: 'The Membership section: the Membership Dashboard, creating membership plans on Plans, and enrolling patients on Subscriptions.'
---

Shown when your organisation has Membership switched on.

The **Membership** section of the sidebar holds three screens: **Membership Dashboard**, **Plans** and
**Subscriptions**. A membership plan is a paid tier (Basic, Standard, Premium, Platinum or VIP) with a monthly
and a yearly price and a list of benefits. A subscription enrols one patient in one plan.

Today the working parts are the **New Plan** dialog, the **New Subscription** dialog and the list of
subscriptions. The dashboard figures and the plan catalogue are not live yet; see
[Not live yet](#not-live-yet) before you rely on them.

## Membership Dashboard

**Membership Dashboard** (`/membership`) is a launch page headed "Membership plans and subscription
management".

Three tiles sit across the top: **Active Plans**, **Active Subscriptions** and **Monthly Revenue**. They
always show a dash today; they do not count anything yet.

Under them are two cards. Press a card to open it:

| Card | Opens | What it says |
| --- | --- | --- |
| **Plans** | `/membership/plans` | Create and manage membership tiers and benefits |
| **Subscriptions** | `/membership/subscriptions` | Manage patient subscriptions and billing |

## Plans

**Plans** (`/membership/plans`) is where you create membership plans. The page is headed "Create and manage
membership tiers and benefits" and has a **New Plan** button at the top right.

The **Membership Plans** panel below the button is placeholder text. Plans you create are saved, but this
page does not list them. To check a plan was saved, open **New Subscription** on
[Subscriptions](#subscriptions): every active plan appears in its **Membership Plan** list.

### Create a plan

**Go to:** **Membership** > **Plans**, then **New Plan**.

The **Create Membership Plan** dialog opens, headed "Define a new membership tier, pricing, and benefits."

1. Type a **Plan Name** (for example "Platinum Health") and a **Plan Code** (for example "PLAT_V1"). The code
   must be unique in your organisation.
2. Choose the **Tier**: **Basic**, **Standard**, **Premium**, **Platinum** or **VIP**. It starts at
   **Standard**.
3. Enter the **Monthly Price** and the **Yearly Price**. Both start at 0 and take decimals. Neither can be
   negative.
4. **Currency** shows USD and cannot be changed.
5. Add a **Description** if you want one.
6. Under **Benefits**, one row is already filled in: "Basic Monitoring". For each benefit:
   - type the **Benefit Name**;
   - optionally a **Value**, such as "5 sessions";
   - leave **Included in plan** ticked, or untick it to list a benefit the plan does not include.

   Press **Add Benefit** for another row. The bin button removes a row; it is greyed out when only one row
   is left, because a plan needs at least one benefit.
7. Press **Save Membership Plan**. The button spins while it saves.

**Check:** the dialog closes and a green toast says "Membership plan created successfully". The new plan is
active straight away and can be picked in **New Subscription**.

**If instead:** the dialog stays open and says what is missing under the field:

- "Plan name is required"
- "Plan code is required"
- "Benefit name is required", under any benefit row left blank. Fill it in or remove the row.

If the server refuses the plan, a red toast says "Failed to create membership plan" and the dialog stays
open with what you typed. The most common reason is a **Plan Code** already used by another plan; the toast
does not say which, so try a different code.

Closing the dialog without saving keeps what you typed until you next save or reload the page.

## Subscriptions

**Subscriptions** (`/membership/subscriptions`) lists every patient enrolled in a membership plan, newest
first. The page is headed "Manage patient subscriptions and recurring billing" and has a **New
Subscription** button at the top right.

### Reading the list

The **Patient Subscriptions** panel shows one row per subscription:

- a round icon: a green tick for an active subscription, a grey cross for anything else;
- the patient's name, with the plan's name in a small badge beside it;
- **Started** and the start date, the billing cycle (**monthly billing** or **yearly billing**) and, when the
  server has one, **Next billing** and its date;
- on the right, the price for that cycle (the plan's monthly price for monthly billing, its yearly price
  for yearly billing) and its currency;
- under the price, the status in capitals.

| Status | Colour | Meaning |
| --- | --- | --- |
| **ACTIVE** | Green, green tick | The patient is a current member. |
| **PENDING** | Grey, grey cross | Not yet active. |
| **CANCELLED** | Grey, grey cross | Cancelled. |
| **EXPIRED** | Grey, grey cross | No longer current. |

The list shows all subscriptions, not only active ones. It has no search, filter or paging, and rows do not
open.

When nobody is enrolled yet the panel says "No subscriptions found" and "Enroll patients into membership
plans to track their subscriptions here."

### Enrol a patient

**Go to:** **Membership** > **Subscriptions**, then **New Subscription**.

The **New Subscription** dialog opens, headed "Enroll a patient into a membership plan."

1. Find the patient: type a name, MRN or mobile number into **Search by name, MRN, or mobile**. Matches appear
   as you type, each with name, phone, sex, age and MRN; if none match it says "No patients found.". Pick
   one and a card shows the patient. Clear it to pick someone else.
2. Choose the **Membership Plan** from **Select a plan**. Only active plans are listed, each as its name with
   the tier in capitals, for example "Platinum Health (PLATINUM)", cheapest first. While they load it says
   "Loading plans...".
3. Choose the **Billing Cycle**: **Monthly** (the default) or **Yearly**.
4. Check the **Start Date**. It starts at today; press it and pick another day from the calendar. Past dates
   are allowed.
5. **Auto-Renew** ("Automatically renew subscription at the end of cycle.") is on by default. Switch it off
   if the membership should not renew.
6. Press **Subscribe Patient**. The button spins while it saves. **Cancel** closes the dialog without
   saving.

**Check:** the dialog closes and a green toast says "Subscription created successfully" with "The patient has
been enrolled in the membership plan.". The new row appears at the top of the list as **ACTIVE**.

**If instead:** the dialog stays open and says what is missing:

- "Patient is required"
- "Membership plan is required"
- "Start date is required"

If the server refuses, a red toast says "Subscription failed" with "An error occurred while creating the
subscription." and the dialog stays open. The server refuses when:

- the patient already has an active subscription. A patient can hold only one active subscription at a
  time;
- the chosen plan no longer exists.

The toast does not say which of these happened. Check the list for an existing **ACTIVE** row for the
patient first.

## Not live yet

- **Membership Dashboard** (`/membership`): **Active Plans**, **Active Subscriptions** and **Monthly
  Revenue** always show a dash. No figures are calculated.
- **Plans** (`/membership/plans`): the **Membership Plans** panel is placeholder text ("... will be
  displayed here."). Saved plans are not listed, and there is no way here to open, edit, deactivate or
  delete a plan.
- **Currency** on a new plan is fixed at USD, whatever currency your organisation bills in.
- **Subscriptions** (`/membership/subscriptions`): there is no way to cancel, change or renew a subscription
  from this screen, and **Auto-Renew** is recorded but nothing on screen acts on it.
- Membership is not connected to billing: subscribing a patient does not raise an invoice. Bill the
  membership through [Billing](billing.md) if your organisation charges for it.
- When a save fails, the red toast never gives the server's reason (such as a duplicate plan code or an
  existing active subscription).

Membership plans are separate from wellness programs; for those see [Wellness](wellness.md). For outreach to
members, see [Patient engagement](patient-engagement.md). Terms are explained in the
[Glossary](glossary.md).
