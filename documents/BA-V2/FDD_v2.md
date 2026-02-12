# 📘 FUNCTIONAL DESIGN DOCUMENT (FDD) v2.0
**SIRA Service Management Platform**

---

## 1. THÔNG TIN TÀI LIỆU

| Item | Description |
|------|-------------|
| **Project Name** | SIRA Service Management Platform |
| **Version** | 2.0 |
| **Date** | 2026-02-12 |
| **Document Type** | Functional Design Document |
| **Based On** | BRD v2.0 |
| **Owner** | SIRA Tech Team |

---

## 2. HỆ THỐNG TỔNG QUAN

### 2.1 Mục tiêu

Hệ thống hỗ trợ **2 mô hình vận hành**:
1. **Internal**: Dự án nhỏ, nhân sự nội bộ tự thi công
2. **Outsource**: Dự án lớn, thuê đội outsource

### 2.2 Kiến trúc hệ thống

```
Frontend (Web Responsive)
        ↓
API Gateway
        ↓
Business Logic Layer
   ├── Auth Service
   ├── Project Service
   ├── Evidence Service
   ├── Payment Service
   └── Portal Service
        ↓
Database (PostgreSQL) + Object Storage (Google Drive/S3)
        ↓
External Services (Google Drive API, Email, SMS)
```

---

## 3. ROLE-BASED ACCESS CONTROL (RBAC)

### 3.1 Permission Matrix

| Function | Admin | PM | Supervisor | Outsource Leader | Accountant | Internal Staff |
|----------|-------|-----|------------|------------------|------------|----------------|
| Tạo dự án | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign Supervisor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign Outsource Team | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Upload Evidence | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Approve Evidence | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Nhập vật tư | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Confirm vật tư | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Xem tài chính | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Tạo payment milestone | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Confirm payment | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Generate share-link | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 4. USE CASES CHI TIẾT

### UC-01: PM Tạo Dự Án Internal

**Actor**: PM  
**Precondition**: PM đã login, có hợp đồng Active  

**Main Flow**:
1. PM chọn "Tạo dự án mới"
2. System hiển thị form tạo dự án
3. PM nhập thông tin:
   - Chọn hợp đồng
   - Nhập mã dự án (auto-generate hoặc manual)
   - Chọn loại: **Internal**
   - Nhập địa chỉ (có thể chọn từ Google Map)
   - Chọn loại chống thấm
   - Nhập ngày bắt đầu/kết thúc
4. PM assign 1-2 Internal Staff
5. PM click "Lưu"
6. System validate:
   - Mã dự án unique
   - Ngày bắt đầu <= ngày kết thúc
   - Đã assign ít nhất 1 staff
7. System tạo dự án với status = Draft
8. System gửi notification cho staff được assign

**Alternative Flow 3a**: PM chọn địa chỉ từ Google Map
- System mở Google Map picker
- PM chọn vị trí
- System lưu lat/lng + địa chỉ text

**Postcondition**: Dự án được tạo, staff nhận notification

---

### UC-02: PM Tạo Dự Án Outsource

**Actor**: PM  
**Precondition**: PM đã login, có hợp đồng Active, đã có Outsource Company  

**Main Flow**:
1. PM chọn "Tạo dự án mới"
2. System hiển thị form tạo dự án
3. PM nhập thông tin:
   - Chọn hợp đồng
   - Nhập mã dự án
   - Chọn loại: **Outsource**
   - **Chọn Outsource Company** (required)
   - Nhập địa chỉ
   - Chọn loại chống thấm
   - Nhập ngày bắt đầu/kết thúc
4. PM assign Supervisor (optional nhưng recommended)
5. PM assign Outsource Leader (required)
6. PM click "Lưu"
7. System validate:
   - Outsource Company đã chọn
   - Outsource Leader thuộc company đã chọn
8. System tạo dự án với status = Draft
9. System gửi notification cho Supervisor & Outsource Leader

**Alternative Flow 5a**: PM không assign Supervisor
- System warning "Recommended to assign Supervisor for outsource project"
- PM confirm skip
- System proceed

**Postcondition**: Dự án outsource được tạo, team nhận notification

---

### UC-03: Staff Upload Evidence

**Actor**: Internal Staff hoặc Outsource Leader  
**Precondition**: Đã được assign vào dự án  

**Main Flow**:
1. Staff mở dự án được assign
2. Staff chọn "Upload Evidence"
3. System hiển thị form upload:
   - Chọn stage: BEFORE / DURING / AFTER
   - Chọn file (image/video)
   - Nhập note (optional)
4. Staff chọn file từ device
5. Staff click "Upload"
6. System validate:
   - File type hợp lệ (jpg, png, mp4, mov)
   - File size <= 500MB
7. System upload file to Google Drive (async)
8. System save metadata to DB
9. System auto-generate thumbnail (for image/video)
10. System hiển thị "Upload thành công"

**Alternative Flow 7a**: Google Drive upload failed
- System fallback to local storage
- System log error
- System retry upload sau 5 phút

**Exception Flow 6a**: File không hợp lệ
- System hiển thị error "File type not supported"
- Return to step 4

**Postcondition**: Evidence được lưu, PM/Supervisor có thể review

---

### UC-04: Supervisor Approve Evidence

**Actor**: Supervisor hoặc PM  
**Precondition**: Có evidence chưa approve  

**Main Flow**:
1. Supervisor mở dự án
2. Supervisor chọn tab "Evidence"
3. System hiển thị danh sách evidence (group by stage)
4. Supervisor xem từng ảnh/video
5. Supervisor chọn action:
   - **Approve**: Click "Approve"
   - **Reject**: Click "Reject" → Nhập lý do
6. System update evidence status
7. Nếu reject: System gửi notification cho uploader

**Alternative Flow 5a**: Approve tất cả
- Supervisor click "Approve All"
- System confirm "Approve all evidence?"
- Supervisor confirm
- System approve tất cả evidence chưa review

**Postcondition**: Evidence được approve/reject, uploader nhận notification (nếu reject)

---

### UC-05: PM Tạo Payment Milestone

**Actor**: PM hoặc Accountant  
**Precondition**: Dự án đã tạo, có giá trị hợp đồng  

**Main Flow**:
1. PM mở dự án
2. PM chọn tab "Payment"
3. PM click "Add Milestone"
4. System hiển thị form:
   - Chọn loại: Đặt cọc / Tạm ứng / Nghiệm thu / Final
   - Nhập % hoặc số tiền
   - Nhập due date
   - Nhập note (optional)
5. PM click "Save"
6. System validate:
   - Tổng % các milestones <= 100%
   - Due date >= ngày hiện tại
7. System tạo milestone với status = Pending
8. System hiển thị danh sách milestones

**Business Rule**: 
- Tổng % tất cả milestones phải = 100% trước khi close dự án
- Default template: Đặt cọc 30%, Tạm ứng 40%, Nghiệm thu 30%

**Postcondition**: Milestone được tạo, Accountant có thể track

---

### UC-06: Accountant Confirm Payment

**Actor**: Accountant  
**Precondition**: Có milestone status = Pending  

**Main Flow**:
1. Accountant mở dashboard "Payment Pending"
2. System hiển thị danh sách milestones pending
3. Accountant chọn milestone cần confirm
4. Accountant click "Confirm Payment"
5. System hiển thị form:
   - Chọn payment method: Cash / Bank / Other
   - Nhập số tiền thực tế nhận
   - Upload chứng từ (optional)
   - Nhập note
6. Accountant click "Confirm"
7. System validate:
   - Số tiền > 0
8. System update milestone status = Paid
9. System update paid_date = today
10. System gửi notification cho PM

**Alternative Flow 7a**: Thanh toán cho Outsource Company
- Accountant chọn "Pay to Outsource"
- System check: Đã nhận đủ tiền từ customer chưa?
- Nếu chưa: System warning "Chưa nhận đủ tiền từ customer"
- Accountant có thể override (nếu là Admin) hoặc cancel

**Postcondition**: Payment được confirm, PM nhận notification

---

### UC-07: PM Generate Customer Portal Link

**Actor**: PM  
**Precondition**: Dự án đã tạo  

**Main Flow**:
1. PM mở dự án
2. PM chọn "Customer Portal"
3. PM click "Generate Link"
4. System hiển thị form:
   - Chọn access level: BASIC / FULL
   - Set expiry date (optional)
5. PM click "Generate"
6. System generate random token (32 chars)
7. System tạo link: `/portal/project/{token}`
8. System hiển thị link + QR code
9. PM copy link hoặc send email cho khách hàng

**Alternative Flow 9a**: Send email trực tiếp
- PM nhập email khách hàng
- PM click "Send Email"
- System gửi email với link + hướng dẫn

**Postcondition**: Link được tạo, khách hàng có thể truy cập

---

### UC-08: Customer Xem Portal

**Actor**: Customer (không cần login)  
**Precondition**: Có link hợp lệ  

**Main Flow**:
1. Customer click link từ email/SMS
2. System validate token:
   - Token exists?
   - Token active?
   - Token expired?
3. System hiển thị portal page:
   - **Header**: Tên dự án, địa chỉ
   - **Progress**: % hoàn thành, timeline
   - **Evidence Gallery**: Ảnh BEFORE/DURING/AFTER (chỉ approved)
   - **Payment Status** (nếu FULL level): Đã thanh toán bao nhiêu
4. Customer xem thông tin

**Exception Flow 2a**: Token invalid
- System hiển thị "Link không hợp lệ hoặc đã hết hạn"
- System suggest "Liên hệ PM để lấy link mới"

**Postcondition**: Customer xem được tiến độ dự án

---

## 5. STATE MACHINES

### 5.1 Project Status State Machine

```
Draft → Scheduled → In Progress → Awaiting Approval → Completed → Closed
  ↓                                                                    ↑
Cancelled -----------------------------------------------------------|
```

**Transitions**:

| From | To | Trigger | Guard Condition |
|------|-----|---------|-----------------|
| Draft | Scheduled | PM assign team | Team assigned |
| Scheduled | In Progress | Staff upload evidence | Evidence uploaded |
| In Progress | Awaiting Approval | Supervisor submit | Evidence AFTER uploaded |
| Awaiting Approval | Completed | PM approve | All evidence approved |
| Completed | Closed | Accountant confirm payment | All payments confirmed |
| Any | Cancelled | PM cancel | PM decision |

### 5.2 Payment Milestone State Machine

```
Pending → Paid
   ↓
Overdue (if past due_date)
```

### 5.3 Evidence State Machine

```
Uploaded → Approved
   ↓
Rejected
```

---

## 6. BUSINESS RULES CATALOG

### 6.1 Project Rules

**BR-PROJ-01**: Dự án Internal không được assign Outsource Leader  
**BR-PROJ-02**: Dự án Outsource phải có Outsource Company  
**BR-PROJ-03**: Không chuyển trạng thái Completed nếu chưa có evidence AFTER  
**BR-PROJ-04**: Mã dự án unique per tenant  
**BR-PROJ-05**: Ngày bắt đầu <= ngày kết thúc  

### 6.2 Payment Rules

**BR-PAY-01**: Tổng % payment milestones = 100% (trước khi close dự án)  
**BR-PAY-02**: Chỉ Accountant confirm payment  
**BR-PAY-03**: Không thanh toán outsource nếu chưa nhận tiền customer (có thể override bởi Admin)  
**BR-PAY-04**: Milestone Overdue nếu quá due_date mà chưa paid  

### 6.3 Evidence Rules

**BR-EVID-01**: Chỉ PM/Supervisor approve evidence  
**BR-EVID-02**: Evidence rejected không hiển thị trên customer portal  
**BR-EVID-03**: File size <= 500MB  
**BR-EVID-04**: Supported formats: jpg, png, mp4, mov  

### 6.4 Portal Rules

**BR-PORT-01**: Share-link token phải unique & random (min 32 chars)  
**BR-PORT-02**: Link expired không truy cập được  
**BR-PORT-03**: BASIC level không xem được tài chính  
**BR-PORT-04**: Chỉ evidence approved mới hiển thị trên portal  

### 6.5 Material Rules

**BR-MAT-01**: PM nhập vật tư dự kiến  
**BR-MAT-02**: Supervisor/Outsource Leader confirm vật tư thực tế  
**BR-MAT-03**: Chi phí = số lượng × đơn giá  

---

## 7. VALIDATION RULES

### 7.1 User Validation

| Field | Rule |
|-------|------|
| username | Required, unique per tenant, 3-50 chars, alphanumeric + underscore |
| email | Required, valid email format |
| phone | Required, 10-11 digits (VN format) |
| password | Min 8 chars, phải có chữ + số |

### 7.2 Project Validation

| Field | Rule |
|-------|------|
| code | Required, unique per tenant, max 50 chars |
| name | Required, max 200 chars |
| contract_id | Required, must exist & active |
| plan_start | Required, date format |
| plan_end | Required, >= plan_start |
| outsource_company_id | Required if project_type = Outsource |

### 7.3 Evidence Validation

| Field | Rule |
|-------|------|
| file | Required, max 500MB |
| file_type | Must be: jpg, png, mp4, mov |
| stage | Required, must be: BEFORE/DURING/AFTER |

### 7.4 Payment Validation

| Field | Rule |
|-------|------|
| milestone_type | Required, must be: DEPOSIT/ADVANCE/ACCEPTANCE/FINAL |
| amount or percentage | Required, > 0 |
| due_date | Required, >= today |

---

## 8. API DESIGN (High-Level)

### 8.1 Authentication

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

### 8.2 Projects

```
GET    /api/projects              # List projects
POST   /api/projects              # Create project
GET    /api/projects/{id}         # Get project detail
PUT    /api/projects/{id}         # Update project
DELETE /api/projects/{id}         # Delete project
POST   /api/projects/{id}/assign  # Assign team
```

### 8.3 Evidence

```
GET    /api/projects/{id}/evidence           # List evidence
POST   /api/projects/{id}/evidence           # Upload evidence
PUT    /api/evidence/{id}/approve            # Approve evidence
PUT    /api/evidence/{id}/reject             # Reject evidence
```

### 8.4 Payment

```
GET    /api/projects/{id}/milestones         # List milestones
POST   /api/projects/{id}/milestones         # Create milestone
PUT    /api/milestones/{id}/confirm-payment  # Confirm payment
```

### 8.5 Portal

```
POST   /api/projects/{id}/portal/generate-link  # Generate share-link
GET    /api/portal/project/{token}              # Public portal (no auth)
```

---

## 9. NOTIFICATION DESIGN

### 9.1 Notification Types

| Event | Recipients | Channel |
|-------|-----------|---------|
| Project assigned | Staff/Supervisor/Outsource Leader | In-app + Email |
| Evidence uploaded | PM/Supervisor | In-app |
| Evidence rejected | Uploader | In-app + Email |
| Payment milestone due | Accountant | In-app + Email |
| Payment confirmed | PM | In-app |
| Portal link generated | PM | In-app |

### 9.2 Notification Template

**Evidence Rejected**:
```
Subject: Evidence bị từ chối - {project_name}
Body:
Xin chào {user_name},

Evidence của bạn tại dự án "{project_name}" đã bị từ chối.
Lý do: {reject_reason}

Vui lòng upload lại evidence mới.

Xem chi tiết: {project_link}
```

---

## 10. ERROR HANDLING

### 10.1 Error Codes

| Code | Message | HTTP Status |
|------|---------|-------------|
| ERR_AUTH_001 | Invalid credentials | 401 |
| ERR_AUTH_002 | Token expired | 401 |
| ERR_PERM_001 | Permission denied | 403 |
| ERR_PROJ_001 | Project not found | 404 |
| ERR_PROJ_002 | Project code already exists | 400 |
| ERR_EVID_001 | File too large (max 500MB) | 400 |
| ERR_EVID_002 | Unsupported file type | 400 |
| ERR_PAY_001 | Total percentage exceeds 100% | 400 |

### 10.2 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERR_PROJ_002",
    "message": "Project code already exists",
    "details": {
      "field": "code",
      "value": "PROJ-001"
    }
  }
}
```

---

## 11. LOGGING & AUDIT

### 11.1 Audit Log Events

- User login/logout
- Project create/update/delete
- Evidence upload/approve/reject
- Payment milestone create/confirm
- Portal link generate/revoke

### 11.2 Audit Log Format

```json
{
  "timestamp": "2026-02-12T10:30:00Z",
  "user_id": "uuid",
  "action": "PROJECT_CREATE",
  "resource_type": "PROJECT",
  "resource_id": "uuid",
  "changes": {
    "before": null,
    "after": { "name": "Dự án ABC", ... }
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

---

## 12. PERFORMANCE REQUIREMENTS

| Metric | Target |
|--------|--------|
| API response time (p95) | < 500ms |
| Page load time (desktop) | < 3s |
| Page load time (mobile) | < 5s |
| File upload (500MB) | < 30s |
| Concurrent users | 500 |
| Database queries | < 100ms (p95) |

---

## 13. SECURITY DESIGN

### 13.1 Authentication Flow

```
User login → Validate credentials → Generate JWT token (24h expiry) 
→ Return token + refresh token → Client store token 
→ Subsequent requests include token in header
```

### 13.2 Authorization Flow

```
Request → Extract token → Validate token → Get user role 
→ Check permission matrix → Allow/Deny
```

### 13.3 Customer Portal Security

```
Customer click link → Extract token → Validate token (exists, active, not expired) 
→ Get project_id → Check access_level → Return portal data
```

---

## 14. INTEGRATION DESIGN

### 14.1 Google Drive Integration

**Flow**:
```
User upload file → Server receive → Validate → Upload to Google Drive (async) 
→ Get Drive file_id → Save metadata to DB → Return success
```

**API**: Google Drive API v3  
**Auth**: Service Account  
**Folder structure**: `/SIRA/{tenant_id}/{project_id}/{stage}/`

### 14.2 Email Integration

**Provider**: SendGrid / AWS SES  
**Templates**: Evidence rejected, Payment due, Portal link

---

## 15. FUTURE ENHANCEMENTS (Phase 3+)

- AI phân tích ảnh chống thấm
- Tự động đánh giá chất lượng thi công
- GPS bắt buộc cho evidence
- Mobile app (iOS/Android)
- Advanced analytics & BI dashboard
- Integration với ERP/CRM

---

**Version**: 2.0  
**Date**: 2026-02-12  
**Status**: Draft
