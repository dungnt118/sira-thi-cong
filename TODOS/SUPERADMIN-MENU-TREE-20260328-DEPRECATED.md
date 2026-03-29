# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# SUPERADMIN MENU TREE - 2026-03-28

Muc dich
- Xay dung cay menu day du nhat cho superadmin dua tren schema backend va menu MCP hien co.
- Uu tien menu hoa cac schema dang duoc giu lai; khong dua schema nam trong delete list vao tree.
- Menu item dang theo convention path schema: /apps/anydata/list/{Schema}.

## 1. Trang thai menu hien tai da chinh lai
- Root priority da duoc cap nhat: Quan tri -> HRM -> CRM.
- Menu dang ton tai:
  - Quan tri / Tai khoan
  - HRM / Phong ban-nhan su
  - CRM / Khach hang

## 2. Cay menu superadmin de xuat

```text
1. Quan tri
   1.1 Tai khoan
   1.2 Vai tro
   1.3 Loai vai tro
   1.4 Quyen thao tac
   1.5 Nhom danh muc
   1.6 Gia tri danh muc

2. HRM
   2.1 Phong ban / nhan su
   2.2 Phong ban
   2.3 Vi tri
   2.4 Nhan vien

3. CRM & Sale
   3.1 Khach hang
   3.2 Yeu cau dich vu
   3.3 Quy trinh ban hang
   3.4 Giai doan pipeline
   3.5 Bao gia

4. Hanh trinh & Trien khai
   4.1 Hanh trinh
   4.2 Mau hanh trinh
   4.3 Bien ban khao sat
   4.4 Mau checklist
   4.5 Du an
   4.6 Bao cao hien truong
   4.7 Su co thi cong
   4.8 Nhat ky hoat dong

5. Kho & Tai san
   5.1 Dinh muc vat tu
   5.2 Nha phan phoi
   5.3 Yeu cau kho
   5.4 Phieu kho
   5.5 Xac nhan nhan hang
   5.6 Cap phat tai san

6. Tai chinh & Hau mai
   6.1 Dot thanh toan
   6.2 The bao hanh
   6.3 Nhac bao hanh

7. Portal & Tai lieu
   7.1 Hoi thoai portal
   7.2 Tin nhan portal
   7.3 Tai lieu portal

8. Bao cao & In an
   8.1 Mau in
   8.2 Dashboard bao cao
   8.3 Panel bao cao
```

## 3. Mapping menu -> schema/path

| Nhom menu | Tieu de menu | Kieu | Schema/Path | Trang thai |
|---|---|---|---|---|
| Quan tri | Tai khoan | Custom | /apps/authorized-users | Da co |
| Quan tri | Vai tro | Schema | /apps/anydata/list/Role | Nen tao menu |
| Quan tri | Loai vai tro | Schema | /apps/anydata/list/RoleType | Nen tao menu |
| Quan tri | Quyen thao tac | Schema | /apps/anydata/list/PermissionDefinition | Nen tao menu |
| Quan tri | Nhom danh muc | Schema | /apps/anydata/list/MasterDataCategory | Nen tao menu |
| Quan tri | Gia tri danh muc | Schema | /apps/anydata/list/MasterDataItem | Nen tao menu |
| HRM | Phong ban / nhan su | Custom | /apps/org-membership | Da co |
| HRM | Phong ban | Schema | /apps/anydata/list/Department | Nen tao menu neu schema page san co |
| HRM | Vi tri | Schema | /apps/anydata/list/Position | Nen tao menu neu schema page san co |
| HRM | Nhan vien | Schema | /apps/anydata/list/Employee | Nen tao menu neu schema page san co |
| CRM & Sale | Khach hang | Schema | /apps/anydata/list/Customer | Da co |
| CRM & Sale | Yeu cau dich vu | Schema | /apps/anydata/list/ServiceRequest | Nen tao menu |
| CRM & Sale | Quy trinh ban hang | Schema | /apps/anydata/list/SalesPipeline | Nen tao menu |
| CRM & Sale | Giai doan pipeline | Schema | /apps/anydata/list/PipelineStage | Nen tao menu |
| CRM & Sale | Bao gia | Schema | /apps/anydata/list/Quotation | Nen tao menu |
| Hanh trinh & Trien khai | Hanh trinh | Schema | /apps/anydata/list/Journey | Nen tao menu |
| Hanh trinh & Trien khai | Mau hanh trinh | Schema | /apps/anydata/list/JourneyTemplate | Nen tao menu |
| Hanh trinh & Trien khai | Bien ban khao sat | Schema | /apps/anydata/list/SurveyRecord | Nen tao menu |
| Hanh trinh & Trien khai | Mau checklist | Schema | /apps/anydata/list/ChecklistTemplate | Nen tao menu |
| Hanh trinh & Trien khai | Du an | Schema | /apps/anydata/list/Project | Nen tao menu |
| Hanh trinh & Trien khai | Bao cao hien truong | Schema | /apps/anydata/list/SiteReport | Nen tao menu |
| Hanh trinh & Trien khai | Su co thi cong | Schema | /apps/anydata/list/IncidentReport | Nen tao menu |
| Hanh trinh & Trien khai | Nhat ky hoat dong | Schema | /apps/anydata/list/ActivityEvent | Nen tao menu |
| Kho & Tai san | Dinh muc vat tu | Schema | /apps/anydata/list/MaterialStandard | Nen tao menu |
| Kho & Tai san | Nha phan phoi | Schema | /apps/anydata/list/Distributor | Nen tao menu |
| Kho & Tai san | Yeu cau kho | Schema | /apps/anydata/list/StockRequest | Nen tao menu |
| Kho & Tai san | Phieu kho | Schema | /apps/anydata/list/StockOrder | Nen tao menu |
| Kho & Tai san | Xac nhan nhan hang | Schema | /apps/anydata/list/MaterialReceiptConfirmation | Nen tao menu |
| Kho & Tai san | Cap phat tai san | Schema | /apps/anydata/list/AssetAllocation | Nen tao menu |
| Tai chinh & Hau mai | Dot thanh toan | Schema | /apps/anydata/list/PaymentMilestone | Nen tao menu |
| Tai chinh & Hau mai | The bao hanh | Schema | /apps/anydata/list/WarrantyCard | Nen tao menu |
| Tai chinh & Hau mai | Nhac bao hanh | Schema | /apps/anydata/list/WarrantyReminder | Nen tao menu |
| Portal & Tai lieu | Hoi thoai portal | Schema | /apps/anydata/list/PortalThread | Nen tao menu |
| Portal & Tai lieu | Tin nhan portal | Schema | /apps/anydata/list/PortalMessage | Nen tao menu |
| Portal & Tai lieu | Tai lieu portal | Schema | /apps/anydata/list/PortalDocument | Nen tao menu |
| Bao cao & In an | Mau in | Schema | /apps/anydata/list/PrintTemplate | Nen tao menu |
| Bao cao & In an | Dashboard bao cao | Schema | /apps/anydata/list/ReportDashboard | Nen tao menu |
| Bao cao & In an | Panel bao cao | Schema | /apps/anydata/list/ReportPanel | Nen tao menu |

## 4. Nguyen tac khong dua vao menu superadmin
- Khong dua cac schema nam trong BACKEND-SCHEMAS-DELETE-LIST-20260328.md vao menu.
- Khong dua backlog BA chua du bang chung codebase vao menu.
- Khong dua ProjectTask-first execution menus trong wave hien tai.

## 5. Thu tu tao menu goi y
1. Quan tri
2. HRM
3. CRM & Sale
4. Hanh trinh & Trien khai
5. Kho & Tai san
6. Tai chinh & Hau mai
7. Portal & Tai lieu
8. Bao cao & In an

## 6. Ghi chu MCP
- Bo MCP hien tai da ho tro xem menu va doi priority/hierarchy, nhung chua co tool tao moi menu item.
- Vi vay file nay la blueprint chuan de tao menu hang loat bang backend console hoac cong cu menu create khac.
