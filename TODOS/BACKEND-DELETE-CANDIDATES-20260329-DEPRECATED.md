# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# BACKEND DELETE CANDIDATES - 2026-03-29

Muc dich
- Chot lai danh sach schema business can xu ly xoa vat ly sau dot cleanup metadata va menu ngay 2026-03-29.
- Tach ro 3 nhom: (1) xoa vat ly uu tien cao, (2) hoan xoa, (3) khong con ton tai tren backend snapshot.
- File nay uu tien cao hon delete-list 2026-03-28 khi co mau thuan.

## 1. Xoa vat ly uu tien cao (schema ton tai, da duoc an menu hoac khong con nen xuat hien trong UI)
- ServiceRequestStageHistory
- ServiceRequestInteractionLog
- ProjectTask
- WorkforceAssignment
- EstimateVersion
- EstimateLineItem
- PriceBook
- PriceBookItem
- GoNoGoReview
- ContractAppendix

Ly do
- Van ton tai tren backend snapshot hien tai.
- Nhom menu schema legacy da duoc hide an toan tren UI cho: ProjectTask, WorkforceAssignment, EstimateVersion, PriceBook, PriceBookItem, GoNoGoReview, ContractAppendix.
- Khong nam trong huong runtime Journey-first toi uu hien tai.

## 2. Hoan xoa / chua dua vao dot delete vat ly ngay
- Contract
- SurveySummary

Ly do
- Contract van con menu hien thi va van co vai tro nghiep vu, du da deprecated 2 field convenience latest_project_settlement_id va latest_closeout_package_id.
- SurveySummary van ton tai trong backend snapshot va da tung duoc bo sung field o cac batch truoc; can doi chieu them usage thuc te truoc khi dua vao delete wave.

## 3. Khong con ton tai tren backend snapshot hien tai
- StagePlaybook
- HandoffRule

Huong xu ly
- Khong lap lai trong delete command backend.
- Chi can xoa tham chieu tai lieu cu neu con nhac den nhu mot schema dang ton tai.

## 4. Metadata cleanup da hoan thanh truoc khi xoa vat ly
- Journey.template_id: deprecated
- Journey.work_steps.step_id: deprecated
- Journey.work_steps.template_step_id: deprecated
- Journey.work_steps: deprecated
- Journey.current_step: da canonical hoa thanh Dropdown 13 step codes
- Contract.latest_project_settlement_id: deprecated
- Contract.latest_closeout_package_id: deprecated

## 5. Menu cleanup da hoan thanh truoc khi xoa vat ly
- ContractAppendix: hidden
- GoNoGoReview: hidden
- PriceBook: hidden
- PriceBookItem: hidden
- EstimateVersion: hidden
- ProjectTask: hidden
- WorkforceAssignment: hidden

## 6. Thu tu xoa goi y
1. ServiceRequestStageHistory
2. ServiceRequestInteractionLog
3. ContractAppendix
4. GoNoGoReview
5. EstimateLineItem
6. EstimateVersion
7. PriceBookItem
8. PriceBook
9. WorkforceAssignment
10. ProjectTask

## 7. Kiem tra bat buoc truoc khi xoa vat ly
- Kiem tra record count trong tung schema.
- Kiem tra layout, workflow, script, report, query backend neu con tham chieu ten schema.
- Kiem tra menu da hide va khong con nhu cau rollback UI nhanh.
- Chup snapshot export du lieu neu can rollback.
- Xem them BACKEND-DELETE-REFERENCE-AUDIT-20260329.md de biet nhom schema nao dang co anomaly giua schema-list va schema-get/schema-get_relationships.
