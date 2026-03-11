# Screen Inventory - Customer Portal v4

## 1. Nguyên tắc đọc bảng

- `Route/prototype hiện có`: trạng thái màn trong codebase hiện tại
- `Trạng thái`: `Đã có seed`, `Có một phần`, `Chưa có`

## 2. Danh mục màn hình

| Mã | Màn hình | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PRT-01 | Portal Landing | Xác thực và chọn công trình | Chưa thấy page riêng | Chưa có |
| PRT-02 | Project Overview | Xem thông tin tổng quan công trình | Chưa thấy page riêng | Chưa có |
| PRT-03 | Progress Timeline | Xem timeline tiến độ đã công bố | Chưa thấy page riêng | Chưa có |
| PRT-04 | Gallery & Evidence | Xem ảnh/video minh chứng đã duyệt | Chưa thấy page riêng | Chưa có |
| PRT-05 | Document Center | Xem hợp đồng, biên bản, bảo hành, chứng từ | Chưa thấy page riêng | Chưa có |
| PRT-06 | Payment Milestones | Xem mốc thanh toán đã công bố | Chưa thấy page riêng | Chưa có |
| PRT-07 | Chat Inbox | Xem danh sách thread trao đổi | Chưa có | Chưa có |
| PRT-08 | Thread Detail | Đọc/gửi tin nhắn và file đính kèm | Chưa có | Chưa có |
| PRT-09 | Warranty/Maintenance Request | Gửi yêu cầu bảo hành/bảo trì | Chưa có | Chưa có |
| PRT-10 | Notification Center | Xem thông báo mới từ BAC | Chưa có | Chưa có |
| PRT-11 | Access History | Xem lịch sử đã xem/phản hồi nếu cần hiển thị cho nội bộ | Chưa có | Chưa có |

## 3. Kết luận inventory

Customer Portal hiện gần như chưa có prototype thực tế trong codebase. Nếu muốn triển khai portal như một kênh giao tiếp và bằng chứng chính thức, cần coi package này là backlog mới bắt buộc chứ không phải phần mở rộng tùy chọn.
