# Phân tích vai trò Sale và Hành Chính theo công trình khách hàng v4

## 1. Nguồn gốc phân tích

Tài liệu này bóc tách trực tiếp từ workbook:

- `documents/Orignal-Requirements-Docs/2. QUY TRÌNH/QUY TRÌNH LÀM VIỆC VỚI KHÁCH HÀNG/Customer Junior - Hành trình trải nghiệm khách hàng.xlsx`

Workbook có 2 sheet chính:

- `Hành trình trải nghiệm khách hà`: mô tả trách nhiệm theo từng bộ phận trên 13 bước trải nghiệm khách hàng.
- `Nội dung cần thực hiện`: liệt kê các biểu mẫu, kịch bản gọi điện, báo cáo và tài liệu chuẩn còn thiếu.

## 2. Kết luận trọng yếu rút ra từ workbook

1. Vai trò `Sale/Kinh doanh` phải được mô hình hóa thành actor nghiệp vụ riêng, không nên gộp hoàn toàn vào `PM`.
2. Vai trò `Hành Chính` là actor điều phối hồ sơ và giao nhận chứng từ, khác hoàn toàn với `Admin quản trị hệ thống`.
3. Hệ thống cần một lớp chức năng mới cho `Quản lý mẫu tài liệu` và `Chữ ký điện tử` vì workbook yêu cầu nhiều loại hồ sơ số lặp lại xuyên suốt công trình khách hàng.
4. Chuỗi trước hợp đồng và sau nghiệm thu đều có hoạt động follow-up rõ ràng, nên BA không thể chỉ mô tả đến bước tạo dự án.
5. Hệ thống phải quản lý được cả `bản giấy`, `bản PDF sinh tự động`, `bản đã ký touch`, và `hồ sơ số lưu trữ`.

## 3. Bóc tách trách nhiệm theo từng bước công trình

| Bước | Sale/Kinh doanh | Hành Chính | Liên kết bắt buộc |
|---|---|---|---|
| 1. Thông tin khách hàng | Tiếp nhận lead từ MKT hoặc nguồn trực tiếp | Chưa thao tác chính | MKT, CRM intake |
| 2. Liên hệ/Tư vấn | Gọi khách theo SLA, tư vấn sơ bộ, dùng kịch bản gọi điện | Chưa thao tác chính | Customer, MKT |
| 3. Khảo sát | Hẹn khách, phối hợp kỹ thuật khảo sát | Chưa thao tác chính | Kỹ thuật, Giám sát |
| 4. Xây dựng giải pháp | Gửi báo cáo tổng hợp, gửi process làm việc, duyệt giải pháp với khách | Chưa thao tác chính | Kỹ thuật, Customer |
| 5. Báo giá | Nhập số liệu, nhận công thức giá nền, lên báo giá gửi khách | Chưa thao tác chính | Accountant |
| 6. Làm hợp đồng | Follow khách, kiểm tra nháy; chưa là người phát hành cuối | Gửi/nhận hợp đồng, lưu hồ sơ, gửi mail CC nội bộ | Accountant, Director |
| 7. Tạm ứng | Follow khách và đốc thúc | Gửi phiếu tạm ứng cho khách | Accountant, Director |
| 8. Triển khai | Phối hợp hiện trường khi phát sinh | Phối hợp xá»­ lý tình huống về hồ sÆ¡/thông tin | PM, Giám sát, Accountant |
| 9. Nghiệm thu | Phối hợp xá»­ lý tình huống phát sinh | Có thể tham gia phát hành hồ sÆ¡ số nếu cần | PM, Giám sát |
| 10. Thanh toán | Đốc thúc sau khi gửi đề nghị thanh toán | Gửi đề nghị thanh toán cho khách | Accountant, Director |
| 11. Bảo trì | Không là owner chính, nhưng có thể chăm sóc khách | Không là owner chính | Giám sát, Accountant |
| 12. Bảo hành | Phối hợp xá»­ lý tình huống phát sinh và giữ quan hệ khách | Há»— trợ luân chuyển hồ sÆ¡ nếu có | Giám sát, Director |
| 13. Chăm sóc sau công trình | Chăm sóc, bán thêm gói giải pháp khác | Lưu và tra cứu hồ sơ khi cần | Customer, Sale lead pool |

## 4. Yêu cầu chi tiết phải phản ánh vào BA-V4

### 4.1 Sale

- Có SLA phản hồi lead:
  - giờ hành chính: tiếp nhận sau tối đa `30 phút`
  - ngoài giờ hành chính: tối đa `60 phút`
  - sau `22:00`: tiếp nhận lúc `08:30` sáng hôm sau
- Có `kịch bản gọi điện` cho:
  - hẹn khách hàng
  - tư vấn sơ bộ
  - hẹn khảo sát
- Có chỗ lưu `báo cáo tổng hợp công trình` và `process làm việc với khách hàng`.
- Có quy trình `theo đuổi hợp đồng`, `theo đuổi tạm ứng`, `theo đuổi thanh toán`.
- Có luồng `chăm sóc sau công trình` để bán thêm gói giải pháp khác.

### 4.2 Hành Chính

- Có vai trò điều phối `gửi hợp đồng`, `nhận lại hợp đồng đã ký`, `lưu hồ sơ`.
- Có `mail mẫu` gửi khách và gửi nội bộ.
- Có quy trình phát hành `phiếu tạm ứng`, `đề nghị thanh toán`.
- Có `digital dossier` cho từng khách hàng/công trình để tra cứu hồ sơ nhanh.
- Có hàng đợi xử lý hồ sơ chờ ký, chờ gửi, chờ nhận lại, chờ lưu trữ.

### 4.3 Tài liệu mẫu và chữ ký điện tử

- Quản lý danh mục mẫu:
  - báo giá
  - báo cáo tổng hợp công trình
  - form khảo sát
  - hợp đồng mẫu
  - phiếu tạm ứng
  - đề nghị thanh toán
  - biên bản nghiệm thu
  - báo cáo bảo trì
  - mail mẫu
- Cho phép `merge dữ liệu` từ hệ thống vào biểu mẫu để in/PDF.
- Hỗ trợ `touch signature` cho:
  - khách hàng
  - nhân sự nội bộ
  - người ký duyệt
- Sau khi ký phải sinh được `biên bản số`, lưu hồ sơ và đồng bộ cloud.

## 5. Danh mục đầu ra tối thiểu hệ thống phải quản lý

Từ sheet `Nội dung cần thực hiện`, V4 cần quản lý tối thiểu các artefact sau:

| Nhóm | Tài liệu/biểu mẫu |
|---|---|
| Kịch bản | Kịch bản hẹn khách và tư vấn cơ bản, kịch bản hẹn khảo sát |
| Khảo sát | Form khảo sát công trình, phiếu khảo sát, báo cáo tổng hợp công trình |
| Giá | Bảng báo giá khách hàng, công thức tính giá, bảng giá vật tư và vị trí |
| Hợp đồng | Hợp đồng mẫu cho NCC, thi công sửa chữa, bảo hành, mua bán |
| Tài chính | Phiếu tạm ứng, phiếu đề nghị thanh toán |
| Nghiệm thu/Bảo trì | Biên bản nghiệm thu, báo cáo bảo trì |
| Giao tiếp | Mail mẫu cho khách hàng và nội bộ |

## 6. Gap của BA-V4 trước khi bổ sung

| Hạng mục | Tình trạng V4 cũ | Gap chính |
|---|---|---|
| Vai trò Sale | Chưa có folder và đặc tả riêng | Lẫn trách nhiệm với PM |
| Vai trò Hành Chính | Chưa có actor nghiệp vụ riêng | Bị nhầm với Admin hệ thống |
| SLA tiếp nhận lead | Chưa được khóa thành rule | Dễ bỏ sót khi triển khai CRM |
| Follow-up hợp đồng/tạm ứng/thanh toán | Chưa có backlog chức năng rõ | Thiếu dashboard tác nghiệp |
| Quản lý mẫu tài liệu | Chỉ nhắc rải rác ở mức template | Chưa thành module nghiệp vụ |
| Chữ ký điện tử/touch sign | Chưa có lifecycle riêng | Thiếu entity, flow, audit |
| Hồ sơ số từng công trình | Chưa có khái niệm dossier đầy đủ | Khó tìm lại hồ sơ |
| Mail mẫu và phát hành chứng từ | Chưa có role owner rõ | Dễ vỡ quy trình liên phòng ban |

## 7. Điều chỉnh hướng thiết kế cho BA-V4

1. `Sale` là owner nghiệp vụ từ lead đến trước khi convert thành `Project`, đồng thời tiếp tục theo dõi hợp đồng, tạm ứng, thanh toán và chăm sóc sau công trình.
2. `PM` không thay `Sale`; PM nhận baton mạnh hơn từ lúc convert sang dự án và trong các phối hợp hiện trường/phát sinh.
3. `Hành Chính` là owner của luồng hồ sơ và chứng từ phát hành ra ngoài, khác với `Admin` là người cấu hình hệ thống.
4. `Quản lý mẫu tài liệu` và `Chữ ký điện tử` phải được xem là capability nền dùng chung cho Sale, Hành Chính, Kế toán, PM, Ban giám đốc và Khách hàng.
5. Mọi tài liệu sinh ra phải đi qua 4 lớp:
   - dữ liệu nguồn
   - template version
   - PDF/biên bản số đã sinh
   - file lưu trữ và audit ký

## 8. Kết luận

Workbook gốc cho thấy công trình khách hàng của BAC Group không chỉ là CRM và delivery. Đó là chuỗi vận hành có `front-office`, `back-office`, `hồ sơ`, `ký duyệt`, `thanh toán` và `after-sales` liên kết chặt với nhau. Vì vậy việc bổ sung riêng package `Sale`, `HanhChinh`, cùng capability `Document Template + Digital Signature` là bắt buộc để BA-V4 trở thành baseline triển khai thực tế.
