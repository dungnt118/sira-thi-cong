# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# Nhom 05 - Inventory, Procurement and Assets

Priority: P1

Muc tieu
- Bam sat logic codebase hien tai: stock request/order, material planning, material receipt, distributor, asset allocation.
- Mo rong schema inventory hien co thay vi tao moi qua nhieu schema suy dien.

Nen codebase/backend can tai su dung va doi chieu ky
- MaterialGroup
- Material
- StockOrder
- AssetGroup
- Asset
- AssetAllocation
- Journey

Pham vi gap-only uu tien theo codebase hien tai
- Create MaterialStandard de dung voi mockStandards va MaterialPlan/InventoryCatalog
- Create StockRequest de dung voi workflow PM -> Ke toan
- Create Distributor de dung voi DistributorList
- Create MaterialReceiptConfirmation de chinh thuc hoa MaterialReceipt UI
- Update StockOrder de co project bridge, items, signatures, history, source/source_id va lifecycle field day du
- Update AssetAllocation de co project bridge, requested_by_id, signatures, history va thong tin return day du
- Update Journey voi cac field tong hop vat tu/tai san dang co trong journey.ts
- Defer Warehouse, StockReservation, PurchaseRequest, RemainderLot, RemainderRecovery cho den khi codebase that su dung

Quan he chinh uu tien
- Material.group_id -> MaterialGroup
- MaterialStandard.material_id -> Material
- StockRequest.journey_id -> Journey
- StockRequest.project_id -> Project (optional bridge)
- StockOrder.journey_id -> Journey
- StockOrder.project_id -> Project (optional bridge)
- MaterialReceiptConfirmation.stock_order_id -> StockOrder
- AssetAllocation.asset_id -> Asset
- AssetAllocation.journey_id -> Journey
- AssetAllocation.project_id -> Project (optional bridge)

Slices MCP
1. Danh muc vat tu + dinh muc + distributor
2. Stock request / stock order / receipt confirmation
3. Asset allocation bridge + Journey material summary

Done when
- Frontend hien tai co the map duoc material plan, stock request/order, material receipt va asset allocation ma khong phai doi workflow.
- Backend co du schema cho flow PM -> Ke toan -> Giam sat va cho flow cap phat tai san.
- Khong tao them cac schema procurement/remainder neu codebase chua co cho dung.
