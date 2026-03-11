# Bóc tách dự toán nội bộ và báo giá khách hàng v4

## 1. Mục tiêu

Chuẩn hóa lớp nghiệp vụ trước thi công để BAC không còn dùng chung một file cho cả:

- tính chi phí nội bộ
- quyết định có nhận việc hay không
- báo giá gửi khách hàng

Tài liệu này khóa lại nguyên tắc: `dự toán nội bộ` và `báo giá khách hàng` là hai lớp dữ liệu khác nhau nhưng liên kết chặt.

## 2. Hai lớp dữ liệu bắt buộc phải tách

| Thành phần | Dự toán nội bộ | Báo giá khách hàng |
|---|---|---|
| Mục tiêu | Tính đủ chi phí, rủi ro, biên lợi nhuận tối thiểu, tính khả thi nhận việc | Trình bày gói giải pháp và giá bán cho khách hàng |
| Vai trò dùng chính | PM, Giám sát, Kế toán, Sale | Sale, Hành Chính, PM |
| Nguồn dữ liệu đầu vào | khảo sát, tồn kho, lịch nhân công, bảng giá nội bộ, cấu hình vận chuyển, chi phí phát sinh | dữ liệu đã chọn từ dự toán nội bộ, cấu hình nhóm hạng mục báo khách |
| Độ chi tiết | sâu tới vật tư, nhân công, vận chuyển, giáo mác, đu dây, hao hụt, dự phòng | gọn theo hạng mục thương mại, quy trình thi công, đơn giá bán |
| Hiển thị cho khách | Không | Có |
| Rule version | version hóa theo lần khảo sát/chỉnh số liệu/điều kiện thị trường | version hóa theo lần đàm phán và phát hành |

## 3. Thành phần dữ liệu của dự toán nội bộ

### 3.1 Header dự toán

Mỗi `Estimate Version` tối thiểu phải có:

- `service_request_id`
- `survey_snapshot_id`
- ngày hiệu lực bảng giá nội bộ
- khu vực địa lý áp dụng
- người lập
- người review
- trạng thái
- giả định đầu vào
- ngày dự kiến bắt đầu
- ngày dự kiến hoàn thành

### 3.2 Nhóm chi phí bắt buộc

Mỗi dự toán nội bộ phải bóc tách được tối thiểu các nhóm:

1. `Vật tư chính`
2. `Vật tư phụ`
3. `Vật tư tiêu hao`
4. `Tài sản/thiết bị thi công`
5. `Nhân công nội bộ`
6. `Nhân công thuê ngoài/đội liên kết`
7. `Chi phí vận chuyển`
8. `Chi phí bốc xếp/lên tầng/điều kiện tiếp cận`
9. `Giáo mác, đu dây, che chắn, an toàn`
10. `Chi phí phát sinh dự phòng`
11. `Dự phòng bảo hành`
12. `Biên lợi nhuận mục tiêu`

### 3.3 Công thức tính tối thiểu

Hệ thống phải hỗ trợ công thức:

- `chi phí vật tư = định mức x đơn giá nội bộ x hệ số hao hụt`
- `chi phí nhân công = số người x số ca/ngày x đơn giá thời điểm`
- `chi phí vận chuyển = số chuyến x đơn giá/chuyến x hệ số khoảng cách`
- `chi phí tài sản = phí cấp phát hoặc khấu hao hoặc thuê theo ngày/ca`
- `giá vốn công trình = tổng tất cả chi phí trực tiếp + chi phí gián tiếp bắt buộc`
- `giá bán đề xuất = giá vốn + biên lợi nhuận mục tiêu + dự phòng thương mại`

## 4. Bảng giá nội bộ và bảng giá khách hàng

### 4.1 Bảng giá nội bộ

`Bảng giá nội bộ` là nguồn tính toán cho BAC, có thể thay đổi theo:

- tháng/quý
- khu vực địa lý
- loại công trình
- độ khó thi công
- nguồn nhân công
- nguồn vật tư

Theo logic từ tài liệu gốc và cuộc họp 11/03, hệ thống phải cho phép Kế toán cập nhật định kỳ và lưu hiệu lực theo thời gian.

### 4.2 Bảng giá khách hàng

`Bảng giá khách hàng` không bắt buộc lộ toàn bộ cấu trúc chi phí nội bộ. Một dòng báo giá khách hàng có thể được tạo từ:

- một dòng dự toán nội bộ
- nhiều dòng dự toán nội bộ gộp lại
- một công thức tổng hợp riêng theo cấu hình thương mại

### 4.3 Cấu hình mapping bắt buộc

Hệ thống phải có `Quotation Mapping Config` để:

- map `estimate line` sang `quotation line`
- ẩn các dòng nội bộ không công khai cho khách
- gộp nhiều đầu mục nội bộ thành một đầu mục thương mại
- áp dụng hệ số markup
- áp dụng quy tắc làm tròn
- cấu hình VAT
- cấu hình điều kiện bảo hành theo gói

Ví dụ:

- `giáo + bạt + vận chuyển giáo + tháo dỡ` có thể gộp thành `Giáo thi công và che chắn`
- `vật tư phụ + hao hụt + vận chuyển lẻ` có thể được phân bổ vào đơn giá bán của hạng mục

## 5. Luồng nghiệp vụ chuẩn

1. `Sale` hoặc `PM` tạo `Service Request`.
2. `Giám sát/Kỹ thuật` khảo sát và chốt `Survey Snapshot`.
3. `PM` hoặc người được phân quyền lập `Estimate Version`.
4. Hệ thống tính toán:
   - vật tư
   - tồn kho khả dụng
   - chi phí vận chuyển
   - chi phí nhân công theo thời điểm
   - yếu tố giáo mác/đu dây/an toàn
5. Hệ thống sinh cảnh báo khả thi và `Go/No-Go Recommendation`.
6. Nếu đủ điều kiện nhận việc, `Sale` tạo `Quotation Version` từ mapping đã cấu hình.
7. `Sale` chỉnh wording thương mại, điều khoản, VAT, bảo hành và phát hành cho khách.
8. Khi khách chốt, `Quotation Version` thắng mới được dùng để sinh hợp đồng.

## 6. Chức năng hệ thống bắt buộc

| ID | Chức năng |
|---|---|
| EST-01 | Quản lý `Estimate Version` theo `Service Request` |
| EST-02 | Lưu `survey snapshot` làm cơ sở tính toán |
| EST-03 | Tính chi phí vật tư chính, phụ, tiêu hao |
| EST-04 | Tính chi phí vận chuyển theo số chuyến, quãng đường, loại xe |
| EST-05 | Tính chi phí nhân công theo nguồn lực và thời điểm |
| EST-06 | Tính chi phí giáo mác, đu dây, che chắn, thiết bị phụ trợ |
| EST-07 | Kiểm tra tồn kho và nhu cầu mua bổ sung |
| EST-08 | Cấu hình `Internal Price Book` và hiệu lực theo thời gian |
| EST-09 | Cấu hình `Quotation Mapping Config` từ nội bộ ra khách hàng |
| EST-10 | So sánh `Estimate Version` và `Quotation Version` |
| EST-11 | Tính biên lợi nhuận dự kiến trước khi phát hành báo giá |
| EST-12 | Khóa version sau khi phát hành hoặc sau khi chốt nhận việc |

## 7. Business rules bắt buộc

1. Không được phát hành `Quotation Version` nếu chưa có `Estimate Version` hợp lệ, trừ khi có `override` được audit.
2. Mỗi `Quotation Version` phải truy ngược được về:
   - `survey snapshot`
   - `estimate version`
   - `mapping config`
3. Mỗi thay đổi lớn của khảo sát phải tạo `Estimate Version` mới hoặc yêu cầu xác nhận dùng lại version cũ.
4. Bảng giá nội bộ phải có `effective_from`, `effective_to`, `region`, `service_type`.
5. Bảng giá khách hàng không được sửa tay trực tiếp trên PDF phát hành; nếu thay đổi phải tạo version mới.
6. Hệ thống phải hiển thị đồng thời:
   - `giá vốn dự kiến`
   - `giá bán dự kiến`
   - `biên lợi nhuận`
   - `rủi ro chính`
7. Những dòng chỉ có tính chất nội bộ như hao hụt, dự phòng, vận chuyển phụ không bắt buộc lộ cho khách nhưng phải được giữ ở lớp dự toán.

## 8. Đầu ra bắt buộc

- `Estimate Version`
- `Go/No-Go Recommendation`
- `Quotation Version`
- bảng so sánh `Estimate vs Quotation`
- cảnh báo chênh lệch biên lợi nhuận
- dữ liệu đầu vào cho hợp đồng, kế hoạch vật tư và kế hoạch nguồn lực
