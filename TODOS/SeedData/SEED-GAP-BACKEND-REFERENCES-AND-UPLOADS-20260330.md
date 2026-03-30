# Rà Soát GAP Nghiệp Vụ Cho Phase 2 Seed

## 1. Kết luận đã chốt
- `Journey` là runtime hub chính của BAC hiện tại.
- `CustomerJourneySetting` là nguồn chuẩn duy nhất cho step code và diễn tiến nghiệp vụ.
- `Project` là aggregate vận hành sau bán hàng.
- `Contract`, `ContractAppendix`, `ProjectTask` không phục hồi làm runtime schema.

## 2. Quy tắc seed nghiệp vụ đã chốt
- Không dựng giả `ObjectId` cho `Contract`, `ContractAppendix`, `ProjectTask`.
- Mọi record seed mới phải bám `Journey`, `Project`, `PaymentMilestone`, `HandoverAcceptance`, `WarrantyCase`, `PortalDocument` và các aggregate còn sống.
- Các field legacy còn tồn tại nhưng đã lệch kiến trúc phải để `null` có chủ đích.
- `PortalDocument` là nơi hợp lệ để thể hiện hồ sơ hợp đồng, phụ lục, biên bản và dossier số.

## 3. Cleanup residue legacy đã hoàn tất trên backend
- `PaymentAdjustment.contract_id` -> `deprecated`
- `PaymentAdjustment.contract_appendix_id` -> `deprecated`
- `HandoverIssue.contract_id` -> `deprecated`
- `SiteReport.project_task_id` -> `deprecated`
- `IncidentReport.project_task_id` -> `deprecated`
- `ActivityEvent.project_task_id` -> `deprecated`
- `ActivityEvent.related_entity_type = project_task` -> đã loại khỏi option active

## 4. Chuẩn hóa enum và label field đã hoàn tất trên backend

### 4.1 Enum đã chuyển về lowercase hoặc snake_case
- `IncidentReport.priority`
- `IncidentReport.status`
- `StockRequest.type`
- `StockRequest.status`
- `StockOrder.type`
- `StockOrder.status`
- `StockOrder.source`
- `StockOrder.discrepancy_status`
- `MaterialReceiptConfirmation.receipt_status`
- `WarrantyReminder.channel`
- `WarrantyReminder.status`

### 4.2 Label field đã chuyển sang tiếng Việt có dấu
- `IncidentReport`
- `ActivityEvent`
- `Distributor`
- `StockRequest`
- `StockOrder`

## 5. Phần còn lại sau wave chuẩn hóa này
- Không còn GAP nghiệp vụ kiểu “thiếu schema để seed”.
- Không còn GAP nghiệp vụ kiểu “phải phục hồi Contract/Appendix/ProjectTask mới seed được”.
- Phần còn lại chỉ là backlog metadata hiển thị:
  - `label` cấp schema root của một số schema business vẫn còn không dấu
  - ví dụ: `Project`, `ProjectAssignment`, `SiteReport`, `StockRequest`, `Distributor`, `WarrantyReminder`, `PaymentMilestone`, `PortalDocument`

## 6. Đánh giá ảnh hưởng tới Phase 2
- Phase 2 hiện không còn bị chặn bởi GAP nghiệp vụ backend references.
- Khi quay lại import seed:
  - dùng enum canonical mới đã chuẩn hóa ở backend
  - không dùng lại value uppercase legacy cho các field đã sửa
  - tiếp tục để `null` cho các field legacy đã deprecated
  - `PortalDocument.files` vẫn có thể để `null` theo rule đã chốt

## 7. Kết luận cuối
- Nhóm GAP nghiệp vụ liên quan `Contract`, `ContractAppendix`, `ProjectTask` xem như đã đóng.
- Backlog còn lại chỉ là làm sạch đẹp phần `label` cấp schema gốc, không làm thay đổi logic seed.
- Có thể chuyển sang chuẩn bị lại batch Phase 2 dựa trên schema truth hiện tại.
