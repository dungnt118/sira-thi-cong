# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 01-04 RE-AUDIT

## PHAN 1: SO SANH GAP (CODEBASE-FIRST vs CURRENT BACKEND)

| Schema | Code thuc te | Backend hien tai | Ket luan | Priority |
|---|---|---|---|---|
| MasterDataCategory | Can giu | Da ton tai | Giu nguyen | Low |
| MasterDataItem | Can giu | Da ton tai | Giu nguyen | Low |
| ServiceRequest | Can giu | Da ton tai | Giu nguyen | Low |
| SurveyRecord | Can giu | Da ton tai | Giu nguyen | Low |
| SurveySummary | Khong co type/page/mock data | Da ton tai | Nen xoa backend | High |
| ServiceRequestStageHistory | Khong co code dung | Da ton tai | Nen xoa backend | High |
| ServiceRequestInteractionLog | Khong co code dung | Da ton tai | Nen xoa backend | High |
| Quotation | Can giu | Da ton tai | Giu nguyen | Medium |
| Project | Con gia tri bridge/legacy | Da ton tai | Tam giu | Medium |
| ProjectTask | Khong co task aggregate doc lap trong code | Da ton tai | Nen xoa backend | High |
| StagePlaybook | Khong co flow playbook doc lap | Da ton tai | Nen xoa backend | High |
| HandoffRule | Khong co flow handoff rule doc lap | Da ton tai | Nen xoa backend | High |
| WorkforceAssignment | Khong co code dung | Da ton tai | Nen xoa backend | High |
| EstimateVersion | Khong co aggregate estimate version | Da ton tai | Nen xoa backend | High |
| EstimateLineItem | Khong co schema tach rieng duoc code dung | Da ton tai | Nen xoa backend | High |
| PriceBook | Khong co tra cuu bang gia noi bo | Da ton tai | Nen xoa backend | High |
| PriceBookItem | Khong co code dung | Da ton tai | Nen xoa backend | High |
| GoNoGoReview | Code chi dung go_no_go_status trong Journey | Da ton tai | Nen xoa backend | High |
| Contract | Code chi dung contract_status/contract_no trong Journey | Da ton tai | Nen xoa backend | High |
| ContractAppendix | Khong co code dung | Da ton tai | Nen xoa backend | High |
| Journey.work_steps | La aggregate chinh cua Group 04 | Da ton tai | Bao ve, khong doi model | Critical |
| ChecklistTemplate.steps | Code dung nested steps[] | Da ton tai | Giu nguyen | Medium |
| IncidentReport | Code dung + bridge project/task | Da ton tai | Giu nguyen | Medium |
| ActivityEvent | Code dung + bridge fields | Da ton tai | Giu nguyen | Medium |
| SiteReport | Code co mock/report flow | Da ton tai | Giu nguyen | Medium |

Danh sach schema nen xoa backend:
- ServiceRequestStageHistory
- ServiceRequestInteractionLog
- SurveySummary
- ProjectTask
- StagePlaybook
- HandoffRule
- WorkforceAssignment
- EstimateVersion
- EstimateLineItem
- PriceBook
- PriceBookItem
- GoNoGoReview
- Contract
- ContractAppendix

## PHAN 2: THIET KE CHI TIET / HUONG DIEU CHINH

### Giu nguyen
- MasterDataCategory, MasterDataItem, ServiceRequest, SurveyRecord, Quotation, Journey, ChecklistTemplate, IncidentReport, ActivityEvent, SiteReport, Project.

### Xoa backend
- SurveySummary, ServiceRequestStageHistory, ServiceRequestInteractionLog.
- ProjectTask, StagePlaybook, HandoffRule, WorkforceAssignment.
- EstimateVersion, EstimateLineItem, PriceBook, PriceBookItem, GoNoGoReview, Contract, ContractAppendix.

### Ghi chu ky thuat
- Bo tool MCP hien tai khong co schema-delete, nen moi chi lap duoc danh sach xoa backend.
- Neu duoc xac nhan, toi se thuc hien cac thay doi non-destructive co the lam duoc va tach rieng batch schema can xoa cho thao tac backend cap he thong.

## PHAN 3: FORM PREVIEW (ASCII WIREFRAME)

```
┌─────────────────────────────────────────────────────────────┐
│  CODE-FIRST TRUTH AFTER RE-AUDIT                           │
├─────────────────────────────────────────────────────────────┤
│  KEEP: ServiceRequest intake + Journey.work_steps          │
│  KEEP: ChecklistTemplate.steps + IncidentReport            │
│  REMOVE: SurveySummary / Request logs / Group 03 stack     │
└─────────────────────────────────────────────────────────────┘
```
