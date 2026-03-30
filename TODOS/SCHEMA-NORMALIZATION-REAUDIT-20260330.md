# Biên Bản Chuẩn Hóa Schema Trước Phase 2 Seed - 2026-03-30

## 1. Mục tiêu
- Rà soát lại lớp schema business đang sống trước khi quay lại Phase 2 seeding.
- Dọn residue legacy còn sót sau wave cleanup trước đó.
- Chuẩn hóa nóng enum và label đang còn mang dấu vết legacy.
- Chốt rõ phần nào đã sửa trực tiếp trên backend, phần nào còn là backlog metadata.

## 2. Nguồn đối chiếu
- Backend schema sống qua BAC MCP:
  - `schema_list`
  - `schema_get`
  - `schema_batch_create_or_update_property`
  - `schema_update_deprecated_properties`
- Tài liệu nội bộ:
  - `TODOS/SYSTEM-CLEANUP-CLOSURE-20260329.md`
  - `TODOS/process.md`
  - `TODOS/SeedData/SEED-GAP-BACKEND-REFERENCES-AND-UPLOADS-20260330.md`
- Tài liệu BA V4:
  - `documents/BA-V4/01-Business-Requirements/BA_Journey_Workflow_Settings_v4.md`
  - `documents/BA-V4/01-Business-Requirements/Original_Requirements_Audit_v4.md`
- Codebase tham khảo nhẹ:
  - `src/types/v3.ts`
  - `src/data/mockData.ts`

## 3. Kết luận kiến trúc sau re-audit
- Trục runtime chuẩn vẫn là `Journey + CustomerJourneySetting + Project + Payment/Settlement + Portal`.
- `Contract`, `ContractAppendix`, `ProjectTask` không được phục hồi làm runtime schema của BAC hiện tại.
- Các field còn tham chiếu tới 3 schema trên phải được hiểu là residue legacy, không còn là liên kết nghiệp vụ chuẩn.
- Các schema sau vẫn hợp lệ về mặt nghiệp vụ và không đưa vào danh sách xóa:
  - `SurveyAppointment`
  - `ProjectAssignment`
  - `MaterialReceiptConfirmation`
  - `WarrantyReminder`
  - `QuotationLineItem`
  - `QuotationMappingRule`

## 4. Cleanup metadata legacy đã hoàn tất

### 4.1 Đã đánh `deprecated`
- `PaymentAdjustment.contract_id`
- `PaymentAdjustment.contract_appendix_id`
- `HandoverIssue.contract_id`
- `SiteReport.project_task_id`
- `IncidentReport.project_task_id`
- `ActivityEvent.project_task_id`

### 4.2 Đã loại khỏi option active
- `ActivityEvent.related_entity_type`
  - Đã loại `project_task`

## 5. Chuẩn hóa enum và label đã sửa nóng trực tiếp trên backend

### 5.1 `IncidentReport`
- Đã chuẩn hóa `priority`:
  - `low`
  - `medium`
  - `high`
  - `critical`
- Đã chuẩn hóa `status`:
  - `open`
  - `investigating`
  - `resolved`
- Đã chuẩn hóa label:
  - `project_id` -> `Dự án`
  - `title` -> `Tiêu đề sự cố`
  - `priority` -> `Độ ưu tiên`
  - `status` -> `Trạng thái xử lý`
  - `assigned_to` -> `Người phụ trách`

### 5.2 `ActivityEvent`
- Đã chuẩn hóa label:
  - `project_id` -> `Dự án`
  - `service_request_id` -> `Yêu cầu dịch vụ`
  - `related_entity_id` -> `ID thực thể liên quan`
  - `related_entity_type` -> `Loại thực thể liên quan`

### 5.3 `Distributor`
- Đã chuẩn hóa label:
  - `code` -> `Mã nhà phân phối`
  - `name` -> `Tên nhà phân phối`
  - `phone` -> `Số điện thoại`
  - `address` -> `Địa chỉ`
  - `categories` -> `Lĩnh vực cung cấp`

### 5.4 `StockRequest`
- Đã chuẩn hóa `type`:
  - `request_out`
  - `request_in`
- Đã chuẩn hóa `status`:
  - `pending`
  - `approved`
  - `rejected`
  - `converted`
- Đã chuẩn hóa label:
  - `items` -> `Danh sách vật tư`
  - `converted_order_id` -> `Phiếu kho đã tạo`
  - `created_at` -> `Thời điểm tạo`

### 5.5 `StockOrder`
- Đã chuẩn hóa `type`:
  - `out`
  - `in`
- Đã chuẩn hóa `status`:
  - `draft`
  - `requested`
  - `approved`
  - `dispatched`
  - `received`
  - `completed`
  - `discrepancy`
  - `cancelled`
- Đã chuẩn hóa `source`:
  - `distributor`
  - `project`
  - `other`
- Đã chuẩn hóa `discrepancy_status`:
  - `none`
  - `pending_review`
  - `confirmed`
  - `resolved`
- Đã chuẩn hóa label:
  - `signatures` -> `Chữ ký`
  - `history` -> `Lịch sử xử lý`
  - `items` -> `Danh sách hàng hóa`

### 5.6 `MaterialReceiptConfirmation`
- Đã chuẩn hóa `receipt_status`:
  - `pending`
  - `received`
  - `rejected`

### 5.7 `WarrantyReminder`
- Đã chuẩn hóa `channel`:
  - `sms`
  - `zalo`
- Đã chuẩn hóa `status`:
  - `pending`
  - `sent`
  - `failed`

## 6. Phần còn lại chưa sửa nóng được trong wave này

### 6.1 Nhóm label cấp schema gốc
- Các schema business sau vẫn còn `label` không dấu ở cấp schema root:
  - `QuotationMappingRule`
  - `QuotationLineItem`
  - `Project`
  - `ProjectAssignment`
  - `SiteReport`
  - `MaterialStandard`
  - `StockRequest`
  - `Distributor`
  - `MaterialReceiptConfirmation`
  - `WarrantyReminder`
  - `PaymentMilestone`
  - `PortalDocument`

### 6.2 Đánh giá
- Nhóm `schema_*` tool hiện tại cho phép sửa an toàn ở cấp property, enum, trigger, layout, deprecated flag.
- Chưa có mutation an toàn ở cùng nhóm tool để cập nhật trực tiếp `label` cấp schema root.
- Vì vậy, phần backlog còn lại là backlog metadata hiển thị, không phải GAP nghiệp vụ hay blocker cho mô hình dữ liệu.

## 7. Tác động tới Phase 2 seed
- Về mặt nghiệp vụ, residue `Contract / ContractAppendix / ProjectTask` đã được dọn thêm một bước đáng kể.
- Về mặt enum seed:
  - các schema bridge chính đã về lowercase theo chuẩn mới;
  - seed Phase 2 không cần giữ lại giá trị uppercase legacy cho các field đã chuẩn hóa.
- Về mặt label:
  - label field và option quan trọng đã sạch hơn để phục vụ form, kiểm tra thủ công và đối chiếu dữ liệu;
  - label cấp schema gốc nếu cần đẹp tuyệt đối trên UI danh sách schema thì sẽ làm ở một wave metadata riêng.

## 8. Kết luận
- Wave chuẩn hóa này đã đóng xong phần quan trọng nhất cho seed: residue legacy và enum/property label business.
- Phần chưa xong chỉ còn metadata `label` cấp schema root, không ảnh hưởng đến cấu trúc seed và logic nghiệp vụ.
- Có thể quay lại chuẩn bị batch Phase 2 với giả định canonical mới là:
  - enum value dùng lowercase hoặc snake_case
  - label field dùng tiếng Việt có dấu
  - field legacy đã deprecated tiếp tục để `null` có chủ đích khi seed
