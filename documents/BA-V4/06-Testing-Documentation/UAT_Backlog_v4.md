# UAT Backlog v4

## 1. Mục tiêu

Thiết lập các kịch bản UAT tối thiểu để dự án không lặp lại tình trạng:

- có màn hình
- có demo flow
- nhưng không kiểm chứng được khả năng vận hành thật

## 2. Nhóm kịch bản UAT bắt buộc

| ID | Kịch bản | Vai trò chính | Kết quả mong đợi |
|---|---|---|---|
| UAT-01 | Tạo khách hàng mới và service request mới | PM | Service request sinh đúng pipeline/stage |
| UAT-02 | Chuyển stage trong pipeline có playbook | PM/Admin | Nhiệm vụ con được sinh đúng |
| UAT-03 | Tạo 2 báo giá cho cùng một service request | PM | Lưu đúng version, chỉ một bản thắng |
| UAT-04 | Convert báo giá thắng sang hợp đồng và project | PM | Dự án sinh đủ dữ liệu nền |
| UAT-05 | Tạo task dự án, giao Supervisor/Worker | PM | Owner, due date, dependency đúng |
| UAT-06 | Worker ký nhận vật tư rồi mới mở task thi công | Worker/Accountant | Task bị khóa/mở đúng theo rule |
| UAT-07 | Worker upload evidence, Supervisor duyệt/từ chối | Worker/Supervisor | Evidence và checklist cập nhật đúng |
| UAT-08 | Báo cáo sự cố trong khi task đang chạy | Worker/Supervisor/PM | Sự cố vào đúng luồng xử lý |
| UAT-09 | Nghiệm thu và đóng dự án | Supervisor/PM/Accountant | Sinh acceptance record, kích hoạt thanh toán cuối |
| UAT-10 | Tạo bảo hành và lịch bảo dưỡng | Accountant | Có warranty card và reminder |
| UAT-11 | Khách hàng xem portal | Customer Portal | Chỉ thấy dữ liệu đã công bố |
| UAT-12 | Admin tra audit log | Admin | Truy được toàn bộ chuỗi hành động |

## 3. Kịch bản edge case phải test

| ID | Tình huống | Kỳ vọng |
|---|---|---|
| EDGE-01 | Khách hàng cũ tạo service request mới | Không trùng customer, tạo request mới |
| EDGE-02 | Chuyển pipeline khi request đang giữa chặng | Có map stage và lưu lịch sử |
| EDGE-03 | Quote bị từ chối, tạo quote mới | Lưu đủ lịch sử thương lượng |
| EDGE-04 | Thiếu vật tư ở giữa chừng | Task liên quan bị chặn đúng |
| EDGE-05 | Đổi người phụ trách PM/Supervisor | Không mất lịch sử và task ownership |
| EDGE-06 | Thu tiền sai số so với kế hoạch | Có transaction, reason và audit |
| EDGE-07 | Thu hồi portal link | Link cũ không truy cập được nữa |
| EDGE-08 | Dự án bị hủy giữa chừng | Có hoàn kho/cancel flow/audit |

## 4. Tiêu chí pass UAT của giai đoạn pilot

Pilot chỉ được xem là đạt khi:

1. Toàn bộ `UAT-01` đến `UAT-10` pass
2. Ít nhất 6/8 edge case pass
3. Không có lỗi `Critical` làm sai dữ liệu
4. Có thể dựng báo cáo tháng từ dữ liệu thật của pilot

## 5. Kết quả đầu ra cần lưu sau UAT

- Danh sách test case pass/fail
- Issue log
- Mức độ ảnh hưởng theo vai trò
- Dữ liệu sample để tái hiện lỗi
- Quyết định go/no-go

