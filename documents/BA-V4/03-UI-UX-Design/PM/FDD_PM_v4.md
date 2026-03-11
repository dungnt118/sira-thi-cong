# FDD PM v4 - Chức năng chi tiết cho Project Manager

## 1. Vai trò PM trong V4

### 1.1 Vai trò cốt lõi

PM là owner của cả:

- doanh số và conversion ở đầu vào
- điều phối nội bộ trong quá trình delivery
- giám sát chất lượng từ xa
- theo dõi rủi ro tiến độ, vật tư, tài chính và hậu mãi

### 1.2 PM không làm gì

PM không thay thế hoàn toàn các role khác:

- không confirm thu/chi thay Kế toán
- không thao tác checklist hiện trường thay Giám sát trừ tình huống há»— trợ đặc biệt
- không quản trị master system như Admin

## 2. Mục tiêu nghiệp vụ của PM

PM phải đạt được 8 kết quả:

1. Không để thất lạc cơ hội bán hàng từ lúc khách vào đến lúc chốt hợp đồng.
2. Convert đúng từ `Service Request` sang `Project`.
3. Có kế hoạch giao việc và nguồn lực rõ ràng.
4. Biết dự án nào đang nghẽn ở đâu.
5. Kiểm soát được chất lượng từ xa qua evidence và incident.
6. Nhìn được tài chính dự án ở mức cần ra quyết định.
7. Đóng được vòng nghiệm thu, portal, bảo hành.
8. Theo dõi được cả đội nội bộ và đối tác liên kết.

## 3. Information Architecture dành cho PM

### 3.1 Cụm điều hướng chính

1. `Workbench`
2. `CRM & Sales`
3. `Projects & Task`
4. `Workforce & Partners`
5. `Planning & Resources`
6. `Finance & Close-out`
7. `Reports & Activity`

### 3.2 Workbench chuẩn

PM workbench phải gom được ít nhất:

- việc cần xử lý hôm nay
- service request cần follow-up
- project có nguy cơ trễ
- task đang blocked
- evidence chờ review
- milestone thanh toán sắp đến hạn
- case bảo hành/bảo trì đang mở

## 4. Danh mục chức năng PM

| Mã | Nhóm chức năng | Mục tiêu | Ưu tiên |
|---|---|---|---|
| PM-F01 | PM Dashboard & Inbox | Điều hành ngày làm việc từ một màn trung tâm | Critical |
| PM-F02 | Customer & Service Request Hub | Quản lý CRM theo mô hình V4 | Critical |
| PM-F03 | Survey & Quotation Workspace | Chuẩn hóa khảo sát, báo giá, thương lượng | Critical |
| PM-F04 | Contract & Conversion | Convert đúng sang hợp đồng và dự án | Critical |
| PM-F05 | Project Workbench | Điều hành dự án đầu-cuối | Critical |
| PM-F06 | Task Orchestration | Quản lý WBS, task package, playbook, handoff | Critical |
| PM-F07 | Internal Workforce Management | Quản lý đội nội bộ, đội Giám sát, worker profile | High |
| PM-F08 | Partner/Outsource Management | Quản lý công ty liên kết, leader, performance | High |
| PM-F09 | Material & Labor Planning | Lập kế hoạch nguồn lực và variance | High |
| PM-F10 | Evidence, Incident & Quality Oversight | Review bằng chứng và can thiệp ngoại lệ | High |
| PM-F11 | Finance Snapshot & Close-out | Theo dõi thanh toán, nghiệm thu, portal, warranty | Critical |
| PM-F12 | Reports, Notifications & Activity | Theo dõi KPI và audit hoạt động | High |

## 5. Chi tiết chức năng

### 5.1 PM-F01 - PM Dashboard & Inbox

**Mục tiêu**

Cho PM một điểm vào duy nhất để quyết định việc gì phải làm trước.

**Thông tin phải hiển thị**

- số lượng service request theo stage
- số project theo trạng thái
- task overdue / blocked / waiting review
- evidence pending review
- milestone payment sắp đến hạn
- acceptance pending
- open warranty cases

**Hành động chính**

- mở nhanh service request hoặc project
- giao việc nhanh
- nhắc Giám sát
- nhắc Kế toán follow-up thanh toán
- mở exception center

**Rule**

- widget phải drill-down được
- PM chỉ thấy phạm vi dự án/request mình sở hữu hoặc được phân công
- cảnh báo phải ưu tiên theo severity và due date

### 5.2 PM-F02 - Customer & Service Request Hub

**Mục tiêu**

Để PM quản lý lead/khách theo mô hình `Service Request-first`.

**Màn chính**

- Customer Hub
- Customer Detail
- Service Request List
- Service Request Detail
- Pipeline Board
- Stage Activity / History

**Hành động chính**

- tạo `Service Request` trước hoặc tạo từ customer sẵn có
- dedupe theo phone/email/address
- đổi stage, ghi chú, log activity
- link nhiều request với cùng một customer

**Rule**

- Kanban theo `Service Request`, không theo `Customer`
- không được convert sang project khi chưa đủ điều kiện stage
- mỗi service request phải nhìn được survey, quotation, contract, activity liên quan

### 5.3 PM-F03 - Survey & Quotation Workspace

**Mục tiêu**

Chuẩn hóa khâu khảo sát và báo giá để conversion không bị thất lạc dữ liệu.

**Màn chính**

- Survey Workspace
- Survey Media Review
- Estimate Workbench
- Go/No-Go Review Board
- Quotation Workspace
- Quotation Compare / Version History

**Hành động chính**

- nhập dữ liệu khảo sát
- upload ảnh/video/file khảo sát
- ghi chỉ số đo
- tạo nhiều `Estimate Version`
- tính chi phí vật tư, nhân công, vận chuyển, giáo mác/đu dây
- review cảnh báo `Go/No-Go`
- tạo nhiều version báo giá
- gửi lại báo giá và ghi reason của từng lần chỉnh

**Rule**

- tất cả media khảo sát phải vào file governance chung
- `Estimate Version` và `Quotation Version` phải tách aggregate
- không được phát hành báo giá nếu chưa có `Estimate Version` hợp lệ và kết luận `Go/No-Go`
- quotation phải có versioning
- chỉ một version được đánh dấu `WON`

### 5.4 PM-F04 - Contract & Conversion

**Mục tiêu**

Đóng vùng chuyển đổi từ deal sang execution.

**Màn chính**

- Contract Create/Edit
- Contract Detail
- Convert to Project Wizard
- Conversion Validation Summary

**Hành động chính**

- tạo contract từ quotation thắng
- cấu hình milestone thanh toán
- tạo project từ service request/contract
- chọn template task/playbook
- assign PM/Giám sát ban đầu

**Rule**

- convert wizard phải kiểm tra đủ dữ liệu đầu vào
- nếu fast-track phải có lý do và audit
- project mới sinh phải có `task nền`, `worker plan sơ bộ`, `payment plan`

### 5.5 PM-F05 - Project Workbench

**Mục tiêu**

Cho PM một "màn điều hành dự án" thay vì chỉ danh sách dự án.

**Màn chính**

- Project List
- Project Workbench Overview
- Project Timeline
- Project Task Board
- Exception Center

**Thông tin phải thấy**

- tổng quan tiến độ
- milestone sắp tới
- task blocked
- vật tư thiếu
- evidence pending
- incident mở
- acceptance readiness

### 5.6 PM-F06 - Task Orchestration

**Mục tiêu**

Biến `Module B - Vận hành nội bộ` thành năng lực điều hành thực sự cho PM.

**Màn chính**

- Task Board theo project
- Task Package Detail
- Assignment & Dependency Drawer
- Handoff Log

**Rule**

- task không complete nếu thiếu checklist/evidence/material condition
- mọi handoff PM -> Giám sát -> Accountant phải có log
- task package có thể do đội nội bộ, đối tác liên kết hoặc hybrid thực hiện

### 5.7 PM-F07 - Internal Workforce Management

**Mục tiêu**

Để PM quản lý được đội nội bộ, thay vì chỉ giao tên người phụ trách một cách thủ công.

**Màn chính**

- Internal Workforce List
- Capacity / Availability View
- Skill Matrix
- Assignment Modal

**Rule**

- một worker profile có thể tham gia nhiều task nhưng không vượt ngưỡng phân bổ cho phép
- assignment phải lưu người điều phối và thời gian hiệu lực
- worker profile không cần account riêng trong phase hiện tại

### 5.8 PM-F08 - Partner/Outsource Management

**Mục tiêu**

Đưa lại phần nhà thầu liên kết vào scope PM của V4.

**Màn chính**

- Partner Company List
- Partner Company Detail
- Partner Compliance Documents
- Partner Leader Directory
- Partner Assignment Wizard
- Partner Performance Dashboard

**Rule**

- PM được phép đề xuất và phân công partner vào project/package
- company bị `BLOCKED` không được assign mới
- partner assignment phải chỉ rõ phạm vi việc, leader phụ trách, mốc bàn giao

### 5.9 PM-F09 - Material & Labor Planning

**Mục tiêu**

Cho PM khả năng lập kế hoạch trước, theo dõi sai lệch sau.

**Màn chính**

- Material Planning
- Material Variance
- Labor Planning
- Labor Cost / Allocation View
- Asset & Consumable Plan
- Transport Cost Planner
- Remainder Recovery Review

**Rule**

- kế hoạch vật tư phải gắn project/task package
- phải phân biệt `tài sản thi công`, `vật tư tiêu hao`, `vật tư bán tiêu hao`
- PM phải nhìn được chênh lệch `planned -> issued -> used -> returned -> lost`
- PM xem được planned/estimated cost, nhưng không override ledger của Kế toán
- labor planning phải phân biệt internal và outsource

### 5.10 PM-F10 - Evidence, Incident & Quality Oversight

**Mục tiêu**

Giúp PM giám sát từ xa mà không phải thay thế thao tác hiện trường.

**Màn chính**

- Evidence Queue
- Photo/Video Approval
- Incident Queue
- Remote Project Monitoring

**Rule**

- evidence phải hiển thị được:
  - task/checklist liên quan
  - Giám sát là actor số
  - worker profile thực tế nếu có
- reject phải có reason

### 5.11 PM-F11 - Finance Snapshot & Close-out

**Mục tiêu**

Cho PM theo dõi được tác động tài chính và đóng vòng dự án.

**Màn chính**

- Project Finance Snapshot
- Milestone Follow-up
- Acceptance Readiness
- Portal Publish Center
- Portal Thread Review
- Warranty/Maintenance Oversight

**PM không được làm**

- confirm payment transaction
- chỉnh chi tiết ledger nội bộ của Kế toán
- xóa evidence/file đã chốt tài chính nếu không có quyền đặc biệt

### 5.12 PM-F12 - Reports, Notifications & Activity

**Mục tiêu**

Cho PM nhìn được hệ thống theo góc vận hành và ra quyết định.

**Báo cáo tối thiểu**

- pipeline conversion
- project health
- task overdue
- evidence reject rate
- resource utilization
- partner performance
- estimated margin by project
- open aftersales cases

## 6. Ranh giới quyền của PM

| Hạng mục | PM | Giám sát | Accountant | Admin |
|---|---|---|---|---|
| Tạo Service Request | Có | Không | Không | Có |
| Convert sang Project | Có | Không | Không | Có |
| Tạo/điều chỉnh task package | Có | Một phần | Không | Có |
| Giao Giám sát / worker profile | Có | Một phần | Không | Có |
| Giao partner/outsource vào project | Có | Không | Một phần | Có |
| Approve/Reject evidence | Có | Một phần | Không | Có |
| Xem finance snapshot | Có | Không | Có | Có |
| Confirm payment | Không | Không | Có | Có |
| Publish portal | Có | Không | Một phần | Có |
| Xem warranty case | Có | Có | Có | Có |

## 7. Business rules bắt buộc cho PM

1. PM phải thấy riêng `Service Request` và `Project`; không gộp một bảng mơ hồ.
2. PM phải quản lý được cả `đội nội bộ` và `partner/outsource` ở mức tài liệu V4.
3. Mọi assignment hiện trường đều Ä'i qua `Giám sát` và `worker profile`.
4. PM chỉ xem tài chính ở mức điều hành, không can thiệp ledger kế toán.
5. PM chỉ được publish portal khi:
   - dữ liệu đã approved
   - file đã sync thành công
   - token policy hợp lệ
6. PM phải thấy cả `open aftersales cases` vì hậu mãi ảnh hưởng trực tiếp tới lợi nhuận thực.
7. PM phải nhìn được chênh lệch giữa `Estimate Version` và `Quotation Version` trước khi chốt nhận việc.
8. PM phải review được `remainder lot`, thu hồi tài sản và vật tư dở dang vì đây là dữ liệu ảnh hưởng trực tiếp cost thực tế.
9. Mọi trao đổi portal có ảnh hưởng tới tiến độ, thanh toán, bảo hành phải được PM xem như dữ liệu vận hành chính thức.

## 8. Kết luận

PM của V4 phải được hiểu là `role điều hành trung tâm`, không phải tập hợp rời rạc vài màn CRM cộng vài màn project. Tài liệu này là baseline chức năng để mọi flow, wireframe, backlog dev và UAT của PM bám theo.
