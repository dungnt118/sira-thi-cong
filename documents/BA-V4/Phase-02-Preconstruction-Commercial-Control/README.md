# Phase 2 - Preconstruction & Commercial Control

## 1. Mục tiêu phase

Phase 2 làm sâu toàn bộ lớp `trước dự án` để hệ thống chốt thương mại đúng, thay vì chỉ nhìn thấy hành trình.

Trọng tâm:

- dự toán nội bộ
- go/no-go
- báo giá khách hàng
- hợp đồng
- tài liệu số và chữ ký

## 2. Vai trò trung tâm

- `PM`
- `Sale`
- `Hành Chính`
- `Kế toán`

## 3. Cấu trúc chức năng chi tiết

### 3.1 Estimate Workbench

#### 3.1.1 Mục tiêu

Tạo nơi bóc tách dự toán nội bộ theo khảo sát và điều kiện thực tế.

#### 3.1.2 Chức năng bắt buộc

- version estimate
- price book nội bộ
- tính vật tư
- tính nhân công
- tính vận chuyển
- tính giáo mác/đu dây/che chắn
- biên lợi nhuận dự kiến

Checklist:

- [ ] Có `Estimate Version`
- [ ] Có bảng giá theo thời gian/khu vực
- [ ] Có variance giữa các version

### 3.2 Go/No-Go Control

#### 3.2.1 Chức năng bắt buộc

- warning theo vật tư
- warning theo nhân công
- warning theo deadline
- warning theo biên lợi nhuận
- chốt `GO`, `GO_WITH_CONDITIONS`, `REPRICE_REQUIRED`, `NO_GO`
- override có audit

### 3.3 Quotation Mapping & Quotation Workspace

#### 3.3.1 Chức năng bắt buộc

- mapping đầu mục nội bộ sang đầu mục báo giá khách
- tạo quotation version
- compare quotation version
- preview theo template
- publish cho khách

### 3.4 Contract & Document Control

#### 3.4.1 Chức năng bắt buộc

- sinh hợp đồng từ quotation thắng
- chọn mẫu tài liệu
- merge dữ liệu
- ký điện tử
- lưu hồ sơ số

### 3.5 Hành Chính và Sale follow-up

#### 3.5.1 Chức năng bắt buộc

- contract follow-up
- theo dõi trạng thái ký
- mail mẫu phát hành
- tạm ứng và đề nghị thanh toán giai đoạn đầu

## 4. Deliverable chính của phase

- estimate workbench
- go/no-go dashboard
- quotation mapping config
- quotation workspace hoàn chỉnh
- contract flow
- document template + e-sign tối thiểu

## 5. Ngoài phạm vi phase

- task orchestration đầy đủ sau khi đã convert
- kho vận hành thật và asset/remainder recovery
- cashbook và reconciliation sâu
- aftersales lifecycle đầy đủ

## 6. Tiêu chí hoàn tất phase

- [ ] Có estimate nội bộ version hóa
- [ ] Có go/no-go chặn phát hành báo giá khi cần
- [ ] Có quotation mapping
- [ ] Có báo giá khách hàng version hóa
- [ ] Có hợp đồng/tài liệu số cơ bản
- [ ] Sale/Hành Chính theo được trạng thái chốt thương mại
