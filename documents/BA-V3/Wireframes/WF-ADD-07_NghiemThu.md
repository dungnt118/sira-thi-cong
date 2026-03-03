# WF-ADD-07 – Biên bản Nghiệm thu (Acceptance Protocol)
**Đưa vào First Stage | Actor: Giám Sát (Supervisor)**

---

## Bối cảnh nghiệp vụ
Theo Sheet 1 "Hành trình trải nghiệm KH" (Bước B9) và Sheet 2 (Mục 6), khi dự án hoàn thành các bước thi công, **Giám Sát** phải tiến hành nghiệm thu trực tiếp với **Khách hàng** ngay tại công trình.

**Sự thay đổi so với BA-V3 trước đây**:
- Trước đây WF-07 chỉ dừng ở việc hoàn thành tất cả các bước checklist thì dự án đổi trạng thái. 
- Nay bắt buộc phải có bước tạo Biên bản Nghiệm thu và Khách hàng xác nhận.

## WF-ADD-07-A: Màn hình Giám Sát tạo Biên bản Nghiệm thu

Màn hình này xuất hiện khi tất cả checklist các bước của dự án đã `APPROVED`. Nút "Nghiệm thu dự án" sẽ sáng lên tại App Giám Sát.

```
┌────────────────────────────────────────────────────────────────────┐
| [🔙 Quay lại]              TẠO BIÊN BẢN NGHIỆM THU                 |
├────────────────────────────────────────────────────────────────────┤
| DỰ ÁN: DA-001 (Chống thấm tầng mái)                                |
| KHÁCH HÀNG: Nguyễn Văn A                                           |
|                                                                    |
| TÌNH TRẠNG CHUNG:                                                  |
| [✓] Đã hoàn thành 18/18 bước thi công                              |
| [✓] PM đã duyệt toàn bộ hình ảnh                                   |
| [✓] Vật tư thực tế đã khớp phiếu xuất                              |
|                                                                    |
| NỘI DUNG NGHIỆM THU:                                               |
| Khối lượng thực tế: [ 100 ] m2 (Sửa lại: [     ] m2 nếu có PS)     |
| [📝 Ghi chú tình trạng / ý kiến KH (Tùy chọn)............]         |
|                                                                    |
| MÃ QR KÝ NGHIỆM THU CHO KHÁCH HÀNG:                                |
| (Đưa KH quét mã này để đọc biên bản và xác nhận điện tử)           |
|                                                                    |
|           ┌──────────────┐                                         |
|           |              |                                         |
|           |   QR CODE    |                                         |
|           |              |                                         |
|           └──────────────┘                                         |
|                                                                    |
| KH đã ký xác nhận? [    ] Chờ Khách hàng quét mã...                |
|                                                                    |
| HOẶC (Trường hợp KH không có smartphone / Ký giấy):                |
| [📸 Chụp ảnh Khách hàng ký trên giấy]                              |
|                                                                    |
| [✔️ GỬI BIÊN BẢN VÀ HOÀN THÀNH DỰ ÁN] (Block đến khi có chữ ký/ảnh)|
└────────────────────────────────────────────────────────────────────┘
```

## Logic Workflow
1. Nếu Giám sát rà soát thấy số m2 thực tế lệch so với Hợp đồng ban đầu, có thể nhập m2 thực tế vào.
2. QR Code sinh ra động một trang Link xác nhận (độc lập hoặc nhúng chung token portal).
3. Nếu KH không ký online được, Giám Sát ký biên bản giấy, chụp ảnh up lên.
4. Nhấn Hoàn thành → Hệ thống đổi trạng thái Dự án sang `COMPLETED`.
5. Hệ thống kích hoạt Notification cho Kế Toán: Tạo thanh toán Đợt Cưới và sinh Phiếu Bảo Hành tự động.
