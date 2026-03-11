# Screen Inventory - Sale v4

## 1. Nguyên tắc đọc bảng

- `Route/prototype hiện có`: trạng thái code giao diện đang tồn tại trong repo.
- `Định hướng V4`: đích mong muốn cho vai trò Sale, có thể tách riêng hoặc dùng chung shell với PM ở giai đoạn đầu.

## 2. Danh mục màn hình

| Mã | Màn hình | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| SAL-01 | Sale Dashboard | Tổng quan lead, SLA, deal, follow-up | Chưa có riêng | Chưa có |
| SAL-02 | Lead Intake Inbox | Hàng đợi lead mới từ MKT/hotline/direct | Chưa có riêng | Chưa có |
| SAL-03 | SLA Follow-up Queue | Theo dõi 30p/60p/08:30 | Chưa có | Chưa có |
| SAL-04 | Customer List | Tìm khách cũ/mới | `/pm/crm/customers` | Có thể tái sử dụng |
| SAL-05 | Customer Create | Tạo khách trực tiếp | `/pm/crm/customers/new` | Có thể tái sử dụng |
| SAL-06 | Customer Detail | Lịch sử khách hàng | `/pm/crm/customers/:id` | Có thể tái sử dụng |
| SAL-07 | Service Request List | Quản lý danh sách yêu cầu dịch vụ | `/pm/crm/service-requests` | Có thể tái sử dụng |
| SAL-08 | Service Request Quick Create | Tạo yêu cầu mới nhanh | `/pm/crm/service-requests/new` | Có một phần |
| SAL-09 | Service Request Detail | Hồ sơ làm việc trung tâm | `/pm/crm/service-requests/:id` | Có một phần |
| SAL-10 | Pipeline Kanban | Quản lý deal theo stage | `/pm/crm/pipeline` | Có thể tái sử dụng |
| SAL-11 | Consultation Log | Ghi chú gọi điện, kịch bản, kết quả | Chưa có | Chưa có |
| SAL-12 | Survey Coordination Board | Hẹn khảo sát, theo dõi khảo sát | Chưa có riêng | Chưa có |
| SAL-13 | Survey Record Detail | Xem và gửi lại dữ liệu khảo sát | `/pm/crm/service-requests/:id/survey` | Có một phần |
| SAL-13A | Estimate Summary View | Xem tóm tắt dự toán nội bộ ở mức Sale được phép | Chưa có | Chưa có |
| SAL-13B | Go/No-Go Status Board | Xem trạng thái chốt nhận việc và cảnh báo chặn | Chưa có | Chưa có |
| SAL-14 | Summary Package Builder | Ghép báo cáo tổng hợp + process làm việc + giải pháp | Chưa có | Chưa có |
| SAL-15 | Quotation Workspace | Tạo và so sánh version báo giá | `/pm/crm/service-requests/:id/quotation` | Có một phần |
| SAL-15A | Quotation Mapping Review | Review đầu mục nội bộ sang đầu mục báo giá khách | Chưa có | Chưa có |
| SAL-16 | Quote Approval / Win-Loss | Chốt thắng thua, lý do, competitor note | Chưa có | Chưa có |
| SAL-17 | Contract Follow-up Board | Theo dõi tình trạng hợp đồng, chờ ai ký | Chưa có | Chưa có |
| SAL-18 | Document Template Picker | Chọn mẫu tài liệu để sinh PDF | Chưa có | Chưa có |
| SAL-18A | Portal Thread Inbox | Theo dõi thread trao đổi với khách hàng trên portal | Chưa có | Chưa có |
| SAL-19 | Signature Request Tracker | Theo dõi lượt ký của khách/nội bộ | Chưa có | Chưa có |
| SAL-20 | Advance Follow-up Board | Theo dõi tạm ứng, nhắc khách | Chưa có | Chưa có |
| SAL-21 | Payment Follow-up Board | Theo dõi đề nghị thanh toán và công nợ cần nhắc | Chưa có | Chưa có |
| SAL-22 | Incident Coordination Feed | Xá»­ lý phát sinh vá»›i PM/Giám sát | Chưa có | Chưa có |
| SAL-23 | After-sales Workspace | Chăm sóc sau công trình và upsell | Chưa có | Chưa có |
| SAL-24 | Activity Timeline | Nhật ký tương tác với khách | Chưa có | Chưa có |
| SAL-25 | KPI & Conversion Report | Tỷ lệ phản hồi, khảo sát, báo giá, ký hợp đồng | Chưa có | Chưa có |

## 3. Kết luận inventory

Prototype hiện tại mới phủ một phần `CRM cơ bản` dưới shell của `PM`. Toàn bộ các màn liên quan trực tiếp đến:

- SLA tiếp nhận lead
- follow-up hợp đồng/tạm ứng/thanh toán
- quản lý mẫu tài liệu
- chữ ký điện tử
- after-sales

đều chưa có và phải được đưa vào backlog V4 nếu muốn hệ thống phản ánh đúng vai trò Sale theo workbook gốc.
