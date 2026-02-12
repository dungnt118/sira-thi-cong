# 📱 WIREFRAME 13: Batch Operations - Desktop

**Screen:** Batch Operations (Desktop - 1920x1080)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Evidence Queue - Batch Mode                                                      [×] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [☑ Select All] [☐ Deselect All]                    24 items selected                │
│                                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ☑ [IMG] PRJ-001 • BEFORE • 2h ago • Nguyen A • ⭐⭐⭐⭐⭐                     │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ☑ [IMG] PRJ-001 • DURING • 2h ago • Nguyen A • ⭐⭐⭐⭐⭐                     │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ☑ [IMG] PRJ-001 • AFTER • 2h ago • Nguyen A • ⭐⭐⭐⭐⭐                      │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ☑ [IMG] PRJ-002 • BEFORE • 3h ago • Tran B • ⭐⭐⭐⭐                         │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                        │
│  ... (20 more items)                                                                  │
│                                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                                │   │
│  │  Batch Actions:                                                               │   │
│  │                                                                                │   │
│  │  [✅ Approve All]  [❌ Reject All]  [⭐ Set Quality]  [📁 Export]             │   │
│  │                                                                                │   │
│  │  Add Feedback (optional):                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐ │   │
│  │  │ Good quality work. Approved for all BEFORE/DURING/AFTER stages.          │ │   │
│  │  └──────────────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                                │   │
│  │                                          [Cancel]  [Apply to 24 items]        │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Selection Controls
- **Select All checkbox:** Top-left
- **Selected count:** Top-right, bold
- **Item checkbox:** Left of each item

### Batch Action Panel
- **Position:** Bottom, sticky
- **Background:** White with shadow
- **Padding:** 24px
- **Buttons:** Primary actions

### Confirmation
- Show confirmation dialog before applying
- Display count of affected items
- Allow undo within 5 seconds

---

## INTERACTIONS

### Selection
- Click checkbox to select/deselect
- Shift+click for range selection
- Ctrl+click for multi-selection

### Batch Actions
- **Approve All:** Set status to APPROVED
- **Reject All:** Require feedback
- **Set Quality:** Apply same rating to all
- **Export:** Download as ZIP with metadata

---

**Related Screens:**
- WF-02: Evidence Queue
- WF-14: Batch Confirmation Dialog
