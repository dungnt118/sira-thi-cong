# GAP migration hợp nhất `ServiceRequest` và `Project` vào `Journey`

## Bối cảnh

Backend BAC đã được chuẩn hóa theo mô hình runtime mới:

- `Journey` là schema trung tâm duy nhất.
- `ServiceRequest` và `Project` đã bị deprecate ở cấp metadata/runtime.
- Các seed canonical mới chỉ còn bám `journey_id`.

Tuy nhiên tenant live vẫn còn một số bản ghi lịch sử nằm ngoài batch seed chuẩn. Các bản ghi này không đủ dữ kiện để tự động hợp nhất an toàn sang `Journey`.

## Các bản ghi đang bị block migration

### 1. `ServiceRequest.code = YC-20260330-003`

- `_id = 69c9e53f1e264278da741a98`
- Có `customer_id`
- Không có `journey_id`
- Không có `sales_pipeline_id` hoặc `sales_stage_id` ổn định để map
- Trạng thái legacy là `in_progress`

### 2. `ServiceRequest.code = YC-20260331-001`

- `_id = 69cb57821265d63bececab31`
- Có `customer_id`, `contact_phone`, `contact_email`
- Có `pipeline_id`
- Không có `stage_id`
- Không có `journey_id`
- Trạng thái legacy là `new`

### 3. `ServiceRequest.code = sanmai`

- `_id = 69c7f189a718dc692a22b79e`
- Có `contact_phone`, `contact_email`, `name`, `code`
- Không có `customer_id`
- Không có `journey_id`
- Trạng thái legacy là `new`

## GAP nghiệp vụ chưa thể tự suy đoán

### GAP 1. Không đủ dữ kiện map `status` cũ sang `current_step` mới

- `ServiceRequest.status` cũ không tương đương 1-1 với `CustomerJourneySetting.current_step`.
- Ví dụ:
  - `new` có thể là `lead_intake` hoặc một pha sàng lọc nội bộ trước `site_survey`
  - `in_progress` có thể đang ở `site_survey`, `quotation_sent` hoặc `contract_signing`

Nếu tự map cứng theo cảm tính, tenant sẽ có rủi ro sai dashboard, sai SLA, sai owner handoff và sai báo cáo funnel.

### GAP 2. Không đủ dữ kiện xác định `sales_owner_user`

- Dữ liệu cũ có `assigned_pm_id` nhưng không chứng minh đó là sale owner hay delivery owner.
- Với các hành trình đã chuyển sang pha triển khai, việc gán `assigned_pm_id` sang `sales_owner_user` là suy đoán.

### GAP 3. Một số bản ghi thiếu khóa tối thiểu để tạo `Journey`

- Trường hợp `sanmai` không có `customer_id`.
- Nếu tạo `Journey` mới từ bản ghi này, dữ liệu sẽ không đạt chuẩn nghiệp vụ tối thiểu của batch canonical.

## Ảnh hưởng nếu xử lý sai

- Sai `current_step` dẫn tới sai trạng thái hành trình trên dashboard và workflow.
- Sai `sales_owner_user` dẫn tới sai ownership, sai KPI sale và sai phân quyền xử lý.
- Tạo `Journey` không có `customer_id` làm hỏng chuẩn dữ liệu lõi của tenant.
- Backfill mù còn có thể gây lệch các summary field tài chính, portal và điều phối thi công.

## Các phương án xử lý

### Phương án A. Xác nhận thủ công từng bản ghi legacy rồi mới migrate

Thực hiện:

- Xác nhận `customer_id` chuẩn cho từng bản ghi.
- Xác nhận `current_step` canonical cho từng bản ghi.
- Xác nhận `sales_owner_user` nếu vẫn cần giữ bối cảnh bán hàng.
- Sau đó mới tạo hoặc cập nhật `Journey` tương ứng và nối lại các liên kết.

Ưu điểm:

- An toàn nghiệp vụ cao nhất.
- Không làm bẩn dữ liệu runtime mới.

Nhược điểm:

- Tốn thời gian rà thủ công.

### Phương án B. Archive hoặc loại bỏ các bản ghi legacy không còn giá trị vận hành

Thực hiện:

- Rà usage của:
  - `YC-20260330-003`
  - `YC-20260331-001`
  - `sanmai`
- Nếu không còn được form/view/report/workflow sử dụng, archive hoặc xóa khỏi tenant live.

Ưu điểm:

- Nhanh làm sạch tenant.
- Giảm công migration thủ công.

Nhược điểm:

- Mất dấu vết lịch sử nếu vẫn còn nhu cầu truy xuất.

### Phương án C. Tạo `Journey` tạm với cờ dữ liệu chưa chuẩn

Thực hiện:

- Chỉ áp dụng cho các record có đủ `customer_id`.
- Tạo `Journey` mới với `current_step` tạm theo rule do user chốt.
- Gắn cờ nội bộ như `migration_note` hoặc `data_quality_status` để xử lý tiếp.

Ưu điểm:

- Nhanh gom dữ liệu về một schema.

Nhược điểm:

- Không phù hợp với nguyên tắc hiện tại là không tự suy đoán khi còn GAP logic.
- Dễ phát sinh nợ dữ liệu kéo dài.

## Khuyến nghị

- Ưu tiên Phương án A cho các record còn giá trị vận hành.
- Ưu tiên Phương án B cho các record test, probe hoặc legacy không còn được dùng.
- Không áp dụng migrate mù theo `ServiceRequest.status`.
- Không tự gán `assigned_pm_id` thành `sales_owner_user` nếu chưa có xác nhận nghiệp vụ.

## Quyết định chờ user xác nhận

1. `YC-20260330-003` có còn là record thật cần giữ không?
2. `YC-20260331-001` nên map vào `lead_intake` hay phải bổ sung `sales_stage_id` thật trước khi tạo `Journey`?
3. `sanmai` là dữ liệu test hay nghiệp vụ thật, và nếu là thật thì `customer_id` chuẩn là gì?
4. Có chấp nhận dùng `assigned_pm_id` cũ làm `sales_owner_user` trong các bản ghi lịch sử hay không?
