# GAP: Chuẩn hóa `CustomerJourneySetting` theo mô hình step mới

## Bối cảnh

Người dùng yêu cầu chuẩn hóa lại toàn bộ cấu hình step của `CustomerJourneySetting` theo hướng:

- Loại bỏ dần các field cũ: `step_order`, `step_code`, `step_name`, `entry_status`, `done_status`, `checklist_template_id`, `from_role_id`, `to_role_id`, `handoff_required`
- Bổ sung `roles` để mô tả quyền theo vai trò ở từng step
- Bổ sung `checklist` nội tuyến ngay trong từng step
- Tiến tới loại bỏ `ChecklistTemplate`

## GAP 1: Nested `Lookup` đang bị backend ép về `ObjectId`

Khi cập nhật field con `roles.role_code` với:

- `propType = Lookup`
- `refSchemas = ["Role"]`

backend hiện không giữ nguyên `Lookup`, mà tự ép field nested này về `ObjectId`.

### Ảnh hưởng

- Không thể triển khai đúng 100% yêu cầu `roleCode` lưu theo `Role.code` bằng tool hiện tại.
- Nếu vẫn tiếp tục triển khai ngay, mô hình khả thi nhất ở backend là:
  - `roles.role_id`: `ObjectId`, tham chiếu `Role`
  - `permissions`: `Tags`

### Hướng xử lý tạm thời

- Chấp nhận lưu tham chiếu vai trò theo `ObjectId` để không chặn tiến độ cấu hình.
- Ghi rõ đây là sai lệch kỹ thuật so với mục tiêu `Lookup -> Role.code`.
- Nếu cần đúng tuyệt đối theo `Role.code`, backend metadata layer cần được hiệu chỉnh để nested `Lookup` không bị ép kiểu.

## GAP 2: Frontend PM đang bám shape dữ liệu cũ

Trang:

- `src/pages/pm/Settings/CustomerJourneySettingPage.tsx`

đang đọc/ghi cấu hình step theo shape cũ:

- root step lưu kiểu `array-of-one`
- còn phụ thuộc các field cũ như `owner_role_id`, `checklist_template_id`, `entry_status`, `done_status`, `from_role_id`, `to_role_id`, `handoff_required`

### Ảnh hưởng

- Nếu xóa vật lý ngay các field cũ khỏi schema/content, màn hình cấu hình hiện tại có nguy cơ lỗi runtime.
- Trong wave hiện tại chỉ nên:
  - thêm cấu trúc mới
  - migrate dữ liệu sang field mới
  - đánh `deprecated` cho field cũ

### Hướng xử lý tạm thời

- Chưa xóa vật lý các field cũ khỏi schema trong wave này.
- Chỉ đánh `deprecated` cho field cũ để backend và seed chuyển dần sang mô hình mới.
- Wave tiếp theo cần refactor frontend PM để đọc `roles` và `checklist` thay vì các field legacy.

## GAP 3: Ma trận quyền theo từng step chưa đủ dữ kiện nghiệp vụ

Dữ liệu hiện tại chỉ thể hiện khá rõ:

- `owner_role_id`: vai trò phụ trách chính

Nhưng chưa có quy ước đủ rõ để suy ra đầy đủ:

- vai trò nào chỉ được xem
- vai trò nào được sửa
- vai trò nào chịu trách nhiệm ở từng step

### Ảnh hưởng

- Không nên tự suy đoán đầy đủ toàn bộ ma trận quyền cho 13 step.

### Hướng xử lý tạm thời

- Migrate an toàn từ `owner_role_id` sang `roles` với bộ quyền đầy đủ:
  - `view`
  - `edit`
  - `commit`
- Các quyền phụ cho vai trò khác sẽ để trống và cần chốt ở wave nghiệp vụ tiếp theo.

## Quyết định triển khai trong wave hiện tại

- Chuẩn hóa schema step theo hướng mới:
  - thêm `roles`
  - thêm `checklist`
- Inline checklist từ `ChecklistTemplate.steps` vào `CustomerJourneySetting`
- Đánh `deprecated` cho các field legacy đã nêu
- Chưa xóa vật lý ngay field cũ khỏi schema
- Chưa thể xóa schema `ChecklistTemplate` bằng tool hiện có; chỉ dừng ở mức loại bỏ phụ thuộc runtime vào schema này
