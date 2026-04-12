# Gap-log: Journey tabs và Danh sách công việc

Ngày rà soát: 2026-04-12

## 1. Bước Tạm ứng có component nhưng không có mã `current_step`

- Hiện trạng: `Step07Advance` và group `GRP_07_DEPOSIT` tồn tại trong template, nhưng enum `journey.current_step` và `WorkTask.journey_step_code` chỉ có `contract` rồi đến `execution`, không có bước riêng cho tạm ứng.
- Ảnh hưởng: không thể chốt, thống kê hoặc giao WorkTask cho tạm ứng như một bước độc lập nếu chỉ dựa vào `current_step`.
- Xử lý tạm thời đã áp dụng: tab `Tạm ứng` được mở từ bước `contract` trở đi để không bị mồ côi.
- Đề xuất cần xác nhận: bổ sung mã bước nghiệp vụ riêng như `advance_deposit` vào schema Journey/WorkTask, hoặc xác nhận tạm ứng luôn là tab con của bước `contract`.

## 2. Tạo công việc thủ công không dùng `assignee` cụ thể

- Trạng thái: đã xử lý ngày 2026-04-12.
- Cách xử lý: bỏ field `assignee` khỏi modal `Thêm công việc`; WorkTask thủ công chỉ lưu `assignee_role` vì `assignee` sẽ deprecated.
- Bổ sung: người dùng có vai trò trùng `assignee_role` được đổi trạng thái task; QL/PM được ngoại lệ đổi trạng thái task của bước hiện tại.

## 3. Xem báo cáo từ badge WorkTask chưa focus theo task

- Trạng thái: đã xử lý ngày 2026-04-12.
- Cách xử lý: khi bấm badge báo cáo của WorkTask, URL chuyển sang tab `Nhật ký thi công` kèm `reportTaskId`; `Step08Construct` lọc timeline theo đúng `worktaskId` và có nút quay lại xem toàn bộ nhật ký.
