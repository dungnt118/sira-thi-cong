# 📱 WIREFRAME 12: Mobile Field Inspection

**Screen:** Mobile Field Inspection (375x812 - iPhone X)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────┐
│ [×] Field Inspection            │
├─────────────────────────────────┤
│                                 │
│                                 │
│                                 │
│      [CAMERA VIEWFINDER]        │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ PRJ-2026-001 - ABC Corp         │
│ 📍 GPS: Enabled                 │
│                                 │
│ [📸 Photo] [🎥 Video] [🎤 Note] │
│                                 │
│ Captured: 3 photos, 1 video     │
│                                 │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│ │[IMG]│ │[IMG]│ │[IMG]│ │[VID]││
│ └─────┘ └─────┘ └─────┘ └─────┘│
│                                 │
│ [Review & Submit]               │
│                                 │
└─────────────────────────────────┘
```

---

## FEATURES

### Camera Integration
- Auto GPS tagging
- Timestamp overlay
- Quality check (resolution, lighting)
- Grid overlay for alignment

### Offline Support
- Queue uploads when offline
- Local storage
- Auto-sync when online
- Sync indicator

### Capture Types
- **Photo:** High-res image
- **Video:** Short clips (max 30s)
- **Note:** Voice or text annotation

---

**Related Screens:**
- WF-10: Mobile Dashboard
- WF-11: Mobile Evidence Review
