# Hướng dẫn vận hành - Sale v4

## 1. Chu kỳ làm việc hằng ngày

1. Mở `SLA queue` để xử lý lead sắp quá hạn và quá hạn.
2. Cập nhật kết quả gọi điện/tư vấn cho từng service request.
3. Xác nhận các lịch khảo sát cần diễn ra trong ngày.
4. Theo dõi báo giá đang chờ phản hồi.
5. Theo dõi hợp đồng, tạm ứng, thanh toán cần follow.
6. Xem các phát sinh hiện trường có ảnh hưởng đến giao tiếp khách hàng.
7. Lên lịch chăm sóc sau công trình và cơ hội bán thêm.

## 2. Quy trình thao tác chuẩn

### 2.1 Khi có lead mới

- Tạo hoặc nhận `Service Request`
- Kiểm tra gợi ý trùng khách
- Chốt lịch gọi theo SLA
- Ghi rõ nguồn lead và nhu cầu sơ bộ

### 2.2 Khi đã tư vấn xong

- Chọn đúng kết quả:
  - hẹn khảo sát
  - theo dõi lại
  - từ chối
- Nếu hẹn khảo sát, phải tạo lịch ngay thay vì chỉ ghi chú tự do

### 2.3 Khi gửi giải pháp/báo giá

- Kiểm tra dữ liệu khảo sát đã đủ
- Chọn đúng version tài liệu
- Xem preview trước khi gửi
- Ghi nhận ngày gửi và người nhận

### 2.4 Khi theo hợp đồng/tạm ứng/thanh toán

- Mọi lần nhắc khách phải có log
- Nếu khách chưa thanh toán, phải ghi rõ lý do và ngày hẹn lại
- Không tự đổi trạng thái `đã thu` nếu chưa có xác nhận từ Kế toán

### 2.5 Khi có phát sinh hiện trường

- Nhận thông tin từ PM/Giám sát
- Thống nhất thông điệp gửi khách
- Ghi lại cam kết đã trao đổi

### 2.6 Khi chăm sóc sau công trình

- Dùng lịch chăm sóc đã cấu hình
- Ghi lại nhu cầu mới nếu có
- Nếu phát sinh cơ hội mới, tạo `Service Request` mới thay vì ghi rời rạc

## 3. Những lỗi Sale cần tránh

- Để lead quá SLA nhưng không có log xử lý
- Gửi báo giá/hợp đồng từ file cũ ngoài hệ thống
- Không cập nhật follow-up hợp đồng/tạm ứng/thanh toán
- Dùng ghi chú tự do thay cho trạng thái chuẩn
- Tạo khách trùng do không kiểm tra gợi ý hợp nhất
