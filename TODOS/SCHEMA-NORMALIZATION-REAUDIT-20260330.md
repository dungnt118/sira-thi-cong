# Biên Bản Chuẩn Hóa Schema Trước Phase 2 Seed - 2026-03-30

## 1. Mục tiêu
- Rà soát lại lớp schema business đang sống trước khi quay lại Phase 2 seeding.
- Dọn residue legacy còn sót sau wave cleanup trước đó.
- Chuẩn hóa nóng enum, label và hints đang còn mang dấu vết legacy.
- Tách riêng các trường hợp chưa thể sửa an toàn thành tài liệu GAP để chờ chốt nghiệp vụ.

## 2. Nguồn đối chiếu
- Backend schema sống qua BAC MCP:
  - `schema_list`
  - `schema_get`
  - `schema_batch_create_or_update_property`
  - `schema_update_nested_property`
  - `schema_update_deprecated_properties`
- Tài liệu nội bộ:
  - `TODOS/SYSTEM-CLEANUP-CLOSURE-20260329.md`
  - `TODOS/process.md`
  - `TODOS/SeedData/SEED-GAP-BACKEND-REFERENCES-AND-UPLOADS-20260330.md`
- Tài liệu BA V3/V4:
  - `documents/BA-V3/Wireframes/WF-ADD-01_Template_Checklist.md`
  - `documents/BA-V3/Wireframes/WF-15_16_17_INV_DanhMuc_DinhMuc.md`
  - `documents/BA-V4/01-Business-Requirements/BA_Journey_Workflow_Settings_v4.md`
  - `documents/BA-V4/01-Business-Requirements/Preconstruction_Estimation_and_Quotation_v4.md`
  - `documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_Developer_Execution_Spec.md`
- Codebase tham khảo nhẹ:
  - `src/types/journey.ts`
  - `src/types/v3.ts`
  - `src/pages/pm/Journeys/TemplateList.tsx`
  - `src/pages/pm/Construction/TemplateChecklist.tsx`
  - `src/data/journeyMockData.ts`
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

### 5.8 `QuotationMappingRule`
- Đã chuẩn hóa label:
  - `service_type` -> `Loại dịch vụ`
  - `rule_name` -> `Tên quy tắc`
  - `source_cost_types` -> `Nguồn chi phí`
  - `target_item_name` -> `Tên hạng mục hiển thị`
  - `formula_note` -> `Mô tả công thức`
  - `is_active` -> `Đang áp dụng`

### 5.9 `ChecklistTemplate`
- Đã chuẩn hóa label và hints của property `steps`:
  - `steps` -> `Các bước checklist`
  - `hints` -> `Danh sách các bước checklist dùng theo backend ChecklistTemplate.steps[]`
- Đã chuẩn hóa label nested:
  - `step_code` -> `Mã bước`
  - `step_order` -> `Thứ tự`
  - `step_name` -> `Tên bước`
  - `description` -> `Mô tả`
  - `min_photos` -> `Số ảnh tối thiểu`
  - `allow_video` -> `Cho phép video`
  - `is_required` -> `Bắt buộc`

### 5.10 `MaterialStandard`
- Đã chuẩn hóa label:
  - `material_id` -> `Vật tư`
  - `material_name` -> `Tên vật tư`
  - `construction_type` -> `Loại công trình`
  - `usage_per_m2` -> `Định mức trên m²`
  - `note` -> `Ghi chú`

### 5.11 `Journey`
- Đã chuẩn hóa label và hints của nhóm bridge/metric:
  - `latest_site_report_at` -> `Báo cáo hiện trường gần nhất`
  - `supervisor_name` -> `Giám sát phụ trách`
  - `blocked_task_count` -> `Số mục bị chặn`
  - `progress_pct` -> `Tiến độ phần trăm`
  - `stock_risk_summary` -> `Tóm tắt rủi ro tồn kho`
  - `procurement_alert_count` -> `Số cảnh báo mua hàng`
  - `key_material_summary` -> `Tóm tắt vật tư chính`
  - `asset_need_summary` -> `Tóm tắt tài sản cần dùng`
  - `last_payment_note` -> `Ghi chú thanh toán gần nhất`
  - `outstanding_amount` -> `Công nợ còn lại`
  - `latest_thread_status` -> `Trạng thái thread gần nhất`
  - `thread_count` -> `Tổng số thread portal`
  - `next_milestone_name` -> `Đợt thanh toán tiếp theo`
  - `latest_thread_context` -> `Ngữ cảnh thread gần nhất`
  - `milestone_count` -> `Số đợt thanh toán`
  - `total_contract_value` -> `Tổng giá trị hợp đồng`
  - `unread_thread_count` -> `Số thread chưa đọc`
  - `collected_amount` -> `Số tiền đã thu`
  - `next_milestone_due` -> `Hạn đợt tiếp theo`
  - `published_step_count` -> `Số bước đã công bố`
  - `missing_document_count` -> `Số tài liệu còn thiếu`
  - `document_count` -> `Số lượng tài liệu`
- Đã chuẩn hóa thêm enum hiển thị:
  - `material_need_status` -> `Trạng thái nhu cầu vật tư`
  - option label:
    - `enough` -> `Đủ vật tư`
    - `partial` -> `Thiếu một phần`
    - `waiting` -> `Chờ cấp`

## 6. GAP cần tách riêng
- Chưa sửa nóng nhóm field phân loại dùng chung:
  - `QuotationMappingRule.service_type`
  - `ChecklistTemplate.category`
  - `MaterialStandard.construction_type`
  - các field cùng nghĩa phát sinh ở seed/UI cũ
- Lý do:
  - Chưa tồn tại catalog chuẩn trong backend cho `service_type` và `construction_type`.
  - Seed hiện dùng lẫn mã snake_case và nhãn tiếng Việt theo từng ngữ cảnh.
  - Codebase prototype cũ cũng đang dùng nhiều tập giá trị khác nhau.
- Tài liệu chờ chốt:
  - `TODOS/GAP-SCHEMA-DOMAIN-CATALOG-NORMALIZATION-20260330.md`

## 7. Phần còn lại chưa sửa nóng được trong wave này

### 7.1 Nhóm label cấp schema gốc
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

### 7.2 Đánh giá
- Nhóm `schema_*` tool hiện tại cho phép sửa an toàn ở cấp property, enum, trigger, layout, deprecated flag.
- Chưa có mutation an toàn ở cùng nhóm tool để cập nhật trực tiếp `label` cấp schema root.
- Vì vậy, phần backlog còn lại là backlog metadata hiển thị, không phải GAP nghiệp vụ hay blocker cho mô hình dữ liệu.

## 8. Tác động tới Phase 2 seed
- Về mặt nghiệp vụ, residue `Contract / ContractAppendix / ProjectTask` đã được dọn thêm một bước đáng kể.
- Về mặt enum seed:
  - các schema bridge chính đã về lowercase theo chuẩn mới;
  - seed Phase 2 không cần giữ lại giá trị uppercase legacy cho các field đã chuẩn hóa.
- Về mặt label:
  - label field, nested field và option business quan trọng đã sạch hơn để phục vụ form, kiểm tra thủ công và đối chiếu dữ liệu;
  - label cấp schema gốc nếu cần đẹp tuyệt đối trên UI danh sách schema thì sẽ làm ở một wave metadata riêng.

## 9. Kết luận
- Wave chuẩn hóa này đã đóng xong phần quan trọng nhất cho seed: residue legacy, enum business và lớp property label/hints còn lệch chuẩn.
- Phần chưa chốt được hiện không phải lỗi mô hình dữ liệu cứng, mà là thiếu catalog chuẩn dùng chung cho nhóm field phân loại.
- Có thể quay lại chuẩn bị batch Phase 2 với giả định canonical hiện tại:
  - enum value dùng lowercase hoặc snake_case
  - label field dùng tiếng Việt có dấu
  - field legacy đã deprecated tiếp tục để `null` có chủ đích khi seed
