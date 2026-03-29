# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# POST CLEANUP SYSTEM AUDIT - 2026-03-29

Muc dich
- Xac nhan trang thai he thong sau khi da xoa cac schema de xuat bang cong cu backend.
- Tach ro giua: (1) cleanup da hoan tat, (2) broken references con sot, (3) buoc hoan thien tiep theo.

## 1. Xac nhan sau cleanup
- Khong con thay Contract, ProjectTask, GoNoGoReview, PriceBook, EstimateVersion, ContractAppendix trong schema-list snapshot hien tai.
- Khong con thay menu route tro truc tiep toi Contract, ProjectTask, GoNoGoReview, PriceBook, EstimateVersion, ContractAppendix trong menu snapshot hien tai.
- Journey.current_step da duoc canonical hoa thanh Dropdown 13 step codes.
- Journey.template_id va Journey.work_steps da duoc deprecated tu truoc.

## 2. Broken references con sot tren cac schema con song

Nhan dinh
- Lop menu da sach hon, nhung lop metadata van con target toi schema da bi xoa.
- Day la cong viec wave hoan thien he thong, khong phai wave delete tiep.

## 3. De xuat thu tu hoan thien
1. Deprecate toan bo cac property contract_id con sot tren cac aggregate con song neu doanh nghiep da chot bo Contract khoi kien truc runtime.
2. Giu project_id va journey_id lam lien ket chinh thay cho contract_id trong reporting va related tabs.
3. Deprecate sau do moi xem xet xoa vat ly cac property contract_id neu frontend va report da duoc cap nhat.
4. Giu Journey.template_id o trang thai deprecated; neu co the thi doi refSchemas hoac xoa vat ly o dot cleanup metadata sau.
5. Ra soat trigger, view, report nao con tinh toan theo contract_id de doi sang project_id / journey_id.

## 4. Muc do uu tien
- Uu tien cao: Project.contract_id, PaymentMilestone.contract_id, ProjectSettlement.contract_id, ProjectCloseoutPackage.contract_id.
- Uu tien trung binh: PaymentReceipt.contract_id, SalesInvoice.contract_id, DebtConfirmation.contract_id, DebtCollectionTask.contract_id, HandoverAcceptance.contract_id.
- Uu tien cao nhung an toan co the de sau: Journey.template_id vi da deprecated san.

## 5. Buoc lam tiep theo de dong he thong
- Wave A: cleanup metadata cho broken refs.
- Wave B: ra soat related tabs, trigger, report, dashboard neu con doc contract_id.
- Wave C: toi uu tai lieu cleanup, dong bo file delete-list cu va file overview de tranh mau thuan lich su.

## 2B. Chi tiet broken references da xac nhan
- Journey.template_id to JourneyTemplate
- Project.contract_id to Contract
- PaymentMilestone.contract_id to Contract
- PaymentReceipt.contract_id to Contract
- SalesInvoice.contract_id to Contract
- DebtConfirmation.contract_id to Contract
- DebtCollectionTask.contract_id to Contract
- HandoverAcceptance.contract_id to Contract
- ProjectSettlement.contract_id to Contract
- ProjectCloseoutPackage.contract_id to Contract

## 6. Delta Wave A complete
- Da deprecated contract_id tren cac schema: Project, PaymentMilestone, PaymentReceipt, SalesInvoice, DebtConfirmation, DebtCollectionTask, HandoverAcceptance, ProjectSettlement, ProjectCloseoutPackage.
- Verification da xac nhan contract_id.isDeprecated=true tren cac schema mau: Project, PaymentReceipt, HandoverAcceptance, ProjectCloseoutPackage.
- Trang thai hien tai: broken references toi Contract da duoc khoa o muc metadata, nhung refSchemas van con lich su va can xem xet cleanup sau neu muon dat trang thai sach hoan toan.
- Buoc tiep theo hop ly: Wave B, ra soat related tabs, trigger, report, dashboard con doc contract_id.

## 7. Delta Wave B complete
- Da ra soat menu snapshot va schema snapshot sau cleanup: khong con route/menu tro toi Contract va nhom schema legacy da xoa.
- Khong thay bang chung ro rang ve depended_schemas con tro truc tiep toi Contract/contract_id trong dump metadata Journey da kiem tra.
- Khong thay trigger-script metadata trong cac dump schema Wave B da ra soat.
- Ket luan tam thoi: o muc metadata platform ma MCP truy cap duoc, dot cleanup co the xem la da dong; phan rui ro con lai nam o lop custom report/dashboard/script ngoai pham vi metadata schema/menu.
