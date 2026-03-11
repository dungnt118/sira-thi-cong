# FDD - Sale v4

## 1. Vai trò nghiệp vụ

Sale là đầu mối quan hệ khách hàng trước hợp đồng và tiếp tục giữ nhịp giao tiếp sau đó. Sale chịu trách nhiệm:

- tiếp nhận lead
- phản hồi đúng SLA
- điều phối khảo sát
- gửi giải pháp/báo giá
- theo đuổi hợp đồng, tạm ứng, thanh toán
- chăm sóc sau công trình

Sale không chịu trách nhiệm thay PM cho điều phối nội bộ, nhưng phải có công cụ đủ sâu để không bỏ sót các điểm chạm với khách hàng.

## 2. Phạm vi chức năng

| ID | Chức năng | Mô tả |
|---|---|---|
| SAL-01 | Lead & Service Request Intake | Nhận lead từ MKT hoặc nhập trực tiếp, tạo service request linh hoạt |
| SAL-02 | SLA Contact Center | Theo dõi deadline gọi khách, trạng thái đã liên hệ/chưa liên hệ |
| SAL-03 | Consultation Workspace | Lưu kịch bản gọi điện, ghi chú tư vấn sơ bộ, nhu cầu, vị trí xử lý |
| SAL-04 | Survey Coordination | Hẹn khảo sát, phối hợp kỹ thuật, theo dõi khảo sát đã diễn ra/chưa |
| SAL-05 | Solution & Summary Package | Gửi báo cáo tổng hợp, process làm việc, giải pháp đề xuất |
| SAL-06 | Quotation Workspace | Lập nhiều phiên bản báo giá, nhận công thức giá, gửi khách, chốt thắng/thua |
| SAL-07 | Contract Follow-up | Theo dõi hợp đồng, chọn mẫu, phát hành yêu cầu ký, biết đang chờ ai |
| SAL-08 | Advance & Payment Follow-up | Theo dõi đợt tạm ứng/đề nghị thanh toán, nhắc khách và cập nhật kết quả |
| SAL-09 | Delivery Incident Coordination | Phối hợp xử lý tình huống với PM/Supervisor trong thi công, nghiệm thu, bảo hành |
| SAL-10 | After-sales & Upsell | Chăm sóc sau công trình, gợi ý gói dịch vụ bổ sung, lưu cơ hội mới |

## 3. Mô tả chi tiết theo module

### 3.1 SAL-01 Lead & Service Request Intake

- Tạo `Service Request` từ:
  - lead MKT
  - hotline
  - giới thiệu
  - khách hàng cũ
- Hệ thống phải:
  - gợi ý khách hàng trùng
  - cho phép chọn khách cũ
  - hoặc sinh khách mới trong cùng màn tạo yêu cầu
- Trường tối thiểu:
  - tên liên hệ
  - số điện thoại
  - địa chỉ công trình
  - nhu cầu sơ bộ
  - nguồn lead
  - thời điểm lead vào

### 3.2 SAL-02 SLA Contact Center

SLA theo workbook:

- giờ hành chính: `30 phút`
- ngoài giờ hành chính: `60 phút`
- sau `22:00`: dời sang `08:30` sáng hôm sau

Hệ thống cần:

- timer SLA cho từng lead
- nhãn `sắp quá hạn`, `quá hạn`, `đã gọi`, `không liên lạc được`
- hàng đợi follow-up theo cá nhân/nhóm sale
- log mỗi lần gọi

### 3.3 SAL-03 Consultation Workspace

- Lưu `kịch bản gọi điện`
- Lưu nội dung tư vấn sơ bộ:
  - vị trí cần xử lý
  - mức độ khẩn cấp
  - ngân sách ước lượng
  - kỳ vọng thời gian
- Lưu kết quả:
  - hẹn khảo sát
  - gửi tài liệu giới thiệu
  - từ chối/không phù hợp

### 3.4 SAL-04 Survey Coordination

- Tạo lịch khảo sát
- Chọn người khảo sát/phòng ban phối hợp
- Gửi xác nhận cho khách
- Theo dõi:
  - đã hẹn
  - đã khảo sát
  - cần khảo sát lại
- Liên kết tới:
  - phiếu khảo sát
  - ảnh/video hiện trạng
  - báo cáo tổng hợp công trình

### 3.5 SAL-05 Solution & Summary Package

Sale cần một workspace để ghép và gửi trọn bộ:

- báo cáo tổng hợp
- process làm việc với khách
- giải pháp xử lý theo từng vị trí
- tài liệu hình ảnh/tệp đính kèm liên quan

Đây là điểm mà V4 cũ chưa mô tả rõ, dù workbook gốc yêu cầu trực tiếp.

### 3.6 SAL-06 Quotation Workspace

- Nhận số liệu kỹ thuật, diện tích, ảnh, giá nền
- Tạo nhiều version báo giá
- So sánh version
- Đánh dấu `gửi khách`, `đang đàm phán`, `thắng`, `thua`
- Gắn lý do thua nếu thất bại
- Sinh PDF báo giá theo `template`

### 3.7 SAL-07 Contract Follow-up

- Chọn mẫu hợp đồng phù hợp
- Merge dữ liệu từ service request/quotation
- Phát hành hợp đồng cho Hành Chính hoặc trực tiếp gửi ký nếu được phân quyền
- Theo dõi trạng thái:
  - chờ kiểm tra
  - chờ giám đốc ký
  - đã gửi khách
  - khách đã ký
  - chờ nhận bản gốc/bản số
- Lưu lịch sử follow-up

### 3.8 SAL-08 Advance & Payment Follow-up

- Xem timeline đợt tạm ứng và đợt thanh toán
- Nhận thông báo khi Hành Chính/Kế toán đã phát hành chứng từ
- Ghi lại:
  - đã nhắc khách
  - khách hẹn ngày thanh toán
  - lý do chậm
  - cam kết xử lý tiếp theo

### 3.9 SAL-09 Delivery Incident Coordination

- Nhận cảnh báo khi dự án có phát sinh ảnh hưởng khách hàng
- Có luồng trao đổi với PM/Supervisor
- Ghi lại hướng xử lý đã chốt với khách
- Dùng tiếp trong:
  - nghiệm thu
  - bảo hành

### 3.10 SAL-10 After-sales & Upsell

- Lưu lịch chăm sóc sau công trình
- Ghi nhận mức hài lòng
- Tạo service request mới từ cơ hội upsell
- Liên kết lại khách hàng cũ và lịch sử công trình đã hoàn thành

## 4. Màn hình và khu vực làm việc cốt lõi

Sale cần tối thiểu các khu vực sau:

- Intake inbox
- SLA queue
- Customer/Service Request list
- Kanban pipeline
- Consultation log
- Survey coordination
- Summary package
- Quotation workspace
- Contract follow-up
- Advance/payment follow-up
- Incident coordination
- After-sales workspace

## 5. Business rules bắt buộc

1. Lead mới phải được đưa vào hàng đợi SLA ngay khi vào hệ thống.
2. Sale có thể tạo `Service Request` trước, hệ thống tự sinh `Customer` nếu chưa có.
3. Một `Customer` có thể có nhiều `Service Request`.
4. Mỗi lần gửi báo giá phải gắn với một `quotation version`.
5. Sale không được sửa dữ liệu kỹ thuật đã được khóa sau khi đã phát hành hợp đồng, trừ khi có `change order`.
6. Trạng thái hợp đồng/tạm ứng/thanh toán phải lấy từ nguồn nghiệp vụ chuẩn, không nhập tay rời rạc.
7. Tất cả tài liệu gửi khách phải sinh từ `template version` hợp lệ hoặc được audit nếu chỉnh tay.

## 6. Gap hiện tại của prototype/code

| Hạng mục | Tình trạng hiện tại |
|---|---|
| Customer list / detail | Có prototype dưới route PM |
| Service Request list / detail / kanban | Có prototype dưới route PM |
| Survey form | Có prototype dưới route PM |
| Quotation | Có prototype dưới route PM |
| SLA queue cho Sale | Chưa có |
| Consultation log chuẩn | Chưa có |
| Summary package gửi khách | Chưa có workspace riêng |
| Contract follow-up dashboard | Chưa có |
| Advance/payment follow-up cho Sale | Chưa có |
| After-sales / upsell | Chưa có |
| Template-based document generation | Chưa có |
| Digital signature flow | Chưa có |

## 7. Kết luận

Sale trong BA-V4 phải được nhìn như một workspace vận hành khách hàng đầu-cuối, không chỉ là vài màn CRM list/detail. Nếu không làm đủ chiều sâu này, hệ thống sẽ rất dễ mất yêu cầu nghiệp vụ quan trọng ở các bước hợp đồng, tạm ứng, thanh toán và chăm sóc sau công trình.
