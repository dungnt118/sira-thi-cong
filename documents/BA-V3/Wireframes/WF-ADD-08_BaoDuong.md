# WF-ADD-08 – Báo cáo Bảo dưỡng định kỳ (Maintenance Visit)
**Đưa vào First Stage | Actor: Giám Sát (Supervisor)**

---

## Bối cảnh nghiệp vụ
Theo Sheet 1 "Hành trình trải nghiệm KH" (Bước B11) và Sheet 2 (Mục 7), sau khi bàn giao, dự án sẽ vào thời kỳ Bảo Hành (thường là 12 - 24 tháng).
Theo cam kết, **Giám Sát** phải đến công trình kiểm tra bảo dưỡng định kỳ mỗi 6 tháng một lần.

**Sự thay đổi so với BA-V3 trước đây**:
- Trước đây WF-26 chỉ có "Phiếu Bảo Hành" và SMS nhắc nhở. Không có feature cho Giám sát đi bảo dưỡng.

## WF-ADD-08-A: Danh sách lịch bảo dưỡng (App Giám Sát)

Nằm trong Menu: **Lịch Bảo Dưỡng** (thay vì chỉ xem Công trình đang thi công).

```
┌────────────────────────────────────────────────────────────────────┐
| [🍔 Menu]                 LỊCH BẢO DƯỠNG SẮP TỚI                   |
├────────────────────────────────────────────────────────────────────┤
| 📅 THÁNG NÀY (2 công trình đến hạn 6 tháng)                        |
|                                                                    |
| [DA-2501] Nhà phố Anh A - Chống thấm hầm                           |
| Hạn chót: 15/03/2026 (Còn 3 ngày)                                  |
| [📝 Đi bảo dưỡng ngay]                                             |
|                                                                    |
| [DA-2488] Biệt thự Chị B - Chống thấm mái                          |
| Hạn chót: 22/03/2026 (Còn 10 ngày)                                 |
| [📝 Đi bảo dưỡng ngay]                                             |
|                                                                    |
| 📅 THÁNG SAU (1 công trình đến hạn 12 tháng)                       |
| [DA-2401] Tòa nhà C - Chống thấm hầm                               |
| Lịch: 10/04/2026                                                   |
└────────────────────────────────────────────────────────────────────┘
```

## WF-ADD-08-B: Form Báo cáo Bảo dưỡng tại công trình

```
┌────────────────────────────────────────────────────────────────────┐
| [🔙 Quay lại]              BÁO CÁO BẢO DƯỠNG (Kỳ 6 Tháng)          |
├────────────────────────────────────────────────────────────────────┤
| DỰ ÁN: DA-2501 (Chống thấm hầm)                                    |
| KHÁCH HÀNG: Nguyễn Văn A                                           |
|                                                                    |
| 1. CHECKLIST KIỂM TRA BỀ MẶT:                                      |
| - Tình trạng lớp phủ PU:   [●] Tốt  [○] Có vết xước  [○] Bong tróc |
| - Độ ẩm đo được:           [   thấp (<15%)   ] ▼                   |
| - Kiểm tra chân góc tường: [●] Bình thường   [○] Có dấu hiệu thấm  |
|                                                                    |
| 2. HÌNH ẢNH HIỆN TRẠNG (Bắt buộc ít nhất 2 ảnh):                   |
| [📷 Chụp ảnh toàn cảnh]  [📷 Chụp góc chân tường]                  |
| (Đã tải lên 2 ảnh)                                                 |
|                                                                    |
| 3. GHI CHÚ / ĐỀ XUẤT:                                              |
| [ Tình trạng tốt, không có dấu hiệu thấm ngược................... ]|
|                                                                    |
| 4. XÁC NHẬN CỦA KHÁCH HÀNG:                                        |
| [📸 Chụp ảnh Khách hàng ký trên giấy HOẶC Quét QR xác nhận]        |
|                                                                    |
| [✔️ HOÀN THÀNH BẢO DƯỠNG]                                          |
└────────────────────────────────────────────────────────────────────┘
```

## Logic Workflow
1. Hệ thống tự động phát sinh Task "Bảo dưỡng 6 tháng", "12 tháng" dựa trên Ngày Nghiệm Thu.
2. Giám sát thấy lịch, đến hiện trường, làm checklist + chụp ảnh.
3. Nếu mọi thứ Tốt → Xong. Mốc bảo dưỡng tiếp theo được kích hoạt.
4. Nếu phát hiện Thấm / Lỗi → Cuối form có nút `[⚠️ Chuyển thành Yêu cầu Bảo Hành]`, tự động sinh ra Issue cho PM và Kỹ thuật (bước B12) để lên phương án xử lý.
