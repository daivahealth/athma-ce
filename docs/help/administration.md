---
title: 'Administration'
group: 'Administration'
order: 170
routes: ['/configurations', '/catalogs', '/tenants', '/facilities', '/users', '/staff', '/spaces', '/rbac', '/plugin-management']
description: 'Tenant and facility context, configurations and feature switches, ABDM settings, clinical catalogs, tenants, facilities, users, staff, spaces, roles and plugins.'
---

Administration is where you set up the organisation the rest of the app runs on: which features are
switched on, the master data clinicians pick from, who can sign in, which facilities they work in,
and what their roles allow.

You reach it two ways:

- The sidebar's **Administration** group, which is always shown: **Configurations**, **ABDM Settings**,
  **Clinical Catalogs**, **RCM Setup** and **PE Setup**.
- The **Administration** menu behind the gear icon in the topbar: **Tenants**, **Facilities**, **Users**,
  **Staff**, **Spaces**, **RBAC** and, below a divider, **Plugin Management**. These screens are not in
  the sidebar, so the gear menu is the way in.

**RCM Setup** is explained in [Billing setup](billing-setup.md) and **PE Setup** in
[Patient engagement](patient-engagement.md#pe-setup).

## Tenant, facility and what they change

A **tenant** is your organisation as a whole: a clinic group or hospital network. A **facility** is
one site within it. Everything you do is done as one user, in one tenant, in one facility at a time.
Your current facility is shown under your name at the foot of the sidebar.

Every request the app makes to the server carries your tenant and current facility. So the facility
you are in decides:

- which records you see and which you create: patients, encounters, orders and bills are written
  against the current facility;
- which **Spaces** are listed (the [Spaces](#spaces) screen shows only the current facility's);
- which configuration values apply, because a facility can override a tenant setting (see
  [Configurations](#configurations));
- and so which sidebar sections you see, because those are switched on by configuration.

### Switching facility

1. Open the user menu (the person icon at the right of the topbar). It shows your email and your first
   role, as **Role: _name_**, or **No roles assigned**.
2. Under **Switch Facility**, pick a facility. Each lists its type; your home facility is marked
   **(Home)** and the current one has a tick and cannot be picked.
3. The app asks the server for a new sign-in token for that facility, says **Facility switched**
   ("You are now working in the selected facility."), and reloads the page.

**Check:** the facility name at the foot of the sidebar has changed.

**If instead:** the **Switch Facility** section is missing, you have access to only one facility. Ask
an administrator to grant more on your user record ([Facility access](#facility-access)). If the server
refuses, the screen says **Unable to switch facility** with its reason.

### What controls the sidebar

Sidebar sections are switched on by **feature switches**, not by roles. A section such as Wellness,
Membership, Pharmacy, Inpatient Care, Revenue Cycle, Results & Reporting, Patient Engagement or
Analytics appears only when its `feature.nav.*` setting is on for your tenant (or facility). A
specialty plugin such as Oncology adds its section when it is activated for the tenant. The core
sections (Patient Access, Clinical, Operating Theatre, Billing and Administration) are always shown.

**Roles do not hide sidebar items.** Your roles and their permissions are checked by the server when
you load or save something. If a role does not allow an action, the screen still opens but the server
refuses, and you see the screen's own failure message (for example, saving an ABDM credential
without the `secret.manage` permission). Ask an administrator to change your roles on
[Users](#users).

## Configurations

**System Configurations** (`/configurations`) lists every setting the platform has, grouped into
cards by category, with a search box (**Search configurations...**) that matches the key, the
description or the category.

The rule for which value wins is shown at the top of the first tab: **facility overrides take
precedence over tenant overrides, which take precedence over instance defaults.** The instance default
is the platform-wide value; a tenant override is your organisation's own value.

Four tabs:

- **Effective Configuration**: the value actually in use for you, with a **Tenant Override** or
  **Facility Override** badge where one applies and the **Instance Default** shown underneath for
  comparison.
- **Instance Level**: the platform defaults.
- **Tenant Overrides**: only the settings your tenant has changed, each with **Reset to default**.
  Says "No tenant-specific overrides configured" when there are none.
- **Facility Overrides**: the current facility's overrides. Read-only here.

Each setting shows its key, its type (boolean, string, number, json), and badges:

| Badge | Meaning |
| --- | --- |
| **Overridable** | Your tenant may set its own value. Only these can be edited. |
| **Sensitive** (red) | The value is hidden as dots and cannot be edited here. |
| **Tenant Override** | Your tenant has its own value. |
| **Facility Override** | The current facility has its own value, which wins. |

Under each value: when it was last **Updated** and **By** whom (a shortened user id).

### Changing a setting

All changes made here are saved as a **tenant override**: they apply to every facility in your tenant
that has no facility override of its own.

- **On/off settings**: flip the switch. It says **Saving...**, then **Enabled** or **Disabled**. The
  switch is greyed out when a facility override is in force, because the facility value would win
  anyway.
- **Text and number settings**: press **Edit**, type the new value, then press the tick (or Enter).
  The cross (or Escape) cancels.
- **JSON settings** show their value but have no **Edit** button.
- **Reset** (or **Reset to default** on the Tenant Overrides tab) deletes your tenant override, so the
  instance default applies again.

The footer counts the total settings, tenant overrides and facility overrides.

### Switching a module on

The sidebar's optional sections are settings in the **features** category, all off by default:

| Setting | Sidebar section |
| --- | --- |
| `feature.nav.resultsReporting` | Lab, and Results & Reporting |
| `feature.nav.inpatientCare` | Inpatient Care |
| `feature.nav.revenueCycle` | Revenue Cycle |
| `feature.nav.pharmacy` | Pharmacy |
| `feature.nav.prm` | Patient Engagement |
| `feature.nav.analytics` | Analytics |
| `feature.nav.wellness` | Wellness |
| `feature.nav.membership` | Membership |

1. On **Effective Configuration**, search for `feature.nav`.
2. Flip the switch for the section.

**Check:** the sidebar shows (or drops) the section. Other users see the change the next time their
app reloads its settings, within about five minutes, or straight away if they refresh.

Plugin sections such as Oncology are switched from [Plugin Management](#plugin-management) instead.

## ABDM Settings

**ABDM Settings** (`/configurations/abdm`) sets up the Ayushman Bharat Digital Mission connection, which
lets you create and link patients' ABHA numbers. It has three cards.

### Activation

A switch reading **ABDM is enabled for this tenant** or **ABDM is disabled for this tenant**. The card
also shows the **Environment** the connection points at (for example `sandbox`). Offering ABHA to
patients needs this switch on **and** working credentials below.

### Gateway credentials

The credentials are **write-only**: they are encrypted when saved and can never be shown again, only
replaced.

1. Choose the **Credential scope**. In ABDM each facility is its own health information provider, so
   credentials are usually stored per facility. Choose **Tenant-wide (all facilities)** for a single
   registration covering the whole tenant.
2. For **ABDM Client ID** and **ABDM Client Secret**, type the value and press **Save**.

Each credential shows **Not configured**, or **Configured · updated _date_** once saved. A **Saved** badge
flashes for a few seconds after a save. When one is configured the button reads **Rotate**: type a new
value and press it to replace the old one.

**If instead:** the screen says "Could not save the credential — check your permissions (secret.manage)
and try again." Your role lacks the permission to manage secrets.

### Gateway health

Press **Check now** to run a real handshake with the ABDM gateway using the stored credentials. The
result badge:

| Badge | Meaning |
| --- | --- |
| **OK** | The gateway accepted the credentials. |
| **MOCK** | No credentials are stored; ABHA flows run against an offline mock. |
| **ERROR** (red) | The handshake failed; the detail says why. |

"Health check failed — is the clinical service reachable?" means the app could not reach its own
clinical service at all.

## Clinical Catalogs

**Clinical Catalogs** (`/catalogs`) is the master data the rest of the app picks from: the drugs
prescribers choose, the tests labs run, the diagnoses coders search, and so on. It opens on a grid
of cards, one per catalog:

| Card | What it holds |
| --- | --- |
| **Value Sets** | Coded pick-lists used across forms, with English and Arabic display text. |
| **Packages** | Bundled services such as health checks and surgical packages. |
| **Administrative Services** | Registration, consultation and other non-clinical services. |
| **Vital Signs Templates** | Which vitals are captured, by care setting and age group. |
| **Medications** | The formulary: form, strength, route, NDC, drug class, controlled status. |
| **Diagnoses** | ICD releases and their codes. |
| **Lab Tests** | Lab tests with LOINC codes, specimens and reference ranges. |
| **Observation Codes** | The coded analytes that results are recorded against. |
| **Imaging Studies** | Imaging studies with modality, body part and CPT code. |
| **Procedures** | Procedures with CPT and ICD-10-PCS codes and anaesthesia type. |
| **Note Templates** | Clinical note templates and their versions. |
| **Checklist Templates** | Checklists for inpatient and outpatient workflows. |
| **Form Master** | OpenMedForm forms clinicians fill against an encounter. |

Every catalog list has a **Back** button to this grid, a search box, and a **Status** filter (**All**,
**Active**, **Inactive**) where the catalog has one. Rows open the item's detail page, or press **View**.
Active items carry an **Active** badge; inactive ones a grey **Inactive** badge.

Most catalogs are **browse-only** in the app: their contents come from the setup wizard or from data
loads. The ones you can change here are Vital Signs Templates, Lab Tests, Note Templates, Checklist
Templates and Form Master, plus billing mappings on several detail pages.

### Setting up catalogs for the first time

While no catalog has ever been populated, the grid shows a blue **Setup Your Catalogs** banner. While
a population job is running it shows an amber **Catalog Population In Progress** banner with
**View Progress** instead.

**Setup Catalogs** (`/catalogs/setup`) is a four-step wizard: **Country**, **Catalogs**, **Confirm**,
**Progress**.

1. **Select Country**: choose from the list. A country marked **Curated** has prepared template data;
   the screen lists which catalogs come from templates and which will be **AI-generated**. A country
   without curated data warns that "All catalog data will be generated by AI", and recommends
   reviewing it before clinical use. Press **Next**.
2. **Select Catalogs**: every catalog is ticked to start. Each is badged **Template** or **AI**. Use
   **Select All** or **Clear**, and tick the ones you want. **Next** stays greyed out until at least
   one is ticked.
3. **Review & Confirm**: shows the country and how many catalogs, with a reminder that AI-generated
   items are active immediately but flagged for review. Press **Start Population**.
4. **Progress**: a bar shows "_n_ of _m_ catalogs", and each catalog has a row with its status icon
   (clock waiting, spinner in progress, green tick done, red cross failed, skip arrow skipped), the
   items inserted, and where the data came from (**Template**, **AI Enriched**, **AI Generated**).
   **Cancel** stops the job while it runs.

**Check:** the heading reads **Population Complete** with "Successfully inserted _n_ items across _m_
catalogs". Then **View Catalogs**, or **Start New** to run again.

**If instead:** **Failed to start** shows the server's reason on the confirm step; **Population Failed**
or **Population Cancelled** shows on the progress step.

### Value Sets

**Value Sets** (`/catalogs/value-sets`): columns **Value Set** (name and code), **Category**,
**Version**, **Concepts** and **Status**; filter by category. Open one (`/catalogs/value-sets/{code}`)
to see its **Concepts**, searchable by code, display or definition, shown in **English (en)** or
**Arabic (ar)**, with **Include inactive** to show retired concepts.

### Packages and Administrative Services

**Packages** (`/catalogs/packages`) lists each package's **Type**, **Care Setting**, **Items**,
**Validity** and **Status**. The detail page (`/catalogs/packages/{id}`) shows the overview (care
setting, validity, age range, gender restriction) and **Package items**, each with its quantity and
whether it is **Mandatory** or **Clinical only**.

**Administrative Services** (`/catalogs/administrative-services`) lists **Service**, **Category**,
**Type**, **Care Setting**, **Duration** and **Status**, filterable by category and type. The detail
page (`/catalogs/administrative-services/{id}`) badges a service **Taxable**, **Staff Required** or
**Room Required**, and shows its department, duration and billing code.

### Medications, Diagnoses, Imaging Studies and Procedures

Browse-only lists with a detail page each:

- **Medications** (`/catalogs/medications`): **Form**, **Strength**, **Route**, **NDC**, **Drug Class**,
  and **Controlled**, a red badge naming the controlled class.
- **Diagnoses** (`/catalogs/diagnoses`): **Code**, **Description**, **Version**, **Chapter / Block**,
  and **Billable** (green) or **Reference** (grey, not to be billed). Filter by ICD version. The detail
  page also shows synonyms, search terms and the ICD release it came from.
- **Imaging Studies** (`/catalogs/imaging-studies`): **Modality**, **Body Part**, **CPT Code**,
  **Contrast**, **Duration**, **Radiologist**.
- **Procedures** (`/catalogs/procedures`): **Body System**, **CPT Code**, **ICD-10-PCS**, **Anesthesia**,
  **Duration**, **Consent**.

**Observation Codes** (`/catalogs/observation-codes`) is a browse-only list (**Observation Catalog**)
of coded analytes with their **Category**, **Lab Domain**, **Data Type**, **Default Unit** and
**Default Range**.

### Lab Tests

**Lab Tests** (`/catalogs/lab-tests`) lists **Test Name**, **LOINC Code**, **CPT Code**, **Specimen**,
**Fasting**, **TAT**, **Report Style**, **Discipline**, **Units** and **Status**.

The detail page (`/catalogs/lab-tests/{id}`) shows basic information, classification, coding,
specimen and collection, normal ranges, processing and metadata. Two parts can be changed.

**Edit** opens **Edit lab master maintenance fields**:

- **Report Style**: **Structured**, **Narrative** or **Hybrid**.
- **Lab Discipline**: Hematology, Chemistry, Microbiology and so on, or **Not specified**.
- **Turnaround Time (hours)**, a whole number.
- **Reference Lab**, for example In-house.
- **Active lab master**: inactive tests stay in the catalog but should not be offered for new orders.

Press **Save changes**. "Lab master updated" confirms it. "Turnaround time must be a whole number of
hours." refuses a fractional or non-numeric time.

**Result Analyte Template** sets out the rows a result for this test is entered against:

1. **Add root analyte** opens **Add laboratory analyte**. Search the observation catalog (WBC, HGB, a
   LOINC code) and pick one.
2. **Add group** adds a heading row such as Differential Count; then use the add button on the group
   to put analytes under it.
3. Change a row's **Display label**, toggle it required or optional, or remove it.
4. **Save template** saves the whole hierarchy ("Analyte template updated"); **Reset** discards your
   unsaved changes.

Groups only organise the panel: result entry still records one row per analyte.

### Vital Signs Templates

**Vital Signs Templates** (`/catalogs/vital-signs-templates`) lists **Template**, **Care Settings**,
**Age Groups**, **Specialties**, **Version** (with a **Default** badge) and **Status**. Filter by care
setting, age group, default or not, and status. Detail pages (`/catalogs/vital-signs-templates/{id}`)
are read-only.

To create one, press **New** to open **New Vital Signs Template**
(`/catalogs/vital-signs-templates/new`):

1. **Template details**: **Template code**, **Version**, **Name (EN)** and **Name (AR)**, descriptions,
   **Specialties (comma separated)**, and switches for **Active** and **Default for context**.
2. **Context**: tick the **Care settings** (OPD, ER, IPD, ICU, Daycare, Any) and **Age groups**
   (Newborn, Infant, Child, Adolescent, Adult, Elderly, All) it applies to.
3. **Groups & Items**: **Add group**, then **Add item** within it. Each item has an ID, code, type
   (Number, Text, Select, Multiselect, Boolean, Calculated), English and Arabic labels, default unit,
   options for select types, sort order and **Required**.
4. Press **Create template**.

**If instead:** **Cannot create template** with one of:

- "Template code is required."
- "Template name (EN) is required."
- "Select at least one care setting."
- "Select at least one age group."
- "Add at least one group."
- "Each group must have at least one item."

### Note Templates

**Note Templates** (`/catalogs/note-templates`) has tiles for **Total templates**, **Active
templates**, **Tenant-owned** and **Global defaults**, and lists **Template**, **Type**,
**Specialty**, **Status**, **Version**, **Scope** and **Last updated**. Filter by status (**Active**,
**Inactive**, **Archived**) and type (SOAP Note, Discharge Summary, Progress Note and so on).

**New template** (`/catalogs/note-templates/new`) opens **Create note template**: **Template name**,
**Template Type**, **Specialty (optional)**, **Status**, **Change log**, **Description**, and
**Schema JSON**, the template's structure (sections, fields, defaults). Press **Create template**.
"Name required" or "Schema must be valid JSON." refuse it.

The detail page (`/catalogs/note-templates/{id}`) shows the overview, the latest version and the
version history, badged **Tenant template** or **Global default**. A tenant template can be archived:
press **Archive template** and confirm. Archived templates are hidden from charting but kept in
history. Global defaults cannot be archived.

### Checklist Templates

**Checklist Templates** (`/catalogs/checklists`) lists **Template**, **Category**, **Status**,
**Version** and **Last updated**, filterable by status, category and **Inpatient** / **Outpatient**.

1. Press **New Template**. In **Create Checklist Template** give a **Code** (for example
   SURGERY_PRE_OP_V1), a **Name**, a **Category** (Discharge, Surgery, Pre-operative, Admission and so
   on) and an optional **Description**.
2. Save. The template is created as a draft and its page opens (`/catalogs/checklists/{id}`).
3. Press **Add Item** for each line: **Label**, **Item Key**, **Type**, an optional **Section** (items
   are grouped under section headings) and **Help Text**, and tick **Required** if the item must be
   completed before the checklist can be submitted.

**If instead:** "Code must be at least 3 characters", "Name must be at least 3 characters", "Label must
be at least 3 characters", or "Key must be lowercase alphanumeric with underscores".

### Form Master

**Form Master** (`/catalogs/form-master`) holds forms designed in OpenMedForm that clinicians fill
against a patient's encounter. The list shows **Name**, **Form Code**, **Version**, **Frequency**,
**Status** and **Uploaded**.

1. Press **Upload Form** (`/catalogs/form-master/new`).
2. Download the form from OpenMedForm, then paste its JSON into the box or choose the file.
3. Choose the **Frequency type**: how often it should be filled (Every N hours, Every N days, Once
   daily, Weekly, Once per shift, Once per admission, Once per episode, Fill whenever needed, Trigger
   after an event). For the "every N" types set **Every** and the **Unit**.
4. Press **Upload Form**.

**Check:** "Form uploaded": the form is now available for clinicians to fill.

**If instead:** "Invalid JSON.", or "This does not look like an OpenMedForm export bundle — expected
formCode, version, dataSchema, and uiSchema."

To replace an active form, press **New Version** on its row or detail page and upload the new export.
The previous version is archived automatically; charting always uses the latest active version. The
detail page (`/catalogs/form-master/{id}`) shows a read-only **Form Preview**, exactly as clinicians
will see it.

### Billing mappings

The detail pages for packages, administrative services, medications, lab tests, imaging studies and
procedures end with **Billing Mappings**: which billing items are charged when the catalog item is
used. **Add mapping** lets you search for a billing item (code-matched suggestions are highlighted),
set a quantity, and tick **Primary**, **Automatic** and **Requires approval**. Mappings show as badges:
**Primary**, **Auto**, **Needs approval**. The bin icon removes a mapping at once, with no
confirmation. See [Billing setup](billing-setup.md) for billing items themselves.

## Tenants

**Tenants** (`/tenants`, from the gear menu) lists each organisation with **Tenant Name**, **Domain**,
**Status**, **Settings** (language and time zone, or **Default**) and **Created**.

To add one, press **Create tenant**, give a **Tenant name** and a **Domain**, and save. "Tenant
created" confirms it; "Unable to create tenant" gives the server's reason. **View** opens the tenant
(`/tenants/{tenantId}`), which shows each of its facilities as a tree.

## Facilities

**Facilities** (`/facilities`, from the gear menu) lists your tenant's facilities with **Facility**,
**Type**, **City** and **Status**.

1. Press **Create Facility** (`/facilities/new`).
2. Give the **Facility Name** (required), and optionally its type, code, licence number, address,
   city, emirate, postal code, phone, email and website.
3. Press **Create Facility**.

**Check:** "Facility created", and the new facility's page opens.

**If instead:** "Facility name is required" or "Invalid email" under the field, or an error message
from the server.

A facility's page (`/facilities/{facilityId}`) shows its structure as an expandable tree:
departments, then their wards (with patient-room spaces and beds) and clinics (with exam-room
spaces), or **No wards or clinics**. It is read-only.

A new facility is not usable by anyone until you grant access to it on each user's record
([Facility access](#facility-access)).

## Users

**Users** (`/users`, from the gear menu) are the people who sign in. The list shows **Name**,
**Email**, **Role**, **Status** and **Created**.

### Creating a user

1. Press **New User** (`/users/new`).
2. Enter **Email**, **Password** (at least 8 characters), **First Name** and **Last Name**.
3. Optionally **Link Staff Profile** to an existing staff member, or leave **No staff linked**.
4. Press **Create User**.

**Check:** "User created", and the user's page opens. A new user has no roles and no facility access
yet: set both there.

**If instead:** "Enter a valid email", "Password must be at least 8 characters", "First name is
required", "Last name is required", or the server's message.

### The user's page

The user's page (`/users/{userId}`) shows their details with a status badge: **active** (solid),
**invited** (grey), **inactive** or **suspended** (red).

- **Edit User** changes the name, email and **Status** (**Active**, **Inactive**, **Invited**,
  **Suspended**). "User updated" confirms it.
- **Delete** removes the account permanently after you confirm. This cannot be undone.
- **Staff Member**: shows the linked staff profile with **Unlink**, or **Link Staff** to pick one.

### User roles

**User Roles** lists the user's roles, each with **Remove**. Pick one under **Assign Role** and press
**Assign Role**. "All tenant roles are already assigned." when there are none left to add. What each
role allows is set on [Roles](#roles-and-permissions).

### Facility access

**Facility Access** lists the facilities the user may work in, each with its access level badge
(**standard**, **admin**, **read_only**) and **Default** on the home facility.

1. Under **Assign Facility**, pick the facility and an access level (**Standard**, **Admin**, **Read
   only**), and tick **Set as default** if it should be their home facility.
2. Press **Assign Facility**.

**Set Default** makes another facility their home; **Revoke** removes access. A user with more than one
facility gets the **Switch Facility** list in their user menu
([Switching facility](#switching-facility)).

## Staff

**Clinical Staff** (`/staff`, from the gear menu, labelled **Staff**) is the professional record of
each clinician or staff member: separate from their sign-in, so a staff member can exist without a
user account. The list shows **Employee ID**, **Name**, **Staff Type**, **Specialty** (the primary
one), **Languages**, **License** and **Status**.

Search by name, specialty, licence, language or type, filter by type from the **All Types** button,
and **Clear All** resets both. Click a row to open it.

### Adding a staff member

1. Press **New Staff** (`/staff/new`).
2. **Basic Information**: prefix, **First Name**, **Last Name**, middle name, **Employee ID**, **Date of
   Birth**, **Gender** and **Staff Type** (Physician, Nurse, Technician, Administrative, Support).
3. **Contact Information** and **Professional Information**: email, phone, qualification, languages
   (comma separated), licence number and expiry.
4. Press **Create Staff Member**.

**If instead:** "First name is required", "Last name is required", "Date of birth is required",
"Gender is required", "Employee ID is required", "Staff type is required" or "Invalid email".

The staff page (`/staff/{id}`) shows their details, languages, primary specialty and licence. Under
**User Account**, press **Link User** to connect a sign-in account, or **Unlink**. Only users not
already linked to someone else are offered.

## Spaces

**Spaces** (`/spaces`, from the gear menu) lists the rooms of your **current facility**: **Space** (name
and number), **Facility**, **Capacity**, and **Status** (**Available** or **Inactive**). It is
read-only; switch facility to see another site's spaces.

## Roles and permissions

**Roles** (`/rbac/roles`, from the gear menu as **RBAC**) lists each role's **Code**, **Role name**,
**Description** and whether it is a **System role**.

### Creating a role

1. Press **New Role**.
2. Give a **Role Code** (for example billing_manager), a **Role Name** and an optional **Description**.
3. Press **Create Role**. "Role created" confirms it, and the role's page opens for you to add
   permissions.

**If instead:** "Code is required" or "Name is required".

### Giving a role its permissions

The role's page (`/rbac/roles/{id}`) shows **Role Information**, **Role Status** (created, updated and
the permissions count) and **Permissions**, grouped by the resource they act on.

1. Search by name, code or resource to narrow the list.
2. Tick or untick permissions. **Select Visible** and **Clear Visible** act on everything the search is
   showing.
3. Press **Save Permissions**. It stays greyed out until something has changed.

**Check:** "Permissions updated", and the count under **Permissions** changes.

**Edit Role** changes the name and description. **Delete Role** removes it from every user who has it,
after you confirm.

**System roles** are badged **System Role** and are managed by the platform: "System roles are managed
by the platform and cannot be edited." Their buttons and boxes are greyed out. Make a custom role
instead.

Permission changes take effect on the server: a user whose role lost a permission is refused that
action from then on. They do not change what the sidebar shows (see
[What controls the sidebar](#what-controls-the-sidebar)).

## Plugin Management

**Plugin Management** (`/plugin-management`, from the gear menu) lists the specialty modules installed
on the platform, such as Oncology, with a search box and a count of plugins installed.

Each plugin card shows its name, version and specialty, and two badges:

| Badge | Colour | Meaning |
| --- | --- | --- |
| **Active** / **Inactive** | Green / red | Whether the plugin is on for your tenant. The whole card is tinted to match. |
| **Backend Online** / **Backend Offline** / **Checking…** | Blue / orange / grey | Whether the service the plugin runs on is answering. Re-checked every 30 seconds. |

Under that: the service it runs on, how many permissions it adds, and when it was installed.

### Activating a plugin for your tenant

1. Flip the plugin's switch. It says **Updating...**.
2. **Plugin activated** ("_name_ has been activated for this tenant.") confirms it, and the switch reads
   **Active for this tenant**.

Activating also switches on the plugin's sidebar section for the tenant. Deactivating does the reverse
(**Plugin deactivated**). **Activation failed** or **Deactivation failed** gives the server's reason.

**Details** opens the plugin's manifest: registry status, backend health, target service, author,
licence, the tenants it is active for, and the navigation it adds.

### Connectors & Capabilities

Below the plugins, **Connectors & Capabilities** lists standalone connector services, which are not
installed through the plugin registry. The **ABDM Connector** shows **Enabled** or **Disabled** (from
the ABDM activation switch) and the capabilities bound to it. **Configure** opens
[ABDM Settings](#abdm-settings).

## Not live yet

- The **Clinical Catalogs** cards always read "— entries"; no counts are shown.
- On the Medications, Diagnoses, Imaging Studies and Procedures detail pages, and on Lab Tests, the
  **Deactivate** button does nothing. **Edit** does nothing on the first four; on Lab Tests it works.
- A new checklist template is created as a draft and there is no control to activate it or change its
  status.
- The note template archive dialog says you can reactivate an archived template later, but there is no
  control for that.
- Catalog Value Sets, Packages, Administrative Services, Medications, Diagnoses, Observation Codes,
  Imaging Studies and Procedures cannot be added to or edited in the app.
- Tenants, facilities and staff cannot be edited after creation, and a facility's departments, wards,
  clinics and spaces cannot be added here. **Spaces** is a read-only list.
- A new tenant is always created with the Asia/Dubai time zone.
- **Facility Overrides** on **Configurations** are read-only: facility values cannot be set or reset
  here.
- A plugin whose backend is not the clinical service always shows **Backend Offline**, because only the
  clinical service is checked.
- `/rbac/permissions` shows three fixed example rows, not the real permission list, and nothing links
  to it. Use a role's page to see real permissions.
