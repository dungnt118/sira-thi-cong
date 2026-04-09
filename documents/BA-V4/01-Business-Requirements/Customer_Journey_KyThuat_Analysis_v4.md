# Phân tích công trình khách hàng - Vai trò Kỹ thuật (Technical) v4

## 1. Nguồn gốc quy chiếu
Tài liệu phân tích này dựa trên:
1. `Customer Journey - Công trình trải nghiệm khách hàng.xlsx`
2. `Quy-trinh-lam-viec-theo-tung-buoc-trong-CUSTOMOR JOURNEY.docx`

Theo đó, vai trò **Kỹ thuật** đóng vai trò cực kỳ quan trọng trong giai đoạn định hình giải pháp (Pre-construction), triển khai thực tế (Execution), và chăm sóc sau bán (After-sales). Kỹ thuật **không chỉ** là nhân công ra công trường (Worker thuần túy) mà còn là chuyên gia đánh giá hiện trạng và tư vấn kỹ thuật.

## 2. Bóc tách trách nhiệm của Kỹ thuật theo Customer Journey

| Bước trong Journey | Trách nhiệm của Kỹ thuật | Phối hợp với |
|---|---|---|
| **1-2. Tiếp cận & Tư vấn** | Hỗ trợ Sale/Kinh doanh tư vấn chuyên môn sâu nếu được yêu cầu. Không phải đầu mối chính. | Sale |
| **3. Khảo sát (Trọng tâm)** | - Nhận lịch hẹn khảo sát trên hệ thống.<br>- Đến hiện trường làm việc trực tiếp với khách.<br>- Thu thập Thông tin hiện trạng: Diện tích, tình trạng thấm, nguyên nhân sơ bộ.<br>- Phập **Phiếu khảo sát** và lấy **chữ ký số** của khách hàng xác nhận tình trạng ngay tại hiện trường. | Sale, Customer |
| **4. Tư vấn giải pháp** | - Đưa ra các giải pháp kỹ thuật dựa trên dữ liệu khảo sát.<br>- Tổng hợp thông tin, **chuyển giao Báo cáo tổng hợp** về lại cho phòng Kinh doanh/Sale để làm việc về giá với khách. | Sale |
| **5-7. Báo giá & Hợp đồng**| Đóng vai trò tham vấn về kỹ thuật. Cập nhật giải pháp nếu khách yêu cầu đổi phương án trước khi chốt hợp đồng. | Sale, Accountant |
| **8. Triển khai thi công** | - Là nhân sự trực tiếp làm công trường.<br>- Nhận vật tư, thực hiện quy trình kỹ thuật sửa chữa/chống thấm.<br>- Báo cáo tiến độ hình ảnh hàng ngày cho Giám sát. | Giám sát, PM |
| **9. Nghiệm thu** | - Khắc phục các lỗi nếu có trong quá trình nghiệm thu nội bộ và nghiệm thu với khách. | Giám sát, PM |
| **10. Thanh toán** | Không tham gia trực tiếp. | Accountant |
| **11-12. Bảo hành & Bảo trì**| - Nhận lịch hẹn bảo trì định kỳ (vd: mỗi 6 tháng).<br>- Đến hiện trường kiểm tra, lập **Báo cáo bảo trì**.<br>- Thực hiện các nghiệp vụ sửa chữa nếu có yêu cầu Bảo hành (Warranty Claim). | PM, Customer |
| **13. Chăm sóc sau công trình**| Đưa các tư vấn chuyên môn nếu phát hiện các cơ hội (upsell) khác tại hiện trường. | Sale |

## 3. Các thực thể (Entities) liên quan trực tiếp đến Kỹ thuật
- `Survey Appointment`: Lịch hẹn khảo sát (Thời gian, địa điểm, liên hệ).
- `Survey Report / Phiếu Khảo Sát`: Form điền động tại hiện trường chứa text, multi-media (ảnh, video), và chữ ký touch khách hàng.
- `Solution Proposal`: Giải pháp kỹ thuật thô gửi cho Sale.
- `Task / Daily Log`: Đầu việc thi công được giao hàng ngày và báo cáo hình ảnh hiện trường.
- `Maintenance Ticket`: Phiếu yêu cầu bảo trì / bảo hành định kỳ.

## 4. Đặc tả ứng dụng phù hợp cho Kỹ thuật
Vai trò Kỹ thuật đòi hỏi tính di động cực cao. Do đó:
- **Nền tảng chính:** Mobile App (hoặc Web App Responsive giao diện Mobile-first).
- **Yếu tố tiên quyết:**
  - Khả năng làm việc **offline-first** hoặc chịu được mạng yếu tại công trình (ví dụ: tầng hầm không có sóng).
  - Tải ảnh/video nhanh gọn.
  - Lấy chữ ký điện tử trực tiếp trên màn hình điện thoại/tablet mượt mà.

## 5. Kết luận
Việc định nghĩa đúng "Kỹ thuật" thay thế cho "Worker" giúp BA-V4 bao phủ được toàn bộ hoạt động **Khảo sát** và **Đưa ra giải pháp**, lấp đầy khoảng trống cực lớn từ khi Sale nhận Lead đến khi ra được cái Báo giá trong quy trình chuẩn BAC Group.
