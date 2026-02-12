# 📱 WIREFRAME 10: Mobile Dashboard

**Screen:** Mobile Dashboard (375x812 - iPhone X)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────┐
│ [☰] SIRA      [🔔 3] [👤]       │
├─────────────────────────────────┤
│ Dashboard                       │
├─────────────────────────────────┤
│                                 │
│ ┌──────────┐ ┌──────────┐      │
│ │    12    │ │    24    │      │
│ │ Active   │ │ Pending  │      │
│ │ Projects │ │ Reviews  │      │
│ └──────────┘ └──────────┘      │
│                                 │
│ ┌──────────┐ ┌──────────┐      │
│ │     8    │ │    95%   │      │
│ │  Issues  │ │ Quality  │      │
│ │   Open   │ │  Score   │      │
│ └──────────┘ └──────────┘      │
│                                 │
│ Quick Actions                   │
│ ┌─────────────────────────────┐ │
│ │ 📸 Review Evidence          │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🔍 Conduct Inspection       │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ⚠️  View Quality Issues     │ │
│ └─────────────────────────────┘ │
│                                 │
│ Recent Activities               │
│ • Evidence uploaded - 2h ago    │
│ • Variance approved - 3h ago    │
│ • Issue resolved - 5h ago       │
│                                 │
├─────────────────────────────────┤
│ [Dashboard][Evidence][Issues][More]│
│     📊        📸       ⚠️      ⋮ │
└─────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Top Bar
- **Height:** 56px
- **Hamburger menu:** Left (opens drawer)
- **Notifications:** Badge count
- **Avatar:** Right

### Summary Cards
- **Size:** 2 per row
- **Height:** 100px
- **Border-radius:** 8px
- **Shadow:** 0 2px 4px rgba(0,0,0,0.1)

### Quick Action Buttons
- **Height:** 56px
- **Full width**
- **Icon + text**
- **Spacing:** 12px between

### Bottom Navigation
- **Height:** 56px
- **4 tabs:** Dashboard, Evidence, Issues, More
- **Active:** Primary color
- **Inactive:** Gray

---

**Related Screens:**
- WF-11: Mobile Evidence Queue
- WF-12: Mobile Inspection Mode
