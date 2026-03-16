# Screen Inventory - PM V4

## 1. Mục tiêu

Liệt kê đầy đủ các màn hình PM cần có trong V4, đồng thời đối chiếu với:

- prototype đang có trong codebase
- tài liệu/wireframe cũ của V2/V3

## 2. Quy ước trạng thái

- `Đã có prototype`: đã có page hoặc route trong codebase
- `Có một phần`: có route/page nhưng chưa đúng mô hình V4 hoặc còn thiếu sâu
- `Chưa có`: chưa thấy page phù hợp trong codebase hiện tại

## 3. Nhóm Workbench

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-01 | PM Dashboard | Tổng hợp việc cần xử lý | `src/pages/pm/Dashboard/index.tsx` | Đã có prototype |
| PM-02 | PM Inbox / Action Center | Gom task, alert, overdue, pending review | Chưa thấy page riêng | Chưa có |
| PM-03 | Exception Dashboard | Xem nghẽn tiến độ, vật tư, tài chính, incident | Chưa thấy page riêng | Chưa có |

## 4. Nhóm CRM & Sales

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-04 | Customer Hub | Quản lý khách hàng master | `src/pages/pm/CRM/CustomerList.tsx` | Đã có prototype |
| PM-05 | Customer Detail | Xem lịch sử request/project của khách | `src/pages/pm/CRM/CustomerDetail.tsx` | Đã có prototype |
| PM-06 | Customer Create/Edit | Tạo/sửa khách hàng | `src/pages/pm/CRM/CustomerCreate.tsx` | Đã có prototype |
| PM-07 | Service Request List | Quản lý deal theo request | `src/pages/pm/CRM/ServiceRequestList.tsx` | Đã có prototype |
| PM-08 | Service Request Detail | Xem toàn bộ vòng đời request | `src/pages/pm/CRM/ServiceRequestDetail.tsx` | Đã có prototype |
| PM-09 | Service Request Create | Tạo request trước hoặc tạo từ customer có sẵn | Đang reuse `CustomerCreate` trong route | Có một phần |
| PM-10 | Pipeline Board | Quản lý stage request | `src/pages/pm/CRM/Pipeline.tsx` | Đã có prototype |
| PM-11 | Pipeline Settings | Cấu hình pipeline | `src/pages/pm/CRM/PipelineSettings.tsx` | Đã có prototype |
| PM-12 | Stage Activity / History | Xem log chuyển stage, note, owner | Chưa thấy page riêng | Chưa có |

## 5. Nhóm Survey, Quotation, Contract

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-13 | Survey Workspace | Upload khảo sát, đo đạc, trạng thái hiện trạng | `src/pages/pm/CRM/SurveyUpload.tsx` | Đã có prototype |
| PM-13A | Estimate Workbench | Lập `Estimate Version`, tính vật tư, nhân công, vận chuyển | Chưa thấy page riêng | Chưa có |
| PM-13B | Go/No-Go Review Board | Review cảnh báo nhận việc, điều kiện chốt làm | Chưa thấy page riêng | Chưa có |
| PM-14 | Quotation Workspace | Tạo/chỉnh sửa báo giá | `src/pages/pm/CRM/Quotation.tsx` | Đã có prototype |
| PM-14A | Quotation Mapping Config | Map đầu mục nội bộ sang đầu mục báo giá khách | Chưa thấy page riêng | Chưa có |
| PM-15 | Quotation Version Compare | So version, chọn bản thắng | Chưa thấy page riêng | Chưa có |
| PM-16 | Contract List | Quản lý hợp đồng | `src/pages/pm/Contracts/ContractList.tsx` | Đã có prototype |
| PM-17 | Contract Create/Edit | Tạo/sửa hợp đồng | `src/pages/pm/Contracts/ContractCreate.tsx` | Đã có prototype |
| PM-18 | Contract Detail | Xem hợp đồng, payment plan, phụ lục | `src/pages/pm/Contracts/ContractDetail.tsx` | Đã có prototype |
| PM-19 | Convert to Project Wizard | Kiểm tra dữ liệu trước khi sinh project | Chưa thấy page riêng | Chưa có |

## 6. Nhóm Project & Task

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-20 | Project List | Danh sách dự án theo trạng thái | `src/pages/pm/Construction/ProjectList.tsx`, `src/pages/pm/Projects/ProjectList.tsx` | Có một phần |
| PM-21 | Project Create | Tạo dự án | `src/pages/pm/Construction/ProjectCreate.tsx`, `src/pages/pm/Projects/ProjectCreate.tsx` | Có một phần |
| PM-22 | Project Workbench Overview | Tổng quan dự án, bottleneck, next actions | `src/pages/pm/Construction/ProjectDetail.tsx`, `src/pages/pm/Projects/ProjectDetail.tsx` | Có một phần |
| PM-23 | Task Board | Quản lý WBS/task package/dependency | Chưa thấy page riêng | Chưa có |
| PM-24 | Task Package Detail | Xem assignment, checklist, material dependency | Chưa thấy page riêng | Chưa có |
| PM-25 | Handoff Log | Xem bàn giao PM -> Giám sát -> Accountant | Chưa thấy page riêng | Chưa có |
| PM-26 | Change Order / Scope Change | Quản lý phát sinh thay đổi phạm vi | Chưa thấy page riêng | Chưa có |

## 7. Nhóm Workforce & Partners

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-27 | Internal Workforce List | Quản lý đội nội bộ, Giám sát, kỹ thuật profile | `src/pages/pm/Teams/index.tsx` qua route `/pm/teams/internal` | Có một phần |
| PM-28 | Capacity & Availability View | Xem tải phân bổ nguồn lực | Chưa thấy page riêng | Chưa có |
| PM-29 | Kỹ thuật Profile Directory | Quản lý hồ sơ kỹ thuật profile | Chưa thấy page riêng | Chưa có |
| PM-30 | Partner Company List | Quản lý nhà thầu/cộng tác viên liên kết | `src/pages/pm/Teams/index.tsx` qua route `/pm/teams/outsource` | Có một phần |
| PM-31 | Partner Company Detail | Xem chi tiết công ty, leader, compliance, performance | `src/pages/pm/Teams/CollaboratorDetail.tsx` | Có một phần |
| PM-32 | Partner Assignment Wizard | Gán đối tác vào project/package | Chưa thấy page riêng | Chưa có |
| PM-33 | Partner Performance Dashboard | Đánh giá đối tác theo lịch sử dự án | Chưa thấy page riêng | Chưa có |

## 8. Nhóm Planning & Resources

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-34 | Material Planning List | Xem nhiều kế hoạch vật tư | `src/pages/pm/Construction/MaterialPlanList.tsx` | Đã có prototype |
| PM-35 | Material Planning Detail | Kế hoạch vật tư theo project/task | `src/pages/pm/Construction/MaterialPlan.tsx` | Đã có prototype |
| PM-36 | Inventory Catalog (PM view) | Xem catalog vật tư | `src/pages/pm/Inventory/InventoryCatalog.tsx` | Đã có prototype |
| PM-37 | Stock Request Out | Đề nghị xuất kho | `src/pages/pm/Inventory/StockRequestOut.tsx` | Đã có prototype |
| PM-38 | Stock Request In / Return | Đề nghị nhập/hoàn kho | `src/pages/pm/Inventory/StockRequestIn.tsx` | Đã có prototype |
| PM-39 | Labor Planning | Lập kế hoạch nhân lực nội bộ/outsource | Chưa thấy page riêng | Chưa có |
| PM-40 | Cost Variance | So planned vs actual vật tư/nhân công | Chưa thấy page riêng | Chưa có |
| PM-40A | Asset & Consumable Plan | Lập kế hoạch tài sản thi công, vật tư tiêu hao, vật tư bán tiêu hao | Chưa thấy page riêng | Chưa có |
| PM-40B | Remainder Recovery Review | Theo dõi phần dư hoàn nhập, hao hụt, mất mát | Chưa thấy page riêng | Chưa có |

## 9. Nhóm Quality, Evidence, Incident

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-41 | Evidence Queue | Hàng đợi evidence chờ review | `src/pages/pm/Construction/EvidenceQueue.tsx` | Đã có prototype |
| PM-42 | Photo/Video Approval | Duyệt chi tiết bằng chứng | `src/pages/pm/Construction/PhotoApproval.tsx` | Đã có prototype |
| PM-43 | Remote Project Monitoring | Giám sát realtime từng bước | Có một phần qua Project Detail | Có một phần |
| PM-44 | Incident Queue | Xem và điều phối sự cố | Chưa thấy page riêng | Chưa có |
| PM-45 | Checklist Template (PM view) | Quản lý template checklist | `src/pages/pm/Construction/TemplateChecklist.tsx` nhưng route hiện tại có chỗ `ComingSoon` | Có một phần |

## 10. Nhóm Finance, Close-out, Portal, Aftersales

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-46 | Finance Snapshot List | Xem tài chính các project | `src/pages/pm/Construction/ProjectFinanceList.tsx`, `src/pages/pm/Financials/index.tsx` | Có một phần |
| PM-47 | Finance Snapshot Detail | Xem milestone, estimated margin, aging | `src/pages/pm/Construction/ProjectFinance.tsx` | Đã có prototype |
| PM-48 | Acceptance Readiness | Kiểm tra điều kiện close/acceptance | Chưa thấy page riêng | Chưa có |
| PM-49 | Portal Publish Center | Publish/revoke dữ liệu cho khách | Chưa thấy page riêng | Chưa có |
| PM-49A | Portal Thread Review | Xem và xử lý thread chat với khách hàng | Chưa thấy page riêng | Chưa có |
| PM-50 | Maintenance Detail | Theo dõi maintenance/warranty case | `src/pages/pm/Contracts/MaintenanceDetail.tsx` | Có một phần |
| PM-51 | Warranty/Maintenance Oversight | Tổng hợp case hậu mãi theo project | Chưa thấy page riêng | Chưa có |

## 11. Nhóm Reports & Activity

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| PM-52 | PM Reports Center | Báo cáo vận hành theo PM | `src/pages/pm/Reports/index.tsx` | Đã có prototype |
| PM-53 | Activity Timeline | Xem lịch sử hoạt động theo project/request | Chưa thấy page riêng | Chưa có |
| PM-54 | Notification Center | Quản lý thông báo và ưu tiên xử lý | Chưa thấy page riêng | Chưa có |

## 12. Kết luận

V4 trước đây mới chỉ nêu tên vài màn lớn cho PM. Bản inventory này khóa lại toàn bộ bộ màn cần có để:

- tránh sót năng lực `team nội bộ` và `partner/outsource`
- tránh build thiếu `task board`, `exception`, `close-out`, `aftersales`
- giúp UI/UX, BA và dev dùng chung một danh mục màn hình chuẩn
