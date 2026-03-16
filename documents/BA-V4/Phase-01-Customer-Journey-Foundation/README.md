# Phase 1 - Customer Journey Foundation

## 1. Mục tiêu phase

Phase 1 là phase dựng `trục vận hành nhìn thấy được` cho người dùng cuối.

Đầu ra quan trọng nhất:

- PM có màn `CustomerJourney`
- từ `1 yêu cầu` nhìn thấy được `360 độ thông tin`
- Sale, Giám sát và Portal khách hàng cùng bám vào chung một hành trình

## 2. Vai trò nằm trong phase

- `PM`
- `Sale`
- `Giám sát`
- `Customer Portal`

## 3. Kết quả bắt buộc phải đạt

### 3.1 Kết quả về PM

- Có màn `CustomerJourney` thay thế tư duy Kanban đơn giản.
- Từ một `Service Request` xem được:
  - yêu cầu
  - khảo sát
  - dự toán
  - nhân công
  - công trình/dự án
  - thanh toán
  - log hoạt động
  - phát sinh
  - vật tư
  - tài liệu
  - dữ liệu publish ra portal

### 3.2 Kết quả về Sale

- Sale nhìn đúng ngữ cảnh hành trình của khách.
- Không còn bị tách riêng khỏi PM theo kiểu chỉ có list lead hoặc báo giá.

### 3.3 Kết quả về Giám sát

- Giám sát tạo được dữ liệu khảo sát/hiện trường đi ngược vào journey.
- Journey phản ánh được dữ liệu thật từ hiện trường chứ không chỉ là trạng thái giấy tờ.

### 3.4 Kết quả về Portal khách hàng

- Portal hiển thị đúng phần đã publish từ journey.
- Có chat theo ngữ cảnh để làm bằng chứng giao tiếp.

## 4. Phạm vi chức năng chi tiết

### 4.1 PM - CustomerJourney Workspace

#### 4.1.1 Màn hình lõi

- `Journey List`
- `Journey Board`
- `CustomerJourney Detail`
- `Journey Step Config`
- `Journey Template Library`

#### 4.1.2 Cấu trúc thông tin của `CustomerJourney Detail`

Màn chi tiết phải có tối thiểu các khối:

- `Journey Header`
  - mã yêu cầu
  - khách hàng
  - nguồn lead
  - stage hiện tại
  - người phụ trách
  - mức ưu tiên
  - tình trạng chốt làm
- `Journey Timeline`
  - toàn bộ step
  - trạng thái từng step
  - cảnh báo quá hạn
  - bước bị chặn
- `360 Workspace Tabs`
  - Yêu cầu
  - Khảo sát
  - Dự toán
  - Báo giá/Hợp đồng
  - Nhân công/Nguồn lực
  - Dự án
  - Vật tư/Tài sản
  - Thanh toán
  - Log hoạt động
  - Phát sinh/Sự cố
  - Tài liệu/Hồ sơ số
  - Portal/Chat

#### 4.1.3 Khả năng 360 độ bắt buộc

Từ một journey, PM phải bấm vào và thấy được:

- dữ liệu gốc của `Service Request`
- snapshot khảo sát gần nhất
- estimate summary
- tình trạng go/no-go
- quote/contract status
- người tham gia nội bộ
- giám sát phụ trách
- dự án liên quan nếu đã convert
- milestone thanh toán
- vật tư chính và thiếu hụt chính
- log phát sinh và incident
- file và tài liệu liên quan
- các thread portal đã mở

#### 4.1.4 Responsive desktop + mobile

Checklist bắt buộc:

- [ ] Desktop có layout điều hành đầy đủ
- [ ] Tablet không vỡ cấu trúc timeline và tab
- [ ] Mobile có chế độ card/accordion thay cho grid dày
- [ ] Step timeline và hành động chính thao tác được trên mobile
- [ ] Các drawer 360 có thể mở nhanh trên mobile

#### 4.1.5 Bản đồ liên kết 360 độ tối thiểu

Trong `CustomerJourney Detail`, mỗi khối dữ liệu phải truy ngược hoặc truy xuôi được tới aggregate liên quan:

- `Yêu cầu` -> `Service Request`, `Customer`, `Interaction Log`
- `Khảo sát` -> `Survey Snapshot`, `Survey Media`, `Giám sát`
- `Dự toán` -> `Estimate Version`, `Price Book`, `Go/No-Go`
- `Nhân công` -> `Workforce Plan`, `Kỹ thuật Profile`, `Giám sát phụ trách`
- `Công trình` -> `Project`, `Task Package`, `Incident`
- `Thanh toán` -> `Milestone`, `Transaction Status`, `Payment Thread`
- `Vật tư` -> `Material Summary`, `Need Procurement`, `Asset Need`
- `Log` -> `Activity Timeline`, `Audit Summary`
- `Phát sinh` -> `Incident`, `Change Request`, `Portal Thread`
- `Portal` -> `Published Timeline`, `Chat Evidence`, `Customer View`

### 4.2 PM - Journey Configurable Engine

#### 4.2.1 Mục tiêu

`Customer Journey` không chỉ là cấu hình một cột trạng thái. Hệ thống phải cấu hình được từng step như một `đơn vị vận hành`.

#### 4.2.2 Dữ liệu cấu hình của mỗi step

Mỗi `Journey Step` phải có tối thiểu:

- mã step
- tên step
- mô tả mục tiêu
- thứ tự hiển thị
- actor tham gia
- owner chính
- checklist liên quan
- quy trình nội bộ liên quan
- dữ liệu đầu vào bắt buộc
- điều kiện hoàn tất
- rule mở step kế tiếp
- SLA
- cảnh báo escalation
- cờ publish được hay không cho portal

#### 4.2.3 Template và reset mặc định

Checklist bắt buộc:

- [ ] Có `Journey Template Library`
- [ ] Có template mặc định theo loại dịch vụ
- [ ] Có action `Reset về mặc định`
- [ ] Có version template
- [ ] Có log khi chỉnh template hoặc step

#### 4.2.4 Quy trình nội bộ gắn với step

Mỗi step phải có thể gắn:

- một hoặc nhiều quy trình nội bộ
- checklist chuẩn
- tài liệu chuẩn cần sinh
- rule bàn giao giữa vai trò

Ví dụ:

- Step `Khảo sát` gắn:
  - quy trình chuẩn bị lịch
  - checklist khảo sát
  - biên bản khảo sát
  - báo cáo hiện trạng
- Step `Báo giá` gắn:
  - kiểm tra estimate
  - go/no-go
  - quotation mapping
  - phát hành báo giá

#### 4.2.5 Thư viện step mặc định cho template chuẩn

Template mặc định của `Customer Journey` phải có tối thiểu các step sau:

| Step | Actor chính | Việc phải làm | Checklist tối thiểu | Quy trình nội bộ gắn kèm |
|---|---|---|---|---|
| Tiếp nhận yêu cầu | Sale | tạo `Service Request`, kiểm tra trùng, phân loại nguồn | đủ tên/sđt/nhu cầu cơ bản | tiếp nhận lead và SLA |
| Tư vấn ban đầu | Sale | gọi tư vấn, đánh giá sơ bộ, hẹn khảo sát | có consultation log, có kết quả xử lý | kịch bản gọi điện |
| Lên lịch khảo sát | Sale, Giám sát | chốt lịch, người đi, chuẩn bị hồ sơ | có lịch hẹn, có người phụ trách | quy trình điều phối khảo sát |
| Khảo sát hiện trường | Giám sát | khảo sát, nhập hiện trạng, chụp ảnh/video, ký biên bản | đủ media, đủ chỉ số, đủ chữ ký | quy trình khảo sát công trình |
| Báo cáo hiện trạng & giải pháp | Giám sát, Sale | tổng hợp nguyên nhân, giải pháp, process làm việc | đủ mô tả hiện trạng và giải pháp | quy trình báo cáo tổng hợp |
| Dự toán nội bộ | PM, Kế toán | bóc tách estimate, tính chi phí và biên lợi nhuận | đủ vật tư, nhân công, vận chuyển | quy trình bóc tách dự toán |
| Chốt nhận việc | PM, Kế toán, Sale | review go/no-go, điều kiện chốt làm | đủ warning review và quyết định | quy trình quyết định nhận việc |
| Báo giá khách hàng | Sale | tạo quote từ mapping thương mại | đúng version, đúng template | quy trình phát hành báo giá |
| Hợp đồng & tạm ứng | Sale, Hành Chính, Kế toán | hợp đồng, ký, phát hành chứng từ, theo dõi cọc | đủ trạng thái ký và chứng từ | quy trình hợp đồng và tạm ứng |
| Khởi tạo dự án | PM | convert sang project và seed task | đủ owner, playbook, handoff | quy trình bàn giao sang vận hành |
| Theo dõi triển khai | PM, Giám sát | theo dõi tiến độ, phát sinh, vật tư, log | có evidence/log tối thiểu | quy trình vận hành nội bộ |
| Nghiệm thu & thanh toán | PM, Sale, Kế toán | kiểm tra close-out, nghiệm thu, theo dõi thanh toán | đủ acceptance readiness | quy trình nghiệm thu và thanh toán |
| Hậu mãi | Sale, Giám sát, Portal | bảo hành/bảo trì, chăm sóc khách | có thread/case hậu mãi | quy trình hậu mãi |

Step library này là mặc định để:

- tạo template sẵn
- reset về chuẩn
- dùng làm baseline khi khách hàng nội bộ muốn chỉnh lại journey

### 4.3 Sale trong phase 1

#### 4.3.1 Chức năng bắt buộc

- intake lead/service request
- SLA queue
- consultation log
- survey coordination
- summary package status
- theo dõi estimate/go-no-go status
- quotation status theo journey
- contract follow-up ở mức trạng thái
- payment follow-up ở mức milestone
- thread portal liên quan khách hàng

#### 4.3.2 Điều cần nhìn thấy trong journey

Sale phải thấy:

- khách đang ở step nào
- ai đang giữ bóng
- đang chờ khách hay chờ nội bộ
- estimate đã sẵn sàng chưa
- go/no-go đang chặn ở đâu
- quote nào đang là bản gửi khách
- mốc thanh toán nào đã công bố
- thread portal nào đang mở

### 4.4 Giám sát trong phase 1

#### 4.4.1 Chức năng bắt buộc

- nhận lịch khảo sát
- tạo khảo sát hiện trường
- nhập chỉ số/ảnh/video
- tạo báo cáo hiện trạng
- ghi nhận rủi ro ảnh hưởng nhận việc
- cập nhật nhật ký hiện trường tối thiểu
- mở incident/phát sinh tối thiểu

#### 4.4.2 Dữ liệu Giám sát phải đẩy được vào journey

- snapshot khảo sát
- media khảo sát
- ghi chú kỹ thuật
- nhu cầu nhân lực sơ bộ
- nhu cầu vật tư sơ bộ
- cảnh báo điều kiện thi công
- phát sinh mới từ hiện trường

### 4.5 Customer Portal trong phase 1

#### 4.5.1 Chức năng bắt buộc

- truy cập project/journey publish view
- xem timeline đã publish
- xem ảnh/video/file đã duyệt
- xem milestone thanh toán đã publish
- chat với BAC theo ngữ cảnh

#### 4.5.2 Ngữ cảnh chat bắt buộc

- `GENERAL`
- `SURVEY`
- `PROGRESS`
- `PAYMENT`
- `ACCEPTANCE`
- `WARRANTY_REQUEST`

#### 4.5.3 Rule publish

Checklist bắt buộc:

- [ ] Chỉ publish dữ liệu được duyệt
- [ ] Không lộ raw link cloud
- [ ] Mỗi thread gắn đúng journey/project context
- [ ] Có read receipt tối thiểu

## 5. Deliverable UI/UX của phase 1

- wireframe hoặc prototype `Journey List`
- wireframe hoặc prototype `CustomerJourney Detail`
- wireframe `Journey Step Config`
- wireframe `Journey Template Library`
- wireframe `Sale Journey View`
- wireframe `Giám sát Survey to Journey`
- wireframe `Portal Timeline + Chat`

## 6. Ngoài phạm vi phase 1

- kế toán sâu: cashbook, cost ledger đầy đủ
- kho đầy đủ: asset return, remainder recovery hoàn chỉnh
- approval matrix tài chính
- warranty/maintenance lifecycle đầy đủ
- document automation sâu

## 7. Tiêu chí hoàn tất phase

Checklist phase:

- [ ] PM xem được journey 360 từ một yêu cầu
- [ ] Journey configurable theo template và reset mặc định
- [ ] Responsive dùng được trên desktop và mobile
- [ ] Sale nhìn được đúng context hành trình
- [ ] Giám sát đẩy được dữ liệu khảo sát vào journey
- [ ] Portal hiển thị timeline publish và chat cơ bản
- [ ] Có log hành động tối thiểu theo journey

## 8. Gợi ý thứ tự triển khai trong phase

1. Data model của journey, step, template, context tabs
2. Journey detail 360 cho PM
3. Journey config và template library
4. Sale view bám journey
5. Giám sát survey feed vào journey
6. Portal publish view và chat cơ bản

## 9. Bộ tài liệu triển khai chi tiết của phase 1

- [Phase1_Epic_Map.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_Epic_Map.md)
- [Phase1_CrossCutting_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_CrossCutting_Backlog.md)
- [Phase1_PM_CustomerJourney_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_PM_CustomerJourney_Backlog.md)
- [Phase1_Sale_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_Sale_Backlog.md)
- [Phase1_GiamSat_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_GiamSat_Backlog.md)
- [Phase1_CustomerPortal_Backlog.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_CustomerPortal_Backlog.md)
- [Phase1_Developer_Execution_Spec.md](E:/SIRA-PROJECTS/BAC-GROUP/documents/BA-V4/Phase-01-Customer-Journey-Foundation/Phase1_Developer_Execution_Spec.md)
