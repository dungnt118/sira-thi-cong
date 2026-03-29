# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 03 - PRECONSTRUCTION AND PROJECT HANDOFF

## PHAN 1: SO SANH GAP (BA vs Current Schema)

| Thuoc tinh / Schema | Yeu cau BA | Schema hien tai | Gap / Issue | Priority |
|---|---|---|---|---|
| Estimate versioning | BA wave 2A can du toan nhieu phien ban theo request | Chi co EstimateTemplate 3 field | Chua co estimate giao dich | High |
| Internal price book | BA can bang gia noi bo theo thoi gian / khu vuc | Chua co PriceBook / PriceBookItem | Thieu nguon gia von noi bo | High |
| Quotation mapping | BA can mapping tu noi bo sang bao gia KH | Chua co schema mapping | Chua tach gia von va gia ban | High |
| Quotation structure | Quotation can di tu ServiceRequest, co line item / versioning | Quotation hien gan Journey, chua co line item | Chua dung thu tu nghiep vu va chua du chi tiet | High |
| Go/No-Go review | BA can review, warning, override truoc khi chot deal | Journey chi co go_no_go_status tom tat | Chua co schema quyet dinh rieng | High |
| Contract | BA can convert bao gia thang thanh hop dong | Chua co | Thieu moc chuyen giao sang du an | High |
| Project aggregate | BA can project de dieu phoi noi bo | Chua co | Chua co owner aggregate cho task / assignment | High |
| Project assignment | BA can giao PM / Giam sat / cac vai tro lien quan | Chua co | Chua co assignment theo du an | Medium |
| Project task board | BA can WBS / task board | Chua co | Chua co task owner de van hanh noi bo | High |
| Workforce assignment | BA can gan ky thuat profile vao task | Chua co | Chua co lien ket task -> nhan su thuc thi | Medium |
| Stage playbook | BA can stage playbook cho handoff lien vai tro | Mới co JourneyTemplate va ChecklistTemplate rieng | Chua co lop cau hinh handoff / playbook | Medium |
| Handoff rule | BA can quy tac ban giao lien phong ban | Chua co | Chua co rule handoff | Medium |

## PHAN 2: THIET KE CHI TIET THUOC TINH

### A. REUSE / UPDATE: Quotation
- Reuse schema hien co `Quotation`, nhung can doi tu model gan `Journey` sang model trung gian gan `ServiceRequest` va co line items rieng.

#### Thuoc tinh can bo sung 1: service_request_id
- name: `service_request_id`
- label: `Yeu cau dich vu`
- propType: `ObjectId`
- editor: `Input`
- required: `true`
- refSchemas: `[ServiceRequest]`
- form_width: `width1_2`
- form_group: `Thong Tin Bao Gia`

#### Thuoc tinh can bo sung 2: version_no
- name: `version_no`
- label: `Phien ban bao gia`
- propType: `Number`
- editor: `Input`
- required: `true`
- form_width: `width1_4`
- form_group: `Thong Tin Bao Gia`

### B. CREATE: PriceBook
- label: `Bang gia noi bo`
- y nghia: `Bang gia co hieu luc theo khu vuc / thoi gian, dung de tao du toan noi bo`

#### Thuoc tinh chinh
- `code`: Text, unique
- `name`: Text, required
- `region`: Text
- `effective_from`: DateTime
- `effective_to`: DateTime
- `status`: Text/Dropdown (`draft`, `active`, `expired`)
- `note`: TextArea

### C. CREATE: PriceBookItem
- label: `Dong bang gia noi bo`
- y nghia: `Gia vat tu, nhan cong, van chuyen, giao mac / du day theo bang gia`

#### Thuoc tinh chinh
- `price_book_id`: ObjectId -> PriceBook
- `item_code`: Text
- `item_name`: Text
- `cost_type`: Text/Dropdown (`material`, `labor`, `transport`, `scaffold`, `other`)
- `unit`: Text
- `unit_cost`: Number
- `norm_value`: Number
- `note`: TextArea

### D. CREATE: EstimateVersion
- label: `Phien ban du toan`
- y nghia: `Du toan noi bo cho tung ServiceRequest, cho phep lap nhieu ban`

#### Thuoc tinh chinh
- `service_request_id`: ObjectId -> ServiceRequest
- `version_no`: Number
- `status`: Text/Dropdown (`draft`, `ready`, `approved`, `rejected`)
- `estimated_cost_total`: Number
- `estimated_margin_pct`: Number
- `labor_estimate_total`: Number
- `material_estimate_total`: Number
- `transport_estimate_total`: Number
- `scaffold_estimate_total`: Number
- `note`: TextArea

### E. CREATE: EstimateLineItem
- label: `Dong du toan`
- y nghia: `Chi tiet tung hang muc trong 1 phien ban du toan`

#### Thuoc tinh chinh
- `estimate_version_id`: ObjectId -> EstimateVersion
- `template_id`: ObjectId -> EstimateTemplate
- `price_book_item_id`: ObjectId -> PriceBookItem
- `item_name`: Text
- `unit`: Text
- `quantity`: Number
- `unit_cost`: Number
- `total_cost`: Number
- `cost_type`: Text/Dropdown

### F. CREATE: QuotationMappingRule
- label: `Quy tac mapping bao gia`
- y nghia: `Mapping tu cac dong du toan noi bo sang item hien thi cho khach hang`

#### Thuoc tinh chinh
- `service_type`: Text
- `rule_name`: Text
- `source_cost_types`: Tags
- `target_item_name`: Text
- `formula_note`: TextArea
- `is_active`: Boolean

### G. CREATE: QuotationLineItem
- label: `Dong bao gia`
- y nghia: `Danh sach hang muc hien thi tren bao gia gui khach`

#### Thuoc tinh chinh
- `quotation_id`: ObjectId -> Quotation
- `mapping_rule_id`: ObjectId -> QuotationMappingRule
- `item_name`: Text
- `unit`: Text
- `quantity`: Number
- `unit_price`: Number
- `line_total`: Number
- `note`: TextArea

### H. CREATE: GoNoGoReview
- label: `Danh gia Go / No-Go`
- y nghia: `Phien ban danh gia nhan viec / tu choi viec truoc khi chot bao gia / hop dong`

#### Thuoc tinh chinh
- `service_request_id`: ObjectId -> ServiceRequest
- `estimate_version_id`: ObjectId -> EstimateVersion
- `decision`: Text/Dropdown (`draft`, `go`, `no_go`, `on_hold`, `override`)
- `reviewer_role_id`: ObjectId -> Role
- `reviewer_user`: AuthorizedUser
- `risk_summary`: TextArea
- `override_reason`: TextArea

### I. CREATE: Contract
- label: `Hop dong`
- y nghia: `Hop dong duoc tao tu bao gia da duyet / deal da thang`

#### Thuoc tinh chinh
- `code`: Text, unique
- `service_request_id`: ObjectId -> ServiceRequest
- `quotation_id`: ObjectId -> Quotation
- `contract_date`: DateTime
- `status`: Text/Dropdown (`draft`, `sent`, `signed`, `cancelled`)
- `contract_value`: Number
- `signed_by_customer`: Text
- `signed_by_company`: AuthorizedUser
- `note`: TextArea

### J. CREATE: ContractAppendix
- label: `Phu luc hop dong`
- y nghia: `Phu luc bo sung, dieu chinh pham vi / gia tri hop dong`

#### Thuoc tinh chinh
- `contract_id`: ObjectId -> Contract
- `appendix_no`: Text
- `title`: Text
- `status`: Text/Dropdown
- `effective_date`: DateTime
- `note`: TextArea

### K. CREATE: Project
- label: `Du an`
- y nghia: `Aggregate van hanh noi bo duoc tao sau khi hop dong chot`

#### Thuoc tinh chinh
- `code`: Text, unique
- `name`: Text
- `service_request_id`: ObjectId -> ServiceRequest
- `contract_id`: ObjectId -> Contract
- `customer_id`: ObjectId -> Customer
- `site_address`: TextArea
- `pm_user`: AuthorizedUser
- `supervisor_user`: AuthorizedUser
- `status`: Text/Dropdown (`draft`, `active`, `on_hold`, `completed`, `cancelled`)
- `planned_start_date`: DateTime
- `planned_end_date`: DateTime
- `note`: TextArea

### L. CREATE: ProjectAssignment
- label: `Phan cong du an`
- y nghia: `Danh sach vai tro / nhan su tham gia du an`

#### Thuoc tinh chinh
- `project_id`: ObjectId -> Project
- `role_id`: ObjectId -> Role
- `employee_id`: ObjectId -> Employee
- `assignment_type`: Text/Dropdown (`pm`, `supervisor`, `accountant`, `sale`, `other`)
- `is_primary`: Boolean

### M. CREATE: ProjectTask
- label: `Cong viec du an`
- y nghia: `Task board / WBS de dieu phoi noi bo`

#### Thuoc tinh chinh
- `project_id`: ObjectId -> Project
- `parent_task_id`: ObjectId -> ProjectTask
- `title`: Text
- `task_code`: Text
- `status`: Text/Dropdown (`todo`, `in_progress`, `waiting_review`, `done`, `cancelled`)
- `owner_role_id`: ObjectId -> Role
- `assigned_user`: AuthorizedUser
- `planned_start`: DateTime
- `planned_end`: DateTime
- `note`: TextArea

### N. CREATE: WorkforceAssignment
- label: `Phan cong ky thuat`
- y nghia: `Gan ky thuat profile vao task / dot thi cong`

#### Thuoc tinh chinh
- `project_task_id`: ObjectId -> ProjectTask
- `employee_id`: ObjectId -> Employee
- `role_id`: ObjectId -> Role
- `assigned_by`: AuthorizedUser
- `start_date`: DateTime
- `end_date`: DateTime
- `note`: TextArea

### O. CREATE: StagePlaybook
- label: `Playbook giai doan`
- y nghia: `Mau giao task, checklist, SLA va huong dan cho giai doan handoff`

#### Thuoc tinh chinh
- `journey_template_id`: ObjectId -> JourneyTemplate
- `stage_code`: Text
- `stage_name`: Text
- `goal`: Text
- `owner_role_id`: ObjectId -> Role
- `checklist_template_id`: ObjectId -> ChecklistTemplate
- `sla_hours`: Number
- `instruction_note`: TextArea

### P. CREATE: HandoffRule
- label: `Quy tac ban giao`
- y nghia: `Dieu kien va ben nhan / ben giao khi chuyen giai doan`

#### Thuoc tinh chinh
- `stage_playbook_id`: ObjectId -> StagePlaybook
- `from_role_id`: ObjectId -> Role
- `to_role_id`: ObjectId -> Role
- `entry_criteria`: TextArea
- `exit_criteria`: TextArea
- `is_required`: Boolean

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  Preconstruction / Handoff Overview                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ServiceRequest                                             │
│        │                                                    │
│        ├── EstimateVersion ──< EstimateLineItem             │
│        │          │                                         │
│        │          └── GoNoGoReview                          │
│        │                                                    │
│        ├── Quotation ───────< QuotationLineItem             │
│        │          │                                         │
│        │          └── Contract ──< ContractAppendix         │
│        │                          │                         │
│        └──────────────────────────┴──> Project              │
│                                             │               │
│                           ┌─────────────────┼──────────┐    │
│                           │                 │          │    │
│                    ProjectAssignment   ProjectTask   Playbook│
│                                             │          │    │
│                                             └── Workforce    │
│                                                        │    │
│                                               HandoffRule    │
└─────────────────────────────────────────────────────────────┘
```

Chu thich:
- Group 03 can tach ro 2 lop: `preconstruction` va `project handoff`.
- `Journey` va `JourneyTemplate` duoc reuse, nhung khong thay the duoc `Project` va `ProjectTask`.
- `Quotation` nen duoc giu de tuong thich du lieu cu, dong thoi bo sung lien ket `ServiceRequest`.
