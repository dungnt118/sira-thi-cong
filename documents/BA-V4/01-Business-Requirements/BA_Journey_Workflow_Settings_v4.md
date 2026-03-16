# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD) - THIẾT LẬP HÀNH TRÌNH KHÁCH HÀNG (JOURNEY WORKFLOW SETTINGS)
**Phiên bản:** v4.0

## 1. TỔNG QUAN XÂY DỰNG WORKFLOW
Trọng tâm của hệ thống SIRA là tính năng "Thiết lập Hành trình Khách hàng" (Customer Journey Templates) thuộc phân hệ Quản lý PM (`/pm/journeys/templates`).
Mọi trạng thái, quy trình xuyên suốt của một yêu cầu dịch vụ (ticket) đều phải tham chiếu động vào dữ liệu đã được cấu hình từ phân hệ này. 

**Nguyên lý cốt lõi:**
1. Hệ thống hỗ trợ tạo nhiều phiên bản Template, nhưng sẽ có quy định **chỉ thiết lập duy nhất 1 Hành trình làm chuẩn (Set as Default/Active Standard)** tại 1 thời điểm cho 1 loại dịch vụ.
2. Tại màn hình cấu hình chi tiết 1 bước (Step), cần hỗ trợ **Sửa / Xóa bước**.
3. Từng Bước (Step) trong Hành trình phải được gắn với một **Nhóm quy trình chuẩn** (Standard Procedure Group) làm đại diện cho nghiệp vụ cốt lõi và giao diện Component sẽ được sử dụng.
4. Quản lý Vai trò (Roles) trong 1 Bước sẽ đóng vai trò như một **Sub-workflow**, với trình tự, mô tả, checklist và SLA được thiết lập riêng biệt cho từng vai trò thay vì chịu chung 1 SLA / Checklist của cả bước.

---

## 2. 14 NHÓM QUY TRÌNH CHUẨN (STANDARD PROCEDURE GROUPS)
Mỗi Bước (Step) khi khởi tạo bắt buộc phải map (map 1-1) với 1 trong 14 Nhóm Quy trình Chuẩn sau đây. Hệ thống Frontend dựa vào "Nhóm" này để kích hoạt 1 bộ UI Component dùng chung (Shared Components). Ở Frontend, Bộ UI này sẽ render dưới 2 chế độ: **Khoá (Readonly)** và **Chỉnh sửa (Editable)**.

1. **Thông tin khách hàng** (Tiếp nhận data, đánh giá ban đầu)
2. **Liên hệ / Tư vấn** (Kịch bản telesale, đặt lịch)
3. **Khảo sát** (Form khảo sát kỹ thuật, hình ảnh hiện trường)
4. **Xây Dựng Giải pháp** (Phương án thi công, thiết bị, nhân sự, dự toán, tổng hợp lỗi)
5. **Báo giá** (Bảng giá dự toán chi tiết dựa trên giá vật tư tiêu chuẩn, giá update hàng tháng)
6. **Làm hợp đồng** (Chốt hợp đồng, PDF, ký kết)
7. **Tạm ứng** (Kế toán duyệt thu tiền)
8. **Triển khai** (Giám sát và công nhân thi công, tiến độ hàng ngày)
9. **Nghiệm Thu** (Biên bản nghiệm thu kỹ thuật, ký xác nhận)
10. **Thanh Toán** (Quyết toán số liệu)
11. **Bảo trì** 
12. **Bảo hành**
13. **Chăm sóc sau công trình** (CSKH, NPS)
14. **Tùy chỉnh** (Custom step - linh hoạt dựa trên text field)

---

## 3. CẤU TRÚC DỮ LIỆU SUB-WORKFLOW (TRONG 1 BƯỚC)
Giao diện "Thêm bước mới" hoặc "Sửa bước" không chỉ chọn Nhóm Quy trình, mà phần cấu hình "Vai trò tham gia" phải được mở rộng thành danh sách (Array) các đối tượng phân việc chi tiết:

Ví dụ Bước 4: **Xây Dựng Giải pháp** có 2 vai trò tham gia (Kinh doanh và Kỹ thuật).
### Cấu trúc thông tin phân công 1 Vai trò:
* **Tên vai trò:** (Ví dụ: Kỹ thuật)
* **Thứ tự thực hiện (Sequence):** (Quy định ai làm trước, ai làm sau, hoặc làm song song)
* **SLA riêng của vai trò:** Số giờ tối đa được phép xử lý (Ví dụ: Kỹ thuật có 24h, nhưng Kinh doanh có 12h tóm tắt)
* **Điều kiện bắt đầu / Hand-over:** (Được kích hoạt sau khi vai trò A hoàn thành hay làm ngay từ đầu)
* **Mô tả công việc riêng (Role Assignment):** Văn bản mô tả nhiệm vụ.
* **Role-specific Checklist (To-Do List của riêng Vai trò):**
  * VD đối với Kỹ thuật ở bước 4:
    - [ ] Đưa giải pháp xử lý theo từng vị trí
    - [ ] Đưa ra số lượng trang thiết bị cần phải thi công
    - [ ] Đưa ra số lượng nhân sự cần thi công
    - [ ] Đưa ra thời gian cần thi công
    - [ ] Đưa ra chi phí dự toán công trình 
    - [ ] Làm file tổng hợp (Hiện trạng, nguyên nhân, giải pháp) để gửi KD

---

## 4. MA TRẬN PHÂN QUYỀN COMPONENT (ROLE-MATRIX FOR READ/EDIT UI)

Bảng ma trận xác định trạng thái UI của Shared Components (theo 14 Nhóm Chuẩn) khi hiển thị cho từng Vai trò tham gia hệ thống. Việc xử lý UI Component ở mức System Engine:
* `E`: **Editable** (Có quyền xem và cập nhật dữ liệu vào Form Component).
* `R`: **Readonly** (Chỉ được xem dữ liệu do bộ phận khác đã nhập).
* `H`: **Hidden / Not Applicable** (Không có quyền truy cập Component này).

*(Ghi chú: PM - Project Manager giữ quyền E/R linh hoạt tuỳ cấu hình tối cao, mặc định là E phần lớn để review)*

| STT | Nhóm Quy Trình Chuẩn       | Sale / Tư Vấn | Kỹ Thuật | Kế Toán (Finance) | Giám Sát / Thi Công | PM (Quản lý) | Root Admin |
|:---:||:---:|:---:|:---:|:---:|:---:|:---:|
| 1   | Thông tin khách hàng       | **E**         | R        | R                 | R                   | E            | E          |
| 2   | Liên hệ / Tư vấn           | **E**         | H        | H                 | H                   | E            | E          |
| 3   | Khảo sát                   | R             | **E**    | H                 | R                   | E            | E          |
| 4   | Xây Dựng Giải pháp         | **E** (Tổng hợp)| **E** (Kỹ thuật)| H                 | R                   | E            | E          |
| 5   | Báo giá                    | **E**         | R        | **E** (Cập nhật giá)| H                   | E            | E          |
| 6   | Làm hợp đồng               | **E**         | R        | R                 | H                   | E            | E          |
| 7   | Tạm ứng                    | R             | H        | **E**             | H                   | R            | E          |
| 8   | Triển khai                 | R             | R        | H                 | **E**               | E            | E          |
| 9   | Nghiệm Thu                 | R             | R        | H                 | **E**               | E            | E          |
| 10  | Thanh Toán                 | R             | H        | **E**             | R                   | E            | E          |
| 11  | Bảo trì                    | R             | **E**    | H                 | R                   | E            | E          |
| 12  | Bảo hành                   | E             | **E**    | H                 | R                   | E            | E          |
| 13  | CSKH sau công trình        | **E**         | H        | H                 | H                   | E            | E          |
| 14  | Tùy chỉnh                  | *Dynamic*     | *Dynamic*| *Dynamic*         | *Dynamic*           | E            | E          |

### Diễn giải chi tiết một số Phân Quyền Phức Tạp:
- **Bước 4 (Xây Dựng Giải pháp):** 
  - Vai trò **Kỹ thuật**: `Editable` trên các component liên quan đến (Số lượng thiết bị, nhân sự, thời gian, giải pháp kỹ thuật cụ thể).
  - Vai trò **Sale**: `Editable` trên component tổng hợp báo cáo gửi Khách hàng, nhưng `Readonly` ở phần bóc tách vật tư kỹ thuật.
- **Bước 5 (Báo giá):**
  - Vai trò **Kế toán**: `Editable` việc bảo trì Bảng giá gốc (Master Price List, ít nhất 1 tháng/1 lần cập nhật).
  - Vai trò **Sale**: `Editable` việc chọn giá, thêm phụ phí, chốt tổng mức giá gửi Khách hàng.

---

## 5. IMPACTS TO PM JOURNEY TEMPLATE UI (Yêu cầu Cập nhật Giao diện)
Dựa theo Business Rule mới, phân hệ `/pm/journeys/templates` cần cập nhật:

1. **Màn hình Danh sách Bước (Step List View):**
   - Bổ sung nút **[Chỉnh Sửa]**, **[Xóa]** cho mỗi bước đã tạo (Cần cảnh báo nếu đã có template đang active).
2. **Popup Thêm / Sửa Bước (Step Modal View):**
   - Cập nhật trường "Nhóm quy trình chuẩn": Select Dropdown gồm 14 lựa chọn.
   - Chuyển trường "SLA (giờ)" chung và "Vai trò" thành 1 bảng / thẻ (Dynamic Form List). Cụ thể với giao diện:
     - **Thêm Vai trò tham gia (Nút Add Role)** -> Mở ra section cấu hình cho vai trò đó:
       - Dropdown Chọn Role.
       - Input Number: SLA (Giờ quy định cho Role này).
       - Input Textarea: Mô tả nhiệm vụ riêng.
       - Dynamic Checklist: Thêm/Xóa các gạch đầu dòng công việc bắt buộc cho vai trò này.

---
*(Tài liệu này đóng vai trò lõi để phát triển lại Dynamic Journey Engine và Centralized Components ở Phase tiếp theo)*
