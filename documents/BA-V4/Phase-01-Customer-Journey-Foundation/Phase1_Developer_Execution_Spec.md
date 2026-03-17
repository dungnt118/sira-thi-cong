# Phase 1 - Developer Execution Spec

## 1. Mục tiêu tài liệu

Tài liệu này là `spec triển khai cho Developer` của Phase 1.

Mục tiêu:

- mô tả đúng `trình tự build`
- liệt kê đầy đủ `menu`, `page`, `dialog/drawer`, `field`
- giảm rủi ro dev bị miss những phần nhỏ nhưng ảnh hưởng flow

Tài liệu này phải được dùng song song với:

- `README.md` của Phase 1
- `Phase1_Epic_Map.md`
- các backlog chi tiết theo vai trò

## 2. Kết quả phase 1 mà developer phải tạo ra

### 2.1 Kết quả lớn nhất

Developer phải dựng được `CustomerJourney` cho PM như một workspace trung tâm thay thế Kanban đơn giản.

Từ `1 journey`, PM phải nhìn được tối thiểu:

- yêu cầu
- khảo sát
- dự toán
- nhân công
- dự án
- vật tư
- thanh toán
- log
- phát sinh
- portal publish
- portal chat

### 2.2 Vai trò phải có màn dùng được trong phase 1

- `PM`
- `Sale`
- `Giám sát`
- `Customer Portal`

## 3. Trình tự build bắt buộc

## 3.1 Workstream 01 - Route, menu, permission, shared shell

### Mục tiêu

Khóa điều hướng và quyền nhìn thấy menu trước khi build page.

### Việc phải làm

- tạo menu mới cho PM theo phase 1
- tạo menu mới cho Sale theo phase 1
- tạo menu mới cho Giám sát theo phase 1
- tạo route cho Customer Portal phase 1
- tạo permission matrix tối thiểu theo `role -> page -> action`

### Deliverable

- menu tree
- route tree
- permission map
- breadcrumbs label mới cho route phase 1

## 3.2 Workstream 02 - Journey Core Domain, mock data, shared components

### Mục tiêu

Tạo aggregate và UI primitive chung để các page cùng dùng chung một model.

### Việc phải làm

- định nghĩa `journey`
- định nghĩa `journey step`
- định nghĩa `journey template`
- định nghĩa `journey activity`
- định nghĩa `publish block`
- định nghĩa `portal thread summary`
- tạo mock data phase 1
- tạo component chung

### Component chung bắt buộc

- `JourneyStepCard`
- `JourneyStatusBadge`
- `JourneyContextSummaryCard`
- `JourneyTimeline`
- `JourneyBlockerList`
- `JourneyTabSection`
- `PortalThreadBadge`
- `ResponsiveFilterBar`

## 3.3 Workstream 03 - PM CustomerJourney list/board

### Mục tiêu

PM phải thấy journey ở 2 góc:

- list
- board

### Việc phải làm

- page `Journey List`
- page `Journey Board`
- filter/search/sort
- quick actions tối thiểu
- mobile card view

## 3.4 Workstream 04 - PM CustomerJourney detail 360

### Mục tiêu

Tạo page quan trọng nhất của phase 1.

### Việc phải làm

- `Journey Header`
- `Journey Timeline`
- `360 tabs`
- `blocker summary`
- mobile accordion/drawer

## 3.5 Workstream 05 - PM Step Config, Template Library, Publish

### Mục tiêu

Journey phải configurable và có template mặc định/reset.

### Việc phải làm

- template list
- template detail
- step config editor
- clone template
- reset journey từ template
- publish block ra portal

## 3.6 Workstream 06 - Sale pages trong context journey

### Mục tiêu

Sale làm việc theo journey thay vì rời khỏi PM context.

### Việc phải làm

- `Journey Inbox`
- `SLA Queue`
- `Survey Coordination`
- `Sale Journey Context`
- `Communication Center`

## 3.7 Workstream 07 - Giám sát survey feed

### Mục tiêu

Giám sát đẩy dữ liệu khảo sát và rủi ro hiện trường vào journey.

### Việc phải làm

- `Survey Queue`
- `Survey Form`
- `Risk Flag`
- `Journey Feed Summary`

## 3.8 Workstream 08 - Portal timeline và chat

### Mục tiêu

Khách hàng xem được phần BAC đã publish và chat theo context.

### Việc phải làm

- portal landing
- overview
- published timeline
- thread inbox
- thread detail

## 3.9 Workstream 09 - Polish, responsive, QA handoff

### Mục tiêu

Phase 1 phải dùng được trên desktop + mobile trước khi chốt.

### Việc phải làm

- responsive pass
- loading/empty/error state
- seed demo data
- walkthrough flow demo

## 4. Menu tree bắt buộc

## 4.1 PM menu

| Menu cấp 1 | Menu cấp 2 | Route đề xuất | Ghi chú |
|---|---|---|---|
| Hành trình khách hàng | Danh sách hành trình | `/pm/journeys` | menu chính của phase 1 |
| Hành trình khách hàng | Board hành trình | `/pm/journeys/board` | thay cho Kanban cũ |
| Hành trình khách hàng | Action Center | `/pm/journeys/action-center` | gom blocker, overdue, unread thread |
| Hành trình khách hàng | Templates | `/pm/journeys/templates` | quản lý template mặc định |

## 4.2 Sale menu

| Menu cấp 1 | Menu cấp 2 | Route đề xuất | Ghi chú |
|---|---|---|---|
| Hành trình khách hàng | Journey Inbox | `/sale/dashboard` | view theo role Sale |
| Hành trình khách hàng | SLA Queue | `/sale/sla` | ưu tiên cuộc gọi |
| Hành trình khách hàng | Khảo sát | `/sale/surveys` | điều phối khảo sát |
| Hành trình khách hàng | Giao tiếp khách hàng | `/sale/communications` | thread và follow-up |

## 4.3 Giám sát menu

| Menu cấp 1 | Menu cấp 2 | Route đề xuất | Ghi chú |
|---|---|---|---|
| Khảo sát & hiện trường | Lịch khảo sát | `/giam-sat/surveys` | queue khảo sát |
| Khảo sát & hiện trường | Form khảo sát | `/giam-sat/surveys/:journeyId` | page nhập khảo sát |
| Khảo sát & hiện trường | Feed hành trình | `/giam-sat/journey-feed` | xem dữ liệu đã đẩy |

## 4.4 Portal menu

| Menu | Route đề xuất | Ghi chú |
|---|---|---|
| Tổng quan | `/portal/:token` | vào thẳng overview |
| Timeline | `/portal/:token/timeline` | step đã publish |
| Tài liệu & minh chứng | `/portal/:token/documents` | gallery + docs |
| Chat | `/portal/:token/threads` | danh sách thread |

## 5. Route map bắt buộc

## 5.1 PM route map

| Route | Page code | Mục đích |
|---|---|---|
| `/pm/journeys` | PM-P1-01 | Journey List |
| `/pm/journeys/board` | PM-P1-02 | Journey Board |
| `/pm/journeys/:journeyId` | PM-P1-03 | Journey Detail 360 |
| `/pm/journeys/action-center` | PM-P1-04 | PM Action Center |
| `/pm/journeys/templates` | PM-P1-05 | Template List |
| `/pm/journeys/templates/:templateId` | PM-P1-06 | Template Detail & Step Config |

## 5.2 Sale route map

| Route | Page code | Mục đích |
|---|---|---|
| `/sale/dashboard` | SAL-P1-01 | Journey Inbox |
| `/sale/sla` | SAL-P1-02 | SLA Queue |
| `/sale/surveys` | SAL-P1-03 | Survey Coordination |
| `/sale/dashboard/:journeyId` | SAL-P1-04 | Sale Journey Context |
| `/sale/communications` | SAL-P1-05 | Communications Center |

## 5.3 Giám sát route map

| Route | Page code | Mục đích |
|---|---|---|
| `/giam-sat/surveys` | GS-P1-01 | Survey Queue |
| `/giam-sat/surveys/:journeyId` | GS-P1-02 | Survey Form |
| `/giam-sat/journey-feed` | GS-P1-03 | Journey Feed Summary |

## 5.4 Portal route map

| Route | Page code | Mục đích |
|---|---|---|
| `/portal/:token` | PRT-P1-01 | Portal Landing/Overview |
| `/portal/:token/timeline` | PRT-P1-02 | Published Timeline |
| `/portal/:token/documents` | PRT-P1-03 | Documents & Evidence |
| `/portal/:token/threads` | PRT-P1-04 | Thread Inbox |
| `/portal/:token/threads/:threadId` | PRT-P1-05 | Thread Detail |

## 6. Shared field groups bắt buộc

## 6.1 FG-01 - Journey Header

| Field key | Label | Type | Required | Editable | Ghi chú |
|---|---|---|---|---|---|
| journey_code | Mã hành trình | text | Có | Không | generated |
| service_request_code | Mã yêu cầu | text | Có | Không | link sang request |
| customer_name | Khách hàng | text | Có | Không | từ customer |
| customer_phone | Số điện thoại | text | Có | Không | từ customer/request |
| source_channel | Nguồn khách | select/text | Có | Không | MKT/hotline/referral/direct |
| requested_service | Dịch vụ yêu cầu | text | Có | Không | summary |
| owner_user | Người phụ trách | user select | Có | Có | PM/Sale chính |
| priority | Mức ưu tiên | select | Có | Có | low/medium/high/critical |
| current_step | Step hiện tại | text | Có | Không | từ timeline |
| go_no_go_status | Trạng thái chốt làm | status badge | Không | Không | draft/go/no-go... |
| sla_status | Trạng thái SLA | status badge | Không | Không | ontime/at-risk/overdue |
| portal_publish_status | Trạng thái publish | status badge | Không | Không | hidden/partial/published |
| last_activity_at | Cập nhật gần nhất | datetime | Không | Không | activity log |

## 6.2 FG-02 - Journey List filters

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| keyword | Từ khóa | text | Không | tìm theo mã/tên/sđt |
| source_channel | Nguồn khách | multi-select | Không | |
| owner_user_ids | Người phụ trách | multi-select | Không | |
| service_type | Loại dịch vụ | multi-select | Không | |
| current_step_codes | Step hiện tại | multi-select | Không | |
| go_no_go_statuses | Trạng thái chốt làm | multi-select | Không | |
| sla_statuses | SLA | multi-select | Không | |
| priority_levels | Ưu tiên | multi-select | Không | |
| updated_from | Từ ngày cập nhật | date | Không | |
| updated_to | Đến ngày cập nhật | date | Không | |

## 6.3 FG-03 - Journey row/card summary

| Field key | Label | Type | Ghi chú |
|---|---|---|---|
| customer_name | Khách hàng | text | |
| service_request_title | Tên yêu cầu | text | |
| current_step | Step hiện tại | badge | |
| owner_user | Người phụ trách | user | |
| survey_status | Khảo sát | badge | not_started/scheduled/completed |
| estimate_status | Dự toán | badge | not_started/draft/ready |
| quote_status | Báo giá | badge | not_started/draft/sent |
| project_status | Dự án | badge | chưa convert / active |
| next_milestone | Mốc thanh toán tới | text | |
| blocker_count | Blocker mở | number | |
| unread_portal_threads | Thread chưa đọc | number | |
| updated_at | Cập nhật gần nhất | datetime | |

## 6.4 FG-04 - Journey Step definition

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| step_code | Mã step | text | Có | unique |
| step_name | Tên step | text | Có | |
| step_order | Thứ tự | number | Có | |
| step_goal | Mục tiêu step | textarea | Có | |
| participant_roles | Vai trò tham gia | multi-select | Có | PM/Sale/Giám sát/... |
| owner_role | Vai trò owner chính | select | Có | |
| checklist_refs | Checklist liên quan | multi-select | Không | |
| process_refs | Quy trình nội bộ | multi-select | Không | |
| entry_criteria | Điều kiện vào | textarea | Không | |
| exit_criteria | Điều kiện hoàn tất | textarea | Không | |
| sla_hours | SLA | number | Không | giờ |
| escalation_rule | Rule nhắc việc | select/text | Không | |
| publish_flag | Cho phép publish | switch | Có | portal only |

## 6.5 FG-05 - Template header

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| template_code | Mã template | text | Có | unique |
| template_name | Tên template | text | Có | |
| service_type | Loại dịch vụ | select | Có | |
| description | Mô tả | textarea | Không | |
| is_default | Mặc định | switch | Có | |
| version_label | Phiên bản | text | Có | |
| status | Trạng thái | select | Có | draft/active/inactive |

## 6.6 FG-06 - Consultation log

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| interaction_at | Thời điểm liên hệ | datetime | Có | |
| channel | Kênh | select | Có | call/zalo/email/meeting |
| outcome | Kết quả | select | Có | connected/no-answer/qualified/... |
| summary | Tóm tắt | textarea | Có | |
| next_action | Hành động tiếp theo | textarea | Không | |
| next_follow_up_at | Lịch follow-up | datetime | Không | |
| attachments | Đính kèm | upload | Không | nếu có |

## 6.7 FG-07 - Survey schedule

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| scheduled_date | Ngày khảo sát | date | Có | |
| scheduled_time | Giờ khảo sát | time | Có | |
| giam_sat_user | Giám sát phụ trách | user select | Có | |
| meeting_address | Địa điểm | text | Có | |
| contact_name | Người liên hệ | text | Có | |
| contact_phone | Số liên hệ | text | Có | |
| note | Ghi chú | textarea | Không | |
| remind_before_minutes | Nhắc trước | number | Không | |

## 6.8 FG-08 - Survey form

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| survey_date | Ngày khảo sát | datetime | Có | |
| surveyor_name | Người khảo sát | text | Có | readonly from user |
| customer_name | Khách hàng | text | Có | readonly |
| site_address | Địa chỉ | text | Có | readonly |
| area_list | Danh sách khu vực | repeater | Có | mỗi khu vực là 1 block |
| current_condition | Hiện trạng | textarea | Có | trong từng khu vực |
| measurement_notes | Số đo/ghi chú kỹ thuật | textarea | Không | |
| moisture_value | Chỉ số độ ẩm | number | Không | |
| media_files | Ảnh/video khảo sát | upload | Có | theo khu vực |
| proposed_solution | Giải pháp sơ bộ | textarea | Không | |
| labor_need_note | Nhu cầu nhân công sơ bộ | textarea | Không | |
| material_need_note | Nhu cầu vật tư sơ bộ | textarea | Không | |
| customer_signature | Chữ ký khách | signature pad | Không | |
| giam_sat_signature | Chữ ký Giám sát | signature pad | Có | |

## 6.9 FG-09 - Risk flags

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| material_risk | Rủi ro vật tư | multi-select | Không | thiếu/khó kiếm/lead time dài |
| labor_risk | Rủi ro nhân công | multi-select | Không | thiếu đội/tăng giá/... |
| time_risk | Rủi ro thời gian | multi-select | Không | deadline ngắn/lịch xung đột |
| access_risk | Rủi ro tiếp cận | multi-select | Không | giáo/đu dây/khung giờ |
| risk_note | Mô tả rủi ro | textarea | Không | |

## 6.10 FG-10 - Portal thread

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| thread_id | Mã thread | text | Có | readonly |
| context_type | Loại ngữ cảnh | select | Có | survey/progress/payment/... |
| context_label | Nhãn ngữ cảnh | text | Có | |
| status | Trạng thái | badge | Có | open/waiting/closed |
| last_message_at | Tin cuối | datetime | Không | |
| unread_count | Chưa đọc | number | Không | |

## 6.11 FG-11 - Portal message

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| message_body | Nội dung | textarea | Có | |
| attachments | Đính kèm | upload/select | Không | chỉ file đã publish |
| official_response | Phản hồi chính thức | switch | Không | internal role only |

## 6.12 FG-12 - Publish settings

| Field key | Label | Type | Required | Ghi chú |
|---|---|---|---|---|
| publish_scope | Phạm vi publish | multi-select | Có | overview/timeline/docs/chat |
| publish_note | Ghi chú publish | textarea | Không | |
| portal_visible_from | Hiệu lực từ | datetime | Không | |
| portal_visible_to | Hiệu lực đến | datetime | Không | |

## 7. Page inventory chi tiết cho developer

## 7.1 PM-P1-01 - Journey List

### Menu và route

- Menu: `PM > Hành trình khách hàng > Danh sách hành trình`
- Route: `/pm/journeys`

### Section bắt buộc

1. `Page Header`
2. `KPI Row`
3. `Filter Bar`
4. `Desktop Table`
5. `Mobile Card List`
6. `Pagination`

### KPI Row

Phải có tối thiểu 4 card:

- tổng journey đang mở
- journey quá SLA
- journey blocked
- journey cần phản hồi portal

### Field groups sử dụng

- FG-02
- FG-03

### Action bắt buộc

- mở `Journey Board`
- mở `Journey Detail`
- clear filter
- refresh list

### Dialog/Drawer bắt buộc

- `DLG-01 Filter Drawer (mobile)`

## 7.2 PM-P1-02 - Journey Board

### Menu và route

- Menu: `PM > Hành trình khách hàng > Board hành trình`
- Route: `/pm/journeys/board`

### Section bắt buộc

1. `Board Header`
2. `Board Filters`
3. `Step Columns`
4. `Journey Cards`
5. `Board Summary Footer`

### Card trên board phải hiển thị

- customer name
- service request title
- owner
- survey status
- estimate status
- quote status
- blocker count
- unread thread count
- updated at

### Action bắt buộc

- mở detail
- lọc board
- chuyển sang list view

### Dialog/Drawer bắt buộc

- `DLG-01 Filter Drawer (mobile)`
- `DLG-02 Change Step Confirm`

## 7.3 PM-P1-03 - Journey Detail 360

### Menu và route

- Menu: mở từ list/board
- Route: `/pm/journeys/:journeyId`

### Section bắt buộc

1. `Journey Header`
2. `Timeline & Blocker Strip`
3. `Primary Actions`
4. `360 Tabs`
5. `Activity Side Panel` trên desktop hoặc `Activity Drawer` trên mobile

### Primary Actions bắt buộc

- assign owner
- change priority
- open action center
- publish to portal
- open template info

### Tab bắt buộc và field inventory

#### Tab 1 - Yêu cầu

| Field key |
|---|
| service_request_code |
| request_title |
| requested_service |
| source_channel |
| customer_name |
| customer_phone |
| customer_email |
| site_address |
| request_description |
| urgency |
| created_by |
| created_at |

#### Tab 2 - Khảo sát

| Field key |
|---|
| survey_status |
| latest_survey_at |
| surveyor_name |
| area_count |
| survey_media_count |
| moisture_summary |
| current_condition_summary |
| proposed_solution_summary |
| labor_need_note |
| material_need_note |
| field_risk_summary |

#### Tab 3 - Dự toán

| Field key |
|---|
| estimate_status |
| estimate_version_no |
| estimated_cost_total |
| estimated_margin_pct |
| labor_estimate_total |
| material_estimate_total |
| transport_estimate_total |
| scaffold_estimate_total |
| go_no_go_status |
| go_no_go_summary |

#### Tab 4 - Báo giá/Hợp đồng

| Field key |
|---|
| quotation_status |
| quotation_version_no |
| quotation_total |
| quotation_sent_at |
| contract_status |
| contract_no |
| signature_status |
| deposit_status |

#### Tab 5 - Nhân công/Nguồn lực

| Field key |
|---|
| supervisor_name |
| workforce_plan_status |
| internal_team_count |
| outsource_required |
| labor_risk_summary |
| tentative_start_date |
| tentative_duration_days |

#### Tab 6 - Dự án

| Field key |
|---|
| project_status |
| project_code |
| plan_start |
| plan_end |
| progress_pct |
| blocked_task_count |
| latest_incident_summary |

#### Tab 7 - Vật tư/Tài sản

| Field key |
|---|
| material_need_status |
| key_material_summary |
| procurement_alert_count |
| asset_need_summary |
| stock_risk_summary |

#### Tab 8 - Thanh toán

| Field key |
|---|
| milestone_count |
| next_milestone_name |
| next_milestone_due |
| total_contract_value |
| collected_amount |
| outstanding_amount |
| last_payment_note |

#### Tab 9 - Log hoạt động

| Field key |
|---|
| activity_actor |
| activity_action |
| activity_context |
| activity_time |
| activity_summary |

#### Tab 10 - Phát sinh/Sự cố

| Field key |
|---|
| incident_count |
| open_incident_count |
| latest_incident_type |
| latest_incident_status |
| change_request_count |

#### Tab 11 - Tài liệu/Hồ sơ số

| Field key |
|---|
| document_count |
| missing_document_count |
| latest_document_type |
| latest_document_status |

#### Tab 12 - Portal/Chat

| Field key |
|---|
| portal_publish_status |
| published_step_count |
| thread_count |
| unread_thread_count |
| latest_thread_context |
| latest_thread_status |

### Dialog/Drawer bắt buộc

- `DLG-02 Assign Owner`
- `DLG-03 Change Priority`
- `DLG-04 Publish to Portal`
- `DLG-05 Activity Drawer (mobile)`
- `DLG-06 Blocker Detail`

## 7.4 PM-P1-04 - Action Center

### Route

- `/pm/journeys/action-center`

### Section bắt buộc

1. `Filter`
2. `Action Buckets`
3. `Action Table/List`

### Bucket bắt buộc

- step overdue
- survey waiting review
- portal unread thread
- publish pending
- blocked journey

### Field inventory

- action_type
- journey_code
- customer_name
- current_step
- priority
- due_at
- owner_user
- source_tab

## 7.5 PM-P1-05 - Template List

### Route

- `/pm/journeys/templates`

### Section bắt buộc

1. `Page Header`
2. `Template Filters`
3. `Template Table`

### Field groups sử dụng

- FG-05

### Action bắt buộc

- create template
- clone template
- open template detail
- set default

### Dialog bắt buộc

- `DLG-07 Create Template`
- `DLG-08 Clone Template`

## 7.6 PM-P1-06 - Template Detail & Step Config

### Route

- `/pm/journeys/templates/:templateId`

### Section bắt buộc

1. `Template Header`
2. `Step List`
3. `Selected Step Config Panel`
4. `Version/Audit Summary`

### Field groups sử dụng

- FG-04
- FG-05

### Action bắt buộc

- add step
- reorder step
- edit step
- save template
- reset to default

### Dialog/Drawer bắt buộc

- `DLG-09 Step Config Editor`
- `DLG-10 Reset to Default Confirm`

## 7.7 SAL-P1-01 - Journey Inbox

### Route

- `/sale/dashboard`

### Section bắt buộc

1. `Inbox Header`
2. `Quick Filters`
3. `Journey Card List`

### Field inventory

- keyword
- current_step
- sla_status
- customer_name
- next_action
- assigned_sale
- unread_thread_count

### Dialog bắt buộc

- `DLG-01 Filter Drawer (mobile)`

## 7.8 SAL-P1-02 - SLA Queue

### Route

- `/sale/sla`

### Section bắt buộc

1. `SLA Counters`
2. `SLA Queue Table`

### Field inventory

- customer_name
- customer_phone
- request_title
- source_channel
- first_response_deadline
- last_contact_at
- next_follow_up_at
- outcome

### Dialog bắt buộc

- `DLG-11 Consultation Log`

## 7.9 SAL-P1-03 - Survey Coordination

### Route

- `/sale/surveys`

### Section bắt buộc

1. `Survey Calendar/List Toggle`
2. `Scheduled Surveys`
3. `Unscheduled Requests`

### Field groups sử dụng

- FG-07

### Dialog bắt buộc

- `DLG-12 Schedule Survey`
- `DLG-13 Reschedule Survey`

## 7.10 SAL-P1-04 - Sale Journey Context

### Route

- `/sale/dashboard/:journeyId`

### Section bắt buộc

1. `Journey Header (role-filtered)`
2. `Commercial Summary`
3. `Survey Readiness`
4. `Communication Log`
5. `Customer Follow-up`

### Field inventory

- customer_name
- current_step
- survey_status
- estimate_status
- go_no_go_status
- quote_status
- contract_status
- deposit_status
- next_follow_up_at

### Dialog bắt buộc

- `DLG-11 Consultation Log`
- `DLG-14 Customer Follow-up Note`

## 7.11 SAL-P1-05 - Communications Center

### Route

- `/sale/communications`

### Section bắt buộc

1. `Thread Filters`
2. `Thread List`
3. `Thread Quick Reply`

### Field groups sử dụng

- FG-10
- FG-11

### Dialog bắt buộc

- `DLG-15 Create Thread`
- `DLG-16 Reply Thread`

## 7.12 GS-P1-01 - Survey Queue

### Route

- `/giam-sat/surveys`

### Section bắt buộc

1. `Today / Upcoming Toggle`
2. `Assigned Survey Cards`

### Field inventory

- scheduled_date
- scheduled_time
- customer_name
- site_address
- requested_service
- contact_name
- contact_phone
- journey_code

### Action bắt buộc

- open survey form
- call contact
- map address

## 7.13 GS-P1-02 - Survey Form

### Route

- `/giam-sat/surveys/:journeyId`

### Section bắt buộc

1. `Survey Header`
2. `Customer Snapshot`
3. `Area Repeater`
4. `Media Upload`
5. `Risk Flags`
6. `Signature Section`
7. `Submit Summary`

### Field groups sử dụng

- FG-08
- FG-09

### Dialog/Drawer bắt buộc

- `DLG-17 Add Survey Area`
- `DLG-18 Add Risk Flag`
- `DLG-19 Signature Pad`
- `DLG-20 Media Preview`

## 7.14 GS-P1-03 - Journey Feed Summary

### Route

- `/giam-sat/journey-feed`

### Section bắt buộc

1. `Submitted Feeds`
2. `Pending Review`
3. `Need Update`

### Field inventory

- journey_code
- survey_status
- media_count
- risk_flag_count
- submitted_at
- review_status

## 7.15 PRT-P1-01 - Portal Landing / Overview

### Route

- `/portal/:token`

### Section bắt buộc

1. `Project Overview Header`
2. `Published Summary Cards`
3. `Primary CTA`

### Field inventory

- project_name
- customer_label
- current_published_step
- next_expected_update
- published_document_count
- open_thread_count

## 7.16 PRT-P1-02 - Published Timeline

### Route

- `/portal/:token/timeline`

### Section bắt buộc

1. `Timeline`
2. `Selected Step Detail`
3. `Ask About This Step CTA`

### Field inventory

- step_name
- published_at
- status_label
- summary_text
- media_count
- document_count

### Dialog bắt buộc

- `DLG-15 Create Thread`

## 7.17 PRT-P1-03 - Documents & Evidence

### Route

- `/portal/:token/documents`

### Section bắt buộc

1. `Gallery`
2. `Document List`
3. `Preview Pane`

### Field inventory

- file_name
- file_type
- published_context
- published_at

### Dialog bắt buộc

- `DLG-20 Media Preview`
- `DLG-21 Document Preview`

## 7.18 PRT-P1-04 - Thread Inbox

### Route

- `/portal/:token/threads`

### Section bắt buộc

1. `Thread List`
2. `Context Filter`
3. `Start New Thread CTA`

### Field groups sử dụng

- FG-10

## 7.19 PRT-P1-05 - Thread Detail

### Route

- `/portal/:token/threads/:threadId`

### Section bắt buộc

1. `Thread Header`
2. `Message Timeline`
3. `Reply Composer`

### Field groups sử dụng

- FG-10
- FG-11

### Dialog bắt buộc

- `DLG-16 Reply Thread`
- `DLG-20 Media Preview`

## 8. Dialog/Drawer inventory chi tiết

## 8.1 DLG-01 - Filter Drawer

### Áp dụng

- PM-P1-01
- PM-P1-02
- SAL-P1-01

### Fields

- dùng FG-02

## 8.2 DLG-02 - Assign Owner

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| owner_user_id | Người phụ trách mới | user select | Có |
| reason | Lý do thay đổi | textarea | Không |

## 8.3 DLG-03 - Change Priority

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| priority | Mức ưu tiên | select | Có |
| note | Ghi chú | textarea | Không |

## 8.4 DLG-04 - Publish to Portal

### Fields

- dùng FG-12

## 8.5 DLG-05 - Activity Drawer

### Fields

- activity list readonly

## 8.6 DLG-06 - Blocker Detail

### Fields

| Field key | Label | Type |
|---|---|---|
| blocker_type | Loại blocker | text |
| blocker_summary | Tóm tắt | textarea readonly |
| blocker_owner | Owner | user readonly |
| blocker_due | Due | datetime readonly |

## 8.7 DLG-07 - Create Template

### Fields

- dùng FG-05

## 8.8 DLG-08 - Clone Template

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| source_template | Template nguồn | readonly text | Có |
| new_template_code | Mã template mới | text | Có |
| new_template_name | Tên template mới | text | Có |

## 8.9 DLG-09 - Step Config Editor

### Fields

- dùng FG-04

## 8.10 DLG-10 - Reset to Default Confirm

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| confirm_text | Xác nhận reset | text | Có |

## 8.11 DLG-11 - Consultation Log

### Fields

- dùng FG-06

## 8.12 DLG-12 - Schedule Survey

### Fields

- dùng FG-07

## 8.13 DLG-13 - Reschedule Survey

### Fields

- dùng FG-07
- thêm `reschedule_reason`

## 8.14 DLG-14 - Customer Follow-up Note

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| follow_up_at | Thời điểm follow-up | datetime | Có |
| customer_response | Khách phản hồi | textarea | Có |
| next_commitment | Cam kết tiếp theo | textarea | Không |

## 8.15 DLG-15 - Create Thread

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| context_type | Loại ngữ cảnh | select | Có |
| context_label | Nhãn ngữ cảnh | text | Có |
| message_body | Nội dung mở thread | textarea | Có |
| attachments | Đính kèm | upload/select | Không |

## 8.16 DLG-16 - Reply Thread

### Fields

- dùng FG-11

## 8.17 DLG-17 - Add Survey Area

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| area_name | Tên khu vực | text | Có |
| area_type | Loại khu vực | select | Không |
| current_condition | Hiện trạng | textarea | Có |
| measurement_notes | Số đo/ghi chú | textarea | Không |

## 8.18 DLG-18 - Add Risk Flag

### Fields

- dùng FG-09

## 8.19 DLG-19 - Signature Pad

### Fields

| Field key | Label | Type | Required |
|---|---|---|---|
| signer_name | Người ký | text | Có |
| signer_role | Vai trò | select | Có |
| signature_canvas | Chữ ký | signature pad | Có |

## 8.20 DLG-20 - Media Preview

### Fields

- media_file_name
- media_context
- uploaded_at

## 8.21 DLG-21 - Document Preview

### Fields

- document_name
- document_type
- published_at

## 9. Trạng thái và validation bắt buộc

## 9.1 Trạng thái UI

Mọi page phải có đủ:

- loading
- empty
- error
- no permission
- mobile layout

## 9.2 Validation tối thiểu

- không mở `Journey Detail` nếu không có `journey_id`
- không lưu step config nếu thiếu `step_code`, `step_name`, `participant_roles`
- không lưu consultation log nếu thiếu `interaction_at`, `channel`, `outcome`
- không submit survey nếu không có ít nhất 1 `area` và 1 `media file`
- không publish portal nếu chưa chọn `publish_scope`
- không tạo thread nếu thiếu `context_type` và `message_body`

## 10. Reuse từ code hiện tại

## 10.1 PM prototype có thể reuse một phần

- `src/pages/pm/CRM/ServiceRequestList.tsx`
- `src/pages/pm/CRM/ServiceRequestDetail.tsx`
- `src/pages/pm/CRM/Pipeline.tsx`
- `src/pages/pm/CRM/SurveyUpload.tsx`
- `src/pages/pm/CRM/Quotation.tsx`

## 10.2 Giám sát prototype có thể reuse một phần

- `src/pages/kỹ thuật/Kỹ thuậtHome.tsx`
- `src/pages/kỹ thuật/Checklist.tsx`
- `src/pages/kỹ thuật/EvidenceUpload.tsx`
- `src/pages/kỹ thuật/IncidentReport.tsx`

## 10.3 Những gì không nên reuse nguyên trạng

- Kanban cũ làm `CustomerJourney Board`
- `ServiceRequestDetail` cũ làm `Journey Detail 360` mà không refactor
- `CustomerPortal` cũ nếu chỉ là page read-only đơn giản

## 11. Checklist giao việc cho developer

### Checklist kỹ thuật

- [ ] Tạo route mới theo phase 1
- [ ] Cập nhật menu và breadcrumbs
- [ ] Tạo shared types cho `journey`
- [ ] Tạo mock/seed data phase 1
- [ ] Tạo shared components
- [ ] Build đủ page PM
- [ ] Build đủ page Sale
- [ ] Build đủ page Giám sát
- [ ] Build đủ page Portal
- [ ] Build đủ dialog/drawer
- [ ] Pass responsive desktop/mobile

### Checklist nghiệp vụ

- [ ] PM nhìn được journey 360
- [ ] Sale làm việc trong context journey
- [ ] Giám sát đẩy khảo sát/rủi ro vào journey
- [ ] Portal xem được timeline đã publish
- [ ] Portal chat có context và bằng chứng

## 12. Definition of Done của developer cho Phase 1

Phase 1 chỉ được xem là hoàn thành từ góc nhìn dev khi:

- tất cả menu đã có
- tất cả page trong section 7 đã có
- tất cả dialog/drawer trong section 8 đã có
- tất cả field group trong section 6 đã được phản ánh lên UI đúng chỗ
- không còn route phase 1 nào hiển thị `ComingSoon`
- walkthrough demo end-to-end cho 4 vai trò chạy được bằng mock data
