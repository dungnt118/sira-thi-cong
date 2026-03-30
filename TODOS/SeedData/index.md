# SeedData Index

## Cập nhật Phase 2 ngày 2026-03-30

- Đã import thành công phần lớn batch seed business của BAC lên backend, bao gồm nhánh master, sale, thi công, bảo hành, portal trao đổi và tài chính.
- Tổng số schema đã import thành công đến thời điểm hiện tại: `43`.
- Hai điểm còn lại chưa khép kín:
  - `PortalDocument`: backend vẫn có validator ẩn bắt buộc file upload thật, nên chưa thể seed bản ghi không có file.
  - `CustomerJourneySetting`: bản ghi singleton hiện có đang là dữ liệu probe cũ, cần một wave cleanup/overwrite riêng cho schema setting.
- Các nhận định blocker MCP write cũ trong tài liệu lịch sử không còn là trạng thái hiện hành cho batch `Multiple`. Xem kết quả mới nhất tại `SEED-RESULT-PHASE2-20260330.md` và GAP còn lại tại `SEED-GAP-PHASE2-BACKEND-DATA-20260330.md`.

## Mục đích
- Chốt bộ seed JSON đầy đủ cho toàn bộ business schema BAC hiện đã được tạo ở backend, phục vụ Phase 2 import qua MCP tool.
- Dùng backend schema làm nguồn sự thật duy nhất khi chọn field, enum và quan hệ dữ liệu.
- Giữ dữ liệu seed bám sát nghiệp vụ thực tế của BAC, dùng tiếng Việt có dấu và bao phủ đủ ba nhóm kịch bản: đang báo giá, đang triển khai, đã bàn giao kèm bảo hành.

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
- Với schema không có `code`, dùng khóa nghiệp vụ ổn định đã chốt trong file seed:
  `MaterialGroup.name`, `AssetGroup.name`, `QuotationMappingRule.rule_name`, `PortalThread.thread_code`, `PaymentMilestone.journey_code`.
- Với `MasterDataItem`, dùng khóa giả chuẩn hóa theo mẫu `category_code.value`, ví dụ:
  `{{MasterDataItem._id::service_type.waterproofing}}`,
  `{{MasterDataItem._id::construction_type.rooftop_waterproofing}}`.
- Phase 2 cần resolve toàn bộ placeholder sang `_id` thực trước khi gọi `content_create` hoặc `content_create_many`.

## Danh mục file seed

### 1. Cấu hình nền và danh mục dùng chung
| File | Schema | Vai trò |
| --- | --- | --- |
| `CUSTOMER-JOURNEY-SETTING-DEFAULT-SEED-20260329.json` | `CustomerJourneySetting` | Cấu hình mặc định 13 bước hành trình khách hàng |
| `SalesPipeline-SEED-20260329.json` | `SalesPipeline` | Pipeline mặc định trên tenant hiện tại |
| `PipelineStage-SEED-20260329.json` | `PipelineStage` | 4 giai đoạn chính của pipeline |
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
| `ServiceRequest-SEED-20260330.json` | `ServiceRequest` | Yêu cầu dịch vụ đầu vào |
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
| `PortalDocument-SEED-20260330.json` | `PortalDocument` | Tài liệu portal, hiện seed với `files = null` theo rule mới của MCP |

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

## Trình tự import đề xuất cho Phase 2
1. Import nhóm cấu hình nền: `SalesPipeline`, `PipelineStage`, `MasterDataCategory`, `MasterDataItem`, `CustomerJourneySetting`.
2. Import nhóm master: `Customer`, `MaterialGroup`, `AssetGroup`, `Material`, `Asset`, `Distributor`, `ChecklistTemplate`, `EstimateTemplate`, `MaterialStandard`, `QuotationMappingRule`.
3. Resolve placeholder cho các quan hệ master rồi import nhóm sale và khảo sát theo thứ tự: `Journey` -> `ServiceRequest` -> `SurveyAppointment` -> `SurveyRecord` -> `Quotation` -> `QuotationLineItem`.
4. Import nhóm thi công, kho vận và activity log.
5. Import nhóm bàn giao, bảo hành và portal.
6. Import nhóm tài chính, công nợ, quyết toán và đóng hồ sơ.
7. Import `PortalDocument` sau cùng để dễ kiểm tra nội dung công bố; hiện có thể seed với `files = null`.

## Ghi chú quan trọng
- Enum canonical của batch seed là lowercase nếu backend schema đang dùng lowercase. Không ép theo enum legacy của frontend.
- `ChecklistTemplate` chỉ dùng cho checklist thi công; nghiệp vụ nghiệm thu / bàn giao nằm ở `HandoverAcceptance`.
- Các reference tới `ProjectTask`, `Contract`, `ContractAppendix` đang bị bỏ trống hoặc lược khỏi seed vì backend tenant hiện chưa có các schema này.
- File `SEED-RESULT-MCP-BLOCKER-20260329.md` không còn được dùng làm tài liệu điều hướng chính. Các blocker còn hiệu lực đã được gom lại trong `SEED-GAP-BACKEND-REFERENCES-AND-UPLOADS-20260330.md`.
- `PortalDocument.files` hiện được seed bằng `null` theo rule MCP mới; nếu cần đính kèm file thật thì cập nhật bổ sung ở bước sau.
- Blocker kỹ thuật Phase 2 hiện tại nằm ở BAC MCP write tool: `content-create`, `content-create_many`, `content-update_by_ids`. Xem chi tiết tại `SEED-GAP-PHASE2-MCP-WRITE-BLOCKER-20260330.md` trước khi chạy import thật.
