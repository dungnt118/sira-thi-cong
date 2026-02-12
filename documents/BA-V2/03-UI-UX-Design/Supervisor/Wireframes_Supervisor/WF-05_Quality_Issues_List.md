# 📱 WIREFRAME 05: Quality Issues List - Desktop

**Screen:** Quality Issues List (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Quality Issues                                                         │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  [All Projects ▼]  [All Severity ▼]  [All Status ▼]  [This Month ▼]    │
│              │                                                          [+ Create Issue]│
│  📸 Evidence ├─────────────────────────────────────────────────────────────────────────┤
│              │                                                                          │
│  ⚠️  Issues  │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ 🚨 ISS-2026-001  Foundation crack detected                         │ │
│  📊 Reports  │  │    PRJ-2026-001 • ABC Corp                         CRITICAL • OPEN │ │
│              │  │    Created: 2h ago by Supervisor                                   │ │
│  📈 Analytics│  │    Assigned to: Nguyen Van A (OL)                                  │ │
│              │  │    [View Details]                                                  │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│  ─────────   │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│  ⚙️  Settings│  │ ⚠️  ISS-2026-002  Waterproofing quality below standard            │ │
│              │  │    PRJ-2026-002 • XYZ Ltd                              HIGH • OPEN │ │
│  👤 Profile  │  │    Created: 5h ago by Supervisor                                   │ │
│              │  │    Assigned to: Tran Van B (OL)                                    │ │
│              │  │    [View Details]                                                  │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ 📋 ISS-2026-003  Tile alignment inconsistent                       │ │
│              │  │    PRJ-2026-001 • ABC Corp                       MEDIUM • RESOLVED │ │
│              │  │    Created: 1 day ago by Supervisor                                │ │
│              │  │    Resolved: 6h ago by Nguyen Van A                                │ │
│              │  │    [View Details]                                                  │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ ℹ️  ISS-2026-004  Paint color verification needed                  │ │
│              │  │    PRJ-2026-003 • DEF Inc                       LOW • IN_PROGRESS │ │
│              │  │    Created: 2 days ago by Supervisor                               │ │
│              │  │    Assigned to: Le Van C (OL)                                      │ │
│              │  │    [View Details]                                                  │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Showing 1-10 of 24 issues              [◀ Prev]  [1][2][3]  [Next ▶] │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Filter Bar
- **Height:** 56px
- **Dropdowns:** 160px width each
- **Create button:** Primary button, right-aligned

### Issue Card
- **Height:** Auto (min 120px)
- **Border-radius:** 8px
- **Border:** 2px solid (color by severity)
- **Padding:** 20px
- **Margin-bottom:** 16px
- **Shadow:** 0 2px 4px rgba(0,0,0,0.1)
- **Hover:** Elevate shadow

### Severity Icons & Colors
- **CRITICAL:** 🚨 Red (#F44336), red border
- **HIGH:** ⚠️ Orange (#FF9800), orange border
- **MEDIUM:** 📋 Blue (#2196F3), blue border
- **LOW:** ℹ️ Gray (#757575), gray border

### Issue Header
- **Issue ID:** 14px, bold, monospace
- **Title:** 18px, semibold
- **Spacing:** 8px between ID and title

### Issue Meta
- **Project:** 14px, with bullet separator
- **Severity & Status:** Badges, right-aligned
- **Created info:** 13px, gray
- **Assigned to:** 13px, with avatar (24x24px)

### Status Badges
- **OPEN:** Orange (#FFF3E0 bg, #FF9800 text)
- **IN_PROGRESS:** Blue (#E3F2FD bg, #2196F3 text)
- **RESOLVED:** Green (#E8F5E9 bg, #4CAF50 text)
- **CLOSED:** Gray (#F5F5F5 bg, #757575 text)

---

## INTERACTIONS

### Card Click
- Navigate to issue detail page
- Highlight card on hover

### Create Issue
- Open create issue modal
- Pre-fill project if from project page
- Require: Title, Severity, Description, Photos

### Filters
- Apply immediately
- Update URL params
- Show count in filter dropdown

---

## RESPONSIVE BEHAVIOR

### Mobile (375-767px)
- Stack filters vertically
- Reduce card padding
- Hide less important meta
- Floating action button for create

---

**Related Screens:**
- WF-06: Quality Issue Detail
- WF-07: Create Issue Modal
