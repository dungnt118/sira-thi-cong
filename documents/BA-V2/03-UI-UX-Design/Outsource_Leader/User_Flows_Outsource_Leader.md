# 🔄 USER FLOWS - Outsource Leader

**SIRA Service Management Platform**  
**Role:** Outsource Leader  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. OVERVIEW

Document này mô tả 7 user flows chính cho Outsource Leader role, sử dụng Mermaid diagrams để visualize từng workflow.

**Key Flows:**
1. Nhận dự án mới
2. Upload evidence
3. Confirm vật tư
4. Assign team
5. Báo cáo tiến độ
6. Chat collaboration
7. Xem payment status

---

## 2. FLOW 1: Nhận Dự Án Mới

### 2.1 Flow Description

PM assign Outsource Leader vào dự án → OL nhận notification → OL login → View project → Accept/Acknowledge

### 2.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([PM assigns OL to project]) --> A[System creates PROJECT_ASSIGNMENT]
    A --> B[System sends push notification]
    B --> C{OL has app open?}
    
    C -->|Yes| D[Show in-app notification]
    C -->|No| E[Push notification to device]
    
    D --> F[OL taps notification]
    E --> F
    
    F --> G[Navigate to Project Detail]
    G --> H[Load project data]
    H --> I{Data loaded?}
    
    I -->|Success| J[Display project overview]
    I -->|Failed| K[Show error + Retry button]
    
    K --> H
    
    J --> L[OL reviews project info]
    L --> M{OL action?}
    
    M -->|View details| N[Navigate to tabs]
    M -->|Upload evidence| O[Open camera]
    M -->|Chat with PM| P[Open chat]
    M -->|Back| Q[Return to dashboard]
    
    N --> End([Flow complete])
    O --> End
    P --> End
    Q --> End
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style K fill:#ffebee
```

### 2.3 Key Decision Points

- **Has app open?** → Determines notification delivery method
- **Data loaded?** → Handle network errors gracefully
- **OL action?** → Multiple paths from project detail

### 2.4 Error Handling

- Network error → Show retry button
- Project not found → Show error message + contact PM
- Permission denied → Show access denied message

---

## 3. FLOW 2: Upload Evidence

### 3.1 Flow Description

OL mở project → Chọn upload → Chụp ảnh/chọn từ gallery → Chọn stage → Add note → Upload → Success

### 3.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([OL opens project]) --> A[Tap Upload button or FAB]
    A --> B[Open upload interface]
    B --> C{Choose source}
    
    C -->|Camera| D[Open camera preview]
    C -->|Gallery| E[Open gallery picker]
    
    D --> F[OL captures photo/video]
    E --> G[OL selects file]
    
    F --> H[Show preview screen]
    G --> H
    
    H --> I[Auto-capture GPS if available]
    I --> J[OL selects stage]
    J --> K{Stage selected?}
    
    K -->|No| L[Show error: Stage required]
    L --> J
    
    K -->|Yes| M[OL adds note optional]
    M --> N[OL taps Upload]
    N --> O{Validate file}
    
    O -->|Invalid type| P[Show error: Unsupported file type]
    O -->|Too large| Q[Show error: File exceeds 500MB]
    O -->|Valid| R{Network available?}
    
    P --> H
    Q --> H
    
    R -->|Yes| S[Compress file if needed]
    R -->|No| T[Queue to local storage]
    
    S --> U[Upload to Google Drive]
    T --> V[Show: Will upload when online]
    
    U --> W{Upload success?}
    
    W -->|Yes| X[Save metadata to DB]
    W -->|No| Y[Retry 3 times]
    
    Y --> Z{Retry success?}
    Z -->|Yes| X
    Z -->|No| T
    
    X --> AA[Send notification to PM/Supervisor]
    AA --> AB[Show success message]
    V --> AB
    
    AB --> AC[Return to evidence gallery]
    AC --> End([Flow complete])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style P fill:#ffebee
    style Q fill:#ffebee
    style L fill:#ffebee
```

### 3.3 Key Decision Points

- **Choose source** → Camera vs Gallery
- **Stage selected?** → Required field validation
- **Validate file** → Type and size checks
- **Network available?** → Online vs offline handling
- **Upload success?** → Retry logic

### 3.4 Offline Handling

- Queue uploads locally
- Auto-sync when network available
- Show sync status indicator
- Prevent duplicate uploads

---

## 4. FLOW 3: Confirm Vật Tư

### 4.1 Flow Description

OL mở project → Tab Vật tư → Nhập actual quantities → System calculate variance → Validate → Confirm → PM notified

### 4.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([OL opens project]) --> A[Tap Vật tư tab]
    A --> B[Load material plan from PM]
    B --> C{Data loaded?}
    
    C -->|Failed| D[Show error + Retry]
    C -->|Success| E[Display material table]
    
    D --> B
    
    E --> F[OL inputs actual quantity for item]
    F --> G[System auto-calculates variance]
    G --> H{Variance calculation}
    
    H --> I[Variance = Actual - Planned]
    I --> J[Variance % = Variance / Planned × 100%]
    J --> K{Variance > 10%?}
    
    K -->|No| L[Show green checkmark]
    K -->|Yes| M{Variance > 20%?}
    
    M -->|No| N[Show yellow warning]
    M -->|Yes| O[Show red alert]
    
    N --> P[Require note field]
    O --> P
    L --> Q[Note optional]
    
    P --> R[OL enters note]
    Q --> S[OL taps Confirm]
    R --> S
    
    S --> T{Validate all items}
    
    T -->|Missing actual qty| U[Show error: Please fill all quantities]
    T -->|Variance > 10% without note| V[Show error: Note required for variance]
    T -->|Variance > 20%| W[Show warning: Requires PM approval]
    T -->|Valid| X[Submit confirmation]
    
    U --> F
    V --> R
    
    W --> Y{OL confirms?}
    Y -->|Cancel| F
    Y -->|Confirm| Z[Create approval request]
    
    Z --> AA[Send to PM for approval]
    X --> AB[Save actual quantities to DB]
    
    AB --> AC[Update material_usage table]
    AC --> AD[Send notification to PM]
    AD --> AE{Variance > 10%?}
    
    AE -->|Yes| AF[Highlight in PM notification]
    AE -->|No| AG[Standard notification]
    
    AA --> AH[Show: Waiting for PM approval]
    AF --> AI[Show success message]
    AG --> AI
    
    AI --> AJ[Return to project detail]
    AH --> AJ
    AJ --> End([Flow complete])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style U fill:#ffebee
    style V fill:#ffebee
    style O fill:#ffebee
```

### 4.3 Key Decision Points

- **Data loaded?** → Handle network errors
- **Variance > 10%?** → Require note
- **Variance > 20%?** → Require PM approval
- **Validate all items** → Multiple validation checks
- **OL confirms?** → Final confirmation for high variance

### 4.4 Business Rules

- Tolerance: 10% variance acceptable
- 10-20%: Require note
- \>20%: Require PM approval
- All quantities must be > 0

---

## 5. FLOW 4: Assign Team

### 5.1 Flow Description

OL mở project → Tab Team → Add member → Select staff → Choose role/shift/dates → Validate → Assign → Staff notified

### 5.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([OL opens project]) --> A[Tap Team tab]
    A --> B[Load current team members]
    B --> C[Display team list]
    C --> D[OL taps Add Member]
    D --> E[Open staff picker modal]
    E --> F[Load staff from OL company]
    F --> G{Filter staff}
    
    G --> H[Only staff from OL company]
    H --> I[Only available staff]
    I --> J[Display filtered staff list]
    
    J --> K{Any staff available?}
    
    K -->|No| L[Show empty state]
    L --> M[Suggest: Add staff to company]
    M --> End1([Flow ends])
    
    K -->|Yes| N[OL selects staff]
    N --> O[OL selects role]
    O --> P{Role options}
    
    P --> Q[Worker]
    P --> R[Technician]
    P --> S[Specialist]
    
    Q --> T[OL selects shift]
    R --> T
    S --> T
    
    T --> U{Shift options}
    
    U --> V[FULL 6:00-18:00]
    U --> W[AM 6:00-12:00]
    U --> X[PM 13:00-18:00]
    
    V --> Y[OL selects date range]
    W --> Y
    X --> Y
    
    Y --> Z[From date - To date picker]
    Z --> AA[OL taps Assign]
    AA --> AB{Validate assignment}
    
    AB -->|Staff not in company| AC[Show error: Invalid staff]
    AB -->|Date out of project range| AD[Show error: Invalid dates]
    AB -->|Staff already assigned| AE{Override?}
    AB -->|Valid| AF[Create PROJECT_ASSIGNMENT]
    
    AC --> N
    AD --> Y
    
    AE -->|Cancel| N
    AE -->|Confirm| AF
    
    AF --> AG[Save to database]
    AG --> AH[Send notification to staff]
    AH --> AI[Update team list]
    AI --> AJ[Show success message]
    AJ --> AK[Close modal]
    AK --> End2([Flow complete])
    
    style Start fill:#e3f2fd
    style End1 fill:#c8e6c9
    style End2 fill:#c8e6c9
    style AC fill:#ffebee
    style AD fill:#ffebee
```

### 5.3 Key Decision Points

- **Filter staff** → Only company members, only available
- **Any staff available?** → Empty state handling
- **Role options** → Worker/Technician/Specialist
- **Shift options** → FULL/AM/PM
- **Validate assignment** → Multiple validation checks
- **Override?** → Handle conflicts

### 5.4 Validation Rules

- Staff must belong to OL's company
- Date range must be within project timeline
- Staff must be available (not busy on other projects)
- Role and shift are required

---

## 6. FLOW 5: Báo Cáo Tiến Độ

### 6.1 Flow Description

OL mở project → Tab Tiến độ → Update progress slider → Add note/issues → Validate → Submit → PM notified

### 6.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([OL opens project]) --> A[Tap Tiến độ tab]
    A --> B[Load current progress]
    B --> C[Display progress form]
    C --> D[Show current progress %]
    D --> E[OL drags slider to new value]
    E --> F{Progress changed?}
    
    F -->|No| G[Note optional]
    F -->|Yes| H[Note required]
    
    H --> I[OL enters note]
    G --> J[OL enters issues optional]
    I --> J
    
    J --> K[OL enters next steps optional]
    K --> L[OL taps Submit]
    L --> M{Validate input}
    
    M -->|Progress decreased| N[Show error: Cannot decrease]
    M -->|Progress changed but no note| O[Show error: Note required]
    M -->|Progress = 100%| P[Show confirmation dialog]
    M -->|Valid| Q[Save progress report]
    
    N --> E
    O --> I
    
    P --> R{OL confirms completion?}
    
    R -->|Cancel| E
    R -->|Confirm| S[Change project status]
    
    S --> T[Status = Awaiting Approval]
    T --> U[Save progress report]
    
    Q --> V[Update project progress]
    U --> V
    
    V --> W[Log progress history]
    W --> X[Send notification to PM]
    X --> Y{Progress = 100%?}
    
    Y -->|Yes| Z[Send notification to Supervisor]
    Y -->|No| AA[Standard notification]
    
    Z --> AB[Show success message]
    AA --> AB
    
    AB --> AC{Issues reported?}
    
    AC -->|Yes| AD[Highlight issues in notification]
    AC -->|No| AE[Standard success]
    
    AD --> AF[Return to project detail]
    AE --> AF
    AF --> End([Flow complete])
    
    style Start fill:#e3f2fd
    style End fill:#c8e6c9
    style N fill:#ffebee
    style O fill:#ffebee
```

### 6.3 Key Decision Points

- **Progress changed?** → Determines if note is required
- **Validate input** → Multiple validation checks
- **Progress = 100%?** → Special handling for completion
- **OL confirms completion?** → Final confirmation
- **Issues reported?** → Highlight in notification

### 6.4 Business Rules

- Progress cannot decrease
- Note required if progress changed
- Progress = 100% triggers status change to "Awaiting Approval"
- PM and Supervisor notified on completion

---

## 7. FLOW 6: Chat Collaboration

### 7.1 Flow Description

OL mở project → Tab Chat → Type message → Optional: attach file/@mention → Send → Real-time delivery → Notification

### 7.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([OL opens project]) --> A[Tap Chat tab]
    A --> B[Load chat messages]
    B --> C{WebSocket connected?}
    
    C -->|No| D[Show offline indicator]
    C -->|Yes| E[Display message list]
    
    D --> F[Queue messages locally]
    E --> G[OL types message]
    
    G --> H{OL action?}
    
    H -->|Send text| I[OL taps Send]
    H -->|Attach file| J[OL taps attach button]
    H -->|@Mention| K[OL types @]
    
    J --> L[Open file picker]
    L --> M[OL selects file]
    M --> N{Validate file}
    
    N -->|Too large > 10MB| O[Show error: Max 10MB]
    N -->|Valid| P[Upload file to storage]
    
    O --> L
    
    P --> Q{Upload success?}
    Q -->|Failed| R[Show error + Retry]
    Q -->|Success| S[Attach file URL to message]
    
    R --> P
    
    K --> T[Show participant list]
    T --> U[OL selects user]
    U --> V[Insert @mention in message]
    V --> I
    
    S --> I
    
    I --> W{Network available?}
    
    W -->|No| X[Queue message locally]
    W -->|Yes| Y[Send via WebSocket]
    
    X --> Z[Show: Will send when online]
    Y --> AA[Save message to DB]
    
    AA --> AB[Broadcast to participants]
    AB --> AC{Has @mention?}
    
    AC -->|Yes| AD[Send push notification to mentioned user]
    AC -->|No| AE[In-app notification only]
    
    AD --> AF[Display message in chat]
    AE --> AF
    Z --> AF
    
    AF --> AG[Scroll to bottom]
    AG --> AH{Auto-sync when online?}
    
    AH -->|Yes| AI[Send queued messages]
    AH -->|No| End1([Flow complete])
    
    AI --> End1
    
    style Start fill:#e3f2fd
    style End1 fill:#c8e6c9
    style O fill:#ffebee
    style R fill:#ffebee
```

### 7.3 Key Decision Points

- **WebSocket connected?** → Online vs offline mode
- **OL action?** → Text/File/Mention
- **Validate file** → Size check
- **Upload success?** → Retry logic
- **Network available?** → Queue or send immediately
- **Has @mention?** → Push notification trigger
- **Auto-sync when online?** → Send queued messages

### 7.4 Real-time Features

- WebSocket for instant delivery
- Typing indicators (optional)
- Read receipts (optional)
- Message status: Sending → Sent → Delivered

---

## 8. FLOW 7: Xem Payment Status

### 8.1 Flow Description

OL mở dashboard/project → Tab Thanh toán → View milestones → Filter → Optional: Request payment → PM reviews

### 8.2 Mermaid Diagram

```mermaid
flowchart TD
    Start([OL opens app]) --> A{Entry point?}
    
    A -->|Dashboard| B[Tap Payments widget]
    A -->|Project detail| C[Tap Thanh toán tab]
    
    B --> D[Load all payments across projects]
    C --> E[Load payments for this project]
    
    D --> F[Display payment list]
    E --> F
    
    F --> G{Any milestones?}
    
    G -->|No| H[Show empty state]
    H --> I[Message: PM will create milestones]
    I --> End1([Flow ends])
    
    G -->|Yes| J[Display milestone cards]
    J --> K[Show for each milestone]
    
    K --> L[Milestone name]
    L --> M[Amount outsource share]
    M --> N[Due date]
    N --> O[Status badge]
    O --> P[Paid date if paid]
    
    P --> Q[OL applies filter]
    Q --> R{Filter options}
    
    R --> S[All]
    R --> T[Pending]
    R --> U[Paid]
    R --> V[Overdue]
    
    S --> W[Display filtered list]
    T --> W
    U --> W
    V --> W
    
    W --> X{Status = Overdue?}
    
    X -->|Yes| Y[Highlight in red]
    X -->|No| Z[Standard display]
    
    Y --> AA[Show: Quá hạn X ngày]
    Z --> AB[OL taps milestone]
    AA --> AB
    
    AB --> AC[Show milestone detail]
    AC --> AD{Status = Pending?}
    
    AD -->|No| AE[View only mode]
    AD -->|Yes| AF{Progress sufficient?}
    
    AF -->|No| AG[Show: Complete more work]
    AF -->|Yes| AH[Show Request Payment button]
    
    AH --> AI[OL taps Request Payment]
    AI --> AJ{Validate request}
    
    AJ -->|No evidence| AK[Show error: Upload evidence first]
    AJ -->|Progress < required| AL[Show error: Insufficient progress]
    AJ -->|Valid| AM[Show request form]
    
    AK --> End2([Flow ends])
    AL --> End2
    
    AM --> AN[OL enters note optional]
    AN --> AO[OL taps Submit]
    AO --> AP[Create payment request]
    AP --> AQ[Send notification to PM]
    AQ --> AR[Show: Request sent]
    AR --> AS[PM reviews request]
    AS --> AT{PM decision}
    
    AT -->|Approved| AU[Accountant processes payment]
    AT -->|Rejected| AV[Send rejection notification]
    
    AU --> AW[OL receives payment notification]
    AV --> AX[OL sees rejection reason]
    
    AE --> End2
    AG --> End2
    AW --> End2
    AX --> End2
    
    style Start fill:#e3f2fd
    style End1 fill:#c8e6c9
    style End2 fill:#c8e6c9
    style AK fill:#ffebee
    style AL fill:#ffebee
```

### 8.3 Key Decision Points

- **Entry point?** → Dashboard vs Project detail
- **Any milestones?** → Empty state handling
- **Filter options** → All/Pending/Paid/Overdue
- **Status = Overdue?** → Highlight in red
- **Status = Pending?** → Show request button
- **Progress sufficient?** → Validate before request
- **Validate request** → Evidence and progress checks
- **PM decision** → Approved vs Rejected

### 8.4 Business Rules

- OL can only view payment status (not create/edit)
- OL only sees outsource share (not full contract value)
- Payment request requires:
  - Progress >= milestone requirement
  - Evidence uploaded (DURING/AFTER)
- Overdue milestones highlighted in red

---

## 9. FLOW SUMMARY

| Flow | Complexity | Key Features | Error Handling |
|------|------------|--------------|----------------|
| 1. Nhận dự án | Medium | Push notification, in-app | Network error, permission denied |
| 2. Upload evidence | High | Camera, GPS, offline queue | File validation, upload retry |
| 3. Confirm vật tư | High | Variance calculation, PM approval | Validation, high variance alert |
| 4. Assign team | Medium | Staff filtering, availability | Conflict resolution, validation |
| 5. Báo cáo tiến độ | Medium | Progress tracking, completion | Cannot decrease, note required |
| 6. Chat collaboration | High | Real-time, file attach, @mention | Offline queue, file size limit |
| 7. Payment status | Medium | Filter, request payment | Validation, PM approval |

---

## 10. COMMON PATTERNS

### 10.1 Network Error Handling

All flows implement:
- Retry button on failure
- Offline queue for writes
- Auto-sync when back online
- Clear error messages

### 10.2 Validation

All input flows implement:
- Client-side validation
- Server-side validation
- User-friendly error messages
- Prevent invalid submissions

### 10.3 Notifications

All flows that trigger notifications:
- Push notification (if app closed)
- In-app notification (if app open)
- Badge count update
- Navigate to relevant screen on tap

### 10.4 Loading States

All flows implement:
- Skeleton screens for initial load
- Spinners for actions
- Progress bars for uploads
- Optimistic UI updates

---

## 11. MOBILE-SPECIFIC CONSIDERATIONS

### 11.1 Touch Gestures

- **Pull-to-refresh:** Dashboard, project list, chat
- **Swipe:** Delete notifications, navigate images
- **Long press:** Context menu, copy text
- **Pinch:** Zoom images

### 11.2 Camera Integration

- Native camera API
- Auto GPS tagging
- Flash control
- Front/back camera switch

### 11.3 Offline-First

- Queue uploads locally
- Queue chat messages
- Sync when online
- Show sync status

---

**Version:** 1.0  
**Date:** 2026-02-12  
**Status:** Draft  
**Author:** SIRA Tech Team
