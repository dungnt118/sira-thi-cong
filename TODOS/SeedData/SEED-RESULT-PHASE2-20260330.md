# Kết quả wave hợp nhất Journey

## Trạng thái tổng quan

- Đã áp dụng thành công wave chuẩn hóa runtime theo mô hình `Journey`-centric trên backend BAC.
- `Journey` là schema vật lý đích duy nhất cho vòng đời lead, khảo sát, báo giá, triển khai, bàn giao, thanh toán và bảo hành.
- `CustomerJourneySetting` tiếp tục giữ vai trò singleton điều phối 13 bước canonical.
- `SalesPipeline` và `PipelineStage` vẫn được giữ lại như catalog vi mô cho lớp bán hàng đầu hành trình.

## Các thay đổi backend đã áp dụng

### 1. Mở rộng `Journey` để hấp thụ `ServiceRequest` và `Project`

- Đã bổ sung vào `Journey` các field:
  - `contact_phone`
  - `contact_email`
  - `sales_pipeline_id`
  - `sales_stage_id`
  - `sales_owner_user`
  - `duplicate_customer_id`
  - `delivery_pm_user`
  - `delivery_supervisor_user`
  - `planned_start_date`
  - `planned_end_date`
  - `delivery_note`
  - `latest_project_settlement_id`
  - `latest_closeout_package_id`

### 2. Chuẩn hóa catalog bán hàng

- `PipelineStage` đã được bổ sung `journey_step_code`.
- `PipelineStage.system_stage` đã bị đánh deprecated.
- 4 stage live đã được backfill:
  - `Tiếp nhận lead` -> `lead_intake`
  - `Khảo sát và tư vấn` -> `site_survey`
  - `Báo giá và thương lượng` -> `quotation_sent`
  - `Ký hợp đồng` -> `contract_signing`
- `StockOrder.source` đã được chuẩn hóa từ `project` sang `journey` để không còn phụ thuộc taxonomy cũ của `Project`.

### 3. Deprecate runtime cũ

- Toàn bộ root property của `ServiceRequest` đã bị đánh deprecated.
- Toàn bộ root property của `Project` đã bị đánh deprecated.
- Các field foreign key cũ trên downstream schema đã bị đánh deprecated, gồm hai nhóm chính:
  - nhóm `service_request_id`: `Quotation`, `SurveyAppointment`, `SurveyRecord`, `ActivityEvent`
  - nhóm `project_id`: `ProjectAssignment`, `SiteReport`, `IncidentReport`, `StockOrder`, `StockRequest`, `PaymentMilestone`, `WarrantyCase`, `HandoverAcceptance`, `HandoverIssue`, `WarrantyCard`, `WarrantyVisit`, `AssetAllocation`, `MaterialReceiptConfirmation`, `PaymentAdjustment`, `PaymentReceipt`, `DebtConfirmation`, `DebtCollectionTask`, `SalesInvoice`, `ProjectSettlement`, `ProjectCloseoutPackage`, `ActivityEvent`

### 4. Cutover menu runtime

- Đã tạo menu list mới cho `Journey`.
- Đã ẩn menu runtime cũ của `ServiceRequest`.
- Đã ẩn menu runtime cũ của `Project`.

## Backfill dữ liệu live đã làm

- Đã backfill 3 `Journey` seed canonical:
  - `JRN-2026-001`
  - `JRN-2026-002`
  - `JRN-2026-003`
- Các field sales và delivery đã được đẩy sang `Journey` ở mức an toàn:
  - `contact_phone`
  - `contact_email`
  - `sales_pipeline_id`
  - `sales_stage_id`
  - `delivery_pm_user`
  - `delivery_supervisor_user`
  - `planned_start_date`
  - `planned_end_date`
  - `delivery_note`
- `sales_owner_user` chỉ được backfill chắc chắn cho `JRN-2026-003`; các bản ghi cũ còn lại được giữ trống để tránh suy đoán sai vai trò.

## Chuẩn hóa bộ seed canonical

- `Journey-SEED-20260330.json` đã được cập nhật để phản ánh mô hình runtime mới.
- `PipelineStage-SEED-20260329.json` đã được cập nhật để mang `journey_step_code`.
- `ServiceRequest-SEED-20260330.json` đã bị loại khỏi bộ seed runtime canonical.
- `Project-SEED-20260330.json` đã bị loại khỏi bộ seed runtime canonical.
- Các seed downstream runtime được chuẩn hóa để chỉ dùng `journey_id` làm root foreign key.

## GAP còn lại

- Không tự động merge 3 bản ghi `ServiceRequest` legacy ngoài batch seed chuẩn vì chưa đủ dữ kiện để map an toàn sang `Journey`.
- Không tự suy luận `sales_owner_user` cho các bản ghi lịch sử đã chuyển sang pha triển khai nếu nguồn cũ không phân biệt rõ sale owner và delivery owner.
- Chi tiết tại: `TODOS/GAP-JOURNEY-CONSOLIDATION-MIGRATION-20260331.md`

## Kết luận

- Về metadata và seed canonical, wave hợp nhất `ServiceRequest` + `Project` vào `Journey` đã được triển khai xong.
- Việc còn lại là xử lý dữ liệu legacy ngoài batch chuẩn theo một quyết định migration riêng, không gộp mù trong wave này.
