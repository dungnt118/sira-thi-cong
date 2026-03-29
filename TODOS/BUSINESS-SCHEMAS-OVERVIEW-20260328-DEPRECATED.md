# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# BUSINESS SCHEMAS OVERVIEW - 2026-03-28

Muc dich
- Tong quan lai toan bo cac schema business da thiet ke va dang nen giu sau 7 nhom.
- Nhan dien cac gap tiem an de giai quyet ky trong qua trinh phat trien tiep theo.

## 1. Nhom schema dang giu lai

### Group 01 - Foundation
- MasterDataCategory
- MasterDataItem

### Group 02 - CRM and Sales
- Customer
- ServiceRequest
- SurveyRecord
- Quotation

### Group 03-04 - Delivery Core
- Project
- Journey
- ChecklistTemplate
- IncidentReport
- ActivityEvent
- SiteReport

### Group 05 - Inventory and Assets
- MaterialStandard
- Distributor
- StockRequest
- StockOrder
- MaterialReceiptConfirmation
- AssetAllocation

### Group 06 - Finance, Warranty, Portal
- PaymentMilestone
- WarrantyCard
- WarrantyReminder
- PortalThread
- PortalMessage

### Group 07 - Portal Documents and Reporting Reuse
- PortalDocument
- Reuse PrintTemplate
- Reuse ReportDashboard
- Reuse ReportPanel

## 2. Tong ket kien truc hien tai
- Journey la aggregate trung tam cua luong delivery va portal.
- ServiceRequest la diem vao request-first cua CRM truoc khi convert sang Journey.
- Project duoc giu lai nhu bridge/legacy aggregate, chua phai nguon su that chinh.
- ChecklistTemplate, IncidentReport, ActivityEvent va SiteReport la bo schema support cho delivery flow hien tai.
- Journey dang gan nhieu summary field cho inventory, finance va portal; can quan tri dong bo du lieu can than.

## 3. Gap tiem an can giai quyet ky

### Gap A - Dual model ServiceRequest / Journey / Project
- Hien co ba lop aggregate ke nhau.
- Chua co quy tac chinh thuc cho diem convert: ServiceRequest -> Journey -> Project.
- Rủi ro: du lieu trung lap customer, address, owner, progress, quotation link.
- Goi y: dinh nghia ro event convert va field owner cua tung giai doan.

### Gap B - Summary fields tren Journey
- Journey dang gom payment summary, inventory summary, portal summary va document summary.
- Rủi ro: summary bi lech neu khong co workflow dong bo khi PaymentMilestone, StockOrder, AssetAllocation, PortalThread, PortalDocument thay doi.
- Goi y: uu tien service sync hoac trigger quy uoc cho cac field summary.

### Gap C - Enum va status naming
- Frontend co cho dung lowercase, co cho dung uppercase.
- IncidentReport, PaymentMilestone, Quotation, Journey work_steps dang co kha nang lech enum.
- Goi y: chot 1 convention duy nhat va mapping adapter neu can.

### Gap D - AuthorizedUser va free text
- Nhieu schema dang luu xen ke AuthorizedUser va truong ten text nhu supervisor_name, assigned_to, surveyor_name.
- Rủi ro: khong dong bo khi doi user display name.
- Goi y: schema moi nen uu tien id user + truong display snapshot chi de hien thi.

### Gap E - Master data chua duoc seed
- MasterDataCategory va MasterDataItem da co schema nhung chua la nguon enum that su cua toan bo frontend.
- Rủi ro: UI tiep tuc hardcode source_channel, priority, communication channel.
- Goi y: lap 1 dot seed master data va thay dropdown hardcode bang lookup master data.

### Gap F - Quotation va pricing chua khop san pham hoa
- Quotation dang duoc giu lai vi code co dung, nhung pricing engine da bi loai bo.
- Rủi ro: sau nay can bao gia chi tiet se thieu line-item normalization va mapping cost to price.
- Goi y: tam thoi giu embedded items; chi quay lai PriceBook va Estimate stack khi co UI that.

### Gap G - Project la bridge aggregate
- Project ton tai de phuc vu legacy va cac page cu, nhung codebase hien tai van nghieng Journey-first.
- Rủi ro: doi duong huong nua vung, vua Journey-first vua Project-first.
- Goi y: chot ro Project chi la downstream aggregate, khong dua checklist execution ve ProjectTask luc nay.

### Gap H - Embedded signatures
- Chu ky dang duoc luu embedded tren SurveyRecord va nested process data.
- Rủi ro: kho versioning va kho doi soat neu can e-sign chinh thuc.
- Goi y: giu pattern embedded trong wave hien tai; chi tach signature engine khi co use case phap ly ro rang.

## 4. Uu tien phat trien tiep theo
1. Chot quy tac convert ServiceRequest, Journey, Project.
2. Chot convention enum va key field chung.
3. Bo sung co che dong bo summary cho Journey.
4. Seed MasterDataCategory va MasterDataItem theo cac enum dang hardcode.
5. Chi tao them schema moi khi codebase da co type, page, mock data hoac workflow ro rang.

## 5. Ket luan
- Bo schema hien tai da du de phuc vu wave demo va phat trien tiep theo neu giu ky luat codebase-first.
- Rui ro lon nhat hien nay khong phai thieu schema, ma la lech aggregate va lech quy tac dong bo giua cac schema dang ton tai.

## 6. Tai lieu lien quan
- MASTER-DATA-SEED-PLAN-20260328.md: ke hoach seed cac category/item de giam hardcode frontend.
- AGGREGATE-CONVERSION-RULES-20260328.md: quy tac convert va ownership giua ServiceRequest, Journey, Project.
