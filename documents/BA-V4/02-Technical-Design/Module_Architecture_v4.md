# Kiến trúc module v4

## 1. Nguyên tắc chia module

Module trong V4 được chia theo `ownership dữ liệu`, `actor ra quyết định nghiệp vụ` và `điểm bàn giao liên phòng ban`, không chia theo menu hay màn hình.

Nguyên tắc bắt buộc:

1. `Service Request` là điểm khởi đầu CRM, không dùng `Customer` làm Kanban entity.
2. `Giám sát` là actor số chính của hiện trường ở giai đoạn hiện tại; `Kỹ thuật` được quản lý dưới dạng `kỹ thuật profile`.
3. `Google Drive` là lớp lưu trữ cloud, nhưng metadata và business permission phải do hệ thống BAC Group sở hữu.
4. `Warranty/Maintenance` không tách riêng khỏi tài chính; mọi case hậu mãi đều phải nhìn được financial impact.
5. `Admin` khác `HanhChinh`; một bên cấu hình hệ thống, một bên vận hành hồ sơ và chứng từ.

## 2. Bản đồ module chuẩn

| Module | Sở hữu dữ liệu | Vai trò dùng chính | Kết quả đầu ra |
|---|---|---|---|
| Module A - CRM & Sales Orchestration | Customer, Service Request, Pipeline, Survey, Survey Summary, Estimate Version, Price Book, Quotation Mapping, Quotation, Contract, Interaction Log | Sale, PM | Deal được chuẩn hóa, có thể đi từ khách mới hoặc khách cũ, có SLA tiếp nhận, dự toán nội bộ và dữ liệu thương mại rõ ràng |
| Module B - Vận hành nội bộ | Project, Project Assignment, Kỹ thuật Profile, Workforce Assignment, Project Task, Stage Playbook, Handoff Rule, SLA, Go/No-Go Review | PM, Giám sát | Điều phối nội bộ theo vai trò, có task, bàn giao, quyết định nhận việc và trách nhiệm rõ ràng |
| Module C - Field Execution | Checklist, Evidence, Incident, Acceptance Draft, Site Report | Giám sát, PM | Tiến độ và chất lượng hiện trường được cập nhật có truy vết actor thực hiện thực tế |
| Module D - Inventory & Procurement | Material, Standard, Reservation, Stock Document, Purchase Request, Asset Registry, Remainder Lot | Accountant, PM, Giám sát | Vật tư và tài sản được lập kế hoạch, cấp phát, thu hồi, hoàn nhập và đối soát được |
| Module E - Finance, Acceptance, Warranty & Maintenance | Payment Schedule, Transaction, Project Cost Entry, Cash Book Entry, Acceptance Record, Portal Thread, Warranty Card, Warranty Case, Maintenance Visit, Aftersales Cost, Aftersales Billing | Accountant, PM, Giám sát, Sale, Customer Portal | Dòng tiền, chi phí, nghiệm thu, giao tiếp portal và hậu mãi được đóng vòng đời |
| Module F - Admin, Integration & Governance | User, Role, Notification, Audit, Integration Settings, File Governance, Google Drive Sync | Admin | Hệ thống được cấu hình, tích hợp và kiểm soát thống nhất |
| Module G - Document Automation & Digital Signature | Document Template, Template Version, Document Record, Signature Envelope, Signature Participant, Signature Event, Dossier Checklist | HanhChinh, Sale, Accountant, PM | Hồ sơ số được phát hành đúng mẫu, đúng luồng ký, đủ bộ hồ sơ và lưu trữ có audit |

## 3. Luồng tích hợp chuẩn giữa các module

### 3.1 Module A -> Module B

Sự kiện đầu vào:

- `Service Request Created` từ khách mới hoặc khách cũ
- `Duplicate Suggested / Confirmed`
- `Estimate Created`
- `Go/No-Go Approved`
- `Quotation Approved`
- `Contract Signed`
- `Fast-track Approved`

Kết quả:

- tạo hoặc tái sử dụng `Customer`
- khóa `Service Request` với pipeline/stage hợp lệ
- tạo `Estimate Version`, `Go/No-Go Review` và `Quotation Mapping`
- tạo `Project`
- sinh `Project Assignment` mặc định
- nạp `Stage Playbook`, `Task Template`, `Handoff Rule`
- nạp danh sách `kỹ thuật profile` sơ bộ nếu đã biết tổ đội thi công

### 3.2 Module A -> Module G

Sự kiện:

- `Quotation Ready To Send`
- `Contract Draft Requested`
- `Customer Summary Package Requested`

Kết quả:

- chọn `Document Template`
- merge dữ liệu từ `Service Request/Quotation/Contract`
- tạo `Document Record` nháp hoặc phát hành
- mở `Signature Envelope` nếu tài liệu cần ký
- gắn document checklist theo loại deal và bucket vòng đời

### 3.3 Module B -> Module D

Sự kiện:

- `Project Task Planned`
- `Material Requirement Confirmed`
- `Asset Requirement Confirmed`
- `Remainder Return Planned`
- `Need Procurement`

Kết quả:

- tạo reservation vật tư theo project/task
- tạo kế hoạch cấp phát tài sản thi công và vật tư bán tiêu hao
- sinh đề nghị xuất kho hoặc đề nghị mua hàng
- chặn task chưa đủ điều kiện vật tư
- mở dashboard theo dõi thiếu hụt giữa kế hoạch và tồn thực tế

### 3.4 Module D -> Module C

Sự kiện:

- `Stock Document Approved`
- `Material Issued`
- `Material Delivered To Site`
- `Asset Returned`
- `Remainder Returned`

Kết quả:

- `Giám sát` ký nhận trên hệ thống
- ghi nhận phát vật tư cho từng `kỹ thuật profile` nếu cần
- ghi nhận cấp phát tài sản, vật tư dở dang và phần dư hoàn nhập
- mở khóa checklist/task thi công tương ứng
- ghi audit trail xuất kho, phát vật tư và người chịu trách nhiệm

### 3.5 Module C -> Module F

Sự kiện:

- `Evidence Captured`
- `Site Report Submitted`
- `Incident Raised`

Kết quả:

- lưu metadata file tại hệ thống
- đẩy file vào hàng đợi đồng bộ Google Drive
- cập nhật trạng thái `PENDING_SYNC`, `SYNCED`, `FAILED`
- lưu actor số là `Giám sát` và người thá»±c hiện thá»±c tế là `kỹ thuật profile` nếu có

### 3.6 Module C -> Module E

Sự kiện:

- `Acceptance Draft Approved`
- `Project Completed`
- `Warranty/Maintenance Request Received`

Kết quả:

- tạo `Acceptance Record`
- kích hoạt thanh toán cuối
- phát hành `Warranty Card`
- mở `Warranty Case` hoặc `Maintenance Visit`
- ghi nhận chi phí hậu mãi và phát sinh tính phí nếu có

### 3.7 Module E -> Module G

Sự kiện:

- `Advance Slip Requested`
- `Payment Request Issued`
- `Acceptance Record Approved`
- `Warranty Card Issued`

Kết quả:

- sinh chứng từ số từ template
- lưu `Document Record` gắn với payment/acceptance/warranty
- mở luồng ký nếu tài liệu cần khách hàng hoặc nội bộ ký
- chuyển hồ sơ vào dossier của khách hàng/công trình

### 3.8 Module E -> Finance Ledger

Sự kiện:

- `Customer Payment Received`
- `Project Cost Approved`
- `Cash Disbursement Executed`
- `Retention Released`

Kết quả:

- cập nhật `cashbook`
- cập nhật `project P&L`
- cập nhật `collected`, `outstanding`, `retention balance`
- cho phép đối soát doanh thu/chi phí theo công trình và theo nguồn tiền

### 3.9 Module G -> Module F

Sự kiện:

- `Document Issued`
- `Signature Completed`
- `Document Archived`

Kết quả:

- lưu audit log phát hành/ký/lưu hồ sơ
- đồng bộ file phát hành và file đã ký lên Google Drive
- áp chính sách retention, visibility, token/publish nếu cần

### 3.10 Module E -> Customer Portal

Sự kiện:

- `Portal Link Generated`
- `Approved Evidence Published`
- `Payment Milestone Published`
- `Warranty Activated`
- `Maintenance Schedule Published`
- `Portal Thread Created`
- `Portal Message Sent`

Kết quả:

- khách hàng chỉ thấy dữ liệu đã được công bố
- không lộ raw link Google Drive
- toàn bộ publish/revoke có log và token policy
- thread trao đổi gắn với đúng ngữ cảnh công trình, thanh toán, nghiệm thu hoặc bảo hành

## 4. Kiến trúc lớp ứng dụng đề xuất

### 4.1 Lớp giao diện

- Web Admin/PM/Accountant cho toàn bộ nghiệp vụ back-office
- Mobile-first Web cho `Giám sát`
- `Kỹ thuật` chưa có tài khoản trực tiếp trong phase hiện tại; mọi tương tác số đi qua giao diện `Giám sát`
- Customer Portal là cổng xem dữ liệu đã publish và kênh chat có bằng chứng cho khách hàng
- Workspace `Sale` và `HanhChinh` có thể dùng chung shell web back-office ở giai đoạn đầu, nhưng permission và navigation phải tách được theo vai trò
- Các hồ sơ tài chính/chứng từ phải hỗ trợ cả giao dịch qua tài khoản công ty và tài khoản cá nhân theo mô hình kiểm soát nội bộ của doanh nghiệp

### 4.2 Lớp nghiệp vụ

- CRM service
- Estimation & pricing service
- Internal operations orchestration service
- Go/No-Go decision service
- Task service
- Field execution service
- Inventory & procurement service
- Asset & remainder recovery service
- Finance & receivable service
- Cost ledger & cashbook service
- Warranty & maintenance service
- Portal communication service
- Document automation & e-sign service
- File governance & Google Drive sync service
- Notification service
- Audit service

### 4.3 Lớp dữ liệu và tích hợp

- Database giao dịch chính
- File staging storage tạm thời
- Google Drive API qua service account/integration account
- SMS/Zalo/Email integration
- PDF render/merge engine và signature capture storage
- accounting export / reconciliation feed nếu cần
- Report export và BI feed

## 5. Quyết định kiến trúc bắt buộc cho codebase

### 5.1 Không để UI quyết định business rule cuối

Hiện trạng code đang có nhiều rule nằm ở component. V4 yêu cầu:

- UI chỉ hiển thị điều kiện
- API/service mới là nơi xác nhận điều kiện cuối

Ví dụ:

- không hoàn thành task nếu checklist/evidence chưa đủ
- không mở task thi công nếu phiếu xuất kho chưa được Giám sát xác nhận
- không phát hành bảo hành nếu nghiệm thu chưa hợp lệ
- không publish file portal nếu sync Google Drive chưa thành công
- không phát hành chứng từ số nếu template version hoặc dữ liệu merge chưa hợp lệ
- không khóa trạng thái tài chính cuối nếu còn retention/holdback chưa xử lý rõ

### 5.2 Không coi Kỹ thuật là user account trong phase hiện tại

Codebase phải phản ánh đúng mô hình:

- `Kỹ thuật` là hồ sơ nguồn lực
- `Giám sát` là actor số thao tác trên phần mềm
- mọi thao tác hiện trường cần lưu cả:
  - người thao tác trên hệ thống
  - kỹ thuật profile thực tế thực hiện công việc

Điều này ảnh hưởng trực tiếp tới:

- assignment
- evidence
- vật tư
- incident
- productivity report

### 5.3 Không dùng Google Drive làm nguồn sự thật nghiệp vụ

Google Drive chỉ là lớp lưu trữ file cloud. Hệ thống BAC Group phải sở hữu:

- metadata file
- phân quyền nghiệp vụ
- trạng thái sync
- version
- retention
- publish policy

### 5.4 Không tách warranty/maintenance khỏi tài chính

Mỗi case hậu mãi phải thấy được:

- nguồn phát sinh
- phân loại trong/ngoài bảo hành
- chi phí vật tư/nhân công/di chuyển
- khoản cần thu thêm
- trạng thái thanh toán

### 5.5 Không để hai admin shell độc lập cùng tồn tại dài hạn

`admin-v2` và `admin-app` phải được quy hoạch về một hướng duy nhất:

- hoặc hợp nhất vào app chính
- hoặc tách hẳn thành control plane và app chính chỉ consume config

Nhưng không được để hai hướng cùng sống lâu dài.

### 5.6 Không coi chữ ký điện tử là file đính kèm rời

Chữ ký điện tử trong V4 phải là một aggregate nghiệp vụ có:

- `document snapshot`
- `signature envelope`
- `participant/order`
- `event log`
- file signed PDF kết quả

Không được chỉ lưu một ảnh chữ ký rời và coi như hoàn tất hồ sơ.

### 5.7 Không đóng khung tài chính chỉ theo một mẫu thanh toán

Kiến trúc V4 phải hỗ trợ:

- nhiều template lịch thanh toán
- partial collection
- retention/giữ lại bảo hành
- chi phí thực tế theo công trình
- sổ quỹ và nguồn chi

Thay vì cố định duy nhất một pattern thanh toán cho mọi loại hợp đồng.

### 5.8 Không dùng một aggregate duy nhất cho cả dự toán và báo giá khách hàng

Kiến trúc V4 phải tách rõ:

- `Estimate Version`
- `Go/No-Go Review`
- `Quotation Version`

Nếu tiếp tục dùng chung một aggregate, hệ thống sẽ không kiểm soát được:

- giá vốn nội bộ
- biên lợi nhuận
- lý do chốt nhận việc
- logic map đầu mục nội bộ sang đầu mục thương mại

### 5.9 Không coi kho chỉ là tồn số lượng

Kiến trúc V4 phải hỗ trợ đồng thời:

- vật tư tiêu hao
- tài sản thi công có thu hồi
- vật tư bán tiêu hao có phần dư
- giá trị hao hụt và hoàn nhập phản ánh vào cost ledger

## 6. Backlog kiến trúc cần khóa trước khi dev tiếp

1. API contract cho các aggregate chính
2. State machine cho `Service Request`, `Project Task`, `Stock Document`, `Warranty Case`, `Aftersales Billing`
3. Actor model cho `Giám sát` và `kỹ thuật profile`
4. File governance model và Google Drive sync queue
5. Financial impact model cho warranty/maintenance
6. Notification rule engine
7. Document template/e-sign model
8. Cost ledger và cashbook model
9. Estimate, pricing và quotation mapping model
10. Asset, remainder và stock recovery model
11. Portal communication model
12. Report data model

## 7. Kết luận

Kiến trúc V4 chuyển hệ thống từ:

- `nhiều page demo`

sang:

- `aggregate rõ`
- `workflow rõ`
- `actor rõ`
- `file governance rõ`
- `document governance rõ`
- `finance governance rõ`
- `financial close loop rõ`
