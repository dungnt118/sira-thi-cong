# Audit: Quản lý vật tư & Quản lý tài sản (Kế toán) — So khớp UI và schema backend

**Phiên bản tài liệu:** 1.0  
**Ngày cập nhật:** 2026-04-03  
**Phạm vi:** Portal Kế toán (`/kt`), menu **QL Vật tư** và **QL Tài sản** trong `AccountantV3Layout`.  
**Không nằm trong phạm vi:** Thanh toán, khoản chi, bảo hành (chỉ nhắc khi có liên quan chéo master data).

---

## 1. Nguồn xác minh (tránh suy diễn)

| Nguồn | Mục đích |
|--------|-----------|
| `src/layouts/AccountantV3Layout/index.tsx` | Cấu trúc menu KT. |
| `src/app/App.tsx` | Route thực tế gắn với từng màn. |
| Component dưới `src/pages/accountant/…` và `src/pages/shared/…` | Màn hình được mount cho `/kt`. |
| MCP BAC `schema-search` + `schema-get_relationships` (server **user-bac**) | Tên schema, mô tả nghiệp vụ, quan hệ tham chiếu đã cấu hình trên backend. |

**Lưu ý kỹ thuật:** Code UI hiện tại chủ yếu dùng **mock JSON + `localStorage`**; tài liệu này mô tả **ánh xạ nghiệp vụ dự kiến** (UI concept ↔ schema BAC), **không** khẳng định đã tích hợp GraphQL/API.

---

## 2. Phân tách vai trò (tránh conflict “ai tạo chứng từ”)

| Khái niệm backend | Ai thường khởi tạo | Kế toán thường làm gì |
|-------------------|-------------------|------------------------|
| `StockRequest` | PM (theo mô tả schema) | Review / xử lý trước khi có `StockOrder`. |
| `StockOrder` | Luồng nghiệp vụ (sau request hoặc nhập trực tiếp tùy quy trình) | Ghi nhận phiếu xuất/nhập, đối soát. |
| `MaterialReceiptConfirmation` | Giám sát / hiện trường | Đối chiếu với phiếu đã xuất — **không** thay cho phiếu kho. |
| `AssetAllocation` | Người yêu cầu (user được ủy quyền) | Theo dõi duyệt, điều phối tài sản. |
| `Material`, `MaterialGroup`, `Distributor`, `Asset`, `AssetGroup` | Master data (thường KT hoặc master data chung) | CRUD danh mục (schema `Distributor` ghi nhận CRUD trong UI kế toán). |

**Điểm dễ nhầm:** Menu KT có “Phiếu xuất/nhập” trực tiếp; backend vẫn có lớp `StockRequest`. **Không** coi `StockRequest` và `StockOrder` là một thực thể.

---

## 3. Quản lý vật tư — Theo từng màn hình

### 3.1. Bảng ánh xạ: Menu → Route → Component → Schema chính

| STT | Nhãn menu (KT) | Route | Component | Schema backend ánh xạ trực tiếp | Ghi chú audit |
|-----|----------------|-------|-----------|--------------------------------|---------------|
| 1 | Tổng quan | `/kt/dashboard` | `pages/accountant/Inventory/Dashboard.tsx` | `Material`, `MaterialGroup` | **Trùng màn** với “Danh mục vật tư” (cùng file). Không phải hai module backend khác nhau — tránh báo cáo “dashboard = schema riêng”. |
| 2 | Danh mục vật tư | `/kt/inventory/materials` | `…/Inventory/Dashboard.tsx` | `Material`, `MaterialGroup` | `Material.group_id` → `MaterialGroup`. |
| 3 | Nhà phân phối | `/kt/inventory/distributors` | `…/Inventory/DistributorList.tsx` | `Distributor` | Mô tả schema: NPP/NC cả **vật tư và tài sản**. |
| 4 | Phiếu xuất kho | `/kt/inventory/stock-out` | `pages/shared/OutboundForm.tsx` | `StockOrder` (loại xuất trong nghiệp vụ) | UI type `StockOrder` (mock). |
| 5 | Phiếu nhập kho | `/kt/inventory/stock-in` | `…/Inventory/InboundForm.tsx` | `StockOrder` (loại nhập), `Distributor` | Có nhánh nguồn NPP → `distributor_source_id` trên `StockOrder` (xem mục 5). |
| 6 | Lịch sử xuất/nhập | `/kt/inventory/history` | `…/Inventory/History.tsx` | `StockOrder` | Sổ liệt kê phiếu — khác với `ActivityEvent` (mục 4.2). |
| 7 | Chi tiết phiếu (theo id) | `/kt/inventory/order/:id` | `…/Inventory/StockOrderDetail.tsx` | `StockOrder` | Route tồn tại trên `App.tsx`. |

### 3.2. Schema liên quan nhưng **không** có mục menu riêng trên KT

| Schema | Vai trò | Rủi ro nếu bỏ qua |
|--------|---------|-------------------|
| `StockRequest` | Yêu cầu kho trước phiếu; `converted_order_id` → `StockOrder` | KT chỉ làm màn `StockOrder` sẽ **mất** bước review/hand-off từ PM. |
| `MaterialReceiptConfirmation` | Xác nhận nhận hàng tại công trường; `stock_order_id` → `StockOrder` | Không thay phiếu kho; dùng đối soát “đã đến tay công trường”. |
| `MaterialStandard` | Định mức theo loại thi công; `material_id` → `Material`, `construction_type` → `MasterDataItem` | Thuộc **kế hoạch/cảnh báo**, không phải chứng từ xuất nhập. |
| `EstimateTemplate` | Mẫu định mức chi phí (vật tư + nhân công) | Gắn **ước tính**, không thay thế tồn kho thực tế. |
| `Journey` | Tham chiếu chung cho phiếu / xác nhận | `StockOrder`, `StockRequest`, `MaterialReceiptConfirmation` đều có `journey_id`. |
| `Project` | `project_id` đánh dấu **legacy** trên một số schema | Tránh map song song `Journey` vs `Project` không thống nhất khi đọc báo cáo cũ. |

---

## 4. Quản lý tài sản — Theo từng màn hình

### 4.1. Bảng ánh xạ: Menu → Route → Component → Schema chính

| STT | Nhãn menu (KT) | Route | Component | Schema backend ánh xạ trực tiếp | Ghi chú audit |
|-----|----------------|-------|-----------|--------------------------------|---------------|
| 1 | Danh mục tài sản | `/kt/assets/list` | `pages/accountant/Assets/Dashboard.tsx` | `Asset`, `AssetGroup` | `Asset.group_id` → `AssetGroup`. |
| 2 | Yêu cầu cấp phát | `/kt/assets/allocation` | `pages/shared/AllocationForm.tsx` | `AssetAllocation`, `Asset` | Phiếu cấp phát / cho mượn. |
| 3 | Chi tiết cấp phát | `/kt/assets/allocation/:id` | `…/Assets/AssetAllocationDetail.tsx` | `AssetAllocation` | |
| 4 | Lịch sử cấp phát | `/kt/assets/allocation-history` | `…/Assets/AllocationHistory.tsx` | `AssetAllocation` | |
| 5 | Bảo trì & sửa chữa | `/kt/assets/maintenance` | `ComingSoon` | **Không xác định** từ `schema-search` (maintenance/repair) | **Gap:** UI chưa có; backend **chưa thấy** schema tên riêng cho “bảo trì CCDC”. Trạng thái trên `Asset` có thể phản ánh “đang bảo trì” — cần `get_schema(Asset)` khi triển khai. |

### 4.2. Quan hệ `Asset` ↔ `AssetAllocation` (tránh hiểu sai “một phiếu nhiều tài sản”)

Theo `schema-get_relationships`:

- `AssetAllocation` có `asset_id` → **một** `Asset` (mỗi bản ghi allocation gắn một tài sản).
- `Asset` có `current_allocation_id` → `AssetAllocation` và `assigned_journey_id` → `Journey`.

**Hệ quả nghiệp vụ:** UI mock hiện có thể tạo **nhiều** bản ghi allocation từ một form; backend quan hệ là **một allocation — một asset**. Cần thống nhất khi tích hợp API (một phiếu header + nhiều dòng vs nhiều bản ghi `AssetAllocation`).

### 4.3. Schema dễ nhầm với “bảo trì tài sản”

| Schema | Vì sao không nên gộp |
|--------|----------------------|
| `WarrantyCase`, `WarrantyVisit` | Bảo hành **sau bàn giao** khách hàng — khác với bảo trì nội bộ CCDC. |
| `WorkTask` | Nhiệm vụ vận hành chung — chỉ là “có thể” dùng cho workflow sửa chữa nếu BA thiết kế, **không** có trong kết quả tìm theo từ khóa bảo trì tài sản. |

---

## 5. Quan hệ tham chiếu đã xác minh (MCP `schema-get_relationships`)

### 5.1. `StockOrder`

| Thuộc tính | Trỏ tới | Ý nghĩa audit |
|------------|---------|----------------|
| `journey_id` | `Journey` | Liên kết hành trình. |
| `journey_source_id` | `Journey` | Hành trình nguồn (tách biệt với journey “chính” nếu có). |
| `request_id` | `StockRequest` | Truy vết từ yêu cầu kho. |
| `distributor_source_id` | `Distributor` | Nguồn nhập từ NPP. |
| `project_id` | `Project` | **Legacy** — cần thống nhất với `Journey` khi báo cáo. |
| Inbound | `MaterialReceiptConfirmation`, `StockRequest` | Các thực thể trỏ ngược về luồng kho. |

### 5.2. `StockRequest`

| Thuộc tính | Trỏ tới |
|------------|---------|
| `journey_id` | `Journey` |
| `converted_order_id` | `StockOrder` |
| `project_id` | `Project` (legacy) |
| Inbound | `StockOrder` |

### 5.3. `Material` / `MaterialGroup`

- `Material.group_id` → `MaterialGroup`.
- Inbound: `MaterialStandard` tham chiếu `Material`.

### 5.4. `MaterialReceiptConfirmation`

| Thuộc tính | Trỏ tới |
|------------|---------|
| `stock_order_id` | `StockOrder` |
| `journey_id` | `Journey` |

### 5.5. `Distributor`

- Inbound: `StockOrder`, **`BeneficiaryBankContact`**.

**Audit conflict tiềm ẩn:** Cùng một `Distributor` (hoặc thực thể đối tác) có thể xuất hiện trong **nhập hàng** (`StockOrder`) và **danh bạ thụ hưởng** thanh toán. Cần quy tắc nghiệp vụ: đồng nhất master hay tách; tránh cập nhật một nơi làm sai lệch nơi kia nếu đồng bộ ID.

### 5.6. `AssetAllocation` / `Asset`

- `AssetAllocation.asset_id` → `Asset`; `AssetAllocation.journey_id` → `Journey`; `project_id` legacy.
- `Asset.current_allocation_id` → `AssetAllocation`; `Asset.assigned_journey_id` → `Journey`.

---

## 6. Danh sách schema theo “tính năng menu” (tổng hợp)

### 6.1. QL Vật tư (theo menu KT)

- **Danh mục / tổng quan vật tư:** `Material`, `MaterialGroup`
- **Nhà phân phối:** `Distributor`
- **Xuất nhập & lịch sử & chi tiết phiếu:** `StockOrder`
- **Luồng đầy đủ (khuyến nghị khi tích hợp):** thêm `StockRequest`, `MaterialReceiptConfirmation`
- **Liên quan kế hoạch (không thay chứng từ kho):** `MaterialStandard`, `EstimateTemplate`
- **Ngữ cảnh hành trình:** `Journey`; **Legacy:** `Project`

### 6.2. QL Tài sản (theo menu KT)

- **Danh mục:** `Asset`, `AssetGroup`
- **Cấp phát / lịch sử / chi tiết:** `AssetAllocation`
- **Bảo trì & sửa chữa:** chưa có schema được xác định qua tìm kiếm; màn **ComingSoon**

---

## 7. Checklist gap / nhầm lẫn / conflict (audit cuối)

| # | Chủ đề | Mức độ | Ghi chú |
|---|--------|--------|---------|
| G1 | `StockRequest` vs `StockOrder` | Cao | Hai bảng, có `converted_order_id` / `request_id`. Không gộp báo cáo tồn kho chỉ từ một bên. |
| G2 | `ActivityEvent` vs lịch sử kho | Trung bình | `ActivityEvent` là timeline hành trình; **không** thay `StockOrder` cho đối soát số lượng. |
| G3 | Dashboard vs Danh mục vật tư | Trung bình | Cùng component — tránh mô tả BA như hai “màn nghiệp vụ độc lập”. |
| G4 | `project_id` legacy | Trung bình | Xuất hiện trên `StockOrder`, `StockRequest`, `AssetAllocation`. Thống nhất nguồn sự thật với `Journey`. |
| G5 | Bảo trì tài sản | Cao | UI chưa có; schema chuyên biệt chưa thấy — cần quyết định BA (trường trên `Asset` vs schema mới vs `WorkTask`). |
| G6 | `Distributor` vs `BeneficiaryBankContact` | Trung bình | Liên kết inbound trên schema — phân ranh giới **mua hàng** vs **chi tiền**. |
| G7 | Form dùng chung (`OutboundForm`, `AllocationForm`) | Thấp–Trung bình | Cùng route role khác nhau (GS/KT/Kỹ thuật); khi lên API cần phân quyền và tenant/context `Journey`. |
| G8 | PM cũng có menu “Kho vật tư” | Trung bình | `PMLayout` có luồng catalog/định mức/xuất — **cùng domain schema** nhưng **khác vai trò**; tránh duplicate master data không kiểm soát. |

---

## 8. Việc nên làm tiếp (không tự động thực hiện trong tài liệu này)

1. Gọi `schema-get` cho `StockOrder`, `Asset`, `AssetAllocation` để chốt **trường phân loại** phiếu xuất/nhập và trạng thái tài sản (enum thực tế).  
2. Xác nhận BA: màn KT có cần **danh sách `StockRequest` chờ duyệt** hay chỉ tạo/sửa `StockOrder` trực tiếp.  
3. Xác nhận BA: **Bảo trì tài sản** dùng mô hình dữ liệu nào để tránh trùng `Warranty*`.

---

*Tài liệu được tổng hợp từ mã nguồn repo BAC-GROUP và công cụ schema trên MCP BAC; khi backend thay đổi property/ref, cần chạy lại `schema-get_relationships` và cập nhật mục 5–7.*
