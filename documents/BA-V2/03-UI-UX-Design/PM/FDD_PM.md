# FDD - Project Manager (PM) Layout
**SIRA Service Management Platform - UI/UX Design**

---

## 1. ROLE OVERVIEW

### 1.1 Role Information

| Attribute | Value |
|-----------|-------|
| **Role Name** | Project Manager (PM) |
| **Primary Device** | Desktop + Tablet |
| **Max Container Width** | 1280px |
| **Design Approach** | Desktop-first, tablet-friendly |
| **Access Level** | Full system access (manage projects, teams, customers, financials) |

### 1.2 Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Project Planning** | Create projects, assign teams, set timelines |
| **Team Management** | Assign internal staff or outsource teams to projects |
| **Customer Relations** | Communicate with customers, generate portal links |
| **Evidence Oversight** | Review and approve evidence from Supervisors/Staff |
| **Financial Tracking** | Create payment milestones, track project profitability |
| **Reporting** | Generate reports for management and customers |

### 1.3 Daily Tasks

1. **Morning**: 
   - Check dashboard for project status overview
   - Review notifications (new evidence, overdue payments, team requests)
   - Prioritize projects for the day

2. **During Day**: 
   - Create/update projects
   - Assign staff to projects
   - Review and approve evidence
   - Communicate with customers (via portal or phone)
   - Update project progress
   - Create payment milestones

3. **End of Day**: 
   - Review project progress
   - Check financial reports
   - Plan for next day

### 1.4 Pain Points (Current System)

| Pain Point | Impact | Proposed Solution |
|------------|--------|-------------------|
| **Information scattered** (Zalo, Excel, Drive) | High | Centralized dashboard with all info |
| **Manual report generation** | High | Auto-generated reports with 1 click |
| **No real-time visibility** | Medium | Real-time dashboard widgets |
| **Customer inquiries** (constant calls) | Medium | Customer portal (self-service) |
| **Difficult outsource management** | High | Outsource company tracking + leader assignment |

---

## 2. LAYOUT DESIGN

### 2.1 Layout Structure

```
┌────────────────────────────────────────────────────────┐
│ Top Bar: LOGO | Search | Notifications | Profile       │
├────────┬───────────────────────────────────────────────┤
│        │                                               │
│ Side   │  Main Content Area                            │
│ Menu   │  - Dashboard                                  │
│        │  - Project List/Details                       │
│ - Home │  - Forms                                      │
│ - Proj │  - Tables                                     │
│ - Team │  - Reports                                    │
│ - Cust │                                               │
│ - Fin  │                                               │
│ - Rpt  │                                               │
│        │                                               │
└────────┴───────────────────────────────────────────────┘
```

### 2.2 Navigation Structure

**Top Navigation**:
- Logo/Brand (left, clickable → Dashboard)
- Global Search bar (center)
- Notifications icon (badge count)
- Profile menu dropdown (user name + avatar)
  - My Profile
  - Settings
  - Logout

**Side Menu** (collapsible):
- 🏠 **Dashboard** (Home)
- 📋 **Projects**
  - All Projects
  - My Projects
  - Create Project
- 👥 **Teams**
  - Internal Teams
  - Outsource Companies
- 👤 **Customers**
  - All Customers
  - Add Customer
- 💰 **Financials**
  - Payment Milestones
  - Transactions
  - Reports
- 📊 **Reports**
  - Project Reports
  - Financial Reports
  - Export Data
- ⚙️ **Settings**

**Breadcrumbs** (below top bar):
- Shows current location: `Home > Projects > Project Details > Edit`

### 2.3 Dashboard (Home Screen)

#### Layout (12-column grid)

**Row 1: KPI Cards** (4 cards x 3 cols each)
- Total Projects (count + trend)
- Active Projects (count + list link)
- Pending Approvals (evidence count)
- Revenue This Month (amount + % change)

**Row 2: Charts** (8 cols + 4 cols)
- **Left (8 cols)**: Project Timeline (Gantt-like chart)
- **Right (4 cols)**: Project Status Distribution (Pie chart)

**Row 3: Recent Items** (6 cols each)
- **Left**: Recent Projects (table: 5 rows)
- **Right**: Recent Payments (table: 5 rows)

**Row 4: Quick Actions** (12 cols)
- Buttons: "Create Project" | "Assign Team" | "Generate Portal Link" | "View Reports"

#### Wireframe Reference

See [`Wireframes_PM/01_Dashboard.png`](file:///)

### 2.4 Responsive Design

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (>1280px)** | Full layout, sidebar expanded, 3-column grid |
| **Desktop (1024-1280px)** | Sidebar auto-collapses to icons, 2-column grid |
| **Tablet (768-1023px)** | Sidebar hidden (hamburger menu), 1-2 column grid |
| **Mobile (<768px)** | Stack all widgets vertically, bottom navigation |

---

## 3. FEATURE LIST

### Feature 1: Project Management

**Description**: Create, edit, update, and close construction projects

**User Story**: As PM, I want to manage all project details in one place so that I don't waste time switching between tools

**Use Cases**: 
- UC-PM-01: Create New Project (Internal)
- UC-PM-02: Create New Project (Outsource)
- UC-PM-03: Edit Project Details
- UC-PM-04: Change Project Status

**Wireframe**: See [`Wireframes_PM/02_Project_Create.png`](file:///)

**Priority**: **High** (Core feature)

---

### Feature 2: Team Assignment

**Description**: Assign internal staff or outsource teams to projects

**User Story**: As PM, I want to easily assign the right team to each project so that execution runs smoothly

**Use Cases**: 
- UC-PM-05: Assign Internal Team
- UC-PM-06: Assign Outsource Team + Leader
- UC-PM-07: Reassign Team Member

**Wireframe**: See [`Wireframes_PM/03_Team_Assignment.png`](file:///)

**Priority**: **High**

---

### Feature 3: Evidence Review & Approval

**Description**: View, review, and approve/reject evidence uploaded by Supervisors/Staff

**User Story**: As PM, I want to quickly review evidence so that I can ensure quality before customer acceptance

**Use Cases**: 
- UC-PM-08: View Evidence Gallery
- UC-PM-09: Approve Evidence
- UC-PM-10: Reject Evidence (with reason)

**Wireframe**: See [`Wireframes_PM/04_Evidence_Gallery.png`](file:///)

**Priority**: **High**

---

### Feature 4: Customer Portal Management

**Description**: Generate and manage share-links for customer portal

**User Story**: As PM, I want to give customers self-service access so that I don't get constant calls asking for updates

**Use Cases**: 
- UC-PM-11: Generate Portal Link
- UC-PM-12: Revoke Portal Link
- UC-PM-13: Set Portal Access Level (BASIC/FULL)

**Wireframe**: See [`Wireframes_PM/05_Portal_Link_Gen.png`](file:///)

**Priority**: **High**

---

### Feature 5: Payment Milestone Tracking

**Description**: Create payment milestones and track payment status

**User Story**: As PM, I want to track payment milestones so that I know exactly when to collect money from customers

**Use Cases**: 
- UC-PM-14: Create Payment Milestone
- UC-PM-15: View Payment Status
- UC-PM-16: Mark Milestone as Overdue (auto)

**Wireframe**: See [`Wireframes_PM/06_Payment_Milestones.png`](file:///)

**Priority**: **High**

---

### Feature 6: Material Planning

**Description**: Plan material usage for projects

**User Story**: As PM, I want to plan material quantities so that I can budget accurately

**Use Cases**: 
- UC-PM-17: Add Material to Project
- UC-PM-18: Update Planned Quantity
- UC-PM-19: Compare Planned vs Actual

**Priority**: **Medium**

---

### Feature 7: Financial Reports

**Description**: View project profitability and financial summaries

**User Story**: As PM, I want to see real-time profit/loss so that I can make informed decisions

**Use Cases**: 
- UC-PM-20: View Project P&L
- UC-PM-21: View Monthly Revenue Report
- UC-PM-22: Export Financial Report (Excel)

**Priority**: **Medium**

---

### Feature 8: Customer Management

**Description**: Manage customer information and contracts

**Use Cases**: 
- UC-PM-23: Add New Customer
- UC-PM-24: Create Contract
- UC-PM-25: View Customer History

**Priority**: **Low** (Delegated to Admin often)

---

### Feature 9: Outsource Company Management

**Description**: Manage outsource companies and their leaders

**Use Cases**: 
- UC-PM-26: Add Outsource Company
- UC-PM-27: Assign Outsource Leader to Company
- UC-PM-28: View Outsource Performance

**Priority**: **Medium**

---

### Feature 10: Notifications & Alerts

**Description**: Receive real-time notifications for important events

**Examples**:
- New evidence uploaded (needs review)
- Payment overdue
- Project status changed
- Customer portal link accessed

**Priority**: **High** (Engagement)

---

## 4. USE CASES

### UC-PM-01: Create New Project (Internal Scenario)

**Actor**: PM

**Precondition**: 
- PM is logged in
- PM has permission to create projects
- Customer and contract already exist

**Main Flow**:

1. PM clicks "Projects" → "Create Project"
2. System displays project creation form
3. PM fills in required fields:
   - Project code (auto-generated or manual)
   - Project name
   - Customer (dropdown select)
   - Contract (dropdown filtered by customer)
   - Project type: Select **INTERNAL**
   - Address
   - GPS coordinates (optional, map picker)
   - Waterproofing type
   - Planned start/end dates
4. PM assigns **PM** (self or other PM)
5. System validates input
6. PM clicks "Save"
7. System creates project with status = DRAFT
8. System displays success message
9. System redirects to project detail page

**Alternative Flows**:

**AF-01: Auto-generate Project Code**
- 3a. If PM leaves project code blank:
  - System auto-generates code: `PRJ-YYYY-XXX` (e.g., PRJ-2026-001)
  - Resume at step 4

**AF-02: GPS Coordinates from Map**
- 3b. If PM clicks "Pick from Map":
  - System shows map modal
  - PM clicks location on map
  - System fills lat/lng fields
  - Resume at step 4

**Exception Flows**:

**EF-01: Validation Error**
- 5. If validation fails:
  - System highlights error fields with red border
  - System shows error messages below fields
  - PM corrects errors
  - Resume at step 5

**EF-02: Duplicate Project Code**
- 7. If project code already exists:
  - System shows error: "Project code already exists"
  - PM changes project code
  - Resume at step 6

**Postcondition**: 
- New project created with status = DRAFT
- Project appears in PM's project list
- Audit log created

**UI Screens**:

| Screen | Wireframe | Description |
|--------|-----------|-------------|
| Project List | `02_Project_List.png` | Projects table with "Create" button |
| Create Form | `02_Project_Create.png` | Project creation form (internal scenario) |
| Success | `02_Project_Success.png` | Success message + redirect |

**Acceptance Criteria**:

- [ ] AC-01: Form validation triggers within 200ms of field blur
- [ ] AC-02: Success message shows for 3s then auto-redirects
- [ ] AC-03: Project code auto-generated if blank (format: PRJ-YYYY-XXX)
- [ ] AC-04: GPS map picker works on both desktop and mobile
- [ ] AC-05: All required fields marked with red asterisk (*)

---

### UC-PM-02: Create New Project (Outsource Scenario)

**Actor**: PM

**Precondition**: 
- PM is logged in
- Customer, contract, and outsource company exist

**Main Flow**:

1-3. Same as UC-PM-01 steps 1-3
4. PM selects Project type: **OUTSOURCE**
5. System shows additional fields:
   - **Outsource Company** (dropdown)
   - **Supervisor** (dropdown, internal users with SUPERVISOR role)
   - **Outsource Leader** (dropdown, filtered by selected outsource company)
6. PM fills outsource-specific fields
7. PM assigns PM (self or other)
8. System validates input
9. PM clicks "Save"
10. System creates project with status = DRAFT
11. System creates PROJECT_ASSIGNMENT records for Supervisor and Outsource Leader
12. System displays success message

**Alternative Flows**:

**AF-01: No Outsource Leader for Company**
- 6a. If selected outsource company has no leaders:
  - System shows warning: "No leaders found for this company. You can create one in Settings."
  - PM can still save (leader can be assigned later)
  - Resume at step 8

**Postcondition**: 
- New outsource project created
- Supervisor and Outsource Leader assigned
- Both Supervisor and Leader receive notification

**UI Screens**:

| Screen | Wireframe | Description |
|--------|-----------|-------------|
| Create Form (Outsource) | `02_Project_Create_Outsource.png` | Form with outsource fields |

**Acceptance Criteria**:

- [ ] AC-01: When project_type = OUTSOURCE, show outsource fields (company, supervisor, leader)
- [ ] AC-02: Outsource Leader dropdown only shows leaders of selected company
- [ ] AC-03: Supervisor dropdown only shows internal users with SUPERVISOR role
- [ ] AC-04: System sends notification to Supervisor and Outsource Leader upon creation

---

### UC-PM-08: View Evidence Gallery

**Actor**: PM

**Precondition**: 
- PM is logged in
- Project exists and has evidence

**Main Flow**:

1. PM opens project detail page
2. PM clicks "Evidence" tab
3. System displays evidence gallery with filters:
   - Stage filter: All / BEFORE / DURING / AFTER
   - Status filter: All / UPLOADED / APPROVED / REJECTED
   - Date range picker
4. System displays evidence as grid of thumbnails
   - Each thumbnail shows:
     - Image preview or video icon
     - Upload date
     - Uploader name
     - Status badge (color-coded)
5. PM can click thumbnail to view full-size

**Alternative Flows**:

**AF-01: Filter by Stage**
- 3a. PM selects "BEFORE" from stage filter:
  - System reloads gallery showing only BEFORE evidence
  - Resume at step 4

**UI** Screens**:

| Screen | Wireframe | Description |
|--------|-----------|-------------|
| Evidence Gallery | `04_Evidence_Gallery.png` | Grid view with filters |
| Evidence Detail| `04_Evidence_Detail.png` | Fullscreen image viewer |

**Acceptance Criteria**:

- [ ] AC-01: Gallery loads within 2s for 100 images
- [ ] AC-02: Thumbnails lazy-load as user scrolls
- [ ] AC-03: Status badge color: Green (APPROVED), Yellow (UPLOADED), Red (REJECTED)
- [ ] AC-04: Clicking thumbnail opens lightbox with prev/next navigation

---

### UC-PM-09: Approve Evidence

**Actor**: PM

**Precondition**: 
- PM viewing evidence detail
- Evidence status = UPLOADED

**Main Flow**:

1. PM views evidence in fullscreen
2. PM clicks "Approve" button
3. System shows confirmation modal: "Approve this evidence?"
4. PM clicks "Confirm"
5. System updates evidence status = APPROVED
6. System sets reviewed_by = PM user_id, reviewed_at = now()
7. System shows success toast: "Evidence approved"
8. System updates status badge to green
9. System sends notification to uploader

**Acceptance Criteria**:

- [ ] AC-01: Approve button only visible if status = UPLOADED
- [ ] AC-02: Success toast auto-dismisses after 3s
- [ ] AC-03: Uploader receives notification within 10s

---

### UC-PM-10: Reject Evidence (with reason)

**Actor**: PM

**Precondition**: 
- PM viewing evidence detail
- Evidence status = UPLOADED

**Main Flow**:

1. PM views evidence in fullscreen
2. PM clicks "Reject" button
3. System shows reject modal with textarea: "Reason for rejection"
4. PM enters rejection reason (required, min 10 chars)
5. PM clicks "Confirm Reject"
6. System validates reason (not empty, min length)
7. System updates evidence status = REJECTED, reject_reason = input
8. System sets reviewed_by = PM, reviewed_at = now()
9. System shows success toast: "Evidence rejected"
10. System sends notification to uploader with reject reason

**Exception Flows**:

**EF-01: Empty Reason**
- 6. If reason is empty or < 10 chars:
  - System shows error: "Rejection reason required (min 10 characters)"
  - PM enters valid reason
  - Resume at step 5

**Acceptance Criteria**:

- [ ] AC-01: Reject reason required, min 10 chars
- [ ] AC-02: Uploader sees reject reason in notification and evidence detail
- [ ] AC-03: Rejected evidence can be re-uploaded by uploader

---

### UC-PM-11: Generate Customer Portal Link

**Actor**: PM

**Precondition**: 
- PM is on project detail page
- Project status >= SCHEDULED

**Main Flow**:

1. PM clicks "Customer Portal" tab
2. System shows portal link management page:
   - Existing links (if any) in table: Token, Access Level, Created Date, Status, Actions
   - "Generate New Link" button
3. PM clicks "Generate New Link"
4. System shows modal with options:
   - Access Level: BASIC (default) / FULL (radio buttons)
   - Expiration: Never (default) / Custom date (date picker)
5. PM selects options
6. PM clicks "Generate"
7. System generates secure random token (32+ chars)
8. System creates PROJECT_SHARE_LINK record
9. System shows success modal with **copyable link**:
   - `https://sira.com/portal/{token}`
   - Copy button
   - QR code (for mobile share)
10. PM copies link and sends to customer

**UI Screens**:

| Screen | Wireframe | Description |
|--------|-----------|-------------|
| Portal Management | `05_Portal_Management.png` | List of links + generate button |
| Generate Modal | `05_Portal_Generate.png` | Options modal |
| Success Modal | `05_Portal_Success.png` | Link + copy + QR |

**Acceptance Criteria**:

- [ ] AC-01: Token is cryptographically secure (min 32 chars)
- [ ] AC-02: Copy button copies link to clipboard with visual feedback
- [ ] AC-03: QR code scannable by mobile devices
- [ ] AC-04: PM can generate multiple links (e.g., BASIC for progress, FULL for finance)

---

### UC-PM-14: Create Payment Milestone

**Actor**: PM

**Precondition**: 
- PM is on project detail page
- Project has contract with total_value > 0

**Main Flow**:

1. PM clicks "Financials" tab
2. PM clicks "Add Milestone" button
3. System shows milestone form:
   - Milestone Type: DEPOSIT / ADVANCE / ACCEPTANCE / FINAL (dropdown)
   - Percentage (%) of contract value (number input, 0-100)
   - Amount (VND) - **auto-calculated** from percentage
   - Due Date (date picker)
   - Note (textarea, optional)
4. PM fills form (e.g., Type=DEPOSIT, Percentage=30%)
5. System auto-calculates amount = contract_value * 30%
6. PM sets due date
7. PM clicks "Save"
8. System validates: sum of all milestone % <= 100%
9. System creates PAYMENT_MILESTONE record with status = PENDING
10. System shows success message
11. System updates financials tab with new milestone

**Alternative Flows**:

**AF-01: Manual Amount Entry**
- 5a. If PM manually changes amount:
  - System recalculates percentage = (amount / contract_value) * 100
  - Resume at step 7

**Exception Flows**:

**EF-01: Exceeds 100%**
- 8. If sum of milestones > 100%:
  - System shows error: "Total milestones cannot exceed 100% (currently: X%)"
  - PM adjusts percentage
  - Resume at step 7

**UI Screens**:

| Screen | Wireframe | Description |
|--------|-----------|-------------|
| Financials Tab | `06_Financials_Tab.png` | Milestones table + Add button |
| Add Milestone | `06_Add_Milestone.png` | Milestone form |

**Acceptance Criteria**:

- [ ] AC-01: Amount auto-calculates from percentage
- [ ] AC-02: Percentage auto-recalculates if amount manually changed
- [ ] AC-03: Validation prevents total > 100%
- [ ] AC-04: Due date defaults to +30 days from today

---

## 5. USER STORIES & EPICS

### Epic 1: Project Creation & Management

**Goal**: As PM, I want to efficiently create and manage projects for both internal and outsource scenarios

**Value**: Reduce project setup time by 60%, eliminate errors from manual entry

**Dependencies**: Requires Customer, Contract, Outsource Company to exist first

---

#### Story 1.1: Create Internal Project

**User Story**: As PM, I can create an internal project in < 2 minutes so that I can quickly start execution

**Acceptance Criteria**:

- [ ] AC-01: Given I'm on project list, when I click "Create Project", then form loads within 500ms
- [ ] AC-02: Given I select customer, when customer loads, then contract dropdown auto-filters by customer
- [ ] AC-03: Given I leave project code blank, when I save, then system auto-generates code PRJ-YYYY-XXX
- [ ] AC-04: Given all required fields filled, when I click Save, then project creates within 1s

**UI Tasks**:

- [ ] Task 1.1.1: Create project form component with validation
- [ ] Task 1.1.2: Integrate customer/contract dropdowns with API
- [ ] Task 1.1.3: Implement project code auto-generation logic
- [ ] Task 1.1.4: Add GPS map picker for coordinates
- [ ] Task 1.1.5: Mobile responsive form (stacked fields)

**Story Points**: 5

---

#### Story 1.2: Create Outsource Project

**User Story**: As PM, I can create an outsource project and assign outsource team so that I can scale to large projects

**Acceptance Criteria**:

- [ ] AC-01: Given I select project_type=OUTSOURCE, when form updates, then show outsource company, supervisor, leader fields
- [ ] AC-02: Given I select outsource company, when leaders load, then leader dropdown filtered by company
- [ ] AC-03: Given I save outsource project, when successful, then Supervisor and Outsource Leader receive notifications

**UI Tasks**:

- [ ] Task 1.2.1: Add conditional fields for outsource scenario
- [ ] Task 1.2.2: Implement leader filtering logic
- [ ] Task 1.2.3: Add notification trigger on save

**Story Points**: 3

---

#### Story 1.3: Edit Project Details

**User Story**: As PM, I can edit project details anytime so that I can adapt to changes

**Acceptance Criteria**:

- [ ] AC-01: Given I'm on project detail, when I click "Edit", then form pre-fills with current values
- [ ] AC-02: Given I change project type INTERNAL↔OUTSOURCE, when I save, then fields update accordingly
- [ ] AC-03: Given I edit project, when I save, then audit log records change

**UI Tasks**:

- [ ] Task 1.3.1: Pre-fill form with current project data
- [ ] Task 1.3.2: Handle project type switching
- [ ] Task 1.3.3: Create audit log integration

**Story Points**: 3

---

### Epic 2: Evidence Management

**Goal**: As PM, I want to efficiently review evidence so that quality is ensured before customer acceptance

---

#### Story 2.1: View Evidence Gallery

**User Story**: As PM, I can view all project evidence in an organized gallery so that I can quickly assess progress

**Acceptance Criteria**:

- [ ] AC-01: Given project has 100 images, when I open gallery, then page loads within 2s
- [ ] AC-02: Given I scroll gallery, when new images appear, then lazy-load thumbnails
- [ ] AC-03: Given I filter by stage=BEFORE, when I apply filter, then only BEFORE evidence shows

**UI Tasks**:

- [ ] Task 2.1.1: Create responsive image grid component
- [ ] Task 2.1.2: Implement lazy loading for thumbnails
- [ ] Task 2.1.3: Add stage/status filters
- [ ] Task 2.1.4: Integrate with FILE_STORAGE API

**Story Points**: 5

---

#### Story 2.2: Approve/Reject Evidence

**User Story**: As PM, I can approve or reject evidence with feedback so that quality standards are maintained

**Acceptance Criteria**:

- [ ] AC-01: Given evidence is UPLOADED, when I click Approve, then status updates to APPROVED within 500ms
- [ ] AC-02: Given I click Reject, when I enter reason < 10 chars, then show validation error
- [ ] AC-03: Given I reject evidence, when saved, then uploader receives notification with reason

**UI Tasks**:

- [ ] Task 2.2.1: Create approve/reject button UI
- [ ] Task 2.2.2: Add rejection reason modal with validation
- [ ] Task 2.2.3: Integrate with notification API

**Story Points**: 3

---

### Epic 3: Customer Portal

**Goal**: As PM, I want to provide customers self-service access so that I reduce time spent answering inquiries

---

#### Story 3.1: Generate Portal Link

**(Full story captured in UC-PM-11)**

**Story Points**: 5

---

### Epic 4: Financial Tracking

**Goal**: As PM, I want to track payment milestones and profitability so that I can manage cash flow

---

#### Story 4.1: Create Payment Milestones

**(Full story captured in UC-PM-14)**

**Story Points**: 3

---

#### Story 4.2: View Project Profit/Loss

**User Story**: As PM, I can see real-time P&L for each project so that I know if the project is profitable

**Acceptance Criteria**:

- [ ] AC-01: Given I open Financials tab, when data loads, then show: Total Revenue, Total Cost, Profit/Loss
- [ ] AC-02: Given project is in progress, when costs update, then P&L recalculates in real-time
- [ ] AC-03: Given profit is negative, when displayed, then show in red with warning icon

**UI Tasks**:

- [ ] Task 4.2.1: Create P&L summary card component
- [ ] Task 4.2.2: Integrate with revenue/cost calculation API
- [ ] Task 4.2.3: Add visual indicators (green/red)

**Story Points**: 3

---

## 6. UI/UX SPECIFICATIONS

### 6.1 Color Scheme

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary | Blue | #1890ff | Primary buttons, active links, PM branding |
| Success | Green | #52c41a | Approved status, success messages |
| Warning | Orange | #faad14 | Pending status, warnings |
| Error | Red | #ff4d4f | Rejected status, errors, overdue |
| Info | Light Blue | #1890ff | Informational messages |
| Text Primary | Dark Gray | #262626 | Main text, headings |
| Text Secondary | Gray | #8c8c8c | Helper text, captions |
| Background | White | #ffffff | Main background |
| Background Alt | Light Gray | #fafafa | Cards, panels |
| Border | Light Gray | #d9d9d9 | Dividers, borders |

### 6.2 Typography

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| H1 | Inter | 32px | 600 | 1.2 | Page titles |
| H2 | Inter | 24px | 600 | 1.3 | Section headers |
| H3 | Inter | 20px | 600 | 1.4 | Subsection headers |
| H4 | Inter | 16px | 600 | 1.5 | Card titles |
| Body  | Inter | 14px | 400 | 1.5 | Main text |
| Caption | Inter | 12px | 400 | 1.5 | Hints, labels |
| Button | Inter | 14px | 500 | 1 | Button text |

### 6.3 Spacing

| Space | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon padding, tight spacing |
| sm | 8px | Form label margin, button padding |
| md | 16px | Default card padding, grid gap |
| lg | 24px | Section spacing |
| xl | 32px | Page padding, large gaps |
| xxl | 48px | Major section breaks |

### 6.4 Component Library (PM-specific)

**Project Status Badge**:
- DRAFT: Gray
- SCHEDULED: Blue
- IN_PROGRESS: Orange
- AWAITING_APPROVAL: Purple
- COMPLETED: Green
- CLOSED: Dark Gray
- CANCELLED: Red

**Evidence Status Badge**:
- UPLOADED: Orange (⏳)
- APPROVED: Green (✓)
- REJECTED: Red (✗)

**Payment Status Badge**:
- PENDING: Orange (⏳)
- PAID: Green (✓)
- OVERDUE: Red (!)

**Data Table** (for project list, customer list, etc.):
- Sortable columns (click header)
- Search box (global filter)
- Pagination (10/20/50 rows per page)
- Row actions dropdown (Edit, Delete, View)

**Stat Card** (for dashboard KPIs):
- Large number (main metric)
- Trend indicator (▲ +10% or ▼ -5%)
- Color coding (green = good, red = bad)
- Click to drill-down

---

## 7. PERFORMANCE REQUIREMENTS

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Dashboard Load** | < 2s | Time to interactive (with all widgets) |
| **Project List** | < 1s | Initial load for 100 projects |
| **Create Project** | < 1s | Form submit to success |
| **Evidence Gallery** | < 2s | Load 100 thumbnails |
| **Report Export** | < 5s | Excel export with 1000 rows |

---

**Version**: 1.0  
**Date**: 2026-02-12  
**Status**: Draft
