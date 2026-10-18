---
title: 'Getting started'
group: 'Getting started'
order: 10
routes: ['/dashboard', '/profile']
description: 'Signing in and resetting your password, the Health AI+ dashboard, the sidebar and topbar, switching facility, patient search, notifications, your profile, and how to use this Help Centre.'
---

This page covers what every user meets before any clinical or billing work: signing in, the
**Health AI+** dashboard you land on, the sidebar and the bar across the top of every screen, and
this manual itself. Each module then has its own page, listed in the Help Centre.

## Signing in

**Sign in** (`/login`) asks for your **Email** and **Password**.

1. Open the app. If you are not signed in, any screen you open sends you to the sign-in page.
2. Enter your **Email** and **Password**.
3. Press **Sign in**.

**Check:** a green toast says **Welcome back**, and you land on the **Health AI+** dashboard
(`/dashboard`). The app always opens the dashboard after sign-in, even when a link sent you to
sign in from another screen; open that screen again from the sidebar.

**If instead:** the message under the password box says why, and a red **Authentication failed**
toast repeats it:

- The server's own reason, such as a wrong password or a locked account, is shown as it sends it.
  When there is no reason to show, the message is **Unable to authenticate.**
- **Multi-factor authentication required. Enter your code.** means your account needs a
  verification code. See [Not live yet](#not-live-yet).
- **Login response missing tokens.** means the sign-in service answered without a session. Try
  again, and tell your administrator if it repeats.

The email box must hold a valid email address and the password must be at least 6 characters, or
the form does not send.

Your session lasts until its token expires. When it has, the next screen you open sends you back to
**Sign in**.

### Forgot your password

**Password reset** (`/reset-password`) is the **Forgot password?** link under the sign-in form.

1. Enter your **Email address**.
2. Press **Send reset link**.

**Check:** the screen says **If the email is registered, a reset link has been sent.** It says this
whether or not the address has an account, so the screen never reveals who has one. The email
holds a reset token.

**If instead:** **Unable to request reset right now. Please try again later.** means the request
did not reach the sign-in service.

### Setting a new password with a reset token

**Complete password reset** (`/confirm-reset`) is the **I have a reset token** link under the
sign-in form.

1. Paste the token from the email into **Reset token**.
2. Enter your **New password**, at least 8 characters.
3. Press **Update password**.

**Check:** **Password updated. You can now sign in with your new credentials.** Press **Return to
sign in**.

**If instead:** **Invalid or expired token. Please request a new reset.** Go back to **Forgot
password?** and ask for a fresh one.

### Signing out

Open the person icon at the right of the topbar and choose **Sign out**. A toast says **Signed out
successfully** and you return to **Sign in**. If the server could not be reached, the toast says
**Signed out locally** instead: your session is still cleared from this browser, so you are safely
signed out here.

## The Health AI+ dashboard

**Health AI+** (`/dashboard`) is the first entry in the sidebar and where you land after signing
in. It is a snapshot of today's activity and this month's money for your facility, drawn from the
Report Builder.

**Go to:** **Health AI+** in the sidebar, or the Athma logo at the top of the sidebar.

### The figures across the top

| Tile | What it counts |
| --- | --- |
| **Total Patients** | Every registered patient, with the change on last month. |
| **Revenue (MTD)** | Revenue so far this month, in your organisation's currency, with the change on last month. |
| **Appts Today** | Appointments booked for today. |
| **Unpaid Invoices** | Invoices not yet paid. |

The change is shown as a percentage beside the figure, marked **vs last month**.

### AI Operations Brief

A sentence summing up the day: how many appointments are scheduled, how many are completed so far,
the encounters recorded today and the patients registered this month (those last two only when
there are any). Under it, three small panels:

- **Completion Rate**: completed appointments as a share of today's, such as "12/20 appointments".
- **Encounters Today**: encounters recorded today.
- **Revenue (MTD)**: the month's revenue so far.

### Suggested Actions

Up to three suggestions worked out from the figures, each numbered and marked **AI
recommendation**:

- **Follow up on unpaid invoices**, when more than five invoices are unpaid (**Action due today**).
- **Monitor appointment progress**, when fewer than half of today's appointments are completed
  (**High impact**).
- **Welcome new patients**, when patients have registered this month (**Plan ahead**).

With none of these, it suggests **Review daily operations** (**Routine**). The suggestions are
fixed rules on the figures, not a model's reading of your records, and nothing on the card acts by
itself.

### Risk & Compliance Radar

Up to three signals, each with a severity and a badge:

| Signal | Shown when | Badge |
| --- | --- | --- |
| **Overdue Invoices** | Any invoice is more than 30 days overdue. | **Alert** above 10, otherwise **Watchlist** |
| **Unpaid Balance** | Any invoice is unpaid; gives the total owed. | **Alert** above 20, otherwise **Watchlist** |
| **Low Completion Rate** | Under 80% of today's appointments are completed. | **Alert** under 60%, otherwise **Watchlist** |
| **Operations Normal** | None of the above. | **Info** |

**Alert** is red; **Watchlist** and **Info** are grey.

### How fresh the figures are

The badge beside the heading says **Live** or **Cached** and the time the figures were worked out.
The figures are kept on the server for a few minutes so the dashboard opens quickly, and the page
reads them again every 5 minutes and whenever you come back to the browser tab. Press **Refresh**
to have the server recount them now. While figures load, grey placeholders stand in for each card.

## Finding your way: the sidebar

The sidebar down the left lists every module you can use. It starts with **Health AI+**, then a
group per module. Press a group to open it and show its pages; press it again to close it. The group
holding the screen you are on opens by itself, and that screen is highlighted in your theme's
colour.

| Group | Pages | Help |
| --- | --- | --- |
| **Patient Access** | **Patients** · **Encounters** · **Appointments** · **Staff Calendar** · **Staff Scheduling** | [Patient access](patient-access.md) |
| **Clinical** | **Clinical Charting** · **Triage** | [Charting and triage](clinical-charting.md) |
| **Operating Theatre** | **OT Board** · **OT Requests** · **OT Schedules** · **OT Reports** · **OT Rooms** | [Operating theatre](operating-theatre.md) |
| **Lab** | **Lab Results** · **Lab Collection** · **Lab Operations** | [Laboratory](lab.md) |
| **Results & Reporting** | **Imaging Results** · **Procedure Results** | [Imaging and procedure results](results-reporting.md) |
| **Inpatient Care** | **Admission** · **Discharges** · **Discharge Summaries** · **Bed Browser** · **Ward Board** | [Inpatient care](inpatient-care.md) |
| **Billing** | **Invoices** · **Receipts** · **Refunds** · **Patient Ledger** · **Credit Notes** · **Debit Notes** · **Billing Workspace** · **Medical Coding** | [Billing](billing.md) |
| **Revenue Cycle** | **Claims** · **Batches** · **Eligibility** · **PreAuth** · **Remittance** | [Revenue cycle and claims](revenue-cycle.md) |
| **Pharmacy** | **Dispense** · **Stock Management** · **Alerts** | [Pharmacy](pharmacy.md) |
| **Wellness** | **Wellness Dashboard** · **Assessments** · **Assessment Templates** · **Biomarkers** · **Programs** · **Longevity** · **Lifestyle** · **Device Sync** | [Wellness](wellness.md) |
| **Membership** | **Membership Dashboard** · **Plans** · **Subscriptions** | [Membership](membership.md) |
| **Patient Engagement** | **Events** · **Tasks** · **Messages** | [Patient engagement](patient-engagement.md) |
| **Analytics** | **Report Builder** · **Clinical Search** | [Reports and search](analytics.md) |
| **Oncology** | **Oncology Registry** · **Tumor Staging** · **Tumor Board** · **Care Plans** · **Chemo Protocols** · **Chemo Orders** · **Treatment Schedules** · **Day-care Worklist** · **Radiation Therapy** · **Catalogs** · **Cancer Timeline** | [Oncology](oncology.md) |
| **Administration** | **Configurations** · **ABDM Settings** · **Clinical Catalogs** · **RCM Setup** · **PE Setup** | [Administration](administration.md), [Billing setup](billing-setup.md) |

### Why a group may be missing

Some groups are switched on per organisation. **Lab**, **Results & Reporting**, **Inpatient
Care**, **Revenue Cycle**, **Pharmacy**, **Wellness**, **Membership**, **Patient Engagement**,
**Analytics** and **Oncology** appear only when your organisation has that module switched on. If
you cannot see one, ask your administrator: it is a setting, not a missing screen. While the
settings are loading, the sidebar briefly shows every group and then drops the ones that are off.

### Collapsing to the icon rail

The small round arrow on the sidebar's right edge (**Collapse sidebar**) shrinks it to a narrow rail
of icons, giving the screen more room. The same arrow (**Expand sidebar**) brings it back. It stays
the way you leave it as you move between screens, until you reload the page, when it opens full
width again.

On the rail, each group is a single icon. Hover over it, or click it, and its pages open in a small
panel beside the rail, headed with the group's name. Pick a page and the panel closes. The icon is
highlighted when the screen you are on belongs to that group.

### Your name and facility

The foot of the sidebar shows your initials, your name and the facility you are working in. On the
rail, hover over the initials to read them.

### On a phone or small screen

The sidebar is hidden. Press the menu icon at the left of the topbar to slide it in, always full
width. Tap outside it to close it.

## The topbar

The bar across the top of every screen holds, from the middle to the right:

- **Patient search** and **New Patient**.
- The theme toggle (sun or moon).
- **Notifications** (the bell).
- The settings menu (the cog), with the administration screens.
- Your user menu (the person icon), with the facility switcher, **Profile** and **Sign out**.

### Finding a patient

The search box reads **Search patients by name, MRN, phone**.

1. Click the box and start typing a name, MRN or phone number.
2. Up to eight matches appear beneath it, each with the name, phone number (or **No phone**),
   gender, age and MRN.
3. Click one, or move with the up and down arrow keys and press Enter. Escape closes the list.

**Check:** the patient's **Patient AI+** view opens (`/patients-ai/{id}`), and the box clears for
the next search.

**If instead:** **No matching patients found.** Check the spelling or try the MRN.

The box shows a **⌘K** hint, but the shortcut does not work yet: click in the box instead.

**New Patient** beside it opens patient registration (`/patients/new`). See
[Patient access](patient-access.md).

### Switching facility

If you work in more than one facility, open the person icon. Under **Switch Facility** each of your
facilities is listed with its type; your home facility says **(Home)** and the one you are in has a
tick.

1. Click the facility you want.
2. A toast says **Facility switched** and the page reloads.

Everything you then see and record belongs to the new facility, and the foot of the sidebar shows
its name. **Unable to switch facility** means the server refused; its reason follows, or **Please
try again.** With only one facility, the **Switch Facility** list does not appear.

### Notifications

The bell shows a red count of unread notifications (**99+** above 99). Click it to open the list of
your latest 20:

- Each notification has an icon by severity: blue for **Info**, your theme colour for **Action**,
  amber for **Warning** and red for **Error**.
- Unread ones are tinted, with a dot beside the title. Click one to mark it read.
- **Mark all read** clears every unread one in the list.
- **You're all caught up.** when there are none.

New notifications arrive while you work: each pops up as a toast (red for an error) and the count
goes up.

### Light and dark theme

The sun or moon button switches between the light and dark theme. Your choice is remembered in this
browser.

### The settings menu

The cog opens **Administration**: **Tenants**, **Facilities**, **Users**, **Staff**, **Spaces**,
**RBAC** and **Plugin Management**. See [Administration](administration.md).

## Your profile

**Profile & Compliance** (`/profile`), from **Profile** in the user menu, shows the **Email** you
signed in with, your **Tenant** and your **Roles** (or **No roles assigned**). It is read-only: ask
your administrator to change your roles.

The notice under it is a reminder that access to health records is recorded, and to report anything
unusual to your security officer.

The user menu's header also shows your email and your first role.

## Using this Help Centre

The manual you are reading has two ways in.

### The Help Centre

**Help Centre** (`/help`) lists every page of the manual by group: **Getting started**, **Clinical
care**, **Diagnostics and pharmacy**, **Billing and revenue**, **Engagement and wellness**,
**Insights**, **Administration** and **Reference**. Type in the search box to find the page or
heading that mentions what you are looking for, then open it. Links inside a page jump to the
related page, often straight to the right heading.

### Help for the screen you are on

Press the `?` key on any screen (not while typing in a box), or press **Help** at the bottom of the
sidebar. A drawer opens beside the screen with the manual's page for that screen, scrolled to the
section that explains it. Where another page also covers the screen, it is offered as related
reading. Close the drawer to carry on where you were; nothing on the screen is lost.

If a screen has no page of its own, the drawer offers the Help Centre instead. The
[Glossary](glossary.md) explains the terms used across the app.

## Not live yet

- **Multi-factor codes.** When the server asks for a verification code, the sign-in page says so,
  but the **MFA Code** box does not appear, so a code cannot be entered yet. Ask your administrator
  if your account needs one.
- **The ⌘K shortcut** shown in the patient search box does nothing yet.
- **Returning to where you were.** After signing in you always land on the dashboard, not the screen
  you were sent from.
- **Debug Session Info**, the link at the foot of the sign-in page, is a technical page for support
  staff showing the contents of your session. You do not need it for day-to-day work.
