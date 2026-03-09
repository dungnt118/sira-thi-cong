# BRD v4 - Hệ thống vận hành BAC Group

## 1. Tầm nhìn

Xây dựng một nền tảng vận hành thống nhất cho BAC Group, quản lý trọn vòng đời:

`Khách hàng -> Yêu cầu dịch vụ -> Khảo sát -> Báo giá -> Hợp đồng -> Dự án -> Task/Checklist -> Kho -> Thanh toán -> Nghiệm thu -> Bảo hành/Bảo dưỡng -> Báo cáo`

Mục tiêu của BA-V4 không còn là “trình diễn màn hình”, mà là đủ cơ sở để phát triển một hệ thống chạy thật.

## 2. Bài toán kinh doanh cần giải quyết

### 2.1 Bài toán hiện tại

- Dữ liệu sale, khảo sát, dự án và tài chính chưa liên tục thành một chuỗi.
- Kanban hành trình khách hàng mới dừng ở cột trạng thái, chưa gắn được nhiệm vụ thực thi.
- Checklist thi công đã có ý tưởng nhưng chưa liên thông với task, kho, nghiệm thu và bảo hành.
- PM phải dùng nhiều màn hình rời rạc, thiếu một trung tâm điều hành.
- Chưa có ERD chuẩn để kết nối `Khách hàng`, `Service Request`, `Project`, `Pipeline`, `Task`.

### 2.2 Kết quả mong muốn

- Có một CRM đúng chuẩn theo `Service Request/Deal`.
- Có `Task module` xuyên vai trò cho `PM`, `Supervisor`, `Worker`.
- Có `Dynamic Pipeline` gắn được playbook, checklist, người phụ trách, SLA.
- Có luồng giao dịch thật cho kho, thanh toán, nghiệm thu, bảo hành.
- Có báo cáo quản trị dựa trên dữ liệu thống nhất.

## 3. Nguyên tắc thiết kế của V4

1. `Một nguồn sự thật` cho mô hình dữ liệu.
2. `Tách entity đúng vai`: Customer khác Service Request, Service Request khác Project.
3. `Task-first orchestration`: mỗi giai đoạn phải sinh được nhiệm vụ cụ thể.
4. `Role-specific but tightly linked`: tách vai trò quản lý, nhưng dữ liệu liên kết chặt.
5. `Workflow before screen`: chỉ build màn hình sau khi chốt state machine và business rule.

## 4. Vai trò mục tiêu

| Vai trò | Mục tiêu | Ghi chú |
|---|---|---|
| Admin | Quản trị hệ thống, cấu hình pipeline, template, master data, audit, báo cáo | Có thể bao gồm Ban giám đốc |
| PM | Sở hữu doanh số và vận hành đầu-cuối của service request/dự án | Vai trò trung tâm |
| Supervisor | Điều phối hiện trường, nghiệm thu, bảo dưỡng, báo cáo hiện trường | Tách rõ với Worker |
| Worker | Thực thi nhiệm vụ, ký nhận vật tư, checklist, upload bằng chứng, báo sự cố | Mobile-first |
| Accountant | Kho, thanh toán, đối soát, bảo hành, báo cáo tài chính | Liên thông PM nhưng quyền riêng |
| Customer Portal | Vai trò thụ động, chỉ xem thông tin được công bố | Không phải tài khoản nội bộ |

Vai trò mở rộng giai đoạn sau:

- Outsource Leader
- CSKH/Bảo hành
- Mua hàng/NCC

## 5. Luồng nghiệp vụ chuẩn của hệ thống

### 5.1 Luồng CRM đến Project

1. Tạo `Customer`
2. Tạo `Service Request`
3. Gán `Pipeline` và `Stage`
4. Thực hiện khảo sát, đo đạc, hồ sơ hiện trạng
5. Lập nhiều phiên bản báo giá nếu cần
6. Duyệt báo giá thắng
7. Tạo hợp đồng và kế hoạch thanh toán
8. Convert sang `Project`
9. Tự động sinh playbook nhiệm vụ và checklist nền

### 5.2 Luồng Project đến Close

1. PM tạo `Project WBS / Task packages`
2. Giao Supervisor/Worker
3. Sinh checklist thực thi và yêu cầu bằng chứng
4. Kho xuất vật tư theo reservation/phiếu
5. Worker ký nhận -> mở khóa task liên quan
6. Worker thực hiện nhiệm vụ, upload bằng chứng
7. Supervisor/PM review
8. Tạo biên bản nghiệm thu
9. Accountant xác nhận công nợ / thanh toán
10. Sinh bảo hành và lịch bảo dưỡng

## 6. Phạm vi chức năng mục tiêu

### 6.1 Module A - CRM & Sales Orchestration

| ID | Chức năng |
|---|---|
| CRM-01 | Quản lý Customer master |
| CRM-02 | Quản lý Service Request/Deal |
| CRM-03 | Dynamic Pipeline và stage mapping |
| CRM-04 | Khảo sát chuẩn hóa: ảnh, đo độ ẩm, form hiện trạng |
| CRM-05 | Báo giá nhiều phiên bản, duyệt thắng/thua |
| CRM-06 | Convert báo giá thắng thành hợp đồng và dự án |
| CRM-07 | Fast-track/override có phê duyệt |

### 6.2 Module B - Delivery Planning & Task Management

| ID | Chức năng |
|---|---|
| OPS-01 | Tạo Project từ Service Request/Hợp đồng |
| OPS-02 | Tạo WBS/Task board theo dự án |
| OPS-03 | Playbook nhiệm vụ theo Pipeline Stage |
| OPS-04 | Giao việc cho PM/Supervisor/Worker |
| OPS-05 | SLA, reminder, escalation |
| OPS-06 | Quản lý phụ thuộc giữa nhiệm vụ và điều kiện mở khóa |
| OPS-07 | Change order / thay đổi phạm vi công việc |

### 6.3 Module C - Field Execution

| ID | Chức năng |
|---|---|
| EXE-01 | Template checklist thi công |
| EXE-02 | Checklist theo task/dự án/khu vực |
| EXE-03 | Upload ảnh/video với timestamp/GPS |
| EXE-04 | Review/approve/reject bằng chứng |
| EXE-05 | Báo cáo sự cố và xử lý sự cố |
| EXE-06 | Biên bản nghiệm thu |
| EXE-07 | Báo cáo tổng hợp công trình |
| EXE-08 | Báo cáo bảo dưỡng định kỳ |

### 6.4 Module D - Inventory & Procurement

| ID | Chức năng |
|---|---|
| INV-01 | Danh mục vật tư và master data |
| INV-02 | Định mức vật tư theo loại công trình |
| INV-03 | Reservation vật tư theo dự án/task |
| INV-04 | Phiếu xuất kho, phiếu nhập kho, hoàn kho |
| INV-05 | Worker ký nhận vật tư |
| INV-06 | Cảnh báo tồn kho thấp |
| INV-07 | Đề nghị mua hàng / tái bổ sung kho |
| INV-08 | Lịch sử và đối soát kho |

### 6.5 Module E - Finance, Acceptance, Warranty

| ID | Chức năng |
|---|---|
| FIN-01 | Kế hoạch thanh toán mặc định và tùy chỉnh |
| FIN-02 | Công nợ phải thu / phải trả |
| FIN-03 | Xác nhận giao dịch thu/chi |
| FIN-04 | P&L theo dự án |
| FIN-05 | Biên bản nghiệm thu gắn với thanh toán cuối |
| FIN-06 | Phiếu bảo hành điện tử |
| FIN-07 | Lịch bảo dưỡng / nhắc bảo hành |
| FIN-08 | Customer Portal chỉ đọc |

### 6.6 Module F - Admin & Governance

| ID | Chức năng |
|---|---|
| ADM-01 | User, role, permission |
| ADM-02 | Pipeline config, stage playbook, checklist template |
| ADM-03 | Notification templates và preference |
| ADM-04 | Audit log toàn hệ thống |
| ADM-05 | Báo cáo quản trị và KPI |
| ADM-06 | Cấu hình tích hợp lưu trữ, SMS/Zalo, email |
| ADM-07 | Danh mục chuẩn: loại công trình, mức ưu tiên, nguyên nhân từ chối, mẫu biên bản |

## 7. Business rule cốt lõi

### 7.1 Rule về CRM

- `Customer` có thể có nhiều `Service Request`.
- Kanban chỉ theo dõi `Service Request`, không theo dõi trực tiếp `Customer`.
- Chỉ `Service Request` ở trạng thái thắng mới được convert sang `Contract/Project`, trừ khi có `Fast-track override`.
- Mỗi `Service Request` có thể có nhiều phiên bản báo giá, nhưng chỉ một phiên bản ở trạng thái thắng.

### 7.2 Rule về Dynamic Pipeline

- Mỗi `Pipeline Stage` phải cấu hình được:
  - nhiệm vụ con mặc định
  - vai trò phụ trách
  - checklist/đầu việc bắt buộc
  - SLA và cảnh báo
  - điều kiện hoàn thành stage
- Không được xóa cứng stage đang có dữ liệu.
- Khi chuyển pipeline phải map stage cũ sang stage mới, lưu lịch sử.

### 7.3 Rule về Task module

- Task có thể sinh từ:
  - playbook của stage CRM
  - template dự án
  - action phát sinh thủ công
- Mỗi task phải có:
  - owner
  - reviewer
  - due date
  - priority
  - dependency
  - trạng thái
- Task không hoàn thành nếu checklist bắt buộc chưa xong hoặc điều kiện kho/duyệt chưa thỏa.

### 7.4 Rule về thi công và bằng chứng

- Evidence bắt buộc gắn với task/checklist item.
- Timestamp phải là server-side hoặc trusted capture.
- Không hoàn thành bước nếu chưa đạt số lượng bằng chứng tối thiểu.
- Vật tư chưa ký nhận thì task thi công liên quan bị khóa.

### 7.5 Rule về tài chính và bảo hành

- Mẫu thanh toán mặc định là `50-40-10`, nhưng cho phép cấu hình theo tenant hoặc theo hợp đồng.
- Nghiệm thu là điểm kích hoạt:
  - thanh toán cuối
  - phát hành bảo hành
  - mở lịch nhắc bảo dưỡng
- Portal khách hàng chỉ hiển thị:
  - tiến độ
  - bằng chứng đã duyệt
  - các mốc thanh toán công bố
  - thông tin bảo hành/bảo dưỡng

## 8. Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
|---|---|
| Bảo mật | RBAC rõ, audit trail, token portal có hạn dùng |
| Khả dụng | Mobile-first cho Worker/Supervisor |
| Hiệu năng | API nghiệp vụ chính < 500ms, upload có queue/retry |
| Tin cậy dữ liệu | Transaction cho kho, thanh toán, nghiệm thu |
| Báo cáo | Có dữ liệu đủ để đối soát theo tháng/quý |
| Mở rộng | Hỗ trợ thêm outsource/team ngoài sau khi core nội bộ ổn |

## 9. Ngoài phạm vi giai đoạn gần

- ERP tổng thể
- Payroll/HR
- AI xử lý hình ảnh
- Mobile app native riêng
- PO nâng cao đa cấp phê duyệt

## 10. Kết quả đầu ra cần đạt của V4

BA-V4 được xem là đạt khi:

1. Có ERD chuẩn phản ánh đầy đủ workflow mới.
2. Có backlog gap rõ để biết build gì trước, defer gì sau.
3. Có plan triển khai đủ để chuyển từ prototype sang hệ thống vận hành thật.
4. Có folder theo vai trò để UI/UX, tài liệu hướng dẫn và UAT bám đúng người dùng.

