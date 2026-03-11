# FDD - HanhChinh v4

## 1. Vai trò nghiệp vụ

Hành Chính chịu trách nhiệm phát hành, tiếp nhận và lưu trữ hồ sơ nghiệp vụ gửi ra ngoài doanh nghiệp. Đây là vai trò vận hành hồ sơ khách hàng, không phải quản trị hệ thống.

## 2. Phạm vi chức năng

| ID | Chức năng | Mô tả |
|---|---|---|
| HC-01 | Contract Dispatch Queue | Hàng đợi hợp đồng cần kiểm tra, gửi, nhận lại, lưu hồ sơ |
| HC-02 | Advance/Payment Dispatch Queue | Hàng đợi phiếu tạm ứng và đề nghị thanh toán |
| HC-03 | Document Template Library | Chọn mẫu, version, điều kiện áp dụng |
| HC-04 | Merge & Print Workspace | Ghép dữ liệu và xuất PDF/in ấn |
| HC-05 | Digital Signature Session | Tổ chức ký touch, theo dõi trạng thái chữ ký |
| HC-06 | Mail Template & CC Center | Gửi mail mẫu cho khách và nội bộ, lưu lịch sử |
| HC-07 | Digital Dossier Archive | Lưu hồ sơ số theo khách hàng/công trình/chứng từ |
| HC-08 | Cross-team Handoff Board | Phối hợp với Sale, Accountant, PM, Director |
| HC-09 | Incident Document Support | Hỗ trợ luân chuyển hồ sơ khi có phát sinh |
| HC-10 | Search, Audit & Compliance | Tra cứu hồ sơ, kiểm soát thiếu chứng từ, sai version |

## 3. Mô tả chi tiết

### 3.1 HC-01 Contract Dispatch Queue

Hệ thống cần hiển thị rõ mỗi bộ hợp đồng đang ở trạng thái nào:

- chờ kiểm tra nội dung
- chờ giám đốc ký
- đã gửi khách
- khách đã ký
- chờ nhận bản gốc/bản số
- đã lưu hồ sơ

Mỗi item cần thấy:

- số hợp đồng
- khách hàng
- công trình
- version mẫu
- người đang giữ bước tiếp theo
- deadline xử lý

### 3.2 HC-02 Advance/Payment Dispatch Queue

Tương tự hợp đồng nhưng áp dụng cho:

- phiếu tạm ứng
- đề nghị thanh toán
- chứng từ gửi khách

Phải nhìn được:

- chứng từ nào đã phát hành
- chứng từ nào khách đã nhận
- chứng từ nào đang chờ ký duyệt

### 3.3 HC-03 Document Template Library

- Quản lý danh mục mẫu theo loại
- Xem version đang hoạt động
- Chọn đúng mẫu cho:
  - hợp đồng
  - tạm ứng
  - đề nghị thanh toán
  - biên bản
  - mail mẫu

### 3.4 HC-04 Merge & Print Workspace

- Chọn hồ sơ nghiệp vụ nguồn
- Chọn template
- Merge dữ liệu
- Preview
- Xuất PDF hoặc chuẩn bị in
- Gắn số chứng từ nếu cần

### 3.5 HC-05 Digital Signature Session

- Khởi tạo phiên ký
- Chọn thứ tự người ký
- Bật chế độ ký trên thiết bị touch
- Xác nhận đã hoàn tất ký
- Sinh file bản số đã ký

### 3.6 HC-06 Mail Template & CC Center

Workbook gốc yêu cầu rõ `mail mẫu cho khách hàng và nội bộ`. Vì vậy hệ thống phải có:

- thư viện mail mẫu
- trường CC mặc định theo loại hồ sơ
- lịch sử mail đã gửi
- liên kết vào dossier hồ sơ

### 3.7 HC-07 Digital Dossier Archive

Mỗi khách hàng/công trình cần có một hồ sơ số thống nhất gồm:

- hợp đồng
- phụ lục
- phiếu tạm ứng
- đề nghị thanh toán
- biên bản nghiệm thu
- báo cáo bảo trì/bảo hành
- tài liệu thư từ liên quan

### 3.8 HC-08 Cross-team Handoff Board

Hành Chính cần bảng bàn giao để không phụ thuộc chat rời rạc:

- Sale bàn giao hồ sơ chốt
- Accountant bàn giao chứng từ tài chính
- PM/Giám sát bàn giao biên bản hiện trường
- Director bàn giao trạng thái ký duyệt

### 3.9 HC-09 Incident Document Support

Khi có phát sinh ở hiện trường hoặc bảo hành:

- theo dõi biên bản cần phát hành
- nhắc các bên cung cấp dữ liệu còn thiếu
- đảm bảo khách nhận đúng hồ sơ cập nhật

### 3.10 HC-10 Search, Audit & Compliance

Phải tìm được hồ sơ theo:

- tên khách
- số điện thoại
- địa chỉ công trình
- số hợp đồng
- số đề nghị thanh toán
- trạng thái đã ký/chưa ký

## 4. Ranh giới trách nhiệm

| Vai trò | Hành Chính làm gì | Không làm gì |
|---|---|---|
| Sale | Phối hợp gửi/nhận hồ sơ, cập nhật trạng thái khách | Không thay Sale tư vấn/chốt deal |
| Accountant | Phát hành chứng từ theo số liệu tài chính | Không tự quyết thay Kế toán về nội dung tiền |
| PM/Giám sát | Lấy biên bản hiện trường để phát hành/lưu | Không thay PM xác nhận chất lượng công việc |
| Director | Điều phối trạng thái ký | Không thay Giám đốc quyết định ký hay không |
| Admin | Dùng template/config đã được cấp quyền | Không kiêm cấu hình hệ thống sâu |

## 5. Business rules bắt buộc

1. Mọi tài liệu đi ra ngoài phải gắn `template version` hoặc có cờ ngoại lệ được audit.
2. Hành Chính không được tự sửa dữ liệu nguồn nghiệp vụ; chỉ phát hành theo dữ liệu đã được các bộ phận phụ trách xác nhận.
3. Hồ sơ đã ký phải được lưu thành `document record` bất biến.
4. Mỗi lần gửi mail hoặc giao nhận tài liệu phải có log thời gian và người thực hiện.
5. Một tài liệu không được đánh dấu `hoàn tất lưu hồ sơ` nếu chưa có file phát hành hoặc file đã ký.
6. Chữ ký touch phải gắn đúng người ký và đúng bản tài liệu snapshot tại thời điểm ký.

## 6. Gap hiện tại của prototype/code

| Hạng mục | Tình trạng hiện tại |
|---|---|
| Queue hợp đồng | Chưa có |
| Queue tạm ứng/đề nghị thanh toán | Chưa có |
| Template library nghiệp vụ | Chưa có |
| Merge preview & print | Chưa có |
| Signature session | Chưa có |
| Mail template & CC center | Chưa có |
| Dossier archive | Chưa có |
| Handoff board liên phòng ban | Chưa có |

## 7. Kết luận

Nếu không có workspace riêng cho Hành Chính, hệ thống sẽ thiếu hẳn lớp vận hành hồ sơ số và chứng từ phát hành. Đây là khoảng trống rất lớn giữa BA mức khái niệm và nhu cầu go-live thực tế.
