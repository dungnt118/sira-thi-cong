# 📱 WIREFRAME 15: Export Report Dialog - Desktop

**Screen:** Export Report Dialog (Desktop - Modal)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                                                                        │
│         ┌──────────────────────────────────────────────────────────────────┐          │
│         │  Export Report                                              [×] │          │
│         ├──────────────────────────────────────────────────────────────────┤          │
│         │                                                                  │          │
│         │  Report Type                                                     │          │
│         │  ○ Project Summary                                               │          │
│         │  ● Evidence Review Report                                        │          │
│         │  ○ Quality Issues Report                                         │          │
│         │  ○ Team Performance Report                                       │          │
│         │  ○ Material Variance Report                                      │          │
│         │                                                                  │          │
│         │  Date Range                                                      │          │
│         │  [01/02/2026] to [12/02/2026]                                    │          │
│         │                                                                  │          │
│         │  Projects                                                        │          │
│         │  [All Projects ▼]                                                │          │
│         │  ☑ PRJ-2026-001 - ABC Corp                                       │          │
│         │  ☑ PRJ-2026-002 - XYZ Ltd                                        │          │
│         │  ☐ PRJ-2026-003 - DEF Inc                                        │          │
│         │                                                                  │          │
│         │  Format                                                          │          │
│         │  ● PDF    ○ Excel    ○ CSV                                       │          │
│         │                                                                  │          │
│         │  Include                                                         │          │
│         │  ☑ Summary statistics                                            │          │
│         │  ☑ Charts and graphs                                             │          │
│         │  ☑ Evidence photos                                               │          │
│         │  ☐ Detailed comments                                             │          │
│         │  ☐ GPS locations                                                 │          │
│         │                                                                  │          │
│         │  Preview                                                         │          │
│         │  ┌────────────────────────────────────────────────────────────┐ │          │
│         │  │ Estimated size: 12.5 MB                                    │ │          │
│         │  │ Estimated pages: 24                                        │ │          │
│         │  │ Evidence items: 156                                        │ │          │
│         │  └────────────────────────────────────────────────────────────┘ │          │
│         │                                                                  │          │
│         │                                    [Cancel]  [Generate Report]  │          │
│         └──────────────────────────────────────────────────────────────────┘          │
│                                                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Modal
- **Width:** 600px
- **Max-height:** 80vh
- **Scroll:** Content area scrollable
- **Overlay:** Dark background (rgba(0,0,0,0.5))

### Form Elements
- **Radio buttons:** Report type, format
- **Checkboxes:** Projects, include options
- **Date pickers:** Range selection
- **Dropdown:** Project multi-select

### Preview Panel
- **Background:** Light gray (#F5F5F5)
- **Padding:** 16px
- **Font:** 14px, monospace for numbers

---

## INTERACTIONS

### Generate Report
1. Validate selections
2. Show progress indicator
3. Generate report server-side
4. Download file automatically
5. Show success toast

### Cancel
- Close modal
- Discard selections

---

**Related Screens:**
- WF-07: Analytics Dashboard (trigger export)
- WF-16: Report Generation Progress
