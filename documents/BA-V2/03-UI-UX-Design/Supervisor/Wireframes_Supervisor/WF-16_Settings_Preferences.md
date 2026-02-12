# 📱 WIREFRAME 16: Settings & Preferences - Desktop

**Screen:** Settings & Preferences (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Settings                                                               │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  [Profile] [Notifications] [Display] [Security] [Advanced]              │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📸 Evidence │                                                                          │
│              │  Notification Preferences                                               │
│  ⚠️  Issues  │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │                                                                    │ │
│  📊 Reports  │  │  Email Notifications                                               │ │
│              │  │  ☑ New evidence uploaded                                           │ │
│  📈 Analytics│  │  ☑ Material variance requires approval                             │ │
│              │  │  ☑ Quality issue created                                           │ │
│  ─────────   │  │  ☑ OL submitted action plan                                        │ │
│              │  │  ☐ Project milestone completed                                     │ │
│  ⚙️  Settings│  │  ☐ Daily summary report                                            │ │
│              │  │                                                                    │ │
│  👤 Profile  │  │  Push Notifications (Mobile)                                       │ │
│              │  │  ☑ Critical issues only                                            │ │
│              │  │  ☐ All notifications                                               │ │
│              │  │                                                                    │ │
│              │  │  Notification Frequency                                            │ │
│              │  │  ● Real-time    ○ Hourly digest    ○ Daily digest                 │ │
│              │  │                                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Display Preferences                                                    │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │                                                                    │ │
│              │  │  Theme                                                             │ │
│              │  │  ● Light    ○ Dark    ○ Auto (system)                             │ │
│              │  │                                                                    │ │
│              │  │  Table Density                                                     │ │
│              │  │  ○ Compact    ● Standard    ○ Comfortable                         │ │
│              │  │                                                                    │ │
│              │  │  Default View                                                      │ │
│              │  │  [Dashboard ▼]                                                     │ │
│              │  │                                                                    │ │
│              │  │  Items per page                                                    │ │
│              │  │  [20 ▼]                                                            │ │
│              │  │                                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Approval Workflow                                                      │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │                                                                    │ │
│              │  │  Auto-approve evidence with quality ≥ 4 stars                     │ │
│              │  │  ☐ Enable                                                          │ │
│              │  │                                                                    │ │
│              │  │  Require feedback for rejections                                   │ │
│              │  │  ☑ Always    ☐ Optional                                           │ │
│              │  │                                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │                                                  [Reset]  [Save Changes]│
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Settings Tabs
- **Active:** Primary color, bold, bottom border
- **Inactive:** Gray

### Settings Sections
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 8px
- **Padding:** 24px
- **Margin-bottom:** 24px

### Form Controls
- **Checkboxes:** Standard size (20x20px)
- **Radio buttons:** Standard size (20x20px)
- **Dropdowns:** Full width within section

---

**Related Screens:**
- WF-01: Dashboard (settings link)
- WF-14: Notifications Center (affected by settings)
