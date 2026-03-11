# Gap Register v4

## 1. Mục tiêu của gap register

File này tổng hợp các khoảng trống còn tồn tại sau khi đối chiếu:

- BA-V2
- BA-V3
- Wireframe bổ sung
- Codebase hiện tại
- Nhu cầu vận hành thực tế do người dùng nêu ra

## 2. Danh mục gap trọng yếu

| ID | Nhóm | Gap | Bằng chứng hiện trạng | Ảnh hưởng | Ưu tiên | Hướng xử lý trong V4 |
|---|---|---|---|---|---|---|
| GAP-01 | CRM | Kanban đang bị hiểu sai đối tượng theo dõi nếu bám vào `Customer` thay vì `Service Request` | BA-V3 đã nêu nhưng chưa khóa vào ERD chuẩn | Sai dữ liệu sale, trùng khách hàng, khó tái bán | Critical | Chuẩn hóa lại CRM quanh `Service Request` |
| GAP-02 | CRM | Pipeline mới dừng ở cột trạng thái, chưa có playbook nhiệm vụ/owner/checklist/SLA | Wireframe có dynamic pipeline nhưng chưa xuống data model và backlog build | Không điều hành được công việc theo từng giai đoạn | Critical | Thêm `Stage Playbook + Task Template` |
| GAP-03 | Delivery | Chưa có `Task module` xuyên vai trò cho PM/Supervisor/worker profile | Code có checklist thi công nhưng không có task orchestration | Không kiểm soát được người làm, người duyệt, deadline, phụ thuộc | Critical | Tạo module `Project Task / Work Package` |
| GAP-04 | Delivery | Checklist thi công chưa đủ thay thế task quản lý dự án | V3 mới mạnh ở field checklist | PM thiếu công cụ quản lý ngoài hiện trường | High | Tách `Task` và `Checklist` thành 2 lớp |
| GAP-05 | CRM -> Delivery | Chưa có quy tắc convert rõ từ báo giá/hợp đồng sang project | Tài liệu và code còn song song nhiều cách | Dễ tạo project sai thời điểm hoặc thiếu dữ liệu | High | Khóa luồng `Quotation -> Contract -> Project` |
| GAP-06 | Quotation | Thiếu versioning báo giá, duyệt thắng/thua và lý do | Gap audit đã chạm tới nhưng chưa thành baseline | Mất lịch sử thương lượng, khó audit | High | Thiết kế `Quotation Version` |
| GAP-07 | Change management | Thiếu change order / thay đổi phạm vi sau ký | Gap audit mới khuyến nghị Phase 2 | Gây sai phạm vi, sai vật tư, sai thanh toán | High | Cho vào V4 tối thiểu ở mức controlled request |
| GAP-08 | Role model | Mô hình vai trò đang mâu thuẫn giữa V2, V3 và code, đặc biệt ở chỗ worker chưa có account nhưng tài liệu/code vẫn đang xen lẫn | V2 có 6 vai trò, V3 gom 4, code lại song song supervisor/worker | Sai phân quyền, sai tracking tác nghiệp hiện trường | Critical | Chốt role model V4 và mapping transition, dùng `Supervisor thao tác thay Worker` cho giai đoạn hiện tại |
| GAP-09 | Admin | Tồn tại đồng thời `admin-v2` trong app chính và `admin-app` riêng | Codebase hiện tại thể hiện rõ | Dễ tạo hai nguồn sự thật về cấu hình | High | Hợp nhất một control plane admin |
| GAP-10 | PM UX | Màn PM bị chia cắt giữa CRM, construction, inventory, finance và legacy routes | App hiện tại có route mới/cũ cùng tồn tại | PM không có workbench thống nhất | High | Thiết kế lại IA theo ngữ cảnh `Service Request` và `Project` |
| GAP-11 | Inventory | Chưa có reservation vật tư theo task/dự án | Mới có định mức và phiếu đề nghị/phiếu kho demo | Khó khóa vật tư cho thi công thật | High | Bổ sung `Material Reservation` |
| GAP-12 | Inventory | Thiếu flow đề nghị mua hàng/tái bổ sung kho | Gap audit chỉ mới đề cập xử lý offline | Dự án dễ bị nghẽn khi thiếu kho | Medium | Thêm `Purchase Request` tối thiểu |
| GAP-13 | Inventory | Thiếu đối soát xuất/nhập/hoàn kho và chênh lệch thực tế | Chưa có transaction engine thật | Không lên được báo cáo tồn kho đáng tin cậy | High | Thiết kế `Stock Transaction Ledger` |
| GAP-14 | Finance | Milestone mới dừng ở dashboard demo, chưa có công nợ phải thu/phải trả | Code dùng mock data | Không quản lý được tiền thật | Critical | Thiết kế `Payment Schedule + Transaction` |
| GAP-15 | Finance | Thiếu P&L dự án, dự toán vs thực tế, lãi gộp | Báo cáo tài chính mới ở mức mock | Ban lãnh đạo không có dữ liệu ra quyết định | High | Xây `Project Financial Snapshot` |
| GAP-16 | Acceptance | Biên bản nghiệm thu mới ở wireframe, chưa thành workflow chuẩn | BA-V3 có WF-ADD-07 nhưng code chưa có | Không có mốc đóng dự án hợp lệ | Critical | Bổ sung `Acceptance Record` |
| GAP-17 | Warranty | Bảo hành, bảo dưỡng, lịch nhắc mới dừng ở mô tả/wireframe và chưa nối đủ với tài chính | Route hiện tại còn `ComingSoon` | Không đóng vòng đời dịch vụ, không thấy được chi phí hậu mãi | High | Chuẩn hóa `Warranty Card`, `Warranty Case`, `Maintenance Visit` và financial impact |
| GAP-18 | Portal | Customer portal đã có page nhưng thiếu governance về token, access policy, dữ liệu công bố | Code là demo từ mockData | Rủi ro lộ dữ liệu hoặc dữ liệu không nhất quán | High | Thiết kế `PortalLink` và rule publish |
| GAP-19 | Notification | Thiếu notification engine và preference chống spam | Gap audit đã nêu | Người dùng sẽ bỏ qua hệ thống vì quá nhiều cảnh báo | Medium | Thêm notification policy và digest |
| GAP-20 | Audit | Audit log tổng hệ thống chưa phản ánh end-to-end business transaction | Có page admin nhưng chưa là ledger thật | Không truy vết được tranh chấp | High | Chuẩn hóa event/audit model |
| GAP-21 | File governance | Evidence/file chưa có version, retention, storage strategy, Google Drive sync và quyền truy cập chi tiết | BA-V2 có nói, code chưa có | Rủi ro lưu trữ, pháp lý và thất lạc dữ liệu cloud | High | Thiết kế `FileAsset`, `FileSyncJob`, `DriveFolderMap` chuẩn |
| GAP-22 | Reporting | Chưa có KPI dictionary, monthly report, cross-project report xuất chuẩn | Gap audit mới đề cập rời rạc | Không thể chuẩn hóa báo cáo quản trị | Medium | Xây `report catalog` và data mart logic |
| GAP-23 | Kỹ thuật | Phần lớn màn hình đang dùng `mockData`, thiếu service/store/API | Code hiện tại xác nhận | Prototype khó chuyển thành sản phẩm thật | Critical | Tạo lớp domain service và API contract |
| GAP-24 | Chất lượng | Chưa có UAT/regression backlog cho các flow chính | Tài liệu test gần như trống ở V2/V3 | Rủi ro build xong nhưng không go-live được | High | Tạo UAT backlog theo flow V4 |
| GAP-25 | Hồ sơ | Chưa có `dossier model` chuẩn theo vòng đời `đang triển khai / hoàn thiện / bảo trì / không làm` | Folder gốc khách hàng đang được quản lý theo bucket thủ công ngoài hệ thống | Khó lưu hồ sơ, khó tra cứu và dễ đứt mạch file | High | Chuẩn hóa `lifecycle bucket + dossier` trong BA-V4 |
| GAP-26 | Tài chính | Logic thanh toán đang mô tả quá cứng, chưa phản ánh nhiều mẫu lịch thanh toán, partial collection và giữ lại bảo hành | Hợp đồng mẫu, sổ doanh thu/chi phí và công nợ thực tế cho thấy nhiều pattern | Sai thực tế thu tiền, sai công nợ và sai báo cáo | Critical | Chuẩn hóa `payment template library + retention + collection status` |
| GAP-27 | Tài chính | Thiếu cost ledger theo công trình và luồng sổ quỹ/nguồn tiền cá nhân - công ty | Sổ quỹ và sheet doanh thu/chi phí đang theo dõi ngoài hệ thống | Không lên được lợi nhuận thực và thiếu kiểm soát nội bộ | Critical | Bổ sung `Project Cost Entry + Cash Book + approval flow` |
| GAP-28 | Chứng từ | Chưa chuẩn hóa đầy đủ bộ chứng từ thực tế gồm báo cáo tổng hợp, giao nhận, tạm ứng, đề nghị thanh toán, bảo trì | Tài nguyên gốc và dossier khách hàng cho thấy nhiều loại hồ sơ hơn BA hiện mô tả | Document automation dễ build thiếu bộ và sai luồng ký | High | Chuẩn hóa `document catalog + dossier checklist` |

## 3. Gap theo mối quan tâm của người dùng

### 3.1 Cấu hình Kanban Pipeline

Khoảng trống không chỉ nằm ở “đổi cột Kanban”, mà nằm ở toàn bộ lớp vận hành của mỗi chặng:

- nhiệm vụ con là gì
- ai phụ trách
- checklist nào bắt buộc
- deadline/SLA
- điều kiện hoàn thành chặng
- tự động sinh task nào cho PM/Supervisor/worker profile

Đây là lý do V4 bắt buộc thêm `Stage Playbook`.

### 3.2 Task management cho PM, Supervisor, Worker profile

Hiện tại hệ thống mới có:

- checklist thi công
- review ảnh
- sự cố

Nhưng còn thiếu:

- task quản lý khảo sát
- task chốt báo giá/hợp đồng
- task chuẩn bị vật tư
- task nghiệm thu
- task bảo dưỡng
- task nội bộ của PM/Supervisor
- mô hình Supervisor cập nhật thay Worker nhưng vẫn truy vết đúng người thực hiện thực tế

### 3.3 Liên kết chặt giữa các module

Khoảng trống lớn nhất của bộ BA cũ là mô tả từng phần chức năng, nhưng chưa thiết kế đủ chặt mối liên hệ dữ liệu giữa:

- `Khách hàng`
- `Yêu cầu dịch vụ`
- `Báo giá`
- `Hợp đồng`
- `Dự án`
- `Task`
- `Kho`
- `Thanh toán`
- `Bảo hành`

### 3.4 Hồ sơ số và tài chính vận hành thực tế

Khoảng trống mới lộ rõ khi đối chiếu `Orignal-Requirements-Docs` là BA trước đây chưa mô tả đủ:

- bucket hồ sơ theo vòng đời khách hàng/công trình
- bộ chứng từ bắt buộc theo từng chặng
- thanh toán nhiều mẫu, thu nhiều lần, giữ lại bảo hành
- chi phí thực tế theo công trình và sổ quỹ
- phân vai tạo lệnh, duyệt lệnh và theo dõi dòng tiền

## 4. Kết luận ưu tiên

### Nhóm phải xử lý trước khi build tiếp

- GAP-01
- GAP-02
- GAP-03
- GAP-08
- GAP-14
- GAP-16
- GAP-23
- GAP-26
- GAP-27

### Nhóm xử lý song song trong giai đoạn build core

- GAP-05
- GAP-06
- GAP-10
- GAP-11
- GAP-13
- GAP-17
- GAP-18
- GAP-24
- GAP-25
- GAP-28

### Nhóm có thể vào wave sau nhưng phải được ghi vào thiết kế ngay

- GAP-07
- GAP-12
- GAP-19
- GAP-21
- GAP-22
