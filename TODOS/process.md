# Process Log

## Trang thai tong quan
- Group 01: Hoan tat tao schema MasterDataCategory, MasterDataItem va verify relationship.
- Group 02: Hoan tat update/create schema CRM gap-only va da verify tren backend.
- Group 03: Hoan tat create/update schema preconstruction + handoff va da verify tren backend.
- Group 04: Hoan tat bridge-compatible schema cho field execution theo codebase-first va da verify tren backend.
- Group 05: Hoan tat create/update schema inventory-assets gap-only theo codebase-first va da verify tren backend.
- Group 06: Hoan tat create/update schema finance-warranty-portal gap-only theo codebase-first va da verify tren backend.
- Group 07: Hoan tat create/update schema portal document gap-only theo codebase-first va da verify tren backend.

## Lich su thuc hien

### 2026-03-28 - Group 01 Foundation
- Xac nhan cac schema core da ton tai va khong tao trung: Department, Position, Employee, OrgMembership, Role, RoleType, PermissionDefinition, notification core, IntegrationSetting, FileFolderPolicy, FileSyncJob, ActivityLog.
- Chot pham vi Group 01 chi con 2 schema can bo sung: MasterDataCategory, MasterDataItem.
- Da tao schema MasterDataCategory tren backend BAC.
- Da tao schema MasterDataItem tren backend BAC.
- Da verify relationship: MasterDataItem.categoryId -> MasterDataCategory.

### 2026-03-28 - Group 02 CRM and Sales
- Da doi chieu backend hien tai voi BA/frontend va xac nhan cac schema da ton tai: Customer, ServiceRequest, SalesPipeline, PipelineStage, SurveyRecord, Journey, Quotation.
- Da cap nhat Customer voi cac field CRM: code, district, city, assigned_pm_id, notes.
- Da cap nhat ServiceRequest de ho tro request-first intake: customer_id khong bat buoc, bo sung customer_name, contact_phone, contact_email, site_address, requested_service, duplicate_customer_id.
- Da cap nhat SurveyRecord de dung duoc truoc va sau khi convert: journey_id khong bat buoc, bo sung service_request_id, survey_status, condition_items, proposed_items.
- Da tao schema ServiceRequestStageHistory.
- Da tao schema ServiceRequestInteractionLog.
- Da tao schema SurveySummary.
- Da re-layout va verify toan bo schema Group 02 tren backend.

### 2026-03-28 - Group 03 Preconstruction and Project Handoff
- Da doi chieu BA/frontend voi backend va xac nhan nen co san de tai su dung: ServiceRequest, SurveySummary, Quotation, Journey, JourneyTemplate, EstimateTemplate, ChecklistTemplate.
- Da cap nhat Quotation de bo sung service_request_id, version_no va cho phep journey_id khong bat buoc de ho tro ca luong moi va du lieu cu.
- Da tao schema PriceBook, PriceBookItem, EstimateVersion, EstimateLineItem.
- Da tao schema QuotationMappingRule, QuotationLineItem, GoNoGoReview, Contract, ContractAppendix.
- Da tao schema Project, ProjectAssignment, ProjectTask, WorkforceAssignment, StagePlaybook, HandoffRule.
- Da re-layout va verify toan bo schema Group 03 tren backend.

### 2026-03-28 - Group 04 Field Execution
- Da chuyen huong phan tich sang codebase-first va chot rang workflow hien tai dang Journey-centric, chua phai ProjectTask-first.
- Da cap nhat ChecklistTemplate voi nested steps de khop ChecklistTemplate.steps[] cua frontend.
- Da cap nhat Journey voi cac field bridge: supervisor_name, progress_pct, blocked_task_count, latest_site_report_at, work_steps (nested) va evidences long ben trong work_steps.
- Da cap nhat IncidentReport de bo sung bridge fields project_id, project_task_id, title, status, priority trong khi van giu journey_id cho luong hien tai.
- Da cap nhat ActivityEvent de bo sung bridge fields project_id, project_task_id, service_request_id va mo rong related_entity_type.
- Da tao schema SiteReport cho nhat ky hien truong / construct report theo mock flow hien tai.
- Da re-layout va verify toan bo schema Group 04 tren backend.

### 2026-03-28 - Group 05 Inventory and Assets
- Da phan tich lai frontend theo codebase-first va xac nhan cac flow thuc te xoay quanh MaterialStandard, Distributor, StockRequest, StockOrder, MaterialReceipt va AssetAllocation.
- Da tai su dung cac schema nen co san: MaterialGroup, Material, StockOrder, AssetGroup, Asset, AssetAllocation; khong mo rong sang cac schema suy doan nhu Warehouse, PurchaseRequest, StockReservation, RemainderLot, RemainderRecovery.
- Da tao schema MaterialStandard.
- Da tao schema Distributor.
- Da tao schema StockRequest.
- Da tao schema MaterialReceiptConfirmation.
- Da cap nhat StockOrder de bo sung lien ket project/request, thong tin tao-ky-file, nested items/signatures/history va chuan hoa enum type/status/source theo frontend.
- Da cap nhat AssetAllocation de bo sung bridge fields project, requested_by_id, asset_name, asset_code, nested signatures/history va chuan hoa enum status theo frontend.
- Da cap nhat Journey voi cac field tom tat vat tu/tai san: material_need_status, key_material_summary, procurement_alert_count, asset_need_summary, stock_risk_summary.
- Da re-layout va verify toan bo schema Group 05 tren backend.

### 2026-03-28 - Group 06 Finance Warranty and Portal
- Da phan tich lai codebase va loai bo cac schema suy doan nhu PortalPublication, PaymentTransaction, ReceivableLedger, PayableLedger, AcceptanceRecord, MaintenanceVisit, AftersalesCost, AftersalesBilling.
- Da tao schema PaymentMilestone cho flow theo doi dot thanh toan va dashboard thu tien.
- Da tao schema WarrantyCard va WarrantyReminder cho luong bao hanh co ban.
- Da tao schema PortalThread va PortalMessage cho luong hoi dap portal theo journey/context.
- Da cap nhat Journey voi cac summary field payment va portal: milestone_count, next_milestone_name, next_milestone_due, total_contract_value, collected_amount, outstanding_amount, last_payment_note, thread_count, unread_thread_count, latest_thread_context, latest_thread_status.
- Da cap nhat IncidentReport de mo rong type them warranty, maintain va bo sung assigned_to de reuse cho aftersales.
- Da re-layout va verify toan bo schema Group 06 tren backend.

## Dang lam
- Group 07 da duoc implement theo pham vi toi thieu va da verify backend.

## Cho xac nhan / Mo
- Quotation hien dang ho tro song song service_request_id va journey_id de tranh pha vo du lieu cu; chua dat quy tac business bat buoc 1 trong 2 truong.
- Group 04 hien chon chien luoc bridge-compatible: chua tach TaskChecklist / EvidenceRecord thanh schema doc lap de tranh gay luong Journey.work_steps cua frontend hien tai.
- Group 05 tiep tuc theo chien luoc codebase-first: MaterialReceiptConfirmation duoc tao nhu bridge schema cho flow giam sat nhan hang, trong khi cac bai toan kho tong / remainder / procurement nang cao van defer cho wave sau neu codebase that su can.
- Group 06 tiep tuc theo chien luoc codebase-first: WarrantyReminder chi la schema nhac lich co ban, chua bao gom workflow automation gui SMS/ZALO; PortalPublication tiep tuc la derived state tu Journey/JourneyTemplate, khong tach schema doc lap.
- Chua tao logic workflow tu dong nhu: tao estimate line tu price book, mapping estimate -> quotation, convert quotation -> contract -> project, hay stage handoff tu dong. Day la phan API/workflow sau schema.

## Ghi chu
- File nay dung de theo doi cac noi dung da lam duoc theo tung nhom nghiep vu.

### 2026-03-28 - Group 07 Document, Reporting and Hardening (analysis only)
- Da phan tich lai Group 07 theo codebase-first va xac nhan plan BA cu qua rong so voi frontend hien tai.
- Da xac nhan cac bang chung manh nhat nam o: PortalDocuments, PortalDashboard, SignaturePad, PM Reports, StockOrder/AssetAllocation print-signature flow.
- Da xac nhan BAC da co ha tang co the tai su dung: PrintTemplate, ReportDashboard, ReportPanel.
- Da chot huong Group 07 chi xem xet schema business toi thieu cho portal documents va update Journey summary fields; khong tao document lifecycle, e-sign envelope hay KPI snapshot stack.
- Da tao file phan tich SCHEMA-ANALYSIS-20260328-GROUP07.md de cho xac nhan truoc khi toolcall backend.
- Trang thai hien tai: dang cho xac nhan pham vi Group 07 truoc khi tao/update schema backend.

### 2026-03-28 - Group 07 Document, Reporting and Hardening (implemented)
- Da tao schema PortalDocument cho luong tai lieu cong bo theo Journey/context.
- Da cap nhat Journey voi 3 field summary: document_count, missing_document_count, published_step_count.
- Da re-layout nhe 3 field moi vao nhom Portal.
- Da verify lai backend: PortalDocument ton tai, Journey da co du 3 field document summary.
- Group 07 backend scope hien tai da hoan tat theo pham vi toi thieu da duoc xac nhan.

### 2026-03-28 - Re-audit Groups 01-04 (analysis only)
- Da re-audit lai Group 01-04 theo codebase-first, uu tien bang chung tu types/pages/mock data thay vi BA V4.
- Xac nhan Group 01 khong co delta backend; MasterDataCategory va MasterDataItem van dung.
- Xac nhan Group 04 dang dung huong Journey-centric va backend da co nested work_steps, ChecklistTemplate.steps, IncidentReport/ActivityEvent bridge fields.
- Xac dinh nhom schema Group 02-03 mang tinh doc-first can dua vao danh sach xoa backend: ServiceRequestStageHistory, ServiceRequestInteractionLog, SurveySummary, ProjectTask, StagePlaybook, HandoffRule, WorkforceAssignment, EstimateVersion, EstimateLineItem, PriceBook, PriceBookItem, GoNoGoReview, Contract, ContractAppendix.
- Da tao file tong hop re-audit: SCHEMA-ANALYSIS-20260328-174124-GROUP01-04-REAUDIT.md.
- Chua toolcall schema update/delete vi can xac nhan lai cleanup plan, va bo MCP hien tai khong co tool xoa schema.

### 2026-03-28 - Superadmin menu tree
- Da lay menu hien tai bang MCP va sap xep lai root priority thanh Quan tri -> HRM -> CRM.
- Da doi chieu schema backend giu lai va tao blueprint SUPERADMIN-MENU-TREE-20260328.md cho superadmin.
- Blueprint menu loai tru cac schema nam trong delete list va khong dua backlog BA chua du bang chung vao menu.
- Bo MCP hien tai chua co menu create, nen moi ap duoc reorder menu hien co; phan tao moi da duoc chot thanh blueprint co path schema cu the.
