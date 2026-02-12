# User Flows - Project Manager (PM)
**SIRA Service Management Platform**

---

## Flow 1: Create Internal Project

**Goal**: PM wants to create a new internal construction project

**Steps**:

```mermaid
graph TD
    A[PM logs in] --> B[Dashboard]
    B --> C[Clicks 'Projects' in sidebar]
    C --> D[Project List page]
    D --> E[Clicks '+ Create Project']
    E --> F[Create Project Form]
    F --> G{Fills required fields}
    G --> H[Selects Customer]
    H --> I[Contract dropdown auto-filters]
    I --> J[Selects Contract]
    J --> K[Project Type = INTERNAL]
    K --> L[Fills address, dates, etc.]
    L --> M{Validates form}
    M -->|Invalid| N[Shows errors inline]
    N --> L
    M -->|Valid| O[Clicks 'Save & Schedule']
    O --> P[System creates project]
    P --> Q[Success message]
    Q --> R[Redirects to Project Detail]
    R --> S[PM assigns team later]
```

**Wireframes**:
- Dashboard: `01_Dashboard.txt`
- Project List: `04_Project_List.txt`
- Create Form: `05_Project_Create_Internal.txt`
- Project Detail: `07_Project_Detail_Overview.txt`

**Estimated Time**: 2-3 minutes

---

## Flow 2: Review & Approve Evidence

**Goal**: PM reviews evidence uploaded by Supervisor and approves it

**Steps**:

```mermaid
graph TD
    A[PM receives notification: 'New evidence uploaded'] --> B[Clicks notification]
    B --> C[Opens project detail]
    C --> D[Clicks 'Evidence' tab]
    D --> E[Evidence Gallery loads]
    E --> F[Filters: Status = UPLOADED]
    F --> G[Sees 7 pending evidence]
    G --> H[Clicks first thumbnail]
    H --> I[Lightbox opens fullscreen]
    I --> J{Reviews evidence quality}
    J -->|Good| K[Clicks 'Approve' button]
    K --> L[Confirmation modal]
    L --> M[Clicks 'Confirm']
    M --> N[Status updates to APPROVED]
    N --> O[Badge turns green]
    O --> P[Uploader receives notification]
    P --> Q{More evidence to review?}
    Q -->|Yes| R[Clicks 'Next' arrow]
    R --> J
    Q -->|No| S[Closes lightbox]
    S --> T[Returns to gallery]
    
    J -->|Poor quality| U[Clicks 'Reject']
    U --> V[Reject modal with reason textarea]
    V --> W[Enters reason: 'Image blurry, retake']
    W --> X[Clicks 'Confirm Reject']
    X --> Y[Status updates to REJECTED]
    Y --> Z[Uploader receives notification with reason]
    Z --> Q
```

**Wireframes**:
- Evidence Gallery: `08_Evidence_Gallery.txt`
- Evidence Lightbox: `09_Evidence_Lightbox.txt`

**Estimated Time**: 30 seconds per evidence

---

## Flow 3: Generate Customer Portal Link

**Goal**: PM generates a portal link to share with customer for progress updates

**Steps**:

```mermaid
graph TD
    A[PM opens project detail] --> B[Clicks 'Customer Portal' tab]
    B --> C[Portal Management page]
    C --> D[Clicks '+ Generate New Link']
    D --> E[Generate Link Modal]
    E --> F{PM selects options}
    F --> G[Access Level: BASIC]
    G --> H[Expiration: Never]
    H --> I[Clicks 'Generate Link']
    I --> J[System generates token]
    J --> K[Success Modal shows link + QR]
    K --> L{PM chooses share method}
    L -->|Copy Link| M[Clicks 'Copy' button]
    M --> N[Link copied to clipboard]
    N --> O[Toast: 'Copied!']
    L -->|QR Code| P[Shows QR to customer on mobile]
    L -->|Download| Q[Clicks 'Download QR']
    Q --> R[QR saved as PNG]
    R --> S[PM sends via Zalo/Email]
    O --> T[PM closes modal]
    P --> T
    S --> T
    T --> U[Link appears in portal table]
    U --> V[Customer can now access portal]
```

**Wireframes**:
- Portal Management: `12_Portal_Management.txt`
- Generate Modal: `13_Generate_Link_Modal.txt`
- Success Modal: `13_Generate_Link_Modal.txt` (bottom half)

**Estimated Time**: 1 minute

---

## Flow 4: Track Payment Milestones

**Goal**: PM creates payment milestones and tracks payment status

**Steps**:

```mermaid
graph TD
    A[PM opens project detail] --> B[Clicks 'Financials' tab]
    B --> C[Financials page loads]
    C --> D[Sees summary: Contract 50M, Paid 0, Outstanding 50M]
    D --> E[Clicks '+ Add Milestone']
    E --> F[Add Milestone Modal]
    F --> G[Type: DEPOSIT]
    G --> H[Percentage: 30%]
    H --> I[Amount auto-calculates: 15M]
    I --> J[Due Date: 2026-03-01]
    J --> K[Clicks 'Save Milestone']
    K --> L{Validation: Total <= 100%}
    L -->|Pass| M[Milestone created]
    M --> N[Table shows milestone with status=PENDING]
    L -->|Fail| O[Error: 'Total exceeds 100%']
    O --> H
    N --> P[PM repeats for ADVANCE, ACCEPTANCE, FINAL]
    P --> Q[Total = 100%]
    Q --> R[Customer pays DEPOSIT on 2026-03-05]
    R --> S[Accountant marks milestone as PAID]
    S --> T[PM sees status updated to PAID]
    T --> U[Summary updates: Paid 15M, Outstanding 35M]
    U --> V{Due date passed & not paid?}
    V -->|Yes| W[Status auto-changes to OVERDUE]
    W --> X[PM receives notification]
    X --> Y[PM calls customer for payment]
    V -->|No| Z[Continue monitoring]
```

**Wireframes**:
- Financials Tab: `10_Financials_Tab.txt`
- Add Milestone Modal: `11_Add_Milestone_Modal.txt`

**Estimated Time**: 5 minutes (to create all milestones)

---

## Flow 5: Assign Outsource Team to Project

**Goal**: PM creates an outsource project and assigns outsource team

**Steps**:

```mermaid
graph TD
    A[PM clicks 'Create Project'] --> B[Create Project Form]
    B --> C[Fills basic info: Customer, Contract, Address]
    C --> D[Project Type: OUTSOURCE]
    D --> E[Form shows outsource fields]
    E --> F[PM selects Outsource Company]
    F --> G[Outsource Leader dropdown loads]
    G --> H[PM selects Outsource Leader]
    H --> I[PM assigns Supervisor: internal user]
    I --> J[Clicks 'Save & Schedule']
    J --> K[System creates project]
    K --> L[System creates PROJECT_ASSIGNMENT for Supervisor]
    L --> M[System creates PROJECT_ASSIGNMENT for Outsource Leader]
    M --> N[Both receive notifications]
    N --> O[Supervisor sees project in 'My Projects']
    O --> P[Outsource Leader sees project in their portal]
    P --> Q[Outsource Leader assigns staff from their company]
    Q --> R[Project execution begins]
```

**Wireframes**:
- Create Outsource Form: `06_Project_Create_Outsource.txt`
- Project Detail: `07_Project_Detail_Overview.txt`

**Estimated Time**: 3-4 minutes

---

## Flow 6: Monitor Dashboard & Take Action

**Goal**: PM starts their day by checking dashboard and taking action on alerts

**Steps**:

```mermaid
graph TD
    A[PM logs in morning] --> B[Dashboard loads]
    B --> C{Checks KPI cards}
    C --> D[Total Projects: 48]
    D --> E[Active Projects: 12 - clicks 'View']
    E --> F[Sees project list filtered by ACTIVE]
    F --> G[Returns to dashboard]
    G --> H[Pending Approvals: 7 - clicks 'View']
    H --> I[Opens evidence gallery filtered by UPLOADED]
    I --> J[Reviews and approves 5, rejects 2]
    J --> K[Returns to dashboard]
    K --> L[Checks Revenue card: +8.5% trend]
    L --> M{Checks notifications bell: 3 unread}
    M --> N[Clicks notification icon]
    N --> O[Dropdown shows: 1=Payment overdue, 2=New evidence]
    O --> P[Clicks 'Payment overdue' notification]
    P --> Q[Opens project financials tab]
    Q --> R[Sees ACCEPTANCE milestone is 5 days overdue]
    R --> S[PM calls customer to follow up]
    S --> T[Customer promises to pay tomorrow]
    T --> U[PM adds note to milestone]
    U --> V[Returns to dashboard to continue day]
```

**Wireframes**:
- Dashboard: `01_Dashboard.txt`
- Top Navigation: `02_Top_Navigation.txt`

**Estimated Time**: 10-15 minutes (morning routine)

---

## Flow 7: Export Financial Report for Management

**Goal**: PM exports monthly financial report for management review

**Steps**:

```mermaid
graph TD
    A[PM goes to Reports section] --> B[Clicks 'Financial Reports']
    B --> C[Report configuration page]
    C --> D[Date Range: Last Month]
    D --> E[Group By: Project]
    E --> F[Include: Revenue, Cost, Profit]
    F --> G[Clicks 'Generate Report']
    G --> H[System queries data]
    H --> I[Report preview shows]
    I --> J{PM reviews data}
    J -->|OK| K[Clicks 'Export to Excel']
    K --> L[Excel file downloads]
    L --> M[PM opens Excel]
    M --> N[Sees: 5 projects, total revenue 150M, profit 25M]
    N --> O[PM emails report to CEO]
    J -->|Needs changes| P[Adjusts filters]
    P --> G
```

**Estimated Time**: 3 minutes

---

**Total Flows**: 7 main user journeys  
**Average Time per Flow**: 2-10 minutes  
**Version**: 1.0  
**Date**: 2026-02-12
