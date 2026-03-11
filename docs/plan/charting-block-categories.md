# Charting Block Categories — Feature Plan

## Overview

The encounter charting page (`/encounters/[id]/charting`) currently treats all 6 block types equally in the "Add Block" menu. This plan introduces two distinct block categories to better reflect clinical workflow intent.

---

## Block Categories

### Fixed Blocks

**Blocks:** Diagnosis, Orders, Prescription

**Behavior:**
- Always visible in the Add Block menu — never hidden
- Shown as disabled (greyed out) with a checkmark when already added to the chart
- Re-enabled in the menu after being deleted from the chart
- Can be deleted from the chart normally

**Rationale:** These represent core clinical data (ICD-10 diagnoses, lab/imaging orders, medications). They should always be accessible from the menu regardless of chart state.

---

### Dynamic Blocks

**Built-in blocks:** Chief Complaints & HPI, History, Notes

**User-defined blocks:** Clinicians can create custom text blocks with a name of their choice (e.g. "Wound Assessment", "Physiotherapy Notes")

**Behavior:**
- Disappear from the menu when added, reappear when deleted (one instance per type)
- Can be deleted from the chart
- Users can create new block types via the "Create Block" option in the menu

**Rationale:** These are configurable narrative sections that vary by specialty, visit type, and clinician preference.

---

## Add Block Menu Design

```
┌──────────────────────────────────────┐
│  FIXED BLOCKS                        │
│  ⚕  Diagnosis          ✓ Added      │  ← greyed out when on chart
│  📋  Orders                          │
│  💊  Prescription                    │
│ ──────────────────────────────────── │
│  DYNAMIC BLOCKS                      │
│  📝  Chief Complaints & HPI          │
│  🕐  History                         │
│  📌  Notes                           │
│  📄  Wound Assessment                │  ← user-created
│ ──────────────────────────────────── │
│  ＋  Create Block                    │
└──────────────────────────────────────┘
```

### "Create Block" Flow
1. User clicks "Create Block" at the bottom of the menu
2. A dialog appears with a text input: "Give your block a name"
3. User types a name (e.g. "Wound Assessment") and confirms
4. The new block is immediately added to the chart as a text block
5. The custom block type is saved with the encounter note and reappears in the Dynamic Blocks section on next load

---

## Technical Approach

### Files to Change
| File | Change |
|------|--------|
| `smart-charting/types.ts` | Add `FIXED_BLOCK_TYPES`, `DYNAMIC_BLOCK_TYPES`, `isFixedBlock` helper, `CustomBlockDef` interface, add `customBlockDefs?` to `SmartChartingStorageFormat` |
| `smart-charting/menus/command-items.ts` | Split `SLASH_COMMANDS` into `FIXED_SLASH_COMMANDS` and `DYNAMIC_SLASH_COMMANDS` |
| `smart-charting/SmartChartingEditor.tsx` | Grouped Add Block dropdown, disabled fixed items, Create Block dialog, save/restore custom block definitions |

### No Changes Needed
- Block view components (DiagnosisBlockView, OrdersBlockView, PrescriptionBlockView, TextBlockView)
- Backend services or controllers
- Database schema
- API contracts

### Custom Block Storage
Custom block type definitions are stored inside the encounter note's JSONB content field (`SmartChartingStorageFormat.customBlockDefs`). No new database tables or API endpoints are required.

Storage format addition:
```
SmartChartingStorageFormat {
  version: '1.1.0'          // bumped from 1.0.0
  editorType: 'smart-charting'
  tiptapJson: { ... }
  blocks: [ ... ]
  customBlockDefs: [         // NEW — optional
    { id: 'custom_wound_assessment', title: 'Wound Assessment', description: 'Wound Assessment' }
  ]
}
```

Old notes without `customBlockDefs` load fine — the field is optional.

---

## Backward Compatibility

- Existing encounters load without any changes
- The combined `SLASH_COMMANDS` export is preserved so nothing breaks
- TipTap node types and extensions are unchanged

---

## Out of Scope (Phase 2)

- **Tenant-wide custom block library** — currently custom blocks are scoped per encounter note. A future phase would allow admins to define a tenant-level library of reusable dynamic block types stored in Foundation DB.
- **Block templates** — pre-filled content templates for dynamic blocks per visit type or specialty.

---

## Verification Steps

1. Open `/en/encounters/{id}/charting`
2. Click "Add Block" → confirm two labeled sections appear (Fixed Blocks / Dynamic Blocks)
3. Add the Diagnosis block → confirm it greys out in the menu with a checkmark
4. Delete the Diagnosis block from the chart → confirm it becomes enabled again in the menu
5. Add Chief Complaints → confirm it disappears from the menu
6. Click "Create Block" → enter "Wound Assessment" → confirm it is added to the chart
7. Save → reload page → confirm "Wound Assessment" appears in the Dynamic Blocks section and the block is restored on the chart
