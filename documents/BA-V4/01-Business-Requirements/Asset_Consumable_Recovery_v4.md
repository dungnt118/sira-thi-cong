# Quản lý tài sản thi công, vật tư tiêu hao và hoàn nhập phần dư v4

## 1. Mục tiêu

Chuẩn hóa cách BAC quản lý:

- tài sản thi công có thể thu hồi
- vật tư tiêu hao
- vật tư dở dang hoặc phần dư còn sử dụng được

Tài liệu này giải quyết khoảng trống mà các file kho hiện tại đang thể hiện rất rõ: công cụ, vật tư, hao mòn và phần vật tư dư chưa được quản lý bằng cùng một mô hình.

## 2. Phân loại bắt buộc

| Loại | Ví dụ | Đặc điểm |
|---|---|---|
| `Tài sản thi công` | máy mài, máy khoan, thước nhôm, máy đo độ ẩm | dùng nhiều lần, cần cấp phát và thu hồi |
| `Vật tư tiêu hao` | đĩa mài, vôi, vữa, giấy nhám | xuất dùng là giảm tồn, không thu hồi |
| `Vật tư bán tiêu hao` | sơn, keo, hóa chất, phụ gia, latex | có thể dùng dở dang và còn phần dư |
| `Bao bì/đơn vị đóng gói` | thùng 10L, bao 25kg | ảnh hưởng cách quản lý phần dư và định lượng |

## 3. Dữ liệu master bắt buộc

Mỗi vật tư hoặc tài sản phải có tối thiểu:

- mã hàng
- tên hàng
- nhóm hàng
- phân loại `asset/consumable/semi-consumable`
- đơn vị tồn kho
- đơn vị dự toán
- quy cách đóng gói
- cờ cho phép hoàn nhập phần dư
- cờ bắt buộc serial/asset tag
- đơn giá chuẩn
- trạng thái hoạt động

## 4. Quy trình chuẩn

### 4.1 Cấp phát

1. `PM` hoặc `Kế toán` tạo nhu cầu từ dự toán hoặc kế hoạch công trình.
2. Hệ thống tạo:
   - reservation
   - phiếu xuất
   - danh sách tài sản phải bàn giao
3. `Giám sát` ký nhận tại công trình.

### 4.2 Cấp phát xuống hạng mục hoặc đội thi công

`Giám sát` phải ghi được:

- vật tư/tài sản dùng cho hạng mục nào
- cấp cho tổ hoặc `kỹ thuật profile` nào
- trạng thái sử dụng

### 4.3 Thu hồi và hoàn nhập

Khi kết thúc hạng mục hoặc công trình, hệ thống phải hỗ trợ:

- thu hồi tài sản thi công
- hoàn nhập vật tư chưa dùng
- ghi nhận phần dư còn dùng được
- ghi nhận hao hụt, hư hỏng, mất mát

## 5. Rule đặc biệt cho vật tư phần dư

Ví dụ nghiệp vụ:

- dự toán cần `9.5L` sơn AC
- thực tế phải xuất `1 thùng 10L`
- còn dư `0.5L`

Hệ thống phải hỗ trợ:

1. xuất kho theo `đơn vị đóng gói thực tế`
2. ghi nhận khối lượng dùng thực tế
3. tạo `remainder lot` cho phần còn lại nếu còn dùng được
4. đánh giá tình trạng:
   - còn đạt chất lượng
   - cần dùng ngay trong thời hạn
   - không đạt và phải hủy
5. hoàn nhập phần dư vào kho với:
   - số lượng thực
   - vị trí lưu
   - ngày hoàn nhập
   - hạn sử dụng hoặc thời gian khuyến nghị dùng tiếp

## 6. Chức năng hệ thống bắt buộc

| ID | Chức năng |
|---|---|
| AST-01 | Quản lý master phân loại `asset`, `consumable`, `semi-consumable` |
| AST-02 | Quản lý `asset tag` hoặc serial cho tài sản thi công |
| AST-03 | Tạo phiếu cấp phát cho công trình và hạng mục |
| AST-04 | Ký nhận cấp phát tại hiện trường |
| AST-05 | Ghi nhận vật tư cấp cho tổ hoặc `kỹ thuật profile` |
| AST-06 | Thu hồi tài sản sau khi kết thúc công việc |
| AST-07 | Hoàn nhập vật tư dư/chưa dùng |
| AST-08 | Quản lý `remainder lot` cho vật tư bán tiêu hao |
| AST-09 | Ghi nhận hao hụt, hỏng, thất lạc, tiêu hủy |
| AST-10 | Đối soát `planned -> issued -> used -> returned -> lost` |

## 7. Vai trò chịu trách nhiệm

- `PM`: phê duyệt nhu cầu và theo dõi sai lệch so với dự toán
- `Kế toán`: kiểm soát chứng từ kho, giá trị tồn, giá trị hao hụt
- `Giám sát`: ký nhận, cấp phát tại công trình, thu hồi và xác nhận phần dư
- `Sale`: chỉ xem khi ảnh hưởng tới phát sinh hoặc biên bản với khách

## 8. Business rules bắt buộc

1. Không được dùng chung một loại phiếu cho cả `tài sản` và `vật tư tiêu hao` nếu yêu cầu kiểm soát khác nhau.
2. Tài sản thi công phải có trạng thái tối thiểu:
   - `available`
   - `issued`
   - `under_maintenance`
   - `lost`
   - `retired`
3. Vật tư bán tiêu hao phải hỗ trợ `remainder lot`.
4. Hoàn nhập phần dư không được cộng lại vào tồn tổng nếu chưa qua bước kiểm tra chất lượng.
5. Tất cả hao hụt vượt ngưỡng cấu hình phải tạo cảnh báo cho PM và Kế toán.
6. Giá trị vật tư xuất kho, phần dư hoàn nhập, hao hụt và tiêu hủy phải phản ánh vào `cost ledger`.

## 9. Đầu ra bắt buộc

- phiếu cấp phát
- phiếu ký nhận hiện trường
- phiếu thu hồi tài sản
- phiếu hoàn nhập vật tư
- nhật ký phần dư
- dashboard chênh lệch `planned/issued/used/returned`
