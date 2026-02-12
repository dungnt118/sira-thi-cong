# 📱 WIREFRAME 17: Mobile Quality Issue Detail

**Screen:** Mobile Quality Issue Detail (375x812 - iPhone X)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────┐
│ [←] Issue Detail           [⋮] │
├─────────────────────────────────┤
│                                 │
│ 🚨 ISS-2026-001                 │
│ Foundation crack detected       │
│                                 │
│ Status: OPEN                    │
│ Severity: CRITICAL              │
│                                 │
│ ─────────────────────────────── │
│                                 │
│ Project                         │
│ PRJ-2026-001 - ABC Corp         │
│ 📍 Quận 1, TP HCM               │
│                                 │
│ Details                         │
│ Created: 12/02 14:30            │
│ By: Supervisor (You)            │
│ Assigned: Nguyen Van A (OL)     │
│                                 │
│ Description                     │
│ Phát hiện vết nứt dài 2m trên   │
│ móng cột M1. Vết nứt rộng       │
│ khoảng 3mm...                   │
│ [Read more]                     │
│                                 │
│ Photos                          │
│ ┌───┐ ┌───┐ ┌───┐              │
│ │IMG│ │IMG│ │IMG│              │
│ └───┘ └───┘ └───┘              │
│                                 │
│ Timeline                        │
│ ● Created - 12/02 14:30         │
│ ● Assigned - 12/02 14:35        │
│ ● Acknowledged - 12/02 15:00    │
│ ○ Pending review...             │
│                                 │
│ OL Action Plan                  │
│ Submitted: 12/02 16:00          │
│ [View Plan]                     │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Escalate] [Revise] [Approve]│ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [Dashboard][Evidence][Issues][More]│
└─────────────────────────────────┘
```

---

## INTERACTIONS

### Swipe Actions
- Swipe up: Expand description
- Swipe down: Collapse description

### Photo Viewer
- Tap photo: Open fullscreen viewer
- Pinch to zoom

### Action Buttons
- **Escalate:** Escalate to PM
- **Revise:** Request revision from OL
- **Approve:** Approve action plan

---

**Related Screens:**
- WF-10: Mobile Dashboard
- WF-06: Desktop Quality Issue Detail
