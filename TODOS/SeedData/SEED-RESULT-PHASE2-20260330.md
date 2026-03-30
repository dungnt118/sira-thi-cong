# Kết quả Phase 2 - Import seed lên hệ thống

## Trạng thái tổng quan

- Mục tiêu: import batch seed từ `TODOS/SeedData` lên BAC backend.
- Kết quả hiện tại: đã import thành công phần lớn batch business schema; blocker MCP write cũ không còn là trạng thái hiện hành cho nhóm schema `Multiple`.
- Tổng số schema đã import thành công: `43`.

## Các schema đã import thành công

- Cấu hình danh mục và master:
  - `MasterDataCategory`
  - `MasterDataItem`
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
  - `ProjectCloseoutPackage`
- Tài chính và công nợ:
  - `PaymentMilestone`
  - `PaymentReceipt`
  - `PaymentAdjustment`
  - `DebtConfirmation`
  - `DebtCollectionTask`
  - `SalesInvoice`
  - `ProjectSettlement`

## Các xử lý quan trọng đã thực hiện trong lúc import

- Chuẩn hóa payload import sang object native cho `content_create_many`; không còn dùng chuỗi JSON.
- Khép kín vòng phụ thuộc kho vận:
  - tạo `StockRequest` trước
  - tạo `StockOrder`
  - patch ngược `StockRequest.converted_order_id`
- Khép kín vòng phụ thuộc bảo hành:
  - tạo `HandoverIssue`
  - tạo `WarrantyCase`
  - tạo `WarrantyVisit`
  - patch ngược `HandoverIssue.linked_warranty_case_id`
  - patch ngược `WarrantyCase.latest_visit_id`
- Chuẩn hóa enum seed còn sót ở `StockRequest`, `StockOrder`, `MaterialReceiptConfirmation`, `AssetAllocation`, `IncidentReport`, `WarrantyReminder`.
- Chuẩn hóa metadata `PortalDocument.files` từ `required=true` về `required=false`; tuy nhiên validator runtime vẫn chưa cho seed bản ghi không có file thật.

## Phần chưa hoàn tất

- `PortalDocument` chưa import được.
  - Dù metadata đã đổi sang `required=false`, backend vẫn trả lỗi `Tập tin không được để trống` khi gửi `null`, `[]` hoặc bỏ field.
- `CustomerJourneySetting` chưa được chốt lại trong Phase 2 này.
  - Bản ghi singleton hiện có là dữ liệu probe cũ, root field đang `null` và nested field chứa giá trị `EVIDENCE_*`.

## Tài liệu liên quan

- GAP backend-data còn lại: `SEED-GAP-PHASE2-BACKEND-DATA-20260330.md`
- Gap nghiệp vụ tham chiếu schema/quan hệ: `SEED-GAP-BACKEND-REFERENCES-AND-UPLOADS-20260330.md`
