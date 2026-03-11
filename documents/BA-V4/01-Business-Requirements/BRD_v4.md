# BRD v4 - Hệ thống vận hành BAC Group

## 1. Tầm nhìn

Xây dựng một nền tảng vận hành thống nhất cho BAC Group, quản lý trọn vòng đời:

`Khách hàng -> Yêu cầu dịch vụ -> Khảo sát -> Báo giá -> Hợp đồng -> Dự án -> Task/Checklist -> Kho -> Thanh toán -> Nghiệm thu -> Bảo hành/Bảo dưỡng -> Báo cáo`

Mục tiêu của BA-V4 không còn là “trình diễn màn hình”, mà là đủ cơ sở để phát triển một hệ thống chạy thật.

## 2. Bài toán kinh doanh cần giải quyết

### 2.1 Bài toán hiện tại

- Dữ liệu sale, khảo sát, dự án và tài chính chưa liên tục thành một chuỗi.
- Hồ sơ thực tế đang nằm rải rác trong folder khách hàng, file Word/Excel và sổ theo dõi thủ công.
- Kanban hành trình khách hàng mới dừng ở cột trạng thái, chưa gắn được nhiệm vụ thực thi.
- Checklist thi công đã có ý tưởng nhưng chưa liên thông với task, kho, nghiệm thu và bảo hành.
- PM phải dùng nhiều màn hình rời rạc, thiếu một trung tâm điều hành.
- Chưa có ERD chuẩn để kết nối `Khách hàng`, `Service Request`, `Project`, `Pipeline`, `Task`.

### 2.2 Kết quả mong muốn

- Có một CRM đúng chuẩn theo `Service Request/Deal`.
- Có workspace riêng cho `Sale` và `Hành Chính`, không gộp mờ vào `PM` hay `Admin`.
- Có `Task module` xuyên vai trò cho `PM`, `Supervisor` và `Worker profile`.
- Có `Dynamic Pipeline` gắn được playbook, checklist, người phụ trách, SLA.
- Có luồng giao dịch thật cho kho, thanh toán, nghiệm thu, bảo hành.
- Có capability `Quản lý mẫu tài liệu` và `Chữ ký điện tử` để sinh hồ sơ số, phát hành chứng từ và lưu vết ký.
- Có mô hình `dossier khách hàng/công trình` chuẩn hóa theo vòng đời triển khai, hoàn thiện, bảo trì và không làm.
- Có theo dõi đầy đủ `doanh thu - chi phí - công nợ - giữ lại bảo hành - lợi nhuận thực`.
- Có báo cáo quản trị dựa trên dữ liệu thống nhất.

## 3. Nguyên tắc thiết kế của V4

1. `Một nguồn sự thật` cho mô hình dữ liệu.
2. `Tách entity đúng vai`: Customer khác Service Request, Service Request khác Project.
3. `Task-first orchestration`: mỗi giai đoạn phải sinh được nhiệm vụ cụ thể.
4. `Role-specific but tightly linked`: tách vai trò quản lý, nhưng dữ liệu liên kết chặt.
5. `Workflow before screen`: chỉ build màn hình sau khi chốt state machine và business rule.
6. `Source-driven documentation`: rule được khóa dựa trên mẫu hồ sơ, sổ theo dõi và chứng từ thực tế, không chỉ dựa trên wireframe.

## 4. Vai trò mục tiêu

| Vai trò | Mục tiêu | Ghi chú |
|---|---|---|
| Admin | Quản trị hệ thống, cấu hình quyền, tích hợp, audit, master data | Không đồng nhất với Hành Chính nghiệp vụ |
| Sale | Tiếp nhận lead, tư vấn, theo báo giá, hợp đồng, tạm ứng, thanh toán và chăm sóc sau công trình | Owner quan hệ khách hàng trước và sau dự án |
| HanhChinh | Phát hành/giao nhận hồ sơ, mail mẫu, lưu trữ dossier, điều phối ký | Back-office hồ sơ và chứng từ |
| PM | Điều phối nội bộ, convert dự án, quản lý delivery, phối hợp phát sinh với khách hàng | Nhận baton mạnh từ sau bước chốt |
| Supervisor | Điều phối hiện trường, nghiệm thu, bảo dưỡng, báo cáo hiện trường | Là actor số chính cho tác nghiệp hiện trường ở giai đoạn hiện tại |
| Worker | Là lực lượng thi công thực địa, được quản lý qua hồ sơ nhân sự/cộng tác viên | Ở giai đoạn hiện tại chưa có tài khoản đăng nhập riêng |
| Accountant | Kho, thanh toán, đối soát, bảo hành, báo cáo tài chính | Liên thông PM nhưng quyền riêng |
| Customer Portal | Vai trò thụ động, chỉ xem thông tin được công bố | Không phải tài khoản nội bộ |

Vai trò mở rộng giai đoạn sau:

- Outsource Leader
- CSKH/Bảo hành
- Mua hàng/NCC

## 5. Luồng nghiệp vụ chuẩn của hệ thống

### 5.1 Luồng CRM đến Project

1. `Sale` tiếp nhận lead từ MKT, hotline hoặc nguồn trực tiếp; có thể bắt đầu bằng `Customer -> Service Request` hoặc `Service Request -> auto-create Customer`
2. Hệ thống kiểm tra trùng/na ná khách hàng theo số điện thoại, email, địa chỉ để tránh tạo bản ghi rác
3. `Sale` đưa lead vào `SLA queue`, gọi tư vấn theo kịch bản và cập nhật kết quả
4. `Sale` gán `Pipeline` và `Stage`, tạo lịch khảo sát nếu khách phù hợp
5. Kỹ thuật/Supervisor thực hiện khảo sát; `Sale` nhận báo cáo tổng hợp và process làm việc với khách
6. `Sale` lập nhiều phiên bản báo giá nếu cần; mỗi version phải phản ánh được hạng mục, phương án thi công, đơn vị tính, VAT, điều kiện bảo hành và ghi chú thương mại
7. `HanhChinh` và `Accountant` hỗ trợ kiểm tra bộ hồ sơ; hệ thống sinh hợp đồng/chứng từ từ `template` theo đúng loại giao dịch
8. `Director`/người có thẩm quyền ký; khách hàng có thể ký touch hoặc ký trên hồ sơ số
9. Sau khi hợp đồng hợp lệ và điều kiện thương mại đạt yêu cầu, hệ thống convert sang `Project` với `project_type` phù hợp với loại giao dịch
10. Tự động sinh playbook nhiệm vụ, checklist nền, handoff nội bộ, dossier tài liệu và lịch chứng từ liên quan

### 5.2 Luồng Project đến Close

1. PM tạo `Project WBS / Task packages`
2. Giao `Supervisor` và danh sách `Worker profile` tham gia thi công
3. Sinh checklist thực thi và yêu cầu bằng chứng
4. Kho xuất vật tư theo reservation/phiếu
5. `Supervisor` ký nhận và ghi nhận phát vật tư cho từng worker profile nếu cần
6. `Supervisor` thao tác thay mặt `Worker` trên phần mềm ở giai đoạn hiện tại: cập nhật task, checklist, bằng chứng, sự cố
7. PM/Supervisor review tiến độ và chất lượng; `Sale` được nhận các mốc ảnh hưởng tới giao tiếp khách hàng
8. Tạo biên bản nghiệm thu, biên bản số và hồ sơ phát hành liên quan
9. `HanhChinh` phát hành chứng từ, `Accountant` xác nhận công nợ / thanh toán, `Sale` follow khách
10. Sinh bảo hành, lịch bảo trì/bảo dưỡng, dossier hậu mãi, chi phí bảo trì và khoản phải thu phát sinh nếu có

## 6. Phạm vi chức năng mục tiêu

### 6.1 Module A - CRM & Sales Orchestration

| ID | Chức năng |
|---|---|
| CRM-01 | Quản lý Customer master |
| CRM-02 | Quản lý Lead / Service Request / Deal từ nhiều nguồn |
| CRM-03 | SLA tiếp nhận lead, call script, consultation log |
| CRM-04 | Dynamic Pipeline và stage mapping |
| CRM-05 | Khảo sát chuẩn hóa: ảnh, đo độ ẩm, form hiện trạng, điều phối khảo sát |
| CRM-06 | Gói giải pháp và báo cáo tổng hợp gửi khách |
| CRM-07 | Báo giá nhiều phiên bản với hạng mục, quy trình, vật tư, VAT và điều kiện bảo hành |
| CRM-08 | Convert báo giá thắng thành hợp đồng và dự án với `project_type` phù hợp |
| CRM-09 | After-sales, follow-up hợp đồng/tạm ứng/thanh toán và upsell |
| CRM-10 | Fast-track/override có phê duyệt |

### 6.2 Module B - Vận hành nội bộ

| ID | Chức năng |
|---|---|
| OPS-01 | Tạo Project từ Service Request/Hợp đồng |
| OPS-02 | Tạo WBS/Task board theo dự án |
| OPS-03 | Playbook nhiệm vụ theo Pipeline Stage |
| OPS-04 | Giao việc cho PM/Supervisor và quản lý worker profile |
| OPS-05 | SLA, reminder, escalation |
| OPS-06 | Quản lý phụ thuộc giữa nhiệm vụ và điều kiện mở khóa |
| OPS-07 | Chuẩn hóa quy trình giao tiếp và bàn giao giữa các vai trò |
| OPS-08 | Change order / thay đổi phạm vi công việc |

### 6.3 Module C - Field Execution

| ID | Chức năng |
|---|---|
| EXE-01 | Template checklist thi công |
| EXE-02 | Checklist theo task/dự án/khu vực |
| EXE-03 | Ghi nhận ảnh/video với timestamp/GPS, do Supervisor thao tác thay Worker ở giai đoạn hiện tại |
| EXE-04 | Review/approve/reject bằng chứng |
| EXE-05 | Báo cáo sự cố và xử lý sự cố |
| EXE-06 | Biên bản nghiệm thu |
| EXE-07 | Báo cáo tổng hợp công trình |
| EXE-08 | Báo cáo bảo dưỡng định kỳ |
| EXE-09 | Đồng bộ ảnh/video/file với cloud và Google Drive |

### 6.4 Module D - Inventory & Procurement

| ID | Chức năng |
|---|---|
| INV-01 | Danh mục vật tư và master data |
| INV-02 | Định mức vật tư theo loại công trình |
| INV-03 | Reservation vật tư theo dự án/task |
| INV-04 | Phiếu xuất kho, phiếu nhập kho, hoàn kho |
| INV-05 | Supervisor ký nhận trên hệ thống và ghi nhận phát vật tư cho worker profile |
| INV-06 | Cảnh báo tồn kho thấp |
| INV-07 | Đề nghị mua hàng / tái bổ sung kho |
| INV-08 | Lịch sử và đối soát kho |

### 6.5 Module E - Finance, Acceptance, Warranty & Maintenance

| ID | Chức năng |
|---|---|
| FIN-01 | Kế hoạch thanh toán mặc định và tùy chỉnh |
| FIN-02 | Công nợ phải thu / phải trả và trạng thái đã thu/còn lại |
| FIN-03 | Xác nhận giao dịch thu/chi nhiều đợt |
| FIN-04 | P&L theo dự án và theo nguồn doanh thu |
| FIN-05 | Biên bản nghiệm thu gắn với thanh toán cuối |
| FIN-06 | Phiếu bảo hành điện tử |
| FIN-07 | Lịch bảo dưỡng / nhắc bảo hành |
| FIN-08 | Customer Portal chỉ đọc |
| FIN-09 | Tiếp nhận và phân loại yêu cầu bảo hành/bảo trì |
| FIN-10 | Ghi nhận chi phí bảo hành/bảo trì, phân loại miễn phí hay tính phí |
| FIN-11 | Tạo đợt thanh toán phát sinh cho bảo trì ngoài phạm vi bảo hành |
| FIN-12 | Cost ledger theo công trình: giám sát, nhân công, vật tư, thiết bị, phát sinh khác |
| FIN-13 | Theo dõi giữ lại bảo hành/retention và điều kiện giải tỏa |
| FIN-14 | Phê duyệt chi tiền, phân biệt tài khoản công ty và cá nhân, sổ quỹ và theo dõi lệnh tiền |

### 6.6 Module F - Admin & Governance

| ID | Chức năng |
|---|---|
| ADM-01 | User, role, permission |
| ADM-02 | Pipeline config, stage playbook, checklist template |
| ADM-03 | Notification templates và preference |
| ADM-04 | Audit log toàn hệ thống |
| ADM-05 | Báo cáo quản trị và KPI |
| ADM-06 | Cấu hình tích hợp lưu trữ, SMS/Zalo, email |
| ADM-07 | Danh mục chuẩn: loại công trình, mức ưu tiên, nguyên nhân từ chối, nhóm mẫu biểu |

### 6.7 Module G - Document Automation & Digital Signature

| ID | Chức năng |
|---|---|
| DOC-01 | Thư viện mẫu tài liệu theo loại và version |
| DOC-02 | Placeholder/merge field và preview dữ liệu |
| DOC-03 | Sinh PDF/biên bản số từ Service Request, Contract, Project, Payment, Warranty |
| DOC-04 | Điều phối luồng ký nội bộ và khách hàng |
| DOC-05 | Ký điện tử trên màn hình touch và lưu audit ký |
| DOC-06 | Dossier hồ sơ số theo khách hàng/công trình/chứng từ |
| DOC-07 | Mail mẫu, danh sách CC mặc định và lịch sử phát hành |
| DOC-08 | Đồng bộ file phát hành lên Google Drive và lưu chính sách truy cập |
| DOC-09 | Checklist hồ sơ bắt buộc theo từng loại deal và từng chặng vòng đời |

## 7. Business rule cốt lõi

### 7.1 Rule về CRM

- `Customer` có thể có nhiều `Service Request`.
- Người dùng được phép bắt đầu từ `Service Request`; hệ thống phải hỗ trợ auto-create `Customer` mới nếu chưa tồn tại.
- Trước khi tạo `Customer` mới, hệ thống phải thực hiện bước gợi ý trùng/na ná theo số điện thoại, email và địa chỉ.
- Kanban chỉ theo dõi `Service Request`, không theo dõi trực tiếp `Customer`.
- Chỉ `Service Request` ở trạng thái thắng mới được convert sang `Contract/Project`, trừ khi có `Fast-track override`.
- Mỗi `Service Request` có thể có nhiều phiên bản báo giá, nhưng chỉ một phiên bản ở trạng thái thắng.
- Lead mới phải vào `SLA queue` ngay khi tạo.
- SLA mặc định theo workbook:
  - giờ hành chính: phản hồi trong `30 phút`
  - ngoài giờ hành chính: phản hồi trong `60 phút`
  - sau `22:00`: đưa sang `08:30` sáng hôm sau
- Mọi lần tư vấn/follow-up quan trọng của Sale phải có interaction log trên hệ thống.

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
- Ở giai đoạn hiện tại, `Supervisor` là actor thao tác trên hệ thống thay mặt `Worker`; mọi thao tác vẫn phải lưu được worker profile thực tế khi cần truy vết.
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
- Trong giai đoạn hiện tại, ảnh/video/file được upload bởi tài khoản `Supervisor`, nhưng cần lưu được thông tin worker profile thực tế đã thực hiện công việc nếu có.

### 7.5 Rule về tài chính và bảo hành

- Hệ thống phải hỗ trợ `payment schedule template library`, tối thiểu gồm:
  - `50-50`
  - `50-40-10`
  - `custom`
  - phương án có `retention/giữ lại bảo hành`
- Nghiệm thu là điểm kích hoạt:
  - thanh toán cuối
  - phát hành bảo hành
  - mở lịch nhắc bảo dưỡng
- Không kích hoạt bảo hành nếu biên bản nghiệm thu chưa hợp lệ.
- Báo giá và hợp đồng phải lưu được tối thiểu:
  - giá trị trước thuế
  - VAT
  - giá trị sau thuế
  - điều kiện bảo hành
  - loại hợp đồng/giao dịch
- Mỗi công trình phải theo dõi được:
  - doanh thu hợp đồng
  - tiền đã thu
  - công nợ còn lại
  - giá trị giữ lại bảo hành nếu có
  - chi phí thực tế theo công trình
- Mỗi yêu cầu bảo hành/bảo trì phải được phân loại là:
  - trong phạm vi bảo hành
  - ngoài phạm vi bảo hành nhưng hỗ trợ tính phí
  - hạng mục phát sinh cần change order riêng
- Mọi lượt bảo trì/bảo hành phải ghi được:
  - chi phí vật tư
  - chi phí nhân công
  - chi phí di chuyển
  - khoản thu thêm từ khách hàng nếu có
- Mọi chi phí công trình hoặc hậu mãi phải có:
  - nhóm chi phí
  - nguồn chi (công ty/cá nhân/quỹ)
  - người tạo lệnh
  - người duyệt
  - người theo dõi/đối soát nếu áp dụng
- Dashboard tài chính phải nhìn được cả `doanh thu dự án` và `chi phí hậu mãi` để phản ánh lợi nhuận thực.
- Portal khách hàng chỉ hiển thị:
  - tiến độ
  - bằng chứng đã duyệt
  - các mốc thanh toán công bố
  - thông tin bảo hành/bảo dưỡng

### 7.6 Rule về quản lý ảnh/video/file và Google Drive

- Tất cả ảnh/video/file phải có bản ghi metadata tập trung trong hệ thống, không được phụ thuộc trực tiếp vào link Drive rời rạc.
- Google Drive là lớp lưu trữ cloud chính ở giai đoạn này; hệ thống phải giữ:
  - `file id`
  - `folder id`
  - trạng thái đồng bộ
  - checksum/hash
  - quyền truy cập
- File khi upload phải đi qua 3 bước:
  - lưu metadata và file tạm
  - đồng bộ lên Google Drive
  - xác nhận trạng thái `SYNCED` hoặc `FAILED`
- Không công khai link Google Drive raw cho khách hàng; portal chỉ truy cập qua token/app proxy hoặc link đã kiểm soát.
- Phải tách folder Drive theo chuẩn nghiệp vụ: khách hàng, service request, project, loại chứng từ.
- Khi đồng bộ lỗi, hệ thống phải có hàng đợi retry và cảnh báo quản trị.

### 7.7 Rule về mẫu tài liệu và chữ ký điện tử

- Mọi tài liệu phát hành ra ngoài phải gắn với `template version` hợp lệ hoặc có cờ ngoại lệ được audit.
- Không được sửa trực tiếp nội dung của tài liệu đã ký; nếu thay đổi phải sinh version hoặc tài liệu mới.
- Mỗi tài liệu phát hành phải lưu được:
  - loại tài liệu
  - ngữ cảnh nghiệp vụ nguồn
  - số chứng từ nếu có
  - file phát hành
  - file đã ký
  - trạng thái ký
- Chữ ký touch phải gắn với một `signature session` và một `document snapshot` cụ thể.
- `HanhChinh` là owner vận hành phát hành/giao nhận hồ sơ; `Admin` chỉ là owner cấu hình hệ thống.
- `Sale` được nhìn thấy trạng thái hồ sơ và trạng thái ký để follow khách, nhưng không mặc định có quyền sửa template nền.
- Bộ hồ sơ chuẩn tối thiểu phải hỗ trợ các loại tài liệu:
  - phiếu khảo sát
  - báo cáo tổng hợp
  - báo giá/dự toán
  - hợp đồng thi công
  - hợp đồng mua bán hoặc phụ lục giao hàng nếu áp dụng
  - biên bản giao nhận
  - biên bản nghiệm thu
  - đề nghị tạm ứng
  - đề nghị thanh toán
  - báo cáo bảo trì/bảo hành

### 7.8 Rule về dossier và bucket vòng đời

- Hồ sơ và file phải được quản lý đồng thời theo `ngữ cảnh nghiệp vụ` và `bucket vòng đời`.
- Các bucket chuẩn của BAC Group gồm:
  - `PROSPECT_ACTIVE`
  - `LOST_NO_GO`
  - `PROJECT_IN_PROGRESS`
  - `PROJECT_COMPLETED`
  - `AFTERSALES_ACTIVE`
- Việc đổi bucket phải có log và không được làm mất liên kết tài liệu lịch sử.

## 8. Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
|---|---|
| Bảo mật | RBAC rõ, audit trail, token portal có hạn dùng |
| Khả dụng | Mobile-first cho Supervisor; Worker chưa có tài khoản ở giai đoạn hiện tại |
| Hiệu năng | API nghiệp vụ chính < 500ms, upload có queue/retry |
| Tin cậy dữ liệu | Transaction cho kho, thanh toán, nghiệm thu |
| Báo cáo | Có dữ liệu đủ để đối soát theo tháng/quý |
| Mở rộng | Hỗ trợ thêm outsource/team ngoài sau khi core nội bộ ổn |
| Cloud file | Đồng bộ Google Drive có retry, log lỗi, tách quyền và truy vết metadata |

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
