# WF-05: Role Management

**Screen:** Role & Permission Management  
**Platform:** Desktop (1920x1080)  
**User Role:** Admin  
**Navigation:** Home > Users > Roles  

---

## SCREEN OVERVIEW

Manage roles and assign granular permissions using a permission matrix interface.

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo] SIRA Admin                    [🔍 Search]  [🔔]  [👤 Admin]         │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Home > Users > Roles                                            │
│  👥 Users│  ──────────────────────────────────────────────────────────────  │
│  🏢 Org  │                                                                  │
│  📊 Data │  [➕ Add Role]  [📤 Export]                                       │
│  🔧 System│                                                                  │
│  🔒 Security│ ┌────────────────────────────────────────────────────────────┐ │
│  📈 Monitor│  │ PERMISSION MATRIX                                          │ │
│  ⚙️ Settings│ ├────────────────────────────────────────────────────────────┤ │
│          │  │         │ Admin │ Manager │ Supervisor │ User │ Guest │    │ │
│          │  ├─────────┼───────┼─────────┼────────────┼──────┼───────┤    │ │
│          │  │ Users   │       │         │            │      │       │    │ │
│          │  │  View   │  ✅   │   ✅    │     ✅     │  ✅  │  ❌   │    │ │
│          │  │  Create │  ✅   │   ✅    │     ❌     │  ❌  │  ❌   │    │ │
│          │  │  Edit   │  ✅   │   ✅    │     ❌     │  ❌  │  ❌   │    │ │
│          │  │  Delete │  ✅   │   ❌    │     ❌     │  ❌  │  ❌   │    │ │
│          │  ├─────────┼───────┼─────────┼────────────┼──────┼───────┤    │ │
│          │  │ Projects│       │         │            │      │       │    │ │
│          │  │  View   │  ✅   │   ✅    │     ✅     │  ✅  │  ❌   │    │ │
│          │  │  Create │  ✅   │   ✅    │     ❌     │  ❌  │  ❌   │    │ │
│          │  │  Edit   │  ✅   │   ✅    │     ✅     │  ❌  │  ❌   │    │ │
│          │  └────────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

**Status:** ✅ Complete
