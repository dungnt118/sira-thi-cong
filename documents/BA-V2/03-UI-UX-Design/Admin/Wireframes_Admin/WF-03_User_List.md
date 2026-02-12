# WF-03: User List

**Screen:** User Management List  
**Platform:** Desktop (1920x1080)  
**User Role:** Admin  
**Navigation:** Home > Users > User List  

---

## SCREEN OVERVIEW

Comprehensive user list with advanced filtering, sorting, bulk operations, and inline actions.

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo] SIRA Admin                    [🔍 Search]  [🔔]  [👤 Admin]         │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Home > Users > User List                                        │
│  👥 Users│  ──────────────────────────────────────────────────────────────  │
│  🏢 Org  │                                                                  │
│  📊 Data │  [➕ Add User]  [📥 Import]  [📤 Export]  [🗑️ Delete Selected]   │
│  🔧 System│                                                                  │
│  🔒 Security│ Filters: [Status ▼] [Role ▼] [Department ▼] [Search...]      │
│  📈 Monitor│                                                                  │
│  ⚙️ Settings│ ┌──────────────────────────────────────────────────────────┐   │
│          │  │ [☑] Name ↓    Email         Role      Status    Actions  │   │
│          │  ├──────────────────────────────────────────────────────────┤   │
│          │  │ [☑] John Doe  john@ex.com   Admin     Active    [Edit]   │   │
│          │  │ [☐] Jane Doe  jane@ex.com   Manager   Active    [Edit]   │   │
│          │  │ [☐] Bob Smith bob@ex.com    User      Inactive  [Edit]   │   │
│          │  │ ...                                                       │   │
│          │  └──────────────────────────────────────────────────────────┘   │
│          │  Showing 1-20 of 234 users  [< 1 2 3 ... 12 >]                  │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

**Status:** ✅ Complete
