# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 05 - INVENTORY, PROCUREMENT AND ASSETS (CODEBASE-FIRST)

## PHAN 1: SO SANH GAP (CURRENT CODEBASE vs Current Backend)

| Thuoc tinh | Codebase hien tai dang dung | Backend hien tai | Gap/Issue | Priority |
|------------|----------------------------|------------------|-----------|----------|
| Material standards | PM MaterialPlan va InventoryCatalog dung mockStandards / MaterialStandard | Chua co schema MaterialStandard | Thieu dinh muc vat tu de tinh nhu cau theo loai cong trinh | High |
| Distributor | Accountant co DistributorList va mock distributors | Chua co schema Distributor | Thieu nha phan phoi la entity that su trong UI | High |
| Stock request | PM tao REQUEST_OUT / REQUEST_IN, Ke toan convert sang phieu kho | Chua co schema StockRequest | Thieu aggregate yeu cau kho chinh cua codebase | High |
| Stock order detail | UI detail can items, requested/issued/received qty, signatures, history, pdfUrl, source, project/journey bridge | StockOrder backend moi co 8 field rat mong | Schema hien tai khong du de map workflow thuc te | High |
| Material receipt | GS MaterialReceipt co kiem dem, chup anh, ky nhan | Chua co schema rieng | Receipt hien la UI only, chua co audit entity | High |
| Asset allocation detail | UI can projectName, requestedById, signatures, history, return flow | AssetAllocation backend chua co project bridge va nested process data | Chua du de map quy trinh cap phat tai san thuc te | High |
| Journey materials tab | journey.ts co material_need_status, key_material_summary, procurement_alert_count, asset_need_summary, stock_risk_summary | Journey backend chua co bo summary nay | Thieu lop tong hop de map tab vat tu/tai san | Medium |
| Warehouse | Khong co entity ro rang trong codebase | Chua co schema | Chua co bang chung de tao o Group 05 | Low |
| PurchaseRequest | Khong co approval flow mua hang rieng trong codebase | Chua co schema | Khong nen suy dien schema som | Low |
| Remainder recovery | Khong co UI/data thuc te cho phan du hoan nhap | Chua co schema | Khong nen tao som | Low |

## PHAN 2: CHIEN LUOC THIET KE UU TIEN THEO CODEBASE

### A. KEEP & HARDEN: MaterialGroup / Material / AssetGroup / Asset
- MaterialGroup va AssetGroup co the giu lai.
- Material nen duoc bridge day du voi group_id, category va stock fields hien co.
- Asset co the giu lai, khong doi aggregate.

### B. CREATE: MaterialStandard
- Fields chinh: material_id -> Material, material_name, construction_type, usage_per_m2, note.

### C. CREATE: Distributor
- Fields chinh: code, name, phone, address, email, categories (Tags).

### D. CREATE: StockRequest
- Fields chinh: code, type, requested_by, journey_id, project_id, project_name, items (nested), reason, status, reviewed_by, reviewed_at, review_note, converted_order_id, created_at.
- Nested items: material_id, material_name, unit, requested, note.

### E. UPDATE: StockOrder
- Giu cac field hien co: code, type, status, journey_id, source, supplier, total_value, notes.
- Them: project_id, project_name, journey_code, source_id, created_by, created_at, signed_by, signed_at, pdf_url, discrepancy_status, request_id, items (nested), signatures (nested), history (nested).

### F. CREATE: MaterialReceiptConfirmation
- Fields chinh: stock_order_id -> StockOrder, journey_id -> Journey, project_id -> Project, receiver_user, receipt_time, checked_items (nested), evidence_files, signature_data_url, receipt_status, note.

### G. UPDATE: AssetAllocation
- Giu: code, asset_id, journey_id, requested_by, request_date, expected_return_date, actual_return_date, status, notes.
- Them: project_id, project_name, requested_by_id, asset_name, asset_code, signatures (nested), history (nested).

### H. UPDATE: Journey
- Bo sung field tong hop vat tu/tai san: material_need_status, key_material_summary, procurement_alert_count, asset_need_summary, stock_risk_summary.

### I. DEFER
- Warehouse, StockReservation, PurchaseRequest, RemainderLot, RemainderRecovery.

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
+-----------------------------------------------------------+
|  Inventory / Asset Bridge                                 |
+-----------------------------------------------------------+
| [Journey] [HT-2026-xxx] [Project] [optional]              |
| [Material need status] [____] [Procurement alerts] [__]   |
| [Key material summary _________________________________]   |
|                                                           |
| StockRequest                                               |
| [Type REQUEST_OUT/IN] [Requested by] [Reviewed by]        |
| items[]: material / requested / note                      |
|                                                           |
| StockOrder                                                 |
| [Source] [Distributor/Project] [Status] [PDF]             |
| items[]: requested / issued / received / discrepancy      |
| signatures[] + history[]                                  |
|                                                           |
| MaterialReceiptConfirmation                                |
| [StockOrder] [Receiver] [Receipt status]                  |
| checked_items[] + evidence_files + signature              |
+-----------------------------------------------------------+
```

Ghi chu quyet dinh pham vi:
- Group 05 uu tien fill dung cac aggregate ma frontend dang co, khong tao procurement universe moi.
- MaterialReceiptConfirmation la entity moi vi UI da co hanh vi receipt xac nhan that su.
- Warehouse/PurchaseRequest/Remainder* se chi tao khi codebase cho thay no la flow that.
