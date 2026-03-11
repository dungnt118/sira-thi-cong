# Finance Control - Accountant V4

## 1. Mục tiêu

Tài liệu này đi sâu riêng phần kiểm soát tài chính của Accountant trong BA-V4, dựa trên mô hình vận hành thực tế thể hiện trong:

- `Kiểm soát Tài Chính.xlsx`
- `BAC So quy TM 2026 .xlsx`
- `DOANH THU VÀ CHI PHÍ - 2026.xlsx`
- `Doanh Thu tháng 3.xlsx`
- các mẫu `HĐTC`, `Đề nghị thanh toán`, `Biên bản nghiệm thu`

Mục tiêu là chuẩn hóa lại thành mô hình có thể build được trên hệ thống.

## 2. Các trục dữ liệu tài chính phải có

### 2.1 Doanh thu theo công trình

Hệ thống phải ghi nhận tối thiểu:

- ngày phát sinh
- nguồn khách hàng
- khách hàng/chủ nhà/chủ đầu tư
- số điện thoại
- địa chỉ công trình
- thông tin giám sát/thi công
- doanh thu hợp đồng hoặc doanh thu phát sinh
- số đã thu
- công nợ còn lại

### 2.2 Chi phí theo công trình

Ít nhất phải bóc tách được:

- chi phí giám sát/thi công
- chi phí nhân công
- chi phí vật tư
- chi phí máy móc/thiết bị
- chi phí khác

### 2.3 Dòng tiền

Hệ thống phải phân biệt:

- dòng tiền vào từ khách hàng
- dòng tiền ra cho công trình
- dòng tiền ra từ quỹ tiền mặt
- dòng tiền ra qua tài khoản công ty
- dòng tiền ra qua tài khoản cá nhân

### 2.4 Sổ quỹ

Sổ quỹ tối thiểu phải lưu:

- ngày ghi sổ
- ngày chứng từ
- số hiệu chứng từ
- diễn giải
- tiền thu
- tiền chi
- tồn quỹ
- ghi chú

### 2.5 Khoản giữ lại bảo hành

Hệ thống phải lưu được:

- retention rate hoặc retention amount
- ngày bắt đầu giữ lại
- điều kiện giải tỏa
- ngày dự kiến giải tỏa
- số đã giải tỏa
- số còn treo

## 3. Luồng kiểm soát tiền theo mô hình BAC

### 3.1 Chi từ tài khoản công ty

Mô hình chuẩn cần có:

1. Kế toán tạo lệnh chi.
2. Người có thẩm quyền duyệt lệnh.
3. Người theo dõi xác nhận giao dịch và trạng thái hoàn tất.

**Dữ liệu bắt buộc**

- nguồn chi: `COMPANY`
- loại chi
- công trình/ngữ cảnh liên quan
- số tiền
- người tạo lệnh
- người duyệt
- trạng thái duyệt
- trạng thái thực chi

### 3.2 Chi từ tài khoản cá nhân

Mô hình chuẩn cần có:

1. Người dùng nội bộ lập đề nghị.
2. Người đi tiền thực hiện giao dịch.
3. Người theo dõi ra/vào cập nhật kết quả và đối soát.

**Dữ liệu bắt buộc**

- nguồn chi: `PERSONAL`
- người đề nghị
- người thực chi
- người theo dõi
- lý do chi
- số tiền
- công trình/case liên quan
- bằng chứng thanh toán

### 3.3 Quỹ tiền mặt

Mô hình chuẩn cần có:

- quỹ tiền mặt là một `book_scope` riêng
- mỗi giao dịch thu/chi quỹ phải post thành `Cash Book Entry`
- số dư đầu kỳ, phát sinh và số dư cuối kỳ phải truy được

## 4. Aggregate dữ liệu cần khóa

| Aggregate | Vai trò |
|---|---|
| `Payment Schedule` | Kế hoạch phải thu/phải trả theo hợp đồng hoặc billing |
| `Payment Transaction` | Giao dịch thu/chi thực tế |
| `Project Cost Entry` | Ghi nhận chi phí thực tế theo công trình |
| `Cash Book Entry` | Bản ghi vào sổ quỹ/sổ dòng tiền |
| `Aftersales Billing` | Khoản phải thu từ bảo trì ngoài phạm vi bảo hành |
| `Stock Document` | Chứng từ kho có tác động chi phí vật tư |
| `Document Record` | Hồ sơ số của chứng từ tài chính |

## 5. Trạng thái nghiệp vụ đề xuất

### 5.1 Payment Schedule

- `DRAFT`
- `PUBLISHED`
- `PARTIALLY_COLLECTED`
- `PAID`
- `OVERDUE`
- `CANCELLED`

### 5.2 Project Cost Entry

- `DRAFT`
- `SUBMITTED`
- `APPROVED`
- `REJECTED`
- `PAID`
- `LOCKED`

### 5.3 Payment Transaction

- `PENDING_PROOF`
- `CONFIRMED`
- `RECONCILED`
- `VOID`

### 5.4 Cash Book Entry

- `POSTED`
- `ADJUSTED`
- `REVERSED`
- `LOCKED`

## 6. Rule bắt buộc cho phải thu

1. Mỗi hợp đồng phải có ít nhất một payment schedule.
2. Hệ thống phải hỗ trợ nhiều mẫu thanh toán: `50-50`, `50-40-10`, `custom`, `custom có retention`.
3. Một đợt thanh toán được phép thu nhiều lần.
4. Partial payment không được làm mất dấu vết milestone gốc.
5. Overdue phải tính từ `due_date` của payment schedule.
6. Đề nghị thanh toán phải link tới đúng hợp đồng, đợt và số tiền yêu cầu.
7. Biên bản nghiệm thu là điều kiện đầu vào cho các đợt thanh toán cuối hoặc kích hoạt bảo hành.

## 7. Rule bắt buộc cho phải chi

1. Mọi khoản chi phải link được tới ngữ cảnh nghiệp vụ:
   - công trình
   - mua vật tư
   - outsource/nhân công
   - hậu mãi
   - chi khác có giải trình
2. Không tạo lệnh chi nếu thiếu `số tiền`, `nguồn chi`, `người tạo`, `lý do`.
3. Không cho phép ghi nhận `đã chi` nếu trạng thái duyệt chưa hợp lệ, trừ khi có override được audit.
4. Mọi khoản chi từ tài khoản cá nhân vẫn phải lên cost ledger và cashbook.
5. Khi chi phí đã chốt vào kỳ báo cáo, sửa đổi phải đi bằng adjustment/reversal.

## 8. Rule bắt buộc cho sổ quỹ

1. Mọi transaction thu/chi sau khi xác nhận phải post được vào `Cash Book Entry`.
2. Quỹ tiền mặt phải cho xem lịch sử theo ngày và số dư chạy.
3. Không gộp `quỹ`, `tài khoản công ty`, `tài khoản cá nhân` thành một nguồn mơ hồ.
4. Sổ quỹ phải hỗ trợ chứng từ gốc và link ngược về aggregate phát sinh.
5. Báo cáo tháng phải đối soát được tổng `thu`, `chi`, `tồn` với giao dịch đã xác nhận.

## 9. Rule bắt buộc cho doanh thu - chi phí - công nợ

1. Báo cáo tài chính công trình phải nhìn được đồng thời:
   - doanh thu
   - đã thu
   - công nợ
   - chi phí vật tư
   - chi phí nhân công/giám sát
   - chi phí hậu mãi
   - lợi nhuận thực
2. Công nợ phải được tính ở cấp project và cấp customer.
3. Giá trị xuất kho sang công trình phải là đầu vào cho chi phí vật tư.
4. Các khoản thu phí bảo trì ngoài bảo hành phải tách riêng khỏi doanh thu hợp đồng gốc.

## 10. Rule bắt buộc cho bảo hành, bảo trì và retention

1. Mọi case hậu mãi phải phân loại:
   - trong phạm vi bảo hành
   - ngoài phạm vi bảo hành, tính phí
   - ngoài phạm vi nhỏ nhưng được miễn/waive
   - phát sinh lớn cần change order
2. Case trong bảo hành vẫn phải ghi được chi phí hậu mãi.
3. Case tính phí phải tạo `Aftersales Billing` và receivable riêng.
4. Retention chỉ giải tỏa khi đạt điều kiện thời gian/chất lượng theo hợp đồng.
5. Dashboard tài chính phải cho thấy phần retention còn treo để tránh hiểu sai lợi nhuận đã thu được.

## 11. Bộ chứng từ tài chính số cần có

### 11.1 Theo vòng đời hợp đồng

- hợp đồng thi công / hợp đồng mua bán / phụ lục
- đề nghị tạm ứng
- đề nghị thanh toán
- phiếu thu / xác nhận thu
- biên bản nghiệm thu
- phiếu bảo hành điện tử

### 11.2 Theo vòng đời hậu mãi

- báo cáo hiện trạng bảo trì/bảo hành
- xác nhận xử lý hoàn thành
- đề nghị thanh toán hậu mãi tính phí
- chứng từ thu tiền hậu mãi

### 11.3 Rule hồ sơ số

- mọi chứng từ phát hành ra ngoài phải có `Document Record`
- phải lưu được file phát hành và file đã ký
- phải lưu trạng thái ký và lịch sử phát hành
- phải đồng bộ dossier lên Google Drive theo đúng context

## 12. Báo cáo tháng tối thiểu cho Accountant

1. Doanh thu theo nguồn khách hàng
2. Doanh thu theo công trình
3. Đã thu / công nợ / quá hạn
4. Chi phí theo công trình
5. Dòng tiền vào/ra
6. Sổ quỹ tiền mặt
7. Giá trị tồn kho và biến động kho
8. Chi phí hậu mãi
9. Retention pending release

## 13. KPI cần theo dõi

- tỷ lệ thu đúng hạn
- số ngày thu tiền trung bình
- giá trị công nợ quá hạn
- tổng chi phí công trình chưa duyệt
- chênh lệch sổ quỹ nếu có
- tỷ lệ phiếu kho chờ ký nhận quá hạn
- tỷ lệ case hậu mãi có thu phí
- lợi nhuận thực sau hậu mãi

## 14. Kết luận

Nếu không dựng được 4 lớp sau trên cùng một hệ thống thì Accountant của V4 vẫn chưa đủ để vận hành thật:

1. phải thu và công nợ
2. phải chi và lệnh chi
3. sổ quỹ và nguồn tiền
4. doanh thu - chi phí - hậu mãi - retention

Đó là lý do package Accountant của BA-V4 phải đi xa hơn rất nhiều so với prototype hiện có.
