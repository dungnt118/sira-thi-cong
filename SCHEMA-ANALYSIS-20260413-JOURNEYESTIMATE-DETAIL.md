# SCHEMA ANALYSIS: JourneyEstimate Detail Expansion

## PHAN 1: SO SANH GAP (BA / UI Need vs Current Schema)

| Thuoc tinh / nhu cau | Yeu cau hien thi va audit | Schema hien tai | Gap / Issue | Priority |
|---|---|---|---|---|
| Role cost breakdown theo user | Can boc tach Kỹ thuật, Giám sát, Sale, Quan ly theo user dang co tren Journey | Chi co labor_breakdown tong hop outsource_labor, internal_fixed_salary, technical_commission, supervisor_commission | Thieu drill-down theo role va theo user; khong co target bucket cho Sale / Quan ly | High |
| Snapshot nhan su tai thoi diem du toan | Can biet estimate nay dang tinh tren ai | JourneyEstimate khong snapshot pm_user, sale_users, supervisor_users, technical_users, owner_user | Neu Journey doi nguoi sau nay thi audit se sai | High |
| Bang vat tu chi tiet | Can biet vat tu gi, ma gi, don gia nao, so luong nao, nguon gia nao | direct_cost_groups.components chi co material_id, labor_price_config_id, quantity, unit_price, line_total | Thieu snapshot code / ten / spec / source label de frontend render on dinh va audit ve sau | High |
| Hien thi ten vat tu ngay trong DTO | UI can render truc tiep ten vat tu / bang gia | Query journeyEstimate DTO chua tra idx_material_id hoac ten snapshot | Frontend muon hien thi phai query them, rat de lech du lieu | Medium |
| Summary bucket vs chi tiet nhan su| Cost bucket van can giu, nhung can mo xuong cac dong role-cost | standardized_buckets va labor_breakdown dang o muc summary | Chua du de ly giai bucket 02, 06, 07 theo role / user | High |
| Summary group vs chi tiet vat tu | direct_cost_groups chi nen la header / group, can co detail row on dinh | components hien co la row detail co ban | Chua du thong tin snapshot de render bang vat tu chi tiet dung nghia | Medium |

Ket luan phan 1
- Van de khong phai UI thuan tuy. Backend contract hien tai CHUA DU GIAU cho muc tieu boc tach chi phi theo role-user va snapshot vat tu chi tiet co tinh audit.
- Frontend cung dang thieu UI, nhung ngay ca khi bo sung UI thi van khong boc tach chuan duoc neu khong mo rong JourneyEstimate.
- Do do day la backend-contract gap truoc, frontend gap sau.

## PHAN 2: THIET KE CHI TIET THUOC TINH DE XUAT

### Thuoc tinh 1: journey_role_snapshot
- name: journey_role_snapshot
- label: Snapshot nhan su Journey
- propType: Object
- editor: Input
- form_width: fullwidth
- required: false
- unique: false
- form_group: Thong Tin Nguon
- hints: Snapshot user lien quan tai thoi diem lap du toan de phuc vu audit va boc tach chi phi theo role
- nested subfields
  - pm_user: AuthorizedUser
  - owner_user: AuthorizedUser
  - sale_users: AuthorizedUsers
  - supervisor_users: AuthorizedUsers
  - technical_users: AuthorizedUsers

### Thuoc tinh 2: role_cost_allocations
- name: role_cost_allocations
- label: Chi tiet chi phi theo role / user
- propType: Nested
- editor: Table
- form_width: fullwidth
- required: false
- unique: false
- form_group: Chi Phi Nhan Su
- hints: Drill-down cho bucket 02, 06, 07 theo role va user thuc te
- nested subfields
  - bucket_code: Text (Dropdown) values = 02_labor_total,06_sales_cost,07_management_cost
  - role_code: Text (Dropdown) values = outsource,technical,supervisor,sale,pm,owner_admin,internal_support
  - usernames: AuthorizedUsers
  - headcount: Number
  - work_days: Number
  - calc_mode: Text (Dropdown) values = salary_allocation,commission_pct,daily_rate,fixed_amount,manual
  - unit_rate: Number (Money)
  - allocation_pct: Number
  - amount: Number (Money)
  - formula_snapshot: Text (TextArea)
  - note: Text (TextArea)

### Thuoc tinh 3: labor_breakdown (update mo rong)
- Giữ labor_breakdown la summary cho bucket 02
- Bo sung subfields
  - role_allocation_total: Number (Money)
  - sale_related_excluded: Number (Money) - de nhac rang Sale di vao bucket 06, khong nham sang bucket 02
  - management_related_excluded: Number (Money) - de nhac rang PM / owner / admin di vao bucket 07
- Khong thay the role_cost_allocations bang labor_breakdown vi labor_breakdown chi nen la summary.

### Thuoc tinh 4: direct_cost_groups.components (update mo rong)
- Giữ components la row detail hien tai
- Bo sung snapshot fields de frontend co the render bang vat tu chi tiet ma khong can join phu thuoc
- subfields de xuat bo sung
  - item_code: Text
  - item_name: Text
  - item_spec: Text
  - brand_name: Text
  - source_type: Text (Dropdown) values = material_master,labor_price_config,manual,policy,survey
  - source_ref_label: Text
  - quantity_per_unit: Number
  - expanded_quantity: Number
  - waste_pct: Number
  - cost_note: Text (TextArea)

### Thuoc tinh 5: direct_cost_groups (update nhe)
- Giữ group summary hien tai
- Bo sung
  - group_code: Text
  - template_name_snapshot: Text
  - cost_basis_note: Text (TextArea)

### Thuoc tinh 6: query / DTO contract
- JourneyEstimate DTO can tra them cac field snapshot moi cho components va role_cost_allocations
- Neu co material_id thi nen tra them idx_material_id trong DTO hoac item_name snapshot de UI khong phai query bo sung.
 

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

+-----------------------------------------------------------------------+
| JourneyEstimate - Detail Expansion                                     |
+-----------------------------------------------------------------------+
| [Thong Tin Nguon]                                                     |
|  Policy tinh gia:      [Policy X]                                     |
|  Snapshot nhan su:     PM [user]  Sale [2 users]  GS [1]  KT [1]      |
|                                                                       |
| [Cost Buckets Summary]                                                |
|  01 Materials   [31,500,000]   02 Labor   [4,955,000]                |
|  06 Sales Cost  [1,247,025]   07 Management [748,215]               |
|                                                                       |
| [Chi Phi Theo Role / User]                                            |
|  Bucket    Role        Users                Mode          Amount       |
|  02        technical   tuanta@...           commission    945,000      |
|  02        supervisor  gs1@...              commission    1,260,000    |
|  06        sale        sale1@...,sale2@... salary_alloc  500,000      |
|  07        pm          pm@...               salary_alloc  350,000      |
|                                                                       |
| [Vat Tu / HMG Truc Tiep]                                              |
|  HMG: Thi cong tem 45m2 - standard                                    |
|  Code     Ten vat tu       Spec      DVT   SL   Don gia   Thanh tien   |
|  VT001    Son lot A       18L       lon   3    700,000   2,100,000    |
|  VT002    Keo phu B       20kg      bao   5    950,000   4,750,000    |
|                                                                       |
|  [Ghi chu group / cost basis note...]                                |
+-----------------------------------------------------------------------+

Chu thich
- Summary bucket van duoc giu o standardized_buckets.
- Drill-down theo role / user dua vao role_cost_allocations.
- Drill-down vat tu chi tiet dua vao direct_cost_groups.components mo rong snapshot.

## DE XUAT THUC THI
- Phan nhan cong / Sale / Quan ly: backend schema THIEU, can mo rong JourneyEstimate.
- Phan vat tu chi tiet: backend schema hien tai CO MOT PHAN, nhung chua du snapshot va DTO contract cho UI render audit-on-dinh; cung nen mo rong.
- Sau khi schema duoc mo rong, frontend moi nen sua Step04 de render bang role-cost va bang vat tu chi tiet; Step05 chi doc quote da map, khong duplicate UI estimate.

## TOOLCALL DU KIEN NEU DUOC XAC NHAN
- schema-update_nested_property: bo sung journey_role_snapshot
- schema-update_nested_property: bo sung role_cost_allocations
- schema-update_nested_property: mo rong labor_breakdown
- schema-update_nested_property: mo rong direct_cost_groups.components
- schema-update_nested_property: mo rong direct_cost_groups
- schema-get de verify

## NGUON DOI CHIEU
- Journey users hien co: src/services/core-contracts/types/journey.types.ts
- JourneyEstimate types hien co: src/services/core-contracts/types/journeyEstimate.types.ts
- JourneyEstimate DTO query hien co: src/services/core-contracts/queries/journeyEstimate.queries.ts
- Step04 hien tai: src/pages/shared/JourneySteps/Step04SolutionOrchestration.tsx
- Step05 hien tai: src/pages/shared/JourneySteps/Step05QuoteOrchestration.tsx 
