# Điều kiện chốt nhận việc và cảnh báo go/no-go v4

## 1. Mục tiêu

Chuẩn hóa cơ chế để BAC quyết định:

- có nhận làm hay không
- nhận làm với điều kiện gì
- cần báo giá lại hay từ chối

Tài liệu này biến các đánh giá đang làm thủ công thành rule có cấu trúc trên hệ thống.

## 2. Đầu vào đánh giá

`Go/No-Go Review` phải sử dụng tối thiểu các nhóm dữ liệu:

1. `Survey Snapshot`
2. `Estimate Version`
3. tồn kho và khả năng mua vật tư
4. lịch rảnh và năng lực của đội nội bộ/đội liên kết
5. đơn giá nhân công theo thời điểm
6. yêu cầu deadline từ khách hàng
7. ràng buộc hiện trường:
   - vị trí khó tiếp cận
   - cần giáo mác
   - cần đu dây
   - khung giờ thi công bị giới hạn
8. chi phí vận chuyển và số chuyến dự kiến

## 3. Các nhóm cảnh báo bắt buộc

### 3.1 Cảnh báo vật tư

Kích hoạt khi:

- vật tư chính không có tồn
- vật tư chính không có nguồn mua ổn định
- vật tư cần lead time dài hơn thời gian khách yêu cầu
- vật tư thay thế làm thay đổi bảo hành hoặc chất lượng

### 3.2 Cảnh báo nhân công

Kích hoạt khi:

- đội nội bộ không đủ người
- đội liên kết chưa sẵn sàng
- đơn giá nhân công tăng vượt ngưỡng cấu hình
- công trình yêu cầu kỹ năng đặc thù nhưng chưa có đội phù hợp

### 3.3 Cảnh báo thời gian

Kích hoạt khi:

- thời gian khách yêu cầu ngắn hơn `lead time vật tư + thời gian thi công tối thiểu`
- lịch của đội thi công đang xung đột
- điều kiện thời tiết hoặc khung giờ thi công ảnh hưởng trực tiếp tiến độ

### 3.4 Cảnh báo chi phí và lợi nhuận

Kích hoạt khi:

- biên lợi nhuận dự kiến thấp hơn ngưỡng sàn
- chi phí vận chuyển hoặc giáo mác chiếm tỷ trọng quá cao
- phát sinh vật tư phụ làm thay đổi mạnh giá vốn
- case bảo hành tiềm ẩn hoặc rủi ro hiện trường vượt chuẩn

## 4. Kết quả quyết định chuẩn hóa

| Trạng thái | Ý nghĩa |
|---|---|
| `DRAFT` | Chưa đủ dữ liệu để kết luận |
| `REVIEWING` | Đang được PM/Kế toán/Giám sát xem xét |
| `GO` | Có thể nhận việc theo phương án hiện tại |
| `GO_WITH_CONDITIONS` | Nhận việc nhưng phải kèm điều kiện rõ ràng |
| `REPRICE_REQUIRED` | Cần tính lại hoặc báo giá lại trước khi chốt |
| `NO_GO` | Không nên nhận việc |
| `OVERRIDE_APPROVED` | Quyết định đặc biệt đã được cấp thẩm quyền phê duyệt |

## 5. Điều kiện chốt `GO_WITH_CONDITIONS`

Hệ thống phải hỗ trợ ghi rõ điều kiện như:

- khách chấp nhận tăng ngân sách
- khách chấp nhận kéo dài deadline
- BAC chỉ nhận một phần phạm vi công việc
- phải thay đổi giải pháp thi công
- phải chờ đủ vật tư hoặc chờ đội thi công rảnh

## 6. Quy trình chuẩn

1. `Giám sát` hoàn tất khảo sát.
2. `PM` hoặc người được phân quyền lập dự toán nội bộ.
3. Hệ thống chạy rule cảnh báo.
4. `PM` review tổng thể.
5. `Kế toán` review giá vốn, nguồn lực mua hàng, biên lợi nhuận tối thiểu.
6. `Sale` nhìn kết quả để biết có được phát hành báo giá hay không.
7. Nếu `NO_GO` hoặc `REPRICE_REQUIRED`, hệ thống chặn bước phát hành báo giá cho khách.

## 7. Chức năng hệ thống bắt buộc

| ID | Chức năng |
|---|---|
| GNG-01 | Sinh `warning` từ dữ liệu khảo sát, dự toán, tồn kho, lịch nguồn lực |
| GNG-02 | Hiển thị dashboard `Go/No-Go` theo `Service Request` |
| GNG-03 | Giải thích rõ nguyên nhân từng cảnh báo |
| GNG-04 | Cho phép ghi điều kiện khi chốt `GO_WITH_CONDITIONS` |
| GNG-05 | Chặn phát hành báo giá nếu chưa có kết luận hợp lệ |
| GNG-06 | Cho phép override có audit và thẩm quyền |
| GNG-07 | Lưu lịch sử review giữa PM, Giám sát, Kế toán, Sale |

## 8. Business rules bắt buộc

1. Không dùng cảm tính để chốt nhận việc khi hệ thống đã có cảnh báo đỏ ở nhóm:
   - vật tư chính
   - nhân công
   - biên lợi nhuận dưới sàn
2. Một `warning` phải có:
   - loại cảnh báo
   - mức độ
   - dữ liệu nguồn
   - đề xuất xử lý
3. `NO_GO` phải lưu lý do từ chối để dùng cho báo cáo win/loss.
4. `GO_WITH_CONDITIONS` phải tạo checklist theo dõi điều kiện cho PM.
5. Nếu sau khi báo giá có thay đổi lớn về vật tư, nhân công hoặc deadline, hệ thống phải yêu cầu review lại `Go/No-Go`.

## 9. Đầu ra bắt buộc

- `Go/No-Go Summary`
- danh sách cảnh báo mở
- quyết định nhận việc có điều kiện hoặc không
- log override
- dữ liệu đầu vào cho báo cáo `win/loss`, `margin variance`, `resource bottleneck`
