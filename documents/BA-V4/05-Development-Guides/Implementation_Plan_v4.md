# Kế hoạch xây dựng hoàn chỉnh - BA-V4

## 1. Mục tiêu của plan

Plan này nhằm:

- bổ sung các function còn thiếu để hệ thống chạy thật
- khóa thứ tự build để tránh build UI trước business rule
- đảm bảo các điểm đã chốt trong BRD mới được phản ánh đúng xuống backlog dev

## 2. Nguyên tắc triển khai

1. Khóa `data model` trước khi mở rộng thêm UI.
2. Xây theo `end-to-end flow`, không build từng màn rời rạc.
3. Xây `Task module` song song với CRM và Project, không để làm sau cùng.
4. Xem `Supervisor` là actor số hiện trường ở phase hiện tại; `Worker` được quản lý qua `worker profile`.
5. Xây `file governance + Google Drive sync` như một năng lực lõi, không xem là tiện ích phụ.
6. Xem `Warranty/Maintenance` là một phần của financial close loop.

## 3. Wave triển khai đề xuất

### Wave 0 - Chốt baseline BA-V4 và dọn kiến trúc

**Mục tiêu**

- chốt BA-V4 làm baseline duy nhất
- chốt role model `Supervisor / Worker profile`
- chốt ERD v4, file strategy, warranty-finance lifecycle
- quy hoạch lại app admin

**Deliverable**

- ERD v4 freeze
- mapping role V2/V3 -> V4
- danh mục route giữ lại / loại bỏ / gộp
- danh mục aggregate/API cần build

**Điều kiện qua wave**

- không còn tranh cãi về `Customer` vs `Service Request`
- không còn tranh cãi về `Worker account` vs `worker profile`
- không còn tranh cãi về Google Drive là storage layer hay source of truth

### Wave 1 - Foundation, Auth, RBAC, Master Data

**Chức năng**

- auth/session thật
- user/role/permission
- worker profile master
- master data chuẩn
- audit log khung
- integration settings khung
- file governance skeleton

**Kết quả mong muốn**

- mỗi vai trò đăng nhập đúng quyền
- có tenant settings cơ bản
- có admin control plane thống nhất
- có cấu trúc metadata file sẵn sàng cho các wave sau

### Wave 2 - CRM chuẩn theo Service Request

**Chức năng**

- customer master
- create `Service Request` linh hoạt:
  - tạo từ khách hiện hữu
  - tạo request trước rồi auto-create customer mới nếu cần
- duplicate suggestion theo phone/email/address
- dynamic pipeline
- stage history
- survey record
- quotation versioning

**Kết quả mong muốn**

- PM quản lý sale theo `Service Request`
- không tạo rác customer khi nhập liệu nhanh
- có nhiều báo giá cho cùng một request

### Wave 3 - Module B: Vận hành nội bộ

**Chức năng**

- convert báo giá thắng sang hợp đồng
- convert hợp đồng sang dự án
- stage playbook
- handoff rule liên vai trò
- project WBS / task board
- assignment cho PM/Supervisor
- workforce assignment cho worker profile
- change order tối thiểu

**Kết quả mong muốn**

- mỗi request thắng sinh được project đúng chuẩn
- PM có board điều phối nội bộ thật
- luồng giao tiếp và bàn giao giữa PM, Supervisor, Accountant rõ ràng

### Wave 4 - Field execution theo mô hình Supervisor proxy

**Chức năng**

- task detail mobile-first cho Supervisor
- checklist theo task
- upload evidence thay mặt worker profile
- review/approve/reject
- incident report
- acceptance draft
- sync queue ảnh/video/file lên Google Drive

**Kết quả mong muốn**

- Supervisor chạy được luồng hiện trường thật
- mọi evidence lưu đúng actor số và worker profile thực tế
- file hiện trường đồng bộ được lên cloud có retry

### Wave 5 - Inventory & procurement vận hành thật

**Chức năng**

- material catalog
- material standard
- reservation vật tư theo project/task
- phiếu nhập/xuất/hoàn
- Supervisor ký nhận trên hệ thống và phát cho worker profile
- cảnh báo tồn kho
- đề nghị mua hàng tối thiểu

**Kết quả mong muốn**

- không mở task thi công khi chưa đủ vật tư
- kho đối soát được
- biết vật tư đã giao cho tổ/worker profile nào

### Wave 6 - Finance, Acceptance, Warranty & Maintenance

**Chức năng**

- payment schedule
- payment transaction
- công nợ phải thu/phải trả
- acceptance record
- warranty card
- warranty case / maintenance visit
- aftersales cost capture
- billing cho bảo trì tính phí
- portal publish policy

**Kết quả mong muốn**

- đóng được vòng đời dự án
- theo dõi được chi phí hậu mãi
- có khoản phải thu rõ ràng với case ngoài bảo hành

### Wave 7 - Reports, KPI, governance nâng cao

**Chức năng**

- monthly financial report
- project P&L
- KPI dashboard
- notification preference
- dashboard file sync / file lỗi
- full audit trail
- report export

**Kết quả mong muốn**

- ban lãnh đạo có báo cáo dùng được
- đội vận hành thấy rõ bottleneck, tồn kho, hậu mãi và lỗi đồng bộ file

### Wave 8 - UAT, migration, pilot go-live

**Chức năng**

- UAT theo flow thật
- seed data / migration plan
- training material
- pilot go-live
- hardening production

**Kết quả mong muốn**

- chạy pilot được với người dùng thật
- có checklist vận hành và rollback

## 4. Backlog chức năng bắt buộc phải bổ sung

### 4.1 Nhóm bắt buộc cho vận hành thật

- `Service Request` lifecycle chuẩn
- `Dynamic Pipeline + Stage Playbook + Handoff Rule`
- `Task module` đa vai trò
- `Project conversion flow`
- `Worker profile + Supervisor proxy model`
- `Stock ledger + Reservation`
- `Payment ledger + Aftersales billing`
- `Acceptance record`
- `Warranty + Maintenance + Financial impact`
- `File governance + Google Drive sync`
- `Audit trail`

### 4.2 Nhóm nâng chất lượng vận hành

- notification preferences
- monthly report export
- site synthesis report
- portal analytics
- procurement request
- file retention dashboard

## 5. Definition of Done cho từng wave

Mỗi wave chỉ được xem là hoàn tất khi đủ cả 7 lớp:

1. Data model
2. API/service
3. UI/UX
4. Business rule
5. Audit/notification
6. File/financial integration nếu có liên quan
7. Test/UAT

Nếu thiếu một lớp, wave chỉ được xem là `partial`.

## 6. Khuyến nghị thực thi với codebase hiện tại

### 6.1 Không build tiếp trực tiếp trên route cũ

Nên quy hoạch lại:

- route CRM chuẩn
- route Vận hành nội bộ chuẩn
- route Admin chuẩn

Các route legacy chỉ để tham chiếu tạm.

### 6.2 Tách backlog làm 3 lane song song

- `Lane A`: Data/API/Workflow/Integration
- `Lane B`: PM/Admin UI
- `Lane C`: Supervisor mobile + Inventory + Accountant + Aftersales

### 6.3 Ưu tiên xây “xương sống” trước

Thứ tự ưu tiên:

1. CRM model
2. Vận hành nội bộ và task orchestration
3. File governance + Google Drive sync
4. Inventory lock/unlock
5. Finance/acceptance/warranty close loop

## 7. Kết luận

Plan V4 không khuyến nghị tiếp tục mở rộng theo kiểu “thiếu màn nào thì thêm màn đó”. Thay vào đó, hệ thống cần đi theo trục:

`Chuẩn hóa dữ liệu -> Chuẩn hóa workflow -> Chuẩn hóa actor -> Hoàn thiện màn hình -> UAT -> Go-live`
