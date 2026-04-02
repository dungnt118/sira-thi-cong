# Screen Inventory - Accountant V4

## 1. Mục tiêu

Liệt kê đầy đủ các màn hình Accountant cần có trong V4 và đối chiếu với:

- route/page hiện có trong codebase
- menu/layout Accountant hiện có
- phạm vi nghiệp vụ mới của BA-V4

## 2. Quy ước trạng thái

- `Đã có prototype`: đã có route hoặc page tương đối rõ trong codebase
- `Có một phần`: có route/page nhưng mới chạm một phần nghiệp vụ
- `Chưa có`: chưa thấy page phù hợp hoặc mới dừng ở ý tưởng

## 3. Nhóm Dashboard & Inbox

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-01 | Finance Command Center | Tổng hợp thu, chi, quỹ, tồn kho, cảnh báo | Menu hiện tại dùng `/kt/dashboard` nhưng đang render `InventoryDashboard` | Có một phần |
| ACC-02 | Accountant Inbox | Gom việc chờ xác nhận thu, chờ duyệt chi, chờ ký kho, chờ đối soát | Chưa thấy page riêng | Chưa có |
| ACC-03 | Exception Center | Theo dõi quá hạn, thiếu chứng từ, lệch quỹ, retention sắp đến hạn | Chưa thấy page riêng | Chưa có |

## 4. Nhóm Receivables & Collections

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-04 | Payment Schedule List | Danh sách đợt thanh toán theo project/hợp đồng | `/kt/finance/milestones` - `src/pages/kt/Finance/PaymentDashboard.tsx` | Đã có prototype |
| ACC-05 | Receivable Detail | Xem chi tiết milestone, đã thu, còn lại, chứng từ | Chưa thấy page riêng | Chưa có |
| ACC-06 | Confirm Collection Drawer | Xác nhận thu tiền với số tiền, ngày thu, tham chiếu, chứng từ | Có modal đơn giản trong `PaymentDashboard.tsx` | Có một phần |
| ACC-07 | Overdue Queue | Danh sách công nợ quá hạn và hành động follow-up | Chưa thấy page riêng | Chưa có |
| ACC-08 | Retention Schedule | Theo dõi khoản giữ lại bảo hành và điều kiện giải tỏa | Chưa thấy page riêng | Chưa có |
| ACC-09 | Collection History | Lịch sử các lần thu theo milestone | Chưa thấy page riêng | Chưa có |

## 5. Nhóm Disbursement & Cash Control

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-10 | Disbursement Queue | Hàng đợi yêu cầu chi/lệnh chi | Chưa thấy page riêng | Chưa có |
| ACC-11 | Payment Request Detail | Xem lý do chi, nguồn chi, project, chứng từ | Chưa thấy page riêng | Chưa có |
| ACC-12 | Approval Panel | Duyệt lệnh chi theo tài khoản công ty/cá nhân | Chưa thấy page riêng | Chưa có |
| ACC-13 | Cash Book Workspace | Sổ quỹ tiền mặt, dòng tiền, số dư chạy | Chưa thấy page riêng | Chưa có |
| ACC-14 | Fund Account List | Danh sách nguồn tiền và rule duyệt | Chưa thấy page riêng | Chưa có |
| ACC-15 | Daily Fund Balance | Xem số dư theo ngày và theo scope | Chưa thấy page riêng | Chưa có |

## 6. Nhóm Project Cost Ledger

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-16 | Project Cost Entry List | Danh sách chi phí theo công trình | Chưa thấy page riêng | Chưa có |
| ACC-17 | Cost Entry Create/Edit | Tạo hoặc cập nhật chi phí thực tế | Chưa thấy page riêng | Chưa có |
| ACC-18 | Cost Approval Queue | Duyệt/return chi phí | Chưa thấy page riêng | Chưa có |
| ACC-19 | Cost Ledger Detail | Xem ledger chi phí của một công trình | Chưa thấy page riêng | Chưa có |
| ACC-20 | Margin Variance View | So planned/estimated với actual | Chưa thấy page riêng | Chưa có |
| ACC-20A | Internal Price Book | Quản lý bảng giá nội bộ theo thời gian/khu vực | Chưa thấy page riêng | Chưa có |
| ACC-20B | Estimate Cost Review | Review giá vốn dự kiến và dữ liệu go/no-go | Chưa thấy page riêng | Chưa có |

## 7. Nhóm Inventory & Stock Documents

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-21 | Inventory Dashboard | Tổng quan vật tư, cảnh báo thiếu, giá trị kho | `/kt/dashboard`, `/kt/inventory/materials` - `src/pages/kt/Inventory/Dashboard.tsx` | Đã có prototype |
| ACC-22 | Material Catalog | Danh mục vật tư và tồn kho hiện tại | Tab trong `Inventory/Dashboard.tsx` | Có một phần |
| ACC-23 | Stock Out Document | Phiếu xuất kho | `/kt/inventory/stock-out` - `ComingSoon` | Có một phần |
| ACC-24 | Stock In Document | Phiếu nhập kho | `/kt/inventory/stock-in` - `ComingSoon` | Có một phần |
| ACC-25 | Stock History | Lịch sử xuất/nhập | `/kt/inventory/history` - `ComingSoon` | Có một phần |
| ACC-26 | Inventory Value Detail | Xem giá trị kho theo vật tư/nhóm vật tư | Chưa thấy page riêng | Chưa có |
| ACC-27 | Pending Signature Queue | Phiếu kho chờ Giám sát ký nhận | Chưa thấy page riêng | Chưa có |
| ACC-28 | Issue-to-Kỹ thuật Reconciliation | Đối soát vật tư cấp đến kỹ thuật profile | Chưa thấy page riêng | Chưa có |
| ACC-28A | Asset Registry | Quản lý tài sản thi công có thu hồi | Chưa thấy page riêng | Chưa có |
| ACC-28B | Asset Return Queue | Hàng đợi thu hồi tài sản từ công trình | Chưa thấy page riêng | Chưa có |
| ACC-28C | Remainder Lot Detail | Quản lý phần dư vật tư còn dùng được | Chưa thấy page riêng | Chưa có |

## 8. Nhóm Warranty, Maintenance & Aftersales

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-29 | Warranty Card List | Danh sách phiếu bảo hành | `/kt/warranty/cards` - `ComingSoon` | Có một phần |
| ACC-30 | Warranty Schedule | Lịch nhắc bảo hành/bảo trì | `/kt/warranty/schedule` - `ComingSoon` | Có một phần |
| ACC-31 | Warranty/Maintenance Case Finance | Theo dõi chi phí hậu mãi và khoản phải thu | Chưa thấy page riêng | Chưa có |
| ACC-32 | Aftersales Billing | Tạo và theo dõi billing cho bảo trì tính phí | Chưa thấy page riêng | Chưa có |
| ACC-33 | Retention Release Queue | Hàng đợi giải tỏa retention | Chưa thấy page riêng | Chưa có |
| ACC-33A | Portal Payment Thread Review | Xem trao đổi portal liên quan tới thanh toán/bảo hành | Chưa thấy page riêng | Chưa có |

## 9. Nhóm Reports, Reconciliation & Audit

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-34 | Financial Report Center | Báo cáo tài chính theo nhiều lát cắt | `/kt/finance/report` - `ComingSoon` | Có một phần |
| ACC-35 | Summary Reports | Báo cáo tổng hợp kế toán | `/kt/reports` - `ComingSoon` | Có một phần |
| ACC-36 | Reconciliation Workspace | Đối soát giao dịch, quỹ, chứng từ | Chưa thấy page riêng | Chưa có |
| ACC-37 | AR Aging Report | Báo cáo công nợ theo tuổi nợ | Chưa thấy page riêng | Chưa có |
| ACC-38 | Cash Book Report | Sổ quỹ tiền mặt theo kỳ | Chưa thấy page riêng | Chưa có |
| ACC-39 | Inventory Valuation Report | Báo cáo giá trị kho | Chưa thấy page riêng | Chưa có |
| ACC-40 | Financial Audit Log | Audit trail cho thao tác tài chính | Chưa thấy page riêng | Chưa có |

## 10. Nhóm Financial Dossier & Documents

| ID | Tên màn | Mục tiêu | Route/prototype hiện có | Trạng thái |
|---|---|---|---|---|
| ACC-41 | Financial Dossier List | Xem hồ sơ thanh toán/chứng từ số theo project | Chưa thấy page riêng | Chưa có |
| ACC-42 | Payment Request Generator | Tạo đề nghị thanh toán/tạm ứng từ template | Chưa thấy page riêng | Chưa có |
| ACC-43 | Document Record Detail | Xem file phát hành, file ký, trạng thái ký | Chưa thấy page riêng | Chưa có |
| ACC-44 | E-sign Status | Theo dõi trạng thái ký chứng từ tài chính | Chưa thấy page riêng | Chưa có |

## 11. Kết luận về hiện trạng prototype

Prototype hiện tại của Accountant mới chạm mạnh vào 2 vùng:

1. `Kho vật tư`
2. `Theo dõi đợt thanh toán`

Những vùng còn hở lớn nhất so với BA-V4 là:

- `sổ quỹ`
- `lệnh chi và approval`
- `project cost ledger`
- `đối soát`
- `retention`
- `aftersales billing`
- `hồ sơ tài chính số`

Nghĩa là codebase hiện tại chưa thể phản ánh đầy đủ vai trò Accountant theo mô hình vận hành thật của BAC Group.
