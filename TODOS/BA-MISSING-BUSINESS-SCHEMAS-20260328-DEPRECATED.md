# DEPRECATED FILE

Xem file hien tai: SYSTEM-CLEANUP-CLOSURE-20260329.md

# BA MISSING BUSINESS SCHEMAS - 2026-03-28

Muc dich
- Liet ke rieng cac schema nghiep vu co the can den theo BA docs nhung codebase hien tai chua co nghiep vu du manh de tao.
- File nay khong phai danh sach can tao ngay. Day la backlog schema theo BA de theo doi.

## 1. Nhom CRM co the can khi mo rong nghiep vu
- CustomerContact
- CustomerAddress
- SurveyAppointment
- Ly do: se can neu CRM chuyen tu contact don sang nhieu dau moi lien he va lich hen khao sat chinh thuc.

## 2. Nhom pricing va preconstruction co the can khi san pham hoa quy trinh
- QuotationMappingRule
- QuotationLineItem
- ProjectAssignment
- Ly do: can khi can pricing engine ro rang, mapping gia von sang gia ban va staffing theo vai tro du an.

## 3. Nhom execution co the can khi roi khoi Journey-first
- TaskChecklist
- TaskChecklistStep
- EvidenceRecord
- EvidenceReview
- AcceptanceDraft
- AcceptanceRecord
- Ly do: chi can khi frontend bo nested Journey.work_steps va chuyen sang execution aggregate doc lap.

## 4. Nhom inventory procurement nang cao theo BA
- Warehouse
- PurchaseRequest
- StockReservation
- RemainderLot
- RemainderRecovery
- Ly do: codebase hien tai chua co flow kho tong, dat mua, giu cho ton kho, vat tu du hoan nhap.

## 5. Nhom finance va aftersales nang cao theo BA
- PaymentTransaction
- ReceivableLedger
- PayableLedger
- ProjectCostEntry
- CashBookEntry
- RetentionEntry
- MaintenanceVisit
- AftersalesCost
- AftersalesBilling
- Ly do: chi can khi he thong di vao doi soat ke toan, cong no, chi phi hau mai va visit bao tri thuc su.

## 6. Nhom document, signature va reporting nang cao theo BA
- DocumentTemplate
- TemplateVersion
- DocumentRecord
- DocumentAttachment
- SignatureEnvelope
- SignatureParticipant
- SignatureEvent
- DossierChecklist
- PublishedLink
- SyncFailureLog
- ReportSnapshot
- KpiDefinition
- KpiSnapshot
- Ly do: chi can khi he thong can document lifecycle, ky so co phap ly, dossier management va KPI persisted snapshot.

## 7. Cach dung file nay
- Neu mot schema trong danh sach nay bat dau co type, page, mock data, local-storage flow hoac workflow backend ro rang thi moi dua vao vong phan tich schema tiep theo.
- Neu BA tiep tuc nhac lai nhung codebase van khong co bang chung thi giu no o backlog, khong tao backend som.

## 8. Danh gia tong quat
- Phan lon schema con thieu theo BA la schema nang cap cho giai doan productization sau.
- Hien tai he thong gap lon hon o chuan hoa aggregate dang co, khong phai o viec mo rong them schema moi.
