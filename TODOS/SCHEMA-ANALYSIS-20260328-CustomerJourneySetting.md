# SCHEMA ANALYSIS: CustomerJourneySetting

## PHAN 1: SO SANH GAP (Current vs Target)

| Hang muc | Hien tai | Muc tieu | Gap/Issue | Priority |
|---|---|---|---|---|
| Nguon cau hinh | JourneyTemplate + Journey.template_id + StagePlaybook tach roi | 1 schema CustomerJourneySetting, 1 ban ghi duy nhat | Cau hinh phan tan, kho quan tri va kho giu dong bo | High |
| Ma buoc / trang thai | Journey.current_step la text tu do, work_steps co step_id/template_step_id/name | 13 step code hardcode, enum chuan tac | De lech du lieu, kho viet rule frontend/backend on dinh | High |
| Bat/tat tung step | Chua co switch tap trung | steps[].is_enabled | Khong co noi dieu khien tap trung theo he thong | High |
| Rule per-step | Goal/checklist/SLA/owner dang nam mot phan o StagePlaybook | Tat ca nam trong steps[] cua setting | Hien dang bi tach lop va kho sua trong 1 man hinh | High |
| Single mode | Chua co schema cau hinh don nhat | 1 record setting_key=default | Can dung convention + trigger/menu detail vi MCP chua co co single-mode rieng | Medium |
| Tuong thich du lieu cu | Journey.template_id va StagePlaybook.journey_template_id dang phu thuoc JourneyTemplate | Migrate dan, chua cat ngay | Can lo trinh deprecate an toan | High |

Audit hien trang:
- Journey.template_id tham chieu JourneyTemplate.
- Journey.current_step dang la Text tu do.
- Journey.work_steps la runtime state cho frontend.
- JourneyTemplate chua chua full nested step config.
- StagePlaybook dang giu checklist/SLA/owner/instruction theo template.
- SalesPipeline va PipelineStage van dang phuc vu pipeline lead cua ServiceRequest, khong nam trong pham vi thay the.

## PHAN 2: THIET KE CHI TIET THUOC TINH

Schema de xuat: CustomerJourneySetting
- label: Cau hinh hanh trinh khach hang
- description: Cau hinh chuan duy nhat cho 13 buoc hanh trinh khach hang
- collection: customerjourneysetting
- tags: CRM, Journey, Operations, Setting
- mode: single-record by convention
- keyField de xuat: setting_key

Thuoc tinh 1: setting_key
- label: Khoa cau hinh
- propType: Text
- editor: Input
- required: true
- unique: true
- defaultValue: default

Thuoc tinh 2: setting_name
- label: Ten cau hinh
- propType: Text
- editor: Input
- required: true
- isRepresent: true

Thuoc tinh 3: is_active
- label: Dang ap dung
- propType: Boolean
- editor: Toggle
- defaultValue: true

Thuoc tinh 4: version_label
- label: Phien ban cau hinh
- propType: Text
- editor: Input

Thuoc tinh 5: note
- label: Ghi chu chung
- propType: Text
- editor: TextArea
- formWidth: fullwidth

Thuoc tinh 6: steps
- label: Cau hinh 13 buoc hanh trinh
- propType: Nested
- editor: Table
- required: true
- nested fields: step_code, step_name, order, is_enabled, owner_role_id, checklist_template_id, sla_hours, portal_visible, allow_skip, auto_open_next, entry_status, done_status, goal, instruction_note

13 step code de xuat:
1. lead_intake
2. qualification
3. survey_planning
4. site_survey
5. survey_review
6. estimate_preparation
7. quotation_preparation
8. quotation_sent
9. quotation_approved
10. contract_signing
11. project_execution
12. handover_acceptance
13. warranty_aftercare

Value options canonic cho step_code:
- lead_intake = Tiep nhan lead
- qualification = Sang loc nhu cau
- survey_planning = Lap lich khao sat
- site_survey = Khao sat hien trang
- survey_review = Review khao sat
- estimate_preparation = Lap du toan noi bo
- quotation_preparation = Soan bao gia
- quotation_sent = Gui bao gia
- quotation_approved = Chot bao gia
- contract_signing = Ky hop dong
- project_execution = Trien khai thi cong
- handover_acceptance = Nghiem thu / ban giao
- warranty_aftercare = Bao hanh / cham soc sau ban giao

Khuyen nghi migrate:
- Journey.current_step chi nen nhan mot trong 13 step_code.
- Journey.work_steps nen dan quy ve step_code chuan.
- Journey.template_id deprecate dan sau khi frontend/backend chuyen sang CustomerJourneySetting.
- StagePlaybook khong nen giu lam nguon cau hinh chinh; chi ton tai tam thoi trong giai doan migrate neu can.

## PHAN 2B: HUONG CLEAN DEPRECATE / DELETE

Danh sach schema cu can DEPRECATE:
- JourneyTemplate
- StagePlaybook

Danh sach schema cu dua vao backlog DELETE sau migrate:
- JourneyTemplate
- StagePlaybook

Danh sach field cu trong schema nghiep vu can DEPRECATE:
- Journey.template_id
- Journey.work_steps[].template_step_id
- Journey.work_steps[].step_id (neu van dang dung id tam, can quy ve step_code)

Danh sach KHONG dua vao delete trong dot nay:
- SalesPipeline
- PipelineStage

Ly do giu lai: ServiceRequest van dang phu thuoc truc tiep vao pipeline lead truoc hanh trinh qua pipeline_id va stage_id. Day la pipeline CRM dau vao, khong phai bo cau hinh hanh trinh khach hang can thay the.

Rang buoc xoa thuc te can xu ly truoc khi delete schema cu:
- Journey dang reference JourneyTemplate qua template_id.
- HandoffRule dang reference StagePlaybook.
- Frontend/backend phai chuyen sang doc CustomerJourneySetting truoc khi xoa schema cu.

## PHAN 3: FORM PREVIEW

```text
+---------------------------------------------------------------+
| Cau hinh hanh trinh khach hang                               |
+---------------------------------------------------------------+
| [Khoa cau hinh] [default]   [Ten cau hinh] [Mac dinh]        |
| [Dang ap dung] [ON]         [Phien ban] [v1.0]               |
| [Ghi chu chung............................................]   |
|                                                               |
| [Bang nested: Cau hinh 13 buoc]                              |
| step_code            step_name               enabled   SLA    |
| lead_intake          Tiep nhan lead          ON        4      |
| qualification        Sang loc nhu cau        ON        8      |
| ...                                                           |
| warranty_aftercare   Bao hanh / hau mai      ON        720    |
|                                                               |
| Row detail: owner role, checklist, entry_status, done_status, |
| portal_visible, allow_skip, auto_open_next, goal, instruction |
+---------------------------------------------------------------+
```

Ket luan de xuat:
- Tao moi CustomerJourneySetting truoc, seed san 1 record default voi du 13 step.
- Chuyen Journey sang dung step_code chuan va bo doc cau hinh tu JourneyTemplate / StagePlaybook.
- Danh dau deprecated cho JourneyTemplate, StagePlaybook va cac field cu lien quan trong Journey.
- Dua JourneyTemplate va StagePlaybook vao danh sach can xoa sau migrate.
