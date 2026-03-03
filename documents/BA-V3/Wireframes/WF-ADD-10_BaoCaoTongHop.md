# WF-ADD-10 – Báo cáo Tổng hợp Công trình (Site Synthesis Report)
**Đưa vào First Stage | Actor: Giám Sát (Supervisor), xem bởi PM**

---

## Bối cảnh nghiệp vụ
Theo Sheet 2 (Mục 3b), Giám Sát cần tạo Báo cáo Tổng hợp sau khi dự án hoàn thành, làm căn cứ bàn giao, thanh toán khối lượng với tổ thợ, và lưu trữ hồ sơ chất lượng công trình trình Khách hàng.

## WF-ADD-10-A: Request Báo cáo Tổng hợp (Từ phía PM/Admin)

```
┌────────────────────────────────────────────────────────────────────┐
| THÔNG TIN DỰ ÁN: DA-2501 (Hoàn thành: 15/03/2026)                  |
├────────────────────────────────────────────────────────────────────┤
| [📄 IN BÁO CÁO NGHIỆM THU (KH KÝ)]                                 |
| [📄 IN BÁO CÁO TỔNG HỢP CÔNG TRÌNH (DOCUMENTATION)]                |
|                                                                    |
| Báo cáo tổng hợp được hệ thống tự động sinh ra dựa trên:           |
|  - Danh sách Vật tư thực xuất từ kho                               |
|  - Log thời gian thợ (GS báo cáo check-in)                         |
|  - Các ảnh Evidence 18 bước (kèm tọa độ & mốc t/g)                 |
|  - Cảnh báo Sự cố đã ghi nhận và đã khắc phục                      |
└────────────────────────────────────────────────────────────────────┘
```

## WF-ADD-10-B: Layout PDF - Báo cáo Tổng hợp Công trình (Draft)

Báo cáo này được tự động generate ra PDF gửi Khách Hàng hoặc lưu trữ nội bộ.

```
┌────────────────────────────────────────────────────────────────────┐
| [LOGO CTY]              BÁO CÁO TỔNG HỢP CÔNG TRÌNH                |
|                    (SITE SYNTHESIS REPORT)                         |
|                                                                    |
| 1. THÔNG TIN CÔNG TRÌNH                                            |
|    - Chủ đầu tư: Nguyễn Văn A        - Hạng mục: Chống thấm mái    |
|    - Địa chỉ: 123 ABC, Quận 1        - Diện tích: 100 m²           |
|    - Ngày làm: 10/03 - 15/03         - GS phụ trách: Tuấn          |
|                                                                    |
| 2. GHI NHẬN VẬT TƯ ĐÃ SỬ DỤNG                                      |
|    - SIRA PU Lót: 20 Thùng (Theo PX-099, PX-102)                   |
|    - SIRA PU Phủ: 15 Thùng (Theo PX-104)                           |
|    - Lưới thủy tinh: 50 Mét                                        |
|                                                                    |
| 3. NHẬT KÝ THI CÔNG CHI TIẾT (Trích lập từ hệ thống Checklist)     |
|                                                                    |
|    Ngày 10/03/2026: (2 Bước)                                       |
|    [✓] 08:30 – B1: Mài nền vệ sinh sạch sẽ                        |
|        KS Tuấn xác nhận.                 [📷 Ảnh 1] [📷 Ảnh 2]     |
|    [✓] 14:00 – B2: Kiểm tra bề mặt, xử lý nứt                     |
|        Đã dùng 2 tuýp keo SIRA Flex      [📷 Ảnh 3]                |
|                                                                    |
|    Ngày 11/03/2026: (1 Tình huống sự cố)                           |
|    [⚠️] 09:00 – B5: Quét PU Lót         [📷 Ảnh sự cố]             |
|        Mưa bất chợt, GS Tuấn cho dừng thi công và phủ bạt che.     |
|        -> Đã khắc phục vào 14:00.                                  |
|                                                                    |
|    ..............................................                  |
|                                                                    |
| 4. XÁC NHẬN CHỦ CÔNG TRÌNH VÀ GIÁM SÁT                             |
|    [ CHỮ KÝ PM ]      [ CHỮ KÝ GS ]     [ CHỮ KÝ KHÁCH HÀNG ]      |
└────────────────────────────────────────────────────────────────────┘
```

## Logic Workflow
1. Hệ thống dùng dữ liệu của `Checklist` (Evidence ảnh, time log), `MaterialPlan & StockOut` (Vật tư) và `Incident` (Sự cố) gộp lại thành báo cáo.
2. Không cần Giám Sát phải viết văn bản word từ đầu, chỉ review báo cáo PDF sinh ra, add thêm text "Tổng kết chung" và in ra / share link.
