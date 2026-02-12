# 📐 LAYOUT SPECIFICATION - Supervisor

**SIRA Service Management Platform**  
**Role:** Supervisor (Desktop-First)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. DESIGN PHILOSOPHY

### 1.1 Desktop-First Approach

**Rationale:**
- Supervisor làm việc chủ yếu tại văn phòng
- Cần xem overview nhiều dự án cùng lúc
- Review và approve hàng loạt evidence
- Data-heavy interface (tables, charts, analytics)
- Batch operations require large screen

**Priority:**
1. **Desktop** (1920x1080, 1366x768) - PRIMARY
2. **Tablet** (iPad Pro 1024x1366) - SECONDARY
3. **Mobile** (375px - 768px) - TERTIARY (field inspections only)

### 1.2 Design Principles

- **Efficiency:** Minimize clicks, maximize productivity
- **Data Density:** Show more information without clutter
- **Batch Actions:** Multi-select, bulk operations
- **Keyboard Shortcuts:** Power user features
- **Responsive:** Graceful degradation to mobile

---

## 2. RESPONSIVE BREAKPOINTS

### 2.1 Breakpoint System

```css
/* Mobile (Field Inspection) */
@media (min-width: 375px) { }

/* Tablet Portrait */
@media (min-width: 768px) { }

/* Tablet Landscape / Small Desktop */
@media (min-width: 1024px) { }

/* Desktop Medium (PRIMARY) */
@media (min-width: 1366px) { }

/* Desktop Large */
@media (min-width: 1920px) { }

/* Desktop XL */
@media (min-width: 2560px) { }
```

### 2.2 Layout Behavior

| Breakpoint | Grid Columns | Sidebar | Navigation | Tables |
|------------|--------------|---------|------------|--------|
| 375-767px | 4 columns | Hidden | Bottom tabs | Stacked cards |
| 768-1023px | 8 columns | Drawer | Top + Side | Horizontal scroll |
| 1024-1365px | 12 columns | Fixed (collapsed) | Top + Side | Full table |
| 1366px+ | 12 columns | Fixed (expanded) | Top + Side | Full table + filters |

---

## 3. GRID SYSTEM

### 3.1 Desktop Grid (1366px+)

**12-column grid:**
- Container max-width: 1920px
- Column width: Fluid
- Gutter: 24px
- Margin: 32px

```
┌────────────────────────────────────────────────────────────┐
│ [32px]                                              [32px] │
│   [Col1][Col2][Col3][Col4][Col5][Col6][Col7][Col8]...     │
│   [────][────][────][────][────][────][────][────]...     │
│    24px  24px  24px  24px  24px  24px  24px               │
└────────────────────────────────────────────────────────────┘
```

**Common layouts:**
- Sidebar (3 cols) + Main content (9 cols)
- Main content (8 cols) + Right panel (4 cols)
- Full width (12 cols) for tables

### 3.2 Tablet Grid (768-1023px)

**8-column grid:**
- Container max-width: 1024px
- Column width: Fluid
- Gutter: 24px
- Margin: 24px

### 3.3 Mobile Grid (375-767px)

**4-column grid:**
- Container max-width: 768px
- Column width: Fluid
- Gutter: 16px
- Margin: 16px

---

## 4. SPACING SYSTEM

### 4.1 Base Unit: 8px

```
4px   = 0.5 unit (tight spacing)
8px   = 1 unit (base)
12px  = 1.5 units (compact)
16px  = 2 units (standard)
24px  = 3 units (comfortable)
32px  = 4 units (loose)
48px  = 6 units (section)
64px  = 8 units (large section)
```

### 4.2 Component Spacing

| Component | Padding | Margin |
|-----------|---------|--------|
| Button | 8px 16px | 8px |
| Card | 24px | 16px |
| Input field | 8px 12px | 8px |
| Table cell | 12px 16px | 0 |
| Section | 32px | 24px |
| Page container | 32px | 0 |

---

## 5. TYPOGRAPHY

### 5.1 Font Family

**Primary:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Monospace:** "Fira Code", "Courier New", monospace (for code, IDs)

### 5.2 Type Scale (Desktop)

```css
/* Headings */
h1: 32px / 1.2 / Bold (700)      /* Page title */
h2: 24px / 1.3 / Bold (700)      /* Section title */
h3: 20px / 1.4 / SemiBold (600)  /* Subsection */
h4: 18px / 1.4 / SemiBold (600)  /* Card title */
h5: 16px / 1.5 / Medium (500)    /* Label */

/* Body */
body: 14px / 1.5 / Regular (400)       /* Default text */
body-large: 16px / 1.5 / Regular (400) /* Emphasis */
body-small: 12px / 1.4 / Regular (400) /* Helper text */
caption: 11px / 1.3 / Regular (400)    /* Captions */

/* UI */
button: 14px / 1.2 / Medium (500)
label: 12px / 1.4 / Medium (500)
input: 14px / 1.5 / Regular (400)
table-header: 12px / 1.3 / SemiBold (600)
table-cell: 14px / 1.5 / Regular (400)
```

### 5.3 Type Scale (Tablet)

```css
h1: 28px / 1.2 / Bold (700)
h2: 22px / 1.3 / Bold (700)
h3: 18px / 1.4 / SemiBold (600)
body: 14px / 1.5 / Regular (400)
```

### 5.4 Type Scale (Mobile)

```css
h1: 24px / 1.2 / Bold (700)
h2: 20px / 1.3 / Bold (700)
h3: 18px / 1.4 / SemiBold (600)
body: 16px / 1.5 / Regular (400)  /* Larger for readability */
```

---

## 6. COLOR SYSTEM

### 6.1 Brand Colors

```css
/* Primary (Blue - Professional) */
--primary-50:  #E3F2FD
--primary-100: #BBDEFB
--primary-500: #2196F3  /* Main */
--primary-700: #1976D2
--primary-900: #0D47A1

/* Secondary (Indigo - Supervisor identity) */
--secondary-50:  #E8EAF6
--secondary-500: #3F51B5
--secondary-700: #303F9F

/* Accent (Teal - Actions) */
--accent-500: #009688
--accent-700: #00796B
```

### 6.2 Semantic Colors

```css
/* Success */
--success: #4CAF50
--success-bg: #E8F5E9
--success-light: #C8E6C9

/* Warning */
--warning: #FF9800
--warning-bg: #FFF3E0
--warning-light: #FFE0B2

/* Error */
--error: #F44336
--error-bg: #FFEBEE
--error-light: #FFCDD2

/* Info */
--info: #2196F3
--info-bg: #E3F2FD
--info-light: #BBDEFB
```

### 6.3 Neutral Colors

```css
/* Grays */
--gray-50:  #FAFAFA
--gray-100: #F5F5F5
--gray-200: #EEEEEE
--gray-300: #E0E0E0
--gray-400: #BDBDBD
--gray-500: #9E9E9E
--gray-600: #757575
--gray-700: #616161
--gray-800: #424242
--gray-900: #212121

/* Text */
--text-primary: rgba(0,0,0,0.87)
--text-secondary: rgba(0,0,0,0.60)
--text-disabled: rgba(0,0,0,0.38)
--text-hint: rgba(0,0,0,0.38)
```

### 6.4 Background Colors

```css
--bg-primary: #FFFFFF
--bg-secondary: #F5F5F5
--bg-tertiary: #EEEEEE
--bg-overlay: rgba(0,0,0,0.5)
--bg-hover: rgba(0,0,0,0.04)
--bg-selected: rgba(33,150,243,0.08)
```

### 6.5 Data Visualization Colors

```css
/* Chart colors */
--chart-1: #2196F3  /* Blue */
--chart-2: #4CAF50  /* Green */
--chart-3: #FF9800  /* Orange */
--chart-4: #9C27B0  /* Purple */
--chart-5: #F44336  /* Red */
--chart-6: #009688  /* Teal */
--chart-7: #FFC107  /* Amber */
--chart-8: #607D8B  /* Blue Gray */
```

---

## 7. NAVIGATION

### 7.1 Top Navigation Bar (Desktop)

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ [SIRA Logo]  Projects  Evidence  Issues  Reports  Analytics │
│                                           [🔍] [🔔3] [👤]   │
└────────────────────────────────────────────────────────────┘
```

**Specs:**
- Height: 64px
- Background: White
- Border-bottom: 1px solid Gray-200
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

**Elements:**
- Logo (left): 120px width
- Main menu (center-left): Horizontal tabs
- Search (right): 240px width input
- Notifications (right): Badge count
- Avatar (far right): 40x40px circle

### 7.2 Side Navigation (Desktop)

**Layout:**
```
┌──────────────┬─────────────────────────────────────────────┐
│ [Logo]       │                                             │
│              │                                             │
│ 📊 Dashboard │                                             │
│ 📋 Projects  │           MAIN CONTENT AREA                 │
│ 📸 Evidence  │                                             │
│ ⚠️ Issues    │                                             │
│ 📊 Reports   │                                             │
│ 📈 Analytics │                                             │
│              │                                             │
│ ─────────    │                                             │
│ ⚙️ Settings  │                                             │
│ 👤 Profile   │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

**Specs:**
- Width: 240px (expanded), 64px (collapsed)
- Background: White
- Border-right: 1px solid Gray-200
- Shadow: 1px 0 3px rgba(0,0,0,0.05)

**Collapsed state:**
- Show icons only
- Tooltip on hover
- Expand on click

### 7.3 Breadcrumbs (Desktop)

**Layout:**
```
Home > Projects > PRJ-2026-001 > Evidence Review
```

**Specs:**
- Font-size: 12px
- Color: Gray-600
- Separator: ">" or "/"
- Last item: Bold, Primary color
- Clickable: All except last

### 7.4 Mobile Navigation

**Bottom Tab Bar:**
```
┌─────────────────────────────────────┐
│ [Dashboard] [Evidence] [Issues] [More] │
│     📊         📸        ⚠️       ⋮   │
└─────────────────────────────────────┘
```

**Specs:**
- Height: 56px
- Background: White
- Shadow: 0 -2px 4px rgba(0,0,0,0.1)
- Icon size: 24x24px
- Label: 11px

---

## 8. COMPONENTS

### 8.1 Buttons

**Primary Button:**
```css
Background: Primary-500
Text: White, 14px, Medium
Padding: 8px 16px
Border-radius: 4px
Min-height: 36px
Shadow: 0 1px 3px rgba(0,0,0,0.2)
```

**Secondary Button:**
```css
Background: Transparent
Border: 1px solid Primary-500
Text: Primary-500, 14px, Medium
Padding: 8px 16px
Border-radius: 4px
Min-height: 36px
```

**Text Button:**
```css
Background: Transparent
Text: Primary-500, 14px, Medium
Padding: 8px 16px
Border-radius: 4px
```

**Icon Button:**
```css
Size: 36x36px (desktop), 44x44px (mobile)
Icon: 20x20px (desktop), 24x24px (mobile)
Background: Transparent
Border-radius: 50%
Hover: bg-hover
```

**Button Group:**
```
[Approve] [Reject] [Skip]
```
- Spacing: 8px between buttons
- Align: Right (primary actions)

### 8.2 Data Tables

**Table Structure:**
```
┌────────────────────────────────────────────────────────────┐
│ ☑ | Project Code | Name        | Status  | Progress | ... │
├────────────────────────────────────────────────────────────┤
│ ☑ | PRJ-2026-001 | ABC Corp    | Active  | 80%      | ... │
│ ☐ | PRJ-2026-002 | XYZ Ltd     | Active  | 65%      | ... │
│ ☐ | PRJ-2026-003 | DEF Inc     | Pending | 45%      | ... │
└────────────────────────────────────────────────────────────┘
```

**Specs:**
- Header height: 48px
- Row height: 52px
- Cell padding: 12px 16px
- Border: 1px solid Gray-200
- Hover: bg-hover
- Selected: bg-selected

**Features:**
- Sortable columns (click header)
- Filterable columns (dropdown)
- Multi-select rows (checkbox)
- Sticky header (scroll)
- Horizontal scroll (overflow)
- Pagination (10/25/50/100 per page)
- Column visibility toggle
- Column reorder (drag & drop)
- Export (Excel/CSV)

**Table Header:**
```css
Background: Gray-50
Font-size: 12px
Font-weight: 600
Text-transform: uppercase
Color: Gray-700
```

**Table Cell:**
```css
Font-size: 14px
Color: Text-primary
Vertical-align: middle
```

**Batch Action Toolbar:**
```
┌────────────────────────────────────────────────────────────┐
│ ✓ 5 selected  [Approve] [Reject] [Export] [Clear]         │
└────────────────────────────────────────────────────────────┘
```
- Position: Above table
- Background: Primary-50
- Height: 48px
- Padding: 8px 16px

### 8.3 Cards

**Dashboard Card:**
```
┌─────────────────────────┐
│ Pending Reviews         │
│                         │
│        24               │
│                         │
│ ↑ 12% from last week    │
└─────────────────────────┘
```

**Specs:**
- Padding: 24px
- Border-radius: 8px
- Background: White
- Border: 1px solid Gray-200
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Shadow: 0 4px 8px rgba(0,0,0,0.15)

**Evidence Card (Grid View):**
```
┌───────────────┐
│               │
│   [IMAGE]     │
│               │
├───────────────┤
│ BEFORE        │
│ 12/02 10:30   │
│ [✓] [×]       │
└───────────────┘
```

**Specs:**
- Width: 200px (desktop), 150px (tablet)
- Aspect ratio: 4:3
- Border-radius: 4px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

### 8.4 Input Fields

**Text Input:**
```css
Height: 36px
Padding: 8px 12px
Border: 1px solid Gray-300
Border-radius: 4px
Font-size: 14px
Background: White
```

**Focus state:**
```css
Border: 2px solid Primary-500
Shadow: 0 0 0 3px rgba(33,150,243,0.1)
```

**Error state:**
```css
Border: 2px solid Error
Helper text: Error color, 12px
```

**Search Input:**
```css
Width: 240px (desktop), 100% (mobile)
Icon: 🔍 (left)
Clear button: × (right, when has value)
Placeholder: "Search projects, evidence..."
```

**Dropdown/Select:**
```css
Height: 36px
Padding: 8px 12px
Border: 1px solid Gray-300
Border-radius: 4px
Icon: ▼ (right)
```

**Multi-Select:**
```css
Show selected count: "3 selected"
Dropdown with checkboxes
[Select All] option
```

**Date Picker:**
```css
Calendar popup
Range selection support
Shortcuts: Today, This Week, This Month
```

### 8.5 Badges

**Status Badge:**
```css
Padding: 4px 8px
Border-radius: 4px
Font-size: 11px
Font-weight: 600
Text-transform: uppercase
```

**Colors:**
- Pending: Warning-bg, Warning text
- Approved: Success-bg, Success text
- Rejected: Error-bg, Error text
- In Progress: Info-bg, Info text

**Count Badge:**
```css
Size: 20x20px
Border-radius: 10px
Background: Error
Text: White, 11px, Bold
Position: Absolute, top-right
```

### 8.6 Modals

**Dialog (Desktop):**
```
┌────────────────────────────────────────┐
│ Review Evidence                    [×] │
├────────────────────────────────────────┤
│                                        │
│ [Large image viewer]                   │
│                                        │
│ Quality Score: ⭐⭐⭐⭐⭐            │
│                                        │
│ Feedback:                              │
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│         [Cancel]  [Approve] [Reject]   │
└────────────────────────────────────────┘
```

**Specs:**
- Max-width: 800px (small), 1200px (large)
- Max-height: 90vh
- Border-radius: 8px
- Padding: 24px
- Shadow: 0 8px 16px rgba(0,0,0,0.2)
- Overlay: rgba(0,0,0,0.5)

**Full-Screen Modal (Evidence Review):**
```css
Width: 100vw
Height: 100vh
Background: Black (for image viewer)
Overlay: None
ESC to close
```

### 8.7 Charts

**Line Chart:**
```css
Height: 300px (desktop), 200px (mobile)
Grid lines: Gray-200
Axis labels: 12px, Gray-600
Legend: Top-right
Tooltip: On hover
```

**Bar Chart:**
```css
Height: 300px
Bar width: Auto (based on data count)
Gap: 8px
Colors: chart-1, chart-2, chart-3...
```

**Pie/Donut Chart:**
```css
Size: 300x300px (desktop), 200x200px (mobile)
Donut width: 40px
Labels: Outside with lines
Legend: Right side
```

**Progress Bar:**
```css
Height: 8px
Background: Gray-200
Fill: Success (0-70%), Warning (71-90%), Error (91-100%)
Border-radius: 4px
```

### 8.8 Filters

**Filter Panel:**
```
┌─────────────────────┐
│ Filters             │
├─────────────────────┤
│ Status:             │
│ [All ▼]             │
│                     │
│ Project:            │
│ [Select... ▼]       │
│                     │
│ Date Range:         │
│ [This Month ▼]      │
│                     │
│ Quality Score:      │
│ [0] ──────── [100]  │
│                     │
│ [Clear] [Apply]     │
└─────────────────────┘
```

**Specs:**
- Width: 280px (desktop sidebar)
- Padding: 16px
- Background: White
- Border: 1px solid Gray-200

**Active Filters (Chips):**
```
Status: Active [×]  Project: ABC Corp [×]  [Clear All]
```

---

## 9. SCREEN LAYOUTS

### 9.1 Dashboard (Desktop)

```
┌────────────────────────────────────────────────────────────┐
│ [SIRA Logo]  Dashboard  Evidence  Issues  Reports  Analytics│
│                                           [🔍] [🔔3] [👤]   │
├──────────────┬─────────────────────────────────────────────┤
│ 📊 Dashboard │ Dashboard                                   │
│ 📋 Projects  ├─────────────────────────────────────────────┤
│ 📸 Evidence  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ ⚠️ Issues    │ │  12  │ │  24  │ │   8  │ │  95% │        │
│ 📊 Reports   │ │Active│ │Pending│ │Issues│ │Quality│       │
│ 📈 Analytics │ └──────┘ └──────┘ └──────┘ └──────┘        │
│              ├─────────────────────────────────────────────┤
│              │ Project Progress Trend                      │
│              │ ┌─────────────────────────────────────────┐ │
│              │ │ [Line Chart]                            │ │
│              │ └─────────────────────────────────────────┘ │
│              ├─────────────────────────────────────────────┤
│              │ Recent Activities                           │
│              │ • Evidence uploaded by OL A - 2h ago        │
│              │ • Material variance approved - 3h ago       │
│              │ • Quality issue resolved - 5h ago           │
└──────────────┴─────────────────────────────────────────────┘
```

### 9.2 Evidence Queue (Desktop)

```
┌────────────────────────────────────────────────────────────┐
│ [SIRA Logo]  Dashboard  Evidence  Issues  Reports  Analytics│
│                                           [🔍] [🔔3] [👤]   │
├──────────────┬─────────────────────────────────────────────┤
│ 📊 Dashboard │ Evidence Queue                              │
│ 📋 Projects  ├─────────────────────────────────────────────┤
│ 📸 Evidence  │ [All ▼] [BEFORE ▼] [This Week ▼]  [Export] │
│ ⚠️ Issues    ├─────────────────────────────────────────────┤
│ 📊 Reports   │ ☑ | Thumb | Project | Stage | Uploaded | ... │
│ 📈 Analytics │ ☑ | [IMG] | PRJ-001 | BEFORE| 2h ago   | ... │
│              │ ☐ | [IMG] | PRJ-002 | DURING| 3h ago   | ... │
│              │ ☐ | [IMG] | PRJ-001 | AFTER | 5h ago   | ... │
│              ├─────────────────────────────────────────────┤
│              │ Showing 1-25 of 124    [1][2][3]...[5] [→] │
└──────────────┴─────────────────────────────────────────────┘
```

### 9.3 Evidence Review (Full-Screen)

```
┌────────────────────────────────────────────────────────────┐
│ [←] Evidence Review                                    [×] │
├──────────────────────────────────┬─────────────────────────┤
│                                  │ Project: PRJ-2026-001   │
│                                  │ ABC Corp                │
│                                  │                         │
│                                  │ Uploaded by: OL Name    │
│                                  │ Date: 12/02 10:30       │
│         [LARGE IMAGE]            │ Stage: BEFORE           │
│         [Zoom controls]          │                         │
│         [← Prev | Next →]        │ 📍 Quận 1, TP HCM       │
│                                  │ [View on map]           │
│                                  │                         │
│                                  │ Quality: ⭐⭐⭐⭐⭐   │
│                                  │                         │
│                                  │ Feedback:               │
│                                  │ ┌─────────────────────┐ │
│                                  │ │                     │ │
│                                  │ └─────────────────────┘ │
│                                  │                         │
│                                  │ [Approve] [Reject]      │
└──────────────────────────────────┴─────────────────────────┘
```

### 9.4 Material Approval (Desktop)

```
┌────────────────────────────────────────────────────────────┐
│ Material Variance Approval                                 │
├────────────────────────────────────────────────────────────┤
│ Project: PRJ-2026-001 - ABC Corp                           │
│ Requested by: OL Name                                      │
│ Date: 12/02/2026                                           │
├────────────────────────────────────────────────────────────┤
│ Material Details                                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Xi măng                                                │ │
│ │ Planned: 50 bao                                        │ │
│ │ Actual:  55 bao                                        │ │
│ │ Variance: +10% ⚠️                                      │ │
│ │                                                        │ │
│ │ Reason: Cần thêm xi măng do diện tích tăng            │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ Historical Data                                            │
│ Avg variance for this material: +5%                       │
│ Previous approvals: 3/5                                    │
│                                                            │
│ Feedback:                                                  │
│ ┌────────────────────────────────────────────────────────┐ │
│ │                                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                              [Reject]  [Approve]           │
└────────────────────────────────────────────────────────────┘
```

### 9.5 Analytics Dashboard (Desktop)

```
┌────────────────────────────────────────────────────────────┐
│ Analytics                                                  │
├────────────────────────────────────────────────────────────┤
│ [This Month ▼]  [All Projects ▼]                          │
├────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐         │
│ │ Project Progress     │ │ Quality Score Dist.  │         │
│ │ [Line Chart]         │ │ [Bar Chart]          │         │
│ └──────────────────────┘ └──────────────────────┘         │
│                                                            │
│ ┌──────────────────────┐ ┌──────────────────────┐         │
│ │ Evidence Approval    │ │ Issue Status         │         │
│ │ [Pie Chart]          │ │ [Donut Chart]        │         │
│ └──────────────────────┘ └──────────────────────┘         │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Material Variance Trend                                │ │
│ │ [Line Chart]                                           │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 9.6 Mobile Dashboard (Field Inspection)

```
┌─────────────────────────────────┐
│ [☰] SIRA      [🔔3] [👤]        │
├─────────────────────────────────┤
│ Dashboard                       │
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐       │
│ │    12    │ │    24    │       │
│ │ Active   │ │ Pending  │       │
│ └──────────┘ └──────────┘       │
│                                 │
│ Quick Actions                   │
│ [Review Evidence]               │
│ [Conduct Inspection]            │
│ [View Issues]                   │
│                                 │
│ Recent Projects                 │
│ [Project Card 1]                │
│ [Project Card 2]                │
│                                 │
├─────────────────────────────────┤
│ [Dashboard][Evidence][Issues][More]│
└─────────────────────────────────┘
```

---

## 10. INTERACTIONS

### 10.1 Mouse Interactions (Desktop)

**Hover States:**
- Buttons: Darken background 10%
- Table rows: bg-hover
- Cards: Elevate shadow
- Links: Underline

**Click Actions:**
- Single click: Select/navigate
- Double click: Open detail
- Right click: Context menu

**Drag & Drop:**
- Column reorder (tables)
- File upload (evidence)
- List reorder

### 10.2 Keyboard Shortcuts (Desktop)

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Quick search |
| Ctrl+E | Evidence queue |
| Ctrl+I | Quality issues |
| Ctrl+R | Generate report |
| A | Approve (in review mode) |
| R | Reject (in review mode) |
| → | Next item |
| ← | Previous item |
| Esc | Close modal |
| / | Focus search |
| ? | Show shortcuts |

### 10.3 Touch Interactions (Mobile)

**Gestures:**
- Tap: Primary action
- Long press: Context menu
- Swipe left/right: Navigate
- Swipe down: Refresh
- Pinch: Zoom (images)

**Touch Targets:**
- Minimum: 44x44px
- Spacing: 8px between targets

---

## 11. LOADING STATES

### 11.1 Skeleton Screens

**Table Skeleton:**
```
┌────────────────────────────────────────────────────────────┐
│ ████░░░░ | ████████░░░░ | ████░░░░ | ████░░░░ | ████░░░░ │
│ ████░░░░ | ████████░░░░ | ████░░░░ | ████░░░░ | ████░░░░ │
│ ████░░░░ | ████████░░░░ | ████░░░░ | ████░░░░ | ████░░░░ │
└────────────────────────────────────────────────────────────┘
```

**Card Skeleton:**
```
┌─────────────────────┐
│ ████████░░░░░░░░    │
│                     │
│ ████████████░░░░░░ │
│                     │
│ ████░░░░░░░░░░░░░░ │
└─────────────────────┘
```

### 11.2 Progress Indicators

**Spinner:**
```css
Size: 24px (small), 48px (medium), 64px (large)
Color: Primary-500
Animation: Rotate 360deg, 1s linear infinite
```

**Progress Bar:**
```css
Height: 4px
Background: Gray-200
Fill: Primary-500
Position: Top of page (global loading)
```

**Upload Progress:**
```
Uploading evidence... 45%
████████░░░░░░░░░░
```

---

## 12. EMPTY STATES

### 12.1 No Data

```
┌────────────────────────────────────┐
│                                    │
│          📊                        │
│                                    │
│   No data available                │
│                                    │
│   Try adjusting your filters       │
│   or date range                    │
│                                    │
└────────────────────────────────────┘
```

### 12.2 No Results

```
┌────────────────────────────────────┐
│                                    │
│          🔍                        │
│                                    │
│   No results found                 │
│                                    │
│   Try different search terms       │
│                                    │
└────────────────────────────────────┘
```

---

## 13. RESPONSIVE BEHAVIOR

### 13.1 Desktop → Tablet

**Changes:**
- Sidebar: Collapsed by default
- Tables: Horizontal scroll
- Charts: Smaller height
- Cards: 2-column grid → 1-column

### 13.2 Tablet → Mobile

**Changes:**
- Top nav: Hamburger menu
- Side nav: Hidden, drawer on demand
- Tables: Stacked cards
- Charts: Simplified, smaller
- Filters: Bottom sheet
- Multi-column → Single column

### 13.3 Breakpoint-Specific Features

**Desktop only:**
- Keyboard shortcuts
- Drag & drop
- Multi-window support
- Batch actions (large scale)

**Mobile only:**
- Bottom navigation
- Pull-to-refresh
- Camera integration
- GPS tagging

---

## 14. ACCESSIBILITY

### 14.1 WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation:**
- All functions accessible via keyboard
- Tab order logical
- Focus indicators visible (2px outline)
- Skip to main content link

**Screen Reader Support:**
- Semantic HTML (header, nav, main, aside)
- ARIA labels for icons
- Alt text for images
- Form labels

**Visual:**
- Text resizable up to 200%
- No information by color alone
- Focus indicators
- High contrast mode support

### 14.2 Touch Targets (Mobile)

- Minimum: 44x44px
- Spacing: 8px between targets
- Large enough for finger tap

---

## 15. PERFORMANCE

### 15.1 Optimization

**Images:**
- Lazy loading
- Responsive images (srcset)
- WebP format (with fallback)
- Thumbnail caching

**Tables:**
- Virtual scrolling (large datasets)
- Pagination (default 25 per page)
- Debounced search/filter

**Charts:**
- Canvas rendering (large datasets)
- Lazy load (below fold)
- Responsive resize

### 15.2 Loading Strategy

**Critical:**
- Above-the-fold content
- Navigation
- User context

**Deferred:**
- Charts
- Analytics
- Non-critical images

**Lazy:**
- Below-the-fold content
- Modals
- Tooltips

---

## 16. PRINT STYLES

### 16.1 Print Layout

```css
@media print {
  /* Hide UI elements */
  nav, aside, .no-print { display: none; }
  
  /* Optimize for print */
  body { 
    font-size: 12pt;
    color: black;
    background: white;
  }
  
  /* Page breaks */
  h1, h2, h3 { page-break-after: avoid; }
  table { page-break-inside: avoid; }
  
  /* Show URLs */
  a[href]:after { content: " (" attr(href) ")"; }
}
```

---

## APPENDIX

### A. Component Library

**Recommended:**
- Ant Design (React)
- Material-UI (React)
- Vuetify (Vue)
- Angular Material (Angular)

**Custom components:**
- Evidence viewer
- Batch action toolbar
- Quality score selector
- Material variance calculator

### B. Design Tokens

```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 3px rgba(0,0,0,0.1)",
    "md": "0 4px 8px rgba(0,0,0,0.15)",
    "lg": "0 8px 16px rgba(0,0,0,0.2)"
  }
}
```

### C. References

- Material Design Guidelines
- Apple Human Interface Guidelines
- WCAG 2.1 Accessibility Standards
- FDD_Supervisor.md - Functional requirements
- User_Flows_Supervisor.md - User flow diagrams

---

**Document Status:** Complete  
**Next Steps:** Create User_Flows_Supervisor.md, Wireframes_Supervisor/
