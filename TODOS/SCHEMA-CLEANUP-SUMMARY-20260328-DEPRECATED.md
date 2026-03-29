# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA CLEANUP SUMMARY - 2026-03-28

Muc dich
- Tong hop lai cac schema/model KHONG nen tiep tuc dung trong cac dot phan tich sau.
- Tach ro giua: (1) schema backend co the xoa manual neu da tung tao thu nghiem, va (2) model/schema y tuong khong nen tao tiep.
- Khong de xoa nham cac schema van con gia tri cho Group 03/05/06 hoac core system.

## 1. KHONG CO SCHEMA BACKEND NAO AN TOAN DE XOA NGAY SAU GROUP 06

Ly do
- Cac schema backend dang ton tai va duoc dung trong 6 nhom dau van con vai tro ro rang: Journey, ChecklistTemplate, IncidentReport, ActivityEvent, ServiceRequest, Quotation, Project, ProjectTask, Contract, SurveyRecord, SurveySummary, PriceBook, EstimateVersion, StagePlaybook, HandoffRule, PaymentMilestone, WarrantyCard, WarrantyReminder, PortalThread, PortalMessage...
- Mot so schema chua duoc frontend hien tai goi truc tiep nhung van la nen cua cac nhom nghiep vu da implement, khong nen xoa chi vi wave tiep theo chua dung den.
- Core/system schema nhu ActivityLog, Role, Employee, Department, IntegrationSetting... khong nam trong pham vi cleanup business schema.

## 2. CAC SCHEMA / MODEL KHONG NEN TIEP TUC DUNG TRONG PHAN TICH SAU

Luu y
- Danh sach nay la huong model hoa khong tiep tuc, hoac schema thu nghiem NEU da tung duoc tao bang tay/thu nghiem o tenant nao do thi co the xoa manual de tranh lam nhieu phan tich sau.
- Trong tenant hien tai, toi KHONG tao cac schema blacklist nay trong Group 04 va Group 06.

| Ten schema/model | Trang thai | Ly do khong dung nua | Hanh dong goi y |
|------------------|-----------|----------------------|-----------------|
| ChecklistTemplateStep | Khong tao | Codebase hien tai dung ChecklistTemplate.steps nested, khong can tach schema rieng | Neu da tao thu nghiem thi xoa manual |
| TaskChecklist | Defer | Frontend hien tai chua doc checklist execution tu ProjectTask-first aggregate; tao som se gay lech Journey.work_steps | Khong dung trong wave tiep theo cho den khi frontend doi model |
| TaskChecklistStep | Defer | Ly do tuong tu TaskChecklist; UI hien tai doc step embedded trong Journey.work_steps | Khong dung trong wave tiep theo |
| EvidenceRecord | Defer | Evidence hien tai gan truc tiep vao tung step trong Journey.work_steps.evidences | Khong dung trong wave tiep theo |
| EvidenceReview | Defer | PM feedback hien tai nam ngay tren evidence embedded; tach schema som se tao adapter khong can thiet | Khong dung trong wave tiep theo |
| AcceptanceDraft | Defer | Step09Acceptance hien tai moi la journey step view; chua co aggregate doc lap trong codebase | Khong dung trong Group 04; xem lai khi frontend doi flow |
| ExecutionActivity | Khong dung | ActivityEvent da duoc mo rong de dung lai thay vi tao them log schema moi | Neu da tao thu nghiem thi xoa manual |
| PortalPublication | Khong tao | Timeline portal hien tai suy ra tu JourneyTemplate.steps.publish_flag + Journey.current_step_code; khong co entity doc lap trong type/page/mock data | Neu da tao thu nghiem thi xoa manual |
| PaymentSchedule | Khong tao | Frontend dung PaymentMilestone, khong dung PaymentSchedule aggregate rieng | Neu da tao thu nghiem thi xoa manual |
| PaymentTransaction | Khong tao | Chua co type/page/mock data du manh; dashboard hien tai chi theo doi milestone-level collection | Neu da tao thu nghiem thi xoa manual |
| ReceivableLedger | Khong tao | Chua co bang chung codebase cho ledger receivable rieng | Neu da tao thu nghiem thi xoa manual |
| PayableLedger | Khong tao | Chua co bang chung codebase cho ledger payable rieng | Neu da tao thu nghiem thi xoa manual |
| ProjectCostEntry | Khong tao | Chua co entity phi chi phi du an doc lap trong UI/type hien tai | Neu da tao thu nghiem thi xoa manual |
| CashBookEntry | Khong tao | Chua co bang chung cashbook trong codebase hien tai | Neu da tao thu nghiem thi xoa manual |
| RetentionEntry | Khong tao | Chua co retention flow manh trong Group 06 codebase-first | Neu da tao thu nghiem thi xoa manual |
| AcceptanceRecord | Defer | Nghiem thu hien tai la wave field execution / project closeout, chua phai aggregate doc lap cho Group 06 | Khong dung trong wave tiep theo cho den khi codebase doi ro hon |
| MaintenanceVisit | Defer | Hau mai hien tai moi o muc incident + reminder, chua co evidence cho visit schema doc lap | Khong dung trong wave tiep theo |
| AftersalesCost | Defer | Chua co type/page/mock data cho chi phi aftersales doc lap | Khong dung trong wave tiep theo |
| AftersalesBilling | Defer | Chua co type/page/mock data cho billing aftersales doc lap | Khong dung trong wave tiep theo |

## 3. CAC SCHEMA DA DUOC CHON LA NGUON SU THAT CHO GROUP 04-07

Su that codebase-first hien tai
- Journey: aggregate tong hop chinh cho execution, payment summary va portal summary
- ChecklistTemplate: nguon template checklist voi steps nested
- IncidentReport: schema su co dung chung cho thi cong va aftersales sau khi da bridge them project/task va them type warranty/maintain
- ActivityEvent: schema log chinh, duoc bridge them project/task/service_request
- SiteReport: schema nhat ky hien truong
- PaymentMilestone: schema chinh cho dashboard thanh toan va Step10Payment
- WarrantyCard: schema chinh cho thong tin the bao hanh sau ban giao
- WarrantyReminder: schema nhac lich bao hanh co ban
- PortalThread: schema chinh cho thread hoi dap theo journey/context
- PortalMessage: schema message doc lap trong thread portal
- PortalDocument: schema chinh cho tai lieu/hinh anh cong bo theo Journey/context

## 4. CAC SCHEMA KHONG NEN XOA

Khong xoa du chi tam thoi chua duoc UI goi truc tiep
- Project
- ProjectTask
- StagePlaybook
- HandoffRule
- Contract
- Quotation
- SurveySummary
- EstimateVersion
- PriceBook
- WorkforceAssignment
- PaymentMilestone
- WarrantyCard
- WarrantyReminder
- PortalThread
- PortalMessage
- PortalDocument

Ly do
- Day la schema da tao dung theo luong Group 03/05/06 va cac wave sau; chua la obsolete.
- Viec Group 04 chon Journey-first va Group 06 khong tao ledger/publication khong phu dinh gia tri cua lop Project/ProjectTask/Contract hay cac schema moi PaymentMilestone/Warranty/Portal.

## 5. Ket luan cleanup

- Sau Group 06, KHONG co business schema backend nao du du lieu va du bang chung de khuyen nghi xoa ngay trong tenant hien tai.
- De tranh lon xon khi phan tich tiep, hay xem danh sach o muc 2 la blacklist model/schema khong tiep tuc dung cho cac wave tiep theo.
- Neu tenant nao do da tung tao cac schema thu nghiem: ChecklistTemplateStep, TaskChecklist, TaskChecklistStep, EvidenceRecord, EvidenceReview, AcceptanceDraft, ExecutionActivity, PortalPublication, PaymentSchedule, PaymentTransaction, ReceivableLedger, PayableLedger, ProjectCostEntry, CashBookEntry, RetentionEntry, AcceptanceRecord, MaintenanceVisit, AftersalesCost, AftersalesBilling thi co the xoa manual sau khi doi chieu xac nhan khong co du lieu can giu.

## 6. Group 07 update

Ket luan moi
- Group 07 codebase-first cho thay nhu cau thuc te nghieng ve portal documents, embedded signatures va reporting reuse.
- Khong nen tiep tuc dung cac cum model sau trong phan tich/implement wave tiep theo: DocumentTemplate, TemplateVersion, DocumentRecord, DocumentAttachment, SignatureEnvelope, SignatureParticipant, SignatureEvent, DossierChecklist, PublishedLink, SyncFailureLog, ReportSnapshot, KpiDefinition, KpiSnapshot.
- PrintTemplate, ReportDashboard va ReportPanel duoc xem la ha tang co san can uu tien reuse; khong nam trong blacklist xoa.
- Candidate business scope toi thieu con lai chi gom PortalDocument va 3 field tong hop tren Journey: document_count, missing_document_count, published_step_count.

## 7. Group 07 implementation result

Da adopt schema
- PortalDocument: schema chinh cho tai lieu/hinh anh cong bo theo Journey/context.

Cap nhat khong xoa
- PortalDocument

## 8. Re-audit correction for Groups 01-04

Ket luan moi thay the cho nhan dinh cu o cac muc cleanup lien quan Group 02-03:
- Sau khi doi chieu lai theo codebase-first, co nhom schema backend nen dua vao cleanup/xoa thay vi tiep tuc giu lai.
- Danh sach nay chi gom cac schema da ton tai tren backend nhung khong co bang chung type/page/mock data thuc te trong code hien tai.

Danh sach schema nen xoa backend sau re-audit Group 01-04
- ServiceRequestStageHistory
- ServiceRequestInteractionLog
- SurveySummary

- EstimateVersion
- EstimateLineItem
- Contract

Schema tiep tuc duoc bao ve
- MasterDataCategory
- MasterDataItem
- ServiceRequest
- SurveyRecord
- Quotation
- Project
- Journey
- ChecklistTemplate
- IncidentReport
- ActivityEvent
- SiteReport

Ghi chu thuc thi
- Bo MCP hien tai khong co tool schema-delete, vi vay tai lieu nay chi cap nhat ket luan cleanup va danh sach xoa de xu ly bang cong cu backend cap he thong.
- Ket luan chi tiet nam trong file SCHEMA-ANALYSIS-20260328-174124-GROUP01-04-REAUDIT.md.

## 9. Tai lieu tach rieng de thao tac nhanh

- BACKEND-SCHEMAS-DELETE-LIST-20260328.md: danh sach doc lap cac schema business nen xoa backend.
- BUSINESS-SCHEMAS-OVERVIEW-20260328.md: overview toan bo schema dang giu lai va cac gap tiem an can quan tri ky.
- BA-MISSING-BUSINESS-SCHEMAS-20260328.md: backlog cac schema co the can theo BA docs nhung codebase hien tai chua du nghiep vu de tao.

## 10. Tai lieu quan tri tiep theo

- MASTER-DATA-SEED-PLAN-20260328.md: ke hoach seed master data tu cac enum/hardcode hien tai.
- AGGREGATE-CONVERSION-RULES-20260328.md: quy tac convert va ownership giua ServiceRequest, Journey, Project.

## 11. Delta 2026-03-29

Cap nhat kien truc runtime va cleanup metadata
- Journey.template_id da duoc danh dau deprecated do JourneyTemplate khong con duoc dung.
- Journey.work_steps.step_id va Journey.work_steps.template_step_id da duoc danh dau deprecated.
- Journey.work_steps da duoc danh dau deprecated o cap container de khoa bridge model cu.
- Contract.latest_project_settlement_id va Contract.latest_closeout_package_id da duoc danh dau deprecated de giu Contract gon hon.

Cap nhat menu cleanup an toan
- Da an menu cho cac schema legacy sau bang cach set isHidden=true: ContractAppendix, GoNoGoReview, PriceBook, PriceBookItem, EstimateVersion, ProjectTask, WorkforceAssignment.
- Khong tim thay menu nao tro truc tiep toi JourneyTemplate hoac StagePlaybook trong snapshot menu hien tai.

Dieu chinh cach doc tai lieu nay
- Cac nhan dinh cu ve viec giu Contract, ProjectTask, PriceBook, EstimateVersion, WorkforceAssignment can duoc hieu la ket luan lich su; trang thai cleanup moi uu tien theo delta ngay 2026-03-29 va cac file phan tich moi hon.
- Bo MCP hien tai van khong co tool schema-delete, vi vay cleanup thuc te hien dang theo 2 tang: (1) deprecated metadata, (2) hide menu, truoc khi xoa vat ly bang cong cu backend.
- Journey.current_step da duoc chuyen tu Text/Input sang Text/Dropdown va rang buoc theo 13 canonical step codes tu CustomerJourneySetting.
