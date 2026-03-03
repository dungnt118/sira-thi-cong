# 📘 BUSINESS REQUIREMENTS DOCUMENT V3.0
**Hệ thống DL Tech Management – Lam Bac Group**
**Giai đoạn đầu (First Stage – Phiên bản triển khai ban đầu)**

---

## 1. THÔNG TIN TÀI LIỆU

| Mục | Nội dung |
|-----|----------|
| **Tên dự án** | DL Tech Management – Lam Bac Group |
| **Phiên bản** | 3.0 |
| **Ngày** | 2026-03-02 |
| **Cơ sở** | Hình ảnh yêu cầu LAM-BAC-GROUP-Module.jpg |
| **So chiếu** | BA-V2 (BRD_v2.md, FDD_v2.md, UI/UX folders) |
| **Giai đoạn** | First Stage – không phải toàn bộ production |
| **Trạng thái** | Draft – Chờ review & approval |

---

## 2. TÓM TẮT YÊU CẦU V3 (từ hình ảnh)

Hệ thống **DL Tech Management** cấu trúc lõi gồm **4 Module chính**, liên kết chặt chẽ với nhau:

| STT | Module | Mô tả ngắn |
|-----|--------|------------|
| 1 | **Module 1: Quản lý Khách hàng & Khảo sát (CRM)** | Thông tin KH, định vị GPS, Upload ảnh khảo sát, trạng thái pipeline |
| 2 | **Module 2: Nhật ký Thi công (Full Control)** | Checklist tiêu chuẩn vàng, bằng chứng hình ảnh có thời gian thực, giám sát từ xa |
| 3 | **Module 3: Quản lý Vật tư & Kho (Inventory)** | Định mức tự tính, xuất kho thợ ký nhận, cảnh báo tồn kho |
| 4 | **Module 4: Tài chính & Bảo hành (Finance)** | Dòng tiền theo đợt thanh toán (50%-40%-10%), bảo hành điện tử SMS/Zalo |

---

## 3. PHÂN TÍCH ACTOR – GIAI ĐOẠN ĐẦU (FIRST STAGE)

> ⚠️ **Lưu ý quan trọng**: Ở First Stage, không nhất thiết phải có đủ 6 Actor như BA-V2. Dưới đây là danh sách Actor thực sự cần thiết và lý do.

### 3.1 Actor THỰC SỰ xuất hiện ở First Stage

| Actor | Có mặt First Stage? | Lý do |
|-------|---------------------|-------|
| **Admin** | ✅ BẮT BUỘC | Quản trị hệ thống, setup data nền, xem báo cáo tổng thể |
| **PM (Project Manager)** | ✅ BẮT BUỘC | Khảo sát KH, giao việc thợ, giám sát từ xa toàn bộ tiến độ thi công |
| **Thợ thi công (Worker/Internal Staff)** | ✅ BẮT BUỘC | Thực hiện checklist thi công, chụp ảnh/video upload lên hệ thống |
| **Kế toán (Accountant)** | ✅ BẮT BUỘC | Theo dõi dòng tiền 50%-40%-10%, nhập xuất kho, cảnh báo tồn kho |
| **Khách hàng (Customer)** | ✅ CÓ MẶT (Passive) | Nhận SMS/Zalo nhắc bảo hành (không cần login hệ thống giai đoạn đầu) |
| **Supervisor** | ⚠️ TẠM THỜI (Kiêm PM) | Ở First Stage, PM kiêm luôn vai trò giám sát. Supervisor riêng chỉ cần khi scale outsource |
| **Outsource Leader** | ❌ CHƯA CẦN | Mô hình outsource chưa active ở First Stage. PM quản lý trực tiếp thợ nội bộ |

### 3.2 Mô hình vận hành First Stage

```
[Khách hàng] → Liên hệ/Khảo sát
     ↓
   [PM]  →  Lập hồ sơ KH + trạng thái pipeline (CRM)
     ↓         
[Ký HĐ] →  Tạo dự án thi công
     ↓
  [PM]   →  Giao việc cho [Thợ thi công]
     ↓
[Thợ]   →  Thực hiện Checklist → Upload ảnh/video
     ↓
  [PM]   →  Giám sát từ xa qua hệ thống
     ↓
[Kế toán] → Theo dõi dòng tiền, xuất kho vật tư
     ↓
[Hệ thống] → Tự động gửi SMS/Zalo bảo hành → [Khách hàng]
```

---

## 4. BÓC TÁCH YÊU CẦU THÀNH SUB-MODULE & FUNCTION CHI TIẾT

### MODULE 1: Quản lý Khách hàng & Khảo sát (CRM)

#### 1.1 Sub-module: Quản lý thông tin Khách hàng

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| CRM-01 | Tạo/sửa/xóa khách hàng | Nhập tên, số điện thoại, địa chỉ | PM, Admin |
| CRM-02 | Định vị GPS công trình | Gắn tọa độ GPS của địa chỉ thi công | PM |
| CRM-03 | Tìm kiếm & lọc KH | Search theo tên, số điện thoại, trạng thái | PM, Admin |
| CRM-04 | Xem lịch sử KH | Các hợp đồng, dự án đã/đang thực hiện với KH | PM, Admin |

#### 1.2 Sub-module: Khảo sát & Báo giá

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| CRM-05 | Upload ảnh hiện trạng | Upload ảnh chụp Camera, ảnh thẩm | PM |
| CRM-06 | Nhập chỉ số đo độ ẩm sàn | Ghi nhận dữ liệu đo lường kỹ thuật | PM |
| CRM-07 | Lập báo giá | Tạo báo giá từ diện tích + loại vật tư | PM |
| CRM-08 | Gửi báo giá cho KH | Xuất PDF hoặc chia sẻ link | PM |

#### 1.3 Sub-module: Pipeline Trạng thái KH

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| CRM-09 | Quản lý trạng thái pipeline | Đang khảo sát → Đã gửi báo giá → Đã ký HĐ → Từ chối | PM, Admin |
| CRM-10 | Chuyển trạng thái KH | Click action chuyển trạng thái kèm ghi chú | PM |
| CRM-11 | Dashboard pipeline | Kanban hoặc bảng thống kê pipeline KH | PM, Admin |
| CRM-12 | Tạo hợp đồng từ KH | Khi KH "Đã ký HĐ" → Tạo project thi công | PM |

---

### MODULE 2: Nhật ký Thi công (Construction Log – Full Control)

#### 2.1 Sub-module: Checklist Tiêu chuẩn Vàng

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| TCK-01 | Xem danh sách bước thi công | Thợ xem checklist các bước: Mài sàn → Vệ sinh → Quét lót... | Thợ |
| TCK-02 | Tick xác nhận từng bước | Mỗi bước phải tick trước khi làm bước tiếp | Thợ |
| TCK-03 | Khóa bước tiếp theo | Nếu bước trước chưa tick + có ảnh → Bước tiếp không mở được | Hệ thống |
| TCK-04 | Quản lý template checklist | PM/Admin tạo/sửa các bước tiêu chuẩn | PM, Admin |

#### 2.2 Sub-module: Bằng chứng Hình ảnh & Video

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| TCK-05 | Upload ảnh/video mỗi bước | Mỗi bước checklist phải có tối thiểu 1 ảnh/video | Thợ |
| TCK-06 | Timestamp tự động | Khi upload, hệ thống gán thời gian thực (realtime timestamp) | Hệ thống |
| TCK-07 | GPS tự động (optional) | Gán tọa độ GPS khi chụp ảnh trên mobile | Hệ thống |
| TCK-08 | Review bằng chứng | PM xem ảnh/video từng bước của thợ | PM |
| TCK-09 | Approve/Reject bằng chứng | PM chấp nhận hoặc yêu cầu chụp lại | PM |

#### 2.3 Sub-module: Giám sát từ xa

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| TCK-10 | Dashboard dự án realtime | PM thấy được trạng thái từng bước trên app | PM, Admin |
| TCK-11 | Xem tiến độ % hoàn thành | Tính % dựa trên số bước đã hoàn thành / tổng bước | PM, Admin |
| TCK-12 | Cảnh báo dự án trễ | Hệ thống cảnh báo khi dự án sắp hoặc đã quá deadline | Hệ thống → PM |
| TCK-13 | Nhật ký hoạt động | Log toàn bộ hoạt động upload, tick checklist | PM, Admin |

---

### MODULE 3: Quản lý Vật tư & Kho (Inventory)

#### 3.1 Sub-module: Danh mục Vật tư

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| INV-01 | Tạo/sửa/xóa vật tư | Tên, đơn vị, đơn giá, tồn kho hiện tại | Admin, Kế toán |
| INV-02 | Xem danh sách vật tư | Bảng kê toàn bộ vật tư trong kho | Admin, Kế toán, PM |
| INV-03 | Cập nhật tồn kho | Nhập số lượng nhập kho, xuất kho | Kế toán |

#### 3.2 Sub-module: Định mức Tự tính

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| INV-04 | Setup định mức vật tư | Ví dụ: 1m2 → cần X kg SIRA PU | Admin, PM |
| INV-05 | Tự tính định mức từ diện tích | Nhập diện tích → Hệ thống tính số lượng vật tư cần dùng | Hệ thống |
| INV-06 | Xuất định mức cho dự án | PM xác nhận định mức, Kế toán duyệt xuất kho | PM, Kế toán |

#### 3.3 Sub-module: Xuất Kho & Ký Nhận

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| INV-07 | Tạo phiếu xuất kho | Kế toán/PM tạo phiếu xuất vật tư cho dự án | PM, Kế toán |
| INV-08 | Thợ ký nhận vật tư (trên App) | Thợ xác nhận đã nhận vật tư qua app (chữ ký điện tử hoặc OTP) | Thợ |
| INV-09 | Lịch sử xuất/nhập kho | Track toàn bộ giao dịch kho theo dự án | Kế toán, Admin |

#### 3.4 Sub-module: Cảnh báo Tồn kho

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| INV-10 | Cấu hình mức tồn kho tối thiểu | Ví dụ: SIRA PU ≤ 5 thùng → Cảnh báo | Admin, Kế toán |
| INV-11 | Tự động cảnh báo tồn kho thấp | Hệ thống gửi in-app notification + email | Hệ thống → Kế toán, Admin |
| INV-12 | Dashboard tồn kho | Bảng tổng hợp vật tư, tồn kho, mức cảnh báo | Kế toán, Admin |

---

### MODULE 4: Tài chính & Bảo hành (Finance)

#### 4.1 Sub-module: Dòng tiền theo đợt

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| FIN-01 | Cấu hình đợt thanh toán | Thiết lập tỷ lệ: 50% - 40% - 10% | PM, Kế toán |
| FIN-02 | Tạo Payment Milestone | Hệ thống tự tạo các đợt dựa trên giá trị HĐ | Hệ thống, PM |
| FIN-03 | Xác nhận thanh toán đã nhận | Kế toán mark đã thu tiền theo từng đợt | Kế toán |
| FIN-04 | Dashboard dòng tiền | Tổng quan: đã thu, còn lại, quá hạn | Kế toán, Admin |
| FIN-05 | Cảnh báo đợt thanh toán quá hạn | Thông báo khi đợt thanh toán đến hạn chưa thu | Hệ thống → Kế toán |
| FIN-06 | Báo cáo tài chính dự án | Tổng thu, chi phí vật tư, lợi nhuận ước tính | Admin, Kế toán |

#### 4.2 Sub-module: Bảo hành Điện tử

| ID | Function | Mô tả | Actor |
|----|----------|-------|-------|
| FIN-07 | Cấu hình thời hạn bảo hành | Thiết lập chu kỳ kiểm tra (6-12 tháng) | Admin, PM |
| FIN-08 | Tự động gửi nhắc bảo hành | Hệ thống gửi SMS/Zalo tự động đến KH | Hệ thống → Khách hàng |
| FIN-09 | Tracking lịch sử bảo hành | Log các lần đã gửi nhắc, KH phản hồi | PM, Kế toán |
| FIN-10 | Tạo phiếu bảo hành điện tử | Số phiếu, ngày, công trình, hạng mục | PM |

---

## 5. SO CHIẾU VỚI BA-V2 – BẢNG GAP/MISSING ANALYSIS

### 5.1 So sánh tổng quan

| Chiều so sánh | BA-V2 | BA-V3 (First Stage) |
|---------------|-------|---------------------|
| Số Actor chính | 6 roles | 4 roles thực sự (Admin, PM, Thợ, Kế toán) |
| Mô hình vận hành | Internal + Outsource | **Chỉ Internal** (outsource phase sau) |
| Tên hệ thống | SIRA Service Management | DL Tech Management |
| CRM Pipeline | ❌ Không có (chỉ quản lý KH cơ bản) | ✅ Có đầy đủ pipeline KH |
| Khảo sát & báo giá | ❌ Chưa detailed | ✅ Upload ảnh khảo sát, đo ẩm, báo giá |
| Checklist thi công | ❌ Chỉ mention evidence stage | ✅ **Checklist tiêu chuẩn vàng** – khóa bước |
| Bằng chứng timestamp | ✅ Có metadata timestamp | ✅ Realtime timestamp rõ hơn |
| GPS evidence | ✅ Optional | ✅ Optional nhưng nhấn mạnh hơn |
| Inventory định mức tự tính | ❌ MISSING | ✅ **MỚI**: Tự tính m2 → kg vật tư |
| Thợ ký nhận kho trên App | ❌ MISSING | ✅ **MỚI**: Digital signature |
| Cảnh báo tồn kho tự động | ❌ MISSING | ✅ **MỚI**: Ngưỡng cảnh báo tự động |
| Payment 50%-40%-10% | Có nhưng dùng % tùy chỉnh | ✅ Template cố định 3 đợt |
| Bảo hành điện tử SMS/Zalo | ❌ MISSING | ✅ **MỚI**: Tự động gửi nhắc bảo hành |
| Customer Portal | ✅ Phase 2 | ❌ Chưa cần ở First Stage |
| Google Drive Integration | ✅ Phase 2 | ❌ Chưa cần, dùng storage nội bộ trước |
| Outsource management | ✅ Full support | ❌ Chưa cần ở First Stage |

### 5.2 Function Gap Table Chi tiết

| Function | BA-V2 Status | BA-V3 Status | Gap Type |
|----------|-------------|-------------|----------|
| CRM-01: Tạo/sửa KH | FR-CUST-01 (có) | ✅ Kế thừa | – |
| CRM-02: GPS địa chỉ | FR-PROJ-01 (có trong dự án) | ✅ Mở rộng sang KH | ENHANCE |
| CRM-05: Upload ảnh khảo sát | ❌ Không có | ✅ **MỚI** | NEW |
| CRM-06: Đo độ ẩm sàn | ❌ Không có | ✅ **MỚI** | NEW |
| CRM-07: Báo giá | ❌ Không có | ✅ **MỚI** | NEW |
| CRM-09: Pipeline trạng thái | ❌ Không có | ✅ **MỚI** | NEW |
| TCK-01~03: Checklist khóa bước | ❌ Không có | ✅ **MỚI – CORE** | NEW |
| TCK-05: Upload kèm theo bước | Có upload evidence nhưng không gắn bước | ✅ Gắn theo bước checklist | ENHANCE |
| TCK-06: Timestamp realtime | Có metadata | ✅ Nhấn mạnh realtime | ENHANCE |
| TCK-10~12: Dashboard giám sát | FR-PROJ partial | ✅ Rõ ràng hơn | ENHANCE |
| INV-04~05: Định mức tự tính | ❌ **MISSING** | ✅ **MỚI – CORE** | NEW |
| INV-07~08: Xuất kho + thợ ký | FR-MAT partial, không có ký nhận | ✅ Thêm ký nhận số | NEW |
| INV-10~11: Cảnh báo tồn kho | ❌ **MISSING** | ✅ **MỚI** | NEW |
| FIN-01~03: Payment 50%-40%-10% | FR-PAY-01 (có nhưng % tùy chỉnh) | ✅ Template cố định 3 đợt | ENHANCE |
| FIN-07~09: Bảo hành SMS/Zalo | ❌ **MISSING CRITICAL** | ✅ **MỚI – CORE** | NEW |
| Outsource Company | FR-PROJ-02 (có) | ❌ Bỏ qua First Stage | DEFER |
| Customer Portal | FR-PORT-01 (Phase 2) | ❌ Bỏ qua First Stage | DEFER |
| Google Drive | FR-DRIVE-01 (Phase 2) | ❌ Bỏ qua First Stage | DEFER |

### 5.3 Tóm tắt Gap

| Loại Gap | Số lượng | Mô tả |
|----------|----------|-------|
| **NEW (Hoàn toàn mới)** | 12 functions | CRM Pipeline, Khảo sát, Checklist khóa bước, Định mức tự tính, Cảnh báo kho, Bảo hành SMS |
| **ENHANCE (Nâng cấp)** | 6 functions | GPS KH, Upload theo bước, Timestamp, Dashboard, Payment template |
| **DEFER (Hoãn lại)** | 5 functions | Outsource, Customer Portal, Google Drive, Document Exchange |
| **INHERIT (Kế thừa)** | 8 functions | Auth, User management, Basic CRM, Project CRUD, Evidence upload, Basic payment |

---

## 6. ACTOR PERMISSION MATRIX (First Stage)

| Function | Admin | PM | Thợ thi công | Kế toán | Ghi chú |
|----------|-------|-----|-------------|---------|---------|
| Quản lý User/Role | ✅ | ❌ | ❌ | ❌ | |
| Tạo/sửa KH | ✅ | ✅ | ❌ | ❌ | |
| Upload ảnh khảo sát | ✅ | ✅ | ❌ | ❌ | |
| Quản lý pipeline KH | ✅ | ✅ | ❌ | ❌ | |
| Tạo/sửa Dự án | ✅ | ✅ | ❌ | ❌ | |
| Giao việc cho thợ | ✅ | ✅ | ❌ | ❌ | |
| Tick checklist bước | ❌ | ❌ | ✅ | ❌ | |
| Upload ảnh/video theo bước | ❌ | ❌ | ✅ | ❌ | |
| Review/Approve bằng chứng | ✅ | ✅ | ❌ | ❌ | |
| Giám sát dự án realtime | ✅ | ✅ | ❌ | ❌ | |
| Quản lý danh mục vật tư | ✅ | ❌ | ❌ | ✅ | |
| Setup định mức vật tư | ✅ | ✅ | ❌ | ❌ | |
| Tạo phiếu xuất kho | ✅ | ✅ | ❌ | ✅ | |
| Thợ ký nhận vật tư | ❌ | ❌ | ✅ | ❌ | |
| Cảnh báo tồn kho | ✅ | ❌ | ❌ | ✅ | |
| Tạo/xem Payment Milestone | ✅ | ✅ | ❌ | ✅ | |
| Confirm thanh toán | ✅ | ❌ | ❌ | ✅ | |
| Xem báo cáo tài chính | ✅ | ❌ | ❌ | ✅ | |
| Cấu hình bảo hành | ✅ | ✅ | ❌ | ❌ | |
| Gửi nhắc bảo hành | Hệ thống tự động | | | | |

---

## 7. BUSINESS RULES (V3 – First Stage)

### BR-CRM
- **BR-CRM-01**: Trạng thái KH chỉ tiến, không lùi (trừ Admin override)  
- **BR-CRM-02**: Chỉ khi KH "Đã ký HĐ" mới tạo được Dự án  
- **BR-CRM-03**: Ảnh khảo sát phải có timestamp tự động  

### BR-TCK (Thi công)
- **BR-TCK-01**: Thợ PHẢI upload ảnh/video trước khi tick ✅ bước hoàn thành  
- **BR-TCK-02**: Bước N+1 bị KHÓA cho đến khi Bước N hoàn thành (có ảnh)  
- **BR-TCK-03**: Timestamp ảnh/video không thể chỉnh sửa sau khi upload  
- **BR-TCK-04**: Dự án chỉ complete khi 100% bước checklist hoàn thành  

### BR-INV (Kho)
- **BR-INV-01**: Định mức = nhập diện tích → hệ thống tự tính số lượng vật tư  
- **BR-INV-02**: Không xuất kho nếu tồn kho < số lượng cần xuất  
- **BR-INV-03**: Thợ phải ký nhận (digital) trước khi phiếu xuất kho có hiệu lực  
- **BR-INV-04**: Tự động cảnh báo khi tồn kho ≤ ngưỡng cấu hình  

### BR-FIN (Tài chính)
- **BR-FIN-01**: Template mặc định 3 đợt: Đợt 1: 50%, Đợt 2: 40%, Đợt 3: 10%  
- **BR-FIN-02**: Chỉ Kế toán/Admin confirm đã thu tiền  
- **BR-FIN-03**: Hệ thống tự gửi nhắc bảo hành sau 6 tháng và 12 tháng khi dự án hoàn thành  
- **BR-FIN-04**: Phiếu bảo hành điện tử được tạo ngay khi dự án Completed  

---

## 8. NON-FUNCTIONAL REQUIREMENTS (First Stage)

| Hạng mục | Yêu cầu |
|---------|---------|
| **Responsive** | Mobile-first (thợ dùng điện thoại trên công trình) |
| **Upload ảnh** | Hỗ trợ jpg, png ≤ 50MB; video mp4 ≤ 200MB |
| **SMS/Zalo** | Tích hợp Zalo OA hoặc SMS gateway |
| **Timestamp** | Server-side timestamp, không tin vào client clock |
| **Authentication** | JWT, session 24h |
| **Authorization** | RBAC 4 roles (First Stage) |
| **Lưu trữ ảnh** | Local Object Storage (S3-compatible) – Google Drive Phase sau |
| **Performance** | API < 500ms, upload < 30s |
| **Offline** | Thợ có thể queue upload khi mất kết nối (ưu tiên Phase sau) |

---

*Tài liệu này là nền tảng cho Roadmap, Wireframes và quy trình phát triển BA-V3 First Stage.*
*Phiên bản: 3.0 | Ngày: 2026-03-02 | Trạng thái: Draft*
