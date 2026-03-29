# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# MASTER DATA SEED PLAN - 2026-03-28

Muc dich
- Chot danh sach master data nen seed de thay dan cac enum/hardcode trong frontend.
- Uu tien cac nhom ma codebase dang dung thuc te trong types va mock data.

## 1. Nguyen tac seed
- Chi seed cac danh muc da co bang chung hardcode trong codebase.
- `value` dung snake_case lowercase.
- `label` dung tieng Viet de hien thi UI.
- `module` map theo business domain: foundation, crm, project, execution, inventory, finance, document.

## 2. Danh sach category nen seed ngay

### category: source_channel
- module: crm
- ly do: Journey.source_channel dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L183) va mock du lieu trong [src/data/journeyMockData.ts](src/data/journeyMockData.ts#L44).
- items:
  - hotline | Hotline
  - referral | Gioi thieu
  - direct | Truc tiep
  - mkt | Marketing

### category: priority_level
- module: foundation
- ly do: Journey.priority dang hardcode `low | medium | high | critical` trong [src/types/journey.ts](src/types/journey.ts#L8) va [src/types/journey.ts](src/types/journey.ts#L190).
- items:
  - low | Thap
  - medium | Trung binh
  - high | Cao
  - critical | Khan cap

### category: portal_publish_status
- module: document
- ly do: Journey.portal_publish_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L7).
- items:
  - hidden | An
  - partial | Cong bo mot phan
  - published | Da cong bo

### category: go_no_go_status
- module: project
- ly do: Journey.go_no_go_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L5).
- items:
  - draft | Nhap
  - go | Tiep tuc
  - no_go | Khong tiep tuc
  - on_hold | Tam hoan
  - pending | Cho duyet

### category: sla_status
- module: project
- ly do: Journey.sla_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L6).
- items:
  - ontime | Dung han
  - at_risk | Co rui ro
  - overdue | Qua han

### category: survey_status
- module: crm
- ly do: Journey.survey_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L10).
- items:
  - not_started | Chua bat dau
  - scheduled | Da len lich
  - in_progress | Dang thuc hien
  - completed | Hoan tat

### category: estimate_status
- module: project
- ly do: Journey.estimate_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L11).
- items:
  - not_started | Chua bat dau
  - draft | Nhap
  - ready | San sang

### category: quote_status
- module: crm
- ly do: Journey.quote_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L12).
- items:
  - not_started | Chua bat dau
  - draft | Nhap
  - sent | Da gui
  - approved | Da duyet

### category: project_status
- module: project
- ly do: Journey.project_status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L13).
- items:
  - not_started | Chua bat dau
  - active | Dang trien khai
  - completed | Hoan tat
  - cancelled | Huy

### category: work_step_status
- module: execution
- ly do: JourneyChecklistStep.status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L145).
- items:
  - locked | Khoa
  - open | Mo
  - in_progress | Dang lam
  - awaiting_review | Cho review
  - approved | Da duyet
  - rejected | Tu choi

### category: evidence_status
- module: execution
- ly do: StepEvidence.status dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L150).
- items:
  - pending | Cho duyet
  - approved | Da duyet
  - rejected | Tu choi

### category: incident_type
- module: execution
- ly do: IncidentReport.type dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L130).
- items:
  - material_shortage | Thieu vat tu
  - technical | Su co ky thuat
  - weather | Thoi tiet
  - equipment | Thiet bi
  - safety | An toan lao dong
  - other | Khac

### category: incident_severity
- module: execution
- ly do: IncidentReport.severity dang hardcode trong [src/types/journey.ts](src/types/journey.ts#L132).
- items:
  - normal | Binh thuong
  - urgent | Khan cap

### category: pipeline_system_stage
- module: crm
- ly do: PipelineSystemStage dang hardcode trong [src/types/v3.ts](src/types/v3.ts#L24).
- items:
  - new | Moi
  - in_progress | Dang xu ly
  - won | Thanh cong
  - lost | That bai

### category: quotation_status
- module: crm
- ly do: Quotation.status dang hardcode trong [src/types/v3.ts](src/types/v3.ts#L99).
- items:
  - draft | Nhap
  - sent | Da gui
  - approved | Da duyet
  - rejected | Tu choi

### category: activity_event_category
- module: project
- ly do: ActivityEventCategory dang hardcode trong [src/types/v3.ts](src/types/v3.ts#L146).
- items:
  - stock_order | Phieu kho
  - asset_allocation | Cap phat tai san
  - payment | Thanh toan
  - warranty | Bao hanh
  - incident | Su co
  - survey | Khao sat
  - quotation | Bao gia
  - contract | Hop dong
  - construct | Thi cong
  - general | Chung

### category: material_unit
- module: inventory
- ly do: MaterialUnit dang hardcode trong [src/types/v3.ts](src/types/v3.ts#L174).
- items:
  - kg | Kg
  - liter | Lit
  - m2 | m2
  - box | Thung
  - roll | Cuon
  - piece | Cai

### category: asset_status
- module: inventory
- ly do: AssetStatus dang hardcode trong [src/types/v3.ts](src/types/v3.ts#L201).
- items:
  - available | San sang
  - in_use | Dang su dung
  - maintenance | Bao tri
  - broken | Hong
  - lost | Mat

## 3. Danh sach category seed giai doan 2
- portal_thread_context_type
- portal_thread_status
- portal_message_sender_role
- payment_milestone_status
- warranty_reminder_channel
- warranty_reminder_status
- stock_request_type
- stock_order_type
- stock_order_status
- asset_allocation_status

## 4. Thu tu thuc hien goi y
1. Seed foundation + crm categories truoc.
2. Refactor dropdown/label map cho Journey va CRM pages.
3. Seed execution + inventory categories.
4. Refactor cac page worker/supervisor/accountant.

## 5. Luu y chuan hoa
- Frontend hien co su pha tron lowercase, uppercase va gia tri co dau.
- Khi seed xong nen quy doi tat ca status business ve lowercase snake_case o tang schema.
- Neu UI can hien thi uppercase legacy thi xu ly o presentation, khong luu o database.
