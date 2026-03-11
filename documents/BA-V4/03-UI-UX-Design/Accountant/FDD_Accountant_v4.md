# FDD Accountant v4 - Chức năng chi tiết cho Kế toán

## 1. Vai trò Accountant trong V4

### 1.1 Vai trò cốt lõi

Accountant là owner của lớp kiểm soát tài chính và kho trong BAC Group, chịu trách nhiệm:

- xác nhận, theo dõi và đối soát dòng tiền vào từ khách hàng
- ghi nhận, duyệt và theo dõi dòng tiền ra theo công trình và theo nguồn tiền
- vận hành sổ quỹ và mô hình kiểm soát tiền công ty / tiền cá nhân
- theo dõi P&L công trình ở mức thực thu - thực chi - hậu mãi
- quản lý chứng từ tài chính, hồ sơ thanh toán, biên bản số liên quan
- phối hợp vá»›i PM, Hành Chính, Sale và Giám sát để đóng vòng hồ sÆ¡

### 1.2 Accountant không làm gì

Accountant không thay thế hoàn toàn các role khác:

- không tạo hoặc điều phối kế hoạch thi công thay PM
- không cập nhật task/checklist hiện trường thay Giám sát
- không cấu hình pipeline, template hệ thống thay Admin
- không sở hữu quan hệ khách hàng đầu vào thay Sale

## 2. Mục tiêu nghiệp vụ của Accountant

Accountant phải đạt được 10 kết quả:

1. Nhìn được đầy đủ `giá trị hợp đồng`, `đã thu`, `công nợ`, `retention`.
2. Xác nhận được giao dịch thu theo từng đợt, nhiều lần nếu cần.
3. Ghi nhận được toàn bộ chi phí công trình và nguồn tiền thực chi.
4. Vận hành được `sổ quỹ` và kiểm soát lệnh chi theo mô hình BAC.
5. Đối soát được dòng tiền với chứng từ và hồ sơ phát hành.
6. Liên thông được `kho` với `phiếu xuất/nhập`, `ký nhận` và `chi phí vật tư`.
7. Theo dõi được tác động tài chính của `bảo hành`, `bảo trì`, `hậu mãi tính phí`.
8. Cung cấp được báo cáo doanh thu, chi phí, công nợ, dòng tiền và P&L công trình.
9. Giữ được audit trail cho mọi giao dịch thu, chi, ký nhận, phát hành chứng từ.
10. Hỗ trợ PM và Sale bằng dữ liệu tài chính đủ tin cậy để ra quyết định.

## 3. Information Architecture dành cho Accountant

### 3.1 Cụm điều hướng chính

1. `Finance Command Center`
2. `Receivables & Collections`
3. `Disbursement & Cash Control`
4. `Inventory & Stock Documents`
5. `Warranty, Maintenance & Aftersales Billing`
6. `Reports, Reconciliation & Audit`

### 3.2 Command Center chuẩn

Màn trung tâm của Accountant phải gom tối thiểu:

- công nợ đến hạn và quá hạn
- khoản thu mới cần xác nhận
- chi phí/lệnh chi đang chờ duyệt
- số dư quỹ và số dư theo từng nguồn tiền
- phiếu xuất/nhập đang chờ ký nhận hoặc chờ hoàn tất
- case hậu mãi đang phát sinh chi phí hoặc đang chờ thanh toán
- hồ sơ thanh toán/biên bản số đang chờ phát hành hoặc lưu dossier

## 4. Danh mục chức năng Accountant

| Mã | Nhóm chức năng | Mục tiêu | Ưu tiên |
|---|---|---|---|
| ACC-F01 | Dashboard & Inbox | Điều hành công việc tài chính hằng ngày | Critical |
| ACC-F02 | Payment Schedule & Receivables | Quản lý đợt thanh toán, đã thu, công nợ, quá hạn | Critical |
| ACC-F03 | Collection Confirmation & Payment Proof | Xác nhận thu tiền và lưu chứng từ thu | Critical |
| ACC-F04 | Disbursement Control | Kiểm soát chi tiền theo công trình, đối tác, nguồn tiền | Critical |
| ACC-F05 | Project Cost Ledger | Ghi nhận chi phí thực tế theo công trình | Critical |
| ACC-F06 | Cash Book & Fund Governance | Sổ quỹ, tài khoản công ty/cá nhân, luồng duyệt lệnh | Critical |
| ACC-F07 | Inventory Finance & Stock Documents | Quản lý phiếu xuất/nhập, giá trị vật tư, lịch sử kho | High |
| ACC-F08 | Stock Signature & Allocation Reconciliation | Đối soát ký nhận vật tư tá»›i Giám sát/worker profile | High |
| ACC-F09 | Project Financial Summary & P&L | Theo dõi doanh thu - chi phí - lợi nhuận thực theo công trình | Critical |
| ACC-F10 | Warranty, Maintenance & Aftersales Finance | Theo dõi chi phí hậu mãi và khoản phải thu phát sinh | High |
| ACC-F11 | Financial Document Dossier | Phát hành và lưu hồ sơ tài chính số | High |
| ACC-F12 | Reconciliation, Reports & Audit | Đối soát, báo cáo và truy vết thay đổi | Critical |

## 5. Chi tiết chức năng

### 5.1 ACC-F01 - Dashboard & Inbox

**Mục tiêu**

Cho Accountant một điểm vào duy nhất để biết hôm nay cần thu gì, chi gì, kiểm soát gì.

**Thông tin phải hiển thị**

- tổng phải thu trong kỳ
- tổng đã thu trong kỳ
- công nợ quá hạn
- chi phí/lệnh chi chờ duyệt
- số dư quỹ và số dư theo từng nguồn tiền
- vật tư cần nhập bổ sung
- case hậu mãi đang phát sinh chi phí hoặc đang chờ thu tiền

**Hành động chính**

- mở nhanh hồ sơ đợt thanh toán
- xác nhận thu tiền
- mở lệnh chi/cost entry chờ duyệt
- mở phiếu kho chờ ký/chờ hoàn tất
- mở case bảo hành/bảo trì đang ảnh hưởng tài chính

**Rule**

- dashboard phải drill-down được đến đúng giao dịch/hồ sơ
- cảnh báo phải ưu tiên theo severity và due date
- accountant chỉ thấy phạm vi dữ liệu theo tenant và phân quyền

### 5.2 ACC-F02 - Payment Schedule & Receivables

**Mục tiêu**

Chuẩn hóa quản lý các đợt thanh toán theo hợp đồng và theo khoản phải thu phát sinh.

**Màn chính**

- Payment Schedule List
- Receivables Board
- Receivable Detail
- Overdue Queue
- Retention Schedule

**Hành động chính**

- tạo lịch thanh toán từ template `50-50`, `50-40-10`, `custom`, `custom có retention`
- điều chỉnh milestone khi hợp đồng/phụ lục thay đổi
- theo dõi `planned amount`, `actual collected`, `outstanding`, `retention`
- theo dõi quá hạn và lịch nhắc
- tạo receivable mới cho bảo trì tính phí hoặc phát sinh ngoài bảo hành

**Rule**

- payment schedule phải bám vào `Contract` hoặc `Aftersales Billing`, không là bản ghi rời
- một milestone được phép có nhiều transaction thu
- partial collection được phép và phải giữ số dư còn lại
- retention phải có `release condition` rõ ràng

### 5.3 ACC-F03 - Collection Confirmation & Payment Proof

**Mục tiêu**

Xác nhận dòng tiền vào đi kèm đầy đủ bằng chứng và audit.

**Màn chính**

- Confirm Collection Modal/Drawer
- Payment Proof Upload
- Collection History
- Collection Dispute / Exception

**Hành động chính**

- nhập số tiền thực nhận
- chọn ngày nhận tiền
- chọn phương thức thanh toán
- nhập tham chiếu ngân hàng/quỹ
- upload ảnh chụp, biên lai, file đối soát
- ghi chú partial payment, overpayment hoặc ngoại lệ

**Rule**

- giao dịch thu phải link tới `Payment Schedule` hoặc `Aftersales Billing`
- phải lưu người xác nhận, thời điểm xác nhận và nguồn tiền nhận
- nếu overpayment thì phải chọn cách xử lý: treo dư, trừ đợt sau hoặc hoàn
- nếu chứng từ chưa có ngay thì phải có trạng thái `pending proof` và deadline bổ sung

### 5.4 ACC-F04 - Disbursement Control

**Mục tiêu**

Biến "chi tiền" thành quy trình có kiểm soát, không chỉ là ghi nhận sau cùng.

**Màn chính**

- Disbursement Queue
- Payment Request Detail
- Approval Panel
- Disbursement History

**Hành động chính**

- nhận yêu cầu chi từ cost entry, phiếu mua hàng, thanh toán đối tác hoặc hoàn ứng
- chọn nguồn tiền `COMPANY`, `PERSONAL`, `CASH_FUND`
- tạo lệnh chi
- duyệt/từ chối/treo lệnh chi
- xác nhận giao dịch đã thực chi

**Rule**

- chi tiền phải bám vào ngữ cảnh nghiệp vụ: `Project Cost Entry`, `Purchase`, `Payable`, `Aftersales Cost`
- nguồn tiền khác nhau phải đi theo luồng duyệt khác nhau
- không được "chi xong mới nhập" nếu thiếu tối thiểu dữ liệu người tạo lệnh, người duyệt, khoản mục chi
- mọi override phải có lý do và audit log

### 5.5 ACC-F05 - Project Cost Ledger

**Mục tiêu**

Ghi nhận chi phí thực tế theo công trình để P&L không còn là số ước tính đơn giản.

**Màn chính**

- Cost Entry List
- Cost Entry Create/Edit
- Cost Approval Queue
- Project Cost Ledger Detail

**Nhóm chi phí tối thiểu**

- giám sát/thi công
- nhân công
- vật tư
- thiết bị
- di chuyển
- giáo mác/đu dây/che chắn
- thuê ngoài/outsource
- hậu mãi
- khác

**Hành động chính**

- tạo cost entry theo project
- gắn cost source và account scope
- đính kèm chứng từ, hóa đơn, ảnh chụp, phiếu chi nếu có
- duyệt hoặc trả lại cost entry
- chuyển cost entry thành lệnh chi khi cần giải ngân

**Rule**

- cost entry phải có `project`, `cost category`, `amount`, `incurred_at`
- chi phí vật tư phải link được tới phiếu kho hoặc chứng từ mua
- chi phí phải phân biệt dữ liệu `dự toán nội bộ`, `ước tính`, `thực tế đã chốt`
- chi phí hậu mãi phải link tới `Warranty Case` hoặc `Maintenance Visit`
- mọi cost entry đã chốt kỳ phải khóa sửa trực tiếp

### 5.6 ACC-F06 - Cash Book & Fund Governance

**Mục tiêu**

Chuẩn hóa mô hình BAC đang dùng cho quỹ tiền mặt, tài khoản công ty và tài khoản cá nhân.

**Màn chính**

- Cash Book Workspace
- Fund Account List
- Cash Book Entry Detail
- Approval Matrix
- Daily Fund Balance

**Luồng kiểm soát cần có**

- `Tiền công ty`: kế toán tạo lệnh, người có thẩm quyền duyệt lệnh, người theo dõi
- `Tiền cá nhân`: người lập đề nghị, người đi tiền, người theo dõi ra/vào
- `Quỹ tiền mặt`: ghi nhận thu/chi/tồn theo ngày, chứng từ và diễn giải

**Rule**

- mọi transaction thu/chi cuối cùng phải post được vào `Cash Book Entry`
- sổ quỹ phải thể hiện ít nhất: ngày ghi sổ, ngày chứng từ, số chứng từ, diễn giải, thu, chi, tồn, chú
- hệ thống phải tách rõ `book_scope` và `account_scope`
- không được ghi âm quỹ nếu không có quyền override

### 5.7 ACC-F07 - Inventory Finance & Stock Documents

**Mục tiêu**

Cho Accountant nhìn được kho không chỉ ở tồn kho số lượng, mà còn ở giá trị và chứng từ.

**Màn chính**

- Material Catalog
- Stock In Document
- Stock Out Document
- Stock History
- Inventory Value Dashboard

**Hành động chính**

- tạo phiếu nhập/phiếu xuất
- theo dõi giá trị vật tư theo tồn kho và theo phiếu
- theo dõi chênh lệch planned / issued / returned
- theo dõi phân loại `asset`, `consumable`, `semi-consumable`
- mở lịch sử kho theo project hoặc theo vật tư

**Rule**

- mỗi stock document phải có `document type`, `document no`, `issued_at`, `status`
- stock out cho công trình phải link được với project
- giá trị vật tư xuất kho là dữ liệu đầu vào cho cost ledger/P&L
- trạng thái phiếu phải phân biệt `draft`, `issued`, `signed`, `completed`, `cancelled`

### 5.8 ACC-F08 - Stock Signature & Allocation Reconciliation

**Mục tiêu**

Đảm bảo vật tư xuất ra công trình có người nhận và truy vết được tới lực lượng thực thi.

**Màn chính**

- Stock Signature Detail
- Issue-to-Worker Reconciliation
- Pending Signature Queue

**Hành động chính**

- ghi nhận Giám sát ký nhận
- ghi nhận phát vật tư cho worker profile nếu có
- đối soát vật tư đã cấp với task/package
- theo dõi hoàn kho hoặc vật tư dư
- theo dõi thu hồi tài sản thi công
- theo dõi `remainder lot` cho phần dư còn dùng được

**Rule**

- trong phase hiện tại, `Giám sát` là actor thao tác chính trên phần mềm
- hệ thống vẫn phải lưu được `received_for_worker_id` khi vật tư phát cho worker profile cụ thể
- task thi công có thể bị chặn nếu vật tư chưa có phiếu xuất/ký nhận hợp lệ
- phần dư hoàn nhập chỉ được cộng lại vào tồn khả dụng sau khi qua bước kiểm tra chất lượng

### 5.9 ACC-F09 - Project Financial Summary & P&L

**Mục tiêu**

Cho Accountant thấy lợi nhuận thực theo công trình, không chỉ doanh thu hợp đồng.

**Màn chính**

- Project Financial Summary
- P&L by Project
- Margin Variance View
- Retention Tracking

**Thông tin phải thấy**

- giá trị hợp đồng
- VAT
- đã thu
- công nợ còn lại
- retention đang giữ / đã giải tỏa
- chi phí nhân công, vật tư, giám sát, hậu mãi
- lợi nhuận trước và sau hậu mãi

**Rule**

- dashboard phải tách `ước tính` và `đã chốt`
- chi phí hậu mãi phải được cộng vào P&L thực
- PM chỉ xem snapshot điều hành; Accountant mới là owner điều chỉnh ledger

### 5.10 ACC-F10 - Warranty, Maintenance & Aftersales Finance

**Mục tiêu**

Theo dõi tài chính của mọi case bảo hành/bảo trì thay vì xem đây là module phụ.

**Màn chính**

- Warranty Card List
- Warranty/Maintenance Case Finance Detail
- Aftersales Billing
- Retention Release Queue

**Hành động chính**

- phân loại case trong/ngoài bảo hành
- ghi chi phí hậu mãi
- tạo billing cho case tính phí
- theo dõi trạng thái đã thu/chờ thu
- giải tỏa retention khi đủ điều kiện

**Rule**

- case ngoài bảo hành nhưng công ty hỗ trợ miễn phí vẫn phải có dấu vết `WAIVED`
- case tính phí phải sinh receivable riêng
- retention release phải có điều kiện thời gian/chất lượng rõ

### 5.11 ACC-F11 - Financial Document Dossier

**Mục tiêu**

Gom toàn bộ chứng từ tài chính vào hồ sơ số có truy vết.

**Màn chính**

- Financial Dossier List
- Document Record Detail
- Payment Request Generator
- E-sign Status

**Chứng từ tối thiểu**

- hợp đồng/phụ lục
- đề nghị tạm ứng
- đề nghị thanh toán
- phiếu thu/phiếu chi
- biên bản nghiệm thu
- phiếu bảo hành điện tử
- hồ sơ thanh toán hậu mãi

**Rule**

- chứng từ phát hành phải gắn `template version`
- file phát hành và file đã ký phải cùng một hồ sơ tài liệu
- phải link được hồ sơ tới project, payment schedule hoặc warranty case

### 5.12 ACC-F12 - Reconciliation, Reports & Audit

**Mục tiêu**

Đóng vòng đối soát để dữ liệu kế toán trong hệ thống đủ tin cậy cho báo cáo và quyết định.

**Màn chính**

- Reconciliation Workspace
- Cash Book Report
- Revenue/Cost Report
- Debt Aging
- Audit Log

**Báo cáo tối thiểu**

- doanh thu theo tháng/nguồn
- chi phí theo công trình
- đã thu / công nợ
- dòng tiền vào/ra
- sổ quỹ
- tồn kho và giá trị kho
- chi phí hậu mãi
- retention pending release

**Rule**

- report phải truy được về transaction gốc
- mọi thay đổi trạng thái tài chính phải có audit trail
- chốt kỳ phải có checkpoint đối soát trước khi khóa sửa

## 6. Ranh giới quyền của Accountant

| Hạng mục | Accountant | PM | Giám sát | Hành Chính | Admin |
|---|---|---|---|---|---|
| Tạo/điều chỉnh payment schedule | Có | Một phần | Không | Không | Có |
| Xác nhận thu tiền | Có | Không | Không | Không | Có |
| Tạo cost entry | Có | Có | Một phần | Không | Có |
| Duyệt cost entry / lệnh chi | Có | Không | Không | Không | Có |
| Ghi sổ quỹ | Có | Không | Không | Không | Có |
| Tạo phiếu kho | Có | Một phần | Một phần | Không | Có |
| Xác nhận ký nhận vật tư | Một phần | Không | Có | Không | Có |
| Xem P&L công trình chi tiết | Có | Snapshot | Không | Không | Có |
| Tạo billing hậu mãi | Có | Một phần | Không | Một phần | Có |
| Phát hành chứng từ tài chính số | Một phần | Không | Không | Có | Có |

## 7. Business rules bắt buộc cho Accountant

1. `Payment Schedule` phải bám theo hợp đồng hoặc billing thực, không tồn tại rời.
2. Mỗi khoản thu/chi phải đi qua một aggregate rõ ràng: milestone, billing, cost entry, cashbook hoặc stock document.
3. Hệ thống phải tách được `tiền công ty`, `tiền cá nhân`, `quỹ tiền mặt`.
4. Sổ quỹ phải phản ánh được `thu`, `chi`, `tồn` và số chứng từ theo ngày.
5. Chi phí công trình phải ghi được `cost category`, `cost source`, `account scope`.
6. Kho không chỉ là số lượng; Accountant phải thấy được giá trị vật tư và ảnh hưởng tới cost ledger.
7. Accountant phải quản trị được `bảng giá nội bộ`, `đơn giá nguồn lực theo thời điểm` và ảnh hưởng của chúng tới giá vốn dự kiến.
8. Mọi case hậu mãi phải nhìn được `chi phí` và `khoản phải thu` nếu có.
9. Chứng từ tài chính phát hành ra ngoài phải gắn template version và dossier.
10. Portal chat liên quan tới thanh toán, bảo hành hoặc tranh chấp chi phí phải truy xuất được từ góc nhìn Accountant.
11. Prototype Accountant chỉ mới chạm tới `kho` và `đợt thanh toán`; các phần `sổ quỹ`, `chi phí`, `đối soát`, `retention`, `aftersales billing`, `asset/remainder` vẫn là backlog BA cần build.

## 8. Kết luận

Package Accountant của V4 phải được hiểu là một workspace kiểm soát vận hành tài chính nội bộ, không phải một vài màn "xác nhận đã thu" và "xem kho". Toàn bộ flow `hợp đồng -> thu tiền -> chi phí -> sổ quỹ -> lợi nhuận -> hậu mãi` phải cùng nằm trong phạm vi tài liệu Accountant.
