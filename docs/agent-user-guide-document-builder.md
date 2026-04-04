# Hướng dẫn Xây dựng Tài liệu Hướng dẫn Người dùng (User Documentation Guide)

> Tài liệu này dùng làm **chỉ dẫn chuẩn, tái sử dụng** mỗi khi có yêu cầu xây dựng tài liệu hướng dẫn sử dụng cho bất kỳ phân hệ nào của web app. Đọc kỹ trước khi bắt đầu.

---

## Mục lục

1. [Nguyên tắc cốt lõi](#1-nguyên-tắc-cốt-lõi)
2. [Phân tích và Lập kế hoạch](#2-phân-tích-và-lập-kế-hoạch)
3. [Quy trình chụp màn hình chuẩn](#3-quy-trình-chụp-màn-hình-chuẩn)
4. [Tiêu chuẩn viết nội dung](#4-tiêu-chuẩn-viết-nội-dung)
5. [Trình bày nội dung hướng dẫn cho người dùng](#5-trình-bày-nội-dung-hướng-dẫn-cho-người-dùng)
6. [Từ điển Alert và Lưu ý](#6-từ-điển-alert-và-lưu-ý)
7. [Checklist kiểm tra chất lượng](#7-checklist-kiểm-tra-chất-lượng)

---

## 1. Nguyên tắc cốt lõi

Trước khi bắt tay vào làm, cần nằm lòng 4 nguyên tắc sau:

| # | Nguyên tắc | Giải thích |
|---|---|---|
| 1 | **Người dùng không đọc, họ quét** | Ưu tiên danh sách bullet, tiêu đề rõ ràng và ảnh minh họa đi trước mô tả dài. |
| 2 | **Mô tả hành động, không mô tả UI** | Thay vì "Nhấn nút màu xanh ở góc phải", hãy viết "Nhấn **Tạo mới** để mở biểu mẫu nhập liệu." |
| 3 | **Mỗi tài liệu = 1 luồng nghiệp vụ** | Một tài liệu con (cấp 2) phải giải quyết trọn vẹn 1 tác vụ hoàn chỉnh từ đầu đến cuối (ví dụ: "Tạo phiếu xuất kho từ A→Z"). |
| 4 | **Ảnh phải có "câu chuyện"** | Ảnh minh họa phải chứa dữ liệu thực tế (đã điền form, đã có kết quả), không được là màn hình trống hoặc trạng thái rỗng. |

---

## 2. Phân tích và Lập kế hoạch

Trước khi chụp ảnh hay viết nội dung, thực hiện phân tích phân hệ theo 3 bước:

### Bước 2.1 – Liệt kê tất cả luồng nghiệp vụ (workflows)

Duyệt qua toàn bộ phân hệ cần viết tài liệu. Với mỗi màn hình/tính năng, tự hỏi:
- Người dùng bắt đầu từ đâu? (trigger: nhấn nút, mở menu, nhận thông báo...)
- Các bước trung gian là gì? (nhập liệu form, chọn dropdown, upload file...)
- Kết quả cuối cùng trông như thế nào? (toast success, bảng được cập nhật, trạng thái đổi màu...)

**Đầu ra:** Một danh sách các luồng nghiệp vụ cần viết tài liệu. Ví dụ:
```
Phân hệ Giám sát:
  [1] Đăng nhập & chuyển vai trò → Dashboard
  [2] Xem danh sách Hành trình → Mở chi tiết Journey
  [3] Ghi nhật ký thi công → Cập nhật tiến độ % → Chụp ảnh → Lưu
  [4] Kiểm nhận vật tư → Xác nhận số lượng → Submit
  [5] Tra cứu lịch sử hoạt động
  [6] Cập nhật thông tin cá nhân
```

### Bước 2.2 – Phân nhóm thành tài liệu cấp 2

Mỗi luồng nghiệp vụ độc lập → 1 tài liệu cấp 2 riêng. **Quy tắc phân nhóm:**
- Luồng có thao tác nhập liệu (CRUD) → luôn là tài liệu riêng.
- Luồng chỉ đọc/xem → có thể gộp nếu liên quan chặt chẽ.
- Luồng có điều kiện đặc biệt (quyền hạn, trạng thái) → viết tài liệu riêng với phần alert cảnh báo.

### Bước 2.3 – Xác định màn hình cần chụp

Với mỗi tài liệu cấp 2, lập danh sách ảnh cần thu thập:
```
[Tài liệu] Ghi nhật ký thi công:
  - Ảnh 1: Danh sách hành trình (có dữ liệu, highlight dự án sẽ thao tác)
  - Ảnh 2: Màn hình chi tiết Journey (trước khi ghi nhật ký)
  - Ảnh 3: Form nhập nhật ký (đã điền đầy đủ dữ liệu, trước khi submit)
  - Ảnh 4: Trạng thái sau khi lưu thành công (toast hoặc cập nhật UI)
```

---

## 3. Quy trình chụp màn hình chuẩn

> [!IMPORTANT]
> Tất cả ảnh cho module mobile/giám sát phải chụp trong viewport **390×844px** (iPhone 14). Ảnh desktop chụp tại **1280×800px** hoặc nhỏ hơn.

### 3.1 Thiết lập môi trường trước khi chụp

```
1. Mở http://localhost:5173 trong browser subagent.
2. Resize window: mobile = 390×844, desktop = 1280×800.
3. Đăng nhập bằng tài khoản có đầy đủ dữ liệu demo.
4. Chuyển đúng vai trò (dùng "Chuyển quyền nhanh" nếu cần).
5. Đảm bảo có sẵn dữ liệu demo: danh sách, hành trình, lịch sử...
```

### 3.2 Quy tắc chụp màn hình danh sách

- Danh sách phải có **ít nhất 3-5 dòng dữ liệu thực** (không chụp màn hình "Không có dữ liệu").
- Nếu có filter/search → để filter ở trạng thái mặc định (Tất cả).
- Scroll xuống nếu cần để thấy nhiều record hơn trước khi chụp.

### 3.3 Quy tắc chụp màn hình form nhập liệu

**ĐÂY LÀ BƯỚC QUAN TRỌNG NHẤT.** Thực hiện đầy đủ thao tác nhập liệu trước khi chụp:

```
Với mỗi form cần chụp:
  a. Điền đầy đủ tất cả các trường bắt buộc (*) với dữ liệu thực tế, có nghĩa.
  b. Chọn đầy đủ dropdown, radio, checkbox nếu có.
  c. Upload file nếu form yêu cầu (dùng file demo có sẵn).
  d. [CHỤP ẢNH 1]: Form đã điền đầy đủ, trước khi nhấn Submit.
  e. Nhấn nút Submit/Lưu/Xác nhận.
  f. Chờ phản hồi (toast, redirect, hoặc UI cập nhật).
  g. [CHỤP ẢNH 2]: Trạng thái thành công (toast success) HOẶC danh sách đã cập nhật.
```

**Ví dụ dữ liệu demo nên điền:**
| Loại trường | Dữ liệu demo ví dụ |
|---|---|
| Tên/Tiêu đề | "Nhật ký thi công ngày 04/04/2026" |
| Số lượng | 50 (không phải 1 hoặc 0) |
| Mô tả | "Hoàn thành phần móng block A, dự kiến hoàn thiện 80%" |
| Ngày | Ngày hiện tại hoặc ngày hợp lý trong quy trình |
| Tỷ lệ % | 65% (một con số trung thực, không phải 0% hay 100%) |
| Dropdown | Chọn option thứ 2 hoặc thứ 3 (để thấy selection rõ) |

### 3.4 Quy tắc đặt tên file ảnh

```
Format: {role_code}_{feature_slug}_{timestamp}.png

Ví dụ:
  - gs_diary_form_filled_1775287766098.png     (form đã điền)
  - gs_diary_submit_success_1775287769000.png  (kết quả sau submit)
  - gs_journey_list_1775287771000.png          (danh sách hành trình)
  - kt_stock_in_form_1775287773000.png         (form nhập kho KT)
```

**Role codes:**
- `gs` = Giám sát (Supervisor)
- `kt` = Kế toán (Accountant)
- `pm` = Quản lý dự án (Project Manager)
- `sl` = Sale
- `adm` = Admin

### 3.5 Quy trình lưu ảnh

Sau khi chụp, copy ảnh vào đúng thư mục:
```
public/assets/docs/{role_code}/   ← thư mục lưu ảnh tài liệu
```

---

## 4. Tiêu chuẩn viết nội dung

### 4.1 Cấu trúc một section chuẩn

Mỗi `section` trong tài liệu phải có cấu trúc:

```
[TIÊU ĐỀ] → Số thứ tự + Tên hành động chính (VD: "3. Điền biểu mẫu và xác nhận")
[GIỚI THIỆU] → 1-2 câu mô tả MỤC ĐÍCH của bước này trong luồng nghiệp vụ
[HÌNH ẢNH] → Ảnh minh họa thực tế (bắt buộc với các bước thao tác)
[NỘI DUNG] → Danh sách các bước thao tác cụ thể theo thứ tự
[ALERT] → Nếu có rủi ro, điều kiện đặc biệt hoặc mẹo quan trọng
[SUBSECTIONS] → Nếu bước có nhiều nhánh con (tùy chọn)
```

### 4.2 Cách viết mô tả hành động (content)

**❌ Sai – Mô tả UI vô nghĩa:**
```
"Nhấn vào nút màu xanh ở góc trên bên phải để mở form."
"Điền các thông tin vào các ô trống."
"Nhấn lưu."
```

**✅ Đúng – Mô tả hành động + kết quả mong đợi:**
```
"Từ màn hình danh sách Hành trình, nhấn vào tên hành trình muốn cập nhật nhật ký."
"Hệ thống chuyển sang trang chi tiết, hiển thị tab 'Nhật ký thi công' mặc định."
"Tại tab nhật ký, nhấn **+ Ghi nhận nhật ký mới** – biểu mẫu sẽ mở rộng phía dưới."
"Nhập tỷ lệ hoàn thành (%) và mô tả công việc đã thực hiện trong ngày."
"Nhấn **Lưu nhật ký** – hệ thống thông báo thành công và hiển thị nhật ký vừa tạo ngay trong danh sách."
```

### 4.3 Template mô tả cho từng loại tính năng

**Template – Tính năng TẠO MỚI (Create):**
```
[Giới thiệu]: Tính năng [Tên] cho phép [vai trò] thực hiện [mục đích nghiệp vụ].

[Bước thao tác]:
1. Truy cập [màn hình...] → Nhấn **[Tên nút tạo mới]**.
2. Trong biểu mẫu, điền các thông tin sau:
   - **[Tên trường 1]**: [Giải thích ý nghĩa và ví dụ giá trị].
   - **[Tên trường 2]**: [Tùy chọn/Bắt buộc – Giải thích].
   - **[Trường upload]**: Đính kèm [loại file, dung lượng tối đa].
3. Kiểm tra lại thông tin → Nhấn **[Tên nút submit]**.
4. Hệ thống hiển thị thông báo thành công và bản ghi mới xuất hiện ở đầu danh sách.

[Alert – nếu có]: ⚠ [Điều kiện đặc biệt hoặc cảnh báo lỗi thường gặp].
```

**Template – Tính năng DANH SÁCH & TRA CỨU (List/Search):**
```
[Giới thiệu]: Màn hình danh sách [tên] cho phép [vai trò] theo dõi toàn bộ [thực thể] và lọc theo tiêu chí cần thiết.

[Bước thao tác]:
1. Truy cập [màn hình...] – hệ thống hiển thị danh sách theo thứ tự [mới nhất/trạng thái].
2. Sử dụng bộ lọc phía trên để thu hẹp kết quả:
   - **Tìm kiếm theo tên/mã**: Nhập từ khóa vào ô tìm kiếm.
   - **Lọc theo trạng thái**: Chọn [DS trạng thái] từ dropdown.
   - **Lọc theo khoảng ngày**: Chọn từ date picker.
3. Nhấn vào dòng bất kỳ để xem chi tiết.
```

**Template – Tính năng PHÊ DUYỆT / XÁC NHẬN (Approve/Confirm):**
```
[Giới thiệu]: Bước [tên bước] là bước [số] trong quy trình [tên quy trình]. Vai trò [vai trò] chịu trách nhiệm xác nhận tại bước này.

[Điều kiện thực hiện]:
- Bản ghi phải ở trạng thái "[Trạng thái X]".
- [Điều kiện khác nếu có].

[Bước thao tác]:
1. Mở chi tiết bản ghi → Kiểm tra thông tin và chứng từ đính kèm.
2. Nhấn **[Nút phê duyệt]** → Hộp thoại xác nhận hiện ra.
3. [Nếu cần nhập thêm]: Điền [tên trường] (bắt buộc).
4. Nhấn **Xác nhận** – trạng thái sẽ chuyển sang "[Trạng thái Y]".

[Alert]: ⚠ Hành động này không thể hoàn tác. Kiểm tra kỹ trước khi xác nhận.
```

### 4.4 Giải thích luồng nghiệp vụ (Business Context)

**Mỗi tài liệu cấp 2** nên mở đầu bằng 1-2 câu giải thích ngữ cảnh nghiệp vụ — tại sao người dùng cần làm thao tác này, khi nào thì cần thực hiện:

**❌ Sai – Thiếu ngữ cảnh:**
> "Hướng dẫn tạo phiếu xuất kho."

**✅ Đúng – Có ngữ cảnh nghiệp vụ:**
> "Phiếu xuất kho được tạo khi đội thi công yêu cầu cấp vật tư. Kế toán cần đối chiếu đúng công trình và hành trình trước khi xác nhận để đảm bảo tồn kho chính xác."

---

## 5. Trình bày nội dung hướng dẫn cho người dùng

> [!IMPORTANT]
> Tài liệu hướng dẫn người dùng **chỉ nói về giao diện và thao tác**, không được đề cập bất kỳ khái niệm kỹ thuật nào (API, database, TypeScript, ID hệ thống, JSON...). Người dùng cuối là nhân viên nghiệp vụ, không phải lập trình viên.

### 5.1 Ngôn ngữ và từ ngữ phù hợp

| Không dùng | Thay bằng |
|---|---|
| "Gọi API", "endpoint", "request" | "Hệ thống sẽ tự động cập nhật..." |
| "ID", "UUID", "foreign key" | "Mã hành trình", "mã phiếu" |
| "Submit form", "POST request" | "Nhấn nút Lưu / Xác nhận" |
| "Database", "record", "entity" | "Dữ liệu", "bản ghi", "phiếu" |
| "Trường bắt buộc (required field)" | "Thông tin này không được để trống" |
| "Null", "undefined", "error 404" | "Chưa có dữ liệu", "Không tìm thấy" |
| "Reload", "refresh", "cache" | "Tải lại trang" |

### 5.2 Cách mô tả các thành phần giao diện

Khi cần chỉ đến một phần tử trên màn hình, dùng **tên hiển thị thực tế** của nút/tab/trường đó — đúng với những gì người dùng thấy:

- ✅ Nhấn **Tạo phiếu xuất**
- ✅ Chọn tab **Nhật ký thi công**
- ✅ Điền vào ô **Mô tả công việc**
- ✅ Hộp thoại xác nhận hiện ra ở giữa màn hình
- ❌ Click vào button có class `btn-primary`
- ❌ Mở modal component
- ❌ Trigger setState

### 5.3 Cách mô tả luồng thao tác bằng screenshot

Mỗi screenshot đi kèm với một **caption mô tả ngữ cảnh** — không phải mô tả kỹ thuật. Caption phải trả lời câu hỏi: *"Người dùng đang ở bước nào? Họ vừa làm gì? Họ thấy gì?"*

**Ví dụ caption tốt theo từng loại ảnh:**

| Loại ảnh | Caption tốt |
|---|---|
| Danh sách | "Màn hình danh sách Hành trình – hiển thị các dự án đang thi công và trạng thái tiến độ." |
| Form đã điền | "Biểu mẫu ghi nhật ký đã điền đầy đủ – nhấn Lưu để xác nhận." |
| Kết quả thành công | "Thông báo lưu thành công – nhật ký mới xuất hiện ngay đầu danh sách." |
| Modal/hộp thoại | "Hộp thoại xác nhận xuất hiện – kiểm tra lại trước khi nhấn Đồng ý." |
| Trạng thái sau thao tác | "Trạng thái phiếu đã chuyển sang Đã duyệt – không thể chỉnh sửa thêm." |

### 5.4 Cấu trúc một tài liệu hướng dẫn hoàn chỉnh (mẫu)

Dưới đây là ví dụ về một tài liệu hướng dẫn đúng chuẩn người dùng cuối:

---

**Tiêu đề tài liệu:** Ghi nhật ký thi công

**Mô tả ngắn:** Nhật ký thi công là nơi Giám sát ghi lại khối lượng công việc đã hoàn thành mỗi ngày. Quản lý dự án sẽ dựa vào đây để nắm tiến độ thực tế tại công trường.

---

**Bước 1 – Mở Hành trình cần cập nhật**

Từ màn hình chính, nhấn vào **Dự án** ở thanh menu dưới. Danh sách các hành trình đang được giao hiển thị, sắp xếp theo thời hạn gần nhất. Nhấn vào tên hành trình muốn cập nhật.

*(Ảnh: Màn hình danh sách hành trình, có 3-5 dòng dữ liệu, một hành trình đang được hover/chọn)*

---

**Bước 2 – Điền nhật ký hôm nay**

Trong trang chi tiết hành trình, chọn tab **Nhật ký thi công**. Nhấn **+ Ghi nhận nhật ký mới** – biểu mẫu xuất hiện phía dưới.

Điền đầy đủ:
- **Tỷ lệ hoàn thành (%)**: Số phần trăm thực tế đã làm được hôm nay.
- **Nội dung công việc**: Mô tả cụ thể từng hạng mục đã thi công.
- **Ghi chú phát sinh** (nếu có): Vật tư thiếu, thời tiết xấu, chờ nghiệm thu...

*(Ảnh: Form đã điền đầy đủ với dữ liệu thực tế, nút Lưu nhật ký hiển thị rõ)*

> 💡 **Mẹo:** Mô tả càng chi tiết, quản lý dự án càng ít phải gọi điện hỏi thêm.

---

**Bước 3 – Lưu và kiểm tra kết quả**

Nhấn **Lưu nhật ký**. Hệ thống thông báo lưu thành công và nhật ký mới xuất hiện ngay đầu danh sách với thời gian vừa tạo.

*(Ảnh: Màn hình sau khi lưu – danh sách nhật ký đã có bản ghi mới ở đầu)*

---

## 6. Từ điển Alert và Lưu ý

Sử dụng đúng loại alert cho đúng ngữ cảnh:

| Type | Màu/Icon | Khi nào dùng | Ví dụ |
|---|---|---|---|
| `info` | Xanh dương | Thông tin bổ sung, hướng dẫn chuyển vai trò, đường link liên quan | "Để truy cập tính năng này, đảm bảo bạn đã chuyển sang vai trò Giám sát." |
| `tip` | Xanh lá | Mẹo tăng hiệu suất, phím tắt, thực hành tốt | "Chụp ảnh ngay sau khi hoàn thành từng hạng mục thay vì để cuối ca." |
| `warning` | Vàng | Rủi ro nhẹ, cần chú ý nhưng không nguy hiểm | "Phiếu xuất kho chỉ có thể hủy trong vòng 24h sau khi tạo." |
| `important` | Đỏ cam | Hành động quan trọng ảnh hưởng đến dữ liệu | "Xác nhận kiểm nhận không thể hoàn tác. Kiểm tra kỹ số lượng trước khi nhấn." |
| `caution` | Đỏ đậm | Rủi ro cao, có thể gây mất dữ liệu hoặc lỗi quy trình | "Không xóa hành trình đang có nhật ký. Hãy chuyển sang trạng thái Hủy thay vì xóa." |

---

## 7. Checklist kiểm tra chất lượng

Trước khi hoàn thành tài liệu cho một phân hệ, kiểm tra từng mục:

### ✅ Về độ đầy đủ nội dung

- [ ] Mỗi luồng nghiệp vụ chính của phân hệ đã có tài liệu riêng.
- [ ] Tài liệu mô tả **tại sao** cần làm bước này (ngữ cảnh nghiệp vụ), không chỉ **làm gì**.
- [ ] Mỗi bước thao tác có ít nhất 3 câu mô tả cụ thể (trigger → hành động → kết quả).
- [ ] Có section giải thích kết quả sau khi hoàn thành (màn hình thành công, trạng thái mới).

### ✅ Về ảnh minh họa

- [ ] Mỗi section có thao tác đều có ảnh minh họa (không section nào trống ảnh).
- [ ] Ảnh form nhập liệu: **đã điền đầy đủ dữ liệu demo**, không là form trống.
- [ ] Ảnh danh sách: có ít nhất 3 dòng dữ liệu thực.
- [ ] Ảnh kết quả sau submit: thể hiện trạng thái thành công (toast, dữ liệu đã lưu).
- [ ] Kích thước ảnh đúng: mobile = dọc (portrait), desktop = ngang.

### ✅ Về Alert

- [ ] Tất cả bước có rủi ro hoặc điều kiện đặc biệt đều có `alert` phù hợp.
- [ ] Dùng đúng `type` alert theo bảng từ điển ở mục 6.
- [ ] Alert không lặp lại nội dung đã có trong `content`.

### ✅ Về ngôn ngữ và từ ngữ

- [ ] Không có thuật ngữ kỹ thuật nào trong toàn bộ nội dung (API, ID, database, TypeScript...).
- [ ] Tất cả tên nút, tab, trường đều khớp chính xác với giao diện thực tế (đúng chữ hoa/thường).
- [ ] Mô tả kết quả sau mỗi thao tác (người dùng thấy gì sau khi nhấn nút).
- [ ] Caption ảnh (tên section) mô tả đúng ngữ cảnh: người dùng ở bước nào, thấy gì.

### ✅ Về trải nghiệm người dùng

- [ ] Thứ tự các document trong category phản ánh đúng luồng thực tế (từ đăng nhập → tác vụ chính → tra cứu → cài đặt).
- [ ] Tiêu đề section không dùng từ chung chung: "Bước 1", "Giới thiệu" → thay bằng tên hành động cụ thể.
- [ ] Không có section nào chỉ có 1-2 câu mô tả mà không có ảnh (quá sơ sài).

---

## 8. Quy trình thực hiện từng bước (SOP)

```
Khi nhận yêu cầu xây dựng tài liệu cho phân hệ X:

BƯỚC 1 – PHÂN TÍCH (5-10 phút)
  1.1. Đọc code của phân hệ: routes, layouts, pages.
  1.2. Liệt kê tất cả luồng nghiệp vụ theo hướng dẫn mục 2.1.
  1.3. Lập danh sách tài liệu cấp 2 + danh sách ảnh cần chụp.
  1.4. Tạo implementation_plan.md và chờ duyệt nếu phức tạp.

BƯỚC 2 – CHỤP MÀN HÌNH (browser subagent)
  2.1. Setup viewport đúng (mobile/desktop).
  2.2. Đăng nhập, chuyển vai trò, đảm bảo có dữ liệu demo.
  2.3. Với mỗi màn hình: điền form → chụp ảnh → submit → chụp ảnh kết quả.
  2.4. Save ảnh vào đúng thư mục public/assets/docs/{role_code}/.

BƯỚC 3 – VIẾT NỘI DUNG
  3.1. Viết từng tài liệu theo template mục 4.3 và mẫu mục 5.4.
  3.2. Đảm bảo mỗi bước có: tiêu đề hành động + nội dung (3+ câu) + ảnh + lưu ý (nếu cần).
  3.3. Kiểm tra logic thứ tự: người dùng phải đọc từ đầu đến cuối là thực hiện được.
  3.4. Rà soát toàn bộ nội dung: xóa bỏ mọi từ ngữ kỹ thuật (xem mục 5.1).

BƯỚC 4 – CẬP NHẬT DỮ LIỆU TÀI LIỆU
  4.1. Cập nhật file dữ liệu tài liệu với nội dung mới.
  4.2. Đảm bảo đường dẫn ảnh chính xác và ảnh đã được lưu vào thư mục đúng.

BƯỚC 5 – KIỂM TRA CUỐI
  5.1. Mở trang /documents trên browser.
  5.2. Click qua từng tài liệu, xác nhận ảnh load đúng.
  5.3. Chạy qua checklist mục 7.
  5.4. Chụp ảnh xác minh kết quả.
```

---

*Tài liệu này được tạo để tái sử dụng cho các phân hệ: Giám sát, Kế toán, Quản lý dự án, Sale, Admin, v.v.*
