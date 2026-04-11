# SCHEMA ANALYSIS: WorkTask actions cloned from setting

## PHAN 1: SO SANH GAP (CustomerJourneySetting.steps.checklist.actions vs WorkTask)

| Thuoc tinh | Contract nguon | Huong chot cho WorkTask | Ghi chu |
|---|---|---|---|
| Cardinality | actions la danh sach action | WorkTask co actions la Nested | Gom nhieu action trong 1 task |
| Contract action | action_key, action_type, target_field, expected_value, doc_type, min_count, note | Clone dung 7 field nay | Khong them runtime field trong actions |
| Root action_key | Dang ton tai o WorkTask | Giữ tam, deprecated | Phuc vu tuong thich nguoc |

Nhan dinh:
- actions trong WorkTask chi la ban sao contract cau hinh.
- Khong dua cac field runtime nhu status, verified, verified_by, verified_time, document_ids vao actions.
- Trang thai va xac nhan van thuoc cap root cua WorkTask nhu hien tai.

## PHAN 2: THIET KE CHI TIET THUOC TINH

### Thuoc tinh moi: actions
- name: actions
- label: Hanh dong kiem chung
- propType: Nested
- editor: Table
- form_width: fullwidth
- required: false
- unique: false
- form_group: Xu ly chi tiet
- hints: Ban sao cua CustomerJourneySetting.steps.checklist.actions tai thoi diem tao WorkTask.

Nested fields clone dung contract:
1. action_key
2. action_type
3. target_field
4. expected_value
5. doc_type
6. min_count
7. note

### Thuoc tinh deprecated
- action_key root
- Ly do: da co actions[].action_key de luu danh sach action theo cau hinh, nhung field cu duoc giu lai de tuong thich nguoc.

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

+---------------------------------------------------------------+
| WorkTask                                                      |
+---------------------------------------------------------------+
| Journey           [.................................]          |
| Step code         [site_survey.....................]          |
| Title             [Hoan tat khao sat..............]          |
| Status            [pending v]                                 |
| Assignee          [.................................]          |
| Role              [GS v]                                      |
|                                                               |
| Actions (clone from setting)                                  |
| +-----------------------------------------------------------+ |
| | action_key        | action_type          | doc_type       | |
| | fill_site_address | require_journey_field|               | |
| | upload_site_photos| require_document     | site_photos   | |
| | upload_survey_rep.| require_document     | survey_report | |
| +-----------------------------------------------------------+ |
+---------------------------------------------------------------+

Ket luan:
- WorkTask.actions chi clone contract cau hinh, khong chua state runtime rieng.
- Moi logic runtime van xu ly o cap WorkTask root.