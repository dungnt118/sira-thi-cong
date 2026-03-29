# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SCHEMA ANALYSIS: GROUP 06 - FINANCE, WARRANTY, PORTAL

## PHAN 1: SO SANH GAP (Codebase vs Current Schema)

| Thuoc tinh / Flow | Yeu cau codebase hien tai | Schema hien tai | Gap/Issue | Priority |
|------------|-----------|-----------------|-----------|----------|
| Payment milestone | Frontend co PaymentMilestone voi journeyId, projectId, quotationId, round, percentage, amount, dueDate, status, paidAt, paidBy, receiptNote | Chua co schema PaymentMilestone; backend search Payment tra rong | Thieu entity chinh cho dashboard thanh toan va Step10Payment | High |
| Journey payment summary | Frontend Journey doc milestone_count, next_milestone_name, next_milestone_due, total_contract_value, collected_amount, outstanding_amount, last_payment_note | Backend Journey hien co portal_token, portal_publish_status, nhung chua thay cac field payment summary nay | Can bo sung field tong hop de giu aggregate Journey dong bo voi UI | High |
| Warranty card | Frontend co WarrantyCard ro rang trong v3.ts va mock data | Chua co schema WarrantyCard; backend search Warranty tra rong | Thieu entity cap the bao hanh / thong tin hau mai | High |
| Warranty reminder | Frontend co WarrantyReminder + mock data 1 mau | Chua co schema WarrantyReminder | Can schema nhe cho nhac lich bao hanh; tuy chua can workflow gui tin phuc tap | Medium |
| Aftersales incident | Frontend Step12Warranty doc mockIncidents voi type warranty / maintain, field title, reported_at, status, priority, assigned_to | Backend da co IncidentReport nhung dang nghieng thi cong; type chua co warranty / maintain, chua co assigned_to | Nen reuse IncidentReport va mo rong toi thieu thay vi tao schema moi | High |
| Portal thread | Frontend co PortalThread voi journey_id, context_type, context_label, status, last_message_at, unread_count | Chua co PortalThread; backend search Portal tra rong | Thieu entity quan ly hoi thoai portal | High |
| Portal message | Frontend co PortalMessage nested trong thread, field sender, sender_role, message_body, attachments, official_response, sent_at | Chua co PortalMessage | Can entity message doc lap de UI inbox/detail va communications center luu tru dung | High |
| Journey portal summary | Frontend Journey doc thread_count, unread_thread_count, latest_thread_context, latest_thread_status, portal_token | Backend Journey da co portal_token, nhung chua thay thread_count, unread_thread_count, latest_thread_context, latest_thread_status | Can bo sung summary field portal, khong can tao PortalPublication | High |
| Portal publication | Frontend timeline cong bo du lieu tu JourneyTemplate.steps.publish_flag + Journey.current_step_code | Chua co schema; cung khong co type/page mock cho entity doc lap | Khong nen tao schema luc nay | Low |
| Ledger / retention / acceptance | BA/plan cu de xuat nhieu schema tai chinh va nghiem thu | Frontend chua co bang chung du manh trong Group 06 | Defer de tranh schema suy doan | Low |

## PHAN 2: THIET KE CHI TIET THUOC TINH

### Thuoc tinh 1: PaymentMilestone
- name: PaymentMilestone
- label: Dot thanh toan
- Muc dich: luu lich thanh toan theo tung dot 50/40/10 cua hop dong/bao gia
- Thuoc tinh chinh:
  - journey_id: ObjectId -> Journey
  - journey_code: Text
  - project_id: ObjectId -> Project
  - project_name: Text
  - quotation_id: ObjectId -> Quotation
  - round: Number
  - percentage: Number
  - amount: Number
  - due_date: DateTime
  - status: Text + Dropdown = PENDING | PAID | OVERDUE
  - paid_at: DateTime
  - paid_by: AuthorizedUser
  - receipt_note: Text + TextArea
- form_group goi y:
  - Thong tin dot thanh toan
  - Xac nhan thu tien

### Thuoc tinh 2: Journey payment summary (update schema Journey)
- Can bo sung cac field:
  - milestone_count: Number
  - next_milestone_name: Text
  - next_milestone_due: DateTime
  - total_contract_value: Number
  - collected_amount: Number
  - outstanding_amount: Number
  - last_payment_note: Text + TextArea
- Muc dich: giu tab tong hop cua Journey dong bo voi dashboard va portal

### Thuoc tinh 3: WarrantyCard
- name: WarrantyCard
- label: The bao hanh
- Muc dich: luu the bao hanh sau khi cong trinh hoan thanh
- Thuoc tinh chinh:
  - code: Text, unique
  - journey_id: ObjectId -> Journey
  - journey_code: Text
  - project_id: ObjectId -> Project
  - project_name: Text
  - customer_name: Text
  - customer_phone: Text
  - address: Text + TextArea
  - construction_type: Text
  - area_m2: Number
  - completed_date: DateTime
  - warranty_months: Number
  - expiry_date: DateTime
  - materials: Tags
  - qr_code: Text
  - issued_at: DateTime
- form_group goi y:
  - Thong tin cong trinh
  - Thong tin bao hanh

### Thuoc tinh 4: WarrantyReminder
- name: WarrantyReminder
- label: Nhac bao hanh
- Muc dich: luu lich nhac bao hanh co ban, chua bao gom automation gui SMS/ZALO
- Thuoc tinh chinh:
  - warranty_card_id: ObjectId -> WarrantyCard
  - project_name: Text
  - customer_name: Text
  - customer_phone: Text
  - message: Text + TextArea
  - channel: Text + Dropdown = SMS | ZALO
  - scheduled_at: DateTime
  - sent_at: DateTime
  - status: Text + Dropdown = PENDING | SENT | FAILED

### Thuoc tinh 5: IncidentReport (update reuse)
- Schema update: IncidentReport
- Muc dich: dung chung cho su co thi cong va hau mai, tranh tao WarrantyCase / MaintenanceVisit qua som
- Can bo sung / dieu chinh:
  - mo rong type them warranty, maintain
  - bo sung assigned_to: Text
  - giu title, priority, status, journey_id, project_id da co
- Luu y:
  - status hien co dang nghieng backend-first OPEN | INVESTIGATING | RESOLVED, trong khi mock warranty dang lowercase. Day la diem can mapping khi implement, khong nen tao schema moi vi ly do nay.

### Thuoc tinh 6: PortalThread
- name: PortalThread
- label: Hoi thoai portal
- Muc dich: luu thread hoi dap theo tung journey/context
- Thuoc tinh chinh:
  - thread_code: Text, unique
  - journey_id: ObjectId -> Journey
  - context_type: Text + Dropdown = survey | progress | payment | general | quotation
  - context_label: Text
  - status: Text + Dropdown = open | waiting | closed
  - last_message_at: DateTime
  - unread_count: Number
- form_group goi y:
  - Thong tin thread

### Thuoc tinh 7: PortalMessage
- name: PortalMessage
- label: Tin nhan portal
- Muc dich: luu message doc lap cho inbox/detail va communications center
- Thuoc tinh chinh:
  - thread_id: ObjectId -> PortalThread
  - sender: Text
  - sender_role: Text + Dropdown = customer | pm | sale
  - message_body: Text + TextArea
  - attachments: FileUploads
  - official_response: Boolean
  - sent_at: DateTime

### Thuoc tinh 8: Journey portal summary (update schema Journey)
- Can bo sung cac field:
  - thread_count: Number
  - unread_thread_count: Number
  - latest_thread_context: Text
  - latest_thread_status: Text
- Khong tao PortalPublication
  - publish state hien da su dung portal_publish_status tren Journey
  - timeline cong bo du lieu suy ra tu JourneyTemplate.steps.publish_flag

## PHAN 3: FORM PREVIEW (ASCII Wireframe)

```text
┌─────────────────────────────────────────────────────────────┐
│  Group 06 - Finance / Warranty / Portal                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ PaymentMilestone ────────────────────────────────────┐ │
│  │  [Journey]        [chon hanh trinh..............]     │ │
│  │  [Project]        [chon du an...................]     │ │
│  │  [Round] [1]  [Percentage] [50]  [Amount] [.....]    │ │
│  │  [Due Date] [dd/mm/yyyy]    [Status] [Dropdown v]    │ │
│  │  [Paid By] [user............] [Paid At] [datetime]   │ │
│  │  [Receipt Note] [_______________________________]     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ WarrantyCard ────────────────────────────────────────┐ │
│  │  [Code] [BH-2026-001]   [Project] [chon du an....]    │ │
│  │  [Customer] [____________________] [Phone] [......]   │ │
│  │  [Address] [_____________________________________]    │ │
│  │  [Completed] [date] [Months] [24] [Expiry] [date]    │ │
│  │  [Materials] [#PU #Topcoat #Primer..............]     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ PortalThread / PortalMessage ────────────────────────┐ │
│  │  [Journey] [chon hanh trinh..............]            │ │
│  │  [Context Type] [payment v] [Status] [open v]         │ │
│  │  [Context Label] [Hoi ve dot thanh toan 1........]    │ │
│  │  ---------------------------------------------------   │ │
│  │  [Sender] [Khach hang] [Role] [customer v]            │ │
│  │  [Message Body] [_______________________________]      │ │
│  │  [Attachments] [upload...........................]     │ │
│  │  [Official Response] [toggle] [Sent At] [datetime]    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Ghi chu quyet dinh:                                        │
│  - Reuse IncidentReport cho warranty/maintain              │
│  - Khong tao PortalPublication trong wave nay              │
└─────────────────────────────────────────────────────────────┘
```
