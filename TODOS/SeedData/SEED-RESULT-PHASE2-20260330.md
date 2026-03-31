# Kết quả wave hợp nhất Journey

## Trạng thái tổng quan

- Đã áp dụng thành công wave chuẩn hóa runtime theo mô hình `Journey`-centric trên backend BAC.
- `Journey` là schema vật lý đích duy nhất cho vòng đời lead, khảo sát, báo giá, triển khai, bàn giao, thanh toán và bảo hành.
- `CustomerJourneySetting` tiếp tục giữ vai trò singleton điều phối 13 bước canonical.
- `SalesPipeline` và `PipelineStage` vẫn được giữ lại như catalog vi mô cho lớp bán hàng đầu hành trình.

## Các thay đổi backend đã áp dụng

### 1. Mở rộng `Journey` để hấp thụ `ServiceRequest` và `Project`

Đã bổ sung vào `Journey` các field:

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

- `PipelineStage` đã có `journey_step_code`.
- `PipelineStage.system_stage` đã bị đánh deprecated.
- Các stage bán hàng live đã được backfill theo tập bước canonical.

### 3. Chuẩn hóa liên kết downstream về `journey_id`

- Các field legacy `project_id` và `service_request_id` đã được đánh deprecated trên các schema downstream liên quan.
- Các field legacy còn `required=true` đã được nới về optional để không còn chặn seeding `Journey-first`.
- Các field hiển thị cũ `project_name` trên nhóm schema vận hành đã được hạ xuống legacy.

### 4. Chuẩn hóa display field mới `journey_name`

Đã bổ sung `journey_name` làm field hiển thị chuẩn mới trên các schema:

- `AssetAllocation`
- `PaymentMilestone`
- `StockRequest`
- `StockOrder`
- `WarrantyCard`
- `WarrantyReminder`

### 5. Chuẩn hóa nguồn gốc kho vận

- `StockOrder.source` đã chuyển về taxonomy mới có `journey`.
- `StockOrder.source_id` đã bị hạ xuống legacy.
- `StockOrder` đã có cặp field chuẩn mới:
  - `journey_source_id`
  - `distributor_source_id`

### 6. Cutover menu runtime

- Đã tạo menu list mới cho `Journey`.
- Đã ẩn menu runtime cũ của `ServiceRequest`.
- Đã ẩn menu runtime cũ của `Project`.

## Cleanup dữ liệu live đã làm

- Đã xóa toàn bộ seed live cũ của `Project`.
- Đã xóa toàn bộ seed live cũ của `ServiceRequest`.
- `Project` hiện không còn bản ghi seed chuẩn trên tenant.

## Tình trạng dữ liệu legacy còn sót

- Vẫn còn 3 record `ServiceRequest` legacy cá nhân và 1 record `MasterDataCategory.crm` legacy cá nhân.
- Các record này không xóa được bằng luồng seed-delete hiện có do backend chặn bởi ownership cá nhân.
- Chi tiết tại `TODOS/GAP-JOURNEY-CONSOLIDATION-MIGRATION-20260331.md`.

## Chuẩn hóa bộ seed canonical

- `Journey-SEED-20260330.json` đã phản ánh mô hình runtime mới.
- `PipelineStage-SEED-20260329.json` đã mang `journey_step_code`.
- `ServiceRequest-SEED-20260330.json` và `Project-SEED-20260330.json` đã bị loại khỏi batch runtime canonical.
- Các seed downstream runtime đã chuẩn hóa về `journey_id`.
- Các seed hiển thị mới đã chuyển sang `journey_name` thay cho `project_name`.
- `StockOrder` seed đã chuyển từ `source_id` sang `journey_source_id` / `distributor_source_id`.

## Kiểm tra cuối

- Toàn bộ `46` file `*-SEED-*.json` trong `TODOS/SeedData` parse thành công.
- Bộ seed canonical hiện không còn khóa legacy sau trong JSON:
  - `project_id`
  - `service_request_id`
  - `project_name`
  - `source_id`

## Kết luận

- Về metadata và seed canonical, wave hợp nhất `ServiceRequest` + `Project` vào `Journey` đã được triển khai xong.
- Phần còn lại chỉ là cleanup dữ liệu mồ côi bị chặn bởi ownership backend, không còn là blocker nghiệp vụ cho seeding `Journey-first`.
