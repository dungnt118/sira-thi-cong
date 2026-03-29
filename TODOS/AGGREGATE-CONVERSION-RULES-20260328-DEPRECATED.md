# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# AGGREGATE CONVERSION RULES - 2026-03-28

Muc dich
- Chot quy tac du lieu giua ServiceRequest, Journey va Project.
- Giam rui ro trung lap aggregate trong qua trinh phat trien.

## 1. Dinh nghia vai tro cua tung aggregate

### ServiceRequest
- Vai tro: intake aggregate.
- Pham vi: lead, thong tin lien he, pipeline, stage, snapshot nhu cau ban dau.
- Thoi diem ton tai: truoc khi nghiep vu duoc convert thanh Journey.

### Journey
- Vai tro: delivery aggregate trung tam.
- Pham vi: survey, quotation summary, execution, incidents, activities, portal, payment summary, document summary.
- Thoi diem ton tai: sau khi request da du dieu kien theo doi nghiep vu xuyen suot.

### Project
- Vai tro: downstream/legacy aggregate de phuc vu dieu phoi noi bo va tuong thich page cu.
- Pham vi: project code, plan dates, bridge toi contract/customer/journey context.
- Thoi diem ton tai: chi tao sau khi Journey da vao pha trien khai thuc te hoac can project code cho van hanh.

## 2. Trigger convert de xuat

### Rule A - ServiceRequest -> Journey
- Tao Journey khi ServiceRequest dat nguong `won` hoac khi PM xac nhan mo hanh trinh thuc thi.
- Khong tao Journey ngay luc tiep nhan lead.
- Sau khi tao Journey, ServiceRequest tro thanh source history/intake, khong con la aggregate delivery chinh.

### Rule B - Journey -> Project
- Tao Project khi Journey co ke hoach thi cong ro rang: co tentative_start_date hoac project_code duoc cap.
- Project khong duoc tro thanh noi luu checklist execution chinh trong wave hien tai.
- Project chi dong vai tro bridge cho planning va mot so page legacy.

## 3. Mapping field bat buoc

### Mapping ServiceRequest -> Journey
- ServiceRequest.code -> Journey.service_request_code
- ServiceRequest.customerName -> Journey.customer_name
- ServiceRequest.customerId -> Journey.customer_id hoac snapshot customer fields neu chua link
- ServiceRequest.name -> Journey.request_title
- ServiceRequest.notes -> Journey.request_description
- ServiceRequest.assignedPmId/assignedPmName -> Journey.owner_user_id / Journey.owner_user
- ServiceRequest.status/pipeline/stage -> chuyen thanh Journey.current_step_code, Journey.current_step, Journey.go_no_go_status theo business mapping

### Mapping Journey -> Project
- Journey.id -> Project co the luu nhu bridge reference downstream
- Journey.journey_code -> Project.code neu chua co quy tac code rieng
- Journey.customer_name -> Project.customer_name snapshot hoac customer bridge
- Journey.site_address -> Project.site_address
- Journey.owner_user_id -> Project.pm_user
- Journey.supervisor_name -> Project.supervisor_user snapshot/bridge
- Journey.tentative_start_date -> Project.planned_start_date
- Journey.plan_end hoac tentative_duration_days -> Project.planned_end_date
- Journey.project_status -> Project.status

## 4. Field ownership rules

### ServiceRequest own
- intake contact info
- pipeline/stage
- duplicate check
- lead notes

### Journey own
- survey data
- quotation/contract summary
- work_steps
- incidents
- activities
- payment summary
- portal summary
- document summary

### Project own
- planning projection cho page legacy
- downstream task planning neu co, nhung khong gianh ownership work_steps o wave hien tai

## 5. Anti-duplication rules
- Khong luu cung mot field nghiep vu la source of truth o ca 3 aggregate.
- Neu can hien thi nhanh, aggregate downstream chi luu snapshot display fields.
- Summary fields tren Journey phai duoc tinh tu aggregate con: PaymentMilestone, StockOrder, AssetAllocation, PortalThread, PortalDocument.
- Khong dua checklist execution ve ProjectTask cho den khi frontend roi khoi Journey.work_steps.

## 6. Status mapping rules
- PipelineSystemStage `WON` la 1 trigger hop le de mo Journey.
- Journey.project_status `active` la dieu kien manh de tao Project neu chua co.
- ServiceRequest van duoc giu de tra cuu lich su sau khi da co Journey, nhung UI delivery phai doc tu Journey.

## 7. API/workflow backlog tuong ung
- Tao service convert ServiceRequest sang Journey co idempotency.
- Tao service sync Journey sang Project cho cac field downstream.
- Tao quy tac refresh summary fields tren Journey.
- Tao mapping enum tu frontend legacy uppercase sang lowercase business values neu can.

## 8. Quyet dinh chot cho wave hien tai
- ServiceRequest la intake aggregate.
- Journey la source of truth chinh cho luong delivery.
- Project la downstream bridge aggregate, khong phai trung tam workflow.
