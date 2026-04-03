# Xử lý gap nghiệp vụ kho / log / tài sản (2026-04-03)

Tài liệu ghi nhận thay đổi theo quyết định BA: gộp yêu cầu kho vào `StockOrder`, loại bỏ vai trò `ActivityEvent`, chuẩn hóa `journey_id`, thêm phiếu bảo trì tài sản, tách dashboard kế toán.

---

## G1 — Gộp StockRequest → StockOrder (BAC MCP)

**Đã làm trên backend (server `user-bac`):**

| Hành động | Chi tiết |
|-----------|----------|
| Bổ sung trường trên `StockOrder` | `requested_by`, `reviewed_by`, `reviewed_at`, `review_note`, `request_reason` (nhóm form *Luồng yêu cầu & duyệt*). |
| Deprecated + ẩn form | `request_id`: `isDeprecated=true` và `editor=Hidden` (MCP). Không dùng cho bản ghi mới. |
| Luồng nghiệp vụ | Giữ `status` hiện có (`draft` → `requested` → `approved` → …) + nested `history` để thay cho bảng yêu cầu riêng. |
| `StockRequest` | **Toàn bộ thuộc tính (gốc + nested `items.*`) đã `isDeprecated=true` qua MCP** — không dùng cho biểu mẫu/nghiệp vụ mới. Schema/collection vẫn tồn tại (MCP không có xóa schema): sau migrate dữ liệu → xóa thủ công trên BAC Studio nếu cần. |

**Ánh xạ gợi ý khi migrate dữ liệu cũ:**

- `StockRequest.type` `request_out` / `request_in` → `StockOrder.type` `out` / `in`.
- `StockRequest.status` `pending` → `StockOrder.status` `requested`; `approved` → `approved`; `rejected` → `cancelled` + `review_note`; `converted` → bản ghi đích đã có `converted_order_id` (gộp vào một `StockOrder` duy nhất nếu trùng nội dung).

---

## G2 — ActivityEvent

- Trên tenant đã verify: schema `ActivityEvent` **không tồn tại** (`schema-get` trả lỗi).
- `JourneyStepLog.activity_event_id`: **deprecated** + **`editor=Hidden`** (MCP).
- Frontend: `activityEventService` giữ nguyên toàn bộ hàm, thêm JSDoc `@deprecated`.

---

## G3 — Dashboard kế toán

- `/kt/dashboard` → `AccountantOverviewDashboard` (tổng hợp + điều hướng).
- `/kt/inventory/materials` → `InventoryDashboard` (danh mục vật tư, không đổi logic mock).

---

## G4 — `project_id`

- `StockOrder` (bản schema hiện tại): **không còn** thuộc tính `project_id` trên định nghĩa MCP (đã chuẩn hóa `journey_id`).
- `AssetAllocation`: `project_id`, `project_name` đã **deprecated** từ trước; nghiệp vụ chuẩn dùng `journey_id` / `journey_name`.
- Types GraphQL repo: `IStockOrder.project_id` / `request_id` gắn JSDoc `@deprecated` để khớp dữ liệu/DTO cũ nếu còn.

---

## G5 — Phiếu bảo trì tài sản

**Schema mới:** `AssetMaintenanceTicket` (`collection`: `assetmaintenanceticket`)

- `asset_id` → `Asset` (bắt buộc)
- `maintenance_partner_id` → `Distributor` (tùy chọn)
- `responsible_user` (AuthorizedUser)
- `maintenance_date`, `completed_at`, `cost_amount`, `status` (`planned` | `in_progress` | `completed` | `cancelled`), `journey_id`, `notes`, `code`

**depended_schemas:** trên `Asset` đã thêm tab **Phiếu bảo trì** (lọc theo `asset_id`).

**UI web:** `/kt/assets/maintenance` vẫn placeholder `ComingSoon` với mô tả trỏ backend; màn CRUD sẽ nối API sau.

---

## Việc còn lại (ngoài phạm vi MCP lần này)

1. Migrate + ẩn/xóa schema `StockRequest` theo quy trình admin BAC.
2. Cập nhật seed `TODOS/SeedData/*` (bỏ `request_id` trỏ StockRequest; bỏ seed `ActivityEvent` nếu không dùng).
3. PM màn `StockRequestOut` / `StockRequestIn`: chuyển sang tạo `StockOrder` với `status=requested`.
4. Regenerate DTO GraphQL server nếu pipeline yêu cầu đồng bộ tên trường mới (đã thêm field vào `stockOrder.queries.ts` phía client).

---

*Verify: `schema-get(StockOrder)`, `schema-get(AssetMaintenanceTicket)`, `schema-get(JourneyStepLog)` sau thay đổi.*
