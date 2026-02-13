# 📘 BUSINESS REQUIREMENTS DOCUMENT (BRD) v2.0
**Hệ thống Quản lý & Điều phối Dịch vụ Thi Công Chống Thấm SIRA**

---

## 1. THÔNG TIN TÀI LIỆU

| Mục | Nội dung |
|-----|----------|
| **Tên dự án** | SIRA Service Management Platform |
| **Phiên bản** | 2.0 |
| **Ngày** | 2026-02-12 |
| **Người chuẩn bị** | Senior Business Analyst |
| **Nhà tài trợ** | Ban Lãnh Đạo SIRA |
| **Loại tài liệu** | Business Requirements Document |
| **Thay đổi từ v1.0** | Bổ sung outsource model, RBAC redesign, payment milestones, customer portal |

---

## 2. EXECUTIVE SUMMARY

### 2.1 Tổng quan dự án

SIRA cần xây dựng nền tảng phần mềm quản lý dịch vụ thi công chống thấm, hỗ trợ **2 mô hình vận hành**:

1. **Dự án nhỏ**: Nhân sự nội bộ (2-4 người) tự thi công
2. **Dự án lớn**: Thuê đội outsource (scale lên hàng trăm người)

### 2.2 Mục tiêu kinh doanh

- Chuẩn hóa quy trình cho cả internal & outsource teams
- Quản lý bằng chứng hình ảnh (20-100 ảnh/video per project)
- Track payment milestones (đặt cọc, tạm ứng, nghiệm thu)
- Minh bạch tiến độ với khách hàng (customer portal)
- Tích hợp Google Drive để lưu trữ
- Báo cáo tài chính realtime cho Admin

### 2.3 Business Case

**Vấn đề hiện tại**:
- Quản lý outsource thủ công qua Zalo/điện thoại
- Không track được payment milestones
- Khách hàng không thấy tiến độ realtime
- Ảnh/video lưu rời rạc (Zalo, Google Drive)

**Giải pháp**:
- Hệ thống tập trung quản lý cả internal & outsource
- Workflow chuẩn hóa cho 2 scenarios
- Customer portal tự động
- Google Drive integration

**ROI dự kiến**:
- Giảm 40% thời gian điều phối (nhờ workflow tự động)
- Giảm 30% tranh chấp thanh toán (nhờ payment tracking)
- Tăng 50% customer satisfaction (nhờ portal minh bạch)
- Scale được từ 10-20 projects/tháng lên 100+ projects

---

## 3. BUSINESS CONTEXT

### 3.1 Hiện trạng vận hành

**Nhân sự nội bộ**: 3-4 người
- Có thể vừa thi công (dự án nhỏ) vừa giám sát (dự án lớn)

**Outsource teams**: Nhiều đội
- Mỗi đội: 1 Leader + nhiều nhân công
- Leader cần account để báo cáo, nhân công không cần

**Quy trình hiện tại**:

#### Scenario 1: Dự án nhỏ (Internal)
```
PM khảo sát → Assign 1-2 nhân sự nội bộ → Thi công 
→ Báo cáo qua Zalo → Nghiệm thu → Thanh toán
```

#### Scenario 2: Dự án lớn (Outsource)
```
PM khảo sát → Liên hệ outsource → Assign Supervisor (nội bộ) 
→ Bàn giao outsource → Thi công → Báo cáo qua Zalo 
→ Supervisor nghiệm thu → PM bàn giao chủ đầu tư 
→ Chủ đầu tư nghiệm thu → Nhận tiền → Thanh toán outsource
```

### 3.2 Vấn đề tồn tại

| Vấn đề | Hệ quả | Ưu tiên |
|--------|--------|---------|
| Không quản lý được outsource trong hệ thống | Mất kiểm soát khi scale | **High** |
| Không track payment milestones | Tranh chấp thanh toán | **High** |
| Khách hàng không thấy tiến độ | Phải update thủ công | **Medium** |
| Ảnh/video lưu rời rạc | Khó tìm khi cần | **Medium** |
| Không có role Accountant | Tài chính không minh bạch | **High** |

---

## 4. STAKEHOLDERS

| Vai trò | Số lượng | Mục tiêu | Quyền lợi |
|---------|----------|----------|-----------|
| **Admin** (Ban Lãnh Đạo) | 1-2 | Theo dõi tổng thể, báo cáo realtime | Dashboard, financial reports |
| **PM** (Project Manager) | 1-2 | Quản lý nhiều dự án, điều phối | Tạo dự án, assign teams, approve |
| **Supervisor** | 3-4 | Giám sát dự án lớn (outsource) | Review evidence, nghiệm thu |
| **Accountant** | 1 | Quản lý tài chính, thanh toán | Track payment, confirm payment |
| **Outsource Leader** | Nhiều | Đại diện đội outsource | Upload evidence, báo cáo |
| **Internal Staff** | 3-4 | Thi công dự án nhỏ | Upload evidence, báo cáo |
| **Khách hàng** | Nhiều | Theo dõi tiến độ | Xem portal (không cần account) |

---

## 5. SCOPE

### 5.1 In Scope (Phase 1 - MVP)

✅ **Core Features**:
- Quản lý khách hàng & hợp đồng
- Quản lý dự án (2 scenarios: internal/outsource)
- RBAC (6 roles: Admin/PM/Supervisor/Accountant/Outsource Leader/Staff)
- Evidence management (không giới hạn số lượng ảnh/video)
- Material management
- Basic financial tracking
- Document exchange (chat-like, 1 năm retention)

✅ **Phase 2 - Advanced**:
- Outsource company management
- Payment milestones tracking (đặt cọc, tạm ứng, nghiệm thu)
- Customer portal (share-link, không cần login)
- Google Drive integration
- Flexible labor cost (manday/percentage/fixed)
- Advanced financial reports

### 5.2 Out of Scope

❌ **Không làm trong Phase 1-2**:
- Mobile app riêng (dùng responsive web)
- AI phân tích ảnh
- Tích hợp ERP tổng
- CRM marketing
- Realtime chat (chỉ cần document exchange)

---

## 6. USER ROLES & PERMISSIONS

### 6.1 Role Definitions

#### 6.1.1 Admin (Ban Lãnh Đạo)
**Mô tả**: Quản trị hệ thống, xem báo cáo tổng thể

**Quyền**:
- ✅ Tất cả quyền của PM, Supervisor, Accountant
- ✅ Quản lý users & roles
- ✅ Xem dashboard tổng thể
- ✅ Xem báo cáo tài chính realtime
- ✅ Override mọi business rules (nếu cần)

#### 6.1.2 PM (Project Manager)
**Mô tả**: Quản lý nhiều dự án, điều phối teams

**Quyền**:
- ✅ Tạo & quản lý dự án
- ✅ Assign Supervisor (cho dự án lớn)
- ✅ Assign Outsource Leader
- ✅ Assign Internal Staff
- ✅ Upload & approve evidence
- ✅ Nhập vật tư dự kiến
- ✅ Xem tài chính dự án (không confirm payment)
- ✅ Generate customer portal share-link
- ❌ Confirm payment (chỉ Accountant)

#### 6.1.3 Supervisor (Giám sát dự án)
**Mô tả**: Giám sát dự án lớn có outsource

**Quyền**:
- ✅ Xem dự án được assign
- ✅ Assign Outsource Leader (nếu PM ủy quyền)
- ✅ Upload & review evidence
- ✅ Confirm vật tư sử dụng
- ✅ Nghiệm thu công trình
- ❌ Tạo dự án mới
- ❌ Xem tài chính

**Lưu ý**: Supervisor có thể là Internal Staff được assign thêm role này

#### 6.1.4 Accountant (Kế toán)
**Mô tả**: Quản lý tài chính, thanh toán

**Quyền**:
- ✅ Xem tất cả tài chính
- ✅ Tạo payment milestones
- ✅ Confirm payment (thu từ khách, chi cho outsource)
- ✅ Xuất báo cáo tài chính
- ❌ Tạo/sửa dự án
- ❌ Upload evidence

#### 6.1.5 Outsource Leader (Đại diện đội outsource)
**Mô tả**: Đại diện Cộng tác viên, báo cáo tiến độ

**Quyền**:
- ✅ Xem dự án được assign
- ✅ Upload evidence
- ✅ Confirm vật tư sử dụng
- ✅ Chat trong dự án
- ❌ Approve evidence
- ❌ Xem tài chính
- ❌ Assign người khác

**Lưu ý**: Outsource Staff (nhân công) không cần account

#### 6.1.6 Internal Staff (Nhân sự nội bộ)
**Mô tả**: Thi công dự án nhỏ

**Quyền**:
- ✅ Xem dự án được assign
- ✅ Upload evidence
- ✅ Chat trong dự án
- ❌ Approve evidence
- ❌ Xem tài chính

---

## 7. FUNCTIONAL REQUIREMENTS

### 7.1 Quản lý Khách hàng

**FR-CUST-01**: Tạo/sửa/xóa khách hàng  
**Acceptance Criteria**:
- Tên khách hàng bắt buộc, max 200 ký tự
- Số điện thoại validate format VN (10-11 số)
- Email validate format (nếu có)
- Mã số thuế optional, max 20 ký tự

**FR-CUST-02**: Xem lịch sử hợp đồng & dự án theo khách hàng  
**Acceptance Criteria**:
- Hiển thị tất cả hợp đồng của khách (active & completed)
- Hiển thị tất cả dự án liên quan
- Sort theo ngày tạo (mới nhất trước)

### 7.2 Quản lý Hợp đồng

**FR-CONT-01**: Tạo hợp đồng  
**Acceptance Criteria**:
- Phải chọn khách hàng (required)
- Số hợp đồng unique per tenant
- Giá trị hợp đồng > 0
- Ngày ký <= ngày hiệu lực
- Upload file hợp đồng (PDF, max 10MB)

**FR-CONT-02**: Trạng thái hợp đồng  
**States**: Draft → Active → Completed → Cancelled  
**Business Rule**: Chỉ hợp đồng Active mới tạo được dự án mới

### 7.3 Quản lý Dự án (Core)

**FR-PROJ-01**: Tạo dự án  
**Acceptance Criteria**:
- Phải chọn hợp đồng (required)
- Mã dự án unique per tenant
- Phải chọn loại dự án: Internal hoặc Outsource
- Nếu Outsource: phải chọn Outsource Company
- Địa chỉ required, có thể chọn từ Google Map
- Ngày bắt đầu <= ngày kết thúc

**FR-PROJ-02**: Assign teams theo loại dự án  
**Scenario 1 (Internal)**:
- PM assign 1-2 Internal Staff
- Không cần Supervisor
- Không cần Outsource Leader

**Scenario 2 (Outsource)**:
- PM assign Supervisor (optional nhưng recommended)
- PM assign Outsource Leader (required)
- Outsource Leader thuộc Outsource Company đã chọn

**FR-PROJ-03**: Trạng thái dự án  
**States**: Draft → Scheduled → In Progress → Awaiting Approval → Completed → Closed  
**Transitions**:
- Draft → Scheduled: Khi đã assign team
- Scheduled → In Progress: Khi bắt đầu upload evidence
- In Progress → Awaiting Approval: Khi Supervisor/PM submit nghiệm thu
- Awaiting Approval → Completed: Khi PM approve
- Completed → Closed: Khi Accountant confirm payment

### 7.4 Evidence Management (Bằng chứng hình ảnh)

**FR-EVID-01**: Upload evidence  
**Acceptance Criteria**:
- Hỗ trợ: Image (jpg, png), Video (mp4, mov)
- Max file size: 500MB per file
- Không giới hạn số lượng file per project
- Phải chọn stage: BEFORE / DURING / AFTER
- Auto-capture metadata: timestamp, uploader, GPS (optional)

**FR-EVID-02**: Evidence stages  
**Business Rules**:
- BEFORE: Upload trước khi thi công
- DURING: Upload trong quá trình (có thể nhiều lần)
- AFTER: Upload sau khi hoàn thành
- **Không bắt buộc số lượng tối thiểu** (khác v1.0)

**FR-EVID-03**: Approve evidence  
**Who**: PM hoặc Supervisor  
**Acceptance Criteria**:
- Có thể approve/reject từng ảnh
- Nếu reject: phải nhập lý do
- Chỉ evidence approved mới hiển thị trên customer portal

### 7.5 Material Management (Vật tư)

**FR-MAT-01**: PM nhập vật tư dự kiến  
**Acceptance Criteria**:
- Chọn từ Material Catalog
- Nhập số lượng dự kiến
- Nhập đơn giá (có thể khác default)

**FR-MAT-02**: Supervisor/Outsource Leader confirm vật tư thực tế  
**Acceptance Criteria**:
- Xem vật tư dự kiến
- Nhập số lượng thực tế sử dụng
- System tự tính chi phí = số lượng × đơn giá

### 7.6 Payment Milestones (Phase 2)

**FR-PAY-01**: Tạo payment milestones  
**Who**: PM hoặc Accountant  
**Acceptance Criteria**:
- Chọn loại: Đặt cọc / Tạm ứng / Nghiệm thu / Final
- Nhập % hoặc số tiền cố định
- Tổng % các milestones = 100%
- Set due date cho từng milestone

**FR-PAY-02**: Track payment status  
**States**: Pending → Paid → Overdue  
**Business Rules**:
- Overdue nếu quá due date mà chưa paid
- Chỉ Accountant confirm payment
- Không thanh toán cho outsource nếu chưa nhận tiền từ customer (có thể override bởi Admin)

### 7.7 Customer Portal (Phase 2)

**FR-PORT-01**: Generate share-link  
**Who**: PM  
**Acceptance Criteria**:
- Token random, min 32 chars
- Chọn access level: BASIC (chỉ tiến độ) / FULL (cả tài chính)
- Set expiry date (optional)
- Link có thể revoke bất cứ lúc nào

**FR-PORT-02**: Portal hiển thị  
**BASIC level**:
- Thông tin dự án (tên, địa chỉ, timeline)
- Tiến độ % hoàn thành
- Evidence gallery (chỉ approved)
- Timeline (milestones đã hoàn thành)

**FULL level**:
- Tất cả BASIC
- Payment status (đã thanh toán bao nhiêu)
- Material cost breakdown

### 7.8 Google Drive Integration (Phase 2)

**FR-DRIVE-01**: Upload file to Google Drive  
**Acceptance Criteria**:
- User upload qua UI
- Server upload to Google Drive (async)
- Save metadata to DB (file_url = Drive link)
- Auto-generate thumbnail cho image/video

**FR-DRIVE-02**: File retention  
**Business Rule**: Lưu trữ 1 năm, sau đó archive hoặc delete

### 7.9 Document Exchange (Chat)

**FR-CHAT-01**: Post message trong dự án  
**Acceptance Criteria**:
- Scope: per project
- Participants: PM, Supervisor, Outsource Leader, Internal Staff
- Attach files: Image/Video/PDF/Excel
- Reply to message (thread)

**FR-CHAT-02**: Search & filter  
**Acceptance Criteria**:
- Search by keyword
- Filter by date range
- Filter by user
- Filter by file type

**FR-CHAT-03**: Retention  
**Business Rule**: Lưu trữ 1 năm

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Performance

| Metric | Requirement |
|--------|-------------|
| Page load time | < 3s (desktop), < 5s (mobile) |
| API response time | < 500ms (p95) |
| Concurrent users | 500 users |
| File upload | < 30s for 500MB file |

### 8.2 Scalability

- Hỗ trợ 10-20 projects/tháng (Phase 1)
- Scale lên 100+ projects/tháng (Phase 2)
- Hỗ trợ hàng trăm outsource users

### 8.3 Security

- Authentication: JWT token
- Authorization: RBAC (6 roles)
- Password: Min 8 chars, phải có chữ + số
- Session timeout: 24h
- Audit log: Log tất cả actions (create/update/delete)

### 8.4 Availability

- Uptime: 99% (Phase 1), 99.9% (Phase 2)
- Backup: Daily database backup
- Recovery: RTO < 4h, RPO < 1h

### 8.5 Usability

- Responsive design (mobile-first)
- Hỗ trợ Chrome, Safari, Edge (latest 2 versions)
- Tiếng Việt (primary), English (Phase 2)

---

## 9. BUSINESS RULES

### 9.1 Project Rules

**BR-PROJ-01**: Dự án Internal không được assign Outsource Leader  
**BR-PROJ-02**: Dự án Outsource phải có Outsource Company  
**BR-PROJ-03**: Không chuyển trạng thái Completed nếu chưa có evidence AFTER  

### 9.2 Payment Rules

**BR-PAY-01**: Tổng % payment milestones = 100%  
**BR-PAY-02**: Chỉ Accountant confirm payment  
**BR-PAY-03**: Không thanh toán outsource nếu chưa nhận tiền customer (có thể override)  

### 9.3 Evidence Rules

**BR-EVID-01**: Chỉ PM/Supervisor approve evidence  
**BR-EVID-02**: Evidence rejected không hiển thị trên customer portal  

### 9.4 Portal Rules

**BR-PORT-01**: Share-link token phải unique & random  
**BR-PORT-02**: Link expired không truy cập được  
**BR-PORT-03**: BASIC level không xem được tài chính  

---

## 10. ASSUMPTIONS & CONSTRAINTS

### 10.1 Assumptions

✅ Nhân sự có smartphone & internet 4G  
✅ Outsource Leader sẵn sàng dùng hệ thống  
✅ Google Drive có đủ quota (hoặc dùng storage nội bộ)  
✅ Khách hàng chấp nhận xem portal qua link (không cần app riêng)  

### 10.2 Constraints

⚠️ Budget: Chưa xác định (cần estimate sau khi finalize requirements)  
⚠️ Timeline: Phase 1 (2-3 tháng), Phase 2 (1-2 tháng)  
⚠️ Team size: Chưa xác định (tùy vendor)  

### 10.3 Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Outsource không chịu dùng hệ thống | High | Medium | Training + PM enforce policy |
| Google Drive quota limit | Medium | Medium | Hybrid storage (critical → Drive, others → local) |
| Payment tracking phức tạp | Medium | High | Start simple (3 milestones), expand later |
| Customer portal security | High | Low | Token-based, expirable, revocable |

---

## 11. SUCCESS METRICS (KPI)

### 11.1 Operational Metrics

- ✅ Giảm 40% thời gian điều phối (so với thủ công)
- ✅ 100% dự án có evidence đầy đủ (BEFORE/AFTER)
- ✅ Giảm 30% tranh chấp thanh toán (nhờ milestone tracking)
- ✅ 80% khách hàng truy cập portal (customer satisfaction)

### 11.2 Business Metrics

- ✅ Scale từ 10-20 projects/tháng lên 100+ projects
- ✅ Quản lý được 100+ outsource users
- ✅ Theo dõi được lợi nhuận realtime từng dự án
- ✅ Giảm 50% thời gian tìm kiếm ảnh/tài liệu

---

## 12. ROADMAP

### Phase 1: MVP (2-3 tháng)
- RBAC (6 roles)
- Project management (2 scenarios)
- Evidence upload (unlimited)
- Material management
- Basic financial tracking
- Document exchange

### Phase 2: Advanced (1-2 tháng)
- Outsource company management
- Payment milestones
- Customer portal
- Google Drive integration
- Advanced reports

### Phase 3: Optimization (1 tháng)
- Performance tuning
- Advanced search
- Notifications
- Mobile optimization

---

## 13. APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Sponsor | Ban Lãnh Đạo SIRA | _____________ | ______ |
| PM | | _____________ | ______ |
| Accountant | | _____________ | ______ |

---

**Phiên bản**: 2.0  
**Ngày**: 2026-02-12  
**Trạng thái**: Draft - Chờ approval
