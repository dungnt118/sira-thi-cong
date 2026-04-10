# SCHEMA ANALYSIS: CustomerJourneySetting (Override Final Draft)

## ðŸ“Š PHáº¦N 1: SO SÃNH GAP (YÃªu cáº§u má»›i vs Schema hiá»‡n táº¡i)

### A. Chuáº©n hÃ³a 12 bÆ°á»›c Journey theo hÆ°á»›ng override trá»±c tiáº¿p
| Háº¡ng má»¥c | YÃªu cáº§u má»›i | Schema hiá»‡n táº¡i | Gap/Issue | Priority |
|---|---|---|---|---|
| Danh má»¥c bÆ°á»›c | 12 bÆ°á»›c chuáº©n, giá»¯ nguyÃªn tÃªn field cÅ© (`journey_step_code`, `current_step`) vÃ  override value_options | Há»‡ thá»‘ng Ä‘ang dÃ¹ng 13 mÃ£ canonical cÅ© táº¡i CustomerJourneySetting, Journey.current_step, WorkTask.journey_step_code, JourneyDocument.journey_step_code | KhÃ´ng dÃ¹ng `_v2`; pháº£i thay trá»±c tiáº¿p danh má»¥c step cÅ© | High |
| Ã nghÄ©a step | Step code map Ä‘Ãºng 12 bÆ°á»›c nghiá»‡p vá»¥ má»›i | Step hiá»‡n táº¡i chi tiáº¿t theo pipeline cÅ© (qualification, survey_planning, survey_review, quotation_sent...) | Nhiá»u mÃ£ cÅ© sáº½ bá»‹ loáº¡i hoáº·c gá»™p nghÄ©a; cáº§n migrate dá»¯ liá»‡u | High |
| RÃ ng buá»™c theo step | BÆ°á»›c 3/4/5 cÃ³ tÃ i liá»‡u báº¯t buá»™c; BÆ°á»›c 11 cÃ³ liÃªn káº¿t journey gá»‘c | ChÆ°a cÃ³ mÃ´ hÃ¬nh checklist/action kiá»ƒm chá»©ng Ä‘Æ°á»£c; Journey chÆ°a cÃ³ liÃªn káº¿t journey gá»‘c | Thiáº¿u cáº¥u trÃºc verify runtime | High |

### B. Äá»“ng bá»™ roles thÃ nh static value_options
| Háº¡ng má»¥c | YÃªu cáº§u má»›i | Schema hiá»‡n táº¡i | Gap/Issue | Priority |
|---|---|---|---|---|
| step.roles.role | KhÃ´ng dÃ¹ng Lookup; chuyá»ƒn sang static enum giá»‘ng checklist.role | Lookup sang Role | Cáº§n override propType/valueOptions á»Ÿ táº¥t cáº£ step object | High |
| Danh má»¥c role | Bá»• sung HC Ä‘á»ƒ tÃ¡ch HÃ nh chÃ­nh khá»i Káº¿ toÃ¡n | Codebase hiá»‡n cÃ³ QL, GS, KYT, KT, KD, ADMIN | Thiáº¿u HC | High |
| Pháº¡m vi Ã¡p dá»¥ng | DÃ¹ng cho cáº¥u hÃ¬nh vÃ  phÃ¢n quyá»n, chÆ°a cáº§n layout má»›i | USER_ROLES á»Ÿ frontend chÆ°a cÃ³ HC | Cáº§n Ä‘á»“ng bá»™ source static role chung | Medium |

### C. Checklist cáº§n chi tiáº¿t hÆ¡n: role + actions
| Háº¡ng má»¥c | YÃªu cáº§u má»›i | Schema hiá»‡n táº¡i | Gap/Issue | Priority |
|---|---|---|---|---|
| name | Giá»¯ nguyÃªn | CÃ³ | OK | Low |
| is_required | Giá»¯; lÃ  Ä‘iá»u kiá»‡n cho action báº¯t buá»™c | CÃ³ | Cáº§n rule validate rÃµ | Medium |
| description | Giá»¯ nguyÃªn | CÃ³ | OK | Low |
| role | Má»›i; static value_options | ChÆ°a cÃ³ | Thiáº¿u | High |
| actions | Má»›i; enum hÃ³a Ä‘á»ƒ backend kiá»ƒm chá»©ng | ChÆ°a cÃ³ | Thiáº¿u hoÃ n toÃ n cáº¥u trÃºc runtime | High |

### D. JourneyDocument pháº£i chuáº©n hÃ³a báº±ng doc_type vÃ  bá» context_type
| Háº¡ng má»¥c | YÃªu cáº§u má»›i | Schema hiá»‡n táº¡i | Gap/Issue | Priority |
|---|---|---|---|---|
| Ngá»¯ cáº£nh tÃ i liá»‡u | Chá»‰ dÃ¹ng journey_step_code + doc_type | Äang cÃ³ cáº£ journey_step_code vÃ  context_type | context_type bá»‹ trÃ¹ng nghÄ©a, dá»… lá»‡ch dá»¯ liá»‡u | High |
| Lá»c/search tÃ i liá»‡u | Filter theo doc_type, text search theo title hoáº·c description | ChÆ°a cÃ³ doc_type | KhÃ´ng Ä‘á»§ Ä‘á»ƒ verify Step 3/4/5 vÃ  lá»c chuáº©n | High |

### E. WorkTask pháº£i giá»¯ tÃªn field cÅ© vÃ  má»Ÿ rá»™ng traceability
| Háº¡ng má»¥c | YÃªu cáº§u má»›i | Schema hiá»‡n táº¡i | Gap/Issue | Priority |
|---|---|---|---|---|
| journey_step_code | Override trá»±c tiáº¿p danh má»¥c cÅ©, khÃ´ng táº¡o _v2 | Äang dÃ¹ng 13 step cÅ© | Cáº§n Ä‘á»•i value_options trá»±c tiáº¿p | High |
| assignee | AuthorizedUser, sinh tá»« config + Journey | ChÆ°a cÃ³ | Thiáº¿u | High |
| action_key | Äá»“ng bá»™ enum vá»›i checklist.actions.action_key | ChÆ°a cÃ³ | Thiáº¿u | High |
| correlationId | LiÃªn káº¿t tá»›i dá»¯ liá»‡u phÃ¡t sinh do user thá»±c hiá»‡n tá»« task | ChÆ°a cÃ³ | Thiáº¿u traceability | High |

### F. Impact thá»±c táº¿ trong codebase
- context_type hiá»‡n Ä‘ang Ä‘Æ°á»£c dÃ¹ng trong mock data, GraphQL queries vÃ  generated types liÃªn quan JourneyDocument, PortalDocument, PortalThread.
- journey_step_code hiá»‡n lan ráº¥t rá»™ng á»Ÿ nhiá»u schema/query/type generated, nÃªn viá»‡c override step enum lÃ  breaking á»Ÿ táº§ng type/query dÃ¹ tÃªn field Ä‘Æ°á»£c giá»¯ nguyÃªn.
- USER_ROLES hiá»‡n Ä‘ang Ä‘Æ°á»£c khai bÃ¡o tÄ©nh trong frontend nhÆ°ng chÆ°a cÃ³ HC; schema vÃ  frontend pháº£i cáº­p nháº­t cÃ¹ng bá»™ enum.

## ðŸ—ï¸ PHáº¦N 2: THIáº¾T Káº¾ CHI TIáº¾T ÄIá»€U CHá»ˆNH (override, khÃ´ng dÃ¹ng _v2)

### 1. Bá»™ 12 step code chuáº©n Ä‘á»ƒ override trá»±c tiáº¿p
| STT | value | label | Ghi chÃº nghiá»‡p vá»¥ |
|---|---|---|---|
| 1 | lead_new | Lead má»›i (KH Má»›i) | Market vÃ  website |
| 2 | consult_contact | LiÃªn há»‡ tÆ° váº¥n | Bao gá»“m háº¹n lá»‹ch kháº£o sÃ¡t |
| 3 | site_survey | Kháº£o sÃ¡t thá»±c táº¿ | Required: bÃ¡o cÃ¡o + hÃ¬nh áº£nh |
| 4 | solution_design | XÃ¢y dá»±ng giáº£i phÃ¡p | Required: tÃ i liá»‡u giáº£i phÃ¡p |
| 5 | quotation | BÃ¡o giÃ¡ | Required: phÆ°Æ¡ng Ã¡n KD + bÃ¡o giÃ¡ KH |
| 6 | contract | Há»£p Ä‘á»“ng | Bao gá»“m táº¡m á»©ng |
| 7 | execution | Triá»ƒn khai thi cÃ´ng | CÃ³ thá»ƒ bao gá»“m nghiá»‡m thu vÃ  thu tiá»n theo giai Ä‘oáº¡n |
| 8 | final_acceptance | Nghiá»‡m thu cuá»‘i | GS, Sale, KT |
| 9 | payment | Thanh toÃ¡n | Káº¿ toÃ¡n |
| 10 | maintenance | Báº£o trÃ¬ | |
| 11 | warranty | Báº£o hÃ nh | Gáº¯n liÃªn káº¿t journey gá»‘c |
| 12 | after_sales | CSKH sau bÃ¡n | |

### 2. Bá»™ static roles chuáº©n hÃ³a dÃ¹ng chung cho step.roles.role vÃ  checklist.role
| value | label | color | faIcon | Ghi chÃº |
|---|---|---|---|---|
| QL | Quáº£n lÃ½ dá»± Ã¡n | #2563eb | fa-user-tie | Giá»¯ |
| GS | GiÃ¡m sÃ¡t | #16a34a | fa-helmet-safety | Giá»¯ |
| KYT | Ká»¹ thuáº­t | #0891b2 | fa-screwdriver-wrench | Giá»¯ |
| KT | Káº¿ toÃ¡n | #f59e0b | fa-calculator | Giá»¯ |
| HC | HÃ nh chÃ­nh | #7c3aed | fa-building-user | Má»›i |
| KD | Kinh doanh | #db2777 | fa-handshake | Giá»¯ |
| ADMIN | Quáº£n trá»‹ viÃªn | #dc2626 | fa-user-shield | Giá»¯ |
- step.roles[] váº«n mÃ´ táº£ quyá»n vÃ  thÃ nh pháº§n tham gia á»Ÿ cáº¥p step.
- checklist.role lÃ  vai trÃ² chá»‹u trÃ¡ch nhiá»‡m chÃ­nh cho item cá»¥ thá»ƒ.
- Cáº£ hai Ä‘á»u dÃ¹ng cÃ¹ng má»™t static enum, khÃ´ng Lookup sang schema Role.

### 3. Cáº¥u trÃºc checklist má»Ÿ rá»™ng
- Giá»¯ nguyÃªn 3 field cÅ©: name, is_required, description.
- Bá»• sung 2 field má»›i: role, actions.

#### role
- name: role
- label: Vai trÃ² phá»¥ trÃ¡ch
- propType: Text
- editor: Dropdown
- form_width: width1_2
- required: true
- value_options: dÃ¹ng Ä‘Ãºng bá»™ static roles cÃ³ HC

#### actions
- name: actions
- label: HÃ nh Ä‘á»™ng kiá»ƒm chá»©ng
- propType: Nested
- editor: Table
- form_width: fullwidth
- required: false
- hints: Chá»‰ cáº§n cáº¥u hÃ¬nh khi checklist.is_required = true.

### 4. Enum chuáº©n cho actions.action_type
| value | label | Ã nghÄ©a kiá»ƒm chá»©ng | DÃ¹ng khi |
|---|---|---|---|
| require_journey_field | Báº¯t buá»™c nháº­p trÆ°á»ng Journey | Má»™t field cá»§a Journey pháº£i cÃ³ dá»¯ liá»‡u | VÃ­ dá»¥ Ä‘á»‹a chá»‰ cÃ´ng trÃ¬nh, chá»§ sá»Ÿ há»¯u, hÃ nh trÃ¬nh gá»‘c |
| require_document | Báº¯t buá»™c táº£i tÃ i liá»‡u | Journey pháº£i cÃ³ JourneyDocument theo doc_type vÃ  min_count | Step 3, 4, 5, há»£p Ä‘á»“ng, nghiá»‡m thu |
| require_status_equals | Báº¯t buá»™c tráº¡ng thÃ¡i Ä‘áº¡t giÃ¡ trá»‹ xÃ¡c Ä‘á»‹nh | Má»™t status field trÃªn Journey pháº£i báº±ng expected_value | VÃ­ dá»¥ quote_status = approved |
- KhÃ´ng khuyáº¿n nghá»‹ thÃªm ngay cÃ¡c loáº¡i phá»©c táº¡p hÆ¡n nhÆ° require_related_record á»Ÿ vÃ²ng nÃ y.

### 5. Enum chuáº©n cho actions.target_field
- target_field chá»‰ dÃ¹ng cho require_journey_field vÃ  require_status_equals.
- Äá» xuáº¥t khÃ³a thÃ nh whitelist static value_options thay vÃ¬ cho nháº­p text tá»± do.
| value | label | Loáº¡i action phÃ¹ há»£p | Ghi chÃº |
|---|---|---|---|
| request_title | TiÃªu Ä‘á» yÃªu cáº§u | require_journey_field | CÃ³ sáºµn |
| customer_id | KhÃ¡ch hÃ ng | require_journey_field | CÃ³ sáºµn |
| owner_user | Chá»§ sá»Ÿ há»¯u hÃ nh trÃ¬nh | require_journey_field | CÃ³ sáºµn |
| site_address | Äá»‹a chá»‰ cÃ´ng trÃ¬nh | require_journey_field | CÃ³ sáºµn |
| serviceTypeId | Loáº¡i dá»‹ch vá»¥ yÃªu cáº§u | require_journey_field | CÃ³ sáºµn |
| go_no_go_status | Go/No-Go | require_status_equals | CÃ³ sáºµn |
| survey_status | Tráº¡ng thÃ¡i kháº£o sÃ¡t | require_status_equals | CÃ³ sáºµn |
| quote_status | Tráº¡ng thÃ¡i bÃ¡o giÃ¡ | require_status_equals | CÃ³ sáºµn |
| project_status | Tráº¡ng thÃ¡i triá»ƒn khai | require_status_equals | CÃ³ sáºµn |
| portal_publish_status | Tráº¡ng thÃ¡i cÃ´ng bá»‘ portal | require_status_equals | CÃ³ sáºµn |
| journey_kind | Loáº¡i hÃ nh trÃ¬nh | require_status_equals | Field má»›i Ä‘á» xuáº¥t |
| origin_journey_id | HÃ nh trÃ¬nh gá»‘c | require_journey_field | Field má»›i Ä‘á» xuáº¥t |

### 6. Enum chuáº©n cho JourneyDocument.doc_type
| value | label | Step thÆ°á»ng dÃ¹ng | Ghi chÃº |
|---|---|---|---|
| survey_report | BÃ¡o cÃ¡o kháº£o sÃ¡t | site_survey | Báº¯t buá»™c cho step 3 |
| site_photos | HÃ¬nh áº£nh hiá»‡n tráº¡ng | site_survey | Báº¯t buá»™c cho step 3 |
| solution_doc | TÃ i liá»‡u giáº£i phÃ¡p | solution_design | Báº¯t buá»™c cho step 4 |
| business_plan | PhÆ°Æ¡ng Ã¡n kinh doanh | quotation | Báº¯t buá»™c cho step 5 |
| quotation | BÃ¡o giÃ¡ khÃ¡ch hÃ ng | quotation | Báº¯t buá»™c cho step 5 |
| contract | Há»£p Ä‘á»“ng | contract | |
| advance_request | Há»“ sÆ¡ táº¡m á»©ng | contract | Náº¿u cáº§n theo dÃµi táº¡m á»©ng |
| stage_acceptance | BiÃªn báº£n nghiá»‡m thu giai Ä‘oáº¡n | execution | |
| stage_payment_proof | Chá»©ng tá»« thu tiá»n theo giai Ä‘oáº¡n | execution | |
| final_acceptance | BiÃªn báº£n nghiá»‡m thu cuá»‘i | final_acceptance | |
| payment_receipt | Chá»©ng tá»« thanh toÃ¡n | payment | |
| maintenance_record | Há»“ sÆ¡ báº£o trÃ¬ | maintenance | |
| warranty_record | Há»“ sÆ¡ báº£o hÃ nh | warranty | |
| after_sales_note | Ghi nháº­n CSKH sau bÃ¡n | after_sales | |
- journey_step_code lÃ  context nghiá»‡p vá»¥ chÃ­nh.
- doc_type lÃ  loáº¡i tÃ i liá»‡u chi tiáº¿t Ä‘á»ƒ filter, search vÃ  verify.
- context_type bá»‹ loáº¡i bá» hoÃ n toÃ n khá»i JourneyDocument.

### 7. Äiá»u chá»‰nh JourneyDocument
- Giá»¯ láº¡i: journey_id, journey_step_code, description, files, published_at, is_published.
- ThÃªm doc_type (Text/Dropdown, required, width1_2).
- ThÃªm title (Text/Input, optional, width1_2) Ä‘á»ƒ há»— trá»£ text search tá»‘t hÆ¡n.
- Loáº¡i bá» context_type.

### 8. Điều chỉnh Journey
- current_step: giữ nguyên tên field, override value_options sang bộ 12 step mới.
- Thêm journey_kind (Text/Dropdown): main, maintenance, warranty.
- Thêm origin_journey_id (ObjectId ref Journey).

### 9. Điều chỉnh WorkTask
- journey_step_code: giữ nguyên tên field, override value_options sang bộ 12 step mới.
- Thêm assignee (AuthorizedUser).
- Thêm assignee_role (Text/Dropdown, dùng chung bộ static roles có HC).
- Thêm action_key (Text/Dropdown), đồng bộ enum với checklist.actions.action_key.
- Thêm documentId (ObjectId/Input, refSchemas = [JourneyDocument]) để liên kết tới tài liệu do user thực hiện từ task.
- documentId chỉ dùng khi action_key thuộc nhóm require_document; các task không sinh tài liệu có thể để trống.

### 10. Đề xuất action catalog dùng chung toàn hệ thống
| action_key | action_label | action_type | target_field hoặc doc_type đề xuất |
|---|---|---|---|
| fill_site_address | Nhập địa chỉ công trình | require_journey_field | target_field = site_address |
| assign_owner_user | Gán chủ sở hữu hành trình | require_journey_field | target_field = owner_user |
| upload_survey_report | Tải báo cáo khảo sát | require_document | doc_type = survey_report |
| upload_site_photos | Tải hình ảnh hiện trạng | require_document | doc_type = site_photos |
| upload_solution_doc | Tải tài liệu giải pháp | require_document | doc_type = solution_doc |
| upload_business_plan | Tải phương án kinh doanh | require_document | doc_type = business_plan |
| upload_customer_quotation | Tải báo giá khách hàng | require_document | doc_type = quotation |
| upload_contract | Tải hợp đồng | require_document | doc_type = contract |
| confirm_quote_approved | Xác nhận báo giá đã duyệt | require_status_equals | target_field = quote_status |
| confirm_final_acceptance | Xác nhận nghiệm thu cuối | require_document | doc_type = final_acceptance |
| upload_payment_receipt | Tải chứng từ thanh toán | require_document | doc_type = payment_receipt |
| link_origin_journey | Liên kết hành trình gốc | require_journey_field | target_field = origin_journey_id |
- action_key là enum đóng, snake_case, lowercase.
- Không cho user nhập tự do action_key nếu chưa nằm trong catalog chuẩn.

## 🎨 PHẦN 3: FORM PREVIEW (ASCII Wireframe)
```
┌─────────────────────────────────────────────────────────────┐
│ CustomerJourneySetting - Cấu hình hành trình khách hàng     │
├─────────────────────────────────────────────────────────────┤
│ [Khóa cấu hình] [default________]              (1/3)        │
│ [Tên cấu hình]  [___________________________]  (2/3)        │
│ [Đang áp dụng]  [Toggle]                       (1/3)        │
│ [Phiên bản]     [v2.0___________]              (1/3)        │
│ [Ghi chú]       [____________________________________] full │
│                                                             │
│ ┌─ Step config (override 12 bước chuẩn) ──────────────────┐ │
│ │ [Mã bước ▼]      [Label ______________________]         │ │
│ │ [SLA giờ ___]    [Cho phép bỏ qua □] [Portal □]         │ │
│ │ [Vai trò step]   [Bảng roles static: QL/GS/KYT/KT/HC..] │ │
│ │                                                         │ │
│ │  Checklist item                                         │ │
│ │  [Tên item ____________] [Bắt buộc □] [Vai trò ▼]       │ │
│ │  [Mô tả _____________________________________________]   │ │
│ │                                                         │ │
│ │  Actions                                                │ │
│ │  [Action key ▼] [Action type ▼] [Target field ▼]        │ │
│ │  [Doc type ▼]   [Expected value ______] [Min count __]  │ │
│ │  [Ghi chú ___________________________________________]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                                    [Hủy]  [Lưu]            │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Kết luận sơ bộ
- Không tạo _v2, không đổi tên field hiện hữu.
- Override trực tiếp enum step trên các schema đang dùng journey_step_code và current_step.
- Đồng bộ roles thành static enum và bổ sung HC.
- Bỏ JourneyDocument.context_type, thay bằng doc_type chuẩn hóa.
- Chuẩn hóa action_type, target_field, doc_type, action_key để backend verify được.
- Bổ sung Journey.origin_journey_id và Journey.journey_kind.
- Bổ sung WorkTask.assignee, assignee_role, action_key, documentId.

## 📌 Quyết định đã chốt
- action_type chính thức gồm 3 giá trị: require_journey_field, require_document, require_status_equals.
- target_field bị khóa theo whitelist static enum như mục 5.
- doc_type hiện tại được chốt tạm thời theo danh mục ở mục 6.
- WorkTask dùng documentId (ObjectId, ref JourneyDocument) thay cho correlationId.

## 🚀 Kế hoạch triển khai
### Pha 0. Mở precondition cho MCP schema write
1. Bật allowAI = true trên SchemaDefinition của các schema lõi: CustomerJourneySetting, Journey, JourneyDocument, WorkTask.
2. Đây là blocker hiện tại: MCP `schema-batch_create_or_update_property` đã trả về lỗi yêu cầu allowAI=true.
3. Nếu chưa có tool công khai để bật allowAI, cần thao tác một lần ở tầng quản trị hệ thống trước khi chạy pha 1.

### Pha 1. Update schema lõi bằng MCP tool
1. Cập nhật CustomerJourneySetting: override 12 step chuẩn; đổi step.roles.role từ Lookup sang Text Dropdown; bổ sung role HC; mở rộng checklist với role và actions.
2. Cập nhật Journey: override current_step; thêm journey_kind và origin_journey_id.
3. Cập nhật JourneyDocument: override journey_step_code; thêm doc_type, title; loại bỏ context_type.
4. Cập nhật WorkTask: override journey_step_code; thêm assignee, assignee_role, action_key, documentId.

### Pha 2. Đồng bộ schema vệ tinh có journey_step_code
- Các schema/types đã thấy bị ảnh hưởng gồm ít nhất: AssetAllocation, DebtCollectionTask, DebtConfirmation, HandoverAcceptance, HandoverIssue, IncidentReport, MaterialReceiptConfirmation, PaymentAdjustment, PaymentMilestone, PaymentReceipt, PipelineStage, PortalDocument, PortalMessage, PortalThread, ProjectAssignment, ProjectCloseoutPackage, ProjectSettlement, SalesInvoice, SiteReport, StockOrder, StockRequest, SurveyAppointment, SurveyRecord, WarrantyCard, WarrantyCase, WarrantyReminder, WarrantyVisit, WorkTask.
- Mục tiêu pha này: chỉ override lại value_options của journey_step_code để toàn hệ thống dùng chung 12 step chuẩn.

### Pha 3. Verify sau schema update
1. Fetch lại 4 schema lõi để đối chiếu đúng với tài liệu này.
2. Kiểm tra các field mới có đúng propType, editor, refSchemas, value_options.
3. Rà lại các schema vệ tinh đã override journey_step_code.

### Pha 4. Frontend/codegen sau cùng
- Chỉ sau khi schema ổn định mới regenerate types/contracts và xử lý code frontend bị ảnh hưởng bởi enum cũ, context_type cũ, và static role mới HC.

## ✅ Trạng thái sẵn sàng
- Tài liệu đã chốt hướng chuẩn.
- Bước tiếp theo ưu tiên là toolcall MCP update schema, chưa sửa frontend ở vòng này.
