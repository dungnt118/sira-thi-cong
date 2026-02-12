# 🔄 USER FLOWS - Supervisor

**SIRA Service Management Platform**  
**Role:** Supervisor  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## TABLE OF CONTENTS

1. [Dashboard & Overview](#1-dashboard--overview)
2. [Evidence Review Flow](#2-evidence-review-flow)
3. [Material Variance Approval](#3-material-variance-approval)
4. [Quality Issue Management](#4-quality-issue-management)
5. [Project Monitoring](#5-project-monitoring)
6. [Team Performance Review](#6-team-performance-review)
7. [Analytics & Reporting](#7-analytics--reporting)
8. [Field Inspection (Mobile)](#8-field-inspection-mobile)
9. [Batch Operations](#9-batch-operations)
10. [Notification Handling](#10-notification-handling)

---

## 1. DASHBOARD & OVERVIEW

### 1.1 Login to Dashboard

```mermaid
graph TD
    A[Login] --> B{Authentication}
    B -->|Success| C[Load Dashboard]
    B -->|Failed| D[Show Error]
    D --> A
    
    C --> E[Fetch Overview Stats]
    E --> F[Load Pending Items]
    F --> G[Load Recent Activities]
    G --> H[Load Quick Charts]
    
    H --> I{Has Pending<br/>Reviews?}
    I -->|Yes| J[Show Badge Count]
    I -->|No| K[Normal View]
    
    J --> L[Display Dashboard]
    K --> L
    
    L --> M{User Action}
    M -->|Click Evidence| N[Go to Evidence Queue]
    M -->|Click Issues| O[Go to Issues List]
    M -->|Click Analytics| P[Go to Analytics]
    M -->|Click Project| Q[Go to Project Detail]
    
    style C fill:#E3F2FD
    style L fill:#C8E6C9
    style J fill:#FFE0B2
```

**Key Decision Points:**
- Authentication validation
- Pending review count check
- User navigation choice

**Success Criteria:**
- Dashboard loads within 2 seconds
- All stats display correctly
- Notifications are accurate

---

## 2. EVIDENCE REVIEW FLOW

### 2.1 Evidence Queue to Approval

```mermaid
graph TD
    A[Evidence Queue] --> B[Apply Filters]
    B --> C{Filter Type}
    C -->|Status| D[Filter by Status]
    C -->|Project| E[Filter by Project]
    C -->|Stage| F[Filter by Stage]
    C -->|Date| G[Filter by Date]
    
    D --> H[Display Filtered List]
    E --> H
    F --> H
    G --> H
    
    H --> I{Select Action}
    I -->|Single Select| J[Click Evidence Row]
    I -->|Multi Select| K[Check Multiple Items]
    
    J --> L[Open Evidence Viewer]
    K --> M[Enable Batch Actions]
    
    L --> N[Load Full Image]
    N --> O[Display Metadata]
    O --> P[Show GPS Location]
    P --> Q[Load Quality Score]
    
    Q --> R{Review Decision}
    R -->|Approve| S[Add Feedback Optional]
    R -->|Reject| T[Add Feedback Required]
    R -->|Skip| U[Next Evidence]
    
    S --> V[Submit Approval]
    T --> W[Submit Rejection]
    U --> L
    
    V --> X[Update Status]
    W --> X
    X --> Y[Send Notification to OL]
    Y --> Z{More to Review?}
    Z -->|Yes| U
    Z -->|No| AA[Return to Queue]
    
    M --> AB[Batch Approve/Reject]
    AB --> AC[Confirm Action]
    AC --> X
    
    style L fill:#E3F2FD
    style V fill:#C8E6C9
    style W fill:#FFCDD2
    style AB fill:#FFF3E0
```

**Key Decision Points:**
- Filter selection
- Single vs. batch review
- Approve/Reject/Skip decision
- Feedback requirement (mandatory for reject)

**Success Criteria:**
- Image loads within 1 second
- GPS location displays on map
- Feedback saves correctly
- Notification sent to OL immediately

---

### 2.2 Evidence Viewer Detail Flow

```mermaid
graph TD
    A[Open Evidence Viewer] --> B[Full Screen Mode]
    B --> C[Load High-Res Image]
    C --> D{Image Quality}
    D -->|Good| E[Display Image]
    D -->|Loading| F[Show Skeleton]
    D -->|Error| G[Show Error + Retry]
    
    E --> H[Show Navigation]
    H --> I{User Action}
    
    I -->|Zoom In/Out| J[Pinch/Scroll Zoom]
    I -->|Pan| K[Drag Image]
    I -->|Previous| L[Load Prev Evidence]
    I -->|Next| M[Load Next Evidence]
    I -->|View GPS| N[Open Map Modal]
    I -->|Rate Quality| O[Select Star Rating]
    
    J --> E
    K --> E
    L --> C
    M --> C
    
    N --> P[Show Location on Map]
    P --> Q[Display Address]
    Q --> I
    
    O --> R[Update Quality Score]
    R --> I
    
    I -->|Approve| S[Confirm Approval]
    I -->|Reject| T[Open Feedback Form]
    I -->|Close| U[Return to Queue]
    
    S --> V[Save & Notify]
    T --> W{Feedback Valid?}
    W -->|Yes| V
    W -->|No| X[Show Validation Error]
    X --> T
    
    V --> Y[Update UI]
    Y --> Z{Auto Next?}
    Z -->|Yes| M
    Z -->|No| U
    
    style B fill:#E3F2FD
    style S fill:#C8E6C9
    style T fill:#FFE0B2
    style V fill:#C8E6C9
```

**Key Features:**
- Full-screen immersive review
- Zoom/pan controls
- GPS verification
- Quality rating
- Keyboard shortcuts (A=Approve, R=Reject, →=Next)

---

## 3. MATERIAL VARIANCE APPROVAL

### 3.1 Material Variance Request Flow

```mermaid
graph TD
    A[Notification: New Variance] --> B[Click Notification]
    B --> C[Open Variance Detail]
    
    C --> D[Load Request Info]
    D --> E[Display Material Details]
    E --> F[Show Planned vs Actual]
    F --> G[Calculate Variance %]
    G --> H[Load Historical Data]
    
    H --> I[Display Context]
    I --> J{Variance Level}
    J -->|< 10%| K[Low Risk - Green]
    J -->|10-20%| L[Medium Risk - Yellow]
    J -->|> 20%| M[High Risk - Red]
    
    K --> N[Show Recommendation]
    L --> N
    M --> N
    
    N --> O{Review Decision}
    O -->|Need More Info| P[Request Additional Details]
    O -->|Approve| Q[Add Approval Notes]
    O -->|Reject| R[Add Rejection Reason]
    
    P --> S[Send Message to OL]
    S --> T[Wait for Response]
    T --> C
    
    Q --> U{Approval Valid?}
    U -->|Yes| V[Submit Approval]
    U -->|No| W[Show Validation Error]
    W --> Q
    
    R --> X{Reason Valid?}
    X -->|Yes| Y[Submit Rejection]
    X -->|No| Z[Show Validation Error]
    Z --> R
    
    V --> AA[Update Material Record]
    Y --> AA
    AA --> AB[Adjust Budget if Needed]
    AB --> AC[Send Notification to OL]
    AC --> AD[Send Notification to PM]
    AD --> AE[Log Activity]
    AE --> AF[Return to Dashboard]
    
    style C fill:#E3F2FD
    style K fill:#C8E6C9
    style L fill:#FFF3E0
    style M fill:#FFCDD2
    style V fill:#C8E6C9
    style Y fill:#FFCDD2
```

**Key Decision Points:**
- Variance risk level assessment
- Need for additional information
- Approve/Reject decision
- Budget impact consideration

**Business Rules:**
- Variance < 10%: Auto-recommend approval
- Variance 10-20%: Review required
- Variance > 20%: Escalation to PM required
- Rejection reason mandatory

**Success Criteria:**
- Historical data loads correctly
- Variance calculation accurate
- Budget updates automatically
- All stakeholders notified

---

## 4. QUALITY ISSUE MANAGEMENT

### 4.1 Quality Issue Creation & Resolution

```mermaid
graph TD
    A[Quality Issues List] --> B{Create New Issue}
    B -->|From Evidence| C[Link Evidence]
    B -->|From Inspection| D[Manual Entry]
    
    C --> E[Pre-fill Project Info]
    D --> E
    
    E --> F[Fill Issue Details]
    F --> G[Select Severity]
    G --> H[Select Category]
    H --> I[Add Description]
    I --> J[Upload Photos]
    J --> K[Assign to OL]
    
    K --> L[Submit Issue]
    L --> M[Create Issue Record]
    M --> N[Send Notification to OL]
    N --> O[Send Notification to PM]
    
    O --> P[Issue Created]
    P --> Q{Monitor Status}
    
    Q -->|OL Responds| R[Review Response]
    Q -->|Timeout| S[Send Reminder]
    
    R --> T{Response Type}
    T -->|Action Plan| U[Review Plan]
    T -->|Dispute| V[Escalate to PM]
    T -->|Resolved| W[Request Verification]
    
    U --> X{Plan Acceptable?}
    X -->|Yes| Y[Approve Plan]
    X -->|No| Z[Request Revision]
    
    Y --> AA[Set Deadline]
    Z --> AB[Add Feedback]
    AB --> Q
    
    W --> AC[Schedule Inspection]
    AC --> AD[Conduct Verification]
    AD --> AE{Issue Resolved?}
    AE -->|Yes| AF[Close Issue]
    AE -->|No| AG[Reopen Issue]
    
    AF --> AH[Update Quality Score]
    AG --> Q
    
    V --> AI[PM Review]
    AI --> AJ[PM Decision]
    AJ --> Q
    
    S --> AK[Escalate if No Response]
    AK --> V
    
    style P fill:#E3F2FD
    style AF fill:#C8E6C9
    style AG fill:#FFCDD2
    style V fill:#FFE0B2
```

**Key Decision Points:**
- Issue severity classification
- Response evaluation
- Plan approval
- Resolution verification

**Severity Levels:**
- Critical: Work stoppage required
- High: Immediate attention needed
- Medium: Address within 48h
- Low: Monitor and resolve

**Success Criteria:**
- Issue created within 2 minutes
- All stakeholders notified
- Response tracked
- Resolution verified

---

## 5. PROJECT MONITORING

### 5.1 Project Overview & Drill-Down

```mermaid
graph TD
    A[Projects Dashboard] --> B[View Projects List]
    B --> C{Filter/Sort}
    C -->|By Status| D[Active/Pending/Completed]
    C -->|By Progress| E[Behind/On Track/Ahead]
    C -->|By Quality| F[High/Medium/Low Score]
    
    D --> G[Display Filtered List]
    E --> G
    F --> G
    
    G --> H{Select Project}
    H --> I[Open Project Detail]
    
    I --> J[Load Project Overview]
    J --> K[Display Progress Chart]
    K --> L[Show Quality Metrics]
    L --> M[List Recent Activities]
    M --> N[Show Team Members]
    
    N --> O{Drill Down}
    O -->|Evidence| P[View Project Evidence]
    O -->|Issues| Q[View Project Issues]
    O -->|Materials| R[View Material Usage]
    O -->|Timeline| S[View Schedule]
    O -->|Team| T[View Team Performance]
    
    P --> U[Evidence Gallery]
    U --> V{Action}
    V -->|Review| W[Open Evidence Viewer]
    V -->|Filter| X[Apply Evidence Filters]
    
    Q --> Y[Issues List]
    Y --> Z{Action}
    Z -->|View| AA[Open Issue Detail]
    Z -->|Create| AB[Create New Issue]
    
    R --> AC[Material Dashboard]
    AC --> AD{Action}
    AD -->|View Variance| AE[Open Variance Detail]
    AD -->|Export| AF[Download Report]
    
    S --> AG[Gantt Chart View]
    AG --> AH{Action}
    AH -->|Adjust| AI[Request Schedule Change]
    AH -->|Export| AJ[Download Timeline]
    
    T --> AK[Team Performance]
    AK --> AL{Action}
    AL -->|View Member| AM[Member Detail]
    AL -->|Compare| AN[Comparison Chart]
    
    style I fill:#E3F2FD
    style K fill:#C8E6C9
    style L fill:#FFF3E0
```

**Key Features:**
- Multi-dimensional filtering
- Drill-down navigation
- Real-time metrics
- Export capabilities

**Metrics Displayed:**
- Overall progress %
- Quality score average
- Evidence approval rate
- Issue resolution rate
- Material variance %
- Schedule adherence

---

## 6. TEAM PERFORMANCE REVIEW

### 6.1 OL Performance Monitoring

```mermaid
graph TD
    A[Team Performance] --> B[Select Time Period]
    B --> C[Load Performance Data]
    
    C --> D[Display Team Overview]
    D --> E[Show KPI Dashboard]
    E --> F{View Type}
    
    F -->|Individual| G[Select OL Member]
    F -->|Comparison| H[Compare Multiple OLs]
    F -->|Trend| I[View Trend Analysis]
    
    G --> J[Load OL Profile]
    J --> K[Display Metrics]
    K --> L[Evidence Quality Score]
    L --> M[Response Time Avg]
    M --> N[Issue Resolution Rate]
    N --> O[Material Accuracy]
    O --> P[Project Count]
    
    P --> Q{Performance Level}
    Q -->|Excellent| R[Green Badge]
    Q -->|Good| S[Blue Badge]
    Q -->|Needs Improvement| T[Yellow Badge]
    Q -->|Poor| U[Red Badge]
    
    R --> V[Show Achievements]
    S --> V
    T --> W[Show Improvement Areas]
    U --> W
    
    V --> X{Action}
    W --> X
    
    X -->|Send Feedback| Y[Compose Message]
    X -->|Set Goals| Z[Define KPI Targets]
    X -->|Export| AA[Download Report]
    
    H --> AB[Load Comparison Data]
    AB --> AC[Display Side-by-Side]
    AC --> AD[Highlight Top Performers]
    AD --> AE[Identify Outliers]
    
    I --> AF[Load Historical Data]
    AF --> AG[Display Trend Charts]
    AG --> AH[Show Patterns]
    AH --> AI[Predict Future Performance]
    
    Y --> AJ[Send to OL]
    Z --> AK[Save Goals]
    AA --> AL[Generate PDF/Excel]
    
    style K fill:#E3F2FD
    style R fill:#C8E6C9
    style T fill:#FFF3E0
    style U fill:#FFCDD2
```

**KPIs Tracked:**
- Evidence quality score (avg)
- Evidence submission timeliness
- Issue response time
- Issue resolution rate
- Material variance accuracy
- Communication responsiveness
- Safety compliance rate

**Performance Thresholds:**
- Excellent: 90%+ across all KPIs
- Good: 75-89%
- Needs Improvement: 60-74%
- Poor: < 60%

---

## 7. ANALYTICS & REPORTING

### 7.1 Analytics Dashboard & Report Generation

```mermaid
graph TD
    A[Analytics Dashboard] --> B[Select Report Type]
    B --> C{Report Category}
    
    C -->|Project Analytics| D[Project Performance]
    C -->|Quality Analytics| E[Quality Metrics]
    C -->|Team Analytics| F[Team Performance]
    C -->|Material Analytics| G[Material Usage]
    C -->|Financial Analytics| H[Budget & Costs]
    
    D --> I[Configure Filters]
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Select Date Range]
    J --> K[Select Projects]
    K --> L[Select Metrics]
    L --> M[Apply Filters]
    
    M --> N[Load Data]
    N --> O{Data Available?}
    O -->|Yes| P[Generate Charts]
    O -->|No| Q[Show Empty State]
    
    P --> R[Display Dashboard]
    R --> S[Show Summary Cards]
    S --> T[Render Charts]
    T --> U[Display Tables]
    
    U --> V{User Action}
    V -->|Drill Down| W[View Detail]
    V -->|Export| X[Select Format]
    V -->|Share| Y[Generate Link]
    V -->|Schedule| Z[Set Auto-Report]
    
    W --> AA[Detailed View]
    AA --> AB[Show Breakdown]
    AB --> V
    
    X --> AC{Export Format}
    AC -->|PDF| AD[Generate PDF]
    AC -->|Excel| AE[Generate Excel]
    AC -->|CSV| AF[Generate CSV]
    
    AD --> AG[Download File]
    AE --> AG
    AF --> AG
    
    Y --> AH[Create Shareable Link]
    AH --> AI[Copy to Clipboard]
    
    Z --> AJ[Configure Schedule]
    AJ --> AK[Select Recipients]
    AK --> AL[Save Schedule]
    AL --> AM[Confirm Setup]
    
    style R fill:#E3F2FD
    style AG fill:#C8E6C9
    style AM fill:#C8E6C9
```

**Report Types:**

1. **Project Performance:**
   - Progress trends
   - Quality scores
   - Timeline adherence
   - Budget variance

2. **Quality Metrics:**
   - Evidence approval rates
   - Issue distribution
   - Resolution times
   - Quality score trends

3. **Team Performance:**
   - OL rankings
   - KPI comparisons
   - Productivity trends
   - Response times

4. **Material Analytics:**
   - Usage patterns
   - Variance trends
   - Cost analysis
   - Waste reduction

**Export Formats:**
- PDF: Executive summary with charts
- Excel: Raw data + pivot tables
- CSV: Data export for analysis

---

## 8. FIELD INSPECTION (MOBILE)

### 8.1 Mobile Inspection Flow

```mermaid
graph TD
    A[Mobile App Launch] --> B[Login]
    B --> C[Dashboard Mobile]
    
    C --> D{Quick Action}
    D -->|Conduct Inspection| E[Start Inspection]
    D -->|Review Evidence| F[Evidence Queue Mobile]
    D -->|View Issues| G[Issues List Mobile]
    
    E --> H[Select Project]
    H --> I[Load Project Info]
    I --> J[Start Inspection Mode]
    
    J --> K[Enable Camera]
    K --> L[Enable GPS]
    L --> M{Capture Type}
    
    M -->|Photo| N[Take Photo]
    M -->|Video| O[Record Video]
    M -->|Note| P[Voice/Text Note]
    
    N --> Q[Auto-tag GPS]
    O --> Q
    P --> Q
    
    Q --> R[Add to Inspection]
    R --> S{More Items?}
    S -->|Yes| M
    S -->|No| T[Review Inspection]
    
    T --> U[Preview All Items]
    U --> V{Quality Check}
    V -->|OK| W[Submit Inspection]
    V -->|Retake| X[Delete & Retake]
    
    X --> M
    
    W --> Y{Network Available?}
    Y -->|Yes| Z[Upload Immediately]
    Y -->|No| AA[Queue for Upload]
    
    Z --> AB[Upload to Server]
    AA --> AC[Save Locally]
    AC --> AD[Auto-sync When Online]
    
    AB --> AE[Create Evidence Records]
    AD --> AE
    AE --> AF[Notify Supervisor]
    AF --> AG[Inspection Complete]
    
    F --> AH[Swipe to Review]
    AH --> AI{Decision}
    AI -->|Swipe Right| AJ[Approve]
    AI -->|Swipe Left| AK[Reject]
    AI -->|Tap| AL[View Detail]
    
    AJ --> AM[Next Evidence]
    AK --> AN[Add Feedback]
    AN --> AM
    AL --> AO[Full Screen View]
    AO --> AI
    
    style E fill:#E3F2FD
    style W fill:#FFF3E0
    style Z fill:#C8E6C9
    style AA fill:#FFE0B2
```

**Mobile-Specific Features:**
- Offline mode support
- Auto GPS tagging
- Camera integration
- Voice notes
- Swipe gestures
- Auto-sync when online

**Offline Capabilities:**
- Queue uploads
- Local storage
- Sync indicator
- Conflict resolution

---

## 9. BATCH OPERATIONS

### 9.1 Bulk Evidence Approval

```mermaid
graph TD
    A[Evidence Queue] --> B[Enable Multi-Select]
    B --> C[Select Items]
    C --> D{Selection Count}
    
    D -->|1-10| E[Small Batch]
    D -->|11-50| F[Medium Batch]
    D -->|51+| G[Large Batch]
    
    E --> H[Show Batch Toolbar]
    F --> H
    G --> H
    
    H --> I{Batch Action}
    I -->|Approve All| J[Confirm Bulk Approve]
    I -->|Reject All| K[Require Bulk Feedback]
    I -->|Export| L[Download Selected]
    I -->|Assign| M[Assign to Reviewer]
    
    J --> N{Confirmation}
    N -->|Confirm| O[Process Approvals]
    N -->|Cancel| P[Return to Queue]
    
    K --> Q[Open Feedback Form]
    Q --> R{Feedback Valid?}
    R -->|Yes| S[Process Rejections]
    R -->|No| T[Show Error]
    T --> Q
    
    O --> U[Show Progress Bar]
    S --> U
    
    U --> V[Update Records]
    V --> W[Send Notifications]
    W --> X{All Processed?}
    X -->|Yes| Y[Show Success]
    X -->|Partial| Z[Show Partial Success]
    X -->|Failed| AA[Show Errors]
    
    Y --> AB[Refresh Queue]
    Z --> AC[Show Failed Items]
    AA --> AC
    
    AC --> AD{Retry?}
    AD -->|Yes| U
    AD -->|No| AB
    
    L --> AE[Generate Export]
    AE --> AF[Download ZIP]
    
    M --> AG[Select Reviewer]
    AG --> AH[Assign & Notify]
    
    style H fill:#E3F2FD
    style O fill:#FFF3E0
    style Y fill:#C8E6C9
    style AA fill:#FFCDD2
```

**Batch Operation Rules:**
- Max 100 items per batch
- Progress indicator required
- Rollback on critical errors
- Partial success handling
- Detailed error reporting

**Performance:**
- Process 10 items/second
- Show progress every 10%
- Timeout after 5 minutes
- Auto-retry failed items (3x)

---

## 10. NOTIFICATION HANDLING

### 10.1 Notification Flow

```mermaid
graph TD
    A[Receive Notification] --> B{Notification Type}
    
    B -->|Evidence Uploaded| C[Evidence Notification]
    B -->|Material Variance| D[Variance Notification]
    B -->|Quality Issue| E[Issue Notification]
    B -->|Deadline Alert| F[Deadline Notification]
    B -->|Team Update| G[Team Notification]
    
    C --> H[Show Badge Count]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I{User Action}
    I -->|Click Bell Icon| J[Open Notification Panel]
    I -->|Click Notification| K[Navigate to Item]
    I -->|Ignore| L[Keep in Panel]
    
    J --> M[Display Notification List]
    M --> N{List Action}
    N -->|Click Item| K
    N -->|Mark as Read| O[Update Status]
    N -->|Mark All Read| P[Bulk Update]
    N -->|Clear All| Q[Confirm Clear]
    
    K --> R{Notification Type}
    R -->|Evidence| S[Open Evidence Viewer]
    R -->|Variance| T[Open Variance Detail]
    R -->|Issue| U[Open Issue Detail]
    R -->|Deadline| V[Open Project Timeline]
    R -->|Team| W[Open Team Performance]
    
    S --> X[Mark as Read]
    T --> X
    U --> X
    V --> X
    W --> X
    
    X --> Y[Update Badge Count]
    Y --> Z[Remove from Panel]
    
    O --> Y
    P --> Y
    
    Q --> AA{Confirm?}
    AA -->|Yes| AB[Clear All]
    AA -->|No| M
    
    AB --> AC[Reset Badge]
    AC --> AD[Empty Panel]
    
    style H fill:#FFE0B2
    style K fill:#E3F2FD
    style X fill:#C8E6C9
```

**Notification Priority:**
1. **Critical:** Quality issues, deadline overdue
2. **High:** Material variance, evidence pending
3. **Medium:** Team updates, reports ready
4. **Low:** General announcements

**Notification Channels:**
- In-app badge
- Push notification (mobile)
- Email digest (daily)
- SMS (critical only)

**Auto-Clear Rules:**
- Read notifications: 7 days
- Unread notifications: 30 days
- Critical: Never auto-clear

---

## APPENDIX

### A. Navigation Shortcuts

| Screen | Desktop Shortcut | Mobile Gesture |
|--------|------------------|----------------|
| Dashboard | Ctrl+D | Tap Dashboard tab |
| Evidence Queue | Ctrl+E | Tap Evidence tab |
| Issues | Ctrl+I | Tap Issues tab |
| Analytics | Ctrl+A | Swipe right from edge |
| Search | Ctrl+K or / | Pull down |
| Notifications | Ctrl+N | Swipe down from top |
| Approve (in review) | A | Swipe right |
| Reject (in review) | R | Swipe left |
| Next item | → or Space | Swipe up |
| Previous item | ← | Swipe down |

### B. State Transitions

**Evidence Status:**
```
PENDING → APPROVED → ARCHIVED
        ↓
      REJECTED → RESUBMITTED → PENDING
```

**Quality Issue Status:**
```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
     ↓              ↓
   ESCALATED    REOPENED → IN_PROGRESS
```

**Material Variance Status:**
```
REQUESTED → APPROVED → APPLIED
          ↓
        REJECTED → REVISED → REQUESTED
```

### C. Error Handling

**Common Errors:**
1. Network timeout → Retry with exponential backoff
2. Invalid data → Show validation errors inline
3. Permission denied → Redirect to login
4. Server error → Show error message + support contact
5. Offline mode → Queue actions for sync

**Error Recovery:**
- Auto-save form data
- Resume interrupted uploads
- Retry failed operations
- Preserve user context

### D. Performance Benchmarks

| Operation | Target Time | Max Time |
|-----------|-------------|----------|
| Dashboard load | < 2s | 5s |
| Evidence viewer open | < 1s | 3s |
| Image load (full-res) | < 2s | 5s |
| Filter application | < 500ms | 2s |
| Batch operation (10 items) | < 5s | 15s |
| Report generation | < 10s | 30s |
| Export download | < 5s | 20s |

---

**Document Status:** Complete  
**Related Documents:**
- FDD_Supervisor.md - Functional requirements
- Layout_Spec_Supervisor.md - UI specifications
- Wireframes_Supervisor/ - Visual designs

**Next Steps:** Create wireframes for all 10 user flows
