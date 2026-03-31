# SeedData Index

## Cập nhật wave hợp nhất ngày 2026-03-31

- `Journey` là schema runtime trung tâm duy nhất cho toàn bộ vòng đời lead, khảo sát, báo giá, triển khai, bàn giao, thanh toán và bảo hành.
- `CustomerJourneySetting` vẫn là singleton bắt buộc và là nguồn sự thật duy nhất cho 13 bước canonical.
- `SalesPipeline` và `PipelineStage` vẫn được giữ lại như catalog vi mô cho lớp bán hàng đầu hành trình.
- `ServiceRequest` và `Project` đã bị loại khỏi bộ seed runtime canonical; hai schema này chỉ còn vai trò lịch sử để phục vụ cleanup dữ liệu cũ trên tenant.
- Toàn bộ seed runtime canonical phải bám `journey_id`; không tiếp tục dùng `service_request_id` hoặc `project_id` trong JSON seed chuẩn.
- Các field hiển thị chuẩn mới dùng `journey_name` thay cho `project_name` ở các schema vận hành đã chuẩn hóa.
- `StockOrder` seed chuẩn dùng `journey_source_id` / `distributor_source_id`; không còn dùng `source_id`.
- Xem trạng thái cleanup dữ liệu legacy tại `TODOS/GAP-JOURNEY-CONSOLIDATION-MIGRATION-20260331.md`.

## Mục đích

- Chốt bộ seed JSON theo kiến trúc `Journey`-centric của BAC.
- Dùng backend schema làm nguồn sự thật duy nhất khi chọn field, propType, enum và quan hệ.
- Giữ dữ liệu seed bám sát nghiệp vụ BAC, dùng tiếng Việt có dấu và đủ ba lát cắt chính:
  - đang báo giá
  - đang triển khai
  - đã bàn giao kèm bảo hành

## Nguồn tham chiếu chính

- `documents/BA-V4/01-Business-Requirements/BRD_v4.md`
- `documents/BA-V4/01-Business-Requirements/BA_Journey_Workflow_Settings_v4.md`
- `documents/BA-V4/01-Business-Requirements/Customer_Journey_Sale_HanhChinh_Analysis_v4.md`
- `documents/BA-V4/01-Business-Requirements/Warranty_Finance_Lifecycle_v4.md`
- `documents/BA-V4/01-Business-Requirements/Customer_Portal_Communication_Evidence_v4.md`
- `documents/BA-V4/01-Business-Requirements/Preconstruction_Estimation_and_Quotation_v4.md`
- `documents/BA-V4/01-Business-Requirements/Asset_Consumable_Recovery_v4.md`
- `documents/Orignal-Requirements-Docs`

## Kịch bản seed chính

- `JRN-2026-001`: Nhà anh Kiên tại Vĩnh Hưng, đã chốt bán hàng và đang triển khai thi công chống thấm.
- `JRN-2026-002`: Nhà anh Dương tại Vĩnh Hưng, đã bàn giao, đã quyết toán và đang ở pha bảo hành.
- `JRN-2026-003`: Khách sạn MayFair, đã khảo sát và đang trao đổi báo giá trên portal.

## Quy ước placeholder

- Placeholder quan hệ dùng mẫu `{{Schema._id::business_key}}`.
- `business_key` ưu tiên theo `code` nếu schema có `code`.
- Với schema không có `code`, dùng khóa nghiệp vụ ổn định đã chốt trong batch seed. Các khóa hiện dùng:
  - `MaterialGroup.name`
  - `AssetGroup.name`
  - `SalesPipeline.name`
  - `PipelineStage.name`
  - `QuotationMappingRule.rule_name`
  - `PortalThread.thread_code`
  - `PaymentMilestone.journey_code`
- Với `MasterDataItem`, dùng khóa chuẩn hóa theo mẫu `category_code.value`, ví dụ:
  - `{{MasterDataItem._id::service_type.waterproofing}}`
  - `{{MasterDataItem._id::construction_type.rooftop_waterproofing}}`
- Trước khi import thật, phải resolve toàn bộ placeholder sang `_id` live.

## Danh mục file seed

### 1. Cấu hình nền và danh mục dùng chung
| File | Schema | Vai trò |
| --- | --- | --- |
| `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260331.json` | `CustomerJourneySetting` | Cấu hình mặc định 13 bước hành trình khách hàng, đã gồm `roles` và `checklist`, dùng cho `content_save_setting` |
| `SalesPipeline-SEED-20260329.json` | `SalesPipeline` | Pipeline bán hàng mặc định |
| `PipelineStage-SEED-20260329.json` | `PipelineStage` | 4 giai đoạn bán hàng và ánh xạ `journey_step_code` |
| `MasterDataCategory-SEED-20260329.json` | `MasterDataCategory` | Nhóm danh mục dùng chung |
| `MasterDataItem-SEED-20260329.json` | `MasterDataItem` | Giá trị danh mục dùng chung |
| `Customer-SEED-20260330.json` | `Customer` | Khách hàng mẫu cho toàn bộ flow |
| `MaterialGroup-SEED-20260330.json` | `MaterialGroup` | Nhóm vật tư |
| `AssetGroup-SEED-20260330.json` | `AssetGroup` | Nhóm tài sản và thiết bị |
| `Material-SEED-20260330.json` | `Material` | Vật tư thi công và vật tư phụ trợ |
| `Asset-SEED-20260330.json` | `Asset` | Máy móc, thiết bị, dụng cụ |
| `Distributor-SEED-20260330.json` | `Distributor` | Nhà phân phối và nhà cung cấp |
| `ChecklistTemplate-SEED-20260330.json` | `ChecklistTemplate` | Mẫu checklist thi công theo loại thi công |
| `EstimateTemplate-SEED-20260330.json` | `EstimateTemplate` | Mẫu hạng mục định mức chi phí |
| `MaterialStandard-SEED-20260330.json` | `MaterialStandard` | Định mức vật tư theo m² và loại thi công |
| `QuotationMappingRule-SEED-20260330.json` | `QuotationMappingRule` | Quy tắc mapping line item báo giá |

### 2. Hành trình, khảo sát và báo giá
| File | Schema | Vai trò |
| --- | --- | --- |
| `Journey-SEED-20260330.json` | `Journey` | Bản ghi nghiệp vụ trung tâm duy nhất của hệ thống |
| `SurveyAppointment-SEED-20260330.json` | `SurveyAppointment` | Lịch hẹn khảo sát |
| `SurveyRecord-SEED-20260330.json` | `SurveyRecord` | Biên bản khảo sát hiện trạng |
| `Quotation-SEED-20260330.json` | `Quotation` | Hồ sơ báo giá |
| `QuotationLineItem-SEED-20260330.json` | `QuotationLineItem` | Dòng hạng mục báo giá |

### 3. Triển khai, kho vận và hiện trường
| File | Schema | Vai trò |
| --- | --- | --- |
| `ProjectAssignment-SEED-20260330.json` | `ProjectAssignment` | Phân công nhân sự theo vai trò trên hành trình |
| `StockRequest-SEED-20260330.json` | `StockRequest` | Yêu cầu xuất hoặc nhập vật tư |
| `StockOrder-SEED-20260330.json` | `StockOrder` | Phiếu xuất và phiếu nhập kho |
| `MaterialReceiptConfirmation-SEED-20260330.json` | `MaterialReceiptConfirmation` | Xác nhận nhận hàng tại công trình hoặc kho |
| `AssetAllocation-SEED-20260330.json` | `AssetAllocation` | Cấp phát tài sản cho hành trình |
| `SiteReport-SEED-20260330.json` | `SiteReport` | Nhật ký và báo cáo hiện trường |
| `IncidentReport-SEED-20260330.json` | `IncidentReport` | Sự cố vật tư, kỹ thuật và rủi ro tại hiện trường |
| `ActivityEvent-SEED-20260330.json` | `ActivityEvent` | Log hoạt động quan trọng theo hành trình |

### 4. Bàn giao, bảo hành và portal
| File | Schema | Vai trò |
| --- | --- | --- |
| `HandoverAcceptance-SEED-20260330.json` | `HandoverAcceptance` | Biên bản nghiệm thu và bàn giao |
| `HandoverIssue-SEED-20260330.json` | `HandoverIssue` | Vấn đề sau bàn giao |
| `WarrantyCard-SEED-20260330.json` | `WarrantyCard` | Thẻ bảo hành công trình |
| `WarrantyCase-SEED-20260330.json` | `WarrantyCase` | Ca bảo hành |
| `WarrantyVisit-SEED-20260330.json` | `WarrantyVisit` | Lịch và kết quả đi bảo hành |
| `WarrantyReminder-SEED-20260330.json` | `WarrantyReminder` | Tin nhắc chăm sóc bảo hành |
| `PortalThread-SEED-20260330.json` | `PortalThread` | Chủ đề trao đổi trên portal |
| `PortalMessage-SEED-20260330.json` | `PortalMessage` | Tin nhắn trao đổi trên portal |
| `PortalDocument-SEED-20260330.json` | `PortalDocument` | Tài liệu portal, seed với `files = null` |

### 5. Tài chính, công nợ và đóng hồ sơ
| File | Schema | Vai trò |
| --- | --- | --- |
| `PaymentMilestone-SEED-20260330.json` | `PaymentMilestone` | Đợt thanh toán theo hành trình |
| `PaymentReceipt-SEED-20260330.json` | `PaymentReceipt` | Phiếu thu tiền |
| `PaymentAdjustment-SEED-20260330.json` | `PaymentAdjustment` | Điều chỉnh kỳ thanh toán |
| `DebtConfirmation-SEED-20260330.json` | `DebtConfirmation` | Biên bản xác nhận công nợ |
| `DebtCollectionTask-SEED-20260330.json` | `DebtCollectionTask` | Tác vụ nhắc thu hồi công nợ |
| `SalesInvoice-SEED-20260330.json` | `SalesInvoice` | Hóa đơn bán hàng và VAT |
| `ProjectSettlement-SEED-20260330.json` | `ProjectSettlement` | Quyết toán hành trình triển khai |
| `ProjectCloseoutPackage-SEED-20260330.json` | `ProjectCloseoutPackage` | Gói hồ sơ đóng hành trình |

## Trình tự import đề xuất

1. Import nhóm cấu hình nền:
   - `SalesPipeline`
   - `PipelineStage`
   - `MasterDataCategory`
   - `MasterDataItem`
   - `CustomerJourneySetting`
2. Import nhóm master:
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
3. Resolve placeholder master và import `Journey`.
4. Import nhóm khảo sát và báo giá:
   - `SurveyAppointment`
   - `SurveyRecord`
   - `Quotation`
   - `QuotationLineItem`
5. Import nhóm triển khai, kho vận và hiện trường.
6. Import nhóm bàn giao, bảo hành và portal.
7. Import nhóm tài chính, công nợ, quyết toán và đóng hồ sơ.

## Ghi chú quan trọng

- Enum canonical của batch seed bám theo backend schema hiện tại, ưu tiên lowercase hoặc lower snake_case.
- `service_type`, `ChecklistTemplate.category`, `MaterialStandard.construction_type` đã được chuẩn hóa sang `ObjectId -> MasterDataItem`.
- `Journey` là seed runtime duy nhất; `ServiceRequest` và `Project` không còn là input chuẩn cho batch seed mới.
- `PortalDocument` hiện seed hợp lệ với `files = null`.
- `CustomerJourneySetting` phải dùng `content_save_setting` để overwrite singleton; không dùng generic create/update.
- File `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260329.json` được giữ lại như bản lịch sử; file canonical hiện hành là `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260331.json`.
- File canonical `20260331` đang bám cấu trúc `v3.1`: chỉ còn metadata step, `roles` và `checklist` nội tuyến; không còn field legacy của mô hình cũ.
- Các tham chiếu tới `Contract`, `ContractAppendix`, `ProjectTask` tiếp tục để `null` hoặc lược khỏi seed vì tenant hiện không còn dùng các schema này trong runtime chuẩn.
