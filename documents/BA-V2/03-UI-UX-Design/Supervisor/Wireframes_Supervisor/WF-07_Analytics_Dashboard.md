# 📱 WIREFRAME 07: Analytics Dashboard - Desktop

**Screen:** Analytics Dashboard (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Analytics                                                              │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  [This Month ▼]  [All Projects ▼]                      [Export] [Share]│
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📸 Evidence │                                                                          │
│              │  Project Performance Overview                                           │
│  ⚠️  Issues  │  ┌──────────────────────────────────────────────────────────────────┐   │
│              │  │                                                                  │   │
│  📊 Reports  │  │  100% ┼─────────────────────────────────────────────────────    │   │
│              │  │       │                                    ╱╲                    │   │
│  📈 Analytics│  │   75% ┼───────────────────────────────╱───╱  ╲──                │   │
│              │  │       │                            ╱                             │   │
│              │  │   50% ┼────────────────────────╱──                              │   │
│  ─────────   │  │       │                    ╱                                    │   │
│              │  │   25% ┼────────────────╱──                                      │   │
│  ⚙️  Settings│  │       │                                                          │   │
│              │  │    0% ┼──────────────────────────────────────────────────────   │   │
│  👤 Profile  │  │       W1      W2      W3      W4      W5                        │   │
│              │  │                                                                  │   │
│              │  │  Legend: ─── Progress  ─── Quality  ─── Budget                  │   │
│              │  └──────────────────────────────────────────────────────────────────┘   │
│              │                                                                          │
│              │  ┌──────────────────────────┐  ┌──────────────────────────┐            │
│              │  │ Evidence Approval Rate   │  │ Quality Score Dist.      │            │
│              │  │                          │  │                          │            │
│              │  │      [PIE CHART]         │  │      [BAR CHART]         │            │
│              │  │                          │  │                          │            │
│              │  │  ✅ Approved: 85%        │  │  ⭐⭐⭐⭐⭐: 45%       │            │
│              │  │  ❌ Rejected: 10%        │  │  ⭐⭐⭐⭐: 35%         │            │
│              │  │  ⏳ Pending: 5%          │  │  ⭐⭐⭐: 15%           │            │
│              │  │                          │  │  ⭐⭐: 5%              │            │
│              │  └──────────────────────────┘  └──────────────────────────┘            │
│              │                                                                          │
│              │  ┌──────────────────────────┐  ┌──────────────────────────┐            │
│              │  │ Issue Status             │  │ Material Variance        │            │
│              │  │                          │  │                          │            │
│              │  │    [DONUT CHART]         │  │    [LINE CHART]          │            │
│              │  │                          │  │                          │            │
│              │  │  Open: 8 (33%)           │  │  Trend: Decreasing       │            │
│              │  │  In Progress: 12 (50%)   │  │  Avg: +5%                │            │
│              │  │  Resolved: 4 (17%)       │  │  Peak: +12%              │            │
│              │  │                          │  │                          │            │
│              │  └──────────────────────────┘  └──────────────────────────┘            │
│              │                                                                          │
│              │  Team Performance                                                       │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │                                                                    │ │
│              │  │  OL Name     │ Projects │ Quality │ Response │ Issues │ Rating    │ │
│              │  │  ═══════════════════════════════════════════════════════════════  │ │
│              │  │  Nguyen A    │    5     │  95%    │  2.5h    │   2    │ ⭐⭐⭐⭐⭐│ │
│              │  │  Tran B      │    3     │  88%    │  3.2h    │   4    │ ⭐⭐⭐⭐ │ │
│              │  │  Le C        │    4     │  92%    │  2.8h    │   1    │ ⭐⭐⭐⭐⭐│ │
│              │  │  Pham D      │    2     │  85%    │  4.1h    │   5    │ ⭐⭐⭐   │ │
│              │  │                                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Charts
- **Line Chart:** 600px x 300px
- **Pie/Donut Chart:** 300px x 300px
- **Bar Chart:** 300px x 300px
- **Colors:** Use chart color palette from Layout Spec

### Team Performance Table
- **Header:** Gray background
- **Rows:** Alternating white/light gray
- **Hover:** Highlight row
- **Click:** Navigate to member detail

---

**Related Screens:**
- WF-08: Team Performance Detail
- WF-09: Export Report Dialog
