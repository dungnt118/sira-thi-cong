# 📱 WIREFRAME 01: Dashboard - Desktop

**Screen:** Dashboard (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Dashboard                                    Last updated: 12/02 18:00 │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │                                                                          │
│              │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  📸 Evidence │  │   ACTIVE         │  │   PENDING        │  │   ISSUES         │      │
│              │  │   PROJECTS       │  │   REVIEWS        │  │   OPEN           │      │
│  ⚠️  Issues  │  │                  │  │                  │  │                  │      │
│              │  │      12          │  │      24          │  │       8          │      │
│  📊 Reports  │  │                  │  │                  │  │                  │      │
│              │  │  ↑ 2 from last   │  │  ↓ 5 from last   │  │  ↑ 3 from last   │      │
│  📈 Analytics│  │     week         │  │     week         │  │     week         │      │
│              │  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│              │                                                                          │
│  ─────────   │  ┌──────────────────┐                                                   │
│              │  │   QUALITY        │                                                   │
│  ⚙️  Settings│  │   SCORE AVG      │                                                   │
│              │  │                  │                                                   │
│  👤 Profile  │  │      95%         │                                                   │
│              │  │                  │                                                   │
│              │  │  ⭐⭐⭐⭐⭐      │                                                   │
│              │  └──────────────────┘                                                   │
│              ├─────────────────────────────────────────────────────────────────────────┤
│              │  Project Progress Trend                                [This Month ▼]  │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │                                                                    │ │
│              │  │  100% ┼─────────────────────────────────────────────────────────  │ │
│              │  │       │                                          ╱╲                │ │
│              │  │   75% ┼─────────────────────────────────────╱───╱  ╲──            │ │
│              │  │       │                                  ╱                         │ │
│              │  │   50% ┼──────────────────────────────╱──                          │ │
│              │  │       │                          ╱                                │ │
│              │  │   25% ┼──────────────────────╱──                                  │ │
│              │  │       │                                                           │ │
│              │  │    0% ┼───────────────────────────────────────────────────────── │ │
│              │  │       Week 1    Week 2    Week 3    Week 4    Week 5             │ │
│              │  │                                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              ├─────────────────────────────────────────────────────────────────────────┤
│              │  Recent Activities                                      [View All →]   │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │  📸  Evidence uploaded by OL Nguyen Van A - PRJ-2026-001           │ │
│              │  │      2 hours ago                                     [Review]      │ │
│              │  ├────────────────────────────────────────────────────────────────────┤ │
│              │  │  ✅  Material variance approved - PRJ-2026-002                     │ │
│              │  │      3 hours ago                                     [View]        │ │
│              │  ├────────────────────────────────────────────────────────────────────┤ │
│              │  │  ⚠️  Quality issue resolved - PRJ-2026-001                         │ │
│              │  │      5 hours ago                                     [View]        │ │
│              │  ├────────────────────────────────────────────────────────────────────┤ │
│              │  │  📊  Weekly report generated                                       │ │
│              │  │      1 day ago                                       [Download]    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Top Navigation Bar
- **Height:** 64px
- **Background:** White (#FFFFFF)
- **Border-bottom:** 1px solid #E0E0E0
- **Logo:** 120px width, left-aligned
- **Menu items:** Horizontal tabs, 14px font, Medium weight
- **Search:** 240px width input field
- **Notifications:** Badge with count (red circle)
- **Avatar:** 40x40px circle with initials

### Side Navigation
- **Width:** 240px (expanded), 64px (collapsed)
- **Background:** White (#FFFFFF)
- **Border-right:** 1px solid #E0E0E0
- **Menu items:** Icon + label, 14px font
- **Active state:** Blue background (#E3F2FD), blue text (#2196F3)
- **Hover state:** Light gray background (#F5F5F5)

### Summary Cards (Top Row)
- **Size:** 280px x 180px each
- **Border-radius:** 8px
- **Border:** 1px solid #E0E0E0
- **Shadow:** 0 1px 3px rgba(0,0,0,0.1)
- **Padding:** 24px
- **Title:** 12px, uppercase, gray (#757575)
- **Value:** 48px, bold, primary color
- **Trend:** 12px, with icon (↑/↓), green/red

### Progress Chart
- **Height:** 300px
- **Background:** White
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 8px
- **Padding:** 24px
- **Line color:** Primary blue (#2196F3)
- **Grid lines:** Light gray (#EEEEEE)
- **Axis labels:** 12px, gray (#757575)

### Activity Feed
- **Background:** White
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 8px
- **Item height:** 72px
- **Item padding:** 16px
- **Icon:** 24x24px, colored by type
- **Text:** 14px, primary text
- **Timestamp:** 12px, gray
- **Action button:** Secondary button style

---

## INTERACTIONS

### Hover States
- **Cards:** Elevate shadow to 0 4px 8px rgba(0,0,0,0.15)
- **Activity items:** Background changes to #F5F5F5
- **Buttons:** Darken by 10%

### Click Actions
- **Summary cards:** Navigate to filtered view
- **Chart:** Show tooltip on hover
- **Activity items:** Navigate to detail page
- **View All:** Navigate to full activity log

### Keyboard Shortcuts
- **Ctrl+D:** Dashboard (current page)
- **Ctrl+E:** Evidence queue
- **Ctrl+I:** Issues list
- **Ctrl+K:** Quick search

---

## RESPONSIVE BEHAVIOR

### Tablet (768-1023px)
- Side navigation collapses to icons only
- Summary cards stack 2 per row
- Chart height reduces to 250px
- Activity feed shows 3 items

### Mobile (375-767px)
- Top nav shows hamburger menu
- Side nav hidden, accessible via drawer
- Summary cards stack vertically (1 per row)
- Chart height reduces to 200px
- Activity feed shows 2 items
- Bottom tab navigation appears

---

## DATA REQUIREMENTS

### API Endpoints
```
GET /api/gs/dashboard/summary
GET /api/gs/dashboard/progress-trend?period=month
GET /api/gs/dashboard/activities?limit=5
```

### Real-time Updates
- Notification count: WebSocket
- Activity feed: Poll every 30 seconds
- Summary cards: Refresh on page load

---

## STATES

### Loading State
- Show skeleton screens for cards
- Show spinner for chart
- Show loading rows for activity feed

### Empty State
- No activities: "No recent activities"
- No data for chart: "No data available for selected period"

### Error State
- Failed to load: "Unable to load dashboard. Please try again."
- Network error: "Connection lost. Retrying..."

---

**Related Screens:**
- WF-02: Evidence Queue
- WF-03: Issues List
- WF-04: Analytics Dashboard
