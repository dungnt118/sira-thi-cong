# Kết quả Phase 2 - Import seed lên hệ thống

## Trạng thái tổng quan

- Mục tiêu: import batch seed trong `TODOS/SeedData` lên tenant BAC và khép kín các liên kết nghiệp vụ trọng yếu.
- Kết quả hiện tại: đã import thành công `47` schema business/cấu hình của batch chuẩn.
- Các điểm đã được đóng trong wave này:
  - `SalesPipeline`
  - `PipelineStage`
  - `PortalDocument`
  - `CustomerJourneySetting`

## Các schema đã import thành công

- Cấu hình nền và danh mục dùng chung:
  - `SalesPipeline`
  - `PipelineStage`
  - `MasterDataCategory`
  - `MasterDataItem`
  - `CustomerJourneySetting`
  - `Customer`
  - `MaterialGroup`
  - `AssetGroup`
  - `Material`
  - `Asset`
  - `Distributor`
  - `ChecklistTemplate`
  - `EstimateTemplate`
  - `MaterialStandard`
  - `QuotationMappingRule`
- Sale, khảo sát và báo giá:
  - `Journey`
  - `ServiceRequest`
  - `SurveyAppointment`
  - `SurveyRecord`
  - `Quotation`
  - `QuotationLineItem`
- Thi công và hiện trường:
  - `Project`
  - `ProjectAssignment`
  - `StockRequest`
  - `StockOrder`
  - `MaterialReceiptConfirmation`
  - `AssetAllocation`
  - `SiteReport`
  - `IncidentReport`
  - `ActivityEvent`
- Bàn giao, bảo hành và portal:
  - `HandoverAcceptance`
  - `HandoverIssue`
  - `WarrantyCard`
  - `WarrantyCase`
  - `WarrantyVisit`
  - `WarrantyReminder`
  - `PortalThread`
  - `PortalMessage`
  - `PortalDocument`
  - `ProjectCloseoutPackage`
- Tài chính và công nợ:
  - `PaymentMilestone`
  - `PaymentReceipt`
  - `PaymentAdjustment`
  - `DebtConfirmation`
  - `DebtCollectionTask`
  - `SalesInvoice`
  - `ProjectSettlement`

## Các xử lý quan trọng đã hoàn tất

- Chuẩn hóa payload import sang object native cho `content_create_many`, `content_update_by_ids` và `content_save_setting`.
- Nhập thành công `SalesPipeline` mặc định và 4 `PipelineStage` chuẩn của funnel bán hàng.
- Vá ngược 3 bản ghi `ServiceRequest` seed chuẩn để trỏ đúng tới pipeline/stage live:
  - `SR-2026-001`
  - `SR-2026-002`
  - `SR-2026-003`
- Nhập thành công `PortalDocument` với `files = null` sau khi backend đã bỏ ràng buộc file bắt buộc.
- Ghi đè singleton `CustomerJourneySetting` bằng `content_save_setting` với cấu hình chuẩn 13 bước và trường `steps` làm nguồn cấu hình trung tâm.

## Dữ liệu live đã chốt sau import

- `SalesPipeline` mặc định:
  - `_id = 69c9e8391e264278da741a9c`
  - `name = Quy trình bán hàng mặc định`
- `PipelineStage`:
  - `69cb33f0c221ff64df94f222` - `Tiếp nhận lead`
  - `69cb33f0c221ff64df94f223` - `Khảo sát và tư vấn`
  - `69cb33f0c221ff64df94f224` - `Báo giá và thương lượng`
  - `69cb33f0c221ff64df94f225` - `Ký hợp đồng`
- `PortalDocument`:
  - `69cb34acc221ff64df94f22c`
  - `69cb34acc221ff64df94f22d`
- `CustomerJourneySetting`:
  - singleton chuẩn đã được overwrite lúc `2026-03-31T09:44:28.995+07:00`
  - `setting_key = default`
  - `version_label = v1.1`

## GAP còn lại sau Phase 2

- Không còn GAP import cho `PortalDocument` và `CustomerJourneySetting`.
- GAP còn sống hiện tại nằm ở metadata descriptor của `PortalDocument` và dữ liệu legacy ngoài batch seed. Xem chi tiết tại `SEED-GAP-PHASE2-BACKEND-DATA-20260330.md`.

