# Operating Guide - Accountant V4

## 1. Mục tiêu

Hướng dẫn này mô tả cách Accountant vận hành hệ thống theo các ngữ cảnh thực tế của BAC Group:

- thu tiền theo hợp đồng
- ghi nhận chi phí và chi tiền
- quản lý kho và giá trị vật tư
- theo dõi bảo hành/bảo trì về mặt tài chính
- chốt báo cáo và đối soát cuối kỳ

## 2. Chu kỳ làm việc hằng ngày của Accountant

### Đầu ngày

1. Mở `Finance Command Center`.
2. Kiểm tra:
   - đợt thanh toán đến hạn và quá hạn
   - giao dịch thu chờ xác nhận hoặc chờ bổ sung chứng từ
   - lệnh chi / cost entry chờ duyệt
   - biến động quỹ tiền mặt và số dư nguồn tiền
   - phiếu kho chờ ký nhận hoặc chờ hoàn tất
   - case bảo hành/bảo trì đang phát sinh chi phí hoặc chờ thu tiền

### Trong ngày

1. Xác nhận thu tiền và cập nhật công nợ.
2. Ghi nhận chi phí thực tế theo công trình.
3. Tạo hoặc duyệt lệnh chi theo đúng nguồn tiền.
4. Theo dõi phiếu xuất/nhập, ký nhận và ảnh hưởng tới chi phí vật tư.
5. Phối hợp với PM, Hành Chính, Sale về hồ sơ thanh toán và chứng từ phát hành.

### Cuối ngày

1. Kiểm tra giao dịch nào còn `pending proof`.
2. Kiểm tra cost entry/lệnh chi chưa chốt.
3. Kiểm tra phiếu kho còn treo ký nhận.
4. Kiểm tra case hậu mãi có tác động tài chính chưa xử lý xong.

## 3. Kịch bản 1 - Theo dõi và xác nhận thu tiền

### Khi dùng

- khách thanh toán theo đợt hợp đồng
- khách thanh toán cho khoản bảo trì ngoài bảo hành
- có khoản partial payment cần ghi nhận

### Cách làm

1. Mở `Payment Schedule List`.
2. Lọc theo:
   - đến hạn hôm nay
   - quá hạn
   - theo project
   - theo customer
3. Mở milestone cần xử lý.
4. Chọn `Xác nhận thu`.
5. Nhập:
   - số tiền thực nhận
   - ngày nhận
   - phương thức thanh toán
   - tham chiếu ngân hàng/quỹ
   - ghi chú nếu có
6. Upload chứng từ hoặc đánh dấu chờ bổ sung.
7. Kiểm tra sau xác nhận:
   - milestone đã cập nhật đúng
   - công nợ còn lại đúng
   - cashbook đã nhận dòng post tương ứng

### Lưu ý

- không sửa đè lịch sử thu cũ
- partial payment phải để lại số dư rõ ràng
- mọi giao dịch thu nên có bằng chứng, kể cả ảnh chụp chuyển khoản

## 4. Kịch bản 2 - Ghi nhận chi phí công trình

### Khi dùng

- phát sinh chi phí vật tư, nhân công, giám sát, thuê ngoài
- cần đưa khoản chi vào P&L công trình

### Cách làm

1. Mở `Project Cost Entry`.
2. Chọn đúng `project`.
3. Chọn đúng `cost category`.
4. Nhập:
   - số tiền
   - ngày phát sinh
   - nguồn chi
   - mô tả chi tiết
5. Đính kèm chứng từ nếu có.
6. Submit để duyệt hoặc tạo lệnh chi nếu cần giải ngân ngay.

### Lưu ý

- đừng nhập chi phí chung chung không gắn project
- chi phí vật tư nên link về chứng từ kho hoặc chứng từ mua
- chi phí hậu mãi phải gắn đúng case bảo hành/bảo trì

## 5. Kịch bản 3 - Tạo và theo dõi lệnh chi

### Khi dùng

- cần giải ngân cho công trình
- cần thanh toán đối tác/nhân công
- cần chi từ tài khoản công ty, cá nhân hoặc quỹ tiền mặt

### Cách làm

1. Mở `Disbursement Queue`.
2. Chọn hồ sơ chi hoặc tạo lệnh chi từ cost entry.
3. Chọn `account scope`:
   - `COMPANY`
   - `PERSONAL`
   - `CASH_FUND`
4. Kiểm tra đúng luồng duyệt.
5. Sau khi có duyệt hợp lệ, xác nhận `đã chi`.
6. Kiểm tra:
   - payment transaction đã tạo
   - cashbook đã post
   - chi phí công trình đã cập nhật

### Lưu ý

- không xác nhận `đã chi` khi chưa có ngữ cảnh công trình/lý do chi
- tiền công ty và tiền cá nhân không được nhập chung một scope
- chỉnh sửa giao dịch đã chốt phải đi qua adjustment/reversal

## 6. Kịch bản 4 - Quản lý kho và ký nhận vật tư

### Khi dùng

- nhập kho
- xuất kho cho công trình
- đối soát vật tư đã phát

### Cách làm

1. Mở `Inventory Dashboard` hoặc `Stock Out Document`.
2. Kiểm tra tồn kho và ngưỡng cảnh báo.
3. Khi xuất kho:
   - chọn project
   - chọn vật tư và số lượng
   - phát hành phiếu
4. Theo dõi trạng thái ký nhận từ Giám sát.
5. Nếu có phát cho worker profile cụ thể, ghi đúng người nhận thực tế.
6. Sau khi hoàn tất, kiểm tra giá trị vật tư đã đi vào cost ledger.

### Lưu ý

- phiếu chưa ký nhận thì chưa coi là hoàn tất nghiệp vụ
- xuất kho cho project nào phải truy lại được đúng project đó
- đừng xem kho chỉ là số lượng; cần nhìn cả giá trị vật tư

## 7. Kịch bản 5 - Theo dõi bảo hành, bảo trì và hậu mãi tính phí

### Khi dùng

- case trong bảo hành phát sinh chi phí
- case ngoài bảo hành cần thu phí
- cần xem retention có đủ điều kiện giải tỏa chưa

### Cách làm

1. Mở `Warranty/Maintenance Case Finance`.
2. Kiểm tra:
   - case thuộc trong hay ngoài bảo hành
   - chi phí đã phát sinh
   - khoản phải thu nếu có
3. Nếu ngoài bảo hành:
   - tạo `Aftersales Billing`
   - phát hành đề nghị thanh toán/hồ sơ số
   - theo dõi receivable
4. Nếu đủ điều kiện release retention:
   - mở `Retention Schedule`
   - kiểm tra điều kiện
   - tạo nghiệp vụ giải tỏa hoặc thu khoản retention còn lại

### Lưu ý

- case miễn phí vẫn phải ghi được chi phí
- case hậu mãi chưa thu xong thì chưa xem là đóng hoàn toàn về tài chính
- retention là khoản riêng, không tự biến mất khỏi dashboard

## 8. Kịch bản 6 - Chốt tháng và đối soát

### Cách làm

1. Mở `Reconciliation Workspace`.
2. Đối chiếu:
   - payment transaction với chứng từ
   - cashbook với giao dịch đã xác nhận
   - cost entry với lệnh chi
   - phiếu kho với giá trị vật tư đã ghi nhận
   - case hậu mãi với billing/chi phí liên quan
3. Sinh báo cáo:
   - doanh thu
   - chi phí
   - đã thu / công nợ
   - dòng tiền
   - sổ quỹ
   - giá trị kho
   - chi phí hậu mãi
4. Khi số liệu ổn, khóa kỳ hoặc đánh dấu locked.

### Lưu ý

- không khóa kỳ khi còn cost entry hoặc giao dịch lớn chưa post
- báo cáo chốt tháng phải truy được về transaction gốc
- nếu có chỉnh sửa sau khóa kỳ, dùng adjustment thay vì sửa đè

## 9. Những điều Accountant cần tránh

- xác nhận thu/chi nhưng không gắn chứng từ hoặc ngữ cảnh nghiệp vụ
- nhập chi phí vào hệ thống quá muộn làm sai P&L công trình
- bỏ qua tách biệt giữa tiền công ty, tiền cá nhân và quỹ tiền mặt
- xem nhẹ phần hậu mãi vì nó ảnh hưởng trực tiếp tới lợi nhuận thực
- để phiếu kho kéo dài trạng thái chờ ký nhận

## 10. Kết luận

Accountant trong V4 phải vận hành hệ thống như một trung tâm kiểm soát nội bộ cho:

- tiền vào
- tiền ra
- kho
- chứng từ
- hậu mãi

Nếu một nghiệp vụ tài chính quan trọng vẫn đang phải quản lý ngoài hệ thống mà chưa có chỗ phản ánh trong các flow trên, đó là backlog cần mở tiếp của package Accountant.
