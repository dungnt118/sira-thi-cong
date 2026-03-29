# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# WAVE-B-AUDIT-20260329

Muc dich
- Xac nhan sau Wave A con phu thuoc nao vao Contract/contract_id trong pham vi metadata MCP truy cap duoc.

## 1. Da ra soat
- Menu snapshot hien tai khong con route tro toi Contract, ProjectTask, GoNoGoReview, PriceBook, EstimateVersion, ContractAppendix.
- Schema snapshot hien tai khong con cac schema legacy tren trong danh muc runtime.
- Journey dump khong cho thay bang chung ro rang ve depended_schemas con tro truc tiep toi Contract hoac contract_id.
- Cac schema da kiem tra o Wave B: PaymentMilestone, ProjectSettlement, ProjectCloseoutPackage, PaymentReceipt, SalesInvoice, DebtConfirmation, DebtCollectionTask, Project.

## 2. Ket qua
- Chua phat hien menu-level dependency con sot.
- Chua phat hien trigger-script metadata trong cac dump schema da kiem tra.
- Dac diem con ton tai chu yeu la property contract_id da deprecated, van mang refSchemas lich su [Contract].
- journey_step_code con gia tri contract_signing la hop le theo canonical flow, KHONG xem la broken ref.

## 3. Danh gia
- Wave A da giai quyet phan metadata cap bach nhat.
- Wave B trong pham vi MCP hien tai KHONG mo ra them mot batch cleanup live bat buoc nao nua.
- Rá»§i ro con lai neu co se nam o lop ngoai schema metadata: report/dashboard tu viet, script backend, layout custom, query thu cong.

## 4. De xuat buoc tiep theo
1. Dong dot cleanup metadata hien tai.
2. Neu can sach tuyet doi, thuc hien mot dot backend-level review cho custom report/dashboard/script ngoai MCP.
3. Giu Journey.template_id va cac contract_id o trang thai deprecated cho den khi xac dinh chac chan khong can rollback lich su.
4. Cap nhat tai lieu tong hop de xem Wave A+B da hoan tat o muc metadata platform.
