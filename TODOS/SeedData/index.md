# SeedData Index

## Cập nhật Phase 2 ngày 2026-03-31

- Đã import thành công `47` schema business/cấu hình của batch seed chuẩn lên backend BAC.
- Các hạng mục đã được khép kín trong wave này:
  - `SalesPipeline`
  - `PipelineStage`
  - `PortalDocument`
  - `CustomerJourneySetting`
- Đã vá ngược liên kết CRM cho 3 bản ghi `ServiceRequest` seed chuẩn để trỏ đúng tới pipeline/stage live.
- Không còn giữ các kết luận blocker cũ của wave probe trước đây làm trạng thái hiện hành.
- GAP còn sống hiện tại chỉ gồm:
  - metadata descriptor của `PortalDocument` chưa đồng bộ với schema runtime
  - một số dữ liệu legacy ngoài batch seed chuẩn
- Xem:
  - kết quả import hiện hành tại `SEED-RESULT-PHASE2-20260330.md`
  - GAP còn lại tại `SEED-GAP-PHASE2-BACKEND-DATA-20260330.md`

## Mục đích

- Chốt bộ seed JSON đầy đủ cho toàn bộ business schema BAC đang sống trên backend.
- Dùng backend schema làm nguồn sự thật duy nhất khi chọn field, enum, propType và quan hệ dữ liệu.
- Giữ dữ liệu seed bám sát nghiệp vụ BAC, dùng tiếng Việt có dấu và phủ đủ ba lát cắt chính:
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

- `JRN-2026-001`: Nhà anh Kiên tại Vĩnh Hưng, đã chốt báo giá và đang triển khai thi công chống thấm.
- `JRN-2026-002`: Nhà anh Dương tại Vĩnh Hưng, đã bàn giao, phát sinh xử lý sau bàn giao và chuyển sang bảo hành.
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
| `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260331.json` | `CustomerJourneySetting` | Cấu hình mặc định 13 bước hành trình khách hàng, dùng cho `content_save_setting` |
| `SalesPipeline-SEED-20260329.json` | `SalesPipeline` | Pipeline bán hàng mặc định |
| `PipelineStage-SEED-20260329.json` | `PipelineStage` | 4 giai đoạn chính của funnel bán hàng |
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

### 2. Sale, khảo sát và báo giá
| File | Schema | Vai trò |
| --- | --- | --- |
| `ServiceRequest-SEED-20260330.json` | `ServiceRequest` | Yêu cầu dịch vụ đầu vào, đã trỏ đúng sang `SalesPipeline` và `PipelineStage` |
| `Journey-SEED-20260330.json` | `Journey` | Hành trình khách hàng trung tâm |
| `SurveyAppointment-SEED-20260330.json` | `SurveyAppointment` | Lịch hẹn khảo sát |
| `SurveyRecord-SEED-20260330.json` | `SurveyRecord` | Biên bản khảo sát hiện trạng |
| `Quotation-SEED-20260330.json` | `Quotation` | Hồ sơ báo giá |
| `QuotationLineItem-SEED-20260330.json` | `QuotationLineItem` | Dòng hạng mục báo giá |

### 3. Thi công và vận hành hiện trường
| File | Schema | Vai trò |
| --- | --- | --- |
| `Project-SEED-20260330.json` | `Project` | Dự án triển khai sau khi chốt sale |
| `ProjectAssignment-SEED-20260330.json` | `ProjectAssignment` | Phân công nhân sự theo vai trò |
| `StockRequest-SEED-20260330.json` | `StockRequest` | Yêu cầu xuất hoặc nhập vật tư |
| `StockOrder-SEED-20260330.json` | `StockOrder` | Phiếu xuất và phiếu nhập kho |
| `MaterialReceiptConfirmation-SEED-20260330.json` | `MaterialReceiptConfirmation` | Xác nhận nhận hàng tại công trình hoặc kho |
| `AssetAllocation-SEED-20260330.json` | `AssetAllocation` | Cấp phát tài sản cho công trình |
| `SiteReport-SEED-20260330.json` | `SiteReport` | Nhật ký và báo cáo hiện trường |
| `IncidentReport-SEED-20260330.json` | `IncidentReport` | Sự cố vật tư, kỹ thuật và rủi ro tại hiện trường |
| `ActivityEvent-SEED-20260330.json` | `ActivityEvent` | Log hoạt động quan trọng theo hành trình |

### 4. Bàn giao, bảo hành và tương tác khách hàng
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
| `PortalDocument-SEED-20260330.json` | `PortalDocument` | Tài liệu portal, hiện seed với `files = null` |

### 5. Tài chính, công nợ và đóng hồ sơ
| File | Schema | Vai trò |
| --- | --- | --- |
| `PaymentMilestone-SEED-20260330.json` | `PaymentMilestone` | Đợt thanh toán theo dự án |
| `PaymentReceipt-SEED-20260330.json` | `PaymentReceipt` | Phiếu thu tiền |
| `PaymentAdjustment-SEED-20260330.json` | `PaymentAdjustment` | Điều chỉnh kỳ thanh toán |
| `DebtConfirmation-SEED-20260330.json` | `DebtConfirmation` | Biên bản xác nhận công nợ |
| `DebtCollectionTask-SEED-20260330.json` | `DebtCollectionTask` | Tác vụ nhắc thu hồi công nợ |
| `SalesInvoice-SEED-20260330.json` | `SalesInvoice` | Hóa đơn bán hàng và VAT |
| `ProjectSettlement-SEED-20260330.json` | `ProjectSettlement` | Quyết toán dự án |
| `ProjectCloseoutPackage-SEED-20260330.json` | `ProjectCloseoutPackage` | Gói hồ sơ đóng dự án |

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
3. Resolve placeholder master và import nhóm sale:
   - `Journey`
   - `ServiceRequest`
   - `SurveyAppointment`
   - `SurveyRecord`
   - `Quotation`
   - `QuotationLineItem`
4. Import nhóm thi công, kho vận và activity log.
5. Import nhóm bàn giao, bảo hành và portal.
6. Import nhóm tài chính, công nợ, quyết toán và đóng hồ sơ.

## Ghi chú quan trọng

- Enum canonical của batch seed bám theo backend schema hiện tại, ưu tiên lowercase hoặc lower snake_case.
- `service_type`, `ChecklistTemplate.category`, `MaterialStandard.construction_type` đã được chuẩn hóa sang `ObjectId -> MasterDataItem`.
- `PortalDocument` hiện seed hợp lệ với `files = null`; tuy nhiên descriptor metadata của schema này vẫn cần cleanup ở backend.
- `CustomerJourneySetting` phải dùng `content_save_setting` để overwrite singleton; không dùng generic create/update.
- File `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260329.json` được giữ lại như bản lịch sử; file canonical hiện hành là `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260331.json`.
- Các tham chiếu tới `ProjectTask`, `Contract`, `ContractAppendix` tiếp tục để `null` hoặc lược khỏi seed vì tenant hiện không còn dùng các schema này trong kiến trúc runtime chuẩn.
- Không dùng `SEED-RESULT-MCP-BLOCKER-20260329.md` và `SEED-GAP-PHASE2-MCP-WRITE-BLOCKER-20260330.md` làm kết luận hiện hành cho Phase 2.
