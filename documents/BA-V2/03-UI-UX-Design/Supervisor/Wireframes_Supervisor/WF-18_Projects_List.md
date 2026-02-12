# 📱 WIREFRAME 18: Projects List - Desktop

**Screen:** Projects List (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Projects                                                               │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  [All Status ▼]  [All Clients ▼]  [This Month ▼]          [🔍 Search] │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📸 Evidence │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│  ⚠️  Issues  │  │ PRJ-2026-001 - ABC Corp Renovation                                 │ │
│              │  │ 📍 123 Nguyen Hue, Q1, TP HCM                                      │ │
│  📊 Reports  │  │                                                                    │ │
│              │  │ Progress: ████████░░ 80%    Quality: ⭐⭐⭐⭐⭐ 95%              │ │
│  📈 Analytics│  │ Budget: ✅ On Track          Issues: 2 Open                       │ │
│              │  │                                                                    │ │
│  ─────────   │  │ OL: Nguyen Van A            Started: 01/01/2026                   │ │
│              │  │                                                                    │ │
│  ⚙️  Settings│  │ [View Details]                                                     │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│  👤 Profile  │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ PRJ-2026-002 - XYZ Ltd Office Building                             │ │
│              │  │ 📍 456 Le Loi, Q3, TP HCM                                          │ │
│              │  │                                                                    │ │
│              │  │ Progress: ██████░░░░ 65%    Quality: ⭐⭐⭐⭐ 88%                 │ │
│              │  │ Budget: ⚠️ At Risk           Issues: 4 Open                       │ │
│              │  │                                                                    │ │
│              │  │ OL: Tran Van B              Started: 15/01/2026                   │ │
│              │  │                                                                    │ │
│              │  │ [View Details]                                                     │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │ PRJ-2026-003 - DEF Inc Warehouse                                   │ │
│              │  │ 📍 789 Tran Hung Dao, Q5, TP HCM                                   │ │
│              │  │                                                                    │ │
│              │  │ Progress: ████░░░░░░ 40%    Quality: ⭐⭐⭐⭐⭐ 92%              │ │
│              │  │ Budget: ✅ On Track          Issues: 1 Open                       │ │
│              │  │                                                                    │ │
│              │  │ OL: Le Van C                Started: 01/02/2026                   │ │
│              │  │                                                                    │ │
│              │  │ [View Details]                                                     │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Showing 1-10 of 12 projects               [◀ Prev]  [1][2]  [Next ▶] │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Project Card
- **Height:** Auto (min 160px)
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 8px
- **Padding:** 20px
- **Margin-bottom:** 16px
- **Hover:** Elevate shadow

### Progress Bar
- **Width:** 200px
- **Height:** 8px
- **Colors:** 
  - 0-50%: Orange
  - 51-80%: Blue
  - 81-100%: Green

### Budget Status
- **On Track:** Green ✅
- **At Risk:** Orange ⚠️
- **Over Budget:** Red ❌

---

**Related Screens:**
- WF-08: Project Detail
- WF-01: Dashboard (projects summary)
