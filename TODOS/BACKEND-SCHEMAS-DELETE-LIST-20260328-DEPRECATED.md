# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# BACKEND SCHEMAS DELETE LIST - 2026-03-28

Muc dich
- File doc lap chi de liet ke cac schema business nen xoa tren backend.
- Danh sach nay da duoc doi chieu lai theo codebase-first sau re-audit Groups 01-04.
- Khong bao gom core/system schema.

## 1. Danh sach schema nen xoa backend

### Group 02
- ServiceRequestStageHistory
- ServiceRequestInteractionLog
- SurveySummary

### Group 03
- ProjectTask
- StagePlaybook
- HandoffRule
- WorkforceAssignment
- EstimateVersion
- EstimateLineItem
- PriceBook
- PriceBookItem
- GoNoGoReview
- Contract
- ContractAppendix

## 2. Ly do xoa chung
- Khong co type/page/mock data thuc te trong codebase hien tai.
- La cac schema duoc model hoa theo BA truoc frontend, khong phai gap dang duoc UI su dung.
- Neu giu lai se gay nhieu tang su that va lam lech huong Journey-first / request-first hien tai.

## 3. Thu tu xoa goi y
1. ServiceRequestStageHistory
2. ServiceRequestInteractionLog
3. SurveySummary
4. HandoffRule
5. StagePlaybook
6. WorkforceAssignment
7. ProjectTask
8. ContractAppendix
9. Contract
10. GoNoGoReview
11. EstimateLineItem
12. EstimateVersion
13. PriceBookItem
14. PriceBook

## 4. Luu y truoc khi xoa
- Kiem tra tenant khong co du lieu nghiep vu can giu lai trong cac schema tren.
- Kiem tra khong co job, script, form, workflow hoac query backend dang tham chieu den chung.
- Sau khi xoa nen dong bo lai tai lieu cleanup va cac ghi chu van hanh neu he thong co dashboard noi bo tham chieu schema.

## 5. Schema khong nam trong delete list
- Project duoc tam giu lai vi con gia tri bridge va legacy aggregate.
- Quotation, Journey, ChecklistTemplate, IncidentReport, ActivityEvent, SiteReport la cac schema phai bao ve.

## 6. Delta 2026-03-29
- File nay duoc supersede boi BACKEND-DELETE-CANDIDATES-20260329.md khi can thao tac xoa vat ly theo trang thai cleanup moi nhat.
