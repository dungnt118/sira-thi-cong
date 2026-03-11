# Screen Inventory Giám sát v4

## 1. Mục tiêu

Danh mục này chuẩn hóa các màn hình cần có cho vai trò `Giám sát`, đồng thời đối chiếu với prototype/code hiện tại để thấy rõ phần nào đã có seed và phần nào còn thiếu.

## 2. Nguyên tắc đọc bảng

- `Mã màn`: định danh BA của màn hình
- `Route/prototype hiện tại`: nơi đã có seed trong code nếu có
- `Trạng thái`: `Đã có seed`, `Có một phần`, `Chưa có`
- `Ưu tiên`: mức cần triển khai trong baseline vận hành thật

## 3. Danh mục màn hình

| Mã màn | Màn hình | Mục tiêu nghiệp vụ | Route/prototype hiện tại | Trạng thái | Ưu tiên |
|---|---|---|---|---|---|
| GS-01 | Trang chủ hiện trường | Xem việc hôm nay, việc trễ, cảnh báo hiện trường | `/supervisor/home` -> `src/pages/worker/WorkerHome.tsx` | Đã có seed | Critical |
| GS-02 | Danh sách công trình phụ trách | Xem các công trình/visit được giao | `/supervisor/projects` -> đang dùng lại `WorkerHome` | Có một phần | Critical |
| GS-03 | Lịch hiện trường | Xem lịch khảo sát, thi công, nghiệm thu, bảo trì | Chưa có | Chưa có | High |
| GS-04 | Tóm tắt công trình | Xem thông tin công trình, khách hàng, trạng thái dossier | Chưa có | Chưa có | High |
| GS-05 | Danh sách gói việc/task | Xem task package theo công trình | Chưa có | Chưa có | Critical |
| GS-06 | Checklist bước thi công | Theo dõi và cập nhật trạng thái từng bước | `/supervisor/checklist/:id` -> `src/pages/worker/Checklist.tsx` | Đã có seed | Critical |
| GS-07 | Upload ảnh/video minh chứng | Chụp/tải file chứng cứ cho từng bước | `/supervisor/evidence/:projectId/:stepId` -> `src/pages/worker/EvidenceUpload.tsx` | Đã có seed | Critical |
| GS-08 | Nhật ký hiện trường | Ghi hoạt động, điều kiện thi công, ghi chú trong ngày | Chưa có | Chưa có | High |
| GS-09 | Chọn worker profile tham gia | Gắn người thực hiện thực tế cho task hoặc evidence | Chưa có | Chưa có | High |
| GS-10 | Danh sách đội hiện trường | Xem đội tham gia công trình, thay người, ghi lịch sử | Chưa có | Chưa có | High |
| GS-11 | Ký nhận vật tư | Xác nhận nhận vật tư và tình trạng hàng hóa | `/supervisor/materials` -> `ComingSoon` | Có một phần | Critical |
| GS-12 | Cấp phát vật tư tại công trình | Ghi vật tư cấp cho hạng mục hoặc worker profile | Chưa có | Chưa có | High |
| GS-12A | Thu hồi tài sản & hoàn nhập phần dư | Ghi tài sản thu hồi, vật tư dở dang, phần dư còn dùng được | Chưa có | Chưa có | High |
| GS-13 | Báo cáo sự cố | Tạo case sự cố và escalate | `/supervisor/incident` -> `src/pages/worker/IncidentReport.tsx` | Đã có seed | High |
| GS-14 | Danh sách sự cố & xử lý | Theo dõi tất cả case sự cố đang mở | Chưa có | Chưa có | High |
| GS-15 | Biên bản khảo sát công trình | Lập biên bản khảo sát từ dữ liệu hiện trường | Chưa có | Chưa có | Critical |
| GS-15A | Khảo sát rủi ro nhận việc | Ghi yếu tố ảnh hưởng vật tư, nhân công, tiến độ, giáo mác, đu dây | Chưa có | Chưa có | Critical |
| GS-16 | Báo cáo hiện trạng & đề xuất biện pháp | Soạn báo cáo tổng hợp theo mẫu BAC | Chưa có | Chưa có | Critical |
| GS-17 | Review media khảo sát/thi công | Kiểm tra file đã đủ, đúng khu vực, đúng ngữ cảnh | Chưa có | Chưa có | High |
| GS-18 | Chuẩn bị nghiệm thu | Kiểm tra điều kiện trước nghiệm thu | Chưa có | Chưa có | Critical |
| GS-19 | Biên bản nghiệm thu số | Nhập kết quả, ký chạm, xuất biên bản | Chưa có | Chưa có | Critical |
| GS-20 | Visit bảo hành/bảo trì | Tạo hồ sơ visit hậu mãi | Chưa có | Chưa có | Critical |
| GS-20A | Portal Request Context | Xem yêu cầu khách gửi từ portal và phản hồi hiện trường | Chưa có | Chưa có | High |
| GS-21 | Ghi nhận chi phí bảo trì hiện trường | Nhập vật tư, khối lượng, phát sinh thực tế | Chưa có | Chưa có | High |
| GS-22 | Trung tâm đồng bộ hồ sơ | Theo dõi upload lỗi, retry, map Google Drive | Chưa có | Chưa có | High |
| GS-23 | Hồ sơ Giám sát | Xem thông tin cá nhân, phạm vi phụ trách | `/supervisor/profile` -> `ComingSoon` | Có một phần | Medium |

## 4. Nhận định từ đối chiếu code hiện tại

### 4.1 Những gì đã có seed

- trang chủ hiện trường
- checklist bước thi công
- upload ảnh/video theo bước
- báo cáo sự cố

### 4.2 Những gì còn thiếu lớn

- khảo sát và biên bản khảo sát
- báo cáo hiện trạng và đề xuất biện pháp
- quản lý worker profile theo công trình
- nhận vật tư và cấp phát tại công trình
- nghiệm thu số có chữ ký điện tử
- visit bảo hành/bảo trì
- trung tâm đồng bộ hồ sơ với Google Drive

## 5. Kết luận

Prototype hiện tại mới bao phủ phần giữa của vòng đời thi công. Để vai trò `Giám sát` vận hành được thật, hệ thống phải mở rộng đầy đủ ra cả hai đầu:

- đầu vào: khảo sát, hiện trạng, chuẩn bị thi công, nhận vật tư
- đầu ra: nghiệm thu, hồ sơ số, bảo hành, bảo trì
