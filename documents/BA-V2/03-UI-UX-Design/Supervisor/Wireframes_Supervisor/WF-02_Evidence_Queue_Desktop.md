# 📱 WIREFRAME 02: Evidence Queue - Desktop

**Screen:** Evidence Queue (Desktop - 1920x1080)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [SIRA Logo]    Dashboard    Evidence    Issues    Reports    Analytics                │
│                                                              [🔍 Search] [🔔 3] [👤 SV] │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│              │                                                                          │
│  📊 Dashboard│  Evidence Queue                                                         │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  Filters:                                                               │
│              │  [All Projects ▼]  [BEFORE ▼]  [This Week ▼]  [All Status ▼]           │
│  📸 Evidence │                                                  [Export] [Batch Review]│
│              ├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️  Issues  │  ✓ 5 selected   [Approve Selected] [Reject Selected] [Clear Selection] │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📊 Reports  │  ☑ │ Thumbnail │ Project      │ Stage  │ Uploaded    │ OL Name  │ ... │
│              │  ═══╪═══════════╪══════════════╪════════╪═════════════╪══════════╪═════│
│  📈 Analytics│  ☑ │ [IMG]     │ PRJ-2026-001 │ BEFORE │ 2h ago      │ Nguyen A │ ... │
│              │     │  150x100  │ ABC Corp     │        │ 12/02 16:00 │          │     │
│              │  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│  ─────────   │  ☑ │ [IMG]     │ PRJ-2026-002 │ DURING │ 3h ago      │ Tran B   │ ... │
│              │     │  150x100  │ XYZ Ltd      │        │ 12/02 15:00 │          │     │
│  ⚙️  Settings│  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│              │  ☑ │ [IMG]     │ PRJ-2026-001 │ AFTER  │ 5h ago      │ Nguyen A │ ... │
│  👤 Profile  │     │  150x100  │ ABC Corp     │        │ 12/02 13:00 │          │     │
│              │  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│              │  ☐ │ [IMG]     │ PRJ-2026-003 │ BEFORE │ 1 day ago   │ Le C     │ ... │
│              │     │  150x100  │ DEF Inc      │        │ 11/02 10:00 │          │     │
│              │  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│              │  ☑ │ [IMG]     │ PRJ-2026-002 │ DURING │ 1 day ago   │ Tran B   │ ... │
│              │     │  150x100  │ XYZ Ltd      │        │ 11/02 09:00 │          │     │
│              │  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│              │  ☑ │ [IMG]     │ PRJ-2026-004 │ BEFORE │ 2 days ago  │ Pham D   │ ... │
│              │     │  150x100  │ GHI Group    │        │ 10/02 14:00 │          │     │
│              │  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│              │  ☐ │ [IMG]     │ PRJ-2026-003 │ AFTER  │ 2 days ago  │ Le C     │ ... │
│              │     │  150x100  │ DEF Inc      │        │ 10/02 11:00 │          │     │
│              │  ───┼───────────┼──────────────┼────────┼─────────────┼──────────┼─────│
│              │                                                                          │
│              │  Showing 1-25 of 124 items         [◀ Prev]  [1][2][3]...[5]  [Next ▶] │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Filter Bar
- **Height:** 56px
- **Background:** White
- **Padding:** 12px 24px
- **Dropdowns:** 160px width each
- **Spacing:** 12px between dropdowns
- **Buttons:** Secondary style, right-aligned

### Batch Action Toolbar (when items selected)
- **Height:** 48px
- **Background:** Light blue (#E3F2FD)
- **Border:** 1px solid #2196F3
- **Padding:** 8px 24px
- **Text:** "✓ 5 selected" - 14px, bold
- **Buttons:** Primary (Approve), Destructive (Reject), Text (Clear)

### Data Table
- **Header height:** 48px
- **Row height:** 120px (includes thumbnail)
- **Cell padding:** 12px 16px
- **Border:** 1px solid #E0E0E0
- **Header background:** #F5F5F5
- **Header text:** 12px, uppercase, semibold, gray

### Table Columns
| Column | Width | Alignment | Sortable |
|--------|-------|-----------|----------|
| Checkbox | 48px | Center | No |
| Thumbnail | 180px | Center | No |
| Project | 200px | Left | Yes |
| Stage | 100px | Center | Yes |
| Uploaded | 150px | Left | Yes |
| OL Name | 150px | Left | Yes |
| GPS | 80px | Center | No |
| Quality | 100px | Center | Yes |
| Status | 120px | Center | Yes |
| Actions | 100px | Right | No |

### Thumbnail
- **Size:** 150x100px
- **Border-radius:** 4px
- **Object-fit:** Cover
- **Hover:** Show zoom icon overlay
- **Click:** Open evidence viewer

### Pagination
- **Height:** 48px
- **Alignment:** Center
- **Text:** 14px, gray
- **Buttons:** Icon buttons, 36x36px
- **Page numbers:** Text buttons with active state

---

## INTERACTIONS

### Row Hover
- Background: #F5F5F5
- Show quick action buttons
- Cursor: Pointer

### Row Click
- Single click: Select row (checkbox)
- Double click: Open evidence viewer
- Right click: Context menu

### Checkbox
- Click: Toggle selection
- Header checkbox: Select/deselect all visible

### Thumbnail Click
- Open evidence viewer in full-screen modal
- Load high-resolution image
- Show navigation arrows

### Filter Changes
- Apply immediately
- Show loading state
- Update URL params
- Preserve selection

### Sort
- Click column header to sort
- Toggle ascending/descending
- Show sort indicator (▲/▼)
- Maintain across page changes

### Batch Actions
- **Approve Selected:**
  - Show confirmation dialog
  - Process in background
  - Show progress bar
  - Display success/error toast
  
- **Reject Selected:**
  - Require bulk feedback
  - Open feedback modal
  - Validate input
  - Process and notify

### Export
- Open export dialog
- Select format (Excel/CSV/PDF)
- Choose columns
- Download file

---

## RESPONSIVE BEHAVIOR

### Tablet (768-1023px)
- Reduce thumbnail size to 120x80px
- Hide less important columns (GPS, Quality)
- Horizontal scroll for table
- Stack filters vertically

### Mobile (375-767px)
- Switch to card view (no table)
- Show 1 card per row
- Thumbnail at top of card
- Swipe for quick actions
- Bottom sheet for filters

---

## DATA REQUIREMENTS

### API Endpoints
```
GET /api/gs/evidence/queue?
  project={projectId}&
  stage={stage}&
  dateFrom={date}&
  dateTo={date}&
  status={status}&
  page={page}&
  limit={limit}&
  sort={field}&
  order={asc|desc}

POST /api/gs/evidence/batch-approve
POST /api/gs/evidence/batch-reject
GET /api/gs/evidence/export
```

### Real-time Updates
- New evidence: WebSocket notification
- Status changes: Poll every 60 seconds
- Badge count: Update on action

---

## STATES

### Loading State
```
┌────────────────────────────────────────────┐
│ ████░░░░ │ ████████░░░░ │ ████░░░░ │ ... │
│ ████░░░░ │ ████████░░░░ │ ████░░░░ │ ... │
│ ████░░░░ │ ████████░░░░ │ ████░░░░ │ ... │
└────────────────────────────────────────────┘
```

### Empty State
```
┌────────────────────────────────────────────┐
│                                            │
│              📸                            │
│                                            │
│       No evidence to review                │
│                                            │
│   All evidence has been processed          │
│                                            │
└────────────────────────────────────────────┘
```

### No Results (after filter)
```
┌────────────────────────────────────────────┐
│                                            │
│              🔍                            │
│                                            │
│       No results found                     │
│                                            │
│   Try adjusting your filters               │
│                                            │
│         [Clear Filters]                    │
└────────────────────────────────────────────┘
```

### Error State
```
┌────────────────────────────────────────────┐
│                                            │
│              ⚠️                            │
│                                            │
│   Failed to load evidence queue            │
│                                            │
│         [Retry]                            │
└────────────────────────────────────────────┘
```

---

## KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Space | Select/deselect row |
| Enter | Open evidence viewer |
| A | Approve selected |
| R | Reject selected |
| Ctrl+A | Select all |
| Esc | Clear selection |
| ↑/↓ | Navigate rows |
| / | Focus search |

---

**Related Screens:**
- WF-03: Evidence Viewer (Full-Screen)
- WF-04: Batch Feedback Modal
- WF-05: Export Dialog
