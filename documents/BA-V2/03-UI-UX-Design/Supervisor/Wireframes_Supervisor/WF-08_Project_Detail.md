# 📱 WIREFRAME 08: Project Detail - Desktop

**Screen:** Project Detail (Desktop - 1920x1080)  
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
│  📊 Dashboard│  [← Back] PRJ-2026-001 - ABC Corp Renovation                            │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  [Overview] [Evidence] [Issues] [Materials] [Timeline] [Team]           │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📸 Evidence │                                                                          │
│              │  Project Overview                                                       │
│  ⚠️  Issues  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│              │  │   PROGRESS       │  │   QUALITY        │  │   BUDGET         │      │
│  📊 Reports  │  │                  │  │                  │  │                  │      │
│              │  │      80%         │  │      95%         │  │   On Track       │      │
│  📈 Analytics│  │                  │  │                  │  │                  │      │
│              │  │  ████████░░      │  │  ⭐⭐⭐⭐⭐      │  │  ✅ 98%         │      │
│  ─────────   │  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│              │                                                                          │
│  ⚙️  Settings│  Progress Timeline                                                      │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│  👤 Profile  │  │  [GANTT CHART]                                                     │ │
│              │  │  Foundation    ████████████ 100%                                   │ │
│              │  │  Structure     ████████░░░░  80%                                   │ │
│              │  │  Finishing     ████░░░░░░░░  40%                                   │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Recent Activities                                                      │
│              │  • Evidence approved - BEFORE stage (2h ago)                            │
│              │  • Material variance approved - Xi măng (3h ago)                        │
│              │  • Quality issue resolved - Foundation crack (5h ago)                   │
│              │                                                                          │
│              │  Team Members                                                           │
│              │  👤 Nguyen Van A (OL) - Quality: 95% - Active                           │
│              │  👤 Tran Van B (Worker) - Tasks: 12 - Active                            │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

**Related Screens:**
- WF-01: Dashboard
- WF-02: Evidence Queue (filtered by project)
- WF-05: Quality Issues (filtered by project)
