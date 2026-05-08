# Báo cáo Đặc tả Lỗi và Bất cập Hệ thống - Dịch vụ Thi công & Xây dựng

> [!IMPORTANT]
> **Thông tin kiểm thử:**
> - **Tài khoản:** dungnt118@gmail.com
> - **Môi trường:** http://localhost:5173/
> - **Thời gian cập nhật:** 08/05/2026

## I. Tổng hợp Lỗi theo Bộ phận (Vòng 1)

### 1. Bộ phận Kinh doanh (Sales/Business)
- **Lỗi 1.1 (Bug):** Hệ thống cho phép lưu dự án trống hoàn toàn.
- **Lỗi 1.2 (UX):** Thiếu điều hướng sau khi tạo dự án.
- **Lỗi 1.3 (Logic):** Thiếu phân loại ngân sách và loại hình công trình.

### 2. Bộ phận Giám sát (Supervisor)
- **Lỗi 2.1 (Critical):** Nhật ký thi công không lưu được nội dung (Mất dữ liệu).
- **Lỗi 2.2 (Logic):** Thiếu trường Thời tiết, Nhân công, Vật tư tiêu hao.
- **Lỗi 2.3 (UX):** Upload ảnh không có preview rõ ràng.

### 3. Bộ phận Kế toán (Accountant)
- **Lỗi 3.1 (UI):** Modal Đề nghị thanh toán bị lỗi hiển thị/chồng lớp.
- **Lỗi 3.2 (Logic):** Không bắt buộc đính kèm chứng từ thanh toán.
- **Lỗi 3.3 (Bug):** Dashboard Tài chính hiển thị 0đ sai lệch thực tế.

### 4. Quản lý dự án (Project Manager)
- **Lỗi 4.1 (Critical):** Link Dashboard PM lỗi 404.
- **Lỗi 4.2 (Bug):** Lỗi phân công checklist (Thiếu cấu hình vai trò).
- **Lỗi 4.3 (Logic):** Thiếu Gantt Chart/Tiến độ tổng thể.

---

## II. Kịch bản Kiểm thử Mở rộng (Vòng 2 - Đang thực hiện)

### Kịch bản 5: Quy trình Phê duyệt Tài chính Đa cấp
- **Mục tiêu:** Kiểm tra luồng từ Giám sát -> PM -> Kế toán.
- **Kết quả:** Luồng phê duyệt hoạt động (Supervisor tạo -> PM duyệt -> KT chi), nhưng có nhiều lỗi bổ trợ:
    - **Lỗi 5.1 (Visibility):** Giám sát không nhìn thấy dự án trong danh sách công trình của mình (mặc dù đã được phân quyền).
    - **Lỗi 5.2 (Logic):** Form tạo yêu cầu chi thiếu trường "Chọn dự án" (Project Selection), chỉ cho phép nhập text.
    - **Lỗi 5.3 (UI):** Nội dung modal "Chi tiết phiếu đề nghị chi" bị hiển thị lặp lại 2 lần.

### Kịch bản 6: Quản lý Kho và Vật tư
- **Mục tiêu:** Kiểm tra yêu cầu vật tư và xuất kho.
- **Kết quả:** 
    - **Lỗi 6.1 (Critical):** Trang "Danh mục vật tư" của Kế toán bị lỗi **404 Not Found**.
    - **Lỗi 6.2 (Logic):** Hệ thống chưa tự động trừ kho khi phiếu chi được xác nhận (có thể do thiếu bước hoàn tất minh chứng).

### Kịch bản 7: Kết thúc Dự án và Quyết toán
- **Mục tiêu:** Kiểm tra luồng đóng dự án và tổng kết tài chính.
- **Kết quả:** Quy trình bị gãy do lỗi đồng bộ trạng thái (State Sync):
    - **Lỗi 7.1 (Critical - Validation Bypass):** Hệ thống cho phép hoàn thành bước "Nghiệm thu" mà không cần upload Biên bản nghiệm thu hay Ảnh thực tế (mặc dù là bắt buộc).
    - **Lỗi 7.2 (Critical - State Inconsistency):** Khi ép chuyển bước (Override) qua Roadmap, Header hiển thị bước 10 nhưng Card dự án vẫn hiển thị bước 1. Nhấn "Xác nhận" sẽ reset dự án về bước khởi đầu.
    - **Lỗi 7.3 (High - Redirection):** Nhấn vào hoạt động dự án từ Dashboard PM sẽ bị điều hướng nhầm sang Dashboard Kế toán.
    - **Lỗi 7.4 (Bug):** Bộ lọc tìm kiếm dự án theo ID (HT-2026-001) và theo Bước thi công hoàn toàn không hoạt động.

---

## III. Đánh giá chung về Trải nghiệm (General UX & Architecture)
- **Kiến trúc dữ liệu:** Roadmap và Trạng thái thực tế của dự án đang không dùng chung một "Source of Truth", dẫn đến xung đột dữ liệu nghiêm trọng khi cập nhật.
- **Phân quyền:** Việc điều hướng sai vai trò (PM sang KT) cho thấy lỗi trong logic quản lý Context/Session.
- **Tốc độ phản hồi:** Hệ thống có dấu hiệu giật lag khi chuyển đổi giữa các tab trong chi tiết dự án.
- **Tìm kiếm:** Bộ lọc tìm kiếm dự án (Filter) hoạt động chưa ổn định, cần kiểm tra lại API integration.

> [!TIP]
> **Khuyến nghị ưu tiên xử lý:**
> 1. Fix lỗi **Bypass Validation (7.1)** để đảm bảo tính pháp lý của hồ sơ.
> 2. Fix lỗi **State Sync (7.2)** để tránh mất dấu tiến độ dự án.
> 3. Sửa lỗi **404 Dashboard PM (4.1)** và **Redirection (7.3)** để đảm bảo luồng làm việc của quản lý.
