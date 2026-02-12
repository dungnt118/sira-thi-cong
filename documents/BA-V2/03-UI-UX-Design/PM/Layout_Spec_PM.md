# Layout Specification - Project Manager (PM)
**SIRA Service Management Platform**

---

## 1. LAYOUT OVERVIEW

### 1.1 Layout Characteristics

| Attribute | Value |
|-----------|-------|
| **Layout Name** | PM Desktop Interface |
| **Max Width** | 1280px |
| **Primary Device** | Desktop (1920x1080, 1366x768) |
| **Secondary Device** | Tablet (768-1024px) |
| **Navigation Type** | Side Navigation + Top Bar |
| **Design Approach** | Desktop-first, progressive enhancement |

---

## 2. GRID SYSTEM

### 2.1 Breakpoints

```css
/* Desktop Large */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
    padding: 24px;
  }
  .grid { columns: 12; gap: 16px; }
}

/* Desktop Medium */
@media (min-width: 1024px) and (max-width: 1279px) {
  .container { max-width: 100%; padding: 16px; }
  .sidebar { collapsed: icons-only; }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .container { padding: 16px; }
  .sidebar { hidden: hamburger-menu; }
  .grid { columns: 6; }
}

/* Mobile */
@media (max-width: 767px) {
  .container { padding: 12px; }
  .grid { columns: 4; stack: vertical; }
}
```

---

## 3. NAVIGATION COMPONENTS

### 3.1 Top Navigation Bar

**Height**: 64px  
**Background**: #001529 (Dark blue)  
**Position**: Fixed top

**Structure**:

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] SIRA           [Search Bar]      [🔔 3] [Avatar▼] │
└──────────────────────────────────────────────────────────┘
```

**Elements**:

| Element | Position | Dimensions | Notes |
|---------|----------|------------|-------|
| Logo + Brand | Left (16px) | 120px x 40px | Clickable → Dashboard |
| Global Search | Center | 400px x 40px | Icon + input, placeholder: "Search projects, customers..." |
| Notification Icon | Right (-80px) | 40px x 40px | Badge count (red circle), max 99+ |
| Profile Dropdown | Right (16px) | Auto x 40px | Avatar + name + chevron |

**Notification Dropdown** (opens below icon):
- Width: 360px
- Max height: 480px (scrollable)
- Groups: Unread (bold) / Read
- Actions: "Mark all as read" | "View all"

**Profile Dropdown** (opens below avatar):
- Width: 200px
- Items:
  - My Profile
  - Account Settings
  - Help & Support
  - ---
  - Sign Out

---

### 3.2 Side Navigation Menu

**Width**: 
- Expanded: 240px
- Collapsed: 64px (icons only)

**Background**: #001529 (Dark blue, matches top bar)  
**Position**: Fixed left

**Collapse Behavior**:
- Desktop >1280px: Expanded by default, user can collapse
- Desktop 1024-1280px: Auto-collapsed (icons only), hover to peek
- Tablet <1024px: Hidden, hamburger menu in top bar

**Menu Structure**:

```
┌─────────────────────┐
│ 🏠 Dashboard        │
│ 📋 Projects        ▼│ (expandable)
│   ├─ All Projects   │
│   ├─ My Projects    │
│   └─ Create New     │
│ 👥 Teams            │
│ 👤 Customers        │
│ 💰 Financials      ▼│
│   ├─ Milestones     │
│   └─ Transactions   │
│ 📊 Reports          │
│ ⚙️  Settings         │
│                     │
│ [Collapse Button]   │ (bottom)
└─────────────────────┘
```

**Menu Item States**:
- Default: Text #fff, opacity 0.7
- Hover: Background #1890ff20, opacity 1
- Active: Background #1890ff, opacity 1, left border 3px #1890ff

---

### 3.3 Breadcrumb Navigation

**Position**: Below top bar, above content  
**Height**: 48px  
**Background**: Transparent

**Format**: `Home > Projects > Project #123 > Edit`

**Styling**:
- Font: 14px, color #8c8c8c
- Active link: color #1890ff, underline on hover
- Separator: `/` color #d9d9d9

---

## 4. DASHBOARD LAYOUT

### 4.1 Grid Layout (Desktop 1280px+)

**12-column grid, 16px gap**

```
Row 1: KPI Cards (4 cards x 3 cols)
┌──────┬──────┬──────┬──────┐
│ KPI1 │ KPI2 │ KPI3 │ KPI4 │
│ 3col │ 3col │ 3col │ 3col │
└──────┴──────┴──────┴──────┘

Row 2: Charts (8 cols + 4 cols)
┌──────────────────┬──────┐
│ Timeline Chart   │ Pie  │
│ 8 cols           │ 4col │
└──────────────────┴──────┘

Row 3: Tables (6 cols each)
┌──────────────┬──────────────┐
│ Recent Proj  │ Recent Pay   │
│ 6 cols       │ 6 cols       │
└──────────────┴──────────────┘

Row 4: Quick Actions (12 cols)
┌──────────────────────────────┐
│ [Buttons x4]                 │
└──────────────────────────────┘
```

### 4.2 KPI Card Component

**Dimensions**: Auto width (flex), height: 120px  
**Padding**: 16px  
**Background**: #ffffff  
**Border**: 1px solid #d9d9d9  
**Hover**: Box shadow 0 2px 8px rgba(0,0,0,0.1)

**Structure**:

```
┌──────────────────┐
│ 📋 Total Projects │ (icon + title, 12px gray)
│                  │
│ 48               │ (big number, 32px bold)
│ ▲ +12% vs prev   │ (trend, 14px green/red)
└──────────────────┘
```

**Variants**:
- **Total Projects**: Blue icon, count
- **Active Projects**: Orange icon, count + link "View all"
- **Pending Approvals**: Purple icon, count + urgent badge if > 10
- **Revenue**: Green icon, VND amount + % change

---

### 4.3 Timeline Chart (Gantt-like)

**Dimensions**: Full width (8 cols), height: 320px  
**Library**: Ant Design Charts (G2Plot)

**Data**: Projects on Y-axis, dates on X-axis, bars for duration

**Interactivity**:
- Hover bar → tooltip (project name, status, dates)
- Click bar → navigate to project detail

---

### 4.4 Project Status Distribution (Pie Chart)

**Dimensions**: Full width (4 cols), height: 320px

**Data**: Count per status (DRAFT, SCHEDULED, IN_PROGRESS, etc.)

**Colors**: Status badge colors (gray, blue, orange, green, etc.)

---

### 4.5 Recent Projects Table

**Columns**:
| Column | Width | Sortable | Notes |
|--------|-------|----------|-------|
| Project Code | 120px | Yes | Link to detail |
| Project Name | Auto | Yes | Truncate with ellipsis |
| Customer | 150px | Yes | |
| Status | 120px | Yes | Badge |
| PM | 100px | No | Avatar + name |
| Actions | 80px | No | Dropdown menu |

**Rows**: 5 recent projects (by created_at DESC)

**Actions Dropdown**:
- View Details
- Edit
- Delete (if status = DRAFT)

---

## 5. PROJECT DETAIL PAGE

### 5.1 Page Header

**Structure**:

```
┌────────────────────────────────────────────────────┐
│ [Back] Project #PRJ-2026-001                  [Edit] │
│ Customer: ABC Corp | Status: IN_PROGRESS            │
│                                                    │
│ [Tab1: Overview] [Tab2: Evidence] [Tab3: Financials] [Tab4: Portal] │
└────────────────────────────────────────────────────┘
```

**Tabs**:
- Overview: Project details, team, timeline
- Evidence: Gallery, filters
- Financials: Milestones, transactions, P&L
- Customer Portal: Link management

---

### 5.2 Project Overview Tab

**Layout** (2 columns):

**Left Column (8 cols)**:
- **Project Info Card**:
  - Code, Name, Customer, Contract
  - Address, GPS (map embedded)
  - Waterproofing type
  - Dates (planned vs actual)
  
**Right Column (4 cols)**:
- **Team Card**:
  - PM (avatar + name)
  - Supervisor (if outsource)
  - Outsource Leader (if outsource)
  - Staff count
  
- **Status Card**:
  - Current status badge
  - Progress bar (% complete)
  - Next milestone

---

### 5.3 Evidence Gallery Tab

**Filter Bar** (top):

```
┌──────────────────────────────────────────────────┐
│ Stage: [All▼] Status: [All▼]  Date: [Range▼]  [Search] │
└──────────────────────────────────────────────────┘
```

**Gallery Grid** (4 cols on desktop, 2 on tablet, 1 on mobile):

```
┌──────┬──────┬──────┬──────┐
│ Img1 │ Img2 │ Img3 │ Img4 │
│ [✓]  │ [⏳] │ [✗]  │ [⏳] │
└──────┴──────┴──────┴──────┘
```

**Image Card**:
- Thumbnail: 100% width, 200px height (cover)
- Overlay (bottom): Upload date, uploader name
- Status badge (top-right corner)
- Hover: Darken + "View" button

**Lightbox** (on click):
- Fullscreen image
- Prev/Next arrows
- Actions: Approve | Reject | Download

---

### 5.4 Financials Tab

**Layout**:

**Row 1: Summary Cards** (3 cols each):
- Total Contract Value (VND)
- Total Paid (VND, green)
- Outstanding (VND, orange)
- Profit/Loss (VND, green/red)

**Row 2: Milestones Table** (12 cols):

| Milestone Type | Percentage | Amount | Due Date | Status | Actions |
|----------------|------------|--------|----------|--------|---------|
| DEPOSIT | 30% | 15,000,000 | 2026-03-01 | PAID ✓ | View |
| ADVANCE | 30% | 15,000,000 | 2026-04-01 | PENDING ⏳ | Edit |
| FINAL | 40% | 20,000,000 | 2026-05-01 | PENDING ⏳ | Edit |

**Button**: "+ Add Milestone" (top-right)

---

### 5.5 Customer Portal Tab

**Portal Link Management**:

**Table**:

| Token | Access Level | Created | Status | Actions |
|-------|--------------|---------|--------|---------|
| `abc123...` | BASIC | 2026-02-01 | ACTIVE ✓ | Copy \| Revoke |
| `def456...` | FULL | 2026-02-10 | ACTIVE ✓ | Copy \| Revoke |

**Button**: "+ Generate New Link"

**Generate Modal**:
- Access Level: Radio (BASIC / FULL)
- Expiration: Radio (Never / Custom date)
- [Cancel] [Generate]

**Success Modal**:
- Link: `https://sira.com/portal/{token}` [Copy]
- QR Code (center, 200x200px)
- [Close]

---

## 6. FORMS

### 6.1 Project Create/Edit Form

**Layout**: 2 columns on desktop, 1 column on mobile

**Fields** (left to right):

**Column 1**:
- Project Code* (auto or manual)
- Project Name*
- Customer* (dropdown, searchable)
- Contract* (dropdown, filtered by customer)
- Project Type* (radio: INTERNAL / OUTSOURCE)

**Column 2**:
- Address*
- GPS Coordinates (map picker)
- Waterproofing Type (select)
- Planned Start Date*
- Planned End Date*

**If OUTSOURCE selected**:
- Outsource Company* (dropdown)
- Supervisor* (dropdown, role=SUPERVISOR)
- Outsource Leader* (dropdown, filtered by company)

**Buttons** (bottom-right):
- [Cancel] [Save Draft] [Save & Start]

---

### 6.2 Payment Milestone Form

**Layout**: Single column modal, width: 600px

**Fields**:
- Milestone Type* (dropdown: DEPOSIT / ADVANCE / ACCEPTANCE / FINAL)
- Percentage* (number, 0-100, suffix: %)
- Amount (VND, read-only, auto-calculated)
- Due Date* (date picker, default +30 days)
- Note (textarea, optional, max 500 chars)

**Footer**:
- Validation message: "Total milestones: 60% / 100%"
- [Cancel] [Save Milestone]

---

## 7. COMPONENT SPECIFICATIONS

### 7.1 Button Styles

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| Primary | #1890ff | #fff | None | #40a9ff |
| Secondary | Transparent | #1890ff | 1px #1890ff | Background #1890ff20 |
| Danger | #ff4d4f | #fff | None | #ff7875 |
| Ghost | Transparent | #262626 | 1px #d9d9d9 | Background #00000010 |

**Sizes**:
- Small: 24px height, 12px padding
- Medium: 32px height, 16px padding
- Large: 40px height, 24px padding

---

### 7.2 Input Fields

**Default State**:
- Height: 32px (medium), 40px (large)
- Border: 1px solid #d9d9d9
- Border-radius: 2px
- Padding: 4px 11px
- Font: 14px

**Focus State**:
- Border: 1px solid #40a9ff
- Box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2)

**Error State**:
- Border: 1px solid #ff4d4f
- Helper text: color #ff4d4f, 12px

---

### 7.3 Status Badges

**Pill shape**: Padding 4px 8px, border-radius 2px

| Status | Background | Text | Icon |
|--------|------------|------|------|
| DRAFT | #d9d9d9 | #595959 | 📝 |
| SCHEDULED | #e6f7ff | #0050b3 | 📅 |
| IN_PROGRESS | #fff7e6 | #d46b08 | ⏳ |
| AWAITING_APPROVAL | #f9f0ff | #531dab | 👁 |
| COMPLETED | #f6ffed | #389e0d | ✓ |
| CLOSED | #262626 | #fff | 🔒 |
| CANCELLED | #fff1f0 | #cf1322 | ✗ |

---

## 8. RESPONSIVE BEHAVIOR

### 8.1 Tablet (768-1023px)

**Changes**:
- Sidebar → Hamburger menu (top-left)
- Dashboard grid: 6 columns (KPIs 2x2, charts stack)
- Tables: Horizontal scroll
- Forms: Single column

### 8.2 Mobile (<768px)

**Changes**:
- Top bar: Logo + Hamburger + Notification + Avatar
- Search: Hidden (icon → opens modal)
- Dashboard: All widgets stack vertically (1 column)
- Tables → Card list
- Forms: Full-width inputs, larger touch targets (44px)

---

## 9. ACCESSIBILITY

- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus indicators (blue outline)
- [ ] ARIA labels for icons
- [ ] Alt text for images
- [ ] Screen reader support

---

**Version**: 1.0  
**Date**: 2026-02-12  
**Status**: Draft
