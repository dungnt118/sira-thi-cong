# Feature Driven Design (FDD) - Kỹ Thuật (Technical) v4

## 1. Giới thiệu
Tài liệu cung cấp danh sách tính năng (Features) chi tiết dành cho vai trò **Kỹ thuật** trên hệ thống BAC Group. Kỹ thuật là lực lượng hiện trường nòng cốt, đảm nhiệm khảo sát, thi công, và bảo trì.

## 2. Danh sách Module & Tính năng gốc

| Feature ID | Tên Module / Tính năng | Mô tả ngắn |
|---|---|---|
| **TECH-01** | **My Schedule (Lịch trình của tôi)** | Xem và quản lý lịch được giao (Khảo sát, Thi công, Bảo trì) trên giao diện Calendar / Agenda. |
| **TECH-02** | **Site Survey (Khảo sát hiện trường)** | Quy trình điền phiếu khảo sát di động, chụp ảnh hiện trạng và lấy chữ ký khách tại chỗ. |
| **TECH-03** | **Solution Consultation (Đề xuất giải pháp)** | Soạn thảo thô phương án kỹ thuật sau khảo sát, đính kèm ước lượng vật tư để Sale làm báo giá. |
| **TECH-04** | **Execution Log (Nhật ký thi công)** | Cập nhật tiến độ hàng ngày, upload ảnh thi công thực tế cho Giám sát/PM đánh giá. |
| **TECH-05** | **Warranty & Maintenance (Bảo trì & Bảo hành)** | Tiếp nhận yêu cầu bảo hành, ghi nhận tình trạng hỏng hóc thực tế và xử lý sự cố nhỏ. |

---

## 3. Đặc tả từng Feature Tính năng

### 3.1 TECH-01: My Schedule
- **Mô tả:** Màn hình chính (Dashboard) của nhân viên Kỹ thuật, cung cấp chế độ xem lịch trình làm việc.
- **Yêu cầu nghiệp vụ:**
  - Chế độ xem theo ngày (Today), tuần.
  - Phân loại màu sắc rõ ràng cho: Lịch Khảo Sát (Survey), Lịch Thi Công (Execution), Lịch Bảo Trì (Maintenance).
  - Nhắc nhở (Push Notification) trước 1h khi có lịch hẹn.
  - Nút bấm trực tiếp để chỉ đường (Google Maps link) tới địa chỉ công trình.

### 3.2 TECH-02: Site Survey 
- **Mô tả:** Bộ công cụ số để thay thế hoàn toàn Phiếu khảo sát giấy.
- **Yêu cầu nghiệp vụ:**
  - Form linh hoạt (Dynamic Forms) cho phép điền: Tình trạng thấm (nghiêm trọng, nhẹ), Nguyên nhân sơ bộ, Diện tích cần xử lý.
  - Tích hợp Camera: Chụp ảnh hiện trạng có gắn timestamp (ngày giờ chụp tự động).
  - **Khách hàng ký duyệt:** Khách hàng dùng tay/bút cảm ứng ký trực tiếp lên màn hình của nhân viên Kỹ thuật để xác nhận hiện trạng đúng như ghi nhận.

### 3.3 TECH-03: Solution Consultation
- **Mô tả:** Tương tác chuyển giao thông tin từ Kỹ thuật về cho Khối Sale/Kinh doanh.
- **Yêu cầu nghiệp vụ:**
  - Dựa trên Phiếu khảo sát, Kỹ thuật vạch ra `Biện pháp thi công` cơ bản (ví dụ: quét màng, khò nóng, tiêm keo).
  - Ước lượng vật tư thô: Tên vật tư + Số lượng ước tính.
  - Bấm submit chuyển trạng thái sang `Chờ Sale xử lý giá`.

### 3.4 TECH-04: Execution Log
- **Mô tả:** Nền tảng báo cáo kết quả trên công trường hàng ngày.
- **Yêu cầu nghiệp vụ:**
  - Xem mô tả công việc (Task) được PM/Giám sát giao trong ngày.
  - Bấm "Bắt đầu làm" lúc check-in công trình, "Hoàn thành" lúc check-out.
  - Chụp ảnh thi công trước - trong - sau quá trình xử lý. Bắt buộc có ảnh để được approve báo cáo công việc.

### 3.5 TECH-05: Warranty & Maintenance
- **Mô tả:** Theo dõi bảo hành, bảo trì định kỳ.
- **Yêu cầu nghiệp vụ:**
  - Hệ thống tự sinh phiếu khảo sát kiểm tra sau chu kỳ 6 tháng.
  - Kỹ thuật dùng form kiểm tra nhanh: Đánh giá lớp chống thấm, có nứt / bong tróc không.
  - Sinh cảnh báo nếu phát sinh lỗi thuộc diện bảo hành. Khách hàng ký xác nhận kết quả bảo trì.

## 4. Yêu cầu Phi chức năng (Non-functional)
- **Offline Mode:** Các form Khảo sát, Báo cáo thi công phải hỗ trợ lưu tạm (cache local) khi mất mạng và tự đồng bộ khi có mạng lại.
- **Tối ưu ảnh upload:** Ảnh hiện trường cần được compress phía client để giảm băng thông và giảm dung lượng lưu trữ, nhưng vẫn đảm bảo độ nét nhìn thấy được chi tiết kỹ thuật.
