# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# BACKEND DELETE REFERENCE AUDIT - 2026-03-29

Muc dich
- Ghi lai ket qua ra soat tham chieu cho cac schema trong delete candidates.
- Chi ra schema nao truy cap duoc bang schema-get/schema-get_relationships, schema nao chi con xuat hien trong schema-list.
- Ho tro backend team quyet dinh thu tu xoa vat ly va xu ly anomaly metadata.

## 1. Nhom truy cap duoc va da doc duoc quan he

### ServiceRequestStageHistory
- Outbound refs: ServiceRequest, PipelineStage (from_stage_id, to_stage_id).
- Chua thay inbound ref nao trong dot audit nay.
- Co the xoa som sau khi xac nhan khong can timeline stage lich su.

### ServiceRequestInteractionLog
- Outbound refs: ServiceRequest, Role.
- Chua thay inbound ref nao trong dot audit nay.
- Co the xoa som sau khi xac nhan khong con form/query can nhat ky tuong tac rieng.

### EstimateLineItem
- Outbound refs: EstimateVersion, EstimateTemplate, PriceBookItem.
- Ham y thu tu xoa: xoa EstimateLineItem truoc EstimateVersion va PriceBookItem neu muon giam rang buoc du lieu.

## 2. Nhom xuat hien trong schema-list nhung schema-get hoac schema-get_relationships that bai
- ProjectTask
- WorkforceAssignment
- EstimateVersion
- PriceBook
- PriceBookItem
- GoNoGoReview
- ContractAppendix

Dien giai
- Cac schema nay van xuat hien trong snapshot schema-list 2026-03-29.
- Tuy nhien schema-get/schema-get_relationships tra ve loi 'Schema does not exist'.
- Can xem day la anomaly metadata hoac index cache truoc khi chay lenh xoa vat ly hang loat.

Huong xu ly goi y
- Dung schema-list de xac nhan ten collection hien tai.
- Truoc khi xoa vat ly, backend team nen kiem tra truc tiep trong SchemaDefinition collection hoac admin DB console.
- Nhom nay van la delete candidate hop ly ve mat kien truc, nhung can them buoc xac minh he thong.

## 3. Nhom hoan xoa
- Contract: truy cap duoc bang schema-get, van con menu hien thi, chi moi deprecated 2 field convenience.
- SurveySummary: van con xuat hien trong schema-list; khuyen nghi doi chieu usage nghiep vu truoc khi dua vao delete wave.

## 4. Nhom khong con ton tai trong snapshot van hanh
- StagePlaybook
- HandoffRule

Huong xu ly
- Khong can dua vao lenh delete backend neu he thong xac nhan da mat.
- Chi can don dep tai lieu, menu, script, layout neu con tham chieu ten schema cu.

## 5. Ket luan van hanh
- Delete wave vat ly gan nhat nen uu tien: ServiceRequestStageHistory, ServiceRequestInteractionLog, EstimateLineItem.
- Nhom ProjectTask / WorkforceAssignment / EstimateVersion / PriceBook / PriceBookItem / GoNoGoReview / ContractAppendix nen duoc xac minh truc tiep trong DB metadata truoc khi xoa vat ly.
- Khong nen dua Contract vao delete wave hien tai.
