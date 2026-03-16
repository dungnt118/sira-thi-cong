# Accountant - UI/UX Blueprint V4

## 1. Mục tiêu

Package này mô tả lại đầy đủ vai trò `Accountant` trong BA-V4 theo mức có thể dùng làm baseline triển khai, không dừng ở mức dashboard theo dõi đợt thanh toán.

Trọng tâm của Accountant trong V4 gồm 6 trục:

1. kiểm soát phải thu theo hợp đồng, đợt thanh toán, công nợ và retention
2. kiểm soát phải chi theo chi phí công trình, lệnh chi và nguồn tiền
3. vận hành `sổ quỹ`, theo dõi tiền công ty và tiền cá nhân theo mô hình kiểm soát nội bộ
4. quản lý kho vật tư gắn với phiếu xuất/nhập, ký nhận và đối soát
5. theo dõi tác động tài chính của bảo hành, bảo trì và hậu mãi tính phí
6. quản lý chứng từ tài chính, hồ sơ thanh toán, biên bản số và audit

## 2. Bộ tài liệu chính

- `FDD_Accountant_v4.md`: đặc tả chức năng chi tiết cho vai trò Kế toán
- `Finance_Control_Accountant_v4.md`: chuẩn hóa riêng các rule kiểm soát tài chính, sổ quỹ, lệnh chi, retention và hậu mãi
- `Screen_Inventory_Accountant_v4.md`: danh mục màn hình Kế toán cần có và đối chiếu với codebase hiện tại
- `User_Flows_Accountant_v4.md`: các flow nghiệp vụ chính theo V4

## 3. Phạm vi nghiệp vụ mà Accountant phải bao phủ

- `Thanh toán & công nợ`: payment schedule, thu tiền từng đợt, partial collection, quá hạn, chứng từ thu
- `Chi phí & giải ngân`: chi phí công trình, chi nhân công, chi vật tư, chi phát sinh, lệnh chi
- `Sổ quỹ & nguồn tiền`: quỹ tiền mặt, tài khoản công ty, tài khoản cá nhân, người tạo lệnh, người duyệt, người theo dõi
- `Kho`: danh mục vật tư, phiếu xuất/nhập, lịch sá»­ kho, ký nhận Giám sát/kỹ thuật profile
- `Bảo hành/bảo trì`: chi phí hậu mãi, yêu cầu tính phí, khoản phải thu phát sinh, retention release
- `Chứng từ`: đề nghị tạm ứng, đề nghị thanh toán, biên bản nghiệm thu, phiếu bảo hành điện tử, hồ sơ số lưu trữ

## 4. Nguồn tham chiếu đã dùng để dựng lại

- `BA-V2`: mạnh ở AR/AP, reconciliation, dashboard và financial reporting
- `BA-V3`: có wireframe milestone thanh toán, dashboard dòng tiền, bảo hành và góc nhìn tài chính dự án
- `Orignal-Requirements-Docs`: phản ánh cách BAC đang làm thật với `doanh thu - chi phí - đã thu - công nợ`, `sổ quỹ`, `kiểm soát tài chính`, `đề nghị thanh toán`, `hợp đồng`, `nghiệm thu`, `bảo trì`
- `Codebase hiện tại`: mới có prototype cho `Kho vật tư` và `Theo dõi đợt thanh toán`

## 5. Kết luận baseline

Accountant của V4 không phải một vai trò "xem báo cáo tài chính" đơn thuần. Đây là vai trò đóng vòng:

`Hợp đồng -> Đợt thanh toán -> Thu tiền / Chi tiền -> Sổ quỹ -> P&L công trình -> Bảo hành/Bảo trì -> Hồ sơ tài chính`

Vì vậy nếu một backlog Accountant chỉ còn:

- dashboard
- xác nhận đã thu
- phiếu bảo hành

thì vẫn chưa đạt phạm vi nghiệp vụ thực tế của BAC Group.
