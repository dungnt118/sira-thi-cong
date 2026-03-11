# User Flows - Accountant V4

## 1. Mục tiêu

Các flow dưới đây mô tả những hành trình nghiệp vụ bắt buộc mà Accountant phải thực hiện được trong V4, bám theo:

- đợt thanh toán hợp đồng
- chi phí công trình và lệnh chi
- sổ quỹ và nguồn tiền
- kho vật tư và ký nhận
- hậu mãi bảo hành/bảo trì
- đối soát và báo cáo tháng

## 2. Flow 1 - Xác nhận thu tiền theo đợt thanh toán

**Goal**: Accountant xác nhận thu tiền đầy đủ chứng từ và cập nhật công nợ đúng.

```mermaid
flowchart TD
  A["Accountant mở Payment Schedule List"] --> B["Chọn milestone cần xác nhận"]
  B --> C["Mở Confirm Collection Drawer"]
  C --> D["Nhập số tiền thực nhận, ngày nhận, phương thức, tham chiếu"]
  D --> E["Upload chứng từ thu hoặc đánh dấu pending proof"]
  E --> F{"Thu đủ hay thu một phần?"}
  F -->|Thu đủ| G["Cập nhật milestone = PAID"]
  F -->|Thu một phần| H["Cập nhật collected amount và số dư còn lại"]
  G --> I["Post Payment Transaction"]
  H --> I
  I --> J["Post Cash Book Entry"]
  J --> K["Cập nhật công nợ và dashboard"]
  K --> L["Lưu hồ sơ chứng từ vào dossier tài chính"]
```

**Điểm kiểm soát**

- milestone gốc không được mất dấu vết khi partial payment
- chứng từ thu và audit phải link tới transaction
- nếu phát sinh overpayment phải có rule xử lý rõ

## 3. Flow 2 - Ghi nhận chi phí công trình và tạo lệnh chi

**Goal**: Mọi khoản chi thực tế đều đi qua cost ledger và approval phù hợp.

```mermaid
flowchart TD
  A["Accountant mở Cost Entry Create"] --> B["Chọn project và nhóm chi phí"]
  B --> C["Nhập số tiền, ngày phát sinh, nguồn chi, ghi chú"]
  C --> D["Đính kèm chứng từ liên quan"]
  D --> E["Submit cost entry"]
  E --> F{"Có cần giải ngân ngay?"}
  F -->|Không| G["Cost entry ở trạng thái APPROVED / chưa chi"]
  F -->|Có| H["Tạo Payment Request / Lệnh chi"]
  H --> I{"Nguồn chi là gì?"}
  I -->|COMPANY| J["Đi theo luồng tạo lệnh -> duyệt lệnh -> theo dõi"]
  I -->|PERSONAL| K["Đi theo luồng đề nghị -> đi tiền -> theo dõi ra vào"]
  I -->|CASH_FUND| L["Post vào quỹ tiền mặt nếu đủ điều kiện"]
  J --> M["Xác nhận đã chi"]
  K --> M
  L --> M
  M --> N["Post Payment Transaction + Cash Book Entry"]
  N --> O["Cập nhật P&L công trình"]
```

**Điểm kiểm soát**

- chi tiền phải tách được tiền công ty và tiền cá nhân
- mọi chi phí phải có project hoặc ngữ cảnh nghiệp vụ
- chi phí đã khóa kỳ không sửa trực tiếp

## 4. Flow 3 - Xuất kho và ký nhận vật tư

**Goal**: Accountant kiểm soát được vật tư ra công trình, người nhận và giá trị chi phí.

```mermaid
flowchart TD
  A["Accountant mở Stock Out Document"] --> B["Chọn project và danh sách vật tư"]
  B --> C["Nhập số lượng, đơn giá, giá trị"]
  C --> D["Phát hành phiếu xuất"]
  D --> E["Giám sát nhận phiếu và ký nhận"]
  E --> F{"Có phát tới worker profile cụ thể?"}
  F -->|Có| G["Ghi received_for_worker_id"]
  F -->|Không| H["Ghi nhận Giám sát là người nhận"]
  G --> I["Hoàn tất phiếu xuất"]
  H --> I
  I --> J["Cập nhật issued quantity và giá trị vật tư"]
  J --> K["Đẩy dữ liệu sang cost ledger/P&L"]
```

**Điểm kiểm soát**

- phase hiện tại vẫn dùng Giám sát làm actor số
- giá trị xuất kho phải đi sang cost ledger
- phiếu chưa ký nhận thì trạng thái kho và task liên quan chưa xem là hoàn tất

## 5. Flow 4 - Xử lý case bảo trì tính phí

**Goal**: Accountant theo dõi đầy đủ tài chính của case ngoài phạm vi bảo hành.

```mermaid
flowchart TD
  A["Warranty/Maintenance Case được kết luận OUT_OF_SCOPE"] --> B["Accountant mở Case Finance Detail"]
  B --> C["Ghi nhận chi phí hậu mãi đã phát sinh"]
  C --> D["Tạo Aftersales Billing"]
  D --> E["Sinh đề nghị thanh toán / chứng từ số"]
  E --> F["Gửi khách và theo dõi trạng thái ký nếu có"]
  F --> G["Theo dõi receivable cho case"]
  G --> H["Xác nhận thu tiền"]
  H --> I["Post cashbook, cập nhật case = PAID/CLOSED"]
```

**Điểm kiểm soát**

- chi phí hậu mãi phải ghi được kể cả khi miễn phí
- billing hậu mãi là receivable riêng, không gộp mơ hồ vào hợp đồng cũ
- case chỉ đóng hoàn toàn khi kỹ thuật và tài chính đều xong

## 6. Flow 5 - Giải tỏa retention sau bảo hành

**Goal**: Accountant xử lý đúng khoản giữ lại bảo hành theo điều kiện hợp đồng.

```mermaid
flowchart TD
  A["Retention Schedule đến hạn"] --> B["Accountant mở Retention Release Queue"]
  B --> C["Kiểm tra điều kiện thời gian/chất lượng/case hậu mãi"]
  C --> D{"Đủ điều kiện giải tỏa?"}
  D -->|Chưa đủ| E["Giữ trạng thái pending và ghi lý do"]
  D -->|Đủ| F["Tạo đợt thu retention hoặc xác nhận release"]
  F --> G["Phát hành hồ sơ thanh toán retention nếu cần"]
  G --> H["Theo dõi thu tiền"]
  H --> I["Cập nhật retention balance = released"]
```

**Điểm kiểm soát**

- retention không được tự mất khỏi dashboard chỉ vì đã qua thời gian dự kiến
- phải kiểm tra tồn tại case hậu mãi/dispute trước khi release

## 7. Flow 6 - Đối soát và chốt tháng

**Goal**: Accountant chốt kỳ báo cáo với số liệu có thể truy vết.

```mermaid
flowchart TD
  A["Đến cuối kỳ"] --> B["Mở Reconciliation Workspace"]
  B --> C["Đối chiếu payment transaction với chứng từ và cashbook"]
  C --> D["Kiểm tra cost entry chưa duyệt hoặc chưa post"]
  D --> E["Kiểm tra phiếu kho chưa hoàn tất hoặc chưa ký nhận"]
  E --> F["Kiểm tra case hậu mãi đang treo tài chính"]
  F --> G["Sinh báo cáo doanh thu - chi phí - đã thu - công nợ"]
  G --> H["Sinh báo cáo quỹ tiền mặt và dòng tiền"]
  H --> I["Khóa kỳ / đánh dấu locked cho dữ liệu đã chốt"]
```

**Điểm kiểm soát**

- báo cáo tháng phải truy được về transaction gốc
- không khóa kỳ khi còn transaction lớn chưa post hoặc chưa duyệt
- dữ liệu locked chỉ sửa bằng adjustment/reversal

## 8. Kết luận

6 flow trên là bộ tối thiểu để role Accountant của BA-V4 vận hành được thực tế. Nếu backlog dev chỉ map được vào `Flow 1` và một phần `Flow 3`, thì hệ thống vẫn đang mới dừng ở prototype chứ chưa đạt chuẩn kiểm soát tài chính nội bộ.
