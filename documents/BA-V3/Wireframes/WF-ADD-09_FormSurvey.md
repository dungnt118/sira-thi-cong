# WF-ADD-09 – Form Khảo sát Công trình Chuẩn hóa
**Đưa vào First Stage | Actor: Giám Sát (Supervisor) hoặc PM**

---

## Bối cảnh nghiệp vụ
Theo Sheet 2 (Mục 4), bước Khảo sát hiện trạng (B3) yêu cầu Supervisor / PM đến công trình để đánh giá cụ thể mức độ thấm dột, đo đạc và upload ảnh trước khi lập giải pháp (BOM) & báo giá.
Trong BA-V3 hiện tại (WF-03), chỉ có chức năng chung chung là "Upload ảnh và ghi độ ẩm". Tính năng cần được **chuẩn hóa form** để đảm bảo dữ liệu chất lượng.

## WF-ADD-09-A: Danh sách Form Khảo Sát tại Dự án (Trạng thái: Khảo sát)

```
┌────────────────────────────────────────────────────────────────────┐
| [🔙 Quay lại]              KHẢO SÁT HIỆN TRẠNG                     |
├────────────────────────────────────────────────────────────────────┤
| DỰ ÁN: DA-2501 (Khách: Nguyễn Văn A)                               |
| Trạng thái DA: Đang khảo sát                                       |
|                                                                    |
| [➕ TẠO PHIẾU KHẢO SÁT MỚI]                                        |
|                                                                    |
| Lịch sử khảo sát:                                                  |
| 1. Ngày 10/03: Khảo sát sàn mái tầng 3  [Tải PDF] [📝 Sửa]         |
|    - Thực hiện: GS Trần Văn Tuấn                                   |
|    - Kết luận: Thấm ngược nghiêm trọng, diện tích 45m2             |
└────────────────────────────────────────────────────────────────────┘
```

## WF-ADD-09-B: Chi tiết Form Khảo sát (Input)

```
┌────────────────────────────────────────────────────────────────────┐
| [❌ Hủy]                   TẠO PHIẾU KHẢO SÁT              [💾 Lưu]|
├────────────────────────────────────────────────────────────────────┤
| DỰ ÁN: DA-2501 (Khách: Nguyễn Văn A)                               |
| NGÀY KHẢO SÁT: [10/03/2026]         NGƯỜI THỰC HIỆN: [Tuấn (GS)]   |
|                                                                    |
| 1. THÔNG TIN CHUNG KHU VỰC KHẢO SÁT                                |
| Hạng mục: [●] Sàn mái  [○] Tầng hầm  [○] Khu vệ sinh  [○] Tường    |
| Tình trạng sử dụng: [Đang ở / Sinh hoạt bình thường] ▼             |
| Diện tích ước tính: [  45   ] m2                                   |
|                                                                    |
| 2. ĐÁNH GIÁ MỨC ĐỘ THẤM & HIỆN TRẠNG BỀ MẶT                        |
| - Độ ẩm nền bê tông: [  18  ] % (Mức: Cao)                         |
| - Mức độ thấm: [●] Nhe  [○] Trung bình  [○] Nặng (Thấm ngược)      |
| - Tình trạng bề mặt: (Chọn nhiều)                                  |
|   [x] Đã lót gạch                                                  |
|   [x] Bê tông bong rộp                                             |
|   [ ] Đọng nước cục bộ                                             |
|                                                                    |
| 3. HÌNH ẢNH MINH CHỨNG (Bắt buộc tối thiểu 3 ảnh tĩnh + 1 video)   |
| [📷 Toàn cảnh]          (1 ảnh)                                    |
| [📷 Chi tiết vết nứt]   (2 ảnh)                                    |
| [🎥 Video hiện trạng]   (1 video 15s)                              |
|                                                                    |
| 4. ĐỀ XUẤT SƠ BỘ TỪ NGƯỜI KHẢO SÁT                                 |
| Cần lột gạch cũ, mài nền trước khi quét lót PU. Cân nhắc dùng      |
| lưới thủy tinh ở các góc chân tường dài 15m.                       |
|                                                                    |
| [✔️ LƯU PHIẾU KHẢO SÁT & HOÀN THÀNH BƯỚC]                          |
└────────────────────────────────────────────────────────────────────┘
```

## Logic Workflow
1. GS hoặc PM đều có thể đến khảo sát và nhập phiếu này bằng dtdd/tablet.
2. Dữ liệu này sẽ là input bắt buộc để Kế toán / Kỹ thuật lên Công thức tính giá (BOM định mức) và PM tạo Báo giá (WF-04).
3. Cho phép Xuất PDF phiếu khảo sát có logo báo cáo cho KH xem.
