# 📱 WIREFRAME 14: Notifications Center - Desktop

**Screen:** Notifications Center (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Notifications                                                          │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  [All] [Unread (3)] [Evidence] [Issues] [Materials]    [Mark All Read] │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📸 Evidence │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│  ⚠️  Issues  │  │ 🔴 New evidence uploaded                                  2h ago   │ │
│              │  │    Nguyen Van A uploaded 5 photos for PRJ-2026-001 BEFORE stage    │ │
│  📊 Reports  │  │    [Review Now]                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│  📈 Analytics│                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│  ─────────   │  │ 🔴 Material variance requires approval                    3h ago   │ │
│              │  │    Xi măng variance +8% for PRJ-2026-002                           │ │
│  ⚙️  Settings│  │    [Review Variance]                                               │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│  👤 Profile  │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ 🔴 Quality issue created                                  5h ago   │ │
│              │  │    Foundation crack detected in PRJ-2026-001                       │ │
│              │  │    [View Issue]                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ ⚪ OL submitted action plan                               1d ago   │ │
│              │  │    Nguyen Van A submitted plan for ISS-2026-001                    │ │
│              │  │    [Review Plan]                                                   │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ ⚪ Project milestone completed                            2d ago   │ │
│              │  │    PRJ-2026-001 Foundation stage completed                         │ │
│              │  │    [View Project]                                                  │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Showing 1-10 of 24 notifications          [◀ Prev]  [1][2][3]  [Next ▶]│
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Notification Card
- **Height:** Auto (min 80px)
- **Unread:** Blue dot, bold title, light blue background
- **Read:** Gray dot, normal weight, white background
- **Padding:** 16px
- **Margin-bottom:** 12px

### Notification Types & Icons
- **Evidence:** 📸 Blue
- **Material:** 📦 Orange
- **Issue:** ⚠️ Red
- **Action Plan:** 📋 Green
- **Milestone:** 🎯 Purple

### Filter Tabs
- **Active:** Primary color, bold
- **Inactive:** Gray
- **Badge:** Show unread count

---

## INTERACTIONS

### Click Notification
- Mark as read
- Navigate to relevant screen
- Update badge count

### Swipe Actions (Mobile)
- Swipe right: Mark as read
- Swipe left: Delete

### Real-time Updates
- WebSocket connection
- Toast notification for new items
- Auto-refresh every 30s

---

**Related Screens:**
- WF-01: Dashboard (notification badge)
- WF-02: Evidence Queue (from notification)
- WF-06: Quality Issue Detail (from notification)
