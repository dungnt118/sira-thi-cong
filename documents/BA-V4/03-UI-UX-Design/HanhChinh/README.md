# UI/UX Blueprint - HanhChinh

## Mục tiêu vai trò

`HanhChinh` là owner của luồng hồ sơ và chứng từ đi ra/đi vào với khách hàng trong vận hành hằng ngày:

- phát hành hợp đồng và chứng từ
- nhận lại hồ sơ đã ký
- gửi mail chuẩn cho khách và nội bộ
- lưu trữ hồ sơ số
- điều phối tình trạng tài liệu với Sale, Accountant, PM và Director

Vai trò này khác với `Admin`. `Admin` cấu hình hệ thống; `HanhChinh` vận hành hồ sơ nghiệp vụ.

## Bộ tài liệu trong folder này

- `FDD_HanhChinh_v4.md`
- `Screen_Inventory_HanhChinh_v4.md`
- `User_Flows_HanhChinh_v4.md`

## Nguyên tắc thiết kế

1. Hành Chính phải có `dossier` theo khách hàng/công trình.
2. Mọi tài liệu phát hành ra ngoài phải có nguồn mẫu, version và lịch sử gửi/nhận.
3. Chữ ký điện tử phải tích hợp thẳng vào luồng phát hành hồ sơ, không làm công cụ rời.
4. Hành Chính là cầu nối back-office với khách hàng và các phòng ban, nên phải có dashboard hàng đợi rõ ràng.
