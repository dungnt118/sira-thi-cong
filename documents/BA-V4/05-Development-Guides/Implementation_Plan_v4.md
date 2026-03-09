# Kế hoạch xây dựng hoàn chỉnh - BA-V4

## 1. Mục tiêu của plan

Plan này nhằm:

- Bổ sung các function còn thiếu để hệ thống chạy thật
- Khóa thứ tự build để tránh build màn hình trước, sửa dữ liệu sau
- Giảm rủi ro từ việc song song nhiều baseline cũ

## 2. Nguyên tắc triển khai

1. Khóa `data model` trước khi mở rộng thêm UI.
2. Xây theo `end-to-end flow`, không xây rời module.
3. Xây `Task module` song song với CRM và Project, không để làm sau cùng.
4. Chỉ tính “xong” khi đủ: dữ liệu, API, rule, màn hình, audit, test.

## 3. Wave triển khai đề xuất

### Wave 0 - Chuẩn hóa baseline và dọn kiến trúc

**Mục tiêu**

- Chốt BA-V4 làm baseline duy nhất
- Chốt role model
- Chốt ERD v4
- Quy hoạch lại app admin

**Deliverable**

- ERD v4 freeze
- Mapping role V2/V3 -> V4
- Danh mục route giữ lại / loại bỏ / gộp
- Danh mục aggregate/API cần build

**Điều kiện qua wave**

- Không còn tranh cãi về `Customer` vs `Service Request`
- Không còn mơ hồ về `Task module`

### Wave 1 - Foundation, Auth, RBAC, Master Data

**Chức năng**

- Auth/session thật
- User/role/permission
- Master data chuẩn
- Audit log khung
- Notification framework khung

**Kết quả mong muốn**

- Mỗi vai trò đăng nhập đúng quyền
- Có tenant settings cơ bản
- Có admin control plane thống nhất

### Wave 2 - CRM chuẩn theo Service Request

**Chức năng**

- Customer master
- Service Request
- Dynamic Pipeline
- Stage history
- Survey record
- Quotation versioning
- Chuyển trạng thái theo rule

**Kết quả mong muốn**

- PM quản lý sale theo `Service Request`
- Pipeline đổi được nhưng không làm hỏng dữ liệu
- Có nhiều báo giá cho cùng một request

### Wave 3 - Contract conversion và Task orchestration

**Chức năng**

- Convert báo giá thắng sang hợp đồng
- Convert hợp đồng sang dự án
- Stage playbook
- Project WBS / task board
- Assignment, reviewer, due date, SLA
- Fast-track override / change request tối thiểu

**Kết quả mong muốn**

- Mỗi request thắng sinh được dự án đúng chuẩn
- PM có board điều phối thật, không chỉ có checklist

### Wave 4 - Field execution cho Supervisor/Worker

**Chức năng**

- Task detail mobile-first
- Checklist theo task
- Upload evidence
- Review/approve/reject
- Incident report
- Task lock/unlock theo dependency

**Kết quả mong muốn**

- Supervisor/Worker chạy được luồng hiện trường thật
- Bằng chứng gắn đúng vào task/checklist

### Wave 5 - Inventory và kho vận hành thật

**Chức năng**

- Material catalog
- Material standard
- Reservation vật tư
- Phiếu nhập/xuất/hoàn
- Worker ký nhận
- Cảnh báo tồn kho
- Đề nghị mua hàng tối thiểu

**Kết quả mong muốn**

- Không còn mở task thi công khi chưa có vật tư
- Kho có thể đối soát được

### Wave 6 - Finance, nghiệm thu, bảo hành

**Chức năng**

- Payment schedule
- Payment transaction
- Công nợ phải thu/phải trả
- Acceptance record
- Warranty card
- Maintenance visit
- Portal publish policy

**Kết quả mong muốn**

- Đóng được vòng đời dự án
- Sinh bảo hành và lịch nhắc sau nghiệm thu

### Wave 7 - Reports, KPI, governance nâng cao

**Chức năng**

- Monthly financial report
- Project P&L
- KPI dashboard
- Notification preference
- Full audit trail
- Report export

**Kết quả mong muốn**

- Ban lãnh đạo có báo cáo dùng được
- Người dùng không bị spam thông báo

### Wave 8 - UAT, migration, pilot go-live

**Chức năng**

- UAT theo flow thật
- Seed data / migration plan
- Training material
- Pilot go-live
- Hardening production

**Kết quả mong muốn**

- Chạy pilot được với người dùng thật
- Có checklist vận hành và rollback

## 4. Backlog chức năng bắt buộc phải bổ sung

### 4.1 Nhóm bắt buộc cho vận hành thật

- `Service Request` lifecycle chuẩn
- `Dynamic Pipeline + Stage Playbook`
- `Task module` đa vai trò
- `Project conversion flow`
- `Stock ledger`
- `Payment ledger`
- `Acceptance record`
- `Warranty + Maintenance`
- `Audit trail`

### 4.2 Nhóm nâng chất lượng vận hành

- Notification preferences
- Monthly report export
- Site synthesis report
- Portal analytics
- Procurement request

## 5. Definition of Done cho từng wave

Mỗi wave chỉ được xem là hoàn tất khi đủ cả 6 lớp:

1. Data model
2. API/service
3. UI/UX
4. Business rule
5. Audit/notification
6. Test/UAT

Nếu thiếu một lớp, wave chỉ được xem là `partial`.

## 6. Khuyến nghị thực thi với codebase hiện tại

### 6.1 Không build tiếp trực tiếp trên route cũ

Nên quy hoạch lại:

- route CRM chuẩn
- route Project chuẩn
- route Admin chuẩn

Các route legacy chỉ để tham chiếu tạm.

### 6.2 Tách backlog làm 3 lane song song

- `Lane A`: Data/API/Workflow
- `Lane B`: PM/Admin UI
- `Lane C`: Mobile field + Accountant

### 6.3 Ưu tiên xây “xương sống” trước

Thứ tự ưu tiên:

1. CRM model
2. Task orchestration
3. Inventory lock/unlock
4. Finance close loop

## 7. Kết luận

Plan V4 không khuyến nghị tiếp tục mở rộng theo kiểu “thấy thiếu màn nào thì thêm màn đó”. Thay vào đó, hệ thống cần đi theo trục:

`Chuẩn hóa dữ liệu -> Chuẩn hóa workflow -> Hoàn thiện màn hình -> UAT -> Go-live`

