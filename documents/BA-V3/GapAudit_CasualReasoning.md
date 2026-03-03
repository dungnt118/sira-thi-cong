# 🔍 GAP AUDIT & CASUAL REASONING REPORT – BA-V3
**Audit & Phát hiện Missing Function – Giai đoạn First Stage**
**Phiên bản: 2.0 | Cập nhật: 2026-03-03**

---

## CHANGELOG

| Phiên bản | Ngày | Nội dung |
|-----------|------|---------|
| 1.0 | 2026-03-02 | Audit vòng 1, phát hiện 9 gaps |
| 2.0 | 2026-03-03 | Xác nhận gaps từ PM, tạo WF bổ sung, Audit vòng 2 với 12 tình huống thực tế |

---

## PHẦN 1: CÁC XÁC NHẬN TỪ PM (TRƯỚC KHI AUDIT VÒNG 2)

### PM đã xác nhận:

| Gap | Quyết định PM | Ghi chú |
|-----|--------------|---------|
| #6 – Báo giá → Milestone | **XÁC NHẬN**: Báo giá approve → auto-create milestone 50-40-10 | Đã cập nhật WF-04 |
| #8 – Đổi thợ kế thừa | **XÁC NHẬN**: Thợ mới thấy đầy đủ lịch sử thợ cũ | Đã note trong WF-08 |
| #9 – Block bước thiếu VT | **XÁC NHẬN**: Hệ thống BLOCK bước cho đến khi PX được ký nhận | Đã cập nhật WF-07 |
| Customer Portal | **THAY ĐỔI**: Đưa vào First Stage (không defer) | Tạo WF-ADD-05 mới |

---

## PHẦN 2: TỔNG HỢP GIẢI QUYẾT 9 GAPS (AUDIT VÒNG 1)

| # | Gap | Mức | Trạng thái | Wireframe |
|---|-----|-----|-----------|-----------|
| 1 | PM xem báo cáo tài chính simplified | Medium | ✅ **RESOLVED** | WF-ADD-06 |
| 2 | Quản lý Template Checklist (Admin/PM) | High | ✅ **RESOLVED** | WF-ADD-01 |
| 3 | Thợ báo cáo sự cố nhanh | Critical | ✅ **RESOLVED** | WF-ADD-02 |
| 4 | Form Tạo Phiếu Nhập Kho | Medium | ✅ **RESOLVED** | WF-ADD-03 |
| 5 | Admin cấu hình template checklist | Critical | ✅ **RESOLVED** | WF-ADD-01 (chung) |
| 6 | Liên kết Báo giá → HĐ → Payment | Medium | ✅ **RESOLVED** | WF-04 (updated) |
| 7 | Flow Cancel dự án (hoàn kho, lịch sử) | High | ✅ **RESOLVED** | WF-ADD-04 |
| 8 | Đổi thợ giữa chừng kế thừa progress | Medium | ✅ **RESOLVED** | WF-08 + BR confirmed |
| 9 | Block bước nếu thiếu vật tư | Low→High | ✅ **RESOLVED** | WF-07 (updated) |
| 10 | Customer Portal | Critical (mới) | ✅ **RESOLVED** | WF-ADD-05 (NEW) |

**→ Tất cả 9 gaps (+ 1 gap mới từ PM) đã được giải quyết với WF đầy đủ.**

---

## PHẦN 3: AUDIT VÒNG 2 – TÌNH HUỐNG THỰC TẾ MỞ RỘNG

*Thực hiện 12 tình huống cụ thể hơn, phản ánh thực tế vận hành.*

---

### Tình huống 1: PM tạo dự án nhưng chưa có báo giá approve

**Scenario**: KH đồng ý miệng, PM muốn tạo dự án ngay để thợ bắt đầu, nhưng báo giá chưa được duyệt.

**Phân tích**:
- WF-07: Precondition = "KH đã ở trạng thái Đã ký HĐ"
- Nếu chưa có báo giá → KH chưa ở state đúng → PM không tạo được dự án

**⚠️ GAP-V2-01 MỚI**: Cần màn hình "Tạo dự án khẩn cấp" (Fast Track Mode) cho trường hợp đặc biệt này, hoặc define rõ: **PM được phép tạo dự án dù chưa có BG không?**

**Mức độ**: 🟡 Medium – Thực tế sẽ xảy ra, cần quyết định business rule

**Suggested Solution**: Thêm option "Bỏ qua yêu cầu báo giá" với xác nhận Admin/PM cấp cao.

---

### Tình huống 2: Thợ thi công 2 bước song song (2 tầng cùng lúc)

**Scenario**: Dự án lớn, thợ có 2 người làm song song 2 khu vực khác nhau.

**Phân tích**:
- Checklist hiện tại = 1 luồng tuần tự
- BR-TCK-02: Bước N+1 locked cho đến khi N xong
- Không hỗ trợ "Bước 5 tầng A" chạy song song "Bước 5 tầng B"

**⚠️ GAP-V2-02 MỚI**: Template 1 luồng thẳng không phù hợp với công trình nhiều khu vực.

**Mức độ**: 🟡 Medium – Ảnh hưởng tới các dự án > 200m²

**Suggested Solution**: Phase 1 → Accept limitation: 1 checklist / 1 dự án. Document rõ. Phase 2 → Multi-zone checklist.

---

### Tình huống 3: PM tạo nhiều báo giá cho cùng 1 KH (version báo giá)

**Scenario**: KH muốn so sánh 2 phương án (Standard vs Premium), PM cần lập 2 báo giá.

**Phân tích**:
- WF-04 chưa xử lý versioning báo giá
- Khi PM lập báo giá thứ 2, báo giá thứ 1 ở đâu? Được giữ lại hay overwrite?

**⚠️ GAP-V2-03 MỚI**: Cần define behavior khi có nhiều báo giá cho cùng 1 KH.

**Mức độ**: 🟡 Medium – Thường xuyên xảy ra trong thực tế

**Suggested Solution**: KH có thể có nhiều báo giá (list trong WF-06). Mỗi báo giá có trạng thái: Draft / Gửi KH / KH chấp nhận / KH từ chối. Chỉ 1 báo giá được "Chấp nhận" → tạo milestone.

---

### Tình huống 4: Kế toán tạo phiếu xuất kho nhưng thiếu vật tư → Thợ bị BLOCK

**Scenario**: Kho hết SIRA PU phủ. Kế toán chỉ tạo phiếu xuất SIRA PU lót. Thợ bị block ở bước "Quét PU phủ".

**Phân tích**:
- Theo Gap #9 confirmed: Block bước khi chưa có PX
- Vấn đề: Quy trình nhập kho (WF-ADD-03) → Đặt hàng nhà cung cấp chưa được thiết kế
- Ai quản lý đơn đặt hàng nhà cung cấp? Kế toán hay Admin?

**⚠️ GAP-V2-04 MỚI**: Thiếu flow "Đặt hàng nhà cung cấp" khi kho hết vật tư.

**Mức độ**: 🟢 Low (First Stage) – Có thể xử lý offline, hệ thống chỉ cảnh báo

**Suggested Solution**: Phase 1 → Hệ thống gửi email/notification cảnh báo thiếu kho. Kế toán đặt hàng offline. Sau khi nhập kho (WF-ADD-03) → tự động unblock. Phase 2 → PO (Purchase Order) module.

---

### Tình huống 5: KH truy cập Customer Portal xem thấy ảnh chưa được PM duyệt

**Scenario**: Thợ upload ảnh → PM chưa kịp review → KH vào portal thấy ảnh chưa approved.

**Phân tích**:
- WF-ADD-05 ghi rõ: KH chỉ thấy ảnh APPROVED
- BR đã đúng – chỉ ảnh approved mới hiện trên portal

**Status**: ✅ Đã xử lý rõ trong WF-ADD-05 – không có gap

---

### Tình huống 6: Dự án hoàn thành nhưng phiếu bảo hành cần 2 loại (Sàn + Tường cùng công trình)

**Scenario**: Dự án bao gồm cả chống thấm sàn AND tường cùng địa điểm.

**Phân tích**:
- WF-26 tạo 1 phiếu bảo hành / dự án
- Nhưng bảo hành sàn vs tường có thể có thời hạn khác nhau

**⚠️ GAP-V2-05 MỚI**: Phiếu bảo hành chưa hỗ trợ multi-item với hạn khác nhau.

**Mức độ**: 🟢 Low (First Stage) – Có thể dùng 1 hạn chung

**Suggested Solution**: Phase 1 → 1 phiếu, 1 hạn bảo hành (lấy hạn ngắn nhất hoặc theo loại chính). Phase 2 → Multi-item warranty card.

---

### Tình huống 7: PM cần giao dự án cho PM khác (thuyên chuyển)

**Scenario**: PM A nghỉ phép, PM B cần tiếp nhận các dự án của PM A.

**Phân tích**:
- Hiện tại WF-08 chỉ cho phép đổi thợ, không đổi PM
- Cần Admin thực hiện reassign PM trong dự án

**⚠️ GAP-V2-06 MỚI**: Thiếu flow "Đổi PM phụ trách" cho dự án (Admin only).

**Mức độ**: 🟡 Medium – Thực tế xảy ra khi PM nghỉ/bệnh

**Suggested Solution**: Admin → Chi tiết dự án → [⚙️ Đổi PM phụ trách] → Chọn PM mới → Notification cho PM mới và PM cũ.

---

### Tình huống 8: Kế toán cần in báo cáo cuối tháng tổng hợp tất cả dự án

**Scenario**: Mỗi tháng Kế toán cần báo cáo: Tổng doanh thu, Tổng chi phí VT, Top KH lớn nhất.

**Phân tích**:
- WF-24 có Dashboard Tài chính, WF-25 có Báo cáo từng dự án
- Chưa có "Monthly Report" tổng hợp cross-project với export Excel

**⚠️ GAP-V2-07 MỚI**: Monthly Financial Report chưa có WF chi tiết.

**Mức độ**: 🟡 Medium – Kế toán cần mỗi tháng

**Suggested Solution**: Bổ sung vào WF-24/25 tab "Báo cáo tháng" với filter tháng và export Excel. Đây là extension của WF-25 hiện có, không cần WF mới hoàn toàn.

---

### Tình huống 9: Thợ claim họ đã hoàn thành bước nhưng ảnh bị mất do lỗi upload

**Scenario**: Thợ tick bước xong, ảnh upload bị fail, PM không thấy ảnh nhưng bước đã completed.

**Phân tích**:
- BR-TCK-01: Upload ảnh TRƯỚC khi tick → hệ thống không cho tick nếu chưa có ảnh
- Tuy nhiên: sau khi tick thành công, ảnh bị xóa/hỏng server-side thì sao?

**Phân tích kỹ**: Flow là: Upload → Success callback → Nút [Xác nhận] active → Tick. Nếu upload có race condition và trả về success giả → bước có thể bị tick mà không có ảnh.

**⚠️ GAP-V2-08 (Kỹ thuật)**: Cần server-side validation: bước không thể mark completed nếu evidence_count = 0 trong DB. Backend validation làm tầng cuối.

**Mức độ**: 🟡 Medium (kỹ thuật) – Cần dev team xử lý ở BE

**Suggested Solution**: API endpoint `/steps/{id}/complete` cần kiểm tra `evidence_count >= min_required_photos` trước khi cho phép.

---

### Tình huống 10: Admin muốn xem audit log – Ai làm gì lúc nào trong hệ thống?

**Scenario**: Xảy ra tranh chấp (KH nói thợ không làm đủ bước, công ty nói có). Admin cần audit trail đầy đủ.

**Phân tích**:
- WF-12 có Activity Log cho từng dự án (đúng) nhưng chỉ PM thấy
- Không có màn hình "System Audit Log" tổng thể cho Admin

**⚠️ GAP-V2-09 MỚI**: Admin Audit Log screen chưa có WF.

**Mức độ**: 🟡 Medium (quan trọng khi có tranh chấp)

**Suggested Solution**: Settings > Audit Log: Filter theo User, Dự án, Loại hành động, Thời gian. Xuất CSV. Đây là Phase 1 feature – cần thiết kế đơn giản.

---

### Tình huống 11: Notification overload – PM nhận 50 thông báo/ngày

**Scenario**: PM đang quản lý 5 dự án, mỗi dự án thợ upload 10 ảnh/ngày → 50 notifications/ngày về "Thợ hoàn thành bước".

**Phân tích**:
- WF-12 có Nhật ký hoạt động (thợ làm xong bước)
- Nếu mỗi bước trigger 1 notification → PM bị spam

**⚠️ GAP-V2-10 (UX)**: Cần Notification Preferences – PM chọn nhận thông báo loại nào.

**Mức độ**: 🟡 Medium (UX Critical – ảnh hưởng adoption)

**Suggested Solution**: Settings > Thông báo: Toggle từng loại: Thợ xong bước / Sự cố / Payment / Bảo hành. Default: chỉ Sự cố và Payment mới notify real-time. Bước thi công → digest 1 lần/ngày.

---

### Tình huống 12: KH yêu cầu đổi hạng mục sau khi đã ký HĐ (Change Order)

**Scenario**: Sau khi ký HĐ và tạo dự án, KH muốn thêm hạng mục chống thấm tường cầu thang.

**Phân tích**:
- Không có flow "Change Order" hay "Addendum" trong V3
- PM cần tăng giá trị HĐ, thêm hạng mục và vật tư

**⚠️ GAP-V2-11 MỚI**: Change Order flow chưa có.

**Mức độ**: 🟢 Low (First Stage có thể xử lý offline, tạo dự án mới)

**Suggested Solution**: Phase 1 → Tạo dự án mới (linked to same KH) cho addon work. Phase 2 → Change Order module.

---

### Tình huống 13: KH yêu cầu đổi Hành trình Khách hàng (Pipeline Khác nhau)

**Scenario**: Kinh doanh có nhiều kịch bản chốt sale khác nhau (VD: Bán lẻ vs Dự án lớn), không thể dùng một định dạng Kanban cố định.
**Phân tích**:
- WF-05 đang gạch cứng 4 cột (Đang KS, Báo giá, Ký HĐ, Từ chối).
- Cần tuỳ biến Pipeline mượt mà, đổi kịch bản Sale mà không mất dấu vết Customer cũ.

**⚠️ GAP-V2-12 MỚI**: Pipeline Kanban hiện tại bị fix cứng. Thiếu cấu hình Pipeline.
**Mức độ**: 🔴 Critical (Hệ thống lớn bắt buộc phải có Dynamic Pipeline)
**Status**: ✅ **RESOLVED** (Thiết kế Schema mapping tại WF-ADD-11)

---

### Tình huống 14: Khách hàng cũ quay lại yêu cầu dịch vụ mới (Khảo sát thêm hạng mục khác)

**Scenario**: KH Nguyễn Văn A đã chống thấm mái xong (Dự án đã hoàn thành). 6 tháng sau, KH A gọi điện báo thấm tường hầm và yêu cầu KS báo giá.
**Phân tích (Phản biện thiết kế dữ liệu)**:
- Cấu trúc `Customer` hiện tại đang chứa `pipelineId`, `stageId`, `surveyImages`, `quotations`.
- Khi thiết kế như hiện tại, Pipeline Kanban đang theo dõi **Khách hàng (Customer)** chứ KHÔNG PHẢI **Cơ hội bán hàng (Deal / Service Request)**.
- Nếu KH A gọi lại, để đưa KH A vào lại Pipeline Kanban, ta sẽ phải reset trạng thái của KH A về `NEW` hoặc tạo một `Customer` duplicate (trùng số ĐT). Cả 2 cách đều sai kiến trúc.
- Ngoài ra, việc nhồi tất cả ảnh KS và Báo giá vào trong object Customer sẽ khiến ta không biết Báo giá/Ảnh nào thuộc về Yêu cầu "Chống thấm mái" và Báo giá nào thuộc về "Chống thấm tường hầm" trước khi Project được tạo ra.

**⚠️ GAP-V2-13 (KIẾN TRÚC MỚI)**: Nhầm lẫn đối tượng theo dõi trên Kanban. Kanban cần theo dõi *Yêu cầu dịch vụ (Service Request / Deal)* thay vì *Khách hàng (Customer)*.
**Mức độ**: 🔴 Critical (Sai lầm Kiến trúc lõi của CRM, cần đập đi xây lại luồng dữ liệu này trước khi build các component tiếp theo.)
**Suggested Solution**: Tách một Object mới gọi là `ServiceRequest` (hoặc `Deal`). 1 Khách hàng có thể có nhiều `ServiceRequest`. `PipelineId`, `StageId`, `Survey`, `Quotation` sẽ nằm trong `ServiceRequest`. Kanban board sẽ map data từ `ServiceRequest`.

---

## PHẦN 4: TỔNG HỢP GAPS MỚI – AUDIT VÒNG 2

| # | Gap | Mức | Recommendation |
|---|-----|-----|---------------|
| V2-01 | Tạo DA khẩn cấp khi chưa có BG | 🟡 Medium | Thêm business rule: Admin có thể override |
| V2-02 | Checklist 1 luồng không phù hợp dự án nhiều khu vực | 🟡 Medium | **Accept + Document** cho Phase 1 |
| V2-03 | Nhiều version báo giá / 1 KH | 🟡 Medium | Cần WF bổ sung cho WF-06 |
| V2-04 | Flow Đặt hàng NCC khi kho hết | 🟢 Low | Phase 2, Phase 1 xử lý offline |
| V2-05 | Multi-item warranty (sàn+tường khác hạn) | 🟢 Low | Phase 2, Phase 1 dùng 1 hạn chung |
| V2-06 | Đổi PM phụ trách dự án (Admin only) | 🟡 Medium | Thêm vào WF-14 (Admin Dashboard) |
| V2-07 | Monthly Financial Report (export Excel) | 🟡 Medium | Extension của WF-24/25 |
| V2-08 | Server-side validation evidence trước khi complete step | 🟡 Medium (Kỹ thuật) | BE task, không cần thêm WF |
| V2-09 | Admin Audit Log screen | 🟡 Medium | Cần WF bổ sung Settings |
| V2-10 | Notification Preferences / Anti-spam | 🟡 Medium | Cần WF bổ sung Settings |
| V2-11 | Change Order flow | 🟢 Low | Phase 2, Phase 1 dùng DA mới |
| V2-12 | Cấu hình Hành trình Khách hàng (Kanban) động | 🔴 Critical | Đã tạo WF-ADD-11 để resolve kiến trúc mapping |
| V2-13 | Sai đối tượng Kanban: Cần track Deal (Service Request), không phải Customer | 🔴 Critical | Tách model `ServiceRequest` |

---

## PHẦN 5: ĐÁNH GIÁ MỨC ĐỘ HOÀN THIỆN

### Scorecard – Sẵn sàng để build?

| Tiêu chí | Điểm | Ghi chú |
|---------|------|---------|
| **Core Flows (4 module)** đã có WF đầy đủ | ⭐ 9/10 | Tất cả happy path covered |
| **Actor Flows** đã cover hết | ⭐ 8/10 | Admin audit log và notification pref còn thiếu |
| **Edge Cases** đã xử lý | ⭐ 7/10 | 11 gap mới, 5 medium cần address trong sprint |
| **Business Rules** đã confirm | ⭐ 9/10 | Gap #6,#8,#9 + Customer Portal đã confirmed |
| **Data Flows** giữa module rõ ràng | ⭐ 8/10 | CRM→DA→Kho→TC→BH liên kết logic |
| **Mobile UX** (Thợ) đã thiết kế | ⭐ 9/10 | WF-09,10,11,19 mobile-first đầy đủ |

**TỔNG ĐIỂM: 50/60 = 83%**

---

### ✅ CÓ THỂ BẮT ĐẦU BUILD – KÈM ĐIỀU KIỆN

```
🟢 TÍNH NĂNG: Đủ để bắt đầu Sprint 1 & 2 ngay lập tức
   - Foundation (Auth, User Management)
   - CRM (Danh sách KH, Pipeline, Khảo sát, Báo giá)

🟡 CẦN CLARIFY TRƯỚC KHI BUILD Sprint 3+:
   - V2-01: PM có thể tạo DA khi chưa có BG không? (Business rule)
   - V2-03: Nhiều BG / 1 KH: có cần versioning không?
   - V2-06: Đổi PM: Thêm vào Sprint nào?

🟡 BUILD SONG SONG & CLOSE TRONG SPRINT:
   - V2-07: Monthly Report → Extension nhỏ của WF-25
   - V2-08: BE validation → Dev task, không cần WF
   - V2-09: Admin Audit Log → Sprint 6 (last sprint)
   - V2-10: Notification Preferences → Sprint 6 hoặc sau Go-live

🟢 ACCEPT CHO PHASE 1 (DEFER TO PHASE 2):
   - V2-02: Multi-zone checklist → Document limitation rõ ràng
   - V2-04: PO Module → Xử lý offline
   - V2-05: Multi-item warranty → 1 hạn chung
   - V2-11: Change Order → Tạo DA mới cho addon
```

---

### Recommendation Cuối

> **Quyết định**: ✅ **GO – Bắt đầu Sprint 1 ngay**
>
> Với 83% mức độ hoàn thiện, bộ tài liệu đã đủ chắc để dev team bắt tay vào Sprint 1 & 2. Các gap còn lại (V2-01, V2-03, V2-06) cần **PM confirm trong 1 cuộc họp ngắn 30 phút** trước khi Sprint 3 bắt đầu. Không có gap nào đủ nghiêm trọng để block toàn bộ project.
>
> **Ưu tiên clarify ngay**: V2-01 (Tạo DA không có BG), V2-03 (Nhiều BG/KH), V2-06 (Đổi PM).

---

*Gap Audit Report V3.0 (v2.0) | Updated: 2026-03-03 | Status: **READY FOR REVIEW***
