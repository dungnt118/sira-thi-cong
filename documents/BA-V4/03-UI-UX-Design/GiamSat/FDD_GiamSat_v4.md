# FDD Giám sát v4 - Chức năng chi tiết cho vai trò hiện trường

## 1. Vai trò Giám sát trong BA-V4

### 1.1 Định nghĩa vai trò

Giám sát là người đại diện vận hành số tại hiện trường cho BAC ở phase hiện tại. Vai trò này tiếp nhận công trình, kiểm soát khảo sát, theo dõi thi công, cập nhật chứng cứ, quản lý vật tư tại điểm thi công và phối hợp nghiệm thu/bảo trì trên hệ thống.

Giám sát không phải là một lớp quản trị trung gian đứng ngoài công trường. Theo tài liệu thực tế, đây là vai trò bám sát công trình, chịu trách nhiệm tạo ra hồ sơ hiện trường đủ tin cậy để PM, Kế toán, Hành chính và khách hàng có thể sử dụng tiếp.

### 1.2 Ranh giới trách nhiệm

**Giám sát làm**

- tiếp nhận công trình được giao
- tổ chức lịch khảo sát, lịch thi công, lịch visit hiện trường
- lập biên bản khảo sát từ dữ liệu tại chỗ
- lập báo cáo hiện trạng và đề xuất biện pháp xử lý
- thay mặt kỹ thuật profile cập nhật task, checklist, ảnh/video, nhật ký
- xác nhận nhận vật tư và theo dõi cấp phát tại công trình
- báo cáo sự cố, chậm tiến độ, thiếu vật tư, rủi ro kỹ thuật
- phối hợp tạo biên bản nghiệm thu và visit bảo hành/bảo trì

**Giám sát không làm**

- không chốt báo giá/hợp đồng thay PM hoặc Sale
- không xác nhận thu/chi thay Kế toán
- không thay Admin quản trị master data hệ thống
- không tự ý đóng công trình nếu chưa đủ điều kiện nghiệm thu và tài liệu

### 1.3 Mô hình actor thực tế

Ở phase hiện tại:

- `Giám sát` là actor đăng nhập và thao tác trên phần mềm
- `kỹ thuật profile` là hồ sơ nhân sự thực tế tham gia công việc
- một hành động hiện trường có thể cần ghi đồng thời:
  - `người thao tác số`
  - `người thực hiện thực tế`

Điều này đặc biệt quan trọng đối với:

- ảnh/video chứng cứ
- checklist bước thi công
- cấp phát vật tư
- biên bản nghiệm thu
- visit bảo hành/bảo trì

### 1.4 Đầu ra nghiệp vụ bắt buộc

Giám sát phải tạo hoặc hoàn thiện được các đầu ra sau:

1. Biên bản khảo sát công trình
2. Báo cáo hiện trạng và đề xuất biện pháp
3. Checklist thi công có minh chứng
4. Nhật ký hiện trường
5. Phiếu nhận vật tư và cấp phát nội bộ tại công trình
6. Dự thảo biên bản nghiệm thu
7. Báo cáo hiện trạng cần bảo hành/bảo trì
8. Ghi nhận chi phí/khối lượng phát sinh tại visit bảo trì

## 2. Mục tiêu nghiệp vụ của vai trò

Giám sát phải giúp hệ thống đạt được 9 kết quả sau:

1. Không thất lạc dữ liệu hiện trường giữa khảo sát, thi công và hậu mãi.
2. Mọi công trình đều có hồ sơ số bám đúng thực tế tại hiện trường.
3. PM nhìn được tiến độ và chất lượng mà không cần có mặt trực tiếp mọi lúc.
4. Task của kỹ thuật profile được theo dõi tập trung, không ghi chép rời rạc qua chat.
5. Vật tư cấp ra công trình có điểm nhận, điểm sử dụng và điểm xác minh rõ ràng.
6. Sự cố hiện trường được escalate đúng người và đúng thời điểm.
7. Nghiệm thu có đủ dữ liệu để sinh biên bản số, ảnh ký và bộ minh chứng đi kèm.
8. Visit bảo hành/bảo trì liên thông được với tài chính và lịch sử công trình.
9. Ảnh/video/file tại hiện trường đồng bộ được lên cloud theo dossier chuẩn.

## 3. Information Architecture dành cho Giám sát

### 3.1 Cụm điều hướng chính

1. `Trang chủ hiện trường`
2. `Công trình phụ trách`
3. `Khảo sát & hiện trạng`
4. `Task & checklist`
5. `Nhân sự hiện trường`
6. `Vật tư & giao nhận`
7. `Sự cố & ngoại lệ`
8. `Nghiệm thu & biên bản số`
9. `Bảo hành/Bảo trì`
10. `Trung tâm đồng bộ hồ sơ`

### 3.2 Nguyên tắc UI/UX cốt lõi

- mobile-first vì phần lớn thao tác diễn ra tại công trình
- thao tác ít bước, nút hành động lớn, hỗ trợ chụp ảnh và ký chạm trực tiếp
- phân biệt rõ `việc hôm nay`, `việc trễ hạn`, `việc chờ bổ sung`
- mọi màn nhập liệu hiện trường phải hỗ trợ lưu nháp
- mọi chứng cứ phải hiển thị trạng thái đồng bộ và trạng thái duyệt

## 4. Danh mục chức năng Giám sát

| Mã | Nhóm chức năng | Mục tiêu | Ưu tiên |
|---|---|---|---|
| GS-F01 | Home & Daily Queue | Điều hành công việc hiện trường theo ngày | Critical |
| GS-F02 | Assigned Site Management | Quản lý danh sách công trình/visit được giao | Critical |
| GS-F03 | Survey & Site Inspection | Chuẩn hóa khảo sát, đo đạc, ghi nhận hiện trạng | Critical |
| GS-F04 | Current Condition Report | Lập báo cáo hiện trạng và đề xuất biện pháp xử lý | Critical |
| GS-F05 | Task, Checklist & Evidence | Theo dõi bước thi công và minh chứng thay kỹ thuật profile | Critical |
| GS-F06 | Workforce Proxy Tracking | Quản lý kỹ thuật profile tham gia từng hạng mục | High |
| GS-F07 | Material Receipt & Allocation | Ký nhận vật tư, xác minh cấp phát và thiếu hụt | Critical |
| GS-F08 | Incident & Escalation Center | Xử lý ngoại lệ hiện trường và báo cáo khẩn | High |
| GS-F09 | Acceptance & Digital Minutes | Tạo dự thảo nghiệm thu và biên bản số có chữ ký | Critical |
| GS-F10 | Warranty & Maintenance Visit | Ghi nhận visit hậu mãi và liên thông tài chính | Critical |
| GS-F11 | Media Sync & Dossier Control | Quản lý đồng bộ ảnh/video/file với Google Drive | High |

## 5. Chi tiết chức năng

### 5.1 GS-F01 - Home & Daily Queue

**Mục tiêu**

Cho Giám sát một màn hình điều hành ngày làm việc với trọng tâm là công trình phải đi, việc phải cập nhật và việc bị chặn.

**Thông tin phải hiển thị**

- công trình hoặc visit hôm nay
- công trình đang trễ cập nhật
- checklist đang mở
- sự cố chưa xử lý
- vật tư chờ ký nhận hoặc đang thiếu
- hồ sơ ảnh/video chưa đồng bộ
- visit nghiệm thu hoặc bảo trì sắp tới

**Hành động chính**

- mở nhanh công trình được giao
- bắt đầu khảo sát/visit
- tiếp tục checklist đang làm dở
- báo cáo sự cố ngay
- vào màn ký nhận vật tư
- xem việc nào cần bổ sung chứng cứ

**Rule**

- phải có bộ lọc theo `hôm nay`, `7 ngày tới`, `quá hạn`
- ưu tiên hiển thị theo severity trước, theo thời gian sau
- nếu có việc chưa đồng bộ file thì phải có cảnh báo nổi bật

### 5.2 GS-F02 - Assigned Site Management

**Mục tiêu**

Quản lý danh sách công trình, site visit, case bảo hành/bảo trì mà Giám sát chịu trách nhiệm.

**Màn chính**

- Site List
- Site Detail Summary
- Daily Visit Calendar
- Site Activity Timeline

**Hành động chính**

- xem công trình theo trạng thái
- tìm công trình theo khách hàng, địa chỉ, mã công trình
- xem nhanh lịch sử khảo sát, thi công, nghiệm thu, bảo trì
- mở đúng module con từ context công trình

**Rule**

- `Công trình thi công`, `công trình chờ nghiệm thu`, `công trình hậu mãi` là các nhóm nhìn riêng
- một công trình có thể có nhiều visit khác nhau nhưng phải dùng chung lịch sử dossier

### 5.3 GS-F03 - Survey & Site Inspection

**Mục tiêu**

Biến việc khảo sát công trình thành dữ liệu có cấu trúc, đủ để sinh biên bản khảo sát và phục vụ báo giá/giải pháp.

**Màn chính**

- Survey Create/Edit
- Survey Form Sections
- Survey Media Capture
- Survey Review & Submit

**Hành động chính**

- chọn hoặc xác nhận khách hàng/công trình
- ghi nhận khu vực khảo sát, hiện trạng, thông số đo
- nhập danh sách hạng mục cần xử lý
- ghi nhận yếu tố ảnh hưởng `Go/No-Go` như vật tư khó kiếm, điều kiện tiếp cận, giáo mác, đu dây, deadline
- chụp ảnh/video từng khu vực
- tạo biên bản khảo sát số
- ký khách hàng và Giám sát ngay trên thiết bị touch

**Rule**

- khảo sát phải gắn với `Service Request` hoặc `Project` cụ thể
- mỗi ảnh khảo sát phải có tối thiểu timestamp và context khu vực
- biên bản khảo sát chỉ được hoàn tất khi có đủ thông tin khách hàng, địa chỉ, khảo sát viên và bảng hiện trạng/hạng mục
- cho phép lưu nháp khi khảo sát dở dang

### 5.4 GS-F04 - Current Condition Report

**Mục tiêu**

Tạo báo cáo hiện trạng và đề xuất biện pháp theo logic của các báo cáo tổng hợp thực tế BAC đang dùng.

**Màn chính**

- Condition Report Editor
- Problem Area List
- Proposed Solution Blocks
- Report Preview

**Hành động chính**

- mô tả tình trạng thực tế theo từng khu vực
- ghi nguyên nhân nghi ngờ hoặc rủi ro kỹ thuật
- đề xuất biện pháp xử lý hoặc phương án bảo trì
- gắn ảnh minh chứng theo từng khối nội dung
- xuất báo cáo tổng hợp cho PM/Sale/Khách hàng

**Rule**

- báo cáo hiện trạng phải tách rõ `thực trạng`, `nguyên nhân/nhận định`, `đề xuất biện pháp`
- cùng một công trình có thể có nhiều báo cáo theo từng đợt khảo sát hoặc hậu mãi
- report phải versioning, không ghi đè mất lịch sử

### 5.5 GS-F05 - Task, Checklist & Evidence

**Mục tiêu**

Giúp Giám sát thực thi các bước công việc tại công trình và cập nhật trạng thái thay cho kỹ thuật profile.

**Màn chính**

- Task Package Board
- Checklist Detail
- Evidence Upload
- Activity Log

**Hành động chính**

- mở gói việc được giao
- chọn kỹ thuật profile tham gia
- cập nhật trạng thái từng bước
- chụp/tải ảnh, video, file minh chứng
- ghi chú điều kiện thi công, thời tiết, vật tư, ngoại lệ
- gửi bước sang trạng thái chờ review

**Rule**

- hệ thống phải ghi được cả `Giám sát thao tác` và `kỹ thuật profile thực hiện`
- bước chỉ được gửi review khi đủ checklist và số lượng minh chứng tối thiểu
- nếu bước có sự cố mở hoặc vật tư chưa nhận thì không cho hoàn tất trái rule
- evidence sau khi gửi phải có trạng thái `đồng bộ`, `chờ duyệt`, `đã duyệt/từ chối`

### 5.6 GS-F06 - Workforce Proxy Tracking

**Mục tiêu**

Cho Giám sát quản lý đội tham gia hiện trường ở mức tác nghiệp, dù kỹ thuật chưa có tài khoản trực tiếp.

**Màn chính**

- Kỹ thuật Profile Picker
- Site Team Sheet
- Attendance / Participation Log

**Hành động chính**

- chọn kỹ thuật profile cho từng hạng mục hoặc ca làm
- ghi nhận ai có mặt tại công trình
- thay đổi phân công trong ngày
- đánh dấu ai thực hiện bước nào

**Rule**

- không tạo logic chấm công nhân sự đầy đủ ở đây; mục tiêu là tracking theo công trình
- một evidence hoặc checklist item có thể gắn nhiều kỹ thuật profile tham gia
- khi thay người giữa chừng phải giữ được lịch sử người cũ và người mới

### 5.7 GS-F07 - Material Receipt & Allocation

**Mục tiêu**

Chuẩn hóa toàn bộ quá trình nhận vật tư tại công trình và cấp phát cho đội thi công.

**Màn chính**

- Material Receipt Queue
- Receipt Confirmation
- On-site Allocation Log
- Shortage / Loss Report

**Hành động chính**

- xem phiếu vật tư chuẩn bị giao
- xác nhận đã nhận, nhận thiếu hoặc từ chối nhận
- chụp ảnh kiện hàng/vật tư khi nhận
- cấp phát vật tư cho hạng mục hoặc kỹ thuật profile
- cấp phát tài sản thi công cho tổ/kỹ thuật profile
- ghi nhận phần dư hoàn nhập khi kết thúc hạng mục
- báo thiếu, hư hỏng, thất lạc

**Rule**

- phiếu nhận phải ghi thời gian, địa điểm, người giao, người nhận, tình trạng
- hỗ trợ chữ ký điện tử trên màn hình touch cho giao nhận
- nếu nhận thiếu so với phiếu thì phải mở case ngoại lệ ngay
- vật tư quan trọng phải liên kết được tới bước thi công sử dụng
- phần dư vật tư chỉ được hoàn nhập sau khi Giám sát xác nhận số lượng và tình trạng thực tế

### 5.8 GS-F08 - Incident & Escalation Center

**Mục tiêu**

Biến các sự cố hiện trường thành case có người chịu trách nhiệm, có trạng thái xử lý và có dấu vết quyết định.

**Màn chính**

- Incident Create
- Incident Detail
- Escalation Timeline
- Resolution Confirmation

**Hành động chính**

- tạo case sự cố
- đính kèm ảnh/video/minh chứng
- chọn mức độ và tác động
- escalate tới PM/Kế toán/Hành chính tùy loại
- cập nhật hướng xử lý và kết quả

**Rule**

- sự cố về vật tư phải liên kết tới receipt/allocation tương ứng nếu có
- sự cố ảnh hưởng nghiệm thu phải khóa đóng công trình cho tới khi resolve
- các case khẩn phải có SLA phản hồi

### 5.9 GS-F09 - Acceptance & Digital Minutes

**Mục tiêu**

Hỗ trợ Giám sát tạo dự thảo nghiệm thu, thu chữ ký và hoàn tất biên bản số tại công trình.

**Màn chính**

- Acceptance Preparation
- Acceptance Checklist
- Digital Signature Canvas
- Acceptance Minutes Preview

**Hành động chính**

- kiểm tra điều kiện trước nghiệm thu
- chọn các hạng mục đưa vào nghiệm thu
- nhập kết quả kiểm tra thực tế
- ký khách hàng, đại diện BAC và bên liên quan trên màn hình touch
- xuất biên bản số và đẩy vào dossier

**Rule**

- chỉ mở nghiệm thu khi các bước bắt buộc đã đủ minh chứng
- phải phân biệt `nghiệm thu nội bộ`, `nghiệm thu khách hàng`, `nghiệm thu bảo trì`
- biên bản số sau khi ký không được chỉnh sửa trực tiếp; nếu cần sửa phải tạo phiên bản mới

### 5.10 GS-F10 - Warranty & Maintenance Visit

**Mục tiêu**

Quản lý các visit hậu mãi từ góc nhìn hiện trường, đồng bộ với tài chính và lịch sử công trình.

**Màn chính**

- Aftersales Visit Queue
- Current Issue Capture
- Maintenance Work Log
- Maintenance Cost Input
- Visit Summary

**Hành động chính**

- ghi nhận yêu cầu bảo hành/bảo trì
- khảo sát hiện trạng phát sinh
- chụp minh chứng trước và sau xử lý
- ghi khối lượng, vật tư, chi phí phát sinh thực tế
- phản hồi hoặc bổ sung thông tin qua thread portal nếu khách hàng tạo yêu cầu từ portal
- chốt kết quả visit

**Rule**

- phải phân biệt `bảo hành không tính phí` và `bảo trì/tính phí`
- visit hậu mãi phải liên kết được với hợp đồng, điều khoản bảo hành và công nợ nếu có
- nếu phát sinh chi phí tính phí khách hàng thì dữ liệu phải đẩy sang tài chính

### 5.11 GS-F11 - Media Sync & Dossier Control

**Mục tiêu**

Bảo đảm ảnh/video/file hiện trường được quản lý như hồ sơ số chính thức, không thất lạc qua thiết bị cá nhân.

**Màn chính**

- Media Sync Status
- Failed Upload Queue
- Google Drive Folder Map
- Dossier File List

**Hành động chính**

- xem file nào đã/đang/chưa đồng bộ
- retry file lá»—i
- kiểm tra file đã vào đúng dossier cloud chưa
- xem trước file xuất bản cho khách hàng/nội bộ

**Rule**

- mỗi file phải có metadata tối thiểu: công trình, loại hồ sơ, visit/stage, actor, thời gian
- file lỗi đồng bộ không được xem là hoàn tất hồ sơ
- Google Drive là lớp lưu trữ cloud chuẩn; ứng dụng giữ metadata, quyền và trạng thái đồng bộ

## 6. Điều kiện hoàn tất nghiệp vụ cho vai trò Giám sát

Một công trình hoặc visit chỉ được coi là hoàn tất từ góc nhìn Giám sát khi đồng thời đạt:

1. Đủ form bắt buộc theo loại công việc.
2. Đủ ảnh/video/file minh chứng.
3. Đủ mapping kỹ thuật profile tham gia.
4. Đủ xác nhận vật tư nếu có sử dụng vật tư.
5. Không còn sự cố mở ở trạng thái chặn.
6. Hồ sơ số đã đồng bộ thành công lên dossier cloud.

## 7. Kết luận

Vai trò `Giám sát` trong V4 là một module vận hành hiện trường hoàn chỉnh, không còn là nhánh con sơ sài của `kỹ thuật`. Từ tài liệu này, mọi thiết kế UI, API, ERD và workflow cho hiện trường phải ưu tiên mô hình `Giám sát thao tác thay kỹ thuật profile` và lấy hồ sơ hiện trường số làm đầu ra trung tâm.
