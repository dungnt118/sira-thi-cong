# Roadmap triển khai BAC Group v1

## 1. Mục tiêu roadmap

Roadmap này chuyển bộ BA-V4 từ mức `baseline nghiệp vụ` sang `trình tự triển khai`.

Mục tiêu:

- xác định phase nào làm trước, phase nào làm sau
- chốt đầu ra quan trọng của từng phase
- tránh việc build tính năng rời rạc không tạo thành một hệ vận hành

## 2. Nguyên tắc xếp phase

1. Làm `trục điều phối nghiệp vụ` trước, làm `back-office sâu` sau.
2. Ưu tiên những gì tạo ra `luồng dùng thật xuyên vai trò`.
3. Phase 1 phải tạo ra được prototype có giá trị trình diễn và kiểm chứng sớm với người dùng.
4. `Customer Journey` phải là màn hình trung tâm của phase đầu, không phải một Kanban đơn giản.
5. Các phase sau chỉ mở rộng khi phase trước đã chốt được aggregate, flow và actor chính.

## 3. Tóm tắt roadmap

| Phase | Tên phase | Trọng tâm | Vai trò trung tâm | Đầu ra chiến lược |
|---|---|---|---|---|
| 1 | Customer Journey Foundation | Công trình khách hàng 360 độ, responsive, configurable, liên kết Sale/Giám sát/Portal | PM, Sale, Giám sát, Customer Portal | Màn `CustomerJourney` trở thành trục điều hành prototype |
| 2 | Preconstruction & Commercial Control | Dự toán nội bộ, go/no-go, báo giá, hợp đồng, tài liệu số | PM, Sale, Hành Chính, Kế toán | Kiểm soát được bước trước dự án và chốt thương mại |
| 3 | Internal Delivery, Inventory & Finance Control | Task orchestration, workforce, kho, tài sản, phần dư, thanh toán, cost ledger | PM, Giám sát, Kế toán | Điều hành nội bộ và tài chính bắt đầu chạy thật |
| 4 | Aftersales, Governance & Reporting | Bảo hành/bảo trì, portal hoàn chỉnh, báo cáo, audit, governance | PM, Sale, Giám sát, Kế toán, Admin | Đóng vòng hậu mãi và quản trị dữ liệu |

## 4. Phase 1 là phase bắt buộc

### 4.1 Mục tiêu trọng tâm

Phase 1 phải tạo ra một prototype mà khi người dùng mở vào sẽ thấy ngay:

- một `Customer Journey` trung tâm
- một yêu cầu dịch vụ có thể nhìn `360 độ`
- các vai trò `PM`, `Sale`, `Giám sát`, `Customer Portal` đã được nối với nhau bằng cùng một dòng dữ liệu

### 4.2 Đầu ra bắt buộc của phase 1

- Màn `CustomerJourney` cho PM
- Responsive `desktop + mobile`
- `Customer Journey` configurable, có template mặc định và khả năng reset
- Mỗi `step` có:
  - người tham gia
  - mục tiêu công việc
  - checklist
  - quy trình nội bộ gắn kèm
  - điều kiện vào/ra
  - dữ liệu liên quan
- Sale nhìn được công trình cùng ngữ cảnh
- Giám sát đẩy được dữ liệu khảo sát/hiện trường vào công trình
- Portal khách hàng xem được dữ liệu đã publish và chat theo ngữ cảnh

### 4.3 Những gì phase 1 chưa cần làm sâu

- cost ledger đầy đủ cho Kế toán
- kho tài sản/phần dư hoàn chỉnh
- approval matrix tài chính sâu
- báo cáo quản trị toàn diện
- workflow hậu mãi đầy đủ

## 5. Mô tả từng phase

### 5.1 Phase 1 - Customer Journey Foundation

Trọng tâm:

- PM có `CustomerJourney` thay thế Kanban đơn giản
- Sale, Giám sát và Portal cùng bám vào một context chung
- chốt mô hình cấu hình journey theo template

Deliverable chính:

- danh sách journey
- chi tiết journey 360 độ
- cấu hình journey step template
- portal timeline và chat cơ bản

Chi tiết tại:

- [Phase 1](E:/BAC-PROJECTS/BAC-GROUP/docs/Phase-01-Customer-Journey-Foundation/README.md)

### 5.2 Phase 2 - Preconstruction & Commercial Control

Trọng tâm:

- bóc tách dự toán nội bộ
- cảnh báo go/no-go
- mapping báo giá khách hàng
- hợp đồng, tài liệu số, chữ ký

Deliverable chính:

- estimate workbench
- go/no-go board
- quotation mapping
- contract/document flow

Chi tiết tại:

- [Phase 2](E:/BAC-PROJECTS/BAC-GROUP/docs/Phase-02-Preconstruction-Commercial-Control/README.md)

### 5.3 Phase 3 - Internal Delivery, Inventory & Finance Control

Trọng tâm:

- vận hành nội bộ sau khi chốt dự án
- giao việc, workforce, giám sát hiện trường
- kho vật tư, tài sản, phần dư
- thanh toán, cost control, cashbook

Deliverable chính:

- project workbench
- task orchestration
- inventory + asset + remainder
- finance control

Chi tiết tại:

- [Phase 3](E:/BAC-PROJECTS/BAC-GROUP/docs/Phase-03-Internal-Delivery-Inventory-Finance/README.md)

### 5.4 Phase 4 - Aftersales, Governance & Reporting

Trọng tâm:

- bảo hành/bảo trì
- portal hậu mãi hoàn chỉnh
- audit, dashboard, reporting
- hardening để chuẩn bị rollout

Deliverable chính:

- warranty/maintenance lifecycle
- portal communication dossier
- reporting & governance

Chi tiết tại:

- [Phase 4](E:/BAC-PROJECTS/BAC-GROUP/docs/Phase-04-Aftersales-Governance-Reporting/README.md)

## 6. Điều kiện qua phase

Một phase chỉ được xem là xong khi đủ cả:

- cấu trúc dữ liệu chính đã chốt
- flow nghiệp vụ chính chạy thông
- màn hình lõi đã có
- rule khóa/mở trạng thái đã rõ
- actor và quyền thao tác đã rõ
- có checklist kiểm thử phase

## 7. Kết luận

Roadmap này cố ý đặt `Customer Journey` làm tâm của phase 1 để toàn bộ team thống nhất một trục điều hành ngay từ đầu. Nếu phase 1 vẫn chỉ dừng ở Kanban đơn giản, các phase sau sẽ tiếp tục rời rạc và rất khó gắn lại thành một hệ vận hành thật.
