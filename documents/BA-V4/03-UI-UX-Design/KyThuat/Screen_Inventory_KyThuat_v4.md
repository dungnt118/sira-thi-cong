# Screen Inventory - Kỹ Thuật (Technical) v4

## 1. Giới thiệu
Tất cả các màn hình (Screens) UI/UX bắt buộc phải có cho vai trò **Kỹ thuật** trên Mobile App hoặc Web Mobile Responsive.

## 2. Danh mục màn hình (Screen List)

| Screen ID | Tên Màn Hình | Mục đích / Feature Maps | Loại màn hình |
|---|---|---|---|
| M-TECH-01 | **Login & Auth** | Xác thực Kỹ thuật viên bằng số điện thoại/OTP hoặc mật khẩu. | Form |
| M-TECH-02 | **Dashboard / Todo Hub** | Ưu tiên hiện: Lịch hẹn Khảo sát hôm nay, Lịch thi công hôm nay, Lịch cần xác nhận (Chấm công). | Dashboard |
| M-TECH-03 | **Schedule Calendar** | Xem dạng lịch tháng/tuần, danh sách điểm đến. (TECH-01) | Calendar View |
| M-TECH-04 | **Task / Ticket Detail** | Xem chi tiết 1 lịch (sđt khách, địa chỉ, nhu cầu). Có các nút Action: Bắt đầu đi, Check-in, Mở Maps chỉ đường. | Detail View |
| M-TECH-05 | **Site Survey Form** | Màn hình điền thông tin khảo sát, dynamic fields theo loại hình. (TECH-02) | Dynamic Form |
| M-TECH-06 | **Media Upload View** | Giao diện bật Camera/Gallery, hiển thị lưới ảnh vừa chụp, nút remove ảnh. | Media Widget |
| M-TECH-07 | **Customer E-Signature** | Màn hình trắng hỗ trợ xoay ngang lấy chữ ký khách hàng, Nút clear, Nút Xác nhận. | Touch E-Sign |
| M-TECH-08 | **Solution Proposal Draft** | Chọn danh sách vật tư chuẩn, nhập diện tích m2 để lập phương án thi công sơ bộ. (TECH-03) | Data Entry Form |
| M-TECH-09 | **Daily Log Submission** | Màn hình chọn dự án, nộp ảnh Tình trạng thi công ngày, ghi chú báo cáo. (TECH-04) | Wizard Form |
| M-TECH-10 | **Maintenance Form** | Checklist bảo trì 6 tháng/1 năm định kỳ, ghi chú trạng thái Pass/Fail. (TECH-05) | Checklist |
| M-TECH-11 | **Profile & Settings** | Xem thông tin cá nhân, cài đặt Notification, chỉnh sửa mật khẩu. | Settings |

## 3. Đặc trưng UX của màn hình Kỹ thuật
Vì đối tượng Kỹ thuật dùng ngoài hiện trường thao tác không quá thành thạo phần mềm:
1. **To & Rõ ràng (Big & Bold):** Nút bấm gọi điện, nút chụp ảnh, nút Submit phải to, màu sắc nổi bật (Primary Action).
2. **Text input hạn chế:** Tối đa sử dụng Radio Button, Dropdown, Checkbox thay vì gõ text mô tả dài. Nếu có gõ thì hỗ trợ voice-to-text.
3. **Thanh điều hướng tĩnh (Bottom Navigation):** Giữ ở mức tối đa 4 tab: Trang chủ (Dashboard), Lịch (Schedule), Thi Công (Execution), Cài đặt (Profile).
4. **Trạng thái Mạng:** Có thanh header cảnh báo màu cam "Đang offline - Mọi dữ liệu sẽ lưu tạm trên thiết bị" giúp Kỹ thuật viên yên tâm chụp ảnh dưới hầm sâu.
