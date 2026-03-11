# Audit tài liệu gốc và chuẩn hóa BA-V4

## 1. Phạm vi audit

Đợt audit này đối chiếu trực tiếp các tài liệu trong `documents/Orignal-Requirements-Docs`, tập trung vào các nhóm:

- khách hàng và dossier công trình
- báo cáo khảo sát, báo giá, hợp đồng
- chứng từ nghiệm thu, giao nhận, tạm ứng, đề nghị thanh toán
- doanh thu, chi phí, công nợ, sổ quỹ
- hồ sơ bảo trì và chi phí bảo trì

## 2. Nguồn đã đối chiếu

Các nguồn tiêu biểu được dùng để chuẩn hóa lại BA-V4:

- `DOANH THU VÀ CHI PHÍ - 2026.xlsx`
- `CÔNG TRÌNH Đã HOÀN THIỆN 2026 - SRG.xlsx`
- `BÁO GIÁ DỰ TOÁN THI CÔNG CHỐNG THẤM - SRG.xlsx`
- `1. TÀI CHÍNH/Kiểm soát Tài Chính.xlsx`
- `1. TÀI CHÍNH/BAC So quy TM 2026 .xlsx`
- `3. KHÁCH HÀNG/DOANH THU/Doanh Thu tháng 3.xlsx`
- dossier khách hàng ở các nhóm:
  - `KHÁCH HÀNG ĐANG TRIỂN KHAI`
  - `KHÁCH HÀNG ĐÃ HOÀN THIỆN`
  - `CÔNG TRÌNH ĐANG BẢO TRÌ`
  - `KHÁCH KHÔNG LÀM`
- các mẫu ở `4. TÀI NGUYÊN`:
  - kịch bản kinh doanh
  - mẫu khảo sát
  - mẫu báo giá
  - mẫu hợp đồng
  - mẫu nghiệm thu
  - mẫu biên bản giao nhận
  - mẫu đề nghị tạm ứng / thanh toán

## 3. Mẫu vận hành thực tế rút ra từ tài liệu gốc

### 3.1 Hồ sơ khách hàng đang được quản lý theo dossier vòng đời

Folder gốc cho thấy dữ liệu đang được gom theo 4 bucket thực tế:

- `Khách hàng đang triển khai`
- `Khách hàng đã hoàn thiện`
- `Công trình đang bảo trì`
- `Khách không làm`

Điều này cho thấy BA-V4 cần chuẩn hóa không chỉ `stage` mà còn phải có `lifecycle bucket` cho hồ sơ và file governance.

### 3.2 Mỗi dossier khách hàng là một gói hồ sơ nhiều loại chứng từ

Một hồ sơ thực tế thường bao gồm:

- ảnh/video khảo sát
- báo cáo tổng hợp hiện trạng và phương án
- báo giá hoặc dự toán
- hợp đồng thi công hoặc hợp đồng mua bán
- đề nghị thanh toán theo đợt
- biên bản giao nhận
- hồ sơ bảo trì/bảo hành khi phát sinh

Vì vậy BA-V4 cần mô hình `document bundle / dossier` thay vì chỉ quản từng file rời.

### 3.3 Báo giá thực tế không chỉ có tổng tiền

Các file báo giá và dự toán cho thấy báo giá cần phản ánh:

- hạng mục thi công
- chi tiết hiện trạng
- giải pháp thi công
- cách thức/quy trình thi công
- đơn vị tính, số lượng, đơn giá, thành tiền
- VAT
- ghi chú bảo hành

Điều này buộc BA-V4 phải xem `quotation` là một hồ sơ kỹ thuật - thương mại, không chỉ là một bảng số tiền.

### 3.4 Có nhiều loại hợp đồng và mô hình bán hàng

Tài liệu gốc thể hiện ít nhất các loại giao dịch sau:

- hợp đồng thi công
- hợp đồng thi công sửa chữa, cải tạo
- hợp đồng mua bán hàng hóa/vật tư
- giao nhận hàng hóa
- bảo trì tính phí

Nghĩa là BA-V4 không nên giả định mọi deal đều có cùng một loại hợp đồng hoặc cùng một flow delivery.

### 3.5 Thanh toán thực tế có nhiều mẫu lịch và có thể giữ lại bảo hành

Nguồn gốc thể hiện đồng thời:

- mẫu thanh toán `2 đợt`
- ví dụ thực tế đã thu một phần
- trường hợp `giữ lại 5% bảo hành trong 06 tháng`
- các cột `Đã thu`, `Công nợ`, `Còn lại`

Vì vậy BA-V4 cần chuẩn hóa:

- `payment schedule template library`
- `partial collection`
- `retention / holdback`
- `collection status`

thay vì chỉ bám cứng một tỷ lệ thanh toán duy nhất.

### 3.6 Tài chính thực tế cần quản lý cả doanh thu, chi phí và nguồn tiền

Sheet doanh thu/chi phí và sổ quỹ cho thấy phải theo dõi:

- doanh thu theo công trình
- chi phí giám sát/thi công
- chi phí nhân công
- chi phí vật tư
- chi phí thiết bị/máy móc
- tiền đã thu
- công nợ còn lại
- giao dịch từ quỹ tiền mặt hoặc tài khoản

Điều này nghĩa là BA-V4 phải mở rộng từ `milestone thu tiền` sang `cost ledger + cashbook + approval flow`.

### 3.7 Quy trình tài chính có phân vai phê duyệt

`Kiểm soát Tài Chính.xlsx` cho thấy rõ mô hình:

- người tạo lệnh
- người duyệt lệnh
- người theo dõi
- phân biệt tài khoản cá nhân và tài khoản công ty

Đây là rule vận hành quan trọng cần được phản ánh trong vai trò và workflow tài chính.

### 3.8 Báo cáo khảo sát và bảo trì đều là tài liệu nghiệp vụ có chữ ký

Các báo cáo thực tế và mẫu khảo sát/biên bản cho thấy hồ sơ thường có chữ ký của:

- phòng kỹ thuật
- giám sát
- khách hàng
- đại diện công ty

Điều này củng cố việc `Document Automation + Digital Signature` phải là capability cốt lõi của BA-V4.

## 4. Chuẩn hóa BA-V4 theo audit

### 4.1 Chuẩn hóa vòng đời hồ sơ

BA-V4 dùng đồng thời hai lớp:

- `Pipeline/Stage`: để quản lý tiến trình nghiệp vụ chi tiết
- `Lifecycle Bucket`: để quản lý hồ sơ và kho tài liệu ở cấp quản trị

Các bucket chuẩn:

- `PROSPECT_ACTIVE`
- `LOST_NO_GO`
- `PROJECT_IN_PROGRESS`
- `PROJECT_COMPLETED`
- `AFTERSALES_ACTIVE`

### 4.2 Chuẩn hóa bộ hồ sơ bắt buộc theo từng chặng

| Chặng | Hồ sơ tối thiểu |
|---|---|
| Tiếp nhận & khảo sát | phiếu khảo sát, media khảo sát, consultation log |
| Giải pháp & báo giá | báo cáo tổng hợp, báo giá/dự toán versioned |
| Chốt thương mại | hợp đồng/phụ lục, lịch thanh toán |
| Triển khai | checklist, evidence, giao nhận vật tư nếu có |
| Nghiệm thu & thanh toán | biên bản nghiệm thu, đề nghị thanh toán, hóa đơn/liên kết kế toán |
| Bảo hành/Bảo trì | phiếu bảo hành, báo cáo hiện trạng bảo trì, chi phí bảo trì, billing nếu có |

### 4.3 Chuẩn hóa loại giao dịch

Mỗi deal hoặc hợp đồng cần phân loại tối thiểu:

- `THI_CONG`
- `SUA_CHUA_CAI_TAO`
- `MUA_BAN_VAT_TU`
- `BAO_TRI_TINH_PHI`

Từ đó hệ thống chọn đúng:

- template hợp đồng
- bộ hồ sơ bắt buộc
- lịch thanh toán mặc định
- yêu cầu giao nhận hoặc nghiệm thu

### 4.4 Chuẩn hóa tài chính dự án

Finance trong BA-V4 phải theo dõi đủ 4 lớp:

- giá trị thương mại của báo giá/hợp đồng
- lịch thanh toán và giao dịch thu tiền
- chi phí thực tế theo công trình
- trạng thái công nợ, giữ lại bảo hành và lợi nhuận thực

### 4.5 Chuẩn hóa document governance

Mỗi `document record` phải gắn được:

- loại tài liệu
- ngữ cảnh nguồn
- version template
- số chứng từ
- trạng thái phát hành
- trạng thái ký
- hồ sơ bucket đang thuộc về

## 5. Các nội dung BA-V4 đã được đưa về baseline sạch

Từ audit này, BA-V4 được chuẩn hóa theo các hướng:

1. `Finance` không còn mô tả chỉ ở mức milestone thu tiền, mà mở rộng sang `cost ledger`, `cashbook`, `approval`, `retention`.
2. `Document Automation` không chỉ là sinh PDF, mà trở thành lớp quản lý `dossier + signature + template version`.
3. `File Governance` không chỉ quản lý upload media, mà phải quản lý toàn bộ hồ sơ khách hàng/công trình theo bucket vòng đời.
4. `CRM & Sales` được gắn chặt hơn với báo cáo tổng hợp, báo giá versioned, hợp đồng theo loại giao dịch.
5. `Warranty/Maintenance` được nối trực tiếp với hồ sơ bảo trì, chi phí bảo trì và khoản phải thu phát sinh.

## 6. Kết luận

Các tài liệu gốc cho thấy BAC Group đang vận hành bằng một tổ hợp hồ sơ thực tế giàu dữ liệu hơn nhiều so với phần mô tả khung ban đầu của BA-V4. Vì vậy baseline V4 cần được đọc như một hệ thống quản lý:

- khách hàng và deal
- hồ sơ kỹ thuật và thương mại
- công trình và chi phí thực tế
- chứng từ và hồ sơ số
- hậu mãi và công nợ sau bàn giao

chứ không chỉ là CRM + thi công + kho + tài chính ở mức mô tả menu.
