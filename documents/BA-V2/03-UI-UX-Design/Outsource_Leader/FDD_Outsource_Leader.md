# 📱 FUNCTIONAL DESIGN DOCUMENT - Outsource Leader

**SIRA Service Management Platform**  
**Role:** Outsource Leader (Trưởng nhóm thi công / Đại diện nhà thầu)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. ROLE OVERVIEW

### 1.1 Vai Trò và Trách Nhiệm

**Outsource Leader** là đại diện của công ty/đội outsource, được PM assign vào dự án để:

**Trách nhiệm chính:**
- ✅ Nhận và quản lý dự án được assign
- ✅ Upload evidence thi công (BEFORE/DURING/AFTER)
- ✅ Confirm vật tư thực tế sử dụng
- ✅ Quản lý team outsource (assign staff vào dự án)
- ✅ Báo cáo tiến độ thi công
- ✅ Chat/communication với PM và Supervisor
- ✅ Theo dõi payment status

**Không có quyền:**
- ❌ Tạo dự án mới
- ❌ Tạo/sửa hợp đồng
- ❌ Quản lý khách hàng
- ❌ Xem tài chính chi tiết (chỉ xem payment của mình)
- ❌ Approve evidence (chỉ upload)
- ❌ Tạo payment milestone

### 1.2 User Profile

**Đặc điểm người dùng:**
- Làm việc chủ yếu tại công trường
- Sử dụng mobile device (smartphone/tablet)
- Cần interface đơn giản, touch-friendly
- Thường xuyên upload ảnh/video từ camera
- Cần offline capability (network không ổn định tại công trường)

**Device:**
- Primary: Mobile (320px - 768px)
- Secondary: Tablet (769px - 1024px)
- Tertiary: Desktop (1025px+) - limited support

### 1.3 Permission Matrix

| Function | Outsource Leader | PM | Supervisor |
|----------|------------------|-----|------------|
| Xem dự án được assign | ✅ | ✅ | ✅ |
| Tạo dự án | ❌ | ✅ | ❌ |
| Upload evidence | ✅ | ✅ | ✅ |
| Approve evidence | ❌ | ✅ | ✅ |
| Confirm vật tư | ✅ | ✅ | ✅ |
| Nhập vật tư plan | ❌ | ✅ | ❌ |
| Assign team outsource | ✅ (chỉ company mình) | ✅ | ✅ |
| Xem tài chính | ✅ (payment status only) | ✅ (full) | ❌ |
| Chat | ✅ | ✅ | ✅ |
| Báo cáo tiến độ | ✅ | ✅ | ✅ |

---

## 2. USE CASES

### UC-OL-01: Xem Danh Sách Dự Án Được Assign

**Actor:** Outsource Leader  
**Precondition:** OL đã login, đã được PM assign vào ít nhất 1 dự án  

**Main Flow:**
1. OL mở app
2. System hiển thị dashboard với danh sách dự án
3. System filter: chỉ hiển thị dự án của company OL
4. OL xem danh sách dự án với thông tin:
   - Mã dự án
   - Tên dự án
   - Địa chỉ (Quận/Huyện, TP)
   - Trạng thái (Draft/Scheduled/In Progress/Completed)
   - Tiến độ (%)
   - Ngày bắt đầu/kết thúc
   - PM phụ trách
5. OL có thể filter/sort:
   - Filter by status
   - Sort by date, progress
   - Search by name/code

**Alternative Flow 4a:** Không có dự án nào
- System hiển thị empty state
- Message: "Chưa có dự án nào được assign"
- Suggest: "Liên hệ PM để được assign dự án"

**Postcondition:** OL xem được danh sách dự án của mình

---

### UC-OL-02: Xem Chi Tiết Dự Án

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án  

**Main Flow:**
1. OL chọn 1 dự án từ danh sách
2. System hiển thị project detail với tabs:
   - **Tổng quan:** Thông tin cơ bản, timeline, team
   - **Evidence:** Gallery ảnh/video
   - **Vật tư:** Material plan vs actual
   - **Tiến độ:** Progress tracking
   - **Chat:** Communication
   - **Thanh toán:** Payment status
3. OL xem thông tin chi tiết:
   - Tên dự án, mã dự án
   - Địa chỉ (có thể mở Google Map)
   - Loại chống thấm
   - Ngày bắt đầu/kết thúc
   - PM phụ trách
   - Supervisor (nếu có)
   - Team outsource assigned
4. OL có thể quick actions:
   - Upload evidence (camera icon)
   - Chat với PM (chat icon)
   - Báo cáo tiến độ (report icon)

**Alternative Flow 3a:** Dự án chưa có evidence
- Tab Evidence hiển thị empty state
- Button "Upload Evidence" prominent

**Postcondition:** OL xem được chi tiết dự án

---

### UC-OL-03: Upload Evidence

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Evidence" hoặc click FAB "Upload"
3. System hiển thị upload interface:
   - Camera preview (full screen)
   - Stage selector: BEFORE / DURING / AFTER
   - GPS indicator (auto-capture location)
4. OL chọn stage (required)
5. OL chọn source:
   - **Option A:** Chụp ảnh mới (camera)
   - **Option B:** Chọn từ gallery
6. Nếu Option A:
   - OL click capture button
   - System chụp ảnh
   - System auto-capture GPS coordinates
7. Nếu Option B:
   - OL chọn ảnh/video từ gallery
   - GPS = null (hoặc từ EXIF data)
8. System hiển thị preview screen:
   - Image/video preview
   - Stage (editable)
   - Note field (optional)
   - GPS coordinates (if available)
   - Date/time (auto)
9. OL nhập note (optional)
10. OL click "Upload"
11. System validate:
    - File type hợp lệ (jpg, png, mp4, mov)
    - File size <= 500MB
    - Stage đã chọn
12. System compress image/video (if needed)
13. System upload to Google Drive (async)
14. System save metadata to DB:
    - project_id
    - stage
    - file_url
    - gps_lat, gps_lng
    - note
    - uploaded_by (OL user_id)
    - uploaded_at
15. System hiển thị "Upload thành công"
16. System gửi notification cho PM và Supervisor

**Alternative Flow 13a:** Network unavailable (offline)
- System queue upload to local storage
- System hiển thị "Đã lưu, sẽ upload khi có mạng"
- System auto-retry khi có network
- System hiển thị sync status icon

**Alternative Flow 13b:** Google Drive upload failed
- System retry 3 lần
- Nếu vẫn fail: System fallback to local storage
- System log error
- System notify user "Upload failed, will retry"

**Exception Flow 11a:** File không hợp lệ
- System hiển thị error "File type not supported"
- Supported: jpg, png, mp4, mov
- Return to step 5

**Exception Flow 11b:** File quá lớn
- System hiển thị error "File size exceeds 500MB"
- Suggest: "Please compress video before upload"
- Return to step 5

**Postcondition:** Evidence được upload, PM/Supervisor nhận notification

---

### UC-OL-04: Confirm Vật Tư Thực Tế

**Actor:** Outsource Leader  
**Precondition:** PM đã nhập material plan, OL đã được assign vào dự án  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Vật tư"
3. System hiển thị material plan table:
   - Columns: STT | Tên vật tư | Đơn vị | SL Dự kiến | SL Thực tế | Chênh lệch | Ghi chú
   - Planned quantity (from PM)
   - Actual quantity (editable by OL)
   - Variance (auto-calculated)
4. OL nhập actual quantity cho từng item
5. System auto-calculate variance:
   - Variance = Actual - Planned
   - Variance % = (Variance / Planned) × 100%
6. System highlight nếu variance > 10%:
   - Yellow warning
   - Required note field
7. OL nhập note nếu variance > 10%
8. OL click "Confirm"
9. System validate:
   - All actual quantities > 0
   - Note required if variance > 10%
10. System save actual quantities
11. System update material_usage table
12. System gửi notification cho PM:
    - "OL đã confirm vật tư"
    - Highlight items có variance > 10%

**Alternative Flow 6a:** Variance > 20%
- System show error "Variance quá lớn (>20%)"
- Require PM approval trước khi confirm
- OL submit request → PM approve/reject

**Business Rule:**
- Tolerance: 10% variance acceptable
- > 10%: Require note
- > 20%: Require PM approval

**Postcondition:** Vật tư thực tế được confirm, PM nhận notification

---

### UC-OL-05: Assign Staff Vào Dự Án

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án, có staff trong company  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Team"
3. System hiển thị team list:
   - Current members (OL + assigned staff)
   - Button "Add Member"
4. OL click "Add Member"
5. System hiển thị staff picker:
   - Filter: Chỉ staff thuộc company của OL
   - Filter: Chỉ staff available (không bận dự án khác)
   - Search by name
6. OL chọn staff
7. OL chọn role: Worker / Technician / Specialist
8. OL chọn shift: FULL / AM / PM
9. OL chọn date range: Từ ngày - Đến ngày
10. OL click "Assign"
11. System validate:
    - Staff thuộc company của OL
    - Staff available trong date range
    - Date range trong project timeline
12. System tạo PROJECT_ASSIGNMENT record
13. System gửi notification cho staff
14. System update team list

**Alternative Flow 5a:** Không có staff available
- System hiển thị "Không có nhân viên khả dụng"
- Suggest: "Thêm nhân viên mới vào company"

**Alternative Flow 11a:** Staff đã bận
- System warning "Staff đã được assign vào dự án khác"
- Show conflict details
- OL có thể override (nếu cần)

**Postcondition:** Staff được assign, nhận notification

---

### UC-OL-06: Báo Cáo Tiến Độ

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Tiến độ"
3. System hiển thị progress form:
   - Current progress (%)
   - Progress slider (0-100%)
   - Note field
   - Issues field (optional)
   - Next steps field (optional)
4. OL kéo slider để update progress
5. OL nhập note (required nếu progress thay đổi)
6. OL nhập issues (nếu có)
7. OL nhập next steps
8. OL click "Submit"
9. System validate:
   - Progress >= current progress (không được giảm)
   - Note required nếu progress thay đổi
10. System save progress report
11. System update project progress
12. System gửi notification cho PM và Supervisor
13. System log progress history

**Alternative Flow 9a:** Progress giảm
- System error "Tiến độ không thể giảm"
- Suggest: "Liên hệ PM nếu cần điều chỉnh"

**Alternative Flow 6a:** Progress = 100%
- System confirm "Dự án hoàn thành?"
- OL confirm
- System change project status to "Awaiting Approval"
- System notify PM to review

**Postcondition:** Tiến độ được update, PM/Supervisor nhận notification

---

### UC-OL-07: Xem Payment Status

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án, có payment milestones  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Thanh toán"
3. System hiển thị payment milestones:
   - Milestone name (Đặt cọc/Tạm ứng/Nghiệm thu/Final)
   - Amount (outsource share only)
   - Due date
   - Status (Pending/Paid/Overdue)
   - Paid date (if paid)
4. OL xem payment summary:
   - Total contract value (outsource share)
   - Total paid
   - Total pending
   - Next payment due
5. OL có thể filter:
   - All / Pending / Paid / Overdue
   - By project (nếu xem dashboard)

**Alternative Flow 3a:** Chưa có payment milestone
- System hiển thị "Chưa có milestone nào"
- Message: "PM sẽ tạo milestone sau"

**Alternative Flow 4a:** Payment overdue
- System highlight overdue milestones (red)
- Show "Quá hạn X ngày"
- Suggest: "Liên hệ PM qua chat"

**Business Rule:**
- OL chỉ xem payment status, không tạo/edit
- OL chỉ xem outsource share (không xem full contract value)
- OL có thể request payment via chat

**Postcondition:** OL xem được payment status

---

### UC-OL-08: Chat Với PM/Supervisor

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Chat"
3. System hiển thị chat interface:
   - Message list (scrollable)
   - Participants: PM, Supervisor, OL, assigned staff
   - Input field
   - Attach file button
   - Send button
4. OL nhập message
5. OL có thể:
   - **Option A:** Send text message
   - **Option B:** Attach file (image/document)
   - **Option C:** @Mention người cụ thể
6. Nếu Option B:
   - OL click attach button
   - OL chọn file từ device
   - System validate file type/size
   - System upload file
7. Nếu Option C:
   - OL type "@" → System show participant list
   - OL chọn người → System insert @mention
8. OL click "Send"
9. System save message to DB
10. System broadcast message (WebSocket/real-time)
11. System gửi push notification cho:
    - All participants (nếu text message)
    - @Mentioned user (nếu có @mention)
12. System hiển thị message trong chat

**Alternative Flow 6a:** File quá lớn
- System error "File size exceeds 10MB"
- Suggest: "Please compress file"

**Alternative Flow 10a:** Network unavailable
- System queue message locally
- System hiển thị "Sending..." status
- System auto-send khi có network

**Features:**
- Real-time messaging (WebSocket)
- File attachments (max 10MB)
- @Mention notifications
- Message search
- Pin important messages
- Create task from message

**Postcondition:** Message được gửi, participants nhận notification

---

### UC-OL-09: Xem Notifications

**Actor:** Outsource Leader  
**Precondition:** OL đã login  

**Main Flow:**
1. OL click notification bell icon
2. System hiển thị notification list:
   - Unread count badge
   - Notification items (latest first)
3. System group notifications by type:
   - Project assigned
   - Evidence approved/rejected
   - Payment received
   - Chat mention
   - Material variance alert
4. OL xem notification details:
   - Icon (by type)
   - Title
   - Message
   - Timestamp (relative: "2 giờ trước")
   - Read/unread status
5. OL click notification
6. System mark as read
7. System navigate to related screen:
   - Project assigned → Project detail
   - Evidence rejected → Evidence gallery
   - Payment received → Payment status
   - Chat mention → Chat tab

**Alternative Flow 2a:** Không có notification
- System hiển thị empty state
- Message: "Không có thông báo mới"

**Features:**
- Push notifications (mobile)
- In-app notifications
- Notification badge count
- Mark all as read
- Clear all notifications

**Postcondition:** OL xem được notifications

---

### UC-OL-10: Quản Lý Profile Công Ty

**Actor:** Outsource Leader  
**Precondition:** OL đã login  

**Main Flow:**
1. OL mở menu
2. OL chọn "Company Profile"
3. System hiển thị company info:
   - Company name
   - Address
   - Phone, email
   - Tax code
   - Operation areas (provinces/districts)
   - Team members list
   - Active projects count
4. OL có thể view team members:
   - Name
   - Role
   - Phone
   - Status (Active/Inactive)
   - Current projects
5. OL có thể view operation areas:
   - Provinces/districts covered
   - Map view (optional)

**Alternative Flow 4a:** OL là company admin
- OL có thể edit company info
- OL có thể add/remove team members
- OL có thể update operation areas

**Postcondition:** OL xem được company profile

---

### UC-OL-11: Xem Lịch Sử Dự Án

**Actor:** Outsource Leader  
**Precondition:** OL đã login  

**Main Flow:**
1. OL mở dashboard
2. OL chọn filter "All Projects" hoặc "Completed"
3. System hiển thị project history:
   - All projects (Active + Completed)
   - Sort by date (latest first)
4. OL có thể filter:
   - Status: All / Active / Completed / Cancelled
   - Date range: This month / Last 3 months / This year
   - PM: Filter by PM name
5. OL click vào project
6. System hiển thị project detail (read-only nếu completed)

**Alternative Flow 3a:** Chưa có completed project
- System hiển thị "Chưa có dự án hoàn thành"

**Postcondition:** OL xem được lịch sử dự án

---

### UC-OL-12: Request Payment Milestone

**Actor:** Outsource Leader  
**Precondition:** OL đã được assign vào dự án, progress đạt milestone  

**Main Flow:**
1. OL mở dự án
2. OL chọn tab "Thanh toán"
3. OL xem pending milestone
4. OL click "Request Payment"
5. System hiển thị request form:
   - Milestone name
   - Amount
   - Progress achieved (%)
   - Evidence uploaded (count)
   - Note field
6. OL nhập note (optional)
7. OL click "Submit Request"
8. System validate:
   - Progress >= milestone requirement
   - Evidence uploaded (có ảnh DURING/AFTER)
9. System create payment request
10. System gửi notification cho PM
11. PM review và approve/reject
12. System notify OL về decision

**Alternative Flow 8a:** Progress chưa đủ
- System error "Progress chưa đạt yêu cầu"
- Show required progress vs current
- Suggest: "Hoàn thành thêm công việc"

**Alternative Flow 8b:** Chưa có evidence
- System warning "Chưa upload evidence"
- Suggest: "Upload ảnh thi công trước khi request"

**Postcondition:** Payment request được gửi, PM nhận notification

---

## 3. BUSINESS RULES

### 3.1 Project Rules

**BR-OL-01:** Outsource Leader chỉ xem dự án của company mình  
**BR-OL-02:** Outsource Leader không thể tạo dự án mới  
**BR-OL-03:** Outsource Leader chỉ assign staff thuộc company mình  
**BR-OL-04:** Dự án phải có PM và Outsource Leader (không thể unassign)  

### 3.2 Evidence Rules

**BR-OL-05:** Evidence phải có stage (BEFORE/DURING/AFTER)  
**BR-OL-06:** Evidence nên có GPS location (recommended, not required)  
**BR-OL-07:** File size <= 500MB  
**BR-OL-08:** Supported formats: jpg, png, mp4, mov  
**BR-OL-09:** Outsource Leader không thể xóa evidence đã upload (chỉ PM/Supervisor)  
**BR-OL-10:** Evidence rejected không hiển thị trên customer portal  

### 3.3 Material Rules

**BR-OL-11:** Variance <= 10%: Auto-approve  
**BR-OL-12:** Variance > 10% và <= 20%: Require note  
**BR-OL-13:** Variance > 20%: Require PM approval  
**BR-OL-14:** Actual quantity phải > 0  
**BR-OL-15:** Chỉ confirm 1 lần (không edit sau khi confirm, phải contact PM)  

### 3.4 Payment Rules

**BR-OL-16:** Outsource Leader chỉ xem payment status (không create/edit)  
**BR-OL-17:** Outsource Leader chỉ xem outsource share (không xem full contract)  
**BR-OL-18:** Payment request require: progress >= milestone + evidence uploaded  
**BR-OL-19:** Payment overdue: Highlight và suggest contact PM  

### 3.5 Team Rules

**BR-OL-20:** Chỉ assign staff thuộc company của OL  
**BR-OL-21:** Staff phải available (không bận dự án khác)  
**BR-OL-22:** Date range phải trong project timeline  
**BR-OL-23:** Shift: FULL / AM / PM (simplified, không chi tiết giờ)  

### 3.6 Chat Rules

**BR-OL-24:** Chat participants: PM, Supervisor, OL, assigned staff  
**BR-OL-25:** File attachment max 10MB  
**BR-OL-26:** @Mention gửi push notification  
**BR-OL-27:** Message không thể xóa (chỉ hide)  

---

## 4. VALIDATION RULES

### 4.1 Evidence Upload

| Field | Rule |
|-------|------|
| file | Required, max 500MB |
| file_type | Must be: jpg, png, mp4, mov |
| stage | Required, must be: BEFORE/DURING/AFTER |
| gps_lat | Optional, decimal (-90 to 90) |
| gps_lng | Optional, decimal (-180 to 180) |
| note | Optional, max 500 chars |

### 4.2 Material Confirmation

| Field | Rule |
|-------|------|
| quantity_actual | Required, > 0, decimal |
| note | Required if variance > 10%, max 500 chars |

### 4.3 Progress Report

| Field | Rule |
|-------|------|
| progress | Required, 0-100, integer |
| note | Required if progress changed, max 1000 chars |
| issues | Optional, max 1000 chars |
| next_steps | Optional, max 1000 chars |

### 4.4 Team Assignment

| Field | Rule |
|-------|------|
| staff_id | Required, must belong to OL's company |
| role | Required, must be: Worker/Technician/Specialist |
| shift | Required, must be: FULL/AM/PM |
| start_date | Required, >= project.plan_start |
| end_date | Required, <= project.plan_end, >= start_date |

---

## 5. STATE MACHINES

### 5.1 Evidence Upload State

```
Queued (offline) → Uploading → Uploaded → Approved/Rejected
                       ↓
                    Failed → Retry
```

### 5.2 Material Confirmation State

```
Planned (by PM) → Confirming (by OL) → Confirmed → Approved/Rejected (by PM if variance > 20%)
```

### 5.3 Payment Request State

```
Not Requested → Requested → Approved/Rejected (by PM) → Paid (by Accountant)
```

---

## 6. MOBILE-SPECIFIC FEATURES

### 6.1 Camera Integration

- Native camera API
- Auto GPS tagging
- Image compression before upload
- Batch upload support
- Offline queue

### 6.2 Offline Capability

**Offline-first features:**
- View cached project list
- View cached evidence gallery
- Queue evidence uploads
- Queue chat messages
- Queue progress reports

**Sync when online:**
- Auto-upload queued evidence
- Auto-send queued messages
- Auto-sync progress reports
- Show sync status indicator

### 6.3 Touch Gestures

- Pull-to-refresh (dashboard, project list)
- Swipe to delete (notifications)
- Long press for context menu
- Pinch to zoom (images)
- Swipe left/right (image gallery navigation)

### 6.4 Performance Optimization

- Lazy loading images
- Infinite scroll for lists
- Image thumbnail caching
- Optimistic UI updates
- Background sync

---

## 7. NOTIFICATION DESIGN

### 7.1 Notification Types

| Event | Trigger | Channel | Priority |
|-------|---------|---------|----------|
| Project assigned | PM assigns OL | Push + In-app | High |
| Evidence rejected | Supervisor rejects | Push + In-app | High |
| Payment received | Accountant confirms | Push + In-app | High |
| Chat @mention | Someone @mentions OL | Push + In-app | Medium |
| Material variance alert | Variance > 10% | In-app | Low |
| Progress reminder | No update in 3 days | Push | Low |

### 7.2 Push Notification Template

**Project Assigned:**
```
Title: Dự án mới được assign
Body: Bạn được assign vào dự án "{project_name}" tại {address}
Action: Tap to view details
```

**Evidence Rejected:**
```
Title: Evidence bị từ chối
Body: Evidence tại dự án "{project_name}" bị từ chối. Lý do: {reason}
Action: Tap to re-upload
```

**Payment Received:**
```
Title: Đã nhận thanh toán
Body: Milestone "{milestone_name}" - {amount} VNĐ đã được thanh toán
Action: Tap to view details
```

---

## 8. INTEGRATION POINTS

### 8.1 With PM Role

- Receive project assignments
- Upload evidence → PM reviews
- Confirm materials → PM sees variance
- Request payment → PM approves
- Chat communication

### 8.2 With Supervisor Role

- Receive on-site instructions
- Upload evidence → Supervisor approves
- Report issues
- Chat collaboration

### 8.3 With System Services

- **Google Drive:** Evidence storage
- **GPS Service:** Location tagging
- **Camera API:** Photo/video capture
- **Push Notification:** Firebase Cloud Messaging
- **WebSocket:** Real-time chat

---

## 9. ERROR HANDLING

### 9.1 Error Codes

| Code | Message | HTTP Status |
|------|---------|-------------|
| ERR_OL_001 | Project not found or not assigned to you | 404 |
| ERR_OL_002 | Evidence upload failed | 500 |
| ERR_OL_003 | File too large (max 500MB) | 400 |
| ERR_OL_004 | Unsupported file type | 400 |
| ERR_OL_005 | Material variance exceeds 20% | 400 |
| ERR_OL_006 | Staff not in your company | 403 |
| ERR_OL_007 | Progress cannot decrease | 400 |
| ERR_OL_008 | Payment request denied (insufficient progress) | 400 |

### 9.2 User-Friendly Error Messages

**Vietnamese messages:**
- "Không thể upload file. Vui lòng kiểm tra kết nối mạng."
- "File quá lớn. Vui lòng nén video trước khi upload."
- "Chênh lệch vật tư quá lớn. Vui lòng liên hệ PM."
- "Nhân viên này không thuộc công ty của bạn."

---

## 10. PERFORMANCE REQUIREMENTS

| Metric | Target | Note |
|--------|--------|------|
| App launch time | < 2s | Cold start |
| Dashboard load | < 1s | Cached data |
| Evidence upload (10MB) | < 10s | 4G network |
| Chat message delivery | < 500ms | WebSocket |
| Image thumbnail load | < 200ms | Cached |
| Offline sync | < 30s | When back online |

---

## 11. SECURITY & PRIVACY

### 11.1 Data Access

- OL chỉ xem dự án của company mình
- OL không xem tài chính của PM/company SIRA
- OL không xem dự án của outsource company khác
- Evidence có GPS → Privacy concern (optional, not required)

### 11.2 Authentication

- JWT token (24h expiry)
- Refresh token (30 days)
- Biometric login (fingerprint/face ID) - optional
- Auto-logout sau 7 ngày inactive

### 11.3 Data Encryption

- HTTPS for all API calls
- End-to-end encryption for chat (optional Phase 2)
- Local storage encryption (sensitive data)

---

## 12. FUTURE ENHANCEMENTS (Phase 2+)

- **Offline-first architecture:** Full offline capability
- **Voice recording:** Voice notes trong chat
- **Video call:** Video call với PM/Supervisor
- **AI assistance:** AI suggest optimal material quantities
- **QR code scanning:** Scan QR code vật tư
- **Barcode scanning:** Scan barcode sản phẩm
- **AR measurement:** AR đo kích thước công trình
- **Weather integration:** Weather forecast tại công trường
- **Safety checklist:** Safety compliance checklist

---

**Version:** 1.0  
**Date:** 2026-02-12  
**Status:** Draft  
**Author:** SIRA Tech Team
