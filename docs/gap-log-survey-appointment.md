# Gap-log: Quản lý lịch hẹn khảo sát

Ngày rà soát: 2026-04-12

## 1. Trạng thái mock cũ không khớp schema SurveyAppointment

- Hiện trạng cũ: tab Lịch hẹn dùng trạng thái `SCHEDULED`, `SUCCESS`, `FAILED`, `CANCELLED`.
- Contract hiện có: `SurveyAppointment.appointment_status` chỉ hỗ trợ `draft`, `scheduled`, `confirmed`, `rescheduled`, `cancelled`.
- Ảnh hưởng: không nên lưu “thành công/thất bại khảo sát” vào `SurveyAppointment` vì đây là kết quả khảo sát, không phải trạng thái đặt lịch.
- Xử lý đã áp dụng: tab Lịch hẹn chỉ quản lý vòng đời lịch hẹn. Kết quả khảo sát cần xử lý tại bước Khảo sát hoặc schema kết quả khảo sát phù hợp.

## 2. Chưa có contract kiểm tra trùng lịch/người phụ trách

- Hiện trạng: `SurveyAppointment` chưa có API/contract kiểm tra availability của `assigned_user` theo thời gian.
- Ảnh hưởng: người dùng có thể đặt hai lịch cùng thời điểm cho cùng một người nếu backend không chặn.
- Đề xuất cần xác nhận: bổ sung rule backend hoặc API kiểm tra trùng lịch trước khi tạo/cập nhật lịch hẹn.

## 3. Chưa có contract thông báo cho khách hàng

- Hiện trạng: schema có `confirmed_by_customer` và `confirmed_at`, nhưng chưa thấy service gửi thông báo hoặc portal confirm link cho khách.
- Ảnh hưởng: thao tác “Khách đã xác nhận” hiện là ghi nhận nội bộ do người dùng cập nhật.
- Đề xuất cần xác nhận: bổ sung flow gửi thông báo/SMS/Zalo/email hoặc xác nhận qua portal nếu nghiệp vụ yêu cầu khách tự xác nhận.
