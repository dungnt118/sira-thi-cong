# FDD Customer Portal v4

## 1. Vai trò nghiệp vụ

Customer Portal là không gian số để khách hàng:

- theo dõi công trình đã được công bố
- xem chứng từ và minh chứng đã duyệt
- trao đổi chính thức với BAC
- gửi yêu cầu bảo hành/bảo trì

Portal không phải là bản sao của hệ thống nội bộ. Đây là lớp trình bày và giao tiếp đã được kiểm soát publish.

## 2. Phạm vi chức năng

### 2.1 PRT-F01 - Access & Identity

- truy cập qua link/token hoặc xác thực nhẹ theo số điện thoại/email
- xem danh sách công trình được cấp quyền
- quản lý vòng đời link: active, expired, revoked

### 2.2 PRT-F02 - Project Overview & Published Timeline

- xem thông tin công trình
- xem tiến độ đã công bố
- xem các mốc khảo sát, thi công, nghiệm thu, bảo hành

### 2.3 PRT-F03 - Gallery, Documents & Milestones

- xem ảnh/video đã duyệt
- xem biên bản số, hợp đồng, đề nghị thanh toán, bảo hành
- xem mốc thanh toán được publish

### 2.4 PRT-F04 - Portal Chat & Communication Evidence

- tạo và theo dõi thread trao đổi
- nhắn tin với BAC theo ngữ cảnh rõ ràng
- đính kèm file/ảnh đã được phép
- xem phản hồi chính thức và trạng thái đã đọc

### 2.5 PRT-F05 - Warranty & Maintenance Request

- gửi yêu cầu bảo hành/bảo trì
- mô tả hiện trạng
- đính kèm ảnh/video
- theo dõi trạng thái xử lý

### 2.6 PRT-F06 - Notification & Audit

- nhận thông báo khi có cập nhật công trình, chứng từ, phản hồi chat
- lưu lịch sử truy cập và tương tác

## 3. Màn hình cốt lõi

- Portal Landing
- Project Overview
- Progress Timeline
- Gallery & Evidence
- Document Center
- Payment Milestones
- Chat Inbox
- Thread Detail
- Warranty/Maintenance Request Form
- Notification Center

## 4. Business rules bắt buộc

1. Portal chỉ hiển thị dữ liệu đã được `publish`.
2. Một file chỉ được xuất hiện trên portal nếu:
   - đã có metadata trong hệ thống
   - trạng thái đồng bộ file hợp lệ
   - quyền truy cập đúng khách hàng/công trình
3. Chat trên portal phải lưu đầy đủ lịch sử và không được xóa cứng.
4. Mọi yêu cầu bảo hành/bảo trì do khách gửi phải tạo được case nội bộ hoặc ticket review.
5. Portal không hiển thị:
   - dự toán nội bộ
   - giá vốn
   - thảo luận nội bộ
   - raw link Google Drive

## 5. Gap hiện tại của prototype

Hiện package Customer Portal trong BA-V4 cũ mới dừng ở:

- portal chỉ đọc
- chưa có FDD riêng
- chưa có chat evidence
- chưa có model gửi yêu cầu bảo hành/bảo trì từ khách

Tài liệu này thay thế baseline seed đó bằng một package hoàn chỉnh hơn.
