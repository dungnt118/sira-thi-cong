# 📱 WIREFRAME 03: Evidence Viewer - Full Screen

**Screen:** Evidence Viewer (Full-Screen Modal - 1920x1080)  
**Role:** Supervisor  
**Version:** 1.0  

---

## LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [← Back]  Evidence Review - PRJ-2026-001                                         [×] │
├──────────────────────────────────────────────┬─────────────────────────────────────────┤
│                                              │  Project: PRJ-2026-001                  │
│                                              │  ABC Corp - Renovation                  │
│                                              │  ─────────────────────────────────────  │
│                                              │                                         │
│                                              │  Uploaded by: Nguyen Van A              │
│                                              │  Role: Outsource Leader                 │
│                                              │  Date: 12/02/2026 16:30                 │
│                                              │  ─────────────────────────────────────  │
│                                              │                                         │
│                                              │  Stage: BEFORE                          │
│                [LARGE IMAGE]                 │  Category: Foundation                   │
│                                              │  ─────────────────────────────────────  │
│                4:3 Aspect Ratio              │                                         │
│                                              │  📍 Location:                           │
│                High Resolution               │  123 Nguyen Hue, Q1, TP HCM             │
│                                              │  Lat: 10.7769, Lng: 106.7009            │
│                Zoom: [−] 100% [+]            │  [View on Map]                          │
│                                              │  ─────────────────────────────────────  │
│                                              │                                         │
│                                              │  Quality Score:                         │
│                                              │  ⭐ ⭐ ⭐ ⭐ ⭐                         │
│                                              │  (Click to rate)                        │
│                                              │  ─────────────────────────────────────  │
│                                              │                                         │
│                                              │  Feedback (Optional):                   │
│                                              │  ┌─────────────────────────────────┐   │
│                                              │  │                                 │   │
│                                              │  │ Add your comments here...       │   │
│                                              │  │                                 │   │
│                                              │  │                                 │   │
│                                              │  └─────────────────────────────────┘   │
│                                              │  0/500 characters                       │
│                                              │                                         │
│                                              │  ─────────────────────────────────────  │
│                                              │                                         │
│  [◀ Previous]                  [Next ▶]     │  [Skip]  [Reject]  [Approve]            │
│                                              │                                         │
└──────────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Top Bar
- **Height:** 64px
- **Background:** White (#FFFFFF)
- **Border-bottom:** 1px solid #E0E0E0
- **Back button:** Icon + text, left-aligned
- **Title:** 18px, semibold, center-aligned
- **Close button:** Icon (×), right-aligned, 40x40px

### Image Viewer (Left Panel)
- **Width:** 60% of viewport
- **Background:** #000000 (black for contrast)
- **Image:** Centered, max-width/height with aspect ratio preserved
- **Zoom controls:** Bottom-center overlay
  - Buttons: [−] [100%] [+]
  - Size: 36x36px each
  - Background: rgba(0,0,0,0.7)
  - Color: White
- **Navigation:** Bottom-left and bottom-right
  - Buttons: [◀ Previous] [Next ▶]
  - Size: 120px x 40px
  - Background: rgba(0,0,0,0.7)
  - Color: White

### Info Panel (Right Panel)
- **Width:** 40% of viewport
- **Background:** White (#FFFFFF)
- **Padding:** 32px
- **Scroll:** Vertical if content overflows

### Project Info Section
- **Project code:** 14px, bold, primary color
- **Project name:** 16px, regular
- **Divider:** 1px solid #E0E0E0, margin 16px

### Uploader Info
- **Label:** 12px, gray, uppercase
- **Name:** 14px, regular
- **Role:** 12px, gray
- **Date:** 14px, regular

### Stage & Category
- **Stage badge:** 
  - Padding: 4px 12px
  - Border-radius: 4px
  - Font: 12px, bold, uppercase
  - Colors:
    - BEFORE: Blue background (#E3F2FD), blue text (#2196F3)
    - DURING: Orange background (#FFF3E0), orange text (#FF9800)
    - AFTER: Green background (#E8F5E9), green text (#4CAF50)

### GPS Location
- **Icon:** 📍 (map pin)
- **Address:** 14px, regular
- **Coordinates:** 12px, gray, monospace
- **Map button:** Secondary button, full width

### Quality Score
- **Stars:** 24x24px each, clickable
- **Colors:**
  - Empty: #E0E0E0
  - Filled: #FFC107 (amber)
  - Hover: #FFD54F (light amber)
- **Helper text:** 12px, gray

### Feedback Textarea
- **Height:** 120px
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 4px
- **Padding:** 12px
- **Font:** 14px, regular
- **Placeholder:** Gray (#9E9E9E)
- **Character count:** 12px, gray, right-aligned
- **Focus:** Border changes to primary color

### Action Buttons
- **Skip:** Text button, gray
- **Reject:** Destructive button, red (#F44336)
- **Approve:** Primary button, green (#4CAF50)
- **Size:** Height 40px, padding 12px 24px
- **Spacing:** 12px between buttons
- **Alignment:** Right-aligned

---

## INTERACTIONS

### Image Zoom
- **Zoom in:** Click [+] or scroll up
- **Zoom out:** Click [−] or scroll down
- **Reset:** Click [100%]
- **Pan:** Click and drag when zoomed
- **Levels:** 50%, 75%, 100%, 125%, 150%, 200%

### Image Navigation
- **Previous:** Click [◀ Previous] or press ← key
- **Next:** Click [Next ▶] or press → key
- **Keyboard:** Arrow keys for navigation

### Quality Rating
- **Click star:** Set rating (1-5 stars)
- **Hover:** Highlight stars up to hover position
- **Clear:** Click first star again to clear rating

### Feedback
- **Type:** Character count updates in real-time
- **Max length:** 500 characters
- **Validation:** Show error if required and empty (for reject)

### Action Buttons
- **Skip:**
  - Navigate to next evidence
  - No save, no notification
  
- **Reject:**
  - Validate feedback (required)
  - Show confirmation dialog
  - Save rejection + feedback
  - Send notification to OL
  - Navigate to next evidence
  
- **Approve:**
  - Save approval + optional feedback + quality score
  - Send notification to OL
  - Navigate to next evidence

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| A | Approve |
| R | Reject |
| S | Skip |
| → | Next evidence |
| ← | Previous evidence |
| + | Zoom in |
| − | Zoom out |
| 0 | Reset zoom |
| Esc | Close viewer |
| 1-5 | Set quality rating |

---

## RESPONSIVE BEHAVIOR

### Tablet (768-1023px)
- Image panel: 55% width
- Info panel: 45% width
- Reduce padding to 24px
- Stack action buttons vertically

### Mobile (375-767px)
- Full-screen image
- Info panel as bottom sheet (swipe up)
- Swipe left/right for navigation
- Tap for zoom controls
- Simplified layout

---

## DATA REQUIREMENTS

### API Endpoints
```
GET /api/supervisor/evidence/{id}
POST /api/supervisor/evidence/{id}/approve
POST /api/supervisor/evidence/{id}/reject
POST /api/supervisor/evidence/{id}/rate
```

### Image Loading
- Load thumbnail first (fast preview)
- Load full resolution in background
- Show loading spinner during load
- Cache images for navigation

---

## STATES

### Loading State
```
┌──────────────────────────────────┐
│                                  │
│                                  │
│          [Spinner]               │
│                                  │
│       Loading image...           │
│                                  │
└──────────────────────────────────┘
```

### Error State
```
┌──────────────────────────────────┐
│                                  │
│             ⚠️                   │
│                                  │
│   Failed to load image           │
│                                  │
│         [Retry]                  │
└──────────────────────────────────┘
```

### Validation Error (Reject without feedback)
```
┌──────────────────────────────────┐
│  ⚠️ Feedback required            │
│                                  │
│  Please provide a reason for     │
│  rejecting this evidence.        │
│                                  │
│  [OK]                            │
└──────────────────────────────────┘
```

### Confirmation Dialog (Reject)
```
┌──────────────────────────────────┐
│  Reject Evidence?                │
│                                  │
│  This will notify the OL and     │
│  require resubmission.           │
│                                  │
│  [Cancel]  [Confirm Reject]      │
└──────────────────────────────────┘
```

---

**Related Screens:**
- WF-02: Evidence Queue
- WF-04: GPS Map Modal
- WF-05: Batch Feedback Modal
