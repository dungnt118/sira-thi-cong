# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 02 - CRM AND SALES

## PHAN 1: SO SANH GAP (BA vs Current Schema)

| Thuoc tinh / Schema | Yeu cau BA | Schema hien tai | Gap / Issue | Priority |
|---|---|---|---|---|
| Customer.code | Can ma khach hang de quan ly va doi soat | Chua co | Can bo sung ma khach hang duy nhat | High |
| Customer owner / note | Frontend co PM phu trach va ghi chu CRM | Chua co | Can bo sung owner va ghi chu intake | Medium |
| Customer dia chi | Frontend dung city + district + address | Dang co province + ward + address | Lech naming voi frontend/BA | Medium |
| ServiceRequest intake mode | BA yeu cau tao request linh hoat, co the tao truoc roi moi tao / reuse customer | customer_id dang bat buoc | Chua ho tro request-first intake | High |
| ServiceRequest snapshot | Can nhap nhanh ten, sdt, email, dia chi cong trinh, loai dich vu | Hien chi co customer_id, name, notes | Thieu truong tiep nhan lead nhanh | High |
| Stage history | BA wave 2 yeu cau dynamic pipeline + stage history | Chua co schema | Can schema lich su chuyen stage | High |
| Interaction log | Module A co Interaction Log | ActivityLog la audit chung, khong gan ServiceRequest | Can schema CRM log tuong tac rieng | High |
| SurveyRecord link | Khao sat phai gan voi ServiceRequest hoac Project | SurveyRecord dang bat buoc journey_id | Lech thu tu nghiep vu, khong dung duoc truoc convert | High |
| SurveyRecord cau truc | BA yeu cau draft, bang hien trang, hang muc, media co context | Hien moi co thong tin tong quan + media_files | Thieu lien ket request va cau truc survey | High |
| SurveySummary | BA co Current Condition Report, co versioning | Chua co schema | Can schema report tom tat va de xuat bien phap | Medium |
| CustomerAddress / CustomerContact | Ke hoach cu tung tach schema rieng | Khong co | Chua thay bang chung bat buoc tao rieng trong wave nay | Low |
| SurveyAppointment | Ke hoach cu tung tach schema rieng | Khong co | Tam thoi hap thu bang scheduled_date + draft cua SurveyRecord | Low |

## PHAN 2: THIET KE CHI TIET THUOC TINH

### A. UPDATE SCHEMA: Customer

#### Thuoc tinh 1: code
- name: `code`
- label: `Ma khach hang`
- propType: `Text`
- editor: `Input`
- form_width: `width1_3`
- required: `false`
- unique: `true`
- form_group: `Thong Tin Co Ban`
- hints: `VD: KH-2026-001`

#### Thuoc tinh 2: district
- name: `district`
- label: `Quan / Huyen`
- propType: `Text`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin Co Ban`

#### Thuoc tinh 3: city
- name: `city`
- label: `Tinh / Thanh pho`
- propType: `Text`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin Co Ban`

#### Thuoc tinh 4: assigned_pm_id
- name: `assigned_pm_id`
- label: `PM phu trach`
- propType: `AuthorizedUser`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin CRM`

#### Thuoc tinh 5: notes
- name: `notes`
- label: `Ghi chu CRM`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `false`
- form_group: `Thong Tin CRM`

### B. UPDATE SCHEMA: ServiceRequest

#### Thuoc tinh 1: customer_id
- name: `customer_id`
- label: `Khach hang`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[Customer]`
- form_group: `Thong Tin Tiep Nhan`
- hints: `Cho phep de trong khi moi tiep nhan lead, se link Customer sau`

#### Thuoc tinh 2: customer_name
- name: `customer_name`
- label: `Ten khach hang nhap nhanh`
- propType: `Text`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin Tiep Nhan`

#### Thuoc tinh 3: contact_phone
- name: `contact_phone`
- label: `So dien thoai tiep nhan`
- propType: `Text`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin Tiep Nhan`

#### Thuoc tinh 4: contact_email
- name: `contact_email`
- label: `Email tiep nhan`
- propType: `Text`
- editor: `Email`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin Tiep Nhan`

#### Thuoc tinh 5: site_address
- name: `site_address`
- label: `Dia chi cong trinh`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `false`
- form_group: `Thong Tin Tiep Nhan`

#### Thuoc tinh 6: requested_service
- name: `requested_service`
- label: `Nhu cau dich vu`
- propType: `Text`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- form_group: `Thong Tin Tiep Nhan`

#### Thuoc tinh 7: duplicate_customer_id
- name: `duplicate_customer_id`
- label: `Khach hang nghi trung`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[Customer]`
- form_group: `Thong Tin Tiep Nhan`

### C. CREATE SCHEMA: ServiceRequestStageHistory
- label: `Lich su chuyen giai doan`
- y nghia: `Luu moi lan ServiceRequest di chuyen stage de phuc vu timeline va audit nghiep vu`

#### Thuoc tinh 1: service_request_id
- name: `service_request_id`
- label: `Yeu cau dich vu`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `true`
- refSchemas: `[ServiceRequest]`

#### Thuoc tinh 2: from_stage_id
- name: `from_stage_id`
- label: `Tu giai doan`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[PipelineStage]`

#### Thuoc tinh 3: to_stage_id
- name: `to_stage_id`
- label: `Den giai doan`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `true`
- refSchemas: `[PipelineStage]`

#### Thuoc tinh 4: changed_by
- name: `changed_by`
- label: `Nguoi chuyen stage`
- propType: `AuthorizedUser`
- editor: `Input`
- form_width: `width1_2`
- required: `false`

#### Thuoc tinh 5: change_note
- name: `change_note`
- label: `Ghi chu chuyen stage`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `false`

### D. CREATE SCHEMA: ServiceRequestInteractionLog
- label: `Nhat ky tuong tac khach hang`
- y nghia: `Luu cuoc goi, zalo, email, gap truc tiep va ket qua tiep theo gan voi ServiceRequest`

#### Thuoc tinh 1: service_request_id
- name: `service_request_id`
- label: `Yeu cau dich vu`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `true`
- refSchemas: `[ServiceRequest]`

#### Thuoc tinh 2: channel
- name: `channel`
- label: `Kenh tuong tac`
- propType: `Text`
- editor: `Dropdown`
- form_width: `width1_2`
- required: `true`
- value_options: phone, zalo, email, meeting, site_visit, other

#### Thuoc tinh 3: interaction_time
- name: `interaction_time`
- label: `Thoi diem tuong tac`
- propType: `DateTime`
- editor: `DateTimePicker`
- form_width: `width1_2`
- required: `true`

#### Thuoc tinh 4: actor_role_id
- name: `actor_role_id`
- label: `Vai tro xu ly`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[Role]`

#### Thuoc tinh 5: actor_user
- name: `actor_user`
- label: `Nguoi thuc hien`
- propType: `AuthorizedUser`
- editor: `Input`
- form_width: `width1_2`
- required: `false`

#### Thuoc tinh 6: summary
- name: `summary`
- label: `Noi dung tuong tac`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `true`

#### Thuoc tinh 7: next_action
- name: `next_action`
- label: `Buoc tiep theo`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `false`

#### Thuoc tinh 8: next_action_at
- name: `next_action_at`
- label: `Hen xu ly tiep`
- propType: `DateTime`
- editor: `DateTimePicker`
- form_width: `width1_2`
- required: `false`

### E. UPDATE SCHEMA: SurveyRecord

#### Thuoc tinh 1: service_request_id
- name: `service_request_id`
- label: `Yeu cau dich vu`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[ServiceRequest]`
- hints: `Dung cho giai doan CRM truoc khi convert sang Journey`

#### Thuoc tinh 2: journey_id
- name: `journey_id`
- label: `Hanh trinh`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[Journey]`
- hints: `Giu lai de dung cho giai doan sau`

#### Thuoc tinh 3: survey_status
- name: `survey_status`
- label: `Trang thai khao sat`
- propType: `Text`
- editor: `Dropdown`
- form_width: `width1_2`
- required: `false`
- value_options: draft, pending_completion, completed, approved

#### Thuoc tinh 4: condition_items
- name: `condition_items`
- label: `Bang hien trang`
- propType: `Nested`
- editor: `Table`
- form_width: `fullwidth`
- required: `false`
- nested: `area_name, condition_note, measurement_note, risk_note`

#### Thuoc tinh 5: proposed_items
- name: `proposed_items`
- label: `Hang muc de xuat`
- propType: `Nested`
- editor: `Table`
- form_width: `fullwidth`
- required: `false`
- nested: `item_name, scope_note, quantity_note, technical_note`

### F. CREATE SCHEMA: SurveySummary
- label: `Bao cao hien trang va de xuat bien phap`
- y nghia: `Luu report tong hop sau khao sat, co versioning de PM/Sale review va gui khach hang`

#### Thuoc tinh 1: survey_record_id
- name: `survey_record_id`
- label: `Bien ban khao sat`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `true`
- refSchemas: `[SurveyRecord]`

#### Thuoc tinh 2: service_request_id
- name: `service_request_id`
- label: `Yeu cau dich vu`
- propType: `ObjectId`
- editor: `Input`
- form_width: `width1_2`
- required: `false`
- refSchemas: `[ServiceRequest]`

#### Thuoc tinh 3: version_no
- name: `version_no`
- label: `Phien ban`
- propType: `Number`
- editor: `Input`
- form_width: `width1_4`
- required: `true`

#### Thuoc tinh 4: report_title
- name: `report_title`
- label: `Tieu de bao cao`
- propType: `Text`
- editor: `Input`
- form_width: `width2_3`
- required: `true`

#### Thuoc tinh 5: site_context
- name: `site_context`
- label: `Tom tat cong trinh va boi canh`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `false`

#### Thuoc tinh 6: actual_condition
- name: `actual_condition`
- label: `Thuc trang chi tiet`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `true`

#### Thuoc tinh 7: root_cause
- name: `root_cause`
- label: `Nhan dinh / Nguyen nhan`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `false`

#### Thuoc tinh 8: proposed_solution
- name: `proposed_solution`
- label: `De xuat bien phap`
- propType: `Text`
- editor: `TextArea`
- form_width: `fullwidth`
- required: `true`

#### Thuoc tinh 9: review_status
- name: `review_status`
- label: `Trang thai review`
- propType: `Text`
- editor: `Dropdown`
- form_width: `width1_2`
- required: `false`
- value_options: draft, in_review, approved

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  Service Request - CRM Intake                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ Thong Tin Tiep Nhan ─────────────────────────────────┐ │
│  │                                                         │ │
│  │  [Ma YC]         [______________]   [Tieu de] [______] │ │
│  │  [KH hien huu]   [Chon KH........] [Ten KH] [_______] │ │
│  │  [Dien thoai]    [______________]   [Email] [_______] │ │
│  │  [Pipeline]      [Dropdown v.....] [Stage] [v.......] │ │
│  │  [PM phu trach]  [User..........]  [DV]    [_______] │ │
│  │                                                         │ │
│  │  [Dia chi cong trinh]                                  │ │
│  │  [___________________________________________________] │ │
│  │                                                         │ │
│  │  [Khach nghi trung] [Chon KH neu co..................] │ │
│  │                                                         │ │
│  │  [Ghi chu]                                             │ │
│  │  [___________________________________________________] │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ Sau Khao Sat ────────────────────────────────────────┐ │
│  │  SurveyRecord gan ServiceRequest                       │ │
│  │  SurveySummary version 1..n                            │ │
│  │  Stage history + interaction log                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                           [Huy]  [Luu]                      │
└─────────────────────────────────────────────────────────────┘
```

Chu thich:
- Slice 1 uu tien `Customer` + `ServiceRequest`.
- Slice 2 bo sung timeline nghiep vu qua stage history va interaction log.
- Slice 3 chuan hoa khao sat de dung duoc truoc va sau khi convert sang `Journey`.
