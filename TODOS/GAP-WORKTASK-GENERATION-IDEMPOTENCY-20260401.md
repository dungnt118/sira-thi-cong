# GAP WorkTask Generation Idempotency - 2026-04-01

## Bối cảnh

Hệ thống đã có schema `WorkTask` để lưu nhiệm vụ phát sinh theo `Journey`, `journey_step_code`, `role` và `assignee`.

Nguồn sinh task dự kiến lấy từ `CustomerJourneySetting.<step>.checklist`.

## Mô tả GAP

Checklist của từng step trong `CustomerJourneySetting` hiện chỉ có các trường:

- `name`
- `is_required`
- `description`

Hiện chưa có một khóa ổn định kiểu `task_code` hoặc `task_key` cho từng đầu việc cấu hình.

Điều này tạo ra rủi ro khi triển khai các luồng:

- Sinh task tự động nhiều lần cho cùng một `Journey`
- Đồng bộ lại task sau khi PM đổi người được giao
- Rebuild task khi cấu hình checklist thay đổi
- Tránh tạo trùng task khi cùng một checklist item đã từng được sinh trước đó

## Ảnh hưởng nếu làm sai

- Có thể sinh trùng nhiều `WorkTask` cho cùng một đầu việc.
- Không xác định chắc chắn được task nào là “bản mới” hay “bản cũ”.
- Việc đổi `name` trong checklist sẽ làm mất khả năng đối chiếu lịch sử nếu hệ thống đang dùng `title` làm khóa mềm.

## Phương án xử lý

### Phương án 1

Bổ sung `task_code` vào từng item của `CustomerJourneySetting.<step>.checklist`.

Ưu điểm:

- Làm khóa nghiệp vụ ổn định cho việc generate/upsert task.
- Dễ kiểm soát dữ liệu và migrate về sau.

Nhược điểm:

- Cần chỉnh schema `CustomerJourneySetting` và cập nhật dữ liệu seed cấu hình.

### Phương án 2

Tạm thời dùng khóa mềm ghép từ `journey_step_code + role + title`.

Ưu điểm:

- Không cần đổi schema cấu hình ngay.

Nhược điểm:

- Dễ sai khi đổi tên task hoặc dùng cùng một tiêu đề cho nhiều đầu việc gần giống nhau.
- Không thật sự idempotent.

## Khuyến nghị

Khuyến nghị chọn **Phương án 1** ở wave tiếp theo: bổ sung `task_code` cho từng item checklist trong `CustomerJourneySetting`.

Trong khi chưa làm bước đó, runtime generate task nên coi `WorkTask` là hợp lệ cho tạo mới và xử lý SLA, nhưng chưa nên cam kết cơ chế regenerate/upsert nhiều lần theo checklist.
