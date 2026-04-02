# 📱 WIREFRAME 04: Material Variance Approval - Desktop

**Screen:** Material Variance Approval (Desktop - 1920x1080)  
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
│  📊 Dashboard│  Material Variance Approval                                             │
│              ├─────────────────────────────────────────────────────────────────────────┤
│  📋 Projects │  Request ID: MVR-2026-001                        Status: PENDING REVIEW │
│              │  ─────────────────────────────────────────────────────────────────────  │
│  📸 Evidence │                                                                          │
│              │  Project Information                                                    │
│  ⚠️  Issues  │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │  Project: PRJ-2026-001 - ABC Corp Renovation                       │ │
│  📊 Reports  │  │  Location: 123 Nguyen Hue, Q1, TP HCM                              │ │
│              │  │  Stage: Foundation Work                                            │ │
│  📈 Analytics│  │  Requested by: Nguyen Van A (Outsource Leader)                     │ │
│              │  │  Request date: 12/02/2026 14:30                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│  ─────────   │                                                                          │
│              │  Material Details                                                       │
│  ⚙️  Settings│  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │  Material: Xi măng Portland PCB40                                  │ │
│  👤 Profile  │  │  Unit: Bao (50kg)                                                  │ │
│              │  │                                                                    │ │
│              │  │  ┌─────────────────┬─────────────────┬─────────────────┐          │ │
│              │  │  │  PLANNED        │  ACTUAL USED    │  VARIANCE       │          │ │
│              │  │  ├─────────────────┼─────────────────┼─────────────────┤          │ │
│              │  │  │                 │                 │                 │          │ │
│              │  │  │      50         │       55        │      +5         │          │ │
│              │  │  │     bao         │      bao        │    (+10%)       │          │ │
│              │  │  │                 │                 │                 │          │ │
│              │  │  └─────────────────┴─────────────────┴─────────────────┘          │ │
│              │  │                                                                    │ │
│              │  │  Risk Level: ⚠️ MEDIUM (10-20%)                                    │ │
│              │  │  Budget Impact: +500,000 VND                                      │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Reason for Variance                                                    │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │  Cần thêm xi măng do diện tích móng tăng so với thiết kế ban đầu. │ │
│              │  │  Phát hiện thêm 2 cọc móng cần gia cố thêm.                       │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Historical Data & Context                                              │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │  Average variance for this material: +5%                           │ │
│              │  │  Previous variance requests: 3 approved, 2 rejected                │ │
│              │  │  Last variance: +3% (approved 5 days ago)                          │ │
│              │  │  OL track record: 85% approval rate                                │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │                                                                          │
│              │  Supervisor Feedback                                                    │
│              │  ┌────────────────────────────────────────────────────────────────────┐ │
│              │  │                                                                    │ │
│              │  │  Add your comments or conditions for approval...                  │ │
│              │  │                                                                    │ │
│              │  │                                                                    │ │
│              │  └────────────────────────────────────────────────────────────────────┘ │
│              │  0/1000 characters                                                      │
│              │                                                                          │
│              │                                  [Request More Info] [Reject] [Approve] │
│              │                                                                          │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### Header Section
- **Request ID:** 16px, bold, monospace
- **Status badge:**
  - PENDING: Orange (#FFF3E0 bg, #FF9800 text)
  - APPROVED: Green (#E8F5E9 bg, #4CAF50 text)
  - REJECTED: Red (#FFEBEE bg, #F44336 text)

### Project Information Card
- **Background:** #F5F5F5
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 8px
- **Padding:** 24px
- **Font:** 14px, regular
- **Labels:** 12px, gray, uppercase

### Material Details Card
- **Background:** White
- **Border:** 2px solid #2196F3 (highlight)
- **Border-radius:** 8px
- **Padding:** 24px

### Comparison Table
- **Columns:** Equal width (33.33% each)
- **Header background:** #E3F2FD
- **Header text:** 12px, uppercase, bold, primary color
- **Values:** 32px, bold, center-aligned
- **Units:** 14px, regular, gray

### Variance Indicator
- **Color coding:**
  - < 10%: Green (#4CAF50)
  - 10-20%: Orange (#FF9800)
  - > 20%: Red (#F44336)
- **Icon:** ✅ (low), ⚠️ (medium), 🚨 (high)

### Risk Level Badge
- **Padding:** 8px 16px
- **Border-radius:** 4px
- **Font:** 14px, bold
- **Colors:**
  - LOW: Green background
  - MEDIUM: Orange background
  - HIGH: Red background

### Reason Box
- **Background:** #FFFEF7 (light yellow tint)
- **Border:** 1px solid #FFE082
- **Border-radius:** 4px
- **Padding:** 16px
- **Font:** 14px, regular
- **Min-height:** 80px

### Historical Data Card
- **Background:** #F5F5F5
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 8px
- **Padding:** 16px
- **Font:** 13px
- **Line-height:** 1.6

### Feedback Textarea
- **Height:** 120px
- **Border:** 1px solid #E0E0E0
- **Border-radius:** 4px
- **Padding:** 12px
- **Font:** 14px
- **Max-length:** 1000 characters

### Action Buttons
- **Request More Info:** Secondary button (outlined)
- **Reject:** Destructive button (red)
- **Approve:** Primary button (green)
- **Height:** 40px
- **Padding:** 12px 24px
- **Spacing:** 12px between buttons

---

## INTERACTIONS

### Variance Calculation
- Auto-calculate variance percentage
- Update budget impact in real-time
- Determine risk level automatically
- Show color-coded indicators

### Historical Data
- Load from past variance requests
- Show OL's approval rate
- Display material-specific trends
- Highlight patterns

### Request More Info
- Open message dialog
- Send to OL
- Set status to "INFO_REQUESTED"
- Wait for response

### Reject
- Validate feedback (required)
- Show confirmation dialog
- Update status to "REJECTED"
- Send notification to OL & PM
- Log activity
- Return to variance queue

### Approve
- Optional feedback
- Show confirmation dialog
- Update status to "APPROVED"
- Adjust budget automatically
- Send notification to OL & PM
- Update material records
- Log activity
- Return to variance queue

---

## BUSINESS RULES

### Auto-Recommendations
```
IF variance < 10% AND OL approval rate > 80%
  → Recommend APPROVE

IF variance 10-20% AND OL approval rate > 70%
  → Recommend REVIEW (neutral)

IF variance > 20% OR OL approval rate < 60%
  → Recommend ESCALATE to PM
```

### Approval Authority
- Supervisor can approve: < 20% variance
- PM approval required: ≥ 20% variance
- Auto-escalate: > 30% variance

### Notification Rules
- OL: Always notified of decision
- PM: Notified if variance > 15% or rejected
- Finance: Notified if approved (budget update)

---

## RESPONSIVE BEHAVIOR

### Tablet (768-1023px)
- Stack comparison table vertically
- Reduce padding to 16px
- Smaller font sizes
- Stack action buttons

### Mobile (375-767px)
- Single column layout
- Collapsible sections
- Bottom sheet for actions
- Simplified historical data

---

## DATA REQUIREMENTS

### API Endpoints
```
GET /api/gs/material-variance/{id}
GET /api/gs/material-variance/{id}/history
POST /api/gs/material-variance/{id}/request-info
POST /api/gs/material-variance/{id}/approve
POST /api/gs/material-variance/{id}/reject
```

### Calculations
```javascript
variance_amount = actual - planned
variance_percentage = (variance_amount / planned) * 100
budget_impact = variance_amount * unit_price
risk_level = getRiskLevel(variance_percentage)
```

---

## STATES

### Loading State
- Show skeleton for cards
- Disable action buttons

### Validation Errors
- **Reject without feedback:**
  ```
  ⚠️ Feedback required
  Please provide a reason for rejection.
  ```

### Confirmation Dialogs

**Approve Confirmation:**
```
┌─────────────────────────────────────┐
│  Approve Material Variance?         │
│                                     │
│  This will:                         │
│  • Update project budget            │
│  • Notify OL and PM                 │
│  • Allow material usage             │
│                                     │
│  [Cancel]  [Confirm Approval]       │
└─────────────────────────────────────┘
```

**Reject Confirmation:**
```
┌─────────────────────────────────────┐
│  Reject Material Variance?          │
│                                     │
│  This will:                         │
│  • Notify OL to revise request      │
│  • Block material usage             │
│  • Require new submission           │
│                                     │
│  [Cancel]  [Confirm Rejection]      │
└─────────────────────────────────────┘
```

---

**Related Screens:**
- WF-05: Material Variance Queue
- WF-06: Request More Info Dialog
- WF-07: Budget Impact Report
