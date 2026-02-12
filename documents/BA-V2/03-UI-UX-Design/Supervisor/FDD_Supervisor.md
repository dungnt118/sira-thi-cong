# 💼 FUNCTIONAL DESIGN DOCUMENT - Supervisor

**SIRA Service Management Platform**  
**Role:** Supervisor (Giám sát viên)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. ROLE OVERVIEW

### 1.1 Vai Trò và Trách Nhiệm

**Supervisor** là người giám sát chất lượng và tiến độ thi công, được PM assign để giám sát nhiều dự án cùng lúc:

**Trách nhiệm chính:**
- ✅ Giám sát nhiều dự án (multi-project oversight)
- ✅ Review và approve/reject evidence từ Outsource Leaders
- ✅ Approve material variance > 20%
- ✅ Conduct field inspections và quality checks
- ✅ Monitor OL và staff performance
- ✅ Track quality issues và resolution
- ✅ Generate progress reports cho PM
- ✅ Analyze project analytics và trends
- ✅ Chat/communication với PM, OL, Staff

**Không có quyền:**
- ❌ Tạo dự án mới
- ❌ Tạo/sửa hợp đồng
- ❌ Quản lý khách hàng
- ❌ Approve payment (chỉ PM/Accountant)
- ❌ Assign Outsource Leader (chỉ PM)
- ❌ Xem tài chính chi tiết (revenue/profit)

### 1.2 User Profile

**Đặc điểm người dùng:**
- Làm việc chủ yếu tại văn phòng (desktop) và công trường (mobile)
- Cần xem overview nhiều dự án cùng lúc
- Review và approve hàng loạt evidence mỗi ngày
- Cần data visualization và analytics
- Cần batch actions để tăng hiệu suất
- Cần export reports (PDF/Excel)

**Device:**
- Primary: Desktop (1920x1080, 1366x768)
- Secondary: Tablet (iPad Pro)
- Tertiary: Mobile (field inspections)

### 1.3 Permission Matrix

| Function | Supervisor | PM | Outsource Leader |
|----------|-----------|-----|------------------|
| Xem nhiều dự án | ✅ (assigned) | ✅ (all) | ❌ (own only) |
| Tạo dự án | ❌ | ✅ | ❌ |
| Upload evidence | ✅ | ✅ | ✅ |
| Approve evidence | ✅ | ✅ | ❌ |
| Batch approve evidence | ✅ | ✅ | ❌ |
| Approve material variance | ✅ (>20%) | ✅ (all) | ❌ |
| Conduct inspection | ✅ | ✅ | ❌ |
| Track quality issues | ✅ | ✅ | ❌ |
| Monitor OL performance | ✅ | ✅ | ❌ |
| Generate reports | ✅ | ✅ | ❌ |
| View analytics | ✅ | ✅ | ❌ |
| Xem tài chính | ❌ | ✅ | ✅ (payment only) |
| Chat | ✅ | ✅ | ✅ |

---

## 2. USE CASES

### UC-SUP-01: Xem Dashboard Tổng Quan Multi-Project

**Actor:** Supervisor  
**Precondition:** Supervisor đã login, đã được assign vào ít nhất 1 dự án  

**Main Flow:**
1. Supervisor login vào system
2. System hiển thị desktop dashboard với:
   - **KPI Cards:**
     - Total projects assigned
     - Pending evidence reviews
     - Quality issues open
     - Projects at risk
   - **Charts:**
     - Project progress chart (bar chart)
     - Evidence approval rate (pie chart)
     - Quality score trend (line chart)
   - **Project List Widget:**
     - Active projects với status
     - Sort by priority/deadline
   - **Recent Activities:**
     - Latest evidence uploads
     - Recent approvals/rejections
     - New quality issues
   - **Alerts:**
     - Overdue evidence reviews
     - Projects behind schedule
     - Critical quality issues
3. Supervisor có thể:
   - Click vào KPI card → Navigate to detail view
   - Click vào project → Open project detail
   - Click vào alert → Navigate to related item
   - Filter by date range (Today/Week/Month)
4. System auto-refresh data every 5 minutes

**Alternative Flow 2a:** Không có dự án nào
- System hiển thị empty state
- Message: "Chưa có dự án nào được assign"
- Suggest: "Liên hệ PM để được assign dự án"

**Alternative Flow 3a:** Mobile view
- System hiển thị simplified dashboard
- Stacked cards thay vì grid layout
- Charts simplified (chỉ hiển thị key metrics)

**Postcondition:** Supervisor xem được overview của tất cả dự án assigned

---

### UC-SUP-02: Xem Danh Sách Dự Án Được Assign

**Actor:** Supervisor  
**Precondition:** Supervisor đã login, đã được assign vào ít nhất 1 dự án  

**Main Flow:**
1. Supervisor click menu "Projects"
2. System hiển thị project list table với columns:
   - Project code
   - Project name
   - Location (District, Province)
   - Outsource Leader
   - Status (Draft/Scheduled/In Progress/Completed)
   - Progress (%)
   - Quality score (0-100)
   - Pending reviews (count)
   - Last updated
   - Actions (View/Inspect)
3. Supervisor có thể:
   - **Filter:**
     - Status: All/Active/Completed
     - Province/District
     - Outsource company
     - Quality score range
     - Has pending reviews
   - **Sort:**
     - By progress (ascending/descending)
     - By quality score
     - By last updated
     - By deadline
   - **Search:**
     - By project code/name
     - By OL name
4. Supervisor click "View" button
5. System navigate to project detail page

**Alternative Flow 3a:** Export list
- Supervisor click "Export" button
- System generate Excel file với filtered data
- System download file

**Postcondition:** Supervisor xem được danh sách dự án assigned

---

### UC-SUP-03: Review Evidence Queue

**Actor:** Supervisor  
**Precondition:** Có evidence pending review  

**Main Flow:**
1. Supervisor click menu "Evidence Queue"
2. System hiển thị evidence queue table với:
   - Thumbnail
   - Project code/name
   - Uploaded by (OL name)
   - Stage (BEFORE/DURING/AFTER)
   - Upload date/time
   - GPS location (if available)
   - Status (Pending/Approved/Rejected)
   - Actions (Review/Approve/Reject)
3. System highlight:
   - Overdue reviews (red badge)
   - High priority projects (yellow badge)
4. Supervisor có thể:
   - **Filter:**
     - Status: Pending/All
     - Stage: BEFORE/DURING/AFTER
     - Project
     - Date range
     - Has GPS / No GPS
   - **Sort:**
     - By upload date (oldest first - default)
     - By project priority
   - **Batch select:**
     - Select multiple evidence
     - Batch approve/reject
5. Supervisor click "Review" button
6. System open evidence review detail (UC-SUP-04)

**Alternative Flow 2a:** Không có pending evidence
- System hiển thị empty state
- Message: "Không có evidence nào cần review"
- Show recently approved evidence (last 10)

**Alternative Flow 5a:** Quick approve
- Supervisor click "Approve" button directly
- System confirm "Approve without detailed review?"
- Supervisor confirm
- System approve evidence
- System gửi notification cho OL

**Postcondition:** Supervisor xem được evidence queue

---

### UC-SUP-04: Review và Approve/Reject Evidence

**Actor:** Supervisor  
**Precondition:** Có evidence pending review  

**Main Flow:**
1. Supervisor click "Review" trên evidence item
2. System hiển thị full-screen evidence review interface:
   - **Left Panel (60%):**
     - Large image/video viewer
     - Zoom controls (+/-)
     - Rotate controls
     - Pan/drag support
     - Navigation arrows (prev/next)
   - **Right Panel (40%):**
     - Project info (code, name, location)
     - Uploaded by (OL name, avatar)
     - Upload date/time
     - Stage (BEFORE/DURING/AFTER)
     - GPS coordinates (if available)
       - Show on mini map
       - "Open in Google Maps" link
     - Note from OL (if any)
     - **Comparison section:**
       - Planned photo (if available)
       - Side-by-side view toggle
     - **Review form:**
       - Quality score (1-5 stars)
       - Feedback field (optional for approve, required for reject)
       - Approve/Reject buttons
3. Supervisor review image/video:
   - Zoom in để xem chi tiết
   - Check quality (clear, well-lit, complete coverage)
   - Verify GPS location (if required)
   - Compare với planned photo (if available)
4. Supervisor rate quality (1-5 stars)
5. Supervisor chọn action:
   - **Option A:** Approve
   - **Option B:** Reject
6. Nếu Option A (Approve):
   - Supervisor có thể nhập feedback (optional)
   - Supervisor click "Approve"
   - System validate: Quality score required
   - System update evidence status = Approved
   - System gửi notification cho OL: "Evidence approved"
   - System navigate to next pending evidence (if any)
7. Nếu Option B (Reject):
   - Supervisor MUST nhập feedback (reason for rejection)
   - Supervisor click "Reject"
   - System validate: Feedback required
   - System update evidence status = Rejected
   - System gửi notification cho OL: "Evidence rejected - {feedback}"
   - System navigate to next pending evidence (if any)

**Alternative Flow 3a:** Video evidence
- System hiển thị video player
- Play/pause controls
- Timeline scrubber
- Playback speed control (0.5x, 1x, 2x)

**Alternative Flow 3b:** GPS not available
- System show warning "GPS location not available"
- Supervisor có thể:
   - Approve anyway (if not critical)
   - Reject với feedback "Please re-upload with GPS"

**Alternative Flow 6a:** Keyboard shortcuts (desktop)
- Press "A" → Approve
- Press "R" → Reject
- Press "→" → Next evidence
- Press "←" → Previous evidence
- Press "Esc" → Close review

**Exception Flow 7a:** Feedback empty khi reject
- System error "Feedback required for rejection"
- Highlight feedback field
- Prevent submit

**Postcondition:** Evidence được approve/reject, OL nhận notification

---

### UC-SUP-05: Batch Approve Evidence

**Actor:** Supervisor  
**Precondition:** Có nhiều evidence pending review  

**Main Flow:**
1. Supervisor mở Evidence Queue
2. Supervisor select multiple evidence items (checkbox)
3. System hiển thị batch action bar:
   - Selected count: "X items selected"
   - Batch approve button
   - Batch reject button (disabled - require individual feedback)
   - Clear selection button
4. Supervisor click "Batch Approve"
5. System hiển thị confirmation modal:
   - List of selected evidence (thumbnails)
   - Project names
   - Total count
   - Warning: "Approve all without detailed review?"
   - Optional: Default quality score (3 stars)
   - Optional: Batch feedback (apply to all)
   - Confirm/Cancel buttons
6. Supervisor review list
7. Supervisor có thể:
   - Set default quality score
   - Enter batch feedback (optional)
8. Supervisor click "Confirm"
9. System validate:
   - All items still pending (not approved by another supervisor)
10. System batch update:
    - Set status = Approved
    - Set quality_score = default score
    - Set feedback = batch feedback (if any)
    - Set approved_by = Supervisor user_id
    - Set approved_at = current timestamp
11. System gửi notifications:
    - Group by OL
    - Send 1 notification per OL: "X evidence approved"
12. System show success message: "X evidence approved successfully"
13. System refresh evidence queue

**Alternative Flow 9a:** Some items already approved
- System filter out already approved items
- System show warning: "X items already approved, will approve Y items"
- Supervisor confirm
- System proceed với remaining items

**Alternative Flow 9b:** All items already approved
- System error "All selected items already approved"
- System clear selection

**Business Rule:**
- Batch reject NOT allowed (require individual feedback)
- Max 50 items per batch
- Batch approve recommended for routine evidence only

**Postcondition:** Multiple evidence được approve, OLs nhận notifications

---

### UC-SUP-06: Approve Material Variance > 20%

**Actor:** Supervisor  
**Precondition:** OL đã confirm material với variance > 20%  

**Main Flow:**
1. Supervisor nhận notification: "Material variance > 20% requires approval"
2. Supervisor click notification hoặc navigate to "Material Approvals"
3. System hiển thị material approval queue table:
   - Project code/name
   - Material name
   - Planned quantity
   - Actual quantity
   - Variance (%)
   - Reason (from OL)
   - Requested by (OL name)
   - Request date
   - Status (Pending/Approved/Rejected)
   - Actions (Review/Approve/Reject)
4. Supervisor click "Review"
5. System hiển thị variance review modal:
   - **Material Details:**
     - Material name
     - Unit
     - Planned quantity
     - Actual quantity
     - Variance: +X% (highlighted red if > 30%)
   - **Project Context:**
     - Project code/name
     - Location
     - Current progress (%)
   - **OL Explanation:**
     - Reason for variance (from OL)
     - Note
   - **Historical Data:**
     - Average variance for this material (across projects)
     - Previous approvals/rejections
   - **Review Form:**
     - Approve/Reject buttons
     - Feedback field (optional for approve, required for reject)
6. Supervisor analyze:
   - Check reason validity
   - Compare với historical data
   - Consider project context
7. Supervisor chọn action:
   - **Option A:** Approve
   - **Option B:** Reject
8. Nếu Option A (Approve):
   - Supervisor có thể nhập feedback (optional)
   - Supervisor click "Approve"
   - System update material_usage.status = Approved
   - System gửi notification cho OL: "Material variance approved"
   - System gửi notification cho PM: "Material variance approved by Supervisor"
9. Nếu Option B (Reject):
   - Supervisor MUST nhập feedback (reason)
   - Supervisor click "Reject"
   - System validate: Feedback required
   - System update material_usage.status = Rejected
   - System gửi notification cho OL: "Material variance rejected - {feedback}"
   - System require OL to revise actual quantity

**Alternative Flow 6a:** Variance > 50%
- System show critical warning
- Suggest: "Contact PM before approval"
- Supervisor có thể:
   - Approve với note
   - Reject
   - Escalate to PM

**Business Rule:**
- Variance ≤ 20%: Auto-approved (không cần Supervisor)
- Variance > 20% và ≤ 50%: Supervisor approval
- Variance > 50%: Recommend PM approval

**Postcondition:** Material variance được approve/reject, OL và PM nhận notifications

---

### UC-SUP-07: Conduct Field Inspection

**Actor:** Supervisor  
**Precondition:** Supervisor đã được assign vào dự án  

**Main Flow:**
1. Supervisor navigate to project detail
2. Supervisor click "Conduct Inspection" button
3. System hiển thị inspection form:
   - **Project Info:**
     - Project code/name
     - Location
     - Current progress (%)
     - OL name
   - **Inspection Checklist:**
     - Pre-defined checklist items (from template)
     - Each item có:
       - Description
       - Status: Pass/Fail/N/A
       - Note field
       - Photo upload (optional)
   - **Overall Assessment:**
     - Quality score (0-100)
     - Issues found (count)
     - Recommendations
   - **Photos:**
     - Upload inspection photos
     - Camera integration (mobile)
     - GPS auto-tag
4. Supervisor conduct inspection:
   - Go through checklist items
   - Mark Pass/Fail/N/A
   - Add notes for failed items
   - Upload photos as evidence
5. Supervisor rate overall quality (0-100)
6. Supervisor nhập recommendations (if any)
7. Supervisor click "Submit Inspection"
8. System validate:
   - All checklist items reviewed
   - Quality score entered
   - Photos uploaded (recommended)
9. System save inspection report
10. System update project.quality_score = inspection score
11. System gửi notifications:
    - PM: "Inspection completed - Quality score: X"
    - OL: "Inspection completed - X issues found"
12. Nếu có failed items:
    - System auto-create quality issues (UC-SUP-08)
    - System assign issues to OL

**Alternative Flow 4a:** Mobile inspection
- System hiển thị mobile-optimized checklist
- Camera quick access button
- GPS auto-capture
- Offline support (save locally, sync later)

**Alternative Flow 12a:** Critical issues found
- System highlight critical issues
- System require immediate action plan
- System notify PM immediately

**Postcondition:** Inspection report được lưu, quality issues được tạo (nếu có)

---

### UC-SUP-08: Track Quality Issues

**Actor:** Supervisor  
**Precondition:** Supervisor đã login  

**Main Flow:**
1. Supervisor click menu "Quality Issues"
2. System hiển thị issue tracking table:
   - Issue ID
   - Project code/name
   - Issue type (Safety/Quality/Material/Other)
   - Severity (Low/Medium/High/Critical)
   - Description
   - Assigned to (OL/Staff)
   - Status (Open/In Progress/Resolved/Closed)
   - Created date
   - Due date
   - Actions (View/Update/Close)
3. Supervisor có thể:
   - **Filter:**
     - Status: Open/All
     - Severity: All/Critical/High
     - Project
     - Assigned to
   - **Sort:**
     - By severity (critical first)
     - By due date
     - By created date
   - **Create new issue:**
     - Click "Create Issue" button
4. Supervisor click "View" trên issue
5. System hiển thị issue detail modal:
   - Issue info (type, severity, description)
   - Project context
   - Assigned to
   - Status history
   - Photos (if any)
   - Comments/updates
   - Resolution (if resolved)
6. Supervisor có thể:
   - Update status
   - Add comment
   - Upload photo
   - Change severity
   - Reassign to another person
   - Set due date
   - Close issue (if resolved)
7. Supervisor update issue
8. System save changes
9. System gửi notification cho assigned person

**Alternative Flow 4a:** Create new issue manually
- Supervisor click "Create Issue"
- System hiển thị issue form:
   - Project (dropdown)
   - Issue type (dropdown)
   - Severity (dropdown)
   - Description (textarea)
   - Assign to (dropdown - OL/Staff)
   - Due date (datepicker)
   - Photos (upload)
- Supervisor fill form
- Supervisor click "Create"
- System validate
- System create issue
- System notify assigned person

**Alternative Flow 7a:** Close issue
- Supervisor verify issue resolved
- Supervisor click "Close Issue"
- System require resolution note
- Supervisor nhập resolution
- System update status = Closed
- System notify OL và PM

**Postcondition:** Quality issues được track và update

---

### UC-SUP-09: Monitor OL Performance

**Actor:** Supervisor  
**Precondition:** Supervisor đã login, có OLs assigned  

**Main Flow:**
1. Supervisor click menu "Team Performance"
2. System hiển thị OL performance dashboard:
   - **OL List Table:**
     - OL name/company
     - Active projects (count)
     - Avg quality score (0-100)
     - Evidence approval rate (%)
     - On-time completion rate (%)
     - Issues count (open/total)
     - Last active
     - Actions (View Details)
   - **Performance Charts:**
     - Quality score trend (line chart)
     - Evidence approval rate comparison (bar chart)
     - Project completion timeline
3. Supervisor có thể:
   - Filter by company
   - Filter by date range
   - Sort by quality score
   - Export report
4. Supervisor click "View Details" trên OL
5. System hiển thị OL detail page:
   - **Profile:**
     - Name, company
     - Contact info
     - Service areas
   - **Projects:**
     - List of assigned projects
     - Status, progress
   - **Performance Metrics:**
     - Quality score history (chart)
     - Evidence stats (uploaded/approved/rejected)
     - Material variance stats
     - Issue resolution rate
   - **Recent Activities:**
     - Latest evidence uploads
     - Latest progress updates
     - Recent issues
6. Supervisor analyze performance
7. Supervisor có thể:
   - Export OL performance report
   - Add performance note
   - Flag for PM review (if poor performance)

**Alternative Flow 7a:** Poor performance detected
- System auto-flag OLs với:
   - Quality score < 60
   - Evidence rejection rate > 30%
   - Multiple overdue issues
- System suggest: "Review with PM"

**Postcondition:** Supervisor xem được OL performance metrics

---

### UC-SUP-10: Monitor Staff Attendance

**Actor:** Supervisor  
**Precondition:** Supervisor đã login  

**Main Flow:**
1. Supervisor click menu "Staff Attendance"
2. System hiển thị attendance dashboard:
   - **Summary Cards:**
     - Total staff assigned
     - Present today
     - Absent today
     - Attendance rate (%)
   - **Attendance Table:**
     - Staff name
     - Project
     - Shift (FULL/AM/PM)
     - Status (Present/Absent/Late)
     - Check-in time
     - Check-out time
     - Hours worked
     - Absence reason (if absent)
   - **Calendar View:**
     - Month calendar
     - Color-coded attendance
3. Supervisor có thể:
   - Filter by project
   - Filter by date range
   - Filter by status (Present/Absent)
   - Switch view (Table/Calendar)
   - Export attendance report
4. Supervisor click vào staff
5. System hiển thị staff attendance detail:
   - Attendance history (last 30 days)
   - Attendance rate (%)
   - Total days worked
   - Total absences
   - Absence reasons breakdown
   - Late arrivals count
6. Supervisor review attendance
7. Supervisor có thể:
   - Export staff attendance report
   - Add attendance note
   - Flag attendance issues

**Alternative Flow 2a:** Mobile view
- System hiển thị simplified attendance list
- Quick filters (Today/This Week)
- Swipe to view details

**Postcondition:** Supervisor xem được staff attendance

---

### UC-SUP-11: Generate Progress Report

**Actor:** Supervisor  
**Precondition:** Supervisor đã login, có projects assigned  

**Main Flow:**
1. Supervisor click menu "Reports"
2. Supervisor click "Generate Progress Report"
3. System hiển thị report configuration form:
   - **Report Type:**
     - Weekly progress report
     - Monthly summary report
     - Custom report
   - **Filters:**
     - Projects (multi-select)
     - Date range
     - Include sections:
       - ☑ Project progress
       - ☑ Evidence summary
       - ☑ Quality issues
       - ☑ Material variance
       - ☑ Team performance
   - **Format:**
     - PDF
     - Excel
     - Both
4. Supervisor configure report:
   - Select projects (or "All assigned")
   - Select date range
   - Select sections to include
   - Select format
5. Supervisor click "Generate Report"
6. System validate configuration
7. System generate report:
   - Fetch data from DB
   - Calculate metrics
   - Generate charts
   - Format document
8. System hiển thị report preview:
   - **Cover Page:**
     - Report title
     - Date range
     - Generated by (Supervisor name)
     - Generated date
   - **Executive Summary:**
     - Total projects
     - Overall progress (%)
     - Quality score average
     - Issues summary
   - **Project Details:** (for each project)
     - Project info
     - Progress (%)
     - Evidence stats
     - Quality issues
     - Material variance
   - **Charts:**
     - Progress trend
     - Quality score comparison
     - Issue distribution
9. Supervisor review preview
10. Supervisor click "Download" hoặc "Email"
11. Nếu Download:
    - System generate file
    - System download to device
12. Nếu Email:
    - System show email form
    - Supervisor nhập recipients (PM, management)
    - Supervisor click "Send"
    - System send email với attachment

**Alternative Flow 7a:** Large report (> 100 pages)
- System show warning "Large report, may take time"
- System generate in background
- System notify khi complete
- System provide download link

**Alternative Flow 9a:** Schedule recurring report
- Supervisor click "Schedule Report"
- System show schedule form:
   - Frequency (Weekly/Monthly)
   - Day of week/month
   - Recipients
   - Auto-send enabled
- Supervisor configure
- System save schedule
- System auto-generate và send theo schedule

**Postcondition:** Progress report được generate và download/email

---

### UC-SUP-12: View Analytics Dashboard

**Actor:** Supervisor  
**Precondition:** Supervisor đã login, có projects assigned  

**Main Flow:**
1. Supervisor click menu "Analytics"
2. System hiển thị analytics dashboard với:
   - **Time Range Selector:**
     - This week / This month / Last 3 months / Custom
   - **KPI Cards:**
     - Total projects
     - Avg progress (%)
     - Avg quality score
     - Total issues (open/closed)
     - Evidence approval rate (%)
   - **Charts:**
     - **Project Progress Trend (Line Chart):**
       - X-axis: Time
       - Y-axis: Avg progress (%)
       - Multiple lines (by project or overall)
     - **Quality Score Distribution (Bar Chart):**
       - X-axis: Score range (0-20, 21-40, ..., 81-100)
       - Y-axis: Project count
     - **Evidence Approval Rate (Pie Chart):**
       - Approved (%)
       - Rejected (%)
       - Pending (%)
     - **Issue Status (Donut Chart):**
       - Open
       - In Progress
       - Resolved
       - Closed
     - **Material Variance Trend (Line Chart):**
       - X-axis: Time
       - Y-axis: Avg variance (%)
     - **Top Issues by Type (Bar Chart):**
       - X-axis: Issue type
       - Y-axis: Count
3. Supervisor có thể:
   - Change time range
   - Filter by project
   - Drill down vào chart (click to see details)
   - Export chart as image
   - Export data as Excel
4. Supervisor click vào chart
5. System hiển thị drill-down detail:
   - Data table
   - Detailed breakdown
   - Related items
6. Supervisor analyze trends
7. Supervisor có thể:
   - Add to report
   - Share with PM
   - Set alert threshold

**Alternative Flow 7a:** Set alert threshold
- Supervisor click "Set Alert"
- System show alert form:
   - Metric (Quality score / Approval rate / etc.)
   - Condition (< / > / =)
   - Threshold value
   - Notification method (Email/Push)
- Supervisor configure
- System save alert
- System monitor và notify khi threshold reached

**Postcondition:** Supervisor xem được analytics và insights

---

### UC-SUP-13: Chat Với PM/OL/Staff

**Actor:** Supervisor  
**Precondition:** Supervisor đã được assign vào dự án  

**Main Flow:**
1. Supervisor mở project detail
2. Supervisor click tab "Chat"
3. System hiển thị chat interface:
   - **Participants List:**
     - PM (avatar, online status)
     - Supervisor(s) (avatar, online status)
     - OL (avatar, online status)
     - Assigned staff (avatars)
   - **Message List:**
     - Scrollable message history
     - Grouped by date
     - Each message shows:
       - Sender avatar
       - Sender name/role
       - Message content
       - Timestamp
       - Read status (✓✓)
   - **Input Area:**
     - Text input field
     - Attach file button
     - Emoji button
     - Send button
4. Supervisor nhập message
5. Supervisor có thể:
   - **Option A:** Send text message
   - **Option B:** Attach file (image/document/video)
   - **Option C:** @Mention người cụ thể
   - **Option D:** Reply to specific message
6. Nếu Option B:
   - Supervisor click attach button
   - Supervisor chọn file từ device
   - System validate file type/size (max 10MB)
   - System upload file
   - System show upload progress
7. Nếu Option C:
   - Supervisor type "@"
   - System show participant list
   - Supervisor chọn người
   - System insert @mention
8. Nếu Option D:
   - Supervisor hover over message
   - Supervisor click "Reply" icon
   - System show reply context
   - Supervisor type reply
9. Supervisor click "Send"
10. System save message to DB
11. System broadcast message (WebSocket)
12. System gửi push notification cho:
    - All participants (nếu text message)
    - @Mentioned user (nếu có @mention)
    - Original sender (nếu reply)
13. System hiển thị message trong chat
14. System update read status khi recipients view

**Alternative Flow 6a:** File quá lớn
- System error "File size exceeds 10MB"
- Suggest: "Please compress file or use Google Drive link"

**Alternative Flow 10a:** Network unavailable
- System queue message locally
- System show "Sending..." status
- System auto-send khi có network
- System show sync indicator

**Features:**
- Real-time messaging (WebSocket)
- File attachments (max 10MB)
- @Mention notifications
- Message threading (reply)
- Message search
- Pin important messages
- Create task from message
- Mark as unread
- Delete message (own messages only)

**Postcondition:** Message được gửi, participants nhận notification

---

### UC-SUP-14: Manage Notifications

**Actor:** Supervisor  
**Precondition:** Supervisor đã login  

**Main Flow:**
1. Supervisor click notification bell icon
2. System hiển thị notification panel:
   - Unread count badge
   - Filter tabs:
     - All
     - Unread
     - Projects
     - Evidence
     - Issues
     - Chat
   - Notification list (grouped by date)
3. System group notifications by type:
   - Evidence pending review (icon: 📸)
   - Material variance approval (icon: 📦)
   - Quality issue created (icon: ⚠️)
   - Chat mention (icon: 💬)
   - Project assigned (icon: 📋)
   - Inspection due (icon: 🔍)
4. Supervisor xem notification details:
   - Icon (by type)
   - Title
   - Message
   - Timestamp (relative: "2 giờ trước")
   - Read/unread indicator
   - Quick action buttons (if applicable)
5. Supervisor có thể:
   - Click notification → Navigate to related screen
   - Click quick action → Perform action without navigation
   - Swipe to dismiss (mobile)
   - Mark as read
   - Mark all as read
   - Clear all notifications
6. Supervisor click notification
7. System mark as read
8. System navigate to related screen:
   - Evidence pending → Evidence queue
   - Material variance → Material approval
   - Quality issue → Issue detail
   - Chat mention → Chat tab
   - Project assigned → Project detail

**Alternative Flow 2a:** Không có notification
- System hiển thị empty state
- Message: "Không có thông báo mới"
- Show recently read notifications (last 10)

**Alternative Flow 5a:** Quick action
- Supervisor click "Approve" button trên evidence notification
- System approve evidence without opening detail
- System update notification status
- System show success toast

**Notification Types:**

| Event | Trigger | Priority | Channel |
|-------|---------|----------|---------|
| Evidence uploaded | OL uploads | Medium | Push + In-app |
| Material variance > 20% | OL confirms | High | Push + In-app |
| Quality issue created | Auto/Manual | High | Push + In-app |
| Chat @mention | Someone @mentions | Medium | Push + In-app |
| Project assigned | PM assigns | High | Push + In-app |
| Inspection due | Scheduled | Medium | In-app |
| Evidence overdue review | 24h no review | High | Push + In-app |

**Postcondition:** Supervisor xem được notifications

---

### UC-SUP-15: Export Reports (PDF/Excel)

**Actor:** Supervisor  
**Precondition:** Supervisor đã login  

**Main Flow:**
1. Supervisor navigate to report screen (Evidence Queue/Material Approvals/Quality Issues/etc.)
2. Supervisor click "Export" button
3. System hiển thị export options modal:
   - **Format:**
     - ○ PDF
     - ○ Excel
     - ○ CSV
   - **Data Range:**
     - Current page only
     - All filtered data
     - Custom selection
   - **Columns:** (for Excel/CSV)
     - Select columns to include (checkboxes)
   - **Options:**
     - Include charts (PDF only)
     - Include summary (PDF only)
     - File name (editable)
4. Supervisor configure export:
   - Select format
   - Select data range
   - Select columns (if Excel/CSV)
   - Edit file name (optional)
5. Supervisor click "Export"
6. System validate configuration
7. System generate file:
   - Fetch data based on filters
   - Format data
   - Generate charts (if PDF)
   - Create file
8. Nếu PDF:
   - System generate PDF với:
     - Header (logo, title, date)
     - Summary section
     - Data table
     - Charts (if selected)
     - Footer (page numbers, generated by)
9. Nếu Excel:
   - System generate Excel với:
     - Sheet 1: Data table
     - Sheet 2: Summary (if selected)
     - Sheet 3: Charts (if selected)
     - Formatted headers
     - Auto-fit columns
10. Nếu CSV:
    - System generate CSV với:
      - Headers
      - Data rows
      - UTF-8 encoding
11. System download file to device
12. System show success message: "File exported successfully"

**Alternative Flow 7a:** Large dataset (> 10,000 rows)
- System show warning "Large dataset, may take time"
- System generate in background
- System show progress indicator
- System notify khi complete
- System provide download link

**Alternative Flow 11a:** Mobile device
- System show share sheet
- Supervisor có thể:
   - Save to Files
   - Share via email
   - Share via messaging app
   - Open in another app

**Business Rule:**
- Max 50,000 rows per export
- PDF max 500 pages
- File name auto-include timestamp

**Postcondition:** Report file được export và download

---

## 3. BUSINESS RULES

### 3.1 Project Rules

**BR-SUP-01:** Supervisor chỉ xem dự án được PM assign  
**BR-SUP-02:** Supervisor có thể được assign vào nhiều dự án cùng lúc  
**BR-SUP-03:** Supervisor không thể tạo/xóa dự án  
**BR-SUP-04:** Supervisor có thể được unassign khỏi dự án bởi PM  

### 3.2 Evidence Rules

**BR-SUP-05:** Supervisor approve/reject evidence từ OL  
**BR-SUP-06:** Evidence approved không thể reject lại (chỉ PM)  
**BR-SUP-07:** Evidence rejected có thể re-upload bởi OL  
**BR-SUP-08:** Batch approve max 50 items  
**BR-SUP-09:** Evidence review SLA: 24 hours (recommend)  
**BR-SUP-10:** Quality score required khi approve (1-5 stars)  

### 3.3 Material Rules

**BR-SUP-11:** Supervisor chỉ approve variance > 20%  
**BR-SUP-12:** Variance ≤ 20%: Auto-approved (không cần Supervisor)  
**BR-SUP-13:** Variance > 50%: Recommend escalate to PM  
**BR-SUP-14:** Feedback required khi reject variance  
**BR-SUP-15:** Material approval không thể undo (chỉ PM)  

### 3.4 Inspection Rules

**BR-SUP-16:** Inspection checklist từ template (configurable)  
**BR-SUP-17:** Quality score range: 0-100  
**BR-SUP-18:** Failed checklist items auto-create quality issues  
**BR-SUP-19:** Inspection photos recommended (not required)  
**BR-SUP-20:** Inspection report immutable sau khi submit  

### 3.5 Quality Issue Rules

**BR-SUP-21:** Severity levels: Low/Medium/High/Critical  
**BR-SUP-22:** Critical issues require immediate action plan  
**BR-SUP-23:** Issues assigned to OL/Staff (not PM)  
**BR-SUP-24:** Issue status: Open → In Progress → Resolved → Closed  
**BR-SUP-25:** Closed issues immutable  

### 3.6 Performance Rules

**BR-SUP-26:** Quality score calculated từ inspection + evidence quality  
**BR-SUP-27:** Evidence approval rate = Approved / (Approved + Rejected)  
**BR-SUP-28:** Poor performance threshold: Quality < 60 hoặc Approval rate < 70%  
**BR-SUP-29:** Performance metrics updated real-time  

### 3.7 Report Rules

**BR-SUP-30:** Report export max 50,000 rows  
**BR-SUP-31:** PDF report max 500 pages  
**BR-SUP-32:** Scheduled reports sent via email  
**BR-SUP-33:** Report data based on Supervisor's assigned projects only  

---

## 4. VALIDATION RULES

### 4.1 Evidence Review

| Field | Rule |
|-------|------|
| quality_score | Required, 1-5 stars |
| feedback | Optional for approve, required for reject, max 500 chars |
| status | Must be: Approved/Rejected |

### 4.2 Material Variance Approval

| Field | Rule |
|-------|------|
| variance_percent | Auto-calculated, must be > 20% |
| feedback | Optional for approve, required for reject, max 500 chars |
| status | Must be: Approved/Rejected |

### 4.3 Field Inspection

| Field | Rule |
|-------|------|
| checklist_items | All items must be reviewed (Pass/Fail/N/A) |
| quality_score | Required, 0-100, integer |
| recommendations | Optional, max 1000 chars |
| photos | Recommended, max 20 photos |

### 4.4 Quality Issue

| Field | Rule |
|-------|------|
| issue_type | Required, must be: Safety/Quality/Material/Other |
| severity | Required, must be: Low/Medium/High/Critical |
| description | Required, max 1000 chars |
| assigned_to | Required, must be OL or Staff |
| due_date | Required, must be >= today |

### 4.5 Report Generation

| Field | Rule |
|-------|------|
| report_type | Required, must be: Weekly/Monthly/Custom |
| date_range | Required, end_date >= start_date |
| projects | Required, at least 1 project selected |
| format | Required, must be: PDF/Excel/CSV |

---

## 5. STATE MACHINES

### 5.1 Evidence Review State

```
Uploaded (by OL) → Pending Review → Reviewing (by Supervisor) → Approved/Rejected
                                                                      ↓
                                                            Re-uploaded (by OL)
```

### 5.2 Material Variance Approval State

```
Confirmed (by OL, variance > 20%) → Pending Approval → Reviewing (by Supervisor) → Approved/Rejected
                                                                                          ↓
                                                                                    Revised (by OL)
```

### 5.3 Quality Issue State

```
Created → Open → In Progress → Resolved → Closed
           ↓         ↓            ↓
       Assigned  Updated      Verified
```

### 5.4 Inspection State

```
Scheduled → In Progress → Submitted → Reviewed (by PM) → Approved
                                          ↓
                                    Issues Created
```

---

## 6. DESKTOP-SPECIFIC FEATURES

### 6.1 Layout

- **Top Navigation Bar:**
  - Logo
  - Main menu (Projects/Evidence/Issues/Reports/Analytics)
  - Search bar
  - Notifications bell
  - User profile dropdown
- **Side Navigation Drawer:**
  - Quick filters
  - Saved views
  - Recent projects
  - Shortcuts
- **Main Content Area:**
  - Breadcrumbs
  - Page title
  - Action buttons (top-right)
  - Content (table/form/dashboard)
- **Footer:**
  - Copyright
  - Help link
  - Version

### 6.2 Data Tables

- Sortable columns (click header)
- Filterable columns (dropdown filters)
- Multi-select rows (checkbox)
- Batch actions toolbar
- Pagination (10/25/50/100 per page)
- Column visibility toggle
- Column reorder (drag & drop)
- Export to Excel/CSV

### 6.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Quick search |
| Ctrl+E | Evidence queue |
| Ctrl+I | Quality issues |
| Ctrl+R | Generate report |
| A | Approve (in review mode) |
| R | Reject (in review mode) |
| → | Next item |
| ← | Previous item |
| Esc | Close modal |

### 6.4 Multi-Window Support

- Open multiple projects in tabs
- Side-by-side comparison
- Drag & drop between windows
- Persistent window state

---

## 7. MOBILE-SPECIFIC FEATURES

### 7.1 Responsive Layout

- Stacked cards (thay vì grid)
- Bottom navigation (thay vì top)
- Hamburger menu
- Swipe gestures
- Pull-to-refresh
- Infinite scroll

### 7.2 Touch Gestures

- Swipe left/right (navigate evidence)
- Swipe down (dismiss notification)
- Long press (context menu)
- Pinch to zoom (images)
- Pull-to-refresh (lists)

### 7.3 Camera Integration

- Quick camera access (field inspection)
- GPS auto-tag
- Photo compression
- Batch upload
- Offline queue

### 7.4 Offline Support

**Offline-capable:**
- View cached project list
- View cached evidence queue
- Conduct inspection (save locally)
- Queue approvals
- Queue chat messages

**Sync when online:**
- Auto-upload inspection reports
- Auto-sync approvals
- Auto-send messages
- Show sync status indicator

---

## 8. NOTIFICATION DESIGN

### 8.1 Notification Types

| Event | Trigger | Channel | Priority |
|-------|---------|---------|----------|
| Evidence uploaded | OL uploads | Push + In-app | Medium |
| Material variance > 20% | OL confirms | Push + In-app | High |
| Quality issue created | Auto/Manual | Push + In-app | High |
| Chat @mention | Someone @mentions | Push + In-app | Medium |
| Project assigned | PM assigns | Push + In-app | High |
| Inspection due | Scheduled | In-app | Medium |
| Evidence overdue review | 24h no review | Push + In-app | High |
| Issue escalated | Critical issue | Push + Email | Critical |

### 8.2 Push Notification Templates

**Evidence Uploaded:**
```
Title: Evidence mới cần review
Body: {OL_name} đã upload {count} evidence tại dự án "{project_name}"
Action: Tap to review
```

**Material Variance > 20%:**
```
Title: Material variance cần approve
Body: Dự án "{project_name}" - {material_name}: Variance {variance}%
Action: Tap to review
```

**Quality Issue Created:**
```
Title: Quality issue mới
Body: [{severity}] {issue_type} tại dự án "{project_name}"
Action: Tap to view details
```

**Evidence Overdue Review:**
```
Title: Evidence chưa review
Body: {count} evidence chưa review quá 24h
Action: Tap to review now
```

---

## 9. INTEGRATION POINTS

### 9.1 With PM Role

- Receive project assignments
- Review evidence → PM sees approval status
- Approve material variance → PM notified
- Create quality issues → PM monitors
- Generate reports → PM receives
- Chat communication

### 9.2 With Outsource Leader Role

- Review OL's evidence → OL receives approval/rejection
- Approve OL's material variance → OL notified
- Assign quality issues to OL → OL resolves
- Monitor OL performance → OL sees metrics
- Chat collaboration

### 9.3 With System Services

- **Google Drive:** Evidence storage
- **GPS Service:** Inspection location tagging
- **Camera API:** Field inspection photos
- **Push Notification:** Firebase Cloud Messaging
- **WebSocket:** Real-time chat và updates
- **PDF Generator:** Report generation
- **Excel Export:** Data export

---

## 10. ANALYTICS & METRICS

### 10.1 Key Metrics

**Project Metrics:**
- Total projects assigned
- Active projects count
- Avg project progress (%)
- Avg quality score (0-100)
- Projects at risk (count)

**Evidence Metrics:**
- Total evidence reviewed
- Approval rate (%)
- Avg review time (hours)
- Pending reviews (count)
- Overdue reviews (count)

**Quality Metrics:**
- Total issues created
- Open issues (count)
- Avg resolution time (days)
- Issue distribution by type (%)
- Issue distribution by severity (%)

**Performance Metrics:**
- OL performance scores
- Staff attendance rate (%)
- Material variance trend (%)
- Inspection completion rate (%)

### 10.2 Dashboard Charts

1. **Project Progress Trend (Line Chart)**
   - X-axis: Time (days/weeks/months)
   - Y-axis: Avg progress (%)
   - Multiple lines (by project or overall)

2. **Quality Score Distribution (Bar Chart)**
   - X-axis: Score range (0-20, 21-40, ..., 81-100)
   - Y-axis: Project count
   - Color-coded (red/yellow/green)

3. **Evidence Approval Rate (Pie Chart)**
   - Approved (green)
   - Rejected (red)
   - Pending (yellow)

4. **Issue Status (Donut Chart)**
   - Open (red)
   - In Progress (yellow)
   - Resolved (blue)
   - Closed (green)

5. **Material Variance Trend (Line Chart)**
   - X-axis: Time
   - Y-axis: Avg variance (%)
   - Threshold line at 20%

---

## 11. ERROR HANDLING

### 11.1 Error Codes

| Code | Message | Action |
|------|---------|--------|
| SUP-001 | Evidence already reviewed | Refresh page |
| SUP-002 | Material variance already approved | Refresh page |
| SUP-003 | Quality issue not found | Return to list |
| SUP-004 | Inspection checklist incomplete | Complete all items |
| SUP-005 | Report generation failed | Retry or contact support |
| SUP-006 | Export file too large | Reduce data range |
| SUP-007 | Network error | Check connection and retry |
| SUP-008 | Permission denied | Contact PM |

### 11.2 Error Messages

**User-Friendly Messages:**
- "Evidence đã được review bởi Supervisor khác"
- "Material variance đã được approve"
- "Không tìm thấy quality issue"
- "Vui lòng hoàn thành tất cả checklist items"
- "Không thể generate report, vui lòng thử lại"
- "File quá lớn, vui lòng giảm data range"
- "Lỗi kết nối, vui lòng kiểm tra mạng"
- "Bạn không có quyền thực hiện action này"

---

## 12. ACCESSIBILITY

### 12.1 WCAG 2.1 Level AA Compliance

- **Keyboard Navigation:**
  - All functions accessible via keyboard
  - Tab order logical
  - Focus indicators visible
  - Keyboard shortcuts documented

- **Screen Reader Support:**
  - Semantic HTML
  - ARIA labels
  - Alt text for images
  - Form labels

- **Visual:**
  - Color contrast ratio ≥ 4.5:1
  - Text resizable up to 200%
  - No information by color alone
  - Focus indicators

- **Mobile:**
  - Touch targets ≥ 44x44px
  - Pinch to zoom enabled
  - Orientation support (portrait/landscape)

---

## 13. SECURITY & PRIVACY

### 13.1 Data Access

- Supervisor chỉ xem dự án được assign
- Không xem financial data (revenue/profit)
- Không xem customer contact info (chỉ company name)
- Audit log tất cả approvals/rejections

### 13.2 Action Logging

**Logged Actions:**
- Evidence approve/reject (who, when, feedback)
- Material variance approve/reject (who, when, feedback)
- Quality issue create/update/close (who, when, changes)
- Inspection submit (who, when, score)
- Report generate (who, when, filters)

---

## APPENDIX

### A. Glossary

| Term | Definition |
|------|------------|
| OL | Outsource Leader - Trưởng nhóm thi công |
| PM | Project Manager - Quản lý dự án |
| Evidence | Hình ảnh/video thi công (BEFORE/DURING/AFTER) |
| Variance | Chênh lệch giữa planned và actual material |
| Quality Score | Điểm chất lượng (0-100) từ inspection |
| SLA | Service Level Agreement - Thời gian xử lý |
| Batch Action | Thao tác hàng loạt (approve nhiều items) |

### B. References

- FDD_PM.md - PM role requirements
- FDD_Outsource_Leader.md - OL role requirements
- Layout_Spec_Supervisor.md - UI/UX guidelines
- User_Flows_Supervisor.md - User flow diagrams

---

**Document Status:** Complete  
**Next Steps:** Create Layout_Spec_Supervisor.md, User_Flows_Supervisor.md, Wireframes
